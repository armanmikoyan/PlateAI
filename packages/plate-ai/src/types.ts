import type { MEAL_ANALYSIS_CONFIDENCE, MEAL_ANALYSIS_STATUS } from '@/constants.js';

export type MealAnalysisConfidence =
  (typeof MEAL_ANALYSIS_CONFIDENCE)[keyof typeof MEAL_ANALYSIS_CONFIDENCE];

export type MealAnalysisStatus =
  (typeof MEAL_ANALYSIS_STATUS)[keyof typeof MEAL_ANALYSIS_STATUS];

export type MealAnalysisResult = Readonly<{
  mealName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  confidence: MealAnalysisConfidence;
  notes: string | null;
}>;

export type MealAnalysisSummary = Readonly<{
  id: string;
  status: MealAnalysisStatus;
  imageMimeType: string;
  imageBase64: string;
  analysis: MealAnalysisResult | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}>;

export type MealAnalysisItemResponse = Readonly<{
  item: MealAnalysisSummary;
}>;

export type MealAnalysisListResponse = Readonly<{
  items: readonly MealAnalysisSummary[];
}>;

export type ImageAnalysisProviderId = 'gemini' | 'openai';

export type MealImageAnalysisInput = Readonly<{
  imageBase64: string;
  mimeType: string;
}>;

export type ImageAnalysisProviderConfig = Readonly<{
  provider: ImageAnalysisProviderId;
  apiKey: string;
  model: string;
}>;

export type ImageAnalysisProvider = Readonly<{
  id: ImageAnalysisProviderId;
  analyzeMeal: (input: MealImageAnalysisInput) => Promise<MealAnalysisResult>;
}>;
