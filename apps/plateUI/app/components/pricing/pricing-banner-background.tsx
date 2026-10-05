import Image from 'next/image';
import { PRICING_BANNER_IMAGE_HEIGHT, PRICING_BANNER_IMAGE_WIDTH } from './constants';

export function PricingBannerBackground() {
  return (
    // `fixed`, not `sticky`: a sticky layer can only travel `container height - layer
    // height`, which on mobile runs out inside the cards section and leaves the table
    // with no parallax. `top-20` starts it below the nav's fixed 80px slot so the image
    // never sits behind the bar.
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-20 -z-10 h-[calc(100svh-5rem)] overflow-hidden"
    >
      <Image
        src="/images/dark-food-recognition-app-banner.png"
        alt=""
        width={PRICING_BANNER_IMAGE_WIDTH}
        height={PRICING_BANNER_IMAGE_HEIGHT}
        priority
        sizes="100vw"
        className="block h-auto w-full"
      />
      <div className="absolute inset-0 bg-linear-to-b from-canvas/45 via-canvas/15 to-canvas/70" />
    </div>
  );
}
