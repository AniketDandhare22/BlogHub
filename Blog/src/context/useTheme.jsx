import { useContext } from "react";
import { ThemeData } from "./ThemeContext";

export const useTheme = () => {
  const context = useContext(ThemeData);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
};
