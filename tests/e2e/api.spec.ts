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
        businessType: 'home-goods',
        productCount: '21-100',
        primaryGoal: 'increase-online-sales',
        neededFeatures: ['product-catalogue'],
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
        businessType: 'home-goods',
        productCount: '21-100',
        primaryGoal: 'increase-online-sales',
        neededFeatures: ['product-catalogue', 'cart-checkout'],
        launchTiming: 'exploring',
        consent: true,
        turnstileToken: 'dev-bypass',
      },
      headers: {
        origin: baseURL!,
        'content-type': 'application/json',
      },
    });
    // In preview without D1, API may return 503; validate schema acceptance path.
    expect([200, 503]).toContain(res.status());
  });

  test('rejects turnstile failure when secret would be required pattern', async ({
    request,
    baseURL,
  }) => {
    const res = await request.post(`${baseURL}/api/portfolio-lead/`, {
      data: {
        name: 'Alex Example',
        email: 'alex@example.com',
        businessType: 'home-goods',
        productCount: '1-20',
        primaryGoal: 'product-seo',
        neededFeatures: ['variants'],
        launchTiming: 'asap',
        consent: true,
        turnstileToken: '',
      },
      headers: {
        origin: baseURL!,
        'content-type': 'application/json',
      },
    });
    expect([400, 403, 415]).toContain(res.status());
  });
});

test.describe('assistant API', () => {
  test('returns a safe local reply', async ({ request, baseURL }) => {
    const res = await request.post(`${baseURL}/api/assistant/`, {
      data: { message: 'Help me find a gift' },
      headers: {
        origin: baseURL!,
        'content-type': 'application/json',
      },
    });
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { reply?: string };
    expect(body.reply?.toLowerCase()).toContain('gift');
    expect(body.reply?.toLowerCase()).not.toContain('payment card');
  });
});
