import ticketModel from "../models/ticket.js"; 
import Razorpay from "razorpay";
import crypto from "crypto";
import userModel from "../models/user.js";
import subModel from "../models/sub.js"; 

// 1. Initialize Razorpay using keys from .env
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const PRICING = {
    "Plus": 499,
    "Pro": 4999
};

export const createOrder = async (req, res) => {
  try {
    const { planType } = req.body; 
    // 2. Are you checking if planType exists?
    if (!PRICING[planType]) {
        return res.status(400).json({ success: false, message: "Invalid Plan Type" });
    }

    const amountInRupees = PRICING[planType];

    const options = {
      amount: amountInRupees * 100, // conversion to paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    
    // 3. Send success
    res.json({ success: true, order, planType }); 

  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planType } = req.body;
    const userId = req.userId; 

    // ---------------------------------------------------
    // STEP 1: SECURITY (The Gatekeeper) - SHARED
    // ---------------------------------------------------
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
       return res.status(400).json({ success: false, message: "Invalid Signature" });
    }

    // ---------------------------------------------------
    // STEP 2: THE FORK (Handle Logic based on Plan)
    // ---------------------------------------------------

    if (planType === "Pro") {
        // === LOGIC FOR SUBSCRIPTION ===
        
        // 1. Create Sub Record
        const newSub = await subModel.create({
            user: userId,
            paymentId: razorpay_payment_id,
            status:"Active",
            plan: "Pro",
            amount: 4999,
            expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // +1 Year
        });

        // 2. Update User (Enable Pro)
        await userModel.findByIdAndUpdate(userId, {
            $push: { sub: newSub._id }, // Keep history
            planExpiry: new Date(Date.now() + 365*24*60*60*1000),
            plan: "Pro"        // Activate Feature
        });

        return res.status(200).json({ success: true, message: "Welcome to Pro!" });

    } else {
        // === LOGIC FOR TICKETS (PLUS) ===
        
        // 1. Create Ticket Record (The Log)
        const tic = await ticketModel.create({
            user: userId,aiToken:10,
            paymentId: razorpay_payment_id,
            plan: "Plus",
            amount: 499, // Or whatever amount comes from frontend
        });

        // 2. Update User (Just Add Tokens)
        const user = await userModel.findByIdAndUpdate(userId, {
            $inc: { aiToken: 10 },   
            plan: "Plus" 
        });
        user.ticket.push(tic._id);
        await user.save();

        return res.status(200).json({ success: true, message: "100 Tokens Added!" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Verification Error" });
  }
};