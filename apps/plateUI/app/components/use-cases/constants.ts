import type { LucideIcon } from 'lucide-react';
import { Briefcase, Flame, Scale } from 'lucide-react';

export const USE_CASES_SECTION = {
  EYEBROW: 'Use cases',
  TITLE: 'Built for how people actually eat',
  SUBTITLE:
    'Whether you are dialing in macros, managing a busy week, or feeding more than one appetite—PlateAI stays out of the way until you need it.',
} as const;

export type UseCaseCardRow = Readonly<{
  KEY: string;
  ICON: LucideIcon;
  TITLE: string;
  BODY: string;
  ICON_SHELL: string;
}>;

export const USE_CASE_CARD_ROWS: readonly UseCaseCardRow[] = [
  {
    KEY: 'recomp',
    ICON: Flame,
    TITLE: 'Cut or bulk without the spreadsheet',
    BODY: 'Same-day totals show what is left after lunch so dinner stays inside the plan—without re-logging yesterday.',
    ICON_SHELL: 'bg-macro-protein/10 text-macro-protein ring-1 ring-macro-protein/18',
  },
  {
    KEY: 'busy',
    ICON: Briefcase,
    TITLE: 'Busy weeks, honest logs',
    BODY: 'Photo-first capture when you do not have a food scale nearby keeps streaks alive on travel days and late shifts.',
    ICON_SHELL: 'bg-accent/12 text-accent-mid ring-1 ring-accent/22',
  },
  {
    KEY: 'balance',
    ICON: Scale,
    TITLE: 'Flexible structure',
    BODY: 'Targets stay guidance, not guilt—adjust one meal and see the rest of the day rebalance in one readout.',
    ICON_SHELL: 'bg-macro-fat-strong/12 text-macro-fat-strong ring-1 ring-macro-fat-strong/20',
  },
] as const;
