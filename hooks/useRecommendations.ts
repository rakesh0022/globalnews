"use client";

import { useMemo } from "react";
import { Article, Category, UserPreferences } from "@/types";
import { rankArticles, topCategories, scoreArticle } from "@/lib/preferences";

interface UseRecommendationsOptions {
  /** All available articles to rank */
  articles:    Article[];
  /** Current user preferences */
  prefs:       UserPreferences;
  /** Article IDs already shown in the main feed (exclude from recs) */
  excludeIds?: string[];
  /** Max number of recommendations to return */
  limit?:      number;
  /** Minimum total score an article must have to appear */
  minScore?:   number;
}

interface UseRecommendationsResult {
  /** Ranked articles to show */
  recommendations: Article[];
  /** Top interested categories for the "Based on your interest in X" label */
  topCats:         Category[];
  /** True when there are enough preferences to show personalised results */
  isPersonalised:  boolean;
}

export function useRecommendations({
  articles,
  prefs,
  excludeIds = [],
  limit      = 10,
  minScore   = 1,
}: UseRecommendationsOptions): UseRecommendationsResult {
  const excludeSet = useMemo(() => new Set(excludeIds), [excludeIds]);

  const topCats = useMemo(
    () => topCategories(prefs, 3),
    [prefs]
  );

  const isPersonalised = topCats.length > 0;

  const recommendations = useMemo(() => {
    if (!isPersonalised) return [];

    return rankArticles(articles, prefs, excludeSet)
      .filter((a) => scoreArticle(a.id, a.category, prefs) >= minScore)
      .slice(0, limit);
  }, [articles, prefs, excludeSet, isPersonalised, minScore, limit]);

  return { recommendations, topCats, isPersonalised };
}
