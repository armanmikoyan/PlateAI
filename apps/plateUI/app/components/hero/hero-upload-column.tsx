'use client';

import Link from 'next/link';
import { cn } from '@/app/utils/cn';
import { HERO, HERO_ENTER_MOTION_REDUCE, HERO_MEAL_SLIDES, type HeroUploadColumnProps } from './constants';
import { HeroMealPhoto } from './hero-meal-photo';

export default function HeroUploadColumn({ meal, onCycleComplete }: HeroUploadColumnProps) {
  return (
    <Link
      href={HERO.CTA_HREF}
      className={cn(
        'animate-in fade-in slide-in-from-left-10 zoom-in-95 fill-mode-both flex h-72 w-full delay-200 duration-1000 ease-out sm:h-80 lg:h-128',
        HERO_ENTER_MOTION_REDUCE,
      )}
      aria-label={HERO.CTA}
    >
      <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden rounded-xl">
        <HeroMealPhoto
          meal={meal}
          sizes={HERO.UPLOAD_IMAGE_SIZES}
          priority={meal.KEY === HERO_MEAL_SLIDES[0]?.KEY}
          kenBurns
          showCycleProgress
          onCycleComplete={onCycleComplete}
        />
      </div>
    </Link>
  );
}
