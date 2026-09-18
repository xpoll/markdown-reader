import { useState } from "react";
import { FileTreeSidebar } from "@/components/layout/FileTreeSidebar";
import { TocSidebar } from "@/components/layout/TocSidebar";
import type { FileTreeState } from "@/hooks/useFileTree";
import type { TocNode } from "@/lib/markdown";
import "./sidebar.css";

type SidebarTab = "files" | "outline";

interface SidebarProps {
  rootPath: string | null;
  activeFilePath: string | null;
  fileTree: FileTreeState;
  toc: TocNode[];
  canGoHome: boolean;
  canGoBack: boolean;
  onGoHome: () => void;
  onGoBack: () => void;
  onOpenFileFromTree: (path: string) => void;
  onOpenFolder: () => void;
}

export function Sidebar({
  rootPath,
  activeFilePath,
  fileTree,
  toc,
  canGoHome,
  canGoBack,
  onGoHome,
  onGoBack,
  onOpenFileFromTree,
  onOpenFolder,
}: SidebarProps) {
  const [tab, setTab] = useState<SidebarTab>("files");

  return (
    <div className="sidebar">
      <div className="sidebar__tabs" role="tablist" aria-label="侧栏">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "files"}
          className={`sidebar__tab${tab === "files" ? " sidebar__tab--active" : ""}`}
          onClick={() => setTab("files")}
        >
          文件
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "outline"}
          className={`sidebar__tab${tab === "outline" ? " sidebar__tab--active" : ""}`}
          onClick={() => setTab("outline")}
        >
          大纲
        </button>
      </div>
      <div className="sidebar__panel" role="tabpanel">
        {tab === "files" ? (
          <FileTreeSidebar
            rootPath={rootPath}
            activeFilePath={activeFilePath}
            tree={fileTree}
            canGoHome={canGoHome}
            canGoBack={canGoBack}
            onGoHome={onGoHome}
            onGoBack={onGoBack}
            onOpenFile={onOpenFileFromTree}
            onOpenFolder={onOpenFolder}
          />
        ) : (
          <TocSidebar items={toc} />
        )}
      </div>
    </div>
  );
}
