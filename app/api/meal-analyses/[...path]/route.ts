import { proxyMealAnalysisRequest } from '@/lib/meal-analyses/session';

type MealAnalysisRouteContext = Readonly<{
  params: Promise<{ path: string[] }>;
}>;

async function handleMealAnalysisProxy(request: Request, context: MealAnalysisRouteContext): Promise<Response> {
  const { path } = await context.params;
  return proxyMealAnalysisRequest(request, path);
}

export async function GET(request: Request, context: MealAnalysisRouteContext): Promise<Response> {
  return handleMealAnalysisProxy(request, context);
}

export async function POST(request: Request, context: MealAnalysisRouteContext): Promise<Response> {
  return handleMealAnalysisProxy(request, context);
}

export async function PATCH(request: Request, context: MealAnalysisRouteContext): Promise<Response> {
  return handleMealAnalysisProxy(request, context);
}

export async function DELETE(request: Request, context: MealAnalysisRouteContext): Promise<Response> {
  return handleMealAnalysisProxy(request, context);
}
