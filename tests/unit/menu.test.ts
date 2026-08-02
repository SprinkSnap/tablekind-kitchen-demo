import { describe, expect, it } from 'vitest';
import {
  CATEGORY_META,
  filterMenuItems,
  getFeaturedItems,
  MENU_ITEMS,
} from '../../src/data/menu';

describe('menu data', () => {
  it('contains 24–32 items with required fields', () => {
    expect(MENU_ITEMS.length).toBeGreaterThanOrEqual(24);
    expect(MENU_ITEMS.length).toBeLessThanOrEqual(32);
    for (const item of MENU_ITEMS) {
      expect(item.id).toBeTruthy();
      expect(item.slug).toBeTruthy();
      expect(item.name).toBeTruthy();
      expect(item.price).toBeGreaterThan(0);
      expect(CATEGORY_META[item.category]).toBeTruthy();
      expect(item.image).toMatch(/^\/images\//);
      expect(item.imageAlt).toBeTruthy();
    }
  });

  it('returns featured items', () => {
    expect(getFeaturedItems(6)).toHaveLength(6);
  });

  it('filters by category, query and dietary labels', () => {
    const brunch = filterMenuItems({ category: 'brunch' });
    expect(brunch.every((i) => i.category === 'brunch')).toBe(true);
    const veg = filterMenuItems({ dietary: ['vegetarian'] });
    expect(veg.every((i) => i.dietaryLabels.includes('vegetarian'))).toBe(true);
    const search = filterMenuItems({ query: 'salmon' });
    expect(search.some((i) => i.name.toLowerCase().includes('salmon'))).toBe(true);
  });

  it('does not claim allergen-free labels', () => {
    const blob = JSON.stringify(MENU_ITEMS).toLowerCase();
    expect(blob).not.toContain('allergen-free');
    expect(blob).not.toContain('allergy free');
  });
});
