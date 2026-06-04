import type { ReactNode } from "react";
import "@/styles/layout.css";

interface AppLayoutProps {
  toolbar: ReactNode;
  searchBar?: ReactNode;
  sidebar: ReactNode;
  content: ReactNode;
}

/** PRD 布局：Toolbar + 侧栏（文件树 / 大纲）+ Content */
export function AppLayout({ toolbar, searchBar, sidebar, content }: AppLayoutProps) {
  return (
    <div className="app-layout">
      {toolbar}
      {searchBar}
      <div className="app-body">
        <aside className="app-sidebar">{sidebar}</aside>
        <main className="app-content">{content}</main>
      </div>
    </div>
  );
}
