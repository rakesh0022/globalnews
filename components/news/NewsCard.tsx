"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import { Category } from "@/types";
import { usePreferences } from "@/hooks/usePreferences";

export interface NewsCardProps {
  title:       string;
  description: string;
  image:       string;
  source:      string;
  publishedAt: string;
  author?:     string;
  readTime?:   number;
  category?:   Category;
  trending?:   boolean;
  variant?:    "vertical" | "horizontal";
  imageSizes?: string;
  onClick?:    () => void;
  href?:       string;
  priority?:   boolean;
}

// Static wrapper classes — never recreated
const WRAPPER_BASE =
  "group flex overflow-hidden rounded-2xl cursor-pointer select-none " +
  "bg-white dark:bg-[#0d1526] " +
  "border border-slate-100 dark:border-slate-800/60 " +
  "shadow-sm " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 " +
  "max-sm:rounded-none max-sm:border-x-0";

const WRAPPER_V = `${WRAPPER_BASE} flex-col`;
const WRAPPER_H = `${WRAPPER_BASE} flex-col sm:flex-row`;

// Framer Motion spring for card lift
const CARD_HOVER = { y: -5, boxShadow: "0 20px 40px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06)" };
const CARD_TAP   = { scale: 0.98, y: -2 };
const CARD_TRANS = { type: "spring", stiffness: 300, damping: 22 } as const;

function NewsCardInner({
  title, description, image, source, publishedAt,
  author, readTime, category, trending = false,
  variant = "vertical", imageSizes, onClick, href, priority = false,
}: NewsCardProps) {
  const isH = variant === "horizontal";
  const wrapperClass = isH ? WRAPPER_H : WRAPPER_V;
  const sizes = imageSizes ?? (isH
    ? "(max-width: 640px) 100vw, 256px"
    : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw");

  const reduced = useReducedMotion();

  // Track article click for personalisation
  const { trackClick } = usePreferences();
  const handleClick = useCallback(() => {
    if (href && category) {
      const id = href.split("/article/")[1];
      if (id) trackClick(id, category);
    }
    onClick?.();
  }, [href, category, trackClick, onClick]);

  const imageBlock = (
    <div className={
      isH
        ? "relative shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 w-full sm:w-56 lg:w-64 h-52 sm:h-auto"
        : "relative shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-800 w-full aspect-[16/9]"
    }>
      <Image
        src={image}
        alt={title}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        loading={priority ? "eager" : "lazy"}
        priority={priority}
        decoding="async"
      />

      {/* Hover colour wash */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-violet-600/0 group-hover:from-blue-600/10 group-hover:to-violet-600/10 transition-all duration-500" />

      {trending && (
        <div className="absolute top-3 left-3 z-10">
          <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Trending
          </span>
        </div>
      )}
    </div>
  );

  const bodyBlock = (
    <div className={isH ? "flex flex-col flex-1 gap-2.5 justify-between p-5" : "flex flex-col flex-1 gap-2.5 p-4"}>
      {category && <CategoryBadge category={category} />}

      <h2 className={`font-bold leading-snug text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2 ${isH ? "text-[1.05rem]" : "text-[0.95rem] sm:text-[0.9rem]"}`}>
        {title}
      </h2>

      <p className="text-[0.85rem] sm:text-[0.8rem] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
        {description}
      </p>

      <div className={`flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 ${isH ? "pt-3 mt-auto border-t border-slate-100 dark:border-slate-800" : "pt-2 border-t border-slate-50 dark:border-slate-800/50"}`}>
        <div className="flex items-center gap-1.5 min-w-0">
          {author ? (
            <>
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                {author.charAt(0).toUpperCase()}
              </div>
              <span className="truncate max-w-[90px] font-medium text-slate-600 dark:text-slate-300">{author}</span>
            </>
          ) : (
            <span className="font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[110px]">{source}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span>{formatDate(publishedAt)}</span>
          {readTime != null && (
            <>
              <span className="text-slate-200 dark:text-slate-700">·</span>
              <span>{readTime} min</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // Motion props — disabled when user prefers reduced motion
  const motionProps = reduced ? {} : {
    whileHover: CARD_HOVER,
    whileTap:   CARD_TAP,
    transition: CARD_TRANS,
  };

  if (href) {
    return (
      <motion.a href={href} className={wrapperClass} onClick={handleClick} {...motionProps}>
        {imageBlock}{bodyBlock}
      </motion.a>
    );
  }
  return (
    <motion.div
      role="article"
      tabIndex={onClick ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && handleClick() : undefined}
      className={wrapperClass}
      {...motionProps}
    >
      {imageBlock}{bodyBlock}
    </motion.div>
  );
}

const NewsCard = memo(NewsCardInner);
NewsCard.displayName = "NewsCard";
export default NewsCard;
