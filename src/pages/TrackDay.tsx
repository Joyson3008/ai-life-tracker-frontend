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
  { name: "Shop", icon: "🛒", color: "#ec4899" },
  { name: "Edu", icon: "📚", color: "#a855f7" },
  { name: "Rent", icon: "🏠", color: "#22c55e" },
  { name: "Bills", icon: "💡", color: "#eab308" },
  { name: "Moive", icon: "🎬", color: "#ef4444" },
  { name: "Health", icon: "❤️‍🩹", color: "#f43f5e" },
  { name: "Elec-", icon: "💻", color: "#6366f1" },
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

// Quran: 114 Surahs with names and verse counts
const quranSurahs = [
  { number: 1, name: "Al-Fatiha", englishName: "The Opening", ayahs: 7 },
  { number: 2, name: "Al-Baqarah", englishName: "The Cow", ayahs: 286 },
  { number: 3, name: "Ali 'Imran", englishName: "Family of Imran", ayahs: 200 },
  { number: 4, name: "An-Nisa", englishName: "The Women", ayahs: 176 },
  { number: 5, name: "Al-Ma'idah", englishName: "The Table", ayahs: 120 },
  { number: 6, name: "Al-An'am", englishName: "The Cattle", ayahs: 165 },
  { number: 7, name: "Al-A'raf", englishName: "The Heights", ayahs: 206 },
  { number: 8, name: "Al-Anfal", englishName: "The Spoils of War", ayahs: 75 },
  { number: 9, name: "At-Tawbah", englishName: "The Repentance", ayahs: 129 },
  { number: 10, name: "Yunus", englishName: "Jonah", ayahs: 109 },
  { number: 11, name: "Hud", englishName: "Hud", ayahs: 123 },
  { number: 12, name: "Yusuf", englishName: "Joseph", ayahs: 111 },
  { number: 13, name: "Ar-Ra'd", englishName: "The Thunder", ayahs: 43 },
  { number: 14, name: "Ibrahim", englishName: "Abraham", ayahs: 52 },
  { number: 15, name: "Al-Hijr", englishName: "The Rocky Tract", ayahs: 99 },
  { number: 16, name: "An-Nahl", englishName: "The Bee", ayahs: 128 },
  { number: 17, name: "Al-Isra", englishName: "The Night Journey", ayahs: 111 },
  { number: 18, name: "Al-Kahf", englishName: "The Cave", ayahs: 110 },
  { number: 19, name: "Maryam", englishName: "Mary", ayahs: 98 },
  { number: 20, name: "Ta-Ha", englishName: "Ta-Ha", ayahs: 135 },
  { number: 21, name: "Al-Anbiya", englishName: "The Prophets", ayahs: 112 },
  { number: 22, name: "Al-Hajj", englishName: "The Pilgrimage", ayahs: 78 },
  { number: 23, name: "Al-Mu'minun", englishName: "The Believers", ayahs: 118 },
  { number: 24, name: "An-Nur", englishName: "The Light", ayahs: 64 },
  { number: 25, name: "Al-Furqan", englishName: "The Criterion", ayahs: 77 },
  { number: 26, name: "Ash-Shu'ara", englishName: "The Poets", ayahs: 227 },
  { number: 27, name: "An-Naml", englishName: "The Ant", ayahs: 93 },
  { number: 28, name: "Al-Qasas", englishName: "The Stories", ayahs: 88 },
  { number: 29, name: "Al-'Ankabut", englishName: "The Spider", ayahs: 69 },
  { number: 30, name: "Ar-Rum", englishName: "The Romans", ayahs: 60 },
  { number: 31, name: "Luqman", englishName: "Luqman", ayahs: 34 },
  { number: 32, name: "As-Sajdah", englishName: "The Prostration", ayahs: 30 },
  {
    number: 33,
    name: "Al-Ahzab",
    englishName: "The Combined Forces",
    ayahs: 73,
  },
  { number: 34, name: "Saba", englishName: "Sheba", ayahs: 54 },
  { number: 35, name: "Fatir", englishName: "Originator", ayahs: 45 },
  { number: 36, name: "Ya-Sin", englishName: "Ya-Sin", ayahs: 83 },
  {
    number: 37,
    name: "As-Saffat",
    englishName: "Those Ranges in Ranks",
    ayahs: 182,
  },
  { number: 38, name: "Sad", englishName: "The Letter Sad", ayahs: 88 },
  { number: 39, name: "Az-Zumar", englishName: "The Groups", ayahs: 75 },
  { number: 40, name: "Ghafir", englishName: "The Forgiver", ayahs: 85 },
  {
    number: 41,
    name: "Fussilat",
    englishName: "Explained in Detail",
    ayahs: 54,
  },
  {
    number: 42,
    name: "Ash-Shuraa",
    englishName: "The Consultation",
    ayahs: 53,
  },
  {
    number: 43,
    name: "Az-Zukhruf",
    englishName: "The Ornaments of Gold",
    ayahs: 89,
  },
  { number: 44, name: "Ad-Dukhan", englishName: "The Smoke", ayahs: 59 },
  { number: 45, name: "Al-Jathiyah", englishName: "The Crouching", ayahs: 37 },
  {
    number: 46,
    name: "Al-Ahqaf",
    englishName: "The Wind-Curved Sandhills",
    ayahs: 35,
  },
  { number: 47, name: "Muhammad", englishName: "Muhammad", ayahs: 38 },
  { number: 48, name: "Al-Fath", englishName: "The Victory", ayahs: 29 },
  { number: 49, name: "Al-Hujurat", englishName: "The Rooms", ayahs: 18 },
  { number: 50, name: "Qaf", englishName: "The Letter Qaf", ayahs: 45 },
  {
    number: 51,
    name: "Adh-Dhariyat",
    englishName: "The Winnowing Winds",
    ayahs: 60,
  },
  { number: 52, name: "At-Tur", englishName: "The Mount", ayahs: 49 },
  { number: 53, name: "An-Najm", englishName: "The Star", ayahs: 62 },
  { number: 54, name: "Al-Qamar", englishName: "The Moon", ayahs: 55 },
  { number: 55, name: "Ar-Rahman", englishName: "The Beneficent", ayahs: 78 },
  { number: 56, name: "Al-Waqi'ah", englishName: "The Inevitable", ayahs: 96 },
  { number: 57, name: "Al-Hadid", englishName: "The Iron", ayahs: 29 },
  {
    number: 58,
    name: "Al-Mujadila",
    englishName: "The Pleading Woman",
    ayahs: 22,
  },
  { number: 59, name: "Al-Hashr", englishName: "The Exile", ayahs: 24 },
  {
    number: 60,
    name: "Al-Mumtahanah",
    englishName: "She that is to be Examined",
    ayahs: 13,
  },
  { number: 61, name: "As-Saf", englishName: "The Ranks", ayahs: 14 },
  { number: 62, name: "Al-Jumu'ah", englishName: "Friday", ayahs: 11 },
  {
    number: 63,
    name: "Al-Munafiqun",
    englishName: "The Hypocrites",
    ayahs: 11,
  },
  {
    number: 64,
    name: "At-Taghabun",
    englishName: "The Mutual Disillusion",
    ayahs: 18,
  },
  { number: 65, name: "At-Talaq", englishName: "The Divorce", ayahs: 12 },
  { number: 66, name: "At-Tahrim", englishName: "The Prohibition", ayahs: 12 },
  { number: 67, name: "Al-Mulk", englishName: "The Sovereignty", ayahs: 30 },
  { number: 68, name: "Al-Qalam", englishName: "The Pen", ayahs: 52 },
  { number: 69, name: "Al-Haqqah", englishName: "The Reality", ayahs: 52 },
  {
    number: 70,
    name: "Al-Ma'arij",
    englishName: "The Ascending Stairways",
    ayahs: 44,
  },
  { number: 71, name: "Nuh", englishName: "Noah", ayahs: 28 },
  { number: 72, name: "Al-Jinn", englishName: "The Jinn", ayahs: 28 },
  {
    number: 73,
    name: "Al-Muzzammil",
    englishName: "The Enshrouded One",
    ayahs: 20,
  },
  {
    number: 74,
    name: "Al-Muddaththir",
    englishName: "The Cloaked One",
    ayahs: 56,
  },
  {
    number: 75,
    name: "Al-Qiyamah",
    englishName: "The Resurrection",
    ayahs: 40,
  },
  { number: 76, name: "Al-Insan", englishName: "The Man", ayahs: 31 },
  { number: 77, name: "Al-Mursalat", englishName: "The Emissaries", ayahs: 50 },
  { number: 78, name: "An-Naba", englishName: "The Tidings", ayahs: 40 },
  {
    number: 79,
    name: "An-Nazi'at",
    englishName: "Those who drag forth",
    ayahs: 46,
  },
  { number: 80, name: "Abasa", englishName: "He Frowned", ayahs: 42 },
  { number: 81, name: "At-Takwir", englishName: "The Overthrowing", ayahs: 29 },
  { number: 82, name: "Al-Infitar", englishName: "The Cleaving", ayahs: 19 },
  {
    number: 83,
    name: "Al-Mutaffifin",
    englishName: "The Defrauding",
    ayahs: 36,
  },
  { number: 84, name: "Al-Inshiqaq", englishName: "The Sundering", ayahs: 25 },
  {
    number: 85,
    name: "Al-Buruj",
    englishName: "The Mansions of the Stars",
    ayahs: 22,
  },
  { number: 86, name: "At-Tariq", englishName: "The Nightcomer", ayahs: 17 },
  { number: 87, name: "Al-A'la", englishName: "The Most High", ayahs: 19 },
  {
    number: 88,
    name: "Al-Ghashiyah",
    englishName: "The Overwhelming",
    ayahs: 26,
  },
  { number: 89, name: "Al-Fajr", englishName: "The Dawn", ayahs: 30 },
  { number: 90, name: "Al-Balad", englishName: "The City", ayahs: 20 },
  { number: 91, name: "Ash-Shams", englishName: "The Sun", ayahs: 15 },
  { number: 92, name: "Al-Layl", englishName: "The Night", ayahs: 21 },
  { number: 93, name: "Ad-Duhaa", englishName: "The Morning Hours", ayahs: 11 },
  { number: 94, name: "Ash-Sharh", englishName: "The Relief", ayahs: 8 },
  { number: 95, name: "At-Tin", englishName: "The Fig", ayahs: 8 },
  { number: 96, name: "Al-'Alaq", englishName: "The Clot", ayahs: 19 },
  { number: 97, name: "Al-Qadr", englishName: "The Power", ayahs: 5 },
  { number: 98, name: "Al-Bayyinah", englishName: "The Clear Proof", ayahs: 8 },
  { number: 99, name: "Az-Zalzalah", englishName: "The Earthquake", ayahs: 8 },
  { number: 100, name: "Al-'Adiyat", englishName: "The Courser", ayahs: 11 },
  { number: 101, name: "Al-Qari'ah", englishName: "The Calamity", ayahs: 11 },
  {
    number: 102,
    name: "At-Takathur",
    englishName: "The Rivalry in World Increase",
    ayahs: 8,
  },
  { number: 103, name: "Al-'Asr", englishName: "The Declining Day", ayahs: 3 },
  { number: 104, name: "Al-Humazah", englishName: "The Traducer", ayahs: 9 },
  { number: 105, name: "Al-Fil", englishName: "The Elephant", ayahs: 5 },
  { number: 106, name: "Quraysh", englishName: "Quraysh", ayahs: 4 },
  {
    number: 107,
    name: "Al-Ma'un",
    englishName: "The Small Kindnesses",
    ayahs: 7,
  },
  { number: 108, name: "Al-Kawthar", englishName: "The Abundance", ayahs: 3 },
  {
    number: 109,
    name: "Al-Kafirun",
    englishName: "The Disbelievers",
    ayahs: 6,
  },
  { number: 110, name: "An-Nasr", englishName: "The Divine Support", ayahs: 3 },
  { number: 111, name: "Al-Masad", englishName: "The Palm Fiber", ayahs: 5 },
  { number: 112, name: "Al-Ikhlas", englishName: "The Sincerity", ayahs: 4 },
  { number: 113, name: "Al-Falaq", englishName: "The Daybreak", ayahs: 5 },
  { number: 114, name: "An-Nas", englishName: "The Mankind", ayahs: 6 },
];

// Bhagavad Gita: 18 chapters with verse counts
const gitaChapters = [
  { chapter: 1, name: "Arjuna Visada Yoga", verses: 47 },
  { chapter: 2, name: "Sankhya Yoga", verses: 72 },
  { chapter: 3, name: "Karma Yoga", verses: 43 },
  { chapter: 4, name: "Jnana Karma Sanyasa Yoga", verses: 42 },
  { chapter: 5, name: "Karma Sanyasa Yoga", verses: 29 },
  { chapter: 6, name: "Atma Samyama Yoga", verses: 47 },
  { chapter: 7, name: "Jnana Vijnana Yoga", verses: 30 },
  { chapter: 8, name: "Aksara Brahma Yoga", verses: 28 },
  { chapter: 9, name: "Raja Vidya Yoga", verses: 34 },
  { chapter: 10, name: "Vibhuti Yoga", verses: 42 },
  { chapter: 11, name: "Visvarupa Darsana Yoga", verses: 55 },
  { chapter: 12, name: "Bhakti Yoga", verses: 20 },
  { chapter: 13, name: "Ksetra Ksetrajna Vibhaga Yoga", verses: 35 },
  { chapter: 14, name: "Gunatraya Vibhaga Yoga", verses: 27 },
  { chapter: 15, name: "Purusottama Yoga", verses: 20 },
  { chapter: 16, name: "Daivasura Sampad Vibhaga Yoga", verses: 24 },
  { chapter: 17, name: "Sraddhatraya Vibhaga Yoga", verses: 28 },
  { chapter: 18, name: "Moksa Sanyasa Yoga", verses: 78 },
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

// ─── SPIRITUAL READER COMPONENT ────────────────────────────────────────────────

type SpiritualTab = "bible" | "quran" | "gita";

interface SpiritualReading {
  bible: string;
  quran: string;
  gita: string;
}

function SpiritualReader({
  darkMode,
  onReadingChange,
}: {
  darkMode: boolean;
  onReadingChange: (reading: SpiritualReading) => void;
}) {
  const textMuted = darkMode ? "text-gray-400" : "text-slate-500";
  const textFaint = darkMode ? "text-gray-600" : "text-slate-400";

  const selectClass = `px-3 py-2.5 rounded-xl border text-sm outline-none cursor-pointer transition-all ${
    darkMode
      ? "bg-black/30 border-white/[0.08] text-white/80 focus:border-indigo-500/50"
      : "bg-white border-slate-200 text-slate-800 focus:border-indigo-400"
  }`;

  const bibleBoxClass = darkMode
    ? "bg-black/30 border-white/[0.05]"
    : "bg-slate-50 border-slate-200";

  // ── Active spiritual tab ──
  const [activeTab, setActiveTab] = useState<SpiritualTab>("bible");

  // ── Shared spiritual readings state ──
  const [spiritualReading, setSpiritualReading] = useState<SpiritualReading>({
    bible: "",
    quran: "",
    gita: "",
  });

  const updateReading = (key: SpiritualTab, value: string) => {
    const updated = { ...spiritualReading, [key]: value };
    setSpiritualReading(updated);
    onReadingChange(updated);
  };

  // ── Bible state ──
  const [bibleBook, setBibleBook] = useState("John");
  const [bibleChapter, setBibleChapter] = useState(3);
  const [bibleContent, setBibleContent] = useState("");
  const [bibleLoading, setBibleLoading] = useState(false);
  const [bibleReaderOpen, setBibleReaderOpen] = useState(false);
  const [bibleError, setBibleError] = useState("");

  // ── Quran state ──
  const [quranSurah, setQuranSurah] = useState(1);
  const [quranContent, setQuranContent] = useState<
    { number: number; text: string; translation: string }[]
  >([]);
  const [quranLoading, setQuranLoading] = useState(false);
  const [quranReaderOpen, setQuranReaderOpen] = useState(false);
  const [quranError, setQuranError] = useState("");

  // ── Gita state ──
  const [gitaChapter, setGitaChapter] = useState(1);
  const [gitaVerse, setGitaVerse] = useState(1);
  const [gitaContent, setGitaContent] = useState<{
    slok: string;
    transliteration: string;
    tej: { ht: string };
    siva: { et: string };
  } | null>(null);
  const [gitaLoading, setGitaLoading] = useState(false);
  const [gitaError, setGitaError] = useState("");

  // ── Bible fetch ──
  const fetchBibleChapter = async () => {
    setBibleLoading(true);
    setBibleError("");
    try {
      const res = await fetch(
        `https://bible-api.com/${bibleBook}%20${bibleChapter}`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const text = data.verses
        .map((v: any) => `${v.verse}. ${v.text}`)
        .join("\n");
      setBibleContent(text);
      setBibleReaderOpen(true);
      updateReading("bible", `${bibleBook} ${bibleChapter}`);
    } catch {
      setBibleError("Failed to load chapter. Please try again.");
      setBibleContent("");
    }
    setBibleLoading(false);
  };

  // ── Quran fetch ──
  const fetchQuranSurah = async () => {
    setQuranLoading(true);
    setQuranError("");
    try {
      // Fetch Arabic + English translation in parallel
      const [arabicRes, translationRes] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${quranSurah}`),
        fetch(`https://api.alquran.cloud/v1/surah/${quranSurah}/en.asad`),
      ]);
      if (!arabicRes.ok || !translationRes.ok)
        throw new Error("Failed to fetch");
      const arabicData = await arabicRes.json();
      const translationData = await translationRes.json();

      const verses = arabicData.data.ayahs.map((ayah: any, i: number) => ({
        number: ayah.numberInSurah,
        text: ayah.text,
        translation: translationData.data.ayahs[i]?.text || "",
      }));
      setQuranContent(verses);
      setQuranReaderOpen(true);
      const surahInfo = quranSurahs.find((s) => s.number === quranSurah);
      updateReading("quran", `Surah ${quranSurah}: ${surahInfo?.name || ""}`);
    } catch {
      setQuranError("Failed to load Surah. Please try again.");
      setQuranContent([]);
    }
    setQuranLoading(false);
  };

  // ── Gita fetch ──
  const fetchGitaVerse = async () => {
    setGitaLoading(true);
    setGitaError("");
    try {
      const res = await fetch(
       `https://vedicscriptures.github.io/slok/${gitaChapter}/${gitaVerse}`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setGitaContent(data);
      updateReading("gita", `Chapter ${gitaChapter}, Verse ${gitaVerse}`);
    } catch {
      setGitaError("Failed to load verse. Please try again.");
      setGitaContent(null);
    }
    setGitaLoading(false);
  };

  const selectedSurahInfo = quranSurahs.find((s) => s.number === quranSurah);
  const selectedGitaChapter = gitaChapters.find(
    (c) => c.chapter === gitaChapter,
  );
  const maxGitaVerse = selectedGitaChapter?.verses || 47;

  const tabConfig: {
    key: SpiritualTab;
    label: string;
    emoji: string;
    color: string;
  }[] = [
    { key: "bible", label: "Bible", emoji: "✝️", color: "#818cf8" },
    { key: "quran", label: "Quran", emoji: "☪️", color: "#34d399" },
    { key: "gita", label: "Gita", emoji: "🕉️", color: "#fb923c" },
  ];

  return (
    <div>
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-5">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all duration-200"
            style={
              activeTab === tab.key
                ? {
                    background: `${tab.color}20`,
                    borderColor: `${tab.color}55`,
                    color: darkMode ? tab.color : tab.color,
                    boxShadow: `0 0 16px ${tab.color}20`,
                  }
                : {
                    background: darkMode ? "rgba(255,255,255,0.03)" : "#f8fafc",
                    borderColor: darkMode
                      ? "rgba(255,255,255,0.08)"
                      : "#e2e8f0",
                    color: darkMode ? "rgba(255,255,255,0.4)" : "#94a3b8",
                  }
            }
          >
            <span>{tab.emoji}</span>
            {tab.label}
            {spiritualReading[tab.key] && (
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: tab.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── BIBLE TAB ── */}
      {activeTab === "bible" && (
        <div>
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
                background: "rgba(129,140,248,0.15)",
                border: "1px solid rgba(129,140,248,0.35)",
                color: darkMode ? "#a5b4fc" : "#4f46e5",
              }}
            >
              {bibleLoading ? "Loading…" : "Read Chapter"}
            </button>
          </div>

          {bibleError && (
            <p className="text-xs text-red-400 mb-3">{bibleError}</p>
          )}

          {bibleContent ? (
            <div>
              <button
                onClick={() => setBibleReaderOpen(!bibleReaderOpen)}
                className={`flex items-center gap-2 text-xs mb-2 transition-colors ${textMuted}`}
              >
                <ChevronDown
                  size={13}
                  className={`transition-transform ${bibleReaderOpen ? "rotate-180" : ""}`}
                />
                {bibleReaderOpen ? "Hide" : "Show"} Chapter · {bibleBook}{" "}
                {bibleChapter}
              </button>
              {bibleReaderOpen && (
                <div
                  className={`h-52 overflow-y-auto rounded-xl p-4 text-sm leading-relaxed whitespace-pre-line border ${bibleBoxClass} ${textMuted}`}
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
        </div>
      )}

      {/* ── QURAN TAB ── */}
      {activeTab === "quran" && (
        <div>
          <div className="flex flex-wrap gap-3 mb-4">
            <select
              value={quranSurah}
              onChange={(e) => setQuranSurah(Number(e.target.value))}
              className={`${selectClass} max-w-xs`}
            >
              {quranSurahs.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.name} — {s.englishName}
                </option>
              ))}
            </select>

            {selectedSurahInfo && (
              <span className={`text-xs self-center ${textFaint}`}>
                {selectedSurahInfo.ayahs} verses
              </span>
            )}

            <button
              onClick={fetchQuranSurah}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: "rgba(52,211,153,0.15)",
                border: "1px solid rgba(52,211,153,0.35)",
                color: darkMode ? "#6ee7b7" : "#059669",
              }}
            >
              {quranLoading ? "Loading…" : "Read Surah"}
            </button>
          </div>

          {quranError && (
            <p className="text-xs text-red-400 mb-3">{quranError}</p>
          )}

          {quranContent.length > 0 ? (
            <div>
              <button
                onClick={() => setQuranReaderOpen(!quranReaderOpen)}
                className={`flex items-center gap-2 text-xs mb-2 transition-colors ${textMuted}`}
              >
                <ChevronDown
                  size={13}
                  className={`transition-transform ${quranReaderOpen ? "rotate-180" : ""}`}
                />
                {quranReaderOpen ? "Hide" : "Show"} Surah ·{" "}
                {selectedSurahInfo?.name}
              </button>
              {quranReaderOpen && (
                <div
                  className={`h-52 overflow-y-auto rounded-xl p-4 border ${bibleBoxClass}`}
                >
                  {quranContent.map((ayah) => (
                    <div key={ayah.number} className="mb-4">
                      <div className="flex items-start gap-3">
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{
                            background: "rgba(52,211,153,0.15)",
                            color: "#34d399",
                          }}
                        >
                          {ayah.number}
                        </span>
                        <div className="flex-1">
                          <p
                            className="text-right text-base leading-loose mb-1"
                            style={{
                              fontFamily: "'Amiri', 'Scheherazade New', serif",
                              color: darkMode
                                ? "rgba(255,255,255,0.85)"
                                : "#1e293b",
                              direction: "rtl",
                            }}
                          >
                            {ayah.text}
                          </p>
                          <p className={`text-xs leading-relaxed ${textMuted}`}>
                            {ayah.translation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
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
              Select a Surah, then click Read
            </div>
          )}
        </div>
      )}

      {/* ── GITA TAB ── */}
      {activeTab === "gita" && (
        <div>
          <div className="flex flex-wrap gap-3 mb-4">
            <select
              value={gitaChapter}
              onChange={(e) => {
                setGitaChapter(Number(e.target.value));
                setGitaVerse(1);
                setGitaContent(null);
              }}
              className={`${selectClass} max-w-xs`}
            >
              {gitaChapters.map((c) => (
                <option key={c.chapter} value={c.chapter}>
                  Ch {c.chapter}: {c.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              max={maxGitaVerse}
              value={gitaVerse}
              onChange={(e) => {
                let v = Number(e.target.value);
                v = Math.min(Math.max(v, 1), maxGitaVerse);
                setGitaVerse(v);
              }}
              className={`w-20 px-3 py-2.5 rounded-xl border text-sm text-center outline-none transition-all ${
                darkMode
                  ? "bg-black/30 border-white/[0.08] text-white/90 focus:border-orange-500/50"
                  : "bg-white border-slate-200 text-slate-900 focus:border-orange-400"
              }`}
            />

            <span className={`text-xs self-center ${textFaint}`}>
              verse / {maxGitaVerse}
            </span>

            <button
              onClick={fetchGitaVerse}
              className="px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{
                background: "rgba(251,146,60,0.15)",
                border: "1px solid rgba(251,146,60,0.35)",
                color: darkMode ? "#fdba74" : "#ea580c",
              }}
            >
              {gitaLoading ? "Loading…" : "Read Verse"}
            </button>
          </div>

          {gitaError && (
            <p className="text-xs text-red-400 mb-3">{gitaError}</p>
          )}

          {gitaContent ? (
            <div className={`rounded-xl p-5 border ${bibleBoxClass}`}>
              {/* Sanskrit */}
              <p
                className="text-center text-base leading-loose mb-3"
                style={{
                  fontFamily: "'Noto Serif Devanagari', serif",
                  color: darkMode ? "rgba(255,255,255,0.9)" : "#1e293b",
                }}
              >
                {gitaContent.slok}
              </p>

              {/* Divider */}
              <div
                className="w-16 h-px mx-auto mb-3"
                style={{ background: "rgba(251,146,60,0.3)" }}
              />

              {/* Transliteration */}
              {gitaContent.transliteration && (
                <p
                  className="text-center text-xs italic mb-3"
                  style={{
                    color: darkMode ? "rgba(251,146,60,0.7)" : "#ea580c",
                  }}
                >
                  {gitaContent.transliteration}
                </p>
              )}

              {/* Hindi meaning */}
              {gitaContent.tej?.ht && (
                <div className="mb-2">
                  <span
                    className="text-[10px] uppercase font-semibold tracking-wider"
                    style={{ color: "rgba(251,146,60,0.6)" }}
                  >
                    Hindi
                  </span>
                  <p className={`text-sm leading-relaxed mt-1 ${textMuted}`}>
                    {gitaContent.tej.ht}
                  </p>
                </div>
              )}

              {/* English meaning */}
              {gitaContent.siva?.et && (
                <div>
                  <span
                    className="text-[10px] uppercase font-semibold tracking-wider"
                    style={{ color: "rgba(251,146,60,0.6)" }}
                  >
                    English
                  </span>
                  <p className={`text-sm leading-relaxed mt-1 ${textMuted}`}>
                    {gitaContent.siva.et}
                  </p>
                </div>
              )}

              <p
                className="text-[10px] mt-3 text-right"
                style={{ color: "rgba(251,146,60,0.4)" }}
              >
                Chapter {gitaChapter}, Verse {gitaVerse} ·{" "}
                {selectedGitaChapter?.name}
              </p>
            </div>
          ) : (
            <div
              className={`flex items-center justify-center h-28 rounded-xl border border-dashed text-sm ${textFaint} ${
                darkMode
                  ? "bg-black/20 border-white/[0.06]"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              Select a chapter &amp; verse, then click Read
            </div>
          )}
        </div>
      )}

      {/* Reading summary badges */}
      {(spiritualReading.bible ||
        spiritualReading.quran ||
        spiritualReading.gita) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {spiritualReading.bible && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs"
              style={{
                background: "rgba(129,140,248,0.1)",
                borderColor: "rgba(129,140,248,0.25)",
                color: darkMode ? "#a5b4fc" : "#4f46e5",
              }}
            >
              ✝️ {spiritualReading.bible}
            </span>
          )}
          {spiritualReading.quran && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs"
              style={{
                background: "rgba(52,211,153,0.1)",
                borderColor: "rgba(52,211,153,0.25)",
                color: darkMode ? "#6ee7b7" : "#059669",
              }}
            >
              ☪️ {spiritualReading.quran}
            </span>
          )}
          {spiritualReading.gita && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs"
              style={{
                background: "rgba(251,146,60,0.1)",
                borderColor: "rgba(251,146,60,0.25)",
                color: darkMode ? "#fdba74" : "#ea580c",
              }}
            >
              🕉️ {spiritualReading.gita}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export default function TrackDay({ userId }: Props) {
  const { darkMode } = useTheme();

  const bg = darkMode ? "bg-[#060910]" : "bg-slate-100";
  const text = darkMode ? "text-white" : "text-slate-900";
  const textMuted = darkMode ? "text-gray-400" : "text-slate-500";
  const textFaint = darkMode ? "text-gray-600" : "text-slate-400";

  const inputBase = darkMode
    ? "bg-black/30 border-white/[0.08] text-white placeholder-white/25 focus:border-indigo-500/60 focus:bg-black/40 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]"
    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-400 focus:bg-white focus:shadow-[0_0_0_3px_rgba(99,102,241,0.10)]";

  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-sm ${inputBase}`;
  const textareaClass = `w-full px-4 py-3 rounded-xl border outline-none transition-all duration-200 text-sm resize-none ${inputBase}`;

 
  const counterBtnClass = `w-7 h-7 rounded-lg border flex items-center justify-center transition-colors ${
    darkMode
      ? "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
      : "bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200"
  }`;

  const statChipClass = `flex flex-col items-center px-4 py-3 rounded-xl border transition-colors ${
    darkMode
      ? "bg-white/[0.04] border-white/[0.06]"
      : "bg-white border-slate-200 shadow-sm"
  }`;

  const goalItemClass = `flex items-center gap-3 px-4 py-3 rounded-xl border mb-2 transition-colors ${
    darkMode
      ? "bg-white/[0.03] border-white/[0.06]"
      : "bg-slate-50 border-slate-200"
  }`;

  const expenseTagClass = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors ${
    darkMode
      ? "bg-white/[0.04] border-white/[0.07] text-white/60"
      : "bg-slate-100 border-slate-200 text-slate-600"
  }`;

  const progressTrackClass = darkMode ? "bg-white/[0.06]" : "bg-slate-200";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // ── State ──
  const [spiritualReading, setSpiritualReading] = useState({
    bible: "",
    quran: "",
    gita: "",
  });

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

      const spiritualSummary = [
        spiritualReading.bible && `Bible: ${spiritualReading.bible}`,
        spiritualReading.quran && `Quran: ${spiritualReading.quran}`,
        spiritualReading.gita && `Gita: ${spiritualReading.gita}`,
      ]
        .filter(Boolean)
        .join(", ");

      const res = await fetch(
        `https://ai-life-tracker.onrender.com/api/daily/${userId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            bibleReading: spiritualSummary || "",
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
        },
      );
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
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Noto+Serif+Devanagari:wght@400;500&family=Amiri:wght@400;700&display=swap');
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
                      : { color: "#1e293b" }
                  }
                >
                  Daily Log
                </h1>
                <p className={`mt-1 text-sm ${textMuted}`}>
                  Track what matters. AI will do the rest.
                </p>
              </div>
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
                      className={`w-16 px-3 py-2 rounded-xl border text-sm outline-none text-center transition-all ${darkMode ? "bg-black/30 border-white/[0.08] text-white placeholder-white/20 focus:border-rose-500/50" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-rose-400"}`}
                    />
                    <input
                      placeholder="type"
                      value={exerciseType}
                      onChange={(e) => setExerciseType(e.target.value)}
                      className={`flex-1 px-3 py-2 rounded-xl border text-sm outline-none transition-all ${darkMode ? "bg-black/30 border-white/[0.08] text-white placeholder-white/20 focus:border-rose-500/50" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-rose-400"}`}
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
                        className={`w-[18px] h-[18px] rounded-[6px] border-[1.5px] cursor-pointer flex-shrink-0 flex items-center justify-center transition-all ${goalsDone[i] ? "bg-indigo-500 border-indigo-500" : darkMode ? "border-white/20" : "border-slate-300"}`}
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

            {/* ── 3. SPIRITUAL (Bible + Quran + Gita) ── */}
            <SectionCard>
              <SectionHeader
                icon={<BookOpen size={16} />}
                label="Spiritual Reading"
                accent="#818cf8"
              />
              <SpiritualReader
                darkMode={darkMode}
                onReadingChange={setSpiritualReading}
              />
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
                      className={`w-24 px-3 py-2.5 rounded-xl border text-sm outline-none text-center transition-all ${darkMode ? "bg-black/30 border-white/[0.08] text-white/90 placeholder-white/20 focus:border-pink-500/50" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-pink-400"}`}
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
   // AFTER — passes all wellness, goals, gratitude, tomorrowPlan
onDownload={() =>
  generatePDF(
    result,
    form,
    expenseList,
    appList,
    selectedMood,
    diaryTitle,
    {
      sleepHours,
      waterIntake,
      exerciseMin,
      exerciseType,
      morningRoutine,
      caffeineCount,
      focusMode,
    },
    todayGoals.map((text, i) => ({ text, done: goalsDone[i] ?? false })),
    gratitude,
    tomorrowPlan,
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
