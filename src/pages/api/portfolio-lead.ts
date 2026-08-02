export const prerender = false;

import type { APIRoute } from 'astro';
import { nanoid } from 'nanoid';
import {
  MAX_REQUEST_BYTES,
  portfolioLeadSchema,
  redactLeadForLogs,
} from '../../lib/validation';
import { STORE } from '../../lib/config';
import { getWorkerEnv, parseAllowedOrigins } from '../../lib/env';

const genericError = { error: 'Unable to submit your request right now.' };

function originAllowed(origin: string | null, allowed: string[]): boolean {
  if (!origin) return false;
  return allowed.includes(origin);
}

async function verifyTurnstile(token: string, secret: string | undefined, ip: string | null) {
  if (!secret) {
    // Local/dev: allow a documented bypass token only when secret is unset.
    return token === 'dev-bypass';
  }
  const body = new URLSearchParams({
    secret,
    response: token,
  });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return Boolean(data.success);
}

const rateBucket = new Map<string, { count: number; reset: number }>();

function rateLimit(key: string, limit = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  const current = rateBucket.get(key);
  if (!current || current.reset < now) {
    rateBucket.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
      return Response.json(genericError, { status: 415 });
    }

    const env = getWorkerEnv();
    const allowed = parseAllowedOrigins(env.ALLOWED_ORIGINS);
    const origin = request.headers.get('origin');
    if (!originAllowed(origin, allowed)) {
      return Response.json(genericError, { status: 403 });
    }

    const ip = request.headers.get('cf-connecting-ip') ?? 'local';
    if (!rateLimit(`lead:${ip}`)) {
      return Response.json(genericError, { status: 429 });
    }

    const raw = await request.text();
    if (raw.length > MAX_REQUEST_BYTES) {
      return Response.json(genericError, { status: 413 });
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return Response.json(genericError, { status: 400 });
    }

    const parsed = portfolioLeadSchema.safeParse(json);
    if (!parsed.success) {
      return Response.json(genericError, { status: 400 });
    }

    const lead = parsed.data;
    if (lead.website) {
      // Honeypot filled — pretend success.
      return Response.json({ ok: true });
    }

    const turnstileOk = await verifyTurnstile(lead.turnstileToken, env.TURNSTILE_SECRET_KEY, ip);
    if (!turnstileOk) {
      return Response.json(genericError, { status: 400 });
    }

    const db = env.DB;
    const id = nanoid();
    const createdAt = new Date().toISOString();

    if (db) {
      await db
        .prepare(
          `INSERT INTO portfolio_leads (
            id, name, email, business_name, business_type, existing_website,
            product_count, primary_goal, needed_features, launch_timing, message,
            consent, source_demo, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          id,
          lead.name,
          lead.email,
          lead.businessName ?? null,
          lead.businessType,
          lead.existingWebsite ?? null,
          lead.productCount,
          lead.primaryGoal,
          JSON.stringify(lead.neededFeatures),
          lead.launchTiming,
          lead.message ?? null,
          1,
          STORE.sourceDemo,
          createdAt,
        )
        .run();
    } else if (import.meta.env.DEV) {
      console.info('[portfolio-lead:dev]', redactLeadForLogs(lead));
    } else {
      return Response.json(genericError, { status: 503 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('[portfolio-lead]', error instanceof Error ? error.message : 'unknown');
    return Response.json(genericError, { status: 500 });
  }
};

export const ALL: APIRoute = async () =>
  Response.json({ error: 'Method not allowed' }, { status: 405 });
