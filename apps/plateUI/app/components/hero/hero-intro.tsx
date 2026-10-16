'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { HERO_FLIP_ROTATE_MS, HERO_HEADING_VARIANTS, HERO_SUBHEAD_VARIANTS } from './constants';
import { HeroFlipText } from './hero-flip-text';

export function HeroIntro() {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % HERO_HEADING_VARIANTS.length);
    }, HERO_FLIP_ROTATE_MS);
    return () => clearInterval(id);
  }, [reduceMotion]);

  return (
    <div>
      <h1
        id="hero-heading"
        className="text-content font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
      >
        <HeroFlipText variants={HERO_HEADING_VARIANTS} index={index} />
      </h1>
      <p className="text-content-muted mt-3 max-w-3xl text-base/relaxed sm:text-lg">
        <HeroFlipText variants={HERO_SUBHEAD_VARIANTS} index={index} />
      </p>
    </div>
  );
}
