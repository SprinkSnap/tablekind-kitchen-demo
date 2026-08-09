/**
 * Copy the single best desktop / tablet / mobile frames into the work-page media kit.
 *
 * Usage (after npm run screenshots):
 *   node scripts/assemble-showcase-screenshots.mjs [screenshotsRoot]
 */
import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.argv[2] ?? 'docs/screenshots';
const showcaseDir = path.join(root, 'showcase');

const picks = [
  {
    from: path.join(root, 'desktop', '01-desktop-homepage-hero.png'),
    to: path.join(showcaseDir, 'showcase-desktop-homepage-hero.png'),
  },
  {
    from: path.join(root, 'tablet', '01-tablet-homepage-hero.png'),
    to: path.join(showcaseDir, 'showcase-tablet-homepage-hero.png'),
  },
  {
    from: path.join(root, 'mobile', '01-mobile-homepage-sticky-actions.png'),
    to: path.join(showcaseDir, 'showcase-mobile-homepage-sticky-actions.png'),
  },
];

await mkdir(showcaseDir, { recursive: true });

for (const { from, to } of picks) {
  await copyFile(from, to);
  console.log(`✓ ${to}`);
}

console.log(`\nWork-page showcase kit ready in ${showcaseDir}`);
