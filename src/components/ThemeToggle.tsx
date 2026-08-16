import { CalendarDays, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      className="mobile-header-actions"
      style={{
        background: darkMode
          ? "rgba(255,255,255,0.055)"
          : "rgba(255,255,255,0.72)",

        border: darkMode
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(15,23,42,0.08)",

        boxShadow: darkMode
          ? "0 2px 12px rgba(0,0,0,0.18)"
          : "0 2px 12px rgba(15,23,42,0.06)",

        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
      }}
    >
      {/* =====================================================
          CALENDAR
      ===================================================== */}

      <button
        type="button"
        onClick={() => navigate("/calendar")}
        title="Calendar"
        aria-label="Open Calendar"
        className="mobile-action-button"
        style={{
          color: darkMode ? "#F5F5F7" : "#1C1C1E",
        }}
      >
        <CalendarDays className="mobile-action-icon" />
      </button>

      {/* =====================================================
          THEME
      ===================================================== */}

      <button
        type="button"
        onClick={toggleDarkMode}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        aria-pressed={darkMode}
        className="mobile-action-button"
        style={{
          color: darkMode ? "#F5F5F7" : "#1C1C1E",
        }}
      >
        {darkMode ? (
          <Sun className="mobile-action-icon" />
        ) : (
          <Moon className="mobile-action-icon" />
        )}
      </button>

      <style>{`
        /* =====================================================
           APPLE MOBILE HEADER ACTION GROUP
        ===================================================== */

        .mobile-header-actions {
          height: 40px;

          display: flex;
          align-items: center;

          gap: 2px;

          padding: 2px;

          border-radius: 13px;

          flex-shrink: 0;

          box-sizing: border-box;
        }

        /* =====================================================
           INDIVIDUAL ACTION
        ===================================================== */

        .mobile-action-button {
          position: relative;

          width: 34px;
          height: 34px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 0;

          border: 0;
          border-radius: 10px;

          background: transparent;

          cursor: pointer;

          outline: none;

          -webkit-tap-highlight-color: transparent;

          transition:
            background-color 150ms ease,
            transform 100ms ease;
        }

        /* =====================================================
           ICON
        ===================================================== */

        .mobile-action-icon {
          width: 17px;
          height: 17px;

          stroke-width: 1.8;

          flex-shrink: 0;
        }

        /* =====================================================
           HOVER
           Mostly useful for desktop/tablet.
        ===================================================== */

        .mobile-action-button:hover {
          background: ${
            darkMode ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.055)"
          };
        }

        /* =====================================================
           PRESS
        ===================================================== */

        .mobile-action-button:active {
          transform: scale(0.94);
        }

        /* =====================================================
           KEYBOARD ACCESSIBILITY
        ===================================================== */

        .mobile-action-button:focus-visible {
          outline: 2px solid ${
            darkMode ? "rgba(10,132,255,0.65)" : "rgba(0,122,255,0.45)"
          };

          outline-offset: 1px;
        }

        /* =====================================================
           MOBILE OPTIMIZATION
        ===================================================== */

        @media (max-width: 480px) {
          .mobile-header-actions {
            height: 38px;
            padding: 2px;
            gap: 1px;
            border-radius: 12px;
          }

          .mobile-action-button {
            width: 32px;
            height: 32px;
            border-radius: 9px;
          }

          .mobile-action-icon {
            width: 16px;
            height: 16px;
          }
        }

        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          .mobile-action-button {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
