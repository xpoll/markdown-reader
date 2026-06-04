import { useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DocumentContent } from "@/components/layout/DocumentContent";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toolbar } from "@/components/layout/Toolbar";
import { SearchBar } from "@/components/search/SearchBar";
import { useDocument } from "@/hooks/useDocument";
import { useFileLauncher } from "@/hooks/useFileLauncher";
import { useFileTree } from "@/hooks/useFileTree";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useSearch } from "@/hooks/useSearch";
import { useTheme } from "@/hooks/useTheme";
import { useWorkspace } from "@/hooks/useWorkspace";

function App() {
  const document = useDocument();
  const search = useSearch(document.html !== null);
  const theme = useTheme();
  const { rootPath, syncFromFilePath, openFolder } = useWorkspace();
  const fileTree = useFileTree(rootPath);

  useEffect(() => {
    syncFromFilePath(document.filePath);
  }, [document.filePath, syncFromFilePath]);

  useFileLauncher(document.openFileRecord);

  useKeyboardShortcut("o", { ctrl: true }, () => {
    void document.openFile();
  });

  useKeyboardShortcut("f", { ctrl: true }, () => search.open(), search.canSearch);

  return (
    <AppLayout
      toolbar={
        <Toolbar
          fileName={document.fileName}
          themePreference={theme.preference}
          onThemeChange={theme.setPreference}
          onOpenFile={() => void document.openFile()}
          onOpenFolder={() => void openFolder()}
        />
      }
      searchBar={
        search.isOpen ? (
          <SearchBar
            query={search.query}
            matchIndex={search.matchIndex}
            matchCount={search.matchCount}
            onQueryChange={search.setQuery}
            onPrev={search.goPrev}
            onNext={search.goNext}
            onClose={search.close}
          />
        ) : null
      }
      sidebar={
        <Sidebar
          rootPath={rootPath}
          activeFilePath={document.filePath}
          fileTree={fileTree}
          toc={document.toc}
          onOpenFileFromTree={(path) => void document.openFromPath(path)}
          onOpenFolder={() => void openFolder()}
        />
      }
      content={
        <DocumentContent
          html={document.html}
          filePath={document.filePath}
          resolvedTheme={theme.resolved}
          searchQuery={search.isOpen ? search.query : ""}
          searchMatchIndex={search.matchIndex}
          onSearchMatchCount={search.setMatchCount}
          onOpenFile={() => void document.openFile()}
          onOpenFromPath={(path) => void document.openFromPath(path)}
          onLoadSample={document.loadSample}
        />
      }
    />
  );
}

export default App;
