'use client';

import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import {
  FeatureDemoContext,
  FeatureDemoPhoto,
  FeatureDemoProfiles,
  FeatureDemoProgress,
} from './feature-demo-scenes';
import type { FeatureDemoPreviewProps, FeatureDemoSceneSwitchProps } from './types';

function FeatureDemoScene({ sceneKey, reduceMotion }: FeatureDemoSceneSwitchProps) {
  switch (sceneKey) {
    case 'photo':
      return <FeatureDemoPhoto reduceMotion={reduceMotion} />;
    case 'context':
      return <FeatureDemoContext reduceMotion={reduceMotion} />;
    case 'progress':
      return <FeatureDemoProgress reduceMotion={reduceMotion} />;
    case 'profiles':
      return <FeatureDemoProfiles reduceMotion={reduceMotion} />;
  }
}

export function FeatureDemoPreview({ rows, activeKey, reduceMotion }: FeatureDemoPreviewProps) {
  const active = rows.find((row) => row.KEY === activeKey) ?? rows[0];

  return (
    <div
      role="tabpanel"
      id="feature-demo-panel"
      aria-labelledby={`feature-tab-${active.KEY}`}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-surface-raised/70 shadow-2xl shadow-black/40 backdrop-blur-sm"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 right-0 size-72 rounded-full opacity-20 blur-3xl"
        style={{ background: active.ACCENT_HEX }}
      />

      <div className="relative flex items-center justify-between gap-3 border-b border-white/8 px-5 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <motion.span
            aria-hidden
            className={cn('size-1.5 shrink-0 rounded-full', !reduceMotion && 'opacity-80')}
            style={{ backgroundColor: active.ACCENT_HEX }}
            animate={reduceMotion ? undefined : { scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <p className="text-[10px] font-semibold tracking-[0.18em] text-white/40 uppercase">Live preview</p>
        </div>
        <p className="truncate text-sm font-semibold text-white">{active.TITLE}</p>
      </div>

      <div className="relative flex h-[27rem] flex-col justify-center overflow-hidden p-5 sm:h-[30rem] sm:p-6 lg:h-[34rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.KEY}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <FeatureDemoScene sceneKey={active.KEY} reduceMotion={reduceMotion} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
