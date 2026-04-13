import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  BarChart,
  Bar,
  Cell,
} from "recharts";

type Props = { userId: number };

function History({ userId }: Props) {
  const { darkMode } = useTheme();

  // Theme-aware class helpers
  const bg = darkMode ? "bg-[#060910]" : "bg-slate-100";

  const text = darkMode ? "{textMuted}" : "text-slate-900";

  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"timeline" | "analytics">(
    "timeline",
  );

  useEffect(() => {
    fetch("https://ai-life-tracker.onrender.com/api/daily")
      .then((res) => res.json())
      .then((data) => {
        const userLogs = data.filter((log: any) => log.user?.id === userId);
        setLogs(userLogs.reverse());
        setLoading(false);
      });
  }, [userId]);

  const filteredLogs = logs.filter((log) =>
    new Date(log.date)
      .toLocaleDateString()
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400";
    if (score >= 5) return "text-amber-400";
    return "text-rose-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8)
      return "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30";
    if (score >= 5)
      return "from-amber-500/20 to-amber-500/5 border-amber-500/30";
    return "from-rose-500/20 to-rose-500/5 border-rose-500/30";
  };

  const getScoreGlow = (score: number) => {
    if (score >= 8) return "shadow-emerald-500/20";
    if (score >= 5) return "shadow-amber-500/20";
    return "shadow-rose-500/20";
  };

  const avgScore =
    logs.length > 0
      ? logs.reduce((sum, l) => sum + (l.score || 0), 0) / logs.length
      : 0;

  const bestScore =
    logs.length > 0 ? Math.max(...logs.map((l) => l.score || 0)) : 0;
  const streak = (() => {
    let count = 0;
    for (let i = 0; i < logs.length; i++) {
      if ((logs[i].score || 0) >= 6) count++;
      else break;
    }
    return count;
  })();

  // Chart data
  const areaData = [...logs]
    .reverse()
    .slice(-14)
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      score: log.score || 0,
    }));

  const radarData =
    logs.length > 0
      ? [
          {
            subject: "Bible",
            value: logs.filter((l) => l.bibleReading).length,
          },
          { subject: "Coding", value: logs.filter((l) => l.codingWork).length },
          { subject: "Books", value: logs.filter((l) => l.bookReading).length },
          { subject: "CS", value: logs.filter((l) => l.csTopic).length },
          {
            subject: "College",
            value: logs.filter((l) => l.collegeActivity).length,
          },
          { subject: "Diary", value: logs.filter((l) => l.diary).length },
        ]
      : [];

  const barData = [...logs]
    .reverse()
    .slice(-7)
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      score: log.score || 0,
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className="text-lg font-bold text-indigo-400">
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
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            Loading history
          </p>
        </div>
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-6xl">📜</div>
          <h2 className="text-2xl font-bold {textMuted}">No entries yet</h2>
          <p className="text-gray-500">
            Start tracking your day to see insights here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060910] {textMuted}">
      <div
        className={`min-h-screen ${bg} ${text} transition-colors duration-300`}
      >
        {/* ─── AMBIENT BACKGROUND ─── */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-0 w-64 h-64 bg-cyan-600/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-8">
          {/* ─── HEADER ─── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-indigo-400 mb-2 font-medium">
                Personal Records
              </p>
              <h1 className="text-4xl font-black tracking-tight {textMuted}">
                Your Journey
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                {logs.length} entries · {avgScore.toFixed(1)} avg score
              </p>
            </div>

            <input
              type="text"
              placeholder="Search by date..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm {textMuted} placeholder-gray-600 outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition w-full md:w-64 backdrop-blur-sm"
            />
          </div>

          {/* ─── STAT CARDS ─── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Total Logs",
                value: logs.length,
                icon: "📋",
                color: "indigo",
              },
              {
                label: "Best Score",
                value: bestScore,
                icon: "🏆",
                color: "amber",
              },
              {
                label: "Average",
                value: avgScore.toFixed(1),
                icon: "📊",
                color: "violet",
              },
              {
                label: "🔥 Streak",
                value: `${streak}d`,
                icon: "",
                color: "emerald",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 backdrop-blur-sm hover:bg-white/[0.05] transition group"
              >
                <div className="text-2xl mb-3">{stat.icon}</div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-black {textMuted}">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* ─── TAB SWITCHER ─── */}
          <div className="flex gap-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-1 w-fit">
            {(["timeline", "analytics"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-medium transition capitalize ${
                  activeTab === tab
                    ? "bg-indigo-500 {textMuted} shadow-lg shadow-indigo-500/30"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab === "timeline" ? "📜 Timeline" : "📈 Analytics"}
              </button>
            ))}
          </div>

          {/* ─── ANALYTICS TAB ─── */}
          {activeTab === "analytics" && (
            <div className="space-y-6 animate-[fadeSlide_0.4s_ease]">
              {/* Score Trend – Area Chart */}
              <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-gray-300 mb-1">
                  Score Trend
                </h3>
                <p className="text-xs text-gray-600 mb-6">Last 14 entries</p>
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData}>
                      <defs>
                        <linearGradient
                          id="scoreGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#ffffff08" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#ffffff20"
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                      />
                      <YAxis
                        stroke="#ffffff08"
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        domain={[0, 10]}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fill="url(#scoreGrad)"
                        dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#818cf8", strokeWidth: 0 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Weekly Bar Chart */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-gray-300 mb-1">
                    This Week
                  </h3>
                  <p className="text-xs text-gray-600 mb-6">Daily scores</p>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} barSize={28}>
                        <CartesianGrid stroke="#ffffff08" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="#ffffff08"
                          tick={{ fontSize: 11, fill: "#6b7280" }}
                        />
                        <YAxis
                          stroke="#ffffff08"
                          tick={{ fontSize: 11, fill: "#6b7280" }}
                          domain={[0, 10]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                          {barData.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={
                                entry.score >= 8
                                  ? "#10b981"
                                  : entry.score >= 5
                                    ? "#f59e0b"
                                    : "#f43f5e"
                              }
                              fillOpacity={0.8}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Activity Radar */}
                <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 backdrop-blur-sm">
                  <h3 className="text-sm font-semibold text-gray-300 mb-1">
                    Activity Coverage
                  </h3>
                  <p className="text-xs text-gray-600 mb-2">
                    Frequency of each category
                  </p>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#ffffff10" />
                        <PolarAngleAxis
                          dataKey="subject"
                          tick={{ fontSize: 11, fill: "#9ca3af" }}
                        />
                        <Radar
                          dataKey="value"
                          stroke="#8b5cf6"
                          fill="#8b5cf6"
                          fillOpacity={0.2}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* AI Insight Cards */}
              {logs.slice(0, 3).map((log, i) => (
                <div
                  key={log.id}
                  className={`bg-gradient-to-br ${getScoreBg(log.score || 0)} border rounded-2xl p-6 shadow-xl ${getScoreGlow(log.score || 0)}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                        {i === 0 ? "Latest Entry" : `Entry ${i + 1}`}
                      </p>
                      <p className="text-sm text-gray-400">
                        {new Date(log.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span
                      className={`text-2xl font-black ${getScoreColor(log.score || 0)}`}
                    >
                      {log.score || 0}
                      <span className="text-sm font-normal text-gray-600">
                        /10
                      </span>
                    </span>
                  </div>

                  {log.finalSummary && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">
                        🧠 AI Summary
                      </p>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {log.finalSummary}
                      </p>
                    </div>
                  )}

                  {log.motivation && (
                    <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                      <p className="text-xs text-indigo-400 mb-1 uppercase tracking-wider">
                        🔥 Motivation
                      </p>
                      <p className="text-gray-300 text-sm italic">
                        {log.motivation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ─── TIMELINE TAB ─── */}
          {activeTab === "timeline" && (
            <div className="space-y-4 animate-[fadeSlide_0.4s_ease]">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className={`bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden backdrop-blur-sm hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 group`}
                >
                  {/* Card Header */}
                  <div className="p-5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex items-center gap-4">
                        {/* Score Badge */}
                        <div
                          className={`relative flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${getScoreBg(log.score || 0)} border flex items-center justify-center`}
                        >
                          <span
                            className={`text-xl font-black ${getScoreColor(log.score || 0)}`}
                          >
                            {log.score || 0}
                          </span>
                        </div>

                        <div>
                          <p className="font-semibold {textMuted} text-sm">
                            {new Date(log.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {new Date(log.date).getFullYear()}
                          </p>

                          {/* Activity Pills */}
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {log.bibleReading && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                📖 Bible
                              </span>
                            )}
                            {log.codingWork && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                💻 Coding
                              </span>
                            )}
                            {log.bookReading && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                📚 Reading
                              </span>
                            )}
                            {log.csTopic && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                🧠 CS
                              </span>
                            )}
                            {log.movie && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                                🎬 Movie
                              </span>
                            )}
                            {log.expenses > 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                💰 ₹{log.expenses}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedId(expandedId === log.id ? null : log.id)
                        }
                        className="flex-shrink-0 flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-400 transition-colors mt-1"
                      >
                        {expandedId === log.id ? "Close" : "Details"}
                        <span
                          className={`transition-transform duration-300 ${expandedId === log.id ? "rotate-180" : ""}`}
                        >
                          ↓
                        </span>
                      </button>
                    </div>

                    {/* Summary Preview */}
                    {log.finalSummary && (
                      <p className="mt-3 text-gray-500 text-xs leading-relaxed line-clamp-2 pl-[72px]">
                        {log.finalSummary}
                      </p>
                    )}
                  </div>

                  {/* Expanded Details */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${
                      expandedId === log.id
                        ? "max-h-[900px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="border-t border-white/[0.06] mx-5" />
                    <div className="p-5 space-y-5">
                      {/* AI Full Summary */}
                      {log.finalSummary && (
                        <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-4">
                          <p className="text-xs text-indigo-400 uppercase tracking-wider mb-2">
                            🧠 AI Summary
                          </p>
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {log.finalSummary}
                          </p>
                        </div>
                      )}

                      {/* Motivation */}
                      {log.motivation && (
                        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
                          <p className="text-xs text-amber-400 uppercase tracking-wider mb-2">
                            🔥 Motivation
                          </p>
                          <p className="text-gray-300 text-sm italic leading-relaxed">
                            {log.motivation}
                          </p>
                        </div>
                      )}

                      {/* Review Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          {
                            label: "📖 Bible",
                            value: log.bibleReview,
                            accent: "indigo",
                          },
                          {
                            label: "📚 Book",
                            value: log.bookReview,
                            accent: "purple",
                          },
                          {
                            label: "💻 Coding",
                            value: log.codingReview,
                            accent: "green",
                          },
                          {
                            label: "🧠 CS Topic",
                            value: log.csTopicReview,
                            accent: "cyan",
                          },
                          {
                            label: "🏫 College",
                            value: log.collegeReview,
                            accent: "blue",
                          },
                          {
                            label: "📔 Diary",
                            value: log.diaryReview,
                            accent: "yellow",
                          },
                          {
                            label: "💰 Expenses",
                            value: log.expensesReview,
                            accent: "amber",
                          },
                          {
                            label: "🎬 Movie",
                            value: log.movieReview,
                            accent: "pink",
                          },
                          {
                            label: "📱 Phone",
                            value: log.phoneUsageReview,
                            accent: "rose",
                          },
                        ]
                          .filter((item) => item.value)
                          .map((item) => (
                            <div
                              key={item.label}
                              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 hover:bg-white/[0.05] transition"
                            >
                              <p className="text-xs text-gray-500 mb-2 font-medium">
                                {item.label}
                              </p>
                              <p className="text-gray-400 text-xs leading-relaxed whitespace-pre-line">
                                {item.value}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="text-center py-16 text-gray-600">
                  <p className="text-4xl mb-3">🔍</p>
                  <p>No entries match your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default History;
