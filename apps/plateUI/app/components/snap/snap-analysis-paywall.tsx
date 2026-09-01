import { cn } from '@/app/utils/cn';

import type { SnapAnalysisPaywallProps } from './types';

export function SnapAnalysisPaywall({ children, className }: SnapAnalysisPaywallProps) {
  return <div className={cn(className)}>{children}</div>;
}
