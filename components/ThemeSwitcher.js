import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

/**
 * ThemeSwitcher Component
 *
 * A simple theme switcher that toggles between light and dark mode
 */
const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    if (onThemeChange) {
      onThemeChange(!isDark);
    }
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-lg ${
        isDark
          ? "bg-gray-700 text-yellow-300 hover:bg-gray-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } transition-all duration-300`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </motion.button>
  );
};

export default ThemeSwitcher;
