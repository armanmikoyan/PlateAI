import { cn } from '@/app/utils/cn';
import type { DemoVideoProps } from './types';

export function DemoVideo({ src, poster, className, videoClassName }: DemoVideoProps) {
  return (
    <div
      className={cn('aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-edge-strong', className)}
    >
      <video
        src={src}
        poster={poster}
        className={cn('size-full object-contain', videoClassName)}
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  );
}
