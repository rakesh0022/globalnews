"use client";

import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface Props {
  article: Article;
}

export default function HeroCard({ article }: Props) {
  return (
    <Link
      href={`/article/${article.id}`}
      className="group relative flex flex-col justify-end rounded-2xl overflow-hidden min-h-[420px] shadow-md hover:shadow-xl transition-all duration-300"
    >
      <Image
        src={article.imageUrl}
        alt={article.title}
        fill
        sizes="(max-width: 1024px) 100vw, 60vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        priority
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <CategoryBadge category={article.category} />
          {article.trending && (
            <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Trending
            </span>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight group-hover:text-blue-300 transition-colors">
          {article.title}
        </h1>
        <p className="text-sm text-gray-300 line-clamp-2 max-w-2xl">
          {article.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="font-medium text-gray-300">{article.source}</span>
          <span>·</span>
          <span>{article.author}</span>
          <span>·</span>
          <span>{formatDate(article.publishedAt)}</span>
          <span>·</span>
          <span>{article.readTime}m read</span>
        </div>
      </div>
    </Link>
  );
}
