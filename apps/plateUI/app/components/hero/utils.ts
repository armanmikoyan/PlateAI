import type { HeroMealSlide, HeroNutrientTileRowModel, HeroStatTileModel } from './constants';
import { HERO_CALORIES_TILE, HERO_NUTRIENT_METRIC_ROWS } from './constants';

export function heroCaloriesTileForMeal(meal: HeroMealSlide): HeroStatTileModel {
  return {
    ...HERO_CALORIES_TILE,
    VALUE: meal.CALORIES,
  };
}

export function heroNutrientTilesForMeal(meal: HeroMealSlide): readonly HeroNutrientTileRowModel[] {
  return HERO_NUTRIENT_METRIC_ROWS.map((row) => ({
    ...row,
    VALUE: meal.MACROS[row.KEY],
  }));
}
