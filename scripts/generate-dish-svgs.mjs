import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/images/dishes');
mkdirSync(outDir, { recursive: true });
mkdirSync(join(root, 'public/images'), { recursive: true });
mkdirSync(join(root, 'public/og'), { recursive: true });

const dishes = [
  // orchard-pancake / trout-toast / market-greens / chicken-sandwich use .webp photo assets
  ['garden-scramble', '#A9B8A4', '#18392B', 'Scramble'],
  ['mushroom-benny', '#18392B', '#C99A45', 'Benny'],
  ['citrus-granola', '#C99A45', '#FFFDFC', 'Granola'],
  ['tomato-farro', '#C76548', '#18392B', 'Farro'],
  ['cedar-salmon', '#C76548', '#C99A45', 'Salmon'],
  ['squash-soup', '#C99A45', '#18392B', 'Soup'],
  ['halloumi-bites', '#C99A45', '#C76548', 'Halloumi'],
  ['charred-broccoli', '#18392B', '#A9B8A4', 'Broccoli'],
  ['whipped-ricotta', '#FFFDFC', '#C99A45', 'Ricotta'],
  ['carrot-fritters', '#C76548', '#C99A45', 'Fritters'],
  ['maple-chicken', '#C76548', '#18392B', 'Chicken'],
  ['mushroom-risotto', '#A9B8A4', '#10271E', 'Risotto'],
  ['steelhead-lentils', '#C76548', '#18392B', 'Steelhead'],
  ['short-rib', '#10271E', '#C76548', 'Short rib'],
  ['cabbage-steak', '#18392B', '#A9B8A4', 'Cabbage'],
  ['crispy-potatoes', '#C99A45', '#F7F2E8', 'Potatoes'],
  ['seasonal-greens', '#18392B', '#A9B8A4', 'Greens'],
  ['warm-bread', '#C99A45', '#F7F2E8', 'Bread'],
  ['chocolate-budino', '#10271E', '#C99A45', 'Budino'],
  ['lemon-cake', '#C99A45', '#FFFDFC', 'Cake'],
  ['berry-pavlova', '#C76548', '#FFFDFC', 'Pavlova'],
  ['pear-crumble', '#C99A45', '#18392B', 'Crumble'],
  ['garden-spritz', '#A9B8A4', '#18392B', 'Spritz'],
  ['maple-ginger', '#C99A45', '#C76548', 'Soda'],
  ['earl-grey', '#18392B', '#F7F2E8', 'Latte'],
  ['cold-brew', '#10271E', '#C99A45', 'Cold brew'],
];

function dishSvg(accent, secondary, label) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10271E"/>
      <stop offset="55%" stop-color="#18392B"/>
      <stop offset="100%" stop-color="#222622"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <circle cx="620" cy="340" r="280" fill="url(#glow)"/>
  <ellipse cx="600" cy="620" rx="320" ry="48" fill="#000" opacity="0.18"/>
  <circle cx="600" cy="430" r="210" fill="#F7F2E8" opacity="0.96"/>
  <circle cx="600" cy="430" r="168" fill="${secondary}" opacity="0.22"/>
  <path d="M430 430c30-90 90-140 170-140s140 50 170 140c-35 70-95 110-170 110s-135-40-170-110z" fill="${accent}" opacity="0.9"/>
  <path d="M470 410c40-20 90-20 130 0" stroke="#FFFDFC" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.55"/>
  <circle cx="560" cy="390" r="18" fill="#FFFDFC" opacity="0.7"/>
  <circle cx="640" cy="405" r="12" fill="#FFFDFC" opacity="0.55"/>
  <text x="600" y="820" text-anchor="middle" fill="#F7F2E8" font-family="Georgia, serif" font-size="42" opacity="0.85">${label}</text>
</svg>`;
}

for (const [slug, accent, secondary, label] of dishes) {
  writeFileSync(join(outDir, `${slug}.svg`), dishSvg(accent, secondary, label));
}

const hero = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-label="Shared table with seasonal dishes">
  <defs>
    <linearGradient id="h" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10271E"/>
      <stop offset="50%" stop-color="#18392B"/>
      <stop offset="100%" stop-color="#222622"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#h)"/>
  <ellipse cx="960" cy="700" rx="720" ry="180" fill="#000" opacity="0.2"/>
  <rect x="420" y="430" width="1080" height="360" rx="40" fill="#F7F2E8" opacity="0.92"/>
  <circle cx="700" cy="560" r="110" fill="#C76548" opacity="0.85"/>
  <circle cx="960" cy="540" r="130" fill="#C99A45" opacity="0.8"/>
  <circle cx="1220" cy="570" r="100" fill="#A9B8A4" opacity="0.9"/>
  <rect x="560" y="700" width="180" height="24" rx="12" fill="#18392B" opacity="0.2"/>
  <rect x="880" y="700" width="180" height="24" rx="12" fill="#18392B" opacity="0.2"/>
  <rect x="1180" y="700" width="180" height="24" rx="12" fill="#18392B" opacity="0.2"/>
  <text x="960" y="250" text-anchor="middle" fill="#F7F2E8" font-family="Georgia, serif" font-size="64">Seasonal food, made for gathering.</text>
</svg>`;
writeFileSync(join(root, 'public/images/hero-table.svg'), hero);

const og = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#10271E"/>
  <circle cx="980" cy="140" r="180" fill="#C76548" opacity="0.35"/>
  <circle cx="180" cy="520" r="160" fill="#C99A45" opacity="0.28"/>
  <text x="80" y="250" fill="#F7F2E8" font-family="Georgia, serif" font-size="72">Tablekind Kitchen</text>
  <text x="80" y="330" fill="#A9B8A4" font-family="Arial, sans-serif" font-size="34">Seasonal food, made for gathering.</text>
  <text x="80" y="520" fill="#F7F2E8" font-family="Arial, sans-serif" font-size="24">Portfolio concept by Che Xu Studio</text>
</svg>`;
writeFileSync(join(root, 'public/og/default.svg'), og);

console.log(`Generated ${dishes.length} dish SVGs + hero + OG`);
