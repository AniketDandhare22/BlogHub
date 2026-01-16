import { useState } from "react";
import backg1 from "./assets/woc_4.png"
import backg2 from "./assets/woc_2.jpg"
import backg3 from "./assets/white4.png"
import { useNavigate } from "react-router-dom";
import backg4 from "./assets/black4.png"
import api from "./api/api"
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "./context/useTheme";
import {useAuth } from "./context/AuthProvider"
import { toast } from "react-toastify";

function App() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const {login} = useAuth();
  const {dark, toggleTheme } = useTheme();
  const [status ,setStatus] =  useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate(); 

  const handleOauth = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_REDIRECT;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
      try {
        setLoading(true);
        setSuccess(false);

        // 1. Get the current value of 'remember' from your state
        const { email, password, username } = form; 
        // Assuming you have a 'remember' state variable, pass it here
        const rememberMe = remember; // or false if not used

        if (status) {
          // ----------------------------------
          // LOGIN LOGIC
          // ----------------------------------
          await api.post("/auth/login", {
            email,
            password,
            remember: rememberMe // ✅ Pass this so backend sets correct cookie duration
          });
          
          // Update global context that user is logged in
          login(); 
          
        } else {
          // ----------------------------------
          // SIGNUP LOGIC
          // ----------------------------------
          // Check your backend route name!
          await api.post("/auth/signup", { 
            username,
            email,
            password
          });
          
          // Auto-login after signup (if your backend supports it)
          // Or you might want to ask them to login manually
          login(); 
        }

        setSuccess(true);
        
        // Redirect
        setTimeout(() => {
          navigate("/");
        }, 800);

      } catch (err) {
        console.error("Auth Error:", err);
        // Safe access to error message
        const errorMsg = err.response?.data?.message || "Authentication failed";
        toast.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };
  const isDisabled = loading || !form.email || !form.password || (!status && !form.username); 
  // username only required when Sign Up
  return (
    <div className={`w-full h-screen p-2 bg-cover flex justify-center ${!dark?"text-black light":"text-white"} `} style={{backgroundImage: `url(${!dark ? backg3 : backg4})`}}>
      <div className={`glass-effect h-[97%] w-full m-3 flex overflow-hidden ${status? "flex-row-reverse" : "flex-row"} ${!dark?"": "border border-white/70 shadow-[0_0_45px_15px_rgba(168,85,247,0.45)]"} backdrop-blur-xl transition-all duration-700 max-w-[1600px] justify-center`}>

        {/* Left */}
        <div className={`w-1/2 h-full bg-cover bg-no-repeat transition-[background-position,transform] duration-600 ease-in-out hidden md:block lg:block`} style={{
              backgroundImage: `url(${status ? backg1 : backg2})`,
              backgroundPosition: !dark ? "right center" : "left center",
              transform: status ? "scale(1.05)" : "scale(1)"
        }}/>

        {/* Right Form Section */}
        <div className="lg:w-1/2 md:w-1/2 w-full flex flex-col px-10 py-8 relative">
          <div className="flex items-center justify-between p-4 gap-2 w-full">
            
            <div className="w-[50%] h-full items-center flex flex-row px-2 cursor-pointer animate-bounce" onClick={()=>{navigate('/')}}>
           <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 48 48">
              <path 
                fill={!status ? "#B35F15" : "#8639D3"} 
                d="M37,42H11c-2.761,0-5-2.239-5-5V11c0-2.761,2.239-5,5-5h26c2.761,0,5,2.239,5,5v26 C42,39.761,39.761,42,37,42z"
              />
              <path 
                fill="#fff" 
                d="M33.5,22h-1c-0.828,0-1.5-0.672-1.5-1.5V20c0-3.866-3.134-7-7-7h-4c-3.866,0-7,3.134-7,7v8 c0,3.866,3.134,7,7,7h8c3.866,0,7-3.134,7-7v-4.5C35,22.672,34.328,22,33.5,22z M20,19h5c0.553,0,1,0.448,1,1s-0.447,1-1,1h-5 c-0.553,0-1-0.448-1-1S19.447,19,20,19z M28,29h-8c-0.553,0-1-0.448-1-1s0.447-1,1-1h8c0.553,0,1,0.448,1,1S28.553,29,28,29z"
              />
            </svg>

            <div className="  font-bold text-2xl pt-1 h-full items-center flex"> Blog<span className={`text-white ${!status?"bg-orange-500":"bg-purple-700"} px-2 rounded-lg`}>Hub</span></div>
        </div>
          {/* Top Right Toggle Button */}
          <div className="flex justify-end">
            <button
              onClick={() => setStatus(!status)}
              className={`p-2 bg-white border-2 rounded-lg font-bold active:scale-95 hover:border-transparent hover:text-white transition ${
                status
                ? "text-purple-900 hover:bg-purple-800"
                : "text-orange-500 hover:bg-orange-400"
              }`}
              >
              {status ? "Sign In" : "Log In"}
            </button>
          </div>
          </div>

          <div className="mt-2 w-full p-8 lg:p-30 md:p-20 lg:pt-21 mx-3 sm:mx-1">
              {/* Welcome Text */}
              <div className="mt-10 mb-6">
                <h2 className="text-3xl font-bold">
                  {status ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-gray-500 mt-2">
                  {status
                    ? "Log in to continue"
                    : "Sign up to join our community"}
                </p>
              </div>

              {/* Form */}
              <div className="flex flex-col justify-center items-center gap-4 w-full">
                {!status && (
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Username"
                    className={`w-full border-transparent ${status?"text-purple-800 focus:ring-2 focus:ring-purple-800":"text-orange-500 focus:ring-2 focus:ring-orange-500"} rounded-lg px-4 py-2  bg-white`}
                  />
                )}
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className={`w-full border-transparent ${status?"text-purple-800 focus:ring-2 focus:ring-purple-800":"text-orange-500 focus:ring-2 focus:ring-orange-500"} rounded-lg px-4 py-2  bg-white`}
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`w-full border-transparent ${status?"text-purple-800 focus:ring-2 focus:ring-purple-800":"text-orange-500 focus:ring-2 focus:ring-orange-500"} rounded-lg px-4 py-2  bg-white`}
                />


                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={handleSubmit}
                  className={`w-full py-2 rounded-lg font-semibold transition ${
                    status ? "bg-purple-800 text-white hover:bg-purple-900" : "bg-orange-500 text-white hover:bg-orange-600"
                  } ${isDisabled ? "cursor-not-allowed bg-gray-300" : ""}`}
                  >
                  {loading
                    ? status
                      ? "Logging In..."
                      : "Signing Up..."
                    : status
                    ? "Log In"
                    : "Sign Up"}
                </button>

                    {status && <div className="flex w-full items-center justify-between px-2"> {/* Container for spacing */}
      
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      
                      {/* The Checkbox Input */}
                      <input 
                        type="checkbox" 
                        checked={remember} 
                        onChange={(e) => setRemember(e.target.checked)} 
                        className="w-5 h-5 accent-logo2 cursor-pointer  focus:ring-0 focus:ring-offset-0" 
                      />
                      
                      {/* The Text */}
                      <span className="text-gray-400 text font-medium transition-colors duration-200 group-hover:text-white group-light:hover:text-logo2 light:text-black">
                        Remember Me
                      </span>
                      
                    </label>
                    
                    <a className="text-white hover:text-logo2 active:scale-97 light:text-black " href="#" >forgot Password?</a>
                  </div>
                    }
                {success && (
                  <p className={`${status?"text-logo2":"text-logo"} text-sm font-medium`}>
                     {status ? "Logged in successfully" : "Signed up successfully"}
                  </p>
                )}

                {/* Divider */}
                <div className="flex items-center w-full gap-2 my-4">
                  <div className={`flex-1 h-px ${!dark?"bg-black":"bg-primary"}`}></div>
                  <span className="text-sm">or</span>
                  <div className={`flex-1 h-px ${!dark?"bg-black":"bg-primary"}`}></div>
                </div>

                {/* Social Login */}
                <div className="flex gap-4 w-full">
                  {/* Google Login */}
                  <button
                    className={`w-full flex items-center justify-center gap-3
                              bg-white text-black font-semibold
                              border-3 border-gray-100 rounded-lg
                              ${status ? "hover:border-logo2" : "hover:border-logo"}
                              active:scale-97 
                              py-2 hover:bg-gray-100 transition px-3`}
                    onClick={handleOauth}
                  >
                    <img
                      src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                      alt="google"
                      className="w-5 h-5"
                    />
                    <p className="text-sm">Continue with Google</p>
                  </button>
                </div>
                <button className={`px-3 p-2 flex gap-2 items-center bg-white text-black rounded-lg hover:scale-97 active:scale-95 active:font-bold`} 
                onClick={() => toggleTheme()}>    
                {dark ? <FiSun size={18}  />: <FiMoon size={18} />}
                {dark ? "Light":"Dark"}
                </button>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
}

export default App;
