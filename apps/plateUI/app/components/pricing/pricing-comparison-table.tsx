'use client';

import { motion, useReducedMotion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import { PRICING_COMPARISON_ROWS, PRICING_PAGE, PRICING_TIERS } from './constants';

export function PricingComparisonTable() {
  const reduceMotion = useReducedMotion() === true;

  return (
    <div>
      <div className="mx-auto max-w-3xl text-center">
        <h2
          id="pricing-comparison-heading"
          className="text-content text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {PRICING_PAGE.COMPARISON_HEADING}
        </h2>
        <p className="text-content-muted mt-2 text-sm/relaxed sm:text-base">
          {PRICING_PAGE.COMPARISON_CAPTION}
        </p>
      </div>

      <motion.div
        className="border-edge relative mt-8 overflow-hidden rounded-2xl border"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        {!reduceMotion ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 z-10 w-1/3 -skew-x-12 bg-linear-to-r from-transparent via-white/8 to-transparent"
            initial={{ x: '-140%' }}
            whileInView={{ x: '340%' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.3, duration: 1.1, ease: 'easeInOut' }}
          />
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <caption className="sr-only">{PRICING_PAGE.COMPARISON_HEADING}</caption>
            <thead>
              <tr className="border-edge bg-surface-overlay/40 border-b">
                <th scope="col" className="text-content-muted px-4 py-3 font-medium sm:px-6">
                  Feature
                </th>
                {PRICING_TIERS.map((tier) => (
                  <th
                    key={tier.ID}
                    scope="col"
                    className={cn('px-4 py-3 sm:px-6', tier.HIGHLIGHT && 'bg-accent/[0.04]')}
                  >
                    <span className="flex flex-col items-start gap-1">
                      <span className={cn('text-content font-semibold', tier.HIGHLIGHT && 'text-accent-mid')}>
                        {tier.NAME}
                      </span>
                      {tier.BADGE ? (
                        <span className="text-cta text-[10px] font-semibold tracking-widest uppercase">
                          {tier.BADGE}
                        </span>
                      ) : null}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRICING_COMPARISON_ROWS.map((row) => (
                <tr
                  key={row.KEY}
                  className="border-edge/80 border-b transition-colors last:border-b-0 hover:bg-white/[0.02]"
                >
                  <th scope="row" className="text-content-muted px-4 py-3 font-medium sm:px-6">
                    {row.LABEL}
                  </th>
                  {PRICING_TIERS.map((tier) => (
                    <td
                      key={`${tier.ID}-${row.KEY}`}
                      className={cn('px-4 py-3 sm:px-6', tier.HIGHLIGHT && 'bg-accent/[0.04] font-medium')}
                    >
                      {tier.COMPARISON[row.KEY]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
