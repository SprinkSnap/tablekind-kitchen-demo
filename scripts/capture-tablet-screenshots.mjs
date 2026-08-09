/**
 * Capture recommended tablet case-study screenshots for Tablekind Kitchen.
 * Viewport: iPad (820×1180) @ 2× — mid-breakpoint brand + conversion proof.
 *
 * Usage:
 *   node scripts/capture-tablet-screenshots.mjs [baseURL] [outDir]
 */
import { chromium, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.argv[2] ?? 'http://127.0.0.1:4321';
const outDir = process.argv[3] ?? 'docs/screenshots/tablet';

async function settle(page, ms = 400) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.waitForTimeout(ms);
}

async function dismissChrome(page) {
  const dismiss = page.locator('[data-portfolio-dismiss]');
  if (await dismiss.isVisible().catch(() => false)) {
    await dismiss.click();
    await settle(page, 200);
  }
  await page
    .addStyleTag({
      content: `
        .assistant { display: none !important; }
        astro-dev-toolbar { display: none !important; pointer-events: none !important; }
      `,
    })
    .catch(() => {});
}

async function shot(page, name) {
  const file = path.join(outDir, name);
  await page.screenshot({ path: file, fullPage: false, animations: 'disabled' });
  console.log(`✓ ${file}`);
  return file;
}

async function openEnquiry(page) {
  const visible = page.locator('[data-open-enquiry]:visible').first();
  if (await visible.count()) {
    await visible.click();
  } else {
    await page.evaluate(() => document.dispatchEvent(new CustomEvent('tk:open-enquiry')));
  }
  await page.getByRole('dialog').waitFor();
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...devices['iPad Pro 11'],
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  // --------------------------------------------------------------------------
  // 1. Tablet homepage hero — brand-first responsive composition
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await settle(page, 600);
  await dismissChrome(page);
  await page.locator('.hero h1').waitFor({ state: 'visible' });
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page, 300);
  await shot(page, '01-tablet-homepage-hero.png');

  // --------------------------------------------------------------------------
  // 2. Menu filtering — semantic menu + dietary filters at mid width
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/menu/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  // Below 960px filters collapse behind a toggle — open them for the case-study crop.
  const filtersToggle = page.getByRole('button', { name: /Show filters/i });
  if (await filtersToggle.isVisible().catch(() => false)) {
    await filtersToggle.click();
    await settle(page, 250);
  }
  const search = page.getByLabel('Search dishes');
  await search.waitFor({ state: 'visible' });
  await search.scrollIntoViewIfNeeded();
  await search.fill('salad');
  await page.locator('.check', { hasText: 'Vegetarian' }).locator('input').check();
  await settle(page, 350);
  await page.locator('.menu-filters').scrollIntoViewIfNeeded();
  await settle(page, 200);
  await shot(page, '02-tablet-menu-filtering.png');

  // --------------------------------------------------------------------------
  // 3. Reservation demo completion — conversion CTA moment
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/reservations/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  await page.getByLabel('Party size').selectOption('4');
  await page.getByRole('button', { name: 'Find a Demo Table' }).click();
  await page.getByLabel('Seating preference').selectOption('window');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('button', { name: 'Complete Demo Reservation' }).click();
  await page.getByRole('heading', { name: 'Reservation experience complete.' }).waitFor();
  await page.evaluate(() => {
    document.querySelector('.reserve')?.scrollIntoView({ block: 'center' });
  });
  await settle(page, 350);
  await shot(page, '03-tablet-reservation-complete.png');

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
  await page.getByRole('dialog', { name: 'Demo cart' }).waitFor();
  await settle(page, 350);
  await shot(page, '04-tablet-pickup-cart-drawer.png');

  // --------------------------------------------------------------------------
  // 5. Che Xu Studio enquiry drawer
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  await openEnquiry(page);
  await settle(page, 400);
  await shot(page, '05-tablet-studio-enquiry-drawer.png');

  await browser.close();
  console.log(`\nSaved recommended tablet screenshots to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
