import { useCallback, useEffect, useState } from "react";
import type { DirectoryEntry } from "@/services/directoryListing";
import { listDirectory } from "@/services/directoryListing";

export interface FileTreeState {
  expandedPaths: Set<string>;
  childrenByPath: Map<string, DirectoryEntry[]>;
  loadingPaths: Set<string>;
  toggleExpand: (path: string) => void;
  ensureExpanded: (path: string) => void;
  refreshRoot: () => void;
}

export function useFileTree(rootPath: string | null): FileTreeState {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() => new Set());
  const [childrenByPath, setChildrenByPath] = useState<Map<string, DirectoryEntry[]>>(
    () => new Map(),
  );
  const [loadingPaths, setLoadingPaths] = useState<Set<string>>(() => new Set());

  const loadChildren = useCallback(async (dirPath: string) => {
    setLoadingPaths((prev) => new Set(prev).add(dirPath));
    const entries = await listDirectory(dirPath);
    setChildrenByPath((prev) => {
      const next = new Map(prev);
      next.set(dirPath, entries);
      return next;
    });
    setLoadingPaths((prev) => {
      const next = new Set(prev);
      next.delete(dirPath);
      return next;
    });
  }, []);

  const refreshRoot = useCallback(() => {
    if (!rootPath) {
      setExpandedPaths(new Set());
      setChildrenByPath(new Map());
      return;
    }
    setExpandedPaths(new Set([rootPath]));
    void loadChildren(rootPath);
  }, [rootPath, loadChildren]);

  useEffect(() => {
    refreshRoot();
  }, [refreshRoot]);

  const ensureExpanded = useCallback(
    (path: string) => {
      setExpandedPaths((prev) => {
        if (prev.has(path)) {
          return prev;
        }
        const next = new Set(prev);
        next.add(path);
        return next;
      });
      if (!childrenByPath.has(path) && !loadingPaths.has(path)) {
        void loadChildren(path);
      }
    },
    [childrenByPath, loadingPaths, loadChildren],
  );

  const toggleExpand = useCallback(
    (path: string) => {
      setExpandedPaths((prev) => {
        const next = new Set(prev);
        if (next.has(path)) {
          next.delete(path);
        } else {
          next.add(path);
          if (!childrenByPath.has(path)) {
            void loadChildren(path);
          }
        }
        return next;
      });
    },
    [childrenByPath, loadChildren],
  );

  return {
    expandedPaths,
    childrenByPath,
    loadingPaths,
    toggleExpand,
    ensureExpanded,
    refreshRoot,
  };
}
