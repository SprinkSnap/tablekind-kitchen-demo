# Launch Checklist — Tablekind Kitchen Demo

## Before any deploy

- [ ] `DEMO_MODE=true` confirmed for the public portfolio demo
- [ ] `noindex, nofollow` present on all pages
- [ ] Fictional disclosure visible on key pages
- [ ] No street address, phone, reviews, ratings or press claims
- [ ] No alcohol / age-restricted products
- [ ] Menu dietary notice present
- [ ] Reservation and order flows complete locally only
- [ ] Che Xu Studio enquiry form is the only real lead capture
- [ ] Turnstile site key + secret configured for production
- [ ] D1 auto-provisioned on deploy (or real `database_id` set — never a placeholder UUID)
- [ ] D1 migrations applied (`npm run db:remote` / `portfolio_leads`)
- [ ] `ALLOWED_ORIGINS` includes the production hostname
- [ ] Secrets are in Wrangler secrets / `.dev.vars`, never in git
- [ ] `npm run check` passes
- [ ] `npm run build` passes
- [ ] `npm run test:e2e` passes
- [ ] `npm run cf:dry-run` passes
- [ ] Custom domain `tablekindkitchen.chexustudio.com` ready (owner action)
- [ ] Case study published at `https://chexustudio.com/work/tablekind-kitchen` (owner action)

## Production Worker

- [ ] Worker name: `tablekind-kitchen-demo`
- [ ] Staging Worker: `tablekind-kitchen-demo-staging`
- [ ] Observability enabled
- [ ] Rate limiting / Turnstile verified with a real submission test
- [ ] CSP / HSTS headers verified
- [ ] AI binding optional; assistant falls back safely without it

## Converting for a verified restaurant later

- [ ] Set `DEMO_MODE=false` only after verified NAP, hours and menu data exist
- [ ] Remove fictional disclosure
- [ ] Enable accurate Restaurant / LocalBusiness schema
- [ ] Connect approved reservation + ordering providers
- [ ] Replace demo imagery with licensed photography
- [ ] Re-enable indexing only after validation
- [ ] Owner legal/privacy review completed
