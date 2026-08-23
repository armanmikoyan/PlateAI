import type { Request, Response } from 'express';

import { MEAL_ANALYSIS_STATUS } from '@/models/meal-analysis-constants.js';
import { MEAL_ANALYSIS_ERRORS } from '@/routes/meal-analyses/constants.js';
import {
  createPendingMealAnalysis,
  deletePendingMealAnalysisForUser,
  findMealAnalysisForUser,
  listMealAnalysesForUser,
  updateMealAnalysisForUser,
} from '@/routes/meal-analyses/meal-analyses-service.js';
import type {
  CreateMealAnalysisResponse,
  MealAnalysisDetailResponse,
  MealAnalysisListResponse,
  UpdateMealAnalysisBody,
  UpdateMealAnalysisResponse,
} from '@/routes/meal-analyses/types.js';
import {
  isMealAnalysisResultDto,
  parseCreateMealAnalysisBody,
  toMealAnalysisDetail,
  toMealAnalysisSummary,
} from '@/routes/meal-analyses/utils.js';
import { getAuthenticatedUser } from '@/routes/auth/auth-service.js';
import type { ServerConfig } from '@/types.js';

async function requireUser(config: ServerConfig, request: Request, response: Response) {
  const user = await getAuthenticatedUser(config, request.headers.cookie);

  if (!user) {
    response.status(401).json({ error: MEAL_ANALYSIS_ERRORS.NOT_SIGNED_IN });
    return null;
  }

  return user;
}

export async function listMealAnalyses(config: ServerConfig, request: Request, response: Response): Promise<void> {
  const user = await requireUser(config, request, response);

  if (!user) {
    return;
  }

  const documents = await listMealAnalysesForUser(user.id);
  response.json({
    items: documents.map(toMealAnalysisSummary),
  } satisfies MealAnalysisListResponse);
}

export async function getMealAnalysis(
  config: ServerConfig,
  request: Request,
  response: Response,
): Promise<void> {
  const user = await requireUser(config, request, response);

  if (!user) {
    return;
  }

  const document = await findMealAnalysisForUser(user.id, request.params.id);

  if (!document) {
    response.status(404).json({ error: MEAL_ANALYSIS_ERRORS.NOT_FOUND });
    return;
  }

  response.json({
    item: toMealAnalysisDetail(document),
  } satisfies MealAnalysisDetailResponse);
}

export async function createMealAnalysis(
  config: ServerConfig,
  request: Request,
  response: Response,
): Promise<void> {
  const user = await requireUser(config, request, response);

  if (!user) {
    return;
  }

  const body = parseCreateMealAnalysisBody(request.body);

  if (!body) {
    response.status(400).json({ error: MEAL_ANALYSIS_ERRORS.INVALID_BODY });
    return;
  }

  const document = await createPendingMealAnalysis(user.id, body.imageBase64, body.imageMimeType);

  response.status(201).json({
    item: toMealAnalysisDetail(document),
  } satisfies CreateMealAnalysisResponse);
}

export async function patchMealAnalysis(
  config: ServerConfig,
  request: Request,
  response: Response,
): Promise<void> {
  const user = await requireUser(config, request, response);

  if (!user) {
    return;
  }

  const body = request.body as UpdateMealAnalysisBody | undefined;

  if (!body || typeof body.status !== 'string') {
    response.status(400).json({ error: MEAL_ANALYSIS_ERRORS.INVALID_BODY });
    return;
  }

  if (body.status === MEAL_ANALYSIS_STATUS.DONE && !isMealAnalysisResultDto(body.analysis)) {
    response.status(400).json({ error: MEAL_ANALYSIS_ERRORS.INVALID_BODY });
    return;
  }

  const document = await updateMealAnalysisForUser(user.id, request.params.id, body);

  if (!document) {
    response.status(404).json({ error: MEAL_ANALYSIS_ERRORS.NOT_FOUND });
    return;
  }

  response.json({
    item: toMealAnalysisSummary(document),
  } satisfies UpdateMealAnalysisResponse);
}

export async function deleteMealAnalysis(
  config: ServerConfig,
  request: Request,
  response: Response,
): Promise<void> {
  const user = await requireUser(config, request, response);

  if (!user) {
    return;
  }

  const deleted = await deletePendingMealAnalysisForUser(user.id, request.params.id);

  if (!deleted) {
    response.status(404).json({ error: MEAL_ANALYSIS_ERRORS.NOT_FOUND });
    return;
  }

  response.status(204).send();
}
