---
title: 代码图谱工具对比
description: CodeGraph、Code Review Graph、Graphify 三工具的全面对比——定位、能力、差异与兼容性分析
---

# 代码图谱工具对比

Claude Code 生态中有三个主要的代码图谱工具：**CodeGraph**、**Code Review Graph**（CRG）和 **Graphify**。它们都使用 tree-sitter 解析代码、通过 MCP 协议为 Claude Code 提供智能，但设计哲学和适用场景各不相同。本文从定位、能力、差异和兼容性四个维度进行详细对比。

## 定位总览

```
CodeGraph       →  日常代码探索（"这个项目怎么工作的？"）
Code Review Graph →  代码审查与架构分析（"这个改动影响了什么？"）
Graphify         →  多模态知识图谱（"代码和论文之间有什么关联？"）
```

| 维度           | CodeGraph                | Code Review Graph      | Graphify                   |
| -------------- | ------------------------ | ---------------------- | -------------------------- |
| **一句话定位** | 代码知识图谱——快速探索   | 审查导向——影响分析     | 多模态——跨文档知识图谱     |
| **核心问题**   | "这个符号在哪、怎么用？" | "改了这个会影响什么？" | "这些材料之间有什么关系？" |
| **目标用户**   | 日常开发者               | 代码审查者、架构师     | 研究者、知识工作者         |

## 技术对比

### 基础信息

| 方面         | CodeGraph        | Code Review Graph | Graphify                   |
| ------------ | ---------------- | ----------------- | -------------------------- |
| **实现语言** | TypeScript       | Python            | Python                     |
| **安装方式** | 独立二进制 / npm | pip install       | pip install（`graphifyy`） |
| **存储**     | SQLite + FTS5    | SQLite            | JSON 文件（`graph.json`）  |
| **图库**     | 自定义           | 自定义            | NetworkX                   |
| **解析引擎** | tree-sitter      | tree-sitter       | tree-sitter + Claude       |
| **开源协议** | MIT              | MIT               | 未明确                     |

### 输入支持

| 输入类型          | CodeGraph | Code Review Graph | Graphify |
| ----------------- | --------- | ----------------- | -------- |
| **代码文件**      | ✅        | ✅                | ✅       |
| **Markdown/文本** | ❌        | ❌                | ✅       |
| **PDF**           | ❌        | ❌                | ✅       |
| **图片**          | ❌        | ❌                | ✅       |

### 编程语言支持

| 工具                  | 语言数量 | 代表性语言                                                                           |
| --------------------- | -------- | ------------------------------------------------------------------------------------ |
| **CodeGraph**         | 20+      | TypeScript、JavaScript、Python、Go、Rust、Java、C#、Ruby、Swift、Kotlin              |
| **Code Review Graph** | 30+      | 上述 + Scala、Solidity、Dart、R、Perl、Lua、PowerShell、Julia、SQL 等                |
| **Graphify**          | 13+      | Python、TypeScript、JavaScript、Go、Rust、Java、C、C++、Ruby、C#、Kotlin、Scala、PHP |

### 框架路由识别

| 工具                  | 支持的框架                                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **CodeGraph**         | 14 个：Django、Flask、FastAPI、Express、NestJS、Laravel、Rails、Spring、Gin、Axum、ASP.NET、Vapor、React Router、SvelteKit |
| **Code Review Graph** | 无                                                                                                                         |
| **Graphify**          | 无（专注于通用知识图谱，不针对特定框架）                                                                                   |

## 功能对比

### MCP 集成

| 方面           | CodeGraph           | Code Review Graph                    | Graphify                                   |
| -------------- | ------------------- | ------------------------------------ | ------------------------------------------ |
| **MCP 工具数** | 10                  | 30                                   | MCP 服务器模式（查询接口）                 |
| **主力工具**   | `codegraph_explore` | `get_minimal_context`                | 自然语言 query                             |
| **Slash 命令** | 无                  | 3 个（build/review-delta/review-pr） | 多个（/graphify、query、path、explain 等） |
| **配置方式**   | `codegraph install` | `code-review-graph install`          | `graphify install`                         |

### 核心能力矩阵

| 能力                 | CodeGraph     | Code Review Graph  | Graphify                           |
| -------------------- | ------------- | ------------------ | ---------------------------------- |
| **符号搜索**         | ✅            | ✅                 | ✅                                 |
| **调用链追踪**       | ✅            | ✅（执行流）       | ✅                                 |
| **影响分析**         | ✅            | ✅（Blast-Radius） | ✅（图遍历）                       |
| **框架路由识别**     | ✅（14 个）   | ❌                 | ❌                                 |
| **社区检测**         | ❌            | ✅（Leiden）       | ✅（Leiden）                       |
| **多模态输入**       | ❌            | ❌                 | ✅                                 |
| **意外连接发现**     | ❌            | ❌                 | ✅                                 |
| **代码审查**         | ❌            | ✅（专用）         | ❌                                 |
| **Wiki 生成**        | ❌            | ✅                 | ✅                                 |
| **可视化**           | ❌            | ✅（D3.js）        | ✅（vis.js + SVG + GraphML）       |
| **Obsidian 导出**    | ❌            | ❌                 | ✅                                 |
| **Neo4j 导出**       | ❌            | ❌                 | ✅                                 |
| **Git Hook 同步**    | ❌            | ❌                 | ✅                                 |
| **文件监听自动同步** | ✅（OS 原生） | ✅（watch 命令）   | ✅（--watch）                      |
| **增量更新**         | ✅            | ✅                 | ✅（--update）                     |
| **边透明度标注**     | ❌            | ❌                 | ✅（EXTRACTED/INFERRED/AMBIGUOUS） |

### Token 优化

| 工具                  | 节省方式                        | 基准数据                     |
| --------------------- | ------------------------------- | ---------------------------- |
| **CodeGraph**         | 一次 MCP 调用替代多次 Grep+Read | 35% 费用降低，57% 更少 Token |
| **Code Review Graph** | 紧凑的 ~100 Token 概览          | 38x-528x Token 节省          |
| **Graphify**          | 持久化图谱，无需重读原始文件    | 71.5x Token 节省             |

:::warning
三个工具的 Token 节省数据来自不同的基准测试，测试条件不同，不宜直接横向比较数值大小。
:::

## 差异分析

### 设计哲学差异

**CodeGraph** 追求**简洁和零配置**——不写配置文件，不选参数，安装后直接使用。它的 10 个工具都有清晰的职责，`codegraph_explore` 一个工具就能回答大多数问题。适合"我只想快点搞懂这个代码库"的场景。

**Code Review Graph** 追求**深度和专业性**——30 个工具覆盖从上下文获取到架构分析、从重构辅助到 Wiki 生成的完整审查链路。它的 Blast-Radius 分析和变更风险评分是独有的审查能力。适合"我要认真审查这个 PR"的场景。

**Graphify** 追求**广度和多模态**——不仅处理代码，还能理解论文、PDF、图片和笔记。它的意外连接发现能力是独有的——能找出代码与论文之间的关联。适合"我有一堆混合材料需要整理"的场景。

### 存储与查询差异

| 方面         | CodeGraph        | Code Review Graph        | Graphify           |
| ------------ | ---------------- | ------------------------ | ------------------ |
| **存储格式** | SQLite + FTS5    | SQLite                   | JSON + NetworkX    |
| **查询方式** | SQL + MCP 工具   | SQL + MCP 工具           | 自然语言 + 图遍历  |
| **全文搜索** | ✅ FTS5          | ✅                       | ❌（语义查询）     |
| **图遍历**   | 调用链           | BFS/DFS                  | NetworkX 路径算法  |
| **持久性**   | .codegraph/ 目录 | .code-review-graph/ 目录 | graphify-out/ 目录 |

### 可视化差异

| 方面             | CodeGraph | Code Review Graph    | Graphify               |
| ---------------- | --------- | -------------------- | ---------------------- |
| **交互式可视化** | 无        | D3.js HTML           | vis.js HTML            |
| **静态导出**     | 无        | GraphML              | SVG、GraphML           |
| **专业工具导出** | 无        | GraphML（Gephi/yEd） | GraphML + Neo4j Cypher |
| **笔记系统导出** | 无        | 无                   | Obsidian vault         |

## 兼容性

### 三者可以同时使用

CodeGraph、Code Review Graph 和 Graphify **完全兼容**——它们通过 MCP 协议独立运行，互不干扰：

```json
{
  "mcpServers": {
    "codegraph": {
      "type": "stdio",
      "command": "codegraph",
      "args": ["serve", "--mcp"]
    },
    "code-review-graph": {
      "type": "stdio",
      "command": "code-review-graph",
      "args": ["serve"]
    },
    "graphify": {
      "type": "stdio",
      "command": "graphify",
      "args": ["./raw", "--mcp"]
    }
  }
}
```

### 共存注意事项

| 注意点               | 说明                                                                                |
| -------------------- | ----------------------------------------------------------------------------------- |
| **数据目录独立**     | 各自使用独立目录（`.codegraph/`、`.code-review-graph/`、`graphify-out/`），互不冲突 |
| **Python 环境**      | CRG 和 Graphify 都是 Python 包，建议使用独立虚拟环境或 `pipx` 避免依赖冲突          |
| **tree-sitter 版本** | 各工具捆绑自己的 tree-sitter 绑定，不存在版本冲突                                   |
| **MCP 服务器资源**   | 同时运行三个 MCP 服务器会占用更多内存，但 MCP 是按需查询，空闲时资源消耗极低        |
| **Git Hook 冲突**    | 如果同时使用 Graphify 的 Git Hook 和其他工具的 hook，确保它们按预期顺序执行         |

### 与 Claude Code 生态的集成

三个工具都与 Claude Code 生态中的其他工具兼容：

| 生态工具        | CodeGraph               | Code Review Graph      | Graphify               |
| --------------- | ----------------------- | ---------------------- | ---------------------- |
| **CC-Switch**   | ✅ MCP 配置管理         | ✅ MCP 配置管理        | ✅ MCP 配置管理        |
| **Serena**      | ✅ 互补（探索 vs 重构） | ✅ 互补                | ✅ 互补                |
| **Superpowers** | ✅ 开发纪律 + 代码智能  | ✅ 审查纪律 + 影响分析 | ✅ 研究纪律 + 知识图谱 |

## 组合使用建议

### 按场景组合

| 场景                | 推荐组合                   | 说明                        |
| ------------------- | -------------------------- | --------------------------- |
| **日常开发**        | CodeGraph                  | 零配置，快速探索代码结构    |
| **PR 审查**         | Code Review Graph          | Blast-Radius + 变更风险评分 |
| **研究材料整理**    | Graphify                   | 多模态输入 + 意外连接发现   |
| **大型项目全链路**  | CodeGraph + CRG            | 探索 + 审查，分工明确       |
| **代码 + 论文研究** | CodeGraph + Graphify       | 代码探索 + 跨文档关联       |
| **完整工具链**      | CodeGraph + CRG + Graphify | 各司其职，MCP 并行运行      |

### 推荐工作流

```
日常开发阶段：
  CodeGraph → 快速探索代码结构和调用链

代码审查阶段：
  CRG → Blast-Radius 分析 + 变更风险评分 + 审查报告

研究整理阶段：
  Graphify → 构建代码+论文+笔记的统一知识图谱

综合阶段（大型项目）：
  CodeGraph（探索） + CRG（审查） + Graphify（知识整合）
```

:::tip
使用 [AGENTS 全局路由协议](/guide/advanced/agents-routing) 定义多个工具共存时的分工规则，让 Claude Code 根据问题类型自动选择合适的工具。
:::

## 详细文档

| 工具                                                   | 文档                             |
| ------------------------------------------------------ | -------------------------------- |
| [CodeGraph](/guide/advanced/codegraph)                 | 安装、MCP 工具集、使用示例       |
| [Code Review Graph](/guide/advanced/code-review-graph) | 安装、30 个 MCP 工具、审查工作流 |
| [Graphify](/guide/advanced/graphify)                   | 安装、多模态处理、导出格式       |

## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理多个 MCP 服务器配置
- [AGENTS 路由协议](/guide/advanced/agents-routing) — 定义工具间的分工规则
- [Serena 代码语义](/guide/advanced/serena) — IDE 级精确重构能力
