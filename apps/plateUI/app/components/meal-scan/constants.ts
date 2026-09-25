import type { MealScanDetection } from './types';

export const MEAL_SCAN_SECTION = {
  ID: 'meal-scan',
  EYEBROW: 'AI vision, made visible',
  TITLE: 'Watch PlateAI read your plate',
  SUBTITLE:
    'One photo becomes a living map of ingredients, portions, and macros — before you even log a bite.',
  DETECTED_LABEL: 'Detected ingredients',
  NUTRITION_LABEL: 'Estimated nutrition',
  CALORIES_VALUE: '740',
  CALORIES_UNIT: 'kcal',
  CTA_LABEL: 'Scan your own plate',
  CTA_HREF: '/snap',
} as const;

export const MEAL_SCAN_MEAL = {
  IMAGE_SRC: '/images/hero-meal.png',
  IMAGE_ALT: 'Grilled steak with asparagus, peppers, and tomatoes on a dark plate',
  NAME: 'Grilled steak plate',
  WIDTH: 1536,
  HEIGHT: 1024,
  FRAME_ASPECT: 1.2,
  FRAME_MAX_WIDTH: 'min(100%, calc((100svh - 16rem) * 1.2))',
  RETICLE_RADIUS: 18,
  DOT_RADIUS: 5.5,
} as const;

export const MEAL_SCAN_DIM = {
  TINT: 'bg-black/25',
  GRADIENT: 'bg-linear-to-t from-black/40 via-black/5 to-black/20',
  DARKENED_OPACITY: 1,
  CLEAN_OPACITY: 0,
} as const;

export const MEAL_SCAN_CHIP_CLASS =
  'inline-flex items-center rounded-full border px-[0.8cqw] py-[0.6cqw] text-[clamp(14px,2.5cqw,26px)] leading-none font-bold whitespace-nowrap shadow-md shadow-black/40 backdrop-blur-md';

export const MEAL_SCAN_TIMING = {
  SCAN_DURATION_S: 3.4,
  CALLOUT_ENTRANCE_S: 0.45,
  LABEL_LEAD_S: 0.18,
  DIM_DELAY_S: 1,
  DIM_TRANSITION_S: 0.9,
  SCAN_EASE: [0.22, 1, 0.36, 1] as const,
} as const;

export const MEAL_SCAN_STATUS = {
  IDLE: {
    LABEL: 'Ready',
    DETAIL: 'The analysis will start when this section enters view.',
  },
  RUNNING: {
    LABEL: 'Scanning',
    DETAIL: 'Finding ingredients, portions, and confidence signals.',
  },
  COMPLETE: {
    LABEL: 'Complete',
    DETAIL: 'Here is what PlateAI found in your photo.',
  },
} as const;

export const MEAL_SCAN_DETECTIONS: readonly MealScanDetection[] = [
  {
    KEY: 'steak',
    LABEL: 'Grilled steak',
    DETAIL: '52g protein',
    COLOR: '#fb7185',
    SIDE: 'right',
    TARGET_X: 877.5,
    TARGET_Y: 520,
  },
  {
    KEY: 'asparagus',
    LABEL: 'Asparagus',
    DETAIL: '6g fiber',
    COLOR: '#34d399',
    SIDE: 'left',
    TARGET_X: 1192.5,
    TARGET_Y: 467.5,
  },
  {
    KEY: 'tomatoes',
    LABEL: 'Tomatoes',
    DETAIL: '3g carbs',
    COLOR: '#f87171',
    SIDE: 'top',
    TARGET_X: 332.5,
    TARGET_Y: 387.5,
  },
  {
    KEY: 'peppers',
    LABEL: 'Roasted peppers',
    DETAIL: '7g carbs',
    COLOR: '#fbbf24',
    SIDE: 'left',
    TARGET_X: 305,
    TARGET_Y: 537.5,
  },
  {
    KEY: 'zucchini',
    LABEL: 'Zucchini',
    DETAIL: '3g carbs',
    COLOR: '#84cc16',
    SIDE: 'top',
    TARGET_X: 207.5,
    TARGET_Y: 665,
  },
  {
    KEY: 'red-onion',
    LABEL: 'Red onion',
    DETAIL: '5g carbs',
    COLOR: '#c084fc',
    SIDE: 'bottom',
    TARGET_X: 395,
    TARGET_Y: 712.5,
  },
  {
    KEY: 'mushroom',
    LABEL: 'Mushrooms',
    DETAIL: '2g protein',
    COLOR: '#d6d3d1',
    SIDE: 'top',
    TARGET_X: 597.5,
    TARGET_Y: 787.5,
  },
  {
    KEY: 'rosemary',
    LABEL: 'Rosemary',
    DETAIL: '1g carbs',
    COLOR: '#a3e635',
    SIDE: 'top',
    TARGET_X: 840,
    TARGET_Y: 387.5,
  },
] as const;
