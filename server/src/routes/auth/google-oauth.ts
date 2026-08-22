import passport from 'passport';
import { Strategy as GoogleStrategy, type Profile } from 'passport-google-oauth20';

import { User, type UserDocument } from '@/models/user.js';
import { AUTH_ERRORS, AUTH_GOOGLE } from '@/routes/auth/constants.js';
import type { ServerConfig } from '@/types.js';

function profileToUser(profile: Profile): Pick<UserDocument, 'googleId' | 'email' | 'name' | 'image'> {
  const email = profile.emails?.[0]?.value?.trim();

  if (!email) {
    throw new Error(AUTH_ERRORS.GOOGLE_NO_EMAIL);
  }

  return {
    googleId: profile.id,
    email,
    name: profile.displayName?.trim() || email,
    image: profile.photos?.[0]?.value ?? null,
  };
}

export function configurePassport(config: ServerConfig): void {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const payload = profileToUser(profile);
          const user =
            (await User.findOneAndUpdate(
              { googleId: payload.googleId },
              payload,
              { upsert: true, new: true, setDefaultsOnInsert: true },
            ).exec()) ?? null;

          if (!user) {
            done(new Error(AUTH_ERRORS.USER_UPSERT_FAILED));
            return;
          }

          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      },
    ),
  );
}

export function googleAuthOptions() {
  return {
    scope: [...AUTH_GOOGLE.SCOPES],
    session: false as const,
  };
}

export function googleCallbackAuthOptions(config: ServerConfig) {
  return {
    session: false as const,
    failureRedirect: `${config.FRONTEND_URL}/login?error=google`,
  };
}
