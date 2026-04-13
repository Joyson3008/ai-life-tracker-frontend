import { useEffect, useState, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";

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

// Linear regression
function linearRegression(data: number[]): {
  slope: number;
  intercept: number;
  r2: number;
} {
  const n = data.length;
  if (n < 2) return { slope: 0, intercept: data[0] || 5, r2: 0 };
  const xs = data.map((_, i) => i);
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = data.reduce((a, b) => a + b, 0) / n;
  const ssxy = xs.reduce(
    (sum, x, i) => sum + (x - meanX) * (data[i] - meanY),
    0,
  );
  const ssxx = xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0);
  const ssyy = data.reduce((sum, y) => sum + (y - meanY) ** 2, 0);
  const slope = ssxx !== 0 ? ssxy / ssxx : 0;
  const intercept = meanY - slope * meanX;
  const r2 = ssxx !== 0 && ssyy !== 0 ? ssxy ** 2 / (ssxx * ssyy) : 0;
  return { slope, intercept, r2 };
}

function predict(
  regression: ReturnType<typeof linearRegression>,
  step: number,
): number {
  return Math.min(
    10,
    Math.max(0, regression.intercept + regression.slope * step),
  );
}

function movingAverage(data: number[], window: number): number[] {
  return data.map((_, i) => {
    const slice = data.slice(Math.max(0, i - window + 1), i + 1);
    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

function getTrendLabel(slope: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (slope > 0.15)
    return { label: "Strong Uptrend 🚀", color: "#10b981", icon: "↗" };
  if (slope > 0.05)
    return { label: "Mild Uptrend", color: "#34d399", icon: "↗" };
  if (slope > -0.05) return { label: "Stable", color: "#f59e0b", icon: "→" };
  if (slope > -0.15)
    return { label: "Mild Downtrend", color: "#f97316", icon: "↘" };
  return { label: "Declining ⚠️", color: "#f43f5e", icon: "↘" };
}

function getRiskLevel(
  predicted7: number,
  avgScore: number,
): { level: string; color: string; desc: string } {
  const delta = predicted7 - avgScore;
  console.log("Delta:", delta);
  if (predicted7 >= 8)
    return {
      level: "Excellent",
      color: "#10b981",
      desc: "You're on track for a phenomenal week.",
    };
  if (predicted7 >= 6.5)
    return {
      level: "Good",
      color: "#34d399",
      desc: "Steady progress expected. Small optimizations will push you higher.",
    };
  if (predicted7 >= 5)
    return {
      level: "Moderate",
      color: "#f59e0b",
      desc: "Room for improvement. Focus on your weakest categories.",
    };
  return {
    level: "At Risk",
    color: "#f43f5e",
    desc: "Your momentum is dropping. Urgent attention needed.",
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    const isPredicted = label?.includes("(P)");
    return (
      <div className="bg-[#0d1117] border border-white/10 rounded-xl px-4 py-3 shadow-2xl">
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <p
          className="text-base font-bold"
          style={{ color: isPredicted ? "#a78bfa" : "#6366f1" }}
        >
          {isPredicted ? "🔮" : "⭐"} {payload[0]?.value?.toFixed(1)}
        </p>
        {isPredicted && (
          <p className="text-[9px] text-violet-400 mt-0.5">Predicted</p>
        )}
      </div>
    );
  }
  return null;
};

export default function PredictionEngine({ userId }: Props) {
  const { darkMode } = useTheme();

  // Theme-aware class helpers
  const bg = darkMode ? "bg-[#060910]" : "bg-slate-100";
  // const cardBg    = darkMode ? "bg-white/[0.03] border-white/[0.07]" : "bg-white border-slate-200";
  const text = darkMode ? "{textMuted} " : "text-slate-900";

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [predDays, setPredDays] = useState(14);
  const [activeTab, setActiveTab] = useState<
    "forecast" | "categories" | "risks"
  >("forecast");

  useEffect(() => {
    fetch("https://ai-life-tracker.onrender.com/api/daily")
      .then((r) => r.json())
      .then((data) => {
        const userLogs = data
          .filter((l: any) => l.user?.id === userId)
          .sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          );
        setLogs(userLogs);
        setLoading(false);
      });
  }, [userId]);

  const analysis = useMemo(() => {
    if (logs.length < 3) return null;

    const scores = logs.map((l) => l.score || 0);
    const ma7 = movingAverage(scores, 7);
    const reg = linearRegression(scores);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const recentAvg =
      scores.slice(-7).reduce((a, b) => a + b, 0) / Math.min(7, scores.length);

    // Predicted scores for next N days
    const predictions: number[] = [];
    for (let i = 1; i <= predDays; i++) {
      const rawPred = predict(reg, scores.length - 1 + i);
      // Add reversion-to-mean dampening
      const dampened = rawPred * 0.7 + recentAvg * 0.3;
      predictions.push(Math.min(10, Math.max(0, dampened)));
    }

    const predicted7 = predictions.slice(0, 7).reduce((a, b) => a + b, 0) / 7;

    // Chart data: last 14 actual + N predicted
    const chartData = [
      ...logs.slice(-14).map((l, i) => ({
        label: new Date(l.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        actual: l.score || 0,
        ma: parseFloat(ma7[logs.length - 14 + i]?.toFixed(1) || "0"),
        predicted: undefined as number | undefined,
      })),
      ...predictions.map((p, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return {
          label:
            d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
            " (P)",
          actual: undefined as number | undefined,
          ma: undefined as number | undefined,
          predicted: parseFloat(p.toFixed(2)),
        };
      }),
    ];

    // Category analysis
    const categoryAnalysis = CATEGORIES.map((cat) => {
      const catData: number[] = logs.map((l) => (l[cat.key] ? 1 : 0));
      const catReg = linearRegression(catData);
      const frequency = catData.reduce((a, b) => a + b, 0) / catData.length;
      const recentFreq =
        catData.slice(-7).reduce((a, b) => a + b, 0) /
        Math.min(7, catData.length);
      const predictedFreq = Math.min(
        1,
        Math.max(0, predict(catReg, catData.length + 6)),
      );
      return {
        ...cat,
        frequency: Math.round(frequency * 100),
        recentFreq: Math.round(recentFreq * 100),
        predictedFreq: Math.round(predictedFreq * 100),
        trend: catReg.slope,
        trendInfo: getTrendLabel(catReg.slope),
      };
    });

    // Radar: category performance
    const radarData = categoryAnalysis.map((c) => ({
      subject: c.label,
      current: c.frequency,
      predicted: c.predictedFreq,
    }));

    // Risk factors
    const risks: {
      type: string;
      severity: "low" | "medium" | "high";
      message: string;
    }[] = [];

    if (reg.slope < -0.1)
      risks.push({
        type: "Score Decline",
        severity: "high",
        message:
          "Your daily score trend is declining significantly over recent weeks.",
      });
    else if (reg.slope < 0)
      risks.push({
        type: "Score Drift",
        severity: "medium",
        message:
          "Slight downward drift in scores. Consistency could be improved.",
      });

    const codingCat = categoryAnalysis.find((c) => c.key === "codingWork");
    if (codingCat && codingCat.trend < -0.05)
      risks.push({
        type: "Coding Drops",
        severity: "medium",
        message:
          "Coding frequency is declining. Schedule dedicated coding blocks.",
      });

    if (recentAvg < avgScore * 0.85)
      risks.push({
        type: "Performance Drop",
        severity: "high",
        message: `Your last 7-day average (${recentAvg.toFixed(1)}) is well below your all-time average (${avgScore.toFixed(1)}).`,
      });

    const bibleCat = categoryAnalysis.find((c) => c.key === "bibleReading");
    if (bibleCat && bibleCat.recentFreq < 50)
      risks.push({
        type: "Spiritual Gap",
        severity: "low",
        message:
          "Bible reading frequency below 50% this week. Consider morning devotionals.",
      });

    // Opportunities
    const opportunities: { message: string; category: string }[] = [];
    categoryAnalysis.forEach((c) => {
      if (c.trend > 0.05 && c.frequency < 70) {
        opportunities.push({
          message: `${c.icon} ${c.label} is trending up — keep the momentum!`,
          category: c.key,
        });
      }
    });
    if (recentAvg > avgScore) {
      opportunities.push({
        message: `⭐ Your recent performance (${recentAvg.toFixed(1)}) is above your average. You're in a growth phase!`,
        category: "score",
      });
    }

    const risk = getRiskLevel(predicted7, avgScore);
    const trendInfo = getTrendLabel(reg.slope);

    return {
      scores,
      reg,
      avgScore,
      recentAvg,
      predicted7,
      predictions,
      chartData,
      categoryAnalysis,
      radarData,
      risks,
      opportunities,
      risk,
      trendInfo,
      ma7,
    };
  }, [logs, predDays]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );

  if (!analysis || logs.length < 5)
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <div className="text-center space-y-4 px-6">
          <p className="text-6xl">🔮</p>
          <h2 className="text-2xl font-black {textMuted} ">Need More Data</h2>
          <p className="text-gray-600">
            Log at least 5 days to unlock predictions. You have {logs.length} so
            far.
          </p>
          <div className="h-2 bg-white/5 rounded-full w-48 mx-auto overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${(logs.length / 5) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">{logs.length}/5 days</p>
        </div>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-[#060910] {textMuted} "
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div
        className={`min-h-screen ${bg} ${text} transition-colors duration-300`}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />

        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-60px] left-[30%] w-[700px] h-[700px] bg-violet-800/5 rounded-full blur-[180px]" />
          <div className="absolute bottom-[10%] right-[-5%] w-[500px] h-[500px] bg-indigo-800/5 rounded-full blur-[140px]" />
          <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-cyan-800/4 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.35em] text-violet-400 uppercase mb-1 font-medium">
                Prediction Engine
              </p>
              <h1 className="text-4xl font-black tracking-tight">
                Your Future,
                <br />
                <span className="text-violet-400">Decoded.</span>
              </h1>
              <p className="text-gray-600 text-sm mt-2">
                {logs.length} days analyzed · ML-powered forecast
              </p>
            </div>

            <div className="flex gap-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-1">
              {(["forecast", "categories", "risks"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? "bg-violet-500 {textMuted}  shadow-lg shadow-violet-500/30"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab === "forecast"
                    ? "🔮 Forecast"
                    : tab === "categories"
                      ? "📊 Categories"
                      : "⚠️ Risks"}
                </button>
              ))}
            </div>
          </div>

          {/* Hero KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "7-Day Prediction",
                value: analysis.predicted7.toFixed(1),
                icon: "🔮",
                color: "text-violet-400",
                sub: "Forecasted avg",
              },
              {
                label: "Current Trend",
                value: analysis.trendInfo.icon,
                icon: "",
                color: "",
                sub: analysis.trendInfo.label,
                subColor: analysis.trendInfo.color,
              },
              {
                label: "Risk Level",
                value: analysis.risk.level,
                icon: "",
                color: "",
                sub: "Next week outlook",
                subColor: analysis.risk.color,
              },
              {
                label: "Confidence",
                value: `${Math.round(Math.min(analysis.reg.r2 * 100, 95))}%`,
                icon: "🎯",
                color: "text-cyan-400",
                sub: "Model accuracy",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4"
              >
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">
                  {s.label}
                </p>
                <p
                  className={`text-2xl font-black ${s.color}`}
                  style={{
                    color: s.subColor && !s.color ? s.subColor : undefined,
                  }}
                >
                  {s.icon && <span className="mr-1">{s.icon}</span>}
                  {s.value}
                </p>
                <p
                  className="text-[10px] mt-1"
                  style={{ color: s.subColor || "#4b5563" }}
                >
                  {s.sub}
                </p>
              </div>
            ))}
          </div>

          {/* ── FORECAST TAB ── */}
          {activeTab === "forecast" && (
            <div className="space-y-6 animate-[fadeSlide_0.4s_ease]">
              {/* Prediction horizon control */}
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-500">Forecast:</span>
                {[7, 14, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setPredDays(d)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      predDays === d
                        ? "bg-violet-500/20 border border-violet-500/30 text-violet-300"
                        : "bg-white/[0.03] border border-white/[0.06] text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {d} days
                  </button>
                ))}
              </div>

              {/* Main Prediction Chart */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold">Score Forecast</h2>
                    <p className="text-xs text-gray-600">
                      Actual history + {predDays}-day AI prediction
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-gray-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-indigo-400 rounded inline-block" />
                      Actual
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-0.5 bg-violet-500 rounded inline-block border-dashed border-t" />
                      Predicted
                    </span>
                  </div>
                </div>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analysis.chartData}>
                      <defs>
                        <linearGradient
                          id="actualGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#6366f1"
                            stopOpacity={0.2}
                          />
                          <stop
                            offset="100%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="predGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.25}
                          />
                          <stop
                            offset="100%"
                            stopColor="#8b5cf6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#ffffff06" vertical={false} />
                      <XAxis
                        dataKey="label"
                        stroke="#ffffff08"
                        tick={{ fontSize: 9, fill: "#4b5563" }}
                        tickLine={false}
                        axisLine={false}
                        interval={2}
                      />
                      <YAxis
                        stroke="#ffffff06"
                        tick={{ fontSize: 9, fill: "#4b5563" }}
                        domain={[0, 10]}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine
                        y={analysis.avgScore}
                        stroke="#ffffff15"
                        strokeDasharray="4 3"
                        strokeWidth={1}
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fill="url(#actualGrad)"
                        dot={false}
                        activeDot={{ r: 5, fill: "#818cf8", strokeWidth: 0 }}
                        connectNulls={false}
                      />
                      <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="#8b5cf6"
                        strokeWidth={2}
                        strokeDasharray="6 3"
                        fill="url(#predGrad)"
                        dot={{ r: 2.5, fill: "#a78bfa", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#c4b5fd", strokeWidth: 0 }}
                        connectNulls={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Prediction breakdown — next 7 days */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
                <h2 className="text-base font-bold mb-1">
                  7-Day Daily Forecast
                </h2>
                <p className="text-xs text-gray-600 mb-5">
                  Predicted score for each upcoming day
                </p>
                <div className="grid grid-cols-7 gap-2">
                  {analysis.predictions.slice(0, 7).map((p, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i + 1);
                    const col =
                      p >= 7 ? "#10b981" : p >= 5 ? "#f59e0b" : "#f43f5e";
                    return (
                      <div
                        key={i}
                        className="flex flex-col items-center gap-2 p-3 rounded-2xl border"
                        style={{
                          background: `${col}10`,
                          borderColor: `${col}25`,
                        }}
                      >
                        <span className="text-[9px] text-gray-500 uppercase">
                          {d.toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                        <span
                          className="text-lg font-black"
                          style={{ color: col }}
                        >
                          {p.toFixed(1)}
                        </span>
                        <span className="text-[9px] text-gray-600">
                          {d.getDate()}/{d.getMonth() + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Risk outlook */}
              <div
                className="rounded-2xl p-5 border"
                style={{
                  background: `${analysis.risk.color}0d`,
                  borderColor: `${analysis.risk.color}30`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      Week Outlook
                    </p>
                    <p
                      className="text-xl font-black"
                      style={{ color: analysis.risk.color }}
                    >
                      {analysis.risk.level}
                    </p>
                  </div>
                  <span className="text-4xl">
                    {analysis.risk.level === "Excellent"
                      ? "🚀"
                      : analysis.risk.level === "Good"
                        ? "📈"
                        : analysis.risk.level === "Moderate"
                          ? "⚡"
                          : "⚠️"}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {analysis.risk.desc}
                </p>
              </div>
            </div>
          )}

          {/* ── CATEGORIES TAB ── */}
          {activeTab === "categories" && (
            <div className="space-y-6 animate-[fadeSlide_0.4s_ease]">
              {/* Radar */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
                <h2 className="text-base font-bold mb-1">
                  Category Performance Radar
                </h2>
                <p className="text-xs text-gray-600 mb-4">
                  Current vs Predicted frequency (%)
                </p>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={analysis.radarData}>
                      <PolarGrid stroke="#ffffff10" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fontSize: 11, fill: "#9ca3af" }}
                      />
                      <Radar
                        dataKey="current"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.15}
                        strokeWidth={2}
                        name="Current"
                      />
                      <Radar
                        dataKey="predicted"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.1}
                        strokeWidth={1.5}
                        strokeDasharray="4 2"
                        name="Predicted"
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-4 justify-center text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-indigo-400 inline-block" />
                    Current
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-px bg-violet-400 inline-block border-dashed border-t border-violet-400" />
                    Predicted
                  </span>
                </div>
              </div>

              {/* Category cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {analysis.categoryAnalysis.map((cat) => (
                  <div
                    key={cat.key}
                    className="rounded-2xl p-5 border backdrop-blur-sm"
                    style={{
                      background: `${cat.color}08`,
                      borderColor: `${cat.color}20`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.icon}</span>
                        <span className="font-bold text-sm {textMuted} ">
                          {cat.label}
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-lg"
                        style={{
                          background: `${cat.trendInfo.color}20`,
                          color: cat.trendInfo.color,
                        }}
                      >
                        {cat.trendInfo.icon} {cat.trendInfo.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        {
                          label: "All-time",
                          value: `${cat.frequency}%`,
                          color: cat.color,
                        },
                        {
                          label: "This week",
                          value: `${cat.recentFreq}%`,
                          color:
                            cat.recentFreq > cat.frequency
                              ? "#10b981"
                              : "#f43f5e",
                        },
                        {
                          label: "Predicted",
                          value: `${cat.predictedFreq}%`,
                          color: "#a78bfa",
                        },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="bg-white/[0.03] rounded-xl p-2"
                        >
                          <p className="text-[9px] text-gray-600 uppercase mb-1">
                            {s.label}
                          </p>
                          <p
                            className="text-base font-black"
                            style={{ color: s.color }}
                          >
                            {s.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${cat.frequency}%`,
                          background: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RISKS TAB ── */}
          {activeTab === "risks" && (
            <div className="space-y-6 animate-[fadeSlide_0.4s_ease]">
              {/* Risk factors */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
                <h2 className="text-base font-bold mb-1">⚠️ Risk Factors</h2>
                <p className="text-xs text-gray-600 mb-5">
                  AI-detected patterns that may affect your performance
                </p>
                {analysis.risks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-4xl mb-3">✅</p>
                    <p className="text-gray-400 font-medium">
                      No significant risk factors detected!
                    </p>
                    <p className="text-gray-600 text-sm">
                      Your patterns look healthy. Keep it up.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {analysis.risks.map((risk, i) => {
                      const col =
                        risk.severity === "high"
                          ? "#f43f5e"
                          : risk.severity === "medium"
                            ? "#f59e0b"
                            : "#60a5fa";
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-4 p-4 rounded-2xl border"
                          style={{
                            background: `${col}08`,
                            borderColor: `${col}25`,
                          }}
                        >
                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: `${col}20` }}
                          >
                            <span className="text-sm">
                              {risk.severity === "high"
                                ? "🔴"
                                : risk.severity === "medium"
                                  ? "🟡"
                                  : "🔵"}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-bold {textMuted} ">
                              {risk.type}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {risk.message}
                            </p>
                            <span
                              className="text-[9px] uppercase font-bold tracking-wider mt-1 inline-block"
                              style={{ color: col }}
                            >
                              {risk.severity} priority
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Opportunities */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-6 backdrop-blur-sm">
                <h2 className="text-base font-bold mb-1">🚀 Opportunities</h2>
                <p className="text-xs text-gray-600 mb-5">
                  Positive patterns you can amplify
                </p>
                {analysis.opportunities.length === 0 ? (
                  <p className="text-gray-600 text-sm">
                    Keep logging — opportunities will appear as patterns emerge.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {analysis.opportunities.map((opp, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 p-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/5"
                      >
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">✨</span>
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {opp.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Recommendation */}
              <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/5 border border-violet-500/20 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-5 text-6xl opacity-10 select-none">
                  🤖
                </div>
                <p className="text-xs text-violet-400 uppercase tracking-wider mb-3">
                  AI Recommendation
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {analysis.reg.slope > 0.05
                    ? `Your trajectory is positive with a slope of +${analysis.reg.slope.toFixed(2)} per day. Your top priority should be maintaining consistency in your best-performing categories while slowly expanding weaker ones. Predicted score for next week: ${analysis.predicted7.toFixed(1)}/10.`
                    : analysis.reg.slope > -0.05
                      ? `Your scores are stable around ${analysis.avgScore.toFixed(1)}. To break through this plateau, try adding more depth to your coding or CS learning sessions — these have the highest correlation with score improvements. Aim for ${(analysis.avgScore + 0.5).toFixed(1)} this week.`
                      : `Your trend shows a decline of ${Math.abs(analysis.reg.slope).toFixed(2)} per day. The most effective recovery strategy is picking 3 key categories and focusing exclusively on them for 7 days before expanding. Prioritize Coding, Bible, and Diary — historically your highest-impact activities.`}
                </p>
              </div>
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
