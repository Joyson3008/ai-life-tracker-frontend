import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggleDarkMode}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={darkMode}
      title={darkMode ? "Light Mode" : "Dark Mode"}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className="relative outline-none select-none"
      style={{
        width: 58,
        height: 32,
        padding: 2,
        borderRadius: 999,
        cursor: "pointer",

        background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.055)",

        border: darkMode
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid rgba(0,0,0,0.08)",

        boxShadow: darkMode
          ? `
            inset 0 1px 0 rgba(255,255,255,0.08),
            0 2px 8px rgba(0,0,0,0.22)
          `
          : `
            inset 0 1px 0 rgba(255,255,255,0.9),
            0 2px 8px rgba(0,0,0,0.08)
          `,

        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",

        transition:
          "background 280ms ease, border 280ms ease, box-shadow 280ms ease",
      }}
    >
      {/* =====================================================
          SUBTLE TRACK LIGHT
      ===================================================== */}

      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        animate={{
          opacity: darkMode ? 0.45 : 0.7,
        }}
        transition={{ duration: 0.25 }}
        style={{
          background: darkMode
            ? "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.06))"
            : "linear-gradient(90deg, rgba(255,255,255,0.65), rgba(255,255,255,0.25))",
        }}
      />

      {/* =====================================================
          TRACK ICONS
      ===================================================== */}

      <div
        className="absolute inset-0 flex items-center justify-between pointer-events-none"
        style={{
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        <Sun
          size={12}
          strokeWidth={2.1}
          style={{
            color: darkMode
              ? "rgba(255,255,255,0.28)"
              : "rgba(245,158,11,0.78)",
            transition: "color 250ms ease",
          }}
        />

        <Moon
          size={11}
          strokeWidth={2.1}
          style={{
            color: darkMode
              ? "rgba(199,210,254,0.75)"
              : "rgba(100,116,139,0.30)",
            transition: "color 250ms ease",
          }}
        />
      </div>

      {/* =====================================================
          PREMIUM SLIDER THUMB
      ===================================================== */}

      <motion.div
        animate={{
          x: darkMode ? 26 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 550,
          damping: 32,
          mass: 0.7,
        }}
        className="absolute top-1 left-1 flex items-center justify-center"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",

          background: darkMode
            ? "linear-gradient(145deg, #3f4652, #252a33)"
            : "linear-gradient(145deg, #ffffff, #f5f5f7)",

          border: darkMode
            ? "1px solid rgba(255,255,255,0.12)"
            : "1px solid rgba(0,0,0,0.05)",

          boxShadow: darkMode
            ? `
              0 2px 6px rgba(0,0,0,0.35),
              0 1px 2px rgba(0,0,0,0.2),
              inset 0 1px 0 rgba(255,255,255,0.12)
            `
            : `
              0 2px 6px rgba(0,0,0,0.12),
              0 1px 2px rgba(0,0,0,0.08),
              inset 0 1px 0 rgba(255,255,255,1)
            `,

          transition:
            "background 280ms ease, border 280ms ease, box-shadow 280ms ease",
        }}
      >
        {/* =================================================
            THUMB ICON
        ================================================= */}

        <motion.div
          key={darkMode ? "dark" : "light"}
          initial={{
            opacity: 0,
            scale: 0.65,
            rotate: darkMode ? -30 : 30,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 24,
          }}
        >
          {darkMode ? (
            <Moon
              size={14}
              strokeWidth={2.2}
              style={{
                color: "#dbe4ff",
              }}
            />
          ) : (
            <Sun
              size={14}
              strokeWidth={2.2}
              style={{
                color: "#f59e0b",
              }}
            />
          )}
        </motion.div>

        {/* =================================================
            THUMB TOP REFLECTION
        ================================================= */}

        <div
          className="absolute pointer-events-none"
          style={{
            top: 2,
            left: 7,
            right: 7,
            height: 1,
            borderRadius: 999,

            background: darkMode
              ? "rgba(255,255,255,0.13)"
              : "rgba(255,255,255,0.95)",
          }}
        />
      </motion.div>

      {/* =====================================================
          OUTER HIGHLIGHT
      ===================================================== */}

      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: 0,
          left: 4,
          right: 4,
          height: 1,

          background: darkMode
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.85)",
        }}
      />
    </motion.button>
  );
}
