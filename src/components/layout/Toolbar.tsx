import { ThemeSelect } from "@/components/theme/ThemeSelect";
import type { ThemePreference } from "@/lib/theme/types";

interface ToolbarProps {
  fileName: string | null;
  themePreference: ThemePreference;
  onThemeChange: (preference: ThemePreference) => void;
  onOpenFile: () => void;
  onOpenFolder: () => void;
}

export function Toolbar({
  fileName,
  themePreference,
  onThemeChange,
  onOpenFile,
  onOpenFolder,
}: ToolbarProps) {
  return (
    <header className="app-toolbar">
      <span className="app-toolbar__title">Markdown Reader Lite</span>
      <div className="app-toolbar__actions">
        <ThemeSelect value={themePreference} onChange={onThemeChange} />
        <button
          type="button"
          className="app-btn app-btn--toolbar"
          onClick={onOpenFolder}
          title="打开文件夹"
        >
          文件夹
        </button>
        <button
          type="button"
          className="app-btn app-btn--toolbar"
          onClick={onOpenFile}
          title="打开文件 (Ctrl+O)"
        >
          打开
        </button>
        {fileName && <span className="app-toolbar__file">{fileName}</span>}
      </div>
    </header>
  );
}
