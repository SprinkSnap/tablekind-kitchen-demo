/**
 * Capture recommended mobile case-study screenshots for Tablekind Kitchen.
 * Viewport: iPhone 14 @ 2x (390×844) — sticky Menu / Reserve / Order bar visible.
 *
 * Usage:
 *   node scripts/capture-mobile-screenshots.mjs [baseURL] [outDir]
 */
import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.argv[2] ?? 'http://127.0.0.1:4321';
const outDir = process.argv[3] ?? '/opt/cursor/artifacts/screenshots';

async function settle(page, ms = 400) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(ms);
}

async function dismissChrome(page) {
  // Portfolio notice steals first-viewport height on mobile — dismiss for case-study crops.
  const dismiss = page.locator('[data-portfolio-dismiss]');
  if (await dismiss.isVisible().catch(() => false)) {
    await dismiss.click();
    await settle(page, 200);
  }
  // Hide floating assistant FAB so it doesn't cover CTAs / drawers in marketing shots.
  await page.addStyleTag({
    content: `.assistant { display: none !important; }`,
  }).catch(() => {});
}

async function shot(page, name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: false, animations: 'disabled' });
  console.log(`✓ ${file}`);
  return file;
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices['iPhone 14'],
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  // --------------------------------------------------------------------------
  // 1. Mobile homepage with sticky Menu / Reserve / Order actions
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await settle(page, 500);
  await dismissChrome(page);
  await page.locator('.mobile-actions').waitFor({ state: 'visible' });
  await page.locator('.hero h1').waitFor({ state: 'visible' });
  await shot(page, '01-mobile-homepage-sticky-actions.png');

  // --------------------------------------------------------------------------
  // 2. Menu filtering — search + dietary checkbox + filtered dish results
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/menu/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  const search = page.getByLabel('Search dishes');
  await search.scrollIntoViewIfNeeded();
  await search.fill('salad');
  await page.locator('.check', { hasText: 'Vegetarian' }).locator('input').check();
  await settle(page, 350);
  // Frame the filter form + first results together
  await page.locator('.menu-filters .count').scrollIntoViewIfNeeded();
  await settle(page, 200);
  await shot(page, '02-mobile-menu-filtering.png');

  // --------------------------------------------------------------------------
  // 3. Reservation demo completion
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/reservations/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  await page.getByLabel('Party size').selectOption('4');
  await page.getByRole('button', { name: 'Find a Demo Table' }).click();
  await page.getByLabel('Seating preference').selectOption('window');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Complete Demo Reservation' }).click();
  const done = page.getByRole('heading', { name: 'Reservation experience complete.' });
  await done.waitFor();
  await done.scrollIntoViewIfNeeded();
  // Nudge so step indicator + success + CTAs sit in the viewport
  await page.evaluate(() => {
    const el = document.getElementById('reserve-done');
    el?.closest('.reserve')?.scrollIntoView({ block: 'start' });
  });
  await settle(page, 350);
  await shot(page, '03-mobile-reservation-complete.png');

  // --------------------------------------------------------------------------
  // 4. Pickup cart drawer
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/order/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  await page
    .getByRole('button', { name: /Orchard Pancake|Garden Spritz|Maple Ginger|Halloumi|Salmon/i })
    .first()
    .click();
  await settle(page, 250);
  await page.getByRole('button', { name: 'Add to demo cart' }).click();
  const cart = page.getByRole('dialog', { name: 'Demo cart' });
  await cart.waitFor();
  await settle(page, 350);
  await shot(page, '04-mobile-pickup-cart-drawer.png');

  // --------------------------------------------------------------------------
  // 5. Che Xu Studio enquiry drawer
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  // Portfolio bar CTA is hidden after dismiss — open via studio event / visible CTA.
  const visibleEnquiry = page.locator('[data-open-enquiry]:visible').first();
  if (await visibleEnquiry.count()) {
    await visibleEnquiry.click();
  } else {
    await page.evaluate(() => document.dispatchEvent(new CustomEvent('tk:open-enquiry')));
  }
  const enquiry = page.getByRole('dialog');
  await enquiry.waitFor();
  await settle(page, 400);
  await shot(page, '05-mobile-studio-enquiry-drawer.png');

  // --------------------------------------------------------------------------
  // 6. Reservation preferences step (strong mid-funnel portfolio moment)
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/reservations/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  await page.getByRole('button', { name: 'Find a Demo Table' }).click();
  const prefs = page.getByRole('heading', { name: 'Preferences' });
  await prefs.waitFor();
  await page.evaluate(() => {
    document.querySelector('.reserve')?.scrollIntoView({ block: 'start' });
  });
  await settle(page, 300);
  await shot(page, '06-mobile-reservation-preferences.png');

  // --------------------------------------------------------------------------
  // 7. Order browse — dish grid + sticky actions (fresh cart state)
  // --------------------------------------------------------------------------
  await context.clearCookies();
  await page.goto(`${baseURL}/order/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      /* ignore */
    }
  });
  await page.reload({ waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  const firstDish = page
    .getByRole('button', { name: /Orchard Pancake|Garden Spritz|Maple Ginger|Halloumi|Salmon/i })
    .first();
  await firstDish.scrollIntoViewIfNeeded();
  await settle(page, 300);
  await shot(page, '07-mobile-order-browse.png');

  await browser.close();
  console.log(`\nSaved recommended mobile screenshots to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
