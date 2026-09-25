'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { MEAL_SCAN_DETECTIONS, MEAL_SCAN_SECTION } from './constants';
import { MealScanResultPanel } from './meal-scan-result-panel';
import { MealScanVisual } from './meal-scan-visual';
import type { MealScanStatus } from './types';

export default function MealScan() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { amount: 0.35, once: false });
  const reduceMotion = useReducedMotion() === true;
  const hasPlayed = useRef(false);

  const [status, setStatus] = useState<MealScanStatus>('idle');
  const [runId, setRunId] = useState(0);

  const detections = useMemo(() => [...MEAL_SCAN_DETECTIONS].sort((a, b) => a.TARGET_Y - b.TARGET_Y), []);

  const playScan = useCallback(() => {
    setRunId((current) => current + 1);
    setStatus(reduceMotion ? 'complete' : 'running');
  }, [reduceMotion]);

  useEffect(() => {
    if (!isInView || hasPlayed.current) {
      return;
    }

    hasPlayed.current = true;
    playScan();
  }, [isInView, playScan]);

  const handleScanComplete = useCallback(() => {
    setStatus('complete');
  }, []);

  return (
    <section
      ref={sectionRef}
      id={MEAL_SCAN_SECTION.ID}
      className="layout-page-shell relative isolate overflow-hidden py-12 sm:py-14 lg:py-16 [@media(max-height:820px)]:py-10"
      aria-labelledby={`${MEAL_SCAN_SECTION.ID}-title`}
    >
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_0%,rgba(240,196,0,0.07),transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cta/25 to-transparent" />
      </div>

      <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] xl:gap-12">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold tracking-[0.2em] text-cta uppercase">
            {MEAL_SCAN_SECTION.EYEBROW}
          </p>
          <h2
            id={`${MEAL_SCAN_SECTION.ID}-title`}
            className="mt-4 text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl lg:text-4xl [@media(max-height:820px)]:text-3xl [@media(max-height:820px)]:sm:text-4xl"
          >
            {MEAL_SCAN_SECTION.TITLE}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pretty text-white/55 sm:text-lg">
            {MEAL_SCAN_SECTION.SUBTITLE}
          </p>
        </div>

        <MealScanVisual
          className="xl:col-start-2 xl:row-start-1 xl:row-span-2 xl:justify-self-end"
          detections={detections}
          status={status}
          runId={runId}
          reduceMotion={reduceMotion}
          onScanComplete={handleScanComplete}
        />

        <div className="w-full">
          <MealScanResultPanel detections={detections} status={status} runId={runId} />
        </div>
      </div>
    </section>
  );
}
