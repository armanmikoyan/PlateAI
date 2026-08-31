import type { LucideIcon } from 'lucide-react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';
import { cn } from '@/app/utils/cn';

type IconTextCardProps = Readonly<{
  body: string;
  className?: string;
  icon: LucideIcon;
  iconShell: string;
  layout: 'horizontal' | 'vertical';
  title: string;
}>;

export function IconTextCard({
  body,
  className,
  icon: Icon,
  iconShell,
  layout,
  title,
}: IconTextCardProps) {
  const icon = (
    <span
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-xl sm:size-12',
        iconShell,
      )}
    >
      <Icon aria-hidden />
    </span>
  );

  return (
    <Card
      className={cn(
        'h-full',
        layout === 'horizontal' ? 'flex-row items-start' : undefined,
        className,
      )}
    >
      {layout === 'horizontal' ? (
        <div className="ps-(--card-spacing) pt-(--card-spacing)">{icon}</div>
      ) : null}
      <CardHeader className={layout === 'horizontal' ? 'flex-1' : undefined}>
        {layout === 'vertical' ? icon : null}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{body}</CardDescription>
      </CardHeader>
    </Card>
  );
}
