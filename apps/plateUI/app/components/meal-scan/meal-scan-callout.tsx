'use client';

import { motion } from 'motion/react';
import { MEAL_SCAN_CHIP_CLASS, MEAL_SCAN_MEAL, MEAL_SCAN_TIMING } from './constants';
import { getMealScanLabelPosition, getMealScanLabelStyle, getMealScanLeaderPath } from './utils';
import type { MealScanCalloutProps } from './types';

export function MealScanCallout({
  detection,
  solvedPoint,
  size,
  revealDelay,
  labelDelay,
  visible,
  isComplete,
  reduceMotion,
  runId,
}: MealScanCalloutProps) {
  const point = solvedPoint ?? { X: detection.TARGET_X, Y: detection.TARGET_Y };
  const path = size ? getMealScanLeaderPath(detection, point, size) : '';

  const entrance = { opacity: 1, scale: 1 };
  const hidden = reduceMotion ? { opacity: 0, scale: 1 } : { opacity: 0, scale: 0.82 };

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <svg
        viewBox={`0 0 ${MEAL_SCAN_MEAL.WIDTH} ${MEAL_SCAN_MEAL.HEIGHT}`}
        className="absolute inset-0 size-full overflow-visible"
        fill="none"
      >
        <motion.path
          key={`leader-${runId}-${detection.KEY}`}
          d={path}
          stroke={detection.COLOR}
          strokeWidth={3}
          strokeOpacity={isComplete ? 0.95 : 0.75}
          strokeLinecap="round"
          strokeDasharray="0.1 10"
          vectorEffect="non-scaling-stroke"
          className="stroke-1"
          initial={{ pathLength: reduceMotion ? 1 : 0, opacity: 0 }}
          animate={visible ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          transition={{
            delay: labelDelay,
            duration: MEAL_SCAN_TIMING.CALLOUT_ENTRANCE_S,
            ease: 'easeOut',
          }}
        />

        <motion.circle
          cx={detection.TARGET_X}
          cy={detection.TARGET_Y}
          r={isComplete ? MEAL_SCAN_MEAL.DOT_RADIUS * 1.15 : MEAL_SCAN_MEAL.DOT_RADIUS}
          fill={detection.COLOR}
          fillOpacity={isComplete ? 1 : 0.9}
          initial={{ r: 0, opacity: 0 }}
          animate={
            visible
              ? {
                  r: isComplete ? MEAL_SCAN_MEAL.DOT_RADIUS * 1.15 : MEAL_SCAN_MEAL.DOT_RADIUS,
                  opacity: 0.95,
                }
              : { r: 0, opacity: 0 }
          }
          transition={{
            delay: revealDelay,
            duration: MEAL_SCAN_TIMING.CALLOUT_ENTRANCE_S,
            ease: 'backOut',
          }}
        />
      </svg>

      <motion.div
        key={`label-${runId}-${detection.KEY}`}
        className="absolute"
        style={getMealScanLabelPosition(point.X, point.Y)}
        initial={hidden}
        animate={visible ? entrance : hidden}
        transition={{
          delay: labelDelay,
          duration: MEAL_SCAN_TIMING.CALLOUT_ENTRANCE_S,
          ease: 'backOut',
        }}
      >
        <span
          data-callout-label={detection.KEY}
          className={MEAL_SCAN_CHIP_CLASS}
          style={getMealScanLabelStyle(detection.COLOR)}
        >
          {detection.LABEL}
        </span>
      </motion.div>
    </div>
  );
}
