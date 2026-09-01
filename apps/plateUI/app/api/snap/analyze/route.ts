import { analyzeMealAnalysis, createPendingMealAnalysis } from '@/app/api/meal-analyses/client';
import type { MealAnalysisResult } from '@/app/utils/meal-analyses/types';

type AnalyzeSuccessResponse = Readonly<{
  analysis: MealAnalysisResult;
  id: string;
}>;

type AnalyzeLockedResponse = Readonly<{
  locked: true;
  id: string;
}>;

type AnalyzeErrorResponse = Readonly<{
  error: string;
}>;

function imageMimeForAnalysis(file: Pick<File, 'name' | 'type'>): string {
  const type = file.type.trim().toLowerCase();

  if (type === 'image/jpeg' || type === 'image/png' || type === 'image/webp') {
    return type;
  }

  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'png') {
    return 'image/png';
  }

  if (extension === 'webp') {
    return 'image/webp';
  }

  return 'image/jpeg';
}

function errorResponse(message: string, status: number) {
  return Response.json({ error: message } satisfies AnalyzeErrorResponse, { status });
}

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie');

  if (!cookieHeader) {
    return errorResponse('Sign in required.', 401);
  }

  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!(image instanceof File)) {
      return errorResponse('Upload a meal photo.', 400);
    }

    const imageBase64 = Buffer.from(await image.arrayBuffer()).toString('base64');
    const mimeType = imageMimeForAnalysis(image);
    const created = await createPendingMealAnalysis(cookieHeader, imageBase64, mimeType);

    if (!created) {
      return errorResponse('Could not save meal analysis.', 502);
    }

    const analysisId = created.item.id;
    const result = await analyzeMealAnalysis(cookieHeader, analysisId);

    if (!result.ok) {
      if (result.locked) {
        return Response.json(
          { locked: true, id: analysisId } satisfies AnalyzeLockedResponse,
          { status: 403 },
        );
      }

      return errorResponse('Could not analyze that photo. Try a clearer shot.', 502);
    }

    const analysis = result.item.analysis;

    if (!analysis) {
      return errorResponse('Could not analyze that photo. Try a clearer shot.', 502);
    }

    return Response.json({ analysis, id: analysisId } satisfies AnalyzeSuccessResponse);
  } catch {
    return errorResponse('Something went wrong while analyzing the photo.', 500);
  }
}
