'use client';

import { useReducedMotion } from 'motion/react';

import { DotPattern } from '@/app/ui/dot-pattern';
import { SNAP_STAGE_DOTS_PATTERN_CLASS, SNAP_STAGE_DOTS_SPACING, SNAP_STAGE_DOTS_RADIUS } from './constants';

/**
 * Decorative backdrop for the right-column stage cards — the design system's
 * `DotPattern` in place of `Card`'s flat grey. `DotPattern` is already absolutely
 * positioned and `pointer-events-none`, so mount it as the card's first child; the card
 * needs `relative` and its content needs `SNAP_STAGE_CARD_CONTENT_CLASS`.
 *
 * Spacing is wide because `glow` runs an infinite tween per dot, and a full-bleed field
 * is one dot per cell of that grid.
 */
export function SnapStageDots() {
  const reduceMotion = useReducedMotion() === true;

  return (
    <DotPattern
      width={SNAP_STAGE_DOTS_SPACING}
      height={SNAP_STAGE_DOTS_SPACING}
      cr={SNAP_STAGE_DOTS_RADIUS}
      glow={!reduceMotion}
      className={SNAP_STAGE_DOTS_PATTERN_CLASS}
    />
  );
}
