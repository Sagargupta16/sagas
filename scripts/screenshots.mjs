/**
 * Capture the README screenshots from a running demo build.
 *
 *   pnpm build:demo
 *   pnpm preview            # serves http://localhost:4321/sagas/
 *   pnpm screenshots        # writes docs/screenshots/*.webp
 *
 * Every shot comes from the real built site with the demo book from
 * `tests/fixtures/books/`. Playwright takes PNGs; a canvas in the same
 * browser re-encodes them to WebP, so no image library is needed.
 * Override the server with SHOTS_URL=http://host:port/sagas/.
 */
import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { chromium } from '@playwright/test';

const BASE = process.env.SHOTS_URL ?? 'http://localhost:4321/sagas/';
const OUT = join(process.cwd(), 'docs', 'screenshots');
const CH1 = 'books/reader-demo/01-the-first-lamp/';
const CH2 = 'books/reader-demo/02-tanners-bridge/';

const desktop = {
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
};
const phone = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
};

/** localStorage seeded before any page script runs. */
const progress = (pct) => ({
  'sagas:progress:reader-demo': JSON.stringify({
    _last: '01-the-first-lamp',
    '01-the-first-lamp': { pct, at: Date.now() },
  }),
});

const shots = [
  {
    name: 'home-desktop',
    device: desktop,
    path: '',
    storage: progress(42),
  },
  {
    name: 'reader-settings-desktop',
    device: desktop,
    path: CH1,
    act: async (page) => {
      await page.locator('[data-prefs-toggle]').click();
      await page.evaluate(() => window.scrollTo(0, 0));
    },
  },
  {
    name: 'home-phone',
    device: phone,
    path: '',
    storage: progress(42),
  },
  {
    name: 'reader-resume-phone',
    device: phone,
    path: CH1,
    storage: { ...progress(42), 'sagas:prefs': '{"theme":"sepia"}' },
    act: async (page) => {
      await page.mouse.wheel(0, 1400);
    },
  },
  {
    name: 'read-aloud-phone',
    device: phone,
    path: CH2,
    act: async (page) => {
      await page.locator('[data-ra-settings]').click();
      await page.evaluate(() => window.scrollTo(0, 0));
    },
  },
];

/** Re-encode a PNG buffer to WebP with the browser's own encoder. */
async function toWebp(page, png) {
  const dataUrl = `data:image/png;base64,${png.toString('base64')}`;
  const webp = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext('2d').drawImage(img, 0, 0);
    return canvas.toDataURL('image/webp', 0.82);
  }, dataUrl);
  return Buffer.from(webp.split(',')[1], 'base64');
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const encoder = await browser.newPage();

for (const shot of shots) {
  const context = await browser.newContext({
    ...shot.device,
    colorScheme: 'dark',
  });
  if (shot.storage) {
    await context.addInitScript((entries) => {
      for (const [k, v] of Object.entries(entries)) localStorage.setItem(k, v);
    }, shot.storage);
  }
  const page = await context.newPage();
  const res = await page.goto(new URL(shot.path, BASE).href, {
    waitUntil: 'networkidle',
  });
  if (!res?.ok()) {
    throw new Error(
      `${shot.name}: ${res?.status()} at ${shot.path || '/'}; is the demo build being served?`,
    );
  }
  await page.evaluate(() => document.fonts.ready);
  if (shot.act) await shot.act(page);
  // let entrance animations and smooth scrolling settle; motion stays on
  await page.waitForTimeout(1200);
  const png = await page.screenshot();
  const file = join(OUT, `${shot.name}.webp`);
  writeFileSync(file, await toWebp(encoder, png));
  const kb = (statSync(file).size / 1024).toFixed(1);
  const { width, height } = shot.device.viewport;
  console.log(
    `${shot.name}.webp  ${width}x${height} @${shot.device.deviceScaleFactor}x  ${kb} KB`,
  );
  await context.close();
}

await browser.close();
