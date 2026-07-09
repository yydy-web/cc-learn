---
title: Codebase Memory 代码记忆
description: 使用 Codebase Memory MCP 构建高性能本地代码知识图谱——纯 C 实现、158 语言支持、零依赖单二进制文件
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★★☆☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握 Codebase Memory 的安装、配置和 14 个 MCP 工具的使用方法，能独立为项目构建高性能代码知识图谱，实现 99%+ Token 节省和毫秒级代码查询

**🚀 AI 能力提升：** 上下文管理、跨文件重构、代码审查
:::

# Codebase Memory 代码记忆

Codebase Memory 是一个高性能、零依赖的代码知识图谱 MCP 服务器。纯 C 实现，编译为单个静态二进制文件，支持 158 种语言的 AST 解析，索引速度极快（Linux 内核 2800 万行代码约 3 分钟），查询响应在 1 毫秒以内。

## 为什么需要 Codebase Memory

其他代码图谱工具（CodeGraph、CRG、Graphify、GitNexus）各有侧重，Codebase Memory 的独特优势在于：

- **极致性能**：纯 C 实现，单二进制，零运行时依赖。索引速度是同类工具的 10-100 倍
- **语言覆盖**：158 种语言通过内置 tree-sitter 语法解析，10 种语言有 Hybrid LSP 语义类型解析
- **Token 节省**：五次结构化查询约 3,400 Token vs 传统逐文件 grep 约 412,000 Token（99.2% 减少）
- **跨仓库支持**：多项目共享同一个存储，自动发现跨仓库的 `CROSS_*` 边
- **团队协作**：压缩图谱快照（`.codebase-memory/graph.db.zst`）可提交到仓库，成员跳过全量索引
- **本地优先**：100% 本地处理，代码不离开机器。nomic-embed-code 嵌入模型内置，无需外部 API

```
传统方式：Grep → Read → Grep → Read → ...（串行，高 Token）
Codebase Memory：search_graph → trace_path → get_code_snippet（并行，低 Token）
```

## 工作原理

```
源代码 → tree-sitter 解析（158 语言） → Hybrid LSP（10 语言） → AST 提取
       → 内存 SQLite 构建图谱 → 持久化到磁盘 → MCP 服务器暴露 14 个工具
```

1. **tree-sitter 层**：所有 158 种语言的语法解析，提取定义、调用、导入
2. **Hybrid LSP 层**：对 Python、TypeScript、Go、Rust、Java、C# 等 10 种语言做语义类型解析，解析导入、泛型、继承、类型推断
3. **图谱构建**：RAM 优先（LZ4 HC 压缩读取 → 内存 SQLite → 一次性 dump），索引完成后释放内存
4. **后台监听**：基于 git polling 的自适应间隔检测文件变更，自动增量索引

### 知识图谱数据模型

**节点标签**：`Project`、`Package`、`Folder`、`File`、`Module`、`Class`、`Function`、`Method`、`Interface`、`Enum`、`Type`、`Route`、`Resource`

**边类型**：`CALLS`、`IMPORTS`、`DEFINES`、`IMPLEMENTS`、`INHERITS`、`HTTP_CALLS`、`ASYNC_CALLS`、`EMITS`、`LISTENS_ON`、`DATA_FLOWS`、`SIMILAR_TO`、`SEMANTICALLY_RELATED` 等

**IaC 支持**：Dockerfile、Kubernetes manifests、Kustomize overlays 作为一等图谱节点

## 安装

### 一键安装

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash

# 带可视化 UI
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash -s -- --ui
```

```powershell
# Windows PowerShell
iwr -Uri https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.ps1 -OutFile install.ps1
Unblock-File .\install.ps1
.\install.ps1
```

### 包管理器

```bash
# npm
npm install -g codebase-memory-mcp

# pip
pip install codebase-memory-mcp

# Homebrew
brew install codebase-memory-mcp

# Scoop (Windows)
scoop install codebase-memory-mcp

# Winget (Windows)
winget install codebase-memory-mcp
```

### 预编译二进制

从 [GitHub Releases](https://github.com/DeusData/codebase-memory-mcp/releases) 下载对应平台的 `.tar.gz` 或 `.zip`，解压即用。所有二进制均为静态链接，包含 SHA-256 校验、SLSA Level 3 溯源和 Sigstore 签名。

### 从源码构建

需要 C 编译器、C++ 编译器、zlib 和 Git：

```bash
git clone https://github.com/DeusData/codebase-memory-mcp.git
cd codebase-memory-mcp
./scripts/build.sh

# 带可视化 UI
./scripts/build.sh --with-ui
```

## 配置

### MCP 集成

安装脚本自动检测 11 种 AI 编码代理（Claude Code、Codex CLI、Gemini CLI、Zed、OpenCode、Antigravity、Aider、KiloCode、VS Code、OpenClaw、Kiro）并配置 MCP 条目。

对于 Claude Code，安装脚本会自动添加 `PreToolUse` hook——拦截 `Grep`/`Glob` 调用，当搜索词匹配到已索引符号时，通过 `search_graph` 注入结构化上下文。

### 环境变量

| 变量                        | 默认值                         | 说明                                   |
| --------------------------- | ------------------------------ | -------------------------------------- |
| `CBM_CACHE_DIR`             | `~/.cache/codebase-memory-mcp` | 数据库存储位置                         |
| `CBM_DIAGNOSTICS`           | `false`                        | 启用周期性内存/资源诊断                |
| `CBM_LOG_LEVEL`             | `info`                         | 日志级别（debug/info/warn/error/none） |
| `CBM_WORKERS`               | 自动检测                       | 并行索引工作线程数                     |
| `CBM_DUMP_VERIFY_MIN_RATIO` | `0.5`                          | 持久化后降级索引检测阈值               |

### CLI 配置命令

```bash
codebase-memory-mcp config list                    # 查看当前配置
codebase-memory-mcp config set auto_index true     # 启用自动索引
codebase-memory-mcp config set auto_index_limit 50000  # 自动索引文件数上限
codebase-memory-mcp config set auto_watch false    # 禁用后台监听
codebase-memory-mcp config reset <key>             # 恢复默认值
```

### 自定义文件扩展名

项目级 `.codebase-memory.json`（仓库根目录）或全局 `~/.config/codebase-memory-mcp/config.json`：

```json
{
  "extra_extensions": {
    ".blade.php": "php",
    ".vue": "typescript"
  }
}
```

### 文件忽略

三层过滤：硬编码（`.git`、`node_modules`）→ `.gitignore` 层级 → `.cbmignore`（gitignore 语法）。符号链接始终跳过。

## MCP 工具集（14 个）

### 索引工具

| 工具               | 说明                            |
| ------------------ | ------------------------------- |
| `index_repository` | 索引仓库到图谱，支持自动同步    |
| `list_projects`    | 列出所有已索引项目及节点/边数量 |
| `delete_project`   | 删除项目及其图谱数据            |
| `index_status`     | 查看索引进度                    |

### 查询工具

| 工具               | 说明                                                                                   |
| ------------------ | -------------------------------------------------------------------------------------- |
| `search_graph`     | 按标签、名称模式、度数过滤的结构化搜索，支持分页                                       |
| `trace_path`       | BFS 遍历调用链（深度 1-5），显示谁调用了某函数以及它调用了谁                           |
| `detect_changes`   | 将 git diff 映射到受影响符号，带风险分类                                               |
| `query_graph`      | 执行只读 Cypher 风格查询（openCypher 子集：MATCH、WHERE、RETURN、聚合、EXISTS 子查询） |
| `get_graph_schema` | 节点/边统计、关系模式、属性定义                                                        |
| `get_code_snippet` | 按限定名称读取函数源代码                                                               |
| `get_architecture` | 一键获取：语言、包、路由、热点、集群、ADR                                              |
| `search_code`      | 图谱增强的 grep，搜索已索引文件                                                        |
| `manage_adr`       | 架构决策记录（ADR）的 CRUD                                                             |
| `ingest_traces`    | 导入运行时追踪以验证 HTTP_CALLS 边                                                     |

### 搜索能力

- **语义搜索**：内置 `nomic-embed-code` 嵌入模型（40K tokens，768d int8），11 信号组合评分（TF-IDF、RRI、API/Type/Decorator 签名、AST 画像、数据流、MinHash、模块邻近度、图扩散）
- **BM25 全文搜索**：基于 SQLite FTS5，camelCase/snake_case 感知分词
- **死代码检测**：查找零调用者函数（排除入口点）
- **Louvain 社区检测**：通过聚类调用边发现功能模块

## 使用示例

### 索引项目

```bash
# CLI 模式
codebase-memory-mcp cli index_repository '{"repo_path": "/path/to/your/project"}'

# 自动索引（MCP 会话首次连接时自动触发，需启用 auto_index）
codebase-memory-mcp config set auto_index true
```

### 搜索符号

```bash
# 按名称模式搜索函数
codebase-memory-mcp cli search_graph '{"name_pattern": ".*Handler.*", "label": "Function"}'

# 搜索类
codebase-memory-mcp cli search_graph '{"name_pattern": "User.*", "label": "Class"}'

# 带分页
codebase-memory-mcp cli search_graph '{"label": "Function", "limit": 20, "offset": 0}'
```

### 追踪调用链

```bash
# 双向追踪（谁调用了 Search + Search 调用了谁）
codebase-memory-mcp cli trace_path '{"function_name": "Search", "direction": "both", "depth": 3}'

# 仅上游
codebase-memory-mcp cli trace_path '{"function_name": "authenticate", "direction": "upstream"}'

# 仅下游
codebase-memory-mcp cli trace_path '{"function_name": "main", "direction": "downstream", "depth": 5}'
```

### 变更影响分析

```bash
codebase-memory-mcp cli detect_changes '{
  "repo_path": "/path/to/project",
  "base_ref": "main",
  "target_ref": "HEAD"
}'
```

返回受影响的符号列表，每个符号带风险等级分类。

### Cypher 查询

```bash
# 查找所有 HTTP 路由
codebase-memory-mcp cli query_graph '{
  "query": "MATCH (r:Route) RETURN r.path, r.method LIMIT 10"
}'

# 查找被最多调用的函数
codebase-memory-mcp cli query_graph '{
  "query": "MATCH (f:Function)<-[c:CALLS]-() RETURN f.name, count(c) AS callers ORDER BY callers DESC LIMIT 10"
}'

# 查找死代码
codebase-memory-mcp cli query_graph '{
  "query": "MATCH (f:Function) WHERE NOT (f)<-[:CALLS]-() AND NOT f.is_entry RETURN f.name, f.file"
}'
```

### 一键获取架构概览

```bash
codebase-memory-mcp cli get_architecture '{"repo_path": "/path/to/project"}'
```

返回：使用的语言列表、包结构、HTTP 路由表、代码热点（高调用度函数）、功能模块集群、架构决策记录。

### 读取函数源码

```bash
codebase-memory-mcp cli get_code_snippet '{
  "repo_path": "/path/to/project",
  "qualified_name": "pkg/handler.Search"
}'
```

## 团队协作

### 共享图谱快照

Codebase Memory 支持将压缩图谱快照提交到仓库，团队成员无需全量索引：

```bash
# 索引完成后，生成快照
# 自动创建 .codebase-memory/graph.db.zst

# 提交到仓库
git add .codebase-memory/graph.db.zst
git commit -m "chore: update codebase memory snapshot"
```

`.gitattributes` 会自动添加 `merge=ours` 防止二进制文件的合并冲突。

成员拉取后，Codebase Memory 自动导入快照，然后增量索引本地差异。

两种压缩级别：

- **Best**（`zstd -9`）：显式索引时生成，体积最小
- **Fast**（`zstd -3`）：后台监听器自动生成，速度快

## 跨仓库分析

多个项目索引到同一存储后，Codebase Memory 自动发现跨仓库关系：

- HTTP 路由 ↔ 调用点匹配（带置信度评分）
- gRPC、GraphQL、tRPC 服务检测
- 通道检测（`EMITS`/`LISTENS_ON` 边）支持 Socket.IO、EventEmitter、pub-sub（8 种语言）
- `CROSS_*` 边连接不同仓库的节点
- 可选的多星系 3D UI 布局可视化跨仓库关系

## 图可视化 UI

可选 UI 变体在后台线程运行交互式 3D 图谱可视化，访问 `localhost:9749`：

```bash
# 安装带 UI 的版本
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash -s -- --ui
```

## 性能基准

| 指标                                 | 数据                      |
| ------------------------------------ | ------------------------- |
| 普通仓库索引                         | 毫秒级                    |
| Linux 内核索引（28M LOC，75K 文件）  | ~3 分钟                   |
| 图谱节点（Linux 内核）               | 481 万                    |
| 图谱边（Linux 内核）                 | 772 万                    |
| 查询响应                             | < 1ms                     |
| Token 节省（5 次结构化查询 vs grep） | 99.2%（3,400 vs 412,000） |

## 与其他代码图谱工具对比

| 维度           | Codebase Memory       | CodeGraph          | Code Review Graph | Graphify             | GitNexus    |
| -------------- | --------------------- | ------------------ | ----------------- | -------------------- | ----------- |
| **实现语言**   | C                     | TypeScript         | Python            | Python               | TypeScript  |
| **安装**       | 静态二进制            | npm                | pip               | pip                  | npx         |
| **语言支持**   | 158                   | 20+                | 30+               | 13+                  | 20+         |
| **语义解析**   | Hybrid LSP（10 语言） | tree-sitter 仅语法 | tree-sitter       | tree-sitter + Claude | tree-sitter |
| **MCP 工具数** | 14                    | 10                 | 30                | MCP 查询             | 13+         |
| **跨仓库**     | ✅ 原生支持           | ❌                 | ❌                | ❌                   | ✅          |
| **团队共享**   | ✅ 图谱快照           | ❌                 | ❌                | ❌                   | ❌          |
| **可视化**     | 3D UI（可选）         | ❌                 | D3.js             | vis.js               | Web UI      |
| **更新**       | 自动 + 增量           | 文件监听           | watch 命令        | --watch              | 文件监听    |
| **开源协议**   | MIT                   | MIT                | MIT               | 未明确               | PolyForm NC |

:::info
Codebase Memory 的核心差异在于**极致性能**和**跨仓库原生支持**。纯 C 实现的索引速度远超其他工具，且是唯一支持团队共享图谱快照的工具。
:::

## 搭配使用

Codebase Memory 独立覆盖日常代码探索场景。与其他工具配合：

| 场景         | 组合                                | 理由                                             |
| ------------ | ----------------------------------- | ------------------------------------------------ |
| **日常开发** | Codebase Memory 单独                | 零配置，极致性能                                 |
| **代码审查** | Codebase Memory + Code Review Graph | CRG 的 Blast-Radius + Codebase Memory 的变更检测 |
| **研究整理** | Codebase Memory + Graphify          | 图谱精度 + 多模态知识整合                        |
| **企业平台** | Codebase Memory + GitNexus          | 跨仓库能力互补                                   |
| **完整覆盖** | Codebase Memory + CRG + Graphify    | 各司其职，MCP 并行运行                           |

## 更新与卸载

```bash
# 检查并更新
codebase-memory-mcp update

# 卸载（移除所有 agent 配置、skills、hooks，不删除二进制和数据库）
codebase-memory-mcp uninstall
```

彻底清除：

```bash
rm -rf ~/.cache/codebase-memory-mcp/
```

## 安全

- 100% 本地处理，代码不离开机器
- 每次发布经过 70+ 杀毒引擎 VirusTotal 扫描
- Sigstore cosign 无密钥签名
- SLSA Level 3 加密构建溯源
- SHA-256 校验和
- CodeQL SAST 扫描（未处理告警阻止发布）
- 零运行时依赖，无传递供应链风险

## 下一步

- [代码图谱工具对比](/guide/advanced/code-graph/code-graph-tools) — 全面了解各工具的定位和适用场景
- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理多个 MCP 服务器配置
- [CodeGraph](/guide/advanced/code-graph/codegraph) — TypeScript 实现的轻量代码图谱
- [Code Review Graph](/guide/advanced/code-graph/code-review-graph) — 专注代码审查的图谱工具
