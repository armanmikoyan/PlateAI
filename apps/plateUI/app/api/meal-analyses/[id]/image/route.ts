import { proxyToApiServer } from '@/app/api/auth/utils';

type MealAnalysisImageRouteContext = Readonly<{
  params: Promise<{ id: string }>;
}>;

export async function GET(request: Request, context: MealAnalysisImageRouteContext): Promise<Response> {
  const { id } = await context.params;

  return proxyToApiServer(request, `/meal-analyses/${id}/image`);
}