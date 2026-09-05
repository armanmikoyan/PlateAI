import { getMealAnalysis } from '@/app/api/meal-analyses/client';
import type { MealAnalysisItemResponse } from '@plate/plate-ai/types';

type MealAnalysisRouteContext = Readonly<{
  params: Promise<{ id: string }>;
}>;

export async function GET(request: Request, context: MealAnalysisRouteContext): Promise<Response> {
  const { id } = await context.params;
  const cookieHeader = request.headers.get('cookie');
  const data = await getMealAnalysis(cookieHeader, id);

  if (!data) {
    return Response.json({ error: 'Meal analysis not found.' }, { status: 404 });
  }

  return Response.json(data satisfies MealAnalysisItemResponse);
}
