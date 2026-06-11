---
title: 代码图谱工具对比
description: CodeGraph、Code Review Graph、Graphify、GitNexus 四工具的全面对比——定位、能力、差异与兼容性分析
---

# 代码图谱工具对比

Claude Code 生态中有四个主要的代码图谱工具：**CodeGraph**、**Code Review Graph**（CRG）、**Graphify** 和 **GitNexus**。它们都使用 tree-sitter 解析代码、通过 MCP 协议为 Claude Code 提供智能，但设计哲学和适用场景各不相同。本文从定位、能力、差异和兼容性四个维度进行详细对比。

## 定位总览

```
CodeGraph       →  日常代码探索（"这个项目怎么工作的？"）
Code Review Graph →  代码审查与架构分析（"这个改动影响了什么？"）
Graphify         →  多模态知识图谱（"代码和论文之间有什么关联？"）
GitNexus         →  工程化代码智能平台（"多仓库、API 影响怎么管？"）
```

| 维度           | CodeGraph                | Code Review Graph      | Graphify                   | GitNexus |
| -------------- | ------------------------ | ---------------------- | -------------------------- | -------- |
| **一句话定位** | 代码知识图谱——快速探索   | 审查导向——影响分析     | 多模态——跨文档知识图谱     | 工程化代码智能平台 |
| **核心问题**   | "这个符号在哪、怎么用？" | "改了这个会影响什么？" | "这些材料之间有什么关系？" | "多仓库、API 影响怎么管？" |
| **目标用户**   | 日常开发者               | 代码审查者、架构师     | 研究者、知识工作者         | 平台团队、大型工程组织 |

## 技术对比

### 基础信息

| 方面         | CodeGraph        | Code Review Graph | Graphify                   | GitNexus |
| ------------ | ---------------- | ----------------- | -------------------------- | -------- |
| **实现语言** | TypeScript       | Python            | Python                     | TypeScript |
| **安装方式** | 独立二进制 / npm | pip install       | pip install（`graphifyy`） | npx |
| **存储**     | SQLite + FTS5    | SQLite            | JSON 文件（`graph.json`）  | 本地图谱 + registry |
| **图库**     | 自定义           | 自定义            | NetworkX                   | 自定义 |
| **解析引擎** | tree-sitter      | tree-sitter       | tree-sitter + Claude       | tree-sitter |
| **开源协议** | MIT              | MIT               | 未明确                     | PolyForm Noncommercial |

### 输入支持

| 输入类型          | CodeGraph | Code Review Graph | Graphify | GitNexus |
| ----------------- | --------- | ----------------- | -------- | -------- |
| **代码文件**      | ✅        | ✅                | ✅       | ✅       |
| **Markdown/文本** | ❌        | ❌                | ✅       | ❌       |
| **PDF**           | ❌        | ❌                | ✅       | ❌       |
| **图片**          | ❌        | ❌                | ✅       | ❌       |

### 编程语言支持

| 工具                  | 语言数量 | 代表性语言                                                                           |
| --------------------- | -------- | ------------------------------------------------------------------------------------ |
| **CodeGraph**         | 20+      | TypeScript、JavaScript、Python、Go、Rust、Java、C#、Ruby、Swift、Kotlin              |
| **Code Review Graph** | 30+      | 上述 + Scala、Solidity、Dart、R、Perl、Lua、PowerShell、Julia、SQL 等                |
| **Graphify**          | 13+      | Python、TypeScript、JavaScript、Go、Rust、Java、C、C++、Ruby、C#、Kotlin、Scala、PHP |
| **GitNexus**          | 20+      | TypeScript、JavaScript、Python、Go、Rust、Java、C#、C++、Ruby、PHP                   |

### 框架路由识别

| 工具                  | 支持的框架                                                                                                                 |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **CodeGraph**         | 14 个：Django、Flask、FastAPI、Express、NestJS、Laravel、Rails、Spring、Gin、Axum、ASP.NET、Vapor、React Router、SvelteKit |
| **Code Review Graph** | 无                                                                                                                         |
| **Graphify**          | 无（专注于通用知识图谱，不针对特定框架）                                                                                   |
| **GitNexus**          | 有（支持多种框架路由识别）                                                                                                 |

## 功能对比

### MCP 集成

| 方面           | CodeGraph           | Code Review Graph                    | Graphify                                   | GitNexus |
| -------------- | ------------------- | ------------------------------------ | ------------------------------------------ | -------- |
| **MCP 工具数** | 10                  | 30                                   | MCP 服务器模式（查询接口）                 | 13+      |
| **主力工具**   | `codegraph_explore` | `get_minimal_context`                | 自然语言 query                             | `detect_changes`/`api_impact` |
| **Slash 命令** | 无                  | 3 个（build/review-delta/review-pr） | 多个（/graphify、query、path、explain 等） | 无       |
| **配置方式**   | `codegraph install` | `code-review-graph install`          | `graphify install`                         | `npx`    |

### 核心能力矩阵

| 能力                 | CodeGraph     | Code Review Graph  | Graphify                           | GitNexus |
| -------------------- | ------------- | ------------------ | ---------------------------------- | -------- |
| **符号搜索**         | ✅            | ✅                 | ✅                                 | ✅       |
| **调用链追踪**       | ✅            | ✅（执行流）       | ✅                                 | ✅       |
| **影响分析**         | ✅            | ✅（Blast-Radius） | ✅（图遍历）                       | ✅       |
| **框架路由识别**     | ✅（14 个）   | ❌                 | ❌                                 | ✅       |
| **社区检测**         | ❌            | ✅（Leiden）       | ✅（Leiden）                       | ❌       |
| **多模态输入**       | ❌            | ❌                 | ✅                                 | ❌       |
| **意外连接发现**     | ❌            | ❌                 | ✅                                 | ❌       |
| **代码审查**         | ❌            | ✅（专用）         | ❌                                 | ✅       |
| **Wiki 生成**        | ❌            | ✅                 | ✅                                 | ❌       |
| **可视化**           | ❌            | ✅（D3.js）        | ✅（vis.js + SVG + GraphML）       | ✅       |
| **Obsidian 导出**    | ❌            | ❌                 | ✅                                 | ❌       |
| **Neo4j 导出**       | ❌            | ❌                 | ✅                                 | ❌       |
| **Git Hook 同步**    | ❌            | ❌                 | ✅                                 | ❌       |
| **文件监听自动同步** | ✅（OS 原生） | ✅（watch 命令）   | ✅（--watch）                      | ✅       |
| **增量更新**         | ✅            | ✅                 | ✅（--update）                     | ✅       |
| **边透明度标注**     | ❌            | ❌                 | ✅（EXTRACTED/INFERRED/AMBIGUOUS） | ❌       |

### Token 优化

| 工具                  | 节省方式                        | 基准数据                     |
| --------------------- | ------------------------------- | ---------------------------- |
| **CodeGraph**         | 一次 MCP 调用替代多次 Grep+Read | 35% 费用降低，57% 更少 Token |
| **Code Review Graph** | 紧凑的 ~100 Token 概览          | 38x-528x Token 节省          |
| **Graphify**          | 持久化图谱，无需重读原始文件    | 71.5x Token 节省             |
| **GitNexus**          | 多仓库索引，API 影响追踪        | —                            |

:::warning
四个工具的 Token 节省数据来自不同的基准测试，测试条件不同，不宜直接横向比较数值大小。
:::

## 差异分析

### 设计哲学差异

**CodeGraph** 追求**简洁和零配置**——不写配置文件，不选参数，安装后直接使用。它的 10 个工具都有清晰的职责，`codegraph_explore` 一个工具就能回答大多数问题。适合"我只想快点搞懂这个代码库"的场景。

**Code Review Graph** 追求**深度和专业性**——30 个工具覆盖从上下文获取到架构分析、从重构辅助到 Wiki 生成的完整审查链路。它的 Blast-Radius 分析和变更风险评分是独有的审查能力。适合"我要认真审查这个 PR"的场景。

**Graphify** 追求**广度和多模态**——不仅处理代码，还能理解论文、PDF、图片和笔记。它的意外连接发现能力是独有的——能找出代码与论文之间的关联。适合"我有一堆混合材料需要整理"的场景。

**GitNexus** 追求**工程化和平台化**——专为大型工程组织设计，支持多仓库管理、API 影响追踪和依赖图谱。它的 12 阶段 pipeline 能处理复杂的企业级代码库。适合"我需要管理多个仓库的 API 依赖和变更影响"的场景。

### 存储与查询差异

| 方面         | CodeGraph        | Code Review Graph        | Graphify           | GitNexus |
| ------------ | ---------------- | ------------------------ | ------------------ | -------- |
| **存储格式** | SQLite + FTS5    | SQLite                   | JSON + NetworkX    | 本地图谱 + registry |
| **查询方式** | SQL + MCP 工具   | SQL + MCP 工具           | 自然语言 + 图遍历  | MCP 工具 |
| **全文搜索** | ✅ FTS5          | ✅                       | ❌（语义查询）     | ✅       |
| **图遍历**   | 调用链           | BFS/DFS                  | NetworkX 路径算法  | BFS/DFS  |
| **持久性**   | .codegraph/ 目录 | .code-review-graph/ 目录 | graphify-out/ 目录 | .gitnexus/ 目录 |

### 可视化差异

| 方面             | CodeGraph | Code Review Graph    | Graphify               | GitNexus |
| ---------------- | --------- | -------------------- | ---------------------- | -------- |
| **交互式可视化** | 无        | D3.js HTML           | vis.js HTML            | Web UI   |
| **静态导出**     | 无        | GraphML              | SVG、GraphML           | 无       |
| **专业工具导出** | 无        | GraphML（Gephi/yEd） | GraphML + Neo4j Cypher | 无       |
| **笔记系统导出** | 无        | 无                   | Obsidian vault         | 无       |

## 兼容性

### 四者可以同时使用

CodeGraph、Code Review Graph、Graphify 和 GitNexus **完全兼容**——它们通过 MCP 协议独立运行，互不干扰：

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
    },
    "gitnexus": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "gitnexus-mcp"]
    }
  }
}
```

### 共存注意事项

| 注意点               | 说明                                                                                |
| -------------------- | ----------------------------------------------------------------------------------- |
| **数据目录独立**     | 各自使用独立目录（`.codegraph/`、`.code-review-graph/`、`graphify-out/`、`.gitnexus/`），互不冲突 |
| **Python 环境**      | CRG 和 Graphify 都是 Python 包，建议使用独立虚拟环境或 `pipx` 避免依赖冲突          |
| **tree-sitter 版本** | 各工具捆绑自己的 tree-sitter 绑定，不存在版本冲突                                   |
| **MCP 服务器资源**   | 同时运行四个 MCP 服务器会占用更多内存，但 MCP 是按需查询，空闲时资源消耗极低        |
| **Git Hook 冲突**    | 如果同时使用 Graphify 的 Git Hook 和其他工具的 hook，确保它们按预期顺序执行         |

### 与 Claude Code 生态的集成

四个工具都与 Claude Code 生态中的其他工具兼容：

| 生态工具        | CodeGraph               | Code Review Graph      | Graphify               | GitNexus |
| --------------- | ----------------------- | ---------------------- | ---------------------- | -------- |
| **CC-Switch**   | ✅ MCP 配置管理         | ✅ MCP 配置管理        | ✅ MCP 配置管理        | ✅ MCP 配置管理 |
| **Serena**      | ✅ 互补（探索 vs 重构） | ✅ 互补                | ✅ 互补                | ✅ 互补 |
| **Superpowers** | ✅ 开发纪律 + 代码智能  | ✅ 审查纪律 + 影响分析 | ✅ 研究纪律 + 知识图谱 | ✅ 工程化纪律 + 多仓库管理 |

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

工程化阶段（多仓库/API 管理）：
  GitNexus → 跨仓库 API 影响追踪 + 依赖管理

综合阶段（大型项目）：
  CodeGraph（探索） + CRG（审查） + Graphify（知识整合） + GitNexus（平台管理）
```

:::tip
使用 [AGENTS 全局路由协议](/guide/advanced/agents-routing) 定义多个工具共存时的分工规则，让 Claude Code 根据问题类型自动选择合适的工具。
:::

## 组合策略详解

### 轻量开发组合：CodeGraph + Graphify

适合个人开发者或小团队，快速建立代码理解 + 知识沉淀的基础能力：

- **CodeGraph** 负责日常代码探索，回答"这个函数怎么调用的？""这个类在哪里使用？"
- **Graphify** 负责将代码与文档、笔记关联，构建个人知识库

典型场景：独立开发者维护个人项目，需要同时理解代码逻辑和整理开发笔记。

### 代码审查组合：CodeGraph + Code Review Graph

适合需要严格代码质量控制的团队：

- **CodeGraph** 快速定位代码结构，理解改动范围
- **CRG** 进行深度审查，提供 Blast-Radius 分析和变更风险评分

典型场景：企业团队的 PR 审查流程，需要在合并前评估改动影响。

### 知识沉淀组合：Code Review Graph + Graphify

适合需要长期积累团队知识的项目：

- **CRG** 在审查过程中生成 Wiki 和架构文档
- **Graphify** 将审查记录、代码变更、设计文档关联成统一知识图谱

典型场景：开源项目维护，需要为贡献者提供完整的上下文和历史记录。

### 企业平台组合：GitNexus + Graphify

适合大型工程组织的多仓库管理和知识整合：

- **GitNexus** 管理跨仓库的 API 依赖、变更影响和依赖图谱
- **Graphify** 整合技术文档、设计文档和代码知识

典型场景：拥有数十个微服务的团队，需要统一管理 API 契约和跨服务影响。

### 渐进式推荐路线

| 阶段   | 推荐工具           | 目标                     | 适用场景               |
| ------ | ------------------ | ------------------------ | ---------------------- |
| **入门**   | CodeGraph          | 快速理解代码结构         | 新项目、新成员上手     |
| **进阶**   | CodeGraph + CRG    | 建立代码审查流程         | 团队协作、质量控制     |
| **高级**   | + Graphify         | 知识沉淀与跨文档关联     | 研究型项目、长期维护   |
| **企业**   | + GitNexus         | 多仓库平台化管理         | 大型工程组织、微服务架构 |

## 按场景快速选择

| 场景                           | 推荐工具组合                    | 理由                                       |
| ------------------------------ | ------------------------------- | ------------------------------------------ |
| **新项目快速上手**             | CodeGraph                       | 零配置，立即可用                           |
| **日常 PR 审查**               | CodeGraph + CRG                 | 探索 + 审查，分工明确                      |
| **多仓库 API 管理**            | GitNexus                        | 专为跨仓库依赖和 API 影响设计              |
| **技术文档整理**               | Graphify                        | 多模态输入，支持 PDF/图片/笔记             |
| **企业级代码治理**             | GitNexus + CRG                  | 平台管理 + 深度审查                        |
| **研究型项目**                 | CodeGraph + Graphify            | 代码探索 + 跨文档知识图谱                  |
| **完整工具链（所有场景覆盖）** | CodeGraph + CRG + Graphify + GitNexus | 各司其职，MCP 并行运行                  |

## 常见陷阱

:::warning
**陷阱一：认为工具越多越好**

四个工具各有专长，但同时运行会增加 MCP 服务器资源消耗。建议从 1-2 个工具开始，根据实际需求逐步添加。不要为了"完整"而安装所有工具。

**陷阱二：忽略许可证限制**

GitNexus 使用 PolyForm Noncommercial 协议，商业场景需要评估合规性。其他工具均为 MIT 协议，无此限制。

**陷阱三：数据目录混淆**

各工具使用独立的数据目录（`.codegraph/`、`.code-review-graph/`、`graphify-out/`、`.gitnexus/`），不要手动混合或迁移这些目录中的数据。

**陷阱四：Python 环境冲突**

Code Review Graph 和 Graphify 都是 Python 包，如果系统 Python 版本不一致，建议使用 `pipx` 或独立虚拟环境隔离。

**陷阱五：过度依赖单一工具**

每个工具都有盲区。CodeGraph 不擅长多模态，CRG 不支持框架路由，Graphify 不针对代码审查，GitNexus 不处理文档。根据场景组合使用，而非依赖单一工具解决所有问题。
:::

## 详细文档

| 工具                                                   | 文档                             |
| ------------------------------------------------------ | -------------------------------- |
| [CodeGraph](/guide/advanced/codegraph)                 | 安装、MCP 工具集、使用示例       |
| [Code Review Graph](/guide/advanced/code-review-graph) | 安装、30 个 MCP 工具、审查工作流 |
| [Graphify](/guide/advanced/graphify)                   | 安装、多模态处理、导出格式       |
| [GitNexus](/guide/advanced/gitnexus)                   | 安装、12 阶段 pipeline、多仓库  |

## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理多个 MCP 服务器配置
- [AGENTS 路由协议](/guide/advanced/agents-routing) — 定义工具间的分工规则
- [Serena 代码语义](/guide/advanced/serena) — IDE 级精确重构能力
- [GitNexus](/guide/advanced/gitnexus) — 工程化代码智能平台详细文档
