/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').Runtime;

declare namespace App {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Locals extends Runtime {}
}

declare namespace Cloudflare {
  interface Env {
    TURNSTILE_SECRET_KEY?: string;
    RATE_LIMIT_SALT?: string;
    PUBLIC_TURNSTILE_SITE_KEY?: string;
    ALLOWED_ORIGINS?: string;
    DEMO_MODE?: string;
    PUBLIC_DEMO_MODE?: string;
    PUBLIC_SITE_URL?: string;
    PUBLIC_STUDIO_URL?: string;
    PUBLIC_CASE_STUDY_URL?: string;
    PUBLIC_PACKAGES_URL?: string;
    DB?: D1Database;
    /** Optional Workers AI binding — enable in wrangler when desired. */
    AI?: Ai;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_STUDIO_URL: string;
  readonly PUBLIC_CASE_STUDY_URL: string;
  readonly PUBLIC_PACKAGES_URL: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly PUBLIC_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'cloudflare:workers' {
  export const env: Cloudflare.Env;
}
