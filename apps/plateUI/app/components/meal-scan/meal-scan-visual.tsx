'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { MEAL_SCAN_DIM, MEAL_SCAN_MEAL, MEAL_SCAN_TIMING } from './constants';
import { useMealScanLabelLayout } from './hooks';
import { MealScanCallout } from './meal-scan-callout';
import { getMealScanImageRect, getMealScanLabelDelay, getMealScanRevealDelay } from './utils';
import type { MealScanVisualProps } from './types';

export function MealScanVisual({
  detections,
  status,
  runId,
  reduceMotion,
  onScanComplete,
  className,
}: MealScanVisualProps) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const { LABELS, SIZES } = useMealScanLabelLayout(layerRef, detections);

  const isScanning = status === 'running';
  const isComplete = status === 'complete';
  const showDetections = status !== 'idle';

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

      <svg
        viewBox={`0 0 ${MEAL_SCAN_MEAL.WIDTH} ${MEAL_SCAN_MEAL.HEIGHT}`}
        className="pointer-events-none absolute z-20"
        style={getMealScanImageRect()}
        fill="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="meal-scan-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0c400" stopOpacity="0" />
            <stop offset="65%" stopColor="#f0c400" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#f0c400" stopOpacity="0.65" />
          </linearGradient>
        </defs>

        {isScanning && (
          <motion.rect
            key={`scan-${runId}`}
            x={0}
            width={MEAL_SCAN_MEAL.WIDTH}
            height={190}
            fill="url(#meal-scan-gradient)"
            initial={{ y: -190 }}
            animate={{ y: MEAL_SCAN_MEAL.HEIGHT }}
            transition={{
              duration: reduceMotion ? 0.4 : MEAL_SCAN_TIMING.SCAN_DURATION_S,
              ease: reduceMotion ? 'linear' : MEAL_SCAN_TIMING.SCAN_EASE,
              onComplete: onScanComplete,
            }}
          />
        )}
      </svg>

      <div ref={layerRef} className="absolute z-30" style={getMealScanImageRect()}>
        {detections.map((detection) => (
          <MealScanCallout
            key={detection.KEY}
            detection={detection}
            solvedPoint={LABELS[detection.KEY] ?? null}
            size={SIZES[detection.KEY] ?? null}
            revealDelay={getMealScanRevealDelay(detection, status)}
            labelDelay={getMealScanLabelDelay(detection, status)}
            visible={showDetections}
            isComplete={isComplete}
            reduceMotion={reduceMotion}
            runId={runId}
          />
        ))}
      </div>
    </div>
  );
}
