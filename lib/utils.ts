import { Category } from "@/types";

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

export const CATEGORIES: { label: string; value: Category }[] = [
  { label: "All", value: "all" },
  { label: "Technology", value: "technology" },
  { label: "Sports", value: "sports" },
  { label: "Business", value: "business" },
  { label: "Health", value: "health" },
  { label: "Science", value: "science" },
  { label: "Entertainment", value: "entertainment" },
];

export const CATEGORY_COLORS: Record<Category, string> = {
  all: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  technology: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  sports: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  business: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  health: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  science: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  entertainment: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
};
