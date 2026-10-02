'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import type { DemoVideoProps } from './types';

export function DemoVideo({ src, poster, className, videoClassName }: DemoVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Reduced motion means no autoplaying loop — leave the poster up instead.
  useEffect(() => {
    const video = videoRef.current;
    if (video == null) {
      return;
    }
    if (reduceMotion === true) {
      video.autoplay = false;
      video.loop = false;
      video.pause();
    }
  }, [reduceMotion]);

  return (
    <div
      className={cn('aspect-video overflow-hidden rounded-2xl bg-black ring-1 ring-edge-strong', className)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className={cn('size-full object-contain', videoClassName)}
        autoPlay={reduceMotion !== true}
        muted
        loop={reduceMotion !== true}
        playsInline
        controls={reduceMotion === true}
      />
    </div>
  );
}
