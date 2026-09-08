import type { FeedbackMarqueeQuoteRow } from './types';

export type { FeedbackMarqueeQuoteRow } from './types';

export const FEEDBACK_MARQUEE_SECTION = {
  EYEBROW: 'Early feedback',
  TITLE: 'What people are saying',
} as const;

/** First row: scrolls left → right (track moves toward positive X). */
export const FEEDBACK_MARQUEE_ROW_A_QUOTES: readonly FeedbackMarqueeQuoteRow[] = [
  {
    KEY: 'a1',
    QUOTE: 'Stopped guessing portions.',
  },
  {
    KEY: 'a2',
    QUOTE: 'The photo flow is stupid fast.',
  },
  {
    KEY: 'a3',
    QUOTE: 'Whole-day macros sold me.',
  },
  {
    KEY: 'a4',
    QUOTE: 'I actually log dinner now.',
  },
  {
    KEY: 'a5',
    QUOTE: 'Household mode got my partner on board.',
  },
] as const;

/** Second row: scrolls right → left (classic marquee). */
export const FEEDBACK_MARQUEE_ROW_B_QUOTES: readonly FeedbackMarqueeQuoteRow[] = [
  {
    KEY: 'b1',
    QUOTE: 'Estimates feel honest.',
  },
  {
    KEY: 'b2',
    QUOTE: 'Fix one meal, keep the week.',
  },
  {
    KEY: 'b3',
    QUOTE: 'Shopping list is scary accurate.',
  },
  {
    KEY: 'b4',
    QUOTE: 'Dark UI + big type at the table.',
  },
  {
    KEY: 'b5',
    QUOTE: 'One app, done.',
  },
] as const;
