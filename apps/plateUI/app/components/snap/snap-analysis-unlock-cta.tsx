import { Lock } from 'lucide-react';

import { cn } from '@/app/utils/cn';

import { SNAP } from './constants';

type SnapAnalysisUnlockCtaProps = Readonly<{
  className?: string;
}>;

export function SnapAnalysisUnlockCta({ className }: SnapAnalysisUnlockCtaProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium shadow-md',
        'text-button-default-fg',
        className,
      )}
      style={{ background: SNAP.PAYWALL_CTA_SHIMMER_BACKGROUND }}
    >
      <Lock className="size-4 shrink-0" aria-hidden />
      {SNAP.PAYWALL_CTA}
    </span>
  );
}
