import { useEffect, useState, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
type Props = { userId: number };

type Goal = {
  id: string;
  category: string;
  icon: string;
  color: string;
  title: string;
  target: string;
  targetType: "days_per_week" | "days_per_month" | "streak" | "score";
  targetValue: number;
  createdAt: string;
};

const CATEGORY_OPTIONS = [
  {
    key: "bibleReading",
    label: "Bible Reading",
    icon: "📖",
    color: "#818cf8",
    logKey: "bibleReading",
  },
  {
    key: "bookReading",
    label: "Book Reading",
    icon: "📚",
    color: "#a78bfa",
    logKey: "bookReading",
  },
  {
    key: "codingWork",
    label: "Coding",
    icon: "💻",
    color: "#34d399",
    logKey: "codingWork",
  },
  {
    key: "csTopic",
    label: "CS Learning",
    icon: "🧠",
    color: "#22d3ee",
    logKey: "csTopic",
  },
  {
    key: "collegeActivity",
    label: "College",
    icon: "🏫",
    color: "#60a5fa",
    logKey: "collegeActivity",
  },
  {
    key: "diary",
    label: "Journaling",
    icon: "📔",
    color: "#fbbf24",
    logKey: "diary",
  },
  {
    key: "movie",
    label: "Movie",
    icon: "🎬",
    color: "#f472b6",
    logKey: "movie",
  },
  {
    key: "score",
    label: "Daily Score",
    icon: "⭐",
    color: "#f59e0b",
    logKey: "score",
  },
  {
    key: "phoneUsage",
    label: "Phone Limit",
    icon: "📱",
    color: "#fb7185",
    logKey: "phoneUsage",
  },
];

const TARGET_TYPES = [
  { key: "days_per_week", label: "Days / Week" },
  { key: "days_per_month", label: "Days / Month" },
  { key: "streak", label: "Streak (days)" },
  { key: "score", label: "Avg Score" },
];

function getRingProgress(value: number, max: number) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return { circ, dash: pct * circ };
}

function getStatusColor(pct: number) {
  if (pct >= 1) return "#10b981";
  if (pct >= 0.7) return "#f59e0b";
  return "#f43f5e";
}

function getStatusLabel(pct: number) {
  if (pct >= 1) return "✅ Achieved";
  if (pct >= 0.8) return "🔥 Almost there";
  if (pct >= 0.5) return "📈 On track";
  if (pct >= 0.2) return "⚡ Keep going";
  return "🚨 Needs focus";
}

export default function GoalTracker({ userId }: Props) {
  const { darkMode } = useTheme();

  // Theme-aware class helpers
  const bg = darkMode ? "bg-[#060910]" : "bg-slate-100";

  const text = darkMode ? "{textMuted} " : "text-slate-900";

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [activeGoal, setActiveGoal] = useState<string | null>(null);

  // New goal form
  const [newGoal, setNewGoal] = useState({
    category: "codingWork",
    title: "",
    targetType: "days_per_week" as Goal["targetType"],
    targetValue: 5,
  });

  useEffect(() => {
    const saved = localStorage.getItem(`goals_${userId}`);
    if (saved) setGoals(JSON.parse(saved));

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

  const saveGoals = (updated: Goal[]) => {
    setGoals(updated);
    localStorage.setItem(`goals_${userId}`, JSON.stringify(updated));
  };

  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    const cat = CATEGORY_OPTIONS.find((c) => c.key === newGoal.category)!;
    const goal: Goal = {
      id: Date.now().toString(),
      category: newGoal.category,
      icon: cat.icon,
      color: cat.color,
      title: newGoal.title.trim(),
      target: `${newGoal.targetValue} ${TARGET_TYPES.find((t) => t.key === newGoal.targetType)?.label}`,
      targetType: newGoal.targetType,
      targetValue: newGoal.targetValue,
      createdAt: new Date().toISOString(),
    };
    saveGoals([...goals, goal]);
    setShowAddGoal(false);
    setNewGoal({
      category: "codingWork",
      title: "",
      targetType: "days_per_week",
      targetValue: 5,
    });
  };

  const deleteGoal = (id: string) =>
    saveGoals(goals.filter((g) => g.id !== id));

  // Compute goal progress
  const goalProgress = useMemo(() => {
    const now = new Date();
    return goals.map((goal) => {
      const cat = CATEGORY_OPTIONS.find((c) => c.key === goal.category);
      const logKey = cat?.logKey || goal.category;

      // Filter logs by time window
      let windowLogs = logs;
      if (goal.targetType === "days_per_week") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        windowLogs = logs.filter((l) => new Date(l.date) >= weekStart);
      } else if (goal.targetType === "days_per_month") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        windowLogs = logs.filter((l) => new Date(l.date) >= monthStart);
      }

      let current = 0;
      if (goal.targetType === "score") {
        const recent = logs.slice(-30);
        current =
          recent.length > 0
            ? recent.reduce((s, l) => s + (l.score || 0), 0) / recent.length
            : 0;
      } else if (goal.targetType === "streak") {
        let streak = 0;
        for (let i = logs.length - 1; i >= 0; i--) {
          if (logs[i][logKey]) streak++;
          else break;
        }
        current = streak;
      } else {
        current = windowLogs.filter((l) => l[logKey]).length;
      }

      const pct = Math.min(current / goal.targetValue, 1);

      // Weekly trend (last 4 weeks)
      const weeklyTrend = [0, 1, 2, 3]
        .map((weeksAgo) => {
          const wEnd = new Date(now);
          wEnd.setDate(wEnd.getDate() - weeksAgo * 7);
          const wStart = new Date(wEnd);
          wStart.setDate(wStart.getDate() - 6);
          const wLogs = logs.filter((l) => {
            const d = new Date(l.date);
            return d >= wStart && d <= wEnd;
          });
          if (goal.targetType === "score") {
            return wLogs.length > 0
              ? wLogs.reduce((s, l) => s + (l.score || 0), 0) / wLogs.length
              : 0;
          }
          return wLogs.filter((l) => l[logKey]).length;
        })
        .reverse();

      const insight = (() => {
        if (pct >= 1)
          return `🎉 Goal achieved! You're ${(current - goal.targetValue).toFixed(goal.targetType === "score" ? 1 : 0)} ahead of target.`;
        const remaining = goal.targetValue - current;
        if (goal.targetType === "days_per_week")
          return `${remaining} more day${remaining !== 1 ? "s" : ""} needed this week.`;
        if (goal.targetType === "days_per_month")
          return `${remaining} more day${remaining !== 1 ? "s" : ""} needed this month.`;
        if (goal.targetType === "streak")
          return `Maintain ${remaining} more consecutive days to hit your streak goal.`;
        return `Need ${remaining.toFixed(1)} more average score points over last 30 days.`;
      })();

      return { goal, current, pct, insight, weeklyTrend };
    });
  }, [goals, logs]);

  // Overall goal health
  const overallHealth = useMemo(() => {
    if (goalProgress.length === 0) return null;
    const achieved = goalProgress.filter((g) => g.pct >= 1).length;
    const onTrack = goalProgress.filter(
      (g) => g.pct >= 0.5 && g.pct < 1,
    ).length;
    const needsFocus = goalProgress.filter((g) => g.pct < 0.5).length;
    return { achieved, onTrack, needsFocus, total: goalProgress.length };
  }, [goalProgress]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#060910] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
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
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Ambient */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-[15%] w-[500px] h-[500px] bg-emerald-700/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-indigo-700/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-10 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.35em] text-emerald-400 uppercase mb-1 font-medium">
                Goal Engine
              </p>
              <h1 className="text-4xl font-black tracking-tight">
                Smart Goals,
                <br />
                <span className="text-emerald-400">Real Progress.</span>
              </h1>
              <p className="text-gray-600 text-sm mt-2">
                {goals.length} active goals · {logs.length} days of data
              </p>
            </div>

            <button
              onClick={() => setShowAddGoal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 {textMuted}  font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-emerald-500/25"
            >
              + New Goal
            </button>
          </div>

          {/* Overall Health */}
          {overallHealth && (
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Achieved",
                  value: overallHealth.achieved,
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10 border-emerald-500/20",
                  icon: "✅",
                },
                {
                  label: "On Track",
                  value: overallHealth.onTrack,
                  color: "text-amber-400",
                  bg: "bg-amber-500/10 border-amber-500/20",
                  icon: "📈",
                },
                {
                  label: "Needs Focus",
                  value: overallHealth.needsFocus,
                  color: "text-rose-400",
                  bg: "bg-rose-500/10 border-rose-500/20",
                  icon: "🚨",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`${s.bg} border rounded-2xl p-4 text-center`}
                >
                  <p className="text-3xl mb-1">{s.icon}</p>
                  <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Add Goal Modal */}
          {showAddGoal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
              <div className="w-full max-w-md bg-[#0d1117] border border-white/10 rounded-3xl p-7 shadow-2xl space-y-5 animate-[slideUp_0.3s_ease]">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black">Set New Goal</h3>
                  <button
                    onClick={() => setShowAddGoal(false)}
                    className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:{textMuted}  transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                    Category
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORY_OPTIONS.map((cat) => (
                      <button
                        key={cat.key}
                        onClick={() =>
                          setNewGoal((g) => ({ ...g, category: cat.key }))
                        }
                        className="flex flex-col items-center gap-1 p-3 rounded-xl border transition text-xs font-medium"
                        style={{
                          background:
                            newGoal.category === cat.key
                              ? `${cat.color}25`
                              : "rgba(255,255,255,0.03)",
                          borderColor:
                            newGoal.category === cat.key
                              ? `${cat.color}60`
                              : "rgba(255,255,255,0.06)",
                          color:
                            newGoal.category === cat.key
                              ? cat.color
                              : "#6b7280",
                        }}
                      >
                        <span className="text-lg">{cat.icon}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                    Goal Title
                  </label>
                  <input
                    value={newGoal.title}
                    onChange={(e) =>
                      setNewGoal((g) => ({ ...g, title: e.target.value }))
                    }
                    placeholder="e.g. Code every day this week"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 {textMuted}  placeholder-gray-600 outline-none focus:border-emerald-500/40 transition text-sm"
                  />
                </div>

                {/* Target type + value */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                      Type
                    </label>
                    <select
                      value={newGoal.targetType}
                      onChange={(e) =>
                        setNewGoal((g) => ({
                          ...g,
                          targetType: e.target.value as any,
                        }))
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 {textMuted}  outline-none text-sm"
                    >
                      {TARGET_TYPES.map((t) => (
                        <option
                          key={t.key}
                          value={t.key}
                          className="bg-[#0d1117]"
                        >
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">
                      Target
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={newGoal.targetType === "score" ? 10 : 31}
                      value={newGoal.targetValue}
                      onChange={(e) =>
                        setNewGoal((g) => ({
                          ...g,
                          targetValue: Number(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 {textMuted}  outline-none text-sm text-center font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={addGoal}
                  disabled={!newGoal.title.trim()}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 {textMuted}  font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Create Goal
                </button>
              </div>
            </div>
          )}

          {/* Goals list */}
          {goalProgress.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <p className="text-6xl">🎯</p>
              <h3 className="text-2xl font-black {textMuted} ">No goals yet</h3>
              <p className="text-gray-600">
                Set your first goal to start tracking progress
              </p>
              <button
                onClick={() => setShowAddGoal(true)}
                className="px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-semibold hover:bg-emerald-500/30 transition"
              >
                + Add Your First Goal
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {goalProgress.map(
                ({ goal, current, pct, insight, weeklyTrend }) => {
                  const { circ, dash } = getRingProgress(
                    current,
                    goal.targetValue,
                  );
                  const statusColor = getStatusColor(pct);
                  const isOpen = activeGoal === goal.id;

                  return (
                    <div
                      key={goal.id}
                      className="rounded-3xl border backdrop-blur-sm transition-all duration-300 overflow-hidden"
                      style={{
                        background: `${goal.color}08`,
                        borderColor: `${goal.color}25`,
                      }}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-5">
                          {/* Progress Ring */}
                          <div className="flex-shrink-0 relative w-24 h-24">
                            <svg
                              className="w-full h-full -rotate-90"
                              viewBox="0 0 96 96"
                            >
                              <circle
                                cx="48"
                                cy="48"
                                r="42"
                                fill="none"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="7"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="42"
                                fill="none"
                                stroke={statusColor}
                                strokeWidth="7"
                                strokeLinecap="round"
                                strokeDasharray={`${dash} ${circ}`}
                                style={{
                                  transition:
                                    "stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)",
                                }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl">{goal.icon}</span>
                              <span
                                className="text-xs font-black"
                                style={{ color: statusColor }}
                              >
                                {Math.round(pct * 100)}%
                              </span>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-black {textMuted}  text-sm leading-tight">
                                  {goal.title}
                                </h3>
                                <p className="text-[10px] text-gray-600 mt-0.5 uppercase tracking-wider">
                                  {goal.target}
                                </p>
                              </div>
                              <button
                                onClick={() => deleteGoal(goal.id)}
                                className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-gray-600 hover:text-rose-400 transition text-xs flex-shrink-0"
                              >
                                ✕
                              </button>
                            </div>

                            <div className="mt-3">
                              <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-2xl font-black {textMuted} ">
                                  {goal.targetType === "score"
                                    ? current.toFixed(1)
                                    : current}
                                </span>
                                <span className="text-gray-600 text-xs">
                                  / {goal.targetValue}
                                </span>
                              </div>
                              <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-1000"
                                  style={{
                                    width: `${Math.min(pct * 100, 100)}%`,
                                    background: statusColor,
                                  }}
                                />
                              </div>
                            </div>

                            <p
                              className="text-[10px] mt-2 font-medium"
                              style={{ color: statusColor }}
                            >
                              {getStatusLabel(pct)}
                            </p>
                          </div>
                        </div>

                        {/* Insight */}
                        <div className="mt-4 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                          <p className="text-xs text-gray-400 leading-relaxed">
                            {insight}
                          </p>
                        </div>

                        {/* Expand button */}
                        <button
                          onClick={() => setActiveGoal(isOpen ? null : goal.id)}
                          className="mt-3 w-full text-xs text-gray-600 hover:text-gray-300 transition flex items-center justify-center gap-1"
                        >
                          {isOpen ? "Hide trend ↑" : "View trend ↓"}
                        </button>
                      </div>

                      {/* Weekly Trend */}
                      {isOpen && (
                        <div
                          className="border-t px-6 py-4 animate-[slideUp_0.3s_ease]"
                          style={{ borderColor: `${goal.color}20` }}
                        >
                          <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-3">
                            4-Week Trend
                          </p>
                          <div className="flex items-end gap-2 h-16">
                            {weeklyTrend.map((v, i) => {
                              const maxV = Math.max(...weeklyTrend, 1);
                              const h = (v / maxV) * 100;
                              const col = getStatusColor(v / goal.targetValue);
                              return (
                                <div
                                  key={i}
                                  className="flex-1 flex flex-col items-center gap-1"
                                >
                                  <span
                                    className="text-[9px]"
                                    style={{ color: col }}
                                  >
                                    {goal.targetType === "score"
                                      ? v.toFixed(1)
                                      : v}
                                  </span>
                                  <div
                                    className="w-full relative"
                                    style={{ height: "40px" }}
                                  >
                                    <div
                                      className="absolute bottom-0 w-full rounded-t-md"
                                      style={{
                                        height: `${Math.max(h, v > 0 ? 10 : 0)}%`,
                                        background: `${col}35`,
                                        border: `1px solid ${col}50`,
                                        borderBottom: "none",
                                      }}
                                    />
                                  </div>
                                  <span className="text-[8px] text-gray-600">
                                    W{i + 1}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          )}

          {/* Tips */}
          {logs.length >= 7 && goals.length > 0 && (
            <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5">
              <p className="text-xs text-emerald-400 uppercase tracking-wider mb-3">
                💡 Personalized Tips
              </p>
              <div className="space-y-2">
                {goalProgress
                  .filter((g) => g.pct < 0.5)
                  .slice(0, 3)
                  .map(({ goal, pct }) => (
                    <div
                      key={goal.id}
                      className="flex items-start gap-3 text-xs text-gray-400"
                    >
                      <span>{goal.icon}</span>
                      <span>
                        <span className="{textMuted}  font-semibold">
                          {goal.title}
                        </span>{" "}
                        is at {Math.round(pct * 100)}% — try scheduling it
                        earlier in your day for better consistency.
                      </span>
                    </div>
                  ))}
                {goalProgress
                  .filter((g) => g.pct >= 1)
                  .map(({ goal }) => (
                    <div
                      key={goal.id}
                      className="flex items-start gap-3 text-xs text-gray-400"
                    >
                      <span>🎉</span>
                      <span>
                        <span className="{textMuted}  font-semibold">
                          {goal.title}
                        </span>{" "}
                        goal is complete — consider raising the target to keep
                        growing!
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
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
