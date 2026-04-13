"use client";

import { Category } from "@/types";
import { CATEGORIES } from "@/lib/utils";

interface Props {
  active: Category;
  onChange: (cat: Category) => void;
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
            active === value
              ? "bg-blue-600 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900"
              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
