import { Router } from 'express';

import { MEAL_ANALYSIS_ROUTES } from '@/routes/meal-analyses/constants.js';
import {
  createMealAnalysis,
  deleteMealAnalysis,
  getMealAnalysis,
  listMealAnalyses,
  patchMealAnalysis,
} from '@/routes/meal-analyses/meal-analyses-controller.js';
import type { ServerConfig } from '@/types.js';

export function createMealAnalysesRouter(config: ServerConfig): Router {
  const router = Router();

  router.get(MEAL_ANALYSIS_ROUTES.ROOT, (request, response) => {
    void listMealAnalyses(config, request, response);
  });

  router.post(MEAL_ANALYSIS_ROUTES.ROOT, (request, response) => {
    void createMealAnalysis(config, request, response);
  });

  router.get(MEAL_ANALYSIS_ROUTES.BY_ID, (request, response) => {
    void getMealAnalysis(config, request, response);
  });

  router.patch(MEAL_ANALYSIS_ROUTES.BY_ID, (request, response) => {
    void patchMealAnalysis(config, request, response);
  });

  router.delete(MEAL_ANALYSIS_ROUTES.BY_ID, (request, response) => {
    void deleteMealAnalysis(config, request, response);
  });

  return router;
}
