'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { ScanOverlay } from '@/app/components/scan-overlay/scan-overlay';
import { MEAL_SCAN_DIM, MEAL_SCAN_MEAL, MEAL_SCAN_TIMING } from './constants';
import { useMealScanLabelLayout } from './hooks';
import { MealScanCallout } from './meal-scan-callout';
import { getMealScanImageRect, getMealScanLabelDelay, getMealScanRevealDelay } from './utils';
import type { MealScanVisualProps } from './types';

export function MealScanVisual({ detections, status, runId, reduceMotion, className }: MealScanVisualProps) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const { LABELS, SIZES } = useMealScanLabelLayout(layerRef, detections);

  const isScanning = status === 'running';
  const isComplete = status === 'complete';

  return (
    <div
      className={cn(
        '@container relative shrink-0 justify-self-center overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/70 ring-1 ring-white/10',
        className,
      )}
      style={{ aspectRatio: MEAL_SCAN_MEAL.FRAME_ASPECT, width: MEAL_SCAN_MEAL.FRAME_MAX_WIDTH }}
      role="img"
      aria-label={MEAL_SCAN_MEAL.IMAGE_ALT}
    >
      <div className="absolute" style={getMealScanImageRect()}>
        <Image
          src={MEAL_SCAN_MEAL.IMAGE_SRC}
          alt=""
          fill
          sizes="(min-width: 1024px) 52vw, 100vw"
          className="object-cover"
        />
      </div>

      <motion.div
        key={`dim-${runId}`}
        className="pointer-events-none absolute"
        style={getMealScanImageRect()}
        initial={{ opacity: MEAL_SCAN_DIM.CLEAN_OPACITY }}
        animate={{ opacity: isComplete ? MEAL_SCAN_DIM.DARKENED_OPACITY : MEAL_SCAN_DIM.CLEAN_OPACITY }}
        transition={{
          delay: isComplete && !reduceMotion ? MEAL_SCAN_TIMING.DIM_DELAY_S : 0,
          duration: reduceMotion ? 0 : MEAL_SCAN_TIMING.DIM_TRANSITION_S,
          ease: 'easeOut',
        }}
        aria-hidden
      >
        <div className={`absolute inset-0 ${MEAL_SCAN_DIM.TINT}`} />
        <div className={`absolute inset-0 ${MEAL_SCAN_DIM.GRADIENT}`} />
      </motion.div>

      <AnimatePresence>
        {isScanning ? (
          <ScanOverlay key={`scan-${runId}`} loop={false} style={getMealScanImageRect()} />
        ) : null}
      </AnimatePresence>

      <div ref={layerRef} className="absolute z-30" style={getMealScanImageRect()}>
        {detections.map((detection, index) => (
          <MealScanCallout
            key={detection.KEY}
            detection={detection}
            solvedPoint={LABELS[detection.KEY] ?? null}
            size={SIZES[detection.KEY] ?? null}
            revealDelay={reduceMotion ? 0 : getMealScanRevealDelay(index, status)}
            labelDelay={reduceMotion ? 0 : getMealScanLabelDelay(index, status)}
            visible={isComplete}
            isComplete={isComplete}
            reduceMotion={reduceMotion}
            runId={runId}
          />
        ))}
      </div>
    </div>
  );
}
