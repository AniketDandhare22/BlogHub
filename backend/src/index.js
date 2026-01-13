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

app.use(cors({
  origin: process.env.FRONT_PORT, // frontend port
  credentials: true
}));


//connect mongoDB
connectDb();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.use(passport.initialize());
app.use("/auth",authRoute);
app.use("/post",postRoute);
app.use("/aiFeature",generatorRoute);
app.use("/payment",paymentRoute);

app.listen(process.env.PORT,(res)=>{
    console.log("running on port",process.env.PORT)
});

