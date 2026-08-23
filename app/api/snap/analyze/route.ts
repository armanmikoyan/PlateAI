import { analyzeMealImage } from '@/lib/ai/analyze-meal-image';
import { AiConfigError, AiParseError, AiProviderError } from '@/lib/ai/errors';
import { imageMimeForAnalysis } from '@/lib/ai/utils';
import { fetchAuthUser } from '@/lib/auth/me';
import { isSnapAnalysisLocked } from '@/lib/billing/entitlements';
import {
  createPendingMealAnalysis,
  markMealAnalysisDone,
} from '@/lib/meal-analyses/client';

type AnalyzeSuccessResponse = Readonly<{
  analysis: Awaited<ReturnType<typeof analyzeMealImage>>;
  id: string;
}>;

type AnalyzeLockedResponse = Readonly<{
  locked: true;
  id: string;
}>;

type AnalyzeErrorResponse = Readonly<{
  error: string;
}>;

function errorResponse(message: string, status: number) {
  return Response.json({ error: message } satisfies AnalyzeErrorResponse, { status });
}

export async function POST(request: Request) {
  const cookieHeader = request.headers.get('cookie');
  const user = await fetchAuthUser(cookieHeader);

  if (!user) {
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

    if (isSnapAnalysisLocked(user)) {
      return Response.json({ locked: true, id: analysisId } satisfies AnalyzeLockedResponse, { status: 403 });
    }

    const analysis = await analyzeMealImage({
      imageBase64,
      mimeType,
    });

    const saved = await markMealAnalysisDone(cookieHeader, analysisId, analysis);

    if (!saved) {
      return errorResponse('Could not save meal analysis.', 502);
    }

    return Response.json({ analysis, id: analysisId } satisfies AnalyzeSuccessResponse);
  } catch (error) {
    if (error instanceof AiConfigError) {
      return errorResponse('Meal analysis is not configured on this server.', 503);
    }

    if (error instanceof AiParseError || error instanceof AiProviderError) {
      return errorResponse('Could not analyze that photo. Try a clearer shot.', 502);
    }

    return errorResponse('Something went wrong while analyzing the photo.', 500);
  }
}
