import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import { findOrCreateGoogleUser} from "../services/auth.service";
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth Client ID hoặc Secret chưa được cài đặt trong .env');
}
if (!process.env.BACKEND_URL) {
  throw new Error('BACKEND_URL chưa được cài đặt trong .env');
}

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await findOrCreateGoogleUser(profile);
            return done(null, user);
        } catch (error) {
            return done(error as Error, false);
        }
    }
));