import { isDemoMode } from './config';

export type DemoCapabilities = {
  demoMode: boolean;
  indexable: boolean;
  showFictionalDisclosure: boolean;
  allowFakeProductSchema: boolean;
  allowFakeMerchantSchema: boolean;
  allowRealCheckout: boolean;
  allowRealPayments: boolean;
  routeLeadsToStudio: boolean;
};

/**
 * DEMO_MODE controls indexing, disclosures, and integration behaviour.
 * When false, verified merchant + product data must be supplied before
 * enabling indexing or structured Product/Offer data.
 */
export function getDemoCapabilities(verifiedMerchantReady = false): DemoCapabilities {
  const demoMode = isDemoMode();

  if (demoMode) {
    return {
      demoMode: true,
      indexable: false,
      showFictionalDisclosure: true,
      allowFakeProductSchema: false,
      allowFakeMerchantSchema: false,
      allowRealCheckout: false,
      allowRealPayments: false,
      routeLeadsToStudio: true,
    };
  }

  return {
    demoMode: false,
    indexable: verifiedMerchantReady,
    showFictionalDisclosure: false,
    allowFakeProductSchema: false,
    allowFakeMerchantSchema: false,
    allowRealCheckout: verifiedMerchantReady,
    allowRealPayments: verifiedMerchantReady,
    routeLeadsToStudio: false,
  };
}

export function robotsMetaContent(): string {
  const caps = getDemoCapabilities();
  return caps.indexable ? 'index, follow' : 'noindex, nofollow';
}
