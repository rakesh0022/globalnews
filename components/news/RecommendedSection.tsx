"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article, Category } from "@/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { usePreferences } from "@/hooks/usePreferences";

// ── Category gradient map for interest tags ───────────────────────────────────
const CAT_GRADIENT: Record<Category, string> = {
  all:           "from-slate-500 to-slate-600",
  technology:    "from-blue-500 to-violet-600",
  sports:        "from-emerald-500 to-cyan-500",
  business:      "from-amber-500 to-orange-500",
  health:        "from-rose-500 to-pink-500",
  science:       "from-violet-500 to-blue-500",
  entertainment: "from-pink-500 to-orange-500",
};

// ── Single recommendation card ────────────────────────────────────────────────
function RecommendCard({ article }: { article: Article }) {
  const { trackClick } = usePreferences();

  return (
    <Link
      href={`/article/${article.id}`}
      onClick={() => trackClick(article.id, article.category)}
      className="group flex-none w-[260px] sm:w-[280px] rounded-2xl overflow-hidden bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm card-lift"
    >
      {/* Image */}
      <div className="relative w-full h-[148px] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          sizes="280px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          loading="lazy"
        />
        {/* Hover wash */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-violet-600/0 group-hover:from-blue-600/10 group-hover:to-violet-600/10 transition-all duration-500" />
      </div>

      {/* Body */}
      <div className="p-4 space-y-2">
        <CategoryBadge category={article.category} />
        <h3 className="text-[0.85rem] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-50 dark:border-slate-800/50">
          <span className="font-medium truncate max-w-[120px]">{article.source}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

// ── Interest tag pill ─────────────────────────────────────────────────────────
function InterestTag({ category }: { category: Category }) {
  const gradient = CAT_GRADIENT[category] ?? CAT_GRADIENT.all;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${gradient} shadow-sm`}
    >
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </span>
  );
}

// ── Scroll arrow button ───────────────────────────────────────────────────────
function ScrollBtn({
  dir,
  onClick,
  disabled,
}: {
  dir: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        {dir === "left"
          ? <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          : <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        }
      </svg>
    </button>
  );
}

// ── Main section ──────────────────────────────────────────────────────────────
interface Props {
  articles: Article[];
  topCats:  Category[];
  onReset?: () => void;
}

export default function RecommendedSection({ articles, topCats, onReset }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const SCROLL_BY = 300;

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  const scroll = useCallback((dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -SCROLL_BY : SCROLL_BY,
      behavior: "smooth",
    });
  }, []);

  if (!articles.length) return null;

  return (
    <section className="space-y-4 animate-fade-up">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-2">
          {/* Section title */}
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recommended for You
            </h2>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full">
              Personalised
            </span>
          </div>

          {/* Interest tags */}
          {topCats.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Based on your interest in
              </span>
              {topCats.map((cat) => (
                <InterestTag key={cat} category={cat} />
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <ScrollBtn dir="left"  onClick={() => scroll("left")}  disabled={!canLeft}  />
          <ScrollBtn dir="right" onClick={() => scroll("right")} disabled={!canRight} />
          {onReset && (
            <button
              onClick={onReset}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Clear preferences"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ── Horizontal scroll strip ── */}
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1"
      >
        {articles.map((article) => (
          <RecommendCard key={article.id} article={article} />
        ))}

        {/* "See more" end card */}
        <Link
          href="/search"
          className="flex-none w-[180px] rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2 text-slate-400 dark:text-slate-500 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-center px-3">Explore more stories</span>
        </Link>
      </div>

      {/* ── Fade edges hint ── */}
      <p className="text-[11px] text-slate-400 dark:text-slate-600 text-center">
        Recommendations improve as you read more stories
      </p>
    </section>
  );
}
