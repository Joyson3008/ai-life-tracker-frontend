import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PenLine,
  Target,
  Sparkles,
  User,
  MoreHorizontal,
  CalendarDays,
  History,
  TrendingUp,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Accent color map ───────────────────────────────────────────
const accentColors: Record<string, { from: string; to: string; glow: string }> =
  {
    "/":        { from: "#6366f1", to: "#8b5cf6", glow: "rgba(99,102,241,0.45)" },
    "/track":   { from: "#ec4899", to: "#f43f5e", glow: "rgba(236,72,153,0.45)" },
    "/history": { from: "#06b6d4", to: "#3b82f6", glow: "rgba(6,182,212,0.45)" },
    "/calendar":{ from: "#10b981", to: "#06b6d4", glow: "rgba(16,185,129,0.45)" },
    "/goals":   { from: "#f59e0b", to: "#f97316", glow: "rgba(245,158,11,0.45)" },
    "/predict": { from: "#a855f7", to: "#6366f1", glow: "rgba(168,85,247,0.45)" },
    "/weekly":  { from: "#14b8a6", to: "#06b6d4", glow: "rgba(20,184,166,0.45)" },
    "/profile": { from: "#64748b", to: "#94a3b8", glow: "rgba(100,116,139,0.35)" },
  };

function getAccent(path: string) {
  return accentColors[path] ?? accentColors["/"];
}

// ─── Main bottom nav items (5 visible) ─────────────────────────
const mobileNavItems = [
  { to: "/",       icon: LayoutDashboard, label: "Home"    },
  { to: "/track",  icon: PenLine,         label: "Track"   },
  { to: "/goals",  icon: Target,          label: "Goals"   },
  { to: "/predict",icon: Sparkles,        label: "Insights"},
  { to: "/profile",icon: User,            label: "Profile" },
];

// ─── "More" drawer items ────────────────────────────────────────
const moreItems = [
  {
    to: "/calendar",
    icon: CalendarDays,
    label: "Calendar",
    desc: "View your schedule",
    accent: accentColors["/calendar"],
  },
  {
    to: "/history",
    icon: History,
    label: "History",
    desc: "Browse past logs",
    accent: accentColors["/history"],
  },
  {
    to: "/weekly",
    icon: TrendingUp,
    label: "Weekly Report",
    desc: "Deep weekly insights",
    accent: accentColors["/weekly"],
  },
];

// ─── Desktop nav (unchanged from original) ──────────────────────
const allNavItems = [
  { to: "/",        icon: LayoutDashboard, label: "Home"    },
  { to: "/track",   icon: PenLine,         label: "Track"   },
  { to: "/history", icon: History,         label: "History" },
  { to: "/calendar",icon: CalendarDays,    label: "Calendar"},
  { to: "/goals",   icon: Target,          label: "Goals"   },
  { to: "/predict", icon: Sparkles,        label: "Insights"},
  { to: "/weekly",  icon: TrendingUp,      label: "Weekly"  },
  { to: "/profile", icon: User,            label: "Profile" },
];

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

      <nav className="flex items-center gap-1">
        {allNavItems.map((item) => {
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
                    filter: isActive ? `drop-shadow(0 0 5px ${accent.glow})` : "none",
                  }}
                />
                <span style={{ color: isActive ? "#e2e8f0" : "rgba(255,255,255,0.42)", letterSpacing: "0.02em" }}>
                  {item.label}
                </span>
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
      <div className="w-24" />
    </header>
  );
}

// ─── More Bottom Sheet ──────────────────────────────────────────
function MoreDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();

  const handleNavigate = (to: string) => {
    onClose();
    setTimeout(() => navigate(to), 180); // let close animation finish
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60]"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet"
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 340, damping: 32, mass: 0.9 }}
            className="fixed bottom-0 left-0 right-0 z-[70] md:hidden"
            style={{
              background: "rgba(8, 11, 30, 0.97)",
              borderTop: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "28px 28px 0 0",
              boxShadow: "0 -20px 80px rgba(0,0,0,0.7), 0 -1px 0 rgba(255,255,255,0.06)",
              paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)",
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.18)" }}
              />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-2 pb-5">
              <div>
                <p
                  className="text-[10px] font-bold tracking-[0.25em] uppercase mb-0.5"
                  style={{ color: "rgba(165,180,252,0.6)" }}
                >
                  More
                </p>
                <h2 className="text-xl font-black text-white tracking-tight">
                  All Features
                </h2>
              </div>
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={onClose}
                className="w-9 h-9 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <X size={16} style={{ color: "rgba(255,255,255,0.55)" }} />
              </motion.button>
            </div>

            {/* Menu items */}
            <div className="px-4 space-y-2.5 pb-2">
              {moreItems.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.to}
                    initial={{ opacity: 0, y: 18, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      delay: 0.06 + i * 0.07,
                      type: "spring",
                      stiffness: 380,
                      damping: 28,
                    }}
                    whileHover={{ scale: 1.025 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleNavigate(item.to)}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${item.accent.from}14, ${item.accent.to}0a)`,
                      border: `1px solid ${item.accent.from}28`,
                      boxShadow: `0 2px 20px ${item.accent.glow}22`,
                    }}
                  >
                    {/* Icon bubble */}
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${item.accent.from}30, ${item.accent.to}20)`,
                        border: `1px solid ${item.accent.from}40`,
                        boxShadow: `0 0 16px ${item.accent.glow}`,
                      }}
                    >
                      <Icon
                        size={19}
                        style={{
                          color: item.accent.from,
                          filter: `drop-shadow(0 0 6px ${item.accent.glow})`,
                        }}
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-bold text-white tracking-tight leading-tight">
                        {item.label}
                      </p>
                      <p
                        className="text-[12px] mt-0.5 truncate"
                        style={{ color: "rgba(255,255,255,0.38)" }}
                      >
                        {item.desc}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.05)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M4.5 2.5L8 6L4.5 9.5"
                          stroke={item.accent.from}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Subtle footer hint */}
            <p
              className="text-center text-[10px] mt-4 pb-1 tracking-wider uppercase"
              style={{ color: "rgba(255,255,255,0.12)" }}
            >
              AI Life Tracker
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Mobile Bottom Nav ──────────────────────────────────────────
function MobileNav() {
  const location = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  // Check if current route is one of the "More" items
  const isMoreActive = moreItems.some((item) => item.to === location.pathname);

  return (
    <>
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
        {/* Regular nav items */}
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
                      : { background: "transparent", border: "1px solid transparent" }
                  }
                >
                  <Icon
                    size={18}
                    style={{
                      color: isActive ? accent.from : "rgba(255,255,255,0.35)",
                      filter: isActive ? `drop-shadow(0 0 6px ${accent.glow})` : "none",
                      transition: "all 0.2s",
                    }}
                  />
                  {isActive && (
                    <motion.div
                      layoutId="mobileHalo"
                      className="absolute inset-0 rounded-2xl -z-10"
                      style={{ background: `radial-gradient(circle, ${accent.from}22 0%, transparent 70%)` }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    />
                  )}
                </motion.div>

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

        {/* ── More button ─────────────────────────── */}
        <div className="flex-1">
          <motion.button
            whileTap={{ scale: 0.88 }}
            onClick={() => setMoreOpen(true)}
            className="w-full flex flex-col items-center justify-center gap-1 py-2 relative"
          >
            <motion.div
              animate={
                isMoreActive || moreOpen
                  ? { y: -4, scale: 1.08 }
                  : { y: 0, scale: 1 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 24 }}
              className="relative flex items-center justify-center w-11 h-8 rounded-2xl"
              style={
                isMoreActive || moreOpen
                  ? {
                      background: "linear-gradient(135deg, #a855f730, #6366f120)",
                      boxShadow: "0 0 18px rgba(168,85,247,0.45), inset 0 1px 0 rgba(255,255,255,0.1)",
                      border: "1px solid #a855f744",
                    }
                  : { background: "transparent", border: "1px solid transparent" }
              }
            >
              {/* Animated bars → X when open */}
              <AnimatePresence mode="wait">
                {moreOpen ? (
                  <motion.div
                    key="x"
                    initial={{ rotate: -45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 45, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <X
                      size={18}
                      style={{ color: "#a855f7", filter: "drop-shadow(0 0 6px rgba(168,85,247,0.45))" }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 45, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -45, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <MoreHorizontal
                      size={18}
                      style={{
                        color: isMoreActive ? "#a855f7" : "rgba(255,255,255,0.35)",
                        transition: "all 0.2s",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <span
              className="text-[10px] font-semibold tracking-wide"
              style={{
                color:
                  isMoreActive || moreOpen
                    ? "#a855f7"
                    : "rgba(255,255,255,0.28)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              More
            </span>

            {/* Dot indicator if current route is a "More" item */}
            {isMoreActive && !moreOpen && (
              <motion.div
                layoutId="mobileHalo"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ background: "#a855f7" }}
              />
            )}
          </motion.button>
        </div>
      </nav>

      {/* Drawer */}
      <MoreDrawer open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}

// ─── Export ─────────────────────────────────────────────────────
export default function AppNav() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}