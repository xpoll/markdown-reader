import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { isTauri } from "@tauri-apps/api/core";
import {
  getLaunchDocumentPaths,
  openFailureMessage,
  readMarkdownFromPath,
} from "@/services/fileOpen";
import type { OpenedFile } from "@/services/fileOpen";
import { readSessionDocumentPath } from "@/services/sessionDocument";

export type FileOpenSource = "session" | "launch" | "drop";

export interface FileLauncherHandlers {
  onOpenFile: (file: OpenedFile, source: FileOpenSource) => void;
  onError?: (message: string) => void;
}

/**
 * 启动恢复顺序：
 * 1. sessionStorage 中的当前文档（F5 刷新优先，避免回到启动参数里的初次文件）
 * 2. 系统文件关联 / 启动参数（双击 .md）
 * 另：窗口拖拽打开 .md
 */
export function useFileLauncher(handlers: FileLauncherHandlers): void {
  const { onOpenFile, onError } = handlers;

  useEffect(() => {
    let unlistenDrag: (() => void) | undefined;
    let disposed = false;

    void (async () => {
      if (!(await isTauri()) || disposed) return;

      const sessionPath = readSessionDocumentPath();
      if (sessionPath) {
        const outcome = await readMarkdownFromPath(sessionPath);
        if (outcome.ok && !disposed) {
          onOpenFile(outcome.file, "session");
        } else if (!disposed) {
          const launchPaths = await getLaunchDocumentPaths();
          if (launchPaths[0]) {
            const launchOutcome = await readMarkdownFromPath(launchPaths[0]);
            if (launchOutcome.ok && !disposed) {
              onOpenFile(launchOutcome.file, "launch");
            } else if (!launchOutcome.ok && !disposed) {
              const message = openFailureMessage(launchOutcome);
              if (message) onError?.(message);
            }
          } else if (!outcome.ok) {
            const message = openFailureMessage(outcome);
            if (message) onError?.(message);
          }
        }
      } else {
        const launchPaths = await getLaunchDocumentPaths();
        if (launchPaths[0] && !disposed) {
          const outcome = await readMarkdownFromPath(launchPaths[0]);
          if (outcome.ok && !disposed) {
            onOpenFile(outcome.file, "launch");
          } else if (!outcome.ok && !disposed) {
            const message = openFailureMessage(outcome);
            if (message) onError?.(message);
          }
        }
      }

      const appWindow = getCurrentWindow();
      unlistenDrag = await appWindow.onDragDropEvent(async (event) => {
        if (event.payload.type !== "drop") return;

        const markdownPath = event.payload.paths.find((path) =>
          /\.(md|markdown)$/i.test(path),
        );
        if (!markdownPath) {
          onError?.("请拖入 .md / .markdown 文件");
          return;
        }

        const outcome = await readMarkdownFromPath(markdownPath);
        if (outcome.ok) {
          onOpenFile(outcome.file, "drop");
          return;
        }
        const message = openFailureMessage(outcome);
        if (message) onError?.(message);
      });
    })();

    return () => {
      disposed = true;
      unlistenDrag?.();
    };
  }, [onOpenFile, onError]);
}
