import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 

  provider: { type: String, default: "email" }, // "google" or "email"
  googleId: { type: String }, // Store Google's unique ID for this user
  
  profilePic: { type: String, default: "https://res.cloudinary.com/dq3nco2jd/image/upload/v1768098580/bloghub_avatars/rgmzb4aq8swqbyakquhq.png" },
  plan: { type: String, default: "Free" },
  planExpiry: { type: Date, default:Date.now()},
  aiToken: { type: Number, default:0},
  post:[{ type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
  sub:[{ type:mongoose.Schema.Types.ObjectId, ref:'Sub'}],
  ticket:[{ type:mongoose.Schema.Types.ObjectId, ref:'Token'}],
  recentPost:[{ type:mongoose.Schema.Types.ObjectId, ref:'Post'}],
}, { timestamps: true });

export default mongoose.model("User", userSchema);