/** 内置示例文档，用于浏览器预览或首次体验 */

const SAMPLE_IMAGE_URL =
  "https://m.360buyimg.com/mobilecms/s750x750_jfs/t1/436992/11/1223/94115/6a05373dF30595dfa/0083320320f5aa07.jpg";

export const SAMPLE_MARKDOWN = `# Markdown Reader Lite 示例

> 超轻量只读 Markdown 阅读器

## 数学公式（KaTeX）

行内：$E = mc^2$

$$
\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}
$$

## 流程图（Mermaid）

\`\`\`mermaid
graph LR
    A[Markdown] --> B[Reader]
    B --> C[只读渲染]
\`\`\`

## 列表与任务

- 无序列表项 A
- 无序列表项 B

- [x] 已完成任务
- [ ] 待办任务

## 表格

| 功能 | Phase |
| ---- | ----- |
| Markdown | 2 |
| 图片 | 3 |
| Mermaid / KaTeX | 4 |

## 代码块

\`\`\`typescript
const msg: string = "Hello, Reader!";
\`\`\`

## 链接与图片

访问 [Tauri 官网](https://tauri.app)。

![网络图片](${SAMPLE_IMAGE_URL})

---

按 **Ctrl+O** 打开本地 .md（Tauri）。完整测试见 fixtures/sample-mermaid-katex.md。
`;
