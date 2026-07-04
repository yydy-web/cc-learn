---
title: Orca 完整教程
description: 深入掌握 Orca 核心功能：Worktree 隔离、多 Agent 并行、Diff 审查和 Orca CLI 命令行操作
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★★☆    |
| 🧪 测试 | ★★★☆☆  | ★★★★★    |
| 📦 产品 | ★★★☆☆  | ★★★★★    |

**🎯 学习产出：** 掌握 Orca 多智能体编排，能独立通过 Worktree 隔离和多 Agent 并行提升开发效率

**🚀 AI 能力提升：** 多智能体、自动化工作流
:::

# Orca 完整教程

如果你已经通过 [Orca 快速上手](/guide/advanced/orca-quickstart) 完成了基础配置，这篇文章将带你深入 Orca 的四个核心功能。

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

```text
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

```text
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

```text
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

| 功能          | 解决的问题       | 使用场景               |
| ------------- | ---------------- | ---------------------- |
| Worktree 隔离 | 多任务互相干扰   | 同时开发多个功能       |
| 多 Agent 并行 | 单一方案无对比   | Bug 修复、方案选型     |
| Diff 审查     | 修改难以逐行审核 | 每次 Agent 生成代码后  |
| Orca CLI      | 手动操作繁琐     | 自动化流水线、批量任务 |

Orca 不会替代 Claude Code —— 它让 Claude Code 在更高效的环境中运行。你仍然使用 `claude` 命令交互，但任务管理、结果审查和多 Agent 编排都由 Orca 统一处理。

## 下一步

- [Orca 快速上手](/guide/advanced/orca-quickstart) — 10 分钟完成第一个 Worktree 任务
- [多智能体工作流](/guide/advanced/multi-agent) — Claude Code 原生多 Agent 用法
- [Ralph 自主循环](/guide/advanced/ralph) — 自主循环执行 PRD 任务
- [Ruflo](/guide/advanced/ruflo) — 企业级 Agent 集群方案
