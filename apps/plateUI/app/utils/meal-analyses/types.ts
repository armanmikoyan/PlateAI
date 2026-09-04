import type {
  MealAnalysisResult,
  MealAnalysisStatus,
  MealAnalysisSummary,
} from '@plate/plate-ai/types';

export type SnapSavedMealCache = Readonly<{
  id: string;
  status: MealAnalysisStatus;
  imageMimeType: string;
  imageBase64: string;
  analysis: MealAnalysisResult | null;
}>;

export type AnalyzeResult =
  | { ok: true; locked: false; item: MealAnalysisSummary }
  | { ok: false; locked: true; status: 403 }
  | { ok: false; locked: false; status: number };
