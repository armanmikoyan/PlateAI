export const FEEDBACK_MARQUEE_SECTION = {
  EYEBROW: 'Early feedback',
  TITLE: 'What people are saying',
} as const;

export type FeedbackMarqueeQuoteRow = Readonly<{
  KEY: string;
  QUOTE: string;
}>;

/** First row: scrolls left → right (track moves toward positive X). */
export const FEEDBACK_MARQUEE_ROW_A_QUOTES: readonly FeedbackMarqueeQuoteRow[] = [
  {
    KEY: 'a1',
    QUOTE: 'Finally stopped guessing portions after lunch.',
  },
  {
    KEY: 'a2',
    QUOTE: 'The photo flow is stupid fast compared to my old app.',
  },
  {
    KEY: 'a3',
    QUOTE: 'Seeing macros for the whole day in one glance sold me.',
  },
  {
    KEY: 'a4',
    QUOTE: 'I actually log dinner now because it is not a chore.',
  },
  {
    KEY: 'a5',
    QUOTE: 'Household mode is the only reason my partner is on board.',
  },
] as const;

/** Second row: scrolls right → left (classic marquee). */
export const FEEDBACK_MARQUEE_ROW_B_QUOTES: readonly FeedbackMarqueeQuoteRow[] = [
  {
    KEY: 'b1',
    QUOTE: 'Estimates feel honest—not like everything is 200 calories.',
  },
  {
    KEY: 'b2',
    QUOTE: 'Love that I can fix one meal without redoing the whole week.',
  },
  {
    KEY: 'b3',
    QUOTE: 'Shopping list from meals is scary accurate.',
  },
  {
    KEY: 'b4',
    QUOTE: 'Dark UI + big type = I use it at the table, not later.',
  },
  {
    KEY: 'b5',
    QUOTE: 'Worth it just to stop flipping between three apps.',
  },
] as const;
