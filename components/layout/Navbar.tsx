"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SearchBar from "@/components/ui/SearchBar";

const NAV_LINKS = [
  { label: "Technology", href: "/?category=technology" },
  { label: "Business",   href: "/?category=business"   },
  { label: "Sports",     href: "/?category=sports"      },
  { label: "Blog",       href: "/blog"                  },
] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function handleCommit(value: string) {
    router.push(
      value.trim() ? `/search?q=${encodeURIComponent(value.trim())}` : "/"
    );
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg shadow-black/5 dark:shadow-black/20"
          : "bg-white/60 dark:bg-[#060b14]/60 backdrop-blur-md border-b border-white/30 dark:border-white/5"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
            <span className="text-[1.1rem] font-bold tracking-tight text-slate-900 dark:text-white">
              News<span className="gradient-text">Hub</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-all"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop search */}
          <div className="hidden sm:flex flex-1 max-w-sm xl:max-w-md">
            <SearchBar onCommit={handleCommit} />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <ThemeToggle />

            {/* Mobile: link to search page */}
            <Link
              href="/search"
              className="sm:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8 transition-colors"
              aria-label="Search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
