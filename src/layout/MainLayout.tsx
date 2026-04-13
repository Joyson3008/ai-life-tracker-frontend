import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

export default function MainLayout() {
  const { darkMode } = useTheme(); // ✅ FIXED
  const [isOpen, setIsOpen] = useState(true);

  const isDark = darkMode;

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300 ${
        isDark ? "bg-[#0f172a] text-white" : "bg-slate-200 text-black"
      }`}
    >
      {/* 🔥 SIDEBAR */}
      <Sidebar isOpen={isOpen} />

      {/* 🔥 MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* 🔥 TOP BAR */}
        <div
          className={`flex items-center justify-between p-4 border-b transition-colors duration-300 ${
            isDark
              ? "border-white/10 bg-[#020617]"
              : "border-slate-300 bg-white"
          }`}
        >
          {/* ☰ TOGGLE BUTTON */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xl px-3 py-2 rounded-lg hover:bg-white/10 transition"
          >
            ☰
          </button>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <h1
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-slate-500"
              }`}
            >
              AI Life Tracker
            </h1>
          </div>
        </div>

        {/* 🔥 PAGE CONTENT */}
        <div className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
