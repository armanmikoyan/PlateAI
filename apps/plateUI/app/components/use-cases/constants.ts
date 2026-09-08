import { Briefcase, Dumbbell, UtensilsCrossed } from 'lucide-react';
import type { UseCaseCardRow } from './types';

export type { UseCaseCardRow } from './types';

export const USE_CASES_SECTION = {
  EYEBROW: 'Use cases',
  TITLE: 'Built for how people actually eat',
  SUBTITLE:
    'Whether you are tracking macros, living out of a suitcase, or feeding a household—PlateAI stays out of the way until you need it.',
} as const;

export const USE_CASE_CARD_ROWS: readonly UseCaseCardRow[] = [
  {
    KEY: 'recomp',
    ICON: Dumbbell,
    TITLE: 'Cut or bulk without the spreadsheet',
    BODY: 'See what is left after every meal so dinner stays inside the plan. Adjust one entry and watch the rest of the day rebalance.',
    ICON_SHELL: 'bg-macro-protein/12 text-macro-protein ring-1 ring-macro-protein/20',
    GLOW_FROM: 'rgba(251,113,133,0.55)',
    GLOW_TO: 'rgba(251,113,133,0.15)',
  },
  {
    KEY: 'busy',
    ICON: Briefcase,
    TITLE: 'Busy weeks, honest logs',
    BODY: 'Photo-first capture keeps streaks alive on travel days, late shifts, and meals where a food scale is not an option.',
    ICON_SHELL: 'bg-accent/12 text-accent-mid ring-1 ring-accent/22',
    GLOW_FROM: 'rgba(251,191,36,0.55)',
    GLOW_TO: 'rgba(251,191,36,0.15)',
  },
  {
    KEY: 'household',
    ICON: UtensilsCrossed,
    TITLE: 'Household meal planning',
    BODY: 'Cook once, log for everyone. Separate profiles and shared targets mean one plan works for the whole table.',
    ICON_SHELL: 'bg-macro-fat-strong/12 text-macro-fat-strong ring-1 ring-macro-fat-strong/20',
    GLOW_FROM: 'rgba(56,189,248,0.55)',
    GLOW_TO: 'rgba(56,189,248,0.15)',
  },
];
