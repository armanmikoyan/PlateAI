'use client';

import { motion, useReducedMotion } from 'motion/react';
import { Card, CardContent } from '@/app/ui/card';
import { ShimmerButton } from '@/app/ui/shimmer-button';
import { cn } from '@/app/utils/cn';
import {
  SNAP,
  SNAP_MOTION_REDUCED,
  SNAP_PHOTO_CARD_SHELL,
  SNAP_STAGE_CARD_CONTENT_CLASS,
  SNAP_STAGE_CARD_SURFACE_CLASS,
  SNAP_STAGE_ENTRANCE_CLASS,
  SNAP_STAGE_PRESS_SCALE,
  SNAP_STAGE_SPRING,
} from './constants';
import { SnapStageDots } from './snap-stage-dots';
import type { SnapAnalyzeCtaProps } from './types';

export function SnapAnalyzeCta({ onAnalyze }: SnapAnalyzeCtaProps) {
  const reduceMotion = useReducedMotion() === true;

  return (
    <motion.div
      className={SNAP_STAGE_ENTRANCE_CLASS}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileTap={reduceMotion ? undefined : { scale: SNAP_STAGE_PRESS_SCALE }}
      transition={reduceMotion ? SNAP_MOTION_REDUCED : SNAP_STAGE_SPRING}
    >
      <Card className={cn('border-dashed', SNAP_PHOTO_CARD_SHELL, SNAP_STAGE_CARD_SURFACE_CLASS)}>
        <SnapStageDots />
        <CardContent
          className={cn(
            'flex h-full flex-col items-center justify-center gap-4 p-6',
            SNAP_STAGE_CARD_CONTENT_CLASS,
          )}
        >
          <ShimmerButton
            type="button"
            background="linear-gradient(165deg, var(--color-cta-soft) 0%, var(--color-cta) 48%, var(--color-cta-deep) 100%)"
            shimmerColor="var(--color-content)"
            shimmerSize="2px"
            className="text-button-default-fg h-9 px-5 text-sm"
            onClick={() => {
              onAnalyze();
            }}
          >
            {SNAP.ANALYZE_CTA}
          </ShimmerButton>
        </CardContent>
      </Card>
    </motion.div>
  );
}
