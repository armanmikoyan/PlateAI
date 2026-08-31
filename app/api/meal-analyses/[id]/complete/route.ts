import { analyzeMealAnalysis } from '@/app/api/meal-analyses/client';
import type { MealAnalysisResult } from '@/app/utils/meal-analyses/types';

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
  return Response.json(
    { error: message, ...(locked ? { locked: true } : {}) } satisfies CompleteMealAnalysisErrorResponse,
    { status },
  );
}

export async function POST(
  request: Request,
  context: CompleteMealAnalysisRouteContext,
): Promise<Response> {
  const { id } = await context.params;
  const cookieHeader = request.headers.get('cookie');
  const result = await analyzeMealAnalysis(cookieHeader, id);

  if (!result.ok) {
    if (result.locked) {
      return errorResponse('Paid plan required to analyze this meal.', 403, true);
    }

    if (result.status === 404) {
      return errorResponse('Meal analysis not found.', 404);
    }

    if (result.status === 409) {
      return errorResponse('This meal analysis cannot be completed.', 409);
    }

    return errorResponse('Could not analyze that photo. Try a clearer shot.', 502);
  }

  const analysis = result.item.analysis;

  if (!analysis) {
    return errorResponse('Could not analyze that photo. Try a clearer shot.', 502);
  }

  return Response.json({ analysis, id: result.item.id } satisfies CompleteMealAnalysisResponse);
}
