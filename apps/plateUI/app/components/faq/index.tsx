import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { FAQ_SECTION } from './constants';
import { FaqList } from './faq-list';

export default function Faq() {
  return (
    <section id="faq" className="scroll-mt-28 py-16 sm:py-20 lg:py-24" aria-labelledby="faq-heading">
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
