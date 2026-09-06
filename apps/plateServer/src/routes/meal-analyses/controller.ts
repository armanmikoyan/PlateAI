import type { NextFunction, Request, Response } from 'express';
import { MEAL_ANALYSIS_STATUS } from '@plate/plate-ai/constants';
import type {
  MealAnalysisItemResponse,
  MealAnalysisListResponse,
} from '@plate/plate-ai/types';
import { MEAL_ANALYSIS_ERRORS } from '@/routes/meal-analyses/constants.js';
import { analyzeMeal } from '@/routes/meal-analyses/service.js';
import {
  countPendingForUser,
  createPending,
  findByIdForUser,
  findImageForUser,
  listForUser,
  removeForUser,
  updateForUser,
} from '@/routes/meal-analyses/repository.js';
import { getPendingAnalysisLimit } from '@plate/plate-billing/utils';
import type {
  MealAnalysisLockedResponse,
  UpdateMealAnalysisBody,
} from '@/routes/meal-analyses/types.js';
import {
  canSavePendingAnalysis,
  formatPendingLimitReachedMessage,
  isMealAnalysisResult,
  parseCreateMealAnalysisBody,
  toMealAnalysisSummary,
} from '@/routes/meal-analyses/utils.js';

export async function listMealAnalyses(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = request.authUser!.id;
    const documents = await listForUser(userId);

    response.json({
      items: documents.map(toMealAnalysisSummary),
    } satisfies MealAnalysisListResponse);
  } catch (error) {
    next(error);
  }
}

export async function getMealAnalysis(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = request.authUser!.id;
    const document = await findByIdForUser(userId, request.params.id);

    if (!document) {
      response.status(404).json({ error: MEAL_ANALYSIS_ERRORS.NOT_FOUND });
      return;
    }

    response.json({
      item: toMealAnalysisSummary(document),
    } satisfies MealAnalysisItemResponse);
  } catch (error) {
    next(error);
  }
}

export async function mealAnalysisImage(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = request.authUser!.id;
    const document = await findImageForUser(userId, request.params.id);

    if (!document?.image) {
      response.status(404).json({ error: MEAL_ANALYSIS_ERRORS.NOT_FOUND });
      return;
    }

    response
      .set('Content-Type', document.imageMimeType)
      .set('Cache-Control', 'private, max-age=31536000, immutable, no-transform')
      .send(document.image);
  } catch (error) {
    next(error);
  }
}

export async function createMealAnalysis(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = request.authUser!.id;
    const body = parseCreateMealAnalysisBody(request.body);

    if (!body) {
      response.status(400).json({ error: MEAL_ANALYSIS_ERRORS.INVALID_BODY });
      return;
    }

    const pendingCount = await countPendingForUser(userId);

    if (!canSavePendingAnalysis(pendingCount, request.authUser!.subscriptionPlan)) {
      response.status(429).json({
        error: formatPendingLimitReachedMessage(
          getPendingAnalysisLimit(request.authUser!.subscriptionPlan),
        ),
      });
      return;
    }

    const document = await createPending(
      userId,
      Buffer.from(body.imageBase64, 'base64'),
      body.imageMimeType,
    );

    response.status(201).json({
      item: toMealAnalysisSummary(document),
    } satisfies MealAnalysisItemResponse);
  } catch (error) {
    next(error);
  }
}

export async function patchMealAnalysis(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = request.authUser!.id;
    const body = request.body as UpdateMealAnalysisBody | undefined;

    if (!body || typeof body.status !== 'string') {
      response.status(400).json({ error: MEAL_ANALYSIS_ERRORS.INVALID_BODY });
      return;
    }

    if (body.status === MEAL_ANALYSIS_STATUS.DONE && !isMealAnalysisResult(body.analysis)) {
      response.status(400).json({ error: MEAL_ANALYSIS_ERRORS.INVALID_BODY });
      return;
    }

    const document = await updateForUser(userId, request.params.id, body);

    if (!document) {
      response.status(404).json({ error: MEAL_ANALYSIS_ERRORS.NOT_FOUND });
      return;
    }

    response.json({
      item: toMealAnalysisSummary(document),
    } satisfies MealAnalysisItemResponse);
  } catch (error) {
    next(error);
  }
}

export async function analyzeMealAnalysis(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = await analyzeMeal(request.authUser!, request.params.id);

    if (result.ok) {
      response.json({ item: toMealAnalysisSummary(result.document) } satisfies MealAnalysisItemResponse);
      return;
    }

    if (result.status === 403) {
      response
        .status(403)
        .json({ error: result.error, locked: true } satisfies MealAnalysisLockedResponse);
      return;
    }

    response.status(result.status).json({ error: result.error });
  } catch (error) {
    next(error);
  }
}

export async function deleteMealAnalysis(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = request.authUser!.id;
    const document = await removeForUser(userId, request.params.id);

    if (!document) {
      response.status(404).json({ error: MEAL_ANALYSIS_ERRORS.NOT_FOUND });
      return;
    }

    response.status(204).end();
  } catch (error) {
    next(error);
  }
}
