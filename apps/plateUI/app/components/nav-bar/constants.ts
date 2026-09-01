import type { NavMainSectionLinkRow } from './types';

/** Top nav — user-visible strings. */

export const NAV = {
  BRAND: 'PlateAI',
  SEPARATOR: '/',
  HOW_IT_WORKS: 'How it works',
  FEATURES: 'Features',
  USE_CASES: 'Use cases',
  FEEDBACK: 'Wall of love',
  PRICING: 'Pricing',
  FAQ: 'FAQ',
  MENU_OPEN: 'Open menu',
  MENU_CLOSE: 'Close menu',
  MENU_HEADING: 'On this page',
  SNAP_CTA: 'Snap a plate',
  SNAP_CTA_HREF: '/snap',
  SNAP_CTA_SHIMMER_BACKGROUND:
    'linear-gradient(165deg, var(--color-cta-soft) 0%, var(--color-cta) 48%, var(--color-cta-deep) 100%)',
  SNAP_CTA_SHIMMER_COLOR: 'var(--color-content)',
} as const;

export const NAV_AUTH = {
  SIGN_IN: 'Sign in',
  SIGN_OUT: 'Sign out',
  ACCOUNT_MENU: 'Account menu',
  MEAL_HISTORY: 'Meal analyses',
  MEAL_HISTORY_HREF: '/history',
  MEAL_HISTORY_PENDING_LABEL: 'pending',
} as const;

export const NAV_AUTH_ACCOUNT_TRIGGER_SHELL =
  'h-8 w-8 shrink-0 rounded-full p-0 sm:h-9 sm:w-auto sm:gap-1.5 sm:rounded-full sm:border sm:border-button-outline-border sm:bg-button-outline-surface/40 sm:py-0 sm:pr-3 sm:pl-0.5 sm:hover:bg-button-outline-hover' as const;

export const NAV_AUTH_LOADING_SHELL =
  'flex h-8 w-8 shrink-0 items-center rounded-full sm:h-9 sm:w-auto sm:gap-1.5 sm:rounded-full sm:border sm:border-transparent sm:py-0 sm:pr-3 sm:pl-0.5' as const;

/** Order matches page flow — used for scroll-spy (last section whose top is above the trigger wins). */
export const NAV_MAIN_SECTION_LINKS: readonly NavMainSectionLinkRow[] = [
  { SECTION_ID: 'how-it-works', HREF: '/#how-it-works', LABEL: NAV.HOW_IT_WORKS },
  { SECTION_ID: 'features', HREF: '/#features', LABEL: NAV.FEATURES },
  { SECTION_ID: 'use-cases', HREF: '/#use-cases', LABEL: NAV.USE_CASES },
  { SECTION_ID: 'feedback', HREF: '/#feedback', LABEL: NAV.FEEDBACK },
  { SECTION_ID: 'pricing', HREF: '/#pricing', LABEL: NAV.PRICING },
  { SECTION_ID: 'faq', HREF: '/#faq', LABEL: NAV.FAQ },
] as const;

/** Sticky header height (`h-20`) — top band used for scroll-spy (viewport px). */
export const NAV_SCROLL_SPY_HEADER_OFFSET_PX = 80 as const;

/**
 * Extra viewport band below the header: a section counts as “entered” when
 * `getBoundingClientRect().top <= HEADER + EXTRA`. Larger values tolerate smooth-scroll
 * undershoot so the nav does not stay on the section above.
 */
export const NAV_SCROLL_SPY_VIEWPORT_EXTRA_PX = 320 as const;
