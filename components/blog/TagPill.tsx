import Link from "next/link";

interface Props {
  tag:      string;
  href?:    string;
  size?:    "sm" | "md";
  active?:  boolean;
}

export default function TagPill({ tag, href, size = "sm", active = false }: Props) {
  const base =
    `inline-flex items-center rounded-full font-medium transition-all ` +
    (size === "sm" ? "px-2.5 py-0.5 text-xs " : "px-3.5 py-1 text-sm ") +
    (active
      ? "bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900"
      : "bg-slate-100 dark:bg-slate-800/70 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700/50");

  if (href) return <Link href={href} className={base}>{tag}</Link>;
  return <span className={base}>{tag}</span>;
}
