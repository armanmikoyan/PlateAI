'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { HERO_FLIP_EASE, HERO_FLIP_S } from './constants';
import type { HeroFlipTextProps } from './types';

export function HeroFlipText({ variants, index }: HeroFlipTextProps) {
  const reduceMotion = useReducedMotion();
  const tallest = variants.reduce((a, b) => (b.length > a.length ? b : a));

  return (
    <span className="relative grid grid-cols-1 [perspective:600px]">
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {tallest}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          className="col-start-1 row-start-1 block"
          style={{ transformOrigin: 'top center' }}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, rotateX: -78, y: 14, filter: 'blur(8px)' }}
          animate={{ opacity: 1, rotateX: 0, y: 0, filter: 'blur(0px)' }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotateX: 78, y: -14, filter: 'blur(8px)' }}
          transition={{ duration: HERO_FLIP_S, ease: HERO_FLIP_EASE }}
        >
          {variants[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
