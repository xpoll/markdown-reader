import type { TocNode } from "@/lib/markdown";
import { scrollToHeading } from "@/lib/markdown";
import "./toc-sidebar.css";

interface TocSidebarProps {
  items: TocNode[];
}

function TocList({ nodes }: { nodes: TocNode[] }) {
  return (
    <ul className="toc-list">
      {nodes.map((node) => (
        <li key={node.id} className={`toc-item toc-item--level-${node.level}`}>
          <button
            type="button"
            className="toc-item__btn"
            onClick={() => scrollToHeading(node.id)}
            title={node.text}
          >
            {node.text}
          </button>
          {node.children.length > 0 && <TocList nodes={node.children} />}
        </li>
      ))}
    </ul>
  );
}

export function TocSidebar({ items }: TocSidebarProps) {
  if (items.length === 0) {
    return <p className="app-toc__placeholder">本文档无标题</p>;
  }

  return (
    <nav className="toc-nav" aria-label="文档目录">
      <p className="toc-nav__title">目录</p>
      <TocList nodes={items} />
    </nav>
  );
}
