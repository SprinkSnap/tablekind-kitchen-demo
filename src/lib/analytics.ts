export type AnalyticsEvent =
  | 'demo_viewed'
  | 'menu_viewed'
  | 'menu_filter_used'
  | 'featured_item_selected'
  | 'reservation_demo_started'
  | 'reservation_demo_completed'
  | 'order_demo_started'
  | 'item_added_to_demo_cart'
  | 'order_demo_completed'
  | 'catering_demo_started'
  | 'che_xu_cta_selected'
  | 'portfolio_lead_started'
  | 'portfolio_lead_submitted'
  | 'case_study_selected'
  | 'chat_opened';

const SENSITIVE_KEYS = [
  'name',
  'email',
  'message',
  'notes',
  'dietary',
  'phone',
  'address',
  'accessibility',
] as const;

function scrubPayload(payload?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!payload) return undefined;
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (SENSITIVE_KEYS.some((s) => key.toLowerCase().includes(s))) continue;
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    }
  }
  return clean;
}

/** Anonymous conversion analytics — never send personal or dietary data. */
export function track(event: AnalyticsEvent, payload?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const detail = { event, payload: scrubPayload(payload), at: Date.now() };
  window.dispatchEvent(new CustomEvent('tk:analytics', { detail }));
  const w = window as Window & { dataLayer?: unknown[]; __tkEvents?: unknown[] };
  w.__tkEvents = w.__tkEvents ?? [];
  w.__tkEvents.push(detail);
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...detail.payload });
  }
}
