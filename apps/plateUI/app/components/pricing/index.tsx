import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { PRICING_SECTION } from './constants';
import { PricingTierGrid } from './pricing-tier-grid';

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="border-edge scroll-mt-28 border-t bg-canvas py-16 sm:py-20 lg:py-24"
      aria-labelledby="pricing-heading"
    >
      <ScrollEnter
        className="layout-page-shell"
        rows={[
          {
            KEY: 'intro',
            content: (
              <SectionIntro
                eyebrow={PRICING_SECTION.EYEBROW}
                title={PRICING_SECTION.TITLE}
                subtitle={PRICING_SECTION.SUBTITLE}
                headingId="pricing-heading"
              />
            ),
          },
          {
            KEY: 'grid',
            content: <PricingTierGrid variant="preview" />,
            delayClass: 'motion-safe:delay-150',
          },
        ]}
      />
    </section>
  );
}
