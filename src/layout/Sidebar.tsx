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
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import appLogo from "../assets/ikigai-logo.png";

/* =========================================================
   NAVIGATION ITEMS
========================================================= */

const navItems = [
  {
    to: "/",
    icon: LayoutDashboard,
    label: "Home",
  },
  {
    to: "/track",
    icon: PenLine,
    label: "Track",
  },
  {
    to: "/history",
    icon: BarChart3,
    label: "History",
  },
  {
    to: "/calendar",
    icon: CalendarDays,
    label: "Calendar",
  },
  {
    to: "/goals",
    icon: Target,
    label: "Goals",
  },
  {
    to: "/predict",
    icon: Sparkles,
    label: "Insights",
  },
  {
    to: "/weekly",
    icon: TrendingUp,
    label: "Weekly",
  },
  {
    to: "/profile",
    icon: User,
    label: "Profile",
  },
];

/*
 * Mobile navigation intentionally contains the most
 * frequently used sections.
 */
const mobileNavItems = [
  {
    to: "/",
    icon: LayoutDashboard,
    label: "Home",
  },
  {
    to: "/track",
    icon: PenLine,
    label: "Track",
  },
  {
    to: "/goals",
    icon: Target,
    label: "Goals",
  },
  {
    to: "/predict",
    icon: Sparkles,
    label: "Insights",
  },
  {
    to: "/weekly",
    icon: TrendingUp,
    label: "Weekly",
  },
  {
    to: "/history",
    icon: BarChart3,
    label: "history",
  },
];

/* =========================================================
   ACCENT COLORS
========================================================= */

const accentColors: Record<
  string,
  {
    from: string;
    to: string;
  }
> = {
  "/": {
    from: "#6366f1",
    to: "#8b5cf6",
  },

  "/track": {
    from: "#ec4899",
    to: "#f43f5e",
  },

  "/history": {
    from: "#06b6d4",
    to: "#3b82f6",
  },

  "/calendar": {
    from: "#10b981",
    to: "#06b6d4",
  },

  "/goals": {
    from: "#f59e0b",
    to: "#f97316",
  },

  "/predict": {
    from: "#a855f7",
    to: "#6366f1",
  },

  "/weekly": {
    from: "#14b8a6",
    to: "#06b6d4",
  },

  "/profile": {
    from: "#64748b",
    to: "#94a3b8",
  },
};

function getAccent(path: string) {
  return accentColors[path] ?? accentColors["/"];
}

/* =========================================================
   DESKTOP NAVIGATION
========================================================= */

function DesktopNav() {
  const location = useLocation();
  const { darkMode } = useTheme();

  return (
    <header
      className="hidden md:flex fixed top-0 left-0 right-0 z-50"
      style={{
        height: "72px",
        padding: "0 28px",
      }}
    >
      <div
        className="w-full h-full flex items-center justify-between"
        style={{
          margin: "0 auto",
          padding: "0 18px",
          borderRadius: "0 0 22px 22px",

          background: darkMode
            ? "rgba(15, 18, 25, 0.78)"
            : "rgba(255, 255, 255, 0.82)",

          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",

          border: darkMode
            ? "1px solid rgba(255,255,255,0.07)"
            : "1px solid rgba(15,23,42,0.07)",

          boxShadow: darkMode
            ? "0 10px 40px rgba(0,0,0,0.28)"
            : "0 10px 40px rgba(15,23,42,0.08)",
        }}
      >
        {/* =================================================
            BRAND
        ================================================= */}

        <NavLink
          to="/"
          className="flex items-center gap-3 flex-shrink-0"
          style={{
            textDecoration: "none",
          }}
        >
          {/* Logo */}
          <motion.div
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.96,
            }}
            className="flex items-center justify-center overflow-hidden"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,

              background: darkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(248,250,252,0.9)",

              border: darkMode
                ? "1px solid rgba(255,255,255,0.08)"
                : "1px solid rgba(15,23,42,0.08)",

              boxShadow: darkMode
                ? "0 4px 14px rgba(0,0,0,0.25)"
                : "0 4px 14px rgba(15,23,42,0.08)",
            }}
          >
            <img
              src={appLogo}
              alt="IKIG-AI"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Application Name */}
          <div className="flex flex-col leading-none">
            <span
              style={{
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                color: darkMode ? "#f8fafc" : "#111827",
              }}
            >
              IKIG-AI
            </span>

            <span
              className="mt-1"
              style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: darkMode
                  ? "rgba(255,255,255,0.38)"
                  : "rgba(15,23,42,0.42)",
              }}
            >
              Life Intelligence
            </span>
          </div>
        </NavLink>

        {/* =================================================
            DESKTOP MENU
        ================================================= */}

        <nav
          className="flex items-center"
          style={{
            gap: 4,
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            const accent = getAccent(item.to);
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                style={{
                  textDecoration: "none",
                }}
              >
                <motion.div
                  whileHover={{
                    y: -1,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="relative flex items-center"
                  style={{
                    height: 42,
                    padding: "0 13px",
                    borderRadius: 13,
                    gap: 7,

                    color: isActive
                      ? darkMode
                        ? "#ffffff"
                        : "#111827"
                      : darkMode
                        ? "rgba(255,255,255,0.48)"
                        : "rgba(15,23,42,0.48)",

                    background: isActive
                      ? darkMode
                        ? "rgba(255,255,255,0.075)"
                        : "rgba(15,23,42,0.055)"
                      : "transparent",

                    border: isActive
                      ? darkMode
                        ? "1px solid rgba(255,255,255,0.08)"
                        : "1px solid rgba(15,23,42,0.07)"
                      : "1px solid transparent",

                    transition:
                      "background 180ms ease, color 180ms ease, border 180ms ease",
                  }}
                >
                  {/* Active indicator */}

                  {isActive && (
                    <motion.div
                      layoutId="desktopActiveIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                      style={{
                        position: "absolute",
                        left: 10,
                        right: 10,
                        bottom: -1,
                        height: 2,
                        borderRadius: 999,

                        background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
                      }}
                    />
                  )}

                  <Icon
                    size={16}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    style={{
                      color: isActive
                        ? accent.from
                        : darkMode
                          ? "rgba(255,255,255,0.45)"
                          : "rgba(15,23,42,0.45)",
                    }}
                  />

                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      letterSpacing: "-0.01em",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </NavLink>
            );
          })}
        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div
          style={{
            width: 40,
            height: 40,
          }}
        />
      </div>
    </header>
  );
}

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function MobileNav() {
  const location = useLocation();
  const { darkMode } = useTheme();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div
        style={{
          margin: "0 10px 10px",
          height: 68,

          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",

          borderRadius: 23,

          background: darkMode
            ? "rgba(20, 23, 30, 0.88)"
            : "rgba(255, 255, 255, 0.88)",

          backdropFilter: "blur(30px) saturate(180%)",
          WebkitBackdropFilter: "blur(30px) saturate(180%)",

          border: darkMode
            ? "1px solid rgba(255,255,255,0.08)"
            : "1px solid rgba(15,23,42,0.08)",

          boxShadow: darkMode
            ? "0 12px 40px rgba(0,0,0,0.4)"
            : "0 12px 40px rgba(15,23,42,0.14)",
        }}
      >
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.to;
          const accent = getAccent(item.to);
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex-1"
              style={{
                textDecoration: "none",
              }}
            >
              <motion.div
                whileTap={{
                  scale: 0.88,
                }}
                className="flex flex-col items-center justify-center"
                style={{
                  height: 64,
                  position: "relative",
                  gap: 3,
                }}
              >
                {/* =================================================
                    ACTIVE PILL
                ================================================= */}

                <motion.div
                  animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 28,
                  }}
                  style={{
                    position: "absolute",
                    top: 7,
                    width: 42,
                    height: 28,
                    borderRadius: 14,

                    background: darkMode
                      ? "rgba(255,255,255,0.09)"
                      : "rgba(15,23,42,0.065)",
                  }}
                />

                {/* =================================================
                    ICON
                ================================================= */}

                <motion.div
                  animate={{
                    y: isActive ? -1 : 0,
                    scale: isActive ? 1.03 : 1,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 450,
                    damping: 25,
                  }}
                  style={{
                    position: "relative",
                    zIndex: 2,

                    width: 42,
                    height: 30,

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.25 : 1.8}
                    style={{
                      color: isActive
                        ? accent.from
                        : darkMode
                          ? "rgba(255,255,255,0.42)"
                          : "rgba(15,23,42,0.42)",

                      transition: "color 180ms ease",
                    }}
                  />
                </motion.div>

                {/* =================================================
                    LABEL
                ================================================= */}

                <span
                  style={{
                    position: "relative",
                    zIndex: 2,

                    fontSize: 9.5,
                    fontWeight: isActive ? 650 : 500,

                    letterSpacing: "-0.01em",

                    color: isActive
                      ? darkMode
                        ? "#f8fafc"
                        : "#111827"
                      : darkMode
                        ? "rgba(255,255,255,0.4)"
                        : "rgba(15,23,42,0.4)",

                    transition: "color 180ms ease",

                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </span>

                {/* =================================================
                    ACTIVE DOT
                ================================================= */}

                {isActive && (
                  <motion.div
                    layoutId="mobileActiveDot"
                    transition={{
                      type: "spring",
                      stiffness: 450,
                      damping: 30,
                    }}
                    style={{
                      position: "absolute",
                      bottom: 2,

                      width: 4,
                      height: 4,

                      borderRadius: "50%",

                      background: accent.from,
                    }}
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

/* =========================================================
   MAIN EXPORT
========================================================= */

export default function AppNav() {
  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}
