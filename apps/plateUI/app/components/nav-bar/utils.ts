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

export function getActiveSectionId(
  sections: readonly Pick<NavMainSectionLinkRow, 'SECTION_ID'>[],
  topsById: Readonly<Record<string, number | undefined>>,
  bandPx: number,
): string | null {
  let active: string | null = null;
  for (const row of sections) {
    const top = topsById[row.SECTION_ID];
    if (top === undefined) continue;
    if (top <= bandPx) active = row.SECTION_ID;
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
  const bandPx = navScrollSpyBandPx(
    NAV_SCROLL_SPY_HEADER_OFFSET_PX,
    NAV_SCROLL_SPY_VIEWPORT_EXTRA_PX,
  );
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

  const onScrollOrResize = () => {
    onStoreChange();
  };

  const onHashChange = () => {
    window.requestAnimationFrame(() => {
      onStoreChange();
    });
  };

  window.addEventListener('scroll', onScrollOrResize, { passive: true });
  window.addEventListener('resize', onScrollOrResize);
  window.addEventListener('hashchange', onHashChange);

  if ('onscrollend' in window) {
    window.addEventListener('scrollend', onScrollOrResize, { passive: true });
  }

  return () => {
    window.removeEventListener('scroll', onScrollOrResize);
    window.removeEventListener('resize', onScrollOrResize);
    window.removeEventListener('hashchange', onHashChange);
    if ('onscrollend' in window) {
      window.removeEventListener('scrollend', onScrollOrResize);
    }
  };
}

export function getNavScrollSpySnapshot() {
  return getActiveSectionIdFromScroll();
}

export function getNavScrollSpyServerSnapshot() {
  return null;
}
