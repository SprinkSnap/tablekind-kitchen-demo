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
  return (value ?? fallback.join(','))
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}
