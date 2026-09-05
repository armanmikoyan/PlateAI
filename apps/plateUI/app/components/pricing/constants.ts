import { SUBSCRIPTION_PLAN } from '@plate/plate-billing/constants';

export const PRICING_SECTION = {
  EYEBROW: 'Pricing',
  TITLE: 'Plans that scale with how you eat',
  SUBTITLE:
    'Snap a plate, get your macros. Upgrade for more analyses per day and longer history.',
  CHECKOUT_NOTE: 'Payments are handled securely by Lemon Squeezy.',
  CHECKOUT_ERROR: 'Could not start checkout. Please try again.',
  FREE_PLAN_CTA: 'Pick a plan to get started.',
  YOUR_PLAN: 'Your plan',
  CURRENT_PLAN_NOTE: "You're on this plan.",
  UPGRADE_TO_PRO_NOTE: 'Upgrade to Pro for more analyses per day.',
  ALREADY_INCLUDED: 'Already included in your plan.',
  VIEW_DETAILS: 'View plan details',
  SHOW_DETAILS_HINT: 'Tap for more details',
  CONTACT_US: 'Contact us',
  CONTACT_US_HREF: '/#contact',
} as const;

export const PRICING_PAGE = {
  TITLE: 'Choose the plan that fits your kitchen',
  SUBTITLE:
    'Every plan includes photo capture and full macro breakdown. Pick how many analyses you need per day and how long you want to keep your data.',
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

export const PRICING_TIERS = [
  {
    ID: SUBSCRIPTION_PLAN.BASIC,
    NAME: 'Basic',
    BADGE: '',
    TAGLINE: 'Snap plates and get macros, day by day.',
    PRICE: '$5.99',
    PERIOD: 'per month',
    CTA: 'Choose Basic',
    HIGHLIGHT: false,
    FEATURES: [
      'Photo meal capture',
      'Full macro breakdown',
      '3 analyses per day',
      'Data kept for 1 day',
      'Email support',
    ],
    DETAIL_BODY:
      'Basic gives you the core PlateAI experience. Snap a plate, get calories and macros instantly. Your data is kept for one day so you can review it, then it is removed.',
    IDEAL_FOR: 'People who want quick meal snapshots without a long-term log.',
    DETAIL_HIGHLIGHTS: [
      'Photo capture — snap any plate and get results in seconds',
      'Full macro breakdown — calories, protein, carbs, and fat on every entry',
      'One-day rolling window — review today, start fresh tomorrow',
    ],
    COMPARISON: {
      DAILY_LIMIT: '3 per day',
      MACRO_BREAKDOWN: 'Full macros',
      HISTORY: '1 day',
      SUPPORT: 'Email',
    },
  },
  {
    ID: SUBSCRIPTION_PLAN.PRO,
    NAME: 'Pro',
    BADGE: 'Most popular',
    TAGLINE: 'More analyses, full history, everything in one place.',
    PRICE: '$9.99',
    PERIOD: 'per month',
    CTA: 'Choose Pro',
    HIGHLIGHT: true,
    FEATURES: [
      'Everything in Basic',
      '15 analyses per day',
      'Full meal history kept forever',
      'Priority email support',
    ],
    DETAIL_BODY:
      'Pro unlocks a higher daily limit and keeps your meal history forever. Build a real log of what you eat and spot patterns over weeks and months.',
    IDEAL_FOR: 'People who log regularly and want a lasting record of their meals.',
    DETAIL_HIGHLIGHTS: [
      '15 photo analyses per day — breakfast, lunch, dinner, and snacks covered',
      'Data kept indefinitely — every meal stays in your log as long as you need it',
      'Priority email support — faster responses when you need help',
    ],
    COMPARISON: {
      DAILY_LIMIT: '15 per day',
      MACRO_BREAKDOWN: 'Full macros',
      HISTORY: 'Indefinite',
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
      'Personal nutrition coach',
      'Direct chat support',
      'Custom meal plans',
    ],
    DETAIL_BODY:
      'Individual pairs the full Pro experience with a dedicated nutrition coach who reviews your logs, builds custom meal plans, and chats with you directly.',
    IDEAL_FOR: 'Athletes, people with specific dietary needs, or anyone who wants hands-on guidance.',
    DETAIL_HIGHLIGHTS: [
      'Personal coach who reviews your meal logs and adjusts plans',
      'Direct chat for real-time questions and accountability',
      'Custom meal plans built around your goals and restrictions',
    ],
    COMPARISON: {
      DAILY_LIMIT: '15 per day',
      MACRO_BREAKDOWN: 'Full macros',
      HISTORY: 'Unlimited',
      SUPPORT: 'Direct coach',
    },
  },
] as const;

export const PRICING_COMPARISON_ROWS = [
  { KEY: 'DAILY_LIMIT', LABEL: 'Daily analyses' },
  { KEY: 'MACRO_BREAKDOWN', LABEL: 'Macro breakdown' },
  { KEY: 'HISTORY', LABEL: 'History' },
  { KEY: 'SUPPORT', LABEL: 'Support' },
] as const;
