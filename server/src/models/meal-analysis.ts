import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

import {
  MEAL_ANALYSIS_CONFIDENCE,
  MEAL_ANALYSIS_STATUS,
} from '@/models/meal-analysis-constants.js';

const mealAnalysisResultSchema = new Schema(
  {
    mealName: { type: String, required: true },
    calories: { type: Number, required: true },
    proteinG: { type: Number, required: true },
    carbsG: { type: Number, required: true },
    fatG: { type: Number, required: true },
    confidence: {
      type: String,
      enum: Object.values(MEAL_ANALYSIS_CONFIDENCE),
      required: true,
    },
    notes: { type: String, default: null },
  },
  { _id: false },
);

const mealAnalysisSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: {
      type: String,
      enum: Object.values(MEAL_ANALYSIS_STATUS),
      default: MEAL_ANALYSIS_STATUS.PENDING,
      index: true,
    },
    imageMimeType: { type: String, required: true },
    imageBase64: { type: String, required: true },
    analysis: { type: mealAnalysisResultSchema, default: null },
    errorMessage: { type: String, default: null },
  },
  { timestamps: true },
);

mealAnalysisSchema.index({ userId: 1, createdAt: -1 });

export type MealAnalysisDocument = InferSchemaType<typeof mealAnalysisSchema> & {
  _id: Types.ObjectId;
};

export const MealAnalysis = model('MealAnalysis', mealAnalysisSchema);
