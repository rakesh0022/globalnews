"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Typed explicitly so TypeScript knows `center` may or may not exist
interface Tab {
  label:  string;
  href:   string;
  center?: boolean;
  icon:   (active: boolean) => React.ReactElement;
}

const TABS: Tab[] = [
  {
    label: "Home",
    href: "/",
    icon: (active) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    label: "Trending",
    href: "/search?q=trending",
    icon: (active) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    label: "Search",
    href: "/search",
    center: true,
    icon: (_active) => (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
      </svg>
    ),
  },
  {
    label: "Blog",
    href: "/blog",
    icon: (active) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: "Topics",
    href: "/search",
    icon: (active) => (
      <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  }

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50"
      aria-label="Mobile navigation"
    >
      <div className="glass border-t border-white/20 dark:border-white/5 shadow-2xl shadow-black/20">
        <div className="flex items-end justify-around px-2 pt-2 pb-safe">
          {TABS.map(({ label, href, icon, center }) => {
            const active = isActive(href);

            if (center) {
              return (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="relative -top-4 flex flex-col items-center"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-200 active:scale-95 ${
                    active
                      ? "bg-blue-600 shadow-blue-500/40"
                      : "bg-gradient-to-br from-blue-500 to-violet-600 shadow-blue-500/30"
                  }`}>
                    <span className="text-white">{icon(active)}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                    {label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="relative flex flex-col items-center gap-1 py-2 px-3 min-w-[52px] transition-all duration-150 active:scale-95"
              >
                <span className={`transition-colors duration-150 ${
                  active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                }`}>
                  {icon(active)}
                </span>
                <span className={`text-[10px] font-semibold transition-colors duration-150 ${
                  active ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500"
                }`}>
                  {label}
                </span>
                {active && (
                  <span className="absolute top-1.5 w-1 h-1 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
