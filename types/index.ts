export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  source: string;
  category: Category;
  imageUrl: string;
  url: string;
  readTime: number;
  trending?: boolean;
}

export type Category =
  | "all"
  | "technology"
  | "sports"
  | "business"
  | "health"
  | "science"
  | "entertainment";

export interface NewsResponse {
  articles: Article[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchParams {
  query?: string;
  category?: Category;
  page?: number;
  pageSize?: number;
}

// ── Blog ──────────────────────────────────────────────────────────────────────

export interface Author {
  slug:      string;
  name:      string;
  avatar:    string;
  bio:       string;
  role:      string;
  twitter?:  string;
  website?:  string;
  postCount: number;
  tags:      string[];
}

export interface BlogPost {
  slug:        string;
  title:       string;
  subtitle:    string;
  coverImage:  string;
  author:      Author;
  publishedAt: string;
  updatedAt?:  string;
  readTime:    number;
  tags:        string[];
  category:    BlogCategory;
  featured:    boolean;
  /** MDX-style content — paragraphs separated by \n\n, blockquotes start with > */
  content:     string;
  likes:       number;
}

export type BlogCategory =
  | "engineering"
  | "design"
  | "product"
  | "culture"
  | "opinion"
  | "tutorial";

export interface Comment {
  id:          string;
  postSlug:    string;
  author:      string;
  avatar:      string;
  body:        string;
  publishedAt: string;
  likes:       number;
  replies?:    Comment[];
}

// ── Personalisation ───────────────────────────────────────────────────────────

export type CategoryScores = Partial<Record<Category, number>>;
export type ArticleScores  = Record<string, number>;

export interface UserPreferences {
  categoryScores: CategoryScores;
  articleScores:  ArticleScores;
  updatedAt:      string;
}

export type InteractionType = "click" | "read" | "category_click";

export interface InteractionEvent {
  type:       InteractionType;
  articleId?: string;
  category?:  Category;
}
