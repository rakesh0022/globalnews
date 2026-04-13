"use client";

import { PreferencesContext, usePreferencesState } from "@/hooks/usePreferences";

export default function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = usePreferencesState();
  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}
