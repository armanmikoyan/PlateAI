import type { LucideIcon } from 'lucide-react';
import { Camera, LineChart, ListChecks, Users } from 'lucide-react';

export const FEATURES_SECTION = {
  EYEBROW: 'Features',
  TITLE: 'Everything you wish manual logging did',
  SUBTITLE:
    'Snap a photo, get your numbers, see how the rest of the day fits. No spreadsheets, no guesswork.',
} as const;

export type FeatureCardRow = Readonly<{
  KEY: string;
  ICON: LucideIcon;
  TITLE: string;
  BODY: string;
  ICON_SHELL: string;
}>;

export const FEATURE_CARD_ROWS: readonly FeatureCardRow[] = [
  {
    KEY: 'photo',
    ICON: Camera,
    TITLE: 'Photo-first analysis',
    BODY: 'Snap a plate and get calories, protein, carbs, and fat in seconds—no scales, no barcodes, no manual entry.',
    ICON_SHELL:
      'bg-macro-fat-strong/12 text-macro-fat-strong ring-1 ring-macro-fat-strong/20',
  },
  {
    KEY: 'context',
    ICON: LineChart,
    TITLE: 'Day context at a glance',
    BODY: 'See what you have already eaten and what is left for the day—so dinner and snacks stay inside the plan.',
    ICON_SHELL: 'bg-macro-protein/10 text-macro-protein ring-1 ring-macro-protein/18',
  },
  {
    KEY: 'list',
    ICON: ListChecks,
    TITLE: 'Shopping lists from meals',
    BODY: 'Turn any meal into a shopping list of ingredients you still need—without duplicating staples you already have.',
    ICON_SHELL: 'bg-positive/12 text-positive ring-1 ring-positive/20',
  },
  {
    KEY: 'household',
    ICON: Users,
    TITLE: 'Built for individuals',
    BODY: 'Your targets, your profile, your data. One plan built around how you eat—not a one-size-fits-all template.',
    ICON_SHELL: 'bg-accent/12 text-accent-mid ring-1 ring-accent/22',
  },
];
