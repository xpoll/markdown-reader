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
npm run build:win        # 仅 Windows NSIS 安装包（较慢）
npm run build:mac        # 仅 macOS .app + .dmg
npm run report:size      # 安装包体积报告

# 只要可直接打开的 exe（不要安装包，更快）
npm run tauri build -- --no-bundle
# 产物：src-tauri/target/release/markdown-reader-lite.exe
```

## 功能摘要

| 功能 | 说明 |
|------|------|
| 打开文件 | Ctrl+O、拖拽 `.md`、文件关联双击 |
| 刷新文档 | 工具栏「刷新」或 Ctrl+R，重新读取当前本地文件（外部编辑后可立即看到新内容） |
| 文档内链接 | 本地 `.md` 在应用内打开，支持 `其他文档.md#标题` 跳转；`http://` 用系统浏览器 |
| 渲染 | 标题、列表、表格、代码块、任务列表 |
| 图片 | 相对路径 / 本地 / 网络，点击放大 |
| 公式 / 图表 | KaTeX、Mermaid |
| 搜索 | Ctrl+F，高亮，上/下一个 |
| TOC | 侧栏「大纲」树形目录，点击跳转 |
| 文件树 | 侧栏「文件」展示工作区目录，可展开文件夹、点击打开 .md |
| 文件栏导航 | 顶栏依次为：Home（回工作区根）、后退（上一级）、文件夹名、更换文件夹图标 |
| 打开文件夹 | 工具栏「文件夹」或侧栏更换图标，选择根目录 |
| 主题 | 跟随系统 / 浅色 / 深色 / 护眼纸 / 护眼绿 |
| 错误提示 | 打开失败、拖入非 Markdown、浏览器环境限制等会显示顶部提示 |
| 窗口标题 | 任务栏 / 标题栏显示当前文件名，方便多窗口区分 |

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

- 浏览器 `npm run dev` 无法使用系统文件对话框；点「打开」会提示改用桌面版，也可先「查看示例文档」或运行 `tauri dev`。
- 主题含护眼纸色、护眼绿色；与 Markdown 样式（GitHub CSS）同步，不依赖系统外观设置。
- 先「打开文件夹」后，工作区 Home 固定；在该文件夹内打开子目录中的 `.md` 时，文件树会跟到该文件所在目录，可用 Home 一键回到最初打开的根目录。
- 若未打开文件夹，本窗口第一次打开 `.md` 时会记住该文件所在目录为 Home；之后再打开其他文件不会改 Home（关掉窗口或点「更换」才会变）。
- 通过系统双击或拖拽打开 `.md` 时，左侧文件树会切到该文件所在目录；若本窗口还没有 Home，则同时设为 Home。
- 文件栏「后退」显示上一级目录；「Home」回到本窗口第一次打开时的工作区根目录。已在 Home 时按钮不可点；已到磁盘根时后退不可点。
- 切换文档时正文会滚回顶部；若链接带 `#标题`，则打开后跳到对应标题。
- F5 会整页刷新并恢复当前正在阅读的文档；若只想重新读盘，请用「刷新」或 Ctrl+R（不会丢掉滚动位置）。
- 当前文档与左侧工作区按「窗口」分别记忆（sessionStorage），多开窗口互不干扰；关掉窗口后该窗口的目录记忆会清空。主题仍全局共用。
- Mermaid 图表由 `useMermaidRender` 写入正文 DOM；勿与 `dangerouslySetInnerHTML` 同时使用，否则 React 重绘会覆盖已渲染的 SVG。

## 后续可优化（P1）

- 最近打开的文件列表（欢迎页快速入口）
- 文档浏览历史（后退 / 前进）
- 单实例：已打开时再双击 `.md` 转到现有窗口，而不是再开一个
- 侧栏折叠、大纲滚动高亮、空文件夹提示等阅读打磨
- Shiki 代码高亮（需权衡安装包体积）
