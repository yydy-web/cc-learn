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

## 与 Code Review Graph 的对比

[Code Review Graph](/guide/advanced/code-review-graph)（CRG）是另一个基于 tree-sitter 的本地代码图谱工具。两者都通过 MCP 为 Claude Code 提供代码智能，但设计重点不同：

| 方面 | CodeGraph | Code Review Graph |
|------|-----------|-------------------|
| **定位** | 日常代码探索 | 代码审查和架构分析 |
| **语言** | TypeScript (npm) | Python (pip) |
| **MCP 工具数** | 10 | 30 |
| **核心工具** | `codegraph_explore`（一次调用回答问题） | `get_minimal_context`（~100 Token 概览） |
| **特色能力** | 简洁、快速、零配置 | Blast-Radius、社区检测、执行流、Wiki 生成 |
| **Token 优化** | 35% 费用降低 | 38x-528x Token 节省 |
| **语言支持** | 20+ | 30+ |
| **框架路由** | 14 个框架 | 无 |
| **社区检测** | 无 | Leiden 算法 |
| **可视化** | 无 | D3.js 交互式图谱 |
| **安装方式** | 独立二进制/npm | pip install |
| **最佳场景** | 日常开发中的快速代码探索 | PR 审查、影响分析、架构文档 |

### 选型建议

**选择 CodeGraph 如果：**
- 你主要需要快速探索代码库结构
- 你使用 TypeScript/JavaScript 项目（框架路由识别更精准）
- 你偏好零配置、开箱即用的工具
- 你需要一个轻量级的 MCP 服务器

**选择 Code Review Graph 如果：**
- 你主要需要代码审查和 PR 审核
- 你需要 Blast-Radius 影响分析
- 你想了解代码库的架构模块划分（社区检测）
- 你需要 Wiki 自动生成和可视化

**两者都用：**
- CodeGraph 用于日常开发中的快速代码探索
- CRG 用于代码审查、PR 审核和架构分析
- 两者通过 MCP 并行运行，互不冲突

## 相关资源

- [CodeGraph GitHub](https://github.com/colbymchenry/codegraph) — 项目仓库（38k+ Stars）
- [CodeGraph 文档](https://colbymchenry.github.io/codegraph/) — 官方文档网站
- [CodeGraph npm](https://www.npmjs.com/package/@colbymchenry/codegraph) — npm 包页面

## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 MCP 服务器和 API Provider
- [技巧与最佳实践](/tips/best-practices) — 更多高效使用技巧
