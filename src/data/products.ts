export type CollectionSlug =
  | 'living'
  | 'kitchen-dining'
  | 'textiles'
  | 'storage'
  | 'workspace'
  | 'gifts';

export type ColourFamily =
  | 'pine'
  | 'sand'
  | 'clay'
  | 'linen'
  | 'charcoal'
  | 'harbour'
  | 'sage';

export type ProductVariant = {
  id: string;
  name: string;
  /** Optional price override; defaults to product.price */
  price?: number;
  colour?: ColourFamily;
  available: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  collection: CollectionSlug;
  categories: string[];
  images: string[];
  imageAlt: string[];
  variants: ProductVariant[];
  materials: string[];
  dimensions: string;
  care: string;
  colour: ColourFamily;
  featured: boolean;
  newArrival: boolean;
  available: boolean;
  relatedProductIds: string[];
  seoTitle: string;
  seoDescription: string;
  rooms?: Array<'living-room' | 'dining-area' | 'kitchen' | 'workspace'>;
};

export type Collection = {
  slug: CollectionSlug;
  name: string;
  shortName: string;
  description: string;
  longDescription: string;
  image: string;
  imageAlt: string;
  seoTitle: string;
  seoDescription: string;
};

export const COLLECTIONS: Collection[] = [
  {
    slug: 'living',
    name: 'Living',
    shortName: 'Living',
    description: 'Soft seating accents, trays and objects for calm living rooms.',
    longDescription:
      'Pieces chosen for everyday living rooms—throws, cushions, trays and decorative objects that feel considered without fuss.',
    image: '/images/collections/living.svg',
    imageAlt: 'Soft linen throw and ceramic vase styled on a living-room surface',
    seoTitle: 'Living Collection',
    seoDescription:
      'Browse living-room accents from Harbour & Pine Home—throws, cushions, trays and decorative objects for everyday comfort.',
  },
  {
    slug: 'kitchen-dining',
    name: 'Kitchen & Dining',
    shortName: 'Kitchen',
    description: 'Tableware, boards and linens for shared meals.',
    longDescription:
      'Practical tableware and serving pieces designed for daily meals and easy hosting—clear materials, durable forms, calm colours.',
    image: '/images/collections/kitchen-dining.svg',
    imageAlt: 'Ceramic dinnerware and wooden serving board on a dining table',
    seoTitle: 'Kitchen & Dining Collection',
    seoDescription:
      'Explore kitchen and dining essentials—mugs, boards, linens and serving pieces for everyday tables.',
  },
  {
    slug: 'textiles',
    name: 'Textiles',
    shortName: 'Textiles',
    description: 'Throws, cushions and linens in soft, natural tones.',
    longDescription:
      'Layered textiles in sand, linen and sage—throws, cushions and table linens with clear care guidance and lasting comfort.',
    image: '/images/collections/textiles.svg',
    imageAlt: 'Folded throw and cushion covers in warm sand and sage tones',
    seoTitle: 'Textiles Collection',
    seoDescription:
      'Shop throws, cushions and table linens in soft natural tones from Harbour & Pine Home.',
  },
  {
    slug: 'storage',
    name: 'Storage',
    shortName: 'Storage',
    description: 'Baskets, hooks and organizers that keep spaces tidy.',
    longDescription:
      'Open and closed storage for entries, closets and living areas—baskets, wall hooks and organizers that look as calm as they work.',
    image: '/images/collections/storage.svg',
    imageAlt: 'Woven baskets and wall hooks arranged in a tidy entryway',
    seoTitle: 'Storage Collection',
    seoDescription:
      'Discover baskets, hooks and organizers designed to keep everyday spaces tidy and calm.',
  },
  {
    slug: 'workspace',
    name: 'Workspace',
    shortName: 'Workspace',
    description: 'Desk organizers and tools for focused work at home.',
    longDescription:
      'Desktop organizers, trays and accessories that keep work surfaces clear—practical pieces for home offices and shared tables.',
    image: '/images/collections/workspace.svg',
    imageAlt: 'Desk organizer with notebooks and a ceramic pen cup',
    seoTitle: 'Workspace Collection',
    seoDescription:
      'Shop desk organizers and workspace accents for a calmer, more focused home office.',
  },
  {
    slug: 'gifts',
    name: 'Gifts',
    shortName: 'Gifts',
    description: 'Ready-to-give sets and thoughtful home accents.',
    longDescription:
      'Curated gift-friendly pieces and small sets—easy to wrap, useful every day, and free of invented promotions or scarcity claims.',
    image: '/images/collections/gifts.svg',
    imageAlt: 'Gift-ready mug, candle tray and linen napkin set',
    seoTitle: 'Gifts Collection',
    seoDescription:
      'Find thoughtful home gifts—small sets and everyday accents ready to give.',
  },
];

export const COLOUR_LABELS: Record<ColourFamily, string> = {
  pine: 'Pine',
  sand: 'Sand',
  clay: 'Clay',
  linen: 'Linen',
  charcoal: 'Charcoal',
  harbour: 'Harbour',
  sage: 'Sage',
};

export const PRODUCTS: Product[] = [
  {
    id: 'hp-001',
    slug: 'cedar-linen-throw',
    name: 'Cedar Linen Throw',
    shortDescription: 'A soft, mid-weight throw for sofas and reading chairs.',
    description:
      'Woven from washed linen-cotton, the Cedar Throw drapes easily and softens with use. Hemmed edges keep it tidy on sofas, beds and daybeds. Choose from three calm colourways that layer with most living-room palettes.',
    price: 89,
    collection: 'textiles',
    categories: ['throws', 'living accents'],
    images: ['/images/products/cedar-linen-throw.svg'],
    imageAlt: ['Folded cedar linen throw in warm sand tone'],
    variants: [
      { id: 'cedar-sand', name: 'Sand', colour: 'sand', available: true },
      { id: 'cedar-sage', name: 'Sage', colour: 'sage', available: true },
      { id: 'cedar-pine', name: 'Pine', colour: 'pine', available: true },
    ],
    materials: ['55% linen', '45% cotton'],
    dimensions: '130 × 180 cm',
    care: 'Machine wash cold, gentle cycle. Line dry. Warm iron if needed.',
    colour: 'sand',
    featured: true,
    newArrival: true,
    available: true,
    relatedProductIds: ['hp-002', 'hp-003', 'hp-018'],
    seoTitle: 'Cedar Linen Throw',
    seoDescription:
      'Soft mid-weight linen-cotton throw in sand, sage or pine. Everyday comfort for living rooms.',
    rooms: ['living-room'],
  },
  {
    id: 'hp-002',
    slug: 'harbour-cushion-cover',
    name: 'Harbour Cushion Cover',
    shortDescription: 'A structured cover with a hidden zipper and clean finish.',
    description:
      'The Harbour Cushion Cover uses a dense cotton weave with a discreet zipper. Insert sold separately so you can mix densities. Ideal for sofas and window seats in living rooms.',
    price: 42,
    collection: 'textiles',
    categories: ['cushions', 'living accents'],
    images: ['/images/products/harbour-cushion-cover.svg'],
    imageAlt: ['Square harbour cushion cover in harbour blue'],
    variants: [
      { id: 'harbour-50', name: '50 × 50 cm / Harbour', colour: 'harbour', available: true },
      { id: 'harbour-linen-50', name: '50 × 50 cm / Linen', colour: 'linen', available: true },
      { id: 'harbour-40', name: '40 × 40 cm / Harbour', colour: 'harbour', available: true },
    ],
    materials: ['100% cotton'],
    dimensions: '40 × 40 cm or 50 × 50 cm (cover only)',
    care: 'Remove cover. Machine wash cold. Tumble dry low.',
    colour: 'harbour',
    featured: true,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-001', 'hp-003', 'hp-019'],
    seoTitle: 'Harbour Cushion Cover',
    seoDescription:
      'Structured cotton cushion cover with hidden zipper in harbour or linen. Cover only.',
    rooms: ['living-room'],
  },
  {
    id: 'hp-003',
    slug: 'stoneware-bud-vase',
    name: 'Stoneware Bud Vase',
    shortDescription: 'A compact vase for single stems or small cuttings.',
    description:
      'Hand-finished stoneware with a matte glaze. The narrow neck holds a single stem or a small cluster without crowding. Weighted base keeps it steady on shelves and side tables.',
    price: 36,
    collection: 'living',
    categories: ['vases', 'decorative objects'],
    images: ['/images/products/stoneware-bud-vase.svg'],
    imageAlt: ['Matte stoneware bud vase in clay glaze'],
    variants: [
      { id: 'vase-clay', name: 'Clay', colour: 'clay', available: true },
      { id: 'vase-sage', name: 'Sage', colour: 'sage', available: true },
      { id: 'vase-charcoal', name: 'Charcoal', colour: 'charcoal', available: true },
    ],
    materials: ['Stoneware clay', 'Matte glaze'],
    dimensions: 'H 14 cm × Ø 7 cm',
    care: 'Hand wash. Avoid sudden temperature changes.',
    colour: 'clay',
    featured: true,
    newArrival: true,
    available: true,
    relatedProductIds: ['hp-004', 'hp-001', 'hp-020'],
    seoTitle: 'Stoneware Bud Vase',
    seoDescription:
      'Compact matte stoneware bud vase for single stems. Available in clay, sage or charcoal.',
    rooms: ['living-room', 'dining-area'],
  },
  {
    id: 'hp-004',
    slug: 'pine-serving-tray',
    name: 'Pine Serving Tray',
    shortDescription: 'A solid wood tray with easy-grip cutout handles.',
    description:
      'Made from solid pine with a natural oil finish. Cutout handles make it easy to carry coffee, books or a light meal from kitchen to sofa. The shallow rim keeps items secure.',
    price: 68,
    collection: 'living',
    categories: ['trays', 'serving'],
    images: ['/images/products/pine-serving-tray.svg'],
    imageAlt: ['Solid pine serving tray with cutout handles'],
    variants: [
      { id: 'tray-natural', name: 'Natural pine', colour: 'sand', available: true },
      { id: 'tray-dark', name: 'Dark pine', colour: 'pine', available: true },
    ],
    materials: ['Solid pine', 'Food-safe oil finish'],
    dimensions: '45 × 30 × 5 cm',
    care: 'Wipe with a damp cloth. Re-oil occasionally. Not dishwasher safe.',
    colour: 'sand',
    featured: true,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-005', 'hp-008', 'hp-001'],
    seoTitle: 'Pine Serving Tray',
    seoDescription:
      'Solid pine serving tray with cutout handles. Natural or dark oil finish for everyday living.',
    rooms: ['living-room', 'dining-area', 'kitchen'],
  },
  {
    id: 'hp-005',
    slug: 'riverstone-mug',
    name: 'Riverstone Mug',
    shortDescription: 'A generous everyday mug with a comfortable handle.',
    description:
      'Stoneware mug with a soft, rounded profile and a handle that fits naturally in hand. Holds a generous coffee or tea without feeling oversized. Stacks neatly for cupboard storage.',
    price: 28,
    collection: 'kitchen-dining',
    categories: ['mugs', 'tableware'],
    images: ['/images/products/riverstone-mug.svg'],
    imageAlt: ['Stoneware mug in soft linen glaze'],
    variants: [
      { id: 'mug-linen', name: 'Linen', colour: 'linen', available: true },
      { id: 'mug-harbour', name: 'Harbour', colour: 'harbour', available: true },
      { id: 'mug-clay', name: 'Clay', colour: 'clay', available: true },
    ],
    materials: ['Stoneware', 'Food-safe glaze'],
    dimensions: '350 ml · H 9.5 cm',
    care: 'Dishwasher and microwave safe.',
    colour: 'linen',
    featured: true,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-006', 'hp-007', 'hp-021'],
    seoTitle: 'Riverstone Mug',
    seoDescription:
      'Generous stoneware mug with a comfortable handle. Available in linen, harbour or clay.',
    rooms: ['kitchen', 'workspace', 'dining-area'],
  },
  {
    id: 'hp-006',
    slug: 'ash-cutting-board',
    name: 'Ash Cutting Board',
    shortDescription: 'A reversible board for prep and serving.',
    description:
      'Thick ash board with juice groove on one side and a flat serving surface on the other. Rounded corners and a hanging hole for easy storage. Suitable for daily chopping and cheese boards.',
    price: 74,
    collection: 'kitchen-dining',
    categories: ['boards', 'kitchen tools'],
    images: ['/images/products/ash-cutting-board.svg'],
    imageAlt: ['Thick ash cutting board with juice groove'],
    variants: [
      { id: 'board-medium', name: 'Medium · 40 × 28 cm', available: true },
      { id: 'board-large', name: 'Large · 48 × 32 cm', price: 92, available: true },
    ],
    materials: ['Solid ash', 'Food-safe mineral oil'],
    dimensions: 'Medium 40 × 28 × 2.5 cm · Large 48 × 32 × 2.5 cm',
    care: 'Hand wash and dry promptly. Oil monthly. Do not soak.',
    colour: 'sand',
    featured: true,
    newArrival: true,
    available: true,
    relatedProductIds: ['hp-005', 'hp-007', 'hp-004'],
    seoTitle: 'Ash Cutting Board',
    seoDescription:
      'Reversible ash cutting board with juice groove. Medium and large sizes for prep and serving.',
    rooms: ['kitchen', 'dining-area'],
  },
  {
    id: 'hp-007',
    slug: 'linen-napkin-set',
    name: 'Linen Napkin Set',
    shortDescription: 'A set of four washed-linen napkins.',
    description:
      'Soft washed linen napkins that improve with every wash. Sold as a set of four in a single colour. Pair with the Everyday Table Set for a coordinated look.',
    price: 48,
    collection: 'kitchen-dining',
    categories: ['table linens', 'textiles'],
    images: ['/images/products/linen-napkin-set.svg'],
    imageAlt: ['Folded set of four washed linen napkins'],
    variants: [
      { id: 'napkin-linen', name: 'Linen', colour: 'linen', available: true },
      { id: 'napkin-sage', name: 'Sage', colour: 'sage', available: true },
      { id: 'napkin-clay', name: 'Clay', colour: 'clay', available: true },
    ],
    materials: ['100% linen'],
    dimensions: '40 × 40 cm each · Set of 4',
    care: 'Machine wash cold. Line dry or tumble low. Iron while damp for a crisp finish.',
    colour: 'linen',
    featured: false,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-005', 'hp-008', 'hp-001'],
    seoTitle: 'Linen Napkin Set',
    seoDescription:
      'Set of four washed-linen napkins in linen, sage or clay. Softens with every wash.',
    rooms: ['dining-area', 'kitchen'],
  },
  {
    id: 'hp-008',
    slug: 'coastal-dinner-plate',
    name: 'Coastal Dinner Plate',
    shortDescription: 'A wide, rimmed plate for everyday meals.',
    description:
      'Stoneware dinner plate with a gentle rim and matte glaze. Wide enough for generous portions, stackable for storage. Sold individually so you can build a set at your pace.',
    price: 32,
    collection: 'kitchen-dining',
    categories: ['tableware', 'plates'],
    images: ['/images/products/coastal-dinner-plate.svg'],
    imageAlt: ['Wide stoneware dinner plate in soft linen glaze'],
    variants: [
      { id: 'plate-linen', name: 'Linen', colour: 'linen', available: true },
      { id: 'plate-harbour', name: 'Harbour', colour: 'harbour', available: true },
    ],
    materials: ['Stoneware', 'Food-safe glaze'],
    dimensions: 'Ø 27 cm',
    care: 'Dishwasher and microwave safe.',
    colour: 'linen',
    featured: false,
    newArrival: true,
    available: true,
    relatedProductIds: ['hp-005', 'hp-007', 'hp-006'],
    seoTitle: 'Coastal Dinner Plate',
    seoDescription:
      'Wide rimmed stoneware dinner plate in linen or harbour glaze. Sold individually.',
    rooms: ['dining-area', 'kitchen'],
  },
  {
    id: 'hp-009',
    slug: 'willow-storage-basket',
    name: 'Willow Storage Basket',
    shortDescription: 'An open weave basket for blankets, toys or laundry.',
    description:
      'Handwoven willow with reinforced handles. Open weave keeps contents breathable. Use in living rooms for throws, in bedrooms for laundry, or in entries for shoes and bags.',
    price: 64,
    collection: 'storage',
    categories: ['baskets', 'organizers'],
    images: ['/images/products/willow-storage-basket.svg'],
    imageAlt: ['Handwoven willow storage basket with handles'],
    variants: [
      { id: 'basket-medium', name: 'Medium', available: true },
      { id: 'basket-large', name: 'Large', price: 78, available: true },
    ],
    materials: ['Willow', 'Cotton handles'],
    dimensions: 'Medium Ø 40 × H 35 cm · Large Ø 48 × H 42 cm',
    care: 'Dust or wipe with a dry cloth. Keep dry.',
    colour: 'sand',
    featured: true,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-010', 'hp-001', 'hp-011'],
    seoTitle: 'Willow Storage Basket',
    seoDescription:
      'Handwoven willow basket with reinforced handles. Medium and large sizes for everyday storage.',
    rooms: ['living-room'],
  },
  {
    id: 'hp-010',
    slug: 'brass-wall-hook-set',
    name: 'Brass Wall Hook Set',
    shortDescription: 'A set of three solid brass hooks for coats and bags.',
    description:
      'Solid brass hooks with a warm unlacquered finish that develops a natural patina. Includes wall anchors for drywall. Sold as a set of three for entries, bathrooms or bedrooms.',
    price: 38,
    collection: 'storage',
    categories: ['hooks', 'wall organizers'],
    images: ['/images/products/brass-wall-hook-set.svg'],
    imageAlt: ['Set of three solid brass wall hooks'],
    variants: [
      { id: 'hooks-brass', name: 'Unlacquered brass', colour: 'sand', available: true },
      { id: 'hooks-charcoal', name: 'Charcoal metal', colour: 'charcoal', available: true },
    ],
    materials: ['Solid brass or powder-coated steel'],
    dimensions: 'Projection 5 cm · Mounting plate Ø 3.5 cm · Set of 3',
    care: 'Wipe with a soft cloth. Brass will patina naturally.',
    colour: 'sand',
    featured: false,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-009', 'hp-011', 'hp-012'],
    seoTitle: 'Brass Wall Hook Set',
    seoDescription:
      'Set of three wall hooks in unlacquered brass or charcoal. Includes drywall anchors.',
    rooms: ['living-room', 'workspace'],
  },
  {
    id: 'hp-011',
    slug: 'canvas-bin',
    name: 'Canvas Storage Bin',
    shortDescription: 'A collapsible fabric bin for closets and shelves.',
    description:
      'Heavy canvas with a reinforced rim and cotton handles. Collapses flat when empty. Ideal for seasonal clothing, craft supplies or pantry overflow.',
    price: 34,
    collection: 'storage',
    categories: ['bins', 'organizers'],
    images: ['/images/products/canvas-bin.svg'],
    imageAlt: ['Heavy canvas storage bin with cotton handles'],
    variants: [
      { id: 'bin-linen', name: 'Linen', colour: 'linen', available: true },
      { id: 'bin-sage', name: 'Sage', colour: 'sage', available: true },
      { id: 'bin-charcoal', name: 'Charcoal', colour: 'charcoal', available: true },
    ],
    materials: ['Cotton canvas', 'Cardboard insert rim'],
    dimensions: '30 × 30 × 30 cm',
    care: 'Spot clean. Remove insert before washing shell if needed.',
    colour: 'linen',
    featured: false,
    newArrival: true,
    available: true,
    relatedProductIds: ['hp-009', 'hp-010', 'hp-012'],
    seoTitle: 'Canvas Storage Bin',
    seoDescription:
      'Collapsible heavy canvas storage bin in linen, sage or charcoal. Shelf and closet friendly.',
    rooms: ['living-room', 'workspace'],
  },
  {
    id: 'hp-012',
    slug: 'desk-organizer-tray',
    name: 'Desk Organizer Tray',
    shortDescription: 'A divided tray for pens, notes and small tools.',
    description:
      'Powder-coated steel tray with three compartments. Keeps pens, clips and sticky notes in place without visual clutter. Low profile fits under most monitors.',
    price: 45,
    collection: 'workspace',
    categories: ['desk organizers', 'trays'],
    images: ['/images/products/desk-organizer-tray.svg'],
    imageAlt: ['Divided steel desk organizer tray in charcoal'],
    variants: [
      { id: 'desk-charcoal', name: 'Charcoal', colour: 'charcoal', available: true },
      { id: 'desk-harbour', name: 'Harbour', colour: 'harbour', available: true },
      { id: 'desk-sand', name: 'Sand', colour: 'sand', available: true },
    ],
    materials: ['Powder-coated steel'],
    dimensions: '28 × 18 × 3.5 cm',
    care: 'Wipe with a damp cloth. Dry thoroughly.',
    colour: 'charcoal',
    featured: true,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-013', 'hp-014', 'hp-005'],
    seoTitle: 'Desk Organizer Tray',
    seoDescription:
      'Divided powder-coated steel desk tray in charcoal, harbour or sand. Low profile for monitors.',
    rooms: ['workspace'],
  },
  {
    id: 'hp-013',
    slug: 'ceramic-pen-cup',
    name: 'Ceramic Pen Cup',
    shortDescription: 'A weighted cup for pens, scissors and rulers.',
    description:
      'Thick ceramic with a soft matte exterior. Weighted base resists tipping. Wide enough for markers and scissors, narrow enough to stay tidy on a desk.',
    price: 24,
    collection: 'workspace',
    categories: ['desk organizers', 'cups'],
    images: ['/images/products/ceramic-pen-cup.svg'],
    imageAlt: ['Weighted ceramic pen cup in sage glaze'],
    variants: [
      { id: 'pen-sage', name: 'Sage', colour: 'sage', available: true },
      { id: 'pen-clay', name: 'Clay', colour: 'clay', available: true },
      { id: 'pen-linen', name: 'Linen', colour: 'linen', available: true },
    ],
    materials: ['Ceramic', 'Matte glaze'],
    dimensions: 'H 11 cm × Ø 8 cm',
    care: 'Wipe clean. Hand wash if needed.',
    colour: 'sage',
    featured: false,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-012', 'hp-014', 'hp-015'],
    seoTitle: 'Ceramic Pen Cup',
    seoDescription:
      'Weighted ceramic pen cup for desk tools. Available in sage, clay or linen.',
    rooms: ['workspace'],
  },
  {
    id: 'hp-014',
    slug: 'linen-desk-mat',
    name: 'Linen Desk Mat',
    shortDescription: 'A soft writing surface that protects your desk.',
    description:
      'Natural linen face with a non-slip backing. Soft under the wrist for writing and typing. Available in two sizes for compact desks and full workstations.',
    price: 52,
    collection: 'workspace',
    categories: ['desk mats', 'textiles'],
    images: ['/images/products/linen-desk-mat.svg'],
    imageAlt: ['Natural linen desk mat with soft surface'],
    variants: [
      { id: 'mat-compact', name: 'Compact · 60 × 35 cm / Linen', colour: 'linen', available: true },
      { id: 'mat-wide', name: 'Wide · 80 × 40 cm / Linen', colour: 'linen', price: 64, available: true },
      { id: 'mat-sage', name: 'Wide · 80 × 40 cm / Sage', colour: 'sage', price: 64, available: true },
    ],
    materials: ['Linen face', 'Natural rubber backing'],
    dimensions: 'Compact 60 × 35 cm · Wide 80 × 40 cm',
    care: 'Spot clean. Air dry flat. Do not machine wash.',
    colour: 'linen',
    featured: false,
    newArrival: true,
    available: true,
    relatedProductIds: ['hp-012', 'hp-013', 'hp-005'],
    seoTitle: 'Linen Desk Mat',
    seoDescription:
      'Soft linen desk mat with non-slip backing. Compact and wide sizes in linen or sage.',
    rooms: ['workspace'],
  },
  {
    id: 'hp-015',
    slug: 'concrete-planter',
    name: 'Concrete Desk Planter',
    shortDescription: 'A compact planter for small desk plants.',
    description:
      'Cast concrete with a sealed interior. Drainage hole and matching saucer included. Sized for small succulents, herbs or trailing plants on desks and shelves.',
    price: 39,
    collection: 'workspace',
    categories: ['planters', 'decorative objects'],
    images: ['/images/products/concrete-planter.svg'],
    imageAlt: ['Cast concrete desk planter with matching saucer'],
    variants: [
      { id: 'planter-natural', name: 'Natural concrete', colour: 'sand', available: true },
      { id: 'planter-charcoal', name: 'Charcoal', colour: 'charcoal', available: true },
    ],
    materials: ['Cast concrete', 'Sealed interior'],
    dimensions: 'Ø 12 cm × H 11 cm · Includes saucer',
    care: 'Wipe exterior. Empty saucer after watering.',
    colour: 'sand',
    featured: false,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-012', 'hp-003', 'hp-013'],
    seoTitle: 'Concrete Desk Planter',
    seoDescription:
      'Compact concrete planter with drainage and saucer. Natural or charcoal finish.',
    rooms: ['workspace', 'living-room'],
  },
  {
    id: 'hp-016',
    slug: 'gift-candle-tray',
    name: 'Gift Candle Tray',
    shortDescription: 'A ceramic tray sized for a candle and matches.',
    description:
      'Shallow ceramic tray with a soft rim—useful as a candle base, jewellery catch-all or bedside organizer. Gift-ready on its own or paired with the Riverstone Mug.',
    price: 29,
    collection: 'gifts',
    categories: ['trays', 'gifts'],
    images: ['/images/products/gift-candle-tray.svg'],
    imageAlt: ['Shallow ceramic candle tray in clay glaze'],
    variants: [
      { id: 'candle-clay', name: 'Clay', colour: 'clay', available: true },
      { id: 'candle-sage', name: 'Sage', colour: 'sage', available: true },
    ],
    materials: ['Ceramic', 'Matte glaze'],
    dimensions: 'Ø 14 cm × H 2 cm',
    care: 'Wipe clean. Hand wash.',
    colour: 'clay',
    featured: false,
    newArrival: true,
    available: true,
    relatedProductIds: ['hp-005', 'hp-017', 'hp-003'],
    seoTitle: 'Gift Candle Tray',
    seoDescription:
      'Shallow ceramic tray for candles or small objects. Clay or sage glaze—gift-ready.',
    rooms: ['living-room', 'workspace'],
  },
  {
    id: 'hp-017',
    slug: 'welcome-guest-set',
    name: 'Welcome Guest Set',
    shortDescription: 'Mug, napkin and tray—ready for overnight guests.',
    description:
      'A curated trio: one Riverstone Mug, two linen napkins and a small ceramic tray. Packaged as a coordinated set for guest rooms or housewarming gifts. Bundle pricing reflects the combined demo catalogue prices.',
    price: 96,
    collection: 'gifts',
    categories: ['gift sets', 'bundles'],
    images: ['/images/products/welcome-guest-set.svg'],
    imageAlt: ['Coordinated mug, napkins and tray gift set'],
    variants: [
      { id: 'guest-linen', name: 'Linen palette', colour: 'linen', available: true },
      { id: 'guest-sage', name: 'Sage palette', colour: 'sage', available: true },
    ],
    materials: ['Stoneware', 'Linen', 'Ceramic'],
    dimensions: 'See included product pages for individual dimensions',
    care: 'See care notes for each included piece.',
    colour: 'linen',
    featured: true,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-005', 'hp-007', 'hp-016'],
    seoTitle: 'Welcome Guest Set',
    seoDescription:
      'Coordinated guest set with mug, napkins and tray. Linen or sage palette for gifting.',
    rooms: ['living-room', 'kitchen'],
  },
  {
    id: 'hp-018',
    slug: 'soft-living-throw-pillow',
    name: 'Soft Living Throw Pillow',
    shortDescription: 'A filled cushion with removable cover.',
    description:
      'Down-alternative fill with a removable Harbour-style cover. Medium loft for sofas and reading nooks. Cover zips off for easy washing.',
    price: 58,
    collection: 'living',
    categories: ['cushions', 'living accents'],
    images: ['/images/products/soft-living-throw-pillow.svg'],
    imageAlt: ['Filled throw pillow with removable cover'],
    variants: [
      { id: 'pillow-harbour', name: 'Harbour', colour: 'harbour', available: true },
      { id: 'pillow-linen', name: 'Linen', colour: 'linen', available: true },
      { id: 'pillow-sage', name: 'Sage', colour: 'sage', available: true },
    ],
    materials: ['Cotton cover', 'Polyester fill'],
    dimensions: '45 × 45 cm',
    care: 'Remove cover; machine wash cold. Spot clean insert.',
    colour: 'harbour',
    featured: false,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-001', 'hp-002', 'hp-019'],
    seoTitle: 'Soft Living Throw Pillow',
    seoDescription:
      'Filled throw pillow with removable cotton cover in harbour, linen or sage.',
    rooms: ['living-room'],
  },
  {
    id: 'hp-019',
    slug: 'woven-floor-basket',
    name: 'Woven Floor Basket',
    shortDescription: 'A tall floor basket for magazines or blankets.',
    description:
      'Tall seagrass basket with a stable flat base. Soft enough for living rooms, structured enough to stand alone beside a sofa or chair.',
    price: 72,
    collection: 'living',
    categories: ['baskets', 'storage'],
    images: ['/images/products/woven-floor-basket.svg'],
    imageAlt: ['Tall woven seagrass floor basket'],
    variants: [
      { id: 'floor-natural', name: 'Natural seagrass', colour: 'sand', available: true },
    ],
    materials: ['Seagrass', 'Iron frame'],
    dimensions: 'Ø 35 × H 50 cm',
    care: 'Dust regularly. Spot wipe with a dry cloth.',
    colour: 'sand',
    featured: false,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-009', 'hp-001', 'hp-004'],
    seoTitle: 'Woven Floor Basket',
    seoDescription:
      'Tall seagrass floor basket for blankets or magazines. Stable flat base for living rooms.',
    rooms: ['living-room'],
  },
  {
    id: 'hp-020',
    slug: 'ceramic-fruit-bowl',
    name: 'Ceramic Fruit Bowl',
    shortDescription: 'A wide bowl for fruit, bread or centrepieces.',
    description:
      'Open ceramic bowl with a gently curved rim. Matte exterior, glazed interior. Works as a fruit bowl, bread server or empty decorative form on a dining table.',
    price: 54,
    collection: 'kitchen-dining',
    categories: ['bowls', 'serving'],
    images: ['/images/products/ceramic-fruit-bowl.svg'],
    imageAlt: ['Wide ceramic fruit bowl with matte exterior'],
    variants: [
      { id: 'bowl-linen', name: 'Linen', colour: 'linen', available: true },
      { id: 'bowl-clay', name: 'Clay', colour: 'clay', available: true },
    ],
    materials: ['Ceramic', 'Food-safe glaze interior'],
    dimensions: 'Ø 28 cm × H 9 cm',
    care: 'Hand wash recommended. Dishwasher safe on top rack.',
    colour: 'linen',
    featured: false,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-006', 'hp-008', 'hp-007'],
    seoTitle: 'Ceramic Fruit Bowl',
    seoDescription:
      'Wide ceramic bowl for fruit or bread. Matte exterior in linen or clay.',
    rooms: ['dining-area', 'kitchen'],
  },
  {
    id: 'hp-021',
    slug: 'everyday-tea-towel',
    name: 'Everyday Tea Towel',
    shortDescription: 'A durable linen-cotton towel for kitchens.',
    description:
      'Absorbent linen-cotton blend with a hanging loop. Sold as a pair. Softens quickly and hangs neatly on oven handles or wall hooks.',
    price: 26,
    collection: 'textiles',
    categories: ['kitchen textiles', 'tea towels'],
    images: ['/images/products/everyday-tea-towel.svg'],
    imageAlt: ['Pair of linen-cotton everyday tea towels'],
    variants: [
      { id: 'towel-linen', name: 'Linen', colour: 'linen', available: true },
      { id: 'towel-sage', name: 'Sage', colour: 'sage', available: true },
      { id: 'towel-harbour', name: 'Harbour', colour: 'harbour', available: true },
    ],
    materials: ['50% linen', '50% cotton'],
    dimensions: '50 × 70 cm each · Pair',
    care: 'Machine wash warm. Tumble low or line dry.',
    colour: 'linen',
    featured: false,
    newArrival: false,
    available: true,
    relatedProductIds: ['hp-007', 'hp-006', 'hp-010'],
    seoTitle: 'Everyday Tea Towel',
    seoDescription:
      'Absorbent linen-cotton tea towel pair with hanging loop. Linen, sage or harbour.',
    rooms: ['kitchen'],
  },
  {
    id: 'hp-022',
    slug: 'bookshelf-object',
    name: 'Bookshelf Object',
    shortDescription: 'A sculptural ceramic object for shelves and consoles.',
    description:
      'Abstract ceramic form with a soft silhouette. Use as a bookshelf accent, mantel piece or desk object. Hollow and lightweight; decorative only—not a vase.',
    price: 44,
    collection: 'living',
    categories: ['decorative objects'],
    images: ['/images/products/bookshelf-object.svg'],
    imageAlt: ['Sculptural ceramic bookshelf object in charcoal'],
    variants: [
      { id: 'object-charcoal', name: 'Charcoal', colour: 'charcoal', available: true },
      { id: 'object-clay', name: 'Clay', colour: 'clay', available: true },
      { id: 'object-sage', name: 'Sage', colour: 'sage', available: true },
    ],
    materials: ['Ceramic', 'Matte glaze'],
    dimensions: 'H 18 cm × W 10 cm × D 8 cm',
    care: 'Dust with a soft cloth.',
    colour: 'charcoal',
    featured: false,
    newArrival: true,
    available: true,
    relatedProductIds: ['hp-003', 'hp-015', 'hp-004'],
    seoTitle: 'Bookshelf Object',
    seoDescription:
      'Sculptural ceramic accent for shelves and consoles. Charcoal, clay or sage.',
    rooms: ['living-room', 'workspace'],
  },
];

export type ProductBundle = {
  id: string;
  slug: string;
  name: string;
  description: string;
  productIds: string[];
  /** Sum of included product base prices — illustrative, not a discount offer */
  note: string;
};

export const BUNDLES: ProductBundle[] = [
  {
    id: 'bundle-workspace',
    slug: 'calm-workspace-set',
    name: 'Calm Workspace Set',
    description: 'Desk tray, pen cup and linen mat for a clearer work surface.',
    productIds: ['hp-012', 'hp-013', 'hp-014'],
    note: 'Illustrative set—add each piece individually. No automatic discount is applied.',
  },
  {
    id: 'bundle-table',
    slug: 'everyday-table-set',
    name: 'Everyday Table Set',
    description: 'Dinner plate, mug and napkin set for daily meals.',
    productIds: ['hp-008', 'hp-005', 'hp-007'],
    note: 'Illustrative set—add each piece individually. No automatic discount is applied.',
  },
  {
    id: 'bundle-living',
    slug: 'soft-living-room-set',
    name: 'Soft Living Room Set',
    description: 'Throw, cushion cover and serving tray for a calmer living room.',
    productIds: ['hp-001', 'hp-002', 'hp-004'],
    note: 'Illustrative set—add each piece individually. No automatic discount is applied.',
  },
];

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCollection(slug: CollectionSlug): Product[] {
  return PRODUCTS.filter((p) => p.collection === slug);
}

export function getFeaturedProducts(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.featured).slice(0, limit);
}

export function getNewArrivals(limit = 8): Product[] {
  return PRODUCTS.filter((p) => p.newArrival).slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const related = product.relatedProductIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p));
  if (related.length >= limit) return related.slice(0, limit);
  const extras = PRODUCTS.filter(
    (p) => p.collection === product.collection && p.id !== product.id && !related.includes(p),
  );
  return [...related, ...extras].slice(0, limit);
}

export function getVariantPrice(product: Product, variantId?: string): number {
  if (!variantId) return product.price;
  const variant = product.variants.find((v) => v.id === variantId);
  return variant?.price ?? product.price;
}

export type ProductFilterState = {
  q?: string;
  collection?: CollectionSlug | CollectionSlug[];
  colour?: ColourFamily | ColourFamily[];
  category?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
  room?: string;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'newest';
};

function asArray<T extends string>(value?: T | T[]): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function filterProducts(filters: ProductFilterState = {}): Product[] {
  let results = [...PRODUCTS];

  const q = filters.q?.trim().toLowerCase();
  if (q) {
    results = results.filter((p) => {
      const hay = [
        p.name,
        p.shortDescription,
        p.description,
        p.collection,
        ...p.categories,
        ...p.materials,
        COLOUR_LABELS[p.colour],
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  }

  const collections = asArray(filters.collection);
  if (collections.length) {
    results = results.filter((p) => collections.includes(p.collection));
  }

  const colours = asArray(filters.colour);
  if (colours.length) {
    results = results.filter(
      (p) =>
        colours.includes(p.colour) ||
        p.variants.some((v) => v.colour && colours.includes(v.colour)),
    );
  }

  const categories = asArray(filters.category);
  if (categories.length) {
    results = results.filter((p) =>
      categories.some((c) => p.categories.some((pc) => pc.toLowerCase() === c.toLowerCase())),
    );
  }

  if (typeof filters.minPrice === 'number') {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === 'number') {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }

  if (filters.available === true) {
    results = results.filter((p) => p.available);
  } else if (filters.available === false) {
    results = results.filter((p) => !p.available);
  }

  if (filters.room) {
    results = results.filter((p) => p.rooms?.includes(filters.room as Product['rooms'] extends
      | (infer R)[]
      | undefined
      ? R
      : never));
  }

  const sort = filters.sort ?? 'featured';
  results.sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name, 'en-CA');
      case 'newest':
        return Number(b.newArrival) - Number(a.newArrival) || a.name.localeCompare(b.name);
      case 'featured':
      default:
        return Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name);
    }
  });

  return results;
}

export function getAllCategories(): string[] {
  return [...new Set(PRODUCTS.flatMap((p) => p.categories))].sort((a, b) =>
    a.localeCompare(b, 'en-CA'),
  );
}

export function getPriceBounds(): { min: number; max: number } {
  const prices = PRODUCTS.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}
