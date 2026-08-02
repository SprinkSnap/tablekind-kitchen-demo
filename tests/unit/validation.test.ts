import { describe, expect, it } from 'vitest';
import { portfolioLeadSchema, redactLeadForLogs } from '../../src/lib/validation';

const valid = {
  name: 'Alex Example',
  email: 'alex@example.com',
  businessType: 'restaurant' as const,
  primaryGoal: 'more-reservations' as const,
  neededFeatures: ['menu' as const, 'reservations' as const],
  launchTiming: '1-2-months' as const,
  consent: true as const,
  turnstileToken: 'dev-bypass',
};

describe('portfolio lead validation', () => {
  it('accepts a valid payload', () => {
    const parsed = portfolioLeadSchema.safeParse(valid);
    expect(parsed.success).toBe(true);
  });

  it('rejects missing consent and unknown fields', () => {
    expect(portfolioLeadSchema.safeParse({ ...valid, consent: false }).success).toBe(false);
    expect(
      portfolioLeadSchema.safeParse({ ...valid, unexpected: 'nope' }).success,
    ).toBe(false);
  });

  it('redacts personal fields from logs', () => {
    const redacted = redactLeadForLogs(valid);
    expect(redacted).not.toHaveProperty('name');
    expect(redacted).not.toHaveProperty('email');
    expect(redacted.emailDomain).toBe('example.com');
  });
});
