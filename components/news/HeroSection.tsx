"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface Props {
  articles: Article[];
}

// ── Carousel dot ──────────────────────────────────────────────────────────────
function Dot({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Go to slide"
      className={`rounded-full transition-all duration-300 ${
        active
          ? "w-6 h-2 bg-white"
          : "w-2 h-2 bg-white/40 hover:bg-white/70"
      }`}
    />
  );
}

// ── Main hero card (carousel) ─────────────────────────────────────────────────
function MainHero({ articles }: { articles: Article[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(
    () => setActive((i) => (i + 1) % articles.length),
    [articles.length]
  );

  // Auto-advance every 6 s
  useEffect(() => {
    if (paused || articles.length < 2) return;
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [paused, next, articles.length]);

  const article = articles[active];
  if (!article) return null;

  return (
    <div
      className="relative lg:col-span-7 rounded-3xl overflow-hidden min-h-[420px] lg:min-h-[540px] flex flex-col justify-end shadow-2xl shadow-black/20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Images — crossfade */}
      {articles.map((a, i) => (
        <div
          key={a.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={a.imageUrl}
            alt={a.title}
            fill
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
            priority={i === 0}
            loading={i === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}

      {/* Multi-layer gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-10 space-y-4">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <CategoryBadge category={article.category} gradient size="md" />
          {article.trending && (
            <span className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Live
            </span>
          )}
        </div>

        {/* Headline */}
        <Link href={`/article/${article.id}`} className="group block">
          <h1 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-extrabold text-white leading-[1.15] tracking-tight text-balance group-hover:text-blue-300 transition-colors duration-200 max-w-2xl">
            {article.title}
          </h1>
        </Link>

        {/* Description */}
        <p className="text-sm text-white/70 line-clamp-2 max-w-xl hidden sm:block leading-relaxed">
          {article.description}
        </p>

        {/* Meta + controls row */}
        <div className="flex items-end justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
              {article.author.charAt(0)}
            </div>
            <span className="font-medium text-white/80">{article.author}</span>
            <span className="text-white/30">·</span>
            <span>{article.source}</span>
            <span className="text-white/30">·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span className="text-white/30">·</span>
            <span>{article.readTime} min</span>
          </div>

          {/* Carousel dots */}
          {articles.length > 1 && (
            <div className="flex items-center gap-1.5 shrink-0">
              {articles.map((_, i) => (
                <Dot key={i} active={i === active} onClick={() => setActive(i)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prev / Next arrows */}
      {articles.length > 1 && (
        <>
          <button
            onClick={() => setActive((i) => (i - 1 + articles.length) % articles.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

// ── Secondary card ────────────────────────────────────────────────────────────
function SecondaryCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.id}`}
      className="group relative flex-1 rounded-2xl overflow-hidden min-h-[160px] flex flex-col justify-end shadow-lg card-lift"
    >
      <Image
        src={article.imageUrl}
        alt={article.title}
        fill
        sizes="(max-width: 1024px) 100vw, 38vw"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        loading="eager"
        decoding="async"
      />
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
      {/* Hover shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-violet-600/0 group-hover:from-blue-600/10 group-hover:to-violet-600/10 transition-all duration-500" />

      <div className="relative z-10 p-4 space-y-1.5">
        <CategoryBadge category={article.category} gradient />
        <h2 className="text-sm sm:text-[0.9rem] font-bold text-white leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors duration-200">
          {article.title}
        </h2>
        <div className="flex items-center gap-1.5 text-[11px] text-white/55">
          <span className="font-medium text-white/70">{article.source}</span>
          <span className="text-white/30">·</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
      </div>
    </Link>
  );
}

// ── Exported section ──────────────────────────────────────────────────────────
export default function HeroSection({ articles }: Props) {
  if (!articles.length) return null;

  // First article is the carousel hero, rest go in the secondary stack
  const carouselArticles = articles.slice(0, Math.min(3, articles.length));
  const secondary        = articles.slice(carouselArticles.length, carouselArticles.length + 3);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 animate-fade-in">
      <MainHero articles={carouselArticles} />

      {/* Secondary stack */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {secondary.map((article) => (
          <SecondaryCard key={article.id} article={article} />
        ))}
        {/* Fill empty slots with placeholder if fewer than 3 secondary */}
        {secondary.length === 0 && (
          <div className="flex-1 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 min-h-[160px]" />
        )}
      </div>
    </section>
  );
}
