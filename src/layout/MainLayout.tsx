import { Outlet, useLocation, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserRound } from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";
import AppNav from "./Sidebar";

/* =========================================================
   IKIG-AI PREMIUM LOGO
   ---------------------------------------------------------
   Inline SVG logo inspired by the supplied IKIG-AI logo:
   - Four connected rounded loops
   - Blue/cyan accents
   - Coral/red accent
   - Central connection
   - Minimal Apple-style presentation
========================================================= */

function IkigaiLogo({
  size = 36,
  showName = true,
  darkMode = false,
}: {
  size?: number;
  showName?: boolean;
  darkMode?: boolean;
}) {
  return (
    <motion.div
      className="flex items-center"
      style={{
        gap: showName ? 10 : 0,
      }}
      whileTap={{ scale: 0.98 }}
    >
      {/* =====================================================
          LOGO MARK
      ===================================================== */}

      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{
          type: "spring",
          stiffness: 450,
          damping: 28,
        }}
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          position: "relative",
          borderRadius: Math.round(size * 0.29),

          background: darkMode
            ? "rgba(255,255,255,0.07)"
            : "rgba(255,255,255,0.92)",

          border: darkMode
            ? "1px solid rgba(255,255,255,0.10)"
            : "1px solid rgba(15,23,42,0.08)",

          boxShadow: darkMode
            ? "0 5px 18px rgba(0,0,0,0.28)"
            : "0 4px 14px rgba(15,23,42,0.10)",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          overflow: "hidden",
        }}
      >
        {/* Very subtle inner highlight */}

        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background: darkMode
              ? "linear-gradient(135deg, rgba(255,255,255,0.07), transparent 50%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.75), transparent 55%)",
            pointerEvents: "none",
          }}
        />

        <svg
          width={size * 0.74}
          height={size * 0.74}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="IKIG-AI"
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* TOP LOOP */}

          <path
            d="
              M24 23
              C19.8 23 16.4 19.6 16.4 15.4
              C16.4 11.2 19.8 7.8 24 7.8
              C28.2 7.8 31.6 11.2 31.6 15.4
              C31.6 18.2 30.1 20.7 27.8 22
            "
            stroke="#1597F6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* RIGHT LOOP */}

          <path
            d="
              M25 24
              C25 19.8 28.4 16.4 32.6 16.4
              C36.8 16.4 40.2 19.8 40.2 24
              C40.2 28.2 36.8 31.6 32.6 31.6
              C29.8 31.6 27.3 30.1 26 27.8
            "
            stroke="#FF4D5A"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* BOTTOM LOOP */}

          <path
            d="
              M24 25
              C28.2 25 31.6 28.4 31.6 32.6
              C31.6 36.8 28.2 40.2 24 40.2
              C19.8 40.2 16.4 36.8 16.4 32.6
              C16.4 29.8 17.9 27.3 20.2 26
            "
            stroke="#1597F6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* LEFT LOOP */}

          <path
            d="
              M23 24
              C23 28.2 19.6 31.6 15.4 31.6
              C11.2 31.6 7.8 28.2 7.8 24
              C7.8 19.8 11.2 16.4 15.4 16.4
              C18.2 16.4 20.7 17.9 22 20.2
            "
            stroke="#1597F6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* CENTER */}

          <circle
            cx="24"
            cy="24"
            r="3.3"
            fill={darkMode ? "#0B0F16" : "#FFFFFF"}
            stroke="#1597F6"
            strokeWidth="1.8"
          />

          {/* RED TOP ACCENT */}

          <circle cx="24" cy="8" r="1.7" fill="#FF4D5A" />
        </svg>
      </motion.div>

      {/* =====================================================
          BRAND NAME
      ===================================================== */}

      {showName && (
        <div
          className="flex flex-col justify-center"
          style={{
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: size >= 32 ? 18 : 15,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              color: darkMode ? "#F8FAFC" : "#111827",
              whiteSpace: "nowrap",
            }}
          >
            IKIG-AI
          </span>

          {size >= 32 && (
            <span
              style={{
                marginTop: 4,
                fontSize: 8,
                fontWeight: 600,
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                color: darkMode
                  ? "rgba(255,255,255,0.38)"
                  : "rgba(15,23,42,0.42)",
              }}
            >
              Life Intelligence
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
}

/* =========================================================
   PREMIUM ICON BUTTON
========================================================= */

function PremiumIconButton({
  children,
  darkMode,
  to,
  label,
}: {
  children: React.ReactNode;
  darkMode: boolean;
  to?: string;
  label: string;
}) {
  const content = (
    <motion.div
      whileHover={{
        scale: 1.04,
        y: -1,
      }}
      whileTap={{
        scale: 0.94,
      }}
      transition={{
        type: "spring",
        stiffness: 450,
        damping: 25,
      }}
      aria-label={label}
      title={label}
      style={{
        width: 40,
        height: 40,
        borderRadius: 13,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background: darkMode
          ? "rgba(255,255,255,0.065)"
          : "rgba(255,255,255,0.78)",

        border: darkMode
          ? "1px solid rgba(255,255,255,0.085)"
          : "1px solid rgba(15,23,42,0.075)",

        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",

        boxShadow: darkMode
          ? "0 5px 20px rgba(0,0,0,0.20), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 5px 18px rgba(15,23,42,0.065), inset 0 1px 0 rgba(255,255,255,0.85)",

        color: darkMode ? "#E5E7EB" : "#334155",

        cursor: "pointer",

        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle top highlight */}

      <span
        style={{
          position: "absolute",
          top: 0,
          left: "18%",
          right: "18%",
          height: 1,
          background: darkMode
            ? "rgba(255,255,255,0.12)"
            : "rgba(255,255,255,0.9)",
          pointerEvents: "none",
        }}
      />

      {children}
    </motion.div>
  );

  if (to) {
    return (
      <NavLink to={to} className="flex-shrink-0">
        {content}
      </NavLink>
    );
  }

  return content;
}

/* =========================================================
   MAIN LAYOUT
========================================================= */

export default function MainLayout() {
  const { darkMode } = useTheme();
  const location = useLocation();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        background: darkMode
          ? `
            radial-gradient(
              ellipse 100% 55% at 50% -15%,
              rgba(59,130,246,0.10) 0%,
              rgba(99,102,241,0.055) 28%,
              transparent 68%
            ),
            radial-gradient(
              ellipse 70% 45% at 90% 10%,
              rgba(168,85,247,0.045) 0%,
              transparent 70%
            ),
            #05070B
          `
          : `
            radial-gradient(
              ellipse 100% 55% at 50% -15%,
              rgba(59,130,246,0.075) 0%,
              rgba(99,102,241,0.035) 30%,
              transparent 68%
            ),
            linear-gradient(
              160deg,
              #FAFBFF 0%,
              #F7F8FC 45%,
              #F1F5F9 100%
            )
          `,

        color: darkMode ? "#E5E7EB" : "#111827",
      }}
    >
      {/* =====================================================
          APP NAVIGATION
          Desktop → top
          Mobile → bottom
      ===================================================== */}

      <AppNav />

      {/* =====================================================
          DESKTOP TOP RIGHT CONTROLS
          Profile + Theme
      ===================================================== */}

      <div
        className="hidden md:flex fixed top-0 right-0 z-[60] items-center"
        style={{
          height: 72,
          paddingRight: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,

            padding: 5,

            borderRadius: 17,

            background: darkMode
              ? "rgba(10,13,20,0.72)"
              : "rgba(255,255,255,0.68)",

            border: darkMode
              ? "1px solid rgba(255,255,255,0.065)"
              : "1px solid rgba(15,23,42,0.055)",

            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",

            boxShadow: darkMode
              ? "0 8px 28px rgba(0,0,0,0.22)"
              : "0 8px 25px rgba(15,23,42,0.055)",
          }}
        >
          {/* PROFILE */}

          <PremiumIconButton
            darkMode={darkMode}
            to="/profile"
            label="Open profile"
          >
            <UserRound size={18} strokeWidth={1.8} />
          </PremiumIconButton>

          {/* SEPARATOR */}

          <div
            style={{
              width: 1,
              height: 20,
              background: darkMode
                ? "rgba(255,255,255,0.08)"
                : "rgba(15,23,42,0.08)",
            }}
          />

          {/* THEME */}

          <PremiumIconButton
            darkMode={darkMode}
            label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <ThemeToggle />
          </PremiumIconButton>
        </div>
      </div>

      {/* =====================================================
          MOBILE TOP HEADER
      ===================================================== */}

      <header
        className="md:hidden fixed top-0 left-0 right-0 z-50"
        style={{
          height: 64,

          background: darkMode ? "rgba(5,7,11,0.78)" : "rgba(248,249,253,0.80)",

          backdropFilter: "blur(28px) saturate(190%)",
          WebkitBackdropFilter: "blur(28px) saturate(190%)",

          borderBottom: darkMode
            ? "1px solid rgba(255,255,255,0.065)"
            : "1px solid rgba(15,23,42,0.06)",

          boxShadow: darkMode
            ? "0 5px 25px rgba(0,0,0,0.20)"
            : "0 5px 22px rgba(15,23,42,0.045)",
        }}
      >
        <div
          className="h-full flex items-center justify-between"
          style={{
            paddingLeft: 17,
            paddingRight: 15,
          }}
        >
          {/* =================================================
              BRAND
          ================================================= */}

          <IkigaiLogo size={36} showName={true} darkMode={darkMode} />

          {/* =================================================
              MOBILE CONTROLS
          ================================================= */}

          <div
            className="flex items-center"
            style={{
              gap: 8,
            }}
          >
            {/* PROFILE BUTTON */}

            <PremiumIconButton
              darkMode={darkMode}
              to="/profile"
              label="Open profile"
            >
              <UserRound size={18} strokeWidth={1.8} />
            </PremiumIconButton>

            {/* THEME BUTTON */}

            <PremiumIconButton
              darkMode={darkMode}
              label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              <ThemeToggle />
            </PremiumIconButton>
          </div>
        </div>
      </header>

      {/* =====================================================
          PAGE CONTENT

          Mobile:
          64px top header
          80px bottom navigation

          Desktop:
          72px top navigation
      ===================================================== */}

      <main
        className="pt-[64px] pb-24 md:pt-[72px] md:pb-0 min-h-screen"
        style={{
          position: "relative",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -6,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
