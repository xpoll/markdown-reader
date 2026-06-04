# 发布说明 · v0.1.0

## Markdown Reader Lite

超轻量只读 Markdown 阅读器（Tauri 2 + React 19）。

### 功能概览

- Markdown 渲染（GFM 表格、任务列表）
- 本地 / 网络图片、相对路径、点击放大
- Mermaid 流程图、KaTeX 公式
- Ctrl+F 文档内搜索
- 左侧 TOC 目录导航
- 浅色 / 深色 / 跟随系统
- Ctrl+O、拖拽打开、`.md` 文件关联

---

## 构建环境

| 工具 | 版本建议 |
|------|----------|
| Node.js | 18+ |
| Rust | stable（[rustup.rs](https://rustup.rs)） |
| Windows | WebView2 Runtime |
| macOS | 10.15+，Xcode Command Line Tools |

---

## 构建命令

```bash
# 安装依赖
npm install

# 检查前端
npm run check

# 桌面安装包（需 Rust）
npm run build:release

# 仅 Windows NSIS 安装包
npm run build:win

# 仅 macOS .app + .dmg（须在 macOS 上执行）
npm run build:mac

# 查看安装包体积（构建完成后）
npm run report:size
```

在 Windows 上无法本地交叉编译 macOS 安装包。可：

1. 在 Mac 上执行 `npm run build:mac`
2. 推送 `v*` 标签或手动触发 GitHub Actions 工作流 **Build macOS**，从 Artifacts 下载 `.dmg`

```bash
# 本地 Mac 构建前，若未安装 Xcode 命令行工具：
xcode-select --install
```

产物目录：

```text
src-tauri/target/release/bundle/
├── nsis/          # Windows .exe 安装器
├── msi/           # Windows .msi
├── dmg/           # macOS
├── deb/           # Linux deb
└── appimage/      # Linux AppImage
```

---

## 体积说明

PRD 目标：安装包 < 20 MB。

本项目含 Mermaid + KaTeX，前端资源较大。已采取：

- Vite `manualChunks` 拆分 mermaid / katex
- Mermaid 动态 `import()` 延迟加载
- Rust `profile.release`：`lto`、`opt-level = "s"`、`strip`

若超出 20 MB，可考虑后续将 Mermaid 改为按需远程加载或可选组件。

---

## 安装后验证

1. 启动应用，欢迎页正常
2. Ctrl+O 打开 `fixtures/sample-mermaid-katex.md`
3. 左侧 TOC 可点击跳转
4. Ctrl+F 搜索关键词
5. 切换深色模式
6. 拖拽 `.md` 到窗口可打开
7. 资源管理器中双击 `.md`（安装时若注册关联）
