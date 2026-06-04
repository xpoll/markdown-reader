import { convertFileSrc, isTauri } from "@tauri-apps/api/core";
import {
  decodePathHref,
  dirnameFromFilePath,
  isRemoteImageUrl,
  normalizeRemoteUrl,
  resolvePathAgainstBase,
} from "@/lib/path/resolve";

export interface ImageResolveContext {
  documentPath: string | null;
}

/**
 * 解析 Markdown 图片 src：
 * - 网络图片：原样（https / //）
 * - 相对 / 本地路径：相对当前 .md 所在目录，Tauri 下转为 asset URL
 */
export function resolveImageSrc(src: string, context: ImageResolveContext): string {
  const trimmed = src.trim();
  if (!trimmed) return src;

  if (isRemoteImageUrl(trimmed)) {
    return normalizeRemoteUrl(trimmed);
  }

  const { documentPath } = context;
  if (!documentPath) {
    return trimmed;
  }

  const baseDir = dirnameFromFilePath(documentPath);
  const absolutePath = resolvePathAgainstBase(decodePathHref(trimmed), baseDir);

  if (isTauri()) {
    return convertFileSrc(absolutePath);
  }

  return absolutePath;
}
