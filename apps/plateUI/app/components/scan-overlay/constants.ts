/** HUD copy and timing shared by every scan overlay. */
export const SCAN_OVERLAY = {
  LABEL: 'AI vision',
  STATUS: 'Scanning plate',
  CAPTION: 'Estimating portions',
  ID: 'SCAN 04',
  SWEEP_SECONDS: 3.6,
  GRID_SIZE_PX: 28,
} as const;

/** One clock for every scan layer, so the grid, beams, aura, and HUD stay in phase. */
export const SCAN_OVERLAY_SWEEP = {
  duration: SCAN_OVERLAY.SWEEP_SECONDS,
  repeat: Infinity,
  ease: 'linear',
} as const;

export const SCAN_OVERLAY_TINT_CLASS = 'absolute inset-0 bg-accent/10 mix-blend-screen' as const;

export const SCAN_OVERLAY_AURA_CLASS =
  'absolute aspect-square w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[conic-gradient(from_0deg,rgb(251_191_36/0.4),rgb(125_211_252/0.32),rgb(251_113_133/0.26),rgb(251_191_36/0.4))] blur-2xl mix-blend-screen' as const;

export const SCAN_OVERLAY_GRID_MASK_CLASS =
  'absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_32%,transparent_82%)]' as const;

export const SCAN_OVERLAY_GRID_CLASS =
  'absolute [background-image:linear-gradient(to_right,rgb(125_211_252/0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgb(251_191_36/0.24)_1px,transparent_1px)]' as const;

/** Wireframe left behind the scan line, like a maze path being filled in. */
export const SCAN_OVERLAY_FILL_CLASS =
  'absolute inset-x-0 top-0 [background-image:linear-gradient(to_right,rgb(251_191_36/0.7)_1px,transparent_1px),linear-gradient(to_bottom,rgb(251_191_36/0.7)_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,black_70%,black_92%,transparent_100%)]' as const;

/** Same trail behind the left-to-right line. */
export const SCAN_OVERLAY_FILL_X_CLASS =
  'absolute inset-y-0 left-0 [background-image:linear-gradient(to_right,rgb(251_191_36/0.7)_1px,transparent_1px),linear-gradient(to_bottom,rgb(251_191_36/0.7)_1px,transparent_1px)] [mask-image:linear-gradient(to_right,black_70%,black_92%,transparent_100%)]' as const;

export const SCAN_OVERLAY_SCRIM_CLASS =
  'absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgb(0_0_0/0.6)_100%)]' as const;

export const SCAN_OVERLAY_BEAM_CLASS = 'absolute inset-x-0 bottom-0 h-36' as const;

export const SCAN_OVERLAY_BEAM_GLOW_CLASS =
  'absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgb(251_191_36/0.05)_55%,rgb(251_191_36/0.2)_88%,rgb(253_230_138/0.4)_100%)]' as const;

export const SCAN_OVERLAY_BEAM_LINE_CLASS =
  'absolute inset-x-0 bottom-0 h-px bg-accent-soft shadow-[0_0_14px_3px_rgb(251_191_36/0.7)]' as const;

export const SCAN_OVERLAY_BEAM_TICKS_CLASS =
  'absolute inset-x-0 bottom-0 h-1 bg-[repeating-linear-gradient(to_right,rgb(251_191_36/0.75)_0_1px,transparent_1px_14px)]' as const;

export const SCAN_OVERLAY_MARKER_LEFT_CLASS =
  'absolute left-0.5 size-0 border-y-[4px] border-y-transparent border-l-[6px] border-l-accent drop-shadow-[0_0_4px_rgb(251_191_36/0.8)]' as const;

export const SCAN_OVERLAY_MARKER_RIGHT_CLASS =
  'absolute right-0.5 size-0 border-y-[4px] border-y-transparent border-r-[6px] border-r-accent drop-shadow-[0_0_4px_rgb(251_191_36/0.8)]' as const;

export const SCAN_OVERLAY_MARKER_TOP_CLASS =
  'absolute top-0.5 size-0 border-x-[4px] border-x-transparent border-t-[6px] border-t-accent drop-shadow-[0_0_4px_rgb(251_191_36/0.8)]' as const;

export const SCAN_OVERLAY_MARKER_BOTTOM_CLASS =
  'absolute bottom-0.5 size-0 border-x-[4px] border-x-transparent border-b-[6px] border-b-accent drop-shadow-[0_0_4px_rgb(251_191_36/0.8)]' as const;

export const SCAN_OVERLAY_VERTICAL_CLASS =
  'absolute inset-y-0 right-0 w-28 bg-[linear-gradient(to_right,transparent_0%,rgb(251_191_36/0.04)_45%,rgb(251_191_36/0.14)_92%,rgb(253_230_138/0.5)_100%)] mix-blend-screen' as const;

export const SCAN_OVERLAY_CORNER_CLASS = 'absolute size-5 border-accent/90 sm:size-6' as const;

export const SCAN_OVERLAY_LINES_CLASS =
  'absolute inset-0 opacity-[0.16] [background-image:repeating-linear-gradient(to_bottom,rgb(0_0_0/0.55)_0px,rgb(0_0_0/0.55)_1px,transparent_1px,transparent_3px)]' as const;

export const SCAN_OVERLAY_RULER_Y_CLASS =
  'absolute inset-y-6 w-1.5 bg-[repeating-linear-gradient(to_bottom,rgb(251_191_36/0.5)_0_1px,transparent_1px_8px)] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]' as const;

export const SCAN_OVERLAY_RULER_X_CLASS =
  'absolute inset-x-6 h-1.5 bg-[repeating-linear-gradient(to_right,rgb(251_191_36/0.5)_0_1px,transparent_1px_8px)] [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent)]' as const;

/** Normalised bar heights for the little bottom-left spectrum. */
export const SCAN_OVERLAY_SPECTRUM = [0.45, 0.85, 0.3, 0.7, 1, 0.55, 0.4] as const;
