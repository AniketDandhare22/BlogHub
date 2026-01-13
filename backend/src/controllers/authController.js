import userModel from '../models/user.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//token creation
const createToken = (id, remember=false) => {
    return jwt.sign(
        { id }, 
        process.env.SECRET_KEY, 
        { expiresIn: remember ? "7d" : "1h" }
    );
}

//Sign-in logic (first-timer)
export const register =async (req,res)=>{
    const {username,email,password} = req.body;
    //error handling
    if (!password) {
        return res.status(400).json({ message: "Password is required for email registration" });
    }
    try{
        const hash =await bcrypt.hash(password,10);
        let user = await userModel.create({
        username,email,password:hash,
        });
        const token = createToken(user._id)
        res.cookie("token", token, {
        httpOnly: true,
        secure: true,       // REQUIRED: Tells browser "This is safe for HTTPS"
        sameSite: 'None',   // REQUIRED: Tells browser "Allow this cross-domain"
        maxAge: 1 * 24 * 60 * 60 * 1000 // (Optional) Matches your 1d token expiry
        });
        res.status(201).json({user: { username: user.username, email: user.email }});
    }
    catch(err){
        res.status(400).json({ message: err.message });
    }
}

//login-logic 
export const login =async (req,res)=>{
    const {email,password,remember} = req.body;
    if (!password) {
        return res.status(400).json({ message: "Password is required for email registration" });
    }
    try{
        const checkUser =await userModel.findOne({email});
        if(!checkUser) return res.status(401).json({message:"User not found!"})
        const isMatch =await bcrypt.compare(password, checkUser.password);
        if(!isMatch) return res.status(401).json({ message: "Invalid user, Unauthorized Access!" });
        const token = createToken(checkUser._id,remember);
        const oneHour = 60 * 60 * 1000;
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        
        const cookieDuration = remember ? sevenDays : oneHour;

        // 4. Send the Cookie (With the Fixes + Dynamic Duration)
        res.cookie("token", token, {
        httpOnly: true,
        secure: true,       // CRITICAL for Vercel
        sameSite: 'None',   // CRITICAL for Cross-origin
        maxAge: cookieDuration // <--- This applies the checkbox logic
        });
        
        res.status(200).json({ message: "Credentials Match!", user: { username: checkUser.username, email: checkUser.email } });

    }
    catch(err){
        res.status(401).json({ message: err.message})
    }
}

//get-Info of user
export const getMe=async (req,res)=>{
    try{
        const user = await userModel.findById(req.userId).select("-password");
        res.json(user)
    }catch(err){
        res.status(400).json({message:"Invalid Access"})
    }
}

//logout
export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,       // ⚠️ MUST match the login setting
        sameSite: "None",   // ⚠️ MUST match the login setting
    });

    res.status(200).json({ message: "Logged out successfully" });
}

//update user
export const updateUserName = async (req, res) => {
  const { username } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    await userModel.findByIdAndUpdate(
      req.userId,
      { username },              
      { new: true }              
    );

    res.status(200).json({ message: "Username updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


//Delete Account
export const deleteAcc =async (req,res)=>{
    //error handling
    try{
        await userModel.findByIdAndDelete(req.userId);
        res.status(200).json({ message: "Bye! Succussfully Deleted Account"});
    }
    catch(err){
        res.status(400).json({ message: err.message });
    }
}
