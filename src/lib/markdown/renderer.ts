import MarkdownIt from "markdown-it";
import taskLists from "markdown-it-task-lists";
import multimdTable from "markdown-it-multimd-table";
import { resolveImageSrc } from "@/lib/markdown/imageResolver";
import {
  isExternalHref,
  normalizeMarkdownLinkHref,
} from "@/lib/markdown/linkResolver";
import { applyKatexMath } from "@/lib/markdown/plugins/katexMath";
import { applyHeadingIds } from "@/lib/markdown/plugins/headingIds";
import { applyMermaidFence } from "@/lib/markdown/plugins/mermaidFence";
import { buildTocTree } from "@/lib/markdown/toc";
import type {
  MarkdownRenderEnv,
  RenderMarkdownOptions,
  RenderMarkdownResult,
} from "@/lib/markdown/types";

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: false,
})
  .use(taskLists, { enabled: true, label: true, labelAfter: true })
  .use(multimdTable, { multiline: true, rowspan: true, headerless: true });

applyKatexMath(md);
applyMermaidFence(md);
applyHeadingIds(md);

const defaultLinkOpen =
  md.renderer.rules.link_open ??
  ((tokens, idx, options, _env, self) =>
    self.renderToken(tokens, idx, options));

md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const href = token.attrGet("href") ?? "";
  const normalized = normalizeMarkdownLinkHref(href);
  if (normalized !== href) {
    token.attrSet("href", normalized);
  }
  if (isExternalHref(normalized)) {
    token.attrSet("target", "_blank");
    token.attrSet("rel", "noopener noreferrer");
  }
  return defaultLinkOpen(tokens, idx, options, env, self);
};

const defaultImage =
  md.renderer.rules.image ??
  ((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

md.renderer.rules.image = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  const src = token.attrGet("src") ?? "";
  const renderEnv = env as MarkdownRenderEnv;
  const resolved = resolveImageSrc(src, {
    documentPath: renderEnv?.documentPath ?? null,
  });
  token.attrSet("src", resolved);
  const existingClass = token.attrGet("class");
  token.attrSet("class", existingClass ? `${existingClass} md-image` : "md-image");
  token.attrSet("loading", "lazy");
  return defaultImage(tokens, idx, options, env, self);
};

/** 将 Markdown 源码渲染为 HTML，并生成 TOC 树 */
export function renderMarkdown(
  source: string,
  options?: RenderMarkdownOptions,
): RenderMarkdownResult {
  const env: MarkdownRenderEnv = {
    documentPath: options?.documentPath ?? null,
    tocItems: [],
    slugger: undefined,
  };

  const html = md.render(source, env);
  const toc = buildTocTree(env.tocItems ?? []);

  return { html, toc };
}
