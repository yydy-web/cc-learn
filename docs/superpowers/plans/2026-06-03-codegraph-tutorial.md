# CodeGraph 代码智能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Claude Code 教程站点中添加 CodeGraph 代码智能工具的介绍和使用教程，展示如何通过本地知识图谱提升 Claude Code 的代码理解效率。

**Architecture:** 新建一个高级篇页面 `docs/guide/advanced/codegraph.md`，介绍 CodeGraph 的核心理念（本地代码知识图谱）、工作原理（tree-sitter → AST → SQLite）、MCP 工具集、安装配置方式，并展示通过 CC-Switch 管理 MCP 服务器的方式。同时更新 4 个现有页面添加交叉引用。

**Tech Stack:** Rspress v2, Markdown/MDX, YAML frontmatter

---

## File Structure

| 操作 | 文件 | 职责 |
|------|------|------|
| 创建 | `docs/guide/advanced/codegraph.md` | CodeGraph 完整教程页面 |
| 修改 | `docs/guide/advanced/_meta.json` | 侧边栏添加 codegraph 条目 |
| 修改 | `docs/guide/advanced/mcp-servers.md` | 添加 CodeGraph 作为 MCP 服务器示例 |
| 修改 | `docs/index.md` | 首页高级篇描述中加入 CodeGraph |
| 修改 | `docs/tips/best-practices.md` | 添加代码智能最佳实践 |

---

### Task 1: 创建 CodeGraph 教程页面

**Files:**
- Create: `docs/guide/advanced/codegraph.md`

- [ ] **Step 1: 创建完整的 CodeGraph 教程页面**

Write the following file to `docs/guide/advanced/codegraph.md`:

```markdown
---
title: CodeGraph 代码智能
description: 使用 CodeGraph 为 Claude Code 构建本地代码知识图谱，减少工具调用、降低 Token 消耗
---

# CodeGraph 代码智能

CodeGraph 是一个本地优先的代码智能工具，从源代码构建可查询的知识图谱。它通过 MCP 服务器为 Claude Code 提供代码理解能力，替代传统的 `grep`/`glob`/`Read` 扫描方式，显著减少工具调用次数、Token 消耗和响应时间。

## 为什么需要 CodeGraph

Claude Code 默认使用 `Grep`、`Glob`、`Read` 等工具逐个扫描文件来理解代码。这在小项目中没问题，但在大型代码库中会导致：

- 大量工具调用（每找一个符号可能需要 3-5 次调用）
- Token 消耗高（每次调用都返回文件内容）
- 响应速度慢（串行调用，等待时间长）
- 上下文浪费（读取大量无关代码）

CodeGraph 预先解析整个代码库，构建符号和关系的知识图谱。Claude Code 通过 MCP 一次调用就能获取完整的代码上下文。

:::info
基准测试结果（7 个开源仓库，4 次运行取中位数）：
- **35% 更低费用**
- **57% 更少 Token**
- **46% 更快响应**
- **71% 更少工具调用**
:::

## 工作原理

```
源代码 → tree-sitter 解析 → AST → 提取符号和关系 → SQLite + FTS5 → MCP 服务器
```

1. **tree-sitter 解析**：支持 20+ 种编程语言，从源文件提取 AST
2. **符号提取**：识别函数、类、方法、类型、路由、组件等符号
3. **关系构建**：分析调用、导入、继承、引用等关系
4. **本地存储**：所有数据存储在项目的 `.codegraph/codegraph.db` SQLite 数据库中
5. **MCP 暴露**：通过 MCP 协议让 Claude Code 查询知识图谱

:::tip
所有处理都在本地完成——不需要 API Key，不需要外部服务。数据永远不会离开你的机器。
:::

## 安装

### 方式一：独立安装（推荐）

独立安装包自带 Node 运行时，无需额外安装 Node.js。

**macOS/Linux：**

```bash
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh | sh
```

**Windows（PowerShell）：**

```powershell
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex
```

### 方式二：npm 安装

```bash
npm i -g @colbymchenry/codegraph
```

或直接运行不安装：

```bash
npx @colbymchenry/codegraph
```

### 配置 Claude Code

安装完成后，运行以下命令自动配置所有支持的 AI 工具：

```bash
codegraph install
```

这会自动：
- 检测已安装的 AI 工具（Claude Code、Cursor、Codex CLI 等）
- 在 `~/.claude.json` 中添加 MCP 服务器配置
- 在 `~/.claude/settings.json` 中添加自动授权权限

### 初始化项目

在项目目录中运行：

```bash
cd your-project
codegraph init -i
```

`-i` 标志启用交互模式，同时构建初始知识图谱。

:::info
初始化后，CodeGraph 会在项目根目录创建 `.codegraph/` 目录，包含 SQLite 数据库。建议将 `.codegraph/` 添加到 `.gitignore`。
:::

### 通过 CC-Switch 管理

如果你已安装 [CC-Switch](/guide/advanced/cc-switch)，可以通过它管理 CodeGraph 的 MCP 服务器配置：

1. 打开 CC-Switch Desktop
2. 进入 MCP 服务器管理
3. 添加 CodeGraph MCP 服务器配置
4. CC-Switch 会自动同步到 Claude Code 的 `~/.claude.json`

```json
{
  "mcpServers": {
    "codegraph": {
      "type": "stdio",
      "command": "codegraph",
      "args": ["serve", "--mcp"]
    }
  }
}
```

:::tip
CC-Switch 特别适合在多个 AI 工具之间同步 CodeGraph 的 MCP 配置——一次配置，所有工具生效。
:::

## MCP 工具集

CodeGraph 为 Claude Code 提供 10 个 MCP 工具：

### 核心工具

| 工具 | 用途 | 使用场景 |
|------|------|----------|
| `codegraph_explore` | 主力工具——一次调用回答问题 | "这个项目怎么处理用户认证？" |
| `codegraph_search` | 按名称搜索符号 | "找到 UserService 类" |
| `codegraph_context` | 构建相关代码上下文 | "修复登录 Bug 需要哪些代码？" |
| `codegraph_node` | 获取单个符号的详细信息 | "showUser 函数的完整源码" |

### 分析工具

| 工具 | 用途 | 使用场景 |
|------|------|----------|
| `codegraph_callers` | 查找谁调用了某个函数 | "哪些地方调用了 deleteUser？" |
| `codegraph_callees` | 查找某个函数调用了什么 | "login 函数依赖哪些服务？" |
| `codegraph_impact` | 影响分析——修改会影响哪些代码 | "改了 User 模型会影响什么？" |
| `codegraph_trace` | 追踪两个符号之间的调用路径 | "从路由到数据库的调用链" |

### 辅助工具

| 工具 | 用途 | 使用场景 |
|------|------|----------|
| `codegraph_files` | 获取已索引的文件结构 | "项目有哪些文件？" |
| `codegraph_status` | 检查索引健康状态 | "图谱数据是否最新？" |

## 使用示例

### 探索代码库

```
> 这个项目是怎么处理 API 路由的？
```

Claude Code 会通过 `codegraph_explore` 一次调用获取所有路由定义、中间件和处理器的完整上下文。

### 影响分析

```
> 如果我修改 src/models/user.ts 中的 User 接口，会影响哪些代码？
```

Claude Code 会通过 `codegraph_impact` 分析 User 接口的所有调用者和依赖。

### 调用链追踪

```
> 从 POST /api/login 路由到数据库查询的完整调用链是什么？
```

Claude Code 会通过 `codegraph_trace` 追踪从路由处理器到数据库层的完整路径。

### CI 中的受影响测试

CodeGraph 可以分析代码变更影响了哪些测试文件：

```bash
# 找出受变更文件影响的测试
codegraph affected src/services/auth.ts src/models/user.ts

# 在 CI 中使用
git diff --name-only HEAD~1 | codegraph affected --stdin
```

## 支持的语言和框架

### 编程语言（20+）

TypeScript、JavaScript、Python、Go、Rust、Java、C#、PHP、Ruby、C、C++、Swift、Kotlin、Scala、Dart、Svelte、Vue、Liquid、Pascal/Delphi、Lua、Luau

### 框架路由识别（14 个）

Django、Flask、FastAPI、Express、NestJS、Laravel、Rails、Spring、Gin、Axum、ASP.NET、Vapor、React Router、SvelteKit

## 自动同步

CodeGraph 有三层同步机制，确保知识图谱始终最新：

1. **文件监听器**：使用操作系统原生事件（FSEvents/inotify/ReadDirectoryChangesW）监听文件变更，默认 2000ms 防抖
2. **过期提示**：当 Claude Code 连接时，如果索引过期会自动提示
3. **连接时追赶**：MCP 服务器启动时自动同步自上次以来的变更

```bash
# 手动增量同步
codegraph sync

# 完全重建索引
codegraph index
```

:::tip
文件监听器的防抖间隔可以通过环境变量调整：`CODEGRAPH_WATCH_DEBOUNCE_MS=1000`
:::

## CLI 命令速查

```bash
# 安装和配置
codegraph install          # 配置 AI 工具集成
codegraph uninstall        # 移除 AI 工具集成
codegraph init [path]      # 初始化项目
codegraph uninit [path]    # 移除项目初始化

# 索引管理
codegraph index [path]     # 完全重建索引
codegraph sync [path]      # 增量更新
codegraph status [path]    # 查看统计信息

# 查询
codegraph query <search>   # 搜索符号
codegraph files [path]     # 查看文件结构
codegraph callers <sym>    # 查找调用者
codegraph callees <sym>    # 查找被调用者
codegraph impact <sym>     # 影响分析
codegraph affected [files] # 查找受影响的测试

# 服务器
codegraph serve --mcp      # 启动 MCP 服务器
```

## 配置

### 零配置设计

CodeGraph 是**零配置**的——不需要编写任何配置文件：

- **语言检测**：自动根据文件扩展名识别
- **排除规则**：内置排除 `node_modules`、`dist`、`build` 等目录，同时尊重 `.gitignore`
- **数据存储**：自动在 `.codegraph/` 目录创建 SQLite 数据库

### 自定义排除

使用 `.gitignore` 作为唯一的排除机制：

```text
# 排除测试数据
test/fixtures/

# 重新包含默认排除的目录
!vendor/
```

## 卸载

```bash
# 从所有 AI 工具中移除
codegraph uninstall

# 卸载 CodeGraph 本身
npm uninstall -g @colbymchenry/codegraph
```

## 相关资源

- [CodeGraph GitHub](https://github.com/colbymchenry/codegraph) — 项目仓库（38k+ Stars）
- [CodeGraph 文档](https://colbymchenry.github.io/codegraph/) — 官方文档网站
- [CodeGraph npm](https://www.npmjs.com/package/@colbymchenry/codegraph) — npm 包页面

## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 MCP 服务器和 API Provider
- [技巧与最佳实践](/tips/best-practices) — 更多高效使用技巧
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/codegraph.md
git commit -m "docs: add CodeGraph code intelligence tutorial page"
```

---

### Task 2: 更新侧边栏导航

**Files:**
- Modify: `docs/guide/advanced/_meta.json`

- [ ] **Step 1: 添加 codegraph 到侧边栏**

将 `_meta.json` 从：
```json
["hooks", "mcp-servers", "custom-skills", "cc-switch", "superpowers", "gstack", "openspec", "ralph", "multi-agent", "automation"]
```
改为：
```json
["hooks", "mcp-servers", "custom-skills", "cc-switch", "superpowers", "gstack", "openspec", "ralph", "codegraph", "multi-agent", "automation"]
```

codegraph 放在 ralph 之后，因为它是一个基础设施工具（MCP 服务器），适合作为工具链的最后一环。

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/_meta.json
git commit -m "docs: add CodeGraph to advanced sidebar navigation"
```

---

### Task 3: 更新 mcp-servers.md 添加 CodeGraph 示例

**Files:**
- Modify: `docs/guide/advanced/mcp-servers.md`

- [ ] **Step 1: 在常用 MCP 服务器部分添加 CodeGraph**

在 `### 浏览器自动化` 小节之后、`## 自建 MCP 服务器` 之前，添加：

```markdown
### CodeGraph 代码智能

为 Claude Code 提供本地代码知识图谱，减少工具调用和 Token 消耗：

```json
{
  "mcpServers": {
    "codegraph": {
      "type": "stdio",
      "command": "codegraph",
      "args": ["serve", "--mcp"]
    }
  }
}
```

使用示例：
```
> 这个项目是怎么处理用户认证的？
> 如果修改 User 接口，会影响哪些代码？
```

详见 [CodeGraph 代码智能](/guide/advanced/codegraph) 教程。
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/mcp-servers.md
git commit -m "docs: add CodeGraph example to MCP servers page"
```

---

### Task 4: 更新首页描述

**Files:**
- Modify: `docs/index.md`

- [ ] **Step 1: 更新高级篇 features 描述**

将：
```yaml
    details: 探索 Hooks、MCP 服务器、自定义技能、CC-Switch 配置管理、Superpowers、Gstack、OpenSpec 和 Ralph 工作流
```

改为：
```yaml
    details: 探索 Hooks、MCP 服务器、自定义技能、CC-Switch 配置管理、Superpowers、Gstack、OpenSpec、Ralph 和 CodeGraph
```

- [ ] **Step 2: Commit**

```bash
git add docs/index.md
git commit -m "docs: add CodeGraph to homepage features description"
```

---

### Task 5: 更新最佳实践添加代码智能

**Files:**
- Modify: `docs/tips/best-practices.md`

- [ ] **Step 1: 在 Ralph 小节之后添加 CodeGraph 小节**

在"自主循环开发模式（Ralph）"小节之后、"## 省钱技巧"之前添加：

```markdown
### 代码智能加速（CodeGraph）

安装 [CodeGraph](/guide/advanced/codegraph) 后，Claude Code 通过 MCP 查询本地代码知识图谱，替代逐文件扫描：

```bash
# 安装并初始化
codegraph install
cd your-project && codegraph init -i
```

之后 Claude Code 会自动使用 CodeGraph 理解代码——工具调用减少 71%，Token 消耗降低 57%。特别适合大型代码库。
```

- [ ] **Step 2: Commit**

```bash
git add docs/tips/best-practices.md
git commit -m "docs: add CodeGraph code intelligence to best practices"
```

---

### Task 6: 构建验证

**Files:**
- None (verification only)

- [ ] **Step 1: 运行生产构建**

Run: `npm run build`
Expected: 所有页面构建成功，无报错。`doc_build/guide/advanced/codegraph.html` 应出现在输出中。

- [ ] **Step 2: 检查生成的页面**

确认以下页面都正确生成：
- `doc_build/guide/advanced/codegraph.html`
- `doc_build/guide/advanced/mcp-servers.html`（含新示例）
- `doc_build/index.html`（含更新描述）
- `doc_build/tips/best-practices.html`（含新小节）
