import Image from "next/image";
import Link from "next/link";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/ui/CategoryBadge";

interface Props {
  articles: Article[];
}

export default function EditorsPick({ articles }: Props) {
  if (!articles.length) return null;

  const [lead, ...rest] = articles.slice(0, 4);

  return (
    <section className="space-y-5">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-violet-600" />
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
            Editor&apos;s Pick
          </h2>
        </div>
        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 dark:from-slate-700 to-transparent" />
        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-full">
          Curated
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Lead card — spans full width on mobile, left col on sm+ */}
        {lead && (
          <Link
            href={`/article/${lead.id}`}
            className="group relative rounded-2xl overflow-hidden min-h-[260px] flex flex-col justify-end shadow-lg card-lift sm:row-span-2"
          >
            <Image
              src={lead.imageUrl}
              alt={lead.title}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-violet-600/0 group-hover:from-blue-600/10 group-hover:to-violet-600/10 transition-all duration-500" />

            {/* Editor badge */}
            <div className="absolute top-4 right-4">
              <span className="flex items-center gap-1.5 glass text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-widest uppercase">
                ✦ Editor&apos;s Pick
              </span>
            </div>

            <div className="relative z-10 p-5 space-y-2">
              <CategoryBadge category={lead.category} gradient />
              <h3 className="text-lg font-extrabold text-white leading-snug line-clamp-3 group-hover:text-blue-300 transition-colors text-balance">
                {lead.title}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-white/55">
                <span className="font-medium text-white/75">{lead.author}</span>
                <span className="text-white/30">·</span>
                <span>{formatDate(lead.publishedAt)}</span>
              </div>
            </div>
          </Link>
        )}

        {/* Secondary picks */}
        {rest.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.id}`}
            className="group flex gap-3 p-3 rounded-2xl bg-white dark:bg-[#0d1526] border border-slate-100 dark:border-slate-800/60 shadow-sm card-lift"
          >
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                sizes="80px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0 space-y-1.5 py-0.5">
              <CategoryBadge category={article.category} />
              <p className="text-[0.82rem] font-semibold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {article.title}
              </p>
              <p className="text-[11px] text-slate-400">{formatDate(article.publishedAt)} · {article.readTime} min</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
