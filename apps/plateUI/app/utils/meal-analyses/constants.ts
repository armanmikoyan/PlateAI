export const MEAL_ANALYSIS_STATUS = {
  PENDING: 'pending',
  DONE: 'done',
  FAILED: 'failed',
} as const;

export type MealAnalysisStatus = (typeof MEAL_ANALYSIS_STATUS)[keyof typeof MEAL_ANALYSIS_STATUS];

export const MEAL_ANALYSIS_CONFIDENCE = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export type MealAnalysisConfidence =
  (typeof MEAL_ANALYSIS_CONFIDENCE)[keyof typeof MEAL_ANALYSIS_CONFIDENCE];

export const SNAP_SAVED_MEAL_CACHE_PREFIX = 'meal-ai:snap-resume:v1:' as const;

export const MEAL_ANALYSES_CHANGED_EVENT = 'meal-analyses-changed' as const;
