//import type { ReactNode } from "react";
import { useTheme } from "../context/ThemeContext";

type Props = {
  result: any;
  onDownload: () => void;
};

type ReviewItemProps = {
  icon: string;
  title: string;
  value: any;
  darkMode: boolean;
  accent?: string;
};

function ReviewItem({
  icon,
  title,
  value,
  darkMode,
  accent = "#0A84FF",
}: ReviewItemProps) {
  if (!value) return null;

  return (
    <div
      className={`group rounded-[22px] border p-4 sm:p-5 transition-all duration-300 ${
        darkMode
          ? "bg-white/[0.045] border-white/[0.07] hover:bg-white/[0.065] hover:border-white/[0.12]"
          : "bg-white/75 border-black/[0.055] hover:bg-white hover:border-black/[0.09]"
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] text-lg border"
          style={{
            backgroundColor: `${accent}12`,
            borderColor: `${accent}20`,
            boxShadow: `0 6px 18px ${accent}10`,
          }}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p
            className={`mb-1.5 text-[11px] font-semibold uppercase tracking-[0.13em] ${
              darkMode ? "text-white/45" : "text-black/40"
            }`}
          >
            {title}
          </p>

          <p
            className={`text-[14px] sm:text-[15px] leading-6 ${
              darkMode ? "text-white/75" : "text-black/65"
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ score, darkMode }: { score: number; darkMode: boolean }) {
  const safeScore = Math.max(0, Math.min(100, score));
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (safeScore / 100) * circumference;

  // let scoreLabel = "Keep going";
  // if (safeScore >= 90) scoreLabel = "Outstanding";
  // else if (safeScore >= 80) scoreLabel = "Excellent";
  // else if (safeScore >= 70) scoreLabel = "Great progress";
  // else if (safeScore >= 60) scoreLabel = "Good effort";
  // else if (safeScore >= 40) scoreLabel = "Room to grow";

  return (
    <div className="relative flex h-[138px] w-[138px] shrink-0 items-center justify-center">
      {/* Glow */}
      <div
        className="absolute inset-4 rounded-full blur-2xl opacity-20"
        style={{
          background:
            safeScore >= 80
              ? "#30D158"
              : safeScore >= 60
                ? "#0A84FF"
                : "#FF9F0A",
        }}
      />

      <svg
        width="138"
        height="138"
        viewBox="0 0 138 138"
        className="-rotate-90 relative z-10"
      >
        <circle
          cx="69"
          cy="69"
          r={radius}
          fill="none"
          stroke={darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}
          strokeWidth="9"
        />

        <circle
          cx="69"
          cy="69"
          r={radius}
          fill="none"
          stroke={
            safeScore >= 80
              ? "#30D158"
              : safeScore >= 60
                ? "#0A84FF"
                : "#FF9F0A"
          }
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      <div className="absolute z-20 flex flex-col items-center">
        <span
          className={`text-[30px] font-bold tracking-[-0.05em] leading-none ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          {safeScore}
        </span>

        <span
          className={`mt-1 text-[10px] font-medium uppercase tracking-[0.12em] ${
            darkMode ? "text-white/40" : "text-black/40"
          }`}
        >
          / 100
        </span>
      </div>
    </div>
  );
}

function SummaryCard({ result, darkMode }: { result: any; darkMode: boolean }) {
  const summary = result.finalSummary || result.aiFeedback;

  if (!summary) return null;

  return (
    <div
      className={`relative overflow-hidden rounded-[25px] border p-5 sm:p-6 ${
        darkMode
          ? "bg-gradient-to-br from-[#0A84FF]/[0.11] via-white/[0.035] to-transparent border-[#0A84FF]/[0.15]"
          : "bg-gradient-to-br from-[#0A84FF]/[0.07] via-white/70 to-white border-[#0A84FF]/[0.12]"
      }`}
    >
      {/* Decorative glow */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl"
        style={{
          background: darkMode
            ? "rgba(10,132,255,0.12)"
            : "rgba(10,132,255,0.08)",
        }}
      />

      <div className="relative">
        <div className="mb-4 flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-[12px]"
            style={{
              background: darkMode
                ? "rgba(10,132,255,.14)"
                : "rgba(10,132,255,.10)",
            }}
          >
            <span className="text-base">📊</span>
          </div>

          <div>
            <p
              className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${
                darkMode ? "text-white/45" : "text-black/40"
              }`}
            >
              AI Summary
            </p>

            <p
              className={`text-[14px] font-semibold ${
                darkMode ? "text-white/90" : "text-black/80"
              }`}
            >
              Your day at a glance
            </p>
          </div>
        </div>

        <p
          className={`text-[15px] leading-7 ${
            darkMode ? "text-white/72" : "text-black/65"
          }`}
        >
          {summary}
        </p>
      </div>
    </div>
  );
}

function MotivationCard({
  motivation,
  darkMode,
}: {
  motivation: any;
  darkMode: boolean;
}) {
  if (!motivation) return null;

  return (
    <div
      className={`rounded-[25px] border p-5 sm:p-6 ${
        darkMode
          ? "bg-white/[0.045] border-white/[0.07]"
          : "bg-white/75 border-black/[0.055]"
      }`}
    >
      <div className="flex gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px]"
          style={{
            background: darkMode
              ? "rgba(255,159,10,.12)"
              : "rgba(255,159,10,.09)",
          }}
        >
          <span className="text-xl">🔥</span>
        </div>

        <div>
          <p
            className={`mb-1 text-[11px] font-semibold uppercase tracking-[0.13em] ${
              darkMode ? "text-white/40" : "text-black/40"
            }`}
          >
            Motivation
          </p>

          <p
            className={`text-[15px] leading-7 ${
              darkMode ? "text-white/72" : "text-black/65"
            }`}
          >
            {motivation}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AIResult({ result, onDownload }: Props) {
  const { darkMode } = useTheme();

  if (!result) return null;

  const score = Number(result.score) || 0;

  const textPrimary = darkMode ? "text-white" : "text-[#1d1d1f]";
  const textMuted = darkMode ? "text-white/55" : "text-black/50";

  return (
    <section className="mt-10 sm:mt-14">
      <div
        className={`relative overflow-hidden rounded-[32px] border p-4 sm:p-6 lg:p-7 ${
          darkMode
            ? "bg-[#1c1c1e]/90 border-white/[0.08] shadow-[0_25px_80px_rgba(0,0,0,.30)]"
            : "bg-[#f8f8fa]/90 border-black/[0.055] shadow-[0_25px_80px_rgba(15,23,42,.08)]"
        }`}
        style={{
          backdropFilter: "blur(30px) saturate(150%)",
          WebkitBackdropFilter: "blur(30px) saturate(150%)",
        }}
      >
        {/* Background glow */}
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full blur-3xl"
          style={{
            background: darkMode
              ? "rgba(10,132,255,.07)"
              : "rgba(10,132,255,.055)",
          }}
        />

        <div
          className="pointer-events-none absolute -bottom-40 -right-32 h-80 w-80 rounded-full blur-3xl"
          style={{
            background: darkMode
              ? "rgba(88,86,214,.06)"
              : "rgba(88,86,214,.045)",
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border ${
                  darkMode
                    ? "bg-white/[0.06] border-white/[0.08]"
                    : "bg-white border-black/[0.05]"
                }`}
                style={{
                  boxShadow: darkMode
                    ? "0 8px 25px rgba(0,0,0,.18)"
                    : "0 8px 25px rgba(15,23,42,.06)",
                }}
              >
                <span className="text-xl">✨</span>
              </div>

              <div>
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.15em] ${textMuted}`}
                >
                  AI Analysis
                </p>

                <h2
                  className={`mt-1 text-[23px] sm:text-[25px] font-bold tracking-[-0.035em] ${textPrimary}`}
                >
                  Your Daily Review
                </h2>
              </div>
            </div>

            {/* Download */}
            <button
              onClick={onDownload}
              className={`group inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border px-5 text-[13px] font-semibold transition-all duration-200 active:scale-[0.96] ${
                darkMode
                  ? "bg-white/[0.07] border-white/[0.10] text-white hover:bg-white/[0.11]"
                  : "bg-white border-black/[0.07] text-[#1d1d1f] hover:bg-black/[0.025]"
              }`}
              style={{
                boxShadow: darkMode
                  ? "0 7px 22px rgba(0,0,0,.18)"
                  : "0 7px 22px rgba(15,23,42,.06)",
              }}
            >
              <span className="text-base transition-transform duration-200 group-hover:-translate-y-0.5">
                📄
              </span>

              <span>Download PDF</span>
            </button>
          </div>

          {/* Score + Summary */}
          <div className="grid gap-5 lg:grid-cols-[190px_1fr]">
            <div
              className={`flex flex-col items-center justify-center rounded-[26px] border p-5 ${
                darkMode
                  ? "bg-white/[0.035] border-white/[0.065]"
                  : "bg-white/70 border-black/[0.05]"
              }`}
            >
              <ScoreRing score={score} darkMode={darkMode} />

              <div className="mt-3 text-center">
                <p
                  className={`text-[13px] font-semibold ${
                    score >= 80
                      ? darkMode
                        ? "text-[#30D158]"
                        : "text-[#248A3D]"
                      : score >= 60
                        ? darkMode
                          ? "text-[#0A84FF]"
                          : "text-[#0066CC]"
                        : darkMode
                          ? "text-[#FF9F0A]"
                          : "text-[#B25000]"
                  }`}
                >
                  {score >= 90
                    ? "Outstanding"
                    : score >= 80
                      ? "Excellent"
                      : score >= 70
                        ? "Great progress"
                        : score >= 60
                          ? "Good effort"
                          : score >= 40
                            ? "Room to grow"
                            : "Keep going"}
                </p>

                <p className={`mt-1 text-[11px] ${textMuted}`}>
                  Today's overall score
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <SummaryCard result={result} darkMode={darkMode} />

              <MotivationCard
                motivation={result.motivation}
                darkMode={darkMode}
              />
            </div>
          </div>

          {/* Detailed Reviews */}
          <div className="mt-7">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${textMuted}`}
                >
                  Detailed feedback
                </p>

                <h3
                  className={`mt-1 text-[18px] font-bold tracking-[-0.025em] ${textPrimary}`}
                >
                  Areas of your day
                </h3>
              </div>

              <span className={`hidden sm:block text-[11px] ${textMuted}`}>
                AI-generated insights
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ReviewItem
                icon="📖"
                title="Bible"
                value={result.bibleReview}
                darkMode={darkMode}
                accent="#AF52DE"
              />

              <ReviewItem
                icon="📚"
                title="Books"
                value={result.bookReview}
                darkMode={darkMode}
                accent="#FF9F0A"
              />

              <ReviewItem
                icon="💻"
                title="Coding"
                value={result.codingReview}
                darkMode={darkMode}
                accent="#0A84FF"
              />

              <ReviewItem
                icon="🧠"
                title="Computer Science"
                value={result.csTopicReview}
                darkMode={darkMode}
                accent="#5856D6"
              />

              <ReviewItem
                icon="🏫"
                title="College"
                value={result.collegeReview}
                darkMode={darkMode}
                accent="#30D158"
              />

              <ReviewItem
                icon="📔"
                title="Diary"
                value={result.diaryReview}
                darkMode={darkMode}
                accent="#FF375F"
              />

              <ReviewItem
                icon="💰"
                title="Expenses"
                value={result.expensesReview}
                darkMode={darkMode}
                accent="#30D158"
              />

              <ReviewItem
                icon="🎬"
                title="Movie"
                value={result.movieReview}
                darkMode={darkMode}
                accent="#FF453A"
              />

              <ReviewItem
                icon="📱"
                title="Phone Usage"
                value={result.phoneUsageReview}
                darkMode={darkMode}
                accent="#5E5CE6"
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className={`mt-6 flex items-center justify-center border-t pt-5 ${
              darkMode ? "border-white/[0.06]" : "border-black/[0.05]"
            }`}
          >
            <p className={`text-[11px] text-center ${textMuted}`}>
              ✦ Generated from your daily activity and reflections
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
