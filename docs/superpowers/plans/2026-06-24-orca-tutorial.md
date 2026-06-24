# Orca 使用教程 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 CC Learn 站点新增两篇 Orca 使用教程（进阶篇快速上手 + 高级篇完整教程），并更新侧边栏导航。

**Architecture:** 纯内容新增 — 两个 Markdown 文件放入现有 Rspress 目录结构，修改两个 `_meta.json` 导航文件。无需改动构建配置、主题或组件。

**Tech Stack:** Markdown（Rspress v2 站点内容），JSON（侧边栏导航配置）

## Global Constraints

- 纯中文撰写，命令和代码块保留英文原样
- 功能名称保留英文术语（Worktree、Diff、Agent），首次出现可加中文注释
- 每篇 frontmatter 包含 `title` 和 `description`（50–160 字符）
- 参考来源：https://www.onorca.dev/docs 和 https://github.com/stablyai/orca
- 验证：`npm run build` 通过，页面在导航中正确显示

---

### Task 1: 创建进阶篇「Orca 快速上手」页面

**Files:**
- Create: `docs/guide/intermediate/orca-quickstart.md`

**Interfaces:**
- Produces: 页面可通过路由 `/guide/intermediate/orca-quickstart` 访问

- [ ] **Step 1: 创建 orca-quickstart.md 文件**

```markdown
---
title: Orca 快速上手
description: 安装和配置 Orca 桌面应用作为 Claude Code 的运行环境，10 分钟内完成第一个 Worktree 任务
---

# Orca 快速上手

Orca 是一个专为 AI 编程 Agent 设计的桌面环境（Agentic Development Environment，简称 ADE）。它让每个任务运行在独立的 Git Worktree 中，互不干扰。

如果你已经习惯在终端里使用 Claude Code，Orca 能让你的工作流更高效：一个窗口管理多个 Agent 会话，内置 Diff 审查，随时切换任务。

## 安装

访问 [Orca 官网](https://www.onorca.dev) 下载桌面应用，支持 macOS、Windows 和 Linux。

下载后直接安装并启动。首次启动时 Orca 会引导你完成基本配置。

## 关联 Claude Code

Orca 不自带 AI Agent —— 你需要用自己的 Claude Code 订阅。

启动 Orca 后：

1. 打开设置（`Cmd + ,` / `Ctrl + ,`）
2. 进入 **Agents** 面板
3. 添加 Claude Code：Orca 会自动检测系统中已安装的 `claude` 命令

确保你的终端中 `claude` 命令已经可用且已登录：

```bash
claude --version
```

如果未安装 Claude Code，参考 [Claude Code 安装指南](/guide/beginner/installation)。

## 第一个 Worktree 任务

### 1. 打开项目

在 Orca 中打开你的项目目录。Orca 会自动识别这是一个 Git 仓库。

### 2. 创建 Worktree

点击 **New Worktree**，给任务命名（比如 `fix-login-bug`）。Orca 会基于当前分支创建一个 Git Worktree —— 一个独立的工作副本，不会影响主工作区。

### 3. 发送任务

在 Worktree 的终端中，向 Claude Code 发送你的第一个任务：

```
> 帮我修复登录页面的验证逻辑，当邮箱格式不正确时显示错误提示
```

### 4. 审查结果

Claude Code 完成任务后，Orca 会显示文件变更。在 **Diff 面板** 中逐行查看修改内容。

### 5. 提交

确认无误后，在 Orca 中直接提交。变更会合入原分支，Worktree 可以保留以便后续修改或清理。

## 日常技巧

### 终端分屏

Orca 支持 GPU 加速的终端分屏。你可以一边让 Agent 工作，一边在另一个终端面板中运行 `npm run dev` 查看效果。

### 快捷键

- **Quick Open**（`Cmd + P` / `Ctrl + P`）：快速切换 Worktree 和文件
- **Jump Palette**（`Cmd + Shift + P` / `Ctrl + Shift + P`）：搜索所有可用操作

### 会话恢复

Orca 会自动保存每个 Worktree 的 Agent 会话状态。关闭后重新打开，Agent 的历史记录和上下文都在。

## 下一步

快速上手到这里就结束了。如果你想深入了解 Worktree 隔离、多 Agent 并行、Diff 审查和 Orca CLI，请继续阅读 [Orca 完整教程](/guide/advanced/orca)。

更多细节参考 [Orca 官方文档](https://www.onorca.dev/docs)。
```

- [ ] **Step 2: 验证文件内容**

确认文件已保存到 `docs/guide/intermediate/orca-quickstart.md`，frontmatter 中 `title` 和 `description` 已填写。

- [ ] **Step 3: 提交**

```bash
git add docs/guide/intermediate/orca-quickstart.md
git commit -m "docs: add Orca quickstart guide (intermediate)"
```

---

### Task 2: 更新进阶篇侧边栏导航

**Files:**
- Modify: `docs/guide/intermediate/_meta.json`

**Interfaces:**
- Consumes: Task 1 创建的 `orca-quickstart.md`
- Produces: 侧边栏中「进阶篇」分组下出现「Orca 快速上手」条目

- [ ] **Step 1: 在 _meta.json 末尾添加条目**

`docs/guide/intermediate/_meta.json` 当前内容：

```json
["codebase-navigation", "slash-commands", "claude-md", "git-workflow", "context-management"]
```

修改为：

```json
["codebase-navigation", "slash-commands", "claude-md", "git-workflow", "context-management", "orca-quickstart"]
```

- [ ] **Step 2: 验证 JSON 格式**

在 PowerShell 中运行：

```powershell
Get-Content "docs/guide/intermediate/_meta.json" | ConvertFrom-Json | Out-Null; Write-Output "JSON valid"
```

预期输出：`JSON valid`

- [ ] **Step 3: 提交**

```bash
git add docs/guide/intermediate/_meta.json
git commit -m "docs: add Orca quickstart to intermediate sidebar"
```

---

### Task 3: 创建高级篇「Orca 完整教程」页面

**Files:**
- Create: `docs/guide/advanced/orca.md`

**Interfaces:**
- Produces: 页面可通过路由 `/guide/advanced/orca` 访问

- [ ] **Step 1: 创建 orca.md 文件**

```markdown
---
title: Orca 完整教程
description: 深入掌握 Orca 核心功能：Worktree 隔离、多 Agent 并行、Diff 审查和 Orca CLI 命令行操作
---

# Orca 完整教程

如果你已经通过 [Orca 快速上手](/guide/intermediate/orca-quickstart) 完成了基础配置，这篇文章将带你深入 Orca 的四个核心功能。

## 为什么用 Orca

在普通终端中使用 Claude Code 时，你会遇到几个痛点：

- **任务切换困难**：同时处理多个需求时，需要手动 `git stash`、切换分支，容易出错
- **Agent 上下文污染**：上一个任务的对话历史还在，影响新任务的理解
- **结果难以对比**：想让两个 Agent 解决同一个问题，只能串行操作、手动比较

Orca 通过 **Git Worktree 隔离** 解决了这些问题。每个任务有独立的文件系统、终端会话和 Agent 上下文，互不影响。你可以在一个窗口中同时运行多个 Agent，查看各自进度，选择最佳结果。

## Worktree 隔离

### Git Worktree 基础

Git Worktree 允许你在同一个仓库中同时检出多个分支到不同目录。Orca 封装了这个机制，让创建和管理 Worktree 变得简单。

每个 Worktree 包含：

- **独立的文件系统**：修改不会影响主工作区
- **独立的终端**：每个终端绑定到一个 Worktree
- **独立的 Agent 会话**：Claude Code 的对话上下文隔离

### 生命周期

```
创建 Worktree → Agent 工作 → Diff 审查 → 提交/放弃 → 清理 Worktree
```

- **创建**：基于当前分支或指定分支创建，命名任务
- **工作**：Agent 在 Worktree 内修改代码
- **审查**：在 Diff 面板中查看变更
- **提交**：变更合入原分支，或放弃变更
- **清理**：不再需要时删除 Worktree，释放磁盘空间

### 实战：同时处理三个独立任务

假设你有三个任务需要并行推进：

1. **修复登录 Bug** — 基于 `main` 分支
2. **重构用户模块** — 基于 `develop` 分支
3. **编写 API 文档** — 基于 `develop` 分支

在 Orca 中：

1. 创建 Worktree `fix-login-bug`（基于 `main`）
2. 创建 Worktree `refactor-user-module`（基于 `develop`）
3. 创建 Worktree `api-docs`（基于 `develop`）

每个 Worktree 分配一个 Claude Code Agent，三个任务完全并行。Agent A 在修 Bug 的代码改动不会出现在 Agent B 的工作区中。

完成任务后，每个 Worktree 独立审查、提交、推送。最后删除 Worktree，磁盘恢复干净。

## 多 Agent 并行

### 配置 Agent

Orca 支持多种 CLI Agent。除了 Claude Code，你还可以添加 Codex、Cursor CLI 等。

添加 Agent 的步骤：

1. 打开设置 → Agents
2. 点击 **Add Agent**
3. 选择类型（Claude Code / Codex / Custom）
4. 配置名称和启动命令

### Race 模式：让多个 Agent 修复同一个 Bug

Orca 支持 Race 模式 —— 将同一个任务同时分派给多个 Agent，选择最好的结果。

**操作流程**：

1. 右键点击一个 Worktree，选择 **Clone Worktree**，创建两份
2. 在一个 Worktree 分配 Claude Code，另一个分配 Codex
3. 向两个 Agent 发送相同任务：

```
> src/api/user.ts 中 getUserById 函数在 id 为 null 时崩溃，请修复并添加输入校验
```

4. 两个 Agent 并行工作，各自生成修复方案

5. 在 Diff 面板中对比两个结果，选择方案更合理的那个合入

这种模式特别适合：
- 不确定哪种实现方式更好的场景
- 需要代码审查和备选方案的关键修复
- 学习不同 Agent 的代码风格差异

## Diff 审查

### Diff 查看器

Orca 内置了代码 Diff 查看器，支持：

- 并排对比（Side-by-side）和统一视图（Unified）
- 语法高亮
- 逐文件浏览变更

在每个 Worktree 中，Agent 的所有修改都会自动显示在 Diff 面板。

### AI 注释反馈

Orca 支持在 Diff 的任意行上添加注释，作为反馈发给 Agent：

1. 在 Diff 面板中点击行号旁的 `+` 按钮
2. 输入反馈内容，比如：

```
这个 catch 块只打印了错误日志，应该同时返回一个用户友好的错误响应
```

3. 发送注释 → Agent 收到反馈 → 根据反馈修改代码 → 新的 Diff 产生

这个循环可以持续到你满意为止。

### 审查后提交

确认所有变更无误后：

1. 点击 **Commit**，填写提交信息
2. 选择是否直接 Push 到远程
3. 提交完成后，Worktree 可以保留或删除

## Orca CLI

除了图形界面，Orca 还提供了命令行工具 `orca`，用于脚本化和自动化。

### 常用命令

```bash
# 列出所有 Worktree
orca worktree list

# 创建新 Worktree
orca worktree create --name fix-bug-42 --base main

# 获取指定 Worktree 的当前状态快照
orca worktree status --name fix-bug-42

# 在指定 Worktree 中运行命令
orca exec --worktree fix-bug-42 -- npm test

# 清理已完成任务的 Worktree
orca worktree delete --name fix-bug-42
```

### CI/CD 集成思路

Orca CLI 可以和 CI/CD 流水线结合：

- **自动化修复**：CI 检测到失败后，通过 Orca CLI 创建 Worktree，让 Agent 自动尝试修复
- **批量任务**：用脚本批量创建 Worktree，每个处理一个 Issue，Agent 并行工作
- **定时审查**：定期创建 Worktree 让 Agent 审查最近的提交

完整的 CLI 命令列表请参考 [Orca 官方文档](https://www.onorca.dev/docs)。

## 总结

| 功能 | 解决的问题 | 使用场景 |
|------|-----------|---------|
| Worktree 隔离 | 多任务互相干扰 | 同时开发多个功能 |
| 多 Agent 并行 | 单一方案无对比 | Bug 修复、方案选型 |
| Diff 审查 | 修改难以逐行审核 | 每次 Agent 生成代码后 |
| Orca CLI | 手动操作繁琐 | 自动化流水线、批量任务 |

Orca 不会替代 Claude Code —— 它让 Claude Code 在更高效的环境中运行。你仍然使用 `claude` 命令交互，但任务管理、结果审查和多 Agent 编排都由 Orca 统一处理。
```

- [ ] **Step 2: 验证文件内容**

确认文件已保存到 `docs/guide/advanced/orca.md`，frontmatter 中 `title` 和 `description` 已填写。

- [ ] **Step 3: 提交**

```bash
git add docs/guide/advanced/orca.md
git commit -m "docs: add Orca full tutorial (advanced)"
```

---

### Task 4: 更新高级篇侧边栏导航

**Files:**
- Modify: `docs/guide/advanced/_meta.json`

**Interfaces:**
- Consumes: Task 3 创建的 `orca.md`
- Produces: 侧边栏「多智能体与自动化」分组下出现「Orca」条目，排列在 `multi-agent` 之前

- [ ] **Step 1: 在 _meta.json 中插入条目**

`docs/guide/advanced/_meta.json` 中「多智能体与自动化」部分当前为：

```json
  {
    "type": "section-header",
    "label": "多智能体与自动化"
  },
  "multi-agent",
  "automation",
  "ralph",
  "agents-routing",
```

修改为：

```json
  {
    "type": "section-header",
    "label": "多智能体与自动化"
  },
  "orca",
  "multi-agent",
  "automation",
  "ralph",
  "agents-routing",
```

- [ ] **Step 2: 验证 JSON 格式**

在 PowerShell 中运行：

```powershell
Get-Content "docs/guide/advanced/_meta.json" | ConvertFrom-Json | Out-Null; Write-Output "JSON valid"
```

预期输出：`JSON valid`

- [ ] **Step 3: 提交**

```bash
git add docs/guide/advanced/_meta.json
git commit -m "docs: add Orca to advanced sidebar under multi-agent section"
```

---

### Task 5: 构建验证

**Files:**
- 验证所有已创建/修改的文件

**Interfaces:**
- Consumes: Task 1-4 的全部产出

- [ ] **Step 1: 运行生产构建**

```bash
npm run build
```

预期：构建成功，无错误退出。

- [ ] **Step 2: 检查构建输出**

确认 `doc_build/` 目录中包含：
- `doc_build/guide/intermediate/orca-quickstart.html`
- `doc_build/guide/advanced/orca.html`

- [ ] **Step 3: 提交（如有问题修复）**

如有构建错误，修复后提交。构建通过则此步骤跳过。
```

