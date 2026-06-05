---
title: Graphify 知识图谱
description: 使用 Graphify 将代码、文档、PDF、图片转化为交互式知识图谱，实现 71.5x 的 Token 节省
---

# Graphify 知识图谱

Graphify 是一个多模态知识图谱工具，能将代码、文档、PDF 和图片转化为可查询的交互式图谱。它使用 tree-sitter 解析代码、Claude 视觉理解图片和 PDF，通过 MCP 协议为 Claude Code 提供跨文档类型的结构化知识，声称实现 **71.5x 的 Token 节省**。

## 为什么需要 Graphify

Claude Code 在处理混合研究材料（代码 + 论文 + 截图 + 笔记）时面临挑战：

- **Token 浪费**：直接读取原始文件消耗大量上下文窗口
- **跨文档盲区**：无法自动发现代码与论文、笔记之间的关联
- **知识不持久**：每次会话都需要重新理解相同的材料
- **缺乏结构**：文件散落在目录中，没有统一的知识组织方式

Graphify 解决了这些问题——它读取你的文件、构建知识图谱、返回你未曾发现的结构。

:::info
基准测试结果（Karpathy repos + 5 papers + 4 images，52 文件）：

- **71.5x Token 节省**（相比直接读取原始文件）
- **持久化图谱**（跨会话复用，无需重新解析）
- **多模态支持**（代码 + 文档 + PDF + 图片）
  :::

## 工作原理

```
源文件 → 多模态提取 → 知识图谱 → 交互式可视化 / MCP 查询
```

1. **代码文件**：tree-sitter AST 解析 + 调用图分析
2. **文档文件**（.md/.txt/.rst）：概念和关系提取（通过 Claude）
3. **PDF 文件**：引用挖掘和概念提取
4. **图片文件**（.png/.jpg/.webp/.gif）：Claude 视觉理解
5. **图谱构建**：NetworkX 图结构 + Leiden 社区检测算法
6. **输出**：交互式 HTML 可视化 / Obsidian vault / Wiki / MCP 服务器

:::tip
每条边都标记为 `EXTRACTED`（提取）、`INFERRED`（推断）或 `AMBIGUOUS`（模糊），提供透明度——你能清楚知道什么是直接发现的，什么是推测的。
:::

## 安装

### 系统要求

- **Claude Code**
- **Python** 3.10 或更高版本

### 安装 Graphify

```bash
pip install graphifyy && graphify install
```

:::warning
PyPI 包名暂时为 `graphifyy`（`graphify` 名称正在回收中），但 CLI 命令仍是 `graphify`。
:::

**平台注意事项：**

| 平台    | 注意事项                                                                    |
| ------- | --------------------------------------------------------------------------- |
| macOS   | 如果 `pip install` 失败（externally-managed-environment），使用 `pipx install graphifyy` |
| Windows | 可能需要将 Python Scripts 目录添加到 PATH，或使用 `pipx install graphifyy`  |
| Linux   | 直接 `pip install graphifyy` 即可                                           |

### 手动安装

如果 pip 安装不可用，可以手动安装：

```bash
curl -fsSL https://raw.githubusercontent.com/safishamsi/graphify/main/install.sh | sh
```

这会将 `SKILL.md` 放置到 `~/.claude/skills/graphify/` 并在 `~/.claude/CLAUDE.md` 中添加引用。

## Slash 命令

Graphify 为 Claude Code 提供以下 Slash 命令：

| 命令                            | 用途                             |
| ------------------------------- | -------------------------------- |
| `/graphify`                     | 对当前目录构建知识图谱           |
| `/graphify ./raw`               | 对指定文件夹构建知识图谱         |
| `/graphify ./raw --mode deep`   | 深度模式——更激进的推断边提取     |
| `/graphify ./raw --update`      | 增量更新——仅重新处理变更文件     |
| `/graphify add <url>`           | 获取论文（arXiv）或推文（X）并更新图谱 |
| `/graphify query "..."`         | 自然语言查询图谱                 |
| `/graphify path "A" "B"`        | 查找两个概念之间的路径           |
| `/graphify explain "..."`       | 解释特定概念                     |

## 输出结构

运行 Graphify 后，会在目标目录生成 `graphify-out/` 目录：

| 输出文件          | 说明                                       |
| ----------------- | ------------------------------------------ |
| `graph.html`      | 交互式可视化——支持节点点击、搜索、社区过滤 |
| `obsidian/`       | Obsidian vault 结构——可在 Obsidian 中浏览  |
| `wiki/`           | Wikipedia 风格的文章——供 Agent 导航（`--wiki` 标志） |
| `GRAPH_REPORT.md` | 分析报告——God 节点、意外连接、建议问题     |
| `graph.json`      | 持久化图谱数据——支持数周后查询无需重新读取 |
| `cache/`          | SHA256 缓存——重运行仅处理变更文件          |

### 分析报告内容

`GRAPH_REPORT.md` 包含以下分析：

- **God 节点**：最高度数的概念——展示所有内容通过什么连接
- **意外连接**：按复合分数排序，代码-论文边排名高于代码-代码边，每条连接附带英文解释
- **建议问题**：4-5 个图谱独特适合回答的问题
- **Token 基准**：每次运行自动打印 Token 节省量

## 自动同步

### 文件监听（`--watch`）

```bash
graphify ./raw --watch
```

在后台终端运行，文件变更时自动更新图谱：

- **代码文件保存**：即时 AST 重建（无需 LLM）
- **文档/图片变更**：通知建议运行 `--update` 进行 LLM 重新处理
- 专为"多个 Agent 并行写代码"的场景设计

### Git Hook

```bash
graphify hook install
```

安装 post-commit hook——每次提交后自动重建图谱，无需后台进程。可与现有 hook 安全共存。

## Wiki 模式

```bash
graphify ./raw --wiki
```

为每个社区和 God 节点生成 Wikipedia 风格的 Markdown 文章，包含 `index.md` 入口点。专为 Agent 导航设计——Agent 可以读取文件代替解析 JSON。

## MCP 服务器

```bash
graphify ./raw --mcp
```

启动 stdio 模式的 MCP 服务器，让 Claude Code 直接查询知识图谱。

配置 Claude Code 使用 Graphify MCP 服务器：

```json
{
  "mcpServers": {
    "graphify": {
      "type": "stdio",
      "command": "graphify",
      "args": ["./raw", "--mcp"]
    }
  }
}
```

### 通过 CC-Switch 管理

如果你已安装 [CC-Switch](/guide/advanced/cc-switch)，可以通过它管理 Graphify 的 MCP 服务器配置：

1. 打开 CC-Switch Desktop
2. 进入 MCP 服务器管理
3. 添加 Graphify MCP 服务器配置
4. CC-Switch 会自动同步到 Claude Code

:::tip
CC-Switch 特别适合在多个 AI 工具之间同步 Graphify 的 MCP 配置——一次配置，所有工具生效。
:::

## 导出格式

| 格式                          | 命令           | 用途                        |
| ----------------------------- | -------------- | --------------------------- |
| HTML（默认）                  | `/graphify`    | 交互式 vis.js 可视化        |
| SVG                           | `--svg`        | 静态矢量图                  |
| GraphML                       | `--graphml`    | 导入 Gephi、yEd 等工具      |
| Neo4j Cypher                  | `--neo4j`      | 生成 `cypher.txt` 导入 Neo4j |
| MCP Server                    | `--mcp`        | stdio 模式 MCP 服务器       |
| Obsidian Vault                | 自动生成       | Obsidian 知识库             |
| Wiki（Markdown）              | `--wiki`       | Agent 可爬取的 Wiki         |

## 使用示例

### 研究材料图谱

```
> /graphify ./raw --mode deep
```

将 `raw/` 目录中的论文、代码、截图和笔记转化为统一的知识图谱，发现跨文档类型的关联。

### 增量更新

```
> /graphify ./raw --update
```

仅重新处理变更的文件，合并到现有图谱中。适合在添加新论文或修改代码后快速更新。

### 概念查询

```
> /graphify query "What are the connections between the transformer architecture and the codebase's attention module?"
```

对持久化图谱进行自然语言查询，无需重新读取原始文件。

### 路径发现

```
> /graphify path "attention mechanism" "UserAuthentication"
```

发现两个看似无关的概念之间的路径——适合发现代码与论文之间的意外关联。

## 技术栈

| 组件          | 技术                            |
| ------------- | ------------------------------- |
| 图操作        | NetworkX                        |
| 社区检测      | Leiden 算法（via graspologic）  |
| 代码解析      | tree-sitter                     |
| 语义提取      | Claude（LLM + Vision）          |
| 可视化        | vis.js                          |

:::info
无需 Neo4j、无需服务器——完全在本地运行。
:::

## 与 CodeGraph、Code Review Graph 的对比

[CodeGraph](/guide/advanced/codegraph) 和 [Code Review Graph](/guide/advanced/code-review-graph) 是另外两个基于代码图谱的智能工具。三者都通过 MCP 为 Claude Code 提供代码理解能力，但设计定位和适用场景不同：

| 方面           | CodeGraph                    | Code Review Graph                | Graphify                          |
| -------------- | ---------------------------- | -------------------------------- | --------------------------------- |
| **定位**       | 日常代码探索                 | 代码审查和架构分析               | 多模态知识图谱                    |
| **语言**       | TypeScript (npm)             | Python (pip)                     | Python (pip)                      |
| **输入类型**   | 代码文件                     | 代码文件                         | 代码 + 文档 + PDF + 图片          |
| **MCP 工具数** | 10                           | 30                               | MCP 服务器模式                    |
| **核心能力**   | `codegraph_explore` 一次调用 | `get_minimal_context` ~100 Token | 跨文档知识图谱 + 自然语言查询     |
| **特色**       | 零配置、框架路由             | Blast-Radius、社区检测、Wiki     | 多模态、意外连接发现、Obsidian 导出 |
| **Token 优化** | 35% 费用降低                 | 38x-528x Token 节省              | 71.5x Token 节省                  |
| **社区检测**   | 无                           | Leiden 算法                      | Leiden 算法（via graspologic）    |
| **可视化**     | 无                           | D3.js 交互式图谱                 | vis.js 交互式 + SVG + GraphML     |
| **安装方式**   | 独立二进制 / npm             | pip install                      | pip install                       |
| **最佳场景**   | 日常开发中的快速代码探索     | PR 审查、影响分析、架构文档      | 研究材料整理、跨文档关联发现      |

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

**组合使用：**

- CodeGraph + Graphify：CodeGraph 用于日常代码探索，Graphify 用于研究材料整理
- CRG + Graphify：CRG 用于代码审查，Graphify 用于将审查笔记与代码关联
- 三者通过 MCP 并行运行，互不冲突

:::tip
三者可以互补：CodeGraph 适合日常开发中的快速代码探索，CRG 适合代码审查和架构分析，Graphify 适合跨文档类型的知识整合。更多对比细节请参考[代码图谱工具对比](/guide/advanced/code-graph-tools)。
:::

## 相关资源

- [Graphify GitHub](https://github.com/safishamsi/graphify) — 项目仓库
- [Graphify PyPI](https://pypi.org/project/graphifyy/) — Python 包页面（包名 `graphifyy`）

## 下一步

- [代码图谱工具对比](/guide/advanced/code-graph-tools) — CodeGraph、CRG、Graphify 三工具详细对比
- [CodeGraph 代码智能](/guide/advanced/codegraph) — 代码探索工具
- [Code Review Graph](/guide/advanced/code-review-graph) — 代码审查工具
- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 MCP 服务器和 API Provider
