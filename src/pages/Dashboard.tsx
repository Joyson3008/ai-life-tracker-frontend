import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleUserRound,
  Code2,
  Globe2,
  Heart,
  ListTodo,
  Sparkles,
  Target,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

type Props = { userId: number };
type DailyLog = Record<string, any>;

function progressFor(log: DailyLog | undefined, keys: string[]) {
  if (!log) return 0;
  return keys.some((key) => Boolean(log[key])) ? 72 : 18;
}

export default function Dashboard({ userId }: Props) {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadLogs = async () => {
      try {
        setError("");
        const response = await fetch(
          "https://ai-life-tracker.onrender.com/api/daily",
        );
        if (!response.ok) throw new Error("Unable to load your dashboard.");
        const data = await response.json();
        const userLogs = data
          .filter((log: DailyLog) => log.user?.id === userId)
          .sort(
            (a: DailyLog, b: DailyLog) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          );
        setLogs(userLogs);
      } catch (loadError) {
        console.error(loadError);
        setError("We couldn't load your dashboard. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadLogs();
  }, [userId]);

  const latest = logs[logs.length - 1];
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    return hour < 12
      ? "Good morning"
      : hour < 17
        ? "Good afternoon"
        : "Good evening";
  }, []);

  const streak = useMemo(() => {
    let count = 0;
    for (let index = logs.length - 1; index >= 0; index -= 1) {
      if ((logs[index].score || 0) >= 6) count += 1;
      else break;
    }
    return count;
  }, [logs]);

  const actions = useMemo(
    () => [
      {
        id: "read",
        title: "Read for 30 minutes",
        detail: "Personal growth",
        done: Boolean(latest?.bookReading || latest?.bibleReading),
      },
      {
        id: "code",
        title: "Practice coding",
        detail: "Skill building",
        done: Boolean(latest?.codingWork),
      },
      {
        id: "learn",
        title: "Learn something new",
        detail: "Curiosity",
        done: Boolean(latest?.csTopic || latest?.collegeActivity),
      },
      {
        id: "reflect",
        title: "Reflect on today",
        detail: "Daily journal",
        done: Boolean(latest?.diary),
      },
    ],
    [latest],
  );

  useEffect(() => {
    setCompleted(
      Object.fromEntries(actions.map((action) => [action.id, action.done])),
    );
  }, [actions]);

  const completedCount = actions.filter(
    (action) => completed[action.id],
  ).length;
  const todayProgress = Math.round((completedCount / actions.length) * 100);
  const insight =
    latest?.finalSummary ||
    latest?.motivation ||
    "A small intentional action today can make tomorrow feel lighter. Choose one thing that matters and begin there.";
  const score = latest?.score ?? 0;

  const areas = [
    {
      title: "What I love",
      description: "Interests and energy",
      icon: Heart,
      progress: progressFor(latest, ["diary", "movie", "bookReading"]),
      color: "rose",
    },
    {
      title: "What I'm good at",
      description: "Skills and strengths",
      icon: Code2,
      progress: progressFor(latest, ["codingWork", "csTopic"]),
      color: "blue",
    },
    {
      title: "What the world needs",
      description: "Contribution and care",
      icon: Globe2,
      progress: progressFor(latest, ["collegeActivity", "diary"]),
      color: "green",
    },
    {
      title: "What I can be paid for",
      description: "Purposeful work",
      icon: BriefcaseBusiness,
      progress: progressFor(latest, ["codingWork", "collegeActivity"]),
      color: "orange",
    },
  ];

  if (loading) {
    return (
      <div
        className={`dashboard-loading ${darkMode ? "dashboard-dark" : "dashboard-light"}`}
      >
        <div className="loading-dot" />
        <p>Preparing your day</p>
      </div>
    );
  }

  return (
    <main
      className={`ikigai-dashboard ${darkMode ? "dashboard-dark" : "dashboard-light"}`}
    >
      <style>{`
        .ikigai-dashboard,.dashboard-loading { --page:#f2f2f7;--surface:#fff;--surface-soft:#f8f8fa;--text:#1c1c1e;--muted:#6d6d72;--line:#dedee3;--blue:#007aff;--blue-soft:#e7f1ff;--ring:#d9eaff;--shadow:0 8px 24px rgba(20,20,30,.05);min-height:100%;background:var(--page);color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","Helvetica Neue",Arial,sans-serif;}.dashboard-dark { --page:#000;--surface:#1c1c1e;--surface-soft:#2c2c2e;--text:#f5f5f7;--muted:#a1a1a6;--line:#38383a;--blue:#0a84ff;--blue-soft:#203a58;--ring:#203e60;--shadow:none; }
        .dashboard-shell { width:min(100%,640px);margin:0 auto;padding:24px 20px 106px;box-sizing:border-box; }.dashboard-loading { min-height:100svh;display:grid;place-items:center;align-content:center;gap:14px;color:var(--muted);font-size:15px; }.loading-dot { width:32px;height:32px;border-radius:50%;border:3px solid var(--ring);border-top-color:var(--blue);animation:dashboard-spin .8s linear infinite; } @keyframes dashboard-spin { to { transform:rotate(360deg); } }
        .dash-header { display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:28px; }.dash-kicker { margin:0 0 7px;color:var(--muted);font-size:15px; }.dash-heading { margin:0;max-width:320px;font-size:clamp(31px,8vw,40px);line-height:1.08;letter-spacing:-.052em;font-weight:730; }.profile-button { width:48px;height:48px;flex:0 0 48px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;color:var(--blue);background:var(--surface);box-shadow:var(--shadow);cursor:pointer; }.profile-button svg { width:23px;height:23px; }
        .ai-card { padding:22px;border:1px solid color-mix(in srgb,var(--blue) 17%,var(--line));border-radius:24px;background:linear-gradient(135deg,var(--blue-soft),var(--surface) 72%);box-shadow:var(--shadow); }.ai-card-top { display:flex;align-items:center;justify-content:space-between;gap:12px; }.ai-label { display:flex;align-items:center;gap:7px;color:var(--blue);font-size:13px;font-weight:700; }.ai-label svg { width:17px;height:17px; }.score-chip { padding:6px 9px;border-radius:999px;background:color-mix(in srgb,var(--blue) 12%,transparent);color:var(--blue);font-size:12px;font-weight:700; }.ai-copy { margin:15px 0 18px;font-size:17px;line-height:1.45;letter-spacing:-.012em; }.ai-button { min-height:44px;padding:0 15px;border:0;border-radius:12px;background:var(--blue);color:#fff;font:inherit;font-size:14px;font-weight:650;cursor:pointer; }.ai-button:active,.quick-pill:active,.action-row:active,.area-card:active,.profile-button:active { transform:scale(.98); }
        .section { margin-top:30px; }.section-header { display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin-bottom:14px; }.section-title { margin:0;font-size:21px;letter-spacing:-.03em; }.section-action { padding:4px;border:0;background:transparent;color:var(--blue);font:inherit;font-size:14px;font-weight:600;cursor:pointer; }
        .progress-card { display:grid;grid-template-columns:112px 1fr;gap:20px;align-items:center;padding:20px;border:1px solid var(--line);border-radius:24px;background:var(--surface);box-shadow:var(--shadow); }.progress-ring { width:112px;height:112px;position:relative;display:grid;place-items:center;border-radius:50%;background:conic-gradient(var(--blue) calc(var(--progress) * 1%),var(--ring) 0); }.progress-ring::before { content:"";position:absolute;inset:9px;border-radius:50%;background:var(--surface); }.progress-number { position:relative;z-index:1;text-align:center;font-size:26px;font-weight:730;letter-spacing:-.05em; }.progress-number span { display:block;margin-top:2px;color:var(--muted);font-size:11px;font-weight:500;letter-spacing:0; }.progress-summary h3 { margin:0;font-size:17px;letter-spacing:-.02em; }.progress-summary p { margin:5px 0 13px;color:var(--muted);font-size:14px; }.progress-stats { display:grid;grid-template-columns:repeat(3,1fr);gap:8px; }.progress-stat { padding-left:9px;border-left:2px solid var(--line); }.progress-stat strong { display:block;font-size:15px;letter-spacing:-.02em; }.progress-stat span { display:block;margin-top:2px;color:var(--muted);font-size:11px;line-height:1.2; }
        .action-list { overflow:hidden;border:1px solid var(--line);border-radius:20px;background:var(--surface);box-shadow:var(--shadow); }.action-row { width:100%;min-height:70px;padding:0 15px;border:0;border-bottom:1px solid var(--line);display:flex;align-items:center;gap:13px;background:transparent;color:var(--text);text-align:left;cursor:pointer; }.action-row:last-child { border-bottom:0; }.check-circle { width:25px;height:25px;flex:0 0 25px;border:1.5px solid var(--muted);border-radius:50%;display:grid;place-items:center;color:#fff; }.check-circle svg { width:15px;height:15px; }.action-row.done .check-circle { border-color:var(--blue);background:var(--blue); }.action-row.done .action-title { color:var(--muted);text-decoration:line-through; }.action-text { min-width:0;flex:1; }.action-title { display:block;font-size:16px;font-weight:560;letter-spacing:-.012em; }.action-detail { display:block;margin-top:3px;color:var(--muted);font-size:12px; }.action-row > svg { width:18px;color:var(--muted); }
        .area-grid { display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px; }.area-card { min-height:154px;padding:16px;border:1px solid var(--line);border-radius:20px;background:var(--surface);box-shadow:var(--shadow);text-align:left;color:var(--text);cursor:pointer; }.area-icon { width:36px;height:36px;display:grid;place-items:center;border-radius:12px;background:var(--surface-soft); }.area-icon svg { width:19px;height:19px; }.area-card.rose .area-icon { color:#e85d75; }.area-card.blue .area-icon { color:var(--blue); }.area-card.green .area-icon { color:#2e9f67; }.area-card.orange .area-icon { color:#d77a1f; }.area-card h3 { margin:13px 0 4px;font-size:15px;letter-spacing:-.02em; }.area-card p { margin:0;color:var(--muted);font-size:12px;line-height:1.3; }.area-progress { height:4px;margin-top:15px;overflow:hidden;border-radius:99px;background:var(--surface-soft); }.area-progress span { display:block;height:100%;border-radius:inherit;background:var(--blue); }
        .quick-scroll { display:flex;gap:9px;overflow-x:auto;padding:1px 0 4px;scrollbar-width:none; }.quick-scroll::-webkit-scrollbar { display:none; }.quick-pill { min-height:42px;white-space:nowrap;padding:0 14px;border:1px solid var(--line);border-radius:999px;background:var(--surface);color:var(--text);font:inherit;font-size:14px;font-weight:570;box-shadow:var(--shadow);cursor:pointer; }.quick-pill.primary { border-color:transparent;background:var(--blue);color:#fff; }.error-card,.empty-card { padding:24px;border:1px solid var(--line);border-radius:22px;background:var(--surface);box-shadow:var(--shadow);text-align:center; }.error-card p,.empty-card p { margin:8px 0 18px;color:var(--muted);font-size:14px;line-height:1.45; }.empty-card svg { width:32px;height:32px;color:var(--blue); }
        .profile-button:focus-visible,.ai-button:focus-visible,.section-action:focus-visible,.action-row:focus-visible,.area-card:focus-visible,.quick-pill:focus-visible { outline:3px solid color-mix(in srgb,var(--blue) 42%,transparent);outline-offset:2px; } @media (min-width:700px) { .dashboard-shell { padding-top:38px; }.ai-card { padding:26px; }.area-grid { grid-template-columns:repeat(4,minmax(0,1fr)); } } @media (prefers-reduced-motion:reduce) { .ikigai-dashboard * { animation:none!important;transition:none!important; } }
      `}</style>

      <div className="dashboard-shell">
        <header className="dash-header">
          <div>
            <p className="dash-kicker">{greeting}</p>
            <h1 className="dash-heading">Let's work on your Ikigai.</h1>
          </div>
          <button
            className="profile-button"
            type="button"
            onClick={() => navigate("/profile")}
            aria-label="Open profile"
          >
            <CircleUserRound />
          </button>
        </header>

        {error ? (
          <section className="error-card">
            <h2>Dashboard unavailable</h2>
            <p>{error}</p>
            <button
              className="ai-button"
              type="button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </section>
        ) : !latest ? (
          <section className="empty-card">
            <Target />
            <h2>Your first day starts here.</h2>
            <p>
              Track a few meaningful actions and ikigAI will turn them into
              useful, personal guidance.
            </p>
            <button
              className="ai-button"
              type="button"
              onClick={() => navigate("/track")}
            >
              Track today
            </button>
          </section>
        ) : (
          <>
            <section className="ai-card" aria-labelledby="ai-insight-title">
              <div className="ai-card-top">
                <span className="ai-label">
                  <Sparkles />
                  Your focus today
                </span>
                <span className="score-chip">Score {score}/10</span>
              </div>
              <p className="ai-copy" id="ai-insight-title">
                {insight}
              </p>
              <button
                className="ai-button"
                type="button"
                onClick={() => navigate("/predict")}
              >
                <Brain
                  size={16}
                  style={{ verticalAlign: "-3px", marginRight: 6 }}
                />
                Ask ikigAI
              </button>
            </section>

            <section className="section" aria-labelledby="today-title">
              <div className="section-header">
                <h2 className="section-title" id="today-title">
                  Today
                </h2>
                <button
                  className="section-action"
                  type="button"
                  onClick={() => navigate("/track")}
                >
                  Track day
                </button>
              </div>
              <div className="progress-card">
                <div
                  className="progress-ring"
                  style={{ "--progress": todayProgress } as CSSProperties}
                >
                  <div className="progress-number">
                    {todayProgress}%<span>complete</span>
                  </div>
                </div>
                <div className="progress-summary">
                  <h3>Keep the rhythm.</h3>
                  <p>Small actions create meaningful direction.</p>
                  <div className="progress-stats">
                    <div className="progress-stat">
                      <strong>
                        {completedCount}/{actions.length}
                      </strong>
                      <span>actions</span>
                    </div>
                    <div className="progress-stat">
                      <strong>{streak || "-"}</strong>
                      <span>day streak</span>
                    </div>
                    <div className="progress-stat">
                      <strong>{latest?.codingWork ? "Logged" : "Add"}</strong>
                      <span>focus</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="section" aria-labelledby="actions-title">
              <div className="section-header">
                <h2 className="section-title" id="actions-title">
                  Today's actions
                </h2>
                <ListTodo size={19} color="var(--muted)" />
              </div>
              <div className="action-list">
                {actions.map((action) => (
                  <button
                    key={action.id}
                    className={`action-row ${completed[action.id] ? "done" : ""}`}
                    type="button"
                    onClick={() =>
                      setCompleted((state) => ({
                        ...state,
                        [action.id]: !state[action.id],
                      }))
                    }
                  >
                    <span className="check-circle">
                      {completed[action.id] && <Check />}
                    </span>
                    <span className="action-text">
                      <span className="action-title">{action.title}</span>
                      <span className="action-detail">{action.detail}</span>
                    </span>
                    <ChevronRight />
                  </button>
                ))}
              </div>
            </section>

            <section className="section" aria-labelledby="areas-title">
              <div className="section-header">
                <h2 className="section-title" id="areas-title">
                  Your Ikigai areas
                </h2>
                <button
                  className="section-action"
                  type="button"
                  onClick={() => navigate("/goals")}
                >
                  Explore
                </button>
              </div>
              <div className="area-grid">
                {areas.map((area) => {
                  const AreaIcon = area.icon;
                  return (
                    <button
                      className={`area-card ${area.color}`}
                      key={area.title}
                      type="button"
                      onClick={() => navigate("/goals")}
                    >
                      <span className="area-icon">
                        <AreaIcon />
                      </span>
                      <h3>{area.title}</h3>
                      <p>{area.description}</p>
                      <div className="area-progress">
                        <span style={{ width: `${area.progress}%` }} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="section" aria-labelledby="quick-title">
              <div className="section-header">
                <h2 className="section-title" id="quick-title">
                  Quick actions
                </h2>
              </div>
              <div className="quick-scroll">
                <button
                  className="quick-pill primary"
                  type="button"
                  onClick={() => navigate("/predict")}
                >
                  <Sparkles
                    size={15}
                    style={{ verticalAlign: "-2px", marginRight: 5 }}
                  />
                  Ask ikigAI
                </button>
                <button
                  className="quick-pill"
                  type="button"
                  onClick={() => navigate("/track")}
                >
                  Plan my day
                </button>
                <button
                  className="quick-pill"
                  type="button"
                  onClick={() => navigate("/track")}
                >
                  Reflect
                </button>
                <button
                  className="quick-pill"
                  type="button"
                  onClick={() => navigate("/predict")}
                >
                  Find my strengths
                </button>
                <button
                  className="quick-pill"
                  type="button"
                  onClick={() => navigate("/goals")}
                >
                  Suggest a goal
                </button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
