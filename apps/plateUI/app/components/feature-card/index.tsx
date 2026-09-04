import type { LucideIcon } from 'lucide-react';
import { cn } from '@/app/utils/cn';

type FeatureCardProps = Readonly<{
  body: string;
  icon: LucideIcon;
  iconShell: string;
  title: string;
}>;

export function FeatureCard({ body, icon: Icon, iconShell, title }: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6 select-none',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5',
        'motion-reduce:transition-none motion-reduce:hover:transform-none',
      )}
    >
      <div
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 ease-out',
          'group-hover:scale-110',
          'motion-reduce:transition-none motion-reduce:hover:transform-none',
          iconShell,
        )}
      >
        <Icon aria-hidden className="size-6" />
      </div>
      <h3 className="font-heading text-base font-semibold tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-sm/relaxed">{body}</p>
    </div>
  );
}
