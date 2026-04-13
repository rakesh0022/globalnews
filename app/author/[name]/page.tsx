import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { authorMap, getPostsByAuthor } from "@/lib/blog-data";
import BlogCard from "@/components/blog/BlogCard";
import TagPill from "@/components/blog/TagPill";

interface Props { params: Promise<{ name: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { name } = await params;
  const author = authorMap[name];
  if (!author) return { title: "Author Not Found" };
  return {
    title:       author.name,
    description: author.bio,
    alternates:  { canonical: `/author/${name}` },
    openGraph: {
      title: `${author.name} — NewsHub Blog`,
      description: author.bio,
      images: [{ url: author.avatar, width: 400, height: 400, alt: author.name }],
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(authorMap).map((name) => ({ name }));
}

export default async function AuthorPage({ params }: Props) {
  const { name } = await params;
  const author = authorMap[name];
  if (!author) notFound();

  const posts = getPostsByAuthor(name);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-10">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <Link href="/blog" className="hover:text-blue-600 transition-colors">Blog</Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-500">{author.name}</span>
      </nav>

      {/* ── Profile hero ── */}
      <div className="relative rounded-3xl overflow-hidden mb-12 animate-fade-in">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-violet-950" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative z-10 p-8 sm:p-12 flex flex-col sm:flex-row items-start gap-8">
          {/* Avatar */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden
            ring-4 ring-white/20 shadow-2xl shrink-0">
            <Image src={author.avatar} alt={author.name} fill sizes="144px" className="object-cover" priority />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{author.name}</h1>
              <p className="text-sm font-bold text-blue-300 uppercase tracking-widest mt-1">{author.role}</p>
            </div>
            <p className="text-base text-slate-300 leading-relaxed max-w-2xl">{author.bio}</p>

            {/* Stats + links */}
            <div className="flex items-center gap-6 flex-wrap">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-white">{author.postCount}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Posts</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex items-center gap-3">
                {author.twitter && (
                  <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    @{author.twitter}
                  </a>
                )}
                {author.website && (
                  <a href={author.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {author.tags.map((t) => (
                <span key={t} className="px-2.5 py-0.5 rounded-full text-xs font-medium
                  bg-white/10 text-white/80 border border-white/10">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Posts ── */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            All Posts by {author.name}
          </h2>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            {posts.length}
          </span>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {posts.map((post) => <BlogCard key={post.slug} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <p>No posts yet from this author.</p>
          </div>
        )}
      </section>
    </div>
  );
}
