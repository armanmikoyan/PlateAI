import { ScrollEnter } from '@/app/components/scroll';
import { SectionIntro } from '@/app/components/section-intro';
import { DEMO_LONG_VIDEO, DEMO_SECTION, DEMO_VIDEO } from './constants';

function DemoVideo({ src, poster }: { src: string; poster: string }) {
  return (
    <div className="overflow-hidden rounded-2xl ring-1 ring-edge-strong">
      <video
        src={src}
        poster={poster}
        className="block aspect-video w-full bg-black"
        autoPlay
        muted
        loop
        playsInline
      />
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
              <div className="mx-auto mt-10 grid grid-cols-1 gap-6 sm:mt-12 lg:grid-cols-2">
                <DemoVideo src={DEMO_VIDEO.SRC} poster={DEMO_VIDEO.POSTER} />
                <DemoVideo src={DEMO_LONG_VIDEO.SRC} poster={DEMO_LONG_VIDEO.POSTER} />
              </div>
            ),
          },
        ]}
      />
    </section>
  );
}
