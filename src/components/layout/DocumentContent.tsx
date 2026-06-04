import { MarkdownViewer } from "@/components/markdown/MarkdownViewer";
import { WelcomeContent } from "@/components/layout/WelcomeContent";
import type { ResolvedTheme } from "@/lib/theme/types";

interface DocumentContentProps {
  html: string | null;
  filePath: string | null;
  resolvedTheme: ResolvedTheme;
  searchQuery: string;
  searchMatchIndex: number;
  onSearchMatchCount: (count: number) => void;
  onOpenFile: () => void;
  onOpenFromPath: (path: string) => void | Promise<void>;
  onLoadSample: () => void;
}

export function DocumentContent({
  html,
  filePath,
  resolvedTheme,
  searchQuery,
  searchMatchIndex,
  onSearchMatchCount,
  onOpenFile,
  onOpenFromPath,
  onLoadSample,
}: DocumentContentProps) {
  if (html === null) {
    return <WelcomeContent onOpenFile={onOpenFile} onLoadSample={onLoadSample} />;
  }

  return (
    <MarkdownViewer
      html={html}
      documentPath={filePath}
      resolvedTheme={resolvedTheme}
      searchQuery={searchQuery}
      searchMatchIndex={searchMatchIndex}
      onSearchMatchCount={onSearchMatchCount}
      onOpenFromPath={onOpenFromPath}
    />
  );
}
