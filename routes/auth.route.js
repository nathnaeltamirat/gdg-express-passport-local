import passport from "../config/passport.js";
import { logout, signUp } from "../controllers/auth.controller.js";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    req.login(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ success: true, data: [user] });
    });
  })(req, res, next);
});

authRouter.post("/logout", logout);
export default authRouter;
