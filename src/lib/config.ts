export const STUDIO = {
  name: 'Che Xu Studio',
  url: 'https://chexustudio.com',
  caseStudyUrl: 'https://chexustudio.com/work/tablekind-kitchen',
  packagesUrl: 'https://chexustudio.com/packages',
  contactPath: '/contact',
} as const;

export const RESTAURANT = {
  name: 'Tablekind Kitchen',
  tagline: 'Seasonal food, made for gathering.',
  positioning: 'Modern Canadian neighbourhood dining',
  locale: 'en-CA',
  currency: 'CAD',
  currencySymbol: '$',
  workerName: 'tablekind-kitchen-demo',
  stagingWorkerName: 'tablekind-kitchen-demo-staging',
  publicDomain: 'https://tablekindkitchen.chexustudio.com',
  sourceDemo: 'tablekind-kitchen',
} as const;

export const DISCLOSURE = {
  short: 'Portfolio concept by Che Xu Studio. Tablekind Kitchen is a fictional restaurant demonstration.',
  lines: [
    'Portfolio concept by Che Xu Studio',
    'Tablekind Kitchen is a fictional restaurant demonstration.',
  ],
  portfolioBar: 'Restaurant website concept designed by Che Xu Studio.',
  reservation:
    'This is an interactive portfolio demonstration. No real table will be reserved and no personal information is required.',
  ordering:
    'Demo ordering only—no food will be prepared and no real payment will be processed.',
  dietary:
    'Dietary labels are illustrative. In a real restaurant, always confirm ingredients and allergens with staff.',
  hours: 'Sample hours shown for demonstration only.',
  location:
    'No street address or phone number is published because Tablekind Kitchen is a fictional portfolio concept.',
} as const;

export const TAX_RATE = 0.13; // Illustrative Canadian HST sample for demo totals only

export function getSiteUrl(): string {
  return import.meta.env.PUBLIC_SITE_URL ?? RESTAURANT.publicDomain;
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
