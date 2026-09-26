import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { DEMO_LONG_VIDEO, DEMO_MORE_SECTION, DEMO_SCAN_VIDEO, DEMO_TABS_MOBILE_VIDEO } from './constants';
import { DemoVideo } from './demo-video';

export default function DemoMore() {
  return (
    <section
      id="demo-more"
      className="scroll-mt-28 py-16 sm:py-20 lg:py-24"
      aria-labelledby="demo-more-heading"
    >
      <ScrollEnter
        className="layout-page-shell"
        rows={[
          {
            KEY: 'heading',
            content: (
              <SectionIntro
                eyebrow={DEMO_MORE_SECTION.EYEBROW}
                title={DEMO_MORE_SECTION.TITLE}
                subtitle={DEMO_MORE_SECTION.SUBTITLE}
                headingId="demo-more-heading"
              />
            ),
          },
          {
            KEY: 'video',
            delayClass: 'motion-safe:delay-100',
            content: (
              <>
                <div className="mx-auto mt-10 flex flex-col gap-17.5 sm:mt-12 md:grid md:w-4/5 md:grid-cols-[1fr_1fr_1.16fr] md:grid-rows-2 md:gap-5">
                  <DemoVideo
                    className="sticky top-20 z-10 md:static md:col-start-1 md:row-start-1 md:col-span-2"
                    src={DEMO_SCAN_VIDEO.SRC}
                    poster={DEMO_SCAN_VIDEO.POSTER}
                  />
                  <DemoVideo
                    className="sticky top-30 z-20 md:static md:col-start-1 md:row-start-2 md:col-span-2"
                    src={DEMO_LONG_VIDEO.SRC}
                    poster={DEMO_LONG_VIDEO.POSTER}
                  />
                  <DemoVideo
                    className="sticky top-40 z-30 md:static md:col-start-3 md:row-start-1 md:row-span-2 md:aspect-[1/2] md:ring-0"
                    videoClassName="object-cover"
                    src={DEMO_TABS_MOBILE_VIDEO.SRC}
                    poster={DEMO_TABS_MOBILE_VIDEO.POSTER}
                  />
                </div>
                <div aria-hidden className="h-[50vh] md:hidden" />
              </>
            ),
          },
        ]}
      />
    </section>
  );
}
