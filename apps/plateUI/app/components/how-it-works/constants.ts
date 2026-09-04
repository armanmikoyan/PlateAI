import type { LucideIcon } from 'lucide-react';
import { Camera, CalendarDays, Sparkles } from 'lucide-react';

export const HOW_IT_WORKS = {
  EYEBROW: 'How it works',
  TITLE: 'From photo to plan in three steps',
  SUBTITLE:
    'Point your phone at the plate. PlateAI reads the calories and macros, then shows how the rest of your day can still fit your targets.',
} as const;

export type HowItWorksStepRow = Readonly<{
  KEY: string;
  ICON: LucideIcon;
  TITLE: string;
  BODY: string;
  ICON_SHELL: string;
}>;

export const HOW_IT_WORKS_STEPS: readonly HowItWorksStepRow[] = [
  {
    KEY: 'snap',
    ICON: Camera,
    TITLE: 'Snap your meal',
    BODY: 'One clear photo of the plate is enough—no weighing, no barcode scanning.',
    ICON_SHELL:
      'bg-macro-fat-strong/15 text-macro-fat-strong ring-1 ring-macro-fat-strong/25',
  },
  {
    KEY: 'read',
    ICON: Sparkles,
    TITLE: 'Get instant numbers',
    BODY: 'Calories, protein, carbs, and fat surface in seconds so you can decide what to do next.',
    ICON_SHELL: 'bg-accent/15 text-accent-mid ring-1 ring-accent/25',
  },
  {
    KEY: 'plan',
    ICON: CalendarDays,
    TITLE: 'Adjust the rest of the day',
    BODY: 'Same-day totals show what you have left so dinner and snacks stay inside your plan.',
    ICON_SHELL: 'bg-positive/12 text-positive ring-1 ring-positive/20',
  },
];
