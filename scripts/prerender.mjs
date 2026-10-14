/**
 * Writes each page's rendered markup into its built HTML file.
 *
 * Runs after `vite build` (the browser bundle in dist/) and
 * `vite build --ssr` (the renderer in dist-ssr/). Every HTML file in dist/
 * names its page on <body data-page="…">; its empty <div id="root"> is filled
 * with that page rendered to a string, and main.tsx hydrates it in the browser.
 */
import { readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'dist');
const ssr = join(root, 'dist-ssr');

const { render } = await import(pathToFileURL(join(ssr, 'entry-server.js')).href);

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith('.html')) out.push(path);
  }
  return out;
}

const EMPTY_ROOT = '<div id="root"></div>';

for (const file of await htmlFiles(dist)) {
  const html = await readFile(file, 'utf8');
  const page = html.match(/<body[^>]*\bdata-page="([^"]+)"/)?.[1];
  const name = relative(dist, file).replace(/\\/g, '/');

  if (!page) continue;
  if (!html.includes(EMPTY_ROOT)) throw new Error(`[prerender] ${name}: no empty ${EMPTY_ROOT} to fill.`);

  const markup = render(page);
  await writeFile(file, html.replace(EMPTY_ROOT, `<div id="root">${markup}</div>`));
  console.log(`[prerender] ${name} (${page}) ${(markup.length / 1024).toFixed(1)} kB`);
}

await rm(ssr, { recursive: true, force: true });
