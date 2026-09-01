'use client';

import { CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { Badge } from '@/app/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';
import { cn } from '@/app/utils/cn';

import { HERO, HERO_ENTER_MOTION_REDUCE, type HeroMealSlide } from './constants';
import { HeroBlurSwap } from './hero-blur-swap';
import { HeroMealPhoto } from './hero-meal-photo';
import { HeroNutrientTile } from './hero-nutrient-tile';
import { heroCaloriesTileForMeal, heroNutrientTilesForMeal } from './utils';

type HeroResultReadoutProps = Readonly<{
  meal: HeroMealSlide;
}>;

export default function HeroResultReadout({ meal }: HeroResultReadoutProps) {
  const caloriesTile = heroCaloriesTileForMeal(meal);
  const nutrientTiles = heroNutrientTilesForMeal(meal);
  const reduceMotion = useReducedMotion();

  return (
    <Card
      className={cn(
        '@container/result animate-in fade-in slide-in-from-right-10 zoom-in-95 fill-mode-both flex w-full flex-col delay-300 duration-1000 ease-out',
        HERO_ENTER_MOTION_REDUCE,
      )}
      role="region"
      aria-labelledby="hero-result-title"
    >
      <CardContent className="flex flex-col gap-3 sm:gap-4">
        <Card size="sm">
          <CardHeader>
            <div className="flex min-w-0 items-start gap-3">
              <span className="relative size-14 shrink-0 overflow-hidden rounded-lg sm:size-16">
                <HeroMealPhoto meal={meal} sizes="64px" />
              </span>
              <div className="min-w-0 flex-1">
                <Badge variant="ghost">{HERO.MOCK_MEAL_LINE}</Badge>
                <HeroBlurSwap swapKey={meal.KEY}>
                  <CardTitle id="hero-result-title">{meal.NAME}</CardTitle>
                </HeroBlurSwap>
                <CardDescription className="flex items-center gap-1.5">
                  <CheckCircle2 className="text-positive" aria-hidden />
                  {HERO.MOCK_CONFIDENCE}
                </CardDescription>
              </div>
            </div>
            <HeroBlurSwap swapKey={meal.KEY} className="flex flex-wrap gap-2 pt-1">
              {meal.CHIPS.map((row, index) => {
                const ChipIcon = row.ICON;
                return (
                  <motion.div
                    key={row.TEXT}
                    initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.06 + index * 0.08, duration: 0.35, ease: 'easeOut' }}
                  >
                    <Badge variant="outline">
                      <ChipIcon className={row.ICON_CLASS} aria-hidden />
                      {row.TEXT}
                    </Badge>
                  </motion.div>
                );
              })}
            </HeroBlurSwap>
          </CardHeader>
        </Card>

        <div className="flex flex-col gap-2">
          <div>
            <p className="font-heading text-sm font-medium tracking-tight">
              {HERO.NUTRIENTS_SECTION_LABEL}
            </p>
            <p className="text-muted-foreground mt-0.5 text-xs/relaxed">
              {HERO.NUTRIENTS_SCOPE_NOTE}
            </p>
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-1.5 *:min-w-0 md:gap-2 @xl/result:grid-cols-4">
            <div className="col-span-2 @xl/result:col-span-4">
              <HeroNutrientTile {...caloriesTile} />
            </div>
            {nutrientTiles.map((row) => (
              <HeroNutrientTile key={row.LABEL} {...row} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
