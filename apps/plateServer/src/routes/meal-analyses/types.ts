import type {
  MealAnalysisResult,
  MealAnalysisStatus,
} from '@plate/plate-ai/types';
import type { MealAnalysisDocument } from '@/models/meal-analysis.js';

export type MealAnalysisLockedResponse = Readonly<{
  error: string;
  locked: true;
}>;

export type CreateMealAnalysisBody = Readonly<{
  imageBase64: string;
  imageMimeType: string;
}>;

export type AnalyzeMealResult =
  | Readonly<{ ok: true; document: MealAnalysisDocument }>
  | Readonly<{ ok: false; status: number; error: string }>;

export type UpdateMealAnalysisBody = Readonly<{
  status: MealAnalysisStatus;
  analysis?: MealAnalysisResult;
  errorMessage?: string | null;
}>;
