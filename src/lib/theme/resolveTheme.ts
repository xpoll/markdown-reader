import type { ResolvedTheme, ThemePreference } from "@/lib/theme/types";

const STORAGE_KEY = "markdown-reader-lite-theme";

export function readStoredThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (
      stored === "light" ||
      stored === "dark" ||
      stored === "system" ||
      stored === "sepia" ||
      stored === "forest"
    ) {
      return stored;
    }
  } catch {
    // ignore
  }
  return "system";
}

export function resolveThemePreference(preference: ThemePreference): ResolvedTheme {
  switch (preference) {
    case "dark":
      return "dark";
    case "sepia":
      return "sepia";
    case "forest":
      return "forest";
    case "light":
      return "light";
    case "system":
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    default:
      return "light";
  }
}

export function applyDocumentTheme(resolved: ResolvedTheme): void {
  document.documentElement.dataset.theme = resolved;
  const colorScheme =
    resolved === "dark" ? "dark" : resolved === "light" ? "light" : "light";
  document.documentElement.style.colorScheme = colorScheme;
}
