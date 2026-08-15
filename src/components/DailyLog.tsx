import { useState } from "react";
import AIResult from "./AIResult";
import "../styles/premium-form.css";
import {
  BookOpen,
  GraduationCap,
  Laptop,
  Film,
  NotebookPen,
  Wallet,
  PencilLine,
  Utensils,
  Car,
  ShoppingCart,
  Home,
  Lightbulb,
  HeartPulse,
  Package,
  ChevronRight,
  Plus,
  Sparkles,
} from "lucide-react";
import { generatePDF } from "../utils/PDFGenerator";

type Props = {
  userId: number;
};

const expenseCategories = [
  { name: "Food", icon: <Utensils />, color: "text-orange-400" },
  { name: "Travel", icon: <Car />, color: "text-blue-400" },
  { name: "Shopping", icon: <ShoppingCart />, color: "text-pink-400" },
  { name: "Education", icon: <BookOpen />, color: "text-purple-400" },
  { name: "Rent", icon: <Home />, color: "text-green-400" },
  { name: "Bills", icon: <Lightbulb />, color: "text-yellow-400" },
  { name: "Entertainment", icon: <Film />, color: "text-red-400" },
  { name: "Health", icon: <HeartPulse />, color: "text-rose-400" },
  { name: "Software", icon: <Laptop />, color: "text-indigo-400" },
  { name: "Others", icon: <Package />, color: "text-gray-400" },
];

const phoneApps = [
  { name: "Instagram" },
  { name: "YouTube" },
  { name: "WhatsApp" },
  { name: "Facebook" },
  { name: "X" },
  { name: "Other" },
];

function DailyLog({ userId }: Props) {
  const [bibleBook, setBibleBook] = useState("John");
  const [bibleChapter, setBibleChapter] = useState(3);
  const [bibleContent, setBibleContent] = useState("");
  const [bibleLoading, setBibleLoading] = useState(false);

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

  const addExpense = () => {
    if (!selectedCategory || !expenseAmount) {
      alert("Select category and enter amount");
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
    const appName = selectedApp === "Other" ? customApp : selectedApp;

    if (!appName || !appTime) {
      alert("Select app and enter time");
      return;
    }

    setAppList([...appList, { name: appName, time: Number(appTime) }]);

    setSelectedApp("");
    setAppTime("");
    setCustomApp("");
  };

  const fetchBibleChapter = async () => {
    setBibleLoading(true);

    try {
      const res = await fetch(
        `https://bible-api.com/${bibleBook}%20${bibleChapter}`,
      );

      const data = await res.json();

      const verses = data.verses.map((v: any) => `${v.verse}. ${v.text}`);

      setBibleContent(verses.join("\n"));
    } catch (err) {
      setBibleContent("Error loading chapter");
    }

    setBibleLoading(false);
  };

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
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const extractAmount = (text: string) => {
    const numbers = text.match(/\d+/g);

    return numbers ? numbers.map(Number).reduce((a, b) => a + b, 0) : null;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const totalExpense =
        expenseList.length > 0
          ? expenseList.reduce((sum, item) => sum + item.amount, 0)
          : extractAmount(form.expenses);

      const res = await fetch(`http://localhost:8080/api/daily/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          bibleReading: `${bibleBook} ${bibleChapter}`,
          expenses: totalExpense,
          diary: form.diary,
          phoneUsage:
            appList.length > 0
              ? appList.map((a) => `${a.name} ${a.time}min`).join(", ")
              : form.phoneUsage,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("❌ Failed to analyze. Check backend.");
    } finally {
      setLoading(false);
    }
  };

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

  const inputClass =
    "w-full px-4 py-3.5 rounded-2xl bg-white/[0.045] border border-white/[0.08] text-white placeholder:text-white/30 outline-none transition-all duration-200 focus:bg-white/[0.07] focus:border-indigo-400/50 focus:ring-4 focus:ring-indigo-500/10";

  const cardClass =
    "bg-white/[0.035] backdrop-blur-2xl border border-white/[0.08] rounded-[28px] shadow-[0_20px_60px_rgba(0,0,0,0.22)]";

  return (
    <div className="min-h-screen bg-[#050506] text-white">
      {/* Apple-style ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-[20%] w-[500px] h-[500px] bg-indigo-500/[0.08] rounded-full blur-[140px]" />

        <div className="absolute top-[35%] -right-40 w-[450px] h-[450px] bg-purple-500/[0.06] rounded-full blur-[140px]" />

        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] bg-blue-500/[0.05] rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-10 sm:mb-14">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-white/[0.07] border border-white/[0.08] flex items-center justify-center">
              <PencilLine className="w-5 h-5 text-indigo-300" />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-white/35 font-semibold">
                Daily Reflection
              </p>

              <p className="text-xs text-white/25 mt-0.5">
                Take a moment for yourself
              </p>
            </div>
          </div>

          <div className="max-w-2xl">
            <h1 className="text-[38px] sm:text-5xl lg:text-6xl font-semibold tracking-[-0.04em] leading-[1.05]">
              Track your day.
            </h1>

            <p className="text-lg sm:text-xl text-white/40 mt-4 leading-relaxed">
              Capture what you learned, experienced, enjoyed, and accomplished
              today.
            </p>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-5">
          {/* Spiritual */}
          <section className={`${cardClass} p-5 sm:p-7`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-indigo-300" />
                </div>

                <div>
                  <h2 className="font-semibold text-[17px]">Spiritual</h2>

                  <p className="text-xs text-white/30 mt-0.5">Bible reading</p>
                </div>
              </div>

              <Sparkles className="w-4 h-4 text-white/20" />
            </div>

            <div className="grid grid-cols-[1fr_75px_auto] gap-2 sm:gap-3 items-center">
              <select
                value={bibleBook}
                onChange={(e) => {
                  const selectedBook = e.target.value;
                  setBibleBook(selectedBook);

                  const max = chapterLimits[selectedBook];

                  if (bibleChapter > max) {
                    setBibleChapter(1);
                  }
                }}
                className={`${inputClass} appearance-none cursor-pointer`}
              >
                <option disabled className="text-black">
                  Old Testament
                </option>

                {bibleBooks.slice(0, 39).map((b) => (
                  <option key={b} value={b} className="text-black">
                    {b}
                  </option>
                ))}

                <option disabled className="text-black">
                  New Testament
                </option>

                {bibleBooks.slice(39).map((b) => (
                  <option key={b} value={b} className="text-black">
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
                  let value = Number(e.target.value);

                  if (value < 1) value = 1;

                  if (value > chapterLimits[bibleBook]) {
                    value = chapterLimits[bibleBook];
                  }

                  setBibleChapter(value);
                }}
                className={`${inputClass} text-center`}
              />

              <button
                onClick={fetchBibleChapter}
                className="h-full px-4 sm:px-5 rounded-2xl bg-white text-black font-semibold text-sm hover:bg-white/90 active:scale-[0.97] transition-all"
              >
                Read
              </button>
            </div>

            <div className="flex items-center justify-between mt-3 px-1">
              <span className="text-[11px] text-white/25">
                Chapter {bibleChapter}
              </span>

              <span className="text-[11px] text-white/25">
                Max {chapterLimits[bibleBook]}
              </span>
            </div>

            <div className="mt-5 h-48 overflow-y-auto rounded-2xl bg-black/20 border border-white/[0.05] p-4 sm:p-5">
              {bibleLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex items-center gap-3 text-sm text-white/40">
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    Loading chapter...
                  </div>
                </div>
              ) : (
                <p className="text-sm text-white/55 leading-7 whitespace-pre-line">
                  {bibleContent || "Select a chapter to begin reading."}
                </p>
              )}
            </div>
          </section>

          {/* Learning */}
          <section className={`${cardClass} p-5 sm:p-7`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-300" />
              </div>

              <div>
                <h2 className="font-semibold text-[17px]">Learning</h2>

                <p className="text-xs text-white/30 mt-0.5">Feed your mind</p>
              </div>
            </div>

            <div className="space-y-3">
              <input
                name="bookReading"
                placeholder="What book did you read?"
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="csTopic"
                placeholder="What CS topic did you learn?"
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="mt-5 px-4 py-3 rounded-2xl bg-purple-500/[0.05] border border-purple-400/[0.08]">
              <p className="text-xs text-purple-200/50">
                Small progress every day compounds into something remarkable.
              </p>
            </div>
          </section>

          {/* Productivity */}
          <section className={`${cardClass} p-5 sm:p-7`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Laptop className="w-5 h-5 text-emerald-300" />
              </div>

              <div>
                <h2 className="font-semibold text-[17px]">Productivity</h2>

                <p className="text-xs text-white/30 mt-0.5">
                  Work that mattered
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <input
                name="codingWork"
                placeholder="What did you code today?"
                onChange={handleChange}
                className={inputClass}
              />

              <input
                name="collegeActivity"
                placeholder="College activity"
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </section>

          {/* Lifestyle */}
          <section className={`${cardClass} p-5 sm:p-7`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                <Film className="w-5 h-5 text-pink-300" />
              </div>

              <div>
                <h2 className="font-semibold text-[17px]">Lifestyle</h2>

                <p className="text-xs text-white/30 mt-0.5">Balance your day</p>
              </div>
            </div>

            <input
              name="movie"
              placeholder="What did you watch?"
              onChange={handleChange}
              className={inputClass}
            />

            {/* Phone Usage */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-white/70">Screen time</p>

                <span className="text-[11px] text-white/25">
                  Add apps & minutes
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {phoneApps.map((app) => (
                  <button
                    key={app.name}
                    type="button"
                    onClick={() => setSelectedApp(app.name)}
                    className={`min-h-[48px] px-2 rounded-xl border text-[11px] font-medium transition-all active:scale-95 ${
                      selectedApp === app.name
                        ? "bg-white text-black border-white"
                        : "bg-white/[0.035] border-white/[0.07] text-white/45 hover:bg-white/[0.07] hover:text-white"
                    }`}
                  >
                    {app.name}
                  </button>
                ))}
              </div>

              {selectedApp === "Other" && (
                <input
                  placeholder="Enter app name"
                  value={customApp}
                  onChange={(e) => setCustomApp(e.target.value)}
                  className={`${inputClass} mt-3`}
                />
              )}

              <div className="flex gap-2 mt-3">
                <input
                  type="number"
                  placeholder="Minutes"
                  value={appTime}
                  onChange={(e) => setAppTime(e.target.value)}
                  className={`${inputClass} flex-1`}
                />

                <button
                  onClick={addAppUsage}
                  className="px-5 rounded-2xl bg-white/[0.08] border border-white/[0.08] text-white font-semibold hover:bg-white/[0.13] active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {appList.length > 0 && (
                <div className="mt-4 space-y-2">
                  {appList.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-black/20 border border-white/[0.05]"
                    >
                      <span className="text-sm text-white/60">{a.name}</span>

                      <span className="text-xs text-white/30">
                        {a.time} min
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Journal */}
          <section className={`${cardClass} lg:col-span-2 p-5 sm:p-7`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                  <NotebookPen className="w-5 h-5 text-yellow-300" />
                </div>

                <div>
                  <h2 className="font-semibold text-[17px]">Daily Journal</h2>

                  <p className="text-xs text-white/30 mt-0.5">
                    A quiet space for your thoughts
                  </p>
                </div>
              </div>

              <span className="text-xs text-white/25">
                {form.diary?.length || 0} characters
              </span>
            </div>

            {/* Mood */}
            <div>
              <p className="text-sm text-white/50 mb-3">How was your day?</p>

              <div className="flex gap-2">
                {["😄", "🙂", "😐", "😔", "😴"].map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setSelectedMood(mood)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl text-xl transition-all active:scale-90 ${
                      selectedMood === mood
                        ? "bg-white text-black scale-105 shadow-lg"
                        : "bg-white/[0.045] border border-white/[0.07] hover:bg-white/[0.08]"
                    }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <input
              type="text"
              placeholder="Give today a title..."
              onChange={(e) => setDiaryTitle(e.target.value)}
              className={`${inputClass} mt-6 text-base`}
            />

            <textarea
              name="diary"
              placeholder="Write about your thoughts, feelings, experiences, lessons, or anything you want to remember..."
              onChange={handleChange}
              className={`${inputClass} mt-3 min-h-[180px] resize-none leading-7`}
            />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
              <span className="text-xs text-white/25">
                💡 Be honest. This space is only about you.
              </span>

              <span className="text-xs text-white/20">
                {form.diary?.length || 0} characters
              </span>
            </div>
          </section>

          {/* Expenses */}
          <section className={`${cardClass} lg:col-span-2 p-5 sm:p-7`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-300" />
                </div>

                <div>
                  <h2 className="font-semibold text-[17px]">Expenses</h2>

                  <p className="text-xs text-white/30 mt-0.5">
                    Keep an eye on your spending
                  </p>
                </div>
              </div>

              {expenseList.length > 0 && (
                <span className="text-sm font-semibold text-white/60">
                  ₹
                  {expenseList
                    .reduce((sum, item) => sum + item.amount, 0)
                    .toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {expenseCategories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 p-3 rounded-2xl border transition-all active:scale-95 ${
                    selectedCategory === cat.name
                      ? "bg-white text-black border-white shadow-lg"
                      : "bg-white/[0.035] border-white/[0.07] text-white/45 hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <span
                    className={
                      selectedCategory === cat.name ? "text-black" : cat.color
                    }
                  >
                    {cat.icon}
                  </span>

                  <span className="text-xs font-medium">{cat.name}</span>
                </button>
              ))}
            </div>

            {/* Amount */}
            <div className="flex gap-2 mt-4">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25">
                  ₹
                </span>

                <input
                  type="number"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  placeholder="Amount"
                  className={`${inputClass} pl-9`}
                />
              </div>

              <button
                onClick={addExpense}
                className="px-6 rounded-2xl bg-white text-black font-semibold hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* Expense list */}
            {expenseList.length > 0 && (
              <div className="mt-5 grid sm:grid-cols-2 gap-2">
                {expenseList.map((e, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3.5 rounded-2xl bg-black/20 border border-white/[0.05]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center">
                        <Wallet className="w-3.5 h-3.5 text-white/40" />
                      </div>

                      <span className="text-sm text-white/55">
                        {e.category}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-white/75">
                      ₹{e.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Analyze */}
        <div className="mt-8 sm:mt-10">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="group w-full rounded-[24px] bg-white text-black py-4 sm:py-5 font-semibold text-base sm:text-lg transition-all hover:bg-white/90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_20px_50px_rgba(255,255,255,0.08)]"
          >
            <span className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                  Analyzing your day...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze My Day
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </span>
          </button>

          <p className="text-center text-[11px] text-white/20 mt-3">
            Your daily reflection will be analyzed by AI.
          </p>
        </div>

        {/* AI Result */}
        {result && (
          <div className="mt-10">
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
  );
}

export default DailyLog;
