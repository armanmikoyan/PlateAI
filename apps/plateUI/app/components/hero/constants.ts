import type { LucideIcon } from 'lucide-react';
import {
  Battery,
  Beef,
  Beaker,
  Candy,
  Donut,
  Droplet,
  Drumstick,
  Fish,
  Flame,
  LeafyGreen,
  Salad,
  Sprout,
  Wheat,
} from 'lucide-react';

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

export const HERO = {
  HEADING: 'Meal planning that respects your calories and your time.',
  SUBHEAD:
    "Upload a shot of your food, see today's calories and macros in seconds, and adjust the rest of your day—without manual logging.",
  UPLOAD_IMAGE_SIZES: '(max-width: 1024px) 92vw, 46vw',
  CTA: 'Snap a plate',
  CTA_HREF: '/snap',
  CTA_HINT: 'One photo. The numbers land in seconds.',
  MOCK_MEAL_LINE: 'Detected meal',
  MOCK_CONFIDENCE: 'High confidence',
  NUTRIENTS_SECTION_LABEL: 'Nutrition breakdown',
  NUTRIENTS_SCOPE_NOTE: 'Estimated from your upload (demo numbers).',
  CALORIES_STAT_LABEL: 'Calories',
  CALORIES_UNIT: 'kcal',
  PROTEIN_STAT_LABEL: 'Protein',
  PROTEIN_UNIT: 'g',
  CARBS_STAT_LABEL: 'Carbs',
  CARBS_UNIT: 'g',
  FAT_STAT_LABEL: 'Fat',
  FAT_UNIT: 'g',
  FIBER_STAT_LABEL: 'Fiber',
  FIBER_UNIT: 'g',
  SAT_FAT_LABEL: 'Sat. fat',
  SAT_FAT_UNIT: 'g',
  SUGAR_LABEL: 'Sugar',
  SUGAR_UNIT: 'g',
  SODIUM_LABEL: 'Sodium',
  SODIUM_UNIT: 'mg',
  POTASSIUM_LABEL: 'Potassium',
  POTASSIUM_UNIT: 'mg',
} as const;

export const HERO_MEAL_ROTATE_MS = 15000 as const;
export const HERO_MEAL_PHOTO_CROSSFADE_S = 0.8 as const;
export const HERO_MEAL_KEN_BURNS_FROM = 1.06 as const;
export const HERO_MEAL_KEN_BURNS_TO = 1.18 as const;
export const HERO_MEAL_COPY_SWAP_S = 0.45 as const;

/** Append next to tw-animate `animate-in` for `prefers-reduced-motion`. */
export const HERO_ENTER_MOTION_REDUCE =
  'motion-reduce:animate-none! motion-reduce:opacity-100! motion-reduce:transform-none! motion-reduce:filter-none!' as const;

/** Shared Tailwind for typewriter carets under reduced motion. */
export const HERO_TYPEWRITER_CARET_REDUCE_CLASS =
  'motion-reduce:animate-none! motion-reduce:opacity-65!' as const;

export const HERO_INTRO_TYPE_START_MS = 380 as const;

/** Extra `|` marks after the blinking caret; staggered animation reads as a left→right sweep. */
export const HERO_INTRO_CARET_ECHO_DELAY_CLASS = [
  'delay-0',
  'delay-[110ms]',
  'delay-[220ms]',
  'delay-[330ms]',
] as const;

export const HERO_INTRO_LINES = [
  {
    KEY: 'h',
    EL: 'h1',
    ID: 'hero-heading',
    SHELL:
      'text-content font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl',
    CARET: 'animate-caret-blink text-content-muted inline-block align-baseline font-light',
    TEXT: HERO.HEADING,
    MS: 26,
  },
  {
    KEY: 's',
    EL: 'p',
    ID: undefined,
    SHELL: 'text-content-muted mt-3 max-w-3xl text-base/relaxed sm:text-lg',
    CARET: 'animate-caret-blink text-content-muted/80 inline-block align-baseline font-light',
    TEXT: HERO.SUBHEAD,
    MS: 11,
  },
] as const;

export type HeroIntroLineKey = (typeof HERO_INTRO_LINES)[number]['KEY'];

/** Upload | arrow | result from `md` up; stacked on small screens. */
export const HERO_ENTER_GRID_SHELL =
  'relative grid w-full min-w-0 grid-cols-1 items-stretch gap-5 [&>*]:min-w-0 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8' as const;

export const HERO_ENTER_SHELL_BLOCKS = [
  {
    ID: 'intro',
    SHELL: 'animate-in fade-in fill-mode-both max-w-5xl duration-1000 ease-out',
  },
  {
    ID: 'grid',
    SHELL:
      'animate-in fade-in fill-mode-both mt-8 max-lg:slide-in-from-bottom-4 delay-200 duration-700 ease-out sm:mt-10 md:mt-10 lg:mt-10',
  },
] as const;

export const HERO_CALORIES_TILE: HeroStatTileChrome = {
  ICON: Flame,
  LABEL: HERO.CALORIES_STAT_LABEL,
  UNIT: HERO.CALORIES_UNIT,
  ICON_CLASS: 'text-accent-mid',
  ICON_BG_CLASS: 'bg-accent/18',
};

export const HERO_NUTRIENT_METRIC_ROWS: readonly HeroNutrientMetricRow[] = [
  {
    KEY: 'PROTEIN',
    ICON: Beef,
    LABEL: HERO.PROTEIN_STAT_LABEL,
    UNIT: HERO.PROTEIN_UNIT,
    ICON_CLASS: 'text-macro-protein/95',
    ICON_BG_CLASS: 'bg-macro-protein/12 ring-1 ring-macro-protein/15',
  },
  {
    KEY: 'CARBS',
    ICON: Wheat,
    LABEL: HERO.CARBS_STAT_LABEL,
    UNIT: HERO.CARBS_UNIT,
    ICON_CLASS: 'text-accent-soft/90',
    ICON_BG_CLASS: 'bg-accent/10 ring-1 ring-accent/12',
  },
  {
    KEY: 'FAT',
    ICON: Droplet,
    LABEL: HERO.FAT_STAT_LABEL,
    UNIT: HERO.FAT_UNIT,
    ICON_CLASS: 'text-macro-fat/90',
    ICON_BG_CLASS: 'bg-macro-fat-strong/12 ring-1 ring-macro-fat-strong/15',
  },
  {
    KEY: 'FIBER',
    ICON: Sprout,
    LABEL: HERO.FIBER_STAT_LABEL,
    UNIT: HERO.FIBER_UNIT,
    ICON_CLASS: 'text-positive/95',
    ICON_BG_CLASS: 'bg-positive/12 ring-1 ring-positive/15',
  },
  {
    KEY: 'SAT_FAT',
    ICON: Donut,
    LABEL: HERO.SAT_FAT_LABEL,
    UNIT: HERO.SAT_FAT_UNIT,
    ICON_CLASS: 'text-macro-sat/85',
    ICON_BG_CLASS: 'bg-macro-sat/10 ring-1 ring-macro-sat/12',
  },
  {
    KEY: 'SUGAR',
    ICON: Candy,
    LABEL: HERO.SUGAR_LABEL,
    UNIT: HERO.SUGAR_UNIT,
    ICON_CLASS: 'text-macro-sugar/90',
    ICON_BG_CLASS: 'bg-macro-sugar/10 ring-1 ring-macro-sugar/12',
  },
  {
    KEY: 'SODIUM',
    ICON: Beaker,
    LABEL: HERO.SODIUM_LABEL,
    UNIT: HERO.SODIUM_UNIT,
    ICON_CLASS: 'text-macro-sodium/90',
    ICON_BG_CLASS: 'bg-macro-sodium/12 ring-1 ring-macro-sodium/15',
  },
  {
    KEY: 'POTASSIUM',
    ICON: Battery,
    LABEL: HERO.POTASSIUM_LABEL,
    UNIT: HERO.POTASSIUM_UNIT,
    ICON_CLASS: 'text-macro-potassium/85',
    ICON_BG_CLASS: 'bg-macro-potassium/10 ring-1 ring-macro-potassium/12',
  },
];

export const HERO_MEAL_SLIDES: readonly HeroMealSlide[] = [
  {
    KEY: 'steak',
    IMAGE_SRC: '/images/hero-meal.png',
    IMAGE_ALT: 'Grilled steak with asparagus, peppers, and tomatoes on a dark plate',
    NAME: 'Grilled steak plate',
    CHIPS: [
      { ICON: Beef, ICON_CLASS: 'text-macro-protein/95', TEXT: 'Steak' },
      { ICON: LeafyGreen, ICON_CLASS: 'text-positive/90', TEXT: 'Asparagus' },
      { ICON: Wheat, ICON_CLASS: 'text-content-muted/90', TEXT: 'Grilled veg' },
    ],
    CALORIES: '740',
    MACROS: {
      PROTEIN: '52',
      CARBS: '18',
      FAT: '46',
      FIBER: '6',
      SAT_FAT: '16',
      SUGAR: '8',
      SODIUM: '520',
      POTASSIUM: '980',
    },
  },
  {
    KEY: 'salad',
    IMAGE_SRC: '/images/hero-salad.png',
    IMAGE_ALT: 'Garden salad with cherry tomatoes, cucumber, and peppers in a grey bowl',
    IMAGE_OBJECT_CLASS: 'object-[center_40%]',
    NAME: 'Garden salad bowl',
    CHIPS: [
      { ICON: Salad, ICON_CLASS: 'text-positive/90', TEXT: 'Greens' },
      { ICON: LeafyGreen, ICON_CLASS: 'text-positive/80', TEXT: 'Cucumber' },
      { ICON: Sprout, ICON_CLASS: 'text-macro-protein/80', TEXT: 'Tomato' },
    ],
    CALORIES: '220',
    MACROS: {
      PROTEIN: '8',
      CARBS: '18',
      FAT: '12',
      FIBER: '7',
      SAT_FAT: '2',
      SUGAR: '9',
      SODIUM: '280',
      POTASSIUM: '720',
    },
  },
  {
    KEY: 'fish',
    IMAGE_SRC: '/images/hero-fish.png',
    IMAGE_ALT: 'Grilled salmon with mashed potatoes, asparagus, and roasted vegetables',
    NAME: 'Salmon mash bowl',
    CHIPS: [
      { ICON: Fish, ICON_CLASS: 'text-macro-fat-strong/90', TEXT: 'Salmon' },
      { ICON: LeafyGreen, ICON_CLASS: 'text-positive/90', TEXT: 'Asparagus' },
      { ICON: Wheat, ICON_CLASS: 'text-accent-soft/90', TEXT: 'Sweet potato' },
    ],
    CALORIES: '620',
    MACROS: {
      PROTEIN: '38',
      CARBS: '42',
      FAT: '24',
      FIBER: '8',
      SAT_FAT: '5',
      SUGAR: '9',
      SODIUM: '480',
      POTASSIUM: '890',
    },
  },
  {
    KEY: 'chicken',
    IMAGE_SRC: '/images/hero-stake.png',
    IMAGE_ALT: 'Grilled chicken quinoa bowl with avocado, greens, and yogurt sauce',
    NAME: 'Chicken quinoa bowl',
    CHIPS: [
      { ICON: Drumstick, ICON_CLASS: 'text-macro-protein/95', TEXT: 'Chicken' },
      { ICON: Wheat, ICON_CLASS: 'text-accent-soft/90', TEXT: 'Quinoa' },
      { ICON: LeafyGreen, ICON_CLASS: 'text-positive/90', TEXT: 'Avocado' },
    ],
    CALORIES: '560',
    MACROS: {
      PROTEIN: '44',
      CARBS: '38',
      FAT: '22',
      FIBER: '9',
      SAT_FAT: '4',
      SUGAR: '6',
      SODIUM: '410',
      POTASSIUM: '850',
    },
  },
];
