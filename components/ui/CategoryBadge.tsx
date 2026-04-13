import { Category } from "@/types";

interface Props {
  category: Category;
  size?: "sm" | "md";
  gradient?: boolean;
}

// Gradient configs per category
const GRADIENT: Record<Category, string> = {
  all:           "from-slate-500 to-slate-600",
  technology:    "from-blue-500 to-violet-600",
  sports:        "from-emerald-500 to-cyan-600",
  business:      "from-amber-500 to-orange-600",
  health:        "from-rose-500 to-pink-600",
  science:       "from-violet-500 to-blue-600",
  entertainment: "from-pink-500 to-orange-500",
};

// Soft tint for non-gradient variant
const TINT: Record<Category, string> = {
  all:           "bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300",
  technology:    "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
  sports:        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  business:      "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  health:        "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  science:       "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  entertainment: "bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300",
};

export default function CategoryBadge({ category, size = "sm", gradient = false }: Props) {
  const padding = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  if (gradient) {
    return (
      <span
        className={`inline-flex items-center rounded-full font-bold uppercase tracking-widest text-white bg-gradient-to-r ${GRADIENT[category] ?? GRADIENT.all} ${padding} shadow-sm`}
      >
        {category}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold uppercase tracking-wider ${padding} ${TINT[category] ?? TINT.all}`}
    >
      {category}
    </span>
  );
}
