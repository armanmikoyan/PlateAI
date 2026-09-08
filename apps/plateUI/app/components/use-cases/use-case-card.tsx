import { MagicCard } from '@/app/ui/magic-card';
import { cn } from '@/app/utils/cn';
import type { UseCaseCardProps } from './types';

export function UseCaseCard({ card }: UseCaseCardProps) {
  const Icon = card.ICON;
  return (
    <MagicCard
      className="select-none rounded-xl shadow-xl shadow-black/40"
      gradientColor={card.GLOW_FROM}
      gradientFrom={card.GLOW_FROM}
      gradientSize={280}
      gradientTo={card.GLOW_TO}
    >
      <div className="flex h-full flex-col gap-4 p-6 sm:p-7">
        <div className="flex h-full flex-col gap-4">
          <span
            className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', card.ICON_SHELL)}
          >
            <Icon aria-hidden className="size-6" />
          </span>
          <h3 className="font-heading text-lg font-semibold tracking-tight sm:text-xl">{card.TITLE}</h3>
          <p className="text-sm/relaxed text-muted-foreground">{card.BODY}</p>
        </div>
      </div>
    </MagicCard>
  );
}
