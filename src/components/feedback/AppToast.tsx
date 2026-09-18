import "./app-toast.css";

interface AppToastProps {
  message: string | null;
  onDismiss: () => void;
}

export function AppToast({ message, onDismiss }: AppToastProps) {
  if (!message) return null;

  return (
    <div className="app-toast" role="status" aria-live="polite">
      <span className="app-toast__text">{message}</span>
      <button
        type="button"
        className="app-toast__close"
        onClick={onDismiss}
        aria-label="关闭提示"
      >
        ×
      </button>
    </div>
  );
}
