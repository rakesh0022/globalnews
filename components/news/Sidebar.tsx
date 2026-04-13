"use client";

import { memo } from "react";
import { useRouter } from "next/navigation";
import TrendingList from "@/components/news/TrendingList";
import NewsletterWidget from "@/components/news/NewsletterWidget";
import { SkeletonTrending } from "@/components/ui/SkeletonCard";
import { Article } from "@/types";

const TOPICS = [
  { label: "AI",       emoji: "🤖" },
  { label: "Climate",  emoji: "🌍" },
  { label: "Markets",  emoji: "📈" },
  { label: "Space",    emoji: "🚀" },
  { label: "Politics", emoji: "🏛️" },
  { label: "Crypto",   emoji: "₿"  },
  { label: "Health",   emoji: "❤️" },
  { label: "Sports",   emoji: "⚽" },
  { label: "Science",  emoji: "🔬" },
  { label: "Tech",     emoji: "⚡" },
] as const;

interface Props {
  trending:        Article[];
  trendingLoading: boolean;
}

function SidebarInner({ trending, trendingLoading }: Props) {
  const router = useRouter();

  return (
    <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
      {/* Sticky container */}
      <div className="lg:sticky lg:top-24 space-y-5">

        {/* ── Trending ── */}
        <div className="rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm overflow-hidden">
          {/* Header with gradient accent */}
          <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-orange-400 to-red-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Trending Now
                </h3>
              </div>
              <span className="text-base" aria-hidden="true">🔥</span>
            </div>
          </div>
          <div className="p-4">
            {trendingLoading ? <SkeletonTrending /> : <TrendingList articles={trending} />}
          </div>
        </div>

        {/* ── Newsletter ── */}
        <NewsletterWidget />

        {/* ── Browse Topics ── */}
        <div className="rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Browse Topics
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map(({ label, emoji }) => (
              <button
                key={label}
                onClick={() => router.push(`/search?q=${encodeURIComponent(label)}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700/50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 dark:hover:border-blue-800/50 transition-all duration-200"
              >
                <span className="text-sm leading-none">{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── About card ── */}
        <div className="relative rounded-2xl overflow-hidden p-5 bg-gradient-to-br from-blue-600 to-violet-700 text-white shadow-lg shadow-blue-500/20 noise">
          <div className="relative z-10 space-y-3">
            <div className="text-2xl">📰</div>
            <h3 className="font-bold text-base leading-snug">
              Stay ahead of the curve
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              NewsHub curates the most important stories from trusted sources worldwide.
            </p>
            <button
              onClick={() => router.push("/search")}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
            >
              Explore all topics
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}

const Sidebar = memo(SidebarInner);
Sidebar.displayName = "Sidebar";
export default Sidebar;
