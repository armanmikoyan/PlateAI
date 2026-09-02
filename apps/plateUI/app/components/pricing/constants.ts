import { SUBSCRIPTION_PLAN } from '@plate/plate-billing/constants';

export const PRICING_SECTION = {
  EYEBROW: 'Pricing',
  TITLE: 'Plans that scale with how you eat',
  SUBTITLE:
    'Start on Basic, move to Plus when you want smarter macros and lists, or Pro when you are feeding a household.',
  CHECKOUT_NOTE: 'Payments are handled securely by Lemon Squeezy.',
  CHECKOUT_ERROR: 'Could not start checkout. Please try again.',
  FREE_PLAN_CTA: 'Basic is free — pick a paid plan to upgrade.',
  VIEW_DETAILS: 'View plan details',
  SHOW_DETAILS_HINT: 'Tap for more details',
} as const;

export const PRICING_PAGE = {
  TITLE: 'Choose the plan that fits your kitchen',
  SUBTITLE:
    'Every tier keeps the same photo-first logging experience. Compare limits, support, and household tools below, then pick where you want to start.',
  COMPARISON_HEADING: 'Compare plans at a glance',
  COMPARISON_CAPTION:
    'All plans include calorie targets and manual logging. Paid tiers unlock photo capture, macros, and smarter lists.',
  IDEAL_FOR_LABEL: 'Best for',
  PLANS_SECTION_ID: 'pricing-plans',
  DEFAULT_TIER_ID: SUBSCRIPTION_PLAN.PLUS,
  SCROLL_PLAN_FLAG: 'pricing-scroll-plan',
  FIXED_CTA_PURCHASE: 'Purchase',
  FIXED_CTA_SHIMMER_BACKGROUND:
    'linear-gradient(165deg, var(--color-cta-soft) 0%, var(--color-cta) 48%, var(--color-cta-deep) 100%)',
  FIXED_CTA_SHIMMER_COLOR: 'var(--color-content)',
} as const;

export const PRICING_TIERS = [
  {
    ID: SUBSCRIPTION_PLAN.BASIC,
    NAME: 'Basic',
    BADGE: '',
    TAGLINE: 'Log meals and see calories without paying.',
    PRICE: '$0',
    PERIOD: 'forever',
    CTA: 'Start on Basic',
    HIGHLIGHT: false,
    FEATURES: ['Daily calorie target', 'Manual meal entries', '7-day history', 'Email support'],
    DETAIL_BODY:
      'Basic is the free way to try PlateAI without a card. Log what you eat, watch your day total, and build the habit before you upgrade.',
    IDEAL_FOR: 'Solo eaters testing the workflow or keeping a simple calorie log.',
    DETAIL_HIGHLIGHTS: [
      'Set one daily calorie target and see running totals',
      'Add meals manually when you already know the numbers',
      'Review the last week when you want a quick check-in',
    ],
    COMPARISON: {
      PHOTO_CAPTURE: '—',
      MACRO_BREAKDOWN: 'Calories only',
      SHOPPING_LIST: '—',
      HISTORY: '7 days',
      PROFILES: '1',
      SUPPORT: 'Email',
    },
  },
  {
    ID: SUBSCRIPTION_PLAN.PLUS,
    NAME: 'Plus',
    BADGE: 'Most popular',
    TAGLINE: 'Photo-based logging, macros, and a real shopping list.',
    PRICE: '$9',
    PERIOD: 'per month',
    CTA: 'Choose Plus',
    HIGHLIGHT: true,
    FEATURES: [
      'Everything in Basic',
      'Photo meal capture',
      'Full macro breakdown',
      'Smart shopping list',
      '30-day history',
      'Priority chat support',
    ],
    DETAIL_BODY:
      'Plus is where PlateAI feels complete: snap a plate, get macros in seconds, and turn leftovers into a shopping list that respects what you already ate today.',
    IDEAL_FOR: 'People who log most meals from photos and want macros without spreadsheet math.',
    DETAIL_HIGHLIGHTS: [
      'Photo capture with same-day context so dinner stays on plan',
      'Protein, carbs, and fat beside calories on every entry',
      'Shopping list grouped by aisle and adjusted for what is left in your budget',
    ],
    COMPARISON: {
      PHOTO_CAPTURE: 'Included',
      MACRO_BREAKDOWN: 'Full macros',
      SHOPPING_LIST: 'Smart list',
      HISTORY: '30 days',
      PROFILES: '1',
      SUPPORT: 'Priority chat',
    },
  },
  {
    ID: SUBSCRIPTION_PLAN.PRO,
    NAME: 'Pro',
    BADGE: '',
    TAGLINE: 'Households, shared plans, and exports for power users.',
    PRICE: '$19',
    PERIOD: 'per month',
    CTA: 'Choose Pro',
    HIGHLIGHT: false,
    FEATURES: [
      'Everything in Plus',
      'Up to 5 profiles',
      'Shared household calendar',
      'CSV & Apple Health export',
      'Unlimited history',
      'Same-day onboarding call',
    ],
    DETAIL_BODY:
      'Pro is built for households and data-minded eaters. Share targets, see who logged what, and export your history when you want a backup or coach review.',
    IDEAL_FOR: 'Families, couples, or athletes who need shared planning and exports.',
    DETAIL_HIGHLIGHTS: [
      'Up to five profiles on one subscription with separate targets',
      'Household calendar so meals and leftovers stay visible to everyone',
      'CSV and Apple Health export plus unlimited history for long trends',
    ],
    COMPARISON: {
      PHOTO_CAPTURE: 'Included',
      MACRO_BREAKDOWN: 'Full macros',
      SHOPPING_LIST: 'Smart list',
      HISTORY: 'Unlimited',
      PROFILES: 'Up to 5',
      SUPPORT: 'Onboarding call',
    },
  },
] as const;

export const PRICING_COMPARISON_ROWS = [
  { KEY: 'PHOTO_CAPTURE', LABEL: 'Photo meal capture' },
  { KEY: 'MACRO_BREAKDOWN', LABEL: 'Macro breakdown' },
  { KEY: 'SHOPPING_LIST', LABEL: 'Shopping list' },
  { KEY: 'HISTORY', LABEL: 'History' },
  { KEY: 'PROFILES', LABEL: 'Profiles' },
  { KEY: 'SUPPORT', LABEL: 'Support' },
] as const;
