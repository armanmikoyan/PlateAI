'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/app/ui/button';
import { MEAL_SCAN_MEAL, MEAL_SCAN_SECTION, MEAL_SCAN_STATUS } from './constants';
import { getMealScanLabelDelay } from './utils';
import type { MealScanResultPanelProps, MealScanStatus } from './types';

function getStatusCopy(status: MealScanStatus) {
  switch (status) {
    case 'idle':
      return MEAL_SCAN_STATUS.IDLE;
    case 'running':
      return MEAL_SCAN_STATUS.RUNNING;
    case 'complete':
      return MEAL_SCAN_STATUS.COMPLETE;
  }
}

export function MealScanResultPanel({ detections, status, runId }: MealScanResultPanelProps) {
  const statusCopy = getStatusCopy(status);
  const isScanning = status === 'running';
  const hasResults = status !== 'idle';

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-surface/70 p-3.5 shadow-xl shadow-black/30 backdrop-blur-xl sm:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.18em] text-cta uppercase">
            {MEAL_SCAN_SECTION.DETECTED_LABEL}
          </p>
          <h3 className="mt-1.5 truncate text-lg font-semibold text-white">{MEAL_SCAN_MEAL.NAME}</h3>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs font-semibold tracking-[0.1em] uppercase">
          {isScanning ? (
            <Loader2 className="size-3 animate-spin text-cta" aria-hidden />
          ) : (
            <CheckCircle2 className="size-3 text-positive" aria-hidden />
          )}
          <span className={isScanning ? 'text-cta' : 'text-positive'}>{statusCopy.LABEL}</span>
          <span className="sr-only">{statusCopy.DETAIL}</span>
        </span>
      </div>

      <ul className="-mx-1 grid grid-cols-2 gap-1.5">
        {detections.map((detection) => (
          <motion.li
            key={`${runId}-${detection.KEY}`}
            className="flex min-w-0 items-center gap-1.5 rounded-lg border border-white/6 bg-white/3 py-1.5 pr-1.5 pl-2 [@media(max-height:820px)]:py-1"
            initial={{ opacity: 0, x: -6 }}
            animate={hasResults ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
            transition={{
              delay: getMealScanLabelDelay(detection, status),
              duration: 0.35,
              ease: 'easeOut',
            }}
          >
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: detection.COLOR }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 truncate text-sm text-white/80">{detection.LABEL}</span>
            <span className="shrink-0 text-xs text-white/40 tabular-nums">{detection.DETAIL}</span>
          </motion.li>
        ))}
      </ul>
      <div className="flex items-center justify-between gap-3 border-t border-white/8 pt-2.5">
        <p className="text-xs font-semibold tracking-[0.18em] text-white/40 uppercase">
          {MEAL_SCAN_SECTION.NUTRITION_LABEL}
        </p>
        <p className="flex items-baseline gap-1">
          <motion.span
            key={`calories-${runId}`}
            className="text-xl font-semibold tracking-tight text-white tabular-nums"
            initial={{ opacity: 0, y: 6 }}
            animate={hasResults ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{
              duration: 0.4,
              delay: 0,
              ease: 'easeOut',
            }}
          >
            {hasResults ? MEAL_SCAN_SECTION.CALORIES_VALUE : '—'}
          </motion.span>
          <span className="text-sm text-white/45">{MEAL_SCAN_SECTION.CALORIES_UNIT}</span>
        </p>
      </div>

      <div className="border-t border-white/8 pt-2.5">
        <Button
          className="h-8 w-full justify-center text-sm"
          variant="cta"
          nativeButton={false}
          render={<Link href={MEAL_SCAN_SECTION.CTA_HREF} />}
        >
          {MEAL_SCAN_SECTION.CTA_LABEL}
        </Button>
      </div>
    </div>
  );
}
