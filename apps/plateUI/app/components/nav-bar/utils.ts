import type { MouseEvent } from 'react';
import {
  NAV_MAIN_SECTION_LINKS,
  NAV_SCROLL_SPY_HEADER_OFFSET_PX,
  NAV_SCROLL_SPY_VIEWPORT_EXTRA_PX,
} from './constants';
import type { NavHashClickModifiers, NavMainSectionLinkRow } from './types';

export function initialsForName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function navScrollSpyBandPx(headerOffsetPx: number, extraPx: number): number {
  return headerOffsetPx + extraPx;
}

/**
 * The active section is the one whose top sits closest above the band — chosen by
 * geometry, not by array order. Returns `null` while the page top (hero, demo) is
 * still on screen, so no link is highlighted when no section is actually in view.
 */
export function getActiveSectionId(
  sections: readonly Pick<NavMainSectionLinkRow, 'SECTION_ID'>[],
  topsById: Readonly<Record<string, number | undefined>>,
  bandPx: number,
): string | null {
  let active: string | null = null;
  let activeTop = Number.NEGATIVE_INFINITY;
  for (const row of sections) {
    const top = topsById[row.SECTION_ID];
    if (top === undefined || top > bandPx) continue;
    if (top > activeTop) {
      active = row.SECTION_ID;
      activeTop = top;
    }
  }
  return active;
}

export function sectionIdFromHref(href: string): string | null {
  const hashIndex = href.indexOf('#');
  if (hashIndex === -1) return null;
  const id = href.slice(hashIndex + 1);
  return id || null;
}

export function shouldInterceptSamePageHashClick(
  href: string,
  pathname: string,
  modifiers: NavHashClickModifiers,
): boolean {
  if (modifiers.META || modifiers.CTRL || modifiers.SHIFT || modifiers.ALT || modifiers.BUTTON !== 0) {
    return false;
  }
  if (pathname !== '/') return false;
  return sectionIdFromHref(href) !== null;
}

export function scrollBehavior(reduceMotion: boolean): ScrollBehavior {
  return reduceMotion ? 'auto' : 'smooth';
}

export function getActiveSectionIdFromScroll(): string | null {
  const bandPx = navScrollSpyBandPx(NAV_SCROLL_SPY_HEADER_OFFSET_PX, NAV_SCROLL_SPY_VIEWPORT_EXTRA_PX);
  const topsById: Record<string, number | undefined> = {};
  for (const row of NAV_MAIN_SECTION_LINKS) {
    const el = document.getElementById(row.SECTION_ID);
    if (!el) continue;
    topsById[row.SECTION_ID] = el.getBoundingClientRect().top;
  }
  return getActiveSectionId(NAV_MAIN_SECTION_LINKS, topsById, bandPx);
}

export function navigateToSection(href: string, e: MouseEvent<HTMLAnchorElement>) {
  const shouldIntercept = shouldInterceptSamePageHashClick(href, window.location.pathname, {
    META: e.metaKey,
    CTRL: e.ctrlKey,
    SHIFT: e.shiftKey,
    ALT: e.altKey,
    BUTTON: e.button,
  });
  if (!shouldIntercept) return;
  const id = sectionIdFromHref(href);
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: scrollBehavior(reduce), block: 'start' });
  history.pushState(null, '', `#${id}`);
}

export function subscribeNavScrollSpy(onStoreChange: () => void) {
  if (typeof window === 'undefined') return () => {};

  let frame = 0;

  // Scroll events fire faster than frames. Coalesce them into one
  // `getBoundingClientRect` pass per frame — measuring on every event forces a
  // synchronous layout read per event and makes the page stutter while scrolling.
  const scheduleStoreChange = () => {
    if (frame !== 0) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      onStoreChange();
    });
  };

  window.addEventListener('scroll', scheduleStoreChange, { passive: true });
  window.addEventListener('resize', scheduleStoreChange);
  window.addEventListener('hashchange', scheduleStoreChange);

  if ('onscrollend' in window) {
    window.addEventListener('scrollend', scheduleStoreChange, { passive: true });
  }

  return () => {
    if (frame !== 0) window.cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener('scroll', scheduleStoreChange);
    window.removeEventListener('resize', scheduleStoreChange);
    window.removeEventListener('hashchange', scheduleStoreChange);
    if ('onscrollend' in window) {
      window.removeEventListener('scrollend', scheduleStoreChange);
    }
  };
}

export function getNavScrollSpySnapshot() {
  return getActiveSectionIdFromScroll();
}

export function getNavScrollSpyServerSnapshot() {
  return null;
}
