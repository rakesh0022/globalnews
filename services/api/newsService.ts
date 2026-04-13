/**
 * Client-facing news service.
 *
 * All functions call our own Next.js Route Handlers (/api/news/*).
 * The Route Handlers proxy NewsAPI server-side (keeping the key secret)
 * and fall back to mock data automatically when no key is configured.
 *
 * This file is safe to import from client components.
 */

import { Article, Category, NewsResponse, SearchParams } from "@/types";
import {
  getArticleById as getMockArticle,
  getRelatedArticles as getMockRelated,
  getTrendingNews as getMockTrending,
} from "./mockService";

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildUrl(params: Record<string, string | number | undefined>): string {
  const url = new URL("/api/news", getBaseUrl());
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  });
  return url.toString();
}

function getBaseUrl(): string {
  // In the browser window.location is available; on the server we use the
  // NEXT_PUBLIC_BASE_URL env var (or fall back to localhost for dev).
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Fetch a paginated list of articles, optionally filtered by category / query.
 * Calls GET /api/news
 */
export async function getNews(
  params: SearchParams = {},
  signal?: AbortSignal
): Promise<NewsResponse> {
  const url = buildUrl({
    category: params.category,
    q:        params.query,
    page:     params.page,
    pageSize: params.pageSize,
  });

  const res = await fetch(url, {
    signal,
    // Don't cache in the browser — the Route Handler handles server-side caching
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ServiceError(
      res.status,
      (body as { error?: string }).error ?? `Request failed (${res.status})`
    );
  }

  return res.json() as Promise<NewsResponse>;
}

/**
 * Fetch top trending articles.
 * Uses mock data — NewsAPI free tier doesn't have a "trending" endpoint.
 */
export async function getTrendingNews(): Promise<Article[]> {
  return getMockTrending();
}

/**
 * Fetch a single article by ID.
 * Calls GET /api/news/:id (resolves from mock store).
 */
export async function getArticleById(id: string): Promise<Article | null> {
  // For NewsAPI-sourced articles the ID is a base64 slug — fall back to mock
  if (!id.startsWith("newsapi-")) {
    return getMockArticle(id);
  }

  try {
    const res = await fetch(`/api/news/${encodeURIComponent(id)}`, {
      cache: "force-cache",
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`${res.status}`);
    return res.json() as Promise<Article>;
  } catch {
    return getMockArticle(id);
  }
}

/**
 * Fetch articles related to a given article (same category, different ID).
 * Uses mock data — NewsAPI free tier doesn't support this.
 */
export async function getRelatedArticles(
  article: Article,
  limit = 3
): Promise<Article[]> {
  return getMockRelated(article, limit);
}

// ── Error class ───────────────────────────────────────────────────────────────

export class ServiceError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ServiceError";
  }

  get isNotFound()     { return this.status === 404; }
  get isRateLimited()  { return this.status === 429; }
  get isServerError()  { return this.status >= 500; }
}
