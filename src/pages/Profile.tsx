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
  ShieldCheck,
  BarChart3,
  UserRound,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

type Props = {
  userId: number;
};

const BASE_URL = "https://ai-life-tracker.onrender.com";

export default function Profile({ userId }: Props) {
  const { darkMode, toggleDarkMode } = useTheme();

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

  /* -------------------------------------------------------
     THEME
  ------------------------------------------------------- */

  const pageBg = darkMode ? "bg-[#000000]" : "bg-[#f5f5f7]";

  const primaryText = darkMode ? "text-white" : "text-[#1d1d1f]";

  const secondaryText = darkMode ? "text-[#98989d]" : "text-[#6e6e73]";

  const mutedText = darkMode ? "text-[#636366]" : "text-[#86868b]";

  const cardBg = darkMode
    ? "bg-[#1c1c1e]/90 border-white/[0.06]"
    : "bg-white border-black/[0.05]";

  const groupedBg = darkMode ? "bg-[#1c1c1e]" : "bg-white";

  const divider = darkMode ? "border-white/[0.06]" : "border-black/[0.06]";

  const inputBg = darkMode
    ? "bg-[#2c2c2e] border-white/[0.08] text-white placeholder-[#636366]"
    : "bg-[#f2f2f7] border-black/[0.06] text-[#1d1d1f] placeholder-[#86868b]";

  /* -------------------------------------------------------
     LOAD DATA
  ------------------------------------------------------- */

  useEffect(() => {
    const savedPhoto = localStorage.getItem(`profile_photo_${userId}`);
    const savedBio = localStorage.getItem(`profile_bio_${userId}`);

    if (savedPhoto) setPhotoUrl(savedPhoto);
    if (savedBio) setNewBio(savedBio);

    Promise.all([
      fetch(`${BASE_URL}/api/users`).then((r) => r.json()),
      fetch(`${BASE_URL}/api/daily`).then((r) => r.json()),
    ])
      .then(([users, allLogs]) => {
        const found = users.find((u: any) => u.id === userId);

        setUser(found || null);

        if (found) {
          setNewName(found.name || "");
        }

        const userLogs = allLogs
          .filter((l: any) => l.user?.id === userId)
          .sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

        setLogs(userLogs);
      })
      .catch((error) => {
        console.error("Failed to load profile:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  /* -------------------------------------------------------
     STATS
  ------------------------------------------------------- */

  const totalLogs = logs.length;

  const avgScore =
    totalLogs > 0
      ? (
          logs.reduce((sum, log) => sum + (log.score || 0), 0) / totalLogs
        ).toFixed(1)
      : "0.0";

  const bestScore =
    totalLogs > 0 ? Math.max(...logs.map((l) => l.score || 0)) : 0;

  const streak = (() => {
    let count = 0;

    for (let i = logs.length - 1; i >= 0; i--) {
      if ((logs[i].score || 0) >= 6) {
        count++;
      } else {
        break;
      }
    }

    return count;
  })();

  const consistency =
    totalLogs > 0
      ? Math.round(
          (logs.filter((l) => (l.score || 0) >= 6).length / totalLogs) * 100,
        )
      : 0;

  const bibleDays = logs.filter((l) => l.bibleReading).length;

  const codingDays = logs.filter((l) => l.codingWork).length;

  /* -------------------------------------------------------
     ACHIEVEMENTS
  ------------------------------------------------------- */

  const achievements = [
    {
      icon: <Flame className="w-5 h-5" />,
      label: "On Fire",
      desc: `${streak} day streak`,
      earned: streak >= 3,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    },
    {
      icon: <Target className="w-5 h-5" />,
      label: "Consistent",
      desc: `${consistency}% consistency`,
      earned: consistency >= 70,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
    },
    {
      icon: <Award className="w-5 h-5" />,
      label: "Perfect Day",
      desc: `Best: ${bestScore}/10`,
      earned: bestScore >= 9,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: "Faithful Reader",
      desc: `${bibleDays} Bible days`,
      earned: bibleDays >= 7,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      icon: <Code2 className="w-5 h-5" />,
      label: "Code Warrior",
      desc: `${codingDays} coding days`,
      earned: codingDays >= 7,
      color: "text-green-400",
      bg: "bg-green-500/10",
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      label: "Tracker",
      desc: `${totalLogs} total logs`,
      earned: totalLogs >= 10,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
  ];

  const earnedAchievements = achievements.filter((a) => a.earned).length;

  /* -------------------------------------------------------
     PROFILE PHOTO
  ------------------------------------------------------- */

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please choose an image smaller than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const url = reader.result as string;

      setPhotoUrl(url);

      localStorage.setItem(`profile_photo_${userId}`, url);
    };

    reader.readAsDataURL(file);
  };

  /* -------------------------------------------------------
     NAME
  ------------------------------------------------------- */

  const saveName = () => {
    if (!newName.trim()) return;

    setUser((current: any) => ({
      ...current,
      name: newName.trim(),
    }));

    setEditingName(false);
  };

  /* -------------------------------------------------------
     BIO
  ------------------------------------------------------- */

  const saveBio = () => {
    localStorage.setItem(`profile_bio_${userId}`, newBio);

    setEditingBio(false);
  };

  /* -------------------------------------------------------
     PASSWORD
  ------------------------------------------------------- */

  const closePasswordModal = () => {
    if (pwLoading) return;

    setShowPasswordModal(false);
    setPwError("");
    setPwSuccess("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPw(false);
    setShowNewPw(false);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) {
        const message = await res.text();

        setPwError(message || "Failed to change password.");

        return;
      }

      setPwSuccess("Password changed successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        closePasswordModal();
      }, 1400);
    } catch {
      setPwError("Network error. Please try again.");
    } finally {
      setPwLoading(false);
    }
  };

  /* -------------------------------------------------------
     DELETE
  ------------------------------------------------------- */

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

  /* -------------------------------------------------------
     INITIALS
  ------------------------------------------------------- */

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  /* -------------------------------------------------------
     LOADING
  ------------------------------------------------------- */

  if (loading) {
    return (
      <div
        className={`min-h-screen ${pageBg} flex items-center justify-center`}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-7 h-7 rounded-full border-[2.5px] border-indigo-500 border-t-transparent animate-spin" />

          <p className={`text-xs ${secondaryText} tracking-wide`}>Loading</p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */

  return (
    <div
      className={`min-h-screen ${pageBg} ${primaryText} transition-colors duration-300`}
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* -------------------------------------------------
          PASSWORD SHEET
      ------------------------------------------------- */}

      {showPasswordModal && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-xl"
            onClick={closePasswordModal}
          />

          <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center">
            <div
              className={`w-full sm:max-w-md ${
                darkMode ? "bg-[#1c1c1e]" : "bg-[#f2f2f7]"
              } rounded-t-[30px] sm:rounded-[28px] shadow-2xl overflow-hidden animate-[sheetUp_0.3s_ease-out]`}
            >
              {/* Grabber */}
              <div className="flex justify-center pt-3 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-500/30" />
              </div>

              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between mb-7">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                      <KeyRound className="w-5 h-5 text-indigo-400" />
                    </div>

                    <div>
                      <h2 className={`text-lg font-bold ${primaryText}`}>
                        Change Password
                      </h2>

                      <p className={`text-xs ${secondaryText}`}>
                        Keep your account secure
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={closePasswordModal}
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      darkMode ? "bg-[#2c2c2e]" : "bg-black/[0.05]"
                    }`}
                  >
                    <X className={`w-4 h-4 ${secondaryText}`} />
                  </button>
                </div>

                {pwError && (
                  <div className="mb-4 px-4 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/10">
                    <p className="text-sm text-rose-400">{pwError}</p>
                  </div>
                )}

                {pwSuccess && (
                  <div className="mb-4 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/10">
                    <p className="text-sm text-emerald-400">✓ {pwSuccess}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {/* Current password */}
                  <div className="relative">
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Current password"
                      className={`w-full px-4 py-4 pr-12 rounded-2xl border outline-none focus:border-indigo-500/60 transition ${inputBg}`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowCurrentPw(!showCurrentPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showCurrentPw ? (
                        <EyeOff className={`w-4 h-4 ${mutedText}`} />
                      ) : (
                        <Eye className={`w-4 h-4 ${mutedText}`} />
                      )}
                    </button>
                  </div>

                  {/* New password */}
                  <div className="relative">
                    <input
                      type={showNewPw ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className={`w-full px-4 py-4 pr-12 rounded-2xl border outline-none focus:border-indigo-500/60 transition ${inputBg}`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPw(!showNewPw)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showNewPw ? (
                        <EyeOff className={`w-4 h-4 ${mutedText}`} />
                      ) : (
                        <Eye className={`w-4 h-4 ${mutedText}`} />
                      )}
                    </button>
                  </div>

                  {/* Confirm */}
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={`w-full px-4 py-4 rounded-2xl border outline-none focus:border-indigo-500/60 transition ${inputBg}`}
                  />
                </div>

                <div className="mt-5">
                  <button
                    onClick={handleChangePassword}
                    disabled={pwLoading}
                    className="w-full py-4 rounded-2xl bg-[#0071e3] hover:bg-[#0077ed] active:scale-[0.99] text-white font-semibold transition disabled:opacity-50"
                  >
                    {pwLoading ? "Updating..." : "Update Password"}
                  </button>
                </div>

                <button
                  onClick={closePasswordModal}
                  className={`w-full py-3 mt-2 text-sm font-medium ${secondaryText}`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------
          BACKGROUND
      ------------------------------------------------- */}

      {darkMode && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-200px] right-[-100px] w-[500px] h-[500px] rounded-full bg-indigo-600/[0.07] blur-[140px]" />
          <div className="absolute bottom-[10%] left-[-150px] w-[450px] h-[450px] rounded-full bg-violet-600/[0.05] blur-[130px]" />
        </div>
      )}

      {/* -------------------------------------------------
          MAIN
      ------------------------------------------------- */}

      <main className="relative max-w-2xl mx-auto px-4 sm:px-6 pt-8 pb-14">
        {/* Header */}
        <header className="mb-8 px-1">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400 mb-2`}
          >
            Profile
          </p>

          <h1
            className={`text-[34px] sm:text-[42px] leading-none font-bold tracking-[-0.04em] ${primaryText}`}
          >
            Account
          </h1>
        </header>

        {/* -------------------------------------------------
            PROFILE HERO
        ------------------------------------------------- */}

        <section
          className={`${cardBg} border rounded-[28px] p-5 sm:p-7 shadow-sm overflow-hidden relative`}
        >
          {darkMode && (
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.06] via-transparent to-purple-500/[0.04] pointer-events-none" />
          )}

          <div className="relative">
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}

              <div className="relative group mb-4">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl ring-4 ring-black/[0.03] active:scale-[0.98] transition"
                >
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-white">
                      {initials}
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Camera className="w-7 h-7 text-white" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-[#0071e3] border-[3px] border-white dark:border-[#1c1c1e] flex items-center justify-center shadow-lg active:scale-95 transition"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>

              {/* Name */}

              {editingName ? (
                <div className="flex items-center gap-2">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveName();
                      }

                      if (e.key === "Escape") {
                        setEditingName(false);
                        setNewName(user?.name || "");
                      }
                    }}
                    autoFocus
                    className={`px-4 py-2 rounded-xl text-xl font-bold text-center outline-none border ${inputBg}`}
                  />

                  <button
                    onClick={saveName}
                    className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-emerald-400" />
                  </button>

                  <button
                    onClick={() => {
                      setEditingName(false);
                      setNewName(user?.name || "");
                    }}
                    className="w-9 h-9 rounded-full bg-rose-500/10 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-rose-400" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditingName(true)}
                  className="group flex items-center gap-2"
                >
                  <h2
                    className={`text-[25px] sm:text-[28px] font-bold tracking-[-0.025em] ${primaryText}`}
                  >
                    {user?.name || "Unknown"}
                  </h2>

                  <Edit3
                    className={`w-4 h-4 ${mutedText} opacity-50 group-hover:opacity-100 transition`}
                  />
                </button>
              )}

              {/* Email */}

              <p className={`mt-1 text-sm ${secondaryText}`}>
                {user?.email || "No email"}
              </p>

              {/* Bio */}

              <div className="mt-4 w-full">
                {editingBio ? (
                  <div className="space-y-2">
                    <textarea
                      value={newBio}
                      onChange={(e) => setNewBio(e.target.value)}
                      autoFocus
                      placeholder="Tell something about yourself"
                      rows={3}
                      className={`w-full rounded-2xl px-4 py-3 text-sm outline-none resize-none border ${inputBg}`}
                    />

                    <div className="flex justify-center gap-2">
                      <button
                        onClick={saveBio}
                        className="px-5 py-2 rounded-full bg-[#0071e3] text-white text-xs font-semibold"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingBio(false)}
                        className={`px-5 py-2 rounded-full ${
                          darkMode ? "bg-white/5" : "bg-black/[0.05]"
                        } text-xs font-medium ${secondaryText}`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditingBio(true)}
                    className={`mx-auto flex items-center justify-center gap-1.5 text-sm ${secondaryText} hover:text-indigo-400 transition max-w-md`}
                  >
                    <span>{newBio || "Add something about yourself"}</span>

                    <Edit3 className="w-3 h-3 opacity-50" />
                  </button>
                )}
              </div>

              {/* Member */}

              <div className="flex items-center gap-1.5 mt-5">
                <Sparkles className="w-3 h-3 text-indigo-400" />

                <p className={`text-[11px] ${mutedText}`}>
                  Member · {totalLogs} entries
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------
            STATS
        ------------------------------------------------- */}

        <section className="mt-6">
          <div
            className={`${groupedBg} border ${divider} rounded-[24px] overflow-hidden`}
          >
            <div className="grid grid-cols-4 divide-x divide-black/[0.06] dark:divide-white/[0.06]">
              {[
                {
                  value: totalLogs,
                  label: "Logs",
                },
                {
                  value: avgScore,
                  label: "Average",
                },
                {
                  value: bestScore,
                  label: "Best",
                },
                {
                  value: `${streak}d`,
                  label: "Streak",
                },
              ].map((stat) => (
                <div key={stat.label} className="py-5 text-center">
                  <p
                    className={`text-xl sm:text-2xl font-bold tracking-tight ${primaryText}`}
                  >
                    {stat.value}
                  </p>

                  <p className={`text-[10px] sm:text-[11px] mt-1 ${mutedText}`}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------
            ACHIEVEMENTS
        ------------------------------------------------- */}

        <section className="mt-8">
          <div className="px-1 mb-3">
            <h2
              className={`text-[20px] font-bold tracking-[-0.02em] ${primaryText}`}
            >
              Achievements
            </h2>

            <p className={`text-xs ${secondaryText} mt-1`}>
              {earnedAchievements} of {achievements.length} unlocked
            </p>
          </div>

          <div
            className={`${groupedBg} border ${divider} rounded-[24px] overflow-hidden`}
          >
            {achievements.map((achievement, index) => (
              <div
                key={achievement.label}
                className={`flex items-center gap-4 px-5 py-4 ${
                  index !== achievements.length - 1 ? `border-b ${divider}` : ""
                } ${achievement.earned ? "" : "opacity-40"}`}
              >
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                    achievement.earned
                      ? achievement.bg
                      : darkMode
                        ? "bg-white/5"
                        : "bg-black/[0.04]"
                  }`}
                >
                  <span
                    className={
                      achievement.earned ? achievement.color : mutedText
                    }
                  >
                    {achievement.icon}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${primaryText}`}>
                    {achievement.label}
                  </p>

                  <p className={`text-xs ${secondaryText} mt-0.5`}>
                    {achievement.desc}
                  </p>
                </div>

                {achievement.earned && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------
            CONSISTENCY
        ------------------------------------------------- */}

        <section className="mt-8">
          <div className="px-1 mb-3">
            <h2
              className={`text-[20px] font-bold tracking-[-0.02em] ${primaryText}`}
            >
              Progress
            </h2>
          </div>

          <div className={`${cardBg} border rounded-[24px] p-5 sm:p-6`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold ${primaryText}`}>
                      Consistency
                    </p>

                    <p className={`text-xs ${secondaryText} mt-0.5`}>
                      Days scored 6 or above
                    </p>
                  </div>

                  <span className="text-xl font-bold text-cyan-400">
                    {consistency}%
                  </span>
                </div>
              </div>
            </div>

            <div
              className={`h-2 mt-5 rounded-full ${
                darkMode ? "bg-white/[0.06]" : "bg-black/[0.05]"
              } overflow-hidden`}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-1000"
                style={{
                  width: `${consistency}%`,
                }}
              />
            </div>

            <div
              className={`flex justify-between mt-2 text-[10px] ${mutedText}`}
            >
              <span>0%</span>
              <span>Target 80%</span>
              <span>100%</span>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------
            SETTINGS
        ------------------------------------------------- */}

        <section className="mt-8">
          <div className="px-1 mb-3">
            <h2
              className={`text-[20px] font-bold tracking-[-0.02em] ${primaryText}`}
            >
              Settings
            </h2>
          </div>

          <div
            className={`${groupedBg} border ${divider} rounded-[24px] overflow-hidden`}
          >
            {/* Appearance */}

            <div
              className={`flex items-center gap-4 px-5 py-4 border-b ${divider}`}
            >
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                {darkMode ? (
                  <Moon className="w-4 h-4 text-violet-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </div>

              <div className="flex-1">
                <p className={`text-sm font-medium ${primaryText}`}>
                  Appearance
                </p>

                <p className={`text-xs ${secondaryText} mt-0.5`}>
                  {darkMode ? "Dark appearance" : "Light appearance"}
                </p>
              </div>

              <button
                onClick={toggleDarkMode}
                aria-label="Toggle appearance"
                className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                  darkMode ? "bg-[#34c759]" : "bg-[#d1d1d6]"
                }`}
              >
                <span
                  className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-md transition-all duration-300 ${
                    darkMode ? "left-[25px]" : "left-[3px]"
                  }`}
                />
              </button>
            </div>

            {/* Password */}

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center gap-4 px-5 py-4 text-left active:bg-black/[0.03] dark:active:bg-white/[0.03] transition"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <KeyRound className="w-4 h-4 text-blue-400" />
              </div>

              <div className="flex-1">
                <p className={`text-sm font-medium ${primaryText}`}>
                  Password & Security
                </p>

                <p className={`text-xs ${secondaryText} mt-0.5`}>
                  Update your password
                </p>
              </div>

              <ChevronRight className={`w-4 h-4 ${mutedText}`} />
            </button>
          </div>
        </section>

        {/* -------------------------------------------------
            ACCOUNT
        ------------------------------------------------- */}

        <section className="mt-8">
          <div className="px-1 mb-3">
            <h2
              className={`text-[20px] font-bold tracking-[-0.02em] ${primaryText}`}
            >
              Account
            </h2>
          </div>

          <div
            className={`${groupedBg} border ${divider} rounded-[24px] overflow-hidden`}
          >
            {/* Account information */}

            <div
              className={`flex items-center gap-4 px-5 py-4 border-b ${divider}`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <UserRound className="w-4 h-4 text-indigo-400" />
              </div>

              <div className="flex-1">
                <p className={`text-sm font-medium ${primaryText}`}>
                  Account Information
                </p>

                <p className={`text-xs ${secondaryText} mt-0.5`}>
                  {user?.email || "No email"}
                </p>
              </div>

              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>

            {/* Delete */}

            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left active:bg-rose-500/5 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-rose-400" />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium text-rose-400">
                    Delete Account
                  </p>

                  <p className={`text-xs ${secondaryText} mt-0.5`}>
                    Permanently remove your data
                  </p>
                </div>

                <ChevronRight className={`w-4 h-4 ${mutedText}`} />
              </button>
            ) : (
              <div className="p-5">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center flex-shrink-0">
                    <Trash2 className="w-4 h-4 text-rose-400" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-rose-400">
                      Delete your account?
                    </p>

                    <p
                      className={`text-xs ${secondaryText} mt-1 leading-relaxed`}
                    >
                      This permanently removes your account and all your logged
                      data. This action cannot be undone.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="flex-1 py-3 rounded-xl bg-rose-500 text-white text-sm font-semibold active:scale-[0.98] transition disabled:opacity-50"
                  >
                    {deleteLoading ? "Deleting..." : "Delete"}
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className={`flex-1 py-3 rounded-xl ${
                      darkMode ? "bg-[#2c2c2e]" : "bg-[#f2f2f7]"
                    } text-sm font-medium ${secondaryText}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* -------------------------------------------------
            SIGN OUT
        ------------------------------------------------- */}

        <section className="mt-8">
          <button
            onClick={() => {
              localStorage.removeItem("userId");
              window.location.reload();
            }}
            className={`w-full py-4 rounded-[20px] border ${divider} ${
              darkMode
                ? "bg-[#1c1c1e] active:bg-[#2c2c2e]"
                : "bg-white active:bg-[#f2f2f7]"
            } flex items-center justify-center gap-2 text-sm font-semibold text-[#ff453a] transition`}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </section>

        {/* Footer */}

        <div className="text-center pt-5 pb-4">
          <p className={`text-[11px] ${mutedText}`}>
            IKIG-AI · Your personal life tracker
          </p>

          <p className={`text-[10px] ${mutedText} mt-1 opacity-60`}>
            Built for your everyday progress
          </p>
        </div>
      </main>

      <style>{`
        @keyframes sheetUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
