import type MarkdownIt from "markdown-it";
import {
  createUniqueSlugger,
  getInlinePlainText,
  slugify,
} from "@/lib/markdown/toc";
import type { MarkdownRenderEnv } from "@/lib/markdown/types";

/** 为标题生成 id 并收集 TOC 数据 */
export function applyHeadingIds(md: MarkdownIt): void {
  const defaultHeadingOpen =
    md.renderer.rules.heading_open ??
    ((tokens, idx, options, _env, self) =>
      self.renderToken(tokens, idx, options));

  md.renderer.rules.heading_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const inline = tokens[idx + 1];
    const text =
      inline?.type === "inline" ? getInlinePlainText(inline.children) : "";
    const level = Number(token.tag.slice(1));

    const renderEnv = env as MarkdownRenderEnv;
    if (!renderEnv.slugger) {
      renderEnv.slugger = createUniqueSlugger();
    }
    if (!renderEnv.tocItems) {
      renderEnv.tocItems = [];
    }

    const id = renderEnv.slugger(slugify(text));
    token.attrSet("id", id);
    renderEnv.tocItems.push({ level, text, id });

    return defaultHeadingOpen(tokens, idx, options, env, self);
  };
}
