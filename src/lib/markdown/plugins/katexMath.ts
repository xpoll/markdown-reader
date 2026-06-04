import type MarkdownIt from "markdown-it";
import katex from "katex";
import texmath from "markdown-it-texmath";

/** 启用 $...$ 行内与 $$...$$ 块级公式（KaTeX） */
export function applyKatexMath(md: MarkdownIt): void {
  md.use(texmath, {
    engine: katex,
    delimiters: "dollars",
    katexOptions: {
      throwOnError: false,
      strict: "ignore",
      output: "html",
    },
  });
}
