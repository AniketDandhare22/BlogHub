import { useState ,useEffect  } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import Search from './component/search'
import Btn from './component/Btn'
import ProgressBar from "./component/progessbarTop";
import AuthIcon from './component/Authbtn'
import { useTheme } from "./context/useTheme";
import Profile from './component/profileDropdown'
import { useNavigate } from "react-router-dom";
import {useAuth} from "./context/AuthProvider"

function Navbar({setQuery}){
    const { user, isAuth, loading } = useAuth();
    const [logoutTrigger, setLogoutTrigger] = useState(false);
    const navigate =useNavigate();
    const { dark, toggleTheme } = useTheme();
    
      const [angle, setAngle] = useState(0);
    
        useEffect(() => {
            // Update the angle continuously
            const interval = setInterval(() => {
            setAngle(prev => (prev + 4) % 360); // increase 2 degrees per tick
            }, 30); 
            return () => clearInterval(interval);
        }, [isAuth]);
        
    if (loading) return null;
    return(
        <>
            <ProgressBar trigger={logoutTrigger} onComplete={() => {
                    setLogoutTrigger(false); // reset trigger
                }}  theme={dark} />
            <div className={`w-full h-15 border-b light:border-gray-300 border-txSecondary p-1 flex flex-row justify-between items-center bg-primaryD light:bg-primary ${dark?"":"light"}`}>
                <div className="w-auto h-full items-center flex flex-row px-2 cursor-grab" 
                onClick={()=>{
                    navigate('/');
                    setLogoutTrigger(true); 
                }}
                onComplete={() => {
                    setLogoutTrigger(false); 
                }} >
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 48 48">
                    <path 
                        fill={dark ? "#FF6900" : "#8639D3"} 
                        d="M37,42H11c-2.761,0-5-2.239-5-5V11c0-2.761,2.239-5,5-5h26c2.761,0,5,2.239,5,5v26 C42,39.761,39.761,42,37,42z"
                    />
                    <path 
                        fill="#fff" 
                        d="M33.5,22h-1c-0.828,0-1.5-0.672-1.5-1.5V20c0-3.866-3.134-7-7-7h-4c-3.866,0-7,3.134-7,7v8 c0,3.866,3.134,7,7,7h8c3.866,0,7-3.134,7-7v-4.5C35,22.672,34.328,22,33.5,22z M20,19h5c0.553,0,1,0.448,1,1s-0.447,1-1,1h-5 c-0.553,0-1-0.448-1-1S19.447,19,20,19z M28,29h-8c-0.553,0-1-0.448-1-1s0.447-1,1-1h8c0.553,0,1,0.448,1,1S28.553,29,28,29z"
                    />
                    </svg>

                    <div className="  font-bold text-2xl pt-1 h-full items-center flex text-white light:text-black"> Blog<span className={`text-white ${dark?"bg-logo":"bg-logo2"} px-2 rounded-lg`}>Hub</span></div>
                </div>
                <div className="w-full h-full justify-center hidden md:flex lg:flex">
                <Search theme={dark} toQuery={setQuery} />
                </div>
                <div className="items-center flex px-3 w-[40%] justify-end gap-2">
                    <div className="relative hidden lg:block w-25 h-10 group">
  
                    {/* 🌈 Conic Gradient Glow */}
                    <div
                        className="absolute inset-0 rounded-full blur-[3px] scale-106 opacity-0
                                group-hover:opacity-100 transition duration-300"
                        style={{
                        background: `conic-gradient(
                            from ${angle}deg,
                            #DD1487,
                            #EC4899,
                            cyan,
                            #3B82F6,
                            transparent,
                            transparent
                        )`,
                        }}
                    />

                    {/* 🔘 Button */}
                    <button
                        className={`relative z-10 p-2 w-full h-full rounded-full
                                    flex items-center justify-center gap-1
                                    transition active:scale-95 cursor-pointer
                                    ${
                                    dark
                                        ? "bg-btncolorD"
                                        : "bg-btncolor"
                                    }`}
                        onClick={()=>{navigate('/price')}}
                    >
                        {/* Icon */}
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 30 30"
                        className=" transition-transform duration-300 mt-1 ease-out group-hover:rotate-45 group-active:rotate-0 "
                        >
                        <defs>
                            <linearGradient id="starGradientSmall" gradientTransform="rotate(60)">
                            <stop offset="40%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                        </defs>

                        <path
                        fill={
                            !user || user.plan === "Free"
                            ? dark
                            ? "#ffffff"   // Free or no user + dark → white
                            : "#000000"   // Free or no user + light → black
                            : user.plan === "Plus"
                            ? "#22D3EE"     // Plus → cyan
                            : "url(#starGradientSmall)"// Pro → gradient
                            }

                            d="M14.217,19.707l-1.112,2.547c-0.427,0.979-1.782,0.979-2.21,0l-1.112-2.547
                            c-0.99-2.267-2.771-4.071-4.993-5.057L1.73,13.292
                            c-0.973-0.432-0.973-1.848,0-2.28l2.965-1.316
                            C6.974,8.684,8.787,6.813,9.76,4.47l1.126-2.714
                            c0.418-1.007,1.81-1.007,2.228,0L14.24,4.47
                            c0.973,2.344,2.786,4.215,5.065,5.226l2.965,1.316
                            c0.973,0.432,0.973,1.848,0,2.28l-3.061,1.359
                            C16.988,15.637,15.206,17.441,14.217,19.707z"
                        />
                        </svg>

                        {/* 🏷️ Text */}
                        <p
                            className={`px-3 py-1 rounded-full text-sm font-bold shadow
                                ${
                                user?.plan === "Pro"
                                    ? "bg-gradient-to-r from-blue-400 to-pink-400 light:text-white text-primaryD"
                                    : user?.plan === "Plus"
                                    ? "bg-gradient-to-r from-teal-500 to-cyan-400 light:text-white text-primaryD"
                                    : "bg-gray-500 text-white"
                                }
                            `}
                            >
                            {
                                user
                                ? user.plan === "Plus"
                                    ? `${user.aiToken}Tk`
                                    : user.plan
                                : "Free"
                            }
                            </p>

                    </button>
                    </div>

                    <button
                    onClick={() => toggleTheme()}
                    className={`p-2 rounded-full transition active:scale-95 ${dark?"bg-btncolorD/60 hover:bg-btncolorD":"bg-btncolor/70 hover:bg-btncolor"}`}
                    >
                    {dark ? (
                        <FiSun className="text-yellow-100" size={22} />
                    ) : (
                        <FiMoon className="text-triaryD" size={22} />
                    )}
                    </button>
                    {!isAuth?(<Btn theme={dark}/>):(<AuthIcon/>)}
                    <Profile/>
                </div>
            </div>
      </>
    )
}
export default Navbar