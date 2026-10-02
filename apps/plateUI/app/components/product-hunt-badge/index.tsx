'use client';

import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/utils/cn';
import { PRODUCT_HUNT_BADGE } from './constants';
import Image from 'next/image';

export default function ProductHuntBadge() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let frame = 0;
    let hiddenRef = false;

    // Same reasoning as the nav scroll-spy: coalesce scroll events into one
    // measurement per frame and only setState when the threshold is crossed.
    const applyScroll = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = scrollable > 0 ? window.scrollY / scrollable : 0;
      const next = fraction >= 0.25;
      if (next === hiddenRef) return;
      hiddenRef = next;
      setHidden(next);
    };

    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(applyScroll);
    };

    applyScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (expanded) return;
    event.preventDefault();
    setExpanded(true);
  };

  if (pathname !== '/') return null;

  return (
    <div
      className={cn(
        'fixed top-75 right-0 z-40 transition-transform duration-300 ease-out md:top-24',
        hidden ? 'translate-x-[100vw]' : expanded ? 'translate-x-0' : 'translate-x-5',
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <a
        href={PRODUCT_HUNT_BADGE.HREF}
        target="_blank"
        rel="noreferrer"
        onClick={handleClick}
        aria-expanded={expanded}
        className={cn(
          'shadow-lg shadow-black/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent block h-13.5 overflow-hidden bg-white transition-all duration-300 ease-out motion-reduce:animate-none',
          expanded ? 'w-62.5 rounded-[10px]' : 'w-10.5 rounded-[10px]',
          !expanded && !hidden && 'animate-ph-nudge',
        )}
      >
        <Image
          src={PRODUCT_HUNT_BADGE.IMAGE_SRC}
          alt={PRODUCT_HUNT_BADGE.ALT}
          width={PRODUCT_HUNT_BADGE.WIDTH}
          height={PRODUCT_HUNT_BADGE.HEIGHT}
          className="h-13.5 w-62.5 max-w-none shrink-0"
        />
      </a>
    </div>
  );
}
