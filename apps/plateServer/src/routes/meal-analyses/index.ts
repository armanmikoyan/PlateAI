import { Router } from 'express';
import { analyzeRateLimiter } from '@/middleware/rate-limit.js';
import { requireUser } from '@/middleware/require-user.js';
import {
  analyzeMealAnalysis,
  createMealAnalysis,
  deleteMealAnalysis,
  getMealAnalysis,
  listMealAnalyses,
  mealAnalysisImage,
  patchMealAnalysis,
} from '@/routes/meal-analyses/controller.js';
import type { ServerConfig } from '@/config/types.js';

export function createMealAnalysesRouter(config: ServerConfig): Router {
  const router = Router();
  const authenticated = requireUser(config);

  router.get('/', authenticated, listMealAnalyses);
  router.post('/', authenticated, createMealAnalysis);
  router.get('/:id', authenticated, getMealAnalysis);
  router.get('/:id/image', authenticated, mealAnalysisImage);
  router.patch('/:id', authenticated, patchMealAnalysis);
  router.post('/:id/analyze', authenticated, analyzeRateLimiter(), analyzeMealAnalysis);
  router.delete('/:id', authenticated, deleteMealAnalysis);

  return router;
}
