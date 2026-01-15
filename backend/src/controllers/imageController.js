import cloudinary from "cloudinary";
import streamifier from "streamifier";
import userModel from "../models/user.js";
import { InferenceClient } from "@huggingface/inference"; 

// 1. Configure Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Initialize Hugging Face Client
const client = new InferenceClient(process.env.HF_TOKEN);

// --- HELPER: Delete Old Image ---
const deleteFromCloud = async (imageUrl) => {
    if (!imageUrl || !imageUrl.includes("cloudinary")) return;
    try {
        const parts = imageUrl.split('/');
        const filename = parts.pop().split('.')[0];
        const folder = parts.pop();
        await cloudinary.v2.uploader.destroy(`${folder}/${filename}`);
    } catch (err) {
        console.log("Delete error (ignorable):", err.message);
    }
};

// ==========================================
// FEATURE 1: UPLOAD AVATAR (Manual & Free)
// ==========================================
export const uploadAvatar = async (req, res) => {
    try {
        // 1. Check if Multer caught the file
        if (!req.file) {
            return res.status(400).json({ message: "No file provided!" });
        }

        const user = await userModel.findById(req.userId);

        // 2. Cleanup: Delete the old avatar if it exists
        if (user.profilePic) {
            await deleteFromCloud(user.profilePic);
        }

        // 3. Upload to Cloudinary (with Resize)
        const uploadStream = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                    { 
                        folder: "bloghub_avatars",
                        // OPTIMIZATION: Force it to be a small 200x200 square
                        transformation: [{ width: 200, height: 200, crop: "fill", gravity: "face" }] 
                    }, 
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                // Pipe the buffer (RAM) -> Cloudinary
                streamifier.createReadStream(buffer).pipe(stream);
            });
        };

        const result = await uploadStream(req.file.buffer);

        // 4. Save new URL to DB
        user.profilePic = result.secure_url;
        await user.save();

        res.status(200).json({ 
            success: true, 
            imageUrl: user.profilePic, 
            message: "Avatar Updated Successfully!" 
        });

    } catch (error) {
        console.error("DEBUG ERROR:", error); // Print to terminal
        
        // Send the REAL error message to the frontend temporarily
        res.status(500).json({ 
            message: "Upload Failed", 
            error: error.message // <--- This will tell us the secret!
        });
    }
};


// ==========================================
// FEATURE 2: GENERATE BLOG IMAGE (New SDK)
// ==========================================
export const generatePostImage = async (req, res) => {
    try {
        const {prompt} = req.body;
        const user = await userModel.findById(req.userId).select("-password");;

        // 1. Check Tickets
        if (user.plan !== "Pro" && user.aiToken < 2) {
             return res.status(403).json({ message: "Not enough tickets (Cost: 2)" });
        }
        console.log("⚡ Generating with Qwen-Image-Lightning...");

        // 3. NEW SDK CALL (The code you provided)
        const imageBlob = await client.textToImage({
            model: "stabilityai/stable-diffusion-xl-base-1.0", // <--- Free & Reliable
            inputs: prompt, // 4-8 steps is usually enough for Lightning models
        });

        // 4. Convert Blob to Buffer (Node.js style)
        const arrayBuffer = await imageBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 5. Upload to Cloudinary
        const uploadStream = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                    { folder: "bloghub_posts" },
                    (error, result) => result ? resolve(result) : reject(error)
                );
                streamifier.createReadStream(buffer).pipe(stream);
            });
        };

        const result = await uploadStream(buffer);

        // 6. Charge User
        if (user.plan !== "Pro") {
            await userModel.findByIdAndUpdate(user._id, { $inc: { aiToken: -2 } });
        }

        res.json({ 
            success: true, 
            imageUrl: result.secure_url,
            Token: user.aiToken,
            message: "2tk Deducted, Image-Gen" 
        });

    } catch (error) {
        console.error("AI Gen Error:", error);
        res.status(500).json({ 
            message: "Image Generation Failed",
            error: error.message 
        });
    }
};


// ==========================================
// FEATURE 3: UPLOAD VIDEO (New)
// ==========================================
export const uploadVideo = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No video file provided!" });

        console.log("🎥 Starting Video Upload...");

        const uploadStream = (buffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.v2.uploader.upload_stream(
                    { 
                        folder: "bloghub_videos",
                        resource_type: "video" // <--- CRITICAL! Default is 'image'
                    }, 
                    (error, result) => {
                        if (result) resolve(result);
                        else reject(error);
                    }
                );
                streamifier.createReadStream(buffer).pipe(stream);
            });
        };

        // Videos take longer, so we await patiently
        const result = await uploadStream(req.file.buffer);

        res.json({ 
            success: true, 
            videoUrl: result.secure_url, 
            message: "Video Uploaded!" 
        });

    } catch (error) {
        console.error("Video Upload Error:", error);
        res.status(500).json({ message: "Video upload failed (File might be too big)" });
    }
};