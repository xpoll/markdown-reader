import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { applyGithubMarkdownCss } from "@/lib/theme/markdownGithubCss";
import {
  applyDocumentTheme,
  readStoredThemePreference,
  resolveThemePreference,
} from "@/lib/theme/resolveTheme";
import "@/styles/theme.css";
import "@/styles/theme-markdown.css";
import "@/styles/global.css";

function applyThemeBeforePaint(): void {
  const preference = readStoredThemePreference();
  const resolved = resolveThemePreference(preference);
  applyDocumentTheme(resolved);
  applyGithubMarkdownCss(resolved);
}

applyThemeBeforePaint();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
