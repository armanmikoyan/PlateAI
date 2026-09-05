import { Router } from 'express';
import { requireUser } from '@/middleware/require-user.js';
import {
  analyzeMealAnalysis,
  createMealAnalysis,
  getMealAnalysis,
  listMealAnalyses,
  patchMealAnalysis,
} from '@/routes/meal-analyses/controller.js';
import type { ServerConfig } from '@/config/types.js';

export function createMealAnalysesRouter(config: ServerConfig): Router {
  const router = Router();
  const authenticated = requireUser(config);

  router.get('/', authenticated, listMealAnalyses);
  router.post('/', authenticated, createMealAnalysis);
  router.get('/:id', authenticated, getMealAnalysis);
  router.patch('/:id', authenticated, patchMealAnalysis);
  router.post('/:id/analyze', authenticated, analyzeMealAnalysis);

  return router;
}
