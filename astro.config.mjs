// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://sagas.sagargupta.online',
  trailingSlash: 'never',
  markdown: {
    smartypants: false,
  },
});
