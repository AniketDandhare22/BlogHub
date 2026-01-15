import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkAuth = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const timer = setTimeout(checkAuth, 300);
  return () => clearTimeout(timer);
}, []);


  const logout = async () => {
    await api.get("/auth/logout");
    setUser(null);
  };

  const login =async () => {
    await api.get("/auth/me")
    .then(res => {
      if (res.data?.message) {
        setUser(null);
      } else {
        setUser(res.data);
      }
    })
};


  return (
    <AuthContext.Provider value={{ user, isAuth: !!user, loading, logout ,login ,setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
