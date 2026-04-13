"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Article, Category } from "@/types";
import { getNews } from "@/services/api/newsService";
import NewsCard from "@/components/news/NewsCard";
import CategoryTabs from "@/components/news/CategoryTabs";
import { SkeletonGrid } from "@/components/ui/SkeletonCard";
import SearchBar from "@/components/ui/SearchBar";

interface Props {
  query: string;
}

const PAGE_SIZE = 12;

export default function SearchResults({ query: initialQuery }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<Category>("all");
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync query from URL
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
    setPage(1);
    setArticles([]);
  }, [searchParams]);

  const fetchResults = useCallback(
    async (pageNum: number, append = false) => {
      if (!query.trim()) {
        setArticles([]);
        setTotal(0);
        return;
      }

      try {
        pageNum === 1 ? setLoading(true) : setLoadingMore(true);
        setError(null);

        const res = await getNews({
          query,
          category,
          page: pageNum,
          pageSize: PAGE_SIZE,
        });

        setArticles((prev) => (append ? [...prev, ...res.articles] : res.articles));
        setTotal(res.total);
        setPage(pageNum);
      } catch {
        setError("Failed to load results. Please try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [query, category]
  );

  useEffect(() => {
    setPage(1);
    setArticles([]);
    fetchResults(1, false);
  }, [query, category, fetchResults]);

  function handleCommit(val: string) {
    router.push(val.trim() ? `/search?q=${encodeURIComponent(val.trim())}` : "/search");
  }

  function handleCategoryChange(cat: Category) {
    setCategory(cat);
  }

  const hasMore = articles.length < total;

  // ── Empty / no query state ────────────────────────────────────────────────
  if (!query.trim()) {
    return (
      <div className="space-y-8">
        <SearchHeader query="" onCommit={handleCommit} />
        <EmptyPrompt />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search bar (re-search inline) */}
      <SearchHeader query={query} onCommit={handleCommit} />

      {/* Category filter */}
      <CategoryTabs active={category} onChange={handleCategoryChange} />

      {/* Result count */}
      {!loading && (
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {total > 0 ? (
              <>
                {total} result{total !== 1 ? "s" : ""} for{" "}
                <span className="text-blue-600 dark:text-blue-400">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              <>No results for <span className="text-blue-600 dark:text-blue-400">&ldquo;{query}&rdquo;</span></>
            )}
          </h1>
          {total > 0 && (
            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full font-medium">
              Page {page}
            </span>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          {error}
          <button
            onClick={() => fetchResults(1)}
            className="ml-auto text-xs font-semibold underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <SkeletonGrid count={PAGE_SIZE} />
      ) : articles.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {articles.map((article) => (
              <NewsCard
                key={article.id}
                title={article.title}
                description={article.description}
                image={article.imageUrl}
                source={article.source}
                publishedAt={article.publishedAt}
                author={article.author}
                readTime={article.readTime}
                category={article.category}
                trending={article.trending}
                href={`/article/${article.id}`}
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <button
                onClick={() => fetchResults(page + 1, true)}
                disabled={loadingMore}
                className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Loading…
                  </span>
                ) : (
                  `Load more (${total - articles.length} remaining)`
                )}
              </button>
            </div>
          )}
        </div>
      ) : (
        !error && <NoResults query={query} />
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SearchHeader({
  query,
  onCommit,
}: {
  query: string;
  onCommit: (v: string) => void;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
        Search
      </p>
      <SearchBar defaultValue={query} onCommit={onCommit} placeholder="Search news…" />
    </div>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        No results for &ldquo;{query}&rdquo;
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        Try checking your spelling, using more general terms, or browsing by category.
      </p>
    </div>
  );
}

function EmptyPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="11" cy="11" r="8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        What are you looking for?
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Type a keyword above to search across all news stories.
      </p>
    </div>
  );
}
