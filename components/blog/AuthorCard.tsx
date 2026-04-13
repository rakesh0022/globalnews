import Image from "next/image";
import Link from "next/link";
import { Author } from "@/types";

interface Props {
  author:  Author;
  compact?: boolean;
}

export default function AuthorCard({ author, compact = false }: Props) {
  if (compact) {
    return (
      <Link href={`/author/${author.slug}`} className="group flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm shrink-0">
          <Image src={author.avatar} alt={author.name} fill sizes="40px" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {author.name}
          </p>
          <p className="text-xs text-slate-400">{author.role}</p>
        </div>
      </Link>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-start gap-5 p-6 rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm">
      <Link href={`/author/${author.slug}`} className="shrink-0">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden ring-2 ring-slate-100 dark:ring-slate-700 shadow-md">
          <Image src={author.avatar} alt={author.name} fill sizes="80px" className="object-cover" />
        </div>
      </Link>
      <div className="flex-1 min-w-0 space-y-2">
        <div>
          <Link href={`/author/${author.slug}`}>
            <h3 className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {author.name}
            </h3>
          </Link>
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{author.role}</p>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{author.bio}</p>
        <div className="flex items-center gap-3 pt-1">
          {author.twitter && (
            <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer"
              className="text-xs font-medium text-slate-400 hover:text-blue-500 transition-colors flex items-center gap-1">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              @{author.twitter}
            </a>
          )}
          <span className="text-xs text-slate-300 dark:text-slate-600">·</span>
          <span className="text-xs text-slate-400">{author.postCount} posts</span>
        </div>
      </div>
    </div>
  );
}
