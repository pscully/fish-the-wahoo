import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import { packages } from '../src/content/packages';
import { species } from '../src/content/species';
import { boats } from '../src/content/boats';

const SITE_URL = (process.env.SITE_URL ?? 'https://fishthewahoo.com').replace(/\/$/, '');
const BLOG_DIR = 'content/blog';

const staticPaths = [
  '/',
  '/book/calendar',
  '/check',
  '/charter-payment',
  '/packages',
  '/deep-sea-fishing',
  '/inshore-fishing-charters',
  '/fishing-charters-in-charleston-sc',
  '/harbor-cruises',
  '/species',
  '/captains',
  '/tour-boats',
  '/gallery',
  '/reviews',
  '/trip-videos',
  '/daily-catch',
  '/trip-preparations',
  '/faq',
  '/about',
  '/contact',
  '/santee-river-sportsmen',
  '/blog',
  '/cancellation-policy',
  '/privacy-policy',
  '/terms-of-use',
];

type Entry = { loc: string; lastmod?: string };

function readBlogEntries(): Entry[] {
  let files: string[] = [];
  try {
    files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
  return files.map((file) => {
    const raw = readFileSync(join(BLOG_DIR, file), 'utf8');
    const { data } = matter(raw);
    const slug = data.slug ?? file.replace(/\.md$/, '');
    const date = typeof data.date === 'string' ? data.date : undefined;
    return { loc: `/blog/${slug}`, lastmod: date };
  });
}

const entries: Entry[] = [
  ...staticPaths.map((p) => ({ loc: p })),
  ...packages.map((p) => ({ loc: `/packages/${p.slug}` })),
  ...species.map((s) => ({ loc: `/species/${s.slug}` })),
  ...boats.map((b) => ({ loc: `/tour-boats/${b.slug}` })),
  ...readBlogEntries(),
];

function xmlEscape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const body = entries
  .map(({ loc, lastmod }) => {
    const lines = [`  <url>`, `    <loc>${xmlEscape(SITE_URL + loc)}</loc>`];
    if (lastmod) lines.push(`    <lastmod>${xmlEscape(lastmod)}</lastmod>`);
    lines.push(`  </url>`);
    return lines.join('\n');
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync('public/sitemap.xml', xml);
console.log(`Wrote ${entries.length} URLs to public/sitemap.xml`);
