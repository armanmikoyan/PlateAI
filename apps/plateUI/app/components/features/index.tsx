import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { FEATURES_SECTION, FEATURE_TILE_ROWS } from './constants';
import { FeatureTile } from './feature-tile';

export default function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-28 py-16 sm:py-20 lg:py-24"
      aria-labelledby="features-heading"
    >
      <ScrollEnter
        className="layout-page-shell"
        rows={[
          {
            KEY: 'heading',
            content: (
              <SectionIntro
                eyebrow={FEATURES_SECTION.EYEBROW}
                title={FEATURES_SECTION.TITLE}
                subtitle={FEATURES_SECTION.SUBTITLE}
                headingId="features-heading"
              />
            ),
          },
          {
            KEY: 'bento',
            delayClass: 'motion-safe:delay-100',
            content: (
              <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {FEATURE_TILE_ROWS.map((tile) => (
                  <FeatureTile key={tile.KEY} tile={tile} />
                ))}
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
