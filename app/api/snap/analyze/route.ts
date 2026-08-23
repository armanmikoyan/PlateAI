import { analyzeMealImage } from '@/lib/ai/analyze-meal-image';
import { AiConfigError, AiParseError, AiProviderError } from '@/lib/ai/errors';
import { imageMimeForAnalysis } from '@/lib/ai/utils';
import { fetchAuthUser } from '@/lib/auth/me';
import { isSnapAnalysisLocked } from '@/lib/billing/entitlements';

type AnalyzeSuccessResponse = Readonly<{
  analysis: Awaited<ReturnType<typeof analyzeMealImage>>;
}>;

type AnalyzeLockedResponse = Readonly<{
  locked: true;
}>;

type AnalyzeErrorResponse = Readonly<{
  error: string;
}>;

function errorResponse(message: string, status: number) {
  return Response.json({ error: message } satisfies AnalyzeErrorResponse, { status });
}

export async function POST(request: Request) {
  const user = await fetchAuthUser(request.headers.get('cookie'));

  if (!user) {
    return errorResponse('Sign in required.', 401);
  }

  if (isSnapAnalysisLocked(user)) {
    return Response.json({ locked: true } satisfies AnalyzeLockedResponse, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const image = formData.get('image');

    if (!(image instanceof File)) {
      return errorResponse('Upload a meal photo.', 400);
    }

    const imageBase64 = Buffer.from(await image.arrayBuffer()).toString('base64');
    const analysis = await analyzeMealImage({
      imageBase64,
      mimeType: imageMimeForAnalysis(image),
    });

    return Response.json({ analysis } satisfies AnalyzeSuccessResponse);
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
