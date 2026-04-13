"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import {
  computeTrendingMetrics,
  formatViews,
  TimeFilter,
  TrendingMetrics,
} from "@/lib/trending-analytics";

// ── Category icons ────────────────────────────────────────────────────────────
const CAT_ICON: Record<string, string> = {
  technology: "⚡", sports: "⚽", business: "📈",
  health: "❤️", science: "🔬", entertainment: "🎬", all: "◈",
};

// ── Rank delta badge ──────────────────────────────────────────────────────────
function RankDelta({ delta }: { delta: number }) {
  if (delta === 0) {
    return (
      <span className="flex items-center gap-0.5 text-[10px] font-bold text-slate-400 dark:text-slate-600">
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </span>
    );
  }
  const up = delta > 0;
  return (
    <span className={`flex items-center gap-0.5 text-[10px] font-bold ${up ? "text-emerald-500" : "text-red-400"}`}>
      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d={up ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
      </svg>
      {Math.abs(delta)}
    </span>
  );
}

// ── Mini sparkline (pure SVG, no library) ─────────────────────────────────────
function Sparkline({ score, id }: { score: number; id: string }) {
  // Generate a deterministic-looking curve from the score
  const points = useMemo(() => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
    const rand = () => { h ^= h << 13; h ^= h >> 17; h ^= h << 5; return (h >>> 0) / 0xffffffff; };
    const base = score / 100;
    return Array.from({ length: 8 }, (_, i) => {
      const t = i / 7;
      return Math.max(0.05, Math.min(0.95, base * t + rand() * 0.25 - 0.1));
    });
  }, [score, id]);

  const w = 64, h = 24;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((v) => h - v * h);
  const d  = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const fill = `${d} L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fill} fill={`url(#sg-${id})`} />
      <path d={d} fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function TrendBar({ score, rank }: { score: number; rank: number }) {
  const color =
    rank === 1 ? "from-amber-400 to-orange-500" :
    rank === 2 ? "from-slate-400 to-slate-500" :
    rank === 3 ? "from-amber-600 to-amber-700" :
    "from-blue-500 to-violet-600";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 w-7 text-right tabular-nums">
        {score}%
      </span>
    </div>
  );
}

// ── Featured card (rank #1) ───────────────────────────────────────────────────
function FeaturedCard({ m }: { m: TrendingMetrics }) {
  const { article, rank, views, score, velocity, rankDelta, isHot, isNew } = m;

  return (
    <Link
      href={`/article/${article.id}`}
      className="group relative rounded-2xl overflow-hidden flex flex-col justify-end shadow-xl card-lift min-h-[340px] lg:min-h-[420px]"
    >
      <Image
        src={article.imageUrl}
        alt={article.title}
        fill
        sizes="(max-width:1024px) 100vw, 45vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        loading="lazy"
      />
      {/* Gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
      {/* Hover tint */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-violet-600/0 group-hover:from-blue-600/10 group-hover:to-violet-600/10 transition-all duration-500" />

      {/* Top badges */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
        {/* Rank pill */}
        <div className="flex items-center gap-1.5 bg-amber-400/90 backdrop-blur-sm text-black text-xs font-black px-2.5 py-1 rounded-full shadow-lg">
          <span className="text-[10px]">🏆</span>
          #1 Trending
        </div>
        {/* Hot / New badges */}
        <div className="flex flex-col items-end gap-1.5">
          {isHot && (
            <span className="flex items-center gap-1 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              HOT
            </span>
          )}
          {isNew && (
            <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6 space-y-3">
        <CategoryBadge category={article.category} gradient size="md" />

        <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight tracking-tight group-hover:text-blue-300 transition-colors text-balance">
          {article.title}
        </h2>

        {/* Analytics row */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Views */}
          <div className="flex items-center gap-1.5 glass px-2.5 py-1 rounded-lg">
            <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-[11px] font-bold text-white">{formatViews(views)}</span>
          </div>
          {/* Velocity */}
          <div className="flex items-center gap-1.5 glass px-2.5 py-1 rounded-lg">
            <svg className="w-3 h-3 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span className="text-[11px] font-bold text-white">{formatViews(velocity)}/hr</span>
          </div>
          {/* Rank delta */}
          <div className="glass px-2.5 py-1 rounded-lg">
            <RankDelta delta={rankDelta} />
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-white/50">
            <span>Trend strength</span>
            <span className="font-bold text-white/80">{score}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2 text-[11px] text-white/50 pt-1">
          <span className="font-medium text-white/70">{article.source}</span>
          <span className="text-white/30">·</span>
          <span>{article.author}</span>
          <span className="text-white/30">·</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

// ── Ranked list row ───────────────────────────────────────────────────────────
function RankedRow({ m, maxScore }: { m: TrendingMetrics; maxScore: number }) {
  const { article, rank, views, score, velocity, rankDelta, isHot, isNew } = m;

  const rankColor =
    rank === 1 ? "text-amber-500 dark:text-amber-400" :
    rank === 2 ? "text-slate-400 dark:text-slate-500" :
    rank === 3 ? "text-amber-700 dark:text-amber-600" :
    "text-slate-300 dark:text-slate-700";

  const barColor =
    rank === 1 ? "from-amber-400 to-orange-500" :
    rank === 2 ? "from-slate-400 to-slate-500" :
    rank === 3 ? "from-amber-600 to-amber-700" :
    "from-blue-500 to-violet-600";

  return (
    <Link
      href={`/article/${article.id}`}
      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
    >
      {/* Rank number */}
      <div className="flex flex-col items-center gap-0.5 shrink-0 w-7 pt-0.5">
        <span className={`text-xl font-black leading-none tabular-nums ${rankColor}`}>
          {rank}
        </span>
        <RankDelta delta={rankDelta} />
      </div>

      {/* Thumbnail */}
      <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          sizes="72px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {/* Category icon overlay */}
        <div className="absolute bottom-1 right-1 text-sm leading-none drop-shadow">
          {CAT_ICON[article.category] ?? "◈"}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <CategoryBadge category={article.category} />
          {isHot && (
            <span className="flex items-center gap-0.5 text-[9px] font-black text-red-500 uppercase tracking-wider">
              <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
              Hot
            </span>
          )}
          {isNew && (
            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-wider">New</span>
          )}
        </div>

        {/* Title */}
        <p className="text-[0.82rem] font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </p>

        {/* Progress bar */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
              style={{ width: `${(score / maxScore) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-slate-400 tabular-nums shrink-0">{score}%</span>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
          {/* Views */}
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {formatViews(views)}
          </span>
          {/* Velocity */}
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            {formatViews(velocity)}/hr
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="hidden sm:block shrink-0 self-center opacity-60 group-hover:opacity-100 transition-opacity">
        <Sparkline score={score} id={article.id} />
      </div>
    </Link>
  );
}

// ── Time filter button ────────────────────────────────────────────────────────
function FilterBtn({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
        active
          ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
          : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      {label}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  articles: Article[];
}

export default function TrendingGrid({ articles }: Props) {
  const [filter, setFilter] = useState<TimeFilter>("today");

  const metrics = useMemo(
    () => computeTrendingMetrics(articles, filter).slice(0, 8),
    [articles, filter]
  );

  const maxScore = metrics[0]?.score ?? 100;
  const featured = metrics[0];
  const ranked   = metrics.slice(1);

  if (!featured) return null;

  // Summary stats
  const totalViews  = metrics.reduce((s, m) => s + m.views, 0);
  const avgVelocity = Math.round(metrics.reduce((s, m) => s + m.velocity, 0) / metrics.length);
  const hotCount    = metrics.filter((m) => m.isHot).length;

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm overflow-hidden">

      {/* ── Dashboard header ── */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center justify-between gap-4 flex-wrap">

          {/* Title + live dot */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Live</span>
            </div>
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Trending Analytics
            </h2>
          </div>

          {/* Time filter */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            <FilterBtn label="Today"     active={filter === "today"} onClick={() => setFilter("today")} />
            <FilterBtn label="This Week" active={filter === "week"}  onClick={() => setFilter("week")}  />
          </div>
        </div>

        {/* Summary stats bar */}
        <div className="flex items-center gap-5 mt-4 flex-wrap">
          {[
            {
              icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ),
              label: "Total views",
              value: formatViews(totalViews),
              color: "text-blue-600 dark:text-blue-400",
            },
            {
              icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ),
              label: "Avg velocity",
              value: `${formatViews(avgVelocity)}/hr`,
              color: "text-emerald-600 dark:text-emerald-400",
            },
            {
              icon: <span className="text-sm">🔥</span>,
              label: "Hot stories",
              value: String(hotCount),
              color: "text-orange-500 dark:text-orange-400",
            },
            {
              icon: (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              ),
              label: "Stories tracked",
              value: String(metrics.length),
              color: "text-violet-600 dark:text-violet-400",
            },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`${color} opacity-70`}>{icon}</div>
              <div>
                <p className={`text-sm font-extrabold ${color} tabular-nums`}>{value}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body: featured + ranked list ── */}
      <div className="flex flex-col lg:flex-row gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800/60">

        {/* Featured card */}
        <div className="lg:w-[45%] p-4">
          <FeaturedCard m={featured} />
        </div>

        {/* Ranked list */}
        <div className="flex-1 p-4 space-y-0.5">
          {/* Column headers */}
          <div className="flex items-center gap-3 px-3 pb-2 border-b border-slate-50 dark:border-slate-800/60">
            <span className="w-7 text-[10px] font-bold text-slate-400 uppercase tracking-wider">#</span>
            <span className="w-[72px] shrink-0" />
            <span className="flex-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Story</span>
            <span className="hidden sm:block w-16 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Trend</span>
          </div>

          {ranked.map((m) => (
            <RankedRow key={m.article.id} m={m} maxScore={maxScore} />
          ))}
        </div>
      </div>
    </div>
  );
}
