/**
 * Mock data service — used as a fallback when NEWS_API_KEY is not set,
 * and for article-by-id / related-articles lookups (NewsAPI free tier
 * doesn't support those endpoints).
 */

import { Article, Category, NewsResponse, SearchParams } from "@/types";
import { mockArticles } from "@/lib/mock-data";

const DEFAULT_PAGE_SIZE = 10;

function filterArticles(articles: Article[], params: SearchParams): Article[] {
  let result = [...articles];

  if (params.category && params.category !== "all") {
    result = result.filter((a) => a.category === params.category);
  }

  if (params.query?.trim()) {
    const q = params.query.toLowerCase();
    result = result.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q) ||
        a.source.toLowerCase().includes(q)
    );
  }

  return result;
}

export async function getNews(params: SearchParams = {}): Promise<NewsResponse> {
  const page     = params.page     ?? 1;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const filtered = filterArticles(mockArticles, params);
  const start    = (page - 1) * pageSize;

  return {
    articles: filtered.slice(start, start + pageSize),
    total:    filtered.length,
    page,
    pageSize,
  };
}

export async function getTrendingNews(): Promise<Article[]> {
  return mockArticles.filter((a) => a.trending).slice(0, 5);
}

export async function getArticleById(id: string): Promise<Article | null> {
  return mockArticles.find((a) => a.id === id) ?? null;
}

export async function getRelatedArticles(
  article: Article,
  limit = 3
): Promise<Article[]> {
  return mockArticles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, limit);
}
