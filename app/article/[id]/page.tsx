import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleById, getRelatedArticles } from "@/services/api/newsService";
import { formatDate, formatFullDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";
import NewsCard from "@/components/news/NewsCard";
import ShareButtons from "@/components/article/ShareButtons";
import ReadingProgress from "@/components/article/ReadingProgress";
import ArticleBody from "@/components/article/ArticleBody";
import ReadTracker from "@/components/article/ReadTracker";

interface Props {
  params: Promise<{ id: string }>;
}

// ── SEO metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) return { title: "Article Not Found" };

  const canonicalUrl = `/article/${id}`;

  return {
    title:       article.title,   // layout template adds "| NewsHub"
    description: article.description,
    authors:     [{ name: article.author }],
    keywords:    [article.category, article.source, "news"],
    alternates:  { canonical: canonicalUrl },
    openGraph: {
      title:         article.title,
      description:   article.description,
      type:          "article",
      publishedTime: article.publishedAt,
      authors:       [article.author],
      images: [{
        url:    article.imageUrl,
        width:  1200,
        height: 630,
        alt:    article.title,
      }],
    },
    twitter: {
      card:        "summary_large_image",
      title:       article.title,
      description: article.description,
      images:      [article.imageUrl],
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);
  if (!article) notFound();

  const related = await getRelatedArticles(article, 3);

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    image: article.imageUrl,
    datePublished: article.publishedAt,
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: article.source,
      logo: { "@type": "ImageObject", url: "/favicon.ico" },
    },
  };

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Reading progress bar */}
      <ReadingProgress />
      {/* Read tracker — fires after 5s dwell, scores +2 for this category */}
      <ReadTracker articleId={article.id} category={article.category} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Breadcrumb / back ── */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400 dark:text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Home
          </Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <Link
            href={`/?category=${article.category}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize"
          >
            {article.category}
          </Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-xs">
            {article.title}
          </span>
        </nav>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">

          {/* ════════════════════════════════════════
              MAIN ARTICLE COLUMN
          ════════════════════════════════════════ */}
          <article
            className="flex-1 min-w-0 max-w-3xl"
            itemScope
            itemType="https://schema.org/NewsArticle"
          >

            {/* Category + trending */}
            <div className="flex items-center gap-2 mb-4">
              <CategoryBadge category={article.category} size="md" />
              {article.trending && (
                <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Trending
                </span>
              )}
            </div>

            {/* Headline */}
            <h1
              itemProp="headline"
              className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-gray-900 dark:text-white leading-[1.15] tracking-tight mb-5"
            >
              {article.title}
            </h1>

            {/* Deck / description */}
            <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 leading-relaxed mb-7 font-normal">
              {article.description}
            </p>

            {/* ── Author + meta bar ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-gray-100 dark:border-gray-800 mb-8">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm"
                  aria-hidden="true"
                >
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p
                    itemProp="author"
                    className="text-sm font-semibold text-gray-900 dark:text-white"
                  >
                    {article.author}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 flex-wrap">
                    <span
                      itemProp="publisher"
                      className="font-medium text-gray-500 dark:text-gray-400"
                    >
                      {article.source}
                    </span>
                    <span>·</span>
                    <time
                      itemProp="datePublished"
                      dateTime={article.publishedAt}
                      title={formatFullDate(article.publishedAt)}
                    >
                      {formatFullDate(article.publishedAt)}
                    </time>
                  </div>
                </div>
              </div>

              {/* Read time + share */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{article.readTime} min read</span>
                </div>
                <ShareButtons title={article.title} />
              </div>
            </div>

            {/* ── Featured image ── */}
            <figure className="mb-10">
              <div
                className="relative w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md"
                style={{ aspectRatio: "16/9" }}
              >
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 65vw, 800px"
                  className="object-cover"
                  priority
                  itemProp="image"
                />
              </div>
              <figcaption className="mt-2.5 text-xs text-center text-gray-400 dark:text-gray-500">
                {article.title} — {article.source}
              </figcaption>
            </figure>

            {/* ── Article body ── */}
            <div itemProp="articleBody">
              <ArticleBody content={article.content} />
            </div>

            {/* ── Bottom share + tags ── */}
            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 space-y-5">
              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Topics
                </span>
                <CategoryBadge category={article.category} size="md" />
                <span className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium">
                  {article.source}
                </span>
              </div>

              {/* Share row */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 flex-1">
                  Found this article useful? Share it.
                </p>
                <ShareButtons title={article.title} />
              </div>
            </div>

            {/* ── Related articles (mobile — below article) ── */}
            {related.length > 0 && (
              <section className="mt-14 lg:hidden" aria-label="Related articles">
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-5 tracking-tight">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {related.map((r) => (
                    <NewsCard
                      key={r.id}
                      title={r.title}
                      description={r.description}
                      image={r.imageUrl}
                      source={r.source}
                      publishedAt={r.publishedAt}
                      author={r.author}
                      readTime={r.readTime}
                      category={r.category}
                      trending={r.trending}
                      href={`/article/${r.id}`}
                    />
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* ════════════════════════════════════════
              SIDEBAR — desktop only
          ════════════════════════════════════════ */}
          <aside className="hidden lg:block w-[300px] xl:w-[320px] shrink-0">
            <div className="sticky top-24 space-y-8">

              {/* Article info card */}
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-4">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                  About this article
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-gray-400 dark:text-gray-500 shrink-0">Author</dt>
                    <dd className="font-semibold text-gray-900 dark:text-white text-right">{article.author}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-gray-400 dark:text-gray-500 shrink-0">Source</dt>
                    <dd className="font-semibold text-gray-900 dark:text-white text-right">{article.source}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-gray-400 dark:text-gray-500 shrink-0">Published</dt>
                    <dd className="font-semibold text-gray-900 dark:text-white text-right">
                      {formatDate(article.publishedAt)}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-gray-400 dark:text-gray-500 shrink-0">Read time</dt>
                    <dd className="font-semibold text-gray-900 dark:text-white">{article.readTime} min</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-gray-400 dark:text-gray-500 shrink-0">Category</dt>
                    <dd><CategoryBadge category={article.category} /></dd>
                  </div>
                </dl>
              </div>

              {/* Share widget */}
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                  Share this story
                </h3>
                <ShareButtons title={article.title} />
              </div>

              {/* Related articles */}
              {related.length > 0 && (
                <section aria-label="Related articles" className="space-y-4">
                  <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">
                    Related Articles
                  </h3>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <NewsCard
                        key={r.id}
                        title={r.title}
                        description={r.description}
                        image={r.imageUrl}
                        source={r.source}
                        publishedAt={r.publishedAt}
                        author={r.author}
                        readTime={r.readTime}
                        category={r.category}
                        trending={r.trending}
                        href={`/article/${r.id}`}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}
