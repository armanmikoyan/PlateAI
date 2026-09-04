import { MEAL_IMAGE_ANALYSIS_TEST_FIXTURE } from '@/constants.js';
import type { MealImageAnalysisInput, MealAnalysisResult } from '@/types.js';
import {
  createImageAnalysisProvider,
  readImageAnalysisProviderConfig,
  readImageAnalysisTestDelayMs,
  readImageAnalysisTestMode,
  sleep,
} from '@/utils.js';

export async function analyzeMealImage(
  input: MealImageAnalysisInput,
): Promise<MealAnalysisResult> {
  if (readImageAnalysisTestMode()) {
    await sleep(readImageAnalysisTestDelayMs());
    return MEAL_IMAGE_ANALYSIS_TEST_FIXTURE;
  }

  const config = readImageAnalysisProviderConfig();
  const provider = createImageAnalysisProvider(config);
  return provider.analyzeMeal(input);
}
