"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Article, Category, NewsResponse } from "@/types";
import { getNews, getTrendingNews, ServiceError } from "@/services/api/newsService";

// ── Types ─────────────────────────────────────────────────────────────────────

export type FetchStatus = "idle" | "loading" | "success" | "error";

interface UseNewsOptions {
  category?: Category;
  query?:    string;
  pageSize?: number;
  /** Skip fetching entirely (useful for conditional rendering) */
  enabled?:  boolean;
}

interface UseNewsReturn {
  articles:    Article[];
  total:       number;
  page:        number;
  status:      FetchStatus;
  loading:     boolean;   // true only on first page load
  loadingMore: boolean;   // true when appending next page
  error:       string | null;
  hasMore:     boolean;
  loadMore:    () => void;
  retry:       () => void;
  dataSource:  "live" | "mock" | null;
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useNews({
  category = "all",
  query    = "",
  pageSize = 10,
  enabled  = true,
}: UseNewsOptions = {}): UseNewsReturn {
  const [articles, setArticles]       = useState<Article[]>([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [status, setStatus]           = useState<FetchStatus>("idle");
  const [error, setError]             = useState<string | null>(null);
  const [dataSource, setDataSource]   = useState<"live" | "mock" | null>(null);

  // Abort controller — cancelled when params change or component unmounts
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async (pageNum: number, append = false) => {
      if (!enabled) return;

      // Cancel any in-flight request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      setStatus("loading");
      setError(null);

      try {
        const res: NewsResponse & { headers?: Headers } = await getNews(
          { category, query, page: pageNum, pageSize },
          abortRef.current.signal
        );

        setArticles((prev) => (append ? [...prev, ...res.articles] : res.articles));
        setTotal(res.total);
        setPage(pageNum);
        setStatus("success");
      } catch (err) {
        if ((err as Error).name === "AbortError") return;

        const msg =
          err instanceof ServiceError
            ? err.isRateLimited
              ? "Rate limit reached. Showing cached results."
              : err.isServerError
              ? "Server error. Please try again shortly."
              : err.message
            : "Failed to load news. Check your connection.";

        setError(msg);
        setStatus("error");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, query, pageSize, enabled]
  );

  // Reset and refetch when params change
  useEffect(() => {
    setPage(1);
    setArticles([]);
    setTotal(0);
    fetchPage(1, false);

    return () => abortRef.current?.abort();
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (status !== "loading" && articles.length < total) {
      fetchPage(page + 1, true);
    }
  }, [status, articles.length, total, page, fetchPage]);

  const retry = useCallback(() => {
    fetchPage(page === 1 ? 1 : page, page > 1);
  }, [page, fetchPage]);

  return {
    articles,
    total,
    page,
    status,
    loading:     status === "loading" && page === 1,
    loadingMore: status === "loading" && page > 1,
    error,
    hasMore:     articles.length < total,
    loadMore,
    retry,
    dataSource,
  };
}

// ── Trending hook ─────────────────────────────────────────────────────────────

interface UseTrendingReturn {
  articles: Article[];
  loading:  boolean;
  error:    string | null;
}

export function useTrending(): UseTrendingReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getTrendingNews()
      .then((data) => { if (!cancelled) setArticles(data); })
      .catch(() => { if (!cancelled) setError("Could not load trending news."); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { articles, loading, error };
}
