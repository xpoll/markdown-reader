import { useCallback, useMemo, useState } from "react";
import { SAMPLE_MARKDOWN } from "@/constants/sampleMarkdown";
import { renderMarkdown, type TocNode } from "@/lib/markdown";
import {
  openFailureMessage,
  pickAndReadMarkdown,
  readMarkdownFromPath,
  type OpenedFile,
} from "@/services/fileOpen";
import { writeSessionDocumentPath } from "@/services/sessionDocument";

export interface OpenFromPathOptions {
  /** 打开后滚动到的标题锚点，如 `#安装` */
  hash?: string;
}

export interface DocumentState {
  fileName: string | null;
  filePath: string | null;
  markdown: string | null;
  html: string | null;
  toc: TocNode[];
  isEmpty: boolean;
  /** 切换文档时递增；刷新同路径不递增（用于滚回顶部） */
  documentEpoch: number;
  /** 跨文件链接带来的待滚动锚点 */
  pendingScrollHash: string | null;
  clearPendingScrollHash: () => void;
  canReload: boolean;
  openFile: () => Promise<void>;
  openFromPath: (path: string, options?: OpenFromPathOptions) => Promise<void>;
  openFileRecord: (file: OpenedFile) => void;
  reload: () => Promise<void>;
  loadSample: () => void;
}

export interface UseDocumentOptions {
  onError?: (message: string) => void;
}

export function useDocument(options: UseDocumentOptions = {}): DocumentState {
  const { onError } = options;
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [markdown, setMarkdownSource] = useState<string | null>(null);
  const [documentEpoch, setDocumentEpoch] = useState(0);
  const [pendingScrollHash, setPendingScrollHash] = useState<string | null>(
    null,
  );

  const reportError = useCallback(
    (message: string) => {
      onError?.(message);
    },
    [onError],
  );

  const applyFile = useCallback(
    (
      file: OpenedFile,
      applyOptions?: { hash?: string; isReload?: boolean },
    ) => {
      setFileName(file.fileName);
      setFilePath(file.path);
      setMarkdownSource(file.content);
      writeSessionDocumentPath(file.path);
      if (!applyOptions?.isReload) {
        setDocumentEpoch((epoch) => epoch + 1);
        setPendingScrollHash(applyOptions?.hash ?? null);
      }
    },
    [],
  );

  const openFile = useCallback(async () => {
    const outcome = await pickAndReadMarkdown();
    if (outcome.ok) {
      applyFile(outcome.file);
      return;
    }
    const message = openFailureMessage(outcome);
    if (message) reportError(message);
  }, [applyFile, reportError]);

  const openFromPath = useCallback(
    async (path: string, pathOptions?: OpenFromPathOptions) => {
      const outcome = await readMarkdownFromPath(path);
      if (outcome.ok) {
        applyFile(outcome.file, { hash: pathOptions?.hash });
        return;
      }
      const message = openFailureMessage(outcome);
      if (message) reportError(message);
    },
    [applyFile, reportError],
  );

  const openFileRecord = useCallback(
    (file: OpenedFile) => {
      applyFile(file);
    },
    [applyFile],
  );

  const reload = useCallback(async () => {
    if (!filePath) {
      reportError("当前是示例文档，没有可刷新的本地文件");
      return;
    }
    const outcome = await readMarkdownFromPath(filePath);
    if (outcome.ok) {
      applyFile(outcome.file, { isReload: true });
      return;
    }
    const message = openFailureMessage(outcome);
    if (message) reportError(message);
  }, [applyFile, filePath, reportError]);

  const loadSample = useCallback(() => {
    setFileName("示例文档.md");
    setFilePath(null);
    setMarkdownSource(SAMPLE_MARKDOWN);
    writeSessionDocumentPath(null);
    setDocumentEpoch((epoch) => epoch + 1);
    setPendingScrollHash(null);
  }, []);

  const clearPendingScrollHash = useCallback(() => {
    setPendingScrollHash(null);
  }, []);

  const rendered = useMemo(() => {
    if (markdown === null) {
      return { html: null as string | null, toc: [] as TocNode[] };
    }
    const result = renderMarkdown(markdown, { documentPath: filePath });
    return { html: result.html, toc: result.toc };
  }, [markdown, filePath]);

  return {
    fileName,
    filePath,
    markdown,
    html: rendered.html,
    toc: rendered.toc,
    isEmpty: markdown === null,
    documentEpoch,
    pendingScrollHash,
    clearPendingScrollHash,
    canReload: filePath !== null,
    openFile,
    openFromPath,
    openFileRecord,
    reload,
    loadSample,
  };
}
