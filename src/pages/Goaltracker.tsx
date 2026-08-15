import { useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  BriefcaseBusiness,
  ChevronDown,
  ChevronUp,
  Code2,
  GraduationCap,
  PenLine,
  Plus,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

type Props = { userId: number };
type GoalType = "days_per_week" | "days_per_month" | "streak" | "score";
type Goal = {
  id: string;
  category: string;
  icon?: string;
  color: string;
  title: string;
  target: string;
  targetType: GoalType;
  targetValue: number;
  createdAt: string;
};
type GoalProgress = {
  goal: Goal;
  current: number;
  pct: number;
  insight: string;
  weeklyTrend: number[];
};

const CATEGORY_OPTIONS = [
  {
    key: "bibleReading",
    label: "Bible Reading",
    color: "#5e5ce6",
    logKey: "bibleReading",
    icon: BookOpen,
  },
  {
    key: "bookReading",
    label: "Book Reading",
    color: "#af52de",
    logKey: "bookReading",
    icon: BookOpen,
  },
  {
    key: "codingWork",
    label: "Coding",
    color: "#007aff",
    logKey: "codingWork",
    icon: Code2,
  },
  {
    key: "csTopic",
    label: "CS Learning",
    color: "#30b0c7",
    logKey: "csTopic",
    icon: GraduationCap,
  },
  {
    key: "collegeActivity",
    label: "College",
    color: "#4c8dff",
    logKey: "collegeActivity",
    icon: GraduationCap,
  },
  {
    key: "diary",
    label: "Journaling",
    color: "#d77a1f",
    logKey: "diary",
    icon: PenLine,
  },
  {
    key: "movie",
    label: "Movie",
    color: "#e85d75",
    logKey: "movie",
    icon: Sparkles,
  },
  {
    key: "score",
    label: "Daily Score",
    color: "#d77a1f",
    logKey: "score",
    icon: Target,
  },
  {
    key: "phoneUsage",
    label: "Phone Limit",
    color: "#e85d75",
    logKey: "phoneUsage",
    icon: BriefcaseBusiness,
  },
];
const TARGET_TYPES: { key: GoalType; label: string }[] = [
  { key: "days_per_week", label: "Days / Week" },
  { key: "days_per_month", label: "Days / Month" },
  { key: "streak", label: "Streak (days)" },
  { key: "score", label: "Average score" },
];

function statusFor(pct: number) {
  if (pct >= 1) return { label: "Achieved", color: "#248a3d" };
  if (pct >= 0.7) return { label: "On track", color: "#007aff" };
  return { label: "Needs focus", color: "#d77a1f" };
}

function CategoryIcon({
  category,
  size = 18,
}: {
  category: string;
  size?: number;
}) {
  const option = CATEGORY_OPTIONS.find((item) => item.key === category);
  const Icon = option?.icon || Target;
  return <Icon size={size} aria-hidden="true" />;
}

export default function GoalTracker({ userId }: Props) {
  const { darkMode } = useTheme();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [activeGoal, setActiveGoal] = useState<string | null>(null);
  const [newGoal, setNewGoal] = useState({
    category: "codingWork",
    title: "",
    targetType: "days_per_week" as GoalType,
    targetValue: 5,
  });

  useEffect(() => {
    const saved = localStorage.getItem(`goals_${userId}`);
    if (saved) setGoals(JSON.parse(saved));
    const loadLogs = async () => {
      try {
        const response = await fetch(
          "https://ai-life-tracker.onrender.com/api/daily",
        );
        const data = await response.json();
        setLogs(
          data
            .filter((log: any) => log.user?.id === userId)
            .sort(
              (a: any, b: any) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
            ),
        );
      } catch (loadError) {
        console.error("Could not load goal progress:", loadError);
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [userId]);

  const saveGoals = (updated: Goal[]) => {
    setGoals(updated);
    localStorage.setItem(`goals_${userId}`, JSON.stringify(updated));
  };
  const deleteGoal = (id: string) =>
    saveGoals(goals.filter((goal) => goal.id !== id));
  const addGoal = () => {
    if (!newGoal.title.trim()) return;
    const category = CATEGORY_OPTIONS.find(
      (item) => item.key === newGoal.category,
    )!;
    const type = TARGET_TYPES.find((item) => item.key === newGoal.targetType)!;
    saveGoals([
      ...goals,
      {
        id: Date.now().toString(),
        category: newGoal.category,
        color: category.color,
        title: newGoal.title.trim(),
        target: `${newGoal.targetValue} ${type.label}`,
        targetType: newGoal.targetType,
        targetValue: newGoal.targetValue,
        createdAt: new Date().toISOString(),
      },
    ]);
    setNewGoal({
      category: "codingWork",
      title: "",
      targetType: "days_per_week",
      targetValue: 5,
    });
    setShowAddGoal(false);
  };

  const goalProgress = useMemo<GoalProgress[]>(() => {
    const now = new Date();
    return goals.map((goal) => {
      const category = CATEGORY_OPTIONS.find(
        (item) => item.key === goal.category,
      );
      const logKey = category?.logKey || goal.category;
      let periodLogs = logs;
      if (goal.targetType === "days_per_week") {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        periodLogs = logs.filter((log) => new Date(log.date) >= start);
      }
      if (goal.targetType === "days_per_month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        periodLogs = logs.filter((log) => new Date(log.date) >= start);
      }
      let current = 0;
      if (goal.targetType === "score") {
        const recent = logs.slice(-30);
        current = recent.length
          ? recent.reduce((sum, log) => sum + (log.score || 0), 0) /
            recent.length
          : 0;
      } else if (goal.targetType === "streak") {
        for (
          let index = logs.length - 1;
          index >= 0 && logs[index][logKey];
          index -= 1
        )
          current += 1;
      } else current = periodLogs.filter((log) => log[logKey]).length;
      const pct = Math.min(current / goal.targetValue, 1);
      const weeklyTrend = [3, 2, 1, 0].map((weeksAgo) => {
        const end = new Date(now);
        end.setDate(end.getDate() - weeksAgo * 7);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);
        const week = logs.filter((log) => {
          const date = new Date(log.date);
          return date >= start && date <= end;
        });
        return goal.targetType === "score"
          ? week.length
            ? week.reduce((sum, log) => sum + (log.score || 0), 0) / week.length
            : 0
          : week.filter((log) => log[logKey]).length;
      });
      const remaining = goal.targetValue - current;
      const insight =
        pct >= 1
          ? `Goal achieved. You are ${Math.max(0, remaining * -1).toFixed(goal.targetType === "score" ? 1 : 0)} ahead of target.`
          : goal.targetType === "days_per_week"
            ? `${remaining} more day${remaining === 1 ? "" : "s"} needed this week.`
            : goal.targetType === "days_per_month"
              ? `${remaining} more day${remaining === 1 ? "" : "s"} needed this month.`
              : goal.targetType === "streak"
                ? `Maintain ${remaining} more consecutive days to reach this streak.`
                : `Need ${remaining.toFixed(1)} more average score points over the last 30 days.`;
      return { goal, current, pct, insight, weeklyTrend };
    });
  }, [goals, logs]);

  const health = useMemo(
    () => ({
      achieved: goalProgress.filter((item) => item.pct >= 1).length,
      onTrack: goalProgress.filter((item) => item.pct >= 0.5 && item.pct < 1)
        .length,
      needsFocus: goalProgress.filter((item) => item.pct < 0.5).length,
    }),
    [goalProgress],
  );

  if (loading)
    return (
      <div
        className={`goals-loading ${darkMode ? "goals-dark" : "goals-light"}`}
      >
        <span />
        <p>Preparing your goals</p>
      </div>
    );

  return (
    <main className={`goals-page ${darkMode ? "goals-dark" : "goals-light"}`}>
      <style>{`
        .goals-page,.goals-loading { --page:#f2f2f7;--surface:#fff;--surface-soft:#f7f7f9;--text:#1c1c1e;--muted:#6d6d72;--line:#dedee3;--blue:#007aff;--blue-soft:#e7f1ff;--red:#c7322b;--shadow:0 8px 24px rgba(20,20,30,.05);min-height:100%;background:var(--page);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Arial,sans-serif; }.goals-dark { --page:#000;--surface:#1c1c1e;--surface-soft:#2c2c2e;--text:#f5f5f7;--muted:#a1a1a6;--line:#38383a;--blue:#0a84ff;--blue-soft:#203a58;--red:#ff6961;--shadow:none; }.goals-shell { width:min(100%,700px);margin:0 auto;padding:24px 20px 106px;box-sizing:border-box; }.goals-loading { min-height:100svh;display:grid;place-items:center;align-content:center;gap:14px;color:var(--muted);font-size:15px; }.goals-loading span { width:32px;height:32px;border:3px solid var(--line);border-top-color:var(--blue);border-radius:50%;animation:goals-spin .8s linear infinite; } @keyframes goals-spin { to { transform:rotate(360deg); } }
        .goals-header { display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin-bottom:26px; }.goals-kicker { margin:0 0 7px;color:var(--muted);font-size:14px;font-weight:600; }.goals-title { margin:0;font-size:clamp(31px,8vw,40px);line-height:1.06;letter-spacing:-.052em;font-weight:730; }.goals-meta { margin:9px 0 0;color:var(--muted);font-size:14px; }.new-goal { min-width:48px;min-height:48px;padding:0 15px;border:0;border-radius:14px;display:flex;align-items:center;gap:7px;background:var(--blue);color:#fff;font:inherit;font-size:14px;font-weight:650;cursor:pointer; }.new-goal svg { width:17px; }.new-goal:active { transform:scale(.98); }
        .health-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:28px; }.health-card { min-height:98px;padding:13px 9px;border:1px solid var(--line);border-radius:18px;background:var(--surface);box-shadow:var(--shadow);text-align:center; }.health-card strong { display:block;font-size:27px;letter-spacing:-.05em; }.health-card span { display:block;margin-top:5px;color:var(--muted);font-size:11px;line-height:1.15; }.health-card.achieved strong { color:#248a3d; }.health-card.on-track strong { color:var(--blue); }.health-card.focus strong { color:#d77a1f; }
        .goal-list { display:grid;gap:13px; }.goal-card { overflow:hidden;border:1px solid var(--line);border-radius:24px;background:var(--surface);box-shadow:var(--shadow); }.goal-main { padding:18px; }.goal-top { display:flex;gap:14px;align-items:flex-start; }.goal-ring { width:82px;height:82px;position:relative;flex:0 0 82px; }.goal-ring svg { width:100%;height:100%;transform:rotate(-90deg); }.goal-ring-center { position:absolute;inset:0;display:grid;place-items:center;text-align:center; }.goal-ring-center span { display:block;font-size:12px;font-weight:730; }.goal-info { min-width:0;flex:1; }.goal-heading { display:flex;align-items:flex-start;justify-content:space-between;gap:8px; }.goal-heading h2 { margin:0;font-size:17px;line-height:1.25;letter-spacing:-.025em; }.goal-heading p { margin:4px 0 0;color:var(--muted);font-size:12px; }.delete-button { width:44px;height:44px;margin:-8px -8px 0 0;padding:0;border:0;border-radius:50%;display:grid;place-items:center;background:transparent;color:var(--muted);cursor:pointer; }.delete-button:hover { background:color-mix(in srgb,var(--red) 10%,transparent);color:var(--red); }.delete-button svg { width:18px; }.progress-value { margin:12px 0 7px;font-size:22px;font-weight:720;letter-spacing:-.04em; }.progress-value span { color:var(--muted);font-size:13px;font-weight:500;letter-spacing:0; }.progress-line { height:5px;overflow:hidden;border-radius:99px;background:var(--surface-soft); }.progress-line span { display:block;height:100%;border-radius:inherit; }.status { margin:8px 0 0;font-size:12px;font-weight:650; }.goal-insight { margin-top:16px;padding:13px 14px;border-radius:14px;background:var(--surface-soft);color:var(--muted);font-size:13px;line-height:1.42; }.trend-toggle { width:100%;min-height:44px;border:0;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:center;gap:5px;background:transparent;color:var(--blue);font:inherit;font-size:13px;font-weight:650;cursor:pointer; }.trend-toggle svg { width:16px; }.trend { padding:16px 18px 18px;border-top:1px solid var(--line); }.trend-label { margin:0 0 13px;color:var(--muted);font-size:12px;font-weight:600; }.trend-bars { height:84px;display:flex;align-items:flex-end;gap:8px; }.trend-bar { min-width:0;flex:1;display:flex;flex-direction:column;align-items:center;gap:5px; }.trend-bar-value { color:var(--muted);font-size:11px; }.trend-bar-column { width:100%;height:48px;position:relative;border-radius:8px 8px 3px 3px;background:var(--surface-soft);overflow:hidden; }.trend-bar-column span { position:absolute;right:0;bottom:0;left:0;border-radius:inherit;background:var(--blue); }.trend-bar small { color:var(--muted);font-size:10px; }
        .tips { margin-top:26px;padding:19px;border:1px solid var(--line);border-radius:22px;background:var(--surface);box-shadow:var(--shadow); }.tips-title { display:flex;align-items:center;gap:7px;margin:0 0 12px;font-size:16px;letter-spacing:-.02em; }.tips-title svg { color:var(--blue);width:18px; }.tip-row { display:flex;gap:10px;padding:9px 0;border-top:1px solid var(--line);color:var(--muted);font-size:13px;line-height:1.42; }.tip-row:first-of-type { border-top:0; }.tip-dot { width:7px;height:7px;flex:0 0 7px;margin-top:6px;border-radius:50%;background:var(--blue); }.tip-row strong { color:var(--text); }
        .empty { padding:44px 24px;border:1px solid var(--line);border-radius:24px;background:var(--surface);box-shadow:var(--shadow);text-align:center; }.empty svg { width:36px;height:36px;color:var(--blue); }.empty h2 { margin:13px 0 7px;font-size:23px;letter-spacing:-.04em; }.empty p { margin:0 auto 20px;max-width:270px;color:var(--muted);font-size:14px;line-height:1.45; }.empty button { min-height:46px;padding:0 16px;border:0;border-radius:13px;background:var(--blue);color:#fff;font:inherit;font-weight:650;cursor:pointer; }
        .modal-backdrop { position:fixed;inset:0;z-index:100;display:flex;align-items:flex-end;justify-content:center;padding:20px;background:rgba(0,0,0,.35);backdrop-filter:blur(5px); }.modal { width:min(100%,520px);max-height:88svh;overflow:auto;padding:24px 20px max(24px,env(safe-area-inset-bottom));border-radius:28px 28px 20px 20px;background:var(--surface);box-shadow:0 -10px 40px rgba(0,0,0,.18); }.modal-header { display:flex;align-items:center;justify-content:space-between;margin-bottom:21px; }.modal-header h2 { margin:0;font-size:23px;letter-spacing:-.035em; }.close-button { width:44px;height:44px;border:0;border-radius:50%;background:var(--surface-soft);color:var(--text);font-size:24px;cursor:pointer; }.field-label { display:block;margin:18px 0 8px;font-size:14px;font-weight:600; }.category-grid { display:grid;grid-template-columns:repeat(3,1fr);gap:8px; }.category-option { min-height:78px;padding:9px 5px;border:1px solid var(--line);border-radius:14px;background:var(--surface);color:var(--muted);font:inherit;font-size:11px;font-weight:600;cursor:pointer; }.category-option svg { display:block;margin:0 auto 5px;width:19px; }.category-option.selected { border-color:var(--blue);background:var(--blue-soft);color:var(--blue); }.modal-input,.modal-select { width:100%;min-height:50px;box-sizing:border-box;padding:0 14px;border:1px solid var(--line);border-radius:13px;outline:0;background:var(--surface-soft);color:var(--text);font:inherit;font-size:16px; }.modal-input:focus,.modal-select:focus { border-color:transparent;outline:0;background:var(--blue-soft);box-shadow:none; }.target-row { display:grid;grid-template-columns:1.45fr .75fr;gap:10px; }.create-goal { width:100%;min-height:50px;margin-top:22px;border:0;border-radius:14px;background:var(--blue);color:#fff;font:inherit;font-size:16px;font-weight:650;cursor:pointer; }.create-goal:disabled { opacity:.45;cursor:not-allowed; }.new-goal:focus-visible,.delete-button:focus-visible,.trend-toggle:focus-visible,.close-button:focus-visible,.category-option:focus-visible,.modal-input:focus-visible,.modal-select:focus-visible,.create-goal:focus-visible,.empty button:focus-visible { outline:3px solid color-mix(in srgb,var(--blue) 42%,transparent);outline-offset:2px; }
        @media (min-width:700px) { .goals-shell { padding-top:38px; }.goal-list { grid-template-columns:repeat(2,minmax(0,1fr)); }.modal-backdrop { align-items:center; }.modal { border-radius:28px; } } @media (prefers-reduced-motion:reduce) { .goals-page * { animation:none!important;transition:none!important; } }
      `}</style>
      <div className="goals-shell">
        <header className="goals-header">
          <div>
            <p className="goals-kicker">Goal Engine</p>
            <h1 className="goals-title">
              Smart goals.
              <br />
              Real progress.
            </h1>
            <p className="goals-meta">
              {goals.length} active goals · {logs.length} days of data
            </p>
          </div>
          <button
            className="new-goal"
            type="button"
            onClick={() => setShowAddGoal(true)}
          >
            <Plus /> <span>New goal</span>
          </button>
        </header>
        {goals.length > 0 && (
          <section className="health-grid" aria-label="Goal health">
            <div className="health-card achieved">
              <strong>{health.achieved}</strong>
              <span>Achieved</span>
            </div>
            <div className="health-card on-track">
              <strong>{health.onTrack}</strong>
              <span>On track</span>
            </div>
            <div className="health-card focus">
              <strong>{health.needsFocus}</strong>
              <span>Needs focus</span>
            </div>
          </section>
        )}
        {goalProgress.length === 0 ? (
          <section className="empty">
            <Target />
            <h2>Set your first goal</h2>
            <p>
              Give your daily actions a clear direction and watch your progress
              take shape.
            </p>
            <button type="button" onClick={() => setShowAddGoal(true)}>
              Add a goal
            </button>
          </section>
        ) : (
          <section className="goal-list">
            {goalProgress.map(
              ({ goal, current, pct, insight, weeklyTrend }) => {
                const status = statusFor(pct);
                const isOpen = activeGoal === goal.id;
                const circumference = 2 * Math.PI * 34;
                return (
                  <article className="goal-card" key={goal.id}>
                    <div className="goal-main">
                      <div className="goal-top">
                        <div className="goal-ring">
                          <svg viewBox="0 0 82 82">
                            <circle
                              cx="41"
                              cy="41"
                              r="34"
                              fill="none"
                              stroke="var(--surface-soft)"
                              strokeWidth="7"
                            />
                            <circle
                              cx="41"
                              cy="41"
                              r="34"
                              fill="none"
                              stroke={status.color}
                              strokeWidth="7"
                              strokeLinecap="round"
                              strokeDasharray={`${pct * circumference} ${circumference}`}
                            />
                          </svg>
                          <div className="goal-ring-center">
                            <CategoryIcon category={goal.category} size={20} />
                            <span style={{ color: status.color }}>
                              {Math.round(pct * 100)}%
                            </span>
                          </div>
                        </div>
                        <div className="goal-info">
                          <div className="goal-heading">
                            <div>
                              <h2>{goal.title}</h2>
                              <p>{goal.target}</p>
                            </div>
                            <button
                              className="delete-button"
                              type="button"
                              onClick={() => deleteGoal(goal.id)}
                              aria-label={`Delete ${goal.title}`}
                            >
                              <Trash2 />
                            </button>
                          </div>
                          <p className="progress-value">
                            {goal.targetType === "score"
                              ? current.toFixed(1)
                              : current}
                            <span> / {goal.targetValue}</span>
                          </p>
                          <div className="progress-line">
                            <span
                              style={{
                                width: `${pct * 100}%`,
                                background: status.color,
                              }}
                            />
                          </div>
                          <p className="status" style={{ color: status.color }}>
                            {status.label}
                          </p>
                        </div>
                      </div>
                      <p className="goal-insight">{insight}</p>
                    </div>
                    <button
                      className="trend-toggle"
                      type="button"
                      onClick={() => setActiveGoal(isOpen ? null : goal.id)}
                    >
                      {isOpen ? (
                        <>
                          Hide trend <ChevronUp />
                        </>
                      ) : (
                        <>
                          View 4-week trend <ChevronDown />
                        </>
                      )}
                    </button>
                    {isOpen && (
                      <div className="trend">
                        <p className="trend-label">Four-week trend</p>
                        <div className="trend-bars">
                          {weeklyTrend.map((value, index) => {
                            const height = Math.min(
                              (value / Math.max(...weeklyTrend, 1)) * 100,
                              100,
                            );
                            return (
                              <div className="trend-bar" key={index}>
                                <span className="trend-bar-value">
                                  {goal.targetType === "score"
                                    ? value.toFixed(1)
                                    : value}
                                </span>
                                <div className="trend-bar-column">
                                  <span
                                    style={{
                                      height: `${Math.max(height, value ? 10 : 0)}%`,
                                      background: statusFor(
                                        value / goal.targetValue,
                                      ).color,
                                    }}
                                  />
                                </div>
                                <small>W{index + 1}</small>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </article>
                );
              },
            )}
          </section>
        )}
        {logs.length >= 7 && goals.length > 0 && (
          <section className="tips">
            <h2 className="tips-title">
              <Sparkles />
              Personalized tips
            </h2>
            {goalProgress
              .filter((item) => item.pct < 0.5)
              .slice(0, 3)
              .map(({ goal, pct }) => (
                <div className="tip-row" key={goal.id}>
                  <span className="tip-dot" />
                  <span>
                    <strong>{goal.title}</strong> is at {Math.round(pct * 100)}
                    %. Try planning it earlier in your day for better
                    consistency.
                  </span>
                </div>
              ))}
            {goalProgress
              .filter((item) => item.pct >= 1)
              .map(({ goal }) => (
                <div className="tip-row" key={goal.id}>
                  <span className="tip-dot" />
                  <span>
                    <strong>{goal.title}</strong> is complete. Consider raising
                    the target to keep growing.
                  </span>
                </div>
              ))}
          </section>
        )}
      </div>
      {showAddGoal && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setShowAddGoal(false)}
        >
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-goal-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2 id="new-goal-title">Set new goal</h2>
              <button
                className="close-button"
                type="button"
                onClick={() => setShowAddGoal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <label className="field-label">Category</label>
            <div className="category-grid">
              {CATEGORY_OPTIONS.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  className={`category-option ${newGoal.category === category.key ? "selected" : ""}`}
                  onClick={() =>
                    setNewGoal((state) => ({
                      ...state,
                      category: category.key,
                    }))
                  }
                >
                  <CategoryIcon category={category.key} />
                  {category.label}
                </button>
              ))}
            </div>
            <label className="field-label" htmlFor="goal-title">
              Goal title
            </label>
            <input
              className="modal-input"
              id="goal-title"
              value={newGoal.title}
              onChange={(event) =>
                setNewGoal((state) => ({ ...state, title: event.target.value }))
              }
              placeholder="e.g. Code every day this week"
            />
            <div className="target-row">
              <div>
                <label className="field-label" htmlFor="goal-type">
                  Type
                </label>
                <select
                  className="modal-select"
                  id="goal-type"
                  value={newGoal.targetType}
                  onChange={(event) =>
                    setNewGoal((state) => ({
                      ...state,
                      targetType: event.target.value as GoalType,
                    }))
                  }
                >
                  {TARGET_TYPES.map((type) => (
                    <option key={type.key} value={type.key}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="goal-target">
                  Target
                </label>
                <input
                  className="modal-input"
                  id="goal-target"
                  type="number"
                  min={1}
                  max={newGoal.targetType === "score" ? 10 : 31}
                  value={newGoal.targetValue}
                  onChange={(event) =>
                    setNewGoal((state) => ({
                      ...state,
                      targetValue: Number(event.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <button
              className="create-goal"
              type="button"
              disabled={!newGoal.title.trim()}
              onClick={addGoal}
            >
              Create goal
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
