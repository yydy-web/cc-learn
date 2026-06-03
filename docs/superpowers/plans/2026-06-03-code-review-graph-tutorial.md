# Code Review Graph Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Claude Code 教程站点中添加 Code Review Graph (CRG) 的介绍和使用教程，展示如何通过代码审查图谱减少 Token 消耗并提升代码审查效率。

**Architecture:** 新建一个高级篇页面 `docs/guide/advanced/code-review-graph.md`，介绍 CRG 的核心理念（审查导向的代码图谱）、与 CodeGraph 的对比、30 个 MCP 工具、安装配置方式，并展示通过 CC-Switch 管理 MCP 服务器的方式。同时更新 4 个现有页面添加交叉引用。

**Tech Stack:** Rspress v2, Markdown/MDX, YAML frontmatter

---

## File Structure

| 操作 | 文件 | 职责 |
|------|------|------|
| 创建 | `docs/guide/advanced/code-review-graph.md` | CRG 完整教程页面 |
| 修改 | `docs/guide/advanced/_meta.json` | 侧边栏添加 codegraph 条目 |
| 修改 | `docs/guide/advanced/codegraph.md` | 添加 CRG 对比说明 |
| 修改 | `docs/index.md` | 首页高级篇描述中加入 CRG |
| 修改 | `docs/tips/best-practices.md` | 添加代码审查图谱最佳实践 |

---

### Task 1: 创建 Code Review Graph 教程页面

**Files:**
- Create: `docs/guide/advanced/code-review-graph.md`

- [ ] **Step 1: 创建完整的 CRG 教程页面**

Write the following file to `docs/guide/advanced/code-review-graph.md`:

```markdown
---
title: Code Review Graph
description: 使用 Code Review Graph 构建审查导向的代码图谱，实现 38x-528x 的 Token 节省
---

# Code Review Graph

Code Review Graph（CRG）是一个本地优先的代码审查图谱工具，专为 AI 代码审查优化。它使用 tree-sitter 解析代码库，构建包含函数、类、导入、调用关系和测试的结构化图谱，通过 MCP 协议为 Claude Code 提供精准的审查上下文，实现 **38x-528x 的 Token 节省**（中位数约 82x）。

## 核心能力

CRG 不仅仅是代码索引——它是一个**审查导向**的代码智能工具：

- **Blast-Radius 分析**：当文件变更时，追踪所有调用者、依赖者和受影响的测试
- **社区检测**：使用 Leiden 算法自动识别代码库的架构模块
- **执行流分析**：追踪函数调用链，生成端到端的执行路径
- **变更风险评分**：对代码变更进行风险评估，标记高影响区域
- **30 个 MCP 工具**：覆盖探索、审查、重构、Wiki 生成等场景

:::info
基准测试结果（6 个仓库，13 次提交）：
- **38x-528x Token 节省**
- **100% 召回率**（不遗漏相关代码）
- **F1 0.71**（精度与召回的平衡）
:::

## 安装

### 系统要求

- **Python** 3.10 或更高版本
- **pip** 或 **uv**（推荐 uv）

### 安装 CRG

```bash
# 基础安装
pip install code-review-graph

# 推荐：安装全部功能
pip install code-review-graph[all]
```

可选功能组：

| 功能组 | 说明 |
|--------|------|
| `[embeddings]` | 语义搜索（sentence-transformers） |
| `[communities]` | 社区检测（igraph） |
| `[enrichment]` | Python 调用解析（jedi） |
| `[wiki]` | Wiki 生成（ollama） |
| `[all]` | 全部功能 |

### 配置 Claude Code

```bash
# 自动检测并配置所有 AI 工具
code-review-graph install

# 或仅配置 Claude Code
code-review-graph install --platform claude-code
```

### 构建图谱

```bash
cd your-project
code-review-graph build
```

构建完成后，CRG 会在项目根目录创建 `.code-review-graph/` 目录，包含 SQLite 数据库。

### 通过 CC-Switch 管理

如果你已安装 [CC-Switch](/guide/advanced/cc-switch)，可以通过它管理 CRG 的 MCP 服务器配置：

1. 打开 CC-Switch Desktop
2. 进入 MCP 服务器管理
3. 添加 Code Review Graph MCP 服务器配置
4. CC-Switch 会自动同步到 Claude Code

:::tip
CC-Switch 特别适合在多个 AI 工具之间同步 CRG 的 MCP 配置——一次配置，所有工具生效。
:::

## Slash 命令

CRG 为 Claude Code 提供 3 个专用 Slash 命令：

| 命令 | 用途 |
|------|------|
| `/code-review-graph:build-graph` | 构建或更新知识图谱 |
| `/code-review-graph:review-delta` | 审查上次提交以来的变更（含 Blast-Radius） |
| `/code-review-graph:review-pr` | 审查 PR/分支差异（含完整影响分析） |

## MCP 工具集

CRG 提供 30 个 MCP 工具，分为以下类别：

### 上下文获取

| 工具 | 用途 |
|------|------|
| `get_minimal_context` | 超紧凑概览（~100 Token）——**优先调用此工具** |
| `get_review_context` | 完整审查上下文（含源码） |
| `query_graph` | 定向查询（callers_of、callees_of、imports_of 等） |

### 影响分析

| 工具 | 用途 |
|------|------|
| `get_impact_radius` | Blast-Radius 分析——变更影响了哪些代码 |
| `detect_changes` | 变更风险评分，映射到受影响的函数/流/社区 |
| `get_affected_flows` | 受影响的执行流 |

### 图谱遍历

| 工具 | 用途 |
|------|------|
| `traverse_graph` | BFS/DFS 图遍历 |
| `semantic_search_nodes` | 语义/向量搜索 |
| `list_flows` / `get_flow` | 执行流分析 |

### 架构分析

| 工具 | 用途 |
|------|------|
| `get_architecture_overview` | 架构概览 |
| `list_communities` / `get_community` | 社区（模块）分析 |
| `get_hub_nodes` / `get_bridge_nodes` | 枢纽节点和桥接节点 |

### 重构辅助

| 工具 | 用途 |
|------|------|
| `refactor` | 重命名预览、死代码检测 |
| `apply_refactor` | 执行重构 |

### Wiki 和文档

| 工具 | 用途 |
|------|------|
| `generate_wiki` | 从社区自动生成 Markdown Wiki |
| `get_wiki_page` | 获取 Wiki 页面 |

## 使用示例

### 代码审查

```
> 帮我审查 src/services/auth.ts 的改动
```

Claude Code 会：
1. 调用 `get_minimal_context` 获取概览（~100 Token）
2. 调用 `detect_changes` 评估变更风险
3. 调用 `get_impact_radius` 分析 Blast-Radius
4. 调用 `get_review_context` 获取相关源码
5. 基于完整上下文给出审查意见

### PR 审查

```
> /code-review-graph:review-pr
审查 main..feature 分支的改动
```

CRG 会分析 PR 中所有变更文件的影响范围，生成包含 Blast-Radius 的审查报告。

### 架构理解

```
> 这个项目的架构是怎样的？有哪些主要模块？
```

Claude Code 会调用 `get_architecture_overview`，返回基于社区检测的架构图和模块划分。

## 与 CodeGraph 的对比

[CodeGraph](/guide/advanced/codegraph) 和 CRG 都使用 tree-sitter 构建代码图谱，但侧重点不同：

| 方面 | CodeGraph | Code Review Graph |
|------|-----------|-------------------|
| **语言** | TypeScript (npm) | Python (pip) |
| **MCP 工具数** | 10 | 30 |
| **特色能力** | 简洁、快速 | Blast-Radius、社区检测、Wiki 生成 |
| **安装方式** | 独立二进制/npm | pip install |
| **最佳场景** | 日常代码探索 | 代码审查和架构分析 |

:::tip
两者可以互补：CodeGraph 适合日常开发中的快速代码探索，CRG 适合代码审查、PR 审核和架构分析。
:::

## 配置

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `CRG_DATA_DIR` | `.code-review-graph/` | 数据存储目录 |
| `CRG_EMBEDDING_MODEL` | `all-MiniLM-L6-v2` | 语义搜索模型 |
| `CRG_MAX_IMPACT_NODES` | 500 | 影响分析最大节点数 |
| `CRG_MAX_IMPACT_DEPTH` | 2 | Blast-Radius 跳数 |
| `CRG_TOOLS` | (全部) | MCP 工具白名单（逗号分隔） |
| `CRG_GIT_TIMEOUT` | 30 | Git 命令超时（秒） |

### 排除文件

在项目根目录创建 `.code-review-graphignore` 文件，使用 gitignore 语法：

```text
# 排除测试数据
test/fixtures/

# 排除生成的代码
src/generated/
```

在 Git 仓库中，CRG 只索引 Git 跟踪的文件，`.gitignore` 中的文件自动排除。

## CLI 命令速查

```bash
# 安装和配置
code-review-graph install           # 配置 AI 工具
code-review-graph install --platform claude-code  # 仅配置 Claude Code

# 图谱管理
code-review-graph build             # 完整构建
code-review-graph build --skip-flows  # 跳过流分析（更快）
code-review-graph update            # 增量更新
code-review-graph update --brief    # 增量更新 + 风险面板
code-review-graph status            # 查看统计

# 变更分析
code-review-graph detect-changes    # 风险评分变更分析
code-review-graph detect-changes --brief  # 紧凑风险面板

# 可视化
code-review-graph visualize         # D3.js 交互式图谱
code-review-graph visualize --format graphml  # 导出 GraphML

# Wiki
code-review-graph wiki              # 从社区生成 Wiki

# 服务器
code-review-graph serve             # MCP 服务器（stdio）
code-review-graph serve --http      # HTTP 模式（localhost:5555）

# 文件监听
code-review-graph watch             # 自动增量更新
```

## 支持的语言

30+ 种编程语言：Python、JavaScript、TypeScript、TSX、Go、Rust、Java、C/C++、C#、Ruby、Kotlin、Swift、PHP、Scala、Solidity、Dart、R、Perl、Lua、Objective-C、Shell、Elixir、Zig、PowerShell、Julia、ReScript、GDScript、Nix、Verilog/SystemVerilog、SQL、Vue/Svelte/Astro SFC、Jupyter/Databricks Notebook

## 相关资源

- [Code Review Graph GitHub](https://github.com/tirth8205/code-review-graph) — 项目仓库（17k+ Stars）
- [Code Review Graph PyPI](https://pypi.org/project/code-review-graph/) — Python 包页面
- [Code Review Graph 文档](https://github.com/tirth8205/code-review-graph/tree/main/docs) — 详细文档

## 下一步

- [CodeGraph 代码智能](/guide/advanced/codegraph) — 互补的代码探索工具
- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 MCP 服务器和 API Provider
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/code-review-graph.md
git commit -m "docs: add Code Review Graph tutorial page"
```

---

### Task 2: 更新侧边栏导航

**Files:**
- Modify: `docs/guide/advanced/_meta.json`

- [ ] **Step 1: 添加 code-review-graph 到侧边栏**

将 `_meta.json` 从：
```json
["hooks", "mcp-servers", "custom-skills", "cc-switch", "superpowers", "gstack", "openspec", "ralph", "codegraph", "multi-agent", "automation"]
```
改为：
```json
["hooks", "mcp-servers", "custom-skills", "cc-switch", "superpowers", "gstack", "openspec", "ralph", "codegraph", "code-review-graph", "multi-agent", "automation"]
```

code-review-graph 放在 codegraph 之后，因为它们是互补的代码智能工具。

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/_meta.json
git commit -m "docs: add Code Review Graph to advanced sidebar navigation"
```

---

### Task 3: 更新 codegraph.md 添加 CRG 对比

**Files:**
- Modify: `docs/guide/advanced/codegraph.md`

- [ ] **Step 1: 在"相关资源"之前添加 CRG 对比**

在 `## 相关资源` 之前，添加：

```markdown
## 相关工具

[Code Review Graph](/guide/advanced/code-review-graph) 是另一个基于 tree-sitter 的代码图谱工具，侧重代码审查和 Blast-Radius 分析。两者可以互补：CodeGraph 适合日常代码探索，CRG 适合代码审查和架构分析。
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/codegraph.md
git commit -m "docs: add Code Review Graph comparison to CodeGraph page"
```

---

### Task 4: 更新首页描述

**Files:**
- Modify: `docs/index.md`

- [ ] **Step 1: 更新高级篇 features 描述**

将：
```yaml
    details: 探索 Hooks、MCP 服务器、自定义技能、CC-Switch 配置管理、Superpowers、Gstack、OpenSpec、Ralph 和 CodeGraph
```

改为：
```yaml
    details: 探索 Hooks、MCP 服务器、自定义技能、CC-Switch 配置管理、Superpowers、Gstack、OpenSpec、Ralph、CodeGraph 和 Code Review Graph
```

- [ ] **Step 2: Commit**

```bash
git add docs/index.md
git commit -m "docs: add Code Review Graph to homepage features description"
```

---

### Task 5: 更新最佳实践添加代码审查图谱

**Files:**
- Modify: `docs/tips/best-practices.md`

- [ ] **Step 1: 在 CodeGraph 小节之后添加 CRG 小节**

在"代码智能加速（CodeGraph）"小节之后、"## 省钱技巧"之前添加：

```markdown
### 代码审查图谱（Code Review Graph）

安装 [Code Review Graph](/guide/advanced/code-review-graph) 后，Claude Code 的代码审查会自动使用 Blast-Radius 分析：

```bash
pip install code-review-graph
code-review-graph install
code-review-graph build
```

CRG 提供 30 个 MCP 工具，覆盖代码审查、影响分析、架构理解和 Wiki 生成。Token 节省高达 38x-528x。
```

- [ ] **Step 2: Commit**

```bash
git add docs/tips/best-practices.md
git commit -m "docs: add Code Review Graph to best practices"
```

---

### Task 6: 构建验证

**Files:**
- None (verification only)

- [ ] **Step 1: 运行生产构建**

Run: `npm run build`
Expected: 所有页面构建成功，无报错。`doc_build/guide/advanced/code-review-graph.html` 应出现在输出中。

- [ ] **Step 2: 检查生成的页面**

确认以下页面都正确生成：
- `doc_build/guide/advanced/code-review-graph.html`
- `doc_build/guide/advanced/codegraph.html`（含新对比）
- `doc_build/index.html`（含更新描述）
- `doc_build/tips/best-practices.html`（含新小节）
