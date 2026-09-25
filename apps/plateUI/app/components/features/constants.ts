import { Camera, Flame, LineChart, Users } from 'lucide-react';
import type { FeatureDemoRow } from './types';

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
  SCAN_S: 1.5,
  CHIP_DELAY_S: 0.55,
  CHIP_S: 0.36,
  BAR_S: 0.8,
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

export const FEATURE_DEMO_PHOTO = {
  IMAGE_SRC: '/images/hero-meal.png',
  IMAGE_ALT: 'Plated meal photographed directly above',
  ENERGY_LABEL: 'Energy',
  CHIPS: [
    { LABEL: 'Energy', VALUE: '742 kcal' },
    { LABEL: 'Protein', VALUE: '48 g' },
    { LABEL: 'Carbs', VALUE: '61 g' },
    { LABEL: 'Fat', VALUE: '29 g' },
  ],
} as const;

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
