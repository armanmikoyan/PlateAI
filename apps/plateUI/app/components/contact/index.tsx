import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { CONTACT_SECTION } from './constants';
import { ContactForm } from './contact-form';

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-edge/60 scroll-mt-28 border-t bg-canvas py-16 sm:py-20 lg:py-24"
      aria-labelledby="contact-heading"
    >
      <ScrollEnter
        className="layout-page-shell"
        rows={[
          {
            KEY: 'body',
            content: (
              <>
                <SectionIntro
                  eyebrow={CONTACT_SECTION.EYEBROW}
                  title={CONTACT_SECTION.TITLE}
                  subtitle={CONTACT_SECTION.SUBTITLE}
                  headingId="contact-heading"
                />
                <ContactForm />
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
