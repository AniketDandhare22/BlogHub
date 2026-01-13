import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  user: { type:mongoose.Schema.Types.ObjectId, ref:'User' ,require:true},
  amount: { type: Number},
  ticket: { type: Number , default:0},
  paymentId: { type: String},
  plan: { type: String, default: "Plus" }
}, { timestamps: true });

export default mongoose.model("Ticket", ticketSchema);