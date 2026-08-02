# Harbour & Pine Home Demo

Portfolio e-commerce website concept by **Che Xu Studio**.

- Store: **Harbour & Pine Home**
- Tagline: **Thoughtful pieces for everyday living.**
- Public domain: https://harbourandpinehome.chexustudio.com
- Case study: https://chexustudio.com/work/harbour-pine-home
- Worker: `harbour-pine-home-demo`
- Staging Worker: `harbour-pine-home-demo-staging`

Harbour & Pine Home is fictional. The standalone demo uses `noindex, nofollow`. Genuine business enquiries go to Che Xu Studio only.

## Architecture

- **Astro** (prerendered public pages) + **Cloudflare Workers** adapter
- **React islands** for filters, cart drawer, wishlist, checkout demo, enquiry drawer and assistant
- **Tailwind CSS v4** design tokens
- **Typed product module** (`src/data/products.ts`) as the single catalogue source of truth
- **D1** for consented Che Xu Studio leads (`source_demo = harbour-pine-home`)
- **Turnstile** + origin checks + honeypot + in-process rate limiting on `/api/portfolio-lead/`
- Optional **Workers AI** assistant at `/api/assistant/` with safe local fallback
- Demo cart/wishlist persist in **localStorage** only—never to production services

```
src/
  components/astro|react  UI
  data/                   products + FAQ
  layouts/                BaseLayout
  lib/                    config, cart, wishlist, SEO, validation, analytics
  pages/                  routes + API
migrations/               D1 SQL
tests/                    Vitest + Playwright
```

## Local setup

```bash
npm install
cp .env.example .env
cp .dev.vars.example .dev.vars
npm run generate:assets   # regenerates SVG product/collection imagery
npm run dev
```

Optional local D1:

```bash
npm run db:local
```

## Environment variables

| Variable | Purpose |
| --- | --- |
| `DEMO_MODE` / `PUBLIC_DEMO_MODE` | Demo safeguards (`true` for portfolio) |
| `PUBLIC_SITE_URL` | Canonical site origin |
| `PUBLIC_STUDIO_URL` | Che Xu Studio site |
| `PUBLIC_CASE_STUDY_URL` | Case study URL |
| `PUBLIC_PACKAGES_URL` | Packages URL |
| `PUBLIC_TURNSTILE_SITE_KEY` | Turnstile site key (public) |
| `TURNSTILE_SECRET_KEY` | Turnstile secret (server only) |
| `ALLOWED_ORIGINS` | Comma-separated allowed `Origin` values |
| `RATE_LIMIT_SALT` | Optional salt for future distributed limiting |
| `DB` | D1 binding |
| `AI` | Workers AI binding (optional) |

See `.dev.vars.example` for Wrangler local secrets/placeholders.

## DEMO_MODE

When `DEMO_MODE=true` (default):

- `noindex, nofollow`
- Fictional disclosure shown
- No fake Product / Offer / merchant schema
- Cart + checkout stay local demos (no real orders or payments)
- Real leads route to Che Xu Studio

When `DEMO_MODE=false`:

- Require verified merchant information, product data and pricing
- Require accurate stock and identifiers
- Require approved shipping and return policies
- Enable indexing only after validation
- Enable accurate structured data
- Remove fictional disclosures
- Connect approved checkout and fulfilment integrations

## Cloudflare setup

1. Deploy with `npm run deploy` (or Workers Builds using that command).  
   Wrangler auto-provisions the `harbour-pine-leads` D1 database when `database_id` is omitted, then applies migrations via `npm run db:remote`.
2. Create Turnstile widget and set secrets:
   - `wrangler secret put TURNSTILE_SECRET_KEY`
3. Set production vars / secrets for allowed origins
4. Attach custom domain `harbourandpinehome.chexustudio.com`

Do not commit a placeholder D1 `database_id`. Leave it omitted for auto-provisioning, or paste a real ID from `wrangler d1 list` after the first deploy.

Staging:

```bash
npm run deploy:staging
```

## D1 migrations

Migration: `migrations/0001_portfolio_leads.sql`

Stores consented Che Xu Studio leads only (`product_count` included). Never store fictional cart or checkout payloads.

## Turnstile

- Client renders widget when `PUBLIC_TURNSTILE_SITE_KEY` is set
- Server verifies token with `TURNSTILE_SECRET_KEY`
- Local/dev may use token `dev-bypass` only when the secret is unset

## Rate limiting

`/api/portfolio-lead/` uses per-IP in-memory limiting in the Worker isolate (demo-friendly). For production hardening, add Cloudflare Rate Limiting rules in the dashboard on `/api/*`.

## Image workflow

```bash
npm run generate:assets
```

Original SVG product/hero/OG assets are documented in `ASSET_LICENSES.md`. Replace with licensed photography for a real merchant and prefer Cloudflare Images when configured (AVIF/WebP, responsive `srcset`, reserved aspect ratios).

## Stripe test mode (optional)

Not enabled by default. If implemented later:

- Test mode only with explicit configuration
- Create Checkout Sessions server-side
- Use server-side product/price allowlists
- Never trust client-provided prices
- Verify webhook signatures and protect against duplicate events
- Clearly label Stripe’s test environment

## Workers AI

If the `AI` binding is available, `/api/assistant/` uses a small instruct model with strict guardrails. Without AI, a deterministic local helper responds safely from the typed catalogue.

## Product and collection editing

Edit `src/data/products.ts`. Shop, collections, product pages, filters, finder, cart and assistant all read from this typed source.

## Testing

```bash
npm run test          # unit
npm run typecheck
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

## Build and dry-run deployment

```bash
npm run build
npm run cf:dry-run
```

Production deploy (build + Wrangler):

```bash
npm run deploy
```

### Cloudflare Workers Builds settings

| Field | Value |
| --- | --- |
| Deploy command | `npm run deploy` |

Or separate build + deploy:

| Field | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy --env="" && npm run db:remote` |

`--env=""` targets the top-level Worker (`harbour-pine-home-demo`) when a `staging` environment is also defined.

## Custom domain

1. Deploy Worker
2. In Cloudflare, add route/custom domain `harbourandpinehome.chexustudio.com`
3. Update `PUBLIC_SITE_URL` and `ALLOWED_ORIGINS`
4. Verify HTTPS, headers and Turnstile

## Case-study publishing

Use `CASE_STUDY_COPY.md` for `https://chexustudio.com/work/harbour-pine-home`. Attach real screenshots after deploy. Never invent traffic/conversion results.

## Converting the demo for a verified real merchant

1. Collect verified merchant info, products, pricing, imagery and policies
2. Set `DEMO_MODE=false` only after validation
3. Wire checkout + fulfilment to approved providers
4. Enable accurate Product / Offer / OnlineStore schema
5. Remove portfolio disclosure + studio-only lead routing as appropriate
6. Re-run accessibility, SEO and performance QA

## Owner review required

- Turnstile keys
- D1 database id (after first deploy)
- Custom domain / DNS
- Packages + case study URLs if different
- Any real merchant content before leaving demo mode
- Privacy policy / data retention for leads
- Stripe test keys only if enabling payments later
