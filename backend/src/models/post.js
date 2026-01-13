import mongoose from "mongoose";
const postSchema = new mongoose.Schema({
  creator:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required :true
  },
  title: { type: String, required: true },
  author: { type: String, default:"guest"},
  postMedia: { type: String},
  Video: { type: String },
  category: { type: String,default:"Others"},
  detail: { type: String, required: true },
  likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  }]
}, { timestamps: true });


export default mongoose.model("Post", postSchema);