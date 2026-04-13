"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearch } from "@/hooks/useSearch";
import SearchDropdown from "@/components/ui/SearchDropdown";

interface Props {
  /** Controlled value — pass when the parent needs to sync (e.g. URL param) */
  defaultValue?: string;
  placeholder?: string;
  /** Called whenever the committed search value changes (submit / clear) */
  onCommit?: (value: string) => void;
}

export default function SearchBar({
  defaultValue = "",
  placeholder = "Search news…",
  onCommit,
}: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [focused, setFocused] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { query, setQuery, results, status, total, clear } = useSearch();

  // Sync external defaultValue into local state once on mount / when it changes
  useEffect(() => {
    if (defaultValue !== query) setQuery(defaultValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);

  // Open dropdown whenever there's an active query
  useEffect(() => {
    setDropdownOpen(!!query.trim() && focused);
  }, [query, focused]);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function handleChange(val: string) {
    setQuery(val);
    if (!val.trim()) onCommit?.("");
  }

  function handleClear() {
    clear();
    onCommit?.("");
    inputRef.current?.focus();
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    setDropdownOpen(false);
    inputRef.current?.blur();
    onCommit?.(query.trim());
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  function handleViewAll() {
    setDropdownOpen(false);
    inputRef.current?.blur();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  function handleFocus() {
    setFocused(true);
    if (query.trim()) setDropdownOpen(true);
  }

  function handleBlur() {
    // Delay so clicks inside the dropdown register first
    setTimeout(() => {
      setFocused(false);
      setDropdownOpen(false);
    }, 150);
  }

  const showDropdown = dropdownOpen && query.trim().length > 0 && status !== "idle";

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search" aria-label="Search news">
        <div
          className={`flex items-center gap-2 rounded-full border px-4 py-2 transition-all duration-200
            bg-gray-50 dark:bg-gray-800/80
            ${focused
              ? "border-blue-500 ring-2 ring-blue-500/20 dark:ring-blue-500/30 bg-white dark:bg-gray-800"
              : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            }`}
        >
          {/* Search icon / spinner */}
          {status === "loading" ? (
            <svg
              className="w-4 h-4 text-blue-500 shrink-0 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 shrink-0 transition-colors ${focused ? "text-blue-500" : "text-gray-400"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
          )}

          <input
            ref={inputRef}
            type="search"
            role="combobox"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            aria-controls="search-dropdown"
            autoComplete="off"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none min-w-0"
          />

          {/* Clear button */}
          {query ? (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shrink-0"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-medium text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600 shrink-0">
              ⌘K
            </kbd>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <SearchDropdown
          query={query}
          results={results}
          status={status}
          total={total}
          onClose={() => setDropdownOpen(false)}
          onViewAll={handleViewAll}
        />
      )}
    </div>
  );
}
