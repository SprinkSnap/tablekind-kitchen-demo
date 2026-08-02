import { isDemoMode } from './config';

export type DemoCapabilities = {
  demoMode: boolean;
  indexable: boolean;
  showFictionalDisclosure: boolean;
  allowFakeLocalBusinessSchema: boolean;
  allowRealReservations: boolean;
  allowRealOrdering: boolean;
  routeLeadsToStudio: boolean;
};

/**
 * DEMO_MODE controls indexing, disclosures, and integration behaviour.
 * When false, verified restaurant information must be supplied before
 * enabling indexing or structured LocalBusiness data.
 */
export function getDemoCapabilities(verifiedRestaurantReady = false): DemoCapabilities {
  const demoMode = isDemoMode();

  if (demoMode) {
    return {
      demoMode: true,
      indexable: false,
      showFictionalDisclosure: true,
      allowFakeLocalBusinessSchema: false,
      allowRealReservations: false,
      allowRealOrdering: false,
      routeLeadsToStudio: true,
    };
  }

  return {
    demoMode: false,
    indexable: verifiedRestaurantReady,
    showFictionalDisclosure: false,
    allowFakeLocalBusinessSchema: false,
    allowRealReservations: verifiedRestaurantReady,
    allowRealOrdering: verifiedRestaurantReady,
    routeLeadsToStudio: false,
  };
}

export function robotsMetaContent(): string {
  const caps = getDemoCapabilities();
  return caps.indexable ? 'index, follow' : 'noindex, nofollow';
}
