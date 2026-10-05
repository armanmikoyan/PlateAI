'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import { SNAP_BG_VIDEO_POSTER, SNAP_BG_VIDEO_SCRIM_CLASS, SNAP_BG_VIDEO_SRC } from './constants';

export function SnapBgVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduceMotion = useReducedMotion();

  // Reduced motion means no autoplaying loop — hold on the poster frame instead.
  useEffect(() => {
    const video = videoRef.current;
    if (video == null || reduceMotion !== true) {
      return;
    }

    video.autoplay = false;
    video.loop = false;
    video.pause();
  }, [reduceMotion]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <video
        ref={videoRef}
        src={SNAP_BG_VIDEO_SRC}
        poster={SNAP_BG_VIDEO_POSTER}
        className="size-full scale-105 object-cover"
        autoPlay={reduceMotion !== true}
        muted
        loop={reduceMotion !== true}
        playsInline
        disablePictureInPicture
        preload="auto"
      />
      <div className={SNAP_BG_VIDEO_SCRIM_CLASS} />
    </div>
  );
}
