/**
 * Generates the site's icons and social preview image into `public/`.
 *
 *   npm run assets
 *
 * Sources:
 *   public/favicon.svg        the tab mark (a heart on the couple gradient) —
 *                             small sizes, where the wordmark is unreadable
 *   public/images/icon.png    the real app icon — home-screen and install icons,
 *                             so the site matches the app on a phone
 *   scripts/og-image.html     the 1200×630 link preview, rendered in Chrome so
 *                             it uses the site's own fonts
 *
 * The outputs are committed; this only needs re-running when a source changes.
 * Chrome is found at the usual install path, or set CHROME_PATH.
 */

import { existsSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import puppeteer from 'puppeteer-core';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pub = (p) => resolve(root, 'public', p);

const MARK = pub('favicon.svg');
const APP_ICON = pub('images/icon.png');
/** The app icon's own background, so padded icons don't show a seam. */
const ICON_BG = '#FFE6EA';

async function png(input, size, out) {
  await sharp(input, { density: 512 }).resize(size, size).png().toFile(out);
  return out;
}

/**
 * A `.ico` holding PNG images — the format every browser still asks for at
 * `/favicon.ico`. The container is a 6-byte header, a 16-byte entry per image,
 * then the PNG data as-is.
 */
async function writeIco(pngBuffers, out) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngBuffers.length, 4);

  const entries = [];
  let offset = 6 + 16 * pngBuffers.length;
  for (const { size, data } of pngBuffers) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }

  await writeFile(out, Buffer.concat([header, ...entries, ...pngBuffers.map((p) => p.data)]));
}

async function icons() {
  const icoSizes = [16, 32, 48];
  const ico = await Promise.all(
    icoSizes.map(async (size) => ({
      size,
      data: await sharp(MARK, { density: 512 }).resize(size, size).png().toBuffer(),
    }))
  );
  await writeIco(ico, pub('favicon.ico'));
  await png(MARK, 32, pub('favicon-32x32.png'));
  await png(MARK, 16, pub('favicon-16x16.png'));

  // iOS ignores transparency and rounds the corners itself: full-bleed, opaque.
  await sharp(APP_ICON).resize(180, 180).flatten({ background: ICON_BG }).png().toFile(pub('apple-touch-icon.png'));

  await sharp(APP_ICON).resize(192, 192).png().toFile(pub('icon-192.png'));
  await sharp(APP_ICON).resize(512, 512).png().toFile(pub('icon-512.png'));

  // Maskable: Android may crop to a circle, so the artwork sits inside the
  // central 80% safe zone on the icon's own background.
  const inner = await sharp(APP_ICON).resize(410, 410).png().toBuffer();
  await sharp({ create: { width: 512, height: 512, channels: 4, background: ICON_BG } })
    .composite([{ input: inner, gravity: 'center' }])
    .png()
    .toFile(pub('icon-maskable-512.png'));

  console.log('icons: favicon.ico, favicon-16/32, apple-touch-icon, icon-192/512, icon-maskable-512');
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  return candidates.find((p) => existsSync(p));
}

async function ogImage() {
  const executablePath = findChrome();
  if (!executablePath) {
    console.warn('og-image: skipped — no Chrome found. Set CHROME_PATH.');
    return;
  }
  const browser = await puppeteer.launch({ executablePath, headless: true, args: ['--allow-file-access-from-files'] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
    await page.goto(pathToFileURL(resolve(root, 'scripts/og-image.html')).href, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    const shot = await page.screenshot({ type: 'png' });
    // Re-encoded: Chrome's PNGs are large, and link unfurlers have size limits.
    await sharp(shot).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(pub('og-image.png'));
    console.log('og-image: public/og-image.png');
  } finally {
    await browser.close();
  }
}

await icons();
await ogImage();
