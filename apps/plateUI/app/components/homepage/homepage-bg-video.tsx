'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import {
  HOMEPAGE_BG_VIDEOS,
  HOMEPAGE_BG_VIDEO_OVERLAY_CLASS,
  HOMEPAGE_BG_VIDEO_SCRIM_CLASS,
} from './constants';
import { pickHomepageBgVideoIndex } from './utils';

export function HomepageBgVideo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  // One clip per page load, chosen after hydration so the server can render a valid
  // first clip while the client picks a different one. `useState`'s lazy initialiser
  // can't be used — it would run during SSR too, where the random isn't stable across
  // the hydration boundary.
  useEffect(() => {
    setActiveIndex(pickHomepageBgVideoIndex());
  }, []);

  const activeVideo = HOMEPAGE_BG_VIDEOS[activeIndex];

  return (
    // `fixed inset-0` so the parallax holds across every section *and* reaches behind the
    // nav, which is already transparent at rest. `overflow-hidden` is what stops the
    // full-bleed frame from spilling past the viewport on short screens.
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <video
        src={activeVideo.SRC}
        // `bg-canvas` paints a plain dark field until the first frame decodes. No `poster`:
        // a poster is a real frame from the footage, so the randomly chosen clip would flash
        // an arbitrary still — often a blown-out highlight — before fading into playback.
        //
        // `object-cover`, not `contain`: these clips are 16:9, so containing them inside a
        // portrait phone viewport (e.g. 390x844) letterboxes the video down to a ~219px
        // band floating in the vertical middle — nothing reaches the nav slot or the top of
        // the hero. Covering fills the box at every aspect ratio. At `lg` and up the
        // viewport is close to 16:9, so the crop is negligible.
        className="bg-canvas size-full object-cover"
        autoPlay={reduceMotion !== true}
        muted
        // Loops its own clip rather than advancing to the next: swapping clips mid-play
        // cuts hard between two unrelated shots, which reads as a glitch behind scrolling
        // content. A self-loop's seam is far less noticeable, and the background stays in
        // motion for as long as the visitor is on the page.
        loop
        playsInline
        disablePictureInPicture
        preload="auto"
      />
      <div className={HOMEPAGE_BG_VIDEO_SCRIM_CLASS} />
      <div className={HOMEPAGE_BG_VIDEO_OVERLAY_CLASS} />
    </div>
  );
}
