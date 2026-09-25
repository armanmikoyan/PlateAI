import { SUBSCRIPTION_PLAN } from '@plate/plate-billing/constants';

export const PRICING_SECTION = {
  EYEBROW: 'Pricing',
  TITLE: 'Plans that scale with how you eat',
  SUBTITLE: 'Snap a plate, get your macros. Upgrade for more analyses per day and higher estimate accuracy.',
  CHECKOUT_NOTE: 'Payments are handled securely by Lemon Squeezy.',
  CHECKOUT_ERROR: 'Could not start checkout. Please try again.',
  FREE_PLAN_CTA: 'Pick a plan to get started.',
  YOUR_PLAN: 'Your plan',
  CURRENT_PLAN_NOTE: "You're on this plan.",
  UPGRADE_TO_PRO_NOTE: 'Upgrade to Pro for more analyses per day and higher accuracy.',
  ALREADY_INCLUDED: 'Already included in your plan.',
  VIEW_DETAILS: 'View plan details',
  SHOW_DETAILS_HINT: 'Tap for more details',
  CONTACT_US: 'Contact us',
  CONTACT_US_HREF: '/#contact',
  CANCEL_ANYTIME: 'Cancel anytime. No questions asked.',
  CANCEL_MANAGE: 'Manage or cancel anytime from your dashboard.',
} as const;

export const PRICING_PAGE = {
  TITLE: 'Choose the plan that fits your kitchen',
  SUBTITLE:
    'Every plan includes photo capture and full macro breakdown. Pick how many analyses you need per day and how much estimate accuracy you want.',
  COMPARISON_HEADING: 'Compare plans at a glance',
  COMPARISON_CAPTION: 'All plans include photo capture and full macro breakdown.',
  IDEAL_FOR_LABEL: 'Best for',
  PLANS_SECTION_ID: 'pricing-plans',
  DEFAULT_TIER_ID: SUBSCRIPTION_PLAN.PRO,
  SCROLL_PLAN_FLAG: 'pricing-scroll-plan',
  FIXED_CTA_PURCHASE: 'Purchase',
  FIXED_CTA_UPGRADE: 'Upgrade to',
  FIXED_CTA_SHIMMER_BACKGROUND:
    'linear-gradient(165deg, var(--color-cta-soft) 0%, var(--color-cta) 48%, var(--color-cta-deep) 100%)',
  FIXED_CTA_SHIMMER_COLOR: 'var(--color-content)',
} as const;

export const PRICING_TIER_ANIM = {
  MAX_TILT_DEG: 6,
} as const;

export const PRICING_TIERS = [
  {
    ID: SUBSCRIPTION_PLAN.BASIC,
    NAME: 'Basic',
    BADGE: '',
    TAGLINE: 'Snap plates and get macros, day by day.',
    PRICE: '$4.99',
    PERIOD: 'per month',
    CTA: 'Choose Basic',
    HIGHLIGHT: false,
    FEATURES: [
      'Photo meal capture',
      'Full macro breakdown',
      '10 analyses per day',
      '75% estimate accuracy',
      'Email support',
    ],
    DETAIL_BODY:
      'Basic gives you the core PlateAI experience. Snap a plate, get calories and macros instantly. Ten analyses a day cover breakfast, lunch, and dinner with room to spare.',
    IDEAL_FOR: 'People who want solid daily logging at the best price.',
    DETAIL_HIGHLIGHTS: [
      'Photo capture — snap any plate and get results in seconds',
      'Full macro breakdown — calories, protein, carbs, and fat on every entry',
      '10 analyses per day — cover every meal and snack',
      '75% estimate accuracy on calories and macros',
    ],
    COMPARISON: {
      DAILY_LIMIT: '10 per day',
      ACCURACY: '75%',
      MACRO_BREAKDOWN: 'Full macros',
      SUPPORT: 'Email',
    },
  },
  {
    ID: SUBSCRIPTION_PLAN.PRO,
    NAME: 'Pro',
    BADGE: 'Most popular',
    TAGLINE: 'More analyses, top accuracy, everything in one place.',
    PRICE: '$9.99',
    PERIOD: 'per month',
    CTA: 'Choose Pro',
    HIGHLIGHT: true,
    FEATURES: [
      'Everything in Basic',
      '50 analyses per day',
      '99% estimate accuracy',
      'Priority email support',
    ],
    DETAIL_BODY:
      'Pro raises your daily limit and tightens estimate accuracy. With 50 analyses a day you can log multiple plates, second helpings, and snacks without ever counting.',
    IDEAL_FOR: 'People who log regularly and want the tightest numbers.',
    DETAIL_HIGHLIGHTS: [
      '50 photo analyses per day — breakfast, lunch, dinner, snacks, and seconds covered',
      '99% estimate accuracy on calories and macros',
      'Priority email support — faster responses when you need help',
    ],
    COMPARISON: {
      DAILY_LIMIT: '50 per day',
      ACCURACY: '99%',
      MACRO_BREAKDOWN: 'Full macros',
      SUPPORT: 'Priority email',
    },
  },
  {
    ID: SUBSCRIPTION_PLAN.INDIVIDUAL,
    NAME: 'Individual',
    BADGE: '',
    TAGLINE: 'A personal coach for your nutrition.',
    PRICE: '$99.99',
    PERIOD: 'per month',
    CTA: 'Contact us',
    HIGHLIGHT: false,
    FEATURES: [
      'Everything in Pro',
      'Unlimited analyses per day',
      '99% estimate accuracy',
      'Personal nutrition coach',
      'Direct chat support',
      'Custom meal plans',
    ],
    DETAIL_BODY:
      'Individual pairs the full Pro experience with a dedicated nutrition coach who reviews your logs, builds custom meal plans, and chats with you directly. Your daily analyses are unlimited.',
    IDEAL_FOR: 'Athletes, people with specific dietary needs, or anyone who wants hands-on guidance.',
    DETAIL_HIGHLIGHTS: [
      'Unlimited daily analyses — log every plate, snack, and second helping',
      'Personal coach who reviews your meal logs and adjusts plans',
      'Direct chat for real-time questions and accountability',
      'Custom meal plans built around your goals and restrictions',
    ],
    COMPARISON: {
      DAILY_LIMIT: 'Unlimited',
      ACCURACY: '99%',
      MACRO_BREAKDOWN: 'Full macros',
      SUPPORT: 'Direct coach',
    },
  },
] as const;

export const PRICING_COMPARISON_ROWS = [
  { KEY: 'DAILY_LIMIT', LABEL: 'Daily analyses' },
  { KEY: 'ACCURACY', LABEL: 'Estimate accuracy' },
  { KEY: 'MACRO_BREAKDOWN', LABEL: 'Macro breakdown' },
  { KEY: 'SUPPORT', LABEL: 'Support' },
] as const;
