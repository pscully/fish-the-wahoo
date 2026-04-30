import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://fishthewahoo.com',
  trailingSlash: 'always',
  output: 'static',
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/admin/') &&
        !page.includes('/book/') &&
        !page.includes('/charter-payment/') &&
        !page.includes('/check/') &&
        !page.includes('/packages/harbor-cruises/'),
    }),
    mdx(),
  ],
  build: {
    format: 'directory',
  },
  vite: {
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
  },
});
