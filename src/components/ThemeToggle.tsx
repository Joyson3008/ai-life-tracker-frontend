import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <button
      onClick={toggleDarkMode}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 flex items-center ${
        darkMode ? "bg-violet-500" : "bg-yellow-400"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center transition-all duration-300 ${
          darkMode ? "left-5" : "left-0.5"
        }`}
      >
        {darkMode ? (
          <Moon className="w-3 h-3 text-violet-500" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </span>
    </button>
  );
}
