import express from "express"
import { generatePost } from "../controllers/generateController.js";
import multer from "multer"; 
import verifyToken from "../middleware/authMiddleware.js";
import { uploadAvatar,generatePostImage,uploadVideo } from "../controllers/imageController.js";
import checkSubscription from "../middleware/subCheck.js"

const Router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

const videoUpload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } 
});

Router.post("/upload-video", verifyToken, videoUpload.single("file"), uploadVideo);
Router.post("/upload-avatar",verifyToken, upload.single("file"), uploadAvatar);
Router.post("/generate-post", verifyToken, checkSubscription, generatePost)
Router.post("/generate-post-image", verifyToken, checkSubscription ,generatePostImage);

export default Router;
