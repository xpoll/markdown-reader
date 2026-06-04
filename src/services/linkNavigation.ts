import { openUrl } from "@tauri-apps/plugin-opener";
import { isTauri } from "@tauri-apps/api/core";
import {
  isExternalHref,
  isLocalMarkdownHref,
  isSameDocumentHashHref,
  resolveExternalUrl,
  resolveLocalMarkdownPath,
  shouldInterceptMarkdownLink,
} from "@/lib/markdown/linkResolver";

export { shouldInterceptMarkdownLink };
import { readMarkdownFromPath } from "@/services/fileOpen";

export interface NavigateLinkOptions {
  href: string;
  documentPath: string | null;
  articleRoot: HTMLElement;
  onOpenMarkdown: (path: string) => void | Promise<void>;
}

function scrollToHash(article: HTMLElement, hash: string): void {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  const target =
    article.querySelector(`#${CSS.escape(id)}`) ??
    article.querySelector(`[id="${id}"]`);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** 处理正文内链接点击 */
export async function navigateMarkdownLink(
  options: NavigateLinkOptions,
): Promise<boolean> {
  const { href, documentPath, articleRoot, onOpenMarkdown } = options;
  const trimmed = href.trim();
  if (!trimmed) return false;

  if (isSameDocumentHashHref(trimmed)) {
    scrollToHash(articleRoot, trimmed);
    return true;
  }

  const pathPart = trimmed.split("#")[0]?.split("?")[0] ?? trimmed;

  if (isLocalMarkdownHref(pathPart)) {
    if (!(await isTauri())) return false;

    const absolutePath = resolveLocalMarkdownPath(trimmed, { documentPath });
    if (!absolutePath) return false;

    const file = await readMarkdownFromPath(absolutePath);
    if (!file) return false;

    await onOpenMarkdown(file.path);
    return true;
  }

  if (isExternalHref(trimmed)) {
    if (!(await isTauri())) return false;
    await openUrl(resolveExternalUrl(trimmed));
    return true;
  }

  return false;
}
