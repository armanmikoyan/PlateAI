export const VENOM_FIBERS = {
  COUNT: 24,
  /** How far outside the button the cursor starts pulling the fibers. */
  PROXIMITY_PX: 84,
  /** Spread of fiber tips around the pointer, in px. */
  POINTER_RADIUS_PX: 9,
  /** Keep the tips just inside the button so they hug the edge when the cursor is outside. */
  POINTER_INSET_PX: 4,
  DPR_CAP: 2,
  BASE_WIDTH_PX: 1.7,
  SAMPLE_STEPS: 10,
} as const;

export const VENOM_FIBER_INK = '9, 9, 11';
export const VENOM_FIBER_SHEEN = '253, 230, 138';
