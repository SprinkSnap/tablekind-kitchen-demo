# Cloudflare Workers Builds — required settings

## Why the last deploy failed

Workers Builds ran:

```text
Executing user deploy command: npx wrangler deploy
```

Astro had not produced `dist/client`, so Wrangler failed with:

```text
Could not detect a directory containing static files (e.g. html, css and js)
```

This project is an Astro + Cloudflare Workers app. **`dist/` only exists after `npm run build`.**

## Fix in the Cloudflare dashboard (required)

Workers & Pages → **harbour-pine-home-demo** → Settings → Builds:

| Field | Value |
| --- | --- |
| **Install command** | `npm ci` (default is fine) |
| **Build command** | leave empty **or** `npm run build` |
| **Deploy command** | `npm run deploy` |

`npm run deploy` runs:

1. `astro build` → writes `dist/client` + Worker entry  
2. `wrangler deploy --env=""` → production Worker `harbour-pine-home-demo`  
3. `npm run db:remote` → applies D1 migrations  

### Alternative (two-step)

| Field | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy --env="" && npm run db:remote` |

### Do not use

| Field | Value | Why it fails |
| --- | --- | --- |
| Deploy command | `npx wrangler deploy` alone | Historically skipped the Astro build / D1 migrations / `--env=""` |

`wrangler.jsonc` now includes a `build.command` safety net (`npm run build`) so bare `wrangler deploy` attempts an Astro build first. Prefer **`npm run deploy`** anyway so migrations and `--env=""` are applied.

## Why `--env=""`

`wrangler.jsonc` defines a `staging` environment. An empty `--env=""` selects the top-level production Worker name `harbour-pine-home-demo`.

## After changing settings

Re-run the deployment (Retry deployment), or push a new commit.

## SESSION KV

Astro sessions are disabled (`unstorage/drivers/null`). A pinned SESSION KV id is kept in `wrangler.jsonc` to avoid namespace recreation conflicts on accounts that already provisioned one.

## D1 database

Do **not** commit a fake `database_id`.

`wrangler.jsonc` omits `database_id` so Wrangler **auto-provisions** the `harbour-pine-leads` D1 database on first deploy.

`npm run deploy` then runs:

```bash
wrangler d1 migrations apply DB --remote
```
