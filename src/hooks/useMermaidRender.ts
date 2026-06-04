import { useLayoutEffect, useRef, type RefObject } from "react";
import { renderMermaidIn } from "@/lib/mermaid/renderMermaid";
import type { ResolvedTheme } from "@/lib/theme/types";

/** Markdown HTML 更新后，异步渲染 Mermaid 图表 */
export function useMermaidRender(
  containerRef: RefObject<HTMLElement | null>,
  html: string,
  resolvedTheme: ResolvedTheme,
  onComplete?: () => void,
): void {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    container.innerHTML = html;

    void (async () => {
      try {
        await renderMermaidIn(container, resolvedTheme);
      } catch (error) {
        if (!cancelled) {
          console.error("[mermaid] render failed:", error);
        }
      } finally {
        if (!cancelled) {
          onCompleteRef.current?.();
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [containerRef, html, resolvedTheme]);
}
