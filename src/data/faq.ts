export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const HOME_FAQS: FaqItem[] = [
  {
    id: 'real-restaurant',
    question: 'Is Tablekind Kitchen a real restaurant?',
    answer:
      'No. Tablekind Kitchen is a fictional restaurant demonstration created by Che Xu Studio to show how a modern neighbourhood restaurant website can look, feel and convert.',
  },
  {
    id: 'customize',
    question: 'Can Che Xu Studio customize this design?',
    answer:
      'Yes. Colour, typography, photography, menu structure, reservation flow and ordering experience can be tailored to a verified restaurant brand and operations.',
  },
  {
    id: 'reservation-provider',
    question: 'Can the reservation flow connect to an existing provider?',
    answer:
      'Yes. The demo uses a provider-agnostic adapter interface so a real restaurant can connect an approved reservation system after verification.',
  },
  {
    id: 'pos-ordering',
    question: 'Can online ordering connect to an existing POS?',
    answer:
      'Yes. Pickup ordering can be connected to an approved POS or ordering provider. This demo completes locally and never processes real payments.',
  },
  {
    id: 'menu-updates',
    question: 'Can restaurant staff update the menu?',
    answer:
      'Yes. Menu content can be structured for staff-friendly updates through typed configuration, a CMS or an approved operations workflow.',
  },
  {
    id: 'multi-location',
    question: 'Can the website support multiple locations?',
    answer:
      'Yes. Routing, menus, hours and local SEO can be extended for multiple verified locations without rebuilding the experience from scratch.',
  },
  {
    id: 'food-photography',
    question: 'Can Che Xu Studio optimize food photography?',
    answer:
      'Yes. We can prepare responsive crops, modern formats, reserved aspect ratios and lazy-loading strategies so dishes look sharp without slowing the site.',
  },
  {
    id: 'catering-leads',
    question: 'Can the website generate catering leads?',
    answer:
      'Yes. Catering and private-event planners can collect useful event details and route genuine enquiries to the right team with clear consent.',
  },
  {
    id: 'restaurant-seo',
    question: 'Can Che Xu Studio implement restaurant SEO?',
    answer:
      'Yes. We structure menus, locations, FAQs and technical SEO for local discovery—using accurate business information only when a restaurant is verified.',
  },
];
