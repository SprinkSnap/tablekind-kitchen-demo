import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const productDir = join(root, 'public/images/products');
const collectionDir = join(root, 'public/images/collections');
mkdirSync(productDir, { recursive: true });
mkdirSync(collectionDir, { recursive: true });
mkdirSync(join(root, 'public/images'), { recursive: true });
mkdirSync(join(root, 'public/og'), { recursive: true });
mkdirSync(join(root, 'public/brand'), { recursive: true });

const pine = '#173B32';
const dark = '#102820';
const harbour = '#285B68';
const sand = '#E8DDCC';
const linen = '#F7F3EC';
const porcelain = '#FFFEFB';
const clay = '#B96F52';
const charcoal = '#242824';
const sage = '#9EAF9D';

const products = [
  ['cedar-linen-throw', sand, sage, 'Throw'],
  ['harbour-cushion-cover', harbour, linen, 'Cushion'],
  ['stoneware-bud-vase', clay, sage, 'Vase'],
  ['pine-serving-tray', sand, pine, 'Tray'],
  ['riverstone-mug', linen, harbour, 'Mug'],
  ['ash-cutting-board', sand, clay, 'Board'],
  ['linen-napkin-set', linen, sage, 'Napkins'],
  ['coastal-dinner-plate', linen, harbour, 'Plate'],
  ['willow-storage-basket', sand, charcoal, 'Basket'],
  ['brass-wall-hook-set', sand, clay, 'Hooks'],
  ['canvas-bin', linen, sage, 'Bin'],
  ['desk-organizer-tray', charcoal, harbour, 'Desk tray'],
  ['ceramic-pen-cup', sage, clay, 'Pen cup'],
  ['linen-desk-mat', linen, sage, 'Desk mat'],
  ['concrete-planter', sand, charcoal, 'Planter'],
  ['gift-candle-tray', clay, sage, 'Tray'],
  ['welcome-guest-set', linen, harbour, 'Gift set'],
  ['soft-living-throw-pillow', harbour, linen, 'Pillow'],
  ['woven-floor-basket', sand, pine, 'Floor basket'],
  ['ceramic-fruit-bowl', linen, clay, 'Bowl'],
  ['everyday-tea-towel', linen, harbour, 'Tea towel'],
  ['bookshelf-object', charcoal, clay, 'Object'],
];

function productSvg(accent, secondary, label) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200" role="img" aria-label="${label}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${dark}"/>
      <stop offset="55%" stop-color="${pine}"/>
      <stop offset="100%" stop-color="${charcoal}"/>
    </linearGradient>
    <radialGradient id="glow" cx="48%" cy="38%" r="52%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <circle cx="620" cy="420" r="320" fill="url(#glow)"/>
  <ellipse cx="600" cy="860" rx="280" ry="40" fill="#000" opacity="0.16"/>
  <rect x="310" y="300" width="580" height="520" rx="36" fill="${porcelain}" opacity="0.96"/>
  <rect x="360" y="360" width="480" height="360" rx="28" fill="${secondary}" opacity="0.22"/>
  <path d="M420 560c40-120 120-180 180-180s140 60 180 180c-40 100-110 150-180 150s-140-50-180-150z" fill="${accent}" opacity="0.92"/>
  <path d="M470 530c50-24 120-24 170 0" stroke="${porcelain}" stroke-width="10" stroke-linecap="round" fill="none" opacity="0.5"/>
  <circle cx="560" cy="500" r="16" fill="${porcelain}" opacity="0.65"/>
  <text x="600" y="1080" text-anchor="middle" fill="${linen}" font-family="Georgia, serif" font-size="44" opacity="0.88">${label}</text>
</svg>`;
}

for (const [slug, accent, secondary, label] of products) {
  writeFileSync(join(productDir, `${slug}.svg`), productSvg(accent, secondary, label));
}

const collections = [
  ['living', sage, sand, 'Living'],
  ['kitchen-dining', clay, linen, 'Kitchen'],
  ['textiles', harbour, linen, 'Textiles'],
  ['storage', sand, pine, 'Storage'],
  ['workspace', charcoal, harbour, 'Workspace'],
  ['gifts', clay, sage, 'Gifts'],
];

function collectionSvg(accent, secondary, label) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="1050" viewBox="0 0 1400 1050" role="img" aria-label="${label} collection">
  <defs>
    <linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${dark}"/>
      <stop offset="100%" stop-color="${pine}"/>
    </linearGradient>
  </defs>
  <rect width="1400" height="1050" fill="url(#cbg)"/>
  <circle cx="980" cy="280" r="260" fill="${accent}" opacity="0.35"/>
  <circle cx="320" cy="720" r="220" fill="${secondary}" opacity="0.28"/>
  <rect x="180" y="220" width="720" height="520" rx="28" fill="${porcelain}" opacity="0.12"/>
  <text x="220" y="880" fill="${linen}" font-family="Georgia, serif" font-size="72">${label}</text>
</svg>`;
}

for (const [slug, accent, secondary, label] of collections) {
  writeFileSync(join(collectionDir, `${slug}.svg`), collectionSvg(accent, secondary, label));
}

const hero = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080" role="img" aria-label="Calm modern living space with natural textures">
  <defs>
    <linearGradient id="h" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${dark}"/>
      <stop offset="45%" stop-color="${pine}"/>
      <stop offset="100%" stop-color="${harbour}"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#h)"/>
  <ellipse cx="1280" cy="420" rx="420" ry="300" fill="${sand}" opacity="0.18"/>
  <ellipse cx="520" cy="680" rx="380" ry="220" fill="${sage}" opacity="0.2"/>
  <rect x="240" y="280" width="620" height="420" rx="24" fill="${porcelain}" opacity="0.1"/>
  <rect x="980" y="360" width="520" height="340" rx="24" fill="${linen}" opacity="0.14"/>
  <circle cx="1180" cy="520" r="90" fill="${clay}" opacity="0.35"/>
  <text x="260" y="960" fill="${linen}" font-family="Georgia, serif" font-size="48" opacity="0.75">Harbour &amp; Pine Home</text>
</svg>`;
writeFileSync(join(root, 'public/images/hero-home.svg'), hero);

const rooms = [
  ['living-room', sage, 'Living room'],
  ['dining-area', clay, 'Dining area'],
  ['kitchen', harbour, 'Kitchen'],
  ['workspace', charcoal, 'Workspace'],
];
for (const [slug, accent, label] of rooms) {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img" aria-label="${label}">
  <rect width="1200" height="900" fill="${dark}"/>
  <rect x="80" y="80" width="1040" height="740" rx="20" fill="${pine}" opacity="0.7"/>
  <circle cx="860" cy="320" r="180" fill="${accent}" opacity="0.4"/>
  <rect x="160" y="520" width="420" height="200" rx="16" fill="${sand}" opacity="0.25"/>
  <text x="180" y="780" fill="${linen}" font-family="Georgia, serif" font-size="48">${label}</text>
</svg>`;
  writeFileSync(join(root, `public/images/${slug}.svg`), svg);
}

const og = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="Harbour and Pine Home">
  <rect width="1200" height="630" fill="${dark}"/>
  <circle cx="980" cy="120" r="200" fill="${harbour}" opacity="0.35"/>
  <circle cx="180" cy="520" r="160" fill="${sage}" opacity="0.3"/>
  <text x="80" y="280" fill="${linen}" font-family="Georgia, serif" font-size="64">Harbour &amp; Pine Home</text>
  <text x="80" y="360" fill="${sand}" font-family="Arial, sans-serif" font-size="28">Thoughtful pieces for everyday living.</text>
  <text x="80" y="520" fill="${sage}" font-family="Arial, sans-serif" font-size="20">Portfolio concept by Che Xu Studio</text>
</svg>`;
writeFileSync(join(root, 'public/og/default.svg'), og);

const monogram = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96" role="img" aria-label="Harbour and Pine monogram">
  <rect width="96" height="96" rx="18" fill="${pine}"/>
  <text x="48" y="58" text-anchor="middle" fill="${linen}" font-family="Georgia, serif" font-size="28" font-weight="700">H&amp;P</text>
</svg>`;
writeFileSync(join(root, 'public/brand/hp-monogram.svg'), monogram);

console.log(`Generated ${products.length} products, ${collections.length} collections, hero, rooms, OG and monogram.`);
