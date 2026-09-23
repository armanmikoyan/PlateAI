'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MODE_FRAMES, paintFrame, resolvePreset } from 'thinking-orbs/engine';
import { cn } from '@/app/utils/cn';
import { SNAP, SNAP_ORB, SNAP_PHOTO_CARD_SHELL } from './constants';
import { useSnapOrbSize } from './hooks';

export function SnapOrbLoader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = useSnapOrbSize(containerRef);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || size === 0) {
      return;
    }

    const context = canvas.getContext('2d');

    if (!context) {
      return;
    }

    const dpr = Math.min(
      SNAP_ORB.DPR_CAP,
      typeof window !== 'undefined' && window.devicePixelRatio ? window.devicePixelRatio : 1,
    );

    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const resolved = resolvePreset(SNAP_ORB.STATE, SNAP_ORB.TUNED_SIZE);
    const frame = MODE_FRAMES[resolved.mode];
    const ratio = size / SNAP_ORB.TUNED_SIZE;
    const startedAt = performance.now();

    const draw = (timeMs: number) => {
      const progress = Math.min(1, (timeMs - startedAt) / SNAP_ORB.GROW_MS);
      const grow = 1 - Math.pow(1 - progress, 3);
      const t = (timeMs / 1000) * resolved.speed;

      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, size, size);
      context.save();
      context.translate(size / 2, size / 2);
      context.scale(ratio * grow, ratio * grow);
      context.translate(-SNAP_ORB.TUNED_SIZE / 2, -SNAP_ORB.TUNED_SIZE / 2);
      paintFrame(context, frame(SNAP_ORB.TUNED_SIZE, t, resolved.opts), true, undefined);
      context.restore();
    };

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(startedAt + SNAP_ORB.GROW_MS);
      return;
    }

    let request = 0;

    const loop = (timeMs: number) => {
      draw(timeMs);
      request = requestAnimationFrame(loop);
    };

    request = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(request);
  }, [size]);

  return (
    <motion.div
      className={cn('relative w-full overflow-hidden rounded-2xl border bg-card', SNAP_PHOTO_CARD_SHELL)}
      aria-live="polite"
      aria-busy
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 1,
        scale: 1,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0)',
      }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.4, ease: 'easeIn' } }}
      transition={{ duration: 0.9, delay: 0.1, ease: 'easeInOut' }}
    >
      <motion.p
        className="text-muted-foreground absolute inset-x-0 top-6 z-10 text-center text-sm"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.45 }}
      >
        {SNAP.ANALYZING}
      </motion.p>
      <div ref={containerRef} className="flex size-full items-center justify-center">
        <canvas ref={canvasRef} className="block" aria-hidden />
      </div>
    </motion.div>
  );
}
