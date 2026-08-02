export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const HOME_FAQS: FaqItem[] = [
  {
    id: 'real-store',
    question: 'Is Harbour & Pine Home a real store?',
    answer:
      'No. Harbour & Pine Home is a fictional e-commerce demonstration created by Che Xu Studio to show how a modern home and lifestyle storefront can look, feel and convert.',
  },
  {
    id: 'customize',
    question: 'Can Che Xu Studio customize this design?',
    answer:
      'Yes. Brand colours, typography, photography, product architecture, filters, cart and checkout can be tailored to a verified merchant’s catalogue and operations.',
  },
  {
    id: 'stripe',
    question: 'Can the store connect to Stripe?',
    answer:
      'Yes. A real store can use Stripe Checkout in live mode with server-side price allowlists. This demo never processes live payments; Stripe test mode is optional and requires explicit configuration.',
  },
  {
    id: 'inventory',
    question: 'Can it connect to an existing inventory or fulfilment platform?',
    answer:
      'Yes. Product data, stock and fulfilment can integrate with approved platforms after verification. This demo uses a typed local catalogue and never creates real shipments.',
  },
  {
    id: 'cms',
    question: 'Can product information be managed without a developer?',
    answer:
      'Yes. Products can be structured for staff-friendly updates through typed configuration, a CMS or an approved operations workflow.',
  },
  {
    id: 'scale',
    question: 'Can the site support hundreds or thousands of products?',
    answer:
      'Yes. Routing, filtering, search and image strategies are designed to scale. Large catalogues may use edge caching, pagination and a dedicated product data source.',
  },
  {
    id: 'photography',
    question: 'Can Che Xu Studio optimize product photography?',
    answer:
      'Yes. We prepare responsive crops, modern formats, reserved aspect ratios and lazy-loading so products look sharp without slowing the site.',
  },
  {
    id: 'variants',
    question: 'Can the store support product variants?',
    answer:
      'Yes. Colour, size and finish variants are first-class in the product model, with accessible selectors and clear selected-state pricing.',
  },
  {
    id: 'product-seo',
    question: 'Can Che Xu Studio implement product SEO?',
    answer:
      'Yes. We structure product pages, collections, breadcrumbs and schema for discovery—using accurate product and merchant data only when verified.',
  },
  {
    id: 'currencies',
    question: 'Can the design support international currencies later?',
    answer:
      'Yes. Currency formatting is centralized. Additional currencies and markets can be added once pricing, tax and shipping rules are verified for each region.',
  },
];
