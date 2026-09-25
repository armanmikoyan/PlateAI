'use client';

import { useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { FEATURE_DEMO_ROWS, FEATURES_SECTION } from './constants';
import { FeatureDemoPreview } from './feature-demo-preview';
import { FeatureDemoTabs } from './feature-demo-tabs';
import type { FeatureDemoSceneKey } from './types';

export default function Features() {
  const [activeKey, setActiveKey] = useState<FeatureDemoSceneKey>(FEATURE_DEMO_ROWS[0].KEY);
  const reduceMotion = useReducedMotion() === true;

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
            KEY: 'showcase',
            delayClass: 'motion-safe:delay-100',
            content: (
              <div className="mt-10 grid grid-cols-1 items-center gap-6 sm:mt-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-10">
                <FeatureDemoTabs rows={FEATURE_DEMO_ROWS} activeKey={activeKey} onSelect={setActiveKey} />
                <FeatureDemoPreview
                  rows={FEATURE_DEMO_ROWS}
                  activeKey={activeKey}
                  reduceMotion={reduceMotion}
                />
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
