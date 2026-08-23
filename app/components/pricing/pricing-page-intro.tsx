import { PRICING_PAGE, PRICING_SECTION } from './constants';

export function PricingPageIntro() {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-content-muted font-mono text-[11px] font-medium tracking-widest uppercase sm:text-xs">
        {PRICING_SECTION.EYEBROW}
      </p>
      <h1 className="text-content mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        {PRICING_PAGE.TITLE}
      </h1>
      <p className="text-content-muted mt-3 text-sm/relaxed sm:text-base">{PRICING_PAGE.SUBTITLE}</p>
    </div>
  );
}
