import {
  decodePathHref,
  dirnameFromFilePath,
  isRemoteImageUrl,
  normalizeRemoteUrl,
  resolvePathAgainstBase,
} from "@/lib/path/resolve";

export interface LinkResolveContext {
  documentPath: string | null;
}

const MARKDOWN_EXT = /\.(md|markdown)$/i;
const REMOTE_PROTOCOL = /^(https?|mailto|tel|data|blob):/i;

/**
 * linkify 会把 README.md 识别为 http://readme.md（.md 为有效 TLD）。
 * 将此类误识别还原为本地文件名。
 */
export function unwrapLinkifyMarkdownFilename(href: string): string | null {
  const trimmed = href.trim();
  const match = trimmed.match(/^https?:\/\/([^/?#]+)$/i);
  if (!match) return null;

  const host = match[1];
  if (!MARKDOWN_EXT.test(host)) return null;

  return host;
}

/** 是否为应在应用内打开的本地 Markdown 路径 */
export function isLocalMarkdownHref(href: string): boolean {
  const unwrapped = unwrapLinkifyMarkdownFilename(href);
  const path = (unwrapped ?? href).split("#")[0]?.split("?")[0]?.trim() ?? "";
  if (!path || REMOTE_PROTOCOL.test(path)) return false;
  if (isRemoteImageUrl(path)) return false;
  return MARKDOWN_EXT.test(path);
}

export function isExternalHref(href: string): boolean {
  const trimmed = href.trim();
  if (unwrapLinkifyMarkdownFilename(trimmed)) return false;
  return (
    /^https?:\/\//i.test(trimmed) ||
    trimmed.startsWith("//") ||
    /^mailto:/i.test(trimmed) ||
    /^tel:/i.test(trimmed)
  );
}

export function isSameDocumentHashHref(href: string): boolean {
  const trimmed = href.trim();
  return trimmed.startsWith("#") && trimmed.length > 1;
}

/** 渲染前规范化 href，避免 WebView 导航到假 URL */
export function normalizeMarkdownLinkHref(href: string): string {
  const unwrapped = unwrapLinkifyMarkdownFilename(href);
  return unwrapped ?? href;
}

/** 解析本地 Markdown 链接为绝对路径（不含 hash/query） */
export function resolveLocalMarkdownPath(
  href: string,
  context: LinkResolveContext,
): string | null {
  if (!context.documentPath) return null;

  const trimmed = decodePathHref(normalizeMarkdownLinkHref(href.trim()));
  const pathPart = trimmed.split("#")[0]?.split("?")[0]?.trim() ?? "";
  if (!pathPart || !MARKDOWN_EXT.test(pathPart)) return null;

  const baseDir = dirnameFromFilePath(context.documentPath);
  return resolvePathAgainstBase(pathPart, baseDir);
}

export function resolveExternalUrl(href: string): string {
  const trimmed = href.trim();
  if (trimmed.startsWith("//")) {
    return normalizeRemoteUrl(trimmed);
  }
  return trimmed;
}

/** 是否应由应用拦截默认导航（同步，用于 click preventDefault） */
export function shouldInterceptMarkdownLink(
  href: string,
  documentPath: string | null,
): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;
  if (isSameDocumentHashHref(trimmed)) return true;
  if (isExternalHref(trimmed)) return true;
  if (isLocalMarkdownHref(trimmed)) {
    return documentPath !== null;
  }
  return false;
}
