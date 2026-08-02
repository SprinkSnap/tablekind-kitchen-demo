import { STORE } from './config';

/** Format a CAD amount for en-CA display. */
export function formatCad(amount: number): string {
  return new Intl.NumberFormat(STORE.locale, {
    style: 'currency',
    currency: STORE.currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}
