import { proxyMealAnalysisRequest } from '@/lib/meal-analyses/session';

export async function GET(request: Request): Promise<Response> {
  return proxyMealAnalysisRequest(request, []);
}

export async function POST(request: Request): Promise<Response> {
  return proxyMealAnalysisRequest(request, []);
}

export async function PATCH(request: Request): Promise<Response> {
  return proxyMealAnalysisRequest(request, []);
}

export async function DELETE(request: Request): Promise<Response> {
  return proxyMealAnalysisRequest(request, []);
}
