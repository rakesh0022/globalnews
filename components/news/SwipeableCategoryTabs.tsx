"use client";

import { useRef, useCallback, useEffect } from "react";
import { Category } from "@/types";
import { CATEGORIES } from "@/lib/utils";
import { usePreferences } from "@/hooks/usePreferences";

const ICONS: Record<Category, string> = {
  all:           "◈",
  technology:    "⚡",
  sports:        "⚽",
  business:      "📈",
  health:        "❤️",
  science:       "🔬",
  entertainment: "🎬",
};

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

const CATEGORY_VALUES = CATEGORIES.map((c) => c.value);

interface Props {
  active:   Category;
  onChange: (cat: Category) => void;
  sticky?:  boolean;
}

export default function SwipeableCategoryTabs({ active, onChange, sticky = false }: Props) {
  const { trackCatTab } = usePreferences();
  const scrollRef  = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiping    = useRef(false);

  // Scroll active tab into view whenever it changes
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeBtn = container.querySelector<HTMLButtonElement>("[data-active='true']");
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [active]);

  // Swipe left/right to change category
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swiping.current = false;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;

    // Only register horizontal swipes (dx > dy * 1.5 and dx > 40px threshold)
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;

    const idx = CATEGORY_VALUES.indexOf(active);
    if (dx < 0 && idx < CATEGORY_VALUES.length - 1) {
      // Swipe left → next category
      const next = CATEGORY_VALUES[idx + 1];
      if (next !== "all") trackCatTab(next);
      onChange(next);
    } else if (dx > 0 && idx > 0) {
      // Swipe right → previous category
      const prev = CATEGORY_VALUES[idx - 1];
      if (prev !== "all") trackCatTab(prev);
      onChange(prev);
    }
    touchStart.current = null;
  }, [active, onChange, trackCatTab]);

  function handleChange(value: Category) {
    if (value !== "all") trackCatTab(value);
    onChange(value);
  }

  return (
    <div
      className={`bg-white/95 dark:bg-[#060b14]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 ${
        sticky ? "sticky top-16 z-40" : ""
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={scrollRef}
        className="flex items-end gap-0 overflow-x-auto scrollbar-hide"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {CATEGORIES.map(({ label, value }) => {
          const isActive = active === value;
          return (
            <button
              key={value}
              data-active={isActive}
              onClick={() => handleChange(value)}
              /* 44px minimum touch target height */
              className={`group relative shrink-0 flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold transition-all duration-150 whitespace-nowrap min-h-[44px] ${
                isActive
                  ? ACTIVE_COLOR[value]
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span className="text-base leading-none">{ICONS[value]}</span>
              {label}
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

      {/* Swipe hint — only on mobile, fades after first interaction */}
      <div className="sm:hidden flex items-center justify-center gap-1 py-1 opacity-40">
        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-[10px] text-slate-400 font-medium">swipe to browse</span>
        <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
