# Tablekind Kitchen Case Study Copy

Publish at: `https://chexustudio.com/work/`

## SEO title

Restaurant Website Design Demo | Che Xu Studio

## Meta description

Explore Tablekind Kitchen, a mobile-first restaurant website concept by Che Xu Studio featuring reservations, ordering, restaurant SEO and optimized food imagery.

## H1

Tablekind Kitchen Restaurant Website Concept

## Disclosure

Concept Project — Created to demonstrate Che Xu Studio’s restaurant design, SEO and conversion capabilities.

## Live demo

https://tablekindkitchen.chexustudio.com

## Project overview

Tablekind Kitchen is a fictional modern Canadian neighbourhood restaurant website built as a portfolio demonstration. It shows how Che Xu Studio designs fast, accessible, conversion-focused restaurant experiences around menus, reservations, pickup ordering, catering enquiries and local discovery.

## Intended audience

- Independent restaurant owners
- Neighbourhood cafés and dining groups evaluating a website rebuild
- Operators who need clearer paths to reservations, pickup orders and catering leads
- Marketing leads comparing custom design versus template-based restaurant sites

## Fictional business challenge

Many local restaurants still rely on PDF menus, slow themes and unclear next steps. Guests struggle to browse dishes on mobile, booking feels fragmented and catering enquiries arrive as unstructured messages. Tablekind Kitchen demonstrates a cleaner alternative: one coherent brand experience that makes dining decisions easy without manipulative urgency tactics.

## Customer journey

1. Land on a warm, editorial homepage with one clear composition and honest demo disclosure.
2. Browse semantic HTML menus with filters, prices and dietary indicators.
3. Start a short reservation demo or pickup-order demo.
4. Explore catering / private-event planners.
5. Contact Che Xu Studio to request a website plan.

## Menu architecture

A single typed menu-data module powers every menu page, featured dish module, filter UI and ordering drawer. Categories include brunch, lunch, small plates, mains, sides, desserts and non-alcoholic drinks. Content remains visible as semantic HTML and never depends on a PDF.

## Reservation funnel

An accessible multistep flow collects party size, date, time, seating preference and optional notes, then clearly states that no real table is reserved. A provider-agnostic adapter interface is ready for an approved reservation integration later.

## Pickup-ordering flow

Guests can open item details, choose modifiers, manage quantity, persist a demo cart locally, select a pickup time and complete the experience in-browser. Sample tax is shown for realism. No payment provider is charged and no kitchen ticket is created.

## Catering lead generation

Catering and private-event planners gather event type, guest count, date, service style, dietary considerations and fulfillment preference. Fictional Tablekind enquiries are not transmitted; completion invites a real Che Xu Studio conversation.

## Mobile design

The experience is mobile-first, with sticky header navigation, a compact mobile action bar (Menu / Reserve / Order), large touch targets and drawers that restore focus and prevent background scroll.

## Local SEO strategy

Technical SEO includes unique titles/descriptions, canonical URLs, breadcrumbs, sitemap, robots rules, Open Graph tags, FAQ schema, Menu schema and WebSite/Organization schema. In `DEMO_MODE`, the site remains `noindex, nofollow` and omits fabricated LocalBusiness NAP, reviews and ratings.

## Image optimization

Dish and hero visuals are purpose-built SVG assets with reserved aspect ratios, explicit dimensions, lazy-loading below the fold and an eager LCP hero treatment. A real restaurant can swap in licensed photography through Cloudflare Images or local responsive pipelines.

## Accessibility

Implementation targets WCAG 2.2 AA as closely as practical: skip link, landmarks, keyboard support, dialog focus management, visible focus, status messages, reduced motion and contrast-conscious brand colours.

## Technical architecture

- Astro with Strict TypeScript
- Cloudflare Workers + Static Assets
- React islands for interactive flows only
- Tailwind CSS design tokens
- Zod validation for the Che Xu Studio lead API
- Cloudflare Turnstile, origin checks, honeypot and rate limiting
- D1 storage for consented studio leads only
- Optional Workers AI assistant with strict guardrails

## Security

Portfolio lead submissions are protected with schema validation, allowed-field lists, request-size limits, content-type checks, origin validation, honeypot, Turnstile server verification, rate limiting, prepared D1 statements and personal-data redaction in logs.

## Verified performance results

Performance should be measured on the deployed Worker with Lighthouse / CrUX after assets and edge configuration are live. Do not publish fictional conversion, traffic or Lighthouse scores as real results. Target budgets for evaluation:

- Lighthouse Performance 95+
- Accessibility 95–100
- Best Practices 95+
- SEO 100 where compatible with deliberate `noindex`
- LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1

## Screenshots

Capture after deploy (or against a local `astro` preview) with:

```bash
npm run screenshots:desktop   # 1440×900 @ 2×
npm run screenshots:tablet    # iPad Pro 11 @ 2×
npm run screenshots:mobile    # iPhone 14 @ 2× (390×844)
npm run screenshots           # all devices + assemble showcase kit
```

### Best single showcase shot per device (use these first on chexustudio.com/work)

These three frames are the highest-leverage conversion + SEO proof for the case study:

| Device | File | Why it wins |
| --- | --- | --- |
| Desktop | `01-desktop-homepage-hero.png` | Full-bleed brand hero + clear CTAs — SEO first impression and editorial quality |
| Tablet | `01-tablet-homepage-hero.png` | Mid-breakpoint brand composition without mobile chrome — proves responsive design |
| Mobile | `01-mobile-homepage-sticky-actions.png` | Hero + sticky Menu / Reserve / Order — conversion path is immediately visible |

Committed media kit paths:

- `docs/screenshots/showcase/showcase-desktop-homepage-hero.png`
- `docs/screenshots/showcase/showcase-tablet-homepage-hero.png`
- `docs/screenshots/showcase/showcase-mobile-homepage-sticky-actions.png`

### Recommended desktop set (case-study priority)

1. `01-desktop-homepage-hero.png` — Full-bleed homepage hero composition
2. `02-desktop-menu-filtering.png` — Menu sidebar filters + filtered dish results
3. `03-desktop-reservation-complete.png` — Reservation demo completion + studio CTA
4. `04-desktop-pickup-cart-drawer.png` — Pickup cart drawer with totals
5. `05-desktop-studio-enquiry-drawer.png` — Che Xu Studio enquiry drawer over the hero

### Supporting desktop shots

6. `06-desktop-reservation-form.png` — Reservation step 1 booking form
7. `07-desktop-dining-options.png` — Homepage “Choose How You Gather” paths
8. `08-desktop-order-browse.png` — Pickup order dish grid

### Recommended tablet set (case-study priority)

1. `01-tablet-homepage-hero.png` — Brand-first responsive hero on iPad Pro 11
2. `02-tablet-menu-filtering.png` — Semantic menu search + dietary filters
3. `03-tablet-reservation-complete.png` — Reservation demo completion + studio CTA
4. `04-tablet-pickup-cart-drawer.png` — Pickup cart drawer with totals
5. `05-tablet-studio-enquiry-drawer.png` — Che Xu Studio enquiry drawer

### Recommended mobile set (case-study priority)

1. `01-mobile-homepage-sticky-actions.png` — Homepage hero + sticky Menu / Reserve / Order bar
2. `02-mobile-menu-filtering.png` — Menu search + dietary filter with live results
3. `03-mobile-reservation-complete.png` — Reservation demo completion + studio CTA
4. `04-mobile-pickup-cart-drawer.png` — Pickup cart drawer with totals
5. `05-mobile-studio-enquiry-drawer.png` — Che Xu Studio enquiry drawer

### Supporting mobile shots

6. `06-mobile-reservation-preferences.png` — Reservation preferences step
7. `07-mobile-order-browse.png` — Pickup order browse with dish card

## Primary CTA

Build a Website Like This → Che Xu Studio enquiry / packages

## Important honesty note

Tablekind Kitchen is fictional. Do not describe invented bookings, revenue lift, traffic growth or review scores as real client outcomes.
