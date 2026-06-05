---
title: 技能系统
description: Claude Code 技能系统的完整指南——创建自定义 Skills、发现社区技能、使用专业开发工作流
---

# 技能系统

Skills（技能）是 Claude Code 的核心扩展机制，让你可以封装工作流程、注入领域知识、标准化团队最佳实践。本文按类型梳理了本站所有的 Skills 内容，帮助你快速找到需要的资源。

## 创建与管理

| 页面                                            | 说明                                           |
| ----------------------------------------------- | ---------------------------------------------- |
| [自定义技能](/skills/overview/custom-skills)    | 创建、编写和使用自定义 Skills                  |
| [技能市场](/skills/overview/skills-marketplace) | 浏览和安装社区 Skills（skills.sh + CC-Switch） |

## 开发工作流

完整的开发方法论和工程团队模拟，将专业实践封装为可组合的 Skills：

| 页面                                        | Skills 数量 | 定位                                        |
| ------------------------------------------- | ----------- | ------------------------------------------- |
| [Superpowers](/skills/workflow/superpowers) | 14          | 结构化开发方法论（TDD、头脑风暴、代码审查） |
| [Gstack](/skills/workflow/gstack)           | 23+         | 虚拟工程团队（QA、安全、发布流程）          |
| [Ralph](/skills/workflow/ralph)             | 2           | 自主迭代循环（PRD 驱动、跨会话记忆）        |
| [OpenSpec](/skills/workflow/openspec)       | 6           | 规格驱动开发（先定义规格再写代码）          |

## 文档与上下文

| 页面                                      | 说明                           |
| ----------------------------------------- | ------------------------------ |
| [Context7](/skills/docs-context/context7) | 实时文档注入 + Skills 管理 CLI |

## 代码智能

为 Claude Code 提供超越文本搜索的代码理解能力——符号级操作、知识图谱、架构分析：

| 页面                                       | 定位                                                |
| ------------------------------------------ | --------------------------------------------------- |
| [Serena](/skills/code-intelligence/serena) | IDE 级语义操作（LSP/JetBrains）——精确重构、符号编辑 |

## 按场景选择

| 场景                                 | 推荐                                            |
| ------------------------------------ | ----------------------------------------------- |
| 想创建团队专属 Skills                | [自定义技能](/skills/overview/custom-skills)    |
| 想发现和安装社区 Skills              | [技能市场](/skills/overview/skills-marketplace) |
| 想用 TDD 和结构化方法开发            | [Superpowers](/skills/workflow/superpowers)     |
| 想模拟完整工程团队工作流             | [Gstack](/skills/workflow/gstack)               |
| 想让 AI 自主完成大型功能             | [Ralph](/skills/workflow/ralph)                 |
| 想先定义规格再写代码                 | [OpenSpec](/skills/workflow/openspec)           |
| 想让 Claude Code 使用最新库文档      | [Context7](/skills/docs-context/context7)       |
| 想优化 React 项目性能                | [React 生态 Skills](/skills/frontend/react)     |
| 想用 Vue 3 最佳实践开发              | [Vue 生态 Skills](/skills/frontend/vue)         |
| 想设计高品质前端界面                 | [前端通用 Skills](/skills/frontend/frontend)    |
| 想让 Claude Code 像 IDE 一样精确重构 | [Serena](/skills/code-intelligence/serena)      |

## 前端框架 Skills

针对 React、Vue 等前端框架的推荐 Skills：

| 页面                                         | Skills 数量 | 定位                                        |
| -------------------------------------------- | ----------- | ------------------------------------------- |
| [React 生态 Skills](/skills/frontend/react)  | 3           | React 性能优化、组件组合、shadcn/ui         |
| [Vue 生态 Skills](/skills/frontend/vue)      | 6           | Vue 3 全链路（Pinia、Vite、VueUse、Router） |
| [前端通用 Skills](/skills/frontend/frontend) | 4           | 跨框架 UI 设计、Web 规范、UnJS 工具链       |

## 工具组合建议

以下 Skills 可以互补使用：

```
Superpowers（TDD + 头脑风暴）  →  Gstack（QA + 审查 + 发布）
OpenSpec（规格定义）  →  Ralph（自主实现）
自定义 Skills  →  CC-Switch（跨项目共享）
Serena（精确重构）  +  CodeGraph（代码探索）  +  Code Review Graph（审查分析）
```

:::tip
当多个工具共存时，使用 [AGENTS 全局路由协议](/guide/advanced/agents-routing) 定义分工。理解 SDD、OpenSpec、Spec-Kit、Superpowers 的关系？参考 [SDD 方法论与工具辨析](/guide/advanced/sdd-guide)。
:::
