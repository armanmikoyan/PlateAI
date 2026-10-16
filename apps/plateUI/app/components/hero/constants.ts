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
import type { HeroStatTileChrome, HeroNutrientMetricRow, HeroMealSlide } from './types';

export type {
  HeroMockMealChipRow,
  HeroNutrientMetricKey,
  HeroMealMacros,
  HeroStatTileChrome,
  HeroNutrientMetricRow,
  HeroStatTileModel,
  HeroNutrientTileRowModel,
  HeroMealSlide,
  HeroMealPhotoProps,
  HeroKenBurnsLayerProps,
  HeroCycleProgressBarProps,
  HeroUploadColumnProps,
  HeroResultReadoutProps,
  HeroTiltProps,
  HeroMagneticProps,
} from './types';

export const HERO = {
  HEADING: 'Snap your plate. Get your numbers.',
  SUBHEAD:
    'PlateAI turns one photo into calories, protein, carbs, and fat—and shows how the rest of the day fits. No scales, no manual logging, no guesswork.',
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

/** Heading variants flipped through the hero; first entry is the primary copy. */
export const HERO_HEADING_VARIANTS: readonly string[] = [
  HERO.HEADING,
  'One photo. Your whole meal, measured.',
  'See the calories hiding in your plate.',
  'Point your camera. Know every macro.',
];

/** Subhead variants flipped through the hero; first entry is the primary copy. */
export const HERO_SUBHEAD_VARIANTS: readonly string[] = [
  HERO.SUBHEAD,
  'One photo becomes calories, protein, carbs, and fat—instantly. See how your next meal fits before the day gets away from you.',
  'Point. Snap. Know. PlateAI reads your plate and breaks down the macros—so you can stop guessing and start hitting your numbers.',
  'No scales. No logging. Just a photo. PlateAI estimates calories and macros in seconds and shows how the rest of your day stacks up.',
];

export const HERO_FLIP_ROTATE_MS = 5000 as const;
export const HERO_FLIP_S = 0.55 as const;
export const HERO_FLIP_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Cursor spotlight over the hero: a broad, very soft radial glow that trails the
 * pointer like a flashlight sweeping the plate. Size lives here because the JS
 * halves it to center the disc under the cursor. Alpha stays low — the section sits
 * over a near-black video — and the disc is purely additive-looking light, so there
 * is no visible ring or edge.
 */
export const HERO_SPOTLIGHT_SIZE_PX = 560 as const;
export const HERO_SPOTLIGHT_BG =
  'radial-gradient(circle, rgb(255 255 255 / 0.1) 0%, rgb(255 255 255 / 0.04) 38%, rgb(255 255 255 / 0) 66%)' as const;
export const HERO_SPOTLIGHT_CLASS =
  'rounded-full transition-opacity duration-700 will-change-transform' as const;

/** Max degrees the cards rotate toward the cursor, and the spring that eases there. */
export const HERO_TILT_MAX_DEG = 8 as const;
export const HERO_TILT_SPRING = { damping: 18, stiffness: 140, mass: 0.4 } as const;
/** Cards sit at slightly different depths so the tilt reads as parallax, not a slab. */
export const HERO_TILT_PHOTO_DEPTH = 1 as const;
export const HERO_TILT_RESULT_DEPTH = 0.62 as const;
export const HERO_TILT_SHELL = 'transform-gpu will-change-transform [transform-style:preserve-3d]' as const;

/** Magnetic pull on the CTA: max px it leans toward the cursor, and ease. */
export const HERO_MAGNETIC_STRENGTH_PX = 14 as const;
export const HERO_MAGNETIC_SPRING = { damping: 20, stiffness: 180, mass: 0.5 } as const;

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

export const HERO_PROTEIN_TILE: HeroStatTileChrome = {
  ICON: Beef,
  LABEL: HERO.PROTEIN_STAT_LABEL,
  UNIT: HERO.PROTEIN_UNIT,
  ICON_CLASS: 'text-macro-protein/95',
  ICON_BG_CLASS: 'bg-macro-protein/12 ring-1 ring-macro-protein/15',
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
