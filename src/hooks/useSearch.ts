import { useCallback, useState } from "react";

export interface SearchState {
  isOpen: boolean;
  query: string;
  matchIndex: number;
  matchCount: number;
  setQuery: (value: string) => void;
  open: () => void;
  close: () => void;
  setMatchCount: (count: number) => void;
  goNext: () => void;
  goPrev: () => void;
  canSearch: boolean;
}

export function useSearch(hasDocument: boolean): SearchState {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQueryState] = useState("");
  const [matchIndex, setMatchIndex] = useState(0);
  const [matchCount, setMatchCountState] = useState(0);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
    setMatchIndex(0);
  }, []);

  const setMatchCount = useCallback((count: number) => {
    setMatchCountState(count);
    setMatchIndex((prev) => {
      if (count === 0) return 0;
      return Math.min(prev, count - 1);
    });
  }, []);

  const open = useCallback(() => {
    if (!hasDocument) return;
    setIsOpen(true);
  }, [hasDocument]);

  const close = useCallback(() => {
    setIsOpen(false);
    setQueryState("");
    setMatchIndex(0);
    setMatchCountState(0);
  }, []);

  const goNext = useCallback(() => {
    if (matchCount === 0) return;
    setMatchIndex((prev) => (prev + 1) % matchCount);
  }, [matchCount]);

  const goPrev = useCallback(() => {
    if (matchCount === 0) return;
    setMatchIndex((prev) => (prev - 1 + matchCount) % matchCount);
  }, [matchCount]);

  return {
    isOpen,
    query,
    matchIndex,
    matchCount,
    setQuery,
    open,
    close,
    setMatchCount,
    goNext,
    goPrev,
    canSearch: hasDocument,
  };
}
