'use client';

import { useCallback, useState } from 'react';
import {
  HERO_ENTER_GRID_SHELL,
  HERO_MEAL_SLIDES,
  HERO_TILT_PHOTO_DEPTH,
  HERO_TILT_RESULT_DEPTH,
} from './constants';
import { HeroBetweenCardsArrow } from './hero-between-cards-arrow';
import HeroResultReadout from './hero-result-readout';
import { HeroTilt } from './hero-tilt';
import HeroUploadColumn from './hero-upload-column';

export function HeroMealStage() {
  const [index, setIndex] = useState(0);

  const advance = useCallback(() => {
    setIndex((current) => (current + 1) % HERO_MEAL_SLIDES.length);
  }, []);

  const meal = HERO_MEAL_SLIDES[index];

  if (meal == null) {
    return null;
  }

  return (
    <div className={HERO_ENTER_GRID_SHELL}>
      <HeroTilt className="relative z-0 flex w-full min-w-0 lg:self-start" depth={HERO_TILT_PHOTO_DEPTH}>
        <HeroUploadColumn meal={meal} onCycleComplete={advance} />
      </HeroTilt>
      <HeroBetweenCardsArrow />
      <HeroTilt className="relative z-0 flex w-full min-w-0" depth={HERO_TILT_RESULT_DEPTH}>
        <HeroResultReadout meal={meal} />
      </HeroTilt>
    </div>
  );
}
