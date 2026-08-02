import { describe, expect, it } from 'vitest';
import {
  DemoReservationProvider,
  defaultReservationDraft,
} from '../../src/lib/reservations';

describe('reservation demo provider', () => {
  it('returns demo slots and never claims a real booking', async () => {
    const provider = new DemoReservationProvider();
    const draft = defaultReservationDraft();
    const availability = await provider.searchAvailability(draft);
    expect(availability.demo).toBe(true);
    expect(availability.slots.length).toBeGreaterThan(0);
    const result = await provider.createReservation(draft);
    expect(result.demo).toBe(true);
    expect(result.message.toLowerCase()).toContain('no real table');
  });
});
