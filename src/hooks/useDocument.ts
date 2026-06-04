import { useCallback, useMemo, useState } from "react";
import { SAMPLE_MARKDOWN } from "@/constants/sampleMarkdown";
import { renderMarkdown, type TocNode } from "@/lib/markdown";
import {
  pickAndReadMarkdown,
  readMarkdownFromPath,
  type OpenedFile,
} from "@/services/fileOpen";

export interface DocumentState {
  fileName: string | null;
  filePath: string | null;
  markdown: string | null;
  html: string | null;
  toc: TocNode[];
  isEmpty: boolean;
  openFile: () => Promise<void>;
  openFromPath: (path: string) => Promise<void>;
  openFileRecord: (file: OpenedFile) => void;
  loadSample: () => void;
}

export function useDocument(): DocumentState {
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);
  const [markdown, setMarkdownSource] = useState<string | null>(null);

  const applyFile = useCallback((file: OpenedFile) => {
    setFileName(file.fileName);
    setFilePath(file.path);
    setMarkdownSource(file.content);
  }, []);

  const openFile = useCallback(async () => {
    const file = await pickAndReadMarkdown();
    if (file) {
      applyFile(file);
    }
  }, [applyFile]);

  const openFromPath = useCallback(
    async (path: string) => {
      const file = await readMarkdownFromPath(path);
      if (file) {
        applyFile(file);
      }
    },
    [applyFile],
  );

  const openFileRecord = useCallback(
    (file: OpenedFile) => {
      applyFile(file);
    },
    [applyFile],
  );

  const loadSample = useCallback(() => {
    setFileName("示例文档.md");
    setFilePath(null);
    setMarkdownSource(SAMPLE_MARKDOWN);
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
    openFile,
    openFromPath,
    openFileRecord,
    loadSample,
  };
}
