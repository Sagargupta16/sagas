import { expect, test } from '@playwright/test';

/**
 * Reader regression suite. The library launches with zero books, so these
 * tests discover the first available chapter and skip cleanly when the
 * shelves are still empty. The moment a real chapter lands, they activate
 * without any edits.
 */

const HOME = '/sagas/';

async function firstChapterUrl(page: import('@playwright/test').Page) {
  await page.goto(HOME);
  const book = page.locator('a.entry').first();
  if ((await book.count()) === 0) return null;
  await book.click();
  const chapter = page.locator('.chapter-link').first();
  if ((await chapter.count()) === 0) return null;
  await chapter.click();
  return page.url();
}

test.describe('chapter reader', () => {
  test('collapsed panels are actually collapsed', async ({ page }) => {
    const url = await firstChapterUrl(page);
    test.skip(!url, 'no chapters published yet');

    for (const selector of ['#reader-prefs', '[data-ra-panel]']) {
      const el = page.locator(selector);
      if ((await el.count()) === 0) continue;
      const display = await el.evaluate((n) => getComputedStyle(n).display);
      expect(display, `${selector} must be display:none while hidden`).toBe(
        'none',
      );
    }
  });

  test('saved reading progress survives a reload', async ({ page }) => {
    const url = await firstChapterUrl(page);
    test.skip(!url, 'no chapters published yet');

    const main = page.locator('main.read');
    const book = await main.getAttribute('data-book');
    const chapter = await main.getAttribute('data-chapter');
    await page.evaluate(
      ([b, c]) => {
        localStorage.setItem(
          `sagas:progress:${b}`,
          JSON.stringify({ _last: c, [c!]: { pct: 50, at: 123 } }),
        );
      },
      [book, chapter],
    );
    await page.reload();
    // The previously-saved position must not be clobbered on load.
    const stored = await page.evaluate(
      (b) => JSON.parse(localStorage.getItem(`sagas:progress:${b}`) || '{}'),
      book,
    );
    expect(stored[chapter!]?.pct).toBe(50);
  });

  test('arrow keys on focused controls do not navigate away', async ({
    page,
  }) => {
    const url = await firstChapterUrl(page);
    test.skip(!url, 'no chapters published yet');

    await page.locator('[data-prefs-toggle]').focus();
    await page.keyboard.press('ArrowRight');
    expect(page.url()).toBe(url);
  });

  test('theme preference persists across reloads', async ({ page }) => {
    const url = await firstChapterUrl(page);
    test.skip(!url, 'no chapters published yet');

    await page.locator('[data-prefs-toggle]').click();
    await page.getByRole('button', { name: 'Sepia' }).click();
    await page.reload();
    const theme = await page.evaluate(
      () => document.documentElement.dataset.theme,
    );
    expect(theme).toBe('sepia');
  });
});
