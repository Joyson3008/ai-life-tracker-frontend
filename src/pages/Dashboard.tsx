import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

type Props = { userId: number };

export default function Dashboard({ userId }: Props) {
  const { darkMode } = useTheme();

  // Theme-aware class helpers
  const bg = darkMode ? "bg-[#060910]" : "bg-slate-100";
  const text = darkMode ? "{textMuted} " : "text-slate-900";

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [activeReview, setActiveReview] = useState<string | null>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    fetch("https://ai-life-tracker.onrender.com/api/daily")
      .then((res) => res.json())
      .then((data) => {
        const userLogs = data
          .filter((log: any) => log.user?.id === userId)
          .sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          );
        setLogs(userLogs);
        setLoading(false);
      });
  }, [userId]);

  const latest = logs[logs.length - 1];
  const prev = logs[logs.length - 2];

  // ── Stats ──
  const avgScore =
    logs.length > 0
      ? logs.reduce((s, l) => s + (l.score || 0), 0) / logs.length
      : 0;

  const weekLogs = logs.slice(-7);
  const weekAvg =
    weekLogs.length > 0
      ? weekLogs.reduce((s, l) => s + (l.score || 0), 0) / weekLogs.length
      : 0;

  const bestDay = logs.reduce(
    (best, l) => (l.score > (best?.score || 0) ? l : best),
    null as any,
  );
  const worstDay = logs.reduce(
    (worst, l) => ((l.score || 0) < (worst?.score ?? 999) ? l : worst),
    null as any,
  );

  const scoreDelta =
    latest && prev ? (latest.score || 0) - (prev.score || 0) : 0;

  const streak = (() => {
    let count = 0;
    for (let i = logs.length - 1; i >= 0; i--) {
      if ((logs[i].score || 0) >= 6) count++;
      else break;
    }
    return count;
  })();

  const consistency =
    logs.length > 0
      ? Math.round(
          (logs.filter((l) => (l.score || 0) >= 6).length / logs.length) * 100,
        )
      : 0;

  // ── Chart data ──
  const trendData = logs.slice(-14).map((log) => ({
    date: new Date(log.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    score: log.score || 0,
  }));

  const weekData = weekLogs.map((log) => ({
    day: new Date(log.date).toLocaleDateString("en-US", { weekday: "short" }),
    score: log.score || 0,
  }));

  // ── AI Review sections ──
  const reviews = [
    { key: "bibleReview", label: "📖 Bible", color: "#818cf8" },
    { key: "bookReview", label: "📚 Book", color: "#a78bfa" },
    { key: "codingReview", label: "💻 Coding", color: "#34d399" },
    { key: "csTopicReview", label: "🧠 CS Topic", color: "#22d3ee" },
    { key: "collegeReview", label: "🏫 College", color: "#60a5fa" },
    { key: "diaryReview", label: "📔 Diary", color: "#fbbf24" },
    { key: "expensesReview", label: "💰 Expenses", color: "#f59e0b" },
    { key: "movieReview", label: "🎬 Movie", color: "#f472b6" },
    { key: "phoneUsageReview", label: "📱 Phone", color: "#fb7185" },
  ];

  // ── Score ring ──
  const scoreVal = latest?.score || 0;
  const circumference = 2 * Math.PI * 52;
  const strokeDash = (((scoreVal / 10) * 100) / 100) * circumference;

  const getScoreColor = (s: number) =>
    s >= 8 ? "#10b981" : s >= 5 ? "#f59e0b" : "#f43f5e";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-xs text-black-500 mb-1">{label}</p>
          <p
            className="text-base font-bold"
            style={{ color: getScoreColor(payload[0].value) }}
          >
            ⭐ {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-gray-600 text-xs tracking-[0.25em] uppercase">
            Loading dashboard
          </p>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-5xl">🚀</p>
          <h2 className="text-xl font-bold {textMuted} ">No logs yet</h2>
          <p className="text-gray-600 text-sm">
            Start tracking your day to see your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060910] {textMuted} ">
      <div
        className={`min-h-screen ${bg} ${text} transition-colors duration-300`}
      >
        {/* ── Ambient glow ── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-80px] left-[15%] w-[500px] h-[500px] bg-indigo-700/7 rounded-full blur-[140px]" />
          <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-violet-700/6 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[-5%] w-[300px] h-[300px] bg-cyan-700/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-8">
          {/* ── HEADER ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.3em] text-indigo-400 uppercase mb-1">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h1 className="text-4xl font-black tracking-tight">
                {greeting} <span className="text-indigo-400">👋</span>
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {logs.length} days tracked ·{" "}
                {streak > 0
                  ? `🔥 ${streak}-day streak`
                  : "Start your streak today"}
              </p>
            </div>

            {scoreDelta !== 0 && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-semibold ${
                  scoreDelta > 0
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                }`}
              >
                {scoreDelta > 0 ? "↑" : "↓"} {Math.abs(scoreDelta)} pts vs
                yesterday
              </div>
            )}
          </div>

          {/* ── HERO ROW: Score ring + Stats ── */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {/* Score ring */}
            <div className="md:col-span-2 bg-white/[0.03] border border-white/[0.07] rounded-3xl p-7 flex flex-col items-center justify-center gap-4 backdrop-blur-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
              <p className="text-xs tracking-[0.25em] text-gray-500 uppercase">
                Today's Score
              </p>
              <div className="relative w-36 h-36">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#ffffff08"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke={getScoreColor(scoreVal)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${strokeDash} ${circumference}`}
                    style={{
                      transition:
                        "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-4xl font-black"
                    style={{ color: getScoreColor(scoreVal) }}
                  >
                    {scoreVal}
                  </span>
                  <span className="text-xs text-gray-600">/ 10</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 text-center">
                {new Date(latest?.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Stat grid */}
            <div className="md:col-span-3 grid grid-cols-2 gap-4">
              {[
                {
                  label: "Weekly Avg",
                  value: weekAvg.toFixed(1),
                  sub: "Last 7 days",
                  icon: "📅",
                  color: "text-indigo-400",
                },
                {
                  label: "All-time Avg",
                  value: avgScore.toFixed(1),
                  sub: `${logs.length} entries`,
                  icon: "📊",
                  color: "text-violet-400",
                },
                {
                  label: "Best Day",
                  value: bestDay?.score || "—",
                  sub: bestDay
                    ? new Date(bestDay.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "",
                  icon: "🏆",
                  color: "text-emerald-400",
                },
                {
                  label: "Worst Day",
                  value: worstDay?.score || "—",
                  sub: worstDay
                    ? new Date(worstDay.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "",
                  icon: "📉",
                  color: "text-rose-400",
                },
                {
                  label: "Consistency",
                  value: `${consistency}%`,
                  sub: "Days scored ≥ 6",
                  icon: "🎯",
                  color: "text-cyan-400",
                },
                {
                  label: "Streak",
                  value: streak,
                  sub: streak > 0 ? "days in a row 🔥" : "Start today",
                  icon: "⚡",
                  color: "text-amber-400",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.05] hover:border-white/10 transition-all"
                >
                  <span className="text-xl">{stat.icon}</span>
                  <p className={`text-2xl font-black mt-2 ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className="text-[10px] text-gray-700 mt-0.5">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── SCORE TREND CHART ── */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="text-base font-bold {textMuted} ">
                  Score Trend
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Last 14 entries · avg {avgScore.toFixed(1)} dashed
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-indigo-400 inline-block rounded" />
                  Score
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-px bg-white/20 inline-block border-dashed border-t border-white/30" />
                  Avg
                </span>
              </div>
            </div>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#6366f1"
                        stopOpacity={0.25}
                      />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff06" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#ffffff10"
                    tick={{ fontSize: 10, fill: "#4b5563" }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#ffffff08"
                    tick={{ fontSize: 10, fill: "#4b5563" }}
                    domain={[0, 10]}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine
                    y={parseFloat(avgScore.toFixed(1))}
                    stroke="#ffffff18"
                    strokeDasharray="5 4"
                    strokeWidth={1.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#trendGrad)"
                    dot={{ r: 3.5, fill: "#6366f1", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#a5b4fc", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── WEEK SPARKLINE BARS ── */}
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
            <h2 className="text-base font-bold {textMuted}  mb-1">This Week</h2>
            <p className="text-xs text-gray-600 mb-5">
              Daily scores · {weekAvg.toFixed(1)} avg
            </p>
            <div className="flex items-end justify-between gap-2 h-24">
              {weekData.length > 0 ? (
                weekData.map((d, i) => {
                  const heightPct = ((d.score || 0) / 10) * 100;
                  const col =
                    d.score >= 8
                      ? "#10b981"
                      : d.score >= 5
                        ? "#f59e0b"
                        : "#f43f5e";
                  return (
                    <div
                      key={i}
                      className="flex-1 flex flex-col items-center gap-1.5"
                    >
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: col }}
                      >
                        {d.score}
                      </span>
                      <div
                        className="w-full rounded-t-lg relative"
                        style={{ height: "64px" }}
                      >
                        <div
                          className="absolute bottom-0 w-full rounded-t-lg transition-all duration-700"
                          style={{
                            height: `${Math.max(heightPct, 8)}%`,
                            background: `${col}28`,
                            border: `1px solid ${col}45`,
                            borderBottom: "none",
                          }}
                        />
                      </div>
                      <span className="text-[9px] text-gray-600">{d.day}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-600 text-sm w-full text-center">
                  No data this week
                </p>
              )}
            </div>
          </div>

          {/* ── MOTIVATION + SUMMARY ── */}
          <div className="grid md:grid-cols-2 gap-5">
            {latest?.motivation && (
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-5 text-5xl opacity-10 select-none">
                  🔥
                </div>
                <p className="text-xs tracking-[0.2em] text-amber-400 uppercase mb-3">
                  Daily Motivation
                </p>
                <p className="text-gray-300 text-sm leading-relaxed italic">
                  "{latest.motivation}"
                </p>
              </div>
            )}
            {latest?.finalSummary && (
              <div className="bg-gradient-to-br from-indigo-500/10 to-violet-500/5 border border-indigo-500/20 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-5 text-5xl opacity-10 select-none">
                  🧠
                </div>
                <p className="text-xs tracking-[0.2em] text-indigo-400 uppercase mb-3">
                  AI Summary
                </p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {latest.finalSummary}
                </p>
              </div>
            )}
          </div>

          {/* ── AI REVIEW CARDS ── */}
          <div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-base font-bold {textMuted} ">
                  Latest AI Reviews
                </h2>
                <p className="text-xs text-gray-600 mt-0.5">
                  Tap any card to expand
                </p>
              </div>
              <span className="text-xs text-gray-600">
                {latest?.date &&
                  new Date(latest.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {reviews.map(({ key, label, color }) => {
                const text = latest?.[key];
                if (!text) return null;
                const isOpen = activeReview === key;
                return (
                  <div
                    key={key}
                    onClick={() => setActiveReview(isOpen ? null : key)}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 cursor-pointer hover:bg-white/[0.05] hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold" style={{ color }}>
                        {label}
                      </span>
                      <span
                        className="text-gray-600 text-xs inline-block transition-transform duration-300"
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                      >
                        ↓
                      </span>
                    </div>
                    <p
                      className={`text-gray-500 text-xs leading-relaxed transition-all duration-300 ${
                        isOpen ? "" : "line-clamp-2"
                      }`}
                    >
                      {text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── BEST vs WORST ── */}
          {bestDay && worstDay && bestDay.id !== worstDay.id && (
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-5">
                <p className="text-xs text-emerald-400 uppercase tracking-wider mb-3">
                  🏆 Best Day
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-black text-emerald-400">
                    {bestDay.score}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {new Date(bestDay.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {bestDay.finalSummary && (
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                    {bestDay.finalSummary}
                  </p>
                )}
              </div>

              <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl p-5">
                <p className="text-xs text-rose-400 uppercase tracking-wider mb-3">
                  📉 Worst Day
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl font-black text-rose-400">
                    {worstDay.score}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {new Date(worstDay.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                {worstDay.finalSummary && (
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
                    {worstDay.finalSummary}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
