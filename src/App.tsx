import { useCallback, useEffect } from "react";
import { AppToast } from "@/components/feedback/AppToast";
import { AppLayout } from "@/components/layout/AppLayout";
import { DocumentContent } from "@/components/layout/DocumentContent";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toolbar } from "@/components/layout/Toolbar";
import { SearchBar } from "@/components/search/SearchBar";
import { useAppToast } from "@/hooks/useAppToast";
import { useDocument } from "@/hooks/useDocument";
import { useFileLauncher, type FileOpenSource } from "@/hooks/useFileLauncher";
import { useFileTree } from "@/hooks/useFileTree";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useSearch } from "@/hooks/useSearch";
import { useTheme } from "@/hooks/useTheme";
import { useWindowTitle } from "@/hooks/useWindowTitle";
import { useWorkspace } from "@/hooks/useWorkspace";
import type { OpenedFile } from "@/services/fileOpen";

function App() {
  const toast = useAppToast();
  const showError = toast.show;

  const document = useDocument({ onError: showError });
  const { openFileRecord } = document;
  const search = useSearch(document.html !== null);
  const theme = useTheme();
  const { rootPath, canGoHome, canGoBack, syncFromFilePath, openFolder, goHome, goBack } =
    useWorkspace({
      onError: showError,
    });
  const fileTree = useFileTree(rootPath);

  useWindowTitle(document.fileName);

  useEffect(() => {
    syncFromFilePath(document.filePath);
  }, [document.filePath, syncFromFilePath]);

  const handleLauncherOpen = useCallback(
    (file: OpenedFile, source: FileOpenSource) => {
      openFileRecord(file);
      // 系统双击 / 拖拽打开：左侧文件树切到该文件所在目录
      if (source === "launch" || source === "drop") {
        syncFromFilePath(file.path, { force: true });
      }
    },
    [openFileRecord, syncFromFilePath],
  );

  useFileLauncher({ onOpenFile: handleLauncherOpen, onError: showError });

  useKeyboardShortcut("o", { ctrl: true }, () => {
    void document.openFile();
  });

  useKeyboardShortcut("f", { ctrl: true }, () => search.open(), search.canSearch);

  useKeyboardShortcut(
    "r",
    { ctrl: true },
    () => {
      void document.reload();
    },
    document.canReload,
  );

  return (
    <>
      <AppToast message={toast.message} onDismiss={toast.dismiss} />
      <AppLayout
        toolbar={
          <Toolbar
            fileName={document.fileName}
            canReload={document.canReload}
            themePreference={theme.preference}
            onThemeChange={theme.setPreference}
            onOpenFile={() => void document.openFile()}
            onOpenFolder={() => void openFolder()}
            onReload={() => void document.reload()}
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
            canGoHome={canGoHome}
            canGoBack={canGoBack}
            onGoHome={goHome}
            onGoBack={goBack}
            onOpenFileFromTree={(path) => void document.openFromPath(path)}
            onOpenFolder={() => void openFolder()}
          />
        }
        content={
          <DocumentContent
            html={document.html}
            filePath={document.filePath}
            documentEpoch={document.documentEpoch}
            pendingScrollHash={document.pendingScrollHash}
            onPendingScrollHashConsumed={document.clearPendingScrollHash}
            resolvedTheme={theme.resolved}
            searchQuery={search.isOpen ? search.query : ""}
            searchMatchIndex={search.matchIndex}
            onSearchMatchCount={search.setMatchCount}
            onOpenFile={() => void document.openFile()}
            onOpenFromPath={(path, options) =>
              void document.openFromPath(path, options)
            }
            onLoadSample={document.loadSample}
            onError={showError}
          />
        }
      />
    </>
  );
}

export default App;
