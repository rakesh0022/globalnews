/**
 * Low-level NewsAPI.org HTTP client.
 *
 * - Runs SERVER-SIDE ONLY (inside Route Handlers / Server Components).
 * - Never import this file from client components — the API key would leak.
 * - Uses Next.js fetch() with `next: { revalidate }` for ISR-style caching.
 */

import { Article, Category, NewsResponse } from "@/types";

const BASE_URL =
  process.env.NEWS_API_BASE_URL ?? "https://newsapi.org/v2";

const API_KEY = process.env.NEWS_API_KEY ?? "";

// ── Category → NewsAPI topic mapping ─────────────────────────────────────────

const CATEGORY_MAP: Record<Exclude<Category, "all">, string> = {
  technology:    "technology",
  sports:        "sports",
  business:      "business",
  health:        "health",
  science:       "science",
  entertainment: "entertainment",
};

// ── NewsAPI response shapes ───────────────────────────────────────────────────

interface NewsAPIArticle {
  source:      { id: string | null; name: string };
  author:      string | null;
  title:       string;
  description: string | null;
  url:         string;
  urlToImage:  string | null;
  publishedAt: string;
  content:     string | null;
}

interface NewsAPIResponse {
  status:       "ok" | "error";
  totalResults: number;
  articles:     NewsAPIArticle[];
  code?:        string;
  message?:     string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Estimate read time from content length (avg 200 wpm). */
function estimateReadTime(content: string | null): number {
  if (!content) return 2;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Derive a category from the NewsAPI category string. */
function toCategory(raw: string | undefined): Category {
  const map: Record<string, Category> = {
    technology:    "technology",
    sports:        "sports",
    business:      "business",
    health:        "health",
    science:       "science",
    entertainment: "entertainment",
  };
  return map[raw ?? ""] ?? "technology";
}

/** Map a raw NewsAPI article to our internal Article shape. */
function mapArticle(
  raw: NewsAPIArticle,
  category: Category,
  index: number
): Article {
  // NewsAPI truncates content with "[+N chars]" — strip that suffix
  const content =
    raw.content?.replace(/\s*\[.*?\]\s*$/, "").trim() ??
    raw.description ??
    "";

  return {
    id:          `newsapi-${Buffer.from(raw.url).toString("base64url").slice(0, 16)}-${index}`,
    title:       raw.title ?? "Untitled",
    description: raw.description ?? "",
    content,
    author:      raw.author ?? raw.source.name,
    publishedAt: raw.publishedAt,
    source:      raw.source.name,
    category,
    imageUrl:    raw.urlToImage ?? `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80`,
    url:         raw.url,
    readTime:    estimateReadTime(content),
    trending:    index < 3, // top 3 results are marked trending
  };
}

/** Core fetch wrapper with error handling and Next.js cache control. */
async function newsApiFetch<T>(
  endpoint: string,
  params: Record<string, string>,
  revalidate = 300 // 5 minutes
): Promise<T> {
  if (!API_KEY || API_KEY === "your_newsapi_key_here") {
    throw new NewsAPIError("NO_API_KEY", "NEWS_API_KEY is not configured.");
  }

  const url = new URL(`${BASE_URL}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  url.searchParams.set("apiKey", API_KEY);

  const res = await fetch(url.toString(), {
    next: { revalidate },
    headers: { "User-Agent": "NewsHub/1.0" },
  });

  if (!res.ok) {
    throw new NewsAPIError("HTTP_ERROR", `NewsAPI responded with ${res.status}`);
  }

  const data = (await res.json()) as NewsAPIResponse & T;

  if ((data as unknown as NewsAPIResponse).status === "error") {
    const err = data as unknown as NewsAPIResponse;
    throw new NewsAPIError(err.code ?? "API_ERROR", err.message ?? "Unknown error");
  }

  return data;
}

// ── Public API ────────────────────────────────────────────────────────────────

export interface FetchHeadlinesParams {
  category?: Category;
  page?:     number;
  pageSize?: number;
  country?:  string;
}

/** Fetch top headlines — maps to /v2/top-headlines */
export async function fetchHeadlines(
  params: FetchHeadlinesParams = {}
): Promise<NewsResponse> {
  const {
    category = "all",
    page     = 1,
    pageSize = 10,
    country  = "us",
  } = params;

  const query: Record<string, string> = {
    country,
    page:     String(page),
    pageSize: String(Math.min(pageSize, 100)),
  };

  if (category !== "all") {
    query.category = CATEGORY_MAP[category];
  }

  const data = await newsApiFetch<NewsAPIResponse>("top-headlines", query);
  const resolvedCategory = category === "all" ? "technology" : category;

  return {
    articles: data.articles
      .filter((a) => a.title && a.title !== "[Removed]")
      .map((a, i) => mapArticle(a, resolvedCategory, i)),
    total:    data.totalResults,
    page,
    pageSize,
  };
}

export interface FetchEverythingParams {
  query?:    string;
  category?: Category;
  page?:     number;
  pageSize?: number;
  sortBy?:   "relevancy" | "popularity" | "publishedAt";
}

/** Search all articles — maps to /v2/everything */
export async function fetchEverything(
  params: FetchEverythingParams = {}
): Promise<NewsResponse> {
  const {
    query    = "",
    category = "all",
    page     = 1,
    pageSize = 10,
    sortBy   = "publishedAt",
  } = params;

  // Build a search term: explicit query OR category keyword
  const q = query.trim() || (category !== "all" ? CATEGORY_MAP[category] : "world news");

  const data = await newsApiFetch<NewsAPIResponse>("everything", {
    q,
    sortBy,
    page:     String(page),
    pageSize: String(Math.min(pageSize, 100)),
    language: "en",
  });

  const resolvedCategory: Category =
    category !== "all" ? category : toCategory(undefined);

  return {
    articles: data.articles
      .filter((a) => a.title && a.title !== "[Removed]" && a.urlToImage)
      .map((a, i) => mapArticle(a, resolvedCategory, i)),
    total:    data.totalResults,
    page,
    pageSize,
  };
}

// ── Custom error class ────────────────────────────────────────────────────────

export class NewsAPIError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(message);
    this.name = "NewsAPIError";
  }

  get isNoApiKey() {
    return this.code === "NO_API_KEY";
  }

  get isRateLimited() {
    return this.code === "rateLimited" || this.code === "429";
  }
}
