import { IconTextCard } from '@/app/components/icon-text-card';
import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { HOW_IT_WORKS, HOW_IT_WORKS_STEPS } from './constants';

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-edge/60 scroll-mt-28 border-t bg-canvas py-16 sm:py-20 lg:py-24"
      aria-labelledby="how-it-works-heading"
    >
      <ScrollEnter
        className="layout-page-shell"
        rows={[
          {
            KEY: 'body',
            content: (
              <>
                <SectionIntro
                  eyebrow={HOW_IT_WORKS.EYEBROW}
                  title={HOW_IT_WORKS.TITLE}
                  subtitle={HOW_IT_WORKS.SUBTITLE}
                  headingId="how-it-works-heading"
                />
                <ol className="mt-10 grid list-none grid-cols-1 gap-4 sm:mt-12 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                  {HOW_IT_WORKS_STEPS.map((step) => (
                    <li key={step.KEY} className="min-w-0">
                      <IconTextCard
                        body={step.BODY}
                        icon={step.ICON}
                        iconShell={step.ICON_SHELL}
                        layout="horizontal"
                        title={step.TITLE}
                      />
                    </li>
                  ))}
                </ol>
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
