---
title: TypeScript 工程 Skills
description: Matt Pocock 的 Claude Code Skills 集合——17 个技能覆盖需求拆解、Bug 诊断、架构改进、TDD、代码审查、PRD 生成等全流程 TypeScript 工程实践
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★☆☆☆    |
| 🧪 测试 | ★★★★☆  | ★★☆☆☆    |
| 📦 产品 | ★★★★☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握 Matt Pocock Skills 的使用，能独立用 Skills 做需求拆解、Bug 诊断、架构改进和 TDD 开发

**🚀 AI 能力提升：** 需求拆解、代码生成、重构审查
:::

# TypeScript 工程 Skills

[Matt Pocock Skills](https://github.com/mattpocock/skills) 是 TypeScript 生态知名讲师 Matt Pocock 为 Claude Code 打造的 Skills 集合。17 个技能覆盖从需求到交付的完整工程链路：需求拆解、领域建模、架构改进、TDD、代码审查、Bug 诊断。

:::tip
本页属于[技能系统](/skills/)的一部分。更多 Skills 资源：[技能市场](/skills/overview/skills-marketplace) | [Superpowers](/skills/workflow/superpowers) | [Gstack](/skills/workflow/gstack)
:::

## 安装

```bash
npx skills@latest add mattpocock/skills
```

安装时选择 `/setup-matt-pocock-skills` 运行初始化向导——配置 Issue 追踪器（GitHub / Linear / 本地文件）、Triage 标签、文档保存位置。

## 工程技能

### 用户调用（`/` 命令）

| Skill                            | 说明                                                               |
| -------------------------------- | ------------------------------------------------------------------ |
| `/ask-matt`                      | 技能路由器——根据你的问题推荐合适的 Skill 或工作流                  |
| `/grill-with-docs`               | 密集提问，帮你构建项目领域模型、打磨术语，更新 `CONTEXT.md` 和 ADR |
| `/triage`                        | 用状态机驱动 Issue 分类流转                                        |
| `/improve-codebase-architecture` | 扫描架构改进机会，生成可视化 HTML 报告，选择一项深入讨论           |
| `/to-issues`                     | 把计划、规格、PRD 拆解成独立可认领的 Issue（垂直切片）             |
| `/to-prd`                        | 把当前对话内容转为 PRD，直接发布到 Issue 追踪器                    |

### 模型触发

这些 Skill 可由你手动调用，也可由 Claude 根据任务自动触发：

| Skill             | 说明                                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- |
| `prototype`       | 构建一次性原型验证设计决策——终端应用验证逻辑 / 单路由切换对比多个 UI 方案                                        |
| `diagnosing-bugs` | 规范化 Bug 诊断循环：复现 → 最小化 → 假设 → 插桩 → 修复 → 回归测试                                               |
| `research`        | 面向高可信一手资料做研究，保存带引用的 Markdown 结论到仓库                                                       |
| `tdd`             | 红-绿-重构循环的测试驱动开发，每次一个垂直切片                                                                   |
| `domain-modeling` | 打磨项目领域模型：用术语表压力测试、用边界场景验证、更新 `CONTEXT.md` 和 ADR                                     |
| `codebase-design` | 设计深层模块——大量行为封装在小型接口后，放在清晰的分层边界，通过接口可测试                                       |
| `code-review`     | 双轴 Diff 审查——**规范轴**（编码标准 + Fowler 坏味道）和 **规格轴**（忠实实现 Issue/PRD），并行两个子 Agent 执行 |

## 生产力技能

### 用户调用（`/` 命令）

| Skill                   | 说明                                                                     |
| ----------------------- | ------------------------------------------------------------------------ |
| `/grill-me`             | 对计划或设计进行无情追问，直到决策树的每个分支都被解决。适用于非代码场景 |
| `/handoff`              | 把当前对话压缩成交接文档，让另一个 Agent 可以继续工作                    |
| `/teach`                | 多会话教学——用当前目录作为有状态的教学工作区，教授新技能或概念           |
| `/writing-great-skills` | Skill 编写参考——让 Skill 行为可预测的词汇表和原则                        |

### 模型触发

| Skill      | 说明                                                             |
| ---------- | ---------------------------------------------------------------- |
| `grilling` | 可复用的追问循环引擎，`grill-me` 和 `grill-with-docs` 的底层实现 |

## 使用建议

- **每次想改东西先跑 `/grill-me`**，把模糊想法变成清晰决策
- 代码库质量下降时，**每隔几天跑一次 `/improve-codebase-architecture`** 做架构体检
- 收到新需求用 **`/to-issues`** 拆成独立 Issue，再**逐 Issue 触发 `tdd`** 实现
- 遇到难以定位的 Bug，触发 **`diagnosing-bugs`** 走规范化诊断流程
- 跨 Agent 协作时用 **`/handoff`** 生成交接文档，保证上下文不丢失

## 工具组合

```text
/to-issues（需求拆解）→  tdd / codebase-design（逐个实现）
/grill-me（设计澄清）→  /to-prd（发布 PRD）→  /to-issues（拆解任务）
diagnosing-bugs（定位）→  tdd（修复 + 回归）
code-review（审查）→  /improve-codebase-architecture（架构复盘）
```

结合本站其他 Skills 的典型工作流：

```text
/to-issues（拆解需求）→  Superpowers TDD（结构化实现）→  Gstack QA（质量验证）
/improve-codebase-architecture（架构分析）→  Serena（精确重构执行）
/grill-me（设计澄清）→  OpenSpec（规格定义）→  Ralph（自主实现）
```
