"use client";

import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "dark";

interface UseThemeReturn {
  /** Current active theme — undefined until mounted (avoids SSR mismatch) */
  theme: Theme | undefined;
  /** Safe to render theme-dependent UI */
  mounted: boolean;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

function applyTheme(t: Theme) {
  const root = document.documentElement;
  if (t === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read the class already set by the blocking script
    const current = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setThemeState(current);
    setMounted(true);

    // Enable smooth transitions now that the correct theme is in place
    document.body.classList.add("theme-ready");
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    applyTheme(t);
    try {
      localStorage.setItem("theme", t);
    } catch {
      // Private browsing — ignore
    }
  }, []);

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === "light" ? "dark" : "light";
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch {}
      return next;
    });
  }, []);

  return { theme, mounted, toggle, setTheme };
}
