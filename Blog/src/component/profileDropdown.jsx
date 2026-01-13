import { useState, useRef, useEffect } from "react";
import { HiDotsHorizontal } from "react-icons/hi";
import { useTheme } from "../context/useTheme";// replace with actual user image if available
import { useNavigate } from "react-router-dom";
import {useAuth} from "../context/AuthProvider"

function ProfileDropdown() {
  const { user, isAuth, logout, loading } = useAuth();
  const navigate = useNavigate();
  const { dark, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  // Click outside closes dropdown
  useEffect(() => {
    
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  if (loading) return null;
  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center p-2 rounded-full cursor-pointer
          ${dark ? "bg-btncolorD/60 hover:bg-btncolorD text-white" : "light bg-btncolor/70 hover:bg-btncolor text-gray-950"}`}
      >
        <HiDotsHorizontal size={26} />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-64 rounded-xl shadow-xl
          bg-primaryD light:bg-white text-white light:text-txPrimary overflow-hidden z-50">

          {/* Avatar Image */}
          {isAuth && (<div className="flex justify-center mt-5">
            <img
              src={user?.profilePic} // Replace with user image if available
              alt="Profile"
              className="h-14 w-14 mt-3 ml-3 rounded-full border-2 border-transparent hover:border-logo light:hover:border-logo2 hover:border-4 transition-all duration-300 object-cover"
            />

            {/* Account Info */}
            <div className="px-6 py-5 text-center">
                <p className="text-lg font-semibold">{isAuth ? user.username : "Guest"}</p>
                <p className="text-sm opacity-70">{isAuth ? user.email : "guest@bloghub.com"}</p>
            </div>
          </div>)}

          {/* Buttons */}
          <div className="flex flex-col gap-2 px-2 pb-4">
            <button
              className="w-full mt-2 py-2 text-md font-semibold rounded-lg hover:bg-secondaryD/70 light:hover:bg-gray-100 transition"
              onClick={() => toggleTheme()}
            >
              {dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </button>
            <button
              className="w-full py-2 text-md font-semibold rounded-lg hover:bg-secondaryD/70 light:hover:bg-gray-100 transition"
              onClick={()=>{navigate('/settings')}}
            >
              Settings
            </button>
            <button
              className="w-full py-2 text-md font-semibold rounded-lg hover:bg-secondaryD/70 light:hover:bg-gray-100 transition"
              onClick={()=>{navigate('/price')}}
            >
              Ai Feature
            </button>
            {isAuth?(<button
              className="w-full py-2 text-md font-semibold rounded-lg hover:bg-secondaryD/70 light:hover:bg-gray-100 transition"
              onClick={()=>{navigate('/createPost')}}
            >
              Post
            </button>):""}
            <button
              className="w-full py-2 text-md font-semibold rounded-lg hover:bg-secondaryD/70 light:hover:bg-gray-100 transition"
              onClick={()=>{navigate('/about-us')}}
            >
              About-Us
            </button>
            {isAuth?
                <button
                  className="w-full py-2 cursor-pointer text-md font-semibold rounded-lg hover:bg-logo/30 light:hover:bg-logo2/30 transition"
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                >
                  Logout
                </button>:
                <button
                  className="w-full py-2 cursor-pointer text-md font-semibold rounded-lg hover:bg-logo/30 light:hover:bg-logo2/30 transition"
                  onClick={() => {
                    setOpen(false);
                    navigate("/auth");
                  }}
                >
                  Log-In
                </button>
              }
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
