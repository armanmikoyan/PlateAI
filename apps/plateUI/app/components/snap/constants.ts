import type { OrbState } from 'thinking-orbs/engine';

export const SNAP_ANALYSIS_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  PLAN_REQUIRED: 'plan_required',
} as const;

export const SNAP_HEADING_PHASE = {
  IDLE: 'idle',
  PHOTO_READY: 'photo_ready',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const SNAP_ORB = {
  /** Typed as `OrbState` so a state the package doesn't ship fails at compile time. */
  STATE: 'composing' satisfies OrbState,
  TUNED_SIZE: 64,
  FILL: 0.9,
  MAX_SIZE: 560,
  DPR_CAP: 2,
  GROW_MS: 900,
  TINT: { r: 240, g: 196, b: 0 },
} as const;

/**
 * Same critically damped spring as the nav bar's rest→condensed morph
 * (`nav-bar/constants.ts` → `NAV_MOTION_SPRING`), so the upload zone settles with
 * the navbar's physical feel instead of a one-off duration tween.
 */
export const SNAP_MOTION_SPRING = { type: 'spring', stiffness: 320, damping: 34, mass: 0.9 } as const;

export const SNAP_MOTION_REDUCED = { duration: 0 } as const;

/** Entrance for the post-upload stages — matches `snap-analysis-readout.tsx`. */
export const SNAP_STAGE_SPRING = { type: 'spring', bounce: 0, duration: 0.35 } as const;

/**
 * Wrapper for the `Card`s in the post-upload stages: `Card` is a plain div, so Motion
 * needs an element of its own to play the entrance on. `h-full` is load-bearing — it
 * carries the height down from the grid cell so the `Card`'s own `h-full` has something
 * definite to resolve against.
 */
export const SNAP_STAGE_ENTRANCE_CLASS = 'h-full w-full min-w-0' as const;

/** How far the analyze card compresses under the pointer, before the readout springs in. */
export const SNAP_STAGE_PRESS_SCALE = 0.98;

/**
 * The panel's stages. `snapPanelStageKey` resolves the current one, so the panel and the
 * heading can never disagree about what is on screen.
 */
export const SNAP_PANEL_STAGE = {
  LOADING: 'loading',
  ZONE: 'zone',
  PHOTO: 'photo',
  PLAN_REQUIRED: 'plan',
  ANALYSIS: 'analysis',
} as const;

/** Shell every stage renders inside — see `SNAP_STAGE_MIN_HEIGHT_CLASS`. */
export const SNAP_STAGE_SHELL_CLASS = 'flex w-full min-w-0 flex-col lg:min-h-0 lg:flex-1' as const;

/**
 * The right-column cards opt out of `Card`'s flat grey with a dotted field instead.
 * `relative` is required so the pattern layer has a containing block.
 */
export const SNAP_STAGE_CARD_SURFACE_CLASS = 'relative bg-surface-raised/20' as const;

/** Content inside those cards has to be positioned too, or the pattern paints over it. */
export const SNAP_STAGE_CARD_CONTENT_CLASS = 'relative z-10' as const;

/** Wide cell, because `DotPattern`'s `glow` tweens every dot in the field. */
export const SNAP_STAGE_DOTS_SPACING = 36;

export const SNAP_STAGE_DOTS_RADIUS = 1.25;

export const SNAP_STAGE_DOTS_PATTERN_CLASS = 'text-accent-mid/35' as const;

/** Expo-out, the easing the hero photo swap uses for its filter crossfades. */
export const SNAP_UPLOAD_RING_EASE = [0.22, 1, 0.36, 1] as const;

/** The zone's own radius is Motion-owned; `rounded-xl` is only the pre-hydration floor. */
export const SNAP_UPLOAD_ZONE_REST_RADIUS_PX = 12;

/** Dragging rounds the zone off — the navbar's condensed capsule reads the same way. */
export const SNAP_UPLOAD_ZONE_ARMED_RADIUS_PX = 24;

/** Inset collapses while dragging, the same trick the nav bar uses when it condenses. */
export const SNAP_UPLOAD_ZONE_REST_PADDING_PX = 24;

export const SNAP_UPLOAD_ZONE_ARMED_PADDING_PX = 32;

export const SNAP_UPLOAD_ANIM = {
  /** Barely-there tilt: this is a full-bleed drop target, not a marketing card. */
  MAX_TILT_DEG: 2,
  TILT_STIFFNESS: 260,
  TILT_DAMPING: 26,
  HOVER_SCALE: 1.004,
  HOVER_LIFT_PX: -2,
  PRESS_SCALE: 0.994,
  ARMED_SCALE: 1.01,
  ARMED_LIFT_PX: -6,
  RING_START_SCALE: 0.25,
  RING_END_SCALE: 1.5,
  RING_PEAK_OPACITY: 0.6,
  RING_MS: 620,
} as const;

/** Rest state: the plain dashed drop target — no lift, no radius change, no inset change. */
export const SNAP_UPLOAD_ZONE_REST = {
  borderRadius: SNAP_UPLOAD_ZONE_REST_RADIUS_PX,
  paddingLeft: SNAP_UPLOAD_ZONE_REST_PADDING_PX,
  paddingRight: SNAP_UPLOAD_ZONE_REST_PADDING_PX,
  scale: 1,
  y: 0,
} as const;

/** Pointer is over the zone (desktop only) — a 2px lift so the target feels live. */
export const SNAP_UPLOAD_ZONE_HOVER = {
  borderRadius: SNAP_UPLOAD_ZONE_REST_RADIUS_PX,
  paddingLeft: SNAP_UPLOAD_ZONE_REST_PADDING_PX,
  paddingRight: SNAP_UPLOAD_ZONE_REST_PADDING_PX,
  scale: SNAP_UPLOAD_ANIM.HOVER_SCALE,
  y: SNAP_UPLOAD_ANIM.HOVER_LIFT_PX,
} as const;

/** Pointer is held down: the zone compresses under the finger, the one spring that
 *  goes *in* — the drag state is the only one that grows. */
export const SNAP_UPLOAD_ZONE_PRESS = {
  borderRadius: SNAP_UPLOAD_ZONE_REST_RADIUS_PX,
  paddingLeft: SNAP_UPLOAD_ZONE_REST_PADDING_PX,
  paddingRight: SNAP_UPLOAD_ZONE_REST_PADDING_PX,
  scale: SNAP_UPLOAD_ANIM.PRESS_SCALE,
  y: 0,
} as const;

/** A file is over the zone, or the pointer is held down — the navbar's condensed shape. */
export const SNAP_UPLOAD_ZONE_ARMED = {
  borderRadius: SNAP_UPLOAD_ZONE_ARMED_RADIUS_PX,
  paddingLeft: SNAP_UPLOAD_ZONE_ARMED_PADDING_PX,
  paddingRight: SNAP_UPLOAD_ZONE_ARMED_PADDING_PX,
  scale: SNAP_UPLOAD_ANIM.ARMED_SCALE,
  y: SNAP_UPLOAD_ANIM.ARMED_LIFT_PX,
} as const;

/**
 * Perspective frame. `rotateX`/`rotateY` on the zone only read as a tilt when an
 * ancestor supplies the perspective, exactly like `use-case-card.tsx` — this is that
 * ancestor, and it carries the flex sizing the panel's content slot expects.
 */
export const SNAP_UPLOAD_ZONE_FRAME_CLASS =
  'flex min-h-0 w-full min-w-0 flex-1 flex-col [perspective:1200px]' as const;

/**
 * The zone box itself, not `Empty` — Motion has to own this element to spring the
 * radius and inset, and `Empty` is a plain div. Its base classes are inlined here;
 * everything inside is still composed from the `Empty*` design-system pieces.
 *
 * Only `paddingLeft`/`paddingRight` are animated, so the block padding stays static.
 */
export const SNAP_UPLOAD_ZONE_CLASS =
  'group relative isolate flex w-full min-w-0 flex-1 select-none flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border-dashed p-6 text-center text-balance transition-[background-color,border-color,box-shadow] duration-300 ease-out motion-reduce:transition-none min-h-72 sm:min-h-112 lg:min-h-128' as const;
/** Dragging or held: the dashed edge firms up to a solid CTA ring, like the nav capsule. */
export const SNAP_UPLOAD_ZONE_ARMED_CLASS =
  'border-cta bg-muted/40 shadow-[0_18px_40px_-24px_rgb(0_0_0/0.9)] contrast-more:border-edge-strong' as const;

/** Decorative layers sit at `z-0`, not behind the zone: the armed fill must show under them. */
export const SNAP_UPLOAD_SHINE_CLASS =
  'pointer-events-none absolute inset-y-0 z-0 w-1/4 -translate-x-[250%] -skew-x-12 bg-linear-to-r from-transparent via-accent/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[450%] motion-reduce:transition-none' as const;

/**
 * Click ripple. Anchored with `left`/`top` percentages plus Motion's `x`/`y` offsets so
 * `scale` stays free — a Tailwind translate here would be overwritten by the transform
 * Motion writes.
 */
export const SNAP_UPLOAD_RING_CLASS =
  'pointer-events-none absolute z-0 aspect-square rounded-full border-2 border-accent/60' as const;

/** Carries the copy above the zone plane so the tilt reads as depth, not just skew. */
export const SNAP_UPLOAD_ZONE_CONTENT_CLASS =
  'relative z-10 flex w-full flex-col items-center justify-center gap-4' as const;

export const SNAP_ANALYSIS_PLACEHOLDER = {
  TITLE: 'Meal analysis',
  BODY: 'Tap Analyze plate — calories, protein, and carbs appear here.',
} as const;

/** Photo HUD that plays while the analysis request is in flight. */
export const SNAP_SCAN = {
  LABEL: 'AI vision',
  STATUS: 'Scanning plate',
  CAPTION: 'Estimating portions',
  ID: 'SCAN 04',
  SWEEP_SECONDS: 3.6,
  GRID_SIZE_PX: 28,
} as const;

/** One clock for every scan layer, so the grid, beams, aura, and HUD stay in phase. */
export const SNAP_SCAN_SWEEP = {
  duration: SNAP_SCAN.SWEEP_SECONDS,
  repeat: Infinity,
  ease: 'linear',
} as const;

export const SNAP_SCAN_TINT_CLASS = 'absolute inset-0 bg-accent/10 mix-blend-screen' as const;

export const SNAP_SCAN_AURA_CLASS =
  'absolute aspect-square w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,rgb(251_191_36/0.4),rgb(125_211_252/0.32),rgb(251_113_133/0.26),rgb(251_191_36/0.4))] blur-2xl mix-blend-screen' as const;

export const SNAP_SCAN_GRID_MASK_CLASS =
  'absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_32%,transparent_82%)]' as const;

export const SNAP_SCAN_GRID_CLASS =
  'absolute [background-image:linear-gradient(to_right,rgb(125_211_252/0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgb(251_191_36/0.24)_1px,transparent_1px)]' as const;

/** Wireframe left behind the scan line, like a maze path being filled in. */
export const SNAP_SCAN_FILL_CLASS =
  'absolute inset-x-0 top-0 [background-image:linear-gradient(to_right,rgb(251_191_36/0.7)_1px,transparent_1px),linear-gradient(to_bottom,rgb(251_191_36/0.7)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black_70%,black_92%,transparent_100%)]' as const;

/** Same trail behind the left-to-right line. */
export const SNAP_SCAN_FILL_X_CLASS =
  'absolute inset-y-0 left-0 [background-image:linear-gradient(to_right,rgb(251_191_36/0.7)_1px,transparent_1px),linear-gradient(to_bottom,rgb(251_191_36/0.7)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,black_70%,black_92%,transparent_100%)]' as const;

export const SNAP_SCAN_SCRIM_CLASS =
  'absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgb(0_0_0/0.6)_100%)]' as const;

export const SNAP_SCAN_BEAM_CLASS = 'absolute inset-x-0 bottom-0 h-36' as const;

export const SNAP_SCAN_BEAM_GLOW_CLASS =
  'absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgb(251_191_36/0.05)_55%,rgb(251_191_36/0.2)_88%,rgb(253_230_138/0.4)_100%)]' as const;

export const SNAP_SCAN_BEAM_LINE_CLASS =
  'absolute inset-x-0 bottom-0 h-px bg-accent-soft shadow-[0_0_14px_3px_rgb(251_191_36/0.7)]' as const;

export const SNAP_SCAN_BEAM_TICKS_CLASS =
  'absolute inset-x-0 bottom-0 h-1 bg-[repeating-linear-gradient(to_right,rgb(251_191_36/0.75)_0_1px,transparent_1px_14px)]' as const;

export const SNAP_SCAN_MARKER_LEFT_CLASS =
  'absolute left-0.5 size-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-accent drop-shadow-[0_0_4px_rgb(251_191_36/0.8)]' as const;

export const SNAP_SCAN_MARKER_RIGHT_CLASS =
  'absolute right-0.5 size-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-accent drop-shadow-[0_0_4px_rgb(251_191_36/0.8)]' as const;

export const SNAP_SCAN_MARKER_TOP_CLASS =
  'absolute top-0.5 size-0 border-x-[4px] border-x-transparent border-t-[6px] border-t-accent drop-shadow-[0_0_4px_rgb(251_191_36/0.8)]' as const;

export const SNAP_SCAN_MARKER_BOTTOM_CLASS =
  'absolute bottom-0.5 size-0 border-x-[4px] border-x-transparent border-b-[6px] border-b-accent drop-shadow-[0_0_4px_rgb(251_191_36/0.8)]' as const;

export const SNAP_SCAN_VERTICAL_CLASS =
  'absolute inset-y-0 right-0 w-28 bg-[linear-gradient(to_right,transparent_0%,rgb(251_191_36/0.04)_45%,rgb(251_191_36/0.14)_92%,rgb(253_230_138/0.5)_100%)] mix-blend-screen' as const;

export const SNAP_SCAN_CORNER_CLASS = 'absolute size-5 border-accent/90 sm:size-6' as const;

export const SNAP_SCAN_LINES_CLASS =
  'absolute inset-0 opacity-[0.16] [background-image:repeating-linear-gradient(to_bottom,rgb(0_0_0/0.55)_0px,rgb(0_0_0/0.55)_1px,transparent_1px,transparent_3px)]' as const;

export const SNAP_SCAN_RULER_Y_CLASS =
  'absolute inset-y-6 w-1.5 bg-[repeating-linear-gradient(to_bottom,rgb(251_191_36/0.5)_0_1px,transparent_1px_8px)] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]' as const;

export const SNAP_SCAN_RULER_X_CLASS =
  'absolute inset-x-6 h-1.5 bg-[repeating-linear-gradient(to_right,rgb(251_191_36/0.5)_0_1px,transparent_1px_8px)] [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]' as const;

/** Normalised bar heights for the little bottom-left spectrum. */
export const SNAP_SCAN_SPECTRUM = [0.45, 0.85, 0.3, 0.7, 1, 0.55, 0.4] as const;

export const SNAP_LOCKED_REASON = {
  PLAN: 'plan',
  DAILY_LIMIT: 'daily-limit',
} as const;

export const SNAP = {
  TITLE: 'Snap a plate',
  SUBTITLE: 'Drop a meal photo. One clear shot of the plate is enough.',
  SUBTITLE_PHONE: 'Add a meal photo. One clear shot of the plate is enough.',
  DROP_TITLE: 'Drop a meal photo',
  DROP_TITLE_PHONE: 'Add a meal photo',
  DROP_BODY: 'PNG, JPG, or WebP. One clear shot of the plate is enough.',
  DROP_HINT: 'Click or drag to upload',
  FILE_INPUT_LABEL: 'Choose a meal photo',
  GALLERY: 'Choose photo',
  CAMERA: 'Camera',
  CAMERA_TITLE: 'Take a photo',
  CAMERA_BODY: 'Use the back camera for the plate, or switch to the front camera.',
  CAMERA_BODY_DESKTOP: 'This device only has a front camera.',
  CAMERA_BACK: 'Back',
  CAMERA_FRONT: 'Front',
  CAMERA_CAPTURE: 'Take photo',
  CAMERA_VIDEO_LABEL: 'Live camera preview',
  PREVIEW_ALT: 'Selected meal photo',
  PHOTO_SETTINGS_LABEL: 'Photo settings',
  REPLACE: 'Replace',
  REMOVE: 'Remove',
  ERROR_TITLE: 'Could not add that photo',
  ERROR_TYPE: 'Use a PNG, JPG, or WebP image.',
  ERROR_CAMERA: 'Could not open the camera. Allow access, or choose a photo instead.',
  ERROR_CAMERA_SECURE: 'Live camera needs HTTPS. On this site, tap Choose photo to use your camera instead.',
  ANALYZE: 'Analyze plate',
  ANALYZE_CTA: 'Tap to analyze',
  ANALYSIS_RETRY: 'Try again',
  LOADING_SAVED_MEAL: 'Loading your saved meal photo…',
  ANALYZING: 'Analyzing your plate…',
  SIGN_IN_REQUIRED: 'Sign in to analyze your photo.',
  ANALYSIS_ERROR: 'Could not analyze that photo. Try a clearer shot.',
  DAILY_LIMIT_TITLE: 'Daily analysis limit reached',
  DAILY_LIMIT_REACHED: 'All daily analyses used. New analyses unlock after midnight (UTC).',
  DAILY_LIMIT_TOAST_TIMEOUT_MS: 10000,
  PENDING_LIMIT_TITLE: 'Pending analysis limit reached',
  PENDING_LIMIT_REACHED:
    'You have reached the limit of saved analyses. Analyze or clear pending photos to upload more.',
  ANALYSIS_DETECTED: 'Detected meal',
  ANALYSIS_SCOPE: 'Estimated from your photo',
  CONFIDENCE_LOW: 'Low confidence',
  CONFIDENCE_MEDIUM: 'Medium confidence',
  CONFIDENCE_HIGH: 'High confidence',
  HEADING_PHOTO_READY_TITLE: 'Photo ready',
  HEADING_PHOTO_READY_SUBTITLE: 'Tap Analyze plate to estimate carbs, fat, and micronutrients.',
  HEADING_FREE_LIMIT_TITLE: 'Free plate used',
  HEADING_FREE_LIMIT_SUBTITLE:
    'You have used your free plate. Upgrade to a paid plan to analyze more and unlock full results.',
  HEADING_LOADING_TITLE: 'Analyzing your plate',
  HEADING_LOADING_SUBTITLE: 'Reading nutrition from your photo…',
  HEADING_LOCKED_SUBTITLE: 'Upgrade to a paid plan to see calories and protein, and analyze more plates.',
  HEADING_DAILY_LIMIT_TITLE: 'Daily analysis limit reached',
  HEADING_DAILY_LIMIT_SUBTITLE:
    'You have used all your analyses for today. Upgrade to Pro for more, or new analyses unlock after midnight (UTC).',
  HEADING_SHELL: 'min-h-[8.75rem] sm:min-h-[9.25rem]',
  HEADING_ERROR_TITLE: 'Analysis failed',
  HEADING_ERROR_SUBTITLE: 'We could not analyze that photo. Try again, or upload a clearer shot.',
  FREE_LIMIT_TITLE: 'Free plate used',
  FREE_LIMIT_REACHED:
    'You have used your free plate. Upgrade to a paid plan to analyze more and unlock full results.',
  PAYWALL_CTA: 'See plans',
  UNLOCK_CTA: 'Unlock results',
  PAYWALL_ARIA: 'Nutrition analysis locked — view pricing plans',
  PAYWALL_CTA_SHIMMER_BACKGROUND:
    'linear-gradient(165deg, var(--color-cta-soft) 0%, var(--color-cta) 48%, var(--color-cta-deep) 100%)',
  PAYWALL_CTA_SHIMMER_COLOR: 'var(--color-content)',
} as const;

export const SNAP_LOCKED_PREVIEW = {
  CONFIDENCE_LABEL: 'Confidence',
  NOTES_LABEL: 'Notes',
} as const;

/** Decoy values under blur — numeric/text results only, never real analysis data. */
export const SNAP_LOCKED_DECOY = {
  MEAL_NAME: '00000000',
  CONFIDENCE: '000000',
  NOTES: '0000000000000000000',
  NUTRIENT: '0',
} as const;

export const SNAP_CONFIDENCE_LABELS = {
  LOW: SNAP.CONFIDENCE_LOW,
  MEDIUM: SNAP.CONFIDENCE_MEDIUM,
  HIGH: SNAP.CONFIDENCE_HIGH,
} as const;

export const SNAP_CAMERA_BACK = 'environment' as const;
export const SNAP_CAMERA_FRONT = 'user' as const;
export const SNAP_CAMERA_CAPTURE_FILE = 'plate.jpg' as const;

/**
 * Height invariant for the stage slot, mirroring the nav bar's `NAV_HEADER_SLOT_PX`:
 * the slot never resizes, only its contents swap, so nothing below it moves.
 *
 * Above `lg` the slot is `flex-1` and inherits the leftover height from the panel
 * (which fills the viewport). Every stage must then fill that same box — the drop zone
 * via `flex-1`, the post-upload grid via `flex-1`, and every `Card` via `h-full`.
 * Drop any one of those and the page jumps the moment the stage changes.
 *
 * Below `lg` the panel is content-sized instead: the three stages stack there, and a
 * photo plus a readout cannot fit a phone viewport. Locking the slot to the leftover
 * pushed the CTA and the readout below the fold, so the page scrolls instead and the
 * `min-h-*` floor below is what keeps the drop zone filling the screen.
 */
export const SNAP_STAGE_MIN_HEIGHT_CLASS = 'min-h-[24rem] sm:min-h-112 lg:min-h-128' as const;

/**
 * Page-wide background loop behind the snap panel. `muted` + `playsInline` are both
 * required for mobile autoplay — without `playsInline` iOS Safari hijacks the video
 * into its own fullscreen player. The poster is the paint-before-decode frame and the
 * reduced-motion end state.
 */
export const SNAP_BG_VIDEO_SRC = '/videos/snap-bg.mp4' as const;

export const SNAP_BG_VIDEO_POSTER = '/videos/snap-bg-poster.jpg' as const;

/** Scrim over the loop. The panel cards are translucent, so this is what keeps them legible. */
export const SNAP_BG_VIDEO_SCRIM_CLASS = 'absolute inset-0 bg-canvas/72' as const;

export const SNAP_PHOTO_CARD_SHELL = 'relative h-full w-full gap-0 overflow-hidden py-0' as const;

export const SNAP_ANALYSIS_CARD_SHELL = 'relative h-full w-full gap-0 overflow-hidden py-0' as const;

/**
 * Phones stack the three cells, so the row track decides the preview's height. `1fr`
 * rows would only resolve against the leftover *above* `lg` (the grid is content-sized
 * there), and three auto rows would hand the photo nothing at all — so the photo gets a
 * real track of its own and the arrow and readout keep their content height. `lg`
 * restores the side-by-side row where the cards share the leftover.
 */
export const SNAP_STAGE_GRID_SHELL =
  'relative grid w-full min-w-0 flex-1 grid-cols-1 grid-rows-[20rem_auto_auto] gap-5 sm:grid-rows-[24rem_auto_auto] [&>*]:min-w-0 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:grid-rows-1 lg:items-start lg:gap-8' as const;

/**
 * Grid cells must be `h-full` too: `h-full` on the `Card` resolves against the cell,
 * and a content-sized (`items-start`) cell would collapse that back to `auto`.
 */
export const SNAP_STAGE_CELL_CLASS = 'relative z-0 h-full w-full min-w-0' as const;

export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const ACCEPTED_IMAGE_ACCEPT = ACCEPTED_IMAGE_TYPES.join(',');

export const SNAP_IMAGE_COMPRESSION = {
  MAX_DIMENSION_PX: 1600,
  JPEG_QUALITY: 0.8,
  OUTPUT_MIME_TYPE: 'image/jpeg',
  MIN_SOURCE_BYTES: 200 * 1024,
} as const;
