export const MEAL_ANALYSIS_ROUTES = {
  MOUNT_PATH: '/meal-analyses',
  ROOT: '/',
  BY_ID: '/:id',
} as const;

export const MEAL_ANALYSIS_ERRORS = {
  NOT_SIGNED_IN: 'Not signed in.',
  NOT_FOUND: 'Meal analysis not found.',
  INVALID_BODY: 'Invalid request body.',
  SERVER_ERROR: 'Could not save meal analysis.',
} as const;

export const MEAL_ANALYSIS_JSON_LIMIT = '12mb' as const;
