import { TAX_RATE } from './config';
import { getMenuItem, type MenuModifier } from '../data/menu';
import { roundMoney } from './currency';

export const CART_STORAGE_KEY = 'tablekind-demo-cart-v1';

export type CartModifierSelection = {
  id: string;
  name: string;
  priceDelta: number;
};

export type CartLine = {
  key: string;
  itemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  modifiers: CartModifierSelection[];
  notes?: string;
};

export type CartState = {
  lines: CartLine[];
  pickupTime?: string;
  orderNotes?: string;
  updatedAt: number;
};

export type CartTotals = {
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
};

export function createEmptyCart(): CartState {
  return { lines: [], updatedAt: Date.now() };
}

export function lineKey(itemId: string, modifiers: CartModifierSelection[]): string {
  const mod = modifiers
    .map((m) => m.id)
    .sort()
    .join('+');
  return `${itemId}::${mod || 'base'}`;
}

export function unitPriceWithModifiers(basePrice: number, modifiers: CartModifierSelection[]): number {
  return roundMoney(basePrice + modifiers.reduce((sum, m) => sum + m.priceDelta, 0));
}

export function calculateTotals(cart: CartState): CartTotals {
  const subtotal = roundMoney(
    cart.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
  );
  const tax = roundMoney(subtotal * TAX_RATE);
  const total = roundMoney(subtotal + tax);
  const itemCount = cart.lines.reduce((sum, line) => sum + line.quantity, 0);
  return { subtotal, tax, total, itemCount };
}

export function addToCart(
  cart: CartState,
  itemId: string,
  quantity: number,
  modifiers: MenuModifier[] = [],
  notes?: string,
): CartState {
  const item = getMenuItem(itemId);
  if (!item || !item.availableForPickup || quantity < 1) return cart;

  const selected: CartModifierSelection[] = modifiers.map((m) => ({
    id: m.id,
    name: m.name,
    priceDelta: m.priceDelta,
  }));
  const key = lineKey(itemId, selected);
  const unitPrice = unitPriceWithModifiers(item.price, selected);
  const existing = cart.lines.find((line) => line.key === key);

  let lines: CartLine[];
  if (existing) {
    lines = cart.lines.map((line) =>
      line.key === key
        ? { ...line, quantity: line.quantity + quantity, notes: notes ?? line.notes }
        : line,
    );
  } else {
    lines = [
      ...cart.lines,
      {
        key,
        itemId: item.id,
        name: item.name,
        unitPrice,
        quantity,
        modifiers: selected,
        notes,
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
