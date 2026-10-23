'use client';

import { motion, useReducedMotion } from 'motion/react';
import {
  SNAP_SCAN,
  SNAP_SCAN_AURA_CLASS,
  SNAP_SCAN_BEAM_CLASS,
  SNAP_SCAN_BEAM_GLOW_CLASS,
  SNAP_SCAN_BEAM_LINE_CLASS,
  SNAP_SCAN_BEAM_TICKS_CLASS,
  SNAP_SCAN_CORNER_CLASS,
  SNAP_SCAN_FILL_CLASS,
  SNAP_SCAN_FILL_X_CLASS,
  SNAP_SCAN_GRID_CLASS,
  SNAP_SCAN_GRID_MASK_CLASS,
  SNAP_SCAN_LINES_CLASS,
  SNAP_SCAN_MARKER_BOTTOM_CLASS,
  SNAP_SCAN_MARKER_LEFT_CLASS,
  SNAP_SCAN_MARKER_RIGHT_CLASS,
  SNAP_SCAN_MARKER_TOP_CLASS,
  SNAP_SCAN_RULER_X_CLASS,
  SNAP_SCAN_RULER_Y_CLASS,
  SNAP_SCAN_SCRIM_CLASS,
  SNAP_SCAN_SPECTRUM,
  SNAP_SCAN_SWEEP,
  SNAP_SCAN_TINT_CLASS,
  SNAP_SCAN_VERTICAL_CLASS,
} from './constants';

export function SnapScanOverlay() {
  const reduceMotion = useReducedMotion() === true;
  const cell = SNAP_SCAN.GRID_SIZE_PX;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.3 }}
      aria-hidden
    >
      <div className={SNAP_SCAN_TINT_CLASS} />
      <div className={SNAP_SCAN_SCRIM_CLASS} />

      <motion.div
        className={SNAP_SCAN_AURA_CLASS}
        initial={reduceMotion ? { top: '50%', left: '50%' } : { top: '-5%', left: '-5%', rotate: 0 }}
        animate={
          reduceMotion
            ? { top: '50%', left: '50%' }
            : { top: ['-5%', '105%'], left: ['-5%', '105%'], rotate: 360 }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                top: SNAP_SCAN_SWEEP,
                left: SNAP_SCAN_SWEEP,
                rotate: { duration: 18, repeat: Infinity, ease: 'linear' },
              }
        }
      />

      <div className={SNAP_SCAN_GRID_MASK_CLASS}>
        <motion.div
          className={SNAP_SCAN_GRID_CLASS}
          style={{
            inset: -cell,
            backgroundSize: `${cell}px ${cell}px`,
          }}
          initial={reduceMotion ? undefined : { opacity: 0.5 }}
          animate={reduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: SNAP_SCAN.SWEEP_SECONDS,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
        />
      </div>

      <motion.div
        className="absolute inset-x-0 top-0 overflow-hidden"
        initial={reduceMotion ? { height: '50%' } : { height: '0%' }}
        animate={reduceMotion ? { height: '50%' } : { height: ['0%', '0%', '100%', '100%'] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: SNAP_SCAN.SWEEP_SECONDS,
                repeat: Infinity,
                ease: 'linear',
                times: [0, 0.0455, 0.9545, 1],
              }
        }
      >
        <div
          className={SNAP_SCAN_FILL_CLASS}
          style={{ height: '100%', backgroundSize: `${cell}px ${cell}px` }}
        />
      </motion.div>

      <motion.div
        className="absolute inset-y-0 left-0 overflow-hidden"
        initial={reduceMotion ? { width: '50%' } : { width: '0%' }}
        animate={reduceMotion ? { width: '50%' } : { width: ['0%', '0%', '100%', '100%'] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : {
                duration: SNAP_SCAN.SWEEP_SECONDS,
                repeat: Infinity,
                ease: 'linear',
                times: [0, 0.0455, 0.9545, 1],
              }
        }
      >
        <div
          className={SNAP_SCAN_FILL_X_CLASS}
          style={{ width: '100%', backgroundSize: `${cell}px ${cell}px` }}
        />
      </motion.div>

      <div className={SNAP_SCAN_LINES_CLASS} />

      <div className={`${SNAP_SCAN_RULER_Y_CLASS} left-2`} />
      <div className={`${SNAP_SCAN_RULER_Y_CLASS} right-2`} />
      <div className={`${SNAP_SCAN_RULER_X_CLASS} top-2`} />
      <div className={`${SNAP_SCAN_RULER_X_CLASS} bottom-2`} />

      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? { x: '-50%' } : { x: '-105%' }}
        animate={reduceMotion ? { x: '-50%' } : { x: ['-105%', '5%'] }}
        transition={reduceMotion ? { duration: 0 } : SNAP_SCAN_SWEEP}
      >
        <div className={SNAP_SCAN_VERTICAL_CLASS}>
          <span className="absolute inset-y-0 right-0 w-px bg-accent-soft/80 shadow-[0_0_12px_2px_rgb(251_191_36/0.5)]" />
          <span className={`${SNAP_SCAN_MARKER_TOP_CLASS} -right-1`} />
          <span className={`${SNAP_SCAN_MARKER_BOTTOM_CLASS} -right-1`} />
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? { y: '-50%' } : { y: '-105%' }}
        animate={reduceMotion ? { y: '-50%' } : { y: ['-105%', '5%'] }}
        transition={reduceMotion ? { duration: 0 } : SNAP_SCAN_SWEEP}
      >
        <div className={SNAP_SCAN_BEAM_CLASS}>
          <div className={SNAP_SCAN_BEAM_GLOW_CLASS} />
          <div className={SNAP_SCAN_BEAM_TICKS_CLASS} />
          <div className={SNAP_SCAN_BEAM_LINE_CLASS} />
          <span className={`${SNAP_SCAN_MARKER_LEFT_CLASS} bottom-0`} />
          <span className={`${SNAP_SCAN_MARKER_RIGHT_CLASS} bottom-0`} />
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
        transition={{
          duration: SNAP_SCAN.SWEEP_SECONDS,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <span className={`${SNAP_SCAN_CORNER_CLASS} top-3 left-3 border-t-2 border-l-2`} />
        <span className={`${SNAP_SCAN_CORNER_CLASS} top-3 right-3 border-t-2 border-r-2`} />
        <span className={`${SNAP_SCAN_CORNER_CLASS} bottom-3 left-3 border-b-2 border-l-2`} />
        <span className={`${SNAP_SCAN_CORNER_CLASS} right-3 bottom-3 border-r-2 border-b-2`} />
      </motion.div>

      <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 font-mono text-[10px] tracking-[0.22em] text-accent-soft/90 uppercase sm:p-4">
        <span className="rounded-sm bg-canvas/40 px-1.5 py-1 backdrop-blur-[2px]">{SNAP_SCAN.LABEL}</span>
        <span className="flex items-center gap-1.5 rounded-sm bg-canvas/40 px-1.5 py-1 backdrop-blur-[2px]">
          <motion.span
            className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_1px_rgb(251_191_36/0.8)]"
            animate={reduceMotion ? undefined : { opacity: [1, 0.15, 1] }}
            transition={{
              duration: SNAP_SCAN.SWEEP_SECONDS / 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          {SNAP_SCAN.ID}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-3 sm:p-4">
        <div className="flex flex-col gap-1">
          <div className="flex h-2.5 items-end gap-0.5">
            {SNAP_SCAN_SPECTRUM.map((height, index) => (
              <motion.span
                key={`${height}-${index}`}
                className="h-2.5 w-0.5 origin-bottom rounded-full bg-accent/80"
                initial={{ scaleY: height }}
                animate={reduceMotion ? { scaleY: height } : { scaleY: [0.2, height, 0.45] }}
                transition={{
                  duration: reduceMotion ? 0 : 1 + index * 0.12,
                  repeat: reduceMotion ? 0 : Infinity,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-0.5 font-mono text-[10px] tracking-[0.2em] uppercase">
            <span className="text-accent-soft/90">{SNAP_SCAN.STATUS}</span>
            <span className="text-accent/60">{SNAP_SCAN.CAPTION}</span>
          </div>
        </div>
        <div className="w-24 shrink-0 sm:w-32">
          <div className="h-0.5 w-full overflow-hidden rounded-full bg-accent/25">
            <motion.div
              className="h-full w-1/3 rounded-full bg-accent shadow-[0_0_10px_1px_rgb(251_191_36/0.7)]"
              animate={reduceMotion ? { x: '100%' } : { x: ['-110%', '330%'] }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: SNAP_SCAN.SWEEP_SECONDS, repeat: Infinity, ease: 'easeInOut' }
              }
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
