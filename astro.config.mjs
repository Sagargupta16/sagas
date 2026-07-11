// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sagargupta.online',
  base: '/sagas',
  trailingSlash: 'never',
  integrations: [sitemap()],
  markdown: {
    smartypants: false,
  },
});
