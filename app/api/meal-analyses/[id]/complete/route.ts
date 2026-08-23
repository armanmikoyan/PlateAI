import { analyzeMealImage } from '@/lib/ai/analyze-meal-image';
import { AiConfigError, AiParseError, AiProviderError } from '@/lib/ai/errors';
import { fetchAuthUser } from '@/lib/auth/me';
import { isSnapAnalysisLocked } from '@/lib/billing/entitlements';
import {
  getMealAnalysis,
  markMealAnalysisDone,
  markMealAnalysisFailed,
} from '@/lib/meal-analyses/client';
import { MEAL_ANALYSIS_STATUS } from '@/lib/meal-analyses/constants';
import type { MealAnalysisResult } from '@/lib/meal-analyses/types';

type CompleteMealAnalysisResponse = Readonly<{
  analysis: MealAnalysisResult;
  id: string;
}>;

type CompleteMealAnalysisErrorResponse = Readonly<{
  error: string;
  locked?: true;
}>;

type CompleteMealAnalysisRouteContext = Readonly<{
  params: Promise<{ id: string }>;
}>;

function errorResponse(message: string, status: number, locked = false) {
  return Response.json({ error: message, ...(locked ? { locked: true } : {}) } satisfies CompleteMealAnalysisErrorResponse, {
    status,
  });
}

export async function POST(request: Request, context: CompleteMealAnalysisRouteContext): Promise<Response> {
  const { id } = await context.params;
  const cookieHeader = request.headers.get('cookie');
  const user = await fetchAuthUser(cookieHeader);

  if (!user) {
    return errorResponse('Sign in required.', 401);
  }

  if (isSnapAnalysisLocked(user)) {
    return errorResponse('Paid plan required to analyze this meal.', 403, true);
  }

  const detail = await getMealAnalysis(cookieHeader, id);

  if (!detail) {
    return errorResponse('Meal analysis not found.', 404);
  }

  if (detail.item.status === MEAL_ANALYSIS_STATUS.DONE && detail.item.analysis) {
    return Response.json({
      analysis: detail.item.analysis,
      id: detail.item.id,
    } satisfies CompleteMealAnalysisResponse);
  }

  if (detail.item.status !== MEAL_ANALYSIS_STATUS.PENDING && detail.item.status !== MEAL_ANALYSIS_STATUS.FAILED) {
    return errorResponse('This meal analysis cannot be completed.', 409);
  }

  try {
    const analysis = await analyzeMealImage({
      imageBase64: detail.item.imageBase64,
      mimeType: detail.item.imageMimeType,
    });

    const updated = await markMealAnalysisDone(cookieHeader, id, analysis);

    if (!updated) {
      return errorResponse('Could not save meal analysis.', 502);
    }

    return Response.json({
      analysis,
      id,
    } satisfies CompleteMealAnalysisResponse);
  } catch (error) {
    const message =
      error instanceof AiConfigError
        ? 'Meal analysis is not configured on this server.'
        : error instanceof AiParseError || error instanceof AiProviderError
          ? 'Could not analyze that photo. Try a clearer shot.'
          : 'Something went wrong while analyzing the photo.';

    await markMealAnalysisFailed(cookieHeader, id, message);

    return errorResponse(message, error instanceof AiConfigError ? 503 : 502);
  }
}
