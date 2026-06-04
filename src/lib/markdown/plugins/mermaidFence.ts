import type MarkdownIt from "markdown-it";
import { escapeHtml } from "@/lib/markdown/escapeHtml";

/** 将 ```mermaid 代码块输出为 Mermaid 可识别的 DOM */
export function applyMermaidFence(md: MarkdownIt): void {
  const defaultFence =
    md.renderer.rules.fence ??
    ((tokens, idx, options, _env, self) =>
      self.renderToken(tokens, idx, options));

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const lang = (token.info ?? "").trim().split(/\s+/)[0]?.toLowerCase();

    if (lang === "mermaid") {
      const content = escapeHtml(token.content.trim());
      return `<div class="mermaid-wrapper"><pre class="mermaid">${content}</pre></div>\n`;
    }

    return defaultFence(tokens, idx, options, env, self);
  };
}
