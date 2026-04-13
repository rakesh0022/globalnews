"use client";

import { useEffect } from "react";
import { Category } from "@/types";
import { usePreferences } from "@/hooks/usePreferences";

interface Props {
  articleId: string;
  category:  Category;
}

/**
 * Invisible component — fires a "read" tracking event once when mounted.
 * Placed inside the article page to record that the user read this article.
 */
export default function ReadTracker({ articleId, category }: Props) {
  const { trackRead } = usePreferences();

  useEffect(() => {
    // Small delay so we only count it if the user actually stays on the page
    const timer = setTimeout(() => {
      trackRead(articleId, category);
    }, 5000); // 5 s dwell time = "read"

    return () => clearTimeout(timer);
  }, [articleId, category, trackRead]);

  return null;
}
