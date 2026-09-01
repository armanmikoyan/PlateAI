import { User, type UserDocument } from '@/models/user.js';

export async function findUserById(id: string): Promise<UserDocument | null> {
  return User.findById(id).exec();
}

export async function upsertUserByGoogleProfile(
  profile: { googleId: string; email: string; name: string; image: string | null },
): Promise<UserDocument | null> {
  return User.findOneAndUpdate(
    { googleId: profile.googleId },
    {
      email: profile.email,
      name: profile.name,
      image: profile.image,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).exec();
}
