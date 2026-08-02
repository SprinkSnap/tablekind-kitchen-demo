import { getProductById, type Product } from '../data/products';

export const WISHLIST_STORAGE_KEY = 'harbour-pine-demo-wishlist-v1';

export type WishlistState = {
  productIds: string[];
  updatedAt: number;
};

export function createEmptyWishlist(): WishlistState {
  return { productIds: [], updatedAt: Date.now() };
}

export function loadWishlist(): WishlistState {
  if (typeof window === 'undefined') return createEmptyWishlist();
  try {
    const raw = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (!raw) return createEmptyWishlist();
    const parsed = JSON.parse(raw) as WishlistState;
    if (!parsed || !Array.isArray(parsed.productIds)) return createEmptyWishlist();
    return parsed;
  } catch {
    return createEmptyWishlist();
  }
}

export function saveWishlist(state: WishlistState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(state));
}

export function toggleWishlist(state: WishlistState, productId: string): WishlistState {
  const exists = state.productIds.includes(productId);
  const productIds = exists
    ? state.productIds.filter((id) => id !== productId)
    : [...state.productIds, productId];
  const next = { productIds, updatedAt: Date.now() };
  saveWishlist(next);
  return next;
}

export function removeFromWishlist(state: WishlistState, productId: string): WishlistState {
  const next = {
    productIds: state.productIds.filter((id) => id !== productId),
    updatedAt: Date.now(),
  };
  saveWishlist(next);
  return next;
}

export function clearWishlist(): WishlistState {
  const empty = createEmptyWishlist();
  saveWishlist(empty);
  return empty;
}

export function getWishlistProducts(state: WishlistState): Product[] {
  return state.productIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => Boolean(p));
}

export function isInWishlist(state: WishlistState, productId: string): boolean {
  return state.productIds.includes(productId);
}
