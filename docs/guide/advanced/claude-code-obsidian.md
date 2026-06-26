---
title: Claude Code + Obsidian 集成
description: 通过 MCP 让 Claude Code 读写 Obsidian 笔记，搜索知识库、整理笔记、批量操作一气呵成
---

# Claude Code + Obsidian 集成

> 你的笔记库就是 Claude 的上下文。

## 它能做什么

Obsidian 里存的是你的知识库——项目笔记、会议记录、学习资料、日常想法。Claude Code 加上 Obsidian 集成后，它可以直接：

- **搜索你的笔记**："找一下上周关于微服务拆分的会议记录"
- **帮你整理**："把这 5 篇零散笔记合并成一篇知识总结"
- **批量操作**："给所有前端相关的笔记加上 #frontend 标签"
- **写作辅助**："把这篇草稿润色成正式文档"

本质上就是让 Claude 把你的 Obsidian vault 当成项目目录来操作——只不过里面的"代码"换成了"笔记"。

## 两种集成方式

### 方式一：MCP 插件（推荐）

装一个 Obsidian 插件，它会在本地起一个 MCP 服务器。Claude Code 通过这个服务器读写你的 vault。

```text
Claude Code ←→ MCP 服务器（Obsidian 插件）←→ Vault 文件
```

好处：Claude Code 的原生体验，能搜索、读文件、写文件、看文件列表，跟操作代码项目一样顺手。

### 方式二：嵌入式终端

在 Obsidian 里直接嵌入 Claude Code 终端。

好处：不用切换窗口，在 Obsidian 里就能跟 Claude 对话。

---

## 方式一：MCP 插件（推荐）

### 安装

**第 1 步：装 Obsidian 插件**

在 Obsidian 社区插件市场搜索 `Claude Code`（作者 iansinnott），安装并启用。

也可以手动安装：从 [GitHub Releases](https://github.com/iansinnott/obsidian-claude-code-mcp/releases) 下载 `main.js`、`manifest.json`、`styles.css`，放到 `你的vault/.obsidian/plugins/obsidian-claude-code-mcp/` 目录。

**第 2 步：验证插件运行**

打开 Obsidian 设置 → 社区插件 → Claude Code → 确认两个服务器开关都是开着的（WebSocket 和 HTTP 默认都开）。

### 连接

装完插件、Obsidian 开着 vault，在终端进入你的 vault 目录：

```bash
cd /path/to/your-vault
claude
```

在 Claude Code 里输入：

```bash
/ide
```

选择 **Obsidian**，Claude Code 自动连接。看到 `Connected to Obsidian` 就好了。

### 能用什么

连上后，Claude Code 多了这些 MCP 工具：

| 工具 | 相当于 | 示例 |
|------|--------|------|
| `view` | 读文件 | "看一下 项目A/技术方案.md" |
| `str_replace` | 修改文件 | "把第三段的日期改成 2026-06-23" |
| `create` | 新建笔记 | "创建一篇 本周工作总结.md" |
| `insert` | 插入内容 | "在文件第 10 行后插入一段" |
| `get_current_file` | 当前打开的文件 | "帮我润色当前这篇笔记" |
| `get_workspace_files` | 文件列表 | "列出所有前端相关的笔记" |

### 日常操作示例

**搜索知识库：**

```text
> 在笔记里搜索所有提到"微服务拆分"的内容，按时间排一下
```

Claude 调 `get_workspace_files` 列文件 → `view` 读相关笔记 → 汇总给你。

**整理碎片：**

```text
> 我最近写了 5 篇关于 Rust 的零散笔记（文件名以 rust- 开头），帮我合并成一篇完整的学习笔记，按入门、进阶、实战分章节
```

Claude 读 5 篇 → 去重 → 重组结构 → `create` 生成新笔记。

**批处理：**

```text
> 把所有笔记里 "Cloude" 改成 "Claude"，先列出会改哪些，确认后再改
```

Claude `view` 搜索 → 列出影响范围 → 你确认后 `str_replace` 批量替换。

**配合当前笔记：**

```text
> 润色当前打开的这篇笔记，语气正式一点，加个目录
```

`get_current_file` 拿到内容 → 修改 → `str_replace` 写回。

### 配置

插件的设置项（在 Obsidian 设置面板里）：

| 设置 | 默认值 | 说明 |
|------|--------|------|
| WebSocket 服务器 | 开 | Claude Code CLI 用这个连 |
| HTTP/SSE 服务器 | 开 | Claude Desktop 用这个连 |
| 端口 | 22360 | 多个 vault 需要不同端口 |

### 多个 vault 怎么办

每个 vault 的插件设置里设不同端口（22360、22361、22362），互不干扰。Claude Code 通过 `/ide` 自动发现当前目录对应的 vault。

---

## 方式二：嵌入式终端

如果你更喜欢在 Obsidian 里面操作、不想切来切去。

### 安装

第 1 步：确保已安装 Claude Code CLI：

```bash
npm install -g @anthropic-ai/claude-code
```

第 2 步：在 Obsidian 社区插件市场搜索 `Claude Code Integration`（作者 mohemohe），安装并启用。

第 3 步：配置 Claude Code 路径（插件设置里，通常默认就能检测到）。

### 使用

- 点击左侧边栏的 Claude Code 图标，或 `Ctrl+P` 搜 `Claude Code Integration`
- 面板出现在右侧，跟聊天一样发消息
- 可以只处理选中的文本，也可以操作整篇笔记
- 改完预览 diff，满意了点 Accept

适合场景：

- 写笔记时旁边有个 AI 助手随时问
- 润色、翻译、摘要当前笔记
- 不想开终端的人

---

## 双方对比

| | MCP 插件 | 嵌入式终端 |
|----|----|----|
| 操作方式 | Claude Code 终端 | Obsidian 面板 |
| 能做什么 | 读写 vault 所有文件 | 主要是当前笔记 |
| 习惯 | 像操作代码项目 | 像聊天助手 |
| 适用 | 重度 Claude Code 用户 | Obsidian 重度用户 |
| 多文件操作 | 自然 | 不太方便 |
| 安装 | 一个插件 | 需要 CLI + 插件 |

**建议**：日常写代码也用 Claude Code 的人用 MCP 插件。主要用 Obsidian 写笔记、偶尔想叫 AI 帮忙的人用嵌入式终端。

---

## 常见问题

### 第一次连接不上？

1. 确认 Obsidian 开着、插件已启用
2. 确认 Claude Code 是从 vault 目录启动的（`cd` 进去再 `claude`）
3. 试 `/ide` 命令，选 Obsidian
4. 还不行——重启 Obsidian，再试

### 改了文件 Obsidian 里没刷新？

Obsidian 会自动检测外部修改，稍等一两秒就刷了。没刷新的话切到其他文件再切回来。

### 会不会改坏我的笔记？

MCP 插件的写操作 Claude 会问你确认。特别重要的笔记建议用 Git 备份（vault 本身就是一个目录，`git init` 就行）。

### 和 Claude Code 的其他插件冲突吗？

不冲突。MCP 插件是 Obsidian 侧的东西，不影响 Claude Code 的正常编程功能。你在 vault 目录启动 Claude Code 时，它既能操作代码也能操作笔记。
