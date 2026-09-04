import type {
  ImageAnalysisProviderId,
  MealAnalysisConfidence,
  MealAnalysisResult,
} from '@/types.js';

export const MEAL_ANALYSIS_STATUS = {
  PENDING: 'pending',
  DONE: 'done',
  FAILED: 'failed',
} as const;

export const MEAL_ANALYSIS_CONFIDENCE = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const MEAL_ANALYSIS_CONFIDENCE_VALUES: readonly MealAnalysisConfidence[] = Object.values(
  MEAL_ANALYSIS_CONFIDENCE,
);

export const IMAGE_ANALYSIS_PROVIDER = {
  GEMINI: 'gemini',
  OPENAI: 'openai',
} as const;

export const DEFAULT_IMAGE_ANALYSIS_MODEL = {
  GEMINI: 'gemini-3.6-flash',
  OPENAI: 'gpt-4o-mini',
} as const;

export const DEFAULT_IMAGE_ANALYSIS_MODELS: Readonly<
  Record<ImageAnalysisProviderId, string>
> = {
  [IMAGE_ANALYSIS_PROVIDER.GEMINI]: DEFAULT_IMAGE_ANALYSIS_MODEL.GEMINI,
  [IMAGE_ANALYSIS_PROVIDER.OPENAI]: DEFAULT_IMAGE_ANALYSIS_MODEL.OPENAI,
};

export const MEAL_IMAGE_ANALYSIS_PROMPT = `You analyze meal photos and return estimated nutrition.

Return ONLY valid JSON with this exact shape:
{
  "mealName": string,
  "calories": number,
  "proteinG": number,
  "carbsG": number,
  "fatG": number,
  "confidence": "low" | "medium" | "high",
  "notes": string | null
}

Rules:
- mealName: short label for the main dish (e.g. "Grilled salmon bowl").
- calories, proteinG, carbsG, fatG: non-negative numbers; round to whole numbers.
- confidence: how sure you are from the photo alone.
- notes: one short sentence about uncertainty, or null if none.
- Do not wrap JSON in markdown fences.` as const;

export const MEAL_IMAGE_ANALYSIS_TEST_FIXTURE: MealAnalysisResult = {
  mealName: 'Chicken bowl',
  calories: 520,
  proteinG: 42,
  carbsG: 38,
  fatG: 18,
  confidence: 'high' satisfies MealAnalysisConfidence,
  notes: 'Test mode — sample analysis, no API call.',
};

export const MEAL_IMAGE_ANALYSIS_TEST_DELAY_MS = {
  MIN: 3000,
  MAX: 4000,
} as const;
