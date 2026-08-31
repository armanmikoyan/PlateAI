import { Schema, model, type InferSchemaType, type Types } from 'mongoose';
import { SUBSCRIPTION_PLAN, SUBSCRIPTION_STATUS } from '@/routes/meal-analyses/constants.js';

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
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

export const User = model('User', userSchema);
