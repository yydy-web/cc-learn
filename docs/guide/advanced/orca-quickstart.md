---
title: Orca 快速上手
description: 安装和配置 Orca 桌面应用作为 Claude Code 的运行环境，10 分钟内完成第一个 Worktree 任务
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★★★☆    |
| 📦 产品 | ★★★☆☆  | ★★★★☆    |

**🎯 学习产出：** 快速上手 Orca，能独立完成 Worktree 任务的创建、执行、审查和提交

**🚀 AI 能力提升：** 多智能体
:::

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

```text
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
