import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { USE_CASES_SECTION, USE_CASE_CARD_ROWS } from './constants';
import { UseCaseCard } from './use-case-card';

export default function UseCases() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-28 py-16 sm:py-20 lg:py-24"
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
                {USE_CASE_CARD_ROWS.map((card) => (
                  <UseCaseCard key={card.KEY} card={card} />
                ))}
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
