"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Article } from "@/types";

interface Props {
  articles: Article[];
}

export default function BreakingTicker({ articles }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate items so the loop is seamless
  const items = [...articles, ...articles];

  return (
    <div className="w-full bg-red-600 dark:bg-red-700 overflow-hidden">
      <div className="max-w-[1440px] mx-auto flex items-stretch">
        {/* Label */}
        <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-red-700 dark:bg-red-800 z-10">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-white text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
            Breaking
          </span>
        </div>

        {/* Scrolling track */}
        <div className="flex-1 overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-red-600 dark:from-red-700 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-red-600 dark:from-red-700 to-transparent z-10 pointer-events-none" />

          <div
            ref={trackRef}
            className="flex items-center gap-0 py-2.5 animate-ticker whitespace-nowrap"
            style={{ willChange: "transform" }}
          >
            {items.map((article, i) => (
              <span key={`${article.id}-${i}`} className="inline-flex items-center">
                <Link
                  href={`/article/${article.id}`}
                  className="text-white/90 hover:text-white text-xs font-medium transition-colors px-4 hover:underline underline-offset-2"
                >
                  {article.title}
                </Link>
                <span className="text-red-400 dark:text-red-500 text-xs px-1 select-none">◆</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
