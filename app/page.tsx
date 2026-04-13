"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Category } from "@/types";
import { useNews, useTrending } from "@/hooks/useNews";
import { usePreferences } from "@/hooks/usePreferences";
import { useRecommendations } from "@/hooks/useRecommendations";
import { blogPosts } from "@/lib/blog-data";

// ── Section components ────────────────────────────────────────────────────────
import HeroSection        from "@/components/news/HeroSection";
import BreakingTicker     from "@/components/news/BreakingTicker";
import TrendingGrid       from "@/components/news/TrendingGrid";
import LatestFeed         from "@/components/news/LatestFeed";
import EditorsPick        from "@/components/news/EditorsPick";
import BlogHighlights     from "@/components/news/BlogHighlights";
import NewsletterSection  from "@/components/news/NewsletterSection";
import RecommendedSection from "@/components/news/RecommendedSection";
import CategoryTabs       from "@/components/news/CategoryTabs";
import SwipeableCategoryTabs from "@/components/news/SwipeableCategoryTabs";
import NewsGrid           from "@/components/news/NewsGrid";
import Sidebar            from "@/components/news/Sidebar";
import SectionDivider     from "@/components/ui/SectionDivider";
import { FadeUp, StaggerList, StaggerItem } from "@/components/motion/MotionWrappers";
import { SkeletonGrid, SkeletonHero } from "@/components/ui/SkeletonCard";

// ── Skeleton helpers ──────────────────────────────────────────────────────────
function TrendingGridSkeleton() {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm overflow-hidden animate-pulse">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded-full" />
          <div className="h-8 w-36 bg-slate-100 dark:bg-slate-800 rounded-xl" />
        </div>
        <div className="flex gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-full" />
              <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded-full" />
            </div>
          ))}
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800/60">
        <div className="lg:w-[45%] p-4">
          <div className="rounded-2xl bg-slate-200 dark:bg-slate-700 min-h-[340px]" />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-3 p-3">
              <div className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0" />
              <div className="w-[72px] h-[72px] bg-slate-200 dark:bg-slate-700 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Search / category filtered view ──────────────────────────────────────────
function FilteredView({
  category,
  query,
  onCategoryChange,
}: {
  category: Category;
  query: string;
  onCategoryChange: (c: Category) => void;
}) {
  const { articles, loading, loadingMore, hasMore, loadMore, error, retry } = useNews({
    category,
    query,
    pageSize: 8,
  });

  const sectionTitle = useMemo(() => {
    if (query) return `Results for "${query}"`;
    if (category === "all") return "Latest Stories";
    return category.charAt(0).toUpperCase() + category.slice(1);
  }, [query, category]);

  return (
    <div className="space-y-6">
      {/* Sticky swipeable tabs on mobile, regular on desktop */}
      <SwipeableCategoryTabs active={category} onChange={onCategoryChange} sticky />
      <div className="px-4 sm:px-0 flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {sectionTitle}
        </h2>
        {!loading && articles.length > 0 && (
          <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            {articles.length} stories
          </span>
        )}
      </div>
      {/* Mobile: negative margin for full-width cards */}
      <div className="sm:px-0 -mx-4 sm:mx-0">
        <NewsGrid
          articles={articles}
          loading={loading}
          loadingMore={loadingMore}
          hasMore={hasMore}
          error={error}
          onLoadMore={loadMore}
          onRetry={retry}
          emptyMessage={query ? `No results for "${query}"` : "No articles in this category yet."}
        />
      </div>
    </div>
  );
}

// ── Main editorial homepage ───────────────────────────────────────────────────
function HomeContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery]       = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery((prev) => (prev === q ? prev : q));
  }, [searchParams]);

  const isFiltered = !!query || category !== "all";

  // ── Data fetches ──────────────────────────────────────────────────────────
  // Hero carousel — top 6 articles
  const { articles: heroArticles, loading: heroLoading } = useNews({
    category: "all", pageSize: 6, enabled: !isFiltered,
  });

  // Breaking ticker — trending articles
  const { articles: breakingArticles } = useNews({
    category: "all", pageSize: 8, enabled: !isFiltered,
  });

  // Trending grid — 8 articles for the analytics dashboard
  const { articles: trendingArticles, loading: trendingLoading } = useNews({
    category: "all", pageSize: 8, enabled: !isFiltered,
  });

  // Latest feed — next 6
  const { articles: latestArticles, loading: latestLoading } = useNews({
    category: "all", pageSize: 6, enabled: !isFiltered,
  });

  // Sidebar trending
  const { articles: sidebarTrending, loading: sidebarTrendingLoading } = useTrending();

  // Personalisation
  const { prefs, hasData, reset } = usePreferences();
  const allArticles = useMemo(
    () => [...heroArticles, ...trendingArticles, ...latestArticles],
    [heroArticles, trendingArticles, latestArticles]
  );
  const shownIds = useMemo(
    () => allArticles.map((a) => a.id),
    [allArticles]
  );
  const { recommendations, topCats, isPersonalised } = useRecommendations({
    articles: allArticles, prefs, excludeIds: shownIds, limit: 10, minScore: 1,
  });

  const handleCategoryChange = useCallback(
    (cat: Category) => { setCategory(cat); setQuery(""); router.push("/"); },
    [router]
  );

  // Blog highlights — 4 posts
  const highlightPosts = blogPosts.slice(0, 4);

  // ── Filtered view (search / category) ────────────────────────────────────
  if (isFiltered) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-10">
          <div className="flex-1 min-w-0">
            <FilteredView
              category={category}
              query={query}
              onCategoryChange={handleCategoryChange}
            />
          </div>
          <Sidebar trending={sidebarTrending} trendingLoading={sidebarTrendingLoading} />
        </div>
      </div>
    );
  }

  // ── Editorial homepage ────────────────────────────────────────────────────
  return (
    <div className="space-y-0">

      {/* ① Breaking News Ticker — full width, no padding */}
      {breakingArticles.length > 0 && (
        <BreakingTicker articles={breakingArticles.filter((a) => a.trending)} />
      )}

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* ② Hero + Sidebar */}
        <section className="pt-8 pb-12">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-10">
            <div className="flex-1 min-w-0">
              {heroLoading
                ? <SkeletonHero />
                : <HeroSection articles={heroArticles} />
              }
            </div>
            <Sidebar trending={sidebarTrending} trendingLoading={sidebarTrendingLoading} />
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-12" />

        {/* ③ Trending Grid */}
        <FadeUp>
        <section className="pb-14 space-y-5">
          <SectionDivider
            title="Trending Now"
            icon="🔥"
            accent="orange"
            href="/search?q=trending"
            hrefLabel="See all trending"
          />
          {trendingLoading
            ? <TrendingGridSkeleton />
            : <TrendingGrid articles={trendingArticles} />
          }
        </section>
        </FadeUp>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-12" />

        {/* ④ Latest News Feed + mini sidebar */}
        <FadeUp delay={0.05}>
        <section className="pb-14">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-10">
            <div className="flex-1 min-w-0 space-y-5">
              <SectionDivider title="Latest News" icon="📰" accent="blue" href="/search" hrefLabel="All stories" />
              {latestLoading ? <SkeletonGrid count={4} /> : <LatestFeed articles={latestArticles} />}
            </div>
            <div className="w-full lg:w-[260px] xl:w-[280px] shrink-0 space-y-4">
              <SectionDivider title="Browse" icon="🗂️" accent="violet" />
              <StaggerList className="grid grid-cols-2 gap-2">
                {[
                  { label: "Technology", icon: "⚡", cat: "technology" as Category, color: "from-blue-500 to-violet-600" },
                  { label: "Sports",     icon: "⚽", cat: "sports"     as Category, color: "from-emerald-500 to-cyan-500" },
                  { label: "Business",   icon: "📈", cat: "business"   as Category, color: "from-amber-500 to-orange-500" },
                  { label: "Health",     icon: "❤️", cat: "health"     as Category, color: "from-rose-500 to-pink-500" },
                  { label: "Science",    icon: "🔬", cat: "science"    as Category, color: "from-violet-500 to-blue-500" },
                  { label: "Entertainment", icon: "🎬", cat: "entertainment" as Category, color: "from-pink-500 to-orange-500" },
                ].map(({ label, icon, cat, color }) => (
                  <StaggerItem key={cat}>
                    <button
                      onClick={() => { setCategory(cat); router.push("/"); }}
                      className="group w-full flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm hover:shadow-md card-lift text-center"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl shadow-sm`}>
                        {icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {label}
                      </span>
                    </button>
                  </StaggerItem>
                ))}
              </StaggerList>
            </div>
          </div>
        </section>
        </FadeUp>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-12" />

        {/* ⑤ Editor's Picks */}
        <FadeUp delay={0.05}>
        <section className="pb-14 space-y-5">
          <SectionDivider title="Editor's Picks" icon="✦" accent="violet" href="/search?q=featured" hrefLabel="More picks" />
          <EditorsPick articles={latestArticles.slice(0, 4)} />
        </section>
        </FadeUp>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-12" />

        {/* ⑥ Personalised Recommendations */}
        {isPersonalised && hasData && (
          <>
            <section className="pb-14">
              <RecommendedSection
                articles={recommendations}
                topCats={topCats}
                onReset={reset}
              />
            </section>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-12" />
          </>
        )}

        {/* ⑦ Blog Highlights */}
        <FadeUp delay={0.05}>
        <section className="pb-14 space-y-5">
          <SectionDivider title="From the Blog" icon="✍️" accent="emerald" href="/blog" hrefLabel="Visit blog" />
          <BlogHighlights posts={highlightPosts} />
        </section>
        </FadeUp>

        {/* ── Divider ── */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent mb-12" />

        {/* ⑧ Newsletter */}
        <FadeUp delay={0.05}>
        <section className="pb-16">
          <NewsletterSection />
        </section>
        </FadeUp>

      </div>
    </div>
  );
}

// ── Page shell ────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <SkeletonHero />
          <SkeletonGrid count={4} />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
