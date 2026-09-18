import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_DURATION_MS = 4200;

export interface AppToastState {
  message: string | null;
  show: (message: string) => void;
  dismiss: () => void;
}

/** 轻量顶部提示：打开失败、拖拽无效等用户可见反馈 */
export function useAppToast(durationMs = DEFAULT_DURATION_MS): AppToastState {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMessage(null);
  }, []);

  const show = useCallback(
    (next: string) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
      setMessage(next);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setMessage(null);
      }, durationMs);
    },
    [durationMs],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { message, show, dismiss };
}
