import { invoke, isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";

const MARKDOWN_FILTERS = [
  { name: "Markdown", extensions: ["md", "markdown"] as string[] },
];

const MARKDOWN_EXT = /\.(md|markdown)$/i;

export interface OpenedFile {
  path: string;
  fileName: string;
  content: string;
}

function basename(filePath: string): string {
  const normalized = filePath.replace(/\\/g, "/");
  const parts = normalized.split("/");
  return parts[parts.length - 1] || filePath;
}

function isMarkdownPath(filePath: string): boolean {
  return MARKDOWN_EXT.test(filePath);
}

/** 读取指定路径的 Markdown 文件 */
export async function readMarkdownFromPath(
  filePath: string,
): Promise<OpenedFile | null> {
  if (!(await isTauri()) || !isMarkdownPath(filePath)) {
    return null;
  }

  try {
    const content = await readTextFile(filePath);
    return {
      path: filePath,
      fileName: basename(filePath),
      content,
    };
  } catch (error) {
    console.error("[fileOpen] read failed:", filePath, error);
    return null;
  }
}

/** 启动参数中的 .md / .markdown 路径（文件关联双击打开） */
export async function getLaunchDocumentPaths(): Promise<string[]> {
  if (!(await isTauri())) {
    return [];
  }

  try {
    return await invoke<string[]>("launch_document_paths");
  } catch {
    return [];
  }
}

/** 通过系统对话框选择工作区文件夹 */
export async function pickWorkspaceFolder(): Promise<string | null> {
  if (!(await isTauri())) {
    return null;
  }

  const selected = await open({
    multiple: false,
    directory: true,
  });

  if (selected === null || Array.isArray(selected)) {
    return null;
  }

  return selected;
}

/** 通过系统对话框选择并读取 Markdown 文件 */
export async function pickAndReadMarkdown(): Promise<OpenedFile | null> {
  if (!(await isTauri())) {
    return null;
  }

  const selected = await open({
    multiple: false,
    directory: false,
    filters: MARKDOWN_FILTERS,
  });

  if (selected === null || Array.isArray(selected)) {
    return null;
  }

  return readMarkdownFromPath(selected);
}
