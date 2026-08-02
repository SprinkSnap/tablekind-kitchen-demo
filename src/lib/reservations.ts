/**
 * Provider-agnostic reservation adapter.
 * Demo implementation never transmits or stores personal data.
 */

export type PartySize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type SeatingPreference = 'no-preference' | 'quiet' | 'window' | 'communal';

export type ReservationDraft = {
  partySize: PartySize;
  date: string;
  preferredTime: string;
  seating: SeatingPreference;
  accessibilityRequest?: string;
  occasion?: string;
};

export type ReservationResult = {
  ok: true;
  demo: true;
  confirmationCode: string;
  message: string;
};

export interface ReservationProvider {
  readonly name: string;
  searchAvailability(draft: Pick<ReservationDraft, 'partySize' | 'date' | 'preferredTime'>): Promise<{
    demo: true;
    slots: string[];
  }>;
  createReservation(draft: ReservationDraft): Promise<ReservationResult>;
}

/** Demo slots are illustrative only — never present as real availability. */
export const DEMO_TIME_SLOTS = [
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
] as const;

export class DemoReservationProvider implements ReservationProvider {
  readonly name = 'demo-local';

  async searchAvailability(
    draft: Pick<ReservationDraft, 'partySize' | 'date' | 'preferredTime'>,
  ): Promise<{ demo: true; slots: string[] }> {
    void draft;
    return {
      demo: true,
      slots: [...DEMO_TIME_SLOTS],
    };
  }

  async createReservation(draft: ReservationDraft): Promise<ReservationResult> {
    void draft;
    return {
      ok: true,
      demo: true,
      confirmationCode: `DEMO-${Date.now().toString(36).toUpperCase()}`,
      message:
        'Reservation experience complete. No real table was reserved and no personal information was stored.',
    };
  }
}

export function getReservationProvider(): ReservationProvider {
  // Future: switch on env to OpenTable / Resy / SevenRooms adapters
  return new DemoReservationProvider();
}

export function defaultReservationDraft(): ReservationDraft {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const date = tomorrow.toISOString().slice(0, 10);
  return {
    partySize: 2,
    date,
    preferredTime: '18:30',
    seating: 'no-preference',
  };
}
