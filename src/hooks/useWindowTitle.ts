import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { isTauri } from "@tauri-apps/api/core";

const DEFAULT_TITLE = "Markdown Reader Lite";

/** 任务栏 / 浏览器标签标题跟随当前文件名 */
export function useWindowTitle(fileName: string | null): void {
  useEffect(() => {
    const title = fileName ? `${fileName} · ${DEFAULT_TITLE}` : DEFAULT_TITLE;
    let cancelled = false;

    void (async () => {
      document.title = title;
      if (!(await isTauri()) || cancelled) return;
      try {
        await getCurrentWindow().setTitle(title);
      } catch (error) {
        console.error("[windowTitle] setTitle failed:", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [fileName]);
}
