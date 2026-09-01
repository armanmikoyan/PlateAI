import type { SectionIntroProps } from './types';

export function SectionIntro({ eyebrow, title, subtitle, headingId }: SectionIntroProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-content-muted font-mono text-[11px] font-medium tracking-widest uppercase sm:text-xs">
        {eyebrow}
      </p>
      <h2
        id={headingId}
        className="text-content mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
      >
        {title}
      </h2>
      <p className="text-content-muted mt-3 text-sm/relaxed sm:text-base">{subtitle}</p>
    </div>
  );
}
