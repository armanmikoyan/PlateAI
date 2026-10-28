/** Full-page replacement for the retired homepage background video. */
export const HOMEPAGE_BG_SHELL_CLASS =
  'pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas' as const;

/** Warm and cool pools of light behind the hero. */
export const HOMEPAGE_BG_GLOW_CLASS =
  'absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_38%,rgb(251_191_36/0.12),transparent_72%),radial-gradient(45%_45%_at_80%_20%,rgb(125_211_252/0.06),transparent_72%)]' as const;

/** The untouched meal-scan grid, with the yellow maze drawn on top of its lines. */
export const HOMEPAGE_BG_GRID_WRAPPER_CLASS = 'absolute inset-0 opacity-55' as const;

export const HOMEPAGE_BG_MAZE_CANVAS_CLASS = 'absolute inset-0 size-full' as const;

export const HOMEPAGE_BG_VIGNETTE_CLASS =
  'absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgb(0_0_0/0.75)_100%)]' as const;

export const HOMEPAGE_CURSOR_CELL_CLASS =
  'pointer-events-none absolute border border-accent/80 bg-accent/10 shadow-[0_0_18px_rgb(251_191_36/0.35),inset_0_0_10px_rgb(251_191_36/0.18)]' as const;

/**
 * A circular front expands from the grid vertex at the viewport center, revealing every
 * square edge it passes. All directions grow at the same rate until the grid is covered.
 */
export const HOMEPAGE_BG_MAZE = {
  SPREAD_DURATION_S: 3,
  LINE_WIDTH_PX: 1,
  MAX_FRAME_STEP_S: 0.05,
  RESIZE_DEBOUNCE_MS: 180,
  DPR_CAP: 2,
  TRAIL_COLOR: 'rgba(251, 191, 36, 0.34)',
  ACTIVE_COLOR: 'rgba(253, 230, 138, 0.56)',
} as const;
