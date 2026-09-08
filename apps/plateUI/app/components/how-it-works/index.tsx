import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { HOW_IT_WORKS, HOW_IT_WORKS_STEPS } from './constants';
import { HowItWorksNode } from './how-it-works-node';
import { MobileRail } from './mobile-rail';

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-28 py-16 sm:py-20 lg:py-24"
      aria-labelledby="how-it-works-heading"
    >
      <ScrollEnter
        className="layout-page-shell"
        rows={[
          {
            KEY: 'heading',
            content: (
              <SectionIntro
                eyebrow={HOW_IT_WORKS.EYEBROW}
                title={HOW_IT_WORKS.TITLE}
                subtitle={HOW_IT_WORKS.SUBTITLE}
                headingId="how-it-works-heading"
              />
            ),
          },
          {
            KEY: 'rail',
            delayClass: 'motion-safe:delay-100',
            content: (
              <div className="relative mt-10 sm:mt-12 lg:mt-16">
                <div
                  aria-hidden
                  className="from-macro-fat-strong/60 via-accent/50 to-positive/60 absolute top-8 inset-x-[16.66%] hidden h-px overflow-hidden bg-linear-to-r lg:block"
                >
                  <span className="animate-rail-flow-wide absolute inset-y-0 w-16 bg-linear-to-r from-transparent via-white/45 to-transparent motion-reduce:animate-none" />
                </div>
                <MobileRail>
                  <ol className="relative grid list-none grid-cols-1 lg:grid-cols-3 lg:gap-10">
                    {HOW_IT_WORKS_STEPS.map((step) => (
                      <HowItWorksNode key={step.KEY} step={step} />
                    ))}
                  </ol>
                </MobileRail>
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
