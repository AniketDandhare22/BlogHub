import React from "react";
import { useParams,useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { useEffect ,useState } from "react";
import { useTheme } from "./context/useTheme.jsx";
import {useAuth} from "./context/AuthProvider"
import api from "./api/api.jsx"
import { FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import { HiTrash } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";



function Detail() {
  const { user , isAuth } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();
  const {id} = useParams();
  const [post, setPost] = useState(null);   

    // ✅ Hooks must ALWAYS run
    useEffect(() => {
      api.get(`/post/find/${id}`)
        .then(res => setPost(res.data ?? []))
        .catch(() => setPost([]));
    }, []);


    const handleLike = async () => {
      try {
        const res = await api.put(`/post/like/${id}`);
        setPost(prev => ({
          ...prev,
          likes: res.data.likes,
        }));
      } catch (err) {
        console.error(err);
      }
    };
    
    const handleDelete = async (postId) => {
      if (!window.confirm("Are you sure you want to delete this post?")) return;
      try {
        const res = await api.delete(`/post/delete/${postId}`);
        toast.success(res.data.message);
        navigate('/')

      } catch (err) {
        toast.error(
            err.response?.data?.message || // Case A: Server sent a specific error message
            err.message ||                 // Case B: Network error / 'Network Error'
            "Something went wrong"         // Case C: Fallback
        );
      }
    };


    const getDaysSincePost = (createdAt) => {
      const postDate = new Date(createdAt);
      const today = new Date();

      postDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffDays =
        Math.floor((today - postDate) / (1000 * 60 * 60 * 24)) + 1;

      return diffDays;
    };

    const formatPostDate = (createdAt) => {
      const date = new Date(createdAt);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };
    
    if (!post) {
    return (
      <div className="w-full h-screen flex  bg-secondaryD light:bg-secondary ">
        <Navbar/>
        <div className="items-center justify-center flex flex-col w-full h-full">
          <img className="w-50 animate-pulse" src="./assets/animate.png" alt="" />
          <span className="loading-dots px-2 text-lg font-semibold text-orange-400 light:text-purple-800">Loading </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full min-h-screen ${!dark ? "light" : ""} bg-secondaryD light:bg-secondary flex flex-col`}>
      <Navbar/>

      <button
        className="m-3 w-25 flex items-center gap-2 bg-primaryD light:bg-secondary border border-white/20 px-4 py-2 rounded-lg text-white light:text-black text-sm font-semibold hover:scale-105 hover:shadow-md transition"
        onClick={() => navigate("/")}
      >
        ← Back
      </button>

      {isAuth?

          <div className="w-full flex justify-center">
            <div className={`rounded-t-2xl overflow-hidden shadow-sm hover:shadow-lg transition m-4 max-w-[1200px] w-full bg-primaryD light:bg-primary`}>
              {/* Post Image */}
              {post.category !== "Video"  && (
                <div className="w-full h-[420px] overflow-hidden">
                  <img
                    src={post.postMedia}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              {/* Video */}
              {post.category === "Video"  && (
                <div className="w-full h-[700px] overflow-hidden">
                  <video controls className="w-full h-full object-cover rounded-t-lg">
                    <source src={post.Video} type="video/mp4" />
                  </video>
                </div>
              )}

              {/* Content */}
              <div className="p-6 space-y-6">
                {post.type === "blog"  && (
                <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition">
                  {post.category.toLowerCase()}
                </span>
              )}

                <h1 className="text-3xl font-bold light:text-txPrimary text-white leading-tight">
                  {post.title}
                </h1>

                <div className="flex w-full items-center justify-between gap-4 text-sm light:text-txPrimary text-white">
                  {/* Left: Author Info */}
                  <div className="flex gap-10 ">
                    <div className="flex items-center gap-3">
                      {/* Author Avatar */}
                      <img
                        src={
                          post.creator?.profilePic ||
                          post.creatorAvatar ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDITiid1JFUbnpP0iwiCSALb8vWLNeHNQgyQ&s"
                        }
                        alt={post.creator?"User Deleted":post.author}
                        className="w-10 h-10 rounded-full object-cover border border-white/20"
                      />

                      {/* Name + Date */}
                      <div className="flex flex-col leading-tight">
                        <span className="font-semibold text-base">
                          {!post.creator?"Deleted Account":post.author}
                        </span>
                        <span className="text-xs opacity-70">
                          {formatPostDate(post.createdAt)}
                        </span>
                      </div>
                    </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    {post.likes && (
                      <button className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg text-white light:text-black light:bg-secondary bg-secondaryD/70 light:hover:bg-secondary transition"
                      onClick={handleLike}>
                        ❤️ {post.likes.length}
                      </button>
                    )}
                    <button className="flex items-center gap-1 px-4 py-2 text-sm rounded-lg text-white light:text-black light:bg-secondary bg-secondaryD/70 hover:bg-secondaryD  light:hover:bg-secondary  transition">
                      🔗 Share
                    </button>
                  </div>
              </div>
                  {/* Right: Days Badge */}
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full 
                                  bg-secondaryD/70 light:bg-secondary
                                  text-xs font-medium">
                    🕛 {getDaysSincePost(post.createdAt)} days
                  </div>

    </div>



                <p className="text-base light:text-txSecondary text-txSecondaryD leading-relaxed">
                  {post.detail}
                </p>

                {/* Render sections if blog has details */}
                {post.details?.sections?.map((section, idx) => (
                  <div key={idx}>
                    <h2 className="text-2xl font-semibold text-white light:text-txPrimary pt-4">
                      {section.title}
                    </h2>
                    <p className="light:text-txSecondary text-txSecondaryD leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                ))}

                {/* Author Info */}
                  {isAuth && <div className="mt-12 pt-8 border-t border-white/10 light:border-black/10">
                    <div className="flex items-start justify-between gap-6">

                      {/* Left: Author Info */}
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <img
                          src={user?.profilePic || "/avatar.png"}
                          alt="author"
                          className="w-16 h-16 rounded-full object-cover border border-white/20"
                        />

                        {/* Info */}
                        <div className="space-y-1">
                          <h4 className="text-lg font-semibold text-white light:text-txPrimary">
                            {user?.username || "Guest User"}
                          </h4>

                          <p className="text-sm opacity-70 light:text-txSecondary text-txSecondaryD">
                            {user?.email || "Not logged in"}
                          </p>

                          <p className="text-sm light:text-txSecondary text-txSecondaryD leading-relaxed max-w-xl">
                            Writing about modern frontend development, scalable UI systems,
                            and real-world engineering practices.
                          </p>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      {user && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => alert("Upcoming feature")}
                            className="px-8 flex py-2 items-center gap-2 border-white/30  light:text-black border rounded-lg
                                      bg-logo/70 light:bg-logo2/70 hover:bg-green-500
                                      text-white transition"
                          >
                            <FaEdit size={18} /> Edit
                          </button>

                          <button
                            onClick={() => handleDelete(post._id)}
                            className="px-8 flex items-center gap-2 py-2 text border border-white/30 rounded-lg
                                      bg-secondaryD light:bg-secondary hover:bg-red-500
                                      text-white light:text-black transition"
                          > 
                            <HiTrash size={18} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>}
      
              </div>
            </div>
          </div>
      : (
          <div className="w-full flex justify-center">
            {/* CONTAINER: Matches your main post width/style exactly */}
            <div className="relative rounded-t-2xl overflow-hidden shadow-sm m-4 max-w-[1200px] w-full bg-primaryD light:bg-primary min-h-[80vh]">
              
              {/* 1. BACKGROUND: The "Fake" Content (Blurred Skeleton) */}
              <div className="w-full h-full opacity-50 pointer-events-none select-none filter blur-sm">
                
                {/* Fake Image Area */}
                <div className="w-full h-[420px] bg-gray-700 light:bg-gray-300 animate-pulse"></div>
                
                {/* Fake Text Content */}
                <div className="p-6 space-y-8">
                    {/* Fake Title */}
                    <div className="space-y-3">
                      <div className="h-10 bg-gray-700 light:bg-gray-300 rounded w-3/4"></div>
                      <div className="h-10 bg-gray-700 light:bg-gray-300 rounded w-1/2"></div>
                    </div>

                    {/* Fake User Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-700 light:bg-gray-300"></div>
                      <div className="w-32 h-4 bg-gray-700 light:bg-gray-300 rounded"></div>
                    </div>

                    {/* Fake Paragraphs */}
                    <div className="space-y-4 pt-6">
                      <div className="h-4 bg-gray-700 light:bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-700 light:bg-gray-300 rounded w-full"></div>
                      <div className="h-4 bg-gray-700 light:bg-gray-300 rounded w-5/6"></div>
                      <div className="h-4 bg-gray-700 light:bg-gray-300 rounded w-full"></div>
                    </div>
                </div>
              </div>

              {/* 2. OVERLAY: The "Login Required" Card */}
              {/* Absolute positioning puts this ON TOP of the fake content */}
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 light:bg-black/20 backdrop-blur-[2px]">
                
                <div className="bg-primaryD light:bg-white border border-white/10 light:border-gray-00 p-8 rounded-2xl shadow-2xl max-w-md text-center transform hover:scale-105 transition duration-300">
                    
                    <div className="text-5xl text-white light:text-secondaryD justify-center flex mb-4"><FaLock/></div>
                    
                    <h2 className="text-2xl font-bold text-white light:text-black mb-2">
                      Login to View
                    </h2>
                    
                    <p className="text-txSecondaryD light:text-txSecondary mb-6 text-sm">
                      This post is exclusive to community members. Sign in to read the full story, watch videos, and join the discussion.
                    </p>

                    <button 
                      onClick={() => window.location.href = "/auth"} // Or navigate('/auth')
                      className="w-full py-3 px-6 rounded-lg font-bold text-white shadow-lg transition-all
                                  bg-gradient-to-r 
                                  
                                  /* Default (Dark Mode): Orange */
                                  from-orange-600 to-orange-500 
                                  hover:from-orange-500 hover:to-orange-400 
                                  hover:shadow-orange-500/30
                                  
                                  /* Light Mode: Purple Overrides */
                                  light:from-violet-600 light:to-violet-500 
                                  light:hover:from-violet-500 light:hover:to-violet-400 
                                  light:hover:shadow-violet-500/30"
                    >
                      Sign In to Continue
                    </button>
                    
                    <p className="mt-4 text-xs text-txSecondaryD light:text-txSecondary opacity-60">
                      It's free and takes less than a minute.
                    </p>

                </div>
              </div>

            </div>
          </div>
        )
      }

    </div>
  );
}

export default Detail;
