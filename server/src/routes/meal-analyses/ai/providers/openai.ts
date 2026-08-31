import OpenAI from 'openai';

import { MEAL_IMAGE_ANALYSIS_PROMPT } from '@/routes/meal-analyses/ai/constants.js';
import { AiProviderError } from '@/routes/meal-analyses/ai/errors.js';
import { parseMealImageAnalysis } from '@/routes/meal-analyses/ai/parse-analysis.js';
import type {
  ImageAnalysisProvider,
  ImageAnalysisProviderConfig,
  MealImageAnalysisInput,
} from '@/routes/meal-analyses/ai/types.js';

function providerErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'OpenAI request failed.';
}

export function createOpenAiImageAnalysisProvider(
  config: ImageAnalysisProviderConfig,
): ImageAnalysisProvider {
  const client = new OpenAI({ apiKey: config.apiKey });

  return {
    id: 'openai',
    async analyzeMeal(input: MealImageAnalysisInput) {
      try {
        const response = await client.chat.completions.create({
          model: config.model,
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: MEAL_IMAGE_ANALYSIS_PROMPT },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${input.mimeType};base64,${input.imageBase64}`,
                  },
                },
              ],
            },
          ],
        });

        const text = response.choices[0]?.message?.content?.trim();

        if (!text) {
          throw new AiProviderError('openai', 'OpenAI returned an empty response.');
        }

        return parseMealImageAnalysis(text);
      } catch (error) {
        if (error instanceof AiProviderError) {
          throw error;
        }

        throw new AiProviderError('openai', providerErrorMessage(error));
      }
    },
  };
}
