import { useState } from "react";
import AIResult from "../components/AIResult";
import { useTheme } from "../context/ThemeContext";
import {
  BookOpen,
  GraduationCap,
  Laptop,
  Film,
  NotebookPen,
  Wallet,
  Dumbbell,
  Moon,
  Coffee,
  HeartPulse,
  Droplets,
  Wind,
  Sun,
  Star,
  Target,
  Flame,
  Plus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { generatePDF } from "../utils/PDFGenerator";

type Props = { userId: number };

// ─── DATA ─────────────────────────────────────────────────────────────────────

const expenseCategories = [
  { name: "Food", icon: "🍽️", color: "#f97316" },
  { name: "Travel", icon: "🚗", color: "#3b82f6" },
  { name: "Shopping", icon: "🛒", color: "#ec4899" },
  { name: "Education", icon: "📚", color: "#a855f7" },
  { name: "Rent", icon: "🏠", color: "#22c55e" },
  { name: "Bills", icon: "💡", color: "#eab308" },
  { name: "Entertainment", icon: "🎬", color: "#ef4444" },
  { name: "Health", icon: "❤️‍🩹", color: "#f43f5e" },
  { name: "Software", icon: "💻", color: "#6366f1" },
  { name: "Others", icon: "📦", color: "#6b7280" },
];

const phoneApps = [
  "Instagram",
  "YouTube",
  "WhatsApp",
  "Facebook",
  "X",
  "Twitter",
  "Reddit",
  "TikTok",
  "Other",
];
const moods = [
  { emoji: "😄", label: "Great", color: "#22c55e" },
  { emoji: "🙂", label: "Good", color: "#84cc16" },
  { emoji: "😐", label: "Neutral", color: "#eab308" },
  { emoji: "😔", label: "Low", color: "#f97316" },
  { emoji: "😤", label: "Stressed", color: "#ef4444" },
  { emoji: "😴", label: "Tired", color: "#8b5cf6" },
];

const sleepOptions = ["< 5h", "5h", "6h", "7h", "8h", "9h", "10h+"];
const waterOptions = ["0–1L", "1–2L", "2–3L", "3L+"];
const focusModes = ["Deep Work", "Meetings", "Learning", "Errands", "Mixed"];

const chapterLimits: Record<string, number> = {
  Genesis: 50,
  Exodus: 40,
  Leviticus: 27,
  Numbers: 36,
  Deuteronomy: 34,
  Joshua: 24,
  Judges: 21,
  Ruth: 4,
  "1 Samuel": 31,
  "2 Samuel": 24,
  "1 Kings": 22,
  "2 Kings": 25,
  "1 Chronicles": 29,
  "2 Chronicles": 36,
  Ezra: 10,
  Nehemiah: 13,
  Esther: 10,
  Job: 42,
  Psalms: 150,
  Proverbs: 31,
  Ecclesiastes: 12,
  "Song of Solomon": 8,
  Isaiah: 66,
  Jeremiah: 52,
  Lamentations: 5,
  Ezekiel: 48,
  Daniel: 12,
  Hosea: 14,
  Joel: 3,
  Amos: 9,
  Obadiah: 1,
  Jonah: 4,
  Micah: 7,
  Nahum: 3,
  Habakkuk: 3,
  Zephaniah: 3,
  Haggai: 2,
  Zechariah: 14,
  Malachi: 4,
  Matthew: 28,
  Mark: 16,
  Luke: 24,
  John: 21,
  Acts: 28,
  Romans: 16,
  "1 Corinthians": 16,
  "2 Corinthians": 13,
  Galatians: 6,
  Ephesians: 6,
  Philippians: 4,
  Colossians: 4,
  "1 Thessalonians": 5,
  "2 Thessalonians": 3,
  "1 Timothy": 6,
  "2 Timothy": 4,
  Titus: 3,
  Philemon: 1,
  Hebrews: 13,
  James: 5,
  "1 Peter": 5,
  "2 Peter": 3,
  "1 John": 5,
  "2 John": 1,
  "3 John": 1,
  Jude: 1,
  Revelation: 22,
};

const bibleBooks = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

// ─── SUBCOMPONENTS ─────────────────────────────────────────────────────────────

const SectionCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`relative rounded-2xl border backdrop-blur-xl overflow-hidden transition-colors duration-300 ${
        darkMode
          ? "bg-gradient-to-b from-white/[0.06] to-white/[0.02] border-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          : "bg-white border-slate-200 shadow-[0_2px_16px_rgba(0,0,0,0.06)]"
      } ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
      <div className="relative p-6">{children}</div>
    </div>
  );
};

const SectionHeader = ({
  icon,
  label,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  accent: string;
}) => (
  <div className="flex items-center gap-3 mb-5">
    <div
      className="flex items-center justify-center w-9 h-9 rounded-xl"
      style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
    >
      <span style={{ color: accent }}>{icon}</span>
    </div>
    <span className="font-semibold tracking-wide text-sm uppercase">
      {label}
    </span>
  </div>
);

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function TrackDay({ userId }: Props) {
  const { darkMode } = useTheme();

  // ── Theme-aware tokens ──
  const bg = darkMode ? "bg-[#060910]" : "bg-slate-100";
  const text = darkMode ? "text-white" : "text-slate-900";
  const textMuted = darkMode ? "text-gray-400" : "text-slate-500";
  const textFaint = darkMode ? "text-gray-600" : "text-slate-400";

  // Input styles
  const inputBase = darkMode
    ? "bg-black/30 border-white/[0.08] text-white placeholder-white/25 focus:border-indigo-500/60 focus:bg-black/40 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.10)]";

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-sm ${inputBase}`;

  const textareaClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-sm resize-none ${inputBase}`;

  // Select styles
  const selectClass = `px-3 py-2.5 rounded-xl border text-sm outline-none cursor-pointer transition-all ${
    darkMode
      ? "bg-black/30 border-white/[0.08] text-white/80 focus:border-indigo-500/50"
      : "bg-white border-slate-200 text-slate-800 focus:border-indigo-400"
  }`;

  // Counter button styles
  const counterBtnClass = `w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
    darkMode
      ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
      : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
  }`;

 

  // Stat chip
  const statChipClass = `flex flex-col items-center px-4 py-3 rounded-xl border transition-colors ${
    darkMode
      ? "bg-white/[0.04] border-white/[0.06]"
      : "bg-white border-slate-200 shadow-sm"
  }`;

  // Goal item
  const goalItemClass = `flex items-center gap-3 px-4 py-3 rounded-xl border mb-2 transition-colors ${
    darkMode
      ? "bg-white/[0.03] border-white/[0.06]"
      : "bg-slate-50 border-slate-200"
  }`;

  // Expense tag
  const expenseTagClass = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
    darkMode
      ? "bg-white/[0.04] border-white/[0.07] text-white/60"
      : "bg-slate-100 border-slate-200 text-slate-600"
  }`;

  // Bible reader box
  const bibleBoxClass = darkMode
    ? "bg-black/30 border-white/[0.05]"
    : "bg-slate-50 border-slate-200";

  // Progress bar track
  const progressTrackClass = darkMode ? "bg-white/[0.06]" : "bg-slate-200";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // ── State ──
  const [bibleBook, setBibleBook] = useState("John");
  const [bibleChapter, setBibleChapter] = useState(3);
  const [bibleContent, setBibleContent] = useState("");
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleReaderOpen, setBibleReaderOpen] = useState(false);

  const [sleepHours, setSleepHours] = useState("");
  const [waterIntake, setWaterIntake] = useState("");
  const [exerciseMin, setExerciseMin] = useState("");
  const [exerciseType, setExerciseType] = useState("");
  const [morningRoutine, setMorningRoutine] = useState(false);
  const [caffeineCount, setCaffeineCount] = useState(0);
  const [focusMode, setFocusMode] = useState("");

  const [todayGoals, setTodayGoals] = useState<string[]>([]);
  const [goalInput, setGoalInput] = useState("");
  const [goalsDone, setGoalsDone] = useState<boolean[]>([]);
  const [gratitude, setGratitude] = useState("");
  const [tomorrowPlan, setTomorrowPlan] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseList, setExpenseList] = useState<
    { category: string; amount: number }[]
  >([]);

  const [selectedApp, setSelectedApp] = useState("");
  const [appTime, setAppTime] = useState("");
  const [customApp, setCustomApp] = useState("");
  const [appList, setAppList] = useState<{ name: string; time: number }[]>([]);

  const [selectedMood, setSelectedMood] = useState("");
  const [diaryTitle, setDiaryTitle] = useState("");

  const [form, setForm] = useState({
    bibleReading: "",
    bookReading: "",
    codingWork: "",
    csTopic: "",
    collegeActivity: "",
    diary: "",
    expenses: "",
    movie: "",
    phoneUsage: "",
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const fetchBibleChapter = async () => {
    setBibleLoading(true);
    try {
      const res = await fetch(
        `https://bible-api.com/${bibleBook}%20${bibleChapter}`,
      );
      const data = await res.json();
      setBibleContent(
        data.verses.map((v: any) => `${v.verse}. ${v.text}`).join("\n"),
      );
      setBibleReaderOpen(true);
    } catch {
      setBibleContent("Error loading chapter");
    }
    setBibleLoading(false);
  };

  const addGoal = () => {
    if (!goalInput.trim()) return;
    setTodayGoals([...todayGoals, goalInput.trim()]);
    setGoalsDone([...goalsDone, false]);
    setGoalInput("");
  };

  const toggleGoal = (i: number) => {
    const updated = [...goalsDone];
    updated[i] = !updated[i];
    setGoalsDone(updated);
  };

  const removeGoal = (i: number) => {
    setTodayGoals(todayGoals.filter((_, j) => j !== i));
    setGoalsDone(goalsDone.filter((_, j) => j !== i));
  };

  const addExpense = () => {
    if (!selectedCategory || !expenseAmount) {
      alert("Select category and amount");
      return;
    }
    setExpenseList([
      ...expenseList,
      { category: selectedCategory, amount: Number(expenseAmount) },
    ]);
    setExpenseAmount("");
    setSelectedCategory("");
  };

  const addAppUsage = () => {
    const name = selectedApp === "Other" ? customApp : selectedApp;
    if (!name || !appTime) {
      alert("Select app and time");
      return;
    }
    setAppList([...appList, { name, time: Number(appTime) }]);
    setSelectedApp("");
    setAppTime("");
    setCustomApp("");
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const totalExpense =
        expenseList.length > 0
          ? expenseList.reduce((s, i) => s + i.amount, 0)
          : Number(form.expenses) || null;

      const wellnessSummary = [
        sleepHours && `Sleep: ${sleepHours}`,
        waterIntake && `Water: ${waterIntake}`,
        exerciseMin &&
          `Exercise: ${exerciseMin}min${exerciseType ? ` (${exerciseType})` : ""}`,
        morningRoutine && "Morning routine: completed",
        caffeineCount && `Caffeine: ${caffeineCount} cup(s)`,
        focusMode && `Focus mode: ${focusMode}`,
      ]
        .filter(Boolean)
        .join(", ");

      const goalSummary =
        todayGoals.length > 0
          ? todayGoals
              .map((g, i) => `${goalsDone[i] ? "✓" : "✗"} ${g}`)
              .join("; ")
          : "";

      const res = await fetch(`http://localhost:8080/api/daily/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          bibleReading: `${bibleBook} ${bibleChapter}`,
          expenses: totalExpense,
          phoneUsage:
            appList.length > 0
              ? appList.map((a) => `${a.name} ${a.time}min`).join(", ")
              : form.phoneUsage,
          diary: [
            selectedMood && `Mood: ${selectedMood}`,
            diaryTitle && `Title: ${diaryTitle}`,
            form.diary,
            wellnessSummary && `Wellness — ${wellnessSummary}`,
            goalSummary && `Goals — ${goalSummary}`,
            gratitude && `Gratitude: ${gratitude}`,
            tomorrowPlan && `Tomorrow's plan: ${tomorrowPlan}`,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setResult(await res.json());
    } catch {
      alert("❌ Failed to analyze. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  const completedGoals = goalsDone.filter(Boolean).length;
  const totalExpenses = expenseList.reduce((s, e) => s + e.amount, 0);
  const totalScreenMin = appList.reduce((s, a) => s + a.time, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        .track-root { font-family: 'Sora', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        .pill-btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 500;
          border: 1px solid; cursor: pointer; transition: all 0.18s ease; white-space: nowrap;
        }

        .submit-btn {
          position: relative; overflow: hidden; padding: 16px 48px;
          border-radius: 16px; font-size: 16px; font-weight: 600; cursor: pointer;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
          border: 1px solid rgba(255,255,255,0.15); color: white;
          box-shadow: 0 8px 32px rgba(99,102,241,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: all 0.2s ease; letter-spacing: 0.02em;
        }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(99,102,241,0.5); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
          pointer-events:none;
        }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
      `}</style>

      <div
        className={`track-root min-h-screen ${bg} ${text} transition-colors duration-300`}
        style={{
          background: darkMode
            ? "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 60%), #050812"
            : "linear-gradient(160deg, #f8faff 0%, #f1f5f9 40%, #eef2ff 100%)",
        }}
      >
        <div className="max-w-4xl mx-auto px-5 py-10 pb-24">
          {/* ── HEADER ── */}
          <div className="mb-10">
            <p
              className={`mono text-xs uppercase tracking-widest mb-1 ${textFaint}`}
            >
              {today}
            </p>
            <div className="flex items-end justify-between flex-wrap gap-4">
             <div>
  <h1
    className="text-4xl font-bold tracking-tight"
    style={
      darkMode
        ? {
            background:
              "linear-gradient(135deg, #ffffff 40%, rgba(255,255,255,0.6))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }
        : {
            color: "#1e293b", // 🔥 solid color for visibility
          }
    }
  >
    Daily Log
  </h1>

  <p className={`mt-1 text-sm ${textMuted}`}>
    Track what matters. AI will do the rest.
  </p>
</div>
              {/* Live mini stats */}
              <div className="flex gap-3 flex-wrap">
                {totalExpenses > 0 && (
                  <div className={statChipClass}>
                    <span className="text-emerald-500 font-semibold text-sm mono">
                      ₹{totalExpenses}
                    </span>
                    <span className={`text-xs ${textFaint}`}>spent</span>
                  </div>
                )}
                {totalScreenMin > 0 && (
                  <div className={statChipClass}>
                    <span className="text-pink-500 font-semibold text-sm mono">
                      {totalScreenMin}m
                    </span>
                    <span className={`text-xs ${textFaint}`}>screen</span>
                  </div>
                )}
                {todayGoals.length > 0 && (
                  <div className={statChipClass}>
                    <span className="text-indigo-500 font-semibold text-sm mono">
                      {completedGoals}/{todayGoals.length}
                    </span>
                    <span className={`text-xs ${textFaint}`}>goals</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {/* ── 1. WELLNESS & VITALS ── */}
            <SectionCard>
              <SectionHeader
                icon={<HeartPulse size={16} />}
                label="Wellness & Vitals"
                accent="#f43f5e"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
                {/* Sleep */}
                <div>
                  <label
                    className={`text-xs mb-2 flex items-center gap-1 ${textMuted}`}
                  >
                    <Moon size={11} /> Sleep
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {sleepOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSleepHours(s)}
                        className="pill-btn"
                        style={
                          sleepHours === s
                            ? {
                                background: "rgba(99,102,241,0.15)",
                                borderColor: "rgba(99,102,241,0.5)",
                                color: darkMode ? "#a5b4fc" : "#4f46e5",
                              }
                            : {
                                background: darkMode
                                  ? "rgba(255,255,255,0.05)"
                                  : "#f8fafc",
                                borderColor: darkMode
                                  ? "rgba(255,255,255,0.08)"
                                  : "#e2e8f0",
                                color: darkMode
                                  ? "rgba(255,255,255,0.5)"
                                  : "#64748b",
                              }
                        }
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Water */}
                <div>
                  <label
                    className={`text-xs mb-2 flex items-center gap-1 ${textMuted}`}
                  >
                    <Droplets size={11} /> Water
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {waterOptions.map((w) => (
                      <button
                        key={w}
                        onClick={() => setWaterIntake(w)}
                        className="pill-btn"
                        style={
                          waterIntake === w
                            ? {
                                background: "rgba(99,102,241,0.15)",
                                borderColor: "rgba(99,102,241,0.5)",
                                color: darkMode ? "#a5b4fc" : "#4f46e5",
                              }
                            : {
                                background: darkMode
                                  ? "rgba(255,255,255,0.05)"
                                  : "#f8fafc",
                                borderColor: darkMode
                                  ? "rgba(255,255,255,0.08)"
                                  : "#e2e8f0",
                                color: darkMode
                                  ? "rgba(255,255,255,0.5)"
                                  : "#64748b",
                              }
                        }
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exercise */}
                <div>
                  <label
                    className={`text-xs mb-2 flex items-center gap-1 ${textMuted}`}
                  >
                    <Dumbbell size={11} /> Exercise
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={0}
                      placeholder="min"
                      value={exerciseMin}
                      onChange={(e) => setExerciseMin(e.target.value)}
                      className={`w-16 px-3 py-2 rounded-xl border text-sm outline-none text-center transition-all ${
                        darkMode
                          ? "bg-black/30 border-white/[0.08] text-white placeholder-white/20 focus:border-rose-500/50"
                          : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-rose-400"
                      }`}
                    />
                    <input
                      placeholder="type"
                      value={exerciseType}
                      onChange={(e) => setExerciseType(e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-xl border text-sm outline-none transition-all ${
                        darkMode
                          ? "bg-black/30 border-white/[0.08] text-white placeholder-white/20 focus:border-rose-500/50"
                          : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-rose-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Caffeine & Morning */}
                <div>
                  <label
                    className={`text-xs mb-2 flex items-center gap-1 ${textMuted}`}
                  >
                    <Coffee size={11} /> Caffeine & Routine
                  </label>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() =>
                        setCaffeineCount(Math.max(0, caffeineCount - 1))
                      }
                      className={counterBtnClass}
                    >
                      −
                    </button>
                    <span
                      className={`mono text-sm w-4 text-center font-semibold ${text}`}
                    >
                      {caffeineCount}
                    </span>
                    <button
                      onClick={() => setCaffeineCount(caffeineCount + 1)}
                      className={counterBtnClass}
                    >
                      +
                    </button>
                    <span className={`text-xs ${textFaint}`}>cups</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setMorningRoutine(!morningRoutine)}
                      className={`w-9 h-5 rounded-full transition-all duration-200 relative ${morningRoutine ? "bg-indigo-500" : darkMode ? "bg-white/10" : "bg-slate-200"}`}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${morningRoutine ? "left-4" : "left-0.5"}`}
                      />
                    </div>
                    <span className={`text-xs ${textMuted}`}>
                      Morning routine
                    </span>
                  </label>
                </div>
              </div>

              {/* Focus Mode */}
              <div>
                <label
                  className={`text-xs mb-2 flex items-center gap-1 ${textMuted}`}
                >
                  <Wind size={11} /> Today's Focus Mode
                </label>
                <div className="flex flex-wrap gap-2">
                  {focusModes.map((m) => (
                    <button
                      key={m}
                      onClick={() => setFocusMode(m)}
                      className="pill-btn"
                      style={
                        focusMode === m
                          ? {
                              background: "rgba(99,102,241,0.15)",
                              borderColor: "rgba(99,102,241,0.5)",
                              color: darkMode ? "#a5b4fc" : "#4f46e5",
                            }
                          : {
                              background: darkMode
                                ? "rgba(255,255,255,0.05)"
                                : "#f8fafc",
                              borderColor: darkMode
                                ? "rgba(255,255,255,0.08)"
                                : "#e2e8f0",
                              color: darkMode
                                ? "rgba(255,255,255,0.5)"
                                : "#64748b",
                            }
                      }
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </SectionCard>

            {/* ── 2. GOALS ── */}
            <SectionCard>
              <SectionHeader
                icon={<Target size={16} />}
                label="Today's Goals"
                accent="#6366f1"
              />

              {todayGoals.length > 0 && (
                <div className="mb-4">
                  <div
                    className={`h-1.5 rounded-full mb-3 overflow-hidden ${progressTrackClass}`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${todayGoals.length ? (completedGoals / todayGoals.length) * 100 : 0}%`,
                        background: "linear-gradient(90deg,#6366f1,#a855f7)",
                      }}
                    />
                  </div>
                  {todayGoals.map((g, i) => (
                    <div key={i} className={goalItemClass}>
                      <div
                        className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] cursor-pointer flex-shrink-0 flex items-center justify-center transition-all ${
                          goalsDone[i]
                            ? "bg-indigo-500 border-indigo-500"
                            : darkMode
                              ? "border-white/20"
                              : "border-slate-300"
                        }`}
                        onClick={() => toggleGoal(i)}
                      >
                        {goalsDone[i] && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <span
                        className={`flex-1 text-sm ${goalsDone[i] ? `line-through ${textFaint}` : text}`}
                      >
                        {g}
                      </span>
                      <button
                        onClick={() => removeGoal(i)}
                        className={`transition-colors ${darkMode ? "text-white/20 hover:text-red-400" : "text-slate-300 hover:text-red-400"}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  placeholder="Add a goal for today…"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addGoal()}
                  className={inputClass}
                />
                <button
                  onClick={addGoal}
                  className="px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-1.5 flex-shrink-0 transition-colors"
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.35)",
                    color: darkMode ? "#a5b4fc" : "#4f46e5",
                  }}
                >
                  <Plus size={14} /> Add
                </button>
              </div>
            </SectionCard>

            {/* ── 3. SPIRITUAL ── */}
            <SectionCard>
              <SectionHeader
                icon={<BookOpen size={16} />}
                label="Spiritual"
                accent="#818cf8"
              />

              <div className="flex flex-wrap gap-3 mb-4">
                <select
                  value={bibleBook}
                  onChange={(e) => {
                    setBibleBook(e.target.value);
                    if (bibleChapter > chapterLimits[e.target.value])
                      setBibleChapter(1);
                  }}
                  className={selectClass}
                >
                  <option disabled>── Old Testament ──</option>
                  {bibleBooks.slice(0, 39).map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                  <option disabled>── New Testament ──</option>
                  {bibleBooks.slice(39).map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  max={chapterLimits[bibleBook]}
                  value={bibleChapter}
                  onChange={(e) => {
                    let v = Number(e.target.value);
                    v = Math.min(Math.max(v, 1), chapterLimits[bibleBook]);
                    setBibleChapter(v);
                  }}
                  className={`w-20 px-3 py-2.5 rounded-xl border text-sm text-center outline-none transition-all ${
                    darkMode
                      ? "bg-black/30 border-white/[0.08] text-white/90 focus:border-indigo-500/50"
                      : "bg-white border-slate-200 text-slate-900 focus:border-indigo-400"
                  }`}
                />

                <span className={`text-xs self-center ${textFaint}`}>
                  max {chapterLimits[bibleBook]}
                </span>

                <button
                  onClick={fetchBibleChapter}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.35)",
                    color: darkMode ? "#a5b4fc" : "#4f46e5",
                  }}
                >
                  {bibleLoading ? "Loading…" : "Read Chapter"}
                </button>
              </div>

              {bibleContent ? (
                <div>
                  <button
                    onClick={() => setBibleReaderOpen(!bibleReaderOpen)}
                    className={`flex items-center gap-2 text-xs mb-2 transition-colors ${textMuted} hover:${text}`}
                  >
                    <ChevronDown
                      size={13}
                      className={`transition-transform ${bibleReaderOpen ? "rotate-180" : ""}`}
                    />
                    {bibleReaderOpen ? "Hide" : "Show"} Chapter
                  </button>
                  {bibleReaderOpen && (
                    <div
                      className={`h-44 overflow-y-auto rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line border ${bibleBoxClass} ${textMuted}`}
                    >
                      {bibleContent}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className={`flex items-center justify-center h-28 rounded-xl border border-dashed text-sm ${textFaint} ${
                    darkMode
                      ? "bg-black/20 border-white/[0.06]"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  Select a book &amp; chapter, then click Read
                </div>
              )}
            </SectionCard>

            {/* ── 4. LEARNING ── */}
            <SectionCard>
              <SectionHeader
                icon={<GraduationCap size={16} />}
                label="Learning"
                accent="#a855f7"
              />
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  name="bookReading"
                  placeholder="Book you're reading…"
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  name="csTopic"
                  placeholder="CS topic studied…"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </SectionCard>

            {/* ── 5. PRODUCTIVITY ── */}
            <SectionCard>
              <SectionHeader
                icon={<Laptop size={16} />}
                label="Productivity"
                accent="#22c55e"
              />
              <div className="grid md:grid-cols-2 gap-3">
                <input
                  name="codingWork"
                  placeholder="What did you build/code?"
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  name="collegeActivity"
                  placeholder="College / class activity…"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </SectionCard>

            {/* ── 6. JOURNAL ── */}
            <SectionCard>
              <SectionHeader
                icon={<NotebookPen size={16} />}
                label="Daily Journal"
                accent="#eab308"
              />

              {/* Mood */}
              <div className="mb-5">
                <label className={`text-xs mb-3 block ${textMuted}`}>
                  How are you feeling?
                </label>
                <div className="flex flex-wrap gap-2">
                  {moods.map((m) => (
                    <button
                      key={m.label}
                      onClick={() => setSelectedMood(m.emoji)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-150 ${selectedMood === m.emoji ? "scale-105" : ""}`}
                      style={
                        selectedMood === m.emoji
                          ? {
                              background: `${m.color}20`,
                              borderColor: `${m.color}55`,
                              color: m.color,
                            }
                          : {
                              background: darkMode
                                ? "rgba(255,255,255,0.03)"
                                : "#f8fafc",
                              borderColor: darkMode
                                ? "rgba(255,255,255,0.08)"
                                : "#e2e8f0",
                              color: darkMode
                                ? "rgba(255,255,255,0.4)"
                                : "#94a3b8",
                            }
                      }
                    >
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <input
                placeholder="Give today a title…"
                onChange={(e) => setDiaryTitle(e.target.value)}
                className={`${inputClass} mb-3 text-base font-medium`}
                style={{
                  borderColor: darkMode ? "rgba(255,255,255,0.08)" : "#e2e8f0",
                }}
              />

              <textarea
                name="diary"
                rows={5}
                placeholder="Write your thoughts — what did you experience, learn, or struggle with?"
                onChange={handleChange}
                className={textareaClass}
              />

              <div className="mt-4 grid md:grid-cols-2 gap-3">
                <div>
                  <label
                    className={`text-xs mb-2 flex items-center gap-1.5 ${textMuted}`}
                  >
                    <Star size={11} /> 3 things you're grateful for
                  </label>
                  <textarea
                    value={gratitude}
                    onChange={(e) => setGratitude(e.target.value)}
                    placeholder="1. …  2. …  3. …"
                    rows={3}
                    className={textareaClass}
                  />
                </div>
                <div>
                  <label
                    className={`text-xs mb-2 flex items-center gap-1.5 ${textMuted}`}
                  >
                    <Sun size={11} /> Plan for tomorrow
                  </label>
                  <textarea
                    value={tomorrowPlan}
                    onChange={(e) => setTomorrowPlan(e.target.value)}
                    placeholder="Top 3 priorities for tomorrow…"
                    rows={3}
                    className={textareaClass}
                  />
                </div>
              </div>
            </SectionCard>

            {/* ── 7. LIFESTYLE ── */}
            <SectionCard>
              <SectionHeader
                icon={<Film size={16} />}
                label="Lifestyle"
                accent="#ec4899"
              />

              <div className="grid md:grid-cols-2 gap-6">
                {/* Movie */}
                <div>
                  <label className={`text-xs mb-2 block ${textMuted}`}>
                    Movie / Show watched
                  </label>
                  <input
                    name="movie"
                    placeholder="Movie or episode…"
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Phone usage */}
                <div>
                  <label className={`text-xs mb-2 block ${textMuted}`}>
                    📱 Screen time by app
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {phoneApps.map((a) => (
                      <button
                        key={a}
                        onClick={() => setSelectedApp(a)}
                        className="pill-btn"
                        style={
                          selectedApp === a
                            ? {
                                background: "rgba(236,72,153,0.15)",
                                borderColor: "rgba(236,72,153,0.4)",
                                color: darkMode ? "#f9a8d4" : "#db2777",
                              }
                            : {
                                background: darkMode
                                  ? "rgba(255,255,255,0.05)"
                                  : "#f8fafc",
                                borderColor: darkMode
                                  ? "rgba(255,255,255,0.08)"
                                  : "#e2e8f0",
                                color: darkMode
                                  ? "rgba(255,255,255,0.5)"
                                  : "#64748b",
                              }
                        }
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  {selectedApp === "Other" && (
                    <input
                      placeholder="App name…"
                      value={customApp}
                      onChange={(e: any) => setCustomApp(e.target.value)}
                      className={`${inputClass} mb-2`}
                    />
                  )}
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="mins"
                      value={appTime}
                      onChange={(e) => setAppTime(e.target.value)}
                      className={`w-24 px-3 py-2.5 rounded-xl border text-sm outline-none text-center transition-all ${
                        darkMode
                          ? "bg-black/30 border-white/[0.08] text-white/90 placeholder-white/20 focus:border-pink-500/50"
                          : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-pink-400"
                      }`}
                    />
                    <button
                      onClick={addAppUsage}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                      style={{
                        background: "rgba(236,72,153,0.12)",
                        border: "1px solid rgba(236,72,153,0.3)",
                        color: darkMode ? "#f9a8d4" : "#db2777",
                      }}
                    >
                      + Add
                    </button>
                  </div>
                  {appList.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {appList.map((a, i) => (
                        <span key={i} className={expenseTagClass}>
                          {a.name}{" "}
                          <span className="mono text-pink-500">{a.time}m</span>
                        </span>
                      ))}
                      <span
                        className={`${expenseTagClass} text-pink-500 font-semibold mono`}
                      >
                        {totalScreenMin}m total
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

            {/* ── 8. EXPENSES ── */}
            <SectionCard>
              <SectionHeader
                icon={<Wallet size={16} />}
                label="Expenses"
                accent="#10b981"
              />

              <div className="grid grid-cols-5 gap-2 mb-4">
                {expenseCategories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`py-2.5 px-2 rounded-xl border text-xs font-medium flex flex-col items-center gap-1 transition-all duration-150 ${selectedCategory === cat.name ? "scale-[1.04]" : ""}`}
                    style={
                      selectedCategory === cat.name
                        ? {
                            background: `${cat.color}20`,
                            borderColor: `${cat.color}55`,
                            color: darkMode ? "white" : cat.color,
                          }
                        : {
                            background: darkMode
                              ? "rgba(255,255,255,0.03)"
                              : "#f8fafc",
                            borderColor: darkMode
                              ? "rgba(255,255,255,0.07)"
                              : "#e2e8f0",
                            color: darkMode
                              ? "rgba(255,255,255,0.45)"
                              : "#94a3b8",
                          }
                    }
                  >
                    <span className="text-base">{cat.icon}</span>
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm ${textFaint}`}
                  >
                    ₹
                  </span>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="Amount"
                    className={`${inputClass} pl-8`}
                  />
                </div>
                <button
                  onClick={addExpense}
                  className="px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
                  style={{
                    background: "rgba(16,185,129,0.12)",
                    border: "1px solid rgba(16,185,129,0.3)",
                    color: darkMode ? "#6ee7b7" : "#059669",
                  }}
                >
                  Add
                </button>
              </div>

              {expenseList.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {expenseList.map((e, i) => (
                      <span key={i} className={expenseTagClass}>
                        {
                          expenseCategories.find((c) => c.name === e.category)
                            ?.icon
                        }{" "}
                        {e.category}
                        <span className="mono text-emerald-500 font-semibold">
                          {" "}
                          ₹{e.amount}
                        </span>
                      </span>
                    ))}
                  </div>
                  <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{
                      background: darkMode
                        ? "rgba(16,185,129,0.08)"
                        : "rgba(16,185,129,0.06)",
                      border: "1px solid rgba(16,185,129,0.2)",
                    }}
                  >
                    <span className={`text-sm ${textMuted}`}>
                      Total spent today
                    </span>
                    <span className="mono font-semibold text-emerald-500">
                      ₹{totalExpenses}
                    </span>
                  </div>
                </div>
              )}
            </SectionCard>
          </div>

          {/* ── SUBMIT ── */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Analyzing your day…
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <Flame size={18} /> Analyze My Day
                </span>
              )}
            </button>
            <p className={`text-xs ${textFaint}`}>
              AI will review all sections and generate a score + insights
            </p>
          </div>

          {/* ── RESULT ── */}
          {result && (
            <div className="mt-12">
              <AIResult
                result={result}
                onDownload={() =>
                  generatePDF(
                    result,
                    form,
                    expenseList,
                    appList,
                    selectedMood,
                    diaryTitle,
                  )
                }
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
