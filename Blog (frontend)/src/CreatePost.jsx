import { ThemeData } from "./context/ThemeContext";
import { useContext, useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import {useAuth} from "./context/AuthProvider"
import api from "./api/api"
import Gen from "./component/Generatinganimate.jsx"

 // AI icon
function Create() {
  const { user,isAuth} = useAuth();
  const { dark } = useContext(ThemeData);
  const [posting, setPosting] = useState(false);
  const [genload, setGenload ] = useState(false);
  const [aigenload, aisetGenload ] = useState(false);
  const navigate = useNavigate();
  const [angle, setAngle] = useState(0);

    useEffect(() => {
        // Update the angle continuously
        const interval = setInterval(() => {
        setAngle(prev => (prev + 4) % 360); // increase 2 degrees per tick
        }, 30); 
        return () => clearInterval(interval);
    }, []);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Select Category");
  const [detail, setDetail] = useState("");
  const [image, setImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showPreviewConfirm, setShowPreviewConfirm] = useState(false);
  const [video, setVideo] = useState("");
  const [videoError, setVideoError] = useState(false);


  useEffect(() => {
    if (!isAuth) {
      alert("First LogIn/SignIn for posting!");
      navigate("/auth");
    }
    if(user.aiToken===0){navigate("/price")}
  }, [isAuth, navigate,user.aiToken]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (posting) return; 
        setPosting(true);
        try {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("detail", detail);
          if(category==="Select Category"){setCategory("Other")}
          formData.append("category", category);
          if(category==="Video"){
            formData.append("video", video);
          }

          if (generatedImage) {
            formData.append("imageUrl", generatedImage);
          }

          // Manual upload
          if (!generatedImage && image) {
            formData.append("image", image);
          }
          await api.post("/post/createPost", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });


          // reset form
          setTitle("");
          setDetail("");
          setCategory("");
          setImage(null);
          setGeneratedImage(null);
          navigate("/");

        } catch (err) {
          console.error(
            "Post not created",
            err.response?.data || err.message
          );
        }finally{
          setPosting(false);
        }
  };


  const textGen =async () => {
    // Generate text using gemini AI
        if (aigenload) return; 
        aisetGenload(true);
        try {
          const res = await api.post("/aiFeature/generate-post",{title , category ,detail});
          setTitle(res.data.result.title);
          setDetail(res.data.result.content);
        } catch (err) {
          console.error(
            "Not Generated! Try Again",
            err.response?.data || err.message
          );
        }finally{
          aisetGenload(false);
        }
  };
  const ImgGen =async () => {
    // Generate Image using gemini AI
      if (genload) return; 
      setGenload(true);
      try {
        const res = await api.post("/aiFeature/generate-post-image",{ prompt : title+category});
        setGeneratedImage(res.data.imageUrl);
        setShowPreviewConfirm(true);
      } catch (err) {
        console.error(
          "Not Generated! Try Again",
          err.response?.data || err.message
        );
      }finally{
        setGenload(false);
      }
  };

  return (
    <>
      {isAuth && (
        <div
          className={`${dark ? "" : "light"} min-h-screen h-screen text-white light:text-primaryD bg-secondaryD light:bg-secondary overflow-hidden`}
        >
          <Navbar />

          <div className="flex flex-row max-w-6xl gap-5 justify-center mx-auto my-5 h-10 w-full ">
            <div className="relative w-100 group">
                  {/* Gradient Glow */}
                  <div
                      className="absolute inset-0 rounded-xl blur-[5px] scale-102 group-hover:block hidden"
                      style={{
                      background: `conic-gradient(from ${angle}deg, #4286F5, #109D58, #FBBC04 ,#DC4437 ,transparent ,transparent)`,
                      }}
                  ></div>

                  {/* Button */}
                <button
                    className="group active:scale-97 relative h-full z-10 w-full rounded-xl
                              bg-triaryD text-white light:hover:text-primaryD hover:bg-primaryD
                              light:bg-gray-200 light:text-primaryD light:hover:bg-gray-100
                              transition font-semibold flex items-center justify-center overflow-hidden gap-2"
                    onClick={()=>{
                      user.plan==="Free"?navigate("/price"):textGen()}}

                  >
                    {/* Icon */}
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 30 30" 
                        className=" transition-transform duration-300 ease-out group-hover:rotate-45 group-active:rotate-0 group-hover:translate-y-1 "
                      >
                        <defs>
                          <linearGradient id="starGradient" gradientTransform="rotate(60)">
                            <stop offset="40%" stopColor="#3B82F6" />   
                            <stop offset="100%" stopColor="#EC4899" /> 
                          </linearGradient>
                        </defs>

                        <path
                          fill="url(#starGradient)"
                          d="M14.217,19.707l-1.112,2.547c-0.427,0.979-1.782,0.979-2.21,0l-1.112-2.547c-0.99-2.267-2.771-4.071-4.993-5.057
                            L1.73,13.292c-0.973-0.432-0.973-1.848,0-2.28l2.965-1.316
                            C6.974,8.684,8.787,6.813,9.76,4.47l1.126-2.714
                            c0.418-1.007,1.81-1.007,2.228,0L14.24,4.47
                            c0.973,2.344,2.786,4.215,5.065,5.226l2.965,1.316
                            c0.973,0.432,0.973,1.848,0,2.28l-3.061,1.359
                            C16.988,15.637,15.206,17.441,14.217,19.707z"
                        />
                      </svg>

                    </span>

                    {/* Text */}
                    <span
                      className="group-hover:bg-linear-to-r from-blue-500 via-red-500 to-green-500
                                bg-size-[300%_100%] bg-clip-text text-transparent
                                bg-white light:bg-primaryD font-bold
                                transition-all duration-200 hover:animate-gradient-move"
                    >
                      {aigenload?<span className="loading-dots px-2">Generating Text</span>:" AI-Text Generator"}
                    </span>
                  </button>

            </div> 
            <div className="relative w-100 group">
                  {/* Gradient Glow */}
                  <div
                      className="absolute inset-0 rounded-xl blur-[5px] scale-102 group-hover:block hidden"
                      style={{
                      background: `conic-gradient(from ${angle}deg, #4286F5, #109D58, #FBBC04 ,#DC4437 ,transparent ,transparent)`,
                      }}
                  ></div>

                  {/* Button */}
                <button
                    className="group active:scale-97 relative h-full z-10 w-full rounded-xl
                              bg-triaryD text-white light:hover:text-primaryD hover:bg-primaryD
                              light:bg-gray-200 light:text-primaryD light:hover:bg-gray-100
                              transition font-semibold flex items-center justify-center overflow-hidden gap-2"
                    onClick={()=>{
                      user.plan==="Free"?navigate("/price"):ImgGen()}}
                  >
                    {/* Icon */}
                    <span className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 30 30"
                        className=" transition-transform duration-300 ease-out group-hover:rotate-45 group-active:rotate-0 group-hover:translate-y-1 "
                       
                      >
                        <defs>
                          <linearGradient id="starGradient" gradientTransform="rotate(60)">
                            <stop offset="40%" stopColor="#3B82F6" />   
                            <stop offset="100%" stopColor="#EC4899" /> 
                          </linearGradient>
                        </defs>

                        <path
                          fill="url(#starGradient)"
                          d="M14.217,19.707l-1.112,2.547c-0.427,0.979-1.782,0.979-2.21,0l-1.112-2.547c-0.99-2.267-2.771-4.071-4.993-5.057
                            L1.73,13.292c-0.973-0.432-0.973-1.848,0-2.28l2.965-1.316
                            C6.974,8.684,8.787,6.813,9.76,4.47l1.126-2.714
                            c0.418-1.007,1.81-1.007,2.228,0L14.24,4.47
                            c0.973,2.344,2.786,4.215,5.065,5.226l2.965,1.316
                            c0.973,0.432,0.973,1.848,0,2.28l-3.061,1.359
                            C16.988,15.637,15.206,17.441,14.217,19.707z"
                        />
                      </svg>

                    </span>

                    {/* Text */}
                    <span
                      className="group-hover:bg-linear-to-r from-blue-500 via-red-500 to-green-500
                                bg-size-[300%_100%] bg-clip-text text-transparent
                                bg-white light:bg-primaryD font-bold
                                transition-all duration-200 hover:animate-gradient-move"
                    >
                      {genload?<span className="loading-dots px-2">Creating Image</span>:"ImageGenerator-AI"}
                    </span>
                  </button>
            </div> 
          </div>        


          <form onSubmit={handleSubmit} aria-disabled={posting} className="max-w-6xl w-full h-fit mx-auto flex flex-col px-6 py-8 bg-primaryD light:bg-black/7  rounded-xl ">

            {/* Title Input */}
            <div className="w-full flex flex-row gap-2">
                {/* Category Selector */}
                <select
                value={category}
                name="category"
                onChange={(e) => setCategory(e.target.value)}
                required
                className="w-[20%] mb-4 px-4 font-semibold py-2 rounded-md bg-secondaryD light:bg-primary  focus:outline-none focus:ring-2 focus:ring-logo light:focus:ring-logo2"
                >
                <option value="Select">Select Category</option>
                <option value="Technology">Techonlogy</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
                <option value="Lifestyle">Lifestyle</option>
                <option value="Education">Education</option>
                <option value="Video">Video</option>
                <option value="Other">Other</option>
                </select>

                <input
                type="text"
                placeholder="Post Title"
                name="title"
                value={title}
                required
                onChange={(e) => setTitle(e.target.value)}
                className={`w-[80%] mb-4 px-4 font-bold py-2 rounded-md border-2 bg-secondaryD light:bg-primary focus:outline-none focus:ring-2 focus:ring-logo light:focus:ring-logo2 ${aigenload?"border-logo light:border-logo2":"border-logo/0"}`}
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
                className={`w-full text-lg mb-4 px-4 py-2 rounded-md border-2  bg-secondaryD light:bg-primary  h-120 resize-none focus:outline-none focus:ring-2 focus:ring-logo light:focus:ring-logo2 ${aigenload?"border-logo light:border-logo2":"border-logo/0"}`}
              />
            )}

            {category === "Video" && (
              <div className="space-y-4">
                {/* Video URL Input */}
                <input
                  type="url"
                  placeholder="Paste video link"
                  value={video}
                  onChange={(e) => {
                    setVideo(e.target.value);
                    setVideoError(false);
                  }}
                  name="video"
                  required
                  className="w-full text-lg px-4 py-2 rounded-md b bg-secondaryD light:bg-primary
                  focus:outline-none focus:ring-2 focus:ring-logo light:focus:ring-logo2"
                />

                {/* Video Preview */}
                {video && !videoError && (
                  <div className="w-full flex justify-center  overflow-hidden  ">
                    <video
                      src={video}
                      controls
                      preload="metadata"
                      className="w-3/5 h-1/2 object-cover bg-black border  rounded-lg border-logo/40 light:border-logo2/50 shadow-md"
                      onError={() => setVideoError(true)}
                    />
                  </div>
                )}

                {/* Error message */}
                {videoError && (
                  <p className="text-red-500 text-sm">
                    This video link is not playable in browser
                  </p>
                )}

                {/* Video Direction / Description */}
                <textarea
                  placeholder="Video direction / short description"
                  value={detail}
                  name="detail"
                  onChange={(e) => setDetail(e.target.value)}
                  className="w-full text-lg px-4 py-2 rounded-md  bg-secondaryD light:bg-primary
                  resize-none h-28 focus:outline-none focus:ring-2 focus:ring-logo light:focus:ring-logo2"
                />
                <p className="mx-2 text-sm">ThumbNail</p>
              </div>
            )}


            {/* File Upload */}
            <div className="mb-2 text-xl w-full flex h-10 justify-between gap-2 ">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                  className={`border-2 ${genload?"border-logo light:border-logo2":"border-logo/0"} text-lg h-full w-4/5  rounded-lg bg-secondaryD p-1 px-10 active:scale-95 hover:bg-triaryD light:bg-primary light:hover:bg-secondary`}
                />
                <a className="w-1/5 text-sm cursor-pointer active:scale-97 font-semibold h-full rounded-lg bg-logo light:bg-logo2 hidden md:block lg:block"
                  onClick={()=>{
                    setShowPreviewConfirm(true);
                  }}
                >
                  <p className=" flex justify-center items-center h-full">Preview Image</p>
                </a>
            </div>


            {/* Post Button */}
            <button
              type="submit"
              className="px-6 py-2 bg-logo/70 light:bg-logo2/70 hover:bg-logo light:hover:bg-logo2 rounded-md"
            >
              {posting ? "Posting..." : "Post"}   
            </button>
          </form>

          
          {showPreviewConfirm && (
            <div className="fixed inset-0 z-50 flex items-center h-full justify-center bg-black/70">
              
              <div className="bg-primaryD light:bg-white w-[90%] h-[80%] max-w-6xl max-h-4/5 rounded-xl p-5 shadow-xl relative">

                <h3 className="text-lg font-semibold mb-3">
                  Use this image?
                </h3>

                {/* Image Preview */}
                <img
                  src={
                    generatedImage
                      ? generatedImage
                      : image
                      ? URL.createObjectURL(image)
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG12TWtneOcT2713QuqUyVZewzHzcQf3tTgQ&s"
                  }
                  alt="Preview"
                  className="w-full object-cover rounded-lg mb-4"
                />

                <p className="text-sm opacity-70 mb-4">
                  This image will be used as the post cover.
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowPreviewConfirm(false);
                      setImage(null);
                      setGeneratedImage(null);
                    }}
                    className="px-4 py-2 rounded-md bg-gray-500/20 hover:bg-gray-500/30"
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

          {aigenload && 
          <div className="absolute flex gap-3 rounded-xl text-lg text-black bg-white bottom-0 right-0 m-7 p-1 px-10">
              <img className="w-5" src="https://staging.svgrepo.com/show/15477/coin.svg" alt="Png File Svg - Coins Icon Png Clipart@pikpng.com"></img> 1 Credit Deduted
          </div>}
          {aigenload &&<p className="absolute top-1/8 left-3/10 text-sm mt-1 ml-1"><span className="loading-dots px-2">Powered By Gemini 2.5 </span></p>}
          {aigenload &&
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/10">
            <Gen />
          </div>}
          
          {genload && <div className="absolute flex gap-3 rounded-xl text-lg text-black bg-white bottom-0 right-0 m-7 p-1 px-10">
              <img className="w-5" src="https://staging.svgrepo.com/show/15477/coin.svg" alt="Png File Svg - Coins Icon Png Clipart@pikpng.com"></img> 2 Credit Deduted
          </div>}
          {genload &&<p className="absolute top-1/8 left-6/10 text-sm mt-1 ml-1"><span className="loading-dots px-2">Powered By Dale.E </span></p>}
          {genload &&
          <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/20">
            <Gen />
          </div>}

        </div>
      )}
    </>
  );
}

export default Create;
