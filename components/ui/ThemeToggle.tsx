"use client";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, mounted, toggle } = useTheme();

  // Render a placeholder with the same dimensions to avoid layout shift
  if (!mounted) {
    return (
      <div
        className="w-[52px] h-7 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={`
        relative inline-flex items-center w-[52px] h-7 rounded-full shrink-0
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-950
        transition-colors duration-300
        ${isDark ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}
      `}
    >
      {/* Track icons */}
      <span className="absolute left-1.5 text-[11px] select-none" aria-hidden="true">
        {isDark ? "🌙" : ""}
      </span>
      <span className="absolute right-1.5 text-[11px] select-none" aria-hidden="true">
        {!isDark ? "☀️" : ""}
      </span>

      {/* Thumb */}
      <span
        className={`
          absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm
          flex items-center justify-center
          transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isDark ? "translate-x-[26px]" : "translate-x-0.5"}
        `}
      >
        {/* Icon inside thumb */}
        {isDark ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="4" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M2 12h2m16 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
