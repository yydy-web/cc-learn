# Superpowers 教程 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Claude Code 教程站点中添加 Superpowers 插件的介绍和使用教程，结合 CC-Switch 展示社区 Skills 的安装方式。

**Architecture:** 新建一个高级篇页面 `docs/guide/advanced/superpowers.md`，介绍 Superpowers 的七步工作流和 14 个 Skills，并展示两种安装方式（直接安装和通过 CC-Switch 安装）。同时更新 5 个现有页面添加交叉引用。

**Tech Stack:** Rspress v2, Markdown/MDX, YAML frontmatter

---

## File Structure

| 操作 | 文件 | 职责 |
|------|------|------|
| 创建 | `docs/guide/advanced/superpowers.md` | Superpowers 完整教程页面 |
| 修改 | `docs/guide/advanced/_meta.json` | 侧边栏添加 superpowers 条目 |
| 修改 | `docs/guide/advanced/custom-skills.md` | 添加指向 Superpowers 的引用 |
| 修改 | `docs/guide/advanced/cc-switch.md` | 添加通过 CC-Switch 安装 Superpowers 的说明 |
| 修改 | `docs/index.md` | 首页高级篇描述中加入 Superpowers |
| 修改 | `docs/tips/best-practices.md` | 添加 Superpowers 工作流最佳实践 |

---

### Task 1: 创建 Superpowers 教程页面

**Files:**
- Create: `docs/guide/advanced/superpowers.md`

- [ ] **Step 1: 创建完整的 Superpowers 教程页面**

```markdown
---
title: Superpowers 插件
description: 使用 Superpowers 插件为 Claude Code 添加结构化开发工作流，包括头脑风暴、TDD 和代码审查
---

# Superpowers 插件

Superpowers 是一个开源的 Claude Code 插件，为 AI 编程助手提供结构化的软件开发工作流。它将专业的开发方法论（头脑风暴、计划、TDD、代码审查）封装为可组合的 Skills，让 Claude Code 按照最佳实践执行开发任务。

## 为什么需要 Superpowers

默认情况下，Claude Code 收到任务后会直接开始写代码。这在简单场景下没问题，但面对复杂功能时容易出现：

- 没有充分理解需求就开始编码
- 缺少设计思考，代码结构不合理
- 没有测试覆盖，后续修改容易出错
- 跳过代码审查，质量问题被忽略

Superpowers 通过 **7 步工作流** 强制执行纪律：先设计、再计划、用 TDD 实现、最后审查。

## 安装

### 方式一：直接安装（推荐）

在 Claude Code 中运行：

```
> /plugin install superpowers@claude-plugins-official
```

安装完成后，Superpowers 会在每次会话启动时自动加载。

### 方式二：通过 CC-Switch 安装

如果你已经安装了 [CC-Switch](/guide/advanced/cc-switch)，可以通过 Skills 市场安装：

1. 打开 CC-Switch Desktop
2. 进入 Skills 市场
3. 搜索 "superpowers"
4. 点击安装到 Claude Code

:::tip
CC-Switch 通过 skills.sh 公共注册中心发现社区 Skills，Superpowers 的所有 Skills 都已发布到 skills.sh。如果你需要在多个工具（Claude Code、Codex、Gemini CLI）之间同步 Skills，使用 CC-Switch 安装更方便。
:::

## 七步工作流

Superpowers 的核心是一个 7 步开发工作流，每一步对应一个或多个 Skill：

```
1. 头脑风暴 (Brainstorming)
   ↓
2. Git Worktree 隔离工作区
   ↓
3. 编写计划 (Writing Plans)
   ↓
4. 子智能体驱动开发 (Subagent-Driven Development)
   ↓
5. 测试驱动开发 (TDD)
   ↓
6. 代码审查 (Code Review)
   ↓
7. 完成分支 (Finishing a Branch)
```

### 第一步：头脑风暴

在写任何代码之前，Claude Code 会：

1. 通过提问探索你的需求意图
2. 提出 2-3 个方案并分析利弊
3. 逐节展示设计方案
4. 将设计写入 `docs/superpowers/specs/` 目录
5. 等你确认后才继续

```
> 我想给用户系统添加密码重置功能
```

Claude Code 会先问你一系列问题（邮件验证？手机验证？令牌过期时间？），而不是直接开始写代码。

:::info
这是一个"硬门控"——设计未获批准前，Superpowers 会阻止任何代码实现。
:::

### 第二步：Git Worktree 隔离

创建隔离的 Git 工作区，避免直接在主分支上开发：

- 自动创建新分支和 worktree 目录
- 检测项目类型并安装依赖
- 确认测试基线是干净的

### 第三步：编写计划

将设计拆分为 2-5 分钟的小任务，每个任务包含：

- 精确的文件路径和行号
- 完整的代码块（没有占位符）
- 运行命令和预期输出
- Git 提交指令

计划保存到 `docs/superpowers/plans/` 目录。

### 第四步：子智能体驱动开发

每个任务由独立的子智能体执行，实现上下文隔离：

- 每个任务有独立的上下文窗口
- 两阶段审查：先检查是否符合规格，再检查代码质量
- 子智能体报告状态：`DONE`、`DONE_WITH_CONCERNS`、`NEEDS_CONTEXT`、`BLOCKED`

### 第五步：测试驱动开发（TDD）

严格遵循 RED-GREEN-REFACTOR 循环：

```
1. 🔴 RED    — 先写失败的测试
2. 🟢 GREEN  — 写最少的代码让测试通过
3. 🔵 REFACTOR — 重构优化，保持测试通过
```

:::warning
Superpowers 严格执行"先测试后代码"规则。如果代码在测试之前写好，会被要求删除重来。
:::

### 第六步：代码审查

对照原始计划审查代码：

- 关键问题会阻止合并
- 使用独立的审查子智能体，避免上下文偏见
- 审查范围：安全性、性能、代码质量、测试覆盖

### 第七步：完成分支

开发完成后，提供 4 个选项：

| 选项 | 说明 |
|------|------|
| 本地合并 | 直接合并到当前分支 |
| 创建 PR | 推送并创建 Pull Request |
| 保留现状 | 保持分支不动 |
| 丢弃 | 删除分支和工作区 |

## 核心 Skills 一览

Superpowers 包含 14 个 Skills，分为两类：

### 流程类 Skills（严格遵循）

| Skill | 用途 |
|-------|------|
| `brainstorming` | 编码前的设计探索 |
| `writing-plans` | 详细的任务拆分 |
| `test-driven-development` | 严格的 TDD 循环 |
| `systematic-debugging` | 4 阶段根因分析 |
| `verification-before-completion` | "有证据才能说完成" |
| `finishing-a-development-branch` | 分支收尾流程 |

### 灵活类 Skills（可按需调整）

| Skill | 用途 |
|-------|------|
| `executing-plans` | 在当前会话中执行计划 |
| `subagent-driven-development` | 子智能体驱动开发 |
| `dispatching-parallel-agents` | 并行任务协调 |
| `using-git-worktrees` | 隔离工作区管理 |
| `requesting-code-review` | 发起代码审查 |
| `receiving-code-review` | 处理审查反馈 |
| `writing-skills` | 基于 TDD 创建新 Skill |
| `using-superpowers` | 引导 Skill，自动加载 |

## 手动调用 Skills

虽然 Superpowers 会根据场景自动触发合适的 Skill，你也可以手动调用：

```
> /superpowers:brainstorming
> 帮我设计一个缓存策略

> /superpowers:systematic-debugging
> 用户反馈登录偶尔会超时，帮我排查

> /superpowers:test-driven-development
> 用 TDD 方式实现文件上传功能
```

## 工作流示例

### 示例一：开发新功能

```
> 使用 Superpowers 工作流，给 API 添加分页支持
```

Claude Code 会自动执行完整流程：
1. 头脑风暴：问你分页参数、排序、总数返回等需求
2. 设计：提出 cursor-based vs offset-based 方案
3. 计划：拆分为模型、路由、测试等小任务
4. TDD：每个任务先写测试再实现
5. 审查：检查代码质量和性能
6. 完成：选择合并或创建 PR

### 示例二：调试复杂问题

```
> /superpowers:systematic-debugging
> 生产环境内存持续增长，怀疑有内存泄漏
```

Superpowers 会按照 4 阶段系统性排查：
1. 复现问题
2. 收集证据（heap snapshot、日志分析）
3. 形成假设并验证
4. 修复并添加防护测试

## 与 CC-Switch 配合使用

Superpowers 和 [CC-Switch](/guide/advanced/cc-switch) 是互补的工具：

- **Superpowers** 管理开发**方法论**——怎么写代码
- **CC-Switch** 管理开发**配置**——用什么 Provider、MCP 服务器

通过 CC-Switch 的 Skills 市场，你可以：

1. 浏览 Superpowers 的所有 14 个 Skills
2. 一键安装到 Claude Code、Codex 或 Gemini CLI
3. 在多个工具之间同步 Skills 配置

```bash
# 通过 CC-Switch CLI 安装 Superpowers Skills
cc-switch skills install superpowers

# 同步到所有已配置的工具
cc-switch skills sync
```

## 相关资源

- [Superpowers GitHub](https://github.com/obra/superpowers) — 项目仓库（216k+ Stars）
- [Skills.sh](https://skills.sh) — 社区 Skills 注册中心
- [Superpowers 文档](https://github.com/obra/superpowers#readme) — 完整使用文档

## 下一步

- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 API Provider 和 Skills
- [多智能体工作流](/guide/advanced/multi-agent) — 编排多个 Agent 协作
- [自动化与 CI/CD](/guide/advanced/automation) — 在 CI/CD 中使用 Claude Code
```

- [ ] **Step 2: 验证文件内容完整**

Run: 在编辑器中检查 `docs/guide/advanced/superpowers.md` 的 frontmatter、标题层级、链接路径是否正确。

- [ ] **Step 3: Commit**

```bash
git add docs/guide/advanced/superpowers.md
git commit -m "docs: add Superpowers plugin tutorial page"
```

---

### Task 2: 更新侧边栏导航

**Files:**
- Modify: `docs/guide/advanced/_meta.json`

- [ ] **Step 1: 添加 superpowers 到侧边栏**

将 `_meta.json` 从：
```json
["hooks", "mcp-servers", "custom-skills", "cc-switch", "multi-agent", "automation"]
```
改为：
```json
["hooks", "mcp-servers", "custom-skills", "cc-switch", "superpowers", "multi-agent", "automation"]
```

superpowers 放在 cc-switch 之后、multi-agent 之前，因为它是在配置好工具之后、进行高级工作流之前的进阶内容。

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/_meta.json
git commit -m "docs: add Superpowers to advanced sidebar navigation"
```

---

### Task 3: 更新 custom-skills.md 添加 Superpowers 引用

**Files:**
- Modify: `docs/guide/advanced/custom-skills.md:108-112`

- [ ] **Step 1: 在 CC-Switch info 之后添加 Superpowers info**

在现有的 CC-Switch `:::info` 块之后，`## 使用 Skill` 之前，添加：

```markdown
:::info
想要一套完整的结构化开发工作流？[Superpowers](/guide/advanced/superpowers) 插件为 Claude Code 提供了从头脑风暴到代码审查的 14 个专业 Skills。
:::
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/custom-skills.md
git commit -m "docs: add Superpowers reference to custom skills page"
```

---

### Task 4: 更新 cc-switch.md 添加 Superpowers 安装说明

**Files:**
- Modify: `docs/guide/advanced/cc-switch.md:113-121`

- [ ] **Step 1: 在 Skills 市场部分添加 Superpowers 示例**

在 `### Skills 市场` 小节的列表之后添加：

```markdown
例如，你可以通过 CC-Switch 一键安装 [Superpowers](/guide/advanced/superpowers) 的全部 14 个 Skills——包括头脑风暴、TDD、代码审查等专业开发工作流。
```

- [ ] **Step 2: 在"场景三：安装社区 Skill"中添加具体示例**

将场景三改为：

```markdown
### 场景三：安装 Superpowers Skills

```
1. 在 Skills 市场中搜索 "superpowers"
2. 选择需要的 Skills（如 TDD、头脑风暴）
3. 点击安装到 Claude Code
4. 在 Claude Code 中通过斜杠命令调用
```
```

- [ ] **Step 3: Commit**

```bash
git add docs/guide/advanced/cc-switch.md
git commit -m "docs: add Superpowers installation example to CC-Switch page"
```

---

### Task 5: 更新首页描述

**Files:**
- Modify: `docs/index.md:27-30`

- [ ] **Step 1: 更新高级篇 features 描述**

将：
```yaml
  - title: 高级篇
    details: 探索 Hooks、MCP 服务器、自定义技能、CC-Switch 配置管理和多智能体工作流
    icon: ⚡
    link: /guide/advanced/hooks
```

改为：
```yaml
  - title: 高级篇
    details: 探索 Hooks、MCP 服务器、自定义技能、CC-Switch 配置管理、Superpowers 工作流和多智能体协作
    icon: ⚡
    link: /guide/advanced/hooks
```

- [ ] **Step 2: Commit**

```bash
git add docs/index.md
git commit -m "docs: add Superpowers to homepage features description"
```

---

### Task 6: 更新最佳实践添加 Superpowers 工作流

**Files:**
- Modify: `docs/tips/best-practices.md`

- [ ] **Step 1: 在工作流模式部分添加 Superpowers**

在现有的"探索模式"之后、"省钱技巧"之前添加：

```markdown
### 结构化开发模式（Superpowers）

安装 [Superpowers](/guide/advanced/superpowers) 插件后，Claude Code 会自动按照结构化工作流执行：

```
> 使用 Superpowers 工作流，给用户系统添加 OAuth 登录
```

这会触发完整的七步流程：头脑风暴 → 设计 → 计划 → TDD → 审查 → 完成。适合复杂功能开发。
```

- [ ] **Step 2: Commit**

```bash
git add docs/tips/best-practices.md
git commit -m "docs: add Superpowers workflow to best practices"
```

---

### Task 7: 构建验证

**Files:**
- None (verification only)

- [ ] **Step 1: 运行生产构建**

Run: `npm run build`
Expected: 所有页面构建成功，无报错。`doc_build/guide/advanced/superpowers.html` 应出现在输出中。

- [ ] **Step 2: 检查生成的页面**

确认以下页面都正确生成：
- `doc_build/guide/advanced/superpowers.html`
- `doc_build/guide/advanced/custom-skills.html`（含新引用）
- `doc_build/guide/advanced/cc-switch.html`（含新引用）
- `doc_build/index.html`（含更新描述）
- `doc_build/tips/best-practices.html`（含新小节）

- [ ] **Step 3: Commit 构建产物（如需要）**

如果项目跟踪构建产物：
```bash
git add doc_build/
git commit -m "build: regenerate with Superpowers tutorial"
```
