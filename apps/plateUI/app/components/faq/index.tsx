import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';

import { FAQ_SECTION } from './constants';
import { FaqList } from './faq-list';

export default function Faq() {
  return (
    <section
      id="faq"
      className="border-edge/60 scroll-mt-28 border-t bg-canvas pt-16 pb-28 sm:pt-20 sm:pb-36 lg:pt-24 lg:pb-44"
      aria-labelledby="faq-heading"
    >
      <ScrollEnter
        className="layout-page-shell"
        rows={[
          {
            KEY: 'body',
            content: (
              <>
                <SectionIntro
                  eyebrow={FAQ_SECTION.EYEBROW}
                  title={FAQ_SECTION.TITLE}
                  subtitle={FAQ_SECTION.SUBTITLE}
                  headingId="faq-heading"
                />
                <FaqList />
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
