import { describe, expect, it } from 'vitest';
import {
  chatMessageSchema,
  portfolioLeadSchema,
  redactLeadForLogs,
} from '../../src/lib/validation';
import {
  COLLECTIONS,
  filterProducts,
  getProduct,
  PRODUCTS,
} from '../../src/data/products';

describe('portfolio lead validation', () => {
  const valid = {
    name: 'Alex Merchant',
    email: 'alex@example.com',
    businessType: 'home-goods' as const,
    productCount: '21-100' as const,
    primaryGoal: 'increase-online-sales' as const,
    neededFeatures: ['product-catalogue', 'cart-checkout'] as Array<
      'product-catalogue' | 'cart-checkout'
    >,
    launchTiming: 'exploring' as const,
    consent: true as const,
    turnstileToken: 'dev-bypass',
  };

  it('accepts a valid lead payload', () => {
    const result = portfolioLeadSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects missing consent', () => {
    const result = portfolioLeadSchema.safeParse({ ...valid, consent: false });
    expect(result.success).toBe(false);
  });

  it('rejects unknown fields', () => {
    const result = portfolioLeadSchema.safeParse({ ...valid, extra: 'nope' });
    expect(result.success).toBe(false);
  });

  it('redacts personal fields from logs', () => {
    const redacted = redactLeadForLogs({ ...valid, message: 'hello' });
    expect(redacted).not.toHaveProperty('name');
    expect(redacted).not.toHaveProperty('email');
    expect(redacted.emailDomain).toBe('example.com');
    expect(redacted.hasMessage).toBe(true);
  });
});

describe('chat message validation', () => {
  it('limits message length', () => {
    expect(chatMessageSchema.safeParse({ message: 'Find a throw' }).success).toBe(true);
    expect(chatMessageSchema.safeParse({ message: 'x'.repeat(501) }).success).toBe(false);
  });
});

describe('product catalogue', () => {
  it('has 18–24 products across six collections', () => {
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(18);
    expect(PRODUCTS.length).toBeLessThanOrEqual(24);
    expect(COLLECTIONS).toHaveLength(6);
  });

  it('filters by collection and colour', () => {
    const living = filterProducts({ collection: 'living' });
    expect(living.every((p) => p.collection === 'living')).toBe(true);
    const pine = filterProducts({ colour: 'pine' });
    expect(pine.length).toBeGreaterThan(0);
  });

  it('resolves products by slug', () => {
    expect(getProduct('cedar-linen-throw')?.name).toBe('Cedar Linen Throw');
  });
});
