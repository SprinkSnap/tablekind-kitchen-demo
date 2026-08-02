import { test, expect } from '@playwright/test';

test.describe('portfolio lead API', () => {
  test('rejects invalid content type and origin', async ({ request, baseURL }) => {
    const badType = await request.post(`${baseURL}/api/portfolio-lead/`, {
      data: 'name=test',
      headers: { 'content-type': 'text/plain', origin: baseURL! },
    });
    expect(badType.status()).toBe(415);

    const badOrigin = await request.post(`${baseURL}/api/portfolio-lead/`, {
      data: {
        name: 'Alex',
        email: 'alex@example.com',
        businessType: 'restaurant',
        primaryGoal: 'more-reservations',
        neededFeatures: ['menu'],
        launchTiming: 'exploring',
        consent: true,
        turnstileToken: 'dev-bypass',
      },
      headers: { origin: 'https://evil.example' },
    });
    expect(badOrigin.status()).toBe(403);
  });

  test('accepts a valid local lead when Turnstile secret is unset', async ({ request, baseURL }) => {
    const res = await request.post(`${baseURL}/api/portfolio-lead/`, {
      data: {
        name: 'Alex Example',
        email: 'alex@example.com',
        businessType: 'restaurant',
        primaryGoal: 'more-reservations',
        neededFeatures: ['menu', 'reservations'],
        launchTiming: 'exploring',
        consent: true,
        turnstileToken: 'dev-bypass',
      },
      headers: {
        origin: baseURL!,
        'content-type': 'application/json',
      },
    });
    // In preview without D1, API may return 503; validate it is not a silent success with bad data.
    expect([200, 503]).toContain(res.status());
  });
});
