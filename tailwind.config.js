/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "status-green": "#10b981",
        "status-yellow": "#f59e0b",
        "status-red": "#ef4444",
        "status-gray": "#6b7280",
        "status-blue": "#3b82f6",
        dark: {
          DEFAULT: "#000000",
          lighter: "#0a0a0a",
          light: "#111111",
          medium: "#1a1a1a",
          border: "#222222",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
