import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { applyGithubMarkdownCss } from "@/lib/theme/markdownGithubCss";
import {
  applyDocumentTheme,
  readStoredThemePreference,
  resolveThemePreference,
} from "@/lib/theme/resolveTheme";
import type { ResolvedTheme, ThemePreference } from "@/lib/theme/types";

const STORAGE_KEY = "markdown-reader-lite-theme";

function getSystemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export interface ThemeState {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
}

export function useTheme(): ThemeState {
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredThemePreference);
  const [systemDark, setSystemDark] = useState(getSystemDark);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      setSystemDark(event.matches);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const resolved = useMemo<ResolvedTheme>(() => {
    if (preference === "system") {
      return systemDark ? "dark" : "light";
    }
    if (preference === "light" || preference === "dark") {
      return preference;
    }
    return resolveThemePreference(preference);
  }, [preference, systemDark]);

  useLayoutEffect(() => {
    applyDocumentTheme(resolved);
    applyGithubMarkdownCss(resolved);
  }, [resolved]);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  return { preference, resolved, setPreference };
}
