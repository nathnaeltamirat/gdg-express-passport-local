import passport from "passport";
import LocalStrategy from "passport-local";
import { signIn } from "../controllers/auth.controller.js";

passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const user = await signIn(req,email,password);
        return done(null,user)
      } catch (err) {
        done(err);
      }
    },
  ),
);
passport.serializeUser((user,done)=>{
    done(null,{id:user._id,email:user.email,firstName:user.firstName})
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})

export default passport