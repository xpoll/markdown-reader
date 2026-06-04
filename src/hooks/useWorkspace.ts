import { useCallback, useState } from "react";
import { dirnameFromFilePath } from "@/lib/path/resolve";
import { pickWorkspaceFolder } from "@/services/fileOpen";

const STORAGE_KEY = "markdown-reader-lite-workspace-root";
const STORAGE_KEY_PINNED = "markdown-reader-lite-workspace-pinned";

function readStoredRoot(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored && stored.length > 0 ? stored : null;
  } catch {
    return null;
  }
}

function readStoredPinned(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_PINNED) === "1";
  } catch {
    return false;
  }
}

function storeRoot(path: string | null): void {
  try {
    if (path) {
      localStorage.setItem(STORAGE_KEY, path);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY_PINNED);
    }
  } catch {
    // ignore
  }
}

function storePinned(pinned: boolean): void {
  try {
    if (pinned) {
      localStorage.setItem(STORAGE_KEY_PINNED, "1");
    } else {
      localStorage.removeItem(STORAGE_KEY_PINNED);
    }
  } catch {
    // ignore
  }
}

export interface WorkspaceState {
  rootPath: string | null;
  setRootPath: (path: string | null) => void;
  syncFromFilePath: (filePath: string | null) => void;
  openFolder: () => Promise<void>;
}

export function useWorkspace(): WorkspaceState {
  const [rootPath, setRootPathState] = useState<string | null>(readStoredRoot);
  const [rootPinned, setRootPinned] = useState(readStoredPinned);

  const setRootPath = useCallback((path: string | null, options?: { pinned?: boolean }) => {
    setRootPathState(path);
    storeRoot(path);
    if (options?.pinned !== undefined) {
      setRootPinned(options.pinned);
      storePinned(options.pinned);
    } else if (!path) {
      setRootPinned(false);
      storePinned(false);
    }
  }, []);

  const syncFromFilePath = useCallback(
    (filePath: string | null) => {
      if (rootPinned || !filePath) {
        return;
      }
      const dir = dirnameFromFilePath(filePath);
      if (dir) {
        setRootPath(dir);
      }
    },
    [rootPinned, setRootPath],
  );

  const openFolder = useCallback(async () => {
    const folder = await pickWorkspaceFolder();
    if (folder) {
      setRootPath(folder, { pinned: true });
    }
  }, [setRootPath]);

  return { rootPath, setRootPath, syncFromFilePath, openFolder };
}
