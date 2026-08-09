/**
 * Capture recommended desktop case-study screenshots for Tablekind Kitchen.
 * Viewport: 1440×900 @ 2× — full-bleed hero, no DevTools chrome.
 *
 * Usage:
 *   node scripts/capture-desktop-screenshots.mjs [baseURL] [outDir]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.argv[2] ?? 'http://127.0.0.1:4321';
const outDir = process.argv[3] ?? 'docs/screenshots/desktop';

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
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  // --------------------------------------------------------------------------
  // 1. Desktop homepage hero — full-bleed brand composition
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await settle(page, 600);
  await dismissChrome(page);
  await page.locator('.hero h1').waitFor({ state: 'visible' });
  // Ensure we are scrolled to the very top for a clean first-viewport crop
  await page.evaluate(() => window.scrollTo(0, 0));
  await settle(page, 300);
  await shot(page, '01-desktop-homepage-hero.png');

  // --------------------------------------------------------------------------
  // 2. Menu filtering — search + dietary + results on wide layout
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/menu/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  const search = page.getByLabel('Search dishes');
  await search.scrollIntoViewIfNeeded();
  await search.fill('salad');
  await page.locator('.check', { hasText: 'Vegetarian' }).locator('input').check();
  await settle(page, 350);
  await page.locator('.menu-filters').scrollIntoViewIfNeeded();
  await settle(page, 200);
  await shot(page, '02-desktop-menu-filtering.png');

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
  await page.getByRole('heading', { name: 'Reservation experience complete.' }).waitFor();
  await page.evaluate(() => {
    document.querySelector('.reserve')?.scrollIntoView({ block: 'center' });
  });
  await settle(page, 350);
  await shot(page, '03-desktop-reservation-complete.png');

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
  await shot(page, '04-desktop-pickup-cart-drawer.png');

  // --------------------------------------------------------------------------
  // 5. Che Xu Studio enquiry drawer
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  await openEnquiry(page);
  await settle(page, 400);
  await shot(page, '05-desktop-studio-enquiry-drawer.png');

  // --------------------------------------------------------------------------
  // 6. Reservation step 1 — booking form (classic portfolio shot)
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/reservations/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  await page.evaluate(() => {
    document.querySelector('.reserve')?.scrollIntoView({ block: 'center' });
  });
  await settle(page, 300);
  await shot(page, '06-desktop-reservation-form.png');

  // --------------------------------------------------------------------------
  // 7. Dining options section — four clear paths below the hero
  // --------------------------------------------------------------------------
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  await settle(page, 400);
  await dismissChrome(page);
  const dining = page.getByRole('heading', { name: /Choose How You Gather/i });
  await dining.waitFor({ state: 'visible' });
  await page.evaluate(() => {
    const el = document.getElementById('dining-options') ?? document.querySelector('#dining-options, .option-grid')?.closest('section');
    (el || document.querySelector('.option-grid')?.closest('section'))?.scrollIntoView({ block: 'start' });
  });
  await settle(page, 350);
  await shot(page, '07-desktop-dining-options.png');

  // --------------------------------------------------------------------------
  // 8. Order browse — pickup dishes on wide layout
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
  await page
    .getByRole('button', { name: /Orchard Pancake|Garden Spritz|Maple Ginger|Halloumi|Salmon/i })
    .first()
    .scrollIntoViewIfNeeded();
  await settle(page, 300);
  await shot(page, '08-desktop-order-browse.png');

  await browser.close();
  console.log(`\nSaved recommended desktop screenshots to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
