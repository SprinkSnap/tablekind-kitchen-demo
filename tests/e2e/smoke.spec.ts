import { test, expect } from '@playwright/test';

const routes = [
  '/',
  '/menu/',
  '/menu/brunch/',
  '/menu/lunch/',
  '/menu/dinner/',
  '/menu/dessert/',
  '/reservations/',
  '/order/',
  '/catering/',
  '/private-events/',
  '/about/',
  '/location/',
  '/contact/',
  '/accessibility/',
];

test.describe('Tablekind Kitchen demo', () => {
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
        page.getByText('fictional restaurant demonstration', { exact: false }).first(),
      ).toBeVisible();
    });
  }

  test('menu filtering works', async ({ page }) => {
    await page.goto('/menu/');
    await page.getByLabel('Search dishes').fill('salmon');
    await expect(page.getByText(/salmon/i).first()).toBeVisible();
    await page.getByRole('button', { name: 'Clear filters' }).click();
  });

  test('reservation demo completes locally', async ({ page }) => {
    await page.goto('/reservations/');
    await page.getByRole('button', { name: 'Find a Demo Table' }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(
      page.getByRole('note').getByText('No real table will be reserved', { exact: false }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Complete Demo Reservation' }).click();
    await expect(page.getByText('Reservation experience complete.')).toBeVisible();
  });

  test('order demo cart calculates and completes locally', async ({ page }) => {
    await page.goto('/order/');
    await page.getByRole('button', { name: /Garden Spritz|Maple Ginger|Halloumi/i }).first().click();
    await page.getByRole('button', { name: 'Add to demo cart' }).click();
    await expect(page.getByRole('dialog', { name: 'Demo cart' })).toBeVisible();
    await page.getByLabel('Pickup time').selectOption({ index: 1 });
    await page.getByRole('button', { name: 'Complete demo order' }).click();
    await expect(
      page.getByText('You’ve completed the Tablekind ordering demonstration.'),
    ).toBeVisible();
  });

  test('location page has no fake address or phone', async ({ page }) => {
    await page.goto('/location/');
    await expect(
      page.getByText('No street address or phone number is published', { exact: false }).first(),
    ).toBeVisible();
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/\(\d{3}\)\s*\d{3}-\d{4}/);
    expect(body.toLowerCase()).not.toContain('123 main');
  });

  test('404 page works', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: /isn’t set/i })).toBeVisible();
  });
});
