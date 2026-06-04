import { useEffect, useRef } from "react";
import "./search-bar.css";

interface SearchBarProps {
  query: string;
  matchIndex: number;
  matchCount: number;
  onQueryChange: (value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function SearchBar({
  query,
  matchIndex,
  matchCount,
  onQueryChange,
  onPrev,
  onNext,
  onClose,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const statusText =
    matchCount === 0
      ? query.trim()
        ? "无匹配"
        : ""
      : `${matchIndex + 1} / ${matchCount}`;

  return (
    <div className="search-bar" role="search">
      <label className="search-bar__label" htmlFor="doc-search-input">
        查找
      </label>
      <input
        id="doc-search-input"
        ref={inputRef}
        className="search-bar__input"
        type="search"
        value={query}
        placeholder="在当前文档中搜索…"
        onChange={(event) => onQueryChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            if (event.shiftKey) onPrev();
            else onNext();
          }
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
          }
        }}
      />
      <span className="search-bar__status" aria-live="polite">
        {statusText}
      </span>
      <button
        type="button"
        className="search-bar__btn"
        onClick={onPrev}
        disabled={matchCount === 0}
        title="上一个 (Shift+Enter)"
        aria-label="上一个匹配"
      >
        ↑
      </button>
      <button
        type="button"
        className="search-bar__btn"
        onClick={onNext}
        disabled={matchCount === 0}
        title="下一个 (Enter)"
        aria-label="下一个匹配"
      >
        ↓
      </button>
      <button
        type="button"
        className="search-bar__btn search-bar__btn--close"
        onClick={onClose}
        title="关闭 (Esc)"
        aria-label="关闭搜索"
      >
        ×
      </button>
    </div>
  );
}
