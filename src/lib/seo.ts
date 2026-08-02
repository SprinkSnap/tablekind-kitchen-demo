import { RESTAURANT, getSiteUrl, STUDIO } from './config';
import { getDemoCapabilities } from './demo-mode';
import { CATEGORY_META, MENU_ITEMS, type MenuItem } from '../data/menu';
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
  if (!pageTitle) return `${RESTAURANT.name} | ${RESTAURANT.tagline}`;
  return `${pageTitle} | ${RESTAURANT.name}`;
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: RESTAURANT.name,
    url: getSiteUrl(),
    description: RESTAURANT.tagline,
    inLanguage: RESTAURANT.locale,
    publisher: {
      '@type': 'Organization',
      name: STUDIO.name,
      url: STUDIO.url,
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
      'Che Xu Studio designs and builds fast, conversion-focused websites for local businesses.',
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

export function menuItemSchema(item: MenuItem) {
  return {
    '@type': 'MenuItem',
    name: item.name,
    description: item.description,
    offers: {
      '@type': 'Offer',
      price: item.price.toFixed(2),
      priceCurrency: RESTAURANT.currency,
    },
  };
}

export function menuSchema() {
  const sections = Object.entries(CATEGORY_META).map(([key, meta]) => {
    const items = MENU_ITEMS.filter((item) => item.category === key);
    return {
      '@type': 'MenuSection',
      name: meta.label,
      description: meta.description,
      hasMenuItem: items.map(menuItemSchema),
    };
  });

  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: `${RESTAURANT.name} Menu`,
    description: 'Seasonal brunch, lunch, dinner, desserts and non-alcoholic drinks.',
    hasMenuSection: sections,
  };
}

/**
 * LocalBusiness / Restaurant schema is intentionally omitted in DEMO_MODE.
 * Never publish fabricated NAP, reviews or ratings.
 */
export function localBusinessSchemaIfAllowed() {
  const caps = getDemoCapabilities();
  if (caps.demoMode || !caps.allowFakeLocalBusinessSchema) return null;
  return null;
}

export function jsonLdScript(data: unknown | unknown[]): string {
  const payload = Array.isArray(data) ? data.filter(Boolean) : data;
  return JSON.stringify(payload);
}
