import 'dotenv/config';
import express from "express"
import cookieParser from "cookie-parser";
import connectDb from './config/mongoose-config.js'
import authRoute from "./routes/authRouter.js"
import postRoute from "./routes/postRouter.js"
import paymentRoute from "./routes/paymentRoute.js"
import generatorRoute from "./routes/generatorRoute.js"
import cors from "cors";// ... specific imports
import passport from "./config/passport.js"; 

const app =express();
const PORT = process.env.PORT || process.env.LOCAL_PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.use(cors({
  origin: "https://blog-hub-pearl.vercel.app", // ⚠️ MUST be your exact Vercel URL (no trailing slash)
  credentials: true, // ⚠️ CRITICAL: Allows cookies to pass through
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


//connect mongoDB
connectDb();
app.use(express.json());
app.set('trust proxy', 1);
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(passport.initialize());
app.use("/auth",authRoute);
app.use("/post",postRoute);
app.use("/aiFeature",generatorRoute);
app.use("/payment",paymentRoute);


