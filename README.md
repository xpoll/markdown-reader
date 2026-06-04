# Markdown Reader Lite

超轻量 **只读** Markdown 阅读器。技术栈：Tauri 2 + React 19 + TypeScript + Vite。

## 开发进度（PRD MVP 已完成）

| Phase | 内容 | 状态 |
|-------|------|------|
| 1 | 项目初始化 | ✅ |
| 2 | Markdown 渲染 | ✅ |
| 3 | 图片支持 | ✅ |
| 4 | Mermaid、KaTeX | ✅ |
| 5 | 搜索（Ctrl+F） | ✅ |
| 6 | 目录导航（TOC） | ✅ |
| 7 | 深色模式 | ✅ |
| 8 | 打包发布 | ✅ |

详细需求见 [项目需求文档（PRD）.md](./项目需求文档（PRD）.md)。发布说明见 [RELEASE.md](./RELEASE.md)。

## 环境要求

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://www.rust-lang.org/tools/install)（桌面打包必需）
- Windows：[WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)
- macOS：10.15+，需在 macOS 上构建（或使用 GitHub Actions 工作流）

## 常用命令

```bash
npm install

# 开发
npm run dev              # 浏览器预览
npm run tauri dev        # 桌面开发

# 检查
npm run check            # lint + 前端构建

# 发布
npm run build:release    # 当前平台安装包
npm run build:win        # 仅 Windows NSIS
npm run build:mac        # 仅 macOS .app + .dmg
npm run report:size      # 安装包体积报告
```

## 功能摘要

| 功能 | 说明 |
|------|------|
| 打开文件 | Ctrl+O、拖拽 `.md`、文件关联双击 |
| 文档内链接 | 本地 `.md` 在应用内打开；`http://` 用系统浏览器 |
| 渲染 | 标题、列表、表格、代码块、任务列表 |
| 图片 | 相对路径 / 本地 / 网络，点击放大 |
| 公式 / 图表 | KaTeX、Mermaid |
| 搜索 | Ctrl+F，高亮，上/下一个 |
| TOC | 侧栏「大纲」树形目录，点击跳转 |
| 文件树 | 侧栏「文件」展示工作区目录，可展开文件夹、点击打开 .md |
| 打开文件夹 | 工具栏「文件夹」或侧栏内按钮，选择根目录 |
| 主题 | 跟随系统 / 浅色 / 深色 / 护眼纸 / 护眼绿 |

## 测试文件

- `fixtures/sample.md`
- `fixtures/sample-with-images.md`
- `fixtures/sample-mermaid-katex.md`

## 项目结构

```text
markdown-reader/
├── src/                 # React 前端
├── src-tauri/           # Tauri Rust 后端
├── fixtures/            # 验收用 Markdown
├── scripts/             # 构建辅助脚本
├── RELEASE.md           # 打包与发布
└── CHANGELOG.md
```

## 说明

- 浏览器 `npm run dev` 无法使用系统文件对话框，请用「查看示例文档」或 `tauri dev`。
- 主题含护眼纸色、护眼绿色；与 Markdown 样式（GitHub CSS）同步，不依赖系统外观设置。
- 先「打开文件夹」后，文件树根目录固定，不会因 Ctrl+O 打开其他路径下的文件而改变。
- 若未打开文件夹，首次打开 `.md` 时会自动以该文件所在目录为工作区根目录。
- PRD 中的 Shiki 代码高亮、最近文件列表未纳入当前 MVP 阶段，可在后续版本迭代。
- Mermaid 图表由 `useMermaidRender` 写入正文 DOM；勿与 `dangerouslySetInnerHTML` 同时使用，否则 React 重绘会覆盖已渲染的 SVG。
