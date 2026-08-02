import { describe, expect, it } from 'vitest';
import { getDemoCapabilities, robotsMetaContent } from '../../src/lib/demo-mode';

describe('DEMO_MODE capabilities', () => {
  it('disables indexing and fake product schema in demo mode', () => {
    const caps = getDemoCapabilities();
    expect(caps.demoMode).toBe(true);
    expect(caps.indexable).toBe(false);
    expect(caps.showFictionalDisclosure).toBe(true);
    expect(caps.allowFakeProductSchema).toBe(false);
    expect(caps.allowFakeMerchantSchema).toBe(false);
    expect(caps.allowRealCheckout).toBe(false);
    expect(caps.allowRealPayments).toBe(false);
    expect(caps.routeLeadsToStudio).toBe(true);
  });

  it('returns noindex robots meta in demo mode', () => {
    expect(robotsMetaContent()).toBe('noindex, nofollow');
  });
});
