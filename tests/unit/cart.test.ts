import { describe, expect, it } from 'vitest';
import {
  addToCart,
  calculateTotals,
  createEmptyCart,
  lineKey,
  updateQuantity,
} from '../../src/lib/cart';

describe('cart calculations', () => {
  it('creates an empty cart', () => {
    const cart = createEmptyCart();
    expect(cart.lines).toHaveLength(0);
    expect(calculateTotals(cart)).toEqual({
      subtotal: 0,
      tax: 0,
      total: 0,
      itemCount: 0,
    });
  });

  it('adds a pickup item with modifiers and computes tax', () => {
    let cart = createEmptyCart();
    cart = addToCart(cart, 'tk-011', 2, [
      { id: 'make-spicy', name: 'Extra heat', priceDelta: 0 },
      { id: 'extra-sauce', name: 'Extra sauce on the side', priceDelta: 1 },
    ]);
    const totals = calculateTotals(cart);
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0]?.unitPrice).toBe(16);
    expect(totals.itemCount).toBe(2);
    expect(totals.subtotal).toBe(32);
    expect(totals.tax).toBe(4.16);
    expect(totals.total).toBe(36.16);
  });

  it('merges identical lines and supports quantity updates', () => {
    let cart = createEmptyCart();
    cart = addToCart(cart, 'tk-027', 1);
    cart = addToCart(cart, 'tk-027', 2);
    expect(cart.lines).toHaveLength(1);
    expect(cart.lines[0]?.quantity).toBe(3);
    cart = updateQuantity(cart, cart.lines[0]!.key, 0);
    expect(cart.lines).toHaveLength(0);
  });

  it('builds stable line keys', () => {
    expect(lineKey('a', [{ id: 'z', name: 'Z', priceDelta: 1 }])).toBe('a::z');
  });

  it('ignores non-pickup items', () => {
    const cart = addToCart(createEmptyCart(), 'tk-018', 1);
    expect(cart.lines).toHaveLength(0);
  });
});
