import type { UpdateQuery } from 'mongoose';
import type { SubscriptionPlan, SubscriptionStatus } from '@plate/plate-billing';
import type { UserDocument } from '@/models/user.js';
import { User } from '@/models/user.js';

export async function findUserById(id: string): Promise<UserDocument | null> {
  return User.findById(id).exec();
}

export type ApplySubscriptionUpdate = Readonly<{
  subscriptionPlan?: SubscriptionPlan;
  subscriptionStatus?: SubscriptionStatus;
  lemonCustomerId?: string;
  lemonOrderId?: string;
  lemonSubscriptionId?: string;
  subscriptionRenewsAt?: string | null;
  subscriptionEndsAt?: string | null;
}>;

export async function applySubscription(
  userId: string,
  update: ApplySubscriptionUpdate,
): Promise<UserDocument | null> {
  return User.findByIdAndUpdate(userId, { $set: update } satisfies UpdateQuery<UserDocument>, {
    new: true,
  }).exec();
}
