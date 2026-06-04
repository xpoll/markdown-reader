import type { ResolvedTheme } from "@/lib/theme/types";
import darkMarkdownCss from "github-markdown-css/github-markdown-dark.css?url";
import lightMarkdownCss from "github-markdown-css/github-markdown-light.css?url";

const LINK_ID = "github-markdown-theme";

/** 按应用主题加载 GitHub Markdown 样式（不依赖系统 prefers-color-scheme） */
export function applyGithubMarkdownCss(resolved: ResolvedTheme): void {
  const href = resolved === "dark" ? darkMarkdownCss : lightMarkdownCss;
  let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.id = LINK_ID;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }
  if (link.href !== href) {
    link.href = href;
  }
}
