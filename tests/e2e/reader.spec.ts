import { expect, test } from '@playwright/test';

/**
 * Reader regression suite.
 *
 * CI builds with `SAGAS_FIXTURES=1` (`pnpm build:demo`, `pnpm test:e2e:demo`),
 * which adds the demo book in `tests/fixtures/books/reader-demo/`, so every
 * test here runs on every PR. Without the flag the suite falls back to the
 * first real chapter and skips cleanly while the shelves are still empty.
 */

const HOME = '/sagas/';
const FIXTURES = process.env.SAGAS_FIXTURES === '1';
const DEMO_BOOK = '/sagas/books/reader-demo/';
const DEMO_CH1 = `${DEMO_BOOK}01-the-first-lamp/`;
const DEMO_CH2 = `${DEMO_BOOK}02-tanners-bridge/`;
// en dash (U+2013) and em dash (U+2014), built from code points on purpose
const TYPOGRAPHIC_DASH = new RegExp(`[${String.fromCharCode(0x2013, 0x2014)}]`);

async function firstChapterUrl(page: import('@playwright/test').Page) {
  if (FIXTURES) {
    const res = await page.goto(DEMO_CH1);
    expect(res?.ok(), `demo chapter missing at ${DEMO_CH1}`).toBeTruthy();
    return page.url();
  }
  await page.goto(HOME);
  const book = page.locator('a.entry').first();
  if ((await book.count()) === 0) return null;
  await book.click();
  const chapter = page.locator('.chapter-link').first();
  if ((await chapter.count()) === 0) return null;
  await chapter.click();
  return page.url();
}

async function storedProgress(page: import('@playwright/test').Page) {
  const main = page.locator('main.read');
  const book = (await main.getAttribute('data-book'))!;
  const chapter = (await main.getAttribute('data-chapter'))!;
  const read = () =>
    page.evaluate(
      (b) => JSON.parse(localStorage.getItem(`sagas:progress:${b}`) || '{}'),
      book,
    );
  return { book, chapter, read };
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

    const { book, chapter, read } = await storedProgress(page);
    await page.evaluate(
      ([b, c]) => {
        localStorage.setItem(
          `sagas:progress:${b}`,
          JSON.stringify({ _last: c, [c]: { pct: 50, at: 123 } }),
        );
      },
      [book, chapter],
    );
    await page.reload();
    // The previously-saved position must not be clobbered on load.
    expect((await read())[chapter]?.pct).toBe(50);
  });

  test('a mid-chapter position offers to resume', async ({ page }) => {
    const url = await firstChapterUrl(page);
    test.skip(!url, 'no chapters published yet');

    const { book, chapter } = await storedProgress(page);
    await page.evaluate(
      ([b, c]) => {
        localStorage.setItem(
          `sagas:progress:${b}`,
          JSON.stringify({ _last: c, [c]: { pct: 50, at: 123 } }),
        );
      },
      [book, chapter],
    );
    await page.reload();
    await expect(page.locator('.resume-toast')).toHaveText(/50%/);
  });

  test('scrolling through the chapter saves the position', async ({ page }) => {
    const url = await firstChapterUrl(page);
    test.skip(!url, 'no chapters published yet');

    const { chapter, read } = await storedProgress(page);
    await page.evaluate(() => {
      const article = document.querySelector('.prose') as HTMLElement;
      const total = article.offsetHeight - window.innerHeight;
      window.scrollTo(0, article.offsetTop + total / 2);
    });
    await expect
      .poll(async () => (await read())[chapter]?.pct ?? -1)
      .toBeGreaterThan(30);
    expect((await read())[chapter].pct).toBeLessThan(70);
    expect((await read())._last).toBe(chapter);
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

test.describe('demo book', () => {
  test.skip(!FIXTURES, 'demo book only exists in SAGAS_FIXTURES builds');

  test('arrow keys move between chapters', async ({ page }) => {
    await page.goto(DEMO_CH2);
    await page.locator('h1').click();
    await page.keyboard.press('ArrowLeft');
    await expect(page).toHaveURL(new RegExp(`${DEMO_CH1}$`));
    await page.locator('h1').click();
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(new RegExp(`${DEMO_CH2}$`));
  });

  test('pager links and canonical use slash-terminated URLs', async ({
    page,
  }) => {
    await page.goto(DEMO_CH2);
    const hrefs = await page
      .locator('.pager a')
      .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
    expect(hrefs).toEqual([DEMO_CH1, `${DEMO_BOOK}03-the-second-ledger/`]);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://sagargupta.online${DEMO_CH2}`,
    );
  });

  test('the dash rule reaches built prose', async ({ page }) => {
    await page.goto(DEMO_CH1);
    const text = await page.locator('article.prose').innerText();
    expect(text).toContain('borrowed -- not from the river');
    expect(text).not.toMatch(TYPOGRAPHIC_DASH);
  });

  test('home page offers to continue the last chapter read', async ({
    page,
  }) => {
    await page.goto(DEMO_CH1);
    await page.evaluate(() => {
      localStorage.setItem(
        'sagas:progress:reader-demo',
        JSON.stringify({
          _last: '01-the-first-lamp',
          '01-the-first-lamp': { pct: 40, at: Date.now() },
        }),
      );
    });
    await page.goto(HOME);
    const card = page.locator('[data-continue]');
    await expect(card).toBeVisible();
    await expect(card).toHaveAttribute('href', DEMO_CH1);
    await expect(card).toContainText('The First Lamp');
    await expect(card).toContainText('40% in');
  });

  test('home stats read as words once books exist', async ({ page }) => {
    await page.goto(HOME);
    // regression: "1 booktaking shape" when a line break ate the space
    await expect(page.locator('.stats')).toContainText('1 book taking shape');
    await expect(page.locator('.stats')).toContainText('3 chapters written');
  });

  test('the book page lists every chapter in order', async ({ page }) => {
    await page.goto(DEMO_BOOK);
    await expect(page.locator('.chapter-link .chapter-title')).toHaveText([
      'The First Lamp',
      "Tanner's Bridge",
      'The Second Ledger',
    ]);
  });

  test('draft chapters stay out of the RSS feed', async ({ request }) => {
    const body = await (await request.get('/sagas/rss.xml')).text();
    expect(body).toContain(`https://sagargupta.online${DEMO_CH1}`);
    expect(body).toContain(`https://sagargupta.online${DEMO_CH2}`);
    expect(body).not.toContain('03-the-second-ledger');
  });
});
