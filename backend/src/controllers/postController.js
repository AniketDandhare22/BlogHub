import userModel from "../models/user.js"
import cloudinary from "cloudinary";
import streamifier from "streamifier";
import postModel from "../models/post.js";

export const createPost = async (req, res) => {
  try {
    const { title, detail, category,Video} = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let imageUrl = null;

    // ✅ IF IMAGE EXISTS → upload to Cloudinary
    if (req.file) {
      const uploadStream = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { folder: "bloghub_posts" },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(buffer).pipe(stream);
        });

      const result = await uploadStream(req.file.buffer);
      imageUrl = result.secure_url;
    }

    if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    if(!imageUrl){ imageUrl="https://ralfvanveen.com/wp-content/uploads/2021/06/Placeholder-_-Begrippenlijst.webp";}
    const author =await userModel.findById(req.userId).select("-password");
    // ✅ CREATE POST WITH IMAGE URL
    const post = await postModel.create({
      title,
      detail,
      creator:req.userId,
      category,
      Video,
      postMedia: imageUrl,      // ← Cloudinary URL
      author:author.username,
    });

    if (!author) {return res.status(404).json({ message: "Author not found" });}
    author.post.push(post._id);
    await author.save();
    res.status(201).json({
      success: true,
      post,
    });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({ message: "Post creation failed" });
  }
};


export const getAllPost=async (req,res)=>{
    try{
        const post =await postModel.find().populate("creator", "username profilePic").sort({ createdAt: -1 });
        if(!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json({post});
    }catch(err){
        res.status(400).json({ message: err.message });
    }
}

export const getMypost=async (req,res)=>{
    const user =req.userId;
    try{
        const post =await postModel.find({creator:user}).sort({ createdAt: -1 });
        if(!post) return res.status(404).json({ message: "Post not found" });
        res.status(200).json(post);
    }catch(err){
        res.status(400).json({ message: err.message });
    }
}

export const getPostId =async (req,res)=>{
    const {id} = req.params;
    try{
        const post =await postModel.findById(id).populate("creator", "username profilePic");
        if(!post) return res.status(404).json({ message: "Post not found" });
        let user = await userModel.findById(req.userId);
        if(!user) res.status(200).json(post);
        // remove if already exists
        user.recentPost = user.recentPost.filter(
          id => id.toString() !== post._id.toString()
        );

        // add to front (newest first)
        user.recentPost.unshift(post._id);

        // cap to 4
        user.recentPost = user.recentPost.slice(0, 6);
        await user.save();
        res.status(200).json(post);
    }catch(err){
        res.status(400).json({ message: err.message });
    }
}

//handle like logic
export const handleLike = async (req, res) => {
    const { id } = req.params;
    try {
        if (!req.userId) return res.status(401).json({ message: "Login required" });
        const post = await postModel.findById(id);
        if (!post) return res.status(404).json({ message: "Post not found! to like" });

        // prevent duplicate likes
        if (post.likes.includes(req.userId)) {
            post.likes = post.likes.filter(id => id.toString() !== req.userId);
        } else {
            post.likes.push(req.userId);
        }
        await post.save();
        res.status(200).json({ likes: post.likes });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}

export const deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Authorization check (owner only)
    if (post.creator.toString() !== req.userId) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }
    // Delete the post
    await postModel.findByIdAndDelete(postId);
    await userModel.findByIdAndUpdate(
      req.userId,
      { $pull: { post: postId } }, 
      { new: true }
    );
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//update Post
export const updatePost = async (req, res) => {
    let {postMedia,title,category,detail} = req.body
    const { postId } = req.params;
    try {
        const post = await postModel.findById(postId);
        if (!post) {
        return res.status(404).json({ message: "Post not found" });
        }
        // Authorization check (owner only)
        if (post.creator.toString() !== req.userId) {
        return res.status(403).json({ message: "Not authorized to Update this post" });
        }
        // Update the post
        const change = await postModel.findByIdAndUpdate(
            postId,
            { title, detail, category, postMedia }, 
            { new: true } 
        );
    res.status(200).json({ message: "Post Updated successfully" });
        } catch (err) {
            res.status(500).json({ message: err.message },{post:change});
        }
};

//recent pOst
// GET /user/recent
export const getRecentPosts = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.userId)
      .populate({
        path: "recentPost",
        select: "title detail postMedia createdAt",
      });

    res.json(user.recentPost || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recent posts" });
  }
};


