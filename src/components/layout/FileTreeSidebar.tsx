import { useEffect } from "react";
import type { FileTreeState } from "@/hooks/useFileTree";
import type { DirectoryEntry } from "@/services/directoryListing";
import { dirnameFromFilePath } from "@/lib/path/resolve";
import "./file-tree-sidebar.css";

interface FileTreeSidebarProps {
  rootPath: string | null;
  activeFilePath: string | null;
  tree: FileTreeState;
  canGoHome: boolean;
  canGoBack: boolean;
  onGoHome: () => void;
  onGoBack: () => void;
  onOpenFile: (path: string) => void;
  onOpenFolder: () => void;
}

function basename(path: string): string {
  const normalized = path.replace(/\\/g, "/");
  const parts = normalized.split("/");
  return parts[parts.length - 1] || path;
}

function IconHome() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 1.5 1.5 7h1.8v6.5h3.4V10h2.6v3.5h3.4V7H14.5L8 1.5z" />
    </svg>
  );
}

function IconBack() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M9.5 3.2 4.7 8l4.8 4.8 1.1-1.1L6.9 8l3.7-3.7-1.1-1.1z" />
    </svg>
  );
}

function IconChangeFolder() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M1.5 3.2h4.2l1.3 1.6h7.5v8H1.5v-9.6zm1.3 1.3v7h10.4V6.1H6.5l-1.3-1.6H2.8z" />
    </svg>
  );
}

function TreeNode({
  entry,
  depth,
  activeFilePath,
  tree,
  onOpenFile,
}: {
  entry: DirectoryEntry;
  depth: number;
  activeFilePath: string | null;
  tree: FileTreeState;
  onOpenFile: (path: string) => void;
}) {
  const isExpanded = tree.expandedPaths.has(entry.path);
  const isLoading = tree.loadingPaths.has(entry.path);
  const children = tree.childrenByPath.get(entry.path) ?? [];
  const isActive = !entry.isDirectory && activeFilePath === entry.path;

  if (entry.isDirectory) {
    return (
      <li className="file-tree__item" role="treeitem" aria-expanded={isExpanded}>
        <div
          className="file-tree__row"
          style={{ paddingLeft: `${8 + depth * 14}px` }}
        >
          <button
            type="button"
            className="file-tree__chevron"
            onClick={() => tree.toggleExpand(entry.path)}
            aria-label={isExpanded ? "收起文件夹" : "展开文件夹"}
          >
            {isLoading ? "…" : isExpanded ? "▾" : "▸"}
          </button>
          <button
            type="button"
            className="file-tree__label file-tree__label--dir"
            onClick={() => tree.toggleExpand(entry.path)}
            title={entry.path}
          >
            <span className="file-tree__icon" aria-hidden>
              📁
            </span>
            {entry.name}
          </button>
        </div>
        {isExpanded && children.length > 0 && (
          <ul className="file-tree__children" role="group">
            {children.map((child) => (
              <TreeNode
                key={child.path}
                entry={child}
                depth={depth + 1}
                activeFilePath={activeFilePath}
                tree={tree}
                onOpenFile={onOpenFile}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className="file-tree__item" role="treeitem">
      <div
        className={`file-tree__row${isActive ? " file-tree__row--active" : ""}`}
        style={{ paddingLeft: `${22 + depth * 14}px` }}
      >
        <button
          type="button"
          className="file-tree__label file-tree__label--file"
          onClick={() => onOpenFile(entry.path)}
          title={entry.path}
        >
          <span className="file-tree__icon" aria-hidden>
            📄
          </span>
          {entry.name}
        </button>
      </div>
    </li>
  );
}

export function FileTreeSidebar({
  rootPath,
  activeFilePath,
  tree,
  canGoHome,
  canGoBack,
  onGoHome,
  onGoBack,
  onOpenFile,
  onOpenFolder,
}: FileTreeSidebarProps) {
  const { ensureExpanded } = tree;

  useEffect(() => {
    if (!rootPath || !activeFilePath) {
      return;
    }
    let dir = dirnameFromFilePath(activeFilePath);
    const chain: string[] = [];
    const rootNorm = rootPath.replace(/\\/g, "/").toLowerCase();
    while (dir && dir.length >= rootPath.length) {
      chain.push(dir);
      const dirNorm = dir.replace(/\\/g, "/").toLowerCase();
      if (dirNorm === rootNorm) {
        break;
      }
      const parent = dirnameFromFilePath(dir);
      if (parent === dir) {
        break;
      }
      dir = parent;
    }
    for (const path of chain.reverse()) {
      ensureExpanded(path);
    }
  }, [rootPath, activeFilePath, ensureExpanded]);

  if (!rootPath) {
    return (
      <div className="file-tree file-tree--empty">
        <p className="file-tree__hint">打开文件夹或 Markdown 文件后，将在此显示目录结构。</p>
        <button type="button" className="app-btn app-btn--toolbar" onClick={onOpenFolder}>
          打开文件夹…
        </button>
      </div>
    );
  }

  const rootEntries = tree.childrenByPath.get(rootPath) ?? [];
  const rootName = basename(rootPath);

  return (
    <div className="file-tree">
      <div className="file-tree__header">
        <div className="file-tree__nav">
          <button
            type="button"
            className="file-tree__icon-btn"
            onClick={onGoHome}
            disabled={!canGoHome}
            title="回到工作区根目录"
            aria-label="回到工作区根目录"
          >
            <IconHome />
          </button>
          <button
            type="button"
            className="file-tree__icon-btn"
            onClick={onGoBack}
            disabled={!canGoBack}
            title="上一级目录"
            aria-label="上一级目录"
          >
            <IconBack />
          </button>
        </div>
        <span className="file-tree__root" title={rootPath}>
          {rootName}
        </span>
        <button
          type="button"
          className="file-tree__icon-btn"
          onClick={onOpenFolder}
          title="更换文件夹"
          aria-label="更换文件夹"
        >
          <IconChangeFolder />
        </button>
      </div>
      <ul className="file-tree__list" role="tree" aria-label="文件目录">
        {rootEntries.map((entry) => (
          <TreeNode
            key={entry.path}
            entry={entry}
            depth={0}
            activeFilePath={activeFilePath}
            tree={tree}
            onOpenFile={onOpenFile}
          />
        ))}
      </ul>
    </div>
  );
}
