import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "../context/useTheme";
import {useAuth} from "../context/AuthProvider"

function AuthBtn() {
  
  const { user, logout} = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { dark} = useTheme();

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex flex-row ml-5 relative ${!dark?"light":""}`} ref={dropdownRef}>
      
      {/* Post Button */}
      <button
        className={`group px-5 p-1 w-25 flex justify-center items-center active:scale-95 font-bold text-md rounded-lg mx-1
          ${dark
            ? "bg-btncolorD/70  text-white hover:bg-logo/50 "
            : "bg-gray-100  hover:bg-logo2/70 "
          } hidden md:block lg:block`}
        onClick={() => navigate("/createPost")}
      >
        <p className="flex items-center gap-2">
          Post
          <span className="text-2xl font-extrabold transition-transform -mt-1 duration-300 transform group-hover:rotate-45">
            +
          </span>
        </p>
      </button>

      {/* User Avatar / Dropdown */}
      <button
        onClick={() => setOpen(!open)}
        className={`active:scale-95 w-10 h-10 font-bold text-md rounded-full mx-5
          ${dark ? "bg-btncolorD/70 hover:bg-btncolorD text-white hover:border-logo light:hover:border-logo2 hover:border" : "bg-gray-100 hover:bg-gray-200 hover:border-logo2 hover:border"}
          hidden md:block lg:block`}
      >
        <img src={user.profilePic} className="h-full w-full rounded-full object-cover" />
      </button>

      {/* Dropdown Panel */}
      {open && (
       <div className="absolute right-0 mt-15 w-64 rounded-xl shadow-xl
            bg-primaryD light:bg-white text-white light:text-txPrimary overflow-hidden z-50">

        {/* Avatar Image */}
        <div className="flex justify-center mt-5">
            <img
            src={user?.profilePic} 
            alt="Profile"
            className="h-24 w-24 rounded-full border-2 border-transparent hover:border-logo light:hover:border-logo2 hover:border-4 transition-all duration-300 object-cover"
            />
        </div>

        {/* Account Info */}
        <div className="px-6 py-5 text-center">
            <p className="text-lg font-semibold">{user.username}</p>
            <p className="text-sm opacity-70">{user.email}</p>
        </div>

        {/* Divider */}
        <div className="border-t border-txSecondaryD/50 light:border-gray-200 mx-4"></div>

        {/* Logout Button */}
        <button
            className="w-full px-6 py-3 text-md font-semibold rounded-b-xl hover:bg-logo/20 light:hover:bg-logo2/20 transition mt-2"
            onClick={() => {
            setOpen(false); // close dropdown
            logout();
            }}
        >
            Logout
        </button>
        </div>

      )}
    </div>
  );
}

export default AuthBtn;
