import Link from "next/link";

interface Props {
  title:    string;
  icon?:    string;
  href?:    string;
  hrefLabel?: string;
  accent?:  "blue" | "orange" | "violet" | "emerald" | "rose";
}

const ACCENT_BAR: Record<string, string> = {
  blue:    "from-blue-500 to-violet-600",
  orange:  "from-orange-400 to-red-500",
  violet:  "from-violet-500 to-pink-500",
  emerald: "from-emerald-500 to-teal-500",
  rose:    "from-rose-500 to-pink-500",
};

export default function SectionDivider({
  title,
  icon,
  href,
  hrefLabel = "View all",
  accent = "blue",
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Accent bar */}
        <div className={`w-1 h-6 rounded-full bg-gradient-to-b ${ACCENT_BAR[accent]}`} />
        {/* Icon */}
        {icon && <span className="text-lg leading-none">{icon}</span>}
        {/* Title */}
        <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
      </div>

      {/* Divider line */}
      <div className="flex-1 h-px bg-gradient-to-r from-slate-200 dark:from-slate-700 to-transparent" />

      {/* Optional link */}
      {href && (
        <Link
          href={href}
          className="shrink-0 flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
        >
          {hrefLabel}
          <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  );
}
