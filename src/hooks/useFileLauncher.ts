import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { isTauri } from "@tauri-apps/api/core";
import { getLaunchDocumentPaths, readMarkdownFromPath } from "@/services/fileOpen";
import type { OpenedFile } from "@/services/fileOpen";

/** 启动参数打开文件 + 窗口拖拽打开 .md */
export function useFileLauncher(onOpenFile: (file: OpenedFile) => void): void {
  useEffect(() => {
    let unlistenDrag: (() => void) | undefined;
    let disposed = false;

    void (async () => {
      if (!(await isTauri()) || disposed) return;

      const launchPaths = await getLaunchDocumentPaths();
      if (launchPaths[0]) {
        const file = await readMarkdownFromPath(launchPaths[0]);
        if (file) onOpenFile(file);
      }

      const appWindow = getCurrentWindow();
      unlistenDrag = await appWindow.onDragDropEvent(async (event) => {
        if (event.payload.type !== "drop") return;

        const markdownPath = event.payload.paths.find((path) =>
          /\.(md|markdown)$/i.test(path),
        );
        if (!markdownPath) return;

        const file = await readMarkdownFromPath(markdownPath);
        if (file) onOpenFile(file);
      });
    })();

    return () => {
      disposed = true;
      unlistenDrag?.();
    };
  }, [onOpenFile]);
}
