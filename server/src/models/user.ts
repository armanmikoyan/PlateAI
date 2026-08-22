import { Schema, model, type InferSchemaType, type Types } from 'mongoose';

const userSchema = new Schema(
  {
    googleId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    image: { type: String, default: null },
  },
  { timestamps: true },
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: Types.ObjectId;
};

export const User = model('User', userSchema);
