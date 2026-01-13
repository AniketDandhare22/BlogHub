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
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`
  }),
  (req, res) => {
    const user = req.user;
    
    // 1. Generate Token
    const token = jwt.sign(
      { id: user._id},
      process.env.SECRET_KEY, 
      { expiresIn: "7d" }
    );

    // 2. Set Cookie (CRITICAL FIXES HERE)
    res.cookie("token", token, {
      httpOnly: true, 
      sameSite: "None",  // CHANGED: "strict" -> "None" (Required for cross-site)
      secure: true,      // CHANGED: false -> true (Required when sameSite is None)
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    // 3. Redirect to the correct Full URL
    // Make sure FRONTEND_URL is set in Render to "https://blog-hub-pearl.vercel.app"
    const redirectURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(redirectURL); 
  }
);

Router.post("/signin",register);
Router.delete("/deleteAccount",verifyToken,deleteAcc);
Router.put("/updateUsername",verifyToken,updateUserName);
Router.post("/login",login);
Router.get("/me",verifyToken,getMe);
Router.get("/logout",verifyToken, logout);

export default Router;