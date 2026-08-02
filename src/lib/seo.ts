import { STORE, getSiteUrl, STUDIO } from './config';
import { getDemoCapabilities } from './demo-mode';
import { COLLECTIONS, type Product } from '../data/products';
import { HOME_FAQS } from '../data/faq';

export type PageSeo = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: 'website' | 'article';
};

export function absoluteUrl(path: string): string {
  const base = getSiteUrl().replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const withSlash = normalized.endsWith('/') ? normalized : `${normalized}/`;
  if (withSlash === '//') return `${base}/`;
  return `${base}${withSlash === '/' ? '/' : withSlash}`;
}

export function buildTitle(pageTitle?: string): string {
  if (!pageTitle) return `${STORE.name} | ${STORE.tagline}`;
  return `${pageTitle} | ${STORE.name}`;
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: STORE.name,
    url: getSiteUrl(),
    description: STORE.tagline,
    inLanguage: STORE.locale,
    publisher: {
      '@type': 'Organization',
      name: STUDIO.name,
      url: STUDIO.url,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${getSiteUrl().replace(/\/$/, '')}/search/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: STUDIO.name,
    url: STUDIO.url,
    description:
      'Che Xu Studio designs and builds fast, conversion-focused e-commerce websites.',
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Product / Offer / OnlineStore schema is intentionally omitted in DEMO_MODE.
 * Never publish fabricated SKUs, ratings, reviews or merchant NAP.
 */
export function productSchemaIfAllowed(_product: Product) {
  const caps = getDemoCapabilities();
  if (caps.demoMode || !caps.allowFakeProductSchema) return null;
  return null;
}

export function onlineStoreSchemaIfAllowed() {
  const caps = getDemoCapabilities();
  if (caps.demoMode || !caps.allowFakeMerchantSchema) return null;
  return null;
}

export function collectionListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${STORE.name} Collections`,
    itemListElement: COLLECTIONS.map((c, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: c.name,
      url: absoluteUrl(`/collections/${c.slug}/`),
    })),
  };
}

export function jsonLdScript(data: unknown | unknown[]): string {
  const payload = Array.isArray(data) ? data.filter(Boolean) : data;
  return JSON.stringify(payload);
}
