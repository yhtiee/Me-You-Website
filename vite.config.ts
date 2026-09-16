import { resolve } from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import { pages } from './src/seo.ts';
import { seoPlugin } from './vite-plugin-seo.ts';

/**
 * A multi-page build: every route is a real HTML file in its own folder
 * (`/privacy/index.html`), so `/privacy/` works on any static host with no
 * rewrite rules, and store reviewers get a real page, not an SPA fallback.
 *
 * The page list lives in `src/seo.ts`, so a page can't be built without its
 * title and description.
 */
export default defineConfig({
  plugins: [react(), seoPlugin()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p.entry, resolve(import.meta.dirname, `${p.entry}.html`)])),
    },
  },
});
