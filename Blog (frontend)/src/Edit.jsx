import { ThemeData } from "./context/ThemeContext";
import { useContext, useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaUpload } from "react-icons/fa";
import { useAuth } from "./context/AuthProvider";
import api from "./api/api";
import Gen from "./component/Generatinganimate.jsx";
import { toast } from "react-toastify";

function Edit() {
  const { user, isAuth, setUser } = useAuth();
  const { dark } = useContext(ThemeData);
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Extract the post data passed from Detail.jsx
  const passedPostData = location.state?.postData;

  const [posting, setPosting] = useState(false);
  const [genload, setGenload] = useState(false);
  const [aigenload, aisetGenload] = useState(false);
  const [angle, setAngle] = useState(0);

  // Initialize state with passed data if available
  const [title, setTitle] = useState(passedPostData?.title || "");
  const [category, setCategory] = useState(passedPostData?.category || "Other");
  const [detail, setDetail] = useState(passedPostData?.detail || "");
  const [image, setImage] = useState(null); // Keep null for new file uploads
  const [generatedImage, setGeneratedImage] = useState(null);
  
  const [showPreviewConfirm, setShowPreviewConfirm] = useState(false);
    const getDaysSincePost = (createdAt) => {
        const postDate = new Date(createdAt);
        const today = new Date();

        postDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        const diffDays =
            Math.floor((today - postDate) / (1000 * 60 * 60 * 24)) + 1;

        return diffDays;
        };
  // Fallback: Fetch data if user refreshes the page and location.state is lost
  useEffect(() => {
    if (!passedPostData && id) {
      api.get(`/post/find/${id}`)
        .then(res => {
          setTitle(res.data.title);
          setCategory(res.data.category);
          setDetail(res.data.detail);
        })
        .catch(() => {
            toast.error("Could not fetch post details")
            navigate('/');
        });
    }
  }, [id, passedPostData]);

  useEffect(() => {
    // Update the angle continuously for the glowing border
    const interval = setInterval(() => {
      setAngle((prev) => (prev + 4) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isAuth) {
      toast.warning("First LogIn/SignIn for editing!");
      navigate("/auth");
    }
  }, [isAuth, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (posting) return;
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("detail", detail);
      if (category === "Select Category") { setCategory("Other"); }
      formData.append("category", category);
      
      

      if (generatedImage) {
        formData.append("imageUrl", generatedImage);
      }

      // Manual upload
      if (!generatedImage && image) {
        formData.append("image", image);
      }
      
      // Changed to PUT/Update endpoint for Edit functionality
      await api.put(`/post/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post updated successfully!");
      navigate(`/detail/${id}`); // Redirect back to the post

    } catch (err) {
      console.error("Post not updated", err.response?.data || err.message);
      toast.error("Failed to update post");
    } finally {
      setPosting(false);
    }
  };

  const textGen = async () => {
    if (aigenload) return;
    aisetGenload(true);
    try {
      const res = await api.post("/aiFeature/generate-post", { title, category, detail });
      setTitle(res.data.result.title);
      setDetail(res.data.result.content);
      toast.warning(res.data.message);
      setUser((prev) => ({ ...prev, aiToken: res.data.Token }));
    } catch (err) {
      console.error("Not Generated! Try Again", err.response?.data || err.message);
      toast.error("Text generation failed");
    } finally {
      aisetGenload(false);
    }
  };

  const ImgGen = async () => {
    if (genload) return;
    setGenload(true);
    try {
      const res = await api.post("/aiFeature/generate-post-image", { prompt: title + " " + detail });
      setGeneratedImage(res.data.imageUrl);
      setShowPreviewConfirm(true);
      toast.info(res.data.message);
      setUser((prev) => ({ ...prev, aiToken: res.data.Token }));
    } catch (err) {
      console.error("Not Generated! Try Again", err.response?.data || err.message);
      toast.error("Image generation failed");
    } finally {
      setGenload(false);
    }
  };

  if(passedPostData.creator._id!== user._id){
    toast.error("😡 UnAuthorised To Edit!");
    navigate('/');
    return;
  }
  return (
    <>
      {isAuth && (
        <div className={`${dark ? "" : "light"} min-h-screen text-white light:text-primaryD bg-secondaryD light:bg-secondary overflow-x-hidden`}>
          <Navbar />

          {/* NEW HORIZONTAL AI & USER CARD */}
          <div className="flex flex-row max-w-6xl justify-center mx-auto my-5 w-full px-4">
            <div className="relative w-full max-w-4xl group">
              
              {/* Gradient Glow */}
              <div
                className="absolute inset-0 rounded-xl blur-[5px] scale-102 group-hover:block hidden"
                style={{
                  background: `conic-gradient(from ${angle}deg, #4286F5, #109D58, #FBBC04 ,#DC4437 ,transparent ,transparent)`,
                }}
              ></div>

              {/* Main Card Box */}
              <div className="relative z-10 w-full p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 
                              bg-triaryD text-white light:bg-gray-200 light:text-primaryD transition">
                
                {/* Left Side: User Info Section */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <img 
                    src={user?.profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDITiid1JFUbnpP0iwiCSALb8vWLNeHNQgyQ&s"} 
                    alt="avatar" 
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{user?.username || "Author"}</span>
                    <span className="text-xs text-gray-400 light:text-gray-500">Editing Post</span>
                    <span className="text-xs text-gray-400 light:text-gray-500">Posted {getDaysSincePost(passedPostData.createdAt)} Days ago</span>
                  </div>
                </div>

                {/* Right Side: Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-start md:justify-end gap-3 w-full md:w-auto">
                  <div className="group/textBtn active:scale-97 py-2 px-4 rounded-lg
                               transition font-semibold flex items-center justify-center overflow-hidden gap-2"
                    >
                    <span className=" px-2">Editing Post . . . </span>
                  </div>
                  {/* Text Helper AI Button */}
                  <button
                    className="group/textBtn active:scale-97 py-2 px-4 rounded-lg
                               bg-gray-800 hover:bg-gray-700 light:bg-gray-100 light:hover:bg-white
                               transition font-semibold flex items-center justify-center overflow-hidden gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      user.plan === "Free" ? navigate("/price") : textGen();
                    }}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 30 30" 
                           className="transition-transform duration-300 ease-out group-hover/textBtn:rotate-45 group-active/textBtn:rotate-0 group-hover/textBtn:translate-y-1">
                        <defs>
                          <linearGradient id="starGradient1" gradientTransform="rotate(60)">
                            <stop offset="40%" stopColor="#3B82F6" />   
                            <stop offset="100%" stopColor="#EC4899" /> 
                          </linearGradient>
                        </defs>
                        <path fill="url(#starGradient1)" d="M14.217,19.707l-1.112,2.547c-0.427,0.979-1.782,0.979-2.21,0l-1.112-2.547c-0.99-2.267-2.771-4.071-4.993-5.057 L1.73,13.292c-0.973-0.432-0.973-1.848,0-2.28l2.965-1.316 C6.974,8.684,8.787,6.813,9.76,4.47l1.126-2.714 c0.418-1.007,1.81-1.007,2.228,0L14.24,4.47 c0.973,2.344,2.786,4.215,5.065,5.226l2.965,1.316 c0.973,0.432,0.973,1.848,0,2.28l-3.061,1.359 C16.988,15.637,15.206,17.441,14.217,19.707z"/>
                      </svg>
                    </span>
                    <span className="text-sm whitespace-nowrap group-hover/textBtn:bg-linear-to-r from-blue-500 via-red-500 to-green-500
                                     bg-size-[300%_100%] bg-clip-text text-transparent bg-white light:bg-primaryD font-bold
                                     transition-all duration-200 group-hover/textBtn:animate-gradient-move">
                      {aigenload ? <span className="loading-dots">Generating...</span> : "AI-Text Gen"}
                    </span>
                  </button>

                  {/* Image Generator Button */}
                  <button
                    className="group/imgBtn active:scale-97 py-2 px-4 rounded-lg
                               bg-gray-800 hover:bg-gray-700 light:bg-gray-100 light:hover:bg-white
                               transition font-semibold flex items-center justify-center overflow-hidden gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      user.plan === "Free" ? navigate("/price") : ImgGen();
                    }}
                  >
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 30 30"
                           className="transition-transform duration-300 ease-out group-hover/imgBtn:rotate-45 group-active/imgBtn:rotate-0 group-hover/imgBtn:translate-y-1">
                        <defs>
                          <linearGradient id="starGradient2" gradientTransform="rotate(60)">
                            <stop offset="40%" stopColor="#3B82F6" />   
                            <stop offset="100%" stopColor="#EC4899" /> 
                          </linearGradient>
                        </defs>
                        <path fill="url(#starGradient2)" d="M14.217,19.707l-1.112,2.547c-0.427,0.979-1.782,0.979-2.21,0l-1.112-2.547c-0.99-2.267-2.771-4.071-4.993-5.057 L1.73,13.292c-0.973-0.432-0.973-1.848,0-2.28l2.965-1.316 C6.974,8.684,8.787,6.813,9.76,4.47l1.126-2.714 c0.418-1.007,1.81-1.007,2.228,0L14.24,4.47 c0.973,2.344,2.786,4.215,5.065,5.226l2.965,1.316 c0.973,0.432,0.973,1.848,0,2.28l-3.061,1.359 C16.988,15.637,15.206,17.441,14.217,19.707z"/>
                      </svg>
                    </span>
                    <span className="text-sm whitespace-nowrap group-hover/imgBtn:bg-linear-to-r from-blue-500 via-red-500 to-green-500
                                     bg-size-[300%_100%] bg-clip-text text-transparent bg-white light:bg-primaryD font-bold
                                     transition-all duration-200 group-hover/imgBtn:animate-gradient-move">
                      {genload ? <span className="loading-dots">Creating...</span> : "Image-AI Gen"}
                    </span>
                  </button>

                </div>
              </div>
            </div>
          </div>        

          {/* EDIT FORM */}
          <form onSubmit={handleSubmit} aria-disabled={posting} className="max-w-6xl w-full h-fit mx-auto flex flex-col px-6 py-8 bg-primaryD light:bg-black/7  rounded-xl ">
            {/* Title Input */}
            <div className="w-full flex flex-row gap-2">
                <select
                  value={category}
                  name="category"
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-[20%] mb-4 px-4 font-semibold py-2 rounded-md bg-secondaryD light:bg-primary focus:outline-none focus:ring-2 focus:ring-logo light:focus:ring-logo2"
                >
                  <option disabled>Select Category</option>
                  <option value="Technology">Techonlogy</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>

                <input
                  type="text"
                  placeholder="Post Title"
                  name="title"
                  value={title}
                  required
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-[80%] mb-4 px-4 font-bold py-2 rounded-md border-2 bg-secondaryD light:bg-primary focus:outline-none focus:ring-2 focus:ring-gray-400${aigenload ? "border-logo light:border-logo2" : "border-logo/0"}`}
                />
            </div>

            {/* Content Input - hidden for Video */}
            {category !== "Video" && (
              <textarea
                placeholder="Write your content here..."
                name="detail"
                required
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                className={`w-full text-lg mb-4 px-4 py-2 rounded-md border-2 bg-secondaryD light:bg-primary h-120 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400 ${aigenload ? "border-logo light:border-logo2" : "border-logo/0"}`}
              />
            )}

            {category === "Video" && toast.error("Sorry, Working on Video Update Feature!") && navigate('/')}

            {/* File Upload */}
            <div className="mb-2 text-xl w-full flex h-10 justify-between gap-2 ">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className={`border-2 ${genload ? "border-gray-400" : "border-logo/0"} text-lg h-full w-4/5 rounded-lg bg-secondaryD p-1 px-10 active:scale-95 hover:bg-triaryD light:bg-primary light:hover:bg-secondary`}
                />
                <a className="w-1/5 text-sm cursor-pointer active:scale-97 font-semibold h-full rounded-lg bg-gray-400 hidden md:block lg:block"
                  onClick={() => { setShowPreviewConfirm(true); }}
                >
                  <p className=" flex justify-center items-center h-full">Preview Image</p>
                </a>
            </div>

            {/* Post Button */}
            <button
              type="submit"
              className="px-6 py-2 mt-4 bg-gray-400 hover:bg-green-400 rounded-md"
            >
              {posting ? "Updating..." : "Update Post"}   
            </button>
          </form>

          {/* IMAGE PREVIEW MODAL */}
          {showPreviewConfirm && (
            <div className="fixed inset-0 z-50 flex items-center h-full justify-center bg-black/70">
              <div className="bg-primaryD light:bg-white w-[90%] h-[80%] max-w-6xl max-h-4/5 rounded-xl p-5 shadow-xl relative">
                <h3 className="text-lg font-semibold mb-3">Use this image?</h3>
                <img
                  src={
                    generatedImage
                      ? generatedImage
                      : image
                      ? URL.createObjectURL(image)
                      : passedPostData?.postMedia || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG12TWtneOcT2713QuqUyVZewzHzcQf3tTgQ&s"
                  }
                  alt="Preview"
                  className="w-full h-[80%] object-cover rounded-lg mb-4"
                />
                <p className="text-sm opacity-70 mb-4">This image will be used as the post cover.</p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowPreviewConfirm(false);
                      setImage(null);
                      setGeneratedImage(null);
                    }}
                    className="px-4 py-2 rounded-md bg-gray-500/20 hover:bg-gray-500/30 text-white light:text-black"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => setShowPreviewConfirm(false)}
                    className="px-4 py-2 rounded-md bg-logo hover:bg-logo/90 text-white"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* LOADING OVERLAYS */}
          {aigenload && 
          <div className="fixed flex gap-3 rounded-xl text-lg text-black bg-white bottom-0 right-0 m-7 p-1 px-10 z-[60]">
              <img className="w-5" src="https://staging.svgrepo.com/show/15477/coin.svg" alt="coin"></img> 1 Credit Deducted
          </div>}
          
          {aigenload &&
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center">
               <Gen />
               <p className="text-sm mt-4 text-white"><span className="loading-dots px-2">Powered By Gemini 2.5 </span></p>
            </div>
          </div>}
          
          {genload && 
          <div className="fixed flex gap-3 rounded-xl text-lg text-black bg-white bottom-0 right-0 m-7 p-1 px-10 z-[60]">
              <img className="w-5" src="https://staging.svgrepo.com/show/15477/coin.svg" alt="coin"></img> 2 Credits Deducted
          </div>}

          {genload &&
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
             <div className="flex flex-col items-center">
               <Gen />
               <p className="text-sm mt-4 text-white"><span className="loading-dots px-2">Powered By Dall-E </span></p>
            </div>
          </div>}

        </div>
      )}
    </>
  );
}

export default Edit;