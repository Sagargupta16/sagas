// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sagargupta.online',
  base: '/sagas',
  trailingSlash: 'never',
  integrations: [sitemap()],
  markdown: {
    // House dash rule: `--` in prose must stay `--`, never become an
    // en/em dash. smartPunctuation is the modern replacement for the
    // deprecated `markdown.smartypants` flag.
    processor: satteri({ features: { smartPunctuation: false } }),
  },
});
