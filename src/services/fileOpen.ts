import { invoke, isTauri } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile } from "@tauri-apps/plugin-fs";

const MARKDOWN_FILTERS = [
  { name: "Markdown", extensions: ["md", "markdown"] as string[] },
];

const MARKDOWN_EXT = /\.(md|markdown)$/i;

const NOT_TAURI_MESSAGE =
  "浏览器预览无法打开本地文件，请使用桌面版（npm run tauri dev）";

export interface OpenedFile {
  path: string;
  fileName: string;
  content: string;
}

export type OpenFileOutcome =
  | { ok: true; file: OpenedFile }
  | { ok: false; reason: "not-tauri"; message: string }
  | { ok: false; reason: "cancelled" }
  | { ok: false; reason: "not-markdown"; message: string }
  | { ok: false; reason: "read-failed"; message: string };

export type PickFolderOutcome =
  | { ok: true; path: string }
  | { ok: false; reason: "not-tauri"; message: string }
  | { ok: false; reason: "cancelled" };

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
): Promise<OpenFileOutcome> {
  if (!(await isTauri())) {
    return { ok: false, reason: "not-tauri", message: NOT_TAURI_MESSAGE };
  }

  if (!isMarkdownPath(filePath)) {
    return {
      ok: false,
      reason: "not-markdown",
      message: "只能打开 .md / .markdown 文件",
    };
  }

  try {
    const content = await readTextFile(filePath);
    return {
      ok: true,
      file: {
        path: filePath,
        fileName: basename(filePath),
        content,
      },
    };
  } catch (error) {
    console.error("[fileOpen] read failed:", filePath, error);
    return {
      ok: false,
      reason: "read-failed",
      message: `无法打开文件：${basename(filePath)}`,
    };
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
export async function pickWorkspaceFolder(): Promise<PickFolderOutcome> {
  if (!(await isTauri())) {
    return { ok: false, reason: "not-tauri", message: NOT_TAURI_MESSAGE };
  }

  const selected = await open({
    multiple: false,
    directory: true,
  });

  if (selected === null || Array.isArray(selected)) {
    return { ok: false, reason: "cancelled" };
  }

  return { ok: true, path: selected };
}

/** 通过系统对话框选择并读取 Markdown 文件 */
export async function pickAndReadMarkdown(): Promise<OpenFileOutcome> {
  if (!(await isTauri())) {
    return { ok: false, reason: "not-tauri", message: NOT_TAURI_MESSAGE };
  }

  const selected = await open({
    multiple: false,
    directory: false,
    filters: MARKDOWN_FILTERS,
  });

  if (selected === null || Array.isArray(selected)) {
    return { ok: false, reason: "cancelled" };
  }

  return readMarkdownFromPath(selected);
}

/** 从打开结果中取出用户可见错误文案（取消选择时返回 null） */
export function openFailureMessage(
  outcome: Extract<OpenFileOutcome, { ok: false }> | Extract<PickFolderOutcome, { ok: false }>,
): string | null {
  if (outcome.reason === "cancelled") return null;
  return outcome.message;
}
