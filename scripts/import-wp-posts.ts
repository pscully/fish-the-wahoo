/**
 * WordPress to Markdown import script.
 *
 * Usage:
 *   npx tsx scripts/import-wp-posts.ts
 *
 * Fetches all posts from fishthewahoo.com WP REST API, converts HTML to
 * Markdown, downloads featured images, and writes:
 *   - content/blog/{slug}.md  (real posts)
 *   - src/data/redirects-wp-gen.ts  (auto-generated date-slug → /daily-catch redirects)
 *   - public/blog-images/{filename}  (featured images)
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import TurndownService from 'turndown';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const WP_API_BASE = 'https://fishthewahoo.com/wp-json/wp/v2';
const PER_PAGE = 100;
const OUT_BLOG = path.resolve('content/blog');
const OUT_IMAGES = path.resolve('public/blog-images');

// Slugs that are cryptic date-fragments — redirect to /daily-catch instead of exporting.
const DATE_SLUG_BLACKLIST = new Set([
  '7716', '82016', '125-1221', '1224-228', '925-108', '82916-2',
  '8516-81816', '1010-112', '12-22-16', '12-1-23-fish-report',
  'september-4th-harbor-cruise', 'august-1-inshore',
  'july-5th-deep-sea-fishing-adventure',
]);

// Also treat numeric-only slugs and short date-like slugs as daily-catch
const DATE_SLUG_RE = /^\d{1,8}(-\d+)*$|^\d{1,2}-\d{1,2}-\d{2}$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const td = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
});

td.addRule('remove-wp-shortcodes', {
  filter: ['figure', 'figcaption'],
  replacement: (_content: string, node: HTMLElement) => {
    if (node.nodeName === 'FIGCAPTION') return '';
    // keep the inner text/content of figures if any
    return _content;
  },
});

function cleanHtml(html: string): string {
  // Strip WP shortcodes like [caption], [gallery], [embed] etc.
  return html
    .replace(/\[caption[^\]]*\].*?\[\/caption\]/gs, '')
    .replace(/\[gallery[^\]]*\]/g, '')
    .replace(/\[embed\].*?\[\/embed\]/gs, '')
    .replace(/\[\/?\w+[^\]]*\]/g, '')
    .trim();
}

function fetchJson(url: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib.get(url, { headers: { 'User-Agent': 'FTW-Importer/1.0' } }, (res) => {
      const chunks: Buffer[] = [];
      res.on('data', (c: Buffer) => chunks.push(c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString()));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    lib.get(url, { headers: { 'User-Agent': 'FTW-Importer/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        downloadFile(res.headers.location!, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve()));
    }).on('error', (e) => { fs.unlink(dest, () => {}); reject(e); });
  });
}

function slugToFilename(url: string): string {
  return path.basename(new URL(url).pathname);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').trim();
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface WpPost {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string }>;
  };
  categories?: number[];
}

async function fetchAllPosts(): Promise<WpPost[]> {
  const posts: WpPost[] = [];
  let page = 1;

  while (true) {
    const url = `${WP_API_BASE}/posts?per_page=${PER_PAGE}&page=${page}&_embed=1`;
    console.log(`  Fetching page ${page}: ${url}`);

    let data: unknown;
    try {
      data = await fetchJson(url);
    } catch (e) {
      console.error(`  Error fetching page ${page}:`, e);
      break;
    }

    if (!Array.isArray(data) || data.length === 0) break;
    posts.push(...(data as WpPost[]));
    if (data.length < PER_PAGE) break;
    page++;
  }

  return posts;
}

async function processPost(post: WpPost): Promise<{
  type: 'exported' | 'redirect';
  slug: string;
}> {
  const slug = post.slug;

  // Check blacklist and date-slug pattern
  if (DATE_SLUG_BLACKLIST.has(slug) || DATE_SLUG_RE.test(slug)) {
    return { type: 'redirect', slug };
  }

  // Convert content HTML → Markdown
  const cleanedHtml = cleanHtml(post.content.rendered);
  const markdown = td.turndown(cleanedHtml);

  // Get featured image
  let imageRelPath = '';
  const mediaUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  if (mediaUrl) {
    const filename = slugToFilename(mediaUrl);
    const dest = path.join(OUT_IMAGES, filename);
    if (!fs.existsSync(dest)) {
      try {
        await downloadFile(mediaUrl, dest);
        console.log(`  Downloaded image: ${filename}`);
      } catch (e) {
        console.warn(`  Failed to download image ${mediaUrl}:`, (e as Error).message);
      }
    }
    imageRelPath = `/blog-images/${filename}`;
  }

  const title = stripHtml(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered).slice(0, 300);
  const dateStr = post.date.split('T')[0];

  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `slug: "${slug}"`,
    `date: "${dateStr}"`,
    `description: "${excerpt.replace(/"/g, '\\"')}"`,
    imageRelPath ? `image: "${imageRelPath}"` : '',
    '---',
    '',
  ].filter(l => l !== '' || l === '').join('\n');

  const outPath = path.join(OUT_BLOG, `${slug}.md`);
  fs.writeFileSync(outPath, frontmatter + '\n' + markdown);

  return { type: 'exported', slug };
}

async function main() {
  console.log('Fish The Wahoo — WordPress Post Importer');
  console.log('=========================================\n');

  // Ensure output directories exist
  fs.mkdirSync(OUT_BLOG, { recursive: true });
  fs.mkdirSync(OUT_IMAGES, { recursive: true });

  console.log('Fetching posts from WP REST API...');
  const posts = await fetchAllPosts();
  console.log(`Found ${posts.length} total posts.\n`);

  const redirectSlugs: string[] = [];
  let exported = 0;
  let skipped = 0;

  for (const post of posts) {
    process.stdout.write(`Processing: ${post.slug} ... `);
    const result = await processPost(post);

    if (result.type === 'redirect') {
      redirectSlugs.push(result.slug);
      skipped++;
      console.log('→ redirect to /daily-catch');
    } else {
      exported++;
      console.log('✓ exported');
    }
  }

  // Write generated redirects file
  const redirectLines = redirectSlugs
    .map(s => `  '/${s}': '/daily-catch',`)
    .join('\n');

  const redirectsFile = `/**
 * AUTO-GENERATED by scripts/import-wp-posts.ts
 * Date-slug WP posts that should redirect to /daily-catch
 * Merge these into src/data/redirects.ts if any are missing.
 */
export const wpGeneratedRedirects: Record<string, string> = {
${redirectLines}
};
`;

  fs.writeFileSync(path.resolve('src/data/redirects-wp-gen.ts'), redirectsFile);

  console.log('\n=== Summary ===');
  console.log(`Exported to content/blog/: ${exported}`);
  console.log(`Redirected to /daily-catch: ${skipped}`);
  console.log(`Generated src/data/redirects-wp-gen.ts with ${redirectSlugs.length} entries`);
  console.log('\nDone. Run `npm run dev` to preview the blog at /blog/');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
