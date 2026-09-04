import type { NextFunction, Request, Response } from 'express';
import { MEAL_ANALYSIS_STATUS } from '@/routes/meal-analyses/constants.js';
import { isSnapAnalysisLocked, canAnalyzeToday } from '@/routes/meal-analyses/utils.js';
import { analyzeMealImage } from '@/routes/meal-analyses/ai/analyze-meal-image.js';
import { AiConfigError, AiParseError, AiProviderError } from '@/routes/meal-analyses/ai/errors.js';
import { MEAL_ANALYSIS_ERRORS } from '@/routes/meal-analyses/constants.js';
import {
  countAnalysesSince,
  createPending,
  deletePendingForUser,
  findByIdForUser,
  listForUser,
  updateForUser,
} from '@/routes/meal-analyses/repository.js';
import type {
  AnalyzeMealAnalysisResponse,
  CreateMealAnalysisResponse,
  MealAnalysisDetailResponse,
  MealAnalysisListResponse,
  MealAnalysisLockedResponse,
  UpdateMealAnalysisBody,
  UpdateMealAnalysisResponse,
} from '@/routes/meal-analyses/types.js';
import {
  isMealAnalysisResultDto,
  parseCreateMealAnalysisBody,
  toMealAnalysisDetail,
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
      item: toMealAnalysisDetail(document),
    } satisfies MealAnalysisDetailResponse);
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
      item: toMealAnalysisDetail(document),
    } satisfies CreateMealAnalysisResponse);
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

    if (body.status === MEAL_ANALYSIS_STATUS.DONE && !isMealAnalysisResultDto(body.analysis)) {
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
    } satisfies UpdateMealAnalysisResponse);
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
    const deleted = await deletePendingForUser(userId, request.params.id);

    if (!deleted) {
      response.status(404).json({ error: MEAL_ANALYSIS_ERRORS.NOT_FOUND });
      return;
    }

    response.status(204).send();
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
    const userId = request.authUser!.id;
    const analysisId = request.params.id;

    if (isSnapAnalysisLocked(request.authUser!)) {
      response
        .status(403)
        .json({ error: MEAL_ANALYSIS_ERRORS.LOCKED, locked: true } satisfies MealAnalysisLockedResponse);
      return;
    }

    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const todayCount = await countAnalysesSince(userId, startOfDay);

    if (!canAnalyzeToday(todayCount, request.authUser!.subscriptionPlan)) {
      response.status(429).json({ error: MEAL_ANALYSIS_ERRORS.DAILY_LIMIT_REACHED });
      return;
    }

    const document = await findByIdForUser(userId, analysisId);

    if (!document) {
      response.status(404).json({ error: MEAL_ANALYSIS_ERRORS.NOT_FOUND });
      return;
    }

    if (document.status === MEAL_ANALYSIS_STATUS.DONE && document.analysis) {
      response.json({ item: toMealAnalysisDetail(document) } satisfies AnalyzeMealAnalysisResponse);
      return;
    }

    if (
      document.status !== MEAL_ANALYSIS_STATUS.PENDING &&
      document.status !== MEAL_ANALYSIS_STATUS.FAILED
    ) {
      response.status(409).json({ error: MEAL_ANALYSIS_ERRORS.CANNOT_COMPLETE });
      return;
    }

    let analysis;

    try {
      analysis = await analyzeMealImage({
        imageBase64: document.imageBase64,
        mimeType: document.imageMimeType,
      });
    } catch (error) {
      const message =
        error instanceof AiConfigError
          ? MEAL_ANALYSIS_ERRORS.AI_NOT_CONFIGURED
          : error instanceof AiParseError || error instanceof AiProviderError
            ? MEAL_ANALYSIS_ERRORS.AI_FAILED
            : MEAL_ANALYSIS_ERRORS.AI_UNKNOWN;

      await updateForUser(userId, analysisId, {
        status: MEAL_ANALYSIS_STATUS.FAILED,
        errorMessage: message,
      });

      response.status(error instanceof AiConfigError ? 503 : 502).json({ error: message });
      return;
    }

    const updated = await updateForUser(userId, analysisId, {
      status: MEAL_ANALYSIS_STATUS.DONE,
      analysis,
    });

    if (!updated) {
      response.status(404).json({ error: MEAL_ANALYSIS_ERRORS.NOT_FOUND });
      return;
    }

    response.json({ item: toMealAnalysisDetail(updated) } satisfies AnalyzeMealAnalysisResponse);
  } catch (error) {
    next(error);
  }
}
