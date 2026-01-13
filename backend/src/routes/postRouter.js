import express from "express"
import {handleLike,getPostId,getMypost,getAllPost,createPost,deletePost,updatePost,getRecentPosts} from "../controllers/postController.js"
import verifyToken from "../middleware/authMiddleware.js"; 
import multer from "multer"; 

const router = express.Router();
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

const videoUpload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } 
});

router.get("/", getAllPost);
router.post("/createPost", verifyToken, upload.single("image") ,createPost);
router.get("/mine", verifyToken, getMypost);
router.get("/recent", verifyToken, getRecentPosts);
router.get("/find/:id",verifyToken, getPostId);
router.put("/like/:id", verifyToken, handleLike);
router.delete("/delete/:postId", verifyToken, deletePost);
router.put("/update/:postId", verifyToken, updatePost);

export default router;