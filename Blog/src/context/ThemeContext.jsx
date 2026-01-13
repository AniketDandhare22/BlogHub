import { createContext, useEffect, useState } from "react";

export const ThemeData = createContext(null);

const ThemeContext = ({ children }) => {

  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleTheme = () => setDark(prev => !prev);

  return (
    <ThemeData.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeData.Provider>
  );
};

export default ThemeContext;
