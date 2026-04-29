import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PenLine,
  BarChart3,
  User,
  CalendarDays,
  Target,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Home" },
  { to: "/track", icon: PenLine, label: "Track" },
  { to: "/history", icon: BarChart3, label: "History" },
  { to: "/calendar", icon: CalendarDays, label: "Calendar" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/predict", icon: Sparkles, label: "Insights" },
  { to: "/weekly", icon: TrendingUp, label: "Weekly" },
  
  { to: "/profile", icon: User, label: "Profile" },
];

// On mobile only show 5 items to keep it thumb-friendly  
const mobileNavItems = [  
  { to: "/", icon: LayoutDashboard, label: "Home" },  
  { to: "/track", icon: PenLine, label: "Track" },  
  { to: "/goals", icon: Target, label: "Goals" },  
  { to: "/predict", icon: Sparkles, label: "Insights" },  
  { to: "/weekly", icon: TrendingUp, label: "Weekly" },
  { to: "/profile", icon: User, label: "Profile" },  
];  

const accentColors: Record<string, { from: string; to: string; glow: string }> =
  {
    "/": { from: "#6366f1", to: "#8b5cf6", glow: "rgba(99,102,241,0.45)" },
    "/track": { from: "#ec4899", to: "#f43f5e", glow: "rgba(236,72,153,0.45)" },
    "/history": {
      from: "#06b6d4",
      to: "#3b82f6",
      glow: "rgba(6,182,212,0.45)",
    },
    "/calendar": {
      from: "#10b981",
      to: "#06b6d4",
      glow: "rgba(16,185,129,0.45)",
    },
    "/goals": { from: "#f59e0b", to: "#f97316", glow: "rgba(245,158,11,0.45)" },
    "/predict": {
      from: "#a855f7",
      to: "#6366f1",
      glow: "rgba(168,85,247,0.45)",
    },
    "/weekly": {
      from: "#14b8a6",
      to: "#06b6d4",
      glow: "rgba(20,184,166,0.45)",
    },
    "/profile": {
      from: "#64748b",
      to: "#94a3b8",
      glow: "rgba(100,116,139,0.35)",
    },
  };

function getAccent(path: string) {
  return accentColors[path] ?? accentColors["/"];
}

/* ─── DESKTOP TOP NAV ─────────────────────────────────────────── */
function DesktopNav() {
  const location = useLocation();

  return (
    <header
      className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-8 h-16"
      style={{
        background: "rgba(5, 8, 26, 0.85)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
      }}
    >
      {/* Wordmark */}
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
            boxShadow: "0 0 18px rgba(99,102,241,0.5)",
          }}
        >
          <Sparkles size={13} className="text-white" />
        </div>
        <span
          className="text-sm font-black tracking-[0.22em] uppercase"
          style={{
            background: "linear-gradient(90deg, #a5b4fc 0%, #f0abfc 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          AI Life
        </span>
      </div>

      {/* Nav pills */}
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const accent = getAccent(item.to);
          const Icon = item.icon;

          return (
            <NavLink key={item.to} to={item.to}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 cursor-pointer"
                style={{
                  color: isActive ? "#fff" : "rgba(255,255,255,0.42)",
                  background: isActive
                    ? `linear-gradient(135deg, ${accent.from}30, ${accent.to}20)`
                    : "transparent",
                  border: isActive
                    ? `1px solid ${accent.from}44`
                    : "1px solid transparent",
                }}
              >
                {/* Sliding active bg */}
                {isActive && (
                  <motion.div
                    layoutId="desktopActiveBg"
                    className="absolute inset-0 rounded-xl -z-10"
                    style={{
                      background: `linear-gradient(135deg, ${accent.from}28, ${accent.to}18)`,
                      boxShadow: `0 0 20px ${accent.glow}`,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}

                <Icon
                  size={14}
                  style={{
                    color: isActive ? accent.from : "rgba(255,255,255,0.38)",
                    filter: isActive
                      ? `drop-shadow(0 0 5px ${accent.glow})`
                      : "none",
                  }}
                />
                <span
                  style={{
                    color: isActive ? "#e2e8f0" : "rgba(255,255,255,0.42)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.label}
                </span>

                {/* Active underline dot */}
                {isActive && (
                  <motion.div
                    layoutId="desktopDot"
                    className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: accent.from }}
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Right slot (reserved) */}
      <div className="w-24" />
    </header>
  );
}

/* ─── MOBILE BOTTOM NAV ───────────────────────────────────────── */
function MobileNav() {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2"
      style={{
        height: 72,
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        background: "rgba(5, 8, 26, 0.92)",
        backdropFilter: "blur(24px) saturate(200%)",
        WebkitBackdropFilter: "blur(24px) saturate(200%)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
      }}
    >
      {mobileNavItems.map((item) => {
        const isActive = location.pathname === item.to;
        const accent = getAccent(item.to);
        const Icon = item.icon;

        return (
          <NavLink key={item.to} to={item.to} className="flex-1">
            <motion.div
              whileTap={{ scale: 0.88 }}
              className="flex flex-col items-center justify-center gap-1 py-2 relative"
            >
              {/* Icon container */}
              <motion.div
                animate={isActive ? { y: -4, scale: 1.08 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
                className="relative flex items-center justify-center w-11 h-8 rounded-2xl"
                style={
                  isActive
                    ? {
                        background: `linear-gradient(135deg, ${accent.from}30, ${accent.to}20)`,
                        boxShadow: `0 0 18px ${accent.glow}, inset 0 1px 0 rgba(255,255,255,0.1)`,
                        border: `1px solid ${accent.from}44`,
                      }
                    : {
                        background: "transparent",
                        border: "1px solid transparent",
                      }
                }
              >
                <Icon
                  size={18}
                  style={{
                    color: isActive ? accent.from : "rgba(255,255,255,0.35)",
                    filter: isActive
                      ? `drop-shadow(0 0 6px ${accent.glow})`
                      : "none",
                    transition: "all 0.2s",
                  }}
                />

                {/* Active glow halo */}
                {isActive && (
                  <motion.div
                    layoutId="mobileHalo"
                    className="absolute inset-0 rounded-2xl -z-10"
                    style={{
                      background: `radial-gradient(circle, ${accent.from}22 0%, transparent 70%)`,
                    }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </motion.div>

              {/* Label */}
              <AnimatePresence mode="wait">
                <motion.span
                  key={isActive ? "active" : "inactive"}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[10px] font-semibold tracking-wide"
                  style={{
                    color: isActive ? accent.from : "rgba(255,255,255,0.28)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </NavLink>
        );
      })}
    </nav>
  );
}

/* ─── EXPORT ──────────────────────────────────────────────────── */
export default function AppNav() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}