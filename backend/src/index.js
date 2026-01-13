import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDb from './config/mongoose-config.js';

import authRoute from "./routes/authRouter.js";
import postRoute from "./routes/postRouter.js";
import paymentRoute from "./routes/paymentRoute.js";
import generatorRoute from "./routes/generatorRoute.js";
import passport from "./config/passport.js";

const app = express();

/* ✅ MUST be FIRST (before cors & cookies) */
app.set("trust proxy", 1);

/* ✅ CORS */
app.use(cors({
  origin: "https://blog-hub-pearl.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

/* ✅ Core middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

/* ✅ DB */
connectDb();

/* ✅ Routes */
app.use("/auth", authRoute);
app.use("/post", postRoute);
app.use("/aiFeature", generatorRoute);
app.use("/payment", paymentRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
