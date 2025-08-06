import React from "react";
import { useState, useEffect } from "react";
import { BarChart2, Menu } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = ({ toggleTheme, isDarkMode }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle theme change from the ThemeSwitcher component
  const handleThemeChange = (isDark) => {
    toggleTheme(isDark);
  };

  // Handle scroll events to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      className={`bg-white dark:bg-gray-800 sticky top-0 z-50 transition-colors duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2 sm:py-4">
          <Link href="/" className="flex items-center group">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <BarChart2
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white"
                  strokeWidth={2.5}
                />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                ProDevOpsGuy Status
                <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full hidden md:inline-block">
                  Live
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Platform Status Dashboard
              </p>
            </div>
          </Link>
          <div className="flex items-center space-x-3">
            <ThemeSwitcher
              currentTheme={isDarkMode ? "dark" : "light"}
              onThemeChange={handleThemeChange}
            />
            <motion.button
              className="p-2 sm:p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:hidden transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
