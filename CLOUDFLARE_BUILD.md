# Cloudflare Workers Builds — required settings

## Why this deploy keeps failing

Your build log still shows:

```text
Executing user deploy command: npx wrangler deploy
✘ [ERROR] Could not detect a directory containing static files (e.g. html, css and js)
```

That means **the Workers Builds Deploy command has not been changed yet**. Cloudflare is still running bare `npx wrangler deploy`.

That path:

1. Does **not** run `npm ci` (your log also shows empty tool detection / no dependency install)
2. Does **not** run `astro build`, so `dist/client` never exists
3. Often falls into Wrangler **autoconfig** and fails looking for a static `index.html`

Repo code cannot change the Cloudflare dashboard. You must update Build settings once.

## Fix (do this in the Cloudflare dashboard)

Open the Worker that is failing → **Settings** → **Builds**:

| Field | Required value |
| --- | --- |
| **Root directory** | `/` (repository root — must contain `wrangler.jsonc`) |
| **Install command** | `npm ci` |
| **Build command** | *(leave empty)* |
| **Deploy command** | `npm run deploy` |
| **Node.js version** | `22` (or current LTS ≥ 22.12) |
| **Production branch** | whichever branch has this Harbour & Pine code (`main` after merge, or the PR branch) |

Then click **Retry deployment** (or push a new commit).

A successful log must contain lines like:

```text
→ Installing dependencies (npm ci)   # if node_modules missing
→ Building Astro
→ Deploying with wrangler
```

If you still see only `Executing user deploy command: npx wrangler deploy`, the dashboard Deploy command was not saved.

## What `npm run deploy` does

`scripts/workers-deploy.sh`:

1. `npm ci` when `node_modules` is missing  
2. `npm run build` (Astro → `dist/client` + Worker entry)  
3. `wrangler deploy --env=` (production Worker `harbour-pine-home-demo`)  
4. `wrangler d1 migrations apply DB --remote`

## Branch note

Until this PR is merged, production Builds pointed at `main` still deploy the old Tablekind Kitchen commit. Either:

- Merge the Harbour & Pine PR into `main`, **or**
- Point the Worker’s production branch / preview trigger at `cursor/harbour-pine-home-demo-b735`

## Why `--env=`

`wrangler.jsonc` defines a `staging` environment. `--env=` (empty) selects the top-level production Worker name.

## Do not use

| Deploy command | Result |
| --- | --- |
| `npx wrangler deploy` | Fails without Astro build / install (current error) |
| `npx wrangler deploy` alone after merge | May still skip D1 migrations |

## D1 / SESSION

- D1 `database_id` is omitted on purpose for auto-provision (`harbour-pine-leads`)
- SESSION KV id is pinned to avoid namespace recreate conflicts
