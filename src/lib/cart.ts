import { SAMPLE_SHIPPING, TAX_RATE } from './config';
import { getProductById, getVariantPrice } from '../data/products';
import { roundMoney } from './currency';

export const CART_STORAGE_KEY = 'harbour-pine-demo-cart-v1';

export type CartLine = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  variantId: string;
  variantName: string;
  unitPrice: number;
  quantity: number;
};

export type CartState = {
  lines: CartLine[];
  updatedAt: number;
};

export type CartTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  itemCount: number;
};

export function createEmptyCart(): CartState {
  return { lines: [], updatedAt: Date.now() };
}

export function lineKey(productId: string, variantId: string): string {
  return `${productId}::${variantId}`;
}

export function calculateTotals(cart: CartState): CartTotals {
  const subtotal = roundMoney(
    cart.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
  );
  const itemCount = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  const shipping = itemCount > 0 ? SAMPLE_SHIPPING : 0;
  const tax = roundMoney((subtotal + shipping) * TAX_RATE);
  const total = roundMoney(subtotal + shipping + tax);
  return { subtotal, shipping, tax, total, itemCount };
}

export function addToCart(
  cart: CartState,
  productId: string,
  variantId: string,
  quantity: number,
): CartState {
  const product = getProductById(productId);
  if (!product || !product.available || quantity < 1) return cart;

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  if (!variant || !variant.available) return cart;

  const key = lineKey(product.id, variant.id);
  const unitPrice = getVariantPrice(product, variant.id);
  const existing = cart.lines.find((line) => line.key === key);

  let lines: CartLine[];
  if (existing) {
    lines = cart.lines.map((line) =>
      line.key === key ? { ...line, quantity: line.quantity + quantity } : line,
    );
  } else {
    lines = [
      ...cart.lines,
      {
        key,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        imageAlt: product.imageAlt[0] ?? product.name,
        variantId: variant.id,
        variantName: variant.name,
        unitPrice,
        quantity,
      },
    ];
  }

  return { ...cart, lines, updatedAt: Date.now() };
}

export function updateQuantity(cart: CartState, key: string, quantity: number): CartState {
  if (quantity <= 0) {
    return { ...cart, lines: cart.lines.filter((l) => l.key !== key), updatedAt: Date.now() };
  }
  return {
    ...cart,
    lines: cart.lines.map((l) => (l.key === key ? { ...l, quantity } : l)),
    updatedAt: Date.now(),
  };
}

export function removeLine(cart: CartState, key: string): CartState {
  return { ...cart, lines: cart.lines.filter((l) => l.key !== key), updatedAt: Date.now() };
}

export function loadCart(): CartState {
  if (typeof window === 'undefined') return createEmptyCart();
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return createEmptyCart();
    const parsed = JSON.parse(raw) as CartState;
    if (!parsed || !Array.isArray(parsed.lines)) return createEmptyCart();
    return parsed;
  } catch {
    return createEmptyCart();
  }
}

export function saveCart(cart: CartState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function clearCart(): CartState {
  const empty = createEmptyCart();
  saveCart(empty);
  return empty;
}
