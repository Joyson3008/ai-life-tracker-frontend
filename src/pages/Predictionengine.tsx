import { useEffect, useState, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";

type Props = {
  userId: number;
};

const CATEGORIES = [
  {
    key: "bibleReading",
    label: "Bible",
    icon: "📖",
    color: "#818cf8",
  },
  {
    key: "bookReading",
    label: "Books",
    icon: "📚",
    color: "#a78bfa",
  },
  {
    key: "codingWork",
    label: "Coding",
    icon: "💻",
    color: "#34d399",
  },
  {
    key: "csTopic",
    label: "CS",
    icon: "🧠",
    color: "#22d3ee",
  },
  {
    key: "collegeActivity",
    label: "College",
    icon: "🏫",
    color: "#60a5fa",
  },
  {
    key: "diary",
    label: "Diary",
    icon: "📔",
    color: "#fbbf24",
  },
  {
    key: "movie",
    label: "Movie",
    icon: "🎬",
    color: "#f472b6",
  },
];

/* -------------------------------------------------------------------------- */
/*                               CALCULATIONS                                 */
/* -------------------------------------------------------------------------- */

function linearRegression(data: number[]): {
  slope: number;
  intercept: number;
  r2: number;
} {
  const n = data.length;

  if (n < 2) {
    return {
      slope: 0,
      intercept: data[0] || 5,
      r2: 0,
    };
  }

  const xs = data.map((_, i) => i);

  const meanX = xs.reduce((a, b) => a + b, 0) / n;

  const meanY = data.reduce((a, b) => a + b, 0) / n;

  const ssxy = xs.reduce(
    (sum, x, i) => sum + (x - meanX) * (data[i] - meanY),
    0,
  );

  const ssxx = xs.reduce((sum, x) => sum + (x - meanX) ** 2, 0);

  const ssyy = data.reduce((sum, y) => sum + (y - meanY) ** 2, 0);

  const slope = ssxx !== 0 ? ssxy / ssxx : 0;

  const intercept = meanY - slope * meanX;

  const r2 = ssxx !== 0 && ssyy !== 0 ? ssxy ** 2 / (ssxx * ssyy) : 0;

  return {
    slope,
    intercept,
    r2,
  };
}

function predict(
  regression: ReturnType<typeof linearRegression>,
  step: number,
): number {
  return Math.min(
    10,
    Math.max(0, regression.intercept + regression.slope * step),
  );
}

function movingAverage(data: number[], window: number): number[] {
  return data.map((_, i) => {
    const slice = data.slice(Math.max(0, i - window + 1), i + 1);

    return slice.reduce((a, b) => a + b, 0) / slice.length;
  });
}

function getTrendLabel(slope: number): {
  label: string;
  color: string;
  icon: string;
} {
  if (slope > 0.15) {
    return {
      label: "Strong Uptrend",
      color: "#10b981",
      icon: "↗",
    };
  }

  if (slope > 0.05) {
    return {
      label: "Mild Uptrend",
      color: "#34d399",
      icon: "↗",
    };
  }

  if (slope > -0.05) {
    return {
      label: "Stable",
      color: "#f59e0b",
      icon: "→",
    };
  }

  if (slope > -0.15) {
    return {
      label: "Mild Downtrend",
      color: "#f97316",
      icon: "↘",
    };
  }

  return {
    label: "Declining",
    color: "#f43f5e",
    icon: "↘",
  };
}

function getRiskLevel(
  predicted7: number,
  avgScore: number,
): {
  level: string;
  color: string;
  desc: string;
} {
  if (predicted7 >= 8) {
    return {
      level: "Excellent",
      color: "#10b981",
      desc: "You're on track for a phenomenal week.",
    };
  }

  if (predicted7 >= 6.5) {
    return {
      level: "Good",
      color: "#34d399",
      desc: "Steady progress expected. Small optimizations will push you higher.",
    };
  }

  if (predicted7 >= 5) {
    return {
      level: "Moderate",
      color: "#f59e0b",
      desc: "Room for improvement. Focus on your weakest categories.",
    };
  }

  return {
    level: "At Risk",
    color: "#f43f5e",
    desc: `Your momentum is dropping (avg: ${avgScore.toFixed(
      1,
    )}). Urgent attention needed.`,
  };
}

/* -------------------------------------------------------------------------- */
/*                                TOOLTIP                                     */
/* -------------------------------------------------------------------------- */

const CustomTooltip = ({ active, payload, label, darkMode }: any) => {
  if (!active || !payload?.length) {
    return null;
  }

  const isPredicted = label?.includes("(P)");

  return (
    <div
      className={`
        min-w-[125px]
        rounded-2xl
        border
        px-3.5
        py-3
        shadow-xl
        backdrop-blur-xl
        ${
          darkMode
            ? "bg-[#16181d]/95 border-white/[0.08]"
            : "bg-white/95 border-black/[0.06]"
        }
      `}
    >
      <p
        className={`
          mb-1.5
          text-[10px]
          font-medium
          tracking-wide
          ${darkMode ? "text-white/40" : "text-black/40"}
        `}
      >
        {label}
      </p>

      <div className="flex items-center gap-1.5">
        <span
          className="text-sm font-semibold"
          style={{
            color: isPredicted ? "#8b5cf6" : "#6366f1",
          }}
        >
          {isPredicted ? "Prediction" : "Score"}
        </span>

        <span
          className={`
            text-sm font-bold
            ${darkMode ? "text-white" : "text-slate-900"}
          `}
        >
          {Number(payload[0]?.value || 0).toFixed(1)}
        </span>
      </div>

      {isPredicted && (
        <p className="mt-1 text-[9px] text-violet-500">Forecast</p>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function PredictionEngine({ userId }: Props) {
  const { darkMode } = useTheme();

  const [logs, setLogs] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [predDays, setPredDays] = useState(14);

  const [activeTab, setActiveTab] = useState<
    "forecast" | "categories" | "risks"
  >("forecast");

  /* ------------------------------------------------------------------------ */
  /*                              THEME                                       */
  /* ------------------------------------------------------------------------ */

  const theme = {
    page: darkMode ? "bg-[#050608]" : "bg-[#f5f5f7]",

    card: darkMode
      ? "bg-[#111214]/90 border-white/[0.07]"
      : "bg-white/90 border-black/[0.06]",

    elevatedCard: darkMode ? "bg-[#151619]" : "bg-white",

    text: darkMode ? "text-white" : "text-[#1d1d1f]",

    secondary: darkMode ? "text-white/55" : "text-black/50",

    muted: darkMode ? "text-white/35" : "text-black/35",

    divider: darkMode ? "border-white/[0.07]" : "border-black/[0.06]",

    softBackground: darkMode ? "bg-white/[0.035]" : "bg-black/[0.025]",
  };

  /* ------------------------------------------------------------------------ */
  /*                              FETCH DATA                                  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let cancelled = false;

    setLoading(true);

    fetch("https://ai-life-tracker.onrender.com/api/daily")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;

        const userLogs = data
          .filter((l: any) => l.user?.id === userId)
          .sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime(),
          );

        setLogs(userLogs);
      })
      .catch((error) => {
        console.error("Prediction data error:", error);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  /* ------------------------------------------------------------------------ */
  /*                              ANALYSIS                                    */
  /* ------------------------------------------------------------------------ */

  const analysis = useMemo(() => {
    if (logs.length < 3) {
      return null;
    }

    const scores = logs.map((l) => l.score || 0);

    const ma7 = movingAverage(scores, 7);

    const reg = linearRegression(scores);

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    const recentAvg =
      scores.slice(-7).reduce((a, b) => a + b, 0) / Math.min(7, scores.length);

    /* ---------------------------------------------------------------------- */
    /*                           PREDICTIONS                                  */
    /* ---------------------------------------------------------------------- */

    const predictions: number[] = [];

    for (let i = 1; i <= predDays; i++) {
      const rawPred = predict(reg, scores.length - 1 + i);

      const dampened = rawPred * 0.7 + recentAvg * 0.3;

      predictions.push(Math.min(10, Math.max(0, dampened)));
    }

    const predicted7 = predictions.slice(0, 7).reduce((a, b) => a + b, 0) / 7;

    /* ---------------------------------------------------------------------- */
    /*                            CHART DATA                                  */
    /* ---------------------------------------------------------------------- */

    const chartData = [
      ...logs.slice(-14).map((l, i) => ({
        label: new Date(l.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),

        actual: l.score || 0,

        ma: parseFloat(ma7[logs.length - 14 + i]?.toFixed(1) || "0"),

        predicted: undefined as number | undefined,
      })),

      ...predictions.map((p, i) => {
        const d = new Date();

        d.setDate(d.getDate() + i + 1);

        return {
          label:
            d.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }) + " (P)",

          actual: undefined as number | undefined,

          ma: undefined as number | undefined,

          predicted: parseFloat(p.toFixed(2)),
        };
      }),
    ];

    /* ---------------------------------------------------------------------- */
    /*                         CATEGORY ANALYSIS                              */
    /* ---------------------------------------------------------------------- */

    const categoryAnalysis = CATEGORIES.map((cat) => {
      const catData: number[] = logs.map((l) => (l[cat.key] ? 1 : 0));

      const catReg = linearRegression(catData);

      const frequency = catData.reduce((a, b) => a + b, 0) / catData.length;

      const recentFreq =
        catData.slice(-7).reduce((a, b) => a + b, 0) /
        Math.min(7, catData.length);

      const predictedFreq = Math.min(
        1,
        Math.max(0, predict(catReg, catData.length + 6)),
      );

      return {
        ...cat,

        frequency: Math.round(frequency * 100),

        recentFreq: Math.round(recentFreq * 100),

        predictedFreq: Math.round(predictedFreq * 100),

        trend: catReg.slope,

        trendInfo: getTrendLabel(catReg.slope),
      };
    });

    /* ---------------------------------------------------------------------- */
    /*                              RADAR                                     */
    /* ---------------------------------------------------------------------- */

    const radarData = categoryAnalysis.map((c) => ({
      subject: c.label,
      current: c.frequency,
      predicted: c.predictedFreq,
    }));

    /* ---------------------------------------------------------------------- */
    /*                               RISKS                                     */
    /* ---------------------------------------------------------------------- */

    const risks: {
      type: string;
      severity: "low" | "medium" | "high";
      message: string;
    }[] = [];

    if (reg.slope < -0.1) {
      risks.push({
        type: "Score Decline",
        severity: "high",
        message:
          "Your daily score trend is declining significantly over recent weeks.",
      });
    } else if (reg.slope < 0) {
      risks.push({
        type: "Score Drift",
        severity: "medium",
        message:
          "Slight downward drift in scores. Consistency could be improved.",
      });
    }

    const codingCat = categoryAnalysis.find((c) => c.key === "codingWork");

    if (codingCat && codingCat.trend < -0.05) {
      risks.push({
        type: "Coding Drops",
        severity: "medium",
        message:
          "Coding frequency is declining. Schedule dedicated coding blocks.",
      });
    }

    if (recentAvg < avgScore * 0.85) {
      risks.push({
        type: "Performance Drop",
        severity: "high",
        message: `Your last 7-day average (${recentAvg.toFixed(
          1,
        )}) is well below your all-time average (${avgScore.toFixed(1)}).`,
      });
    }

    const bibleCat = categoryAnalysis.find((c) => c.key === "bibleReading");

    if (bibleCat && bibleCat.recentFreq < 50) {
      risks.push({
        type: "Spiritual Gap",
        severity: "low",
        message:
          "Bible reading frequency below 50% this week. Consider morning devotionals.",
      });
    }

    /* ---------------------------------------------------------------------- */
    /*                          OPPORTUNITIES                                 */
    /* ---------------------------------------------------------------------- */

    const opportunities: {
      message: string;
      category: string;
    }[] = [];

    categoryAnalysis.forEach((c) => {
      if (c.trend > 0.05 && c.frequency < 70) {
        opportunities.push({
          message: `${c.icon} ${c.label} is trending up — keep the momentum!`,
          category: c.key,
        });
      }
    });

    if (recentAvg > avgScore) {
      opportunities.push({
        message: `Your recent performance (${recentAvg.toFixed(
          1,
        )}) is above your average. You're in a growth phase!`,
        category: "score",
      });
    }

    const risk = getRiskLevel(predicted7, avgScore);

    const trendInfo = getTrendLabel(reg.slope);

    return {
      scores,
      reg,
      avgScore,
      recentAvg,
      predicted7,
      predictions,
      chartData,
      categoryAnalysis,
      radarData,
      risks,
      opportunities,
      risk,
      trendInfo,
      ma7,
    };
  }, [logs, predDays]);

  /* ------------------------------------------------------------------------ */
  /*                              LOADING                                     */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <div
        className={`
          min-h-screen
          flex
          items-center
          justify-center
          px-6
          ${theme.page}
        `}
      >
        <div className="flex flex-col items-center">
          <div
            className="
              h-9
              w-9
              rounded-full
              border-[2.5px]
              border-violet-500/20
              border-t-violet-500
              animate-spin
            "
          />

          <p
            className={`
              mt-4
              text-sm
              font-medium
              ${theme.secondary}
            `}
          >
            Preparing your forecast…
          </p>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                             EMPTY STATE                                  */
  /* ------------------------------------------------------------------------ */

  if (!analysis || logs.length < 5) {
    const progress = Math.min(100, (logs.length / 5) * 100);

    return (
      <div
        className={`
          min-h-screen
          flex
          items-center
          justify-center
          px-5
          py-10
          ${theme.page}
        `}
      >
        <div
          className={`
            w-full
            max-w-md
            rounded-[28px]
            border
            p-7
            sm:p-9
            text-center
            shadow-sm
            ${theme.card}
          `}
        >
          <div
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-[22px]
              bg-violet-500/10
              text-3xl
            "
          >
            ✦
          </div>

          <h2
            className={`
              mt-6
              text-2xl
              font-semibold
              tracking-[-0.03em]
              ${theme.text}
            `}
          >
            Build your baseline
          </h2>

          <p
            className={`
              mx-auto
              mt-2
              max-w-sm
              text-sm
              leading-6
              ${theme.secondary}
            `}
          >
            Log at least 5 days to unlock your personal prediction engine.
          </p>

          <div className="mt-7">
            <div
              className={`
                flex
                items-center
                justify-between
                text-xs
                font-medium
                ${theme.secondary}
              `}
            >
              <span>Progress</span>

              <span>{logs.length}/5</span>
            </div>

            <div
              className={`
                mt-2
                h-2
                overflow-hidden
                rounded-full
                ${darkMode ? "bg-white/[0.06]" : "bg-black/[0.06]"}
              `}
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-violet-500
                  transition-all
                  duration-500
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                    THE REST OF YOUR PAGE                                */
  /* ------------------------------------------------------------------------ */

  /*
   * Continue your existing JSX here.
   *
   * The important design foundation above is now:
   *
   * 1. `theme.page`
   * 2. `theme.card`
   * 3. `theme.elevatedCard`
   * 4. `theme.text`
   * 5. `theme.secondary`
   * 6. `theme.muted`
   * 7. `theme.divider`
   * 8. `theme.softBackground`
   *
   * Use these classes for all remaining forecast,
   * category, radar, risk and opportunity sections.
   */

  return (
    <div
      className={`
        min-h-screen
        w-full
        overflow-x-hidden
        ${theme.page}
        ${theme.text}
      `}
    >
      <main
        className="
          mx-auto
          w-full
          max-w-6xl
          px-4
          pb-24
          pt-5
          sm:px-6
          sm:pt-8
          lg:px-8
        "
      >
        {/* HEADER */}

        <header className="mb-6 sm:mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={`
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  ${theme.muted}
                `}
              >
                Personal Intelligence
              </p>

              <h1
                className={`
                  mt-1
                  text-[30px]
                  font-semibold
                  tracking-[-0.045em]
                  sm:text-4xl
                  ${theme.text}
                `}
              >
                Prediction
              </h1>

              <p
                className={`
                  mt-1.5
                  max-w-md
                  text-sm
                  leading-5
                  ${theme.secondary}
                `}
              >
                A forward-looking view of your daily momentum.
              </p>
            </div>

            <div
              className={`
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-2xl
                border
                bg-violet-500/10
                text-lg
                ${theme.divider}
              `}
            >
              ✦
            </div>
          </div>
        </header>

        {/* FORECAST RANGE */}

        <section
          className={`
            mb-5
            rounded-2xl
            border
            p-1
            ${theme.card}
          `}
        >
          <div className="grid grid-cols-3 gap-1">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setPredDays(days)}
                className={`
                    rounded-xl
                    px-3
                    py-2.5
                    text-xs
                    font-semibold
                    transition-all
                    ${
                      predDays === days
                        ? darkMode
                          ? "bg-white text-black shadow-sm"
                          : "bg-[#1d1d1f] text-white shadow-sm"
                        : darkMode
                          ? "text-white/45 hover:bg-white/[0.05]"
                          : "text-black/45 hover:bg-black/[0.04]"
                    }
                  `}
              >
                {days} days
              </button>
            ))}
          </div>
        </section>

        {/* MAIN PREDICTION CARD */}

        <section
          className={`
            overflow-hidden
            rounded-[28px]
            border
            p-5
            sm:p-7
            ${theme.card}
          `}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p
                className={`
                  text-xs
                  font-medium
                  ${theme.secondary}
                `}
              >
                Expected 7-day score
              </p>

              <div className="mt-1 flex items-end gap-2">
                <span
                  className={`
                    text-5xl
                    font-semibold
                    tracking-[-0.06em]
                    sm:text-6xl
                    ${theme.text}
                  `}
                >
                  {analysis.predicted7.toFixed(1)}
                </span>

                <span
                  className={`
                    mb-2
                    text-sm
                    ${theme.muted}
                  `}
                >
                  / 10
                </span>
              </div>
            </div>

            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-[20px]
                bg-violet-500/10
                text-2xl
              "
            >
              {analysis.trendInfo.icon}
            </div>
          </div>

          <div
            className={`
              mt-5
              flex
              flex-wrap
              items-center
              gap-2
              text-xs
            `}
          >
            <span
              className="
                rounded-full
                bg-emerald-500/10
                px-3
                py-1.5
                font-semibold
                text-emerald-500
              "
            >
              {analysis.trendInfo.label}
            </span>

            <span
              className={`
                rounded-full
                px-3
                py-1.5
                ${theme.softBackground}
                ${theme.secondary}
              `}
            >
              Avg {analysis.avgScore.toFixed(1)}
            </span>
          </div>
        </section>

        {/* TABS */}

        <div
          className="
            mt-5
            flex
            gap-2
            overflow-x-auto
            pb-1
            scrollbar-none
          "
        >
          {[
            {
              id: "forecast",
              label: "Forecast",
            },
            {
              id: "categories",
              label: "Categories",
            },
            {
              id: "risks",
              label: "Insights",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as "forecast" | "categories" | "risks")
              }
              className={`
                shrink-0
                rounded-full
                px-4
                py-2
                text-xs
                font-semibold
                transition-all
                ${
                  activeTab === tab.id
                    ? darkMode
                      ? "bg-white text-black"
                      : "bg-[#1d1d1f] text-white"
                    : darkMode
                      ? "bg-white/[0.05] text-white/45"
                      : "bg-black/[0.04] text-black/45"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CHART */}

        {activeTab === "forecast" && (
          <section
            className={`
              mt-4
              rounded-[28px]
              border
              p-4
              sm:p-6
              ${theme.card}
            `}
          >
            <div className="mb-5">
              <h2
                className={`
                  text-lg
                  font-semibold
                  tracking-[-0.025em]
                  ${theme.text}
                `}
              >
                Momentum forecast
              </h2>

              <p
                className={`
                  mt-1
                  text-xs
                  ${theme.secondary}
                `}
              >
                Historical performance and projected momentum.
              </p>
            </div>

            <div className="h-[280px] w-full sm:h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analysis.chartData}
                  margin={{
                    top: 8,
                    right: 4,
                    left: -24,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="actualGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#6366f1"
                        stopOpacity={darkMode ? 0.3 : 0.2}
                      />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient
                      id="predictionGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#8b5cf6"
                        stopOpacity={darkMode ? 0.25 : 0.15}
                      />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke={darkMode ? "#ffffff" : "#000000"}
                    strokeOpacity={darkMode ? 0.05 : 0.05}
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                    tick={{
                      fontSize: 10,
                      fill: darkMode ? "#ffffff66" : "#00000055",
                    }}
                    tickLine={false}
                    axisLine={false}
                    interval="preserveStartEnd"
                  />

                  <YAxis
                    domain={[0, 10]}
                    tick={{
                      fontSize: 10,
                      fill: darkMode ? "#ffffff66" : "#00000055",
                    }}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                  />

                  <Tooltip content={<CustomTooltip darkMode={darkMode} />} />

                  <ReferenceLine
                    y={analysis.avgScore}
                    stroke={darkMode ? "#ffffff" : "#000000"}
                    strokeOpacity={0.15}
                    strokeDasharray="4 4"
                  />

                  <Area
                    type="monotone"
                    dataKey="actual"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fill="url(#actualGradient)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      strokeWidth: 2,
                    }}
                    connectNulls
                  />

                  <Area
                    type="monotone"
                    dataKey="predicted"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    strokeDasharray="6 5"
                    fill="url(#predictionGradient)"
                    dot={false}
                    activeDot={{
                      r: 4,
                      strokeWidth: 2,
                    }}
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* CHART LEGEND */}

            <div
              className={`
                mt-4
                flex
                flex-wrap
                gap-x-5
                gap-y-2
                border-t
                pt-4
                ${theme.divider}
              `}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />

                <span
                  className={`
                    text-[11px]
                    ${theme.secondary}
                  `}
                >
                  Actual
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-500" />

                <span
                  className={`
                    text-[11px]
                    ${theme.secondary}
                  `}
                >
                  Predicted
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`
                    h-px
                    w-4
                    border-t
                    border-dashed
                    ${darkMode ? "border-white/30" : "border-black/30"}
                  `}
                />

                <span
                  className={`
                    text-[11px]
                    ${theme.secondary}
                  `}
                >
                  Average
                </span>
              </div>
            </div>
          </section>
        )}

        {/* CATEGORY VIEW */}

        {activeTab === "categories" && (
          <section className="mt-4 space-y-4">
            <div
              className={`
                rounded-[28px]
                border
                p-4
                sm:p-6
                ${theme.card}
              `}
            >
              <h2
                className={`
                  text-lg
                  font-semibold
                  ${theme.text}
                `}
              >
                Life balance
              </h2>

              <p
                className={`
                  mt-1
                  text-xs
                  ${theme.secondary}
                `}
              >
                Current consistency compared with the predicted pattern.
              </p>

              <div className="mt-4 h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={analysis.radarData} outerRadius="68%">
                    <PolarGrid
                      stroke={darkMode ? "#ffffff" : "#000000"}
                      strokeOpacity={0.08}
                    />

                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{
                        fontSize: 9,
                        fill: darkMode ? "#ffffff99" : "#00000080",
                      }}
                    />

                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.15}
                    />

                    <Radar
                      name="Predicted"
                      dataKey="predicted"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.1}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {analysis.categoryAnalysis.map((category) => (
                <div
                  key={category.key}
                  className={`
                      rounded-[24px]
                      border
                      p-4
                      ${theme.card}
                    `}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-2xl
                            text-lg
                          "
                        style={{
                          backgroundColor: `${category.color}18`,
                        }}
                      >
                        {category.icon}
                      </div>

                      <div>
                        <p
                          className={`
                              text-sm
                              font-semibold
                              ${theme.text}
                            `}
                        >
                          {category.label}
                        </p>

                        <p
                          className={`
                              mt-0.5
                              text-[10px]
                              ${theme.muted}
                            `}
                        >
                          {category.trendInfo.label}
                        </p>
                      </div>
                    </div>

                    <span
                      className="text-lg font-semibold"
                      style={{
                        color: category.color,
                      }}
                    >
                      {category.frequency}%
                    </span>
                  </div>

                  <div
                    className={`
                        mt-4
                        h-1.5
                        overflow-hidden
                        rounded-full
                        ${darkMode ? "bg-white/[0.06]" : "bg-black/[0.06]"}
                      `}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${category.frequency}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>

                  <div
                    className={`
                        mt-2
                        flex
                        justify-between
                        text-[10px]
                        ${theme.muted}
                      `}
                  >
                    <span>Recent {category.recentFreq}%</span>

                    <span>Forecast {category.predictedFreq}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RISKS / INSIGHTS */}

        {activeTab === "risks" && (
          <section className="mt-4 space-y-4">
            <div
              className={`
                rounded-[28px]
                border
                p-5
                ${theme.card}
              `}
            >
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    bg-emerald-500/10
                    text-emerald-500
                  "
                >
                  ✓
                </div>

                <div>
                  <p
                    className={`
                      text-xs
                      font-medium
                      ${theme.secondary}
                    `}
                  >
                    Overall outlook
                  </p>

                  <h2
                    className={`
                      mt-1
                      text-xl
                      font-semibold
                      ${theme.text}
                    `}
                  >
                    {analysis.risk.level}
                  </h2>

                  <p
                    className={`
                      mt-1.5
                      text-sm
                      leading-5
                      ${theme.secondary}
                    `}
                  >
                    {analysis.risk.desc}
                  </p>
                </div>
              </div>
            </div>

            {analysis.risks.length > 0 && (
              <div>
                <h3
                  className={`
                    mb-3
                    px-1
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    ${theme.muted}
                  `}
                >
                  Areas to watch
                </h3>

                <div className="space-y-3">
                  {analysis.risks.map((risk, index) => (
                    <div
                      key={`${risk.type}-${index}`}
                      className={`
                          rounded-[24px]
                          border
                          p-4
                          ${theme.card}
                        `}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`
                              mt-1
                              h-2
                              w-2
                              shrink-0
                              rounded-full
                              ${
                                risk.severity === "high"
                                  ? "bg-rose-500"
                                  : risk.severity === "medium"
                                    ? "bg-amber-500"
                                    : "bg-sky-500"
                              }
                            `}
                        />

                        <div>
                          <p
                            className={`
                                text-sm
                                font-semibold
                                ${theme.text}
                              `}
                          >
                            {risk.type}
                          </p>

                          <p
                            className={`
                                mt-1
                                text-xs
                                leading-5
                                ${theme.secondary}
                              `}
                          >
                            {risk.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.opportunities.length > 0 && (
              <div>
                <h3
                  className={`
                    mb-3
                    px-1
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wider
                    ${theme.muted}
                  `}
                >
                  Opportunities
                </h3>

                <div className="space-y-3">
                  {analysis.opportunities.map((opportunity, index) => (
                    <div
                      key={`${opportunity.category}-${index}`}
                      className={`
                          rounded-[24px]
                          border
                          p-4
                          ${theme.card}
                        `}
                    >
                      <p
                        className={`
                            text-sm
                            leading-6
                            ${theme.text}
                          `}
                      >
                        {opportunity.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.risks.length === 0 &&
              analysis.opportunities.length === 0 && (
                <div
                  className={`
                    rounded-[24px]
                    border
                    p-6
                    text-center
                    ${theme.card}
                  `}
                >
                  <div className="text-2xl">✓</div>

                  <p
                    className={`
                      mt-2
                      text-sm
                      font-semibold
                      ${theme.text}
                    `}
                  >
                    Everything looks steady
                  </p>

                  <p
                    className={`
                      mt-1
                      text-xs
                      ${theme.secondary}
                    `}
                  >
                    Keep following your current routine.
                  </p>
                </div>
              )}
          </section>
        )}
      </main>
    </div>
  );
}
