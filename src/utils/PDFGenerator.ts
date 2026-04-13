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

  // Convert newlines in AI text to <br> so multi-sentence reviews render properly
  const safe = (val: any) => {
    if (!val || val === "") return "—";
    return String(val).replace(/\\n/g, "<br>").replace(/\n/g, "<br>");
  };

  const totalExpense = expenseList.reduce((s, e) => s + e.amount, 0);
  const totalScreen  = appList.reduce((s, a) => s + a.time, 0);
  const goalsCompleted = goals?.filter(g => g.done).length ?? 0;
  const goalsTotal     = goals?.length ?? 0;

  const scoreVal  = result.score || 0;
  const scoreColor =
    scoreVal >= 8 ? "#22c55e" :
    scoreVal >= 6 ? "#f59e0b" : "#ef4444";
  const scoreLabel =
    scoreVal >= 9 ? "Exceptional" :
    scoreVal >= 8 ? "Excellent"   :
    scoreVal >= 7 ? "Great"       :
    scoreVal >= 6 ? "Good"        :
    scoreVal >= 5 ? "Average"     : "Needs Work";

  // ── helpers ───────────────────────────────────────────────────────────────

  const sectionHead = (emoji: string, title: string, accent: string) => `
    <div style="display:flex;align-items:center;gap:10px;margin:0 0 14px 0;">
      <div style="width:4px;height:26px;border-radius:2px;background:${accent};flex-shrink:0;"></div>
      <span style="font-size:14px;font-weight:700;letter-spacing:1.5px;color:${accent};text-transform:uppercase;">${emoji} ${title}</span>
    </div>`;

  // card with page-break-inside:avoid so it doesn't split mid-card
  const card = (content: string, bg = "#0f1426", border = "#1e2440") => `
    <div style="background:${bg};border:1px solid ${border};border-radius:14px;padding:22px 24px;margin-bottom:18px;page-break-inside:avoid;">
      ${content}
    </div>`;

  // label + full paragraph value (not truncated row)
  const field = (label: string, value: string, color = "#94a3b8") => `
    <div style="margin-bottom:12px;">
      <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;color:#4b5683;text-transform:uppercase;margin-bottom:5px;">${label}</div>
      <div style="font-size:12px;color:${color};line-height:1.85;">${value}</div>
    </div>`;

  const chip = (text: string, accent: string) =>
    `<span style="display:inline-block;padding:4px 12px;border-radius:999px;font-size:10px;font-weight:600;background:${accent}22;border:1px solid ${accent}55;color:${accent};margin:3px;">${text}</span>`;

  // Full-width review block (single column) for rich content
  const reviewBlock = (emoji: string, title: string, input: string, review: string, accent: string) => `
    <div style="background:#0c1020;border:1px solid #1e2440;border-top:3px solid ${accent};border-radius:14px;padding:20px 22px;margin-bottom:16px;page-break-inside:avoid;">
      ${sectionHead(emoji, title, accent)}
      ${field("Your Input", safe(input), "#94a3b8")}
      ${field("AI Review",  safe(review), "#e2e8f0")}
    </div>`;

  // Page-break spacer before major section headers
  const pageBreakBefore = () =>
    `<div style="page-break-before:always;padding-top:32px;"></div>`;

  const sectionDivider = (label: string) => `
    <div style="border-top:1px solid #1e2440;margin:28px 0 20px 0;padding-top:16px;">
      <div style="font-size:9px;letter-spacing:2.5px;color:#4b5683;text-transform:uppercase;font-weight:700;">${label}</div>
    </div>`;

  // ── date ─────────────────────────────────────────────────────────────────
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" });

  // ── wellness chips ────────────────────────────────────────────────────────
  const wellnessChips = wellness ? [
    wellness.sleepHours  && chip(`😴 ${wellness.sleepHours} sleep`,  "#818cf8"),
    wellness.waterIntake && chip(`💧 ${wellness.waterIntake} water`, "#38bdf8"),
    wellness.exerciseMin && chip(`💪 ${wellness.exerciseMin}min${wellness.exerciseType ? " " + wellness.exerciseType : ""}`, "#4ade80"),
    wellness.morningRoutine && chip("☀️ Morning routine", "#fbbf24"),
    wellness.caffeineCount && chip(`☕ ${wellness.caffeineCount} cup(s)`, "#f97316"),
    wellness.focusMode && chip(`🎯 ${wellness.focusMode}`, "#c084fc"),
  ].filter(Boolean).join("") : "";

  // ── goals list ────────────────────────────────────────────────────────────
  const goalsHTML = goals && goals.length > 0
    ? goals.map(g => `
        <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #1e2440;">
          <span style="font-size:13px;margin-top:1px;">${g.done ? "✅" : "⬜"}</span>
          <span style="font-size:12px;color:${g.done ? "#94a3b8" : "#e2e8f0"};line-height:1.6;${g.done ? "text-decoration:line-through;" : ""}">${g.text}</span>
        </div>`).join("")
    : `<p style="font-size:12px;color:#4b5683;">No goals set.</p>`;

  // ── expenses table ────────────────────────────────────────────────────────
  const expenseRows = expenseList.length > 0
    ? expenseList.map(e => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1e2440;font-size:12px;">
          <span style="color:#94a3b8;">${e.category}</span>
          <span style="color:#4ade80;font-weight:600;font-family:monospace;">₹${e.amount}</span>
        </div>`).join("") +
      `<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;margin-top:6px;font-size:13px;">
         <span style="color:#64748b;font-weight:700;letter-spacing:0.5px;">TOTAL</span>
         <span style="color:#4ade80;font-weight:800;font-family:monospace;font-size:15px;">₹${totalExpense}</span>
       </div>`
    : `<p style="font-size:12px;color:#4b5683;">No expenses logged.</p>`;

  // ── app usage ─────────────────────────────────────────────────────────────
  const appRows = appList.length > 0
    ? appList.map(a => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid #1e2440;font-size:12px;">
          <span style="color:#94a3b8;">${a.name}</span>
          <span style="color:#f472b6;font-weight:600;font-family:monospace;">${a.time} min</span>
        </div>`).join("") +
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
        ["Score",   `${scoreVal}/10`, scoreColor],
        ["Spent",   totalExpense > 0 ? `₹${totalExpense}` : "—", "#4ade80"],
        ["Screen",  totalScreen > 0  ? `${totalScreen}m`  : "—", "#f472b6"],
        ["Goals",   goalsTotal > 0   ? `${goalsCompleted}/${goalsTotal}` : "—", "#818cf8"],
      ].map(([lbl, val, col]) => `
        <div style="padding:18px;text-align:center;border-right:1px solid #1e2440;">
          <div style="font-size:18px;font-weight:700;color:${col};font-family:monospace;">${val}</div>
          <div style="font-size:9px;letter-spacing:1.5px;color:#4b5683;text-transform:uppercase;margin-top:4px;">${lbl}</div>
        </div>`).join("")}
    </div>

    <!-- ═══ BODY ═══ -->
    <div style="padding:32px 44px 44px;">

      <!-- ── SUMMARY ── -->
      ${card(`
        ${sectionHead("📊", "Final Summary", "#6366f1")}
        <p style="font-size:13px;line-height:1.9;color:#c7d2fe;margin:0;">${safe(result.finalSummary || result.aiFeedback)}</p>
      `, "#0c1020", "#6366f133")}

      <!-- ── MOTIVATION ── -->
      ${card(`
        ${sectionHead("🔥", "Daily Motivation", "#a855f7")}
        <p style="font-size:13px;line-height:1.9;color:#e9d5ff;margin:0;font-style:italic;">${safe(result.motivation)}</p>
      `, "#0c1020", "#a855f733")}

      <!-- ── WELLNESS ── -->
      ${wellness && wellnessChips ? card(`
        ${sectionHead("❤️", "Wellness & Vitals", "#f43f5e")}
        <div style="margin-top:10px;">${wellnessChips}</div>
      `) : ""}

      <!-- ── GOALS ── -->
      ${goals && goals.length > 0 ? card(`
        ${sectionHead("🎯", "Goals", "#6366f1")}
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
          <span style="font-size:11px;color:#4b5683;">Completion</span>
          <span style="font-size:12px;color:#818cf8;font-weight:700;">${goalsCompleted} / ${goalsTotal}</span>
        </div>
        ${goalsHTML}
      `) : ""}

      <!-- ── GRATITUDE + TOMORROW ── -->
      ${(gratitude || tomorrowPlan) ? `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px;">
        ${gratitude ? `
          <div style="background:#0c1020;border:1px solid #1e2440;border-top:3px solid #fbbf24;border-radius:14px;padding:20px 22px;page-break-inside:avoid;">
            ${sectionHead("⭐", "Gratitude", "#fbbf24")}
            <p style="font-size:12px;color:#fde68a;line-height:1.85;margin:0;">${safe(gratitude)}</p>
          </div>` : "<div></div>"}
        ${tomorrowPlan ? `
          <div style="background:#0c1020;border:1px solid #1e2440;border-top:3px solid #38bdf8;border-radius:14px;padding:20px 22px;page-break-inside:avoid;">
            ${sectionHead("🌅", "Tomorrow's Plan", "#38bdf8")}
            <p style="font-size:12px;color:#bae6fd;line-height:1.85;margin:0;">${safe(tomorrowPlan)}</p>
          </div>` : "<div></div>"}
      </div>` : ""}

      <!-- ── DIARY ── -->
      ${card(`
        ${sectionHead("📔", "Daily Journal", "#f59e0b")}
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:16px;padding-bottom:14px;border-bottom:1px solid #1e2440;">
          <span style="font-size:32px;">${safe(selectedMood) !== "—" ? selectedMood : "📝"}</span>
          <span style="font-size:18px;font-weight:600;color:#fef3c7;">${safe(diaryTitle)}</span>
        </div>
        ${field("Entry",     safe(form.diary),         "#94a3b8")}
        ${field("AI Review", safe(result.diaryReview), "#fde68a")}
      `)}

      <!-- ═══ SECTION REVIEWS ═══ -->
      ${pageBreakBefore()}
      ${sectionDivider("Section Reviews — Detailed AI Analysis")}

      ${reviewBlock("📖", "Bible Reading",  form.bibleReading,    result.bibleReview,       "#818cf8")}
      ${reviewBlock("📚", "Book Reading",   form.bookReading,     result.bookReview,         "#a855f7")}
      ${reviewBlock("💻", "Coding Work",    form.codingWork,      result.codingReview,       "#22d3ee")}
      ${reviewBlock("🧠", "CS Topic",       form.csTopic,         result.csTopicReview,      "#6366f1")}
      ${reviewBlock("🏫", "College",        form.collegeActivity, result.collegeReview,      "#4ade80")}
      ${reviewBlock("🎬", "Movie",          form.movie,           result.movieReview,        "#f472b6")}

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
      margin:      0,
      filename:    `AI_Life_Report_${result.id || new Date().toISOString().slice(0, 10)}.pdf`,
      image:       { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#050812" },
      jsPDF:       { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(element)
    .save();
}; 