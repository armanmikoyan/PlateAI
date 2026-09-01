'use client';

import { useEffect, useState } from 'react';
import { HERO_ENTER_GRID_SHELL, HERO_MEAL_ROTATE_MS, HERO_MEAL_SLIDES } from './constants';
import { HeroBetweenCardsArrow } from './hero-between-cards-arrow';
import HeroResultReadout from './hero-result-readout';
import HeroUploadColumn from './hero-upload-column';

export function HeroMealStage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setIndex((current) => (current + 1) % HERO_MEAL_SLIDES.length);
    }, HERO_MEAL_ROTATE_MS);
    return () => window.clearInterval(timerId);
  }, []);

  const meal = HERO_MEAL_SLIDES[index];

  if (meal == null) {
    return null;
  }

  return (
    <div className={HERO_ENTER_GRID_SHELL}>
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
