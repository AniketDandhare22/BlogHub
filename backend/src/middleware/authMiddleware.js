import jwt from "jsonwebtoken"

const verifyToken=(req,res,next)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({Message:"Login Required"});
    try{
        const decoded = jwt.verify(token,process.env.SECRET_KEY);
        //adding userId to req later controller will aacess to verify
        req.userId = decoded.id;
        next();
    }catch(err){
        res.status(401).json({Message:"Invalid or expired token"})
    }
}

export default verifyToken;