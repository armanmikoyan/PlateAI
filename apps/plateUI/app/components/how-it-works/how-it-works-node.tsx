import { cn } from '@/app/utils/cn';
import type { HowItWorksStepProps } from './types';

export function HowItWorksNode({ step }: HowItWorksStepProps) {
  const Icon = step.ICON;
  return (
    <li className="min-w-0 select-none py-8 first:pt-0 last:pb-0 lg:py-0">
      <div className="relative flex flex-col items-center gap-6 text-center sm:gap-5">
        <div className="relative" data-rail-icon>
          <div className={cn('flex size-16 items-center justify-center rounded-2xl', step.ICON_SHELL)}>
            <Icon aria-hidden className="size-8" />
          </div>
          <span
            className={cn(
              'absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full font-mono text-[11px] font-medium ring-2 ring-inset',
              step.NODE_SHELL,
            )}
          >
            {step.STEP}
          </span>
        </div>
        <h3 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">{step.TITLE}</h3>
        <p className="max-w-xs px-6 text-sm/relaxed text-muted-foreground sm:px-0">{step.BODY}</p>
      </div>
    </li>
  );
}
