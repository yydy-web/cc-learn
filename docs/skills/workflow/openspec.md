---
title: OpenSpec 规格驱动开发
description: OpenSpec 的规格驱动模式——Propose → Apply → Archive，先定义规格再写代码
---

# OpenSpec 规格驱动开发

[OpenSpec](/guide/advanced/sdd/openspec) 是一个规格驱动开发框架，解决了一个核心问题：**当需求只存在于聊天记录中时，AI 的输出是不可预测的**。它让人和 AI 在写代码之前先"对齐要构建什么"。

:::tip
本页属于[技能系统](/skills/)的一部分。安装配置和 CLI 命令详情请参考 [OpenSpec 规格驱动开发](/guide/advanced/sdd/openspec)。
:::

## 核心理念

```
Propose → Apply → Archive
  提案   →  实现  →  归档
```

每个变更都有独立的文件夹，包含四个核心制品：

| 制品 | 文件          | 用途                 |
| ---- | ------------- | -------------------- |
| 提案 | `proposal.md` | 做什么、为什么做     |
| 规格 | `specs/`      | 新增/修改/删除的需求 |
| 设计 | `design.md`   | 技术架构和决策       |
| 任务 | `tasks.md`    | 实现清单（带复选框） |

## 核心命令

| 命令            | 用途                   |
| --------------- | ---------------------- |
| `/opsx:propose` | 创建变更提案           |
| `/opsx:apply`   | 按任务清单实现         |
| `/opsx:archive` | 归档变更到主规格       |
| `/opsx:explore` | 探索模式（不生成文件） |

## 与 Superpowers 的桥接

OpenSpec 社区提供了 `superpowers-bridge` Schema，将 [Superpowers](/skills/workflow/superpowers) 的 Skills 桥接到 OpenSpec 工作流中：

```
Superpowers 的头脑风暴、TDD、代码审查 → 桥接到 OpenSpec 的规格驱动流程
```

## 安装

```bash
npm install -g @fission-ai/openspec@latest
cd your-project && openspec init
```

也可通过 [CC-Switch](/skills/overview/skills-marketplace) 市场发现 OpenSpec 的独立 Skills。

## 与其他 Skills 的关系

| 工具                                        | 核心理念                     | 适合场景                 |
| ------------------------------------------- | ---------------------------- | ------------------------ |
| **OpenSpec**                                | **规格驱动——先定义"做什么"** | **需求复杂、需要文档化** |
| [Superpowers](/skills/workflow/superpowers) | 方法论驱动——先设计"怎么做"   | 开发过程需要纪律         |
| [Ralph](/skills/workflow/ralph)             | 自主循环——自动执行           | 大型功能、放手让它跑     |
| [Gstack](/skills/workflow/gstack)           | 工程团队模拟                 | QA、安全、浏览器测试     |

## 下一步

- [OpenSpec 规格驱动开发（完整文档）](/guide/advanced/sdd/openspec) — 安装、配置和 CLI 命令
- [技能使用指南](/skills/overview/skill-usage-guidelines) — 如何正确使用 Skills
- [Ralph 自主循环](/skills/workflow/ralph) — 互补的自主实现方案
- [Superpowers 技能生态](/skills/workflow/superpowers) — 桥接到结构化方法论
