# Tablekind Kitchen Demo

Portfolio restaurant website concept by **Che Xu Studio**.

- Restaurant: **Tablekind Kitchen**
- Tagline: **Seasonal food, made for gathering.**
- Public domain: https://tablekindkitchen.chexustudio.com
- Case study: https://chexustudio.com/work/tablekind-kitchen
- Worker: `tablekind-kitchen-demo`
- Staging Worker: `tablekind-kitchen-demo-staging`

Tablekind Kitchen is fictional. The standalone demo uses `noindex, nofollow`. Genuine business enquiries go to Che Xu Studio only.

## Architecture

- **Astro** (static prerendered pages) + **Cloudflare Workers** adapter
- **React islands** for reservations, ordering, catering planner, portfolio bar, enquiry drawer and assistant
- **Tailwind CSS v4** design tokens
- **Typed menu module** shared across pages and demos
- **D1** for consented Che Xu Studio leads (`source_demo = tablekind-kitchen`)
- **Turnstile** + origin checks + honeypot + in-process rate limiting on `/api/portfolio-lead/`
- Optional **Workers AI** assistant at `/api/assistant/` with safe local fallback

```
src/
  components/astro|react  UI
  data/                   menu + FAQ
  layouts/                BaseLayout
  lib/                    config, cart, SEO, validation, reservations
  pages/                  routes + API
migrations/               D1 SQL
tests/                    Vitest + Playwright
```

## Local setup

```bash
npm install
cp .env.example .env
cp .dev.vars.example .dev.vars
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
- No fake LocalBusiness / address / phone schema
- Reservations + ordering stay local demos
- Real leads route to Che Xu Studio

When `DEMO_MODE=false`:

- Require verified restaurant NAP, hours and menu data
- Enable indexing only after validation
- Enable accurate structured data
- Remove fictional disclosure
- Connect approved real integrations

## Cloudflare setup

1. Create D1 database `tablekind-leads`
2. Put the real `database_id` into `wrangler.jsonc`
3. Apply migrations: `wrangler d1 migrations apply tablekind-leads --remote`
4. Create Turnstile widget and set secrets:
   - `wrangler secret put TURNSTILE_SECRET_KEY`
5. Set production vars / secrets for allowed origins
6. Deploy Worker `tablekind-kitchen-demo`
7. Attach custom domain `tablekindkitchen.chexustudio.com`

Staging:

```bash
npm run build
npx wrangler deploy --env staging
```

## D1 migrations

Migration: `migrations/0001_portfolio_leads.sql`

Stores consented Che Xu Studio leads only. Never store fictional reservation/order payloads.

## Turnstile

- Client renders widget when `PUBLIC_TURNSTILE_SITE_KEY` is set
- Server verifies token with `TURNSTILE_SECRET_KEY`
- Local/dev may use token `dev-bypass` only when the secret is unset

## Rate limiting

`/api/portfolio-lead/` uses per-IP in-memory limiting in the Worker isolate (demo-friendly). For production hardening, add Cloudflare Rate Limiting rules in the dashboard on `/api/*`.

## Image workflow

```bash
node scripts/generate-dish-svgs.mjs
```

Original SVG dish/hero/OG assets are documented in `ASSET_LICENSES.md`. Replace with licensed photography for a real restaurant and prefer Cloudflare Images when configured.

## Workers AI

If the `AI` binding is available, `/api/assistant/` uses a small instruct model with strict guardrails. Without AI, a deterministic local helper responds safely.

## Menu editing

Edit `src/data/menu.ts`. All menu pages, filters, featured modules and ordering read from this typed source.

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

Do **not** deploy without explicit authorization.

## Custom domain

1. Deploy Worker
2. In Cloudflare, add route/custom domain `tablekindkitchen.chexustudio.com`
3. Update `PUBLIC_SITE_URL` and `ALLOWED_ORIGINS`
4. Verify HTTPS, headers and Turnstile

## Case-study publishing

Use `CASE_STUDY_COPY.md` for `https://chexustudio.com/work/tablekind-kitchen`. Attach real screenshots after deploy. Never invent traffic/conversion results.

## Converting the demo for a verified restaurant

1. Collect verified NAP, hours, menu, imagery and policies
2. Set `DEMO_MODE=false` only after validation
3. Wire reservation + ordering adapters to approved providers
4. Enable accurate Restaurant/LocalBusiness schema
5. Remove portfolio disclosure + studio-only lead routing as appropriate
6. Re-run accessibility, SEO and performance QA

## Owner review required

- Turnstile keys
- D1 database id
- Custom domain / DNS
- Packages + case study URLs if different
- Any real restaurant content before leaving demo mode
- Privacy policy / data retention for leads
