import { writeFileSync } from 'node:fs';
import { redirects } from '../src/data/redirects';

const SPA_FALLBACK = '/* /index.html 200';

const lines = [
  '# Generated from src/data/redirects.ts by scripts/build-redirects.ts',
  '# Do not edit by hand. Run `npm run build:redirects`.',
  '',
  ...Object.entries(redirects).map(([from, to]) => `${from} ${to} 301`),
  '',
  '# SPA fallback — must be last',
  SPA_FALLBACK,
  '',
];

writeFileSync('public/_redirects', lines.join('\n'));
console.log(`Wrote ${Object.keys(redirects).length} redirects to public/_redirects`);
