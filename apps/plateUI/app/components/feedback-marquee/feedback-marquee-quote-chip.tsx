'use client';

import { useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { Quote } from 'lucide-react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { FEEDBACK_MARQUEE_ANIM } from './constants';

type FeedbackMarqueeQuoteChipProps = Readonly<{
  quote: string;
  index: number;
}>;

export function FeedbackMarqueeQuoteChip({ quote, index }: FeedbackMarqueeQuoteChipProps) {
  const reduceMotion = useReducedMotion() === true;
  const cardRef = useRef<HTMLSpanElement>(null);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowOpacity = useSpring(0, { stiffness: 260, damping: 30 });

  const glow = useMotionTemplate`radial-gradient(${FEEDBACK_MARQUEE_ANIM.GLOW_SIZE}px circle at ${glowX}px ${glowY}px, ${FEEDBACK_MARQUEE_ANIM.GLOW_COLOR}, transparent 70%)`;

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLSpanElement>) => {
      const element = cardRef.current;
      if (!element || reduceMotion) {
        return;
      }
      const rect = element.getBoundingClientRect();
      glowX.set(event.clientX - rect.left);
      glowY.set(event.clientY - rect.top);
      glowOpacity.set(1);
    },
    [reduceMotion, glowX, glowY, glowOpacity],
  );

  const reset = useCallback(() => {
    glowOpacity.set(0);
  }, [glowOpacity]);

  return (
    <motion.span
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ delay: reduceMotion ? 0 : index * 0.06, duration: 0.4, ease: 'easeOut' }}
      className="relative flex min-w-fit shrink-0 items-start gap-2.5 overflow-hidden rounded-xl border border-white/10 bg-card/80 px-4 py-2.5 text-left shadow-lg shadow-black/20 backdrop-blur-sm transition-colors duration-300 hover:border-white/20"
    >
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ background: glow, opacity: glowOpacity }}
      />
      <Quote aria-hidden className="relative mt-0.5 size-3.5 shrink-0 text-cta" fill="currentColor" />
      <span className="relative text-xs/relaxed text-white/85 sm:text-sm/relaxed">{quote}</span>
    </motion.span>
  );
}
