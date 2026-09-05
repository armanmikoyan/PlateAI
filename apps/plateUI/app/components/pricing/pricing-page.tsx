import SiteFooter from '@/app/components/site-footer';
import { ScrollEnter } from '@/app/components/scroll';
import { PricingComparisonTable } from './pricing-comparison-table';
import { PricingFixedCta } from './pricing-fixed-cta';
import { PricingPageIntro } from './pricing-page-intro';
import { PricingTierGrid } from './pricing-tier-grid';
import { PricingUrlSync } from './pricing-url-sync';
import type { PricingPageProps } from './types';

export default function PricingPage({ currentPlanId = null }: PricingPageProps) {
  return (
    <>
      <PricingUrlSync />
      <div className="border-edge bg-canvas border-t py-16 sm:py-20 lg:py-24">
        <ScrollEnter
          className="layout-page-shell"
          rows={[
            { KEY: 'intro', content: <PricingPageIntro /> },
            {
              KEY: 'grid',
              content: <PricingTierGrid variant="detail" currentPlanId={currentPlanId} />,
              delayClass: 'motion-safe:delay-150',
            },
          ]}
        />
      </div>

      <section
        className="border-edge scroll-mt-28 border-t bg-surface py-16 sm:py-20 lg:py-24"
        aria-labelledby="pricing-comparison-heading"
      >
        <ScrollEnter
          className="layout-page-shell"
          rows={[
            {
              KEY: 'comparison',
              content: <PricingComparisonTable />,
            },
          ]}
        />
      </section>

      <SiteFooter />
      <div aria-hidden className="h-28 shrink-0 sm:h-32" />
      <PricingFixedCta currentPlanId={currentPlanId} />
    </>
  );
}
