"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
} from "react";
import {
  UserPreferences,
  InteractionEvent,
  Category,
} from "@/types";
import {
  defaultPreferences,
  applyInteraction,
  loadPreferences,
  savePreferences,
  clearPreferences,
  topCategories,
} from "@/lib/preferences";

// ── Context ───────────────────────────────────────────────────────────────────

interface PreferencesContextValue {
  prefs:       UserPreferences;
  track:       (event: InteractionEvent) => void;
  trackClick:  (articleId: string, category: Category) => void;
  trackRead:   (articleId: string, category: Category) => void;
  trackCatTab: (category: Category) => void;
  topCats:     Category[];
  hasData:     boolean;
  reset:       () => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);

// ── Hook ──────────────────────────────────────────────────────────────────────

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (ctx) return ctx;

  // Fallback: standalone usage outside provider (e.g. article page)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return usePreferencesState();
}

/** Raw state hook — used by both the provider and standalone consumers */
export function usePreferencesState(): PreferencesContextValue {
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setPrefs(loadPreferences());
    setMounted(true);
  }, []);

  // Debounced save — batch rapid interactions into a single write
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const track = useCallback((event: InteractionEvent) => {
    setPrefs((prev) => {
      const next = applyInteraction(prev, event);
      // Debounce the localStorage write by 500 ms
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => savePreferences(next), 500);
      return next;
    });
  }, []);

  const trackClick = useCallback(
    (articleId: string, category: Category) =>
      track({ type: "click", articleId, category }),
    [track]
  );

  const trackRead = useCallback(
    (articleId: string, category: Category) =>
      track({ type: "read", articleId, category }),
    [track]
  );

  const trackCatTab = useCallback(
    (category: Category) =>
      track({ type: "category_click", category }),
    [track]
  );

  const reset = useCallback(() => {
    clearPreferences();
    setPrefs(defaultPreferences());
  }, []);

  const topCats = mounted ? topCategories(prefs) : [];
  const hasData = mounted && Object.keys(prefs.categoryScores).length > 0;

  return { prefs, track, trackClick, trackRead, trackCatTab, topCats, hasData, reset };
}
