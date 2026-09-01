export const FAQ_SECTION = {
  EYEBROW: 'FAQ',
  TITLE: 'Answers before you ask',
  SUBTITLE: 'Straightforward details about how PlateAI fits into a real day of eating.',
} as const;

export type FaqItemRow = Readonly<{
  KEY: string;
  QUESTION: string;
  ANSWER: string;
}>;

export const FAQ_ITEMS: readonly FaqItemRow[] = [
  {
    KEY: 'accuracy',
    QUESTION: 'How accurate are photo-based estimates?',
    ANSWER:
      'PlateAI is built for fast, honest ranges—not lab precision. You get calories and macros you can act on, then adjust portions or ingredients when you want tighter numbers.',
  },
  {
    KEY: 'privacy',
    QUESTION: 'What happens to my meal photos?',
    ANSWER:
      'Photos are used to generate your log entry and improve your personal experience. We do not sell your images; details follow the privacy policy linked from the product when accounts launch.',
  },
  {
    KEY: 'targets',
    QUESTION: 'Can I set my own macro targets?',
    ANSWER:
      'Yes. Targets stay yours—PlateAI shows how each meal and the rest of the day stack up so you can rebalance without starting over.',
  },
  {
    KEY: 'household',
    QUESTION: 'Does PlateAI support more than one person?',
    ANSWER:
      'Household-ready profiles and shared planning are planned for paid tiers so partners or families can stay aligned on one plan.',
  },
  {
    KEY: 'offline',
    QUESTION: 'Do I need signal at the table?',
    ANSWER:
      'Logging works best online for estimates and sync. Spotty service may delay saves until you are back on a stable connection.',
  },
] as const;
