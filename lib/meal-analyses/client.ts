import { readAuthServerUrl } from '@/lib/auth/config';
import type {
  CreateMealAnalysisResponse,
  MealAnalysisDetailResponse,
  MealAnalysisListResponse,
  MealAnalysisResult,
  UpdateMealAnalysisResponse,
} from '@/lib/meal-analyses/types';
import { MEAL_ANALYSIS_STATUS } from '@/lib/meal-analyses/constants';

type MealAnalysisRequestOptions = Readonly<{
  cookieHeader: string | null;
  method: 'GET' | 'POST' | 'PATCH';
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
    const response = await fetch(`${readAuthServerUrl()}/meal-analyses${path}`, init);

    if (!response.ok) {
      return { ok: false, status: response.status };
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
