import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import session from "express-session";
import { DB_URI, SESSION_SECRET } from "./config/env.js";
import MongoStore from "connect-mongo";
import errorMiddleware from "./middlewares/error.middleware.js";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import passport from "./config/passport.js";

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  }),
);
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  legacyHeaders: false,
  standardHeaders: true,
  max: 100,
});

app.use(express.urlencoded({ extended: false }));
app.use(apiLimiter);

app.use(
  session({
    secret: SESSION_SECRET,
    store: MongoStore.create({
      collectionName: "session",
      mongoUrl: DB_URI,
      ttl: 60 * 60 * 24 * 7,
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60 * 24 * 7,
      sameSite: "strict",
      secure: false,
      httpOnly: true,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/api/v1/auth", authRouter);

app.use(errorMiddleware);

export default app;
