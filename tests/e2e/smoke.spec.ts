import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/shop/',
  '/collections/',
  '/collections/living/',
  '/collections/kitchen-dining/',
  '/collections/textiles/',
  '/collections/storage/',
  '/collections/workspace/',
  '/collections/gifts/',
  '/products/cedar-linen-throw/',
  '/search/',
  '/wishlist/',
  '/cart/',
  '/checkout/',
  '/checkout/success/',
  '/checkout/cancelled/',
  '/about/',
  '/journal/',
  '/shipping/',
  '/returns/',
  '/contact/',
  '/accessibility/',
  '/privacy/',
  '/terms/',
];

test.describe('Harbour & Pine Home demo', () => {
  for (const route of routes) {
    test(`renders ${route}`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.ok()).toBeTruthy();
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        'noindex, nofollow',
      );
      await expect(
        page.getByText('fictional e-commerce demonstration', { exact: false }).first(),
      ).toBeVisible();
    });
  }

  test('shop filtering works', async ({ page }) => {
    await page.goto('/shop/');
    await page.getByLabel('Filter catalogue by keyword').fill('throw');
    await expect(page.getByRole('link', { name: /cedar linen throw/i }).first()).toBeVisible();
    const clear = page.getByRole('button', { name: /clear all/i });
    if (await clear.isVisible().catch(() => false)) await clear.click();
  });

  test('product variants and add to demo cart', async ({ page }) => {
    await page.goto('/products/cedar-linen-throw/');
    await expect(page.getByRole('heading', { name: /cedar linen throw/i })).toBeVisible();
    await page.waitForFunction(() => Boolean(document.querySelector('[data-cart-host], .hp-purchase')));
    await page.locator('.hp-purchase').getByRole('button', { name: /add to demo cart/i }).click();
    await expect(page.getByRole('dialog', { name: /demo cart/i })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/no real order/i).first()).toBeVisible();
  });

  test('checkout demo completes locally without transmitting data', async ({ page }) => {
    const requests: string[] = [];
    page.on('request', (req) => {
      if (req.method() === 'POST') requests.push(req.url());
    });

    await page.goto('/products/riverstone-mug/');
    await page.locator('.hp-purchase').getByRole('button', { name: /add to demo cart/i }).click();
    await expect(page.getByRole('dialog', { name: /demo cart/i })).toBeVisible();
    await page.goto('/checkout/');
    await expect(
      page.getByText(/no order, shipment or payment will be created/i).first(),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: /complete demo checkout/i }).click();

    await expect(
      page.getByText(/completed the Harbour & Pine checkout demonstration/i),
    ).toBeVisible({ timeout: 15_000 });

    expect(requests.filter((u) => u.includes('/api/'))).toHaveLength(0);
  });

  test('no fake phone or street address', async ({ page }) => {
    await page.goto('/contact/');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\(\d{3}\)\s*\d{3}-\d{4}/);
    expect(body.toLowerCase()).not.toContain('123 main');
  });

  test('404 page works', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading').first()).toBeVisible();
  });
});
