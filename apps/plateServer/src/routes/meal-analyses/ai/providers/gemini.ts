import { GoogleGenerativeAI } from '@google/generative-ai';
import { MEAL_IMAGE_ANALYSIS_PROMPT } from '@/routes/meal-analyses/ai/constants.js';
import { AiProviderError } from '@/routes/meal-analyses/ai/errors.js';
import { parseMealImageAnalysis } from '@/routes/meal-analyses/ai/parse-analysis.js';
import type {
  ImageAnalysisProvider,
  ImageAnalysisProviderConfig,
  MealImageAnalysisInput,
} from '@/routes/meal-analyses/ai/types.js';

function providerErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Gemini request failed.';
}

export function createGeminiImageAnalysisProvider(
  config: ImageAnalysisProviderConfig,
): ImageAnalysisProvider {
  const client = new GoogleGenerativeAI(config.apiKey);

  return {
    id: 'gemini',
    async analyzeMeal(input: MealImageAnalysisInput) {
      try {
        const model = client.getGenerativeModel({
          model: config.model,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.2,
          },
        });

        const result = await model.generateContent([
          MEAL_IMAGE_ANALYSIS_PROMPT,
          {
            inlineData: {
              mimeType: input.mimeType,
              data: input.imageBase64,
            },
          },
        ]);

        const text = result.response.text().trim();

        if (!text) {
          throw new AiProviderError('gemini', 'Gemini returned an empty response.');
        }

        return parseMealImageAnalysis(text);
      } catch (error) {
        if (error instanceof AiProviderError) {
          throw error;
        }

        throw new AiProviderError('gemini', providerErrorMessage(error));
      }
    },
  };
}
