/**
 * Trending analytics engine.
 *
 * Derives deterministic-but-realistic view counts, trend scores,
 * velocity, and rank deltas from article metadata.
 * No real backend needed — all computed from publishedAt + readTime + trending flag.
 */

import { Article } from "@/types";

export type TimeFilter = "today" | "week";

export interface TrendingMetrics {
  article:      Article;
  rank:         number;
  views:        number;        // estimated view count
  score:        number;        // 0–100 trend strength
  velocity:     number;        // views per hour (rounded)
  rankDelta:    number;        // +N moved up, -N moved down, 0 stable
  isHot:        boolean;       // score >= 80
  isNew:        boolean;       // published within last 6 hours
  peakHour:     string;        // e.g. "2h ago"
}

// ── Deterministic pseudo-random from a string seed ────────────────────────────
function seededRandom(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h ^= h << 13; h ^= h >> 17; h ^= h << 5;
    return ((h >>> 0) / 0xffffffff);
  };
}

// ── Core scoring ──────────────────────────────────────────────────────────────
function computeScore(article: Article, filter: TimeFilter): number {
  const rng       = seededRandom(article.id + filter);
  const base      = rng() * 60 + 20;                    // 20–80 base
  const trending  = article.trending ? 18 : 0;
  const recency   = computeRecencyBoost(article.publishedAt, filter);
  return Math.min(100, Math.round(base + trending + recency));
}

function computeRecencyBoost(publishedAt: string, filter: TimeFilter): number {
  const ageHours = (Date.now() - new Date(publishedAt).getTime()) / 3_600_000;
  if (filter === "today") return ageHours < 6 ? 12 : ageHours < 12 ? 6 : 0;
  return ageHours < 24 ? 8 : ageHours < 48 ? 4 : 0;
}

function computeViews(article: Article, score: number, filter: TimeFilter): number {
  const rng  = seededRandom(article.id + "views" + filter);
  const base = filter === "today"
    ? Math.round(score * 180 + rng() * 8_000 + 2_000)
    : Math.round(score * 1_200 + rng() * 60_000 + 15_000);
  return base;
}

function computeVelocity(views: number, filter: TimeFilter): number {
  const hours = filter === "today" ? 12 : 168;
  return Math.round(views / hours);
}

function computeRankDelta(article: Article, rank: number): number {
  const rng = seededRandom(article.id + "delta");
  const r   = rng();
  if (r < 0.25) return Math.ceil(rng() * 3);   // moved up 1–3
  if (r < 0.45) return -Math.ceil(rng() * 2);  // moved down 1–2
  return 0;                                      // stable
}

function computePeakHour(article: Article): string {
  const rng   = seededRandom(article.id + "peak");
  const hours = Math.round(rng() * 10 + 1);
  return `${hours}h ago`;
}

// ── Public API ────────────────────────────────────────────────────────────────

export function computeTrendingMetrics(
  articles: Article[],
  filter: TimeFilter
): TrendingMetrics[] {
  const ageHoursNow = (id: string) =>
    (Date.now() - new Date(articles.find((a) => a.id === id)?.publishedAt ?? 0).getTime()) / 3_600_000;

  return articles
    .map((article) => {
      const score    = computeScore(article, filter);
      const views    = computeViews(article, score, filter);
      const velocity = computeVelocity(views, filter);
      return { article, score, views, velocity };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ article, score, views, velocity }, i) => ({
      article,
      rank:       i + 1,
      views,
      score,
      velocity,
      rankDelta:  computeRankDelta(article, i + 1),
      isHot:      score >= 78,
      isNew:      ageHoursNow(article.id) < 6,
      peakHour:   computePeakHour(article),
    }));
}

export function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
