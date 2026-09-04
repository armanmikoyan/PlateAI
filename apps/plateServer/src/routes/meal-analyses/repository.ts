import { Types } from 'mongoose';
import { MEAL_ANALYSIS_STATUS } from '@plate/plate-ai/constants';
import { MealAnalysis, type MealAnalysisDocument } from '@/models/meal-analysis.js';
import type { UpdateMealAnalysisBody } from '@/routes/meal-analyses/types.js';

export async function createPending(
  userId: string,
  imageBase64: string,
  imageMimeType: string,
): Promise<MealAnalysisDocument> {
  return MealAnalysis.create({
    userId: new Types.ObjectId(userId),
    status: MEAL_ANALYSIS_STATUS.PENDING,
    imageBase64,
    imageMimeType,
    analysis: null,
    errorMessage: null,
  });
}

export async function listForUser(userId: string): Promise<MealAnalysisDocument[]> {
  return MealAnalysis.find({ userId: new Types.ObjectId(userId) })
    .sort({ createdAt: -1 })
    .exec();
}

export async function findByIdForUser(
  userId: string,
  analysisId: string,
): Promise<MealAnalysisDocument | null> {
  if (!Types.ObjectId.isValid(analysisId)) {
    return null;
  }

  return MealAnalysis.findOne({
    _id: new Types.ObjectId(analysisId),
    userId: new Types.ObjectId(userId),
  }).exec();
}

export async function updateForUser(
  userId: string,
  analysisId: string,
  update: UpdateMealAnalysisBody,
): Promise<MealAnalysisDocument | null> {
  if (!Types.ObjectId.isValid(analysisId)) {
    return null;
  }

  const patch: Record<string, unknown> = { status: update.status };

  if (update.analysis) {
    patch.analysis = update.analysis;
  }

  if (update.errorMessage !== undefined) {
    patch.errorMessage = update.errorMessage;
  }

  return MealAnalysis.findOneAndUpdate(
    {
      _id: new Types.ObjectId(analysisId),
      userId: new Types.ObjectId(userId),
    },
    patch,
    { new: true },
  ).exec();
}

export async function countAnalysesSince(userId: string, since: Date): Promise<number> {
  return MealAnalysis.countDocuments({
    userId: new Types.ObjectId(userId),
    createdAt: { $gte: since },
  }).exec();
}

export async function deletePendingForUser(
  userId: string,
  analysisId: string,
): Promise<boolean> {
  if (!Types.ObjectId.isValid(analysisId)) {
    return false;
  }

  const result = await MealAnalysis.findOneAndDelete({
    _id: new Types.ObjectId(analysisId),
    userId: new Types.ObjectId(userId),
    status: MEAL_ANALYSIS_STATUS.PENDING,
  }).exec();

  return result !== null;
}
