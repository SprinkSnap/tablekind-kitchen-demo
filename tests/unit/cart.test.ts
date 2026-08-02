import { describe, expect, it } from 'vitest';
import {
  addToCart,
  calculateTotals,
  createEmptyCart,
  lineKey,
  removeLine,
  updateQuantity,
} from '../../src/lib/cart';
import { PRODUCTS } from '../../src/data/products';

describe('demo cart', () => {
  const product = PRODUCTS[0];
  const variant = product.variants[0];

  it('adds a line with server-side catalogue pricing', () => {
    const cart = addToCart(createEmptyCart(), product.id, variant.id, 2);
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0].unitPrice).toBe(variant.price ?? product.price);
    expect(cart.lines[0].quantity).toBe(2);
    expect(cart.lines[0].key).toBe(lineKey(product.id, variant.id));
  });

  it('merges quantities for the same variant', () => {
    let cart = addToCart(createEmptyCart(), product.id, variant.id, 1);
    cart = addToCart(cart, product.id, variant.id, 3);
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0].quantity).toBe(4);
  });

  it('calculates subtotal, sample shipping and tax', () => {
    const cart = addToCart(createEmptyCart(), product.id, variant.id, 1);
    const totals = calculateTotals(cart);
    expect(totals.itemCount).toBe(1);
    expect(totals.subtotal).toBe(variant.price ?? product.price);
    expect(totals.shipping).toBe(12);
    expect(totals.tax).toBeGreaterThan(0);
    expect(totals.total).toBe(totals.subtotal + totals.shipping + totals.tax);
  });

  it('updates and removes lines', () => {
    let cart = addToCart(createEmptyCart(), product.id, variant.id, 2);
    const key = cart.lines[0].key;
    cart = updateQuantity(cart, key, 5);
    expect(cart.lines[0].quantity).toBe(5);
    cart = updateQuantity(cart, key, 0);
    expect(cart.lines).toHaveLength(0);
    cart = addToCart(createEmptyCart(), product.id, variant.id, 1);
    cart = removeLine(cart, cart.lines[0].key);
    expect(cart.lines).toHaveLength(0);
  });

  it('rejects unknown products', () => {
    const cart = addToCart(createEmptyCart(), 'does-not-exist', 'x', 1);
    expect(cart.lines).toHaveLength(0);
  });
});
