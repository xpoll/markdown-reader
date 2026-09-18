import { MarkdownViewer } from "@/components/markdown/MarkdownViewer";
import { WelcomeContent } from "@/components/layout/WelcomeContent";
import type { ResolvedTheme } from "@/lib/theme/types";

interface DocumentContentProps {
  html: string | null;
  filePath: string | null;
  documentEpoch: number;
  pendingScrollHash: string | null;
  onPendingScrollHashConsumed: () => void;
  resolvedTheme: ResolvedTheme;
  searchQuery: string;
  searchMatchIndex: number;
  onSearchMatchCount: (count: number) => void;
  onOpenFile: () => void;
  onOpenFromPath: (
    path: string,
    options?: { hash?: string },
  ) => void | Promise<void>;
  onLoadSample: () => void;
  onError?: (message: string) => void;
}

export function DocumentContent({
  html,
  filePath,
  documentEpoch,
  pendingScrollHash,
  onPendingScrollHashConsumed,
  resolvedTheme,
  searchQuery,
  searchMatchIndex,
  onSearchMatchCount,
  onOpenFile,
  onOpenFromPath,
  onLoadSample,
  onError,
}: DocumentContentProps) {
  if (html === null) {
    return <WelcomeContent onOpenFile={onOpenFile} onLoadSample={onLoadSample} />;
  }

  return (
    <MarkdownViewer
      html={html}
      documentPath={filePath}
      documentEpoch={documentEpoch}
      pendingScrollHash={pendingScrollHash}
      onPendingScrollHashConsumed={onPendingScrollHashConsumed}
      resolvedTheme={resolvedTheme}
      searchQuery={searchQuery}
      searchMatchIndex={searchMatchIndex}
      onSearchMatchCount={onSearchMatchCount}
      onOpenFromPath={onOpenFromPath}
      onError={onError}
    />
  );
}
