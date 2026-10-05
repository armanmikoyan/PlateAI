import Image from 'next/image';

export function PricingBannerBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Image
        src="/images/dark-food-recognition-app-banner.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="scale-105 object-cover object-center opacity-55"
      />
      <div className="absolute inset-0 bg-linear-to-b from-canvas/75 via-canvas/45 to-canvas" />
    </div>
  );
}
