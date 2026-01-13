import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://bloghub-tpvb.onrender.com/auth/google/callback", // Matches your Google Console setting
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user already exists
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // User exists? Good. Check if they are linking Google to an existing account
            if(user.provider !== "google") {
                // Optional: Update them to allow Google login in future
                user.googleId = profile.id;
                user.provider = "google"; 
                await user.save();
            }
            return done(null, user);
        }

        // 2. If No User, Create New One
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          provider: "google",
          profilePic: profile.photos[0].value,
          // password: left empty intentionally
        });

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;