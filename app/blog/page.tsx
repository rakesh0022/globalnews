import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { blogPosts, authors, getFeaturedPosts } from "@/lib/blog-data";
import BlogCard from "@/components/blog/BlogCard";
import AuthorCard from "@/components/blog/AuthorCard";
import TagPill from "@/components/blog/TagPill";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Long-form writing on technology, design, health, and culture from the NewsHub team.",
};

const ALL_TAGS = Array.from(new Set(blogPosts.flatMap((p) => p.tags))).slice(0, 16);

export default function BlogPage() {
  const featured = getFeaturedPosts();
  const rest     = blogPosts.filter((p) => !p.featured);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

      {/* ── Page header ── */}
      <div className="mb-12 space-y-3 animate-fade-up">
        <div className="flex items-center gap-2">
          <div className="w-1 h-7 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
            NewsHub Blog
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
          Ideas worth reading
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Long-form writing on technology, design, health, and culture — from journalists and practitioners who know their subjects deeply.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">

        {/* ── Main column ── */}
        <div className="flex-1 min-w-0 space-y-12">

          {/* Featured posts */}
          {featured.length > 0 && (
            <section className="space-y-5">
              <SectionHeader label="Featured" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger">
                {featured.map((post) => (
                  <BlogCard key={post.slug} post={post} variant="featured" />
                ))}
              </div>
            </section>
          )}

          {/* All posts grid */}
          <section className="space-y-5">
            <SectionHeader label="Latest Posts" />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </div>

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-[300px] xl:w-[320px] shrink-0">
          <div className="lg:sticky lg:top-24 space-y-6">

            {/* Featured Writers */}
            <div className="rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full bg-gradient-to-b from-violet-500 to-pink-500" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Featured Writers
                  </h3>
                </div>
              </div>
              <div className="p-4 space-y-1">
                {authors.map((author) => (
                  <Link key={author.slug} href={`/author/${author.slug}`}
                    className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-slate-100 dark:ring-slate-700 shrink-0">
                      <Image src={author.avatar} alt={author.name} fill sizes="36px" className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate
                        group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {author.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{author.role}</p>
                    </div>
                    <span className="text-[11px] text-slate-300 dark:text-slate-600 shrink-0">
                      {author.postCount} posts
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular tags */}
            <div className="rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">Popular Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {ALL_TAGS.map((tag) => <TagPill key={tag} tag={tag} href={`/blog?tag=${encodeURIComponent(tag)}`} />)}
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">{label}</h2>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-slate-200 dark:from-slate-700 to-transparent" />
    </div>
  );
}
