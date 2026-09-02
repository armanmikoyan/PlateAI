import { readPlateServerUrl } from '@/app/api/auth/utils';
import type {
  AnalyzeMealAnalysisResponse,
  AnalyzeResult,
  CreateMealAnalysisResponse,
  MealAnalysisDetailResponse,
  MealAnalysisListResponse,
  MealAnalysisResult,
  UpdateMealAnalysisResponse,
} from '@/app/utils/meal-analyses/types';
import { MEAL_ANALYSIS_STATUS } from '@/app/utils/meal-analyses/constants';

type MealAnalysisRequestOptions = Readonly<{
  cookieHeader: string | null;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
}>;

async function mealAnalysisRequest<T>({
  cookieHeader,
  method,
  path,
  body,
}: MealAnalysisRequestOptions): Promise<{ ok: true; data: T } | { ok: false; status: number }> {
  if (!cookieHeader) {
    return { ok: false, status: 401 };
  }

  const init: RequestInit = {
    method,
    headers: {
      cookie: cookieHeader,
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    cache: 'no-store',
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const response = await fetch(`${readPlateServerUrl()}/meal-analyses${path}`, init);

    if (!response.ok) {
      return { ok: false, status: response.status };
    }

    if (response.status === 204) {
      return { ok: true, data: undefined as T };
    }

    const data = (await response.json()) as T;
    return { ok: true, data };
  } catch {
    return { ok: false, status: 502 };
  }
}

export async function createPendingMealAnalysis(
  cookieHeader: string | null,
  imageBase64: string,
  imageMimeType: string,
): Promise<CreateMealAnalysisResponse | null> {
  const result = await mealAnalysisRequest<CreateMealAnalysisResponse>({
    cookieHeader,
    method: 'POST',
    path: '',
    body: { imageBase64, imageMimeType },
  });

  return result.ok ? result.data : null;
}

export async function listMealAnalyses(
  cookieHeader: string | null,
): Promise<MealAnalysisListResponse | null> {
  const result = await mealAnalysisRequest<MealAnalysisListResponse>({
    cookieHeader,
    method: 'GET',
    path: '',
  });

  return result.ok ? result.data : null;
}

export async function getMealAnalysis(
  cookieHeader: string | null,
  analysisId: string,
): Promise<MealAnalysisDetailResponse | null> {
  const result = await mealAnalysisRequest<MealAnalysisDetailResponse>({
    cookieHeader,
    method: 'GET',
    path: `/${analysisId}`,
  });

  return result.ok ? result.data : null;
}

export async function markMealAnalysisDone(
  cookieHeader: string | null,
  analysisId: string,
  analysis: MealAnalysisResult,
): Promise<UpdateMealAnalysisResponse | null> {
  const result = await mealAnalysisRequest<UpdateMealAnalysisResponse>({
    cookieHeader,
    method: 'PATCH',
    path: `/${analysisId}`,
    body: {
      status: MEAL_ANALYSIS_STATUS.DONE,
      analysis,
    },
  });

  return result.ok ? result.data : null;
}

export async function markMealAnalysisFailed(
  cookieHeader: string | null,
  analysisId: string,
  errorMessage: string,
): Promise<UpdateMealAnalysisResponse | null> {
  const result = await mealAnalysisRequest<UpdateMealAnalysisResponse>({
    cookieHeader,
    method: 'PATCH',
    path: `/${analysisId}`,
    body: {
      status: MEAL_ANALYSIS_STATUS.FAILED,
      errorMessage,
    },
  });

  return result.ok ? result.data : null;
}

export async function deleteMealAnalysis(
  cookieHeader: string | null,
  analysisId: string,
): Promise<boolean> {
  if (!cookieHeader) {
    return false;
  }

  const result = await mealAnalysisRequest<never>({
    cookieHeader,
    method: 'DELETE',
    path: `/${analysisId}`,
  });

  return result.ok;
}

export async function analyzeMealAnalysis(
  cookieHeader: string | null,
  analysisId: string,
): Promise<AnalyzeResult> {
  if (!cookieHeader) {
    return { ok: false, locked: false, status: 401 };
  }

  const result = await mealAnalysisRequest<AnalyzeMealAnalysisResponse>({
    cookieHeader,
    method: 'POST',
    path: `/${analysisId}/analyze`,
  });

  if (!result.ok) {
    if (result.status === 403) {
      return { ok: false, locked: true, status: 403 };
    }

    return { ok: false, locked: false, status: result.status };
  }

  return { ok: true, locked: false, item: result.data.item };
}
