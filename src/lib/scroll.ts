/** 正文滚动容器（AppLayout 的 main.app-content） */
export function getContentScrollContainer(): HTMLElement | null {
  return document.querySelector(".app-content");
}

export function scrollContentToTop(): void {
  const container = getContentScrollContainer();
  if (container) {
    container.scrollTop = 0;
  }
}

/** 在文章内按 heading id 滚动（支持 URL 编码的中文 id） */
export function scrollArticleToHash(
  article: HTMLElement,
  hash: string,
): boolean {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return false;

  const target =
    article.querySelector(`#${CSS.escape(id)}`) ??
    article.querySelector(`[id="${id}"]`);
  if (!target) return false;

  target.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/** 从链接中取出 #hash 段（含 #）；无则返回 null */
export function extractHrefHash(href: string): string | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex < 0) return null;
  const hash = href.slice(hashIndex).split("?")[0] ?? "";
  return hash.length > 1 ? hash : null;
}
