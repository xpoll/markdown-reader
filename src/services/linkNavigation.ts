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
import { extractHrefHash, scrollArticleToHash } from "@/lib/scroll";

export { shouldInterceptMarkdownLink };

export interface NavigateLinkOptions {
  href: string;
  documentPath: string | null;
  articleRoot: HTMLElement;
  onOpenMarkdown: (
    path: string,
    options?: { hash?: string },
  ) => void | Promise<void>;
  onError?: (message: string) => void;
}

/** 处理正文内链接点击 */
export async function navigateMarkdownLink(
  options: NavigateLinkOptions,
): Promise<boolean> {
  const { href, documentPath, articleRoot, onOpenMarkdown, onError } = options;
  const trimmed = href.trim();
  if (!trimmed) return false;

  if (isSameDocumentHashHref(trimmed)) {
    scrollArticleToHash(articleRoot, trimmed);
    return true;
  }

  const pathPart = trimmed.split("#")[0]?.split("?")[0] ?? trimmed;

  if (isLocalMarkdownHref(pathPart)) {
    if (!(await isTauri())) {
      onError?.("浏览器预览无法打开本地链接，请使用桌面版");
      return false;
    }

    const absolutePath = resolveLocalMarkdownPath(trimmed, { documentPath });
    if (!absolutePath) {
      onError?.("无法解析该文档链接");
      return false;
    }

    const hash = extractHrefHash(trimmed) ?? undefined;
    await onOpenMarkdown(absolutePath, { hash });
    return true;
  }

  if (isExternalHref(trimmed)) {
    if (!(await isTauri())) {
      onError?.("浏览器预览无法打开外部链接，请使用桌面版");
      return false;
    }
    try {
      await openUrl(resolveExternalUrl(trimmed));
    } catch (error) {
      console.error("[linkNavigation] openUrl failed:", error);
      onError?.("无法用系统浏览器打开该链接");
      return false;
    }
    return true;
  }

  return false;
}
