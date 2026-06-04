/** 判断是否为网络或 data URL */
export function isRemoteImageUrl(src: string): boolean {
  const trimmed = src.trim();
  return (
    /^https?:\/\//i.test(trimmed) ||
    /^data:/i.test(trimmed) ||
    /^blob:/i.test(trimmed) ||
    trimmed.startsWith("//")
  );
}

/** 将 //example.com 规范为 https:// */
export function normalizeRemoteUrl(src: string): string {
  const trimmed = src.trim();
  if (trimmed.startsWith("//")) {
    return `https:${trimmed}`;
  }
  return trimmed;
}

function isAbsolutePath(path: string): boolean {
  return /^[a-zA-Z]:[/\\]/.test(path) || path.startsWith("/") || path.startsWith("\\");
}

/**
 * 将相对路径解析为基于文档目录的绝对路径（同步、跨平台）
 */
export function resolvePathAgainstBase(relativePath: string, baseDir: string): string {
  const trimmed = relativePath.trim();
  if (isAbsolutePath(trimmed)) {
    return trimmed;
  }

  const useBackslash = baseDir.includes("\\");
  const separator = useBackslash ? "\\" : "/";

  const baseSegments = baseDir.split(/[/\\]/).filter((segment) => segment.length > 0);
  const relSegments = trimmed.split(/[/\\]/).filter((segment) => segment.length > 0);

  let drive: string | null = null;
  if (/^[a-zA-Z]:$/i.test(baseSegments[0] ?? "")) {
    drive = baseSegments[0];
    baseSegments.shift();
  }

  const stack = [...baseSegments];
  for (const segment of relSegments) {
    if (segment === ".") continue;
    if (segment === "..") {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(segment);
    }
  }

  const joined = stack.join(separator);
  return drive ? `${drive}${separator}${joined}` : joined;
}

/**
 * 解码链接/路径中的 percent-encoding（markdown-it 会对中文 href 编码）。
 * 解码失败时返回原字符串。
 */
export function decodePathHref(href: string): string {
  const trimmed = href.trim();
  if (!/%[0-9A-Fa-f]{2}/.test(trimmed)) {
    return trimmed;
  }
  try {
    return decodeURIComponent(trimmed);
  } catch {
    return trimmed;
  }
}

/** 从 Markdown 文件路径得到所在目录 */
export function dirnameFromFilePath(filePath: string): string {
  const separator = filePath.includes("\\") ? "\\" : "/";
  const parts = filePath.split(/[/\\]/);
  parts.pop();
  return parts.join(separator);
}
