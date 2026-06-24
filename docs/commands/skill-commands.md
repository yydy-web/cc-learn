---
title: 技能命令
description: Claude Code 第三方技能生态系统的命令参考，涵盖 Superpowers、Gstack、OpenSpec、Spec-Kit 等
---

# 技能命令

除了 Claude Code [内置命令](/commands/slash-commands)，还可以通过插件安装第三方技能生态系统。以下列出主要技能包及其核心命令，详细用法请参阅对应的技能文档。

## Superpowers — 现代软件工程最佳实践

Superpowers 的 14 个 Skills 按照开发 Pipeline 的阶段组织，形成严格的接力关系：

### 入口与设计

| 命令                              | 说明                                             |
| :-------------------------------- | :----------------------------------------------- |
| `/superpowers:using-superpowers`  | 引导 Skill，自动加载，Superpowers 使用指南       |
| `/superpowers:brainstorming`      | 结构化需求探索和设计讨论（硬门控：设计未确认前禁止编码） |

### 规划

| 命令                              | 说明                                             |
| :-------------------------------- | :----------------------------------------------- |
| `/superpowers:writing-plans`      | 编写详细的实现计划文档，拆分为 2-5 分钟的小任务 |

### 工作区管理

| 命令                              | 说明                                             |
| :-------------------------------- | :----------------------------------------------- |
| `/superpowers:using-git-worktrees`| 使用 git worktree 隔离工作，创建独立开发分支     |

### 执行

| 命令                                          | 说明                                             |
| :-------------------------------------------- | :----------------------------------------------- |
| `/superpowers:executing-plans`                | 按计划逐任务执行实现                             |
| `/superpowers:subagent-driven-development`    | 每个任务分配独立子代理执行（推荐，两阶段审查）   |
| `/superpowers:dispatching-parallel-agents`    | 并行调度多个代理处理独立任务                     |

### 实现与测试

| 命令                              | 说明                                             |
| :-------------------------------- | :----------------------------------------------- |
| `/superpowers:test-driven-development` | 测试驱动开发，强制 RED-GREEN-REFACTOR 循环     |

### 调试

| 命令                              | 说明                                             |
| :-------------------------------- | :----------------------------------------------- |
| `/superpowers:systematic-debugging`| 四阶段系统化调试流程（复现→根因→修复→防护）     |

### 审查

| 命令                              | 说明                                             |
| :-------------------------------- | :----------------------------------------------- |
| `/superpowers:requesting-code-review` | 请求代码审查，对照计划检查代码                 |
| `/superpowers:receiving-code-review`  | 处理代码审查反馈，鼓励挑战不合理建议           |

### 验证与收尾

| 命令                                          | 说明                                             |
| :-------------------------------------------- | :----------------------------------------------- |
| `/superpowers:verification-before-completion` | 完成前验证所有工作正确性（需提供新鲜证据）       |
| `/superpowers:finishing-a-development-branch` | 完成开发分支的收尾工作（合并/PR/保留/丢弃）      |

### 元技能

| 命令                              | 说明                                             |
| :-------------------------------- | :----------------------------------------------- |
| `/superpowers:writing-skills`     | 基于 TDD 方法论创建新的技能文件                   |

详细文档参见 [Superpowers 技能](/guide/advanced/superpowers)

## Gstack — 高速创业工程工作流

| 命令                                                                                   | 说明                           |
| :------------------------------------------------------------------------------------- | :----------------------------- |
| `/spec`                                                                                | 启动规格定义流程，生成 SPEC.md |
| `/plan-ceo-review` / `/plan-eng-review` / `/plan-design-review` / `/plan-devex-review` | 多视角计划审查                 |
| `/autoplan`                                                                            | 自动规划执行                   |
| `/review` / `/investigate`                                                             | 代码审查和问题调查             |
| `/qa` / `/qa-only`                                                                     | 质量保证测试                   |
| `/ship` / `/land-and-deploy` / `/canary`                                               | 发布和部署流程                 |
| `/codex`                                                                               | 使用 Codex 工具执行任务        |
| `/retro`                                                                               | 项目回顾分析                   |
| `/context-save` / `/context-restore`                                                   | 上下文保存和恢复               |
| `/gstack-upgrade`                                                                      | 升级 Gstack 技能包             |

详细文档参见 [Gstack 技能](/skills/workflow/gstack)

## OpenSpec — 规格驱动开发

| 命令                                   | 说明                 |
| :------------------------------------- | :------------------- |
| `/opsx:propose`                        | 提出新变更提案       |
| `/opsx:apply`                          | 应用规格变更         |
| `/opsx:explore`                        | 探索代码库           |
| `/opsx:verify`                         | 验证实现是否符合规格 |
| `/opsx:new` / `/opsx:continue`         | 创建或继续规格文档   |
| `/opsx:archive` / `/opsx:bulk-archive` | 归档已完成的规格     |

详细文档参见 [OpenSpec 技能](/skills/workflow/openspec)

## Spec-Kit — 结构化开发工具包

| 命令                    | 说明                             |
| :---------------------- | :------------------------------- |
| `/speckit.constitution` | 定义项目宪法（核心约束和价值观） |
| `/speckit.specify`      | 编写功能规格                     |
| `/speckit.clarify`      | 澄清规格中的模糊点               |
| `/speckit.plan`         | 从规格生成实现计划               |
| `/speckit.tasks`        | 从计划生成任务列表               |
| `/speckit.implement`    | 按任务列表执行实现               |
| `/speckit.analyze`      | 分析规格和实现的差距             |

详细文档参见 [Spec-Kit 技能](/guide/advanced/sdd/spec-kit)

## Ralph — PRD 驱动开发

| 命令     | 说明                                |
| :------- | :---------------------------------- |
| `/prd`   | 从 PRD 文档生成结构化规格和任务计划 |
| `/ralph` | Ralph 助手，提供开发工作流指导      |

详细文档参见 [Ralph 技能](/guide/advanced/ralph)

## 其他技能

| 命令             | 来源          | 说明                     |
| :--------------- | :------------ | :----------------------- |
| `/context7:docs` | Context7 插件 | 查询第三方库的最新文档   |
| `/graphify`      | Graphify      | 代码知识图谱分析和查询   |
| `/serena`        | Serena        | 语言服务器驱动的代码智能 |

详细文档参见各自技能页面：

- [Context7](/guide/advanced/context7)
- [Graphify](/guide/advanced/code-graph/graphify)
- [Serena](/guide/advanced/serena)

## 下一步

- [斜杠命令](/commands/slash-commands) — 所有内置斜杠命令和捆绑技能
- [CLI 参考](/commands/cli-reference) — CLI 子命令和启动参数
- [技能概览](/skills/) — 所有技能生态系统文档
