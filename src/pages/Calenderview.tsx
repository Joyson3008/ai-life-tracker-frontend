import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flame,
  X,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

type Props = {
  userId: number;
};

type ViewMode = "month" | "heatmap" | "breakdown";

type CalendarDay = {
  date: Date;
  key: string;
  log: any;
};

const CATEGORIES = [
  {
    key: "bibleReading",
    label: "Bible",
    icon: "📖",
    color: "#6366f1",
  },
  {
    key: "bookReading",
    label: "Books",
    icon: "📚",
    color: "#8b5cf6",
  },
  {
    key: "codingWork",
    label: "Coding",
    icon: "💻",
    color: "#10b981",
  },
  {
    key: "csTopic",
    label: "CS",
    icon: "🧠",
    color: "#06b6d4",
  },
  {
    key: "collegeActivity",
    label: "College",
    icon: "🏫",
    color: "#3b82f6",
  },
  {
    key: "diary",
    label: "Diary",
    icon: "📔",
    color: "#f59e0b",
  },
  {
    key: "movie",
    label: "Movie",
    icon: "🎬",
    color: "#ec4899",
  },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/* =========================================================
   SCORE HELPERS
========================================================= */

function getScoreColor(score: number): string {
  if (score >= 9) return "#10b981";
  if (score >= 7) return "#34d399";
  if (score >= 5) return "#f59e0b";
  if (score >= 3) return "#f97316";
  if (score > 0) return "#f43f5e";

  return "#8e8e93";
}

function getScoreLabel(score: number): string {
  if (score >= 9) return "Legendary";
  if (score >= 7) return "Great";
  if (score >= 5) return "Good";
  if (score >= 3) return "Low";
  if (score > 0) return "Poor";

  return "No log";
}

function getScoreBackground(score: number, darkMode: boolean): string {
  if (!score) {
    return darkMode ? "#1c1c1e" : "#f2f2f7";
  }

  const color = getScoreColor(score);

  return darkMode ? `${color}1A` : `${color}12`;
}

function getScoreBorder(score: number, darkMode: boolean): string {
  if (!score) {
    return darkMode ? "#38383a" : "#e5e5ea";
  }

  const color = getScoreColor(score);

  return darkMode ? `${color}45` : `${color}35`;
}

/* =========================================================
   SMALL REUSABLE CARD
========================================================= */

function AppleCard({
  children,
  darkMode,
  className = "",
}: {
  children: React.ReactNode;
  darkMode: boolean;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        background: darkMode ? "#1c1c1e" : "#ffffff",
        border: `1px solid ${darkMode ? "#38383a" : "#e5e5ea"}`,
        borderRadius: 22,
        boxShadow: darkMode
          ? "0 1px 2px rgba(0,0,0,0.22)"
          : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {children}
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  accent,
  darkMode,
}: {
  label: string;
  value: string | number;
  accent: string;
  darkMode: boolean;
}) {
  return (
    <div
      style={{
        minWidth: 78,
        flex: 1,
        padding: "12px 10px",
        borderRadius: 15,
        background: darkMode ? "#2c2c2e" : "#f2f2f7",
        border: `1px solid ${darkMode ? "#3a3a3c" : "#e5e5ea"}`,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 19,
          lineHeight: 1.15,
          fontWeight: 700,
          letterSpacing: "-0.035em",
          color: accent,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: 5,
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.04em",
          color: darkMode ? "#8e8e93" : "#8e8e93",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* =========================================================
   VIEW SWITCHER
========================================================= */

function ViewSwitcher({
  viewMode,
  setViewMode,
  darkMode,
}: {
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
  darkMode: boolean;
}) {
  const items: {
    key: ViewMode;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      key: "month",
      label: "Month",
      icon: <CalendarDays size={14} strokeWidth={1.8} />,
    },
    {
      key: "heatmap",
      label: "Activity",
      icon: <Flame size={14} strokeWidth={1.8} />,
    },
    {
      key: "breakdown",
      label: "Insights",
      icon: <BarChart3 size={14} strokeWidth={1.8} />,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        padding: 3,
        gap: 2,
        borderRadius: 14,
        background: darkMode ? "#1c1c1e" : "#e5e5ea",
        border: `1px solid ${darkMode ? "#38383a" : "#d1d1d6"}`,
      }}
    >
      {items.map((item) => {
        const active = viewMode === item.key;

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => setViewMode(item.key)}
            style={{
              flex: 1,
              minHeight: 38,
              padding: "0 8px",
              border: 0,
              borderRadius: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
              background: active
                ? darkMode
                  ? "#3a3a3c"
                  : "#ffffff"
                : "transparent",
              color: active
                ? darkMode
                  ? "#f5f5f7"
                  : "#1d1d1f"
                : darkMode
                  ? "#8e8e93"
                  : "#6e6e73",
              fontSize: 12,
              fontWeight: active ? 600 : 500,
              boxShadow: active
                ? darkMode
                  ? "0 1px 3px rgba(0,0,0,0.25)"
                  : "0 1px 3px rgba(0,0,0,0.08)"
                : "none",
              transition: "background-color 160ms ease, color 160ms ease",
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function CalendarView({ userId }: Props) {
  const { darkMode } = useTheme();

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState("");

  /* =======================================================
     THEME
  ======================================================= */

  const pageBackground = darkMode ? "#000000" : "#f2f2f7";
  const textPrimary = darkMode ? "#f5f5f7" : "#1d1d1f";
  const textSecondary = darkMode ? "#aeaeb2" : "#6e6e73";
  const textTertiary = "#8e8e93";
  const separator = darkMode ? "#38383a" : "#e5e5ea";
  const secondaryBackground = darkMode ? "#1c1c1e" : "#ffffff";
  const groupedBackground = darkMode ? "#2c2c2e" : "#f2f2f7";
  const blue = darkMode ? "#0a84ff" : "#007aff";

  /* =======================================================
     LOAD LOGS
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadLogs = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "https://ai-life-tracker.onrender.com/api/daily",
        );

        if (!response.ok) {
          throw new Error("Failed to load calendar");
        }

        const data = await response.json();

        if (cancelled) return;

        const userLogs = data
          .filter((log: any) => log.user?.id === userId)
          .sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

        setLogs(userLogs);
      } catch (requestError) {
        console.error("Calendar loading error:", requestError);

        if (!cancelled) {
          setError("Unable to load your calendar. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadLogs();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* =======================================================
     LOG MAP
  ======================================================= */

  const logMap = useMemo(() => {
    const map: Record<string, any> = {};

    logs.forEach((log) => {
      const key = new Date(log.date).toISOString().split("T")[0];

      map[key] = log;
    });

    return map;
  }, [logs]);

  /* =======================================================
     CURRENT MONTH CALENDAR
  ======================================================= */

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (null | CalendarDay)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);

      const key = date.toISOString().split("T")[0];

      days.push({
        date,
        key,
        log: logMap[key] || null,
      });
    }

    return days;
  }, [currentDate, logMap]);

  /* =======================================================
     12 MONTH HEATMAP
  ======================================================= */

  const heatmapData = useMemo(() => {
    const today = new Date();

    const start = new Date(today);
    start.setMonth(start.getMonth() - 11);
    start.setDate(1);

    const weeks: CalendarDay[][] = [];

    const current = new Date(start);

    while (current.getDay() !== 0) {
      current.setDate(current.getDate() - 1);
    }

    let week: CalendarDay[] = [];

    while (current <= today) {
      const date = new Date(current);

      const key = date.toISOString().split("T")[0];

      week.push({
        date,
        key,
        log: logMap[key] || null,
      });

      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }

      current.setDate(current.getDate() + 1);
    }

    if (week.length > 0) {
      weeks.push(week);
    }

    return weeks;
  }, [logMap]);

  /* =======================================================
     CATEGORY STATISTICS
  ======================================================= */

  const categoryStats = useMemo(() => {
    return CATEGORIES.map((category) => {
      const daysLogged = logs.filter((log) =>
        Boolean(log[category.key]),
      ).length;

      const pct =
        logs.length > 0 ? Math.round((daysLogged / logs.length) * 100) : 0;

      return {
        ...category,
        daysLogged,
        pct,
      };
    });
  }, [logs]);

  /* =======================================================
     MONTH STATISTICS
  ======================================================= */

  const monthLogs = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return logs.filter((log) => {
      const date = new Date(log.date);

      return date.getFullYear() === year && date.getMonth() === month;
    });
  }, [logs, currentDate]);

  const monthAvg =
    monthLogs.length > 0
      ? (
          monthLogs.reduce((sum, log) => sum + (Number(log.score) || 0), 0) /
          monthLogs.length
        ).toFixed(1)
      : "—";

  const bestInMonth = monthLogs.reduce(
    (best, log) =>
      (Number(log.score) || 0) > (Number(best?.score) || 0) ? log : best,
    null as any,
  );

  const daysInCurrentMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const monthConsistency =
    daysInCurrentMonth > 0
      ? Math.round(
          (monthLogs.filter((log) => (log.score || 0) >= 6).length /
            daysInCurrentMonth) *
            100,
        )
      : 0;

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const goPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
    setSelectedDay(null);
  };

  const goNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
    setSelectedDay(null);
  };

  const goToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  /* =======================================================
     TODAY KEY
  ======================================================= */

  const todayKey = new Date().toISOString().split("T")[0];

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        className="calendar-root"
        style={{
          minHeight: "100svh",
          background: pageBackground,
          color: textPrimary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 280,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              margin: "0 auto 18px",
              borderRadius: 18,
              background: secondaryBackground,
              border: `1px solid ${separator}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: darkMode
                ? "0 2px 8px rgba(0,0,0,.25)"
                : "0 2px 8px rgba(0,0,0,.06)",
            }}
          >
            <CalendarDays size={25} strokeWidth={1.7} color={blue} />
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.02em",
            }}
          >
            Preparing your calendar
          </p>

          <p
            style={{
              margin: "7px 0 0",
              fontSize: 14,
              lineHeight: 1.4,
              color: textSecondary,
            }}
          >
            Your daily story is being organized.
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div
        style={{
          minHeight: "100svh",
          background: pageBackground,
          color: textPrimary,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <AppleCard darkMode={darkMode} className="w-full max-w-sm">
          <div
            style={{
              padding: 28,
              textAlign: "center",
            }}
          >
            <CalendarDays size={32} color={blue} strokeWidth={1.6} />

            <h2
              style={{
                margin: "16px 0 6px",
                fontSize: 21,
                letterSpacing: "-0.03em",
              }}
            >
              Calendar unavailable
            </h2>

            <p
              style={{
                margin: 0,
                color: textSecondary,
                fontSize: 14,
                lineHeight: 1.45,
              }}
            >
              {error}
            </p>
          </div>
        </AppleCard>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <div
      className="calendar-root"
      style={{
        minHeight: "100svh",
        background: pageBackground,
        color: textPrimary,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <style>{`
        .calendar-root button {
          -webkit-tap-highlight-color: transparent;
        }

        .calendar-root button:focus-visible {
          outline: 2px solid #0a84ff;
          outline-offset: 2px;
        }

        .calendar-scroll {
          scrollbar-width: thin;
        }

        .calendar-day:hover {
          filter: brightness(1.025);
        }

        .calendar-day:active {
          transform: scale(0.97);
        }

        .calendar-nav-button:hover {
          background: ${darkMode ? "#3a3a3c" : "#e5e5ea"} !important;
        }

        .today-button:hover {
          background: ${darkMode ? "#172b43" : "#e7f1ff"} !important;
        }

        .category-card:hover {
          transform: translateY(-1px);
        }

        @media (max-width: 520px) {
          .calendar-page {
            padding-left: 16px !important;
            padding-right: 16px !important;
            padding-top: 22px !important;
          }

          .calendar-title {
            font-size: 32px !important;
          }

          .calendar-card {
            border-radius: 20px !important;
          }

          .calendar-grid-card {
            padding: 12px !important;
          }

          .calendar-grid {
            gap: 4px !important;
          }

          .calendar-day {
            border-radius: 11px !important;
          }

          .calendar-day-score {
            font-size: 8px !important;
          }

          .calendar-stat-row {
            gap: 6px !important;
          }

          .calendar-stat-row > div {
            min-width: 0 !important;
            padding: 10px 5px !important;
          }

          .calendar-month-title {
            width: auto !important;
            min-width: 145px !important;
            font-size: 16px !important;
          }

          .heatmap-card {
            padding: 16px !important;
          }
        }

        @media (min-width: 768px) {
          .calendar-page {
            max-width: 1040px !important;
          }
        }
      `}</style>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="calendar-page"
        style={{
          width: "100%",
          maxWidth: 1040,
          margin: "0 auto",
          padding: "28px 20px calc(100px + env(safe-area-inset-bottom))",
          boxSizing: "border-box",
        }}
      >
        {/* ===================================================
            HEADER
        =================================================== */}

        <header
          style={{
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  marginBottom: 7,
                  color: blue,
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                <CalendarDays size={14} strokeWidth={1.8} />
                LIFE CALENDAR
              </div>

              <h1
                className="calendar-title"
                style={{
                  margin: 0,
                  fontSize: 36,
                  lineHeight: 1.05,
                  fontWeight: 700,
                  letterSpacing: "-0.045em",
                }}
              >
                Your days,
                <br />
                <span
                  style={{
                    color: blue,
                  }}
                >
                  visualized.
                </span>
              </h1>

              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: 14,
                  color: textSecondary,
                }}
              >
                {logs.length} {logs.length === 1 ? "day" : "days"} recorded
              </p>
            </div>
          </div>

          {/* VIEW SWITCHER */}

          <div
            style={{
              marginTop: 22,
            }}
          >
            <ViewSwitcher
              viewMode={viewMode}
              setViewMode={setViewMode}
              darkMode={darkMode}
            />
          </div>
        </header>

        {/* ===================================================
            MONTH VIEW
        =================================================== */}

        {viewMode === "month" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* MONTH NAVIGATION */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <button
                type="button"
                onClick={goPreviousMonth}
                className="calendar-nav-button"
                aria-label="Previous month"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: `1px solid ${separator}`,
                  background: groupedBackground,
                  color: textPrimary,
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  transition: "background 160ms ease",
                }}
              >
                <ChevronLeft size={19} strokeWidth={1.8} />
              </button>

              <button
                type="button"
                onClick={goToday}
                className="today-button"
                style={{
                  flex: 1,
                  maxWidth: 210,
                  minHeight: 40,
                  borderRadius: 12,
                  border: `1px solid ${separator}`,
                  background: secondaryBackground,
                  color: textPrimary,
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  transition: "background 160ms ease",
                }}
              >
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </button>

              <button
                type="button"
                onClick={goNextMonth}
                className="calendar-nav-button"
                aria-label="Next month"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: `1px solid ${separator}`,
                  background: groupedBackground,
                  color: textPrimary,
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  transition: "background 160ms ease",
                }}
              >
                <ChevronRight size={19} strokeWidth={1.8} />
              </button>
            </div>

            {/* STATS */}

            <div
              className="calendar-stat-row"
              style={{
                display: "flex",
                gap: 8,
              }}
            >
              <StatCard
                label="Average"
                value={monthAvg}
                accent={blue}
                darkMode={darkMode}
              />

              <StatCard
                label="Logged"
                value={monthLogs.length}
                accent="#10b981"
                darkMode={darkMode}
              />

              <StatCard
                label="Consistency"
                value={`${monthConsistency}%`}
                accent="#34d399"
                darkMode={darkMode}
              />

              <StatCard
                label="Best"
                value={bestInMonth?.score || "—"}
                accent="#f59e0b"
                darkMode={darkMode}
              />
            </div>

            {/* SCORE LEGEND */}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "7px 12px",
                padding: "2px 2px",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: textTertiary,
                }}
              >
                SCORE
              </span>

              {[
                { label: "9–10", color: "#10b981" },
                { label: "7–8", color: "#34d399" },
                { label: "5–6", color: "#f59e0b" },
                { label: "3–4", color: "#f97316" },
                { label: "1–2", color: "#f43f5e" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: item.color,
                    }}
                  />

                  <span
                    style={{
                      fontSize: 10,
                      color: textSecondary,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CALENDAR */}

            <AppleCard
              darkMode={darkMode}
              className="calendar-card calendar-grid-card"
            >
              <div
                style={{
                  padding: 16,
                }}
              >
                {/* WEEKDAYS */}

                <div
                  className="calendar-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                    gap: 6,
                    marginBottom: 7,
                  }}
                >
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      style={{
                        textAlign: "center",
                        padding: "5px 0",
                        fontSize: 10,
                        fontWeight: 600,
                        color: textTertiary,
                      }}
                    >
                      {day.slice(0, 1)}
                    </div>
                  ))}
                </div>

                {/* DAYS */}

                <div
                  className="calendar-grid"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                    gap: 6,
                  }}
                >
                  {calendarDays.map((day, index) => {
                    if (!day) {
                      return (
                        <div
                          key={`empty-${index}`}
                          style={{
                            aspectRatio: "1",
                          }}
                        />
                      );
                    }

                    const score = Number(day.log?.score) || 0;

                    const isToday = day.key === todayKey;

                    const isSelected = selectedDay?.key === day.key;

                    return (
                      <button
                        key={day.key}
                        type="button"
                        onClick={() => setSelectedDay(isSelected ? null : day)}
                        className="calendar-day"
                        aria-label={`${day.date.toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}${day.log ? `, score ${score}` : ", no log"}`}
                        style={{
                          position: "relative",
                          aspectRatio: "1",
                          minWidth: 0,
                          borderRadius: 13,
                          border: `1px solid ${
                            isSelected ? blue : getScoreBorder(score, darkMode)
                          }`,
                          background: getScoreBackground(score, darkMode),
                          color: isToday
                            ? blue
                            : score
                              ? textPrimary
                              : textTertiary,
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 2,
                          transition: "transform 120ms ease, filter 120ms ease",
                          boxShadow: isSelected
                            ? `0 0 0 2px ${blue}22`
                            : "none",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            lineHeight: 1,
                            fontWeight: isToday ? 700 : 600,
                          }}
                        >
                          {day.date.getDate()}
                        </span>

                        {day.log && (
                          <span
                            className="calendar-day-score"
                            style={{
                              fontSize: 9,
                              lineHeight: 1,
                              fontWeight: 700,
                              color: getScoreColor(score),
                            }}
                          >
                            {score}
                          </span>
                        )}

                        {isToday && (
                          <span
                            style={{
                              position: "absolute",
                              bottom: 4,
                              width: 3,
                              height: 3,
                              borderRadius: "50%",
                              background: blue,
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </AppleCard>

            {/* SELECTED DAY */}

            {selectedDay?.log && (
              <AppleCard darkMode={darkMode} className="calendar-card">
                <div
                  style={{
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 16,
                    }}
                  >
                    <div>
                      <p
                        style={{
                          margin: 0,
                          fontSize: 12,
                          fontWeight: 500,
                          color: textSecondary,
                        }}
                      >
                        {selectedDay.date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          gap: 6,
                          marginTop: 7,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 42,
                            lineHeight: 1,
                            fontWeight: 700,
                            letterSpacing: "-0.06em",
                            color: getScoreColor(selectedDay.log.score),
                          }}
                        >
                          {selectedDay.log.score}
                        </span>

                        <span
                          style={{
                            fontSize: 15,
                            color: textTertiary,
                          }}
                        >
                          /10
                        </span>
                      </div>

                      <span
                        style={{
                          display: "inline-flex",
                          marginTop: 8,
                          padding: "5px 9px",
                          borderRadius: 8,
                          background: getScoreBackground(
                            selectedDay.log.score,
                            darkMode,
                          ),
                          color: getScoreColor(selectedDay.log.score),
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        {getScoreLabel(selectedDay.log.score)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDay(null)}
                      aria-label="Close selected day"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        border: 0,
                        background: groupedBackground,
                        color: textSecondary,
                        display: "grid",
                        placeItems: "center",
                        cursor: "pointer",
                      }}
                    >
                      <X size={16} strokeWidth={1.8} />
                    </button>
                  </div>

                  {/* ACTIVITIES */}

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 7,
                      marginTop: 20,
                    }}
                  >
                    {CATEGORIES.filter(
                      (category) => selectedDay.log[category.key],
                    ).map((category) => (
                      <span
                        key={category.key}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "6px 9px",
                          borderRadius: 9,
                          background: `${category.color}12`,
                          border: `1px solid ${category.color}25`,
                          color: darkMode ? category.color : category.color,
                          fontSize: 11,
                          fontWeight: 500,
                        }}
                      >
                        {category.icon}
                        {category.label}
                      </span>
                    ))}
                  </div>

                  {/* AI SUMMARY / MOTIVATION */}

                  {(selectedDay.log.finalSummary ||
                    selectedDay.log.motivation) && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit,minmax(220px,1fr))",
                        gap: 10,
                        marginTop: 16,
                      }}
                    >
                      {selectedDay.log.finalSummary && (
                        <div
                          style={{
                            padding: 14,
                            borderRadius: 14,
                            background: groupedBackground,
                            border: `1px solid ${separator}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginBottom: 7,
                              color: blue,
                              fontSize: 10,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}
                          >
                            <Sparkles size={13} strokeWidth={1.8} />
                            AI Summary
                          </div>

                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              lineHeight: 1.5,
                              color: textSecondary,
                            }}
                          >
                            {selectedDay.log.finalSummary}
                          </p>
                        </div>
                      )}

                      {selectedDay.log.motivation && (
                        <div
                          style={{
                            padding: 14,
                            borderRadius: 14,
                            background: groupedBackground,
                            border: `1px solid ${separator}`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              marginBottom: 7,
                              color: "#f59e0b",
                              fontSize: 10,
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}
                          >
                            <Flame size={13} strokeWidth={1.8} />
                            Motivation
                          </div>

                          <p
                            style={{
                              margin: 0,
                              fontSize: 13,
                              lineHeight: 1.5,
                              color: textSecondary,
                              fontStyle: "italic",
                            }}
                          >
                            {selectedDay.log.motivation}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </AppleCard>
            )}
          </div>
        )}

        {/* ===================================================
            HEATMAP VIEW
        =================================================== */}

        {viewMode === "heatmap" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <AppleCard
              darkMode={darkMode}
              className="heatmap-card calendar-card"
            >
              <div
                style={{
                  padding: 20,
                  overflowX: "auto",
                }}
                className="calendar-scroll"
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 650,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Activity
                </h2>

                <p
                  style={{
                    margin: "5px 0 20px",
                    fontSize: 13,
                    color: textSecondary,
                  }}
                >
                  Your activity across the last 12 months.
                </p>

                <div
                  style={{
                    minWidth: 620,
                  }}
                >
                  {/* MONTH LABELS */}

                  <div
                    style={{
                      display: "flex",
                      marginLeft: 25,
                      marginBottom: 7,
                      gap: 5,
                    }}
                  >
                    {heatmapData
                      .filter((_, index) => index % 4 === 0)
                      .map((week, index) => (
                        <div
                          key={index}
                          style={{
                            width: 12,
                            flex: 1,
                            fontSize: 9,
                            color: textTertiary,
                          }}
                        >
                          {week[0] &&
                            MONTHS[week[0].date.getMonth()].slice(0, 3)}
                        </div>
                      ))}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                    }}
                  >
                    {/* DAY LABELS */}

                    <div
                      style={{
                        width: 18,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                        <div
                          key={index}
                          style={{
                            height: 12,
                            display: "flex",
                            alignItems: "center",
                            fontSize: 8,
                            color: textTertiary,
                          }}
                        >
                          {day}
                        </div>
                      ))}
                    </div>

                    {/* HEATMAP */}

                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        flex: 1,
                      }}
                    >
                      {heatmapData.map((week, weekIndex) => (
                        <div
                          key={weekIndex}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 4,
                            flex: 1,
                          }}
                        >
                          {week.map((day) => {
                            const score = Number(day.log?.score) || 0;

                            return (
                              <button
                                key={day.key}
                                type="button"
                                onClick={() => setSelectedDay(day)}
                                title={`${day.date.toLocaleDateString()} — ${
                                  day.log ? `Score: ${score}` : "No log"
                                }`}
                                style={{
                                  width: "100%",
                                  aspectRatio: "1",
                                  minWidth: 8,
                                  maxWidth: 15,
                                  padding: 0,
                                  borderRadius: 3,
                                  border: `1px solid ${
                                    score
                                      ? getScoreColor(score) + "45"
                                      : darkMode
                                        ? "#2c2c2e"
                                        : "#e5e5ea"
                                  }`,
                                  background: score
                                    ? getScoreColor(score)
                                    : darkMode
                                      ? "#1c1c1e"
                                      : "#e5e5ea",
                                  cursor: "pointer",
                                }}
                              />
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* LEGEND */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 5,
                    marginTop: 18,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      color: textTertiary,
                    }}
                  >
                    Less
                  </span>

                  {[0, 2, 4, 6, 8, 10].map((score) => (
                    <span
                      key={score}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 3,
                        background:
                          score === 0
                            ? darkMode
                              ? "#1c1c1e"
                              : "#e5e5ea"
                            : getScoreColor(score),
                      }}
                    />
                  ))}

                  <span
                    style={{
                      fontSize: 9,
                      color: textTertiary,
                    }}
                  >
                    More
                  </span>
                </div>
              </div>
            </AppleCard>

            {/* SUMMARY CARDS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
                gap: 10,
              }}
            >
              {[
                {
                  label: "Total Days",
                  value: logs.length,
                  icon: <CalendarDays size={17} />,
                  color: blue,
                },
                {
                  label: "Best Score",
                  value:
                    logs.length > 0
                      ? Math.max(...logs.map((log) => Number(log.score) || 0))
                      : "—",
                  icon: <Sparkles size={17} />,
                  color: "#f59e0b",
                },
                {
                  label: "Active Months",
                  value: new Set(
                    logs.map(
                      (log) =>
                        `${new Date(log.date).getFullYear()}-${new Date(
                          log.date,
                        ).getMonth()}`,
                    ),
                  ).size,
                  icon: <CalendarDays size={17} />,
                  color: "#8b5cf6",
                },
              ].map((item) => (
                <AppleCard key={item.label} darkMode={darkMode}>
                  <div
                    style={{
                      padding: 17,
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 11,
                        display: "grid",
                        placeItems: "center",
                        background: `${item.color}14`,
                        color: item.color,
                      }}
                    >
                      {item.icon}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 22,
                          lineHeight: 1,
                          fontWeight: 700,
                          letterSpacing: "-0.04em",
                        }}
                      >
                        {item.value}
                      </div>

                      <div
                        style={{
                          marginTop: 5,
                          fontSize: 10,
                          color: textTertiary,
                        }}
                      >
                        {item.label}
                      </div>
                    </div>
                  </div>
                </AppleCard>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================
            BREAKDOWN VIEW
        =================================================== */}

        {viewMode === "breakdown" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* SCORE DISTRIBUTION */}

            <AppleCard darkMode={darkMode} className="calendar-card">
              <div style={{ padding: 20 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 650,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Score distribution
                </h2>

                <p
                  style={{
                    margin: "5px 0 20px",
                    fontSize: 13,
                    color: textSecondary,
                  }}
                >
                  How your daily scores are distributed.
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 13,
                  }}
                >
                  {[
                    {
                      label: "Legendary",
                      min: 9,
                      max: 10,
                      color: "#10b981",
                    },
                    {
                      label: "Great",
                      min: 7,
                      max: 8,
                      color: "#34d399",
                    },
                    {
                      label: "Good",
                      min: 5,
                      max: 6,
                      color: "#f59e0b",
                    },
                    {
                      label: "Low",
                      min: 3,
                      max: 4,
                      color: "#f97316",
                    },
                    {
                      label: "Poor",
                      min: 1,
                      max: 2,
                      color: "#f43f5e",
                    },
                  ].map((band) => {
                    const count = logs.filter(
                      (log) =>
                        (log.score || 0) >= band.min &&
                        (log.score || 0) <= band.max,
                    ).length;

                    const pct =
                      logs.length > 0
                        ? Math.round((count / logs.length) * 100)
                        : 0;

                    return (
                      <div key={band.label}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 6,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 500,
                              color: textSecondary,
                            }}
                          >
                            {band.label}{" "}
                            <span
                              style={{
                                color: textTertiary,
                              }}
                            >
                              ({band.min}–{band.max})
                            </span>
                          </span>

                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: band.color,
                            }}
                          >
                            {count} {count === 1 ? "day" : "days"}
                          </span>
                        </div>

                        <div
                          style={{
                            height: 7,
                            borderRadius: 99,
                            background: darkMode ? "#2c2c2e" : "#e5e5ea",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${pct}%`,
                              height: "100%",
                              borderRadius: 99,
                              background: band.color,
                              transition: "width 400ms ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AppleCard>

            {/* CATEGORY COVERAGE */}

            <AppleCard darkMode={darkMode} className="calendar-card">
              <div style={{ padding: 20 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 650,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Category coverage
                </h2>

                <p
                  style={{
                    margin: "5px 0 18px",
                    fontSize: 13,
                    color: textSecondary,
                  }}
                >
                  How consistently each area appears in your logs.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
                    gap: 9,
                  }}
                >
                  {categoryStats.map((category) => {
                    const selected = selectedCategory === category.key;

                    return (
                      <button
                        key={category.key}
                        type="button"
                        onClick={() =>
                          setSelectedCategory(selected ? null : category.key)
                        }
                        className="category-card"
                        style={{
                          textAlign: "left",
                          padding: 14,
                          borderRadius: 15,
                          border: `1px solid ${
                            selected ? category.color + "55" : separator
                          }`,
                          background: selected
                            ? `${category.color}0D`
                            : groupedBackground,
                          cursor: "pointer",
                          transition:
                            "transform 140ms ease, background 140ms ease",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 10,
                          }}
                        >
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 13,
                              fontWeight: 600,
                              color: textPrimary,
                            }}
                          >
                            <span>{category.icon}</span>
                            {category.label}
                          </span>

                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: category.color,
                            }}
                          >
                            {category.pct}%
                          </span>
                        </div>

                        <div
                          style={{
                            height: 5,
                            borderRadius: 99,
                            background: darkMode ? "#3a3a3c" : "#e5e5ea",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${category.pct}%`,
                              height: "100%",
                              borderRadius: 99,
                              background: category.color,
                            }}
                          />
                        </div>

                        <p
                          style={{
                            margin: "7px 0 0",
                            fontSize: 10,
                            color: textTertiary,
                          }}
                        >
                          {category.daysLogged} of {logs.length} days
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </AppleCard>

            {/* DAY OF WEEK */}

            <AppleCard darkMode={darkMode} className="calendar-card">
              <div style={{ padding: 20 }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 650,
                    letterSpacing: "-0.025em",
                  }}
                >
                  Weekly pattern
                </h2>

                <p
                  style={{
                    margin: "5px 0 20px",
                    fontSize: 13,
                    color: textSecondary,
                  }}
                >
                  Average score by day of the week.
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 8,
                    height: 150,
                  }}
                >
                  {WEEKDAYS.map((day, dayIndex) => {
                    const dayLogs = logs.filter(
                      (log) => new Date(log.date).getDay() === dayIndex,
                    );

                    const average =
                      dayLogs.length > 0
                        ? dayLogs.reduce(
                            (sum, log) => sum + (log.score || 0),
                            0,
                          ) / dayLogs.length
                        : 0;

                    const height = (average / 10) * 100;

                    const color =
                      average > 0
                        ? getScoreColor(average)
                        : darkMode
                          ? "#3a3a3c"
                          : "#e5e5ea";

                    return (
                      <div
                        key={day}
                        style={{
                          flex: 1,
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          gap: 6,
                        }}
                      >
                        {average > 0 && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              color,
                            }}
                          >
                            {average.toFixed(1)}
                          </span>
                        )}

                        <div
                          style={{
                            width: "100%",
                            height: 88,
                            display: "flex",
                            alignItems: "flex-end",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: `${Math.max(
                                height,
                                average > 0 ? 8 : 3,
                              )}%`,
                              minHeight: average > 0 ? 5 : 3,
                              borderRadius: "7px 7px 3px 3px",
                              background: average > 0 ? `${color}25` : color,
                              border:
                                average > 0 ? `1px solid ${color}40` : "none",
                              transition: "height 400ms ease",
                            }}
                          />
                        </div>

                        <span
                          style={{
                            fontSize: 9,
                            color: textTertiary,
                            fontWeight: 500,
                          }}
                        >
                          {day.slice(0, 1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AppleCard>
          </div>
        )}
      </div>
    </div>
  );
}
