import { ArrowRight, Camera } from 'lucide-react';
import Form from 'next/form';

import { ShimmerButton } from '@/app/ui/shimmer-button';

import { HERO } from './constants';

export function HeroCta() {
  return (
    <div className="mt-8 flex flex-col items-start gap-3 sm:mt-10">
      <Form action={HERO.CTA_HREF}>
        <ShimmerButton
          type="submit"
          background="linear-gradient(165deg, var(--color-cta-soft) 0%, var(--color-cta) 48%, var(--color-cta-deep) 100%)"
          shimmerColor="var(--color-content)"
          shimmerSize="2px"
          className="text-button-default-fg h-14 gap-3 px-7 text-lg sm:h-16 sm:px-8 sm:text-xl [&_svg:not([class*='size-'])]:size-6 sm:[&_svg:not([class*='size-'])]:size-7"
        >
          <Camera />
          {HERO.CTA}
          <ArrowRight />
        </ShimmerButton>
      </Form>
      <p className="text-content-muted max-w-md text-sm sm:text-base">{HERO.CTA_HINT}</p>
    </div>
  );
}
