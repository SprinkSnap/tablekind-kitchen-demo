# Cloudflare Workers Builds — required settings

## What your latest log means

```text
Executing user build command: npm run deploy
npm error path /opt/buildhome/repo/package.json
npm error enoent Could not read package.json
```

Two separate misconfigurations:

1. **`npm run deploy` is in the Build command field.**  
   It must be the **Deploy command**. Build and Deploy are different fields.
2. **`package.json` is missing in the build workspace.**  
   On GitHub it exists at the repo root. This almost always means **Root directory** in Builds settings is wrong (non-empty path that does not contain `package.json`), or the Worker is connected to the wrong repository.

Earlier failures with bare `npx wrangler deploy` + “Could not detect a directory containing static files” are the same underlying issue: Wrangler was not running in a directory that contains this project’s `wrangler.jsonc` / built `dist/`.

## Exact dashboard settings

Worker → **Settings** → **Builds** → edit trigger:

| Field | Value | Notes |
| --- | --- | --- |
| **Git repository** | `SprinkSnap/tablekind-kitchen-demo` | Must be this repo |
| **Production branch** | `main` (after merge) or `cursor/harbour-pine-home-demo-b735` | Branch must contain `package.json` |
| **Root directory** | **leave blank** | Do **not** set `src`, `public`, or any subfolder |
| **Install command** | `npm ci` | Default is fine if present |
| **Build command** | **leave blank** | Do **not** put `npm run deploy` here |
| **Deploy command** | `npm run deploy` | This is the only place for deploy |
| **Non-production branch deploy command** | `npm run deploy` | Optional but recommended while testing the PR branch |
| **Node.js version** | `22` | Engines require ≥ 22.12 |

Save settings, then **Retry deployment** (or push a new commit). Retries use the settings present at retry time.

## How to tell it worked

You should see roughly:

```text
Executing user deploy command: npm run deploy
→ Installing dependencies (npm ci)    # if needed
→ Building Astro
→ Deploying with wrangler
→ Applying D1 migrations
```

You should **not** see:

```text
Executing user build command: npm run deploy
```

or

```text
Executing user deploy command: npx wrangler deploy
```

## What `npm run deploy` runs

`scripts/workers-deploy.sh`:

1. `npm ci` if dependencies are missing  
2. `astro build` → `dist/client` + Worker entry  
3. `wrangler deploy --env=` → Worker `harbour-pine-home-demo`  
4. `wrangler d1 migrations apply DB --remote`

## Branch note

Until the Harbour & Pine PR is merged, keep production Builds on the PR branch **or** merge to `main` first. Building an old/wrong branch still fails for product reasons even with correct commands.

## D1 / SESSION

- D1 `database_id` omitted on purpose for auto-provision (`harbour-pine-leads`)
- SESSION KV id pinned to avoid namespace recreate conflicts
