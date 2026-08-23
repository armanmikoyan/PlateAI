export type AcceptedImageType = 'image/jpeg' | 'image/png' | 'image/webp';

export const SNAP_ANALYSIS_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type SnapAnalysisStatus =
  (typeof SNAP_ANALYSIS_STATUS)[keyof typeof SNAP_ANALYSIS_STATUS];

export const SNAP_HEADING_PHASE = {
  IDLE: 'idle',
  PHOTO_READY: 'photo_ready',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type SnapHeadingPhase = (typeof SNAP_HEADING_PHASE)[keyof typeof SNAP_HEADING_PHASE];

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
  ERROR_CAMERA_SECURE:
    'Live camera needs HTTPS. On this site, tap Choose photo to use your camera instead.',
  ANALYZE: 'Analyze plate',
  ANALYZE_CTA: 'Tap to analyze',
  ANALYZING: 'Analyzing your plate…',
  SIGN_IN_REQUIRED: 'Sign in to analyze your photo.',
  ANALYSIS_ERROR: 'Could not analyze that photo. Try again with a clearer shot.',
  ANALYSIS_DETECTED: 'Detected meal',
  ANALYSIS_SCOPE: 'Estimated from your photo',
  CONFIDENCE_LOW: 'Low confidence',
  CONFIDENCE_MEDIUM: 'Medium confidence',
  CONFIDENCE_HIGH: 'High confidence',
  MACRO_CALORIES: 'Calories',
  MACRO_PROTEIN: 'Protein',
  MACRO_CARBS: 'Carbs',
  MACRO_FAT: 'Fat',
  HEADING_PHOTO_READY_TITLE: 'Photo ready',
  HEADING_PHOTO_READY_SUBTITLE: 'Tap Analyze plate to estimate calories and macros.',
  HEADING_LOADING_TITLE: 'Analyzing your plate',
  HEADING_LOADING_SUBTITLE: 'Reading nutrition from your photo…',
  HEADING_LOCKED_TITLE: 'Paid plan required to unlock results',
  HEADING_LOCKED_SUBTITLE:
    'Your photo is ready. Upgrade to Plus or Pro to see calories, macros, and the full breakdown.',
  HEADING_SHELL: 'min-h-[8.75rem] sm:min-h-[9.25rem]',
  HEADING_NOT_DETECTED_TITLE: 'Meal not detected',
  HEADING_NOT_DETECTED_SUBTITLE: 'Try a clearer shot of the full plate, then analyze again.',
  PAYWALL_CTA: 'See plans',
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
  CALORIES: '0',
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

export const SNAP_PHOTO_CARD_SHELL =
  'relative h-72 w-full gap-0 overflow-hidden py-0 sm:h-80 lg:h-128' as const;

export const SNAP_ANALYSIS_CARD_SHELL =
  'relative w-full gap-0 overflow-hidden py-0' as const;

export const SNAP_STAGE_GRID_SHELL =
  'relative grid w-full min-w-0 grid-cols-1 items-start gap-5 [&>*]:min-w-0 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-8' as const;

export const ACCEPTED_IMAGE_TYPES: readonly AcceptedImageType[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const ACCEPTED_IMAGE_ACCEPT = ACCEPTED_IMAGE_TYPES.join(',');
