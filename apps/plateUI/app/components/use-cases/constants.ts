import { Briefcase, Dumbbell, UtensilsCrossed } from 'lucide-react';
import type { UseCaseCardRow } from './types';

export type { UseCaseCardRow } from './types';

export const USE_CASES_SECTION = {
  EYEBROW: 'Made for real life',
  TITLE: 'It meets you at the table',
  SUBTITLE:
    'Dialing in macros, running on empty all week, or cooking for the whole house — one photo keeps every meal on track.',
} as const;

export const USE_CASE_ANIM = {
  MAX_TILT_DEG: 6,
  GLOW_SIZE: 260,
  SHINE_MS: 700,
} as const;

export const USE_CASE_CARD_ROWS: readonly UseCaseCardRow[] = [
  {
    KEY: 'recomp',
    ICON: Dumbbell,
    KICKER: 'Macros',
    TITLE: 'Cut or bulk without the spreadsheet',
    BODY: 'See what is left after every meal so dinner stays inside the plan. Adjust one entry and watch the rest of the day rebalance.',
    ICON_SHELL: 'bg-macro-protein/12 text-macro-protein ring-1 ring-macro-protein/20',
    ACCENT_TEXT: 'text-macro-protein',
    ACCENT_HEX: '#fb7185',
  },
  {
    KEY: 'busy',
    ICON: Briefcase,
    KICKER: 'On the go',
    TITLE: 'Busy weeks, honest logs',
    BODY: 'Photo-first capture keeps streaks alive on travel days, late shifts, and meals where a food scale is not an option.',
    ICON_SHELL: 'bg-accent/12 text-accent-mid ring-1 ring-accent/22',
    ACCENT_TEXT: 'text-accent-mid',
    ACCENT_HEX: '#fbbf24',
  },
  {
    KEY: 'household',
    ICON: UtensilsCrossed,
    KICKER: 'Family',
    TITLE: 'Household meal planning',
    BODY: 'Cook once, log for everyone. Separate profiles and shared targets mean one plan works for the whole table.',
    ICON_SHELL: 'bg-macro-fat/12 text-macro-fat ring-1 ring-macro-fat/20',
    ACCENT_TEXT: 'text-macro-fat',
    ACCENT_HEX: '#7dd3fc',
  },
];
