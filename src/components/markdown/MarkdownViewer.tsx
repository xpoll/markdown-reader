import { useCallback, useEffect, useRef, useState } from "react";
import { ImageLightbox } from "@/components/markdown/ImageLightbox";
import { useMermaidRender } from "@/hooks/useMermaidRender";
import { renderMermaidIn } from "@/lib/mermaid/renderMermaid";
import {
  applySearchHighlights,
  setActiveSearchMatch,
} from "@/lib/search/highlight";
import type { ResolvedTheme } from "@/lib/theme/types";
import {
  navigateMarkdownLink,
  shouldInterceptMarkdownLink,
} from "@/services/linkNavigation";
import "katex/dist/katex.min.css";
import "./markdown-viewer.css";

interface MarkdownViewerProps {
  html: string;
  documentPath: string | null;
  resolvedTheme: ResolvedTheme;
  searchQuery: string;
  searchMatchIndex: number;
  onSearchMatchCount: (count: number) => void;
  onOpenFromPath: (path: string) => void | Promise<void>;
}

interface LightboxState {
  src: string;
  alt: string;
}

export function MarkdownViewer({
  html,
  documentPath,
  resolvedTheme,
  searchQuery,
  searchMatchIndex,
  onSearchMatchCount,
  onOpenFromPath,
}: MarkdownViewerProps) {
  const articleRef = useRef<HTMLElement>(null);
  const marksRef = useRef<HTMLElement[]>([]);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);
  const [contentReady, setContentReady] = useState(0);

  const notifyContentReady = useCallback(() => {
    setContentReady((version) => version + 1);
  }, []);

  useMermaidRender(articleRef, html, resolvedTheme, notifyContentReady);

  const handleArticleClick = useCallback(
    (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (anchor instanceof HTMLAnchorElement) {
        const href = anchor.getAttribute("href");
        if (
          href &&
          shouldInterceptMarkdownLink(href, documentPath)
        ) {
          event.preventDefault();
          event.stopPropagation();
          const article =
            articleRef.current ?? anchor.closest("article");
          if (article) {
            void navigateMarkdownLink({
              href,
              documentPath,
              articleRoot: article,
              onOpenMarkdown: onOpenFromPath,
            });
          }
          return;
        }
      }

      const target = event.target;
      if (!(target instanceof HTMLImageElement)) return;
      if (!target.classList.contains("md-image")) return;

      setLightbox({
        src: target.currentSrc || target.src,
        alt: target.alt,
      });
    },
    [documentPath, onOpenFromPath],
  );

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    article.addEventListener("click", handleArticleClick);
    return () => article.removeEventListener("click", handleArticleClick);
  }, [html, handleArticleClick]);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;

    const trimmed = searchQuery.trim();

    if (!trimmed) {
      marksRef.current = [];
      onSearchMatchCount(0);
      const hasMarks = article.querySelector("mark.search-highlight");
      if (hasMarks) {
        article.innerHTML = html;
        void renderMermaidIn(article, resolvedTheme).then(notifyContentReady);
      }
      return;
    }

    const marks = applySearchHighlights(article, trimmed);
    marksRef.current = marks;
    onSearchMatchCount(marks.length);
    setActiveSearchMatch(marks, searchMatchIndex);
  }, [
    contentReady,
    searchQuery,
    html,
    resolvedTheme,
    onSearchMatchCount,
    notifyContentReady,
    searchMatchIndex,
  ]);

  useEffect(() => {
    setActiveSearchMatch(marksRef.current, searchMatchIndex);
  }, [searchMatchIndex]);

  return (
    <>
      <article
        ref={articleRef}
        className="markdown-body markdown-viewer"
      />
      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
