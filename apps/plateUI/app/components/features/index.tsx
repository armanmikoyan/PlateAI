import { IconTextCard } from '@/app/components/icon-text-card';
import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { FEATURE_CARD_ROWS, FEATURES_SECTION } from './constants';

export default function Features() {
  return (
    <section
      id="features"
      className="border-edge/60 scroll-mt-28 border-t bg-canvas py-16 sm:py-20 lg:py-24"
      aria-labelledby="features-heading"
    >
      <ScrollEnter
        className="layout-page-shell"
        rows={[
          {
            KEY: 'body',
            content: (
              <>
                <SectionIntro
                  eyebrow={FEATURES_SECTION.EYEBROW}
                  title={FEATURES_SECTION.TITLE}
                  subtitle={FEATURES_SECTION.SUBTITLE}
                  headingId="features-heading"
                />
                <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:gap-6">
                  {FEATURE_CARD_ROWS.map((row) => (
                    <IconTextCard
                      key={row.KEY}
                      body={row.BODY}
                      icon={row.ICON}
                      iconShell={row.ICON_SHELL}
                      layout="vertical"
                      title={row.TITLE}
                    />
                  ))}
                </div>
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
