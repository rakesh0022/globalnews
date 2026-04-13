"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Article } from "@/types";
import { getNews } from "@/services/api/newsService";

export type SearchStatus = "idle" | "loading" | "success" | "error";

interface UseSearchResult {
  query: string;
  setQuery: (q: string) => void;
  results: Article[];
  status: SearchStatus;
  total: number;
  clear: () => void;
}

const DEBOUNCE_MS = 350;
const PREVIEW_SIZE = 5; // articles shown in the dropdown

export function useSearch(): UseSearchResult {
  const [query, setQueryRaw] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState<SearchStatus>("idle");

  // Abort controller ref — cancels in-flight requests when query changes
  const abortRef = useRef<AbortController | null>(null);

  // Debounce: update debouncedQuery 350ms after the user stops typing
  useEffect(() => {
    if (!query.trim()) {
      setDebouncedQuery("");
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch when debouncedQuery changes
  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setTotal(0);
      setStatus("idle");
      return;
    }

    // Cancel any previous in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setStatus("loading");

    getNews({ query: debouncedQuery, pageSize: PREVIEW_SIZE })
      .then((res) => {
        setResults(res.articles);
        setTotal(res.total);
        setStatus("success");
      })
      .catch((err) => {
        // Ignore aborted requests
        if (err?.name !== "AbortError") {
          setStatus("error");
        }
      });

    return () => abortRef.current?.abort();
  }, [debouncedQuery]);

  const setQuery = useCallback((q: string) => {
    setQueryRaw(q);
    if (!q.trim()) {
      setResults([]);
      setTotal(0);
      setStatus("idle");
    }
  }, []);

  const clear = useCallback(() => {
    setQueryRaw("");
    setDebouncedQuery("");
    setResults([]);
    setTotal(0);
    setStatus("idle");
    abortRef.current?.abort();
  }, []);

  return { query, setQuery, results, status, total, clear };
}
