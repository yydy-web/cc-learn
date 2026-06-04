---
title: Superpowers 技能生态
description: Superpowers 的 14 个 Skills 概览——从头脑风暴到代码审查的完整开发方法论
---

# Superpowers 技能生态

[Superpowers](/guide/advanced/superpowers) 是一个开源的 Claude Code 插件，提供 14 个结构化开发 Skills，覆盖从设计探索到代码审查的完整开发流程。

:::tip
本页属于[技能系统](/skills/)的一部分。安装配置和七步工作流详解请参考 [Superpowers 插件](/guide/advanced/superpowers)。
:::

## 七步工作流

Superpowers 的核心是 7 步开发工作流，每一步对应一个或多个 Skill：

```
头脑风暴 → Git Worktree → 编写计划 → 子智能体驱动 → TDD → 代码审查 → 完成分支
```

## 14 个 Skills 一览

### 流程类 Skills（严格遵循）

| Skill | 斜杠命令 | 用途 |
|-------|----------|------|
| `brainstorming` | `/superpowers:brainstorming` | 编码前的设计探索 |
| `writing-plans` | `/superpowers:writing-plans` | 详细的任务拆分 |
| `test-driven-development` | `/superpowers:test-driven-development` | 严格的 TDD 循环 |
| `systematic-debugging` | `/superpowers:systematic-debugging` | 4 阶段根因分析 |
| `verification-before-completion` | — | "有证据才能说完成" |
| `finishing-a-development-branch` | — | 分支收尾流程 |

### 灵活类 Skills（可按需调整）

| Skill | 斜杠命令 | 用途 |
|-------|----------|------|
| `executing-plans` | `/superpowers:executing-plans` | 在当前会话中执行计划 |
| `subagent-driven-development` | `/superpowers:subagent-driven-development` | 子智能体驱动开发 |
| `dispatching-parallel-agents` | — | 并行任务协调 |
| `using-git-worktrees` | — | 隔离工作区管理 |
| `requesting-code-review` | — | 发起代码审查 |
| `receiving-code-review` | — | 处理审查反馈 |
| `writing-skills` | — | 基于 TDD 创建新 Skill |
| `using-superpowers` | — | 引导 Skill，自动加载 |

## 安装

```
> /plugin install superpowers@claude-plugins-official
```

也可通过 [CC-Switch](/skills/skills-marketplace) 市场安装。

## 与其他 Skills 的关系

| 对比 | Superpowers | [Gstack](/skills/gstack) |
|------|-------------|--------------------------|
| **定位** | 结构化方法论 | 虚拟工程团队 |
| **特色** | TDD 强制执行 | 内置浏览器、QA |
| **推荐组合** | 前期设计 + TDD 实现 | 后期审查 + QA + 发布 |

## 下一步

- [Superpowers 插件（完整文档）](/guide/advanced/superpowers) — 安装、配置和七步工作流详解
- [Gstack 工具包](/skills/gstack) — 互补的工程团队 Skills
- [自定义技能](/skills/custom-skills) — 创建自己的 Skills
- [技能市场](/skills/skills-marketplace) — 浏览和安装社区 Skills
