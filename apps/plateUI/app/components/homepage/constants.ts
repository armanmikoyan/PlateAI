/**
 * Background loops for the homepage. Order is fixed so the rotation is predictable; a
 * random clip is chosen once per page load (see `pickHomepageBgVideoIndex`). Add new
 * uploads as `home-bg-<n>` pairs and extend this array — the numbers need not be
 * contiguous, so retired clips can be deleted without renaming the rest.
 *
 * Intentionally no `poster` per clip: a poster is a real frame lifted from the footage, so
 * a randomly chosen clip showed an arbitrary still while the video buffered — often a
 * blown-out highlight that read as a flash before the clip faded in. The element's own
 * `bg-canvas` holds a plain dark field until the first frame decodes instead.
 */
export const HOMEPAGE_BG_VIDEOS = [
  { SRC: '/videos/home-bg-1.mp4' },
  { SRC: '/videos/home-bg-2.mp4' },
  { SRC: '/videos/home-bg-3.mp4' },
  { SRC: '/videos/home-bg-4.mp4' },
  { SRC: '/videos/home-bg-5.mp4' },
  { SRC: '/videos/home-bg-6.mp4' },
] as const;

/**
 * Much lighter than the pricing banner's scrim, and deliberately so: these clips are
 * near-black fields (mean luma ~10-25/255) with small bright highlights, so anything
 * heavier multiplies what little signal they have down to a flat black rectangle.
 */
export const HOMEPAGE_BG_VIDEO_SCRIM_CLASS =
  'absolute inset-0 bg-linear-to-b from-canvas/25 via-canvas/10 to-canvas/55' as const;

/**
 * Flat darkening pass, sitting above the scrim. It lives in the fixed layer rather than on
 * the page wrapper so the nav's 80px slot — which is rendered outside `main` — gets the
 * exact same treatment as the content below it and no seam shows at the boundary.
 */
export const HOMEPAGE_BG_VIDEO_OVERLAY_CLASS = 'absolute inset-0 bg-canvas/60' as const;
