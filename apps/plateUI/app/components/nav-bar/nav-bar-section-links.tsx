'use client';

import type { MouseEvent } from 'react';
import { useSyncExternalStore } from 'react';
import { cn } from '@/app/utils/cn';
import { NAV_MAIN_SECTION_LINKS } from './constants';
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

  const linkClass = (isActive: boolean) =>
    cn(
      variant === 'desktop' && 'cursor-pointer transition-colors',
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

  return (
    <>
      {NAV_MAIN_SECTION_LINKS.map((row) => {
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
            {row.LABEL}
          </a>
        );
      })}
    </>
  );
}
