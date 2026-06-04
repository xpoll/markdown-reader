import type { ResolvedTheme } from "@/lib/theme/types";

interface MermaidApi {
  initialize: (config: Record<string, unknown>) => void;
  run: (options: { nodes: HTMLElement[] }) => Promise<void>;
}

let mermaidApi: MermaidApi | null = null;
let lastTheme: ResolvedTheme | null = null;

async function loadMermaid(): Promise<MermaidApi> {
  if (!mermaidApi) {
    const mod = await import("mermaid");
    mermaidApi = mod.default as MermaidApi;
  }
  return mermaidApi;
}

function getMermaidTheme(resolved: ResolvedTheme): "dark" | "neutral" {
  return resolved === "dark" ? "dark" : "neutral";
}

async function ensureMermaidInit(resolved: ResolvedTheme): Promise<MermaidApi> {
  const mermaid = await loadMermaid();
  if (lastTheme === resolved) {
    return mermaid;
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: getMermaidTheme(resolved),
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  });
  lastTheme = resolved;
  return mermaid;
}

/** 在容器内渲染所有未处理的 Mermaid 图表 */
export async function renderMermaidIn(
  container: HTMLElement,
  resolvedTheme: ResolvedTheme,
): Promise<void> {
  const nodes = container.querySelectorAll<HTMLElement>("pre.mermaid");
  if (nodes.length === 0) return;

  const mermaid = await ensureMermaidInit(resolvedTheme);
  await mermaid.run({ nodes: Array.from(nodes) });
}
