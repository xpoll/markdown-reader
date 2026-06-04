# 项目需求文档（PRD）

## 项目名称

Markdown Reader Lite

---

## 项目目标

开发一个超轻量 Markdown 阅读器。

目标用户：

* 程序员
* AI 工程师
* 经常查看 README.md、docs/*.md 的用户

核心诉求：

* 比 VS Code 更轻
* 比 Cursor 更轻
* 类似 Typora 的阅读体验
* 不追求编辑功能
* 优先阅读性能

---

## 产品定位

本产品是：

```text
Markdown Reader
```

不是：

```text
Markdown Editor
```

因此：

不实现复杂编辑能力。

---

## 技术栈

优先方案：

* Tauri 2.x
* React 19
* TypeScript
* Vite

Markdown 渲染：

* markdown-it

代码高亮：

* Shiki

数学公式：

* KaTeX

流程图：

* Mermaid

样式：

* GitHub Markdown CSS

文件操作：

* Tauri FS API

---

## 性能目标

启动时间：

* < 1 秒

内存占用：

* 空载 < 80 MB
* 普通文档 < 120 MB

CPU：

* 空闲状态接近 0%

安装包：

* < 20 MB

---

# MVP 功能

## 文件打开

支持：

* .md
* .markdown

方式：

* 拖拽打开
* Ctrl+O
* 文件菜单打开

---

## Markdown 渲染

支持：

* 标题
* 引用
* 列表
* 表格
* 图片
* 链接
* 任务列表
* 代码块

---

## 图片显示

支持：

* 相对路径图片
* 本地图片
* 网络图片

要求：

* 自动适应宽度
* 点击放大

---

## Mermaid

支持：

````markdown
```mermaid
graph TD
A --> B
```
````

自动渲染。

---

## KaTeX

支持：

```markdown
$E=mc^2$
```

以及：

```markdown
$$
E=mc^2
$$
```

---

## 搜索

快捷键：

```text
Ctrl + F
```

功能：

* 当前文档搜索
* 高亮匹配项
* 上一个
* 下一个

---

## 目录导航

自动生成 TOC。

左侧显示：

```text
H1
 ├─ H2
 ├─ H2
 │   └─ H3
```

点击跳转。

---

## 深色模式

支持：

* 跟随系统
* 浅色
* 深色

---

## 最近文件

记录最近打开的：

* 20 个文件

启动后展示。

---

# 不做的功能

以下功能全部不要开发：

## 编辑功能

不要：

* 所见即所得
* 富文本编辑
* Markdown 编辑器

仅支持：

```text
只读
```

---

## 导出功能

不要：

* PDF
* Word
* HTML

---

## AI 功能

不要：

* GPT
* Claude
* MCP

---

## 插件系统

不要。

---

## Git 功能

不要。

---

## 云同步

不要。

---

## 笔记管理

不要。

---

## 数据库

不要。

---

# UI 设计

整体参考：

Typora

布局：

```text
┌─────────────────────┐
│ Toolbar             │
├──────┬──────────────┤
│ TOC  │ Content      │
│      │              │
│      │              │
└──────┴──────────────┘
```

要求：

* 极简
* 无复杂按钮
* 无 Ribbon
* 无侧边工具箱

---

# 开发步骤

Phase 1

* 初始化项目
* Tauri
* React
* TypeScript

Phase 2

* Markdown 渲染

Phase 3

* 图片支持

Phase 4

* Mermaid
* KaTeX

Phase 5

* 搜索

Phase 6

* TOC

Phase 7

* 深色模式

Phase 8

* 打包发布

---

# 验收标准

测试文件：

* README.md
* 500KB Markdown
* 含 100 张图片的 Markdown
* 含 Mermaid
* 含 KaTeX

要求：

* 渲染正确
* 滚动流畅
* 无明显卡顿
* 内存稳定
* 启动迅速

---

# 代码要求

* TypeScript 严格模式
* ESLint
* Prettier
* 模块化设计
* 组件化开发

输出：

完整可运行项目。

每完成一个 Phase：

1. 自动创建 Git Commit
2. 输出变更说明
3. 等待下一步指令
