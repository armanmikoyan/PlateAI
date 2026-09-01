import { listMealAnalyses } from '@/app/api/meal-analyses/client';
import type { MealAnalysisListResponse } from '@/app/utils/meal-analyses/types';

export async function GET(request: Request): Promise<Response> {
  const cookieHeader = request.headers.get('cookie');
  const data = await listMealAnalyses(cookieHeader);

  if (!data) {
    return Response.json({ error: 'Could not load meal analyses.' }, { status: 401 });
  }

  return Response.json(data satisfies MealAnalysisListResponse);
}
