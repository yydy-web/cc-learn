# Orca 使用教程 — 设计文档

**日期**: 2026-06-24
**状态**: 已确认
**目标**: 在 CC Learn 站点中新增 Orca 使用教程，定位为 Claude Code 的推荐运行环境。

## 背景

Orca（[github.com/stablyai/orca](https://github.com/stablyai/orca)）是一个开源的 Agentic Development Environment（ADE），专为同时运行多个 AI 编程 Agent 而设计。它通过 Git Worktree 隔离每个 Agent 的工作空间，提供终端分屏、Diff 审查、多 Agent 并行等功能。用户自带 Claude Code 订阅即可使用。

参考文档：https://www.onorca.dev/docs

## 设计目标

1. 让 Claude Code 用户了解 Orca 作为运行环境的优势
2. 提供快速上手路径（进阶篇），10 分钟内完成安装到第一个任务
3. 提供完整教程（高级篇），覆盖四个核心功能主题
4. 与现有站点结构、写作风格保持一致

## 文件结构

```
docs/guide/intermediate/orca-quickstart.md   ← 新增：快速上手
docs/guide/intermediate/_meta.json           ← 修改：新增条目
docs/guide/advanced/orca.md                  ← 新增：完整教程
docs/guide/advanced/_meta.json               ← 修改：新增条目
```

## 进阶篇：Orca 快速上手（orca-quickstart.md）

**定位**：已有 Claude Code 基础，想快速用上 Orca。
**目标**：10 分钟从安装到跑通第一个任务。

### 内容大纲

1. **什么是 Orca** — 一句话介绍 ADE 概念，核心价值：每个任务独立 Worktree
2. **安装与初始化** — 下载桌面应用（macOS/Windows/Linux）、首次启动配置、关联 Claude Code
3. **第一个 Worktree 任务** — 打开项目 → 创建 Worktree → 分配 Agent → 发送任务 → 查看结果 → Diff 审查 → 提交
4. **日常使用技巧** — 终端分屏、快捷键、会话恢复

### 导航

- 添加到 `docs/guide/intermediate/_meta.json`，放在现有条目末尾

## 高级篇：Orca 完整教程（orca.md）

**定位**：想深入掌握 Orca 核心能力的用户。
**覆盖**：四个核心功能主题。

### 内容大纲

1. **为什么用 Orca** — 普通终端 vs Orca 的对比，多任务场景痛点
2. **Worktree 隔离** — Git Worktree 基础、Orca 中的生命周期、实战：同时处理 3 个独立任务
3. **多 Agent 并行** — Agent 配置、Race 模式、结果对比择优、实战：3 Agent 修同一 Bug
4. **Diff 审查** — Diff 查看器、AI 注释反馈、审查后提交、实战：审查 Agent 生成的代码
5. **Orca CLI** — 命令行操作、常用命令速查、CI/CD 集成思路

### 导航

- 添加到 `docs/guide/advanced/_meta.json`，放在「多智能体与自动化」分类下，现有 `multi-agent` 条目之前

## 写作规范

- **语言**：纯中文撰写，命令和代码块保留英文原样
- **功能名称**：保留英文术语（如 Worktree、Diff、Agent），首次出现可加中文注释
- **frontmatter**：每篇包含 `title` 和 `description`（50–160 字符）
- **参考来源**：https://www.onorca.dev/docs 和 https://github.com/stablyai/orca

## 验证方式

- `npm run build` 构建通过
- 两个页面在侧边栏导航中可见且位置正确
- 页面内部链接有效
- `description` frontmatter 填写完整
