# Cloudflare Workers Builds — required settings

The failed deploy log ran only:

```text
Executing user deploy command: npx wrangler deploy
```

Astro must build first. Without `dist/`, Wrangler cannot resolve the Worker entry and errors with:

```text
The entry-point file at "@astrojs/cloudflare/entrypoints/server" was not found.
```

## Fix in the Cloudflare dashboard

Workers & Pages → `tablekind-kitchen-demo` → Settings → Build:

| Field | Value |
| --- | --- |
| Deploy command | `npm run deploy` |

Or:

| Field | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy --env=""` |

Root directory: repository root  
Install command: default `npm clean-install` is fine  

## Why `--env=""`

`wrangler.jsonc` defines a `staging` environment. Wrangler warns if no environment is selected. An empty `--env=""` selects the top-level production Worker name `tablekind-kitchen-demo`.

## After changing settings

Re-run the deployment (Retry deployment) on the failed build, or push a new commit.

## SESSION KV conflict

A previous deploy attempt created KV namespace `tablekind-kitchen-demo-session`
(`db81c3ea2e7841d98cc210a4db8ea1bd`). Later auto-provision retries failed with:

```text
a namespace with this account ID and title already exists [code: 10014]
```

This repo now:

1. Disables Astro sessions (`unstorage/drivers/null`) so SESSION is not required
2. Pins that existing KV id in `wrangler.jsonc` so Wrangler binds instead of recreating

## D1 database

Do **not** commit a fake `database_id` (for example `00000000-0000-0000-0000-000000000000`).

`wrangler.jsonc` omits `database_id` on purpose so Wrangler **auto-provisions** the `tablekind-leads` D1 database on first deploy (same pattern as the SESSION KV namespace).

`npm run deploy` then runs:

```bash
wrangler d1 migrations apply DB --remote
```

If you already created a D1 database manually, you may set its real `database_id` in `wrangler.jsonc`, but leaving it omitted is preferred for this demo.

## Recommended Workers Builds commands

If Build and Deploy are separate fields (current setup):

| Field | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy --env="" && npm run db:remote` |

If only a Deploy command is used:

| Field | Value |
| --- | --- |
| Deploy command | `npm run deploy` |

Do not use bare `npx wrangler deploy --env=""` alone after this change — migrations would not apply.
