import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/ui/card';
import { DotPattern } from '@/app/ui/dot-pattern';
import { cn } from '@/app/utils/cn';
import type { FeatureTileProps } from './types';

export function FeatureTile({ tile }: FeatureTileProps) {
  const Icon = tile.ICON;
  return (
    <Card
      className={cn('relative min-h-40 select-none overflow-hidden', tile.SPAN, tile.TILE_SHELL, tile.BORDER)}
    >
      {tile.FEATURED ? (
        <DotPattern className="text-macro-fat-strong/20" width={18} height={18} cx={1} cy={1} cr={1.5} />
      ) : null}
      <CardHeader className="relative">
        <span className={cn('flex size-12 shrink-0 items-center justify-center rounded-xl', tile.ICON_SHELL)}>
          <Icon aria-hidden className="size-6" />
        </span>
        <CardTitle
          className={cn('text-lg font-semibold tracking-tight', tile.FEATURED ? 'sm:text-xl' : undefined)}
        >
          {tile.TITLE}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <CardDescription className="text-sm/relaxed text-muted-foreground">{tile.BODY}</CardDescription>
      </CardContent>
    </Card>
  );
}
