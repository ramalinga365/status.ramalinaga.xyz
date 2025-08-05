import React from "react";
import { Twitter, Github, Linkedin, Heart } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="py-4 sm:py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-3 md:mb-0">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex items-center">
                © {year} ProDevOpsGuy Tech. All rights reserved.{" "}
                <span className="flex items-center ml-2 text-red-500 dark:text-red-400">
                  <Heart className="h-3.5 w-3.5 mx-0.5" />
                </span>
              </p>
            </div>
            <div className="flex space-x-6">
              <a
                href="https://twitter.com/NotHarshhaa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
                aria-label="Twitter"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              </a>
              <a
                href="https://github.com/NotHarshhaa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors duration-200"
                aria-label="GitHub"
              >
                <span className="sr-only">GitHub</span>
                <Github className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              </a>
              <a
                href="https://www.linkedin.com/in/harshhaa-vardhan-reddy/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-700 dark:text-gray-400 dark:hover:text-blue-300 transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
              </a>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100 dark:border-gray-700 text-center text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
            Powered by Next.js and Tailwind CSS • Updated via GitHub Actions
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
