"use client";

import { Category } from "@/types";
import { CATEGORIES } from "@/lib/utils";
import { usePreferences } from "@/hooks/usePreferences";

// ... (rest of constants unchanged)
const ICONS: Record<Category, string> = {
  all:           "◈",
  technology:    "⚡",
  sports:        "⚽",
  business:      "📈",
  health:        "❤️",
  science:       "🔬",
  entertainment: "🎬",
};

// Per-category active colour
const ACTIVE_COLOR: Record<Category, string> = {
  all:           "text-slate-700 dark:text-slate-200",
  technology:    "text-blue-600 dark:text-blue-400",
  sports:        "text-emerald-600 dark:text-emerald-400",
  business:      "text-amber-600 dark:text-amber-400",
  health:        "text-rose-600 dark:text-rose-400",
  science:       "text-violet-600 dark:text-violet-400",
  entertainment: "text-pink-600 dark:text-pink-400",
};

const ACTIVE_BAR: Record<Category, string> = {
  all:           "bg-slate-600 dark:bg-slate-300",
  technology:    "bg-gradient-to-r from-blue-500 to-violet-600",
  sports:        "bg-gradient-to-r from-emerald-500 to-cyan-500",
  business:      "bg-gradient-to-r from-amber-500 to-orange-500",
  health:        "bg-gradient-to-r from-rose-500 to-pink-500",
  science:       "bg-gradient-to-r from-violet-500 to-blue-500",
  entertainment: "bg-gradient-to-r from-pink-500 to-orange-500",
};

interface Props {
  active:   Category;
  onChange: (cat: Category) => void;
}

export default function CategoryTabs({ active, onChange }: Props) {
  const { trackCatTab } = usePreferences();

  function handleChange(value: Category) {
    if (value !== "all") trackCatTab(value);
    onChange(value);
  }

  return (
    <div className="relative">
      <div className="flex items-end gap-0 overflow-x-auto scrollbar-hide border-b border-slate-200 dark:border-slate-800">
        {CATEGORIES.map(({ label, value }) => {
          const isActive = active === value;
          return (
            <button
              key={value}
              onClick={() => handleChange(value)}
              className={`group relative shrink-0 flex items-center gap-1.5 px-4 py-3 text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? ACTIVE_COLOR[value]
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span className="text-base leading-none">{ICONS[value]}</span>
              {label}
              {/* Active indicator bar */}
              <span
                className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full transition-all duration-200 ${
                  isActive
                    ? `${ACTIVE_BAR[value]} opacity-100`
                    : "opacity-0 bg-slate-300 group-hover:opacity-40"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
