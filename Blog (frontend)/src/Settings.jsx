import React, { useContext, useState } from "react";
import { FiEdit,FiCamera } from "react-icons/fi";
import {
  HiMoon,
  HiSun,
  HiLogout,
  HiTrash,
  HiUser,
  HiKey,
} from "react-icons/hi";
import Navbar from "./Navbar";
import Pimage from "./assets/profile.avif";
import { toast } from "react-toastify";
import { ThemeData } from "./context/ThemeContext";
import { useAuth } from "./context/AuthProvider";
import api from "./api/api";
import { useNavigate } from "react-router-dom";

/* ---------- Utils ---------- */
const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const planLabel = (user) => {
  if (!user) return "Free";
  if (user.plan === "Pro") return "Pro ⭐";
  if (user.plan === "Plus") return "Plus";
  return "Free";
};

function Settings() {
  const { dark, toggleTheme } = useContext(ThemeData);
  const { user, isAuth, logout } = useAuth();
  const navigate = useNavigate();

  /* ---------- Username edit ---------- */
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");

  /* ---------- Avatar edit ---------- */
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarEditing, setAvatarEditing] = useState(false);

  const [loading, setLoading] = useState(false);

  const avatarSrc =
    avatarPreview || (isAuth ? user?.profilePic : Pimage);

  /* ---------- Handlers ---------- */

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarEditing(true);
  };

  const handleAvatarApply = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("file", avatarFile);

    try {
      setLoading(true);
      await api.post("/aiFeature/upload-avatar", formData);

      setAvatarEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarCancel = () => {
    setAvatarEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const res = await api.put("/auth/updateUsername", {username:username});
      toast(res.data.message);
      
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const deleteAccount =async ()=>{
    if (!window.confirm("Are you sure you want to delete this post?")) return;
      try {
        const res = await api.delete(`/auth/deleteAccount`);
        toast.success(res.data.message);
        logout();
        navigate('/auth')
      } catch (err) {
        console.error(err);
      }
  }

  return (
    <div
      className={`${dark ? "" : "light"} min-h-screen
      text-white light:text-primaryD
      bg-secondaryD light:bg-secondary`}
    >
      <Navbar />

      <div className="max-w-[1100px] mx-auto px-6 py-8">

        <h1 className="text-3xl font-semibold mb-8">Account Settings</h1>

        {/* ================= PROFILE HEADER ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-primaryD light:bg-white shadow-lg">

          {/* -------- LEFT: PROFILE -------- */}
          <div className="md:col-span-2 flex items-center gap-6 ml-10">

            {/* Avatar */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                <img
                  src={avatarSrc}
                  alt="profile"
                  className="lg:w-40 lg:h-40 md:w-40 md:h-40 w-20 h-20 rounded-full object-cover border-2 border-btncolor"
                />

                {isAuth && !avatarEditing && (
                  <button
                    onClick={() =>
                      document.getElementById("avatarInput").click()
                    }
                    className="absolute inset-0 rounded-full
                               bg-black/50 flex items-center justify-center
                               opacity-0 group-hover:opacity-100 transition"
                  >
                    <FiEdit size={40} />
                  </button>
                )}

                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarSelect}
                />
              </div>

              {avatarEditing && (
                <div className="flex gap-2">
                  <button
                    onClick={handleAvatarApply}
                    disabled={loading}
                    className="px-3 py-1 text-sm rounded-lg bg-secondaryD light:bg-secondary light:text-secondaryD text-white"
                  >
                    Apply
                  </button>
                  <button
                    onClick={handleAvatarCancel}
                    className="px-3 py-1 text-sm rounded-lg border border-white/20"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex flex-col gap-1">
              <h2 className="lg:text-2xl md:text-2xl text-lg font-semibold">
                {isAuth ? user.username : "Guest User"}
              </h2>
              <p className="lg:text-lg md:text-lg text-sm opacity-70">
                {isAuth ? user.email : "Login to manage your account"}
              </p>
              <p className="lg:text md:text text-xs opacity-60">
                Member since {formatDate(user?.createdAt)}
              </p>
            </div>
          </div>

          {/* -------- RIGHT: ACCOUNT STATS -------- */}
          {isAuth && (
            <div className="flex flex-col gap-4">

              <div className="rounded-xl p-4 bg-secondaryD/60 light:bg-gray-100">
                <p className="text-xs opacity-60">Current Plan</p>
                <p className="text-lg font-semibold">
                  {planLabel(user)}
                </p>
                {user.plan === "Pro" && (
                  <p className="text-xs opacity-60">
                    Expires {formatDate(user.planExpiry)}
                  </p>
                )}
              </div>

              <div className="rounded-xl p-4 bg-secondaryD/60 light:bg-gray-100">
                <p className="text-xs opacity-60">AI Tokens</p>
                <p className="text-2xl font-bold">
                  {user.aiToken ?? 0}
                </p>
              </div>

              <div className="rounded-xl p-4 bg-secondaryD/60 light:bg-gray-100">
                <p className="text-xs opacity-60">Quick Stats</p>
                <div className="flex justify-between text-sm mt-2">
                  <span>Total Posts</span>
                  <span className="font-semibold">
                    {user.post.length ?? 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Last Updated</span>
                  <span className="font-semibold">
                    {formatDate(user.updatedAt)}
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>

        {/* ================= EDIT USERNAME ================= */}
        {editing && (
          <div className="mt-4 p-5 rounded-xl bg-primaryD/80 light:bg-white shadow-lg space-y-4">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-secondaryD light:bg-gray-100
                         border border-white/10 focus:ring-2 focus:ring-btncolor"
              placeholder="Username"
            />

            <div className="flex gap-3">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="px-4 py-2 rounded-lg  bg-secondaryD light:bg-secondary light:text-secondaryD text-white  font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-4 py-2 rounded-lg border border-white/20"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ================= ACCOUNT ================= */}
        <Section title="Account">
          <SettingItem
            icon={<HiUser />}
            label="Edit Profile"
            onClick={() => setEditing(true)}
          />
          <SettingItem 
            icon={<HiKey />} 
            label="Change Password"  
            onClick={() =>{toast.info("Upcoming Feature!")}}  
          />
          <SettingItem 
            icon={<HiTrash />} 
            label="Delete Account" danger 
            onClick={() =>{deleteAccount()}}  
          />
        </Section>

        {/* ================= APPEARANCE ================= */}
        <Section title="Appearance">
          <button onClick={toggleTheme} className="setting-row">
            <span className="flex items-center gap-3">
              {dark ? <HiMoon /> : <HiSun />}
              Theme
            </span>
            <span className="text-sm opacity-70">
              {dark ? "Dark" : "Light"}
            </span>
          </button>
        </Section>

        {/* ================= SECURITY ================= */}
        <Section title="Security">
          <button
            className="setting-row text-red-400 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <HiLogout />
            Logout
          </button>
        </Section>

      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

const Section = ({ title, children }) => (
  <div className="mt-8 rounded-2xl p-5 bg-primaryD/80 light:bg-white shadow-lg">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="flex flex-col divide-y divide-white/10 light:divide-gray-200">
      {children}
    </div>
  </div>
);

const SettingItem = ({ icon, label, danger, onClick }) => (
  <button
    onClick={onClick}
    className={`setting-row ${
      danger ? "text-red-400 hover:bg-red-500/10" : ""
    }`}
  >
    <span className="flex items-center gap-3">
      {icon}
      {label}
    </span>
  </button>
);

export default Settings;
