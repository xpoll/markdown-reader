import type { TocItem, TocNode } from "@/lib/markdown/toc";

export interface MarkdownRenderEnv {
  documentPath: string | null;
  tocItems?: TocItem[];
  slugger?: (base: string) => string;
}

export interface RenderMarkdownOptions {
  documentPath?: string | null;
}

export interface RenderMarkdownResult {
  html: string;
  toc: TocNode[];
}
