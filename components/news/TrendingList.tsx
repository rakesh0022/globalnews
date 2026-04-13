"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { computeTrendingMetrics, formatViews } from "@/lib/trending-analytics";

interface Props {
  articles: Article[];
}

export default function TrendingList({ articles }: Props) {
  const metrics = useMemo(
    () => computeTrendingMetrics(articles, "today").slice(0, 5),
    [articles]
  );

  const maxScore = metrics[0]?.score ?? 100;

  return (
    <div className="divide-y divide-slate-50 dark:divide-slate-800/60">
      {metrics.map((m, i) => {
        const { article, rank, views, score, rankDelta, isHot, isNew } = m;

        const rankColor =
          i === 0 ? "text-amber-500" :
          i === 1 ? "text-slate-400" :
          i === 2 ? "text-amber-700" :
          "text-slate-300 dark:text-slate-700";

        const barColor =
          i === 0 ? "from-amber-400 to-orange-500" :
          i === 1 ? "from-slate-400 to-slate-500" :
          i === 2 ? "from-amber-600 to-amber-700" :
          "from-blue-500 to-violet-600";

        return (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group flex items-start gap-3 py-3 first:pt-0 last:pb-0 hover:opacity-90 transition-opacity"
          >
            {/* Rank + delta */}
            <div className="flex flex-col items-center gap-0.5 shrink-0 w-5 pt-0.5">
              <span className={`text-lg font-black leading-none tabular-nums ${rankColor}`}>
                {rank}
              </span>
              {rankDelta !== 0 && (
                <span className={`text-[9px] font-bold ${rankDelta > 0 ? "text-emerald-500" : "text-red-400"}`}>
                  {rankDelta > 0 ? "▲" : "▼"}
                </span>
              )}
            </div>

            {/* Thumbnail */}
            <div className="relative w-[68px] h-[68px] rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                sizes="68px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 space-y-1.5">
              {/* Badges */}
              <div className="flex items-center gap-1.5">
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
              <p className="text-[0.8rem] font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
              </p>

              {/* Progress bar */}
              <div className="flex items-center gap-1.5">
                <div className="flex-1 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-700`}
                    style={{ width: `${(score / maxScore) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-400 tabular-nums shrink-0 w-6 text-right">
                  {score}%
                </span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-0.5">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {formatViews(views)}
                </span>
                <span className="text-slate-200 dark:text-slate-700">·</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
