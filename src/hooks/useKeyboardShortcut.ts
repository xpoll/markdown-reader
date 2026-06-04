import { useEffect } from "react";

export function useKeyboardShortcut(
  key: string,
  options: { ctrl?: boolean; meta?: boolean },
  handler: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const ctrl = options.ctrl ?? false;
      const meta = options.meta ?? false;
      const modifierOk =
        (ctrl && (event.ctrlKey || event.metaKey)) ||
        (meta && event.metaKey) ||
        (!ctrl && !meta);

      if (!modifierOk) return;
      if (event.key.toLowerCase() !== key.toLowerCase()) return;

      event.preventDefault();
      handler();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, options.ctrl, options.meta, handler, enabled]);
}
