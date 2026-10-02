'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { HERO_ENTER_GRID_SHELL, HERO_MEAL_ROTATE_MS, HERO_MEAL_SLIDES } from './constants';
import { HeroBetweenCardsArrow } from './hero-between-cards-arrow';
import HeroResultReadout from './hero-result-readout';
import HeroUploadColumn from './hero-upload-column';

export function HeroMealStage() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pauseTimerRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  // Never auto-advance for reduced-motion users, and let a pointer or focus
  // pause the rotation so the content stays put while someone is reading it.
  useEffect(() => {
    if (reduceMotion === true || paused) {
      return;
    }
    const timerId = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_MEAL_SLIDES.length);
    }, HERO_MEAL_ROTATE_MS);
    return () => window.clearInterval(timerId);
  }, [paused, reduceMotion]);

  const pause = () => {
    setPaused(true);
    if (pauseTimerRef.current != null) {
      window.clearTimeout(pauseTimerRef.current);
    }
    pauseTimerRef.current = window.setTimeout(() => setPaused(false), HERO_MEAL_ROTATE_MS);
  };

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current != null) {
        window.clearTimeout(pauseTimerRef.current);
      }
    };
  }, []);

  const meal = HERO_MEAL_SLIDES[index];

  if (meal == null) {
    return null;
  }

  return (
    <div className={HERO_ENTER_GRID_SHELL} onPointerEnter={pause} onFocus={pause} onPointerLeave={pause}>
      <div className="relative z-0 flex w-full min-w-0 lg:self-start">
        <HeroUploadColumn meal={meal} />
      </div>
      <HeroBetweenCardsArrow />
      <div className="relative z-0 flex w-full min-w-0">
        <HeroResultReadout meal={meal} />
      </div>
    </div>
  );
}
