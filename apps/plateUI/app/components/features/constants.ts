import { Camera, LineChart, ListChecks, Users } from 'lucide-react';
import type { FeatureTileRow } from './types';

export type { FeatureTileRow } from './types';

export const FEATURES_SECTION = {
  EYEBROW: 'Features',
  TITLE: 'Everything you wish manual logging did',
  SUBTITLE:
    'Snap a photo, get your numbers, see how the rest of the day fits. No spreadsheets, no guesswork.',
} as const;

export const FEATURE_TILE_ROWS: readonly FeatureTileRow[] = [
  {
    KEY: 'photo',
    ICON: Camera,
    TITLE: 'Photo-first analysis',
    BODY: 'Snap a plate and get calories, protein, carbs, and fat in seconds—no scales, no barcodes.',
    ICON_SHELL: 'bg-macro-fat-strong/15 text-macro-fat-strong ring-1 ring-macro-fat-strong/25',
    BORDER: 'border-macro-fat-strong/30',
    SPAN: 'sm:col-span-2 lg:col-span-2',
    TILE_SHELL: 'bg-linear-to-b from-macro-fat-strong/12 via-transparent to-transparent',
    FEATURED: true,
  },
  {
    KEY: 'context',
    ICON: LineChart,
    TITLE: 'Day context at a glance',
    BODY: 'See what you have already eaten and what is left for the day—so dinner and snacks stay inside the plan.',
    ICON_SHELL: 'bg-macro-protein/12 text-macro-protein ring-1 ring-macro-protein/20',
    BORDER: 'border-macro-protein/25',
    SPAN: 'lg:col-span-1',
    TILE_SHELL: 'bg-linear-to-b from-macro-protein/10 via-transparent to-transparent',
    FEATURED: false,
  },
  {
    KEY: 'list',
    ICON: ListChecks,
    TITLE: 'Shopping lists from meals',
    BODY: 'Turn any meal into a shopping list of ingredients you still need—without duplicating staples you already have.',
    ICON_SHELL: 'bg-positive/12 text-positive ring-1 ring-positive/20',
    BORDER: 'border-positive/25',
    SPAN: 'lg:col-span-1',
    TILE_SHELL: 'bg-linear-to-b from-positive/10 via-transparent to-transparent',
    FEATURED: false,
  },
  {
    KEY: 'household',
    ICON: Users,
    TITLE: 'Built for individuals',
    BODY: 'Your targets, your profile, your data. One plan built around how you eat—not a one-size-fits-all template.',
    ICON_SHELL: 'bg-accent/12 text-accent-mid ring-1 ring-accent/22',
    BORDER: 'border-accent/28',
    SPAN: 'sm:col-span-2 lg:col-span-2',
    TILE_SHELL: 'bg-linear-to-b from-accent/10 via-transparent to-transparent',
    FEATURED: false,
  },
];
