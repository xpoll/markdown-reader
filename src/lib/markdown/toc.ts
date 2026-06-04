interface MdInlineToken {
  type: string;
  content: string;
  children?: MdInlineToken[] | null;
}

export interface TocItem {
  level: number;
  text: string;
  id: string;
}

export interface TocNode {
  level: number;
  text: string;
  id: string;
  children: TocNode[];
}

/** 从 inline token 子节点提取纯文本 */
export function getInlinePlainText(
  children: MdInlineToken[] | null | undefined,
): string {
  if (!children) return "";

  return children
    .map((child) => {
      if (child.type === "text" || child.type === "code_inline") {
        return child.content;
      }
      if (child.children) {
        return getInlinePlainText(child.children);
      }
      return "";
    })
    .join("");
}

export function slugify(text: string): string {
  const slug = text
    .trim()
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/gu, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
}

export function createUniqueSlugger(): (base: string) => string {
  const counts = new Map<string, number>();

  return (base: string) => {
    const used = counts.get(base) ?? 0;
    counts.set(base, used + 1);
    return used === 0 ? base : `${base}-${used}`;
  };
}

/** 将扁平标题列表转为树形目录（按 level 嵌套） */
export function buildTocTree(items: TocItem[]): TocNode[] {
  const root: TocNode[] = [];
  const stack: { level: number; node: TocNode }[] = [];

  for (const item of items) {
    const node: TocNode = {
      level: item.level,
      text: item.text,
      id: item.id,
      children: [],
    };

    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      stack[stack.length - 1].node.children.push(node);
    }

    stack.push({ level: item.level, node });
  }

  return root;
}

/** 滚动内容区到指定标题 */
export function scrollToHeading(headingId: string): void {
  const heading = document.getElementById(headingId);
  const scrollContainer = document.querySelector<HTMLElement>(".app-content");
  if (!heading || !scrollContainer) return;

  const containerTop = scrollContainer.getBoundingClientRect().top;
  const headingTop = heading.getBoundingClientRect().top;
  const top = headingTop - containerTop + scrollContainer.scrollTop - 12;

  scrollContainer.scrollTo({ top, behavior: "smooth" });
}
