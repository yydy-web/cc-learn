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

### Pipeline 阶段视角

Superpowers 的 14 个 Skills 按照开发 Pipeline 的阶段组织：

| 阶段       | Skill                            | 斜杠命令                               |
| ---------- | -------------------------------- | -------------------------------------- |
| 入口       | `using-superpowers`              | —                                      |
| 设计       | `brainstorming`                  | `/superpowers:brainstorming`           |
| 规划       | `writing-plans`                  | `/superpowers:writing-plans`           |
| 隔离       | `using-git-worktrees`            | —                                      |
| 执行       | `executing-plans`                | `/superpowers:executing-plans`         |
| 执行       | `subagent-driven-development`    | `/superpowers:subagent-driven-development` |
| 并行       | `dispatching-parallel-agents`    | —                                      |
| 实现与测试 | `test-driven-development`        | `/superpowers:test-driven-development` |
| 调试       | `systematic-debugging`           | `/superpowers:systematic-debugging`    |
| 审查       | `requesting-code-review`         | —                                      |
| 审查       | `receiving-code-review`          | —                                      |
| 验证       | `verification-before-completion` | —                                      |
| 收尾       | `finishing-a-development-branch` | —                                      |
| 元技能     | `writing-skills`                 | —                                      |

## 安装

```
> /plugin install superpowers@claude-plugins-official
```

也可通过 [CC-Switch](/skills/overview/skills-marketplace) 市场安装。

## 核心方法论

### 三大铁律

Superpowers 的 7 步工作流背后有三条不可违反的铁律：

1. **没有设计，不写代码** — `brainstorming` 是硬门控，设计未确认前禁止编码
2. **没有测试，不写代码** — `test-driven-development` 强制 RED-GREEN-REFACTOR，先写代码会被要求删除
3. **没有验证，不说完成** — `verification-before-completion` 要求提供新鲜的命令输出作为证据

### 系统化调试

`systematic-debugging` 遵循四阶段流程（复现→根因→修复→防护），配合"三振出局"升级规则——同一问题尝试 3 次未解决则请求人工介入。

完整的实战案例和方法论详解，请参考 [Superpowers 插件](/guide/advanced/superpowers)。

## 与其他 Skills 的关系

| 对比         | Superpowers         | [Gstack](/skills/workflow/gstack) |
| ------------ | ------------------- | --------------------------------- |
| **定位**     | 结构化方法论        | 虚拟工程团队                      |
| **特色**     | TDD 强制执行        | 内置浏览器、QA                    |
| **推荐组合** | 前期设计 + TDD 实现 | 后期审查 + QA + 发布              |

## 下一步

- [Superpowers 插件（完整文档）](/guide/advanced/superpowers) — 安装、配置和七步工作流详解
- [Gstack 工具包](/skills/workflow/gstack) — 互补的工程团队 Skills
- [自定义技能](/skills/overview/custom-skills) — 创建自己的 Skills
- [技能市场](/skills/overview/skills-marketplace) — 浏览和安装社区 Skills
