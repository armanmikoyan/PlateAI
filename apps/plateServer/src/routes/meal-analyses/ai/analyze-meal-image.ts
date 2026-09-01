import { MEAL_IMAGE_ANALYSIS_TEST_FIXTURE } from '@/routes/meal-analyses/ai/constants.js';
import { createImageAnalysisProvider } from '@/routes/meal-analyses/ai/create-provider.js';
import type { MealImageAnalysisInput } from '@/routes/meal-analyses/ai/types.js';
import {
  readImageAnalysisProviderConfig,
  readImageAnalysisTestDelayMs,
  readImageAnalysisTestMode,
  sleep,
} from '@/routes/meal-analyses/ai/utils.js';
import type { MealAnalysisResult } from '@/routes/meal-analyses/types.js';

export async function analyzeMealImage(input: MealImageAnalysisInput): Promise<MealAnalysisResult> {
  if (readImageAnalysisTestMode()) {
    await sleep(readImageAnalysisTestDelayMs());
    return MEAL_IMAGE_ANALYSIS_TEST_FIXTURE;
  }

  const config = readImageAnalysisProviderConfig();
  const provider = createImageAnalysisProvider(config);
  return provider.analyzeMeal(input);
}
