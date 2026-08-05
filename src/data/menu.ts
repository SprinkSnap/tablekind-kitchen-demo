export type DietaryLabel =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-conscious'
  | 'dairy-conscious'
  | 'nut-conscious'
  | 'spicy';

export type MenuCategory =
  | 'brunch'
  | 'lunch'
  | 'small-plates'
  | 'mains'
  | 'sides'
  | 'desserts'
  | 'drinks';

export type MenuModifier = {
  id: string;
  name: string;
  priceDelta: number;
  maxQuantity?: number;
};

export type MenuItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  imageAlt: string;
  dietaryLabels: DietaryLabel[];
  featured: boolean;
  availableForPickup: boolean;
  modifiers: MenuModifier[];
  sortOrder: number;
};

export const CATEGORY_META: Record<
  MenuCategory,
  { label: string; href: string; description: string; routeSegment?: string }
> = {
  brunch: {
    label: 'Brunch',
    href: '/menu/brunch/',
    description: 'Weekend plates built for lingering mornings.',
    routeSegment: 'brunch',
  },
  lunch: {
    label: 'Lunch',
    href: '/menu/lunch/',
    description: 'Bright midday dishes for tables and takeaway.',
    routeSegment: 'lunch',
  },
  'small-plates': {
    label: 'Small plates',
    href: '/menu/#small-plates',
    description: 'Shareable starters for the whole table.',
  },
  mains: {
    label: 'Mains',
    href: '/menu/dinner/',
    description: 'Seasonal dinners with neighbourhood warmth.',
    routeSegment: 'dinner',
  },
  sides: {
    label: 'Sides',
    href: '/menu/#sides',
    description: 'Supporting plates that round out a meal.',
  },
  desserts: {
    label: 'Desserts',
    href: '/menu/dessert/',
    description: 'Sweet finishes made for sharing—or not.',
    routeSegment: 'dessert',
  },
  drinks: {
    label: 'Non-alcoholic drinks',
    href: '/menu/#drinks',
    description: 'House sodas, teas and thoughtful zero-proof pours.',
  },
};

export const DIETARY_LABELS: Record<DietaryLabel, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  'gluten-conscious': 'Gluten-conscious',
  'dairy-conscious': 'Dairy-conscious',
  'nut-conscious': 'Nut-conscious',
  spicy: 'Spicy',
};

const addEgg: MenuModifier = { id: 'add-egg', name: 'Add a soft egg', priceDelta: 2.5 };
const extraGreens: MenuModifier = { id: 'extra-greens', name: 'Extra greens', priceDelta: 3 };
const makeSpicy: MenuModifier = { id: 'make-spicy', name: 'Extra heat', priceDelta: 0 };
const addBread: MenuModifier = { id: 'add-bread', name: 'Add warm bread', priceDelta: 3.5 };
const dairyFree: MenuModifier = { id: 'dairy-swap', name: 'Dairy-conscious swap', priceDelta: 1 };
const extraSauce: MenuModifier = { id: 'extra-sauce', name: 'Extra sauce on the side', priceDelta: 1 };

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'tk-001',
    slug: 'orchard-pancake-stack',
    name: 'Orchard Pancake Stack',
    description: 'Brown-butter pancakes, warm apples, maple cream and toasted oats.',
    price: 18,
    category: 'brunch',
    image: '/images/dishes/orchard-pancake.webp',
    imageAlt: 'Stack of brown-butter pancakes with warm apples, maple cream and toasted oats',
    dietaryLabels: ['vegetarian'],
    featured: true,
    availableForPickup: true,
    modifiers: [addEgg, dairyFree],
    sortOrder: 10,
  },
  {
    id: 'tk-002',
    slug: 'garden-scramble-bowl',
    name: 'Garden Scramble Bowl',
    description: 'Soft eggs, roasted peppers, herbs, potato hash and chilli oil.',
    price: 17,
    category: 'brunch',
    image: '/images/dishes/garden-scramble.svg',
    imageAlt: 'Breakfast scramble bowl with vegetables and herbs',
    dietaryLabels: ['gluten-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [extraGreens, makeSpicy],
    sortOrder: 20,
  },
  {
    id: 'tk-003',
    slug: 'smoked-trout-toast',
    name: 'Smoked Trout Toast',
    description: 'Rye toast, lemon crème, dill, cucumber and crisp shallots.',
    price: 19,
    category: 'brunch',
    image: '/images/dishes/trout-toast.webp',
    imageAlt: 'Open-faced rye toast with smoked trout, lemon crème, dill, cucumber and crisp shallots',
    dietaryLabels: [],
    featured: true,
    availableForPickup: true,
    modifiers: [extraGreens],
    sortOrder: 30,
  },
  {
    id: 'tk-004',
    slug: 'neighbourhood-benny',
    name: 'Neighbourhood Benny',
    description: 'Poached eggs, roasted mushrooms, hollandaise and soft potato cake.',
    price: 20,
    category: 'brunch',
    image: '/images/dishes/mushroom-benny.svg',
    imageAlt: 'Eggs Benedict style plate with mushrooms',
    dietaryLabels: ['vegetarian'],
    featured: false,
    availableForPickup: false,
    modifiers: [extraGreens, dairyFree],
    sortOrder: 40,
  },
  {
    id: 'tk-005',
    slug: 'citrus-granola-cup',
    name: 'Citrus Granola Cup',
    description: 'Yogurt, honeyed citrus, pistachio crunch and mint.',
    price: 13,
    category: 'brunch',
    image: '/images/dishes/citrus-granola.svg',
    imageAlt: 'Granola cup with citrus and yogurt',
    dietaryLabels: ['vegetarian', 'gluten-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [dairyFree],
    sortOrder: 50,
  },
  {
    id: 'tk-006',
    slug: 'market-greens-salad',
    name: 'Market Greens Salad',
    description: 'Seasonal leaves, roasted squash, seeds, soft cheese and cider vinaigrette.',
    price: 16,
    category: 'lunch',
    image: '/images/dishes/market-greens.webp',
    imageAlt: 'Market greens salad with roasted squash, toasted seeds, soft cheese and cider vinaigrette',
    dietaryLabels: ['vegetarian', 'gluten-conscious'],
    featured: true,
    availableForPickup: true,
    modifiers: [addBread, dairyFree],
    sortOrder: 60,
  },
  {
    id: 'tk-007',
    slug: 'herb-chicken-sandwich',
    name: 'Herb Chicken Sandwich',
    description: 'Roasted chicken, mustard greens, pickles and soft roll.',
    price: 18,
    category: 'lunch',
    image: '/images/dishes/chicken-sandwich.webp',
    imageAlt: 'Roasted herb chicken, mustard greens and crisp pickles on a soft golden roll, cut into two halves',
    dietaryLabels: [],
    featured: true,
    availableForPickup: true,
    modifiers: [extraGreens, makeSpicy],
    sortOrder: 70,
  },
  {
    id: 'tk-008',
    slug: 'tomato-farro-bowl',
    name: 'Tomato Farro Bowl',
    description: 'Warm farro, slow tomatoes, basil oil, olives and ricotta salata.',
    price: 17,
    category: 'lunch',
    image: '/images/dishes/tomato-farro.svg',
    imageAlt: 'Warm farro bowl with tomatoes and herbs',
    dietaryLabels: ['vegetarian'],
    featured: false,
    availableForPickup: true,
    modifiers: [extraGreens, dairyFree],
    sortOrder: 80,
  },
  {
    id: 'tk-009',
    slug: 'cedar-salmon-plate',
    name: 'Cedar Salmon Plate',
    description: 'Pan-seared salmon, dill yogurt, cucumber salad and lemon rice.',
    price: 24,
    category: 'lunch',
    image: '/images/dishes/cedar-salmon.svg',
    imageAlt: 'Salmon plate with rice and cucumber salad',
    dietaryLabels: ['gluten-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [extraSauce],
    sortOrder: 90,
  },
  {
    id: 'tk-010',
    slug: 'roasted-squash-soup',
    name: 'Roasted Squash Soup',
    description: 'Silky squash, brown butter crumbs, sage and warm bread.',
    price: 12,
    category: 'lunch',
    image: '/images/dishes/squash-soup.svg',
    imageAlt: 'Bowl of roasted squash soup with sage',
    dietaryLabels: ['vegetarian'],
    featured: false,
    availableForPickup: true,
    modifiers: [addBread, dairyFree],
    sortOrder: 100,
  },
  {
    id: 'tk-011',
    slug: 'crispy-halloumi-bites',
    name: 'Crispy Halloumi Bites',
    description: 'Golden halloumi, chilli honey, herbs and lemon.',
    price: 15,
    category: 'small-plates',
    image: '/images/dishes/halloumi-bites.webp',
    imageAlt: 'Golden unbreaded halloumi bites with chilli honey, fresh herbs and lemon on a ceramic plate',
    dietaryLabels: ['vegetarian', 'gluten-conscious'],
    featured: true,
    availableForPickup: true,
    modifiers: [makeSpicy, extraSauce],
    sortOrder: 110,
  },
  {
    id: 'tk-012',
    slug: 'charred-broccoli',
    name: 'Charred Broccoli',
    description: 'High-heat broccoli, garlic yogurt, toasted almonds and zest.',
    price: 14,
    category: 'small-plates',
    image: '/images/dishes/charred-broccoli.svg',
    imageAlt: 'Charred broccoli with yogurt and almonds',
    dietaryLabels: ['vegetarian', 'gluten-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [dairyFree],
    sortOrder: 120,
  },
  {
    id: 'tk-013',
    slug: 'whipped-ricotta-plate',
    name: 'Whipped Ricotta Plate',
    description: 'Soft ricotta, roasted grapes, olive oil and grilled bread.',
    price: 14,
    category: 'small-plates',
    image: '/images/dishes/whipped-ricotta.svg',
    imageAlt: 'Whipped ricotta with roasted grapes and bread',
    dietaryLabels: ['vegetarian'],
    featured: false,
    availableForPickup: true,
    modifiers: [addBread],
    sortOrder: 130,
  },
  {
    id: 'tk-014',
    slug: 'spiced-carrot-fritters',
    name: 'Spiced Carrot Fritters',
    description: 'Crisp fritters, herb yogurt and pickled shallots.',
    price: 13,
    category: 'small-plates',
    image: '/images/dishes/carrot-fritters.svg',
    imageAlt: 'Spiced carrot fritters with herb yogurt',
    dietaryLabels: ['vegetarian'],
    featured: false,
    availableForPickup: true,
    modifiers: [makeSpicy, extraSauce],
    sortOrder: 140,
  },
  {
    id: 'tk-015',
    slug: 'maple-mustard-chicken',
    name: 'Maple Mustard Chicken',
    description: 'Roasted chicken, maple mustard glaze, soft polenta and greens.',
    price: 28,
    category: 'mains',
    image: '/images/dishes/maple-chicken.webp',
    imageAlt: 'Roasted chicken with maple mustard glaze, soft creamy polenta and sautéed greens',
    dietaryLabels: ['gluten-conscious'],
    featured: true,
    availableForPickup: true,
    modifiers: [extraGreens, extraSauce],
    sortOrder: 150,
  },
  {
    id: 'tk-016',
    slug: 'mushroom-risotto',
    name: 'Mushroom Risotto',
    description: 'Creamy arborio, roasted mushrooms, thyme and parmesan.',
    price: 24,
    category: 'mains',
    image: '/images/dishes/mushroom-risotto.svg',
    imageAlt: 'Creamy mushroom risotto in a shallow bowl',
    dietaryLabels: ['vegetarian', 'gluten-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [dairyFree, extraGreens],
    sortOrder: 160,
  },
  {
    id: 'tk-017',
    slug: 'steelhead-with-lentils',
    name: 'Steelhead with Lentils',
    description: 'Seared steelhead, warm lentils, mustard greens and lemon oil.',
    price: 32,
    category: 'mains',
    image: '/images/dishes/steelhead-lentils.svg',
    imageAlt: 'Seared steelhead over warm lentils',
    dietaryLabels: ['gluten-conscious', 'dairy-conscious'],
    featured: true,
    availableForPickup: true,
    modifiers: [extraGreens],
    sortOrder: 170,
  },
  {
    id: 'tk-018',
    slug: 'braised-short-rib',
    name: 'Braised Short Rib',
    description: 'Slow short rib, root vegetables, horseradish cream and herbs.',
    price: 36,
    category: 'mains',
    image: '/images/dishes/short-rib.svg',
    imageAlt: 'Braised short rib with root vegetables',
    dietaryLabels: ['gluten-conscious'],
    featured: false,
    availableForPickup: false,
    modifiers: [extraSauce],
    sortOrder: 180,
  },
  {
    id: 'tk-019',
    slug: 'cabbage-steak-plate',
    name: 'Cabbage Steak Plate',
    description: 'Charred cabbage, tahini, crispy chickpeas and pomegranate.',
    price: 22,
    category: 'mains',
    image: '/images/dishes/cabbage-steak.svg',
    imageAlt: 'Charred cabbage steak with tahini and chickpeas',
    dietaryLabels: ['vegan', 'gluten-conscious', 'dairy-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [makeSpicy, addBread],
    sortOrder: 190,
  },
  {
    id: 'tk-020',
    slug: 'crispy-potatoes',
    name: 'Crispy Potatoes',
    description: 'Twice-cooked potatoes, rosemary salt and garlic aioli.',
    price: 9,
    category: 'sides',
    image: '/images/dishes/crispy-potatoes.svg',
    imageAlt: 'Bowl of crispy roasted potatoes',
    dietaryLabels: ['vegetarian', 'gluten-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [extraSauce, makeSpicy],
    sortOrder: 200,
  },
  {
    id: 'tk-021',
    slug: 'seasonal-greens',
    name: 'Seasonal Greens',
    description: 'Sautéed greens, lemon, olive oil and toasted seeds.',
    price: 8,
    category: 'sides',
    image: '/images/dishes/seasonal-greens.svg',
    imageAlt: 'Sautéed seasonal greens with seeds',
    dietaryLabels: ['vegan', 'gluten-conscious', 'dairy-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [],
    sortOrder: 210,
  },
  {
    id: 'tk-022',
    slug: 'warm-bread-butter',
    name: 'Warm Bread & Butter',
    description: 'House bread, cultured butter and flaky salt.',
    price: 7,
    category: 'sides',
    image: '/images/dishes/warm-bread.svg',
    imageAlt: 'Warm bread with cultured butter',
    dietaryLabels: ['vegetarian'],
    featured: false,
    availableForPickup: true,
    modifiers: [dairyFree],
    sortOrder: 220,
  },
  {
    id: 'tk-023',
    slug: 'dark-chocolate-budino',
    name: 'Dark Chocolate Budino',
    description: 'Silky chocolate pudding, olive oil, sea salt and shortbread.',
    price: 12,
    category: 'desserts',
    image: '/images/dishes/chocolate-budino.svg',
    imageAlt: 'Dark chocolate budino with sea salt',
    dietaryLabels: ['vegetarian'],
    featured: true,
    availableForPickup: true,
    modifiers: [],
    sortOrder: 230,
  },
  {
    id: 'tk-024',
    slug: 'lemon-olive-oil-cake',
    name: 'Lemon Olive Oil Cake',
    description: 'Tender citrus cake, whipped cream and candied peel.',
    price: 11,
    category: 'desserts',
    image: '/images/dishes/lemon-cake.svg',
    imageAlt: 'Slice of lemon olive oil cake',
    dietaryLabels: ['vegetarian'],
    featured: false,
    availableForPickup: true,
    modifiers: [dairyFree],
    sortOrder: 240,
  },
  {
    id: 'tk-025',
    slug: 'berry-pavlova',
    name: 'Berry Pavlova',
    description: 'Crisp meringue, soft cream and seasonal berries.',
    price: 12,
    category: 'desserts',
    image: '/images/dishes/berry-pavlova.svg',
    imageAlt: 'Berry pavlova with cream',
    dietaryLabels: ['vegetarian', 'gluten-conscious'],
    featured: false,
    availableForPickup: false,
    modifiers: [],
    sortOrder: 250,
  },
  {
    id: 'tk-026',
    slug: 'spiced-pear-crumble',
    name: 'Spiced Pear Crumble',
    description: 'Warm pears, oat crumble and vanilla cream.',
    price: 11,
    category: 'desserts',
    image: '/images/dishes/pear-crumble.svg',
    imageAlt: 'Warm spiced pear crumble',
    dietaryLabels: ['vegetarian'],
    featured: false,
    availableForPickup: true,
    modifiers: [dairyFree],
    sortOrder: 260,
  },
  {
    id: 'tk-027',
    slug: 'garden-spritz',
    name: 'Garden Spritz',
    description: 'Cucumber, citrus, sparkling tonic and fresh herbs.',
    price: 7,
    category: 'drinks',
    image: '/images/dishes/garden-spritz.svg',
    imageAlt: 'Non-alcoholic garden spritz in a tall glass',
    dietaryLabels: ['vegan', 'gluten-conscious', 'dairy-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [],
    sortOrder: 270,
  },
  {
    id: 'tk-028',
    slug: 'maple-ginger-soda',
    name: 'Maple Ginger Soda',
    description: 'House ginger soda with maple and lime.',
    price: 6,
    category: 'drinks',
    image: '/images/dishes/maple-ginger.svg',
    imageAlt: 'Maple ginger soda with lime',
    dietaryLabels: ['vegan', 'gluten-conscious', 'dairy-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [],
    sortOrder: 280,
  },
  {
    id: 'tk-029',
    slug: 'earl-grey-latte',
    name: 'Earl Grey Latte',
    description: 'Bergamot tea, steamed milk and a touch of honey.',
    price: 5.5,
    category: 'drinks',
    image: '/images/dishes/earl-grey.svg',
    imageAlt: 'Earl Grey latte in a ceramic cup',
    dietaryLabels: ['vegetarian', 'gluten-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [dairyFree],
    sortOrder: 290,
  },
  {
    id: 'tk-030',
    slug: 'house-cold-brew',
    name: 'House Cold Brew',
    description: 'Smooth cold brew with optional oat milk.',
    price: 5,
    category: 'drinks',
    image: '/images/dishes/cold-brew.svg',
    imageAlt: 'Glass of house cold brew coffee',
    dietaryLabels: ['vegan', 'gluten-conscious', 'dairy-conscious'],
    featured: false,
    availableForPickup: true,
    modifiers: [dairyFree],
    sortOrder: 300,
  },
];

export function getMenuItem(idOrSlug: string): MenuItem | undefined {
  return MENU_ITEMS.find((item) => item.id === idOrSlug || item.slug === idOrSlug);
}

export function getFeaturedItems(limit = 6): MenuItem[] {
  return MENU_ITEMS.filter((item) => item.featured)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, limit);
}

export function getItemsByCategory(category: MenuCategory): MenuItem[] {
  return MENU_ITEMS.filter((item) => item.category === category).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

export function getPickupItems(): MenuItem[] {
  return MENU_ITEMS.filter((item) => item.availableForPickup).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );
}

export function filterMenuItems(options: {
  category?: MenuCategory | 'all';
  query?: string;
  dietary?: DietaryLabel[];
  pickupOnly?: boolean;
}): MenuItem[] {
  const q = options.query?.trim().toLowerCase() ?? '';
  return MENU_ITEMS.filter((item) => {
    if (options.category && options.category !== 'all' && item.category !== options.category) {
      return false;
    }
    if (options.pickupOnly && !item.availableForPickup) return false;
    if (options.dietary?.length) {
      if (!options.dietary.every((label) => item.dietaryLabels.includes(label))) return false;
    }
    if (q) {
      const haystack = `${item.name} ${item.description} ${item.category}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => a.sortOrder - b.sortOrder);
}

/** Categories shown on dedicated menu routes */
export const MENU_ROUTE_CATEGORIES = {
  brunch: ['brunch'] as MenuCategory[],
  lunch: ['lunch'] as MenuCategory[],
  dinner: ['small-plates', 'mains', 'sides'] as MenuCategory[],
  dessert: ['desserts'] as MenuCategory[],
} as const;
