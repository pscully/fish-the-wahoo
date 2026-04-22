/**
 * WordPress blog scraper — public HTML version.
 *
 * The WP REST API at fishthewahoo.com is locked down (401 to anonymous requests),
 * so this script walks /post-sitemap.xml, fetches each post's public HTML, and
 * extracts the body, title, date, and featured image.
 *
 * Usage:
 *   npx tsx scripts/import-wp-scrape.ts
 *
 * Outputs:
 *   content/blog/{slug}.md        — markdown + frontmatter per post
 *   public/blog-images/{file}     — downloaded featured images
 *   src/data/redirects-wp-gen.ts  — date-slug posts that route to /daily-catch
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import TurndownService from 'turndown';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SITE = 'https://fishthewahoo.com';
const SITEMAP_URL = `${SITE}/post-sitemap.xml`;
const OUT_BLOG = path.resolve('content/blog');
const OUT_IMAGES = path.resolve('public/blog-images');
const OUT_REDIRECTS = path.resolve('src/data/redirects-wp-gen.ts');

// Slugs that are numeric/date fragments — these become /daily-catch redirects.
const DATE_SLUG_RE = /^\d{1,8}(-\d+)*$|^\d{1,2}-\d{1,2}-\d{2,4}$/;
const DATE_KEYWORD_RE = /(july|august|september|october|november|december|january|february|march|april|may|june).*\b(inshore|deep-sea|harbor|fishing|report|catch)\b/i;

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

const UA = { 'User-Agent': 'FTW-BlogImporter/1.0 (+fishthewahoo.com migration)' };

function fetchText(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib
      .get(url, { headers: UA }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          fetchText(new URL(res.headers.location!, url).toString())
            .then(resolve)
            .catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString()));
      })
      .on('error', reject);
  });
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    lib
      .get(url, { headers: UA }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          file.close();
          fs.unlinkSync(dest);
          downloadFile(new URL(res.headers.location!, url).toString(), dest)
            .then(resolve)
            .catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve()));
      })
      .on('error', (e) => {
        fs.unlink(dest, () => {});
        reject(e);
      });
  });
}

// ---------------------------------------------------------------------------
// HTML parsing
// ---------------------------------------------------------------------------

function extractMeta(html: string, property: string): string | null {
  const re = new RegExp(
    `<meta\\s+property="${property}"\\s+content="([^"]*)"`,
    'i',
  );
  const m = re.exec(html);
  return m ? m[1] : null;
}

/**
 * Grab the post body: <article ...><div class="entry-content">...</div></article>
 * If entry-content isn't found, fall back to the whole article body.
 */
function extractArticleBody(html: string): string | null {
  const artStart = /<article[^>]*id="post-\d+"[^>]*>/i.exec(html);
  if (!artStart) return null;
  const bodyStart = artStart.index + artStart[0].length;
  const artEnd = html.indexOf('</article>', bodyStart);
  if (artEnd < 0) return null;
  const article = html.slice(bodyStart, artEnd);

  const ec = /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>/i.exec(article);
  if (!ec) return article;

  // walk balanced div tags starting at ec.end() to find matching close
  let depth = 1;
  let i = ec.index + ec[0].length;
  while (i < article.length && depth > 0) {
    const open = article.indexOf('<div', i);
    const close = article.indexOf('</div>', i);
    if (close < 0) break;
    if (open >= 0 && open < close) {
      depth++;
      i = open + 4;
    } else {
      depth--;
      if (depth === 0) return article.slice(ec.index + ec[0].length, close);
      i = close + 6;
    }
  }
  return article.slice(ec.index + ec[0].length);
}

/**
 * Resolve lazy-loaded images: if an <img> has data-lazy-src or there's a
 * <noscript><img ...></noscript> nearby, promote the real src.
 */
function unwrapLazyImages(html: string): string {
  // Replace lazy-loaded images with their real src from data-lazy-src.
  let out = html.replace(
    /<img\b([^>]*?)\sdata-lazy-src="([^"]+)"([^>]*?)>/gi,
    (_m, before, lazy, after) => {
      // strip any existing src / srcset / data-* attrs to avoid duplicates
      const cleanBefore = before
        .replace(/\ssrc="[^"]*"/gi, '')
        .replace(/\ssrcset="[^"]*"/gi, '')
        .replace(/\sdata-lazy-srcset="[^"]*"/gi, '')
        .replace(/\sdata-lazy-sizes="[^"]*"/gi, '');
      const cleanAfter = after
        .replace(/\ssrc="[^"]*"/gi, '')
        .replace(/\ssrcset="[^"]*"/gi, '')
        .replace(/\sdata-lazy-srcset="[^"]*"/gi, '')
        .replace(/\sdata-lazy-sizes="[^"]*"/gi, '');
      return `<img${cleanBefore} src="${lazy}"${cleanAfter}>`;
    },
  );
  // Remove <noscript>...</noscript> entirely — we've already got the src.
  out = out.replace(/<noscript>[\s\S]*?<\/noscript>/gi, '');
  return out;
}

function normalizeToCanonical(url: string): string {
  // Old Flywheel staging domain → canonical site.
  return url.replace(/^https?:\/\/small-volcano\.flywheelsites\.com/i, 'https://fishthewahoo.com');
}

async function downloadAndRewriteImages(html: string): Promise<string> {
  const imgTagRe =
    /<img\b([^>]*?)\ssrc="([^"]+?\/wp-content\/uploads\/[^"]+)"([^>]*?)>/gi;
  const matches: Array<{ full: string; before: string; url: string; after: string }> = [];
  for (const m of html.matchAll(imgTagRe)) {
    matches.push({ full: m[0], before: m[1], url: m[2], after: m[3] });
  }

  for (const { full, before, url, after } of matches) {
    const canonical = normalizeToCanonical(url);
    let filename: string;
    try {
      filename = path.basename(new URL(canonical).pathname);
    } catch {
      continue;
    }
    const dest = path.join(OUT_IMAGES, filename);
    if (!fs.existsSync(dest)) {
      try {
        await downloadFile(canonical, dest);
      } catch {
        // leave the original tag in place if download fails
        continue;
      }
    }
    html = html.replace(full, `<img${before} src="/blog-images/${filename}"${after}>`);
  }

  return html;
}

function rewriteHrefs(html: string): string {
  // Staging domain links → canonical domain
  let out = html.replace(
    /href="https?:\/\/small-volcano\.flywheelsites\.com([^"]*)"/gi,
    'href="https://fishthewahoo.com$1"',
  );
  // Canonical site links → local SPA paths (rely on redirects.ts for WP slugs)
  out = out.replace(/href="https?:\/\/fishthewahoo\.com([^"]*)"/gi, 'href="$1"');
  // Strip WP upload URLs inside links (rare)
  return out;
}

async function cleanBodyHtml(html: string): Promise<string> {
  let out = unwrapLazyImages(html);
  // Strip WP shortcodes
  out = out.replace(/\[caption[^\]]*\][\s\S]*?\[\/caption\]/g, '');
  out = out.replace(/\[\/?\w+[^\]]*\]/g, '');
  // Strip scripts and styles
  out = out.replace(/<script[\s\S]*?<\/script>/gi, '');
  out = out.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Strip post-meta byline that appears at the start of some posts
  out = out.replace(/<p[^>]*class="[^"]*post-meta[^"]*"[^>]*>[\s\S]*?<\/p>/gi, '');
  // Download any inline WP-upload images and rewrite src to /blog-images/
  out = await downloadAndRewriteImages(out);
  // Rewrite staging-domain hrefs and strip canonical domain prefix from internal links
  out = rewriteHrefs(out);
  return out.trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8212;/g, '—')
    .replace(/&hellip;/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Per-post pipeline
// ---------------------------------------------------------------------------

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

td.remove(['script', 'style', 'noscript']);

td.addRule('clean-divs', {
  filter: (node) =>
    node.nodeName === 'DIV' &&
    typeof (node as HTMLElement).getAttribute === 'function' &&
    !!(node as HTMLElement).getAttribute('class')?.match(/^et_pb_/),
  replacement: (content) => content,
});

interface ScrapedPost {
  slug: string;
  title: string;
  date: string;
  imageUrl: string | null;
  bodyMarkdown: string;
  excerpt: string;
}

async function scrapePost(url: string): Promise<ScrapedPost | null> {
  const slug = path.basename(new URL(url).pathname.replace(/\/$/, ''));

  const html = await fetchText(url);

  const title =
    stripHtml(extractMeta(html, 'og:title') ?? '') ||
    stripHtml(/<h1[^>]*class="entry-title"[^>]*>([\s\S]*?)<\/h1>/i.exec(html)?.[1] ?? '');

  const imageUrl = extractMeta(html, 'og:image');
  const publishedTime =
    extractMeta(html, 'article:published_time') ??
    extractMeta(html, 'og:updated_time');
  const date = publishedTime ? publishedTime.split('T')[0] : '';

  const rawBody = extractArticleBody(html);
  if (!rawBody) return null;

  const cleaned = await cleanBodyHtml(rawBody);
  const bodyMarkdown = td.turndown(cleaned).trim();

  const excerpt = stripHtml(cleaned).slice(0, 280);

  return { slug, title, date, imageUrl, bodyMarkdown, excerpt };
}

function slugLooksLikeDateReport(slug: string): boolean {
  if (DATE_SLUG_RE.test(slug)) return true;
  if (DATE_KEYWORD_RE.test(slug)) return true;
  return false;
}

async function processUrl(
  url: string,
): Promise<
  | { kind: 'skipped'; slug: string; reason: string }
  | { kind: 'redirect'; slug: string }
  | { kind: 'exported'; slug: string }
> {
  const slug = path.basename(new URL(url).pathname.replace(/\/$/, ''));

  if (slug === 'fishing-reservation') {
    return { kind: 'skipped', slug, reason: 'booking page, not a post' };
  }

  if (slugLooksLikeDateReport(slug)) {
    return { kind: 'redirect', slug };
  }

  let post: ScrapedPost | null;
  try {
    post = await scrapePost(url);
  } catch (e) {
    return { kind: 'skipped', slug, reason: (e as Error).message };
  }

  if (!post || !post.bodyMarkdown) {
    return { kind: 'skipped', slug, reason: 'no body extracted' };
  }

  let imageRel = '';
  if (post.imageUrl) {
    try {
      const canonical = normalizeToCanonical(post.imageUrl);
      const urlObj = new URL(canonical);
      const filename = path.basename(urlObj.pathname);
      const dest = path.join(OUT_IMAGES, filename);
      if (!fs.existsSync(dest)) {
        await downloadFile(canonical, dest);
      }
      imageRel = `/blog-images/${filename}`;
    } catch {
      // image download failed, continue without it
    }
  }

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(post.title)}`,
    `slug: ${JSON.stringify(post.slug)}`,
    `date: ${JSON.stringify(post.date)}`,
    `description: ${JSON.stringify(post.excerpt)}`,
    imageRel ? `image: ${JSON.stringify(imageRel)}` : '',
    '---',
    '',
  ]
    .filter((l) => l !== '')
    .join('\n');

  const out = path.join(OUT_BLOG, `${post.slug}.md`);
  fs.writeFileSync(out, frontmatter + '\n' + post.bodyMarkdown + '\n');

  return { kind: 'exported', slug };
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

async function fetchPostUrls(): Promise<string[]> {
  const xml = await fetchText(SITEMAP_URL);
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .filter((u) => u.startsWith(SITE));
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Fish The Wahoo — Blog Post Scraper (public HTML)');
  console.log('================================================\n');

  fs.mkdirSync(OUT_BLOG, { recursive: true });
  fs.mkdirSync(OUT_IMAGES, { recursive: true });

  console.log(`Fetching sitemap: ${SITEMAP_URL}`);
  const urls = await fetchPostUrls();
  console.log(`Found ${urls.length} post URLs.\n`);

  const redirectSlugs: string[] = [];
  const skipped: Array<{ slug: string; reason: string }> = [];
  let exported = 0;

  for (const url of urls) {
    const slug = path.basename(new URL(url).pathname.replace(/\/$/, ''));
    process.stdout.write(`${slug.padEnd(60)} `);

    const result = await processUrl(url);
    if (result.kind === 'exported') {
      exported++;
      console.log('✓ exported');
    } else if (result.kind === 'redirect') {
      redirectSlugs.push(result.slug);
      console.log('→ redirect to /daily-catch');
    } else {
      skipped.push({ slug: result.slug, reason: result.reason });
      console.log(`· skipped (${result.reason})`);
    }
  }

  const redirectLines = redirectSlugs.map((s) => `  '/${s}': '/daily-catch',`).join('\n');
  const redirectsFile = `/**
 * AUTO-GENERATED by scripts/import-wp-scrape.ts
 * Date-slug WP posts that should redirect to /daily-catch.
 * Merge these into src/data/redirects.ts if any are missing.
 */
export const wpGeneratedRedirects: Record<string, string> = {
${redirectLines}
};
`;
  fs.writeFileSync(OUT_REDIRECTS, redirectsFile);

  console.log('\n=== Summary ===');
  console.log(`Exported to content/blog/: ${exported}`);
  console.log(`Redirected to /daily-catch: ${redirectSlugs.length}`);
  console.log(`Skipped: ${skipped.length}`);
  if (skipped.length) {
    for (const s of skipped) console.log(`  - ${s.slug}: ${s.reason}`);
  }
  console.log(`\nGenerated ${OUT_REDIRECTS}`);
  console.log('\nDone. Run `npm run dev` to preview the blog at /blog/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
