import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types";
import { formatDate } from "@/lib/utils";
import TagPill from "./TagPill";

interface Props {
  post:     BlogPost;
  variant?: "default" | "featured" | "compact";
}

export default function BlogCard({ post, variant = "default" }: Props) {
  if (variant === "compact") {
    return (
      <Link href={`/blog/${post.slug}`}
        className="group flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
          <Image src={post.coverImage} alt={post.title} fill sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-[0.82rem] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2
            group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>{post.author.name}</span>
            <span>·</span>
            <span>{post.readTime} min</span>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link href={`/blog/${post.slug}`}
        className="group relative rounded-3xl overflow-hidden min-h-[420px] flex flex-col justify-end shadow-xl card-lift">
        <Image src={post.coverImage} alt={post.title} fill
          sizes="(max-width:1024px) 100vw, 60vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        <div className="relative z-10 p-7 sm:p-9 space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest
              bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-sm">
              {post.category}
            </span>
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Featured</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight
            group-hover:text-blue-300 transition-colors text-balance max-w-2xl">
            {post.title}
          </h2>
          <p className="text-sm text-white/65 line-clamp-2 max-w-xl hidden sm:block">{post.subtitle}</p>
          <div className="flex items-center gap-3 pt-1">
            <div className="relative w-7 h-7 rounded-full overflow-hidden ring-2 ring-white/30">
              <Image src={post.author.avatar} alt={post.author.name} fill sizes="28px" className="object-cover" />
            </div>
            <span className="text-xs font-medium text-white/75">{post.author.name}</span>
            <span className="text-white/30">·</span>
            <span className="text-xs text-white/55">{formatDate(post.publishedAt)}</span>
            <span className="text-white/30">·</span>
            <span className="text-xs text-white/55">{post.readTime} min read</span>
          </div>
        </div>
      </Link>
    );
  }

  // default card
  return (
    <Link href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#0d1526]
        border border-slate-100 dark:border-slate-800/60 shadow-sm card-lift">
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image src={post.coverImage} alt={post.title} fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-violet-600/0
          group-hover:from-blue-600/8 group-hover:to-violet-600/8 transition-all duration-500" />
      </div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest
            bg-gradient-to-r from-blue-500 to-violet-600 text-white">
            {post.category}
          </span>
          {post.tags.slice(0, 1).map((t) => <TagPill key={t} tag={t} />)}
        </div>
        <h3 className="font-bold text-[0.95rem] text-slate-900 dark:text-white leading-snug line-clamp-2
          group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 flex-1">
          {post.subtitle}
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
              <Image src={post.author.avatar} alt={post.author.name} fill sizes="24px" className="object-cover" />
            </div>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>{formatDate(post.publishedAt)}</span>
            <span>·</span>
            <span>{post.readTime} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
