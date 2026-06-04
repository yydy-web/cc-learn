---
title: 技能系统
description: Claude Code 技能系统的完整指南——创建自定义 Skills、发现社区技能、使用专业开发工作流
---

# 技能系统

Skills（技能）是 Claude Code 的核心扩展机制，让你可以封装工作流程、注入领域知识、标准化团队最佳实践。本文按类型梳理了本站所有的 Skills 内容，帮助你快速找到需要的资源。

## 创建与管理

| 页面 | 说明 |
|------|------|
| [自定义技能](/skills/custom-skills) | 创建、编写和使用自定义 Skills |
| [技能市场](/skills/skills-marketplace) | 浏览和安装社区 Skills（skills.sh + CC-Switch） |

## 开发工作流

完整的开发方法论和工程团队模拟，将专业实践封装为可组合的 Skills：

| 页面 | Skills 数量 | 定位 |
|------|-------------|------|
| [Superpowers](/skills/superpowers) | 14 | 结构化开发方法论（TDD、头脑风暴、代码审查） |
| [Gstack](/skills/gstack) | 23+ | 虚拟工程团队（QA、安全、发布流程） |
| [Ralph](/skills/ralph) | 2 | 自主迭代循环（PRD 驱动、跨会话记忆） |
| [OpenSpec](/skills/openspec) | 6 | 规格驱动开发（先定义规格再写代码） |

## 文档与上下文

| 页面 | 说明 |
|------|------|
| [Context7](/skills/context7) | 实时文档注入 + Skills 管理 CLI |

## 按场景选择

| 场景 | 推荐 |
|------|------|
| 想创建团队专属 Skills | [自定义技能](/skills/custom-skills) |
| 想发现和安装社区 Skills | [技能市场](/skills/skills-marketplace) |
| 想用 TDD 和结构化方法开发 | [Superpowers](/skills/superpowers) |
| 想模拟完整工程团队工作流 | [Gstack](/skills/gstack) |
| 想让 AI 自主完成大型功能 | [Ralph](/skills/ralph) |
| 想先定义规格再写代码 | [OpenSpec](/skills/openspec) |
| 想让 Claude Code 使用最新库文档 | [Context7](/skills/context7) |

## 前端框架 Skills

针对 React、Vue 等前端框架的推荐 Skills，已整合在各框架的最佳实践页面中：

- [React 推荐 Skills](/tips/react-best-practices#推荐-react-skills) — `react-best-practices`、`composition-patterns`、`shadcn`
- [Vue 推荐 Skills](/tips/vue-best-practices#推荐-vue-skills) — `vue-best-practices`、`pinia`、`vueuse-functions` 等
- [前端通用推荐 Skills](/tips/frontend-best-practices#推荐-skills) — `frontend-design`、`web-design-guidelines`、`ui-ux-pro-max`

## 工具组合建议

以下 Skills 可以互补使用：

```
Superpowers（TDD + 头脑风暴）  →  Gstack（QA + 审查 + 发布）
OpenSpec（规格定义）  →  Ralph（自主实现）
自定义 Skills  →  CC-Switch（跨项目共享）
```
