import { useEffect, useState, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
type Props = { userId: number };

const CATEGORIES = [
  { key: "bibleReading", label: "Bible", icon: "📖", color: "#818cf8" },
  { key: "bookReading", label: "Books", icon: "📚", color: "#a78bfa" },
  { key: "codingWork", label: "Coding", icon: "💻", color: "#34d399" },
  { key: "csTopic", label: "CS", icon: "🧠", color: "#22d3ee" },
  { key: "collegeActivity", label: "College", icon: "🏫", color: "#60a5fa" },
  { key: "diary", label: "Diary", icon: "📔", color: "#fbbf24" },
  { key: "movie", label: "Movie", icon: "🎬", color: "#f472b6" },
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

function getScoreColor(score: number): string {
  if (score === 0) return "rgba(255,255,255,0.04)";
  if (score >= 9) return "#10b981";
  if (score >= 7) return "#34d399";
  if (score >= 5) return "#f59e0b";
  if (score >= 3) return "#f97316";
  return "#f43f5e";
}

function getScoreGlow(score: number): string {
  if (score >= 9) return "0 0 12px #10b98155";
  if (score >= 7) return "0 0 10px #34d39940";
  if (score >= 5) return "0 0 10px #f59e0b40";
  if (score >= 3) return "0 0 10px #f9731640";
  if (score > 0) return "0 0 10px #f43f5e40";
  return "none";
}

function getScoreLabel(score: number) {
  if (score >= 9) return "Legendary";
  if (score >= 7) return "Great";
  if (score >= 5) return "Good";
  if (score >= 3) return "Low";
  if (score > 0) return "Poor";
  return "No log";
}

export default function CalendarView({ userId }: Props) {
  const { darkMode } = useTheme();

  // Theme-aware class helpers
  const bg = darkMode ? "bg-[#060910]" : "bg-slate-100";

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"month" | "heatmap" | "breakdown">(
    "month",
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://ai-life-tracker.onrender.com/api/daily")
      .then((r) => r.json())
      .then((data) => {
        const userLogs = data.filter((l: any) => l.user?.id === userId);
        setLogs(userLogs);
        setLoading(false);
      });
  }, [userId]);

  const logMap = useMemo(() => {
    const map: Record<string, any> = {};
    logs.forEach((l) => {
      const key = new Date(l.date).toISOString().split("T")[0];
      map[key] = l;
    });
    return map;
  }, [logs]);

  // Build calendar grid for current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (null | { date: Date; key: string; log: any })[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const key = date.toISOString().split("T")[0];
      days.push({ date, key, log: logMap[key] || null });
    }
    return days;
  }, [currentDate, logMap]);

  // Heatmap — last 12 months
  const heatmapData = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setMonth(start.getMonth() - 11);
    start.setDate(1);
    const weeks: (null | { date: Date; key: string; log: any })[][] = [];
    let current = new Date(start);
    // Pad to Sunday
    while (current.getDay() !== 0) current.setDate(current.getDate() - 1);
    let week: (null | { date: Date; key: string; log: any })[] = [];
    while (current <= today) {
      const key = current.toISOString().split("T")[0];
      week.push({ date: new Date(current), key, log: logMap[key] || null });
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
      current.setDate(current.getDate() + 1);
    }
    if (week.length) weeks.push(week);
    return weeks;
  }, [logMap]);

  // Score breakdown by category
  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const daysLogged = logs.filter((l) => l[cat.key]).length;
      const pct =
        logs.length > 0 ? Math.round((daysLogged / logs.length) * 100) : 0;
      return { ...cat, daysLogged, pct };
    });
  }, [logs]);

  // Monthly stats
  const monthLogs = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth();
    return logs.filter((l) => {
      const d = new Date(l.date);
      return d.getFullYear() === y && d.getMonth() === m;
    });
  }, [logs, currentDate]);

  const monthAvg =
    monthLogs.length > 0
      ? (
          monthLogs.reduce((s, l) => s + (l.score || 0), 0) / monthLogs.length
        ).toFixed(1)
      : "—";

  const bestInMonth = monthLogs.reduce(
    (b, l) => (l.score > (b?.score || 0) ? l : b),
    null as any,
  );
  const monthConsistency =
    logs.length > 0
      ? Math.round(
          (monthLogs.filter((l) => l.score >= 6).length /
            new Date(
              currentDate.getFullYear(),
              currentDate.getMonth() + 1,
              0,
            ).getDate()) *
            100,
        )
      : 0;

  if (loading)
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="{text} text-xs tracking-[0.25em] uppercase">
            Loading calendar
          </p>
        </div>
      </div>
    );

  return (
    <div
      className="min-h-screen ${bg} {textMuted}"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-violet-700/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] bg-cyan-700/5 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] left-[-5%] w-[300px] h-[300px] bg-indigo-700/4 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.35em] text-violet-400 uppercase mb-1 font-medium">
              Life Calendar
            </p>
            <h1 className="text-4xl font-black tracking-tight">
              Your Days,
              <br />
              <span className="text-violet-400">Visualized.</span>
            </h1>
            <p className="{text} text-sm mt-2">
              {logs.length} days recorded · Score your story
            </p>
          </div>

          {/* View Switcher */}
          <div className="flex gap-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-1">
            {(["month", "heatmap", "breakdown"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setViewMode(v)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200 ${
                  viewMode === v
                    ? "bg-violet-500 {textMuted} shadow-lg shadow-violet-500/30"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {v === "month"
                  ? "📅 Month"
                  : v === "heatmap"
                    ? "🔥 Heatmap"
                    : "📊 Breakdown"}
              </button>
            ))}
          </div>
        </div>

        {/* ── MONTH VIEW ── */}
        {viewMode === "month" && (
          <div className="space-y-6">
            {/* Month nav + stats */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition text-gray-400 hover:{textMuted}"
                >
                  ←
                </button>
                <h2 className="text-xl font-black w-44 text-center">
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() =>
                    setCurrentDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition text-gray-400 hover:{textMuted}"
                >
                  →
                </button>
              </div>

              <div className="flex gap-3">
                {[
                  {
                    label: "Avg Score",
                    value: monthAvg,
                    color: "text-violet-400",
                  },
                  {
                    label: "Days Logged",
                    value: monthLogs.length,
                    color: "text-cyan-400",
                  },
                  {
                    label: "Consistency",
                    value: `${monthConsistency}%`,
                    color: "text-emerald-400",
                  },
                  {
                    label: "Best",
                    value: bestInMonth?.score || "—",
                    color: "text-amber-400",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-3 py-2 text-center"
                  >
                    <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[9px] {text} uppercase tracking-wider">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Score legend */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-[10px] {text} uppercase tracking-wider">
                Score legend:
              </span>
              {[
                { label: "9-10", color: "#10b981" },
                { label: "7-8", color: "#34d399" },
                { label: "5-6", color: "#f59e0b" },
                { label: "3-4", color: "#f97316" },
                { label: "1-2", color: "#f43f5e" },
                { label: "No log", color: "rgba(255,255,255,0.08)" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ background: l.color }}
                  />
                  <span className="text-[10px] text-gray-500">{l.label}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-3">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center text-[10px] {text} uppercase tracking-wider font-semibold py-2"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, i) => {
                  if (!day) return <div key={`empty-${i}`} />;
                  const score = day.log?.score || 0;
                  const isToday =
                    day.key === new Date().toISOString().split("T")[0];
                  const isSelected = selectedDay?.key === day.key;

                  return (
                    <button
                      key={day.key}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 hover:scale-105 group ${
                        isSelected ? "ring-2 ring-white/40 scale-105" : ""
                      }`}
                      style={{
                        background: day.log
                          ? getScoreColor(score) + "33"
                          : "rgba(255,255,255,0.03)",
                        border: `1px solid ${day.log ? getScoreColor(score) + "55" : "rgba(255,255,255,0.06)"}`,
                        boxShadow: day.log ? getScoreGlow(score) : "none",
                      }}
                    >
                      <span
                        className={`text-xs font-bold ${isToday ? "text-violet-300" : day.log ? "{textMuted}" : "{text}"}`}
                      >
                        {day.date.getDate()}
                      </span>
                      {day.log && (
                        <span
                          className="text-[9px] font-black"
                          style={{ color: getScoreColor(score) }}
                        >
                          {score}
                        </span>
                      )}
                      {isToday && (
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet-400" />
                      )}

                      {/* Hover tooltip */}
                      {day.log && (
                        <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                          <div className="bg-[#0d1117] border border-white/10 rounded-xl px-3 py-2 text-center whitespace-nowrap shadow-2xl">
                            <p className="text-[10px] text-gray-500">
                              {day.date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p
                              className="text-sm font-black"
                              style={{ color: getScoreColor(score) }}
                            >
                              {score}/10
                            </p>
                            <p className="text-[9px] {text}">
                              {getScoreLabel(score)}
                            </p>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Day Detail */}
            {selectedDay?.log && (
              <div
                className="rounded-3xl p-6 border backdrop-blur-sm space-y-5 animate-[slideUp_0.3s_ease]"
                style={{
                  background: `${getScoreColor(selectedDay.log.score)}11`,
                  borderColor: `${getScoreColor(selectedDay.log.score)}30`,
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {selectedDay.date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-5xl font-black"
                        style={{ color: getScoreColor(selectedDay.log.score) }}
                      >
                        {selectedDay.log.score}
                      </span>
                      <span className="{text} text-lg">/10</span>
                      <span
                        className="text-sm font-semibold px-2 py-0.5 rounded-lg"
                        style={{
                          background: `${getScoreColor(selectedDay.log.score)}22`,
                          color: getScoreColor(selectedDay.log.score),
                        }}
                      >
                        {getScoreLabel(selectedDay.log.score)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:{textMuted} transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Activity pills */}
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter((c) => selectedDay.log[c.key]).map((c) => (
                    <span
                      key={c.key}
                      className="text-xs px-3 py-1 rounded-full border font-medium"
                      style={{
                        background: `${c.color}15`,
                        borderColor: `${c.color}30`,
                        color: c.color,
                      }}
                    >
                      {c.icon} {c.label}
                    </span>
                  ))}
                </div>

                {/* Summary & Motivation */}
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedDay.log.finalSummary && (
                    <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.06]">
                      <p className="text-[10px] text-indigo-400 uppercase tracking-wider mb-2">
                        🧠 AI Summary
                      </p>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {selectedDay.log.finalSummary}
                      </p>
                    </div>
                  )}
                  {selectedDay.log.motivation && (
                    <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.06]">
                      <p className="text-[10px] text-amber-400 uppercase tracking-wider mb-2">
                        🔥 Motivation
                      </p>
                      <p className="text-gray-300 text-xs leading-relaxed italic">
                        {selectedDay.log.motivation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── HEATMAP VIEW ── */}
        {viewMode === "heatmap" && (
          <div className="space-y-6">
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm overflow-x-auto">
              <h2 className="text-base font-bold {textMuted} mb-1">
                Year Activity Heatmap
              </h2>
              <p className="text-xs {text} mb-6">
                Last 12 months · each square = 1 day
              </p>

              {/* Month labels */}
              <div className="flex gap-1 mb-2 ml-8">
                {heatmapData
                  .filter((_, i) => i % 4 === 0)
                  .map((week, i) => (
                    <div
                      key={i}
                      className="text-[9px] {text} w-[calc(100%/13)]"
                    >
                      {week[0] && MONTHS[week[0].date.getMonth()].slice(0, 3)}
                    </div>
                  ))}
              </div>

              <div className="flex gap-1">
                {/* Day labels */}
                <div className="flex flex-col gap-1 mr-2">
                  {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                    <div
                      key={i}
                      className="text-[9px] {text} h-3 flex items-center"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Grid */}
                <div className="flex gap-1">
                  {heatmapData.map((week, wi) => (
                    <div key={wi} className="flex flex-col gap-1">
                      {week.map((day, di) => (
                        <button
                          key={di}
                          onClick={() => day && setSelectedDay(day)}
                          className="w-3 h-3 rounded-sm transition-all duration-150 hover:scale-125 hover:z-10 relative group"
                          style={{
                            background: day?.log
                              ? getScoreColor(day.log.score)
                              : "rgba(255,255,255,0.05)",
                            boxShadow: day?.log
                              ? getScoreGlow(day.log.score)
                              : "none",
                          }}
                          title={
                            day
                              ? `${day.date.toLocaleDateString()} — Score: ${day.log?.score ?? "No log"}`
                              : ""
                          }
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-2 mt-5">
                <span className="text-[10px] {text}">Less</span>
                {[0, 2, 4, 6, 8, 10].map((s) => (
                  <div
                    key={s}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      background:
                        s === 0 ? "rgba(255,255,255,0.05)" : getScoreColor(s),
                    }}
                  />
                ))}
                <span className="text-[10px] {text}">More</span>
              </div>
            </div>

            {/* Streak calendar */}
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  label: "Total Days Logged",
                  value: logs.length,
                  icon: "📋",
                  color: "text-indigo-400",
                },
                {
                  label: "Best Score Ever",
                  value:
                    logs.length > 0
                      ? Math.max(...logs.map((l) => l.score || 0))
                      : "—",
                  icon: "🏆",
                  color: "text-amber-400",
                },
                {
                  label: "Active Months",
                  value: new Set(
                    logs.map(
                      (l) =>
                        `${new Date(l.date).getFullYear()}-${new Date(l.date).getMonth()}`,
                    ),
                  ).size,
                  icon: "📅",
                  color: "text-violet-400",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4"
                >
                  <span className="text-3xl">{s.icon}</span>
                  <div>
                    <p className={`text-3xl font-black ${s.color}`}>
                      {s.value}
                    </p>
                    <p className="text-[10px] {text} uppercase tracking-wider">
                      {s.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BREAKDOWN VIEW ── */}
        {viewMode === "breakdown" && (
          <div className="space-y-6">
            {/* Overall score distribution */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
              <h2 className="text-base font-bold mb-1">Score Distribution</h2>
              <p className="text-xs {text} mb-6">
                How often you hit each score band
              </p>
              <div className="space-y-3">
                {[
                  {
                    label: "Legendary (9-10)",
                    min: 9,
                    max: 10,
                    color: "#10b981",
                  },
                  { label: "Great (7-8)", min: 7, max: 8, color: "#34d399" },
                  { label: "Good (5-6)", min: 5, max: 6, color: "#f59e0b" },
                  { label: "Low (3-4)", min: 3, max: 4, color: "#f97316" },
                  { label: "Poor (1-2)", min: 1, max: 2, color: "#f43f5e" },
                ].map((band) => {
                  const count = logs.filter(
                    (l) =>
                      (l.score || 0) >= band.min && (l.score || 0) <= band.max,
                  ).length;
                  const pct =
                    logs.length > 0
                      ? Math.round((count / logs.length) * 100)
                      : 0;
                  return (
                    <div key={band.label} className="flex items-center gap-4">
                      <span className="text-xs text-gray-500 w-36">
                        {band.label}
                      </span>
                      <div className="flex-1 h-6 bg-white/[0.04] rounded-lg overflow-hidden">
                        <div
                          className="h-full rounded-lg flex items-center justify-end pr-3 transition-all duration-1000"
                          style={{
                            width: `${Math.max(pct, pct > 0 ? 5 : 0)}%`,
                            background: `${band.color}55`,
                            borderRight: `2px solid ${band.color}`,
                          }}
                        >
                          {pct > 0 && (
                            <span
                              className="text-[10px] font-bold"
                              style={{ color: band.color }}
                            >
                              {pct}%
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs {text} w-8 text-right">
                        {count}d
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category coverage */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
              <h2 className="text-base font-bold mb-1">Category Coverage</h2>
              <p className="text-xs {text} mb-6">
                Days each category was active
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {categoryStats.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === cat.key ? null : cat.key,
                      )
                    }
                    className={`text-left p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] ${
                      selectedCategory === cat.key ? "ring-2 ring-white/20" : ""
                    }`}
                    style={{
                      background: `${cat.color}10`,
                      borderColor:
                        selectedCategory === cat.key
                          ? cat.color + "60"
                          : cat.color + "25",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="text-sm font-bold"
                        style={{ color: cat.color }}
                      >
                        {cat.icon} {cat.label}
                      </span>
                      <span className="text-lg font-black {textMuted}">
                        {cat.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${cat.pct}%`, background: cat.color }}
                      />
                    </div>
                    <p className="text-[10px] {text} mt-2">
                      {cat.daysLogged} of {logs.length} days
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Day-of-week patterns */}
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
              <h2 className="text-base font-bold mb-1">Day-of-Week Pattern</h2>
              <p className="text-xs {text} mb-6">
                Your average score per weekday
              </p>
              <div className="flex items-end justify-around gap-2 h-32">
                {WEEKDAYS.map((day, di) => {
                  const dayLogs = logs.filter(
                    (l) => new Date(l.date).getDay() === di,
                  );
                  const avg =
                    dayLogs.length > 0
                      ? dayLogs.reduce((s, l) => s + (l.score || 0), 0) /
                        dayLogs.length
                      : 0;
                  const heightPct = (avg / 10) * 100;
                  const col = getScoreColor(avg);
                  return (
                    <div
                      key={day}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      {avg > 0 && (
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: col }}
                        >
                          {avg.toFixed(1)}
                        </span>
                      )}
                      <div
                        className="w-full relative"
                        style={{ height: "80px" }}
                      >
                        <div
                          className="absolute bottom-0 w-full rounded-t-lg transition-all duration-700"
                          style={{
                            height: `${Math.max(heightPct, avg > 0 ? 8 : 0)}%`,
                            background: `${col}25`,
                            border: `1px solid ${col}40`,
                            borderBottom: "none",
                          }}
                        />
                      </div>
                      <span className="text-[9px] {text}">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
