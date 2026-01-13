import express from "express"
import {register,login,getMe,logout,updateUserName,deleteAcc} from "../controllers/authController.js"
import verifyToken from "../middleware/authMiddleware.js"; 
import passport from "passport";
import jwt from "jsonwebtoken";

const Router = express.Router();

Router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));

Router.get(
  "/google/callback",
  passport.authenticate("google", { 
    session: false, 
    failureRedirect: "https://blog-hub-pearl.vercel.app/auth" 
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user._id},
      process.env.SECRET_KEY, 
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
        httpOnly: true, 
        sameSite: "strict",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000 
    });
    res.redirect(process.env.FRONT_PORT); 
  }
);

Router.post("/signin",register);
Router.delete("/deleteAccount",verifyToken,deleteAcc);
Router.put("/updateUsername",verifyToken,updateUserName);
Router.post("/login",login);
Router.get("/me",verifyToken,getMe);
Router.get("/logout",verifyToken, logout);

export default Router;