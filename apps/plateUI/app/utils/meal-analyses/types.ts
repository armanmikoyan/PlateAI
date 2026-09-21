import type { MealAnalysisPreview, MealAnalysisStatus, MealAnalysisSummary } from '@plate/plate-ai/types';

export type SnapSavedMealCache = Readonly<{
  id: string;
  status: MealAnalysisStatus;
  analysis: MealAnalysisPreview | null;
}>;

export type AnalyzeResult =
  | { ok: true; item: MealAnalysisSummary }
  | {
      ok: false;
      status: number;
      message?: string;
      retryAfterSeconds?: number;
      planRequired?: boolean;
    };
