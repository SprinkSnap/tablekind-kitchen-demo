# Cloudflare Workers Builds — required settings

Astro must build before Wrangler deploys. Without `dist/`, Wrangler cannot resolve the Worker entry.

## Fix in the Cloudflare dashboard

Workers & Pages → `harbour-pine-home-demo` → Settings → Build:

| Field | Value |
| --- | --- |
| Deploy command | `npm run deploy` |

Or:

| Field | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy --env="" && npm run db:remote` |

Root directory: repository root  
Install command: default `npm clean-install` is fine  

## Why `--env=""`

`wrangler.jsonc` defines a `staging` environment. An empty `--env=""` selects the top-level production Worker name `harbour-pine-home-demo`.

## SESSION KV

Astro sessions are disabled (`unstorage/drivers/null`). A pinned SESSION KV id is kept in `wrangler.jsonc` to avoid namespace recreation conflicts on accounts that already provisioned one.

## D1 database

Do **not** commit a fake `database_id`.

`wrangler.jsonc` omits `database_id` so Wrangler **auto-provisions** the `harbour-pine-leads` D1 database on first deploy.

`npm run deploy` then runs:

```bash
wrangler d1 migrations apply DB --remote
```
