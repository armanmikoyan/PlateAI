import { analyzeMealImage } from '@/lib/ai/analyze-meal-image';
import { AiConfigError, AiParseError, AiProviderError } from '@/lib/ai/errors';
import { imageMimeForAnalysis } from '@/lib/ai/utils';
import { getAuthSession } from '@/lib/auth/jwt';

type AnalyzeSuccessResponse = Readonly<{
  analysis: Awaited<ReturnType<typeof analyzeMealImage>>;
}>;

type AnalyzeErrorResponse = Readonly<{
  error: string;
}>;

function errorResponse(message: string, status: number) {
  return Response.json({ error: message } satisfies AnalyzeErrorResponse, { status });
}

export async function POST(request: Request) {
  const session = await getAuthSession(request.headers.get('cookie'));

  if (!session) {
    return errorResponse('Sign in required.', 401);
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
