---
title: Code Review Graph
description: 使用 Code Review Graph 构建审查导向的代码图谱，实现 38x-528x 的 Token 节省
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★☆  | ★★★☆☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握 Code Review Graph 的安装、图谱构建和 30 个 MCP 工具的使用方法，能独立使用 Blast-Radius 分析和变更风险评分进行高质量代码审查

**🚀 AI 能力提升：** 代码审查
:::

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

| 功能组          | 说明                              |
| --------------- | --------------------------------- |
| `[embeddings]`  | 语义搜索（sentence-transformers） |
| `[communities]` | 社区检测（igraph）                |
| `[enrichment]`  | Python 调用解析（jedi）           |
| `[wiki]`        | Wiki 生成（ollama）               |
| `[all]`         | 全部功能                          |

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

| 命令                              | 用途                                      |
| --------------------------------- | ----------------------------------------- |
| `/code-review-graph:build-graph`  | 构建或更新知识图谱                        |
| `/code-review-graph:review-delta` | 审查上次提交以来的变更（含 Blast-Radius） |
| `/code-review-graph:review-pr`    | 审查 PR/分支差异（含完整影响分析）        |

## MCP 工具集

CRG 提供 30 个 MCP 工具，分为以下类别：

### 上下文获取

| 工具                  | 用途                                              |
| --------------------- | ------------------------------------------------- |
| `get_minimal_context` | 超紧凑概览（~100 Token）——**优先调用此工具**      |
| `get_review_context`  | 完整审查上下文（含源码）                          |
| `query_graph`         | 定向查询（callers_of、callees_of、imports_of 等） |

### 影响分析

| 工具                 | 用途                                     |
| -------------------- | ---------------------------------------- |
| `get_impact_radius`  | Blast-Radius 分析——变更影响了哪些代码    |
| `detect_changes`     | 变更风险评分，映射到受影响的函数/流/社区 |
| `get_affected_flows` | 受影响的执行流                           |

### 图谱遍历

| 工具                      | 用途           |
| ------------------------- | -------------- |
| `traverse_graph`          | BFS/DFS 图遍历 |
| `semantic_search_nodes`   | 语义/向量搜索  |
| `list_flows` / `get_flow` | 执行流分析     |

### 架构分析

| 工具                                 | 用途               |
| ------------------------------------ | ------------------ |
| `get_architecture_overview`          | 架构概览           |
| `list_communities` / `get_community` | 社区（模块）分析   |
| `get_hub_nodes` / `get_bridge_nodes` | 枢纽节点和桥接节点 |

### 重构辅助

| 工具             | 用途                   |
| ---------------- | ---------------------- |
| `refactor`       | 重命名预览、死代码检测 |
| `apply_refactor` | 执行重构               |

### Wiki 和文档

| 工具            | 用途                         |
| --------------- | ---------------------------- |
| `generate_wiki` | 从社区自动生成 Markdown Wiki |
| `get_wiki_page` | 获取 Wiki 页面               |

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

## 与 CodeGraph、Graphify、GitNexus 的对比

[CodeGraph](/guide/advanced/code-graph/codegraph)、[Graphify](/guide/advanced/code-graph/graphify) 和 [GitNexus](/guide/advanced/code-graph/gitnexus) 是另外几个基于代码图谱的工具。四者都通过 MCP 为 Claude Code 提供代码理解能力，但设计重点不同：

| 方面           | CodeGraph                               | Code Review Graph                         | Graphify                            | GitNexus                        |
| -------------- | --------------------------------------- | ----------------------------------------- | ----------------------------------- | ------------------------------- |
| **定位**       | 日常代码探索                            | 代码审查和架构分析                        | 多模态知识图谱                      | 工程化代码智能平台              |
| **语言**       | TypeScript (npm)                        | Python (pip)                              | Python (pip)                        | TypeScript (npx)                |
| **输入类型**   | 代码文件                                | 代码文件                                  | 代码 + 文档 + PDF + 图片            | 代码文件                        |
| **MCP 工具数** | 10                                      | 30                                        | MCP 服务器模式                      | 13+                             |
| **核心工具**   | `codegraph_explore`（一次调用回答问题） | `get_minimal_context`（~100 Token 概览）  | 自然语言 query + 路径发现           | `detect_changes` / `api_impact` |
| **特色能力**   | 简洁、快速、零配置                      | Blast-Radius、社区检测、执行流、Wiki 生成 | 多模态、意外连接发现、Obsidian 导出 | 多仓库、API shape check、平台化 |
| **Token 优化** | 35% 费用降低                            | 38x-528x Token 节省                       | 71.5x Token 节省                    | —                               |
| **语言支持**   | 20+                                     | 30+                                       | 13+                                 | 20+                             |
| **框架路由**   | 14 个框架                               | 无                                        | 无                                  | 有                              |
| **社区检测**   | 无                                      | Leiden 算法                               | Leiden 算法                         | 有                              |
| **可视化**     | 无                                      | D3.js 交互式图谱                          | vis.js + SVG + GraphML + Neo4j      | Web UI                          |
| **安装方式**   | 独立二进制/npm                          | pip install                               | pip install                         | npx                             |
| **最佳场景**   | 日常开发中的快速代码探索                | PR 审查、影响分析、架构文档               | 研究材料整理、跨文档关联发现        | 多仓库、API impact、平台化      |

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

**选择 Graphify 如果：**

- 你有混合类型的材料（代码 + 论文 + PDF + 图片）
- 你需要发现跨文档类型的关联
- 你想要 Obsidian 或 Neo4j 格式的输出
- 你正在做研究或知识管理工作

**选择 GitNexus 如果：**

- 你有多仓库系统需要统一管理
- 你需要 API impact 和 shape check 能力
- 你在构建企业内部代码智能平台
- 你有平台团队维护基础设施

**注意许可证：** 商业项目必须先获取 GitNexus 商业授权。

**组合使用：**

- CodeGraph 用于日常开发中的快速代码探索
- CRG 用于代码审查、PR 审核和架构分析
- Graphify 用于研究材料整理和跨文档知识整合
- GitNexus 用于多仓库管理和 API impact 分析
- 四者通过 MCP 并行运行，互不冲突

:::tip
更多四工具详细对比、差异分析和兼容性说明，请参考[代码图谱工具对比](/guide/advanced/code-graph/code-graph-tools)。
:::

## 配置

### 环境变量

| 变量                   | 默认值                | 说明                       |
| ---------------------- | --------------------- | -------------------------- |
| `CRG_DATA_DIR`         | `.code-review-graph/` | 数据存储目录               |
| `CRG_EMBEDDING_MODEL`  | `all-MiniLM-L6-v2`    | 语义搜索模型               |
| `CRG_MAX_IMPACT_NODES` | 500                   | 影响分析最大节点数         |
| `CRG_MAX_IMPACT_DEPTH` | 2                     | Blast-Radius 跳数          |
| `CRG_TOOLS`            | (全部)                | MCP 工具白名单（逗号分隔） |
| `CRG_GIT_TIMEOUT`      | 30                    | Git 命令超时（秒）         |

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

- [代码图谱工具对比](/guide/advanced/code-graph/code-graph-tools) — CodeGraph、CRG、Graphify、GitNexus 四工具详细对比
- [CodeGraph 代码智能](/guide/advanced/code-graph/codegraph) — 互补的代码探索工具
- [Graphify 知识图谱](/guide/advanced/code-graph/graphify) — 多模态知识图谱工具
- [GitNexus 代码智能平台](/guide/advanced/code-graph/gitnexus) — 企业级代码智能平台
- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 MCP 服务器和 API Provider
