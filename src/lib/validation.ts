import { z } from 'zod';

export const BUSINESS_TYPES = [
  'home-goods',
  'furniture',
  'apparel',
  'beauty',
  'specialty-retail',
  'other-ecommerce',
] as const;

export const PRIMARY_GOALS = [
  'increase-online-sales',
  'better-product-discovery',
  'faster-storefront',
  'product-seo',
  'brand-refresh',
  'migrate-platform',
] as const;

export const NEEDED_FEATURES = [
  'product-catalogue',
  'variants',
  'search-filters',
  'wishlist',
  'cart-checkout',
  'stripe',
  'cms',
  'analytics',
] as const;

export const PRODUCT_COUNTS = [
  '1-20',
  '21-100',
  '101-500',
  '500-plus',
  'not-sure',
] as const;

export const LAUNCH_TIMINGS = [
  'asap',
  '1-2-months',
  '3-6-months',
  'exploring',
] as const;

export const portfolioLeadSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required').max(120),
    email: z.string().trim().email('Enter a valid email').max(254),
    businessName: z.string().trim().max(160).optional(),
    businessType: z.enum(BUSINESS_TYPES),
    existingWebsite: z.string().trim().max(300).optional(),
    productCount: z.enum(PRODUCT_COUNTS),
    primaryGoal: z.enum(PRIMARY_GOALS),
    neededFeatures: z.array(z.enum(NEEDED_FEATURES)).min(1).max(8),
    launchTiming: z.enum(LAUNCH_TIMINGS),
    message: z.string().trim().max(2000).optional(),
    consent: z.literal(true, { error: 'Consent is required' }),
    website: z.string().max(0).optional(), // honeypot
    turnstileToken: z.string().min(1).max(4000),
  })
  .strict();

export type PortfolioLeadInput = z.infer<typeof portfolioLeadSchema>;

export const chatMessageSchema = z
  .object({
    message: z.string().trim().min(1).max(500),
    history: z
      .array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string().max(1000),
        }),
      )
      .max(8)
      .optional(),
  })
  .strict();

export const MAX_REQUEST_BYTES = 12_000;

export function redactLeadForLogs(lead: PortfolioLeadInput): Record<string, unknown> {
  return {
    businessType: lead.businessType,
    productCount: lead.productCount,
    primaryGoal: lead.primaryGoal,
    neededFeatures: lead.neededFeatures,
    launchTiming: lead.launchTiming,
    hasMessage: Boolean(lead.message),
    consent: true,
    emailDomain: lead.email.includes('@') ? lead.email.split('@')[1] : '[redacted]',
  };
}
