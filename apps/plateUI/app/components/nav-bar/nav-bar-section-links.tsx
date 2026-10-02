'use client';

import type { MouseEvent } from 'react';
import { useSyncExternalStore } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import {
  NAV_ACTIVE_PILL_CLASS,
  NAV_ACTIVE_PILL_LAYOUT_ID,
  NAV_DRAWER_SECTION_LINKS,
  NAV_MAIN_SECTION_LINKS,
  NAV_MOTION_REDUCED,
  NAV_MOTION_SPRING,
} from './constants';
import type { NavBarSectionLinksProps } from './types';
import {
  getNavScrollSpyServerSnapshot,
  getNavScrollSpySnapshot,
  navigateToSection,
  subscribeNavScrollSpy,
} from './utils';

export function NavBarSectionLinks({ onAfterNavigate, variant }: NavBarSectionLinksProps) {
  const activeId = useSyncExternalStore(
    subscribeNavScrollSpy,
    getNavScrollSpySnapshot,
    getNavScrollSpyServerSnapshot,
  );
  const reduceMotion = useReducedMotion();

  const linkClass = (isActive: boolean) =>
    cn(
      variant === 'desktop' &&
        'relative isolate cursor-pointer px-4 py-2 transition-colors motion-reduce:transition-none',
      variant === 'drawer' &&
        'block cursor-pointer rounded-lg px-3 py-2.5 text-base font-medium transition-colors motion-reduce:transition-none',
      variant === 'drawer' && isActive && 'bg-surface-overlay/70 text-accent-mid',
      variant === 'drawer' && !isActive && 'text-content-muted hover:bg-surface-overlay hover:text-content',
      variant === 'desktop' && isActive && 'text-accent-mid',
      variant === 'desktop' && !isActive && 'text-content-muted hover:text-content',
    );

  const handleClick = (href: string, e: MouseEvent<HTMLAnchorElement>) => {
    navigateToSection(href, e);
    onAfterNavigate?.();
  };

  const links = variant === 'drawer' ? NAV_DRAWER_SECTION_LINKS : NAV_MAIN_SECTION_LINKS;

  return (
    <>
      {links.map((row) => {
        const isActive = activeId === row.SECTION_ID;
        return (
          <a
            key={row.SECTION_ID}
            href={row.HREF}
            aria-current={isActive ? 'location' : undefined}
            aria-label={`${row.LABEL} — jump to section`}
            onClick={(e) => handleClick(row.HREF, e)}
            className={linkClass(isActive)}
          >
            {variant === 'desktop' && isActive ? (
              <motion.span
                aria-hidden
                layoutId={NAV_ACTIVE_PILL_LAYOUT_ID}
                className={NAV_ACTIVE_PILL_CLASS}
                transition={reduceMotion ? NAV_MOTION_REDUCED : NAV_MOTION_SPRING}
              />
            ) : null}
            {row.LABEL}
          </a>
        );
      })}
    </>
  );
}
