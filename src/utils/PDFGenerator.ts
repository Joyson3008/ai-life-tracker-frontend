export const generatePDF = async (
  result: any,
  form: any,
  expenseList: any[],
  appList: any[],
  selectedMood: string,
  diaryTitle: string,
  wellness?: {
    sleepHours?: string;
    waterIntake?: string;
    exerciseMin?: string;
    exerciseType?: string;
    morningRoutine?: boolean;
    caffeineCount?: number;
    focusMode?: string;
  },
  goals?: { text: string; done: boolean }[],
  gratitude?: string,
  tomorrowPlan?: string
) => {
  if (!result) return;

  // ── Helpers ───────────────────────────────────────────────────────────────

  const safe = (val: any): string => {
    if (val === null || val === undefined || val === "") return "—";
    return String(val).replace(/\\n/g, "<br>").replace(/\n/g, "<br>");
  };

  const safeMultiline = (val: any): string => {
    if (val === null || val === undefined || val === "") return "—";
    return String(val)
      .replace(/\\n/g, "\n")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => `<div style="margin-bottom:6px;">• ${line}</div>`)
      .join("");
  };

  const totalExpense = expenseList.reduce((s, e) => s + e.amount, 0);
  const totalScreen = appList.reduce((s, a) => s + a.time, 0);
  const goalsCompleted = goals?.filter((g) => g.done).length ?? 0;
  const goalsTotal = goals?.length ?? 0;

  const scoreVal = result.score || 0;
  const scoreColor =
    scoreVal >= 8 ? "#22c55e" : scoreVal >= 6 ? "#f59e0b" : "#ef4444";
  const scoreLabel =
    scoreVal >= 9
      ? "Exceptional"
      : scoreVal >= 8
        ? "Excellent"
        : scoreVal >= 7
          ? "Great"
          : scoreVal >= 6
            ? "Good"
            : scoreVal >= 5
              ? "Average"
              : "Needs Work";

  // ── Layout Primitives ─────────────────────────────────────────────────────

  const sectionHead = (emoji: string, title: string, accent: string) => `
    <div style="display:flex;align-items:center;gap:10px;margin:0 0 16px 0;">
      <div style="width:4px;height:26px;border-radius:2px;background:${accent};flex-shrink:0;"></div>
      <span style="font-size:13px;font-weight:700;letter-spacing:1.5px;color:${accent};text-transform:uppercase;">${emoji} ${title}</span>
    </div>`;

  const card = (
    content: string,
    bg = "#0f1426",
    border = "#1e2440",
    topAccent?: string
  ) => `
    <div style="background:${bg};border:1px solid ${border};${topAccent ? `border-top:3px solid ${topAccent};` : ""}border-radius:14px;padding:22px 24px;margin-bottom:18px;page-break-inside:avoid;">
      ${content}
    </div>`;

  // Label + full paragraph value
  const field = (label: string, value: string, color = "#94a3b8") => `
    <div style="margin-bottom:12px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:#4b5683;text-transform:uppercase;margin-bottom:5px;">${label}</div>
      <div style="font-size:12px;color:${color};line-height:1.85;">${value}</div>
    </div>`;

  // Wellness vitals row (icon + label + value)
  const vitalRow = (icon: string, label: string, value: string, accent: string) => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #1a1f35;">
      <div style="width:32px;height:32px;border-radius:10px;background:${accent}20;border:1px solid ${accent}40;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;">
        ${icon}
      </div>
      <div style="flex:1;">
        <div style="font-size:9px;font-weight:700;letter-spacing:1.2px;color:#4b5683;text-transform:uppercase;">${label}</div>
        <div style="font-size:13px;font-weight:600;color:#e2e8f0;margin-top:2px;">${value}</div>
      </div>
    </div>`;

  // Wellness grid item (2-col grid)
  const vitalGridItem = (icon: string, label: string, value: string, accent: string) => `
    <div style="background:#0c1020;border:1px solid #1e2440;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;page-break-inside:avoid;">
      <div style="width:36px;height:36px;border-radius:10px;background:${accent}18;border:1px solid ${accent}35;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;">
        ${icon}
      </div>
      <div>
        <div style="font-size:9px;font-weight:700;letter-spacing:1.2px;color:#4b5683;text-transform:uppercase;margin-bottom:3px;">${label}</div>
        <div style="font-size:14px;font-weight:700;color:#e2e8f0;">${value}</div>
      </div>
    </div>`;

  const chip = (text: string, accent: string) =>
    `<span style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:10px;font-weight:600;background:${accent}22;border:1px solid ${accent}55;color:${accent};margin:3px;">${text}</span>`;

  const reviewBlock = (
    emoji: string,
    title: string,
    input: string,
    review: string,
    accent: string
  ) => `
    <div style="background:#0c1020;border:1px solid #1e2440;border-top:3px solid ${accent};border-radius:14px;padding:20px 22px;margin-bottom:16px;page-break-inside:avoid;">
      ${sectionHead(emoji, title, accent)}
      ${field("Your Input", safe(input), "#94a3b8")}
      ${field("AI Review", safe(review), "#e2e8f0")}
    </div>`;

  const pageBreakBefore = () =>
    `<div style="page-break-before:always;padding-top:32px;"></div>`;

  const sectionDivider = (label: string) => `
    <div style="border-top:1px solid #1e2440;margin:28px 0 20px 0;padding-top:16px;">
      <div style="font-size:9px;letter-spacing:2.5px;color:#4b5683;text-transform:uppercase;font-weight:700;">${label}</div>
    </div>`;

  // ── Date ─────────────────────────────────────────────────────────────────
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── Wellness Section (Full Detailed) ──────────────────────────────────────
  const hasWellness =
    wellness &&
    (wellness.sleepHours ||
      wellness.waterIntake ||
      wellness.exerciseMin ||
      wellness.exerciseType ||
      wellness.focusMode ||
      wellness.caffeineCount !== undefined ||
      wellness.morningRoutine !== undefined);

  const wellnessHTML = hasWellness
    ? `
    <div style="background:#0b1120;border:1px solid #1e2440;border-top:3px solid #f43f5e;border-radius:14px;padding:24px;margin-bottom:18px;page-break-inside:avoid;">
      ${sectionHead("❤️", "Wellness & Vitals", "#f43f5e")}

      <!-- Primary vitals grid (2 cols) -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
        ${wellness?.sleepHours ? vitalGridItem("😴", "Sleep", wellness.sleepHours, "#818cf8") : ""}
        ${wellness?.waterIntake ? vitalGridItem("💧", "Water Intake", wellness.waterIntake, "#38bdf8") : ""}
        ${
          wellness?.exerciseMin
            ? vitalGridItem(
                "💪",
                "Exercise",
                `${wellness.exerciseMin} min${wellness.exerciseType ? ` · ${wellness.exerciseType}` : ""}`,
                "#4ade80"
              )
            : ""
        }
        ${
          wellness?.caffeineCount !== undefined && wellness.caffeineCount >= 0
            ? vitalGridItem(
                "☕",
                "Caffeine",
                `${wellness.caffeineCount} cup${wellness.caffeineCount !== 1 ? "s" : ""}`,
                "#f97316"
              )
            : ""
        }
        ${
          wellness?.morningRoutine !== undefined
            ? vitalGridItem(
                "☀️",
                "Morning Routine",
                wellness.morningRoutine ? "✅ Completed" : "⬜ Skipped",
                wellness.morningRoutine ? "#fbbf24" : "#4b5683"
              )
            : ""
        }
        ${wellness?.focusMode ? vitalGridItem("🎯", "Focus Mode", wellness.focusMode, "#c084fc") : ""}
      </div>

      <!-- Wellness Summary Bar -->
      <div style="background:#060d1a;border:1px solid #1e2440;border-radius:10px;padding:12px 16px;">
        <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:#4b5683;text-transform:uppercase;margin-bottom:8px;">Quick Summary</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${wellness?.sleepHours ? chip(`😴 Sleep: ${wellness.sleepHours}`, "#818cf8") : ""}
          ${wellness?.waterIntake ? chip(`💧 Water: ${wellness.waterIntake}`, "#38bdf8") : ""}
          ${wellness?.exerciseMin ? chip(`💪 Exercise: ${wellness.exerciseMin}min`, "#4ade80") : ""}
          ${wellness?.morningRoutine ? chip("☀️ Morning Routine Done", "#fbbf24") : ""}
          ${wellness?.caffeineCount ? chip(`☕ ${wellness.caffeineCount} cup(s)`, "#f97316") : ""}
          ${wellness?.focusMode ? chip(`🎯 ${wellness.focusMode}`, "#c084fc") : ""}
        </div>
      </div>
    </div>`
    : "";

  // ── Goals Section (Full Detailed) ─────────────────────────────────────────
  const goalsProgressPct =
    goalsTotal > 0 ? Math.round((goalsCompleted / goalsTotal) * 100) : 0;
  const goalsProgressColor =
    goalsProgressPct >= 80
      ? "#22c55e"
      : goalsProgressPct >= 50
        ? "#f59e0b"
        : "#ef4444";

  const goalsHTML =
    goals && goals.length > 0
      ? `
    <div style="background:#0b1120;border:1px solid #1e2440;border-top:3px solid #6366f1;border-radius:14px;padding:24px;margin-bottom:18px;page-break-inside:avoid;">
      ${sectionHead("🎯", "Today's Goals", "#6366f1")}

      <!-- Progress Bar -->
      <div style="background:#0c1020;border:1px solid #1e2440;border-radius:10px;padding:14px 16px;margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:11px;color:#94a3b8;">Completion Rate</span>
          <span style="font-size:14px;font-weight:800;color:${goalsProgressColor};font-family:monospace;">${goalsCompleted} / ${goalsTotal} &nbsp;(${goalsProgressPct}%)</span>
        </div>
        <div style="height:8px;background:#1e2440;border-radius:999px;overflow:hidden;">
          <div style="height:100%;width:${goalsProgressPct}%;border-radius:999px;background:linear-gradient(90deg,#6366f1,#a855f7);transition:width 0.5s;"></div>
        </div>
      </div>

      <!-- Goals List -->
      <div>
        ${goals
          .map(
            (g) => `
          <div style="display:flex;align-items:flex-start;gap:12px;padding:10px 12px;border-radius:10px;margin-bottom:8px;background:${g.done ? "rgba(34,197,94,0.06)" : "rgba(255,255,255,0.02)"};border:1px solid ${g.done ? "rgba(34,197,94,0.2)" : "#1e2440"};">
            <span style="font-size:16px;flex-shrink:0;margin-top:1px;">${g.done ? "✅" : "⬜"}</span>
            <div style="flex:1;">
              <span style="font-size:13px;color:${g.done ? "#94a3b8" : "#e2e8f0"};line-height:1.6;${g.done ? "text-decoration:line-through;" : ""}">${g.text}</span>
              ${g.done ? `<div style="font-size:9px;color:#22c55e;font-weight:600;letter-spacing:0.5px;margin-top:3px;">COMPLETED</div>` : `<div style="font-size:9px;color:#4b5683;font-weight:600;letter-spacing:0.5px;margin-top:3px;">PENDING</div>`}
            </div>
          </div>`
          )
          .join("")}
      </div>
    </div>`
      : "";

  // ── Gratitude Section ─────────────────────────────────────────────────────
  const gratitudeHTML = gratitude
    ? `
    <div style="background:#0b1120;border:1px solid #1e2440;border-top:3px solid #fbbf24;border-radius:14px;padding:24px;margin-bottom:18px;page-break-inside:avoid;">
      ${sectionHead("⭐", "Gratitude", "#fbbf24")}
      <div style="background:#0c1020;border:1px solid #1e2440;border-radius:10px;padding:16px 18px;">
        <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:#4b5683;text-transform:uppercase;margin-bottom:10px;">3 Things I'm Grateful For</div>
        <div style="font-size:13px;color:#fde68a;line-height:2;">${safeMultiline(gratitude)}</div>
      </div>
    </div>`
    : "";

  // ── Tomorrow Plan Section ─────────────────────────────────────────────────
  const tomorrowHTML = tomorrowPlan
    ? `
    <div style="background:#0b1120;border:1px solid #1e2440;border-top:3px solid #38bdf8;border-radius:14px;padding:24px;margin-bottom:18px;page-break-inside:avoid;">
      ${sectionHead("🌅", "Tomorrow's Plan", "#38bdf8")}
      <div style="background:#0c1020;border:1px solid #1e2440;border-radius:10px;padding:16px 18px;">
        <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:#4b5683;text-transform:uppercase;margin-bottom:10px;">Top Priorities for Tomorrow</div>
        <div style="font-size:13px;color:#bae6fd;line-height:2;">${safeMultiline(tomorrowPlan)}</div>
      </div>
    </div>`
    : "";

  // ── Expenses Table ────────────────────────────────────────────────────────
  const expenseRows =
    expenseList.length > 0
      ? expenseList
          .map(
            (e) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1e2440;font-size:12px;">
          <span style="color:#94a3b8;">${e.category}</span>
          <span style="color:#4ade80;font-weight:600;font-family:monospace;">₹${e.amount}</span>
        </div>`
          )
          .join("") +
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;margin-top:6px;font-size:13px;">
           <span style="color:#64748b;font-weight:700;letter-spacing:0.5px;">TOTAL</span>
           <span style="color:#4ade80;font-weight:800;font-family:monospace;font-size:15px;">₹${totalExpense}</span>
         </div>`
      : `<p style="font-size:12px;color:#4b5683;">No expenses logged.</p>`;

  // ── App Usage ─────────────────────────────────────────────────────────────
  const appRows =
    appList.length > 0
      ? appList
          .map(
            (a) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1e2440;font-size:12px;">
          <span style="color:#94a3b8;">${a.name}</span>
          <span style="color:#f472b6;font-weight:600;font-family:monospace;">${a.time} min</span>
        </div>`
          )
          .join("") +
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;margin-top:6px;font-size:13px;">
           <span style="color:#64748b;font-weight:700;letter-spacing:0.5px;">TOTAL SCREEN</span>
           <span style="color:#f472b6;font-weight:800;font-family:monospace;font-size:15px;">${totalScreen} min</span>
         </div>`
      : `<p style="font-size:12px;color:#4b5683;">No screen time logged.</p>`;

  // ── FULL HTML ─────────────────────────────────────────────────────────────
  const element = document.createElement("div");
  element.innerHTML = `
  <div style="font-family:'Segoe UI',system-ui,sans-serif;background:#050812;color:#e2e8f0;padding:0;">

    <!-- ═══ HEADER ═══ -->
    <div style="background:linear-gradient(135deg,#0f1426 0%,#0a0f1e 100%);border-bottom:3px solid #6366f1;padding:40px 44px 32px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <div style="font-size:9px;letter-spacing:3px;color:#4b5683;font-weight:700;margin-bottom:10px;text-transform:uppercase;">AI Life Tracker</div>
          <div style="font-size:32px;font-weight:800;letter-spacing:-0.5px;color:#f8faff;margin-bottom:6px;">Daily Report</div>
          <div style="font-size:12px;color:#4b5683;letter-spacing:0.5px;">${dateStr}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:48px;font-weight:900;color:${scoreColor};font-family:monospace;line-height:1;">${scoreVal}<span style="font-size:20px;color:#4b5683;">/10</span></div>
          <div style="font-size:11px;font-weight:700;letter-spacing:2px;color:${scoreColor};text-transform:uppercase;margin-top:4px;">${scoreLabel}</div>
        </div>
      </div>
    </div>

    <!-- ═══ STAT RIBBON ═══ -->
    <div style="display:grid;grid-template-columns:repeat(4,1fr);background:#080d1c;border-bottom:1px solid #1e2440;">
      ${[
        ["Score", `${scoreVal}/10`, scoreColor],
        ["Spent", totalExpense > 0 ? `₹${totalExpense}` : "—", "#4ade80"],
        ["Screen", totalScreen > 0 ? `${totalScreen}m` : "—", "#f472b6"],
        [
          "Goals",
          goalsTotal > 0 ? `${goalsCompleted}/${goalsTotal}` : "—",
          "#818cf8",
        ],
      ]
        .map(
          ([lbl, val, col]) => `
        <div style="padding:18px;text-align:center;border-right:1px solid #1e2440;">
          <div style="font-size:18px;font-weight:700;color:${col};font-family:monospace;">${val}</div>
          <div style="font-size:9px;letter-spacing:1.5px;color:#4b5683;text-transform:uppercase;margin-top:4px;">${lbl}</div>
        </div>`
        )
        .join("")}
    </div>

    <!-- ═══ BODY ═══ -->
    <div style="padding:32px 44px 44px;">

      <!-- ── SUMMARY ── -->
      ${card(
        `
        ${sectionHead("📊", "Final Summary", "#6366f1")}
        <p style="font-size:13px;line-height:1.9;color:#c7d2fe;margin:0;">${safe(result.finalSummary || result.aiFeedback)}</p>
      `,
        "#0c1020",
        "#6366f133"
      )}

      <!-- ── MOTIVATION ── -->
      ${card(
        `
        ${sectionHead("🔥", "Daily Motivation", "#a855f7")}
        <p style="font-size:13px;line-height:1.9;color:#e9d5ff;margin:0;font-style:italic;">${safe(result.motivation)}</p>
      `,
        "#0c1020",
        "#a855f733"
      )}

      <!-- ═══ WELLNESS & VITALS — FULL SECTION ═══ -->
      ${wellnessHTML}

      <!-- ═══ GOALS — FULL SECTION ═══ -->
      ${goalsHTML}

      <!-- ═══ GRATITUDE ═══ -->
      ${gratitudeHTML}

      <!-- ═══ TOMORROW'S PLAN ═══ -->
      ${tomorrowHTML}

      <!-- ── DIARY ── -->
      ${card(`
        ${sectionHead("📔", "Daily Journal", "#f59e0b")}
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #1e2440;">
          <span style="font-size:32px;">${safe(selectedMood) !== "—" ? selectedMood : "📝"}</span>
          <span style="font-size:18px;font-weight:600;color:#fef3c7;">${safe(diaryTitle)}</span>
        </div>
        ${field("Entry", safe(form.diary), "#94a3b8")}
        ${field("AI Review", safe(result.diaryReview), "#fde68a")}
      `)}

      <!-- ═══ SECTION REVIEWS ═══ -->
      ${pageBreakBefore()}
      ${sectionDivider("Section Reviews — Detailed AI Analysis")}

      ${reviewBlock("📖", "Bible Reading", form.bibleReading, result.bibleReview, "#818cf8")}
      ${reviewBlock("📚", "Book Reading", form.bookReading, result.bookReview, "#a855f7")}
      ${reviewBlock("💻", "Coding Work", form.codingWork, result.codingReview, "#22d3ee")}
      ${reviewBlock("🧠", "CS Topic", form.csTopic, result.csTopicReview, "#6366f1")}
      ${reviewBlock("🏫", "College", form.collegeActivity, result.collegeReview, "#4ade80")}
      ${reviewBlock("🎬", "Movie", form.movie, result.movieReview, "#f472b6")}

      <!-- ═══ EXPENSES & PHONE ═══ -->
      ${pageBreakBefore()}
      ${sectionDivider("Finances & Screen Time")}

      <!-- Expenses full width -->
      <div style="background:#0c1020;border:1px solid #1e2440;border-top:3px solid #4ade80;border-radius:14px;padding:20px 22px;margin-bottom:18px;page-break-inside:avoid;">
        ${sectionHead("💰", "Expenses", "#4ade80")}
        <div style="margin-top:8px;">${expenseRows}</div>
        ${field("AI Review", safe(result.expensesReview), "#86efac")}
      </div>

      <!-- Phone full width -->
      <div style="background:#0c1020;border:1px solid #1e2440;border-top:3px solid #f472b6;border-radius:14px;padding:20px 22px;margin-bottom:18px;page-break-inside:avoid;">
        ${sectionHead("📱", "Phone Usage", "#f472b6")}
        <div style="margin-top:8px;">${appRows}</div>
        ${field("AI Review", safe(result.phoneUsageReview), "#fbcfe8")}
      </div>

      <!-- ═══ FOOTER ═══ -->
      <div style="border-top:1px solid #1e2440;margin-top:36px;padding-top:20px;text-align:center;">
        <div style="font-size:9px;letter-spacing:2px;color:#4b5683;text-transform:uppercase;">
          Generated by AI Life Tracker · Keep growing, one day at a time.
        </div>
      </div>

    </div>
  </div>`;

  const html2pdf = (await import("html2pdf.js")).default;

  html2pdf()
    .set({
      margin: 0,
      filename: `AI_Life_Report_${result.id || new Date().toISOString().slice(0, 10)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#050812" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save();
};
