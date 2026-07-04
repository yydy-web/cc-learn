---
title: GitNexus 代码智能平台
description: 使用 GitNexus 构建企业级代码智能平台——本地代码图谱、MCP、CLI、Web UI、多仓库支持
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★★★☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★★    |

**🎯 学习产出：** 掌握 GitNexus 的安装、12 阶段 ingestion pipeline 和 MCP 工具集，能独立构建多仓库代码智能平台，使用 api_impact 和 shape_check 提前暴露 API 变更风险

**🚀 AI 能力提升：** 上下文管理、项目协作
:::

# GitNexus 代码智能平台

GitNexus 是一个工程化程度最高的代码图谱工具，定位为 Agent 时代的代码理解基础设施。它不只是一个代码索引，而是集成了本地代码图谱、MCP 服务器、CLI、HTTP bridge、Web UI、hooks、skills、wiki 和多仓库 group 的完整平台。

:::warning
**许可证注意：** GitNexus 使用 PolyForm Noncommercial 1.0.0 许可证，不是 MIT。个人研究、学习、非商业项目可以使用；商业项目必须获取商业授权。
:::

## 核心能力

GitNexus 的 ingestion pipeline 包含 12 个阶段：

```
scan → structure → [markdown, cobol] → parse → [routes, tools, orm] → crossFile → mro → communities → processes
```

它不只抽取函数和调用关系，还关心：

- **API route**：识别框架路由定义
- **tool handler**：MCP tool 注册
- **ORM query**：数据库查询模式
- **cross-file 类型传播**：跨文件类型推导
- **方法重写**：MRO（Method Resolution Order）分析
- **functional communities**：功能社区检测
- **execution flows**：执行流分析
- **multi-repo contract**：多仓库契约关系

:::info
如果你做前后端分离项目，`api_impact` 和 `shape_check` 工具很有吸引力——很多 bug 不是代码逻辑错，而是后端字段改了，前端还在读旧结构。GitNexus 试图把这种风险提前暴露出来。
:::

## 安装

### 基础安装

```bash
npx gitnexus analyze
```

它会：

1. 扫描代码库
2. 用 Tree-sitter 抽取函数、类、方法、调用、import、route、tool 等
3. 构建本地知识图谱
4. 写入项目里的 `.gitnexus/`
5. 注册到 `~/.gitnexus/registry.json`
6. 可选生成 `AGENTS.md`、`CLAUDE.md`、skills
7. 后续通过 MCP 给 Agent 调用

### 配置 MCP

```bash
npx gitnexus setup
```

或者直接启动 MCP：

```bash
gitnexus mcp
```

### 启动 Web UI

```bash
gitnexus serve
```

默认地址：`http://localhost:4747`

## MCP 工具集

GitNexus 提供完整的 MCP 工具集：

| 工具             | 用途                                              |
| ---------------- | ------------------------------------------------- |
| `list_repos`     | 列出已索引的仓库                                  |
| `query`          | 定向查询                                          |
| `context`        | 构建代码上下文                                    |
| `impact`         | 影响分析                                          |
| `detect_changes` | 分析当前 git diff 影响哪些流程                    |
| `rename`         | 重命名预览                                        |
| `cypher`         | Cypher 查询语言                                   |
| `route_map`      | API 路由映射                                      |
| `tool_map`       | MCP tool 映射                                     |
| `shape_check`    | 检查 API 返回 shape 和 consumer 访问字段是否匹配  |
| `api_impact`     | 修改 API route 前看 consumer 和 response 字段依赖 |
| `group_list`     | 列出多仓库 group                                  |
| `group_sync`     | 同步多仓库 group                                  |

### 重点关注的工具

```
detect_changes：分析当前 git diff 影响哪些流程
api_impact：修改 API route 前看 consumer 和 response 字段依赖
shape_check：检查 API 返回 shape 和 consumer 访问字段是否匹配
```

## 多仓库支持

GitNexus 支持多仓库 group 管理：

```bash
# 创建 group
gitnexus group create platform

# 添加仓库
gitnexus group add platform backend/api backend-repo
gitnexus group add platform frontend/web frontend-repo

# 同步和查询
gitnexus group sync platform
gitnexus group query platform "auth flow"
gitnexus group impact platform
gitnexus group contracts platform
```

## CLI 命令速查

```bash
# 分析
gitnexus analyze [path]
gitnexus analyze --force
gitnexus analyze --embeddings
gitnexus analyze --skills
gitnexus analyze --index-only

# 服务器
gitnexus mcp
gitnexus serve

# 管理
gitnexus list
gitnexus status
gitnexus doctor
gitnexus clean

# 查询
gitnexus wiki [path]
gitnexus query "auth flow"
gitnexus context UserService
gitnexus impact createUser
gitnexus detect-changes
gitnexus cypher "MATCH ..."
```

## 适合谁？

**适合：**

- 平台团队
- 大型工程组织
- 多仓库系统
- 前后端分离复杂项目
- 想做企业内部代码智能平台的人

**不太适合：**

- 想要轻量常驻工具的人
- 不想处理 native dependency / Node / LadybugDB / embedding 的人
- 商业场景但没有许可证授权的人

## 与其他工具的对比

| 方面                           | CodeGraph               | Code Review Graph    | Graphify                 | GitNexus                     |
| ------------------------------ | ----------------------- | -------------------- | ------------------------ | ---------------------------- |
| **核心定位**                   | 代码导航 / Agent 上下文 | PR 审查 / 影响分析   | 项目知识图谱             | 工程化代码智能平台           |
| **最适合场景**                 | 日常编码                | PR review            | 项目梳理 / GraphRAG      | 多仓库 / API impact / 平台化 |
| **是否适合常驻 MCP**           | 高                      | 中                   | 中                       | 高，但较重                   |
| **是否轻量**                   | 高                      | 中                   | 中                       | 低                           |
| **是否支持文档/PDF/图片/视频** | 基本不支持              | 弱                   | 强                       | 弱                           |
| **是否适合 PR review**         | 中                      | 强                   | 中                       | 强                           |
| **是否适合多仓库**             | 弱                      | 中                   | 中                       | 强                           |
| **默认本地性**                 | 强                      | 强                   | 代码本地，文档可能走模型 | 强                           |
| **主要风险**                   | 语言/框架解析边界       | 工具面偏多           | LLM 抽取和隐私边界       | License + 复杂度             |
| **商业使用风险**               | 低，MIT                 | 低，MIT              | 低，MIT                  | 高，非商业 license           |
| **推荐对象**                   | 普通开发者              | Reviewer / Tech Lead | 架构师 / 知识库          | 平台团队                     |

### 选型建议

**选择 GitNexus 如果：**

- 你有多仓库系统需要统一管理
- 你需要 API impact 和 shape check 能力
- 你在构建企业内部代码智能平台
- 你有平台团队维护基础设施

**注意许可证：** 商业项目必须先获取 GitNexus 商业授权。

## 组合使用

GitNexus 可以与其他工具组合，但建议"一个常驻 + 一个按需"：

| 组合                 | 适合场景                   | 分工                                            |
| -------------------- | -------------------------- | ----------------------------------------------- |
| GitNexus + Graphify  | 大项目、多仓库、有平台团队 | GitNexus 管工程关系，Graphify 管知识沉淀        |
| CodeGraph + GitNexus | 日常开发 + 企业平台        | CodeGraph 常驻轻量探索，GitNexus 按需做平台分析 |

:::warning
不建议四个工具同时暴露给同一个 Agent 常驻——MCP 工具太多会导致 Agent 选择困难、上下文噪音变大。
:::

## 相关资源

- [GitNexus GitHub](https://github.com/abhigyanpatwari/GitNexus) — 项目仓库

## 下一步

- [代码图谱工具对比](/guide/advanced/code-graph/code-graph-tools) — 四工具详细对比和组合建议
- [CodeGraph 代码智能](/guide/advanced/code-graph/codegraph) — 日常代码探索工具
- [Code Review Graph](/guide/advanced/code-graph/code-review-graph) — 代码审查工具
- [Graphify 知识图谱](/guide/advanced/code-graph/graphify) — 多模态知识图谱工具
