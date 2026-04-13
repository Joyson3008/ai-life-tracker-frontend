import { useEffect, useState, useMemo } from "react";
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
  Dumbbell,
  Eye,
} from "lucide-react";

type Props = { userId: number };

const SCORE_COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

const NEON_COLORS = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ec4899"];

// Tooltip customization
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d1117] border border-white/10 rounded-xl px-4 py-2 text-xs {textMuted}  shadow-xl">
        <p className="text-gray-400 mb-1">Day {label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}:{" "}
            <span className="font-bold">
              {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 overflow-hidden group hover:border-white/15 transition-all duration-300">
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${color} pointer-events-none`}
      />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-500 text-xs uppercase tracking-widest">
            {label}
          </span>
          <span className="text-gray-600">{icon}</span>
        </div>
        <p className="text-3xl font-black {textMuted} ">{value}</p>
        {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function Card({
  title,
  icon,
  children,
  span2 = false,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <div
      className={`bg-white/[0.03] backdrop-blur-lg border border-white/[0.07] p-6 rounded-2xl shadow-lg hover:border-white/15 transition-all duration-300 ${span2 ? "md:col-span-2" : ""}`}
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="text-indigo-400">{icon}</span>
        <h3 className="font-semibold {textMuted}  text-sm tracking-wide">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

export default function WeeklyReport({ userId }: Props) {
  const { darkMode } = useTheme();

  // Theme-aware class helpers
  const bg = darkMode ? "bg-[#060910]" : "bg-slate-100";
  const text = darkMode ? "{textMuted} " : "text-slate-900";

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "performance" | "habits" | "focus"
  >("performance");

  useEffect(() => {
    fetch("https://ai-life-tracker.onrender.com/api/daily")
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.filter((l: any) => l.user?.id === userId));
        setLoading(false);
      });
  }, [userId]);

  const weeklyLogs = useMemo(() => {
    return [...logs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7)
      .reverse();
  }, [logs]);

  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const chartData = weeklyLogs.map((l, i) => ({
    day: dayLabels[i] ?? `D${i + 1}`,
    score: l.score || 0,
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
      (l.bible ? 1 : 0),
    expenses: l.expenses || 0,
  }));

  const radarData = [
    { subject: "Coding", A: chartData.filter((d) => d.coding).length },
    { subject: "Reading", A: chartData.filter((d) => d.reading).length },
    { subject: "CS Topics", A: chartData.filter((d) => d.learning).length },
    { subject: "Bible", A: chartData.filter((d) => d.bible).length },
    { subject: "College", A: chartData.filter((d) => d.college).length },
  ];

  const distribution = [
    {
      name: "Low (<5)",
      value: weeklyLogs.filter((l) => (l.score || 0) < 5).length,
    },
    {
      name: "Medium (5–7)",
      value: weeklyLogs.filter((l) => (l.score || 0) >= 5 && l.score < 8)
        .length,
    },
    {
      name: "High (8+)",
      value: weeklyLogs.filter((l) => (l.score || 0) >= 8).length,
    },
  ];

  const rolling = chartData.map((_, i, arr) => {
    const slice = arr.slice(0, i + 1);
    return {
      day: arr[i].day,
      avg: parseFloat(
        (slice.reduce((s, d) => s + d.score, 0) / slice.length).toFixed(2),
      ),
    };
  });

  const momentum = chartData.map((d, i, arr) => ({
    day: d.day,
    change: i === 0 ? 0 : d.score - arr[i - 1].score,
  }));

  const totalExpenses = chartData.reduce((s, d) => s + d.expenses, 0);
  const avgScore =
    weeklyLogs.length > 0
      ? (
          weeklyLogs.reduce((s, l) => s + (l.score || 0), 0) / weeklyLogs.length
        ).toFixed(1)
      : "—";
  const bestDay = chartData.reduce(
    (best, d) => (d.score > best.score ? d : best),
    chartData[0] || { day: "—", score: 0 },
  );
  const habitStreak = chartData.filter((d) => d.coding || d.reading).length;
  const totalProductivity = chartData.reduce((s, d) => s + d.productivity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className="text-gray-500 text-xs tracking-[0.25em] uppercase">
            Loading intelligence
          </p>
        </div>
      </div>
    );
  }

  if (weeklyLogs.length === 0) {
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Brain className="w-12 h-12 text-indigo-400 mx-auto opacity-40" />
          <p className="text-gray-500">
            No logs yet. Start tracking to see your weekly intelligence.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060910] {textMuted} ">
      {/* Ambient background */}
      <div
        className={`min-h-screen ${bg} ${text} transition-colors duration-300`}
      >
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-700/5 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-700/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-10">
          {/* ── HEADER ── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.4em] text-indigo-400 uppercase mb-2">
                Last 7 Days
              </p>
              <h1 className="text-5xl font-black tracking-tight flex items-center gap-4">
                <Brain className="w-10 h-10 text-indigo-400" />
                Weekly Intelligence
              </h1>
              <p className="text-gray-500 text-sm mt-2">
                Deep performance analysis across all life dimensions
              </p>
            </div>

            {/* Score pill */}
            <div className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-6 py-4">
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Avg Score
                </p>
                <p className="text-4xl font-black {textMuted} ">
                  {avgScore}
                  <span className="text-lg text-gray-600">/10</span>
                </p>
              </div>
              <div className="w-px h-10 bg-white/10 mx-2" />
              <div>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                  Best Day
                </p>
                <p className="text-lg font-bold text-amber-400">
                  {bestDay?.day} · {bestDay?.score}
                </p>
              </div>
            </div>
          </div>

          {/* ── KPI CARDS ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Flame className="w-4 h-4" />}
              label="Avg Score"
              value={avgScore}
              sub="out of 10"
              color="from-indigo-500/10 to-transparent"
            />
            <StatCard
              icon={<Target className="w-4 h-4" />}
              label="Habit Days"
              value={habitStreak}
              sub="coding or reading"
              color="from-cyan-500/10 to-transparent"
            />
            <StatCard
              icon={<Zap className="w-4 h-4" />}
              label="Productivity"
              value={totalProductivity}
              sub="total points"
              color="from-amber-500/10 to-transparent"
            />
            <StatCard
              icon={<Award className="w-4 h-4" />}
              label="Expenses"
              value={`₹${totalExpenses}`}
              sub="this week"
              color="from-rose-500/10 to-transparent"
            />
          </div>

          {/* ── TABS ── */}
          <div className="flex gap-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-1.5 w-fit">
            {(["performance", "habits", "focus"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-indigo-500 {textMuted}  shadow-lg shadow-indigo-500/20"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ── PERFORMANCE TAB ── */}
          {activeTab === "performance" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Score Trend */}
              <Card
                title="Daily Score Trend"
                icon={<TrendingUp className="w-4 h-4" />}
                span2
              >
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#ffffff08" />
                    <XAxis
                      dataKey="day"
                      stroke="#4b5563"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#4b5563"
                      domain={[0, 10]}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{
                        r: 5,
                        fill: "#6366f1",
                        strokeWidth: 2,
                        stroke: "#0d1117",
                      }}
                      activeDot={{ r: 7, fill: "#818cf8" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              {/* Rolling Average */}
              <Card
                title="Improvement Trend"
                icon={<TrendingUp className="w-4 h-4" />}
              >
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={rolling}>
                    <CartesianGrid stroke="#ffffff08" />
                    <XAxis
                      dataKey="day"
                      stroke="#4b5563"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#4b5563"
                      domain={[0, 10]}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <defs>
                      <linearGradient id="avgGrad" x1="0" y1="0" x2="0" y2="1">
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
                    <Area
                      type="monotone"
                      dataKey="avg"
                      stroke="#6366f1"
                      strokeWidth={2.5}
                      fill="url(#avgGrad)"
                      name="Rolling Avg"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Momentum (score delta) */}
              <Card
                title="Score Momentum"
                icon={<Activity className="w-4 h-4" />}
              >
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={momentum}>
                    <CartesianGrid stroke="#ffffff08" />
                    <XAxis
                      dataKey="day"
                      stroke="#4b5563"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis stroke="#4b5563" tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="change" name="Change" radius={[4, 4, 0, 0]}>
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

              {/* Score Distribution Pie */}
              <Card
                title="Score Distribution"
                icon={<BarChart3 className="w-4 h-4" />}
              >
                <div className="flex items-center justify-between">
                  <PieChart width={180} height={180}>
                    <Pie
                      data={distribution}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {distribution.map((_, i) => (
                        <Cell key={i} fill={SCORE_COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                  <div className="space-y-3 ml-4">
                    {distribution.map((d, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: SCORE_COLORS[i] }}
                        />
                        <div>
                          <p className="text-xs font-semibold {textMuted} ">
                            {d.name}
                          </p>
                          <p className="text-[10px] text-gray-600">
                            {d.value} day{d.value !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Expenses Bar */}
              <Card
                title="Daily Expenses"
                icon={<Target className="w-4 h-4" />}
                span2
              >
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={chartData}>
                    <CartesianGrid stroke="#ffffff08" />
                    <XAxis
                      dataKey="day"
                      stroke="#4b5563"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis stroke="#4b5563" tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="expenses"
                      name="₹ Spent"
                      radius={[4, 4, 0, 0]}
                      fill="#f59e0b"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {/* ── HABITS TAB ── */}
          {activeTab === "habits" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Habit Radar */}
              <Card
                title="Habit Coverage Radar"
                icon={<Eye className="w-4 h-4" />}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#ffffff10" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                    />
                    <Radar
                      dataKey="A"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>

              {/* Habit Stack Area */}
              <Card
                title="Habit Stack Over Week"
                icon={<Dumbbell className="w-4 h-4" />}
              >
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={chartData}>
                    <CartesianGrid stroke="#ffffff08" />
                    <XAxis
                      dataKey="day"
                      stroke="#4b5563"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis stroke="#4b5563" tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <defs>
                      {["codeGrad", "readGrad", "learnGrad"].map((id, i) => (
                        <linearGradient
                          key={id}
                          id={id}
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor={NEON_COLORS[i]}
                            stopOpacity={0.5}
                          />
                          <stop
                            offset="95%"
                            stopColor={NEON_COLORS[i]}
                            stopOpacity={0.05}
                          />
                        </linearGradient>
                      ))}
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="coding"
                      stackId="1"
                      stroke={NEON_COLORS[0]}
                      fill={`url(#codeGrad)`}
                      name="Coding"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="reading"
                      stackId="1"
                      stroke={NEON_COLORS[1]}
                      fill={`url(#readGrad)`}
                      name="Reading"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="learning"
                      stackId="1"
                      stroke={NEON_COLORS[2]}
                      fill={`url(#learnGrad)`}
                      name="CS Topics"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Habit Completion Table */}
              <Card
                title="Daily Habit Completion"
                icon={<BookOpen className="w-4 h-4" />}
                span2
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-600 text-[10px] uppercase tracking-widest border-b border-white/[0.05]">
                        <th className="pb-3 text-left">Day</th>
                        <th className="pb-3 text-center">Bible</th>
                        <th className="pb-3 text-center">Book</th>
                        <th className="pb-3 text-center">CS Topic</th>
                        <th className="pb-3 text-center">Coding</th>
                        <th className="pb-3 text-center">College</th>
                        <th className="pb-3 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {chartData.map((d, i) => (
                        <tr
                          key={i}
                          className="hover:bg-white/[0.02] transition"
                        >
                          <td className="py-3 font-semibold {textMuted} ">
                            {d.day}
                          </td>
                          <td className="py-3 text-center">
                            {weeklyLogs[i]?.bibleReading ? (
                              <span className="text-indigo-400">✓</span>
                            ) : (
                              <span className="text-gray-700">—</span>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            {d.reading ? (
                              <span className="text-blue-400">✓</span>
                            ) : (
                              <span className="text-gray-700">—</span>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            {d.learning ? (
                              <span className="text-purple-400">✓</span>
                            ) : (
                              <span className="text-gray-700">—</span>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            {d.coding ? (
                              <span className="text-green-400">✓</span>
                            ) : (
                              <span className="text-gray-700">—</span>
                            )}
                          </td>
                          <td className="py-3 text-center">
                            {weeklyLogs[i]?.collegeActivity ? (
                              <span className="text-cyan-400">✓</span>
                            ) : (
                              <span className="text-gray-700">—</span>
                            )}
                          </td>
                          <td className="py-3 text-right">
                            <span
                              className={`font-bold ${d.score >= 8 ? "text-green-400" : d.score >= 5 ? "text-yellow-400" : "text-red-400"}`}
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

          {/* ── FOCUS TAB ── */}
          {activeTab === "focus" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Productivity Index */}
              <Card
                title="Productivity Index"
                icon={<Zap className="w-4 h-4" />}
                span2
              >
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={chartData}>
                    <CartesianGrid stroke="#ffffff08" />
                    <XAxis
                      dataKey="day"
                      stroke="#4b5563"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis stroke="#4b5563" tick={{ fontSize: 11 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <defs>
                      <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#8b5cf6"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8b5cf6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="productivity"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="url(#prodGrad)"
                      name="Productivity"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              {/* Score vs Productivity */}
              <Card
                title="Productivity vs Score"
                icon={<Activity className="w-4 h-4" />}
              >
                <ResponsiveContainer width="100%" height={220}>
                  <ScatterChart>
                    <CartesianGrid stroke="#ffffff08" />
                    <XAxis
                      dataKey="productivity"
                      name="Productivity"
                      stroke="#4b5563"
                      tick={{ fontSize: 11 }}
                      label={{
                        value: "Productivity",
                        position: "bottom",
                        fill: "#4b5563",
                        fontSize: 10,
                      }}
                    />
                    <YAxis
                      dataKey="score"
                      name="Score"
                      stroke="#4b5563"
                      domain={[0, 10]}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={<CustomTooltip />}
                    />
                    <Scatter data={chartData} fill="#6366f1" />
                  </ScatterChart>
                </ResponsiveContainer>
              </Card>

              {/* Coding Consistency Bar */}
              <Card
                title="Coding Activity"
                icon={<Code2 className="w-4 h-4" />}
              >
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid stroke="#ffffff08" />
                    <XAxis
                      dataKey="day"
                      stroke="#4b5563"
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      stroke="#4b5563"
                      tick={{ fontSize: 11 }}
                      domain={[0, 1]}
                      ticks={[0, 1]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="coding" name="Coded" radius={[6, 6, 0, 0]}>
                      {chartData.map((d, i) => (
                        <Cell key={i} fill={d.coding ? "#22c55e" : "#1f2937"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {/* ── ACTIVITY HEATMAP ── */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Moon className="w-4 h-4 text-indigo-400" />
              <h3 className="font-semibold {textMuted}  text-sm tracking-wide">
                Weekly Activity Heatmap
              </h3>
            </div>
            <div className="flex gap-3 flex-wrap">
              {weeklyLogs.map((l, i) => {
                const score = l.score || 0;
                const color =
                  score >= 8
                    ? "bg-green-500"
                    : score >= 6
                      ? "bg-indigo-400"
                      : score >= 4
                        ? "bg-yellow-400"
                        : "bg-red-500";
                return (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center font-black {textMuted}  text-sm shadow-lg`}
                    >
                      {score}
                    </div>
                    <span className="text-[10px] text-gray-600">
                      {dayLabels[i] ?? `D${i + 1}`}
                    </span>
                  </div>
                );
              })}
              <div className="flex items-end gap-2 ml-6 mb-1">
                {[
                  ["bg-red-500", "<4"],
                  ["bg-yellow-400", "4–5"],
                  ["bg-indigo-400", "6–7"],
                  ["bg-green-500", "8+"],
                ].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1">
                    <div className={`w-3 h-3 rounded ${c}`} />
                    <span className="text-[9px] text-gray-600">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── AI INSIGHT BANNER ── */}
          <div className="bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 flex items-start gap-4">
            <Brain className="w-8 h-8 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="{textMuted}  font-bold mb-1">
                Weekly Intelligence Summary
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {weeklyLogs[weeklyLogs.length - 1]?.finalSummary ||
                  `Over the past ${weeklyLogs.length} day${weeklyLogs.length !== 1 ? "s" : ""}, your average score is ${avgScore}/10 
                with a productivity index of ${totalProductivity} points. 
                ${habitStreak > 4 ? "Strong habit consistency this week 💪" : "There's room to build more daily habits."}
                Keep logging daily for deeper trend insights.`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
