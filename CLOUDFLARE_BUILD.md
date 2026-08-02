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
