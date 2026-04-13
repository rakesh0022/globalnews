import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface Props {
  articles: Article[];
}

function FeedItem({ article, index }: { article: Article; index: number }) {
  // First item gets a larger treatment
  if (index === 0) {
    return (
      <Link
        href={`/article/${article.id}`}
        className="group flex flex-col sm:flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm card-lift"
      >
        <div className="relative w-full sm:w-48 h-40 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width:640px) 100vw, 192px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-2 py-1">
          <CategoryBadge category={article.category} />
          <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
            {article.description}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="font-medium">{article.author}</span>
            <span>·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>·</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </Link>
    );
  }

  // Compact row items
  return (
    <Link
      href={`/article/${article.id}`}
      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800/60"
    >
      {/* Number */}
      <span className="text-2xl font-black text-slate-100 dark:text-slate-800 w-6 shrink-0 leading-none mt-0.5 select-none tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Thumbnail */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          sizes="64px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 space-y-1">
        <CategoryBadge category={article.category} />
        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </p>
        <p className="text-[11px] text-slate-400">
          {article.source} · {formatDate(article.publishedAt)}
        </p>
      </div>
    </Link>
  );
}

export default function LatestFeed({ articles }: Props) {
  if (!articles.length) return null;

  return (
    <div className="space-y-2">
      {articles.map((article, i) => (
        <FeedItem key={article.id} article={article} index={i} />
      ))}
    </div>
  );
}
