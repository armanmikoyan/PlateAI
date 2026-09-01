'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import {
  HERO_MEAL_KEN_BURNS_FROM,
  HERO_MEAL_KEN_BURNS_TO,
  HERO_MEAL_PHOTO_CROSSFADE_S,
  HERO_MEAL_ROTATE_MS,
  type HeroMealSlide,
} from './constants';
import { cn } from '@/app/utils/cn';

type HeroMealPhotoProps = Readonly<{
  meal: HeroMealSlide;
  sizes: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  kenBurns?: boolean;
  showCycleProgress?: boolean;
}>;

type HeroKenBurnsLayerProps = Readonly<{
  meal: HeroMealSlide;
  sizes: string;
  priority: boolean;
  loading?: 'lazy' | 'eager';
  rotateS: number;
}>;

function HeroKenBurnsLayer({ meal, sizes, priority, loading, rotateS }: HeroKenBurnsLayerProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    controls.set({ scale: HERO_MEAL_KEN_BURNS_FROM });
    controls.start({
      scale: HERO_MEAL_KEN_BURNS_TO,
      transition: { duration: rotateS, ease: 'linear' },
    });
  }, [controls, meal.KEY, rotateS]);

  return (
    <motion.div animate={controls} className="absolute inset-0 origin-center">
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

export function HeroMealPhoto({
  meal,
  sizes,
  priority = false,
  loading,
  kenBurns = false,
  showCycleProgress = false,
}: HeroMealPhotoProps) {
  const reduceMotion = useReducedMotion();
  const rotateS = HERO_MEAL_ROTATE_MS / 1000;
  const crossfade = {
    duration: reduceMotion ? 0.2 : HERO_MEAL_PHOTO_CROSSFADE_S,
    ease: [0.22, 1, 0.36, 1] as const,
  };
  const useKenBurns = kenBurns && reduceMotion !== true;

  return (
    <>
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={meal.KEY}
          className="absolute inset-0 overflow-hidden"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(16px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, filter: 'blur(12px)' }}
          transition={crossfade}
        >
          {useKenBurns ? (
            <HeroKenBurnsLayer
              meal={meal}
              priority={priority}
              loading={loading}
              rotateS={rotateS}
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
        <motion.span
          key={`${meal.KEY}-progress`}
          aria-hidden
          className="bg-accent absolute inset-x-0 bottom-0 z-10 h-0.5 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: rotateS, ease: 'linear' }}
        />
      ) : null}
    </>
  );
}
