import Image from 'next/image';

export function HeroBetweenCardsArrow() {
  return (
    <div
      className="pointer-events-none flex shrink-0 justify-center py-2 max-lg:py-3 lg:min-h-0 lg:items-center lg:py-0"
      aria-hidden
    >
      <Image
        src="/icons/hero-right-arrow.svg"
        alt=""
        width={100}
        height={52}
        className="size-11 max-lg:rotate-90 sm:size-12 lg:size-14"
      />
    </div>
  );
}
