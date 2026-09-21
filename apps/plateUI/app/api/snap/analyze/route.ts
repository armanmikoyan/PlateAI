import { analyzeMealAnalysis, createPendingMealAnalysis } from '@/app/api/meal-analyses/client';
import type { MealAnalysisPreview } from '@plate/plate-ai/types';

type AnalyzeSuccessResponse = Readonly<{
  analysis: MealAnalysisPreview;
  id: string;
}>;

type AnalyzeErrorResponse = Readonly<{
  error: string;
  id?: string;
  retryAfterSeconds?: number;
  pendingLimit?: true;
  planRequired?: true;
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
  const forwardedFor = request.headers.get('x-forwarded-for');

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
    const created = await createPendingMealAnalysis(cookieHeader, imageBase64, mimeType, forwardedFor);

    if (!created.ok) {
      if (created.status === 429 && created.planRequired) {
        return Response.json(
          {
            error: created.message ?? 'Upgrade to a paid plan to analyze more plates.',
            planRequired: true,
          } satisfies AnalyzeErrorResponse,
          { status: 429 },
        );
      }

      if (created.status === 429) {
        return Response.json(
          {
            error: created.message ?? 'Could not save meal analysis.',
            pendingLimit: true,
          } satisfies AnalyzeErrorResponse,
          { status: 429 },
        );
      }

      return errorResponse('Could not save meal analysis.', 502);
    }

    const analysisId = created.item.item.id;
    const result = await analyzeMealAnalysis(cookieHeader, analysisId, forwardedFor);

    if (!result.ok) {
      if (result.status === 429) {
        return Response.json(
          {
            error:
              result.message ?? 'Daily analysis limit reached. New analyses unlock after midnight (UTC).',
            id: analysisId,
            ...(result.retryAfterSeconds ? { retryAfterSeconds: result.retryAfterSeconds } : {}),
          } satisfies AnalyzeErrorResponse,
          { status: 429 },
        );
      }

      return Response.json(
        {
          error: 'Could not analyze that photo. Try a clearer shot.',
          id: analysisId,
        } satisfies AnalyzeErrorResponse,
        { status: 502 },
      );
    }

    const analysis = result.item.analysis;

    if (!analysis) {
      return Response.json(
        {
          error: 'Could not analyze that photo. Try a clearer shot.',
          id: analysisId,
        } satisfies AnalyzeErrorResponse,
        { status: 502 },
      );
    }

    return Response.json({ analysis, id: analysisId } satisfies AnalyzeSuccessResponse);
  } catch {
    return errorResponse('Something went wrong while analyzing the photo.', 500);
  }
}
