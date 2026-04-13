/**
 * Pure scoring engine for user preferences.
 * No React, no side-effects — safe to import anywhere.
 */

import {
  Category,
  CategoryScores,
  ArticleScores,
  InteractionEvent,
  UserPreferences,
} from "@/types";

// ── Scoring weights ───────────────────────────────────────────────────────────
export const SCORES = {
  category_click: 1,   // user clicked a category tab
  click:          1,   // user clicked an article card
  read:           2,   // user opened and read an article (article page visit)
} as const;

// ── Decay ─────────────────────────────────────────────────────────────────────
/** Scores older than this many days are halved on load */
const DECAY_DAYS = 7;

// ── localStorage key ──────────────────────────────────────────────────────────
export const PREFS_KEY = "newshub_preferences";

// ── Default state ─────────────────────────────────────────────────────────────
export function defaultPreferences(): UserPreferences {
  return {
    categoryScores: {},
    articleScores:  {},
    updatedAt:      new Date().toISOString(),
  };
}

// ── Apply a single interaction ────────────────────────────────────────────────
export function applyInteraction(
  prefs: UserPreferences,
  event: InteractionEvent
): UserPreferences {
  const delta = SCORES[event.type];
  const next  = structuredClone(prefs);

  if (event.category && event.category !== "all") {
    next.categoryScores[event.category] =
      (next.categoryScores[event.category] ?? 0) + delta;
  }

  if (event.articleId) {
    next.articleScores[event.articleId] =
      (next.articleScores[event.articleId] ?? 0) + delta;
  }

  next.updatedAt = new Date().toISOString();
  return next;
}

// ── Score an article against current preferences ──────────────────────────────
export function scoreArticle(
  articleId: string,
  category: Category,
  prefs: UserPreferences
): number {
  const catScore     = prefs.categoryScores[category] ?? 0;
  const articleScore = prefs.articleScores[articleId]  ?? 0;
  return catScore + articleScore;
}

// ── Rank articles by preference score ────────────────────────────────────────
export function rankArticles<T extends { id: string; category: Category }>(
  articles: T[],
  prefs: UserPreferences,
  excludeIds: Set<string> = new Set()
): T[] {
  return [...articles]
    .filter((a) => !excludeIds.has(a.id))
    .map((a) => ({ article: a, score: scoreArticle(a.id, a.category, prefs) }))
    .sort((a, b) => b.score - a.score)
    .map(({ article }) => article);
}

// ── Top interested categories (score > 0, sorted desc) ───────────────────────
export function topCategories(
  prefs: UserPreferences,
  limit = 3
): Category[] {
  return (Object.entries(prefs.categoryScores) as [Category, number][])
    .filter(([, score]) => score > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([cat]) => cat);
}

// ── localStorage helpers ──────────────────────────────────────────────────────
export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return defaultPreferences();

    const parsed = JSON.parse(raw) as UserPreferences;

    // Apply time-based decay
    const daysSince =
      (Date.now() - new Date(parsed.updatedAt).getTime()) / 86_400_000;

    if (daysSince > DECAY_DAYS) {
      const factor = 0.5;
      const decayed: CategoryScores = {};
      for (const [k, v] of Object.entries(parsed.categoryScores)) {
        const score = Math.round((v as number) * factor);
        if (score > 0) decayed[k as Category] = score;
      }
      parsed.categoryScores = decayed;
      // Article scores decay fully after DECAY_DAYS
      parsed.articleScores = {};
    }

    return parsed;
  } catch {
    return defaultPreferences();
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // Private browsing / storage full — silently ignore
  }
}

export function clearPreferences(): void {
  try {
    localStorage.removeItem(PREFS_KEY);
  } catch {}
}
