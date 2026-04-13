import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  posts: BlogPost[];
}

const CAT_GRADIENT: Record<string, string> = {
  engineering:    "from-blue-500 to-violet-600",
  design:         "from-pink-500 to-rose-500",
  product:        "from-amber-500 to-orange-500",
  culture:        "from-emerald-500 to-teal-500",
  opinion:        "from-violet-500 to-purple-600",
  tutorial:       "from-cyan-500 to-blue-500",
};

export default function BlogHighlights({ posts }: Props) {
  if (!posts.length) return null;

  const [lead, ...rest] = posts.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Lead post — spans 2 cols */}
      {lead && (
        <Link
          href={`/blog/${lead.slug}`}
          className="group lg:col-span-2 relative rounded-2xl overflow-hidden min-h-[280px] flex flex-col justify-end shadow-lg card-lift"
        >
          <Image
            src={lead.coverImage}
            alt={lead.title}
            fill
            sizes="(max-width:1024px) 100vw, 66vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Blog label */}
          <div className="absolute top-4 left-4">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white bg-gradient-to-r ${CAT_GRADIENT[lead.category] ?? "from-blue-500 to-violet-600"}`}>
              {lead.category}
            </span>
          </div>

          <div className="relative z-10 p-6 space-y-2">
            <h3 className="text-xl font-extrabold text-white leading-snug line-clamp-2 group-hover:text-blue-300 transition-colors text-balance">
              {lead.title}
            </h3>
            <p className="text-sm text-white/65 line-clamp-1 hidden sm:block">{lead.subtitle}</p>
            <div className="flex items-center gap-2 text-[11px] text-white/55">
              <div className="relative w-5 h-5 rounded-full overflow-hidden">
                <Image src={lead.author.avatar} alt={lead.author.name} fill sizes="20px" className="object-cover" />
              </div>
              <span className="font-medium text-white/75">{lead.author.name}</span>
              <span className="text-white/30">·</span>
              <span>{formatDate(lead.publishedAt)}</span>
              <span className="text-white/30">·</span>
              <span>{lead.readTime} min</span>
            </div>
          </div>
        </Link>
      )}

      {/* Side stack */}
      <div className="flex flex-col gap-4">
        {rest.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex gap-3 p-3 rounded-xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm card-lift"
          >
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="64px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1 py-0.5">
              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-white bg-gradient-to-r ${CAT_GRADIENT[post.category] ?? "from-blue-500 to-violet-600"}`}>
                {post.category}
              </span>
              <p className="text-[0.8rem] font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </p>
              <p className="text-[11px] text-slate-400">{post.author.name} · {post.readTime} min</p>
            </div>
          </Link>
        ))}

        {/* View all link */}
        <Link
          href="/blog"
          className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-400 dark:text-slate-500 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-600 dark:hover:text-blue-400 transition-all group"
        >
          View all posts
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
