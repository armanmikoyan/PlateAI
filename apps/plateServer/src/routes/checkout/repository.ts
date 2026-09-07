import type { UpdateQuery } from 'mongoose';
import type { UserDocument } from '@/models/user.js';
import { User } from '@/models/user.js';
import type { ApplySubscriptionUpdate } from '@/routes/checkout/types.js';

export async function findUserById(id: string): Promise<UserDocument | null> {
  return User.findById(id).exec();
}

export async function findUserSubscriptionId(id: string): Promise<string | null> {
  const user = await User.findById(id).select('billingSubscriptionId').lean().exec();
  return user?.billingSubscriptionId ?? null;
}

export async function applySubscription(
  userId: string,
  update: ApplySubscriptionUpdate,
): Promise<UserDocument | null> {
  return User.findByIdAndUpdate(userId, { $set: update } satisfies UpdateQuery<UserDocument>, {
    new: true,
  }).exec();
}
