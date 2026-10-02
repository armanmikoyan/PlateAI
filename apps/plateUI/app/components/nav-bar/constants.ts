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
  CONTACT: 'Contact us',
  PRIVACY_POLICY: 'Privacy policy',
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

export const NAV_AUTH_ACCOUNT_TRIGGER_DRAWER_SHELL =
  'h-11 w-full justify-start gap-2 rounded-full border border-button-outline-border bg-button-outline-surface/40 py-0 pr-3 pl-1 hover:bg-button-outline-hover' as const;

export const NAV_AUTH_SIGN_IN_SHELL =
  'h-8 shrink-0 gap-1.5 px-2.5 text-xs sm:h-9 sm:px-4 sm:text-sm' as const;

export const NAV_AUTH_SIGN_IN_DRAWER_SHELL = 'h-10 w-full gap-1.5 px-4 text-sm' as const;

export const NAV_AUTH_LOADING_SHELL =
  'flex h-8 w-8 shrink-0 items-center rounded-full sm:h-9 sm:w-auto sm:gap-1.5 sm:rounded-full sm:border sm:border-transparent sm:py-0 sm:pr-3 sm:pl-0.5' as const;

export const NAV_AUTH_LOADING_DRAWER_SHELL =
  'flex h-11 w-full items-center gap-2 rounded-full border border-transparent py-0 pr-3 pl-1' as const;

/** The auth control only sits in the top bar from `xl` up; below that it is in the sheet. */
export const NAV_AUTH_BAR_SLOT_CLASS = 'hidden items-center xl:flex' as const;

export const NAV_DRAWER_FOOTER_CLASS = 'border-edge border-t' as const;

/** Display order for the nav row — matches the order `app/page.tsx` renders the sections. */
export const NAV_MAIN_SECTION_LINKS: readonly NavMainSectionLinkRow[] = [
  { SECTION_ID: 'features', HREF: '/#features', LABEL: NAV.FEATURES },
  { SECTION_ID: 'how-it-works', HREF: '/#how-it-works', LABEL: NAV.HOW_IT_WORKS },
  { SECTION_ID: 'use-cases', HREF: '/#use-cases', LABEL: NAV.USE_CASES },
  { SECTION_ID: 'feedback', HREF: '/#feedback', LABEL: NAV.FEEDBACK },
  { SECTION_ID: 'pricing', HREF: '/#pricing', LABEL: NAV.PRICING },
  { SECTION_ID: 'faq', HREF: '/#faq', LABEL: NAV.FAQ },
] as const;

/** Drawer-only links (not shown in the desktop nav): page links + anchors. */
export const NAV_DRAWER_SECTION_LINKS: readonly NavMainSectionLinkRow[] = [
  ...NAV_MAIN_SECTION_LINKS,
  { SECTION_ID: 'contact', HREF: '/#contact', LABEL: NAV.CONTACT },
  { SECTION_ID: 'privacy-policy', HREF: '/privacy-policy', LABEL: NAV.PRIVACY_POLICY },
] as const;

/**
 * Sticky header slot height (viewport px). The slot never resizes — only the bar
 * inside it condenses — so `scroll-pt`, the demo `sticky top-20` offsets and the
 * scroll-spy band stay valid in both states.
 */
export const NAV_HEADER_SLOT_PX = 80 as const;

export const NAV_HEADER_CLASS = 'sticky top-0 z-50 h-20 shrink-0' as const;

export const NAV_HEADER_SHELL_CLASS = 'layout-page-shell flex h-full items-center' as const;

/**
 * Scroll distance (px) after which the bar leaves its transparent, full-bleed rest
 * state and condenses into a detached glass capsule.
 */
export const NAV_BAR_CONDENSE_AFTER_PX = 24 as const;

export const NAV_BAR_REST_HEIGHT_PX = NAV_HEADER_SLOT_PX;

export const NAV_BAR_CONDENSED_HEIGHT_PX = 64 as const;

/** Matches `layout-page-shell` (`max-w-[120rem]`) so the rest state is truly full-bleed. */
export const NAV_BAR_MAX_WIDTH_PX = 1920 as const;

/**
 * Wide enough for the shrunken logo + six padded links + CTA + account trigger at `xl`,
 * with the `gap-x-6` between those three groups. Stays under the shell's `lg` padding
 * (120rem - 80px = 1880px), so it is only ever bound by the viewport.
 */
export const NAV_BAR_CONDENSED_MAX_WIDTH_PX = 1160 as const;

export const NAV_BAR_RADIUS_PX = 9999 as const;

export const NAV_BAR_CONDENSED_PADDING_X_PX = 20 as const;

/**
 * Rest state: a bare row — no blur, no border, no radius, no padding of its own,
 * so the hero behind it reads edge to edge.
 */
export const NAV_BAR_BASE_CLASS =
  'relative mx-auto flex w-full items-center justify-between gap-x-6 border border-transparent bg-transparent transition-[background-color,border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none contrast-more:border-edge-strong reduced-transparency:bg-surface-raised' as const;

/** Condensed state: glass capsule, hairline edge, floating depth. */
export const NAV_BAR_CONDENSED_CLASS =
  'bg-surface-raised/70 supports-[backdrop-filter]:bg-surface-raised/55 backdrop-blur-xl backdrop-saturate-150 shadow-[0_18px_40px_-24px_rgb(0_0_0/0.9)]' as const;

export const NAV_BAR_REST = {
  borderRadius: 0,
  height: NAV_BAR_REST_HEIGHT_PX,
  maxWidth: NAV_BAR_MAX_WIDTH_PX,
  paddingLeft: 0,
  paddingRight: 0,
} as const;

export const NAV_BAR_CONDENSED = {
  borderRadius: NAV_BAR_RADIUS_PX,
  height: NAV_BAR_CONDENSED_HEIGHT_PX,
  maxWidth: NAV_BAR_CONDENSED_MAX_WIDTH_PX,
  paddingLeft: NAV_BAR_CONDENSED_PADDING_X_PX,
  paddingRight: NAV_BAR_CONDENSED_PADDING_X_PX,
} as const;

/** Critically damped spring (zeta ~ 0.95) — matches `--ease-spring-out`, settles ~0.4s. */
export const NAV_MOTION_SPRING = { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 } as const;

export const NAV_MOTION_REDUCED = { duration: 0 } as const;

/** True pixel size of `public/icons/logo.png` — keeps the intrinsic ratio honest. */
export const NAV_LOGO_WIDTH_PX = 2170 as const;

export const NAV_LOGO_HEIGHT_PX = 725 as const;

export const NAV_LOGO_CLASS =
  'h-20 w-auto transition-[height] duration-300 ease-out motion-reduce:transition-none' as const;

export const NAV_LOGO_CONDENSED_CLASS = 'h-12' as const;

/**
 * Desktop link row. Each link carries its own `px-4 py-2` (see
 * `nav-bar-section-links.tsx`) so the active pill has padding, which makes the
 * column gap 0 — the rendered gap between labels comes entirely from that padding.
 */
export const NAV_DESKTOP_LINKS_CLASS =
  'text-content-muted hidden shrink-0 flex-nowrap items-center justify-end gap-x-4 text-sm font-medium xl:flex xl:gap-x-0 xl:text-base' as const;

export const NAV_ACTIONS_CLASS =
  'ml-auto flex shrink-0 items-center gap-2 transition-[column-gap] duration-300 ease-out motion-reduce:transition-none sm:gap-3 xl:gap-8' as const;

export const NAV_ACTIONS_CONDENSED_CLASS = 'xl:gap-5' as const;

/** Shared-layout id so the active-section pill slides instead of repainting. */
export const NAV_ACTIVE_PILL_LAYOUT_ID = 'nav-bar-active-section' as const;

/** Solid fill (the glass capsule underneath is only a shade lighter) plus a gold hairline
 *  that pairs with the active label's `text-accent-mid`. */
export const NAV_ACTIVE_PILL_CLASS =
  'absolute inset-0 -z-10 rounded-full bg-surface-overlay ring-1 ring-inset ring-accent/30' as const;

/**
 * Clips the rail to the capsule's rounded rect. `rounded-[inherit]` picks up the
 * spring-animated `border-radius`, so the line's ends stop exactly where the
 * bottom edge starts curving instead of floating inside it.
 */
export const NAV_PROGRESS_CLIP_CLASS =
  'pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] transition-opacity duration-300 ease-out motion-reduce:transition-none' as const;

/** `inset-x-9` (36px) clears the capsule's clamped corner radius (height 64 / 2). */
export const NAV_PROGRESS_TRACK_CLASS =
  'absolute inset-x-9 bottom-0 h-[3px] overflow-hidden rounded-full bg-edge/70' as const;

/** `w-0` so SSR paints no fill; the `width` MotionValue takes over on the client. */
export const NAV_PROGRESS_FILL_CLASS = 'block h-full w-0 rounded-full bg-accent' as const;

/** Scroll-spy top band (viewport px) — the slot height, not the condensed bar height. */
export const NAV_SCROLL_SPY_HEADER_OFFSET_PX = NAV_HEADER_SLOT_PX;

/**
 * Extra viewport band below the header: a section counts as “entered” when
 * `getBoundingClientRect().top <= HEADER + EXTRA`.
 *
 * Must clear the anchor landing offset, which is the sum of the section’s
 * `scroll-mt-28` (112px) and `<html>`’s `scroll-pt-28` (112px) = 224px — otherwise
 * a clicked section lands outside the band and the previous one stays highlighted.
 * The remaining slack absorbs smooth-scroll undershoot.
 */
export const NAV_SCROLL_SPY_VIEWPORT_EXTRA_PX = 320 as const;
