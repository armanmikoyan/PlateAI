'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import {
  FEATURE_DEMO_CONTEXT,
  FEATURE_DEMO_PHOTO,
  FEATURE_DEMO_PROFILES,
  FEATURE_DEMO_PROGRESS,
  FEATURE_DEMO_TIMING,
} from './constants';
import type { FeatureDemoSceneProps } from './types';

export function FeatureDemoPhoto({ reduceMotion }: FeatureDemoSceneProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-48 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/50 sm:h-64 lg:h-72">
        <Image
          src={FEATURE_DEMO_PHOTO.IMAGE_SRC}
          alt={FEATURE_DEMO_PHOTO.IMAGE_ALT}
          width={1536}
          height={1024}
          className="size-full object-cover"
          priority
        />
        {!reduceMotion ? (
          <motion.div
            aria-hidden
            className="absolute inset-x-0 h-0.5 bg-linear-to-r from-transparent via-cta to-transparent shadow-[0_0_18px_rgba(240,196,0,0.6)]"
            initial={{ top: '-6%' }}
            animate={{ top: '106%' }}
            transition={{
              duration: FEATURE_DEMO_TIMING.SCAN_S,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 0.8,
            }}
          />
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {FEATURE_DEMO_PHOTO.CHIPS.map((chip, index) => (
          <motion.div
            key={chip.LABEL}
            className="rounded-xl border border-white/8 bg-white/[0.04] px-3 py-2.5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              delay: reduceMotion
                ? 0
                : FEATURE_DEMO_TIMING.CHIP_DELAY_S + index * FEATURE_DEMO_TIMING.STAGGER_S,
              duration: FEATURE_DEMO_TIMING.CHIP_S,
              ease: 'easeOut',
            }}
          >
            <p className="text-[10px] font-medium tracking-[0.14em] text-white/40 uppercase">{chip.LABEL}</p>
            <p className="mt-0.5 text-sm font-semibold text-white tabular-nums">{chip.VALUE}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function FeatureDemoContext({ reduceMotion }: FeatureDemoSceneProps) {
  return (
    <div className="flex flex-col gap-4">
      <motion.div
        className="flex items-end justify-between gap-3"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: FEATURE_DEMO_TIMING.ENTRY_S, ease: 'easeOut' }}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-medium tracking-[0.14em] text-white/40 uppercase">
            {FEATURE_DEMO_CONTEXT.TARGET_LABEL}
          </p>
          <p className="mt-0.5 text-lg font-semibold text-white tabular-nums">
            {FEATURE_DEMO_CONTEXT.TARGET_VALUE}
          </p>
        </div>
        <div className="rounded-full border border-macro-protein/25 bg-macro-protein/10 px-3 py-1.5 text-right">
          <p className="text-[10px] font-medium tracking-[0.14em] text-macro-protein uppercase">
            {FEATURE_DEMO_CONTEXT.LEFT_LABEL}
          </p>
          <p className="text-sm font-semibold text-white tabular-nums">{FEATURE_DEMO_CONTEXT.LEFT_VALUE}</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-3">
        {FEATURE_DEMO_CONTEXT.BARS.map((bar, index) => (
          <div key={bar.KEY} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium text-white/80">{bar.LABEL}</p>
              <p className="text-xs text-white/45 tabular-nums">{bar.VALUE}</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/8">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: bar.COLOR, boxShadow: `0 0 12px ${bar.COLOR}66` }}
                initial={{ width: '0%' }}
                whileInView={{ width: `${bar.PCT}%` }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  delay: reduceMotion
                    ? 0
                    : FEATURE_DEMO_TIMING.CHIP_DELAY_S + index * FEATURE_DEMO_TIMING.STAGGER_S,
                  duration: FEATURE_DEMO_TIMING.BAR_S,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeatureDemoProgress({ reduceMotion }: FeatureDemoSceneProps) {
  const CIRCUMFERENCE = 2 * Math.PI * 42;

  return (
    <div className="flex w-full flex-col gap-4">
      <motion.div
        className="flex items-center justify-between gap-3"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: FEATURE_DEMO_TIMING.ENTRY_S, ease: 'easeOut' }}
      >
        <p className="text-sm font-semibold text-white">{FEATURE_DEMO_PROGRESS.LABEL}</p>
        <span className="rounded-full border border-macro-fat/25 bg-macro-fat/10 px-3 py-1.5">
          <span className="text-sm font-semibold text-white tabular-nums">{FEATURE_DEMO_PROGRESS.VALUE}</span>
        </span>
      </motion.div>

      <div className="flex items-center gap-5 sm:gap-6">
        <div className="relative size-32 shrink-0 sm:size-36">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="7" />
            <motion.circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="url(#progress-ring-fill)"
              strokeLinecap="round"
              strokeWidth="7"
              strokeDasharray={CIRCUMFERENCE}
              initial={{
                strokeDashoffset: reduceMotion
                  ? CIRCUMFERENCE * (1 - FEATURE_DEMO_PROGRESS.RING_PCT / 100)
                  : CIRCUMFERENCE,
              }}
              whileInView={{ strokeDashoffset: CIRCUMFERENCE * (1 - FEATURE_DEMO_PROGRESS.RING_PCT / 100) }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{
                delay: reduceMotion ? 0 : FEATURE_DEMO_TIMING.CHIP_DELAY_S,
                duration: FEATURE_DEMO_TIMING.BAR_S,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
            <defs>
              <linearGradient id="progress-ring-fill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold text-white tabular-nums">
              {FEATURE_DEMO_PROGRESS.RING_VALUE}
            </span>
            <span className="text-[10px] font-medium tracking-[0.14em] text-white/40 uppercase">
              {FEATURE_DEMO_PROGRESS.RING_SUFFIX}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <p className="text-[10px] font-medium tracking-[0.14em] text-white/40 uppercase">
            {FEATURE_DEMO_PROGRESS.HEADER}
          </p>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {FEATURE_DEMO_PROGRESS.DAYS.map((day, index) => (
              <motion.div
                key={day.KEY}
                className={cn(
                  'flex size-8 items-center justify-center rounded-full text-xs font-semibold',
                  day.LOGGED
                    ? 'bg-macro-fat/15 text-macro-fat ring-1 ring-macro-fat/30'
                    : 'bg-white/[0.04] text-white/30',
                )}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{
                  delay: reduceMotion
                    ? 0
                    : FEATURE_DEMO_TIMING.CHIP_DELAY_S + index * FEATURE_DEMO_TIMING.STAGGER_S,
                  duration: FEATURE_DEMO_TIMING.CHIP_S,
                  ease: 'easeOut',
                }}
              >
                {day.DAY}
              </motion.div>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">{FEATURE_DEMO_PROGRESS.NOTE}</p>
        </div>
      </div>
    </div>
  );
}

export function FeatureDemoProfiles({ reduceMotion }: FeatureDemoSceneProps) {
  return (
    <div className="flex flex-col gap-4">
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: FEATURE_DEMO_TIMING.ENTRY_S, ease: 'easeOut' }}
      >
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/12 font-semibold text-accent-mid">
          <span className="absolute inset-0 rounded-full ring-2 ring-accent/20" aria-hidden />
          You
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-medium tracking-[0.14em] text-white/40 uppercase">
            {FEATURE_DEMO_PROFILES.HEADER}
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-white">
            {FEATURE_DEMO_PROFILES.AVATAR_LABEL}
          </p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-2">
        {FEATURE_DEMO_PROFILES.TARGETS.map((target, index) => (
          <motion.div
            key={target.KEY}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2.5"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              delay: reduceMotion
                ? 0
                : FEATURE_DEMO_TIMING.CHIP_DELAY_S + index * FEATURE_DEMO_TIMING.STAGGER_S,
              duration: FEATURE_DEMO_TIMING.CHIP_S,
              ease: 'easeOut',
            }}
          >
            <p className="text-sm text-white/60">{target.LABEL}</p>
            <p className="text-sm font-semibold text-white tabular-nums">{target.VALUE}</p>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-xs leading-relaxed text-white/45"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{
          delay: reduceMotion ? 0 : FEATURE_DEMO_TIMING.CHIP_DELAY_S + FEATURE_DEMO_TIMING.CHIP_S * 2,
          duration: FEATURE_DEMO_TIMING.CHIP_S,
        }}
      >
        {FEATURE_DEMO_PROFILES.NOTE}
      </motion.p>
    </div>
  );
}
