import { env } from 'cloudflare:workers';

export function getWorkerEnv(): Cloudflare.Env {
  return env;
}

export function parseAllowedOrigins(value: string | undefined): string[] {
  const fallback = [
    'https://harbourandpinehome.chexustudio.com',
    'http://localhost:4321',
    'http://127.0.0.1:4321',
  ];
  const parsed = (value ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  // Always allow local preview hosts so Playwright and `astro preview` work.
  const merged = [...parsed, ...fallback.filter((origin) => !parsed.includes(origin))];
  return merged.length ? merged : fallback;
}
