import { useCallback, useState } from "react";
import { dirnameFromFilePath } from "@/lib/path/resolve";
import { openFailureMessage, pickWorkspaceFolder } from "@/services/fileOpen";

/** 使用 sessionStorage：每个窗口独立，多开互不串台；F5 仍可恢复本窗口状态 */
const STORAGE_KEY = "markdown-reader-lite-workspace-root";
const STORAGE_KEY_HOME = "markdown-reader-lite-workspace-home";
const STORAGE_KEY_PINNED = "markdown-reader-lite-workspace-pinned";

function clearLegacyLocalWorkspace(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY_HOME);
    localStorage.removeItem(STORAGE_KEY_PINNED);
  } catch {
    // ignore
  }
}

function readStoredRoot(): string | null {
  clearLegacyLocalWorkspace();
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored && stored.length > 0 ? stored : null;
  } catch {
    return null;
  }
}

function readStoredHome(fallbackRoot: string | null): string | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY_HOME);
    if (stored && stored.length > 0) {
      return stored;
    }
  } catch {
    // ignore
  }
  return fallbackRoot;
}

function readStoredPinned(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY_PINNED) === "1";
  } catch {
    return false;
  }
}

function storeRoot(path: string | null): void {
  try {
    if (path) {
      sessionStorage.setItem(STORAGE_KEY, path);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY_HOME);
      sessionStorage.removeItem(STORAGE_KEY_PINNED);
    }
  } catch {
    // ignore
  }
}

function storeHome(path: string | null): void {
  try {
    if (path) {
      sessionStorage.setItem(STORAGE_KEY_HOME, path);
    } else {
      sessionStorage.removeItem(STORAGE_KEY_HOME);
    }
  } catch {
    // ignore
  }
}

function storePinned(pinned: boolean): void {
  try {
    if (pinned) {
      sessionStorage.setItem(STORAGE_KEY_PINNED, "1");
    } else {
      sessionStorage.removeItem(STORAGE_KEY_PINNED);
    }
  } catch {
    // ignore
  }
}

function normalizePathKey(path: string): string {
  return path.replace(/\\/g, "/").replace(/\/+$/, "").toLowerCase();
}

function pathsEqual(a: string, b: string): boolean {
  return normalizePathKey(a) === normalizePathKey(b);
}

/** path 是否等于 root，或位于 root 之下 */
function isEqualOrUnder(path: string, root: string): boolean {
  const p = normalizePathKey(path);
  const r = normalizePathKey(root);
  return p === r || p.startsWith(`${r}/`);
}

function parentDirectory(path: string): string | null {
  const parent = dirnameFromFilePath(path);
  if (!parent || parent === path) {
    return null;
  }
  return parent;
}

export interface SyncFromFileOptions {
  /** 强制切到该文件所在目录（例如系统双击打开），并取消「打开文件夹」固定 */
  force?: boolean;
}

export interface SetRootPathOptions {
  pinned?: boolean;
  /** 是否同时更新 Home 锚点；默认 false（Home 仅首次打开 / 更换文件夹时更新） */
  asHome?: boolean;
}

export interface WorkspaceState {
  rootPath: string | null;
  homePath: string | null;
  canGoHome: boolean;
  canGoBack: boolean;
  setRootPath: (path: string | null, options?: SetRootPathOptions) => void;
  syncFromFilePath: (filePath: string | null, options?: SyncFromFileOptions) => void;
  openFolder: () => Promise<void>;
  goHome: () => void;
  goBack: () => void;
}

export interface UseWorkspaceOptions {
  onError?: (message: string) => void;
}

export function useWorkspace(options: UseWorkspaceOptions = {}): WorkspaceState {
  const { onError } = options;
  const initialRoot = readStoredRoot();
  const [rootPath, setRootPathState] = useState<string | null>(initialRoot);
  const [homePath, setHomePathState] = useState<string | null>(() =>
    readStoredHome(initialRoot),
  );
  const [rootPinned, setRootPinned] = useState(readStoredPinned);

  const setRootPath = useCallback((path: string | null, options?: SetRootPathOptions) => {
    setRootPathState(path);
    storeRoot(path);

    if (!path) {
      setHomePathState(null);
      storeHome(null);
      setRootPinned(false);
      storePinned(false);
      return;
    }

    // 仅显式 asHome: true 时更新 Home（首次打开 / 更换文件夹）
    if (options?.asHome === true) {
      setHomePathState(path);
      storeHome(path);
    }

    if (options?.pinned !== undefined) {
      setRootPinned(options.pinned);
      storePinned(options.pinned);
    }
  }, []);

  const syncFromFilePath = useCallback(
    (filePath: string | null, options?: SyncFromFileOptions) => {
      if (!filePath) {
        return;
      }
      const dir = dirnameFromFilePath(filePath);
      if (!dir) {
        return;
      }

      const isFirstHome = !homePath;
      const force = options?.force === true;

      // 系统双击 / 拖拽：切换当前浏览目录；窗口已有 Home 时不改 Home
      if (force) {
        setRootPath(dir, { pinned: false, asHome: isFirstHome });
        return;
      }

      // 已「打开文件夹」固定：只在文件仍属于 Home 树内时跟随到文件所在目录
      if (rootPinned && homePath) {
        if (isEqualOrUnder(dir, homePath)) {
          setRootPath(dir, { asHome: false });
        }
        return;
      }

      // 未固定：浏览目录跟随文件；仅首次设立 Home
      setRootPath(dir, { asHome: isFirstHome });
    },
    [homePath, rootPinned, setRootPath],
  );

  const openFolder = useCallback(async () => {
    const outcome = await pickWorkspaceFolder();
    if (outcome.ok) {
      // 主动更换文件夹：同时重置 Home
      setRootPath(outcome.path, { pinned: true, asHome: true });
      return;
    }
    const message = openFailureMessage(outcome);
    if (message) onError?.(message);
  }, [onError, setRootPath]);

  const goHome = useCallback(() => {
    if (!homePath) {
      return;
    }
    setRootPathState(homePath);
    storeRoot(homePath);
  }, [homePath]);

  const goBack = useCallback(() => {
    if (!rootPath) {
      return;
    }
    const parent = parentDirectory(rootPath);
    if (!parent) {
      return;
    }
    setRootPathState(parent);
    storeRoot(parent);
  }, [rootPath]);

  const canGoHome = Boolean(rootPath && homePath) && !pathsEqual(rootPath!, homePath!);
  const canGoBack = Boolean(rootPath && parentDirectory(rootPath));

  return {
    rootPath,
    homePath,
    canGoHome,
    canGoBack,
    setRootPath,
    syncFromFilePath,
    openFolder,
    goHome,
    goBack,
  };
}
