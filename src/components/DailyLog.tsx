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
} from "lucide-react";
import {
  Utensils,
  Car,
  ShoppingCart,
  Home,
  Lightbulb,
  HeartPulse,
  Package,
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
  // 🔥 Expense States

  const [selectedCategory, setSelectedCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseList, setExpenseList] = useState<
    { category: string; amount: number }[]
  >([]);
  // 📱 Phone Usage States
  const [selectedApp, setSelectedApp] = useState("");
  const [appTime, setAppTime] = useState("");
  const [customApp, setCustomApp] = useState("");
  const [appList, setAppList] = useState<{ name: string; time: number }[]>([]);
  // 📔 Diary States (ADD THIS)
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
  // 🔥 Original Form
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
    // Old Testament
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

    // New Testament
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
    // 📖 OLD TESTAMENT
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

    // ✝️ NEW TESTAMENT
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
  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <PencilLine className="w-8 h-8 text-indigo-400 drop-shadow-lg" />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Track Your Day
          </span>
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 📖 Spiritual */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h2 className="font-semibold">Spiritual</h2>
            </div>

            {/* 🔥 Selector */}
            <div className="flex gap-3 mb-4">
              <select
                value={bibleBook}
                onChange={(e) => {
                  const selectedBook = e.target.value;
                  setBibleBook(selectedBook);

                  // reset chapter if exceeds limit
                  const max = chapterLimits[selectedBook];
                  if (bibleChapter > max) {
                    setBibleChapter(1);
                  }
                }}
                className="p-2 rounded-lg bg-white/10 text-white"
              >
                <option disabled className="text-gray-400">
                  ── Old Testament ──
                </option>
                {bibleBooks.slice(0, 39).map((b) => (
                  <option key={b} value={b} className="text-black">
                    {b}
                  </option>
                ))}

                <option disabled className="text-gray-400">
                  ── New Testament ──
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
                className="w-20 p-2 rounded-lg bg-white/10 text-white text-center"
              />
              <p className="text-xs text-gray-400">
                Max: {chapterLimits[bibleBook]}
              </p>

              <button
                onClick={fetchBibleChapter}
                className="px-4 py-2 bg-indigo-500 rounded-lg hover:bg-indigo-600"
              >
                Read
              </button>
            </div>

            {/* 🔥 Reader */}
            <div className="h-40 overflow-y-auto bg-white/5 rounded-xl p-3 text-sm whitespace-pre-line">
              {bibleLoading ? "Loading..." : bibleContent || "Select chapter"}
            </div>
          </div>
          {/* 📚 Learning */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl hover:shadow-purple-500/20 transition">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-purple-400" />
              <h2 className="font-semibold">Learning</h2>
            </div>

            <input
              name="bookReading"
              placeholder="Book reading"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />

            <input
              name="csTopic"
              placeholder="CS Topic"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* 💻 Productivity */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl hover:shadow-green-500/20 transition">
            <div className="flex items-center gap-2 mb-3">
              <Laptop className="w-5 h-5 text-green-400" />
              <h2 className="font-semibold">Productivity</h2>
            </div>

            <input
              name="codingWork"
              placeholder="Coding work"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-2 focus:ring-2 focus:ring-green-500 outline-none"
            />

            <input
              name="collegeActivity"
              placeholder="College activity"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* 🎯 Lifestyle */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl hover:shadow-pink-500/20 transition">
            <div className="flex items-center gap-2 mb-3">
              <Film className="w-5 h-5 text-pink-400" />
              <h2 className="font-semibold">Lifestyle</h2>
            </div>

            <input
              name="movie"
              placeholder="Movie"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 mb-2 focus:ring-2 focus:ring-pink-500 outline-none"
            />

            {/* 📱 Phone Usage */}
            <div className="space-y-4 mt-4">
              {/* Apps */}
              <div className="grid grid-cols-5 gap-3">
                {phoneApps.map((app) => (
                  <div
                    key={app.name}
                    onClick={() => setSelectedApp(app.name)}
                    className={`cursor-pointer text-center px-3 py-2 rounded-xl border transition 
        ${
          selectedApp === app.name
            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
            : "bg-white/5 border-white/10 hover:bg-pink-500/10"
        }`}
                  >
                    {app.name}
                  </div>
                ))}
              </div>

              {/* Custom App */}
              {selectedApp === "Other" && (
                <input
                  placeholder="Enter app name"
                  value={customApp}
                  onChange={(e) => setCustomApp(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                />
              )}

              {/* Time */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Minutes"
                  value={appTime}
                  onChange={(e) => setAppTime(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
                />

                <button
                  onClick={addAppUsage}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600"
                >
                  Add
                </button>
              </div>

              {/* List */}
              {appList.map((a, i) => (
                <div key={i} className="text-sm text-gray-300">
                  {a.name} - {a.time} mins
                </div>
              ))}
            </div>
          </div>

          {/* 📔 Diary (Modern UI) */}
          <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <NotebookPen className="w-5 h-5 text-yellow-400" />
                <h2 className="font-semibold text-lg">Daily Journal</h2>
              </div>

              <span className="text-xs text-gray-400">
                Express your thoughts
              </span>
            </div>

            {/* Mood Selector */}
            <div>
              <p className="text-sm text-gray-400 mb-2">How was your day?</p>
              <div className="flex gap-3">
                {["😄", "🙂", "😐", "😔", "😴"].map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setSelectedMood(mood)}
                    className={`text-xl px-3 py-2 rounded-xl transition 
          ${
            selectedMood === mood
              ? "bg-yellow-500/20 scale-110"
              : "bg-white/5 hover:bg-white/10"
          }`}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <input
              type="text"
              placeholder="Give a title for your day..."
              onChange={(e) => setDiaryTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-yellow-500 outline-none text-lg font-medium"
            />

            {/* Main Diary */}
            <textarea
              name="diary"
              placeholder="Write your thoughts... what did you learn, feel, or experience today?"
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 min-h-[140px] focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
            />

            {/* Footer Actions */}
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>💡 Tip: Be honest & reflective</span>

              <span>{form.diary?.length || 0} characters</span>
            </div>
          </div>
          {/* 💰 Expenses */}
          <div className="md:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              <h2 className="font-semibold">Expenses</h2>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-5 gap-3">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`cursor-pointer text-center px-3 py-2 rounded-xl border transition 
              ${
                selectedCategory === cat.name
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "bg-white/5 border-white/10 hover:bg-indigo-500/10"
              }`}
                >
                  <div className="text-sm">
                    {cat.icon} {cat.name}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              <button
                onClick={addExpense}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold hover:scale-105 transition shadow-lg"
              >
                Add
              </button>
            </div>

            {/* List */}
            {expenseList.map((e, i) => (
              <div key={i} className="text-sm text-gray-300">
                {e.category} - ₹{e.amount}
              </div>
            ))}
          </div>
        </div>

        {/* 🚀 Submit */}
        <div className="mt-10 text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-lg hover:scale-105 transition shadow-lg"
          >
            {loading ? "Analyzing..." : "🚀 Analyze My Day"}
          </button>
        </div>

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
