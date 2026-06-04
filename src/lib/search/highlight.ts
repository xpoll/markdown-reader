const HIGHLIGHT_CLASS = "search-highlight";
const ACTIVE_CLASS = "search-highlight--active";

const SKIP_SELECTOR = "script, style, pre.mermaid, .mermaid-wrapper";

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function shouldSkipTextNode(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent) return true;
  if (parent.closest(SKIP_SELECTOR)) return true;
  if (parent.closest(`mark.${HIGHLIGHT_CLASS}`)) return true;
  return false;
}

/** 清除容器内搜索高亮，恢复为纯文本 */
export function clearSearchHighlights(container: HTMLElement): void {
  const marks = container.querySelectorAll(`mark.${HIGHLIGHT_CLASS}`);
  marks.forEach((mark) => {
    const text = mark.textContent ?? "";
    mark.replaceWith(document.createTextNode(text));
  });
  container.normalize();
}

/** 在容器内高亮 query，返回所有 mark 元素 */
export function applySearchHighlights(
  container: HTMLElement,
  query: string,
  caseSensitive = false,
): HTMLElement[] {
  clearSearchHighlights(container);

  const trimmed = query.trim();
  if (!trimmed) return [];

  const flags = caseSensitive ? "g" : "gi";
  const pattern = new RegExp(escapeRegExp(trimmed), flags);
  const textNodes: Text[] = [];

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  let current = walker.nextNode();
  while (current) {
    if (current instanceof Text && !shouldSkipTextNode(current)) {
      textNodes.push(current);
    }
    current = walker.nextNode();
  }

  const marks: HTMLElement[] = [];

  for (const textNode of textNodes) {
    const value = textNode.nodeValue ?? "";
    if (!pattern.test(value)) {
      pattern.lastIndex = 0;
      continue;
    }
    pattern.lastIndex = 0;

    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(value)) !== null) {
      const start = match.index;
      const matchedText = match[0];
      if (start > lastIndex) {
        fragment.appendChild(document.createTextNode(value.slice(lastIndex, start)));
      }
      const mark = document.createElement("mark");
      mark.className = HIGHLIGHT_CLASS;
      mark.textContent = matchedText;
      fragment.appendChild(mark);
      marks.push(mark);
      lastIndex = start + matchedText.length;
      if (matchedText.length === 0) break;
    }

    if (lastIndex < value.length) {
      fragment.appendChild(document.createTextNode(value.slice(lastIndex)));
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
    pattern.lastIndex = 0;
  }

  return marks;
}

/** 设置当前激活匹配项并滚动到视区 */
export function setActiveSearchMatch(
  marks: HTMLElement[],
  activeIndex: number,
): void {
  marks.forEach((mark, index) => {
    mark.classList.toggle(ACTIVE_CLASS, index === activeIndex);
  });

  const active = marks[activeIndex];
  if (active) {
    active.scrollIntoView({ block: "center", behavior: "smooth" });
  }
}
