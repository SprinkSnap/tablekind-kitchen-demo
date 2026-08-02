export const prerender = true;

import type { APIRoute } from 'astro';
import { COLLECTIONS, PRODUCTS } from '../data/products';
import { getSiteUrl } from '../lib/config';

const staticRoutes = [
  '/',
  '/shop/',
  '/collections/',
  '/search/',
  '/wishlist/',
  '/cart/',
  '/checkout/',
  '/checkout/success/',
  '/checkout/cancelled/',
  '/about/',
  '/journal/',
  '/shipping/',
  '/returns/',
  '/contact/',
  '/accessibility/',
  '/privacy/',
  '/terms/',
];

export const GET: APIRoute = () => {
  const site = getSiteUrl().replace(/\/$/, '');

  const productRoutes = PRODUCTS.map((p) => `/products/${p.slug}/`);
  const collectionRoutes = COLLECTIONS.map((c) => `/collections/${c.slug}/`);
  const routes = [...staticRoutes, ...collectionRoutes, ...productRoutes];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (path) => `  <url>
    <loc>${site}${path}</loc>
    <changefreq>monthly</changefreq>
  </url>`,
  )
  .join('\n')}
</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
