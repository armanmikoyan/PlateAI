import { Check } from 'lucide-react';

type PricingTierFeatureListProps = Readonly<{
  lines: readonly string[];
}>;

export function PricingTierFeatureList({ lines }: PricingTierFeatureListProps) {
  return (
    <ul className="text-content-muted mt-6 flex flex-1 flex-col gap-3 text-sm">
      {lines.map((line) => (
        <li key={line} className="flex gap-2.5">
          <Check
            className="text-positive/90 mt-0.5 size-4 shrink-0"
            strokeWidth={2}
            aria-hidden
          />
          <span className="leading-snug">{line}</span>
        </li>
      ))}
    </ul>
  );
}
