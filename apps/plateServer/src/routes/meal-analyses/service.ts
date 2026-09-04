import { analyzeMealImage } from '@plate/plate-ai/provider';
import { AiConfigError, AiParseError, AiProviderError } from '@plate/plate-ai/errors';
import { MEAL_ANALYSIS_STATUS } from '@plate/plate-ai/constants';
import { MEAL_ANALYSIS_ERRORS } from '@/routes/meal-analyses/constants.js';
import {
  countAnalysesSince,
  findByIdForUser,
  updateForUser,
} from '@/routes/meal-analyses/repository.js';
import { canAnalyzeToday, isSnapAnalysisLocked } from '@/routes/meal-analyses/utils.js';
import type { SubscriptionEntitlementInput } from '@/routes/meal-analyses/constants.js';
import type { SubscriptionPlan } from '@plate/plate-billing/types';
import type { AnalyzeMealResult } from '@/routes/meal-analyses/types.js';

export async function analyzeMeal(
  user: SubscriptionEntitlementInput & { id: string; subscriptionPlan: SubscriptionPlan | null },
  analysisId: string,
): Promise<AnalyzeMealResult> {
  if (isSnapAnalysisLocked(user)) {
    return { ok: false, status: 403, error: MEAL_ANALYSIS_ERRORS.LOCKED };
  }

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const todayCount = await countAnalysesSince(user.id, startOfDay);

  if (!canAnalyzeToday(todayCount, user.subscriptionPlan)) {
    return { ok: false, status: 429, error: MEAL_ANALYSIS_ERRORS.DAILY_LIMIT_REACHED };
  }

  const document = await findByIdForUser(user.id, analysisId);

  if (!document) {
    return { ok: false, status: 404, error: MEAL_ANALYSIS_ERRORS.NOT_FOUND };
  }

  if (document.status === MEAL_ANALYSIS_STATUS.DONE && document.analysis) {
    return { ok: true, document };
  }

  if (
    document.status !== MEAL_ANALYSIS_STATUS.PENDING &&
    document.status !== MEAL_ANALYSIS_STATUS.FAILED
  ) {
    return { ok: false, status: 409, error: MEAL_ANALYSIS_ERRORS.CANNOT_COMPLETE };
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

    await updateForUser(user.id, analysisId, {
      status: MEAL_ANALYSIS_STATUS.FAILED,
      errorMessage: message,
    });

    return { ok: false, status: error instanceof AiConfigError ? 503 : 502, error: message };
  }

  const updated = await updateForUser(user.id, analysisId, {
    status: MEAL_ANALYSIS_STATUS.DONE,
    analysis,
  });

  if (!updated) {
    return { ok: false, status: 404, error: MEAL_ANALYSIS_ERRORS.NOT_FOUND };
  }

  return { ok: true, document: updated };
}
