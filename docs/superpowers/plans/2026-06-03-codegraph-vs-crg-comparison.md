# CodeGraph vs Code Review Graph 对比 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 增强 CodeGraph 和 Code Review Graph 两个教程页面中的对比内容，提供更详细的选型指南。

**Architecture:** 在两个现有页面中扩展对比部分，增加更详细的对比表格、选型建议和组合使用场景。

**Tech Stack:** Rspress v2, Markdown/MDX

---

## File Structure

| 操作 | 文件 | 职责 |
|------|------|------|
| 修改 | `docs/guide/advanced/codegraph.md` | 扩展"相关工具"部分为详细对比 |
| 修改 | `docs/guide/advanced/code-review-graph.md` | 扩展"与 CodeGraph 的对比"部分 |

---

### Task 1: 扩展 codegraph.md 的对比部分

**Files:**
- Modify: `docs/guide/advanced/codegraph.md:283-285`

- [ ] **Step 1: 替换简短的"相关工具"为详细对比**

将现有的：
```markdown
## 相关工具

[Code Review Graph](/guide/advanced/code-review-graph) 是另一个基于 tree-sitter 的代码图谱工具，侧重代码审查和 Blast-Radius 分析。两者可以互补：CodeGraph 适合日常代码探索，CRG 适合代码审查和架构分析。
```

替换为：
```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/codegraph.md
git commit -m "docs: expand CodeGraph vs CRG comparison with selection guide"
```

---

### Task 2: 扩展 code-review-graph.md 的对比部分

**Files:**
- Modify: `docs/guide/advanced/code-review-graph.md:212-226`

- [ ] **Step 1: 替换简短的对比为详细对比**

将现有的：
```markdown
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
```

替换为：
```markdown
## 与 CodeGraph 的对比

[CodeGraph](/guide/advanced/codegraph) 是另一个基于 tree-sitter 的本地代码图谱工具。两者都通过 MCP 为 Claude Code 提供代码智能，但设计重点不同：

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

:::tip
两者可以互补：CodeGraph 适合日常开发中的快速代码探索，CRG 适合代码审查、PR 审核和架构分析。两者通过 MCP 并行运行，互不冲突。
:::
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/code-review-graph.md
git commit -m "docs: expand CRG vs CodeGraph comparison with selection guide"
```

---

### Task 3: 构建验证

**Files:**
- None (verification only)

- [ ] **Step 1: 运行生产构建**

Run: `npm run build`
Expected: 所有页面构建成功，无报错。

- [ ] **Step 2: 检查生成的页面**

确认以下页面都正确生成：
- `doc_build/guide/advanced/codegraph.html`（含详细对比）
- `doc_build/guide/advanced/code-review-graph.html`（含详细对比）
