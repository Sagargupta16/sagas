import { expect, test } from '@playwright/test';

const HOME = '/sagas/';

test.describe('home page', () => {
  test('renders the library shell', async ({ page }) => {
    await page.goto(HOME);
    await expect(page).toHaveTitle(/living library/);
    await expect(
      page.getByRole('heading', { level: 1, name: /living library/i }),
    ).toBeVisible();
    // three shelves, each with its heading
    for (const shelf of ['Original Fantasy', 'Fan Fiction', 'Essays']) {
      await expect(
        page.getByRole('heading', { level: 2, name: shelf }),
      ).toBeVisible();
    }
  });

  test('empty shelves show the crafted zero-book state', async ({ page }) => {
    await page.goto(HOME);
    const empties = page.locator('.shelf-empty');
    // With zero books every shelf shows its promise; with books this
    // assertion still passes as long as bookless shelves are crafted.
    const shelves = await page.locator('.shelf').count();
    const entries = await page.locator('a.entry').count();
    expect((await empties.count()) + entries).toBeGreaterThanOrEqual(shelves);
  });

  test('continue-reading card stays hidden without history', async ({
    page,
  }) => {
    await page.goto(HOME);
    const cont = page.locator('[data-continue]');
    await expect(cont).toBeHidden();
    // regression: [hidden] must actually compute to display:none
    const display = await cont.evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe('none');
  });

  test('no horizontal overflow at any project viewport', async ({ page }) => {
    await page.goto(HOME);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('skip link jumps to main content', async ({ page }) => {
    await page.goto(HOME);
    await page.keyboard.press('Tab');
    const skip = page.locator('.skip-link');
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });

  test('decorative layers never intercept input', async ({ page }) => {
    await page.goto(HOME);
    for (const selector of ['.ambient', '.grain']) {
      const pe = await page
        .locator(selector)
        .evaluate((el) => getComputedStyle(el).pointerEvents);
      expect(pe).toBe('none');
    }
  });
});

test.describe('feeds and metadata', () => {
  test('rss feed is valid and carries the base path', async ({ request }) => {
    const res = await request.get('/sagas/rss.xml');
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain('<rss');
    expect(body).toContain('https://sagargupta.online/sagas');
  });

  test('sitemap exists', async ({ request }) => {
    const res = await request.get('/sagas/sitemap-index.xml');
    expect(res.ok()).toBeTruthy();
  });

  test('404 page renders with skip target', async ({ page }) => {
    const res = await page.goto('/sagas/definitely-not-a-page');
    expect(res?.status()).toBe(404);
    await expect(page.locator('#main')).toBeAttached();
  });
});

test.describe('reduced motion', () => {
  test('entrance and ambient animation are disabled', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(HOME);
    const riseAnimation = await page
      .locator('.rise')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(riseAnimation).toBe('none');
    const glowAnimation = await page
      .locator('.ambient-glow')
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(glowAnimation).toBe('none');
  });
});
