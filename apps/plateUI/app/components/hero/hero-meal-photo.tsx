'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import {
  HERO_MEAL_KEN_BURNS_FROM,
  HERO_MEAL_KEN_BURNS_TO,
  HERO_MEAL_PHOTO_CROSSFADE_S,
  HERO_MEAL_ROTATE_MS,
} from './constants';
import type { HeroKenBurnsLayerProps, HeroMealPhotoProps, HeroCycleProgressBarProps } from './types';
import { cn } from '@/app/utils/cn';

function HeroKenBurnsLayer({ meal, sizes, priority, loading, rotateS }: HeroKenBurnsLayerProps) {
  const scale = useMotionValue<number>(HERO_MEAL_KEN_BURNS_FROM);

  useEffect(() => {
    const animation = animate(scale, HERO_MEAL_KEN_BURNS_TO, { duration: rotateS, ease: 'linear' });
    return () => {
      animation.stop();
    };
  }, [scale, rotateS, meal.KEY]);

  return (
    <motion.div style={{ scale }} className="absolute inset-0 origin-center">
      <Image
        src={meal.IMAGE_SRC}
        alt={meal.IMAGE_ALT}
        fill
        priority={priority}
        loading={priority ? undefined : loading}
        sizes={sizes}
        className={cn('object-cover', meal.IMAGE_OBJECT_CLASS)}
      />
    </motion.div>
  );
}

function HeroCycleProgressBar({ rotateS, onCycleComplete }: HeroCycleProgressBarProps) {
  const scaleX = useMotionValue(0);
  const onCycleCompleteRef = useRef(onCycleComplete);
  onCycleCompleteRef.current = onCycleComplete;

  useEffect(() => {
    const animation = animate(scaleX, 1, {
      duration: rotateS,
      ease: 'linear',
      onComplete: () => onCycleCompleteRef.current(),
    });
    return () => {
      animation.stop();
    };
  }, [scaleX, rotateS]);

  return (
    <motion.span
      aria-hidden
      className="bg-accent absolute inset-x-0 bottom-0 z-10 h-0.5 origin-left"
      style={{ scaleX }}
    />
  );
}

export function HeroMealPhoto({
  meal,
  sizes,
  priority = false,
  loading,
  kenBurns = false,
  showCycleProgress = false,
  onCycleComplete,
}: HeroMealPhotoProps) {
  const reduceMotion = useReducedMotion();
  const crossfade = {
    duration: reduceMotion ? 0.2 : HERO_MEAL_PHOTO_CROSSFADE_S,
    ease: [0.22, 1, 0.36, 1] as const,
  };
  const useKenBurns = kenBurns && reduceMotion !== true;
  const advance = onCycleComplete ?? (() => {});

  return (
    <>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={meal.KEY}
          className="absolute inset-0 overflow-hidden"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(16px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(16px)' }}
          transition={crossfade}
        >
          {useKenBurns ? (
            <HeroKenBurnsLayer
              meal={meal}
              priority={priority}
              loading={loading}
              rotateS={HERO_MEAL_ROTATE_MS / 1000}
              sizes={sizes}
            />
          ) : (
            <Image
              src={meal.IMAGE_SRC}
              alt={meal.IMAGE_ALT}
              fill
              priority={priority}
              loading={priority ? undefined : loading}
              sizes={sizes}
              className={cn('object-cover', meal.IMAGE_OBJECT_CLASS)}
            />
          )}
        </motion.div>
      </AnimatePresence>
      {showCycleProgress && reduceMotion !== true ? (
        <HeroCycleProgressBar
          key={`${meal.KEY}-progress`}
          rotateS={HERO_MEAL_ROTATE_MS / 1000}
          onCycleComplete={advance}
        />
      ) : null}
    </>
  );
}
