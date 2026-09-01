import type { LucideIcon } from 'lucide-react';
import { Image, ListChecks, PieChart, Users } from 'lucide-react';

export const FEATURES_SECTION = {
  EYEBROW: 'Features',
  TITLE: 'Everything you wish manual logging did',
  SUBTITLE:
    'Dense where it matters, quiet everywhere else—so you stay in the meal, not the spreadsheet.',
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
    ICON: Image,
    TITLE: 'Photo-first capture',
    BODY: 'Log with a picture when you do not have weights or barcodes—PlateAI fills in the estimate.',
    ICON_SHELL:
      'bg-macro-fat-strong/12 text-macro-fat-strong ring-1 ring-macro-fat-strong/20',
  },
  {
    KEY: 'macros',
    ICON: PieChart,
    TITLE: 'Macros with context',
    BODY: 'Protein, carbs, fat, and more in one readout tied to what you actually ate today.',
    ICON_SHELL: 'bg-macro-protein/10 text-macro-protein ring-1 ring-macro-protein/18',
  },
  {
    KEY: 'list',
    ICON: ListChecks,
    TITLE: 'Smarter shopping lists',
    BODY: 'Turn meals into ingredients you still need when you want to cook again—without duplicate staples.',
    ICON_SHELL: 'bg-positive/12 text-positive ring-1 ring-positive/20',
  },
  {
    KEY: 'household',
    ICON: Users,
    TITLE: 'Household-ready',
    BODY: 'Shared targets and profiles when you upgrade—so one plan fits more than one appetite.',
    ICON_SHELL: 'bg-accent/12 text-accent-mid ring-1 ring-accent/22',
  },
];
