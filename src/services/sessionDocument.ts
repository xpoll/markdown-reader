/** 当前会话内打开的文档路径（F5 刷新后恢复，进程退出后清空） */
const SESSION_DOC_KEY = "markdown-reader-lite-session-document";

export function readSessionDocumentPath(): string | null {
  try {
    const stored = sessionStorage.getItem(SESSION_DOC_KEY);
    return stored && stored.length > 0 ? stored : null;
  } catch {
    return null;
  }
}

export function writeSessionDocumentPath(path: string | null): void {
  try {
    if (path) {
      sessionStorage.setItem(SESSION_DOC_KEY, path);
    } else {
      sessionStorage.removeItem(SESSION_DOC_KEY);
    }
  } catch {
    // ignore
  }
}
