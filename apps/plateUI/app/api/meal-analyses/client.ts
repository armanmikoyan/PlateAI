import { readPlateServerUrl } from '@/app/api/auth/utils';
import type { MealAnalysisItemResponse, MealAnalysisListResponse } from '@plate/plate-ai/types';
import { retryAfterSecondsFromHeader } from '@/app/utils/rate-limit/utils';
import type { AnalyzeResult } from '@/app/utils/meal-analyses/types';

type MealAnalysisRequestOptions = Readonly<{
  cookieHeader: string | null;
  forwardedFor?: string | null;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
}>;

type MealAnalysisRequestFailure = Readonly<{
  ok: false;
  status: number;
  message?: string;
  retryAfterSeconds?: number;
  planRequired?: boolean;
}>;

type MealAnalysisRequestResult<T> = Readonly<{ ok: true; data: T }> | MealAnalysisRequestFailure;

async function mealAnalysisRequest<T>({
  cookieHeader,
  forwardedFor = null,
  method,
  path,
  body,
}: MealAnalysisRequestOptions): Promise<MealAnalysisRequestResult<T>> {
  if (!cookieHeader) {
    return { ok: false, status: 401 };
  }

  const init: RequestInit = {
    method,
    headers: {
      cookie: cookieHeader,
      ...(forwardedFor ? { 'x-forwarded-for': forwardedFor } : {}),
      ...(body ? { 'content-type': 'application/json' } : {}),
    },
    cache: 'no-store',
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  try {
    const response = await fetch(`${readPlateServerUrl()}/meal-analyses${path}`, init);

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        planRequired?: boolean;
      } | null;
      return {
        ok: false,
        status: response.status,
        message: payload?.error,
        retryAfterSeconds: retryAfterSecondsFromHeader(response.headers.get('retry-after')),
        planRequired: payload?.planRequired === true,
      };
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

type CreatePendingMealAnalysisResult =
  | Readonly<{ ok: true; item: MealAnalysisItemResponse }>
  | Readonly<{ ok: false; status: number; message?: string; planRequired?: boolean }>;

export async function createPendingMealAnalysis(
  cookieHeader: string | null,
  imageBase64: string,
  imageMimeType: string,
  forwardedFor?: string | null,
): Promise<CreatePendingMealAnalysisResult> {
  const result = await mealAnalysisRequest<MealAnalysisItemResponse>({
    cookieHeader,
    forwardedFor,
    method: 'POST',
    path: '',
    body: { imageBase64, imageMimeType },
  });

  if (!result.ok) {
    return {
      ok: false,
      status: result.status,
      message: result.message,
      planRequired: result.planRequired,
    };
  }

  return { ok: true, item: result.data };
}

export async function listMealAnalyses(
  cookieHeader: string | null,
  forwardedFor?: string | null,
): Promise<MealAnalysisListResponse | null> {
  const result = await mealAnalysisRequest<MealAnalysisListResponse>({
    cookieHeader,
    forwardedFor,
    method: 'GET',
    path: '',
  });

  return result.ok ? result.data : null;
}

export async function getMealAnalysis(
  cookieHeader: string | null,
  analysisId: string,
  forwardedFor?: string | null,
): Promise<MealAnalysisItemResponse | null> {
  const result = await mealAnalysisRequest<MealAnalysisItemResponse>({
    cookieHeader,
    forwardedFor,
    method: 'GET',
    path: `/${analysisId}`,
  });

  return result.ok ? result.data : null;
}

export async function deleteMealAnalysis(
  cookieHeader: string | null,
  analysisId: string,
  forwardedFor?: string | null,
): Promise<boolean> {
  const result = await mealAnalysisRequest<undefined>({
    cookieHeader,
    forwardedFor,
    method: 'DELETE',
    path: `/${analysisId}`,
  });

  return result.ok;
}

export async function analyzeMealAnalysis(
  cookieHeader: string | null,
  analysisId: string,
  forwardedFor?: string | null,
): Promise<AnalyzeResult> {
  if (!cookieHeader) {
    return { ok: false, status: 401 };
  }

  const result = await mealAnalysisRequest<MealAnalysisItemResponse>({
    cookieHeader,
    forwardedFor,
    method: 'POST',
    path: `/${analysisId}/analyze`,
  });

  if (!result.ok) {
    return {
      ok: false,
      status: result.status,
      message: result.message,
      retryAfterSeconds: result.retryAfterSeconds,
    };
  }

  return { ok: true, item: result.data.item };
}
