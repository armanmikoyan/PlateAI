import { Marquee } from '@/app/ui/marquee';

import type { FeedbackMarqueeQuoteRow } from './constants';
import { FeedbackMarqueeQuoteChip } from './feedback-marquee-quote-chip';

export type FeedbackMarqueeRowVariant = 'scroll-toward-left' | 'scroll-toward-right' | 'static';

type FeedbackMarqueeRowProps = Readonly<{
  quotes: readonly FeedbackMarqueeQuoteRow[];
  variant: FeedbackMarqueeRowVariant;
}>;

function renderChips(quotes: readonly FeedbackMarqueeQuoteRow[]) {
  return quotes.map((row) => <FeedbackMarqueeQuoteChip key={row.KEY} quote={row.QUOTE} />);
}

export function FeedbackMarqueeRow({ quotes, variant }: FeedbackMarqueeRowProps) {
  if (variant === 'static') {
    return (
      <div className="flex flex-wrap justify-center gap-3 px-2 py-1 sm:gap-4">
        {renderChips(quotes)}
      </div>
    );
  }

  return (
    <Marquee reverse={variant === 'scroll-toward-right'} pauseOnHover>
      {renderChips(quotes)}
    </Marquee>
  );
}
