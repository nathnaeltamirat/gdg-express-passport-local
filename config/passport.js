import passport from "passport";
import LocalStrategy from "passport-local";
import { signIn } from "../controllers/auth.controller.js";
import User from "../models/user.model.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const user = await signIn(req, email, password);
        return done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);


passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
