import { useEffect, useSyncExternalStore } from 'react';
import {
  addToCart,
  calculateTotals,
  clearCart as clearCartState,
  loadCart,
  removeLine,
  saveCart,
  updateQuantity,
  type CartState,
  type CartTotals,
} from './cart';
import {
  clearWishlist,
  isInWishlist,
  loadWishlist,
  removeFromWishlist,
  toggleWishlist,
  type WishlistState,
} from './wishlist';
import { track } from './analytics';

type Listener = () => void;

let cartSnapshot: CartState = { lines: [], updatedAt: 0 };
let wishlistSnapshot: WishlistState = { productIds: [], updatedAt: 0 };
let statusSnapshot = '';
const cartListeners = new Set<Listener>();
const wishListeners = new Set<Listener>();
const statusListeners = new Set<Listener>();
let hydrated = false;

function ensureHydrated() {
  if (hydrated || typeof window === 'undefined') return;
  cartSnapshot = loadCart();
  wishlistSnapshot = loadWishlist();
  hydrated = true;
}

function emitCart() {
  const totals = calculateTotals(cartSnapshot);
  document.dispatchEvent(
    new CustomEvent('hp:cart-updated', { detail: { itemCount: totals.itemCount } }),
  );
  for (const listener of cartListeners) listener();
}

function emitWish() {
  document.dispatchEvent(new CustomEvent('hp:wishlist-updated'));
  for (const listener of wishListeners) listener();
}

function emitStatus() {
  for (const listener of statusListeners) listener();
}

function subscribeStatus(listener: Listener) {
  statusListeners.add(listener);
  return () => statusListeners.delete(listener);
}

function getStatusSnapshot() {
  return statusSnapshot;
}

function announceStatus(message: string) {
  statusSnapshot = '';
  emitStatus();
  requestAnimationFrame(() => {
    statusSnapshot = message;
    emitStatus();
  });
}

function setCart(next: CartState) {
  cartSnapshot = next;
  saveCart(next);
  emitCart();
}

function setWishlist(next: WishlistState) {
  wishlistSnapshot = next;
  emitWish();
}

function subscribeCart(listener: Listener) {
  ensureHydrated();
  cartListeners.add(listener);
  return () => cartListeners.delete(listener);
}

function subscribeWish(listener: Listener) {
  ensureHydrated();
  wishListeners.add(listener);
  return () => wishListeners.delete(listener);
}

function getCartSnapshot() {
  ensureHydrated();
  return cartSnapshot;
}

function getWishSnapshot() {
  ensureHydrated();
  return wishlistSnapshot;
}

function getServerCart(): CartState {
  return { lines: [], updatedAt: 0 };
}

function getServerWish(): WishlistState {
  return { productIds: [], updatedAt: 0 };
}

export type CartStore = {
  cart: CartState;
  totals: CartTotals;
  wishlist: WishlistState;
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  updateQty: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  toggleWish: (productId: string) => void;
  removeWish: (productId: string) => void;
  clearWish: () => void;
  isWishlisted: (productId: string) => boolean;
  openCart: () => void;
  statusMessage: string;
  setStatus: (message: string) => void;
};

export function useCartStore(): CartStore {
  const cart = useSyncExternalStore(subscribeCart, getCartSnapshot, getServerCart);
  const wishlist = useSyncExternalStore(subscribeWish, getWishSnapshot, getServerWish);
  const statusMessage = useSyncExternalStore(subscribeStatus, getStatusSnapshot, () => '');

  useEffect(() => {
    ensureHydrated();
    emitCart();
    const onStorage = (event: StorageEvent) => {
      if (event.key === 'harbour-pine-demo-cart-v1') {
        cartSnapshot = loadCart();
        emitCart();
      }
      if (event.key === 'harbour-pine-demo-wishlist-v1') {
        wishlistSnapshot = loadWishlist();
        emitWish();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const totals = calculateTotals(cart);

  return {
    cart,
    totals,
    wishlist,
    statusMessage,
    setStatus: announceStatus,
    addItem: (productId, variantId, quantity = 1) => {
      ensureHydrated();
      const prev = cartSnapshot;
      const next = addToCart(prev, productId, variantId, quantity);
      setCart(next);
      if (next.updatedAt !== prev.updatedAt) {
        track('add_to_demo_cart', { productId, variantId, quantity });
        const line = next.lines.find((l) => l.productId === productId && l.variantId === variantId);
        announceStatus(line ? `Added ${line.name} to demo cart` : 'Added to demo cart');
      }
    },
    updateQty: (key, quantity) => {
      ensureHydrated();
      setCart(updateQuantity(cartSnapshot, key, quantity));
    },
    removeItem: (key) => {
      ensureHydrated();
      const line = cartSnapshot.lines.find((l) => l.key === key);
      setCart(removeLine(cartSnapshot, key));
      if (line) {
        track('remove_from_demo_cart', { productId: line.productId });
        announceStatus(`Removed ${line.name} from demo cart`);
      }
    },
    clear: () => {
      setCart(clearCartState());
      announceStatus('Demo cart cleared');
    },
    toggleWish: (productId) => {
      ensureHydrated();
      const wasIn = isInWishlist(wishlistSnapshot, productId);
      const next = toggleWishlist(wishlistSnapshot, productId);
      setWishlist(next);
      if (!wasIn) {
        track('wishlist_item_added', { productId });
        announceStatus('Added to wishlist');
      } else {
        announceStatus('Removed from wishlist');
      }
    },
    removeWish: (productId) => {
      ensureHydrated();
      setWishlist(removeFromWishlist(wishlistSnapshot, productId));
      announceStatus('Removed from wishlist');
    },
    clearWish: () => {
      setWishlist(clearWishlist());
      announceStatus('Wishlist cleared');
    },
    isWishlisted: (productId) => isInWishlist(wishlist, productId),
    openCart: () => {
      document.dispatchEvent(new CustomEvent('hp:open-cart'));
    },
  };
}
