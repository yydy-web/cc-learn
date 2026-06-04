---
title: Ralph 自主循环
description: Ralph 的自主迭代模式——PRD 驱动、新鲜上下文、跨会话记忆
---

# Ralph 自主循环

[Ralph](/guide/advanced/ralph) 是一个自主 AI Agent 循环工具，让 Claude Code 反复执行任务直到产品需求文档（PRD）中的所有用户故事完成。它解决了一个核心问题：**单次上下文窗口有限，无法一次性完成大型功能**。

:::tip
本页属于[技能系统](/skills/)的一部分。安装配置和调试技巧请参考 [Ralph 自主循环](/guide/advanced/ralph)。
:::

## 核心理念

```
新鲜上下文 + 持久化记忆 = 可靠的自主开发
```

每次迭代使用全新的 Claude Code 实例，记忆通过三个渠道传递：

| 渠道 | 作用 |
|------|------|
| **Git 历史** | 之前的代码变更和提交信息 |
| **progress.txt** | 学到的经验和常见问题 |
| **prd.json** | 哪些故事已完成，哪些待处理 |

## 两个 Skills

| Skill | 用途 |
|-------|------|
| `/prd` | 生成产品需求文档（PRD） |
| `/ralph` | 将 PRD 转换为 `prd.json` 结构化格式 |

## 工作流

```
/prd → /ralph → ralph.sh 循环 → 所有故事完成
```

1. 使用 `/prd` 生成 PRD
2. 使用 `/ralph` 转换为 `prd.json`
3. 运行 `./scripts/ralph/ralph.sh` 开始自主循环

## 安装

```
> /plugin marketplace add snarktank/ralph
> /plugin install ralph-skills@ralph-marketplace
```

也可通过 [CC-Switch](/skills/skills-marketplace) 市场发现 Ralph 的 Skills。

## 与其他 Skills 的关系

| 工具 | 侧重点 | 适合场景 |
|------|--------|----------|
| [Superpowers](/skills/superpowers) | 单次会话内的结构化方法论 | TDD、头脑风暴、审查 |
| [Gstack](/skills/gstack) | 交互式工程团队模拟 | 精细控制每个阶段 |
| **Ralph** | **跨迭代的自主循环** | **"放手让它跑"的自主模式** |
| [OpenSpec](/skills/openspec) | 规格文档管理 | 先定义规格再实现 |

:::tip
可以组合使用：用 OpenSpec 的 `/opsx:propose` 创建需求规格，再用 Ralph 的循环机制自动实现。
:::

## 下一步

- [Ralph 自主循环（完整文档）](/guide/advanced/ralph) — 安装、配置和调试技巧
- [OpenSpec 规格驱动开发](/skills/openspec) — 互补的规格驱动方法
- [自定义技能](/skills/custom-skills) — 创建自己的 Skills
