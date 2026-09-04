import { FeatureCard } from '@/app/components/feature-card';
import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { USE_CASE_CARD_ROWS, USE_CASES_SECTION } from './constants';

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="border-edge/60 scroll-mt-28 border-t bg-canvas py-16 sm:py-20 lg:py-24"
      aria-labelledby="use-cases-heading"
    >
      <ScrollEnter
        className="layout-page-shell"
        rows={[
          {
            KEY: 'heading',
            content: (
              <SectionIntro
                eyebrow={USE_CASES_SECTION.EYEBROW}
                title={USE_CASES_SECTION.TITLE}
                subtitle={USE_CASES_SECTION.SUBTITLE}
                headingId="use-cases-heading"
              />
            ),
          },
          {
            KEY: 'cards',
            delayClass: 'motion-safe:delay-100',
            content: (
              <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {USE_CASE_CARD_ROWS.map((row) => (
                  <FeatureCard
                    key={row.KEY}
                    body={row.BODY}
                    icon={row.ICON}
                    iconShell={row.ICON_SHELL}
                    title={row.TITLE}
                  />
                ))}
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
