// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.PUBLIC_SITE_URL ?? 'https://harbourandpinehome.chexustudio.com';

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'always',
  // Server output with prerendered pages + Worker API routes
  output: 'server',
  adapter: cloudflare({
    imageService: 'compile',
    // Build/prerender without Cloudflare API token / remote bindings
    prerenderEnvironment: 'node',
    remoteBindings: false,
    persistState: true,
  }),
  // This demo does not use Astro sessions. Disable the default Cloudflare KV
  // SESSION binding so Wrangler does not try to re-create an existing namespace.
  session: {
    driver: {
      entrypoint: 'unstorage/drivers/null',
    },
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  security: {
    checkOrigin: true,
  },
});
