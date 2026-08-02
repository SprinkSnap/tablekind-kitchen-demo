export const STUDIO = {
  name: 'Che Xu Studio',
  url: 'https://chexustudio.com',
  caseStudyUrl: 'https://chexustudio.com/work/harbour-pine-home',
  packagesUrl: 'https://chexustudio.com/packages',
  contactPath: '/contact',
} as const;

export const STORE = {
  name: 'Harbour & Pine Home',
  shortName: 'Harbour & Pine',
  monogram: 'H&P',
  tagline: 'Thoughtful pieces for everyday living.',
  positioning: 'Modern Canadian home and lifestyle store',
  locale: 'en-CA',
  currency: 'CAD',
  currencySymbol: '$',
  workerName: 'harbour-pine-home-demo',
  stagingWorkerName: 'harbour-pine-home-demo-staging',
  publicDomain: 'https://harbourandpinehome.chexustudio.com',
  sourceDemo: 'harbour-pine-home',
} as const;

export const DISCLOSURE = {
  short:
    'Portfolio concept by Che Xu Studio. Harbour & Pine Home is a fictional e-commerce demonstration.',
  lines: [
    'Portfolio concept by Che Xu Studio',
    'Harbour & Pine Home is a fictional e-commerce demonstration.',
  ],
  portfolioBar: 'E-commerce website concept designed by Che Xu Studio.',
  cart: 'Demo cart—no real order will be created.',
  checkout:
    'This is a portfolio demonstration. No order, shipment or payment will be created.',
  shipping:
    'Illustrative policy for a fictional portfolio store. A real merchant must provide and approve its own terms.',
  sampleShipping:
    'Sample shipping information for demonstration only—not a real shipping offer.',
  sampleReturns:
    'Sample return information for demonstration only—not a real return policy.',
} as const;

/** Illustrative Canadian HST sample for demo totals only */
export const TAX_RATE = 0.13;

/** Sample flat shipping estimate for demo cart totals only (CAD) */
export const SAMPLE_SHIPPING = 12;

export function getSiteUrl(): string {
  return import.meta.env.PUBLIC_SITE_URL ?? STORE.publicDomain;
}

export function getStudioUrl(): string {
  return import.meta.env.PUBLIC_STUDIO_URL ?? STUDIO.url;
}

export function getCaseStudyUrl(): string {
  return import.meta.env.PUBLIC_CASE_STUDY_URL ?? STUDIO.caseStudyUrl;
}

export function getPackagesUrl(): string {
  return import.meta.env.PUBLIC_PACKAGES_URL ?? STUDIO.packagesUrl;
}

export function isDemoMode(): boolean {
  const value = import.meta.env.PUBLIC_DEMO_MODE ?? 'true';
  return value !== 'false';
}
