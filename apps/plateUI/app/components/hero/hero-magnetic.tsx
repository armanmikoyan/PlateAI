'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { HERO_MAGNETIC_SPRING, HERO_MAGNETIC_STRENGTH_PX } from './constants';
import type { HeroMagneticProps } from './types';

/**
 * Leans its children a few pixels toward the cursor, clamping the pull to the
 * element's own box so the button feels attracted rather than dragged. Springs back
 * to rest on leave. Skipped entirely under reduced motion.
 */
export function HeroMagnetic({ className, children }: HeroMagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, HERO_MAGNETIC_SPRING);
  const y = useSpring(my, HERO_MAGNETIC_SPRING);

  if (reduceMotion === true) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect == null) return;
        const localX = (event.clientX - rect.left) / rect.width - 0.5;
        const localY = (event.clientY - rect.top) / rect.height - 0.5;
        mx.set(localX * HERO_MAGNETIC_STRENGTH_PX * 2);
        my.set(localY * HERO_MAGNETIC_STRENGTH_PX * 2);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
