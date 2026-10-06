'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/app/utils/cn';
import {
  HOMEPAGE_BG_VIDEOS,
  HOMEPAGE_BG_VIDEO_OVERLAY_CLASS,
  HOMEPAGE_BG_VIDEO_SCRIM_CLASS,
} from './constants';
import { pickHomepageBgVideoIndex } from './utils';

export function HomepageBgVideo() {
  // `null` until the client picks a clip: the server must not render an `src`, or the
  // browser starts loading/painting clip 1 and the post-hydration swap visibly restarts
  // the background as a second, different video.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  // The layer stays transparent until the engine reports real playback, so the native
  // video shell some in-app browsers draw while an `autoplay` video is still loading —
  // grey field plus a play button, which is what X's embedded browser shows — never
  // reaches the screen. `frameOnly` covers the two cases where playback never starts:
  // reduced motion, and webviews that refuse `play()` without a gesture.
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);
  const [frameOnly, setFrameOnly] = useState(false);
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  // One clip per page load, chosen after hydration because the random isn't stable
  // across the hydration boundary (`useState`'s lazy initialiser would run during SSR too).
  useEffect(() => {
    setActiveIndex(pickHomepageBgVideoIndex());
  }, []);

  // Playback is started explicitly instead of through the `autoplay` attribute: WebKit
  // draws the native play-button placeholder *because* an `autoplay` video hasn't started
  // yet (slow load, blocked autoplay), which is the raw shell visitors were seeing. A
  // muted, playsinline `play()` is allowed wherever `autoplay` would have been, and when
  // it isn't, `frameOnly` swaps the shell for a still first frame.
  useEffect(() => {
    const video = videoRef.current;
    if (video == null || activeIndex === null) return;

    if (reduceMotion === true) {
      video.pause();
      setFrameOnly(true);
      return;
    }

    void video.play().catch(() => {
      setFrameOnly(true);
    });
  }, [activeIndex, reduceMotion]);

  const activeVideo = activeIndex === null ? null : HOMEPAGE_BG_VIDEOS[activeIndex];
  const isVisible = isPlaying || (frameOnly && hasFrame);

  return (
    // `fixed inset-0` so the parallax holds across every section *and* reaches behind the
    // nav, which is already transparent at rest. `overflow-hidden` is what stops the
    // full-bleed frame from spilling past the viewport on short screens.
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <video
        ref={videoRef}
        src={activeVideo?.SRC}
        // `bg-canvas` paints a plain dark field until the first frame decodes — it also
        // covers the hydration gap while the clip is being picked. No `poster`: a poster
        // is a real frame from the footage, so it would flash an arbitrary still before
        // fading into playback.
        //
        // `object-cover`, not `contain`: these clips are 16:9, so containing them inside a
        // portrait phone viewport (e.g. 390x844) letterboxes the video down to a ~219px
        // band floating in the vertical middle — nothing reaches the nav slot or the top of
        // the hero. Covering fills the box at every aspect ratio. At `lg` and up the
        // viewport is close to 16:9, so the crop is negligible.
        className={cn(
          'bg-canvas size-full object-cover transition-opacity duration-500',
          isVisible ? 'opacity-100' : 'opacity-0',
        )}
        muted
        // Loops its own clip rather than advancing to the next: swapping clips mid-play
        // cuts hard between two unrelated shots, which reads as a glitch behind scrolling
        // content. A self-loop's seam is far less noticeable, and the background stays in
        // motion for as long as the visitor is on the page.
        loop
        playsInline
        disablePictureInPicture
        preload="auto"
        onPlaying={() => {
          setIsPlaying(true);
        }}
        onLoadedData={() => {
          setHasFrame(true);
        }}
      />
      <div className={HOMEPAGE_BG_VIDEO_SCRIM_CLASS} />
      <div className={HOMEPAGE_BG_VIDEO_OVERLAY_CLASS} />
    </div>
  );
}
