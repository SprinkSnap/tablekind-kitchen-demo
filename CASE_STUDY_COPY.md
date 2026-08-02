# Harbour & Pine Home — Case Study Copy

Publish at: `https://chexustudio.com/work/harbour-pine-home`

## SEO

**Title:** E-commerce Website Design Demo | Che Xu Studio

**Meta description:** Explore Harbour & Pine Home, a mobile-first e-commerce concept by Che Xu Studio featuring product discovery, optimized images, accessible checkout and product SEO.

## H1

Harbour & Pine Home E-commerce Website Concept

## Disclosure

Concept Project — Created to demonstrate Che Xu Studio’s e-commerce design, SEO and conversion capabilities.

Harbour & Pine Home is a fictional store. No real orders, shipments or payments are processed.

## Project overview

Harbour & Pine Home is a portfolio demonstration of a modern Canadian home and lifestyle storefront. It shows how Che Xu Studio designs product discovery, collection architecture, variant selection, wishlist and cart flows, guest checkout demonstration, technical SEO foundations and accessible mobile shopping—without fake urgency, fabricated reviews or deceptive conversion patterns.

**Live demo:** https://harbourandpinehome.chexustudio.com

## Intended merchant audience

- Home goods and lifestyle retailers
- Specialty retailers building their first custom storefront
- Merchants migrating away from generic template themes
- Brands that need clearer product information and faster browsing

## Fictional business challenge

Many home and lifestyle merchants struggle with storefronts that bury products behind cluttered layouts, weak mobile experiences and unclear product detail. Harbour & Pine Home demonstrates an alternative: calm visual design, structured collections, shareable filters, transparent pricing and a low-friction demo checkout—so decision-makers can evaluate the experience Che Xu Studio can tailor to a verified catalogue.

## Customer journey

1. Land on a full-bleed editorial hero with a single primary path into the shop
2. Browse collections or use search and filters
3. Open a product page with variants, materials, dimensions and care
4. Save to wishlist or add to the demo cart
5. Complete a guest checkout demonstration (local only)
6. Optionally request a Che Xu Studio store plan

## Product architecture

Twenty-two typed fictional products across six collections (Living, Kitchen & Dining, Textiles, Storage, Workspace, Gifts). Each product includes variants, materials, dimensions, care, related products and SEO fields. The catalogue is a single TypeScript module consumed by pages, filters, cart and assistant.

## Search and filtering

Shoppers can filter by collection, colour, category, price range and availability, then sort results. Active filters are summarized and clearable. Result counts are announced for assistive technologies. Filter state is reflected in the URL where practical.

## Product-page strategy

Product pages prioritize:

- Breadcrumbs and clear hierarchy
- Reserved-aspect imagery
- Accessible variant selection
- Stable, transparent pricing
- Materials, dimensions and care
- Sample shipping/return notes clearly labelled as illustrative
- Related products and a Che Xu Studio CTA

No fabricated ratings, stock scarcity or countdown timers.

## Cart and checkout flow

The demo cart persists in the browser, shows sample shipping and tax estimates, and never creates a real order. Checkout is a multi-step guest demonstration with explicit disclosures. Completion invites the visitor to contact Che Xu Studio.

## Mobile design

Mobile-first layouts, sticky cart access, large touch targets, accessible mobile navigation with focus restoration and scroll locking, and minimal client JavaScript outside interactive islands.

## Product SEO

Prepared architecture for unique titles/descriptions, canonical URLs, breadcrumbs, sitemap, robots, Open Graph and schema types (`WebSite`, `Organization`, `BreadcrumbList`, `FAQPage`). In `DEMO_MODE`, Product/Offer/merchant schema is suppressed and pages are `noindex, nofollow`.

## Image optimization

Purpose-built SVG catalogue imagery with reserved dimensions, lazy-loading below the fold and eager LCP hero loading. Ready to swap for licensed photography and Cloudflare Images (AVIF/WebP, `srcset`, accurate `sizes`).

## Accessibility

Skip link, landmarks, keyboard navigation, focus-visible styles, dialog focus traps, status announcements, reduced-motion support and large touch targets—aligned toward WCAG 2.2 AA as closely as practical.

## Technical architecture

- Astro + Cloudflare Workers (static assets)
- Strict TypeScript product configuration
- React islands for cart, filters, checkout demo, enquiry and assistant
- D1 for consented Che Xu Studio leads only
- Turnstile, origin validation, rate limiting and CSP headers

## Security

Content Security Policy, HSTS in production, strict lead endpoint validation, honeypot, Turnstile server verification, prepared D1 statements, personal-data redaction in logs and no secrets in client code.

## Verified performance results

Attach Lighthouse and page-weight results from a production or preview deploy after measurement. Do **not** invent Core Web Vitals or conversion metrics.

Targets (to verify after deploy):

- Lighthouse Performance 95+
- Accessibility 95–100
- Best Practices 95+
- SEO 100 where compatible with deliberate `noindex`
- LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1

## Screenshots

Add desktop and mobile screenshots of:

- Homepage hero
- Collection / shop filters
- Product page with variants
- Cart drawer and checkout demo
- Che Xu Studio enquiry drawer

## Live demo link

https://harbourandpinehome.chexustudio.com

## CTA

**Build a Store Like This** — Request a store plan from Che Xu Studio tailored to your products, customers and growth goals.

View packages: https://chexustudio.com/packages
