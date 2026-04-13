import { useEffect, useRef, useState } from "react";
import {
  Camera,
  Edit3,
  Check,
  X,
  LogOut,
  Moon,
  Sun,
  Trash2,
  ChevronRight,
  Award,
  Flame,
  Target,
  BookOpen,
  Code2,
  TrendingUp,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext"; // 🔥 import ThemeContext

type Props = { userId: number };

export default function Profile({ userId }: Props) {
  const { darkMode, toggleDarkMode } = useTheme(); // 🔥 use global theme — no local darkMode state

  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingName, setEditingName] = useState(false);
  const [editingBio, setEditingBio] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBio, setNewBio] = useState("");

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const BASE_URL = "https://ai-life-tracker.onrender.com";
  useEffect(() => {
    const savedPhoto = localStorage.getItem(`profile_photo_${userId}`);
    const savedBio = localStorage.getItem(`profile_bio_${userId}`);
    if (savedPhoto) setPhotoUrl(savedPhoto);
    if (savedBio) setNewBio(savedBio);

    Promise.all([
      fetch(`${BASE_URL}/api/users`).then((r) => r.json()),
      fetch(`${BASE_URL}/api/daily`).then((r) => r.json()),
    ]).then(([users, allLogs]) => {
      const found = users.find((u: any) => u.id === userId);
      setUser(found || null);
      if (found) setNewName(found.name || "");
      const userLogs = allLogs
        .filter((l: any) => l.user?.id === userId)
        .sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime(),
        );
      setLogs(userLogs);
      setLoading(false);
    });
  }, [userId]);

  const totalLogs = logs.length;
  const avgScore =
    totalLogs > 0
      ? (logs.reduce((s, l) => s + (l.score || 0), 0) / totalLogs).toFixed(1)
      : "0.0";
  const bestScore =
    totalLogs > 0 ? Math.max(...logs.map((l) => l.score || 0)) : 0;
  const streak = (() => {
    let count = 0;
    for (let i = logs.length - 1; i >= 0; i--) {
      if ((logs[i].score || 0) >= 6) count++;
      else break;
    }
    return count;
  })();
  const consistency =
    totalLogs > 0
      ? Math.round(
          (logs.filter((l) => (l.score || 0) >= 6).length / totalLogs) * 100,
        )
      : 0;
  const bibledays = logs.filter((l) => l.bibleReading).length;
  const codingDays = logs.filter((l) => l.codingWork).length;

  const achievements = [
    {
      icon: <Flame className="w-5 h-5" />,
      label: "On Fire",
      desc: `${streak} day streak`,
      earned: streak >= 3,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: "Consistent",
      desc: `${consistency}% consistency`,
      earned: consistency >= 70,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: "Perfect Day",
      desc: `Best: ${bestScore}/10`,
      earned: bestScore >= 9,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Faithful Reader",
      desc: `${bibledays} bible days`,
      earned: bibledays >= 7,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      label: "Code Warrior",
      desc: `${codingDays} coding days`,
      earned: codingDays >= 7,
      color: "text-green-400",
      bg: "bg-green-500/10 border-green-500/20",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Tracker",
      desc: `${totalLogs} total logs`,
      earned: totalLogs >= 10,
      color: "text-violet-400",
      bg: "bg-violet-500/10 border-violet-500/20",
    },
  ];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;
      setPhotoUrl(url);
      localStorage.setItem(`profile_photo_${userId}`, url);
    };
    reader.readAsDataURL(file);
  };

  const saveName = () => {
    if (!newName.trim()) return;
    setUser((u: any) => ({ ...u, name: newName.trim() }));
    setEditingName(false);
  };

  const saveBio = () => {
    localStorage.setItem(`profile_bio_${userId}`, newBio);
    setEditingBio(false);
  };

  const handleChangePassword = async () => {
    setPwError("");
    setPwSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("All fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    try {
      setPwLoading(true);
      const res = await fetch(`${BASE_URL}/api/users/${userId}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        setPwError((await res.text()) || "Failed to change password.");
        return;
      }
      setPwSuccess("✅ Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setShowPasswordModal(false);
        setPwSuccess("");
      }, 1500);
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Failed to delete account. Please try again.");
        return;
      }
      localStorage.clear();
      window.location.reload();
    } catch {
      alert("Network error. Could not delete account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  // Theme-aware classes — all derived from ThemeContext's darkMode
  const bg = darkMode ? "bg-[#060910]" : "bg-slate-100";
  const cardBg = darkMode
    ? "bg-white/[0.03] border-white/[0.07]"
    : "bg-white border-slate-200";
  const textPrimary = darkMode ? "text-white" : "text-slate-900";
  const textSecondary = darkMode ? "text-gray-400" : "text-slate-500";
  const inputBg = darkMode
    ? "bg-white/5 border-white/10 text-white"
    : "bg-slate-100 border-slate-300 text-slate-900";
  const divideBg = darkMode ? "divide-white/[0.05]" : "divide-slate-100";

  if (loading) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
          <p className={`${textSecondary} text-xs tracking-[0.25em] uppercase`}>
            Loading profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${bg} ${textPrimary} transition-colors duration-300`}
    >
      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div
            className={`w-full max-w-md rounded-2xl border ${cardBg} p-6 shadow-2xl space-y-4`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-indigo-400" />
                <h3 className={`text-lg font-bold ${textPrimary}`}>
                  Change Password
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPwError("");
                  setPwSuccess("");
                }}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {pwError && (
              <p className="text-rose-400 text-sm bg-rose-500/10 rounded-lg px-3 py-2">
                {pwError}
              </p>
            )}
            {pwSuccess && (
              <p className="text-emerald-400 text-sm bg-emerald-500/10 rounded-lg px-3 py-2">
                {pwSuccess}
              </p>
            )}

            <div className="space-y-3">
              <div className="relative">
                <label className={`text-xs ${textSecondary} mb-1 block`}>
                  Current Password
                </label>
                <input
                  type={showCurrentPw ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-500 transition pr-10 ${inputBg}`}
                />
                <button
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-8 text-gray-500 hover:text-gray-300"
                >
                  {showCurrentPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="relative">
                <label className={`text-xs ${textSecondary} mb-1 block`}>
                  New Password
                </label>
                <input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-500 transition pr-10 ${inputBg}`}
                />
                <button
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-8 text-gray-500 hover:text-gray-300"
                >
                  {showNewPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div>
                <label className={`text-xs ${textSecondary} mb-1 block`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-indigo-500 transition ${inputBg}`}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleChangePassword}
                disabled={pwLoading}
                className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90 transition disabled:opacity-50 text-white"
              >
                {pwLoading ? "Updating..." : "Update Password"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPwError("");
                  setPwSuccess("");
                }}
                className={`px-5 py-3 rounded-xl border text-sm ${inputBg} hover:opacity-80 transition`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ambient glow (dark only) */}
      {darkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-60px] right-[10%] w-[420px] h-[420px] bg-violet-700/8 rounded-full blur-[130px]" />
          <div className="absolute bottom-[15%] left-[5%] w-[360px] h-[360px] bg-indigo-700/6 rounded-full blur-[110px]" />
        </div>
      )}

      <div className="relative max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* HEADER */}
        <div>
          <p className="text-xs tracking-[0.3em] text-indigo-400 uppercase mb-1">
            Your Profile
          </p>
          <h1 className={`text-4xl font-black tracking-tight ${textPrimary}`}>
            Account
          </h1>
        </div>

        {/* PROFILE CARD */}
        <div
          className={`border rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden ${cardBg}`}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />
          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-7">
            {/* Avatar */}
            <div className="relative group flex-shrink-0">
              <div
                className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-white/10 bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-black text-white/60">
                    {initials}
                  </span>
                )}
              </div>
              <div
                className="absolute inset-0 rounded-3xl bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                <Camera className="w-6 h-6 text-white" />
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-full bg-indigo-500 border-2 border-[#060910] flex items-center justify-center hover:bg-indigo-400 transition"
              >
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Name / Email / Bio */}
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveName()}
                      autoFocus
                      className={`rounded-xl px-4 py-2 text-xl font-bold outline-none focus:border-indigo-400 transition w-56 border ${inputBg}`}
                    />
                    <button
                      onClick={saveName}
                      className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center hover:bg-emerald-500/30 transition"
                    >
                      <Check className="w-4 h-4 text-emerald-400" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setNewName(user?.name || "");
                      }}
                      className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center hover:bg-rose-500/30 transition"
                    >
                      <X className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className={`text-2xl font-black ${textPrimary}`}>
                      {user?.name || "Unknown"}
                    </h2>
                    <button
                      onClick={() => setEditingName(true)}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-indigo-500/40 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>

              <p className={`${textSecondary} text-sm flex items-center gap-2`}>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 inline-block" />
                {user?.email || "No email"}
              </p>

              <div>
                {editingBio ? (
                  <div className="space-y-2">
                    <textarea
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                      autoFocus
                      placeholder="Write something about yourself..."
                      rows={2}
                      className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-400 transition resize-none border ${inputBg}`}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveBio}
                        className="px-4 py-1.5 rounded-lg bg-indigo-500 text-xs font-semibold hover:bg-indigo-400 transition text-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingBio(false)}
                        className="px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:bg-white/10 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingBio(true)}
                    className={`text-sm ${textSecondary} hover:text-gray-300 transition flex items-center gap-1.5 group`}
                  >
                    <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition" />
                    {newBio || "Add a bio..."}
                  </button>
                )}
              </div>

              <p
                className={`text-[11px] uppercase tracking-widest ${darkMode ? "text-gray-700" : "text-slate-400"}`}
              >
                Member · {totalLogs} entries logged
              </p>
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Logs",
              value: totalLogs,
              icon: "📋",
              color: "text-indigo-400",
            },
            {
              label: "Avg Score",
              value: avgScore,
              icon: "📊",
              color: "text-violet-400",
            },
            {
              label: "Best Score",
              value: bestScore,
              icon: "🏆",
              color: "text-amber-400",
            },
            {
              label: "Streak",
              value: `${streak}d`,
              icon: "🔥",
              color: "text-orange-400",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`border rounded-2xl p-4 text-center hover:scale-[1.02] transition ${cardBg}`}
            >
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p
                className={`text-[10px] uppercase tracking-wider mt-0.5 ${textSecondary}`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ACHIEVEMENTS */}
        <div>
          <h2 className={`text-base font-bold mb-1 ${textPrimary}`}>
            Achievements
          </h2>
          <p className={`text-xs mb-4 ${textSecondary}`}>
            {achievements.filter((a) => a.earned).length} of{" "}
            {achievements.length} earned
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={`rounded-2xl p-4 border transition-all ${a.earned ? `${a.bg} hover:scale-[1.02]` : "bg-white/[0.02] border-white/[0.04] opacity-40 grayscale"}`}
              >
                <div className={`mb-2 ${a.earned ? a.color : "text-gray-600"}`}>
                  {a.icon}
                </div>
                <p className={`text-sm font-bold ${textPrimary}`}>{a.label}</p>
                <p className={`text-[11px] mt-0.5 ${textSecondary}`}>
                  {a.desc}
                </p>
                {a.earned && (
                  <span className="text-[9px] text-emerald-400 uppercase tracking-widest mt-1.5 block">
                    ✓ Earned
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONSISTENCY BAR */}
        <div className={`border rounded-2xl p-5 backdrop-blur-sm ${cardBg}`}>
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className={`text-sm font-semibold ${textPrimary}`}>
                Consistency Score
              </h3>
              <p className={`text-xs ${textSecondary}`}>
                Days scored 6 or above
              </p>
            </div>
            <span className="text-2xl font-black text-cyan-400">
              {consistency}%
            </span>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000"
              style={{ width: `${consistency}%` }}
            />
          </div>
          <div
            className={`flex justify-between mt-2 text-[10px] ${darkMode ? "text-gray-700" : "text-slate-400"}`}
          >
            <span>0%</span>
            <span>Target: 80%</span>
            <span>100%</span>
          </div>
        </div>

        {/* SETTINGS */}
        <div>
          <h2 className={`text-base font-bold mb-4 ${textPrimary}`}>
            Settings
          </h2>
          <div
            className={`border rounded-2xl overflow-hidden backdrop-blur-sm divide-y ${cardBg} ${divideBg}`}
          >
            {/* Dark / Light Mode — powered by ThemeContext */}
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  {darkMode ? (
                    <Moon className="w-4 h-4 text-violet-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-yellow-400" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${textPrimary}`}>
                    {darkMode ? "Dark Mode" : "Light Mode"}
                  </p>
                  <p className={`text-xs ${textSecondary}`}>
                    {darkMode
                      ? "Switch to light interface"
                      : "Switch to dark interface"}
                  </p>
                </div>
              </div>
              {/* 🔥 toggleDarkMode from ThemeContext — persists globally across the whole app */}
              <button
                onClick={toggleDarkMode}
                className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${darkMode ? "bg-violet-500" : "bg-yellow-400"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${darkMode ? "left-5" : "left-0.5"}`}
                />
              </button>
            </div>

            {/* Change Password */}
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.03] transition group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-medium ${textPrimary}`}>
                    Change Password
                  </p>
                  <p className={`text-xs ${textSecondary}`}>
                    Update your credentials
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition" />
            </button>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div>
          <h2 className="text-base font-bold text-rose-500/70 mb-4">
            Danger Zone
          </h2>
          <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl overflow-hidden">
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-rose-500/10 transition"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-rose-400">
                    Delete Account
                  </p>
                  <p className={`text-xs ${textSecondary}`}>
                    Permanently remove all your data
                  </p>
                </div>
              </button>
            ) : (
              <div className="px-5 py-4 space-y-3">
                <p className="text-sm text-rose-300 font-medium">
                  ⚠️ Are you sure? This cannot be undone. All logs will be
                  permanently deleted.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="px-5 py-2 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-400 transition disabled:opacity-50"
                  >
                    {deleteLoading ? "Deleting..." : "Yes, delete"}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-400 hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.removeItem("userId");
            window.location.reload();
          }}
          className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl border transition-all text-sm font-medium ${
            darkMode
              ? "bg-white/[0.03] border-white/[0.07] text-gray-400 hover:bg-white/[0.06] hover:text-white hover:border-white/15"
              : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
