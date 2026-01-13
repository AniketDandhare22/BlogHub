import mongoose from "mongoose";

const subSchema = new mongoose.Schema({
  user: { type:mongoose.Schema.Types.ObjectId, ref:'User' ,require:true},
  paymentId: { type: String},
  status: { type: String , default:"Inactive"},
  amount: { type: Number},
  expiry:{type:Date , default:Date.now()},
  plan: { type: String}
}, { timestamps: true });

export default mongoose.model("Sub", subSchema);