import { Camera, Flame, LineChart, Users } from 'lucide-react';
import type { FeatureDemoGallerySlide, FeatureDemoRow } from './types';

export type { FeatureDemoRow } from './types';

export const FEATURES_SECTION = {
  EYEBROW: "Why it's different",
  TITLE: 'Log less. Know more.',
  SUBTITLE:
    'Snap a plate and PlateAI fills in the calories, protein, carbs, and fat — then keeps every day — and the whole week — on plan.',
} as const;

export const FEATURE_DEMO_TIMING = {
  ENTRY_S: 0.55,
  STAGGER_S: 0.09,
  CHIP_DELAY_S: 0.55,
  CHIP_S: 0.36,
  BAR_S: 0.8,
  DETECT_S: 3.4,
  DETECT_STAGGER_S: 0.25,
  DETECT_REPEAT_DELAY_S: 0.6,
} as const;

export const FEATURE_DEMO_ROWS: readonly FeatureDemoRow[] = [
  {
    KEY: 'photo',
    ICON: Camera,
    TITLE: 'Photo-first analysis',
    BODY: 'One photo in, calories, protein, carbs, and fat out — no scales, no barcodes.',
    ACCENT_TEXT: 'text-cta',
    ACCENT_SHELL: 'bg-cta/15 text-cta ring-1 ring-cta/25',
    ACCENT_HEX: '#f0c400',
  },
  {
    KEY: 'context',
    ICON: LineChart,
    TITLE: 'Day context at a glance',
    BODY: 'See what you have already eaten and exactly what the rest of the day still has room for.',
    ACCENT_TEXT: 'text-macro-protein',
    ACCENT_SHELL: 'bg-macro-protein/15 text-macro-protein ring-1 ring-macro-protein/25',
    ACCENT_HEX: '#fb7185',
  },
  {
    KEY: 'progress',
    ICON: Flame,
    TITLE: 'Streaks that stick',
    BODY: 'A quiet weekly rhythm — a few plates logged and the streak does the rest.',
    ACCENT_TEXT: 'text-macro-fat',
    ACCENT_SHELL: 'bg-macro-fat/15 text-macro-fat ring-1 ring-macro-fat/25',
    ACCENT_HEX: '#7dd3fc',
  },
  {
    KEY: 'profiles',
    ICON: Users,
    TITLE: 'Built for individuals',
    BODY: 'Targets, profile, and history centered on you — never a one-size-fits-all template.',
    ACCENT_TEXT: 'text-accent-mid',
    ACCENT_SHELL: 'bg-accent/12 text-accent-mid ring-1 ring-accent/22',
    ACCENT_HEX: '#fbbf24',
  },
] as const;

export const FEATURE_DEMO_GALLERY: readonly FeatureDemoGallerySlide[] = [
  {
    KEY: 'salad',
    IMAGE_SRC: '/images/hero-salad.png',
    IMAGE_ALT: 'Garden salad with tomato, onion, and cucumber photographed directly above',
    NAME: 'Garden salad',
    CHIPS: [
      { LABEL: 'Energy', VALUE: '254 kcal' },
      { LABEL: 'Protein', VALUE: '9 g' },
      { LABEL: 'Carbs', VALUE: '22 g' },
      { LABEL: 'Fat', VALUE: '14 g' },
    ],
    BOXES: [
      {
        KEY: 'tomato',
        LABEL: 'Tomato',
        LEFT_PCT: 20,
        TOP_PCT: 34,
        WIDTH_PCT: 38,
        HEIGHT_PCT: 38,
        ACCENT: '#f0c400',
      },
      {
        KEY: 'onion',
        LABEL: 'Onion',
        LEFT_PCT: 58,
        TOP_PCT: 46,
        WIDTH_PCT: 28,
        HEIGHT_PCT: 24,
        ACCENT: '#fb7185',
      },
      {
        KEY: 'cucumber',
        LABEL: 'Cucumber',
        LEFT_PCT: 16,
        TOP_PCT: 8,
        WIDTH_PCT: 26,
        HEIGHT_PCT: 20,
        ACCENT: '#7dd3fc',
      },
    ],
  },
  {
    KEY: 'steak',
    IMAGE_SRC: '/images/hero-meal.png',
    IMAGE_ALT:
      'Beef steak with rosemary mushrooms, tomato, asparagus, and zucchini photographed directly above',
    NAME: 'Beef steak',
    CHIPS: [
      { LABEL: 'Energy', VALUE: '598 kcal' },
      { LABEL: 'Protein', VALUE: '51 g' },
      { LABEL: 'Carbs', VALUE: '16 g' },
      { LABEL: 'Fat', VALUE: '33 g' },
    ],
    BOXES: [
      {
        KEY: 'steak',
        LABEL: 'Steak',
        LEFT_PCT: 30,
        TOP_PCT: 36,
        WIDTH_PCT: 42,
        HEIGHT_PCT: 40,
        ACCENT: '#f0c400',
      },
      {
        KEY: 'veg',
        LABEL: 'Asparagus',
        LEFT_PCT: 60,
        TOP_PCT: 48,
        WIDTH_PCT: 28,
        HEIGHT_PCT: 26,
        ACCENT: '#fb7185',
      },
      {
        KEY: 'mushroom',
        LABEL: 'Mushrooms',
        LEFT_PCT: 18,
        TOP_PCT: 10,
        WIDTH_PCT: 28,
        HEIGHT_PCT: 22,
        ACCENT: '#7dd3fc',
      },
    ],
  },
  {
    KEY: 'salmon',
    IMAGE_SRC: '/images/hero-fish.png',
    IMAGE_ALT: 'Grilled salmon fillet with mash and potatoes photographed directly above',
    NAME: 'Grilled salmon',
    CHIPS: [
      { LABEL: 'Energy', VALUE: '486 kcal' },
      { LABEL: 'Protein', VALUE: '38 g' },
      { LABEL: 'Carbs', VALUE: '34 g' },
      { LABEL: 'Fat', VALUE: '23 g' },
    ],
    BOXES: [
      {
        KEY: 'filet',
        LABEL: 'Salmon',
        LEFT_PCT: 28,
        TOP_PCT: 38,
        WIDTH_PCT: 44,
        HEIGHT_PCT: 34,
        ACCENT: '#f0c400',
      },
      {
        KEY: 'mash',
        LABEL: 'Mash',
        LEFT_PCT: 18,
        TOP_PCT: 46,
        WIDTH_PCT: 26,
        HEIGHT_PCT: 24,
        ACCENT: '#7dd3fc',
      },
      {
        KEY: 'potato',
        LABEL: 'Potatoes',
        LEFT_PCT: 60,
        TOP_PCT: 12,
        WIDTH_PCT: 24,
        HEIGHT_PCT: 18,
        ACCENT: '#fb7185',
      },
      {
        KEY: 'carrot',
        LABEL: 'Carrot',
        LEFT_PCT: 52,
        TOP_PCT: 62,
        WIDTH_PCT: 30,
        HEIGHT_PCT: 22,
        ACCENT: '#f0c400',
      },
    ],
  },
  {
    KEY: 'chicken',
    IMAGE_SRC: '/images/hero-stake.png',
    IMAGE_ALT: 'Chicken and avocado bowl with onion, cucumber, and greens photographed directly above',
    NAME: 'Chicken & avocado',
    CHIPS: [
      { LABEL: 'Energy', VALUE: '542 kcal' },
      { LABEL: 'Protein', VALUE: '47 g' },
      { LABEL: 'Carbs', VALUE: '26 g' },
      { LABEL: 'Fat', VALUE: '30 g' },
    ],
    BOXES: [
      {
        KEY: 'chicken',
        LABEL: 'Chicken',
        LEFT_PCT: 30,
        TOP_PCT: 36,
        WIDTH_PCT: 40,
        HEIGHT_PCT: 40,
        ACCENT: '#f0c400',
      },
      {
        KEY: 'avocado',
        LABEL: 'Avocado',
        LEFT_PCT: 62,
        TOP_PCT: 14,
        WIDTH_PCT: 26,
        HEIGHT_PCT: 20,
        ACCENT: '#7dd3fc',
      },
      {
        KEY: 'veg',
        LABEL: 'Tomato',
        LEFT_PCT: 20,
        TOP_PCT: 8,
        WIDTH_PCT: 24,
        HEIGHT_PCT: 18,
        ACCENT: '#fb7185',
      },
    ],
  },
] as const;

export const FEATURE_DEMO_PARTICLES = {
  COLOR: 'rgba(110, 231, 183, 0.55)',
  GLOW: '0 0 12px rgba(110, 231, 183, 0.35)',
} as const;

export const FEATURE_DEMO_DETECTIONS = {
  STATUS_LABEL: 'AI analysis',
  BOXES: [
    {
      KEY: 'greens',
      LABEL: 'Greens',
      LEFT_PCT: 20,
      TOP_PCT: 34,
      WIDTH_PCT: 38,
      HEIGHT_PCT: 38,
      ACCENT: '#f0c400',
    },
    {
      KEY: 'veg',
      LABEL: 'Tomato',
      LEFT_PCT: 58,
      TOP_PCT: 46,
      WIDTH_PCT: 28,
      HEIGHT_PCT: 24,
      ACCENT: '#fb7185',
    },
    {
      KEY: 'topping',
      LABEL: 'Seeds',
      LEFT_PCT: 16,
      TOP_PCT: 8,
      WIDTH_PCT: 26,
      HEIGHT_PCT: 20,
      ACCENT: '#7dd3fc',
    },
  ],
} as const;

export const FEATURE_DEMO_FINISHES = [
  {
    KEY: 'herbs',
    LABEL: 'Fresh herbs',
    LEFT_PCT: 5,
    TOP_PCT: 24,
    WIDTH_PCT: 20,
    HEIGHT_PCT: 15,
    ACCENT: '#4ade80',
  },
  { KEY: 'salt', LABEL: 'Salt', LEFT_PCT: 3, TOP_PCT: 58, WIDTH_PCT: 16, HEIGHT_PCT: 13, ACCENT: '#e5e7eb' },
  {
    KEY: 'seasoning',
    LABEL: 'Seasoning',
    LEFT_PCT: 66,
    TOP_PCT: 26,
    WIDTH_PCT: 26,
    HEIGHT_PCT: 15,
    ACCENT: '#fbbf24',
  },
  {
    KEY: 'oil',
    LABEL: 'Olive oil',
    LEFT_PCT: 74,
    TOP_PCT: 78,
    WIDTH_PCT: 24,
    HEIGHT_PCT: 16,
    ACCENT: '#f0c400',
  },
  {
    KEY: 'pepper',
    LABEL: 'Black pepper',
    LEFT_PCT: 30,
    TOP_PCT: 76,
    WIDTH_PCT: 20,
    HEIGHT_PCT: 13,
    ACCENT: '#c084fc',
  },
] as const;

export const FEATURE_DEMO_CONTEXT = {
  HEADER: 'Today at a glance',
  TARGET_LABEL: 'Daily target',
  TARGET_VALUE: '1,900 kcal',
  LEFT_LABEL: 'Left for the rest of the day',
  LEFT_VALUE: '1,142 kcal',
  BARS: [
    { KEY: 'protein', LABEL: 'Protein', VALUE: '82 g', PCT: 62, COLOR: '#fb7185' },
    { KEY: 'carbs', LABEL: 'Carbs', VALUE: '148 g', PCT: 54, COLOR: '#f0c400' },
    { KEY: 'fat', LABEL: 'Fat', VALUE: '61 g', PCT: 40, COLOR: '#7dd3fc' },
  ],
} as const;

export const FEATURE_DEMO_PROGRESS = {
  LABEL: 'This week',
  VALUE: '4 of 5 plates',
  HEADER: 'Habit check',
  RING_PCT: 80,
  RING_VALUE: '4',
  RING_SUFFIX: 'day streak',
  DAYS: [
    { KEY: 'mon', DAY: 'M', LOGGED: true },
    { KEY: 'tue', DAY: 'T', LOGGED: true },
    { KEY: 'wed', DAY: 'W', LOGGED: true },
    { KEY: 'thu', DAY: 'T', LOGGED: true },
    { KEY: 'fri', DAY: 'F', LOGGED: false },
    { KEY: 'sat', DAY: 'S', LOGGED: false },
    { KEY: 'sun', DAY: 'S', LOGGED: false },
  ],
  NOTE: 'Small rhythm, big results — the streak keeps you coming back.',
} as const;

export const FEATURE_DEMO_PROFILES = {
  HEADER: 'Your targets, your data',
  AVATAR_LABEL: 'Your profile',
  TARGETS: [
    { KEY: 'kcal', LABEL: 'Daily target', VALUE: '1,900 kcal' },
    { KEY: 'split', LABEL: 'Macro split', VALUE: 'P 40 · C 30 · F 30' },
    { KEY: 'goal', LABEL: 'Goal', VALUE: 'Recomp' },
  ],
  NOTE: 'Set once — PlateAI remembers exactly how you eat.',
} as const;
