import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { cn } from '@/app/utils/cn';
import { DEMO_LONG_VIDEO, DEMO_SCAN_VIDEO, DEMO_SECTION, DEMO_TABS_VIDEO, DEMO_VIDEO } from './constants';
import type { DemoVideoProps } from './types';

function DemoVideo({ src, poster, className }: DemoVideoProps) {
  return (
    <div
      className={cn('aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-edge-strong', className)}
    >
      <video src={src} poster={poster} className="size-full object-contain" autoPlay muted loop playsInline />
    </div>
  );
}

export default function Demo() {
  return (
    <section id="demo" className="scroll-mt-28 py-16 sm:py-20 lg:py-24" aria-labelledby="demo-heading">
      <ScrollEnter
        className="layout-page-shell"
        rows={[
          {
            KEY: 'heading',
            content: (
              <SectionIntro
                eyebrow={DEMO_SECTION.EYEBROW}
                title={DEMO_SECTION.TITLE}
                subtitle={DEMO_SECTION.SUBTITLE}
                headingId="demo-heading"
              />
            ),
          },
          {
            KEY: 'video',
            delayClass: 'motion-safe:delay-100',
            content: (
              <div className="mx-auto mt-10 flex flex-col gap-17.5 sm:mt-12 md:grid md:w-4/5 md:grid-cols-2 md:gap-5">
                <DemoVideo
                  className="sticky top-20 z-10 md:static"
                  src={DEMO_TABS_VIDEO.SRC}
                  poster={DEMO_TABS_VIDEO.POSTER}
                />
                <DemoVideo
                  className="sticky top-30 z-20 md:static"
                  src={DEMO_SCAN_VIDEO.SRC}
                  poster={DEMO_SCAN_VIDEO.POSTER}
                />
                <DemoVideo
                  className="sticky top-40 z-30 md:static"
                  src={DEMO_VIDEO.SRC}
                  poster={DEMO_VIDEO.POSTER}
                />
                <DemoVideo
                  className="sticky top-50 z-40 md:static"
                  src={DEMO_LONG_VIDEO.SRC}
                  poster={DEMO_LONG_VIDEO.POSTER}
                />
                <div aria-hidden className="h-[50vh] md:hidden" />
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
