import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const criticalRoutes = ['/', '/menu/', '/reservations/', '/order/', '/contact/'];

test.describe('accessibility', () => {
  for (const route of criticalRoutes) {
    test(`no serious/critical violations on ${route}`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze();
      const serious = results.violations.filter((v) =>
        ['serious', 'critical'].includes(v.impact ?? ''),
      );
      expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
    });
  }

  test('mobile nav is keyboard operable', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Open menu' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog', { name: 'Mobile navigation' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Mobile navigation' })).toBeHidden();
  });
});
