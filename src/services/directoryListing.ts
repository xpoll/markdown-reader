import { isTauri } from "@tauri-apps/api/core";
import { readDir } from "@tauri-apps/plugin-fs";

const MARKDOWN_EXT = /\.(md|markdown)$/i;

/** 列表中忽略的目录（减小噪音、加快加载） */
const SKIP_DIR_NAMES = new Set([
  ".git",
  "node_modules",
  "target",
  "dist",
  ".vite",
  ".turbo",
  "coverage",
]);

export interface DirectoryEntry {
  name: string;
  path: string;
  isDirectory: boolean;
}

function compareEntries(a: DirectoryEntry, b: DirectoryEntry): number {
  if (a.isDirectory !== b.isDirectory) {
    return a.isDirectory ? -1 : 1;
  }
  return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
}

/** 读取单层目录：子文件夹 + Markdown 文件 */
export async function listDirectory(dirPath: string): Promise<DirectoryEntry[]> {
  if (!(await isTauri())) {
    return [];
  }

  try {
    const entries = await readDir(dirPath);
    const result: DirectoryEntry[] = [];

    for (const entry of entries) {
      const name = entry.name ?? "";
      if (!name || name.startsWith(".")) {
        continue;
      }

      const childPath = joinPath(dirPath, name);

      if (entry.isDirectory) {
        if (SKIP_DIR_NAMES.has(name)) {
          continue;
        }
        result.push({ name, path: childPath, isDirectory: true });
      } else if (entry.isFile && MARKDOWN_EXT.test(name)) {
        result.push({ name, path: childPath, isDirectory: false });
      }
    }

    return result.sort(compareEntries);
  } catch (error) {
    console.error("[directoryListing] read failed:", dirPath, error);
    return [];
  }
}

function joinPath(base: string, name: string): string {
  const separator = base.includes("\\") ? "\\" : "/";
  if (base.endsWith(separator)) {
    return `${base}${name}`;
  }
  return `${base}${separator}${name}`;
}
