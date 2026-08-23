import { MEAL_ANALYSIS_STATUS, type MealAnalysisStatus } from '@/lib/meal-analyses/constants';

export type MealAnalysisConfidence = 'low' | 'medium' | 'high';

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

export type MealAnalysisDetail = MealAnalysisSummary;

export type SnapSavedMealCache = Readonly<{
  id: string;
  status: MealAnalysisStatus;
  imageMimeType: string;
  imageBase64: string;
  analysis: MealAnalysisResult | null;
}>;

export type MealAnalysisListResponse = Readonly<{
  items: readonly MealAnalysisSummary[];
}>;

export type MealAnalysisDetailResponse = Readonly<{
  item: MealAnalysisDetail;
}>;

export type CreateMealAnalysisResponse = Readonly<{
  item: MealAnalysisDetail;
}>;

export type UpdateMealAnalysisResponse = Readonly<{
  item: MealAnalysisSummary;
}>;

export type MealAnalysisErrorResponse = Readonly<{
  error: string;
}>;

export { MEAL_ANALYSIS_STATUS };
