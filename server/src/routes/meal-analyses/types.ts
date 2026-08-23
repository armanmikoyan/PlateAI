import type { MealAnalysisConfidence, MealAnalysisStatus } from '@/models/meal-analysis-constants.js';

export type MealAnalysisResultDto = Readonly<{
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
  analysis: MealAnalysisResultDto | null;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}>;

export type MealAnalysisDetail = MealAnalysisSummary;

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

export type CreateMealAnalysisBody = Readonly<{
  imageBase64: string;
  imageMimeType: string;
}>;

export type UpdateMealAnalysisBody = Readonly<{
  status: MealAnalysisStatus;
  analysis?: MealAnalysisResultDto;
  errorMessage?: string | null;
}>;

export type MealAnalysisErrorResponse = Readonly<{
  error: string;
}>;
