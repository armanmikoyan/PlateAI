'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import { HERO_MEAL_COPY_SWAP_S } from './constants';

type HeroBlurSwapProps = Readonly<{
  swapKey: string;
  children: ReactNode;
  className?: string;
}>;

export function HeroBlurSwap({ swapKey, children, className }: HeroBlurSwapProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={swapKey}
        className={className}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12, filter: 'blur(10px)' }}
        transition={{
          duration: reduceMotion ? 0.15 : HERO_MEAL_COPY_SWAP_S,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
