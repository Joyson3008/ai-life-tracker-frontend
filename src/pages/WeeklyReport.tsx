import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../context/ThemeContext";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

import {
  TrendingUp,
  Activity,
  Brain,
  Target,
  BarChart3,
  Zap,
  Award,
  BookOpen,
  Code2,
  Flame,
  Moon,
  Sun,
  Dumbbell,
  Eye,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

type Props = {
  userId: number;
};

type ThemeProps = {
  darkMode: boolean;
};

/* =========================================================
   CONSTANTS
========================================================= */

const BASE_URL = "https://ai-life-tracker.onrender.com";

const SCORE_COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

const NEON_COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ec4899"];

/* =========================================================
   THEME HELPERS
========================================================= */

function getTheme(darkMode: boolean) {
  return {
    pageBg: darkMode ? "bg-[#060910]" : "bg-[#F5F5F7]",

    primaryText: darkMode ? "text-white" : "text-[#111827]",

    secondaryText: darkMode ? "text-gray-400" : "text-slate-500",

    mutedText: darkMode ? "text-gray-500" : "text-slate-400",

    veryMutedText: darkMode ? "text-gray-600" : "text-slate-400",

    card: darkMode
      ? "bg-white/[0.035] border-white/[0.07]"
      : "bg-white border-slate-200/80",

    cardHover: darkMode
      ? "hover:bg-white/[0.05] hover:border-white/[0.12]"
      : "hover:bg-white hover:border-slate-300 hover:shadow-md",

    border: darkMode ? "border-white/[0.07]" : "border-slate-200",

    divider: darkMode ? "divide-white/[0.05]" : "divide-slate-100",

    subtleBg: darkMode ? "bg-white/[0.025]" : "bg-slate-50",

    controlBg: darkMode ? "bg-white/[0.04]" : "bg-white",

    controlBorder: darkMode ? "border-white/[0.08]" : "border-slate-200",

    chartGrid: darkMode ? "#ffffff0c" : "#0f172a10",

    chartText: darkMode ? "#6b7280" : "#64748b",

    chartAxis: darkMode ? "#374151" : "#cbd5e1",

    tooltipBg: darkMode ? "#0d1117" : "#ffffff",

    tooltipBorder: darkMode ? "#ffffff12" : "#e2e8f0",

    tooltipText: darkMode ? "#f8fafc" : "#0f172a",

    tooltipMuted: darkMode ? "#9ca3af" : "#64748b",
  };
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function CustomTooltip({ active, payload, label, darkMode }: any & ThemeProps) {
  const theme = getTheme(darkMode);

  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div
      className="rounded-xl px-4 py-3 shadow-xl backdrop-blur-xl"
      style={{
        background: theme.tooltipBg,
        border: `1px solid ${theme.tooltipBorder}`,
        color: theme.tooltipText,
      }}
    >
      <p
        className="text-[10px] uppercase tracking-widest mb-2"
        style={{ color: theme.tooltipMuted }}
      >
        {label}
      </p>

      <div className="space-y-1">
        {payload.map((p: any, i: number) => (
          <p
            key={i}
            className="text-xs font-medium"
            style={{ color: p.color || theme.tooltipText }}
          >
            {p.name}:{" "}
            <span className="font-bold" style={{ color: theme.tooltipText }}>
              {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
  darkMode,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  darkMode: boolean;
}) {
  const theme = getTheme(darkMode);

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl border
        p-4 sm:p-5
        transition-all duration-300
        ${theme.card}
        ${theme.cardHover}
      `}
    >
      {/* Hover glow */}
      <div
        className={`
          absolute inset-0 opacity-0
          group-hover:opacity-100
          transition-opacity duration-500
          bg-gradient-to-br ${color}
          pointer-events-none
        `}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[9px] sm:text-[10px] uppercase tracking-[0.15em] font-semibold ${theme.mutedText}`}
          >
            {label}
          </span>

          <span className={theme.veryMutedText}>{icon}</span>
        </div>

        <p
          className={`text-2xl sm:text-3xl font-black tracking-tight ${theme.primaryText}`}
        >
          {value}
        </p>

        {sub && (
          <p className={`text-[10px] mt-1 ${theme.secondaryText}`}>{sub}</p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PREMIUM CARD
========================================================= */

function Card({
  title,
  icon,
  children,
  span2 = false,
  darkMode,
  subtitle,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  span2?: boolean;
  darkMode: boolean;
  subtitle?: string;
}) {
  const theme = getTheme(darkMode);

  return (
    <div
      className={`
        rounded-2xl sm:rounded-3xl
        border
        p-4 sm:p-6
        backdrop-blur-xl
        transition-all duration-300
        ${theme.card}
        ${theme.cardHover}
        ${span2 ? "md:col-span-2" : ""}
      `}
    >
      <div className="flex items-start gap-3 mb-5">
        <div
          className={`
            w-8 h-8 rounded-xl
            flex items-center justify-center
            shrink-0
            ${
              darkMode
                ? "bg-indigo-500/10 border border-indigo-500/20"
                : "bg-indigo-50 border border-indigo-100"
            }
          `}
        >
          <span className="text-indigo-500">{icon}</span>
        </div>

        <div className="min-w-0">
          <h3
            className={`font-bold text-sm tracking-tight ${theme.primaryText}`}
          >
            {title}
          </h3>

          {subtitle && (
            <p className={`text-[10px] mt-0.5 ${theme.secondaryText}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   EMPTY / LOADING
========================================================= */

function LoadingScreen({ darkMode }: ThemeProps) {
  const theme = getTheme(darkMode);

  return (
    <div
      className={`min-h-screen ${theme.pageBg} flex items-center justify-center px-6`}
    >
      <div className="flex flex-col items-center gap-5">
        <div
          className="
            w-11 h-11
            rounded-full
            border-2 border-indigo-500
            border-t-transparent
            animate-spin
          "
        />

        <div className="text-center">
          <p
            className={`text-[10px] uppercase tracking-[0.3em] font-semibold ${theme.secondaryText}`}
          >
            Preparing your report
          </p>

          <p className={`text-xs mt-1 ${theme.mutedText}`}>
            Analyzing your latest activity
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ darkMode }: ThemeProps) {
  const theme = getTheme(darkMode);

  return (
    <div
      className={`min-h-screen ${theme.pageBg} flex items-center justify-center px-6`}
    >
      <div
        className={`
          w-full max-w-md
          rounded-3xl
          border
          p-8
          text-center
          ${theme.card}
        `}
      >
        <div
          className="
            w-16 h-16
            rounded-2xl
            bg-indigo-500/10
            border border-indigo-500/15
            flex items-center justify-center
            mx-auto mb-5
          "
        >
          <Brain className="w-7 h-7 text-indigo-500" />
        </div>

        <h2 className={`text-xl font-black ${theme.primaryText}`}>
          Your week is waiting
        </h2>

        <p className={`text-sm mt-2 leading-relaxed ${theme.secondaryText}`}>
          Start logging your days and your weekly intelligence report will
          appear here.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function WeeklyReport({ userId }: Props) {
  const { darkMode } = useTheme();

  const theme = getTheme(darkMode);

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "performance" | "habits" | "focus"
  >("performance");

  /* =======================================================
     FETCH DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    setLoading(true);

    fetch(`${BASE_URL}/api/daily`)
      .then((r) => {
        if (!r.ok) {
          throw new Error("Failed to fetch daily logs");
        }

        return r.json();
      })
      .then((data) => {
        if (!mounted) return;

        const userLogs = data
          .filter((l: any) => l.user?.id === userId)
          .sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

        setLogs(userLogs);
      })
      .catch((error) => {
        console.error("Weekly report error:", error);

        if (mounted) {
          setLogs([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [userId]);

  /* =======================================================
     LAST 7 DAYS
  ======================================================= */

  const weeklyLogs = useMemo(() => {
    return [...logs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7)
      .reverse();
  }, [logs]);

  /* =======================================================
     CHART DATA
  ======================================================= */

  const chartData = useMemo(() => {
    return weeklyLogs.map((l, i) => {
      const date = new Date(l.date);

      return {
        day: date.toLocaleDateString("en-US", {
          weekday: "short",
        }),

        fullDate: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),

        score: Number(l.score || 0),

        phoneMinutes: typeof l.phoneUsage === "number" ? l.phoneUsage : 0,

        coding: l.codingWork ? 1 : 0,

        reading: l.bookReading ? 1 : 0,

        learning: l.csTopic ? 1 : 0,

        bible: l.bibleReading ? 1 : 0,

        college: l.collegeActivity ? 1 : 0,

        productivity:
          (l.codingWork ? 2 : 0) +
          (l.bookReading ? 1 : 0) +
          (l.csTopic ? 1 : 0) +
          (l.bibleReading ? 1 : 0) +
          (l.collegeActivity ? 1 : 0),

        expenses: Number(l.expenses || 0),

        index: i,
      };
    });
  }, [weeklyLogs]);

  /* =======================================================
     RADAR
  ======================================================= */

  const radarData = useMemo(
    () => [
      {
        subject: "Coding",
        A: chartData.filter((d) => d.coding).length,
      },
      {
        subject: "Reading",
        A: chartData.filter((d) => d.reading).length,
      },
      {
        subject: "CS",
        A: chartData.filter((d) => d.learning).length,
      },
      {
        subject: "Bible",
        A: chartData.filter((d) => d.bible).length,
      },
      {
        subject: "College",
        A: chartData.filter((d) => d.college).length,
      },
    ],
    [chartData],
  );

  /* =======================================================
     SCORE DISTRIBUTION
  ======================================================= */

  const distribution = useMemo(
    () => [
      {
        name: "Low",
        value: weeklyLogs.filter((l) => (l.score || 0) < 5).length,
      },
      {
        name: "Medium",
        value: weeklyLogs.filter(
          (l) => (l.score || 0) >= 5 && (l.score || 0) < 8,
        ).length,
      },
      {
        name: "High",
        value: weeklyLogs.filter((l) => (l.score || 0) >= 8).length,
      },
    ],
    [weeklyLogs],
  );

  /* =======================================================
     ROLLING AVERAGE
  ======================================================= */

  const rolling = useMemo(() => {
    return chartData.map((_, i, arr) => {
      const slice = arr.slice(0, i + 1);

      return {
        day: arr[i].day,

        avg: Number(
          (slice.reduce((sum, d) => sum + d.score, 0) / slice.length).toFixed(
            2,
          ),
        ),
      };
    });
  }, [chartData]);

  /* =======================================================
     MOMENTUM
  ======================================================= */

  const momentum = useMemo(() => {
    return chartData.map((d, i, arr) => ({
      day: d.day,

      change: i === 0 ? 0 : Number((d.score - arr[i - 1].score).toFixed(1)),
    }));
  }, [chartData]);

  /* =======================================================
     KPI
  ======================================================= */

  const totalExpenses = useMemo(
    () => chartData.reduce((sum, d) => sum + d.expenses, 0),
    [chartData],
  );

  const avgScore = useMemo(() => {
    if (!weeklyLogs.length) return "—";

    return (
      weeklyLogs.reduce((sum, l) => sum + Number(l.score || 0), 0) /
      weeklyLogs.length
    ).toFixed(1);
  }, [weeklyLogs]);

  const bestDay = useMemo(() => {
    if (!chartData.length) {
      return {
        day: "—",
        score: 0,
      };
    }

    return chartData.reduce((best, d) => (d.score > best.score ? d : best));
  }, [chartData]);

  const habitStreak = useMemo(
    () =>
      chartData.filter((d) => d.coding || d.reading || d.learning || d.bible)
        .length,
    [chartData],
  );

  const totalProductivity = useMemo(
    () => chartData.reduce((sum, d) => sum + d.productivity, 0),
    [chartData],
  );

  /* =======================================================
     TAB CONFIG
  ======================================================= */

  const tabs = [
    {
      key: "performance" as const,
      label: "Performance",
      icon: <TrendingUp className="w-3.5 h-3.5" />,
    },
    {
      key: "habits" as const,
      label: "Habits",
      icon: <Dumbbell className="w-3.5 h-3.5" />,
    },
    {
      key: "focus" as const,
      label: "Focus",
      icon: <Zap className="w-3.5 h-3.5" />,
    },
  ];

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <LoadingScreen darkMode={darkMode} />;
  }

  /* =======================================================
     EMPTY
  ======================================================= */

  if (weeklyLogs.length === 0) {
    return <EmptyState darkMode={darkMode} />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className={`
        min-h-screen
        ${theme.pageBg}
        ${theme.primaryText}
        transition-colors duration-300
      `}
    >
      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      {darkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div
            className="
              absolute
              top-[-120px]
              left-[10%]
              w-[420px]
              h-[420px]
              bg-indigo-600/[0.07]
              rounded-full
              blur-[130px]
            "
          />

          <div
            className="
              absolute
              bottom-[10%]
              right-[5%]
              w-[360px]
              h-[360px]
              bg-violet-600/[0.06]
              rounded-full
              blur-[120px]
            "
          />
        </div>
      )}

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div
        className="
          relative
          max-w-6xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          py-6
          sm:py-10
          pb-28
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <header className="mb-7 sm:mb-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="
                    w-7 h-7
                    rounded-lg
                    bg-gradient-to-br
                    from-indigo-500
                    to-violet-500
                    flex items-center justify-center
                    shadow-sm
                  "
                >
                  <Brain className="w-3.5 h-3.5 text-white" />
                </div>

                <span
                  className="
                    text-[10px]
                    font-black
                    tracking-[0.25em]
                    uppercase
                    text-indigo-500
                  "
                >
                  Weekly Report
                </span>
              </div>

              <h1
                className={`
                  text-3xl
                  sm:text-5xl
                  font-black
                  tracking-[-0.04em]
                  ${theme.primaryText}
                `}
              >
                Your week.
              </h1>

              <p
                className={`
                  text-sm
                  sm:text-base
                  mt-2
                  max-w-md
                  leading-relaxed
                  ${theme.secondaryText}
                `}
              >
                A simple view of how your days are moving.
              </p>
            </div>

            {/* Theme indicator */}
            <div
              className={`
                hidden sm:flex
                items-center
                gap-2
                px-3
                py-2
                rounded-full
                border
                ${theme.controlBorder}
                ${theme.controlBg}
              `}
            >
              {darkMode ? (
                <Moon className="w-3.5 h-3.5 text-violet-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}

              <span
                className={`text-[10px] font-semibold ${theme.secondaryText}`}
              >
                {darkMode ? "Dark" : "Light"}
              </span>
            </div>
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2 mt-5">
            <CalendarDays className={`w-3.5 h-3.5 ${theme.mutedText}`} />

            <span className={`text-xs ${theme.mutedText}`}>
              {weeklyLogs.length} day
              {weeklyLogs.length !== 1 ? "s" : ""} of activity
            </span>

            <ChevronRight className={`w-3 h-3 ${theme.veryMutedText}`} />

            <span className={`text-xs ${theme.mutedText}`}>Latest week</span>
          </div>
        </header>

        {/* =================================================
            TOP SCORE SUMMARY
        ================================================= */}

        <div
          className={`
            rounded-3xl
            border
            p-5 sm:p-6
            mb-5
            ${theme.card}
            ${theme.cardHover}
          `}
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            <div>
              <p
                className={`text-[9px] uppercase tracking-[0.18em] font-semibold ${theme.mutedText}`}
              >
                Avg Score
              </p>

              <p
                className={`
                  text-3xl
                  sm:text-4xl
                  font-black
                  mt-1
                  ${theme.primaryText}
                `}
              >
                {avgScore}
                <span className={`text-sm font-medium ml-1 ${theme.mutedText}`}>
                  /10
                </span>
              </p>
            </div>

            <div>
              <p
                className={`text-[9px] uppercase tracking-[0.18em] font-semibold ${theme.mutedText}`}
              >
                Best Day
              </p>

              <p
                className="
                  text-lg
                  sm:text-xl
                  font-black
                  mt-2
                  text-indigo-500
                "
              >
                {bestDay.day}
              </p>

              <p className={`text-xs mt-0.5 ${theme.secondaryText}`}>
                Score {bestDay.score}/10
              </p>
            </div>

            <div>
              <p
                className={`text-[9px] uppercase tracking-[0.18em] font-semibold ${theme.mutedText}`}
              >
                Productivity
              </p>

              <p
                className="
                  text-lg
                  sm:text-xl
                  font-black
                  mt-2
                  text-violet-500
                "
              >
                {totalProductivity}
              </p>

              <p className={`text-xs mt-0.5 ${theme.secondaryText}`}>
                weekly points
              </p>
            </div>

            <div>
              <p
                className={`text-[9px] uppercase tracking-[0.18em] font-semibold ${theme.mutedText}`}
              >
                Expenses
              </p>

              <p
                className="
                  text-lg
                  sm:text-xl
                  font-black
                  mt-2
                  text-amber-500
                "
              >
                ₹{totalExpenses}
              </p>

              <p className={`text-xs mt-0.5 ${theme.secondaryText}`}>
                this week
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            KPI CARDS
        ================================================= */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-7">
          <StatCard
            darkMode={darkMode}
            icon={<Flame className="w-4 h-4" />}
            label="Avg Score"
            value={avgScore}
            sub="out of 10"
            color="from-indigo-500/10 to-transparent"
          />

          <StatCard
            darkMode={darkMode}
            icon={<Target className="w-4 h-4" />}
            label="Habit Days"
            value={habitStreak}
            sub="active days"
            color="from-cyan-500/10 to-transparent"
          />

          <StatCard
            darkMode={darkMode}
            icon={<Zap className="w-4 h-4" />}
            label="Productivity"
            value={totalProductivity}
            sub="total points"
            color="from-amber-500/10 to-transparent"
          />

          <StatCard
            darkMode={darkMode}
            icon={<Award className="w-4 h-4" />}
            label="Expenses"
            value={`₹${totalExpenses}`}
            sub="this week"
            color="from-rose-500/10 to-transparent"
          />
        </div>

        {/* =================================================
            TABS
        ================================================= */}

        <div
          className={`
            inline-flex
            items-center
            gap-1
            p-1
            rounded-2xl
            border
            mb-7
            ${theme.controlBorder}
            ${darkMode ? "bg-white/[0.035]" : "bg-slate-100"}
          `}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex
                  items-center
                  gap-2
                  px-4
                  sm:px-5
                  py-2.5
                  rounded-xl
                  text-xs
                  sm:text-sm
                  font-semibold
                  transition-all
                  duration-200
                  ${
                    active
                      ? darkMode
                        ? "bg-white text-slate-900 shadow-lg"
                        : "bg-slate-900 text-white shadow-md"
                      : darkMode
                        ? "text-gray-500 hover:text-gray-200"
                        : "text-slate-500 hover:text-slate-900"
                  }
                `}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* =================================================
            PERFORMANCE
        ================================================= */}

        {activeTab === "performance" && (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Score Trend */}
            <Card
              darkMode={darkMode}
              title="Daily Score"
              subtitle="Your performance across the week"
              icon={<TrendingUp className="w-4 h-4" />}
              span2
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData}>
                  <CartesianGrid stroke={theme.chartGrid} vertical={false} />

                  <XAxis
                    dataKey="day"
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke={theme.chartAxis}
                    domain={[0, 10]}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />

                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Score"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#6366f1",
                      strokeWidth: 2,
                      stroke: darkMode ? "#060910" : "#ffffff",
                    }}
                    activeDot={{
                      r: 6,
                      fill: "#818cf8",
                      strokeWidth: 0,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Improvement */}
            <Card
              darkMode={darkMode}
              title="Improvement Trend"
              subtitle="Rolling average"
              icon={<TrendingUp className="w-4 h-4" />}
            >
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={rolling}>
                  <defs>
                    <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#6366f1"
                        stopOpacity={0.28}
                      />

                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke={theme.chartGrid} vertical={false} />

                  <XAxis
                    dataKey="day"
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    domain={[0, 10]}
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />

                  <Area
                    type="monotone"
                    dataKey="avg"
                    name="Rolling Avg"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#avgGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Momentum */}
            <Card
              darkMode={darkMode}
              title="Score Momentum"
              subtitle="Change from previous day"
              icon={<Activity className="w-4 h-4" />}
            >
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={momentum}>
                  <CartesianGrid stroke={theme.chartGrid} vertical={false} />

                  <XAxis
                    dataKey="day"
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />

                  <Bar dataKey="change" name="Change" radius={[5, 5, 0, 0]}>
                    {momentum.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.change >= 0 ? "#22c55e" : "#ef4444"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Distribution */}
            <Card
              darkMode={darkMode}
              title="Score Distribution"
              subtitle="Quality of your days"
              icon={<BarChart3 className="w-4 h-4" />}
            >
              <div className="flex items-center justify-center gap-5">
                <PieChart width={160} height={160}>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={70}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {distribution.map((_, i) => (
                      <Cell key={i} fill={SCORE_COLORS[i]} />
                    ))}
                  </Pie>

                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                </PieChart>

                <div className="space-y-3">
                  {distribution.map((d, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          backgroundColor: SCORE_COLORS[i],
                        }}
                      />

                      <div>
                        <p
                          className={`text-xs font-semibold ${theme.primaryText}`}
                        >
                          {d.name}
                        </p>

                        <p className={`text-[10px] ${theme.mutedText}`}>
                          {d.value} day
                          {d.value !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Expenses */}
            <Card
              darkMode={darkMode}
              title="Daily Expenses"
              subtitle="Spending across the week"
              icon={<Target className="w-4 h-4" />}
              span2
            >
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={chartData}>
                  <CartesianGrid stroke={theme.chartGrid} vertical={false} />

                  <XAxis
                    dataKey="day"
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />

                  <Bar
                    dataKey="expenses"
                    name="₹ Spent"
                    radius={[6, 6, 0, 0]}
                    fill="#f59e0b"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* =================================================
            HABITS
        ================================================= */}

        {activeTab === "habits" && (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Radar */}
            <Card
              darkMode={darkMode}
              title="Habit Coverage"
              subtitle="Frequency across your week"
              icon={<Eye className="w-4 h-4" />}
            >
              <ResponsiveContainer width="100%" height={270}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke={theme.chartGrid} />

                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: theme.chartText,
                      fontSize: 10,
                    }}
                  />

                  <Radar
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />

                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>

            {/* Habit stack */}
            <Card
              darkMode={darkMode}
              title="Habit Stack"
              subtitle="Activity over the week"
              icon={<Dumbbell className="w-4 h-4" />}
            >
              <ResponsiveContainer width="100%" height={270}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="codeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={NEON_COLORS[0]}
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        stopColor={NEON_COLORS[0]}
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient id="readGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={NEON_COLORS[1]}
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        stopColor={NEON_COLORS[1]}
                        stopOpacity={0}
                      />
                    </linearGradient>

                    <linearGradient id="learnGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={NEON_COLORS[2]}
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="95%"
                        stopColor={NEON_COLORS[2]}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke={theme.chartGrid} vertical={false} />

                  <XAxis
                    dataKey="day"
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />

                  <Area
                    type="monotone"
                    dataKey="coding"
                    stackId="1"
                    stroke={NEON_COLORS[0]}
                    fill="url(#codeGrad)"
                    name="Coding"
                    strokeWidth={2}
                  />

                  <Area
                    type="monotone"
                    dataKey="reading"
                    stackId="1"
                    stroke={NEON_COLORS[1]}
                    fill="url(#readGrad)"
                    name="Reading"
                    strokeWidth={2}
                  />

                  <Area
                    type="monotone"
                    dataKey="learning"
                    stackId="1"
                    stroke={NEON_COLORS[2]}
                    fill="url(#learnGrad)"
                    name="CS Topics"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Habit table */}
            <Card
              darkMode={darkMode}
              title="Daily Habit Completion"
              subtitle="A quick view of your consistency"
              icon={<BookOpen className="w-4 h-4" />}
              span2
            >
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[620px]">
                  <thead>
                    <tr
                      className={`
                        text-[9px]
                        uppercase
                        tracking-[0.14em]
                        border-b
                        ${theme.border}
                        ${theme.mutedText}
                      `}
                    >
                      <th className="pb-3 px-2 text-left">Day</th>

                      <th className="pb-3 px-2 text-center">Bible</th>

                      <th className="pb-3 px-2 text-center">Book</th>

                      <th className="pb-3 px-2 text-center">CS</th>

                      <th className="pb-3 px-2 text-center">Coding</th>

                      <th className="pb-3 px-2 text-center">College</th>

                      <th className="pb-3 px-2 text-right">Score</th>
                    </tr>
                  </thead>

                  <tbody className={`divide-y ${theme.divider}`}>
                    {chartData.map((d, i) => (
                      <tr
                        key={i}
                        className={`
                          transition-colors
                          ${
                            darkMode
                              ? "hover:bg-white/[0.025]"
                              : "hover:bg-slate-50"
                          }
                        `}
                      >
                        <td
                          className={`
                            py-3
                            px-2
                            font-semibold
                            ${theme.primaryText}
                          `}
                        >
                          {d.day}
                        </td>

                        <td className="py-3 px-2 text-center">
                          {weeklyLogs[i]?.bibleReading ? (
                            <span className="text-indigo-500">✓</span>
                          ) : (
                            <span className={theme.veryMutedText}>—</span>
                          )}
                        </td>

                        <td className="py-3 px-2 text-center">
                          {d.reading ? (
                            <span className="text-blue-500">✓</span>
                          ) : (
                            <span className={theme.veryMutedText}>—</span>
                          )}
                        </td>

                        <td className="py-3 px-2 text-center">
                          {d.learning ? (
                            <span className="text-purple-500">✓</span>
                          ) : (
                            <span className={theme.veryMutedText}>—</span>
                          )}
                        </td>

                        <td className="py-3 px-2 text-center">
                          {d.coding ? (
                            <span className="text-green-500">✓</span>
                          ) : (
                            <span className={theme.veryMutedText}>—</span>
                          )}
                        </td>

                        <td className="py-3 px-2 text-center">
                          {weeklyLogs[i]?.collegeActivity ? (
                            <span className="text-cyan-500">✓</span>
                          ) : (
                            <span className={theme.veryMutedText}>—</span>
                          )}
                        </td>

                        <td className="py-3 px-2 text-right">
                          <span
                            className={`
                              font-black
                              ${
                                d.score >= 8
                                  ? "text-green-500"
                                  : d.score >= 5
                                    ? "text-amber-500"
                                    : "text-rose-500"
                              }
                            `}
                          >
                            {d.score}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* =================================================
            FOCUS
        ================================================= */}

        {activeTab === "focus" && (
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {/* Productivity */}
            <Card
              darkMode={darkMode}
              title="Productivity Index"
              subtitle="How your active habits add up"
              icon={<Zap className="w-4 h-4" />}
              span2
            >
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.35}
                      />

                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid stroke={theme.chartGrid} vertical={false} />

                  <XAxis
                    dataKey="day"
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />

                  <Area
                    type="monotone"
                    dataKey="productivity"
                    name="Productivity"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#prodGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Scatter */}
            <Card
              darkMode={darkMode}
              title="Productivity vs Score"
              subtitle="Relationship between effort and results"
              icon={<Activity className="w-4 h-4" />}
            >
              <ResponsiveContainer width="100%" height={220}>
                <ScatterChart>
                  <CartesianGrid stroke={theme.chartGrid} />

                  <XAxis
                    dataKey="productivity"
                    name="Productivity"
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    dataKey="score"
                    name="Score"
                    domain={[0, 10]}
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip
                    cursor={{
                      strokeDasharray: "3 3",
                    }}
                    content={<CustomTooltip darkMode={darkMode} />}
                  />

                  <Scatter data={chartData} fill="#6366f1" />
                </ScatterChart>
              </ResponsiveContainer>
            </Card>

            {/* Coding */}
            <Card
              darkMode={darkMode}
              title="Coding Activity"
              subtitle="Consistency across the week"
              icon={<Code2 className="w-4 h-4" />}
            >
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData}>
                  <CartesianGrid stroke={theme.chartGrid} vertical={false} />

                  <XAxis
                    dataKey="day"
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    domain={[0, 1]}
                    ticks={[0, 1]}
                    stroke={theme.chartAxis}
                    tick={{
                      fontSize: 10,
                      fill: theme.chartText,
                    }}
                    tickLine={false}
                    axisLine={false}
                  />

                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />

                  <Bar dataKey="coding" name="Coded" radius={[6, 6, 0, 0]}>
                    {chartData.map((d, i) => (
                      <Cell
                        key={i}
                        fill={
                          d.coding
                            ? "#22c55e"
                            : darkMode
                              ? "#1f2937"
                              : "#e2e8f0"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* =================================================
            ACTIVITY HEATMAP
        ================================================= */}

        <div
          className={`
            mt-5
            rounded-2xl
            sm:rounded-3xl
            border
            p-5 sm:p-6
            ${theme.card}
          `}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div
                className="
                  w-8 h-8
                  rounded-xl
                  bg-indigo-500/10
                  border border-indigo-500/15
                  flex items-center justify-center
                "
              >
                <Moon className="w-4 h-4 text-indigo-500" />
              </div>

              <div>
                <h3 className={`font-bold text-sm ${theme.primaryText}`}>
                  Weekly Activity
                </h3>

                <p className={`text-[10px] ${theme.secondaryText}`}>
                  Daily score heatmap
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            {weeklyLogs.map((l, i) => {
              const score = Number(l.score || 0);

              const color =
                score >= 8
                  ? "bg-green-500"
                  : score >= 6
                    ? "bg-indigo-500"
                    : score >= 4
                      ? "bg-amber-400"
                      : "bg-rose-500";

              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className={`
                      w-11 h-11
                      sm:w-12 sm:h-12
                      rounded-xl
                      ${color}
                      flex
                      items-center
                      justify-center
                      font-black
                      text-white
                      text-sm
                      shadow-sm
                    `}
                  >
                    {score}
                  </div>

                  <span className={`text-[9px] font-medium ${theme.mutedText}`}>
                    {new Date(l.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-4 mt-5">
            {[
              ["bg-rose-500", "<4"],
              ["bg-amber-400", "4–5"],
              ["bg-indigo-500", "6–7"],
              ["bg-green-500", "8+"],
            ].map(([c, label]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded ${c}`} />

                <span className={`text-[9px] ${theme.mutedText}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================
            AI SUMMARY
        ================================================= */}

        <div
          className={`
            mt-5
            rounded-2xl
            sm:rounded-3xl
            border
            p-5 sm:p-6
            ${
              darkMode
                ? "bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-transparent border-indigo-500/20"
                : "bg-gradient-to-br from-indigo-50 via-violet-50 to-white border-indigo-100"
            }
          `}
        >
          <div className="flex items-start gap-4">
            <div
              className="
                w-10 h-10
                rounded-xl
                bg-indigo-500
                flex items-center justify-center
                shrink-0
                shadow-lg
                shadow-indigo-500/20
              "
            >
              <Brain className="w-5 h-5 text-white" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-black text-sm ${theme.primaryText}`}>
                  Weekly Intelligence
                </h3>

                <span
                  className="
                    text-[8px]
                    px-2
                    py-0.5
                    rounded-full
                    bg-indigo-500/10
                    text-indigo-500
                    border border-indigo-500/15
                    uppercase
                    tracking-wider
                  "
                >
                  AI
                </span>
              </div>

              <p
                className={`
                  text-sm
                  leading-relaxed
                  ${theme.secondaryText}
                `}
              >
                {weeklyLogs[weeklyLogs.length - 1]?.finalSummary ||
                  `Over the past ${weeklyLogs.length} day${
                    weeklyLogs.length !== 1 ? "s" : ""
                  }, your average score is ${avgScore}/10 with a productivity index of ${totalProductivity} points. ${
                    habitStreak > 4
                      ? "Strong habit consistency this week 💪"
                      : "There is room to build more daily habits."
                  } Keep logging daily for deeper trend insights.`}
              </p>
            </div>
          </div>
        </div>

        {/* =================================================
            FOOTER INSIGHT
        ================================================= */}

        <div className="flex items-center justify-center gap-2 mt-7">
          <div
            className={`h-px w-10 ${darkMode ? "bg-white/10" : "bg-slate-200"}`}
          />

          <span
            className={`
              text-[9px]
              uppercase
              tracking-[0.25em]
              ${theme.veryMutedText}
            `}
          >
            Keep moving forward
          </span>

          <div
            className={`h-px w-10 ${darkMode ? "bg-white/10" : "bg-slate-200"}`}
          />
        </div>
      </div>
    </div>
  );
}
