"use client";

import { memo } from "react";
import { Article } from "@/types";
import NewsCard from "./NewsCard";

interface Props {
  article:   Article;
  priority?: boolean;
}

/** Wide (horizontal) variant — wraps the base NewsCard with article data */
function NewsCardWideInner({ article, priority = false }: Props) {
  return (
    <NewsCard
      title={article.title}
      description={article.description}
      image={article.imageUrl}
      source={article.source}
      publishedAt={article.publishedAt}
      author={article.author}
      readTime={article.readTime}
      category={article.category}
      trending={article.trending}
      variant="horizontal"
      href={`/article/${article.id}`}
      imageSizes="(max-width: 640px) 100vw, 256px"
      priority={priority}
    />
  );
}

const NewsCardWide = memo(NewsCardWideInner);
NewsCardWide.displayName = "NewsCardWide";
export default NewsCardWide;
