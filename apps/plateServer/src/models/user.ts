import { Schema, model, type InferSchemaType, type Types } from 'mongoose';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@plate/plate-billing/constants';

const userSchema = new Schema(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String, default: null },
    subscriptionPlan: {
      type: String,
      enum: Object.values(SUBSCRIPTION_PLAN),
      default: null,
    },
    subscriptionStatus: {
      type: String,
      enum: Object.values(SUBSCRIPTION_STATUS),
      default: null,
    },
    billingCustomerId: { type: String, default: null },
    billingOrderId: { type: String, default: null },
    billingSubscriptionId: { type: String, default: null },
    subscriptionRenewsAt: { type: String, default: null },
    subscriptionEndsAt: { type: String, default: null },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

export const User = model('User', userSchema);
