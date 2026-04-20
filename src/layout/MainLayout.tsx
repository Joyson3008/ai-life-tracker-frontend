import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import AppNav from "./Sidebar";

export default function MainLayout() {
  const { darkMode } = useTheme();
  const location = useLocation();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: darkMode
          ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 65%), #050812"
          : "linear-gradient(160deg, #f8faff 0%, #f1f5f9 40%, #eef2ff 100%)",
        color: darkMode ? "#e2e8f0" : "#1e293b",
      }}
    >
      {/* ── NAVIGATION (top on desktop, bottom on mobile) ── */}
      <AppNav />

      {/* ── DESKTOP TOPBAR UTILITY ROW (ThemeToggle lives here) ── */}
      <div
        className="hidden md:flex fixed top-0 right-0 z-[60] items-center gap-3 px-6"
        style={{ height: 64 }}
      >
        <ThemeToggle />
      </div>

      {/* ── MOBILE TOPBAR (branding + theme toggle) ── */}
      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5"
        style={{
          height: 56,
          background: darkMode
            ? "rgba(5, 8, 26, 0.92)"
            : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: darkMode
            ? "1px solid rgba(255,255,255,0.06)"
            : "1px solid rgba(0,0,0,0.06)",
          boxShadow: darkMode
            ? "0 4px 24px rgba(0,0,0,0.4)"
            : "0 2px 16px rgba(0,0,0,0.08)",
        }}
      >
        {/* Wordmark */}
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              boxShadow: "0 0 12px rgba(99,102,241,0.5)",
            }}
          >
            <span className="text-white text-[10px]">✦</span>
          </div>
          <span
            className="text-xs font-black tracking-[0.2em] uppercase"
            style={{
              background: "linear-gradient(90deg, #818cf8, #e879f9)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI Life
          </span>
        </div>

        <ThemeToggle />
      </header>

      {/* ── PAGE CONTENT ── */}
      {/*
        Offsets:
          - Mobile: pt-14 (top header 56px) + pb-24 (bottom nav 72px + breathing room)
          - Desktop: pt-16 (top nav 64px) + no bottom padding
      */}
      <main className="pt-14 pb-24 md:pt-16 md:pb-0 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
