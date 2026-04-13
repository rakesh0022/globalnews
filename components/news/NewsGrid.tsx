"use client";

import { memo } from "react";
import { Article } from "@/types";
import NewsCard, { NewsCardProps } from "./NewsCard";
import NewsCardWide from "./NewsCardWide";
import { SkeletonGrid, SkeletonCardWide } from "@/components/ui/SkeletonCard";
import RippleButton from "@/components/ui/RippleButton";

// Stable mapper — defined outside component so it's never recreated
function articleToCardProps(article: Article): NewsCardProps & { href: string } {
  return {
    title:       article.title,
    description: article.description,
    image:       article.imageUrl,
    source:      article.source,
    publishedAt: article.publishedAt,
    author:      article.author,
    readTime:    article.readTime,
    category:    article.category,
    trending:    article.trending,
    href:        `/article/${article.id}`,
  };
}

interface Props {
  articles:      Article[];
  loading:       boolean;
  loadingMore?:  boolean;
  hasMore?:      boolean;
  error?:        string | null;
  onLoadMore?:   () => void;
  onRetry?:      () => void;
  emptyMessage?: string;
}

function NewsGridInner({
  articles,
  loading,
  loadingMore  = false,
  hasMore      = false,
  error        = null,
  onLoadMore,
  onRetry,
  emptyMessage = "No articles found.",
}: Props) {

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <SkeletonCardWide />
          {[0, 1].map((i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 animate-pulse">
              <div className="w-full aspect-[16/9] bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <SkeletonGrid count={4} />
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
          <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">{error}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">The app will use cached data if available.</p>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors">
            Try again
          </button>
        )}
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────────────────────
  if (!articles.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="font-semibold text-gray-700 dark:text-gray-300">{emptyMessage}</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search or category.</p>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  const [featured, ...rest] = articles;

  return (
    <div className="space-y-0 sm:space-y-5">
      {featured && (
        /* Mobile: no gap between cards (full-width flush), desktop: grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-5">
          {/* Featured card — priority:true because it's likely in the viewport */}
          <NewsCardWide article={featured} priority />
          {rest.slice(0, 2).map((a) => (
            <NewsCard key={a.id} {...articleToCardProps(a)} />
          ))}
        </div>
      )}

      {rest.length > 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 sm:gap-5">
          {rest.slice(2).map((a) => (
            <NewsCard key={a.id} {...articleToCardProps(a)} />
          ))}
        </div>
      )}

      {(hasMore || loadingMore) && (
        <div className="flex justify-center pt-4 px-4 sm:px-0">
          <RippleButton
            onClick={onLoadMore}
            disabled={loadingMore}
            variant="primary"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl sm:rounded-full min-h-[48px] text-sm font-semibold"
          >
            {loadingMore ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Loading…
              </>
            ) : "Load more stories"}
          </RippleButton>
        </div>
      )}
    </div>
  );
}

const NewsGrid = memo(NewsGridInner);
NewsGrid.displayName = "NewsGrid";
export default NewsGrid;
