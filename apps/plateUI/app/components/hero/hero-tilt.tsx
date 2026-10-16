'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { HERO_TILT_MAX_DEG, HERO_TILT_SHELL, HERO_TILT_SPRING } from './constants';
import type { HeroTiltProps } from './types';

/**
 * Tilts its children toward the cursor in 3D. Pointer offsets are normalised to
 * [-0.5, 0.5] and pushed through a spring, so the card leans and settles instead
 * of snapping. `depth` scales the rotation, which is what gives the two stacked
 * cards their parallax. Disabled under reduced motion and on coarse pointers.
 */
export function HeroTilt({ className, depth = 1, children }: HeroTiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, HERO_TILT_SPRING);
  const sy = useSpring(py, HERO_TILT_SPRING);
  const rotateY = useTransform(sx, (v) => v * HERO_TILT_MAX_DEG * depth);
  const rotateX = useTransform(sy, (v) => v * -HERO_TILT_MAX_DEG * depth);

  if (reduceMotion === true) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn('relative [perspective:1200px]', className)}
      onPointerMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (rect == null) return;
        px.set((event.clientX - rect.left) / rect.width - 0.5);
        py.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div className={cn(HERO_TILT_SHELL, 'w-full')} style={{ rotateX, rotateY }}>
        {children}
      </motion.div>
    </motion.div>
  );
}
