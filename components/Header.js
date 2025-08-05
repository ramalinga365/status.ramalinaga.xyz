import React from "react";
import Image from "next/image";
import { Sun, Moon, BarChart2, Menu } from "lucide-react";
import Link from "next/link";

const Header = ({ toggleTheme, isDarkMode }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center group">
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <BarChart2 className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                ProDevOpsGuy Status
                <span className="ml-2 text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full hidden md:inline-block">
                  Live
                </span>
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Platform Status Dashboard
              </p>
            </div>
          </Link>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              aria-label={
                isDarkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" strokeWidth={2} />
              ) : (
                <Moon className="h-5 w-5" strokeWidth={2} />
              )}
            </button>
            <button className="p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 md:hidden transition-colors duration-200">
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
