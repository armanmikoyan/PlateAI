import { Types } from 'mongoose';
import { MEAL_ANALYSIS_STATUS } from '@plate/plate-ai/constants';
import { MealAnalysis, type MealAnalysisDocument } from '@/models/meal-analysis.js';
import type { UpdateMealAnalysisBody } from '@/routes/meal-analyses/types.js';

export async function createPending(
  userId: string,
  image: Buffer,
  imageMimeType: string,
): Promise<MealAnalysisDocument> {
  return MealAnalysis.create({
    userId: new Types.ObjectId(userId),
    status: MEAL_ANALYSIS_STATUS.PENDING,
    image,
    imageMimeType,
    analysis: null,
    errorMessage: null,
  });
}

export async function listForUser(userId: string): Promise<MealAnalysisDocument[]> {
  return MealAnalysis.find({ userId: new Types.ObjectId(userId) })
    .select('-image')
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
  })
    .select('-image')
    .exec();
}

export async function findByIdWithImageForUser(
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

export async function findImageForUser(
  userId: string,
  analysisId: string,
): Promise<MealAnalysisDocument | null> {
  if (!Types.ObjectId.isValid(analysisId)) {
    return null;
  }

  return MealAnalysis.findOne({
    _id: new Types.ObjectId(analysisId),
    userId: new Types.ObjectId(userId),
  })
    .select('image imageMimeType')
    .exec();
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
    status: MEAL_ANALYSIS_STATUS.DONE,
    createdAt: { $gte: since },
  }).exec();
}

export async function countPendingForUser(userId: string): Promise<number> {
  return MealAnalysis.countDocuments({
    userId: new Types.ObjectId(userId),
    status: MEAL_ANALYSIS_STATUS.PENDING,
  }).exec();
}

export async function removeForUser(
  userId: string,
  analysisId: string,
): Promise<MealAnalysisDocument | null> {
  if (!Types.ObjectId.isValid(analysisId)) {
    return null;
  }

  return MealAnalysis.findOneAndDelete({
    _id: new Types.ObjectId(analysisId),
    userId: new Types.ObjectId(userId),
  }).exec();
}
