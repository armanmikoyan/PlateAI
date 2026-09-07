import type { LucideIcon } from 'lucide-react';

export type HeroMockMealChipRow = Readonly<{
  ICON: LucideIcon;
  ICON_CLASS: string;
  TEXT: string;
}>;

export type HeroNutrientMetricKey =
  | 'PROTEIN'
  | 'CARBS'
  | 'FAT'
  | 'FIBER'
  | 'SAT_FAT'
  | 'SUGAR'
  | 'SODIUM'
  | 'POTASSIUM';

export type HeroMealMacros = Readonly<Record<HeroNutrientMetricKey, string>>;

export type HeroStatTileChrome = Readonly<{
  ICON: LucideIcon;
  LABEL: string;
  UNIT: string;
  ICON_CLASS: string;
  ICON_BG_CLASS: string;
}>;

export type HeroNutrientMetricRow = HeroStatTileChrome &
  Readonly<{
    KEY: HeroNutrientMetricKey;
  }>;

export type HeroStatTileModel = HeroStatTileChrome &
  Readonly<{
    VALUE: string;
  }>;

export type HeroNutrientTileRowModel = HeroNutrientMetricRow &
  Readonly<{
    VALUE: string;
  }>;

export type HeroMealSlide = Readonly<{
  KEY: string;
  IMAGE_SRC: string;
  IMAGE_ALT: string;
  IMAGE_OBJECT_CLASS?: string;
  NAME: string;
  CHIPS: readonly HeroMockMealChipRow[];
  CALORIES: string;
  MACROS: HeroMealMacros;
}>;

import { HERO_INTRO_LINES } from './constants';

export type HeroIntroLineKey = (typeof HERO_INTRO_LINES)[number]['KEY'];

export type HeroNutrientTileProps = HeroStatTileModel;
