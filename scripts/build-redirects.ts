import { writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { redirects } from '../src/data/redirects';
import { wpGeneratedRedirects } from '../src/data/redirects-wp-gen';

const SPA_FALLBACK = '/* /index.html 200';
const BLOG_DIR = path.resolve('content/blog');

/**
 * Emit a root-level redirect for every blog post so that legacy WP URLs like
 * https://fishthewahoo.com/bottom-fishing-charleston-sc/ land on
 * https://fishthewahoo.com/blog/bottom-fishing-charleston-sc.
 */
function blogPostRedirects(): Record<string, string> {
  const out: Record<string, string> = {};
  for (const file of readdirSync(BLOG_DIR)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    out[`/${slug}`] = `/blog/${slug}`;
  }
  return out;
}

// Merge sources in priority order: manual redirects win over auto-generated.
// Blog-post redirects are auto-generated but must not override any manual
// mapping (e.g. a post that's also a WP landing page).
const merged: Record<string, string> = {
  ...blogPostRedirects(),
  ...wpGeneratedRedirects,
  ...redirects,
};

const lines = [
  '# Generated from src/data/redirects.ts, redirects-wp-gen.ts, and content/blog/*.md',
  '# by scripts/build-redirects.ts. Do not edit by hand. Run `npm run build:redirects`.',
  '',
  ...Object.entries(merged).map(([from, to]) => `${from} ${to} 301`),
  '',
  '# SPA fallback — must be last',
  SPA_FALLBACK,
  '',
];

writeFileSync('public/_redirects', lines.join('\n'));
console.log(`Wrote ${Object.keys(merged).length} redirects to public/_redirects`);
