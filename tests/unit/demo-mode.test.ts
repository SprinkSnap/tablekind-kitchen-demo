import { describe, expect, it } from 'vitest';
import { getDemoCapabilities, robotsMetaContent } from '../../src/lib/demo-mode';

describe('demo mode', () => {
  it('disables indexing and fake local business schema in demo mode', () => {
    const caps = getDemoCapabilities();
    expect(caps.demoMode).toBe(true);
    expect(caps.indexable).toBe(false);
    expect(caps.showFictionalDisclosure).toBe(true);
    expect(caps.allowFakeLocalBusinessSchema).toBe(false);
    expect(caps.allowRealReservations).toBe(false);
    expect(caps.allowRealOrdering).toBe(false);
    expect(robotsMetaContent()).toBe('noindex, nofollow');
  });
});
