import { GoogleGenAI } from "@google/genai";
import userModel from "../models/user.js";

// Initialize the NEW SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generatePost = async (req, res) => {
    try {
        const { topic, category, detail } = req.body;
        const user = req.user; 

        // 1. Setup the Prompt
        const prompt = `
            Act as a professional blog writer.
            Topic: "${topic}"
            User Context: "${detail}" {if not specify than use title to elablorate in best possible way and in that genre}
            Category: "${category || "General"}"
            
            Instructions:
            1. Create a catchy Title related to topic ,detail and category provided by user.
            2. Write detailed Content (check grammar, professional tone).
            3. Output strictly as a JSON Object. No markdown, no backticks.
            
            Format:
            {
                "title": "Your Title Here",
                "content": "Your full blog content here..."
            }
        `;

        // 2. Call Gemini 2.5 Flash (The New Standard)
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json" // Native JSON support!
            }
        });

        // 3. Handle Response (New SDK structure is different)
        // Gemini 2.5 + New SDK handles JSON parsing natively if we ask nicely, 
        // but we still clean it just in case.// The text is a property, or requires accessing candidates[0]
        let aiText = response.text || response.candidates[0].content.parts[0].text;
        aiText = aiText.replace(/```json|```/g, "").trim();
        const jsonResponse = JSON.parse(aiText);

        // 4. Charge the User
        if (user.plan === "Plus") {
            await userModel.findByIdAndUpdate(user._id, { $inc: { aiToken: -1 } });
        }

        res.status(200).json({ 
            success: true, 
            result: jsonResponse, 
            Token: user.aiToken,
            message: "1 Token Deduted (text-Gen)" 
        });

    } catch (error) {
        console.error("Gemini 2.5 Error:", error);
        res.status(500).json({ 
            message: "Generation Failed", 
            error: error.message 
        });
    }
};

// // --- WORKER 2: IMAGE GENERATION (HuggingFace) ---
// export const generateImage = async (req, res) => {
//     try {
//         const { prompt } = req.body;
//         const user = req.user; // Attached by Middleware

//         // 1. Check specific balance for Images (Cost: 2 Tokens)
//         // (Middleware only checked if > 0, we need to ensure > 2 here)
//         if (user.plan !== "Pro" && user.aiTokens < 2) {
//              return res.status(403).json({ message: "Not enough tokens for Image (Cost: 2)" });
//         }

//         // 2. Call Image API (HuggingFace Stable Diffusion)
//         const response = await fetch(
//             "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
//             {
//                 headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
//                 method: "POST",
//                 body: JSON.stringify({ inputs: prompt }),
//             }
//         );

//         if (!response.ok) throw new Error("Image API Failed");

//         // Convert Image Blob to Base64
//         const arrayBuffer = await response.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);
//         const base64Image = `data:image/jpeg;base64,${buffer.toString('base64')}`;

//         // 3. Charge the User (If NOT Pro)
//         if (user.plan !== "Pro") {
//             // Cost: 2 Tokens
//             await userModel.findByIdAndUpdate(user._id, { $inc: { aiTokens: -2 } });
//         }

//         res.status(200).json({ 
//             success: true, 
//             imageUrl: base64Image,
//             message: "Image Generated Successfully" 
//         });

//     } catch (error) {
//         console.error("Image Error:", error);
//         res.status(500).json({ message: "Failed to generate image." });
//     }
// };