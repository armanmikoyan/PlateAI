'use client';

import { useCallback, useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { USE_CASE_ANIM } from './constants';
import type { UseCaseCardProps } from './types';

export function UseCaseCard({ card }: UseCaseCardProps) {
  const reduceMotion = useReducedMotion() === true;
  const frameRef = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowOpacity = useSpring(0, { stiffness: 260, damping: 30 });

  const Icon = card.ICON;

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const element = frameRef.current;
      if (!element || reduceMotion) {
        return;
      }
      const rect = element.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      rotateY.set((px - 0.5) * 2 * USE_CASE_ANIM.MAX_TILT_DEG);
      rotateX.set((0.5 - py) * 2 * USE_CASE_ANIM.MAX_TILT_DEG);
      glowX.set(event.clientX - rect.left);
      glowY.set(event.clientY - rect.top);
      glowOpacity.set(1);
    },
    [reduceMotion, rotateX, rotateY, glowX, glowY, glowOpacity],
  );

  const reset = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    glowOpacity.set(0);
  }, [rotateX, rotateY, glowOpacity]);

  const glow = useMotionTemplate`radial-gradient(${USE_CASE_ANIM.GLOW_SIZE}px circle at ${glowX}px ${glowY}px, ${card.ACCENT_HEX}2e, transparent 70%)`;

  return (
    <motion.div
      ref={frameRef}
      className="h-full [perspective:1200px]"
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-white/10 bg-card p-6 shadow-xl shadow-black/30 sm:p-7"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
          style={{ background: glow, opacity: glowOpacity }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-1/4 -translate-x-[250%] -skew-x-12 bg-linear-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-[450%] group-hover:transition-transform group-hover:duration-700 group-hover:ease-out"
        />

        <div className="relative z-20 flex h-full flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <span
              className={cn(
                'flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300',
                card.ICON_SHELL,
                'group-hover:-rotate-6 group-hover:scale-110',
              )}
            >
              <Icon aria-hidden className="size-5.5" />
            </span>
            <span className={cn('text-[10px] font-semibold tracking-[0.2em] uppercase', card.ACCENT_TEXT)}>
              {card.KICKER}
            </span>
          </div>

          <h3 className="font-heading text-lg font-semibold tracking-tight text-white sm:text-xl">
            {card.TITLE}
          </h3>
          <p className="text-sm/relaxed text-muted-foreground">{card.BODY}</p>

          <div
            aria-hidden
            className="mt-auto h-px w-10 transition-[width] duration-500 ease-out group-hover:w-full"
            style={{ backgroundColor: card.ACCENT_HEX }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
