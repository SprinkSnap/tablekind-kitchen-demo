export type AnalyticsEvent =
  | 'demo_viewed'
  | 'collection_viewed'
  | 'product_viewed'
  | 'search_used'
  | 'filter_used'
  | 'wishlist_item_added'
  | 'add_to_demo_cart'
  | 'remove_from_demo_cart'
  | 'demo_checkout_started'
  | 'demo_checkout_completed'
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
  'phone',
  'address',
  'search',
  'query',
  'q',
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

/** Anonymous conversion analytics — never send personal or checkout entry data. */
export function track(event: AnalyticsEvent, payload?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const detail = { event, payload: scrubPayload(payload), at: Date.now() };
  window.dispatchEvent(new CustomEvent('hp:analytics', { detail }));
  const w = window as Window & { dataLayer?: unknown[]; __hpEvents?: unknown[] };
  w.__hpEvents = w.__hpEvents ?? [];
  w.__hpEvents.push(detail);
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event, ...detail.payload });
  }
}
