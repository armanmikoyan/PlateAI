'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { HERO_SPOTLIGHT_BG, HERO_SPOTLIGHT_CLASS, HERO_SPOTLIGHT_SIZE_PX } from './constants';

/**
 * A soft radial glow that trails the cursor across the hero. Pointer positions are
 * written straight to motion values — no React render per move — and mapped into the
 * section's own coordinate space via its bounding rect, so the light stays aligned
 * while the page scrolls. Only mounts on fine-pointer devices; the boolean state
 * flips at most twice per session (first move, pointer leave).
 */
export function HeroSpotlight() {
  const frameRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(-HERO_SPOTLIGHT_SIZE_PX);
  const y = useMotionValue(-HERO_SPOTLIGHT_SIZE_PX);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion === true) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const HALF = HERO_SPOTLIGHT_SIZE_PX / 2;
    const onMove = (event: PointerEvent) => {
      const frame = frameRef.current;
      if (frame == null) return;
      const rect = frame.getBoundingClientRect();
      x.set(event.clientX - rect.left - HALF);
      y.set(event.clientY - rect.top - HALF);
      setVisible(true);
    };
    const onLeave = () => {
      setVisible(false);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('blur', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('blur', onLeave);
    };
  }, [reduceMotion, x, y]);

  return (
    <div ref={frameRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className={cn(HERO_SPOTLIGHT_CLASS, visible ? 'opacity-100' : 'opacity-0')}
        style={{
          width: HERO_SPOTLIGHT_SIZE_PX,
          height: HERO_SPOTLIGHT_SIZE_PX,
          backgroundImage: HERO_SPOTLIGHT_BG,
          x,
          y,
        }}
      />
    </div>
  );
}
