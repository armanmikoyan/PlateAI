'use client';

import { useEffect, useState } from 'react';

import {
  FEEDBACK_MARQUEE_ROW_A_QUOTES,
  FEEDBACK_MARQUEE_ROW_B_QUOTES,
  FEEDBACK_MARQUEE_SECTION,
} from './constants';
import { FeedbackMarqueeRow } from './feedback-marquee-row';

export default function FeedbackMarquee() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <section
      id="feedback"
      className="border-edge/60 scroll-mt-28 border-t bg-surface py-10 sm:py-12"
      aria-labelledby="feedback-marquee-heading"
    >
      <div className="layout-page-shell">
        <div className="text-center">
          <p className="text-content-subtle text-xs font-medium tracking-widest uppercase">
            {FEEDBACK_MARQUEE_SECTION.EYEBROW}
          </p>
          <h2
            id="feedback-marquee-heading"
            className="text-content mt-2 text-lg font-semibold tracking-tight sm:text-xl"
          >
            {FEEDBACK_MARQUEE_SECTION.TITLE}
          </h2>
        </div>

        <div className="mt-8 flex flex-col gap-5 sm:mt-10 sm:gap-6">
          <FeedbackMarqueeRow
            quotes={FEEDBACK_MARQUEE_ROW_A_QUOTES}
            variant={reduceMotion ? 'static' : 'scroll-toward-right'}
          />
          <FeedbackMarqueeRow
            quotes={FEEDBACK_MARQUEE_ROW_B_QUOTES}
            variant={reduceMotion ? 'static' : 'scroll-toward-left'}
          />
        </div>
      </div>
    </section>
  );
}
