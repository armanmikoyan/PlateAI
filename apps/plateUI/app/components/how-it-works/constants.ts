import { CheckCheck, Camera, Sparkles } from 'lucide-react';
import type { HowItWorksStepRow } from './types';

export type { HowItWorksStepRow } from './types';

export const HOW_IT_WORKS = {
  EYEBROW: 'How it works',
  TITLE: 'From photo to numbers in three steps',
  SUBTITLE:
    'Point your phone at the plate. PlateAI reads the calories and macros, then shows how the rest of your day can still fit your targets.',
} as const;

export const HOW_IT_WORKS_STEPS: readonly HowItWorksStepRow[] = [
  {
    KEY: 'snap',
    STEP: '01',
    ICON: Camera,
    TITLE: 'Snap your meal',
    BODY: 'One clear photo of the plate is enough—no weighing, no barcode scanning.',
    ICON_SHELL: 'bg-surface-raised text-macro-fat-strong ring-1 ring-macro-fat-strong/25',
    NODE_SHELL: 'ring-macro-fat-strong/40 bg-surface-overlay text-macro-fat-strong',
  },
  {
    KEY: 'read',
    STEP: '02',
    ICON: Sparkles,
    TITLE: 'Most advanced AI models analyze it',
    BODY: 'Our most advanced models read every ingredient and estimate its calories and macros in seconds.',
    ICON_SHELL: 'bg-surface-raised text-accent-mid ring-1 ring-accent/25',
    NODE_SHELL: 'ring-accent/40 bg-surface-overlay text-accent-mid',
  },
  {
    KEY: 'numbers',
    STEP: '03',
    ICON: CheckCheck,
    TITLE: 'Your numbers, instantly',
    BODY: 'Calories, protein, carbs, and fat appear in seconds—clear numbers you can plan around.',
    ICON_SHELL: 'bg-surface-raised text-positive ring-1 ring-positive/20',
    NODE_SHELL: 'ring-positive/40 bg-surface-overlay text-positive',
  },
];
