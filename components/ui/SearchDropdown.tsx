"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";
import { SearchStatus } from "@/hooks/useSearch";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface Props {
  query: string;
  results: Article[];
  status: SearchStatus;
  total: number;
  onClose: () => void;
  onViewAll: () => void;
}

// ── Skeleton row ──────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
      <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-1/2" />
      </div>
    </div>
  );
}

// ── Result row ────────────────────────────────────────────────────────────────
function ResultRow({
  article,
  query,
  onClose,
}: {
  article: Article;
  query: string;
  onClose: () => void;
}) {
  // Highlight matching text
  function highlight(text: string) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 rounded px-0.5 not-italic">
          {part}
        </mark>
      ) : (
        part
      )
    );
  }

  return (
    <Link
      href={`/article/${article.id}`}
      onClick={onClose}
      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors group"
    >
      {/* Thumbnail */}
      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-gray-100 dark:bg-gray-800">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          sizes="56px"
          className="object-cover"
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 space-y-0.5">
        <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {highlight(article.title)}
        </p>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <CategoryBadge category={article.category} />
          <span>·</span>
          <span>{article.source}</span>
          <span>·</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>

      {/* Arrow */}
      <svg
        className="w-4 h-4 text-gray-300 dark:text-gray-600 shrink-0 mt-1 group-hover:text-blue-500 transition-colors"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

// ── Main dropdown ─────────────────────────────────────────────────────────────
export default function SearchDropdown({
  query,
  results,
  status,
  total,
  onClose,
  onViewAll,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label="Search results"
      className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50"
    >
      {/* Loading */}
      {status === "loading" && (
        <div>
          {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {/* Results */}
      {status === "success" && results.length > 0 && (
        <>
          <div className="px-4 pt-3 pb-1 flex items-center justify-between">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {total} result{total !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
          </div>

          <div className="divide-y divide-gray-50 dark:divide-gray-800/60">
            {results.map((article) => (
              <ResultRow
                key={article.id}
                article={article}
                query={query}
                onClose={onClose}
              />
            ))}
          </div>

          {/* View all footer */}
          {total > results.length && (
            <div className="border-t border-gray-100 dark:border-gray-800 p-3">
              <button
                onClick={onViewAll}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                View all {total} results for &ldquo;{query}&rdquo;
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}

      {/* No results */}
      {status === "success" && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            No results for &ldquo;{query}&rdquo;
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Try different keywords or browse by category.
          </p>
        </div>
      )}

      {/* Error */}
      {status === "error" && (
        <div className="flex items-center gap-2 px-4 py-4 text-sm text-red-500 dark:text-red-400">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          Something went wrong. Please try again.
        </div>
      )}
    </div>
  );
}
