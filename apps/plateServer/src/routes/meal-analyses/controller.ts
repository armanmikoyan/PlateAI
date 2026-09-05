import type { NextFunction, Request, Response } from 'express';
import { MEAL_ANALYSIS_STATUS } from '@plate/plate-ai/constants';
import type {
  MealAnalysisItemResponse,
  MealAnalysisListResponse,
} from '@plate/plate-ai/types';
import { MEAL_ANALYSIS_ERRORS } from '@/routes/meal-analyses/constants.js';
import { analyzeMeal } from '@/routes/meal-analyses/service.js';
import { createPending, findByIdForUser, listForUser, updateForUser } from '@/routes/meal-analyses/repository.js';
import type {
  MealAnalysisLockedResponse,
  UpdateMealAnalysisBody,
} from '@/routes/meal-analyses/types.js';
import {
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

    const document = await createPending(userId, body.imageBase64, body.imageMimeType);

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
