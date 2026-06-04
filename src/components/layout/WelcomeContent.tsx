interface WelcomeContentProps {
  onOpenFile: () => void;
  onLoadSample: () => void;
}

export function WelcomeContent({ onOpenFile, onLoadSample }: WelcomeContentProps) {
  return (
    <div className="app-content__welcome">
      <h1>Markdown Reader Lite</h1>
      <p>超轻量 Markdown 阅读器 · 只读</p>
      <p>按 Ctrl+O、拖拽或双击 .md 打开文件</p>
      <div className="app-content__actions">
        <button type="button" className="app-btn app-btn--primary" onClick={onOpenFile}>
          打开文件…
        </button>
        <button type="button" className="app-btn" onClick={onLoadSample}>
          查看示例文档
        </button>
      </div>
      <span className="app-content__phase">v0.1.0 · MVP 已就绪</span>
    </div>
  );
}
