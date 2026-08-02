export const prerender = true;

import type { APIRoute } from 'astro';
import { getSiteUrl } from '../lib/config';

const routes = [
  '/',
  '/menu/',
  '/menu/brunch/',
  '/menu/lunch/',
  '/menu/dinner/',
  '/menu/dessert/',
  '/reservations/',
  '/order/',
  '/catering/',
  '/private-events/',
  '/about/',
  '/location/',
  '/contact/',
  '/accessibility/',
];

export const GET: APIRoute = () => {
  const site = getSiteUrl().replace(/\/$/, '');
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
