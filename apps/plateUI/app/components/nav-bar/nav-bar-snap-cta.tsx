import { Camera } from 'lucide-react';
import Form from 'next/form';

import { ShimmerButton } from '@/app/ui/shimmer-button';

import { NAV } from './constants';

export function NavBarSnapCta() {
  return (
    <Form action={NAV.SNAP_CTA_HREF} className="shrink-0">
      <ShimmerButton
        type="submit"
        background={NAV.SNAP_CTA_SHIMMER_BACKGROUND}
        shimmerColor={NAV.SNAP_CTA_SHIMMER_COLOR}
        shimmerSize="2px"
        className="text-button-default-fg h-8 gap-1 px-2.5 text-xs sm:h-9 sm:gap-1.5 sm:px-4 sm:text-sm"
      >
        <Camera className="size-3.5 shrink-0 sm:size-4" aria-hidden />
        {NAV.SNAP_CTA}
      </ShimmerButton>
    </Form>
  );
}
