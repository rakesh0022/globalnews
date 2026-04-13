import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { postMap, getCommentsForPost, getRelatedPosts } from "@/lib/blog-data";
import { formatFullDate, formatDate } from "@/lib/utils";
import ProseRenderer from "@/components/blog/ProseRenderer";
import AuthorCard from "@/components/blog/AuthorCard";
import BlogCard from "@/components/blog/BlogCard";
import CommentSection from "@/components/blog/CommentSection";
import TagPill from "@/components/blog/TagPill";
import ReadingProgress from "@/components/article/ReadingProgress";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = postMap[slug];
  if (!post) return { title: "Post Not Found" };
  return {
    title:       post.title,
    description: post.subtitle,
    authors:     [{ name: post.author.name }],
    alternates:  { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title, description: post.subtitle, type: "article",
      publishedTime: post.publishedAt, authors: [post.author.name],
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(postMap).map((slug) => ({ slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = postMap[slug];
  if (!post) notFound();

  const comments = getCommentsForPost(slug);
  const related  = getRelatedPosts(post, 3);

  const jsonLd = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: post.title, description: post.subtitle,
    image: post.coverImage, datePublished: post.publishedAt,
    author: { "@type": "Person", name: post.author.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-slate-500 truncate max-w-[200px]">{post.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12 xl:gap-16">

          {/* ── Article ── */}
          <article className="flex-1 min-w-0 max-w-3xl" itemScope itemType="https://schema.org/BlogPosting">

            {/* Category + tags */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest
                bg-gradient-to-r from-blue-500 to-violet-600 text-white">
                {post.category}
              </span>
              {post.tags.map((t) => <TagPill key={t} tag={t} />)}
            </div>

            {/* Title */}
            <h1 itemProp="headline"
              className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold text-slate-900 dark:text-white
                leading-[1.12] tracking-tight mb-4 text-balance">
              {post.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed mb-7 font-normal">
              {post.subtitle}
            </p>

            {/* Author + meta bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4
              py-5 border-y border-slate-100 dark:border-slate-800 mb-8">
              <AuthorCard author={post.author} compact />
              <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0">
                <time itemProp="datePublished" dateTime={post.publishedAt}
                  title={formatFullDate(post.publishedAt)}>
                  {formatFullDate(post.publishedAt)}
                </time>
                <span>·</span>
                <span>{post.readTime} min read</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {post.likes.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Cover image */}
            <figure className="mb-10">
              <div className="relative w-full rounded-2xl overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800"
                style={{ aspectRatio: "16/9" }}>
                <Image src={post.coverImage} alt={post.title} fill
                  sizes="(max-width:768px) 100vw, (max-width:1280px) 65vw, 800px"
                  className="object-cover" priority itemProp="image" />
              </div>
              <figcaption className="mt-2.5 text-xs text-center text-slate-400">
                {post.title} — {post.author.name}
              </figcaption>
            </figure>

            {/* Body */}
            <div itemProp="articleBody">
              <ProseRenderer content={post.content} />
            </div>

            {/* Tags footer */}
            <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tags</span>
              {post.tags.map((t) => <TagPill key={t} tag={t} size="md" />)}
            </div>

            {/* Author bio card */}
            <div className="mt-10">
              <AuthorCard author={post.author} />
            </div>

            {/* Comments */}
            <div className="mt-14">
              <CommentSection comments={comments} />
            </div>
          </article>

          {/* ── Sidebar ── */}
          <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* About the author */}
              <div className="rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                  <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">About the Author</h3>
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-slate-100 dark:ring-slate-700 shrink-0">
                      <Image src={post.author.avatar} alt={post.author.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <Link href={`/author/${post.author.slug}`}
                        className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">
                        {post.author.name}
                      </Link>
                      <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                        {post.author.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{post.author.bio}</p>
                  <Link href={`/author/${post.author.slug}`}
                    className="block text-center text-xs font-semibold text-blue-600 dark:text-blue-400
                      bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-950/60
                      px-4 py-2 rounded-xl transition-colors">
                    View all posts →
                  </Link>
                </div>
              </div>

              {/* Article info */}
              <div className="rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm p-5 space-y-3">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Article Info</h3>
                <dl className="space-y-2 text-sm">
                  {[
                    ["Published", formatDate(post.publishedAt)],
                    ["Read time", `${post.readTime} min`],
                    ["Category", post.category],
                    ["Likes", post.likes.toLocaleString()],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <dt className="text-slate-400">{k}</dt>
                      <dd className="font-semibold text-slate-900 dark:text-white capitalize">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm overflow-hidden">
                  <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Related Posts</h3>
                  </div>
                  <div className="p-2">
                    {related.map((p) => <BlogCard key={p.slug} post={p} variant="compact" />)}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
