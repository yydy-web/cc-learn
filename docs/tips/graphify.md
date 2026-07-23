---
title: Graphify — 代码仓秒变可查询知识图谱
description: Graphify（86K+ Stars）完整教程，将代码/文档/图片一键转为可查询知识图谱，支持 Obsidian/Neo4j 导出，71.5× token 节省，兼容 20+ AI 编程助手
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★☆☆☆☆    |
| 🧪 测试 | ★★★★★  | ★☆☆☆☆    |
| 📦 产品 | ★★★★☆  | ★★☆☆☆    |

**🎯 学习产出：** 掌握 Graphify 安装、构建、查询全流程，能用自然语言探索任意代码仓，导出 Obsidian/Neo4j/Mermaid，用 MCP 模式嵌入 CI/CD

**🚀 AI 能力提升：** 代码理解、知识图谱、上下文压缩
:::

# Graphify — 代码仓秒变可查询知识图谱

> 不是向量数据库，不是 RAG。是一张真正的图，让你遍历代码的每一个连接。

## 概述

**Graphify**（`Graphify-Labs/graphify`，86K+ GitHub Stars）是一个 AI 编程助手的技能插件，将任意代码文件夹转为**可查询的知识图谱**。兼容 Claude Code、Codex、OpenCode、Cursor、Gemini CLI、GitHub Copilot 等 20+ AI 编程助手。

核心思路：**不把代码切成向量块扔进 embedding，而是用 tree-sitter 解析 AST 提取真实的函数调用、导入、继承关系，构建一张有向图**。代码层完全本地解析，不出站；文档/图片层按需调 AI 模型提取语义。

**核心数据**：86K+ Stars、周增 +7,483 Stars、~40 种语言支持、71.5× token 节省、Leiden 社区检测、MCP/Neo4j/Obsidian 多格式导出。

### 和 RAG 的区别

```
RAG 方案：
  代码 → 切片 → embedding → 向量库 → 语义搜索
  问题：切多大？语义相近 ≠ 逻辑相关，函数调用链丢失

Graphify：
  代码 → tree-sitter AST → 节点+边 → 图数据库 → 图遍历
  优势：真实调用关系、跨文件链接、每条边有置信度标签
```

## 安装

### 前置依赖

Python 3.10+，推荐用 `uv` 管理：

```bash
# macOS
brew install python@3.12 uv

# 检查版本
python --version  # ≥ 3.10
uv --version
```

### 安装 Graphify

```bash
# 推荐：uv 隔离安装
uv tool install graphifyy

# 备选：pipx
pipx install graphifyy

# 验证
graphify --version
```

> **注意**：PyPI 包名是 `graphifyy`（双 y），CLI 命令仍是 `graphify`。

### 安装可选扩展

```bash
uv tool install "graphifyy[pdf]"      # PDF 提取
uv tool install "graphifyy[video]"    # 视频/音频转录（faster-whisper 本地）
uv tool install "graphifyy[sql]"      # SQL 模式提取
uv tool install "graphifyy[neo4j]"    # Neo4j 导出
uv tool install "graphifyy[ollama]"   # 完全本地 AI 后端
uv tool install "graphifyy[all]"      # 全部扩展
```

### 注册技能

```bash
graphify install
```

注册后在各 AI 助手中输入 `/graphify .` 即可运行。支持 Claude Code、Codex、Cursor、Gemini CLI、GitHub Copilot、OpenCode、Windsurf 等 20+ 平台。

## 核心概念：三层处理管道

Graphify 的三层处理各司其职：

| 层 | 处理对象 | 方法 | 是否出站 |
|---|---|---|---|
| **AST 层** | ~40 种语言代码文件 | tree-sitter 解析语法树 | ❌ 完全本地 |
| **语义层** | 文档、PDF、图片、视频 | AI 模型语义提取 | ✅ 需要后端 |
| **图构建层** | 所有节点和边 | Leiden 社区检测、跨文件链接 | ❌ 本地 |

### AST 层：代码解析不出站

对于纯代码项目，Graphify **完全离线运行**，不需要任何 API key。tree-sitter 做确定性语法解析，支持 Python、TypeScript、JavaScript、Go、Rust、Java、C/C++、Ruby、C#、Kotlin、Swift、Lua、Zig、R 等约 40 种语言。

### 语义层：文档才需要 AI

处理 PDF、图片、视频等非代码文件时，才需要 AI 后端：

| 后端 | 设置方式 |
|------|----------|
| Anthropic Claude | `export ANTHROPIC_API_KEY=xxx` |
| OpenAI | `export OPENAI_API_KEY=xxx` |
| Gemini | `export GEMINI_API_KEY=xxx` |
| DeepSeek | `export DEEPSEEK_API_KEY=xxx` |
| Ollama（本地） | 安装 `[ollama]` 扩展，无需 API key |
| AWS Bedrock | `export AWS_PROFILE=xxx` |

视频/音频转录使用 faster-whisper 完全本地，不出站。

### 边的置信度标签

每一根边都带标签，让你知道哪个是事实、哪个是推断：

| 标签 | 含义 |
|------|------|
| `EXTRACTED` | 源码中显式存在（import、函数调用、类继承） |
| `INFERRED` | Graphify 推断解析得到 |
| `AMBIGUOUS` | 模糊匹配，需人工确认 |

## 基本使用

### 第一步：构建图谱

在项目根目录，对 AI 助手输入：

```
/graphify .
```

或直接用 CLI：

```bash
graphify build .
```

产物在 `graphify-out/` 目录：

```
graphify-out/
├── graph.html        # 交互式力导向图，浏览器打开
├── GRAPH_REPORT.md   # 报告：关键概念、意外连接、建议问题
└── graph.json        # 完整图数据，供后续查询
```

`GRAPH_REPORT.md` 包含：
- **God 节点** — 连接数最高的核心概念
- **社区划分** — Leiden 算法自动分割的子系统
- **跨文件链接** — 不在同一文件却有关联的函数/类
- **代码注释提取** — `# NOTE:` `# WHY:` 等注释变为独立节点
- **建议问题** — AI 基于图结构生成的探索性问题

### 第二步：查询图谱

```bash
# 解释某个概念
graphify explain "函数名或类名"

# 找到 A 和 B 两个概念之间的路径
graphify path "UserService" "PaymentGateway"

# 自然语言查询
graphify query "认证流程涉及哪些模块"
```

### 第三步：增量更新

```bash
# 只重新解析变更过的文件
graphify build . --update

# 监听文件变化，自动同步
graphify build . --watch
```

## 高级用法

### 构建参数

| 参数 | 说明 | 适用场景 |
|------|------|----------|
| `--mode deep` | 更激进的关系提取，更多 INFERRED 边 | 首次构建、陌生代码仓 |
| `--directed` | 保留边的方向性（调用方向） | 追踪依赖链 |
| `--cluster-only` | 仅重新聚类，不重新提取 | 调整社区划分 |
| `--no-viz` | 跳过 HTML 图，仅报告 + JSON | CI/CD 中快速构建 |
| `--force` | 强制覆盖已有产物 | 重构后 |

### 多种导出格式

```bash
# Obsidian Vault — 导入 Obsidian 做双向链接图谱
graphify build . --obsidian

# Markdown Wiki — AI 可爬取的静态文档站
graphify build . --wiki

# Neo4j / FalkorDB — 图数据库导入
graphify build . --neo4j      # 生成 cypher.txt
graphify build . --falkordb   # FalkorDB 格式

# SVG 矢量图
graphify build . --svg

# GraphML — 导入 Gephi / yEd
graphify build . --graphml

# 架构流程图 — Mermaid 格式，浏览器可看
graphify export callflow-html
graphify export callflow-html --max-sections 8
```

### 添加外部内容

```bash
# 抓取论文加入图谱
graphify add https://arxiv.org/abs/2305.xxxxx

# 转录视频加入图谱
graphify add https://www.youtube.com/watch?v=xxxxx
```

## MCP 服务器模式

将图谱暴露为 MCP 协议服务，任何 MCP 客户端都能查询：

```bash
# 本地 stdio 模式（个人用）
python -m graphify.serve graphify-out/graph.json

# HTTP 共享模式（团队用）
python -m graphify.serve graphify-out/graph.json \
  --transport http \
  --host 0.0.0.0 \
  --port 8080 \
  --api-key "$SECRET"
```

MCP 工具接口：

| 工具 | 功能 |
|------|------|
| `query_graph` | 自然语言查询子图 |
| `get_node` | 获取节点详情 |
| `get_neighbors` | 获取邻居节点 |
| `shortest_path` | 两节点最短路径 |
| `list_prs` | PR 列表及影响分析 |
| `get_pr_impact` | 单个 PR 的图影响范围 |
| `triage_prs` | AI 排序审查队列 |

在 Claude Code 的 `.claude/settings.json` 中配置：

```json
{
  "mcpServers": {
    "graphify": {
      "command": "python",
      "args": ["-m", "graphify.serve", "graphify-out/graph.json"]
    }
  }
}
```

## 团队协作

### Git 集成

`graphify-out/` 可以提交到仓库，全团队共享同一张图：

```bash
git add graphify-out/
git commit -m "chore: update knowledge graph"
```

### 安装 Git Hook

```bash
graphify hook install
```

Hook 在每次 commit 后自动重建图谱，并设置 merge driver 处理 `graph.json` 冲突——并行提交时自动 union-merge，不会留冲突标记。

### 全局图谱（跨项目）

```bash
# 注册项目图谱
graphify global add graphify-out/graph.json --as my-api

# 注册另一个项目
graphify global add ../other-project/graphify-out/graph.json --as other-svc

# 查看已注册
graphify global list

# 跨项目查询
graphify query "my-api 的认证模块和 other-svc 的用户模块之间有什么关系"
```

### PR 仪表盘

```bash
graphify prs                  # 全部 PR 的 CI 状态、审查进度
graphify prs 42               # 深入分析某个 PR
graphify prs --triage         # AI 排序审查队列（先审哪个）
graphify prs --conflicts      # 共享图社区的 PR（合并顺序风险）
```

## 配置文件

### .graphifyignore

和 `.gitignore` 语法一致，会被合并处理。支持 `!` 否定模式：

```text
# 自动读取 .gitignore
# .graphifyignore 的规则会追加
node_modules/
*.min.js
!src/vendor/important.min.js
```

### 环境变量

| 变量 | 说明 |
|------|------|
| `GRAPHIFY_MAX_WORKERS` | AST 解析并行线程数 |
| `GRAPHIFY_MAX_OUTPUT_TOKENS` | 大文件输出 token 上限 |
| `GRAPHIFY_FORCE` | 设 `1` 后节点减少也强制覆盖 |
| `GRAPHIFY_QUERY_LOG_ENABLE` | 设 `1` 启用查询日志 |

## 基准测试

| 基准 | 指标 | Graphify | 对比 |
|------|------|----------|------|
| LOCOMO (n=300) | recall@10 | **0.497** | mem0 0.048, supermemory 0.149 |
| LongMemEval-S (n=50) | QA accuracy | **76%** | 与 dense RAG 并列最佳 |
| 图谱构建 | LLM credits | **0** | 纯代码项目零 API 调用 |

所有测试用相同框架、相同模型、相同预算，双盲裁判评分（Cohen's kappa 0.81）。

## 实战场景

### 场景一：接手陌生代码仓

```bash
# 1. 克隆后第一件事
git clone https://github.com/some-team/huge-monorepo.git
cd huge-monorepo

# 2. 构建图谱
graphify build .

# 3. 看报告找入口
cat graphify-out/GRAPH_REPORT.md
# → God 节点：RequestHandler（142 条边）
# → 3 个社区：auth/ payment/ notification
# → 建议问题："RequestHandler 修改会影响哪些模块？"

# 4. 追踪核心链路
graphify path "RequestHandler" "DatabasePool"
# → RequestHandler → AuthMiddleware → SessionStore → DatabasePool
```

### 场景二：Code Review 前评估影响面

```bash
# PR #42 改了 auth 模块
graphify prs 42

# 输出：
# 影响节点：AuthService, SessionManager, TokenValidator
# 影响边数：17 条（3 条 EXTRACTED，14 条 INFERRED）
# 建议：先审查 TokenValidator——连接了 auth 和 payment 两个社区
```

### 场景三：CI 中自动生成架构文档

```yaml
# .github/workflows/graphify.yml
- name: Build knowledge graph
  run: |
    graphify build . --no-viz
    graphify export callflow-html
    # 产物丢到 GitHub Pages 或 Artifacts
```

### 场景四：结合 Claude Code 深度理解代码

```
# 构建后直接用自然语言探索
/graphify query "支付回调的完整链路，从 webhook 到数据库写入"

# 或者等 Claude Code 主动调用 MCP 工具
# Claude Code 会在需要时自动 query_graph
```

## 隐私说明

- **代码文件**：tree-sitter 完全本地解析，零数据出站
- **视频/音频**：faster-whisper 本地转录
- **文档/PDF/图片**：按配置的后端发送（可选 Ollama 完全本地）
- **查询日志**：默认关闭，需手动 `GRAPHIFY_QUERY_LOG_ENABLE=1` 启用
- **遥测**：无。不上报任何数据

## 常见问题

### 纯代码项目需要 API key 吗？

不需要。代码解析完全用 tree-sitter 本地完成，不调用任何 LLM。只有处理 PDF、图片、文档时才需要。

### 和 Cursor/Copilot 的代码索引有什么区别？

Cursor/Copilot 索引是给补全和聊天用的，不暴露给你探索。Graphify 产物是你拥有的——一个 `graph.json` 文件，可以查、可以导出、可以 Diff。

### 大项目会爆内存吗？

`GRAPHIFY_MAX_GRAPH_BYTES` 默认 512 MiB。超大 monorepo 建议分模块构建，用 `graphify global add` 拼成全局图谱。

### 图会过时吗？

会。代码改了图不会自动更新，除非装了 Git hook（`graphify hook install`）或在 CI 中重建。`graphify build . --update` 可以快速增量更新。
