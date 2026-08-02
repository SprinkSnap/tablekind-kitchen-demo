# Launch Checklist — Harbour & Pine Home Demo

## Before any deploy

- [ ] `DEMO_MODE=true` / `PUBLIC_DEMO_MODE=true` confirmed for portfolio demo
- [ ] No real merchant address, phone, founders, reviews or scarcity claims in content
- [ ] Product catalogue reviewed for age-restricted or unsafe items (none)
- [ ] `robots.txt` disallows crawling; pages emit `noindex, nofollow`
- [ ] Fake Product/Offer/merchant schema suppressed
- [ ] Cart/checkout disclosures visible
- [ ] Lead form is the only real data capture path
- [ ] Secrets only in Wrangler secrets / `.dev.vars` (never committed)

## Cloudflare

- [ ] Worker name `harbour-pine-home-demo` (staging: `harbour-pine-home-demo-staging`)
- [ ] Workers Builds deploy command: `npm run deploy` (or build + `wrangler deploy --env=""` + `db:remote`)
- [ ] D1 `harbour-pine-leads` provisioned; migrations applied
- [ ] Turnstile site key + secret configured
- [ ] `ALLOWED_ORIGINS` includes production domain
- [ ] Custom domain `harbourandpinehome.chexustudio.com` attached
- [ ] Security headers verified (CSP, HSTS, Referrer-Policy, Permissions-Policy)
- [ ] Optional: Cloudflare Rate Limiting on `/api/*`
- [ ] Optional: Workers AI binding for assistant

## QA

- [ ] `npm run check` (format, lint, typecheck, unit tests)
- [ ] `npm run build`
- [ ] `npm run cf:dry-run`
- [ ] Playwright smoke + a11y + API tests
- [ ] Manual keyboard pass: nav, filters, variants, cart, checkout, enquiry
- [ ] Mobile pass at 360 / 390 / 768
- [ ] Desktop pass at 1024 / 1440
- [ ] Lighthouse on homepage, collection, product, search, cart, checkout
- [ ] Broken-link spot check on primary routes

## Case study

- [ ] Publish `CASE_STUDY_COPY.md` to chexustudio.com/work/harbour-pine-home
- [ ] Attach real screenshots (never invent traffic/sales results)
- [ ] Link live demo URL

## Owner-supplied values still required

- Turnstile keys
- Confirmed D1 database id (after first provision)
- DNS / custom domain authorization
- Any real merchant assets if converting out of demo mode
- Privacy retention policy for studio leads
