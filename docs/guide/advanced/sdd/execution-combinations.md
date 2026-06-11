---
title: 执行组合策略
description: OpenSpec + Superpowers 的 5 种执行组合——从简单到复杂的全链路开发策略
---

# 执行组合策略

OpenSpec 和 Superpowers 可以组合成 5 种不同的执行策略，从简单的直接执行到完整的全链路开发。选择哪种组合取决于功能复杂度、质量要求和时间约束。

## 四个执行工具的定位

```text
需求拆解层                          执行层
                               ┌────────────────────────────┐
/opsx:apply ──────────────────►│  直接执行（内置简单模式）     │
  读 tasks.md                   │  逐 task 在当前会话实现      │
  逐 task 实现                  └────────────────────────────┘

                               ┌────────────────────────────┐
writing-plans ────────────────►│  生成精细计划文件             │
  把 task 拆成                  │  (每步 2-5 分钟粒度)         │
  2-5 分钟的步骤                └──────────┬─────────────────┘
                                           │
                                 ┌─────────┴──────────┐
                                 ▼                    ▼
                        executing-plans      subagent-driven-dev
                        (批量执行+检查点)    (每 task 派子代理+双审)
```

## 组合 1：`/opsx:apply`（单独使用）

**适合：** 小功能、占位页替换、简单 CRUD

```text
> /opsx:propose supplier-review
> /opsx:apply
```

AI 读 `tasks.md`，在当前对话中逐个实现，每完成一个打勾。

| 优点             | 缺点                           |
| ---------------- | ------------------------------ |
| 最快启动，零开销 | 长任务上下文膨胀，没有质量审查 |

**典型任务量：** 3-5 个 task，单次对话能搞定

## 组合 2：`/opsx:apply` + `subagent-driven-dev`

**适合：** 中等功能，需要质量保证

```text
> /opsx:propose material-library
> /opsx:apply                        ← AI 自动用 subagent 模式执行
```

主 Agent 读 `tasks.md`，每个 task 派一个全新 Subagent 实现，完成后再派 reviewer 审查：

```text
主 Agent（协调，上下文极小）
  │
  ├─ Subagent → Task 1: 注册路由    → Spec Review ✓ → Code Review ✓ → [x]
  ├─ Subagent → Task 2: API hooks   → Spec Review ✓ → Code Review ✓ → [x]
  ├─ Subagent → Task 3: 列表页面    → Spec Review ✗ → 修复 → 再审 ✓ → [x]
  └─ ...
```

| 优点                                           | 缺点                                        |
| ---------------------------------------------- | ------------------------------------------- |
| 每 task 全新上下文（不膨胀），双重审查保证质量 | 消耗更多 token（每 task = 实现 + 2 次审查） |

**典型任务量：** 5-15 个 task，跨 1-3 天

## 组合 3：`writing-plans` + `executing-plans`

**适合：** 需要极其精细控制的功能，或要交给别人/别的 AI 执行

先生成精细计划：

```text
我要实现供应商审核模块，设计文档在 openspec/changes/supplier-review/design.md，
请用 writing-plans 生成实现计划。
```

产出 `docs/superpowers/plans/2026-04-16-supplier-review.md`，每个步骤精确到：

- 具体文件路径和完整代码块
- 运行命令 + 预期输出
- commit message

然后执行：

```text
按 docs/superpowers/plans/2026-04-16-supplier-review.md 执行
```

`executing-plans` 批量执行，到检查点暂停让你审核。

| 优点                           | 缺点                                               |
| ------------------------------ | -------------------------------------------------- |
| 计划可人工审核、可交接、可复用 | 生成计划本身消耗大量 token，计划可能因代码变化过时 |

**典型场景：** 团队协作、需要人工审批的关键模块

## 组合 4：`writing-plans` + `subagent-driven-dev`（最高质量）

**适合：** 大功能，质量要求高，需要全自动执行

```text
我要实现供应商审核模块，设计文档在 openspec/changes/supplier-review/design.md，
请用 writing-plans 生成实现计划，然后用 subagent-driven-development 执行。
```

```text
writing-plans 生成精细计划
  │
  ▼
subagent-driven-dev 执行
  │
  ├─ Subagent 实现 Step 1 (TDD: 写测试→红→实现→绿)
  ├─ Spec Reviewer 审查是否符合设计
  ├─ Code Reviewer 审查代码质量
  ├─ [x] Step 1 完成
  │
  ├─ Subagent 实现 Step 2 ...
  └─ ...
```

| 优点                                      | 缺点                                            |
| ----------------------------------------- | ----------------------------------------------- |
| 计划精确 + 执行隔离 + 双重审查 = 最高质量 | token 消耗最大（计划生成 + 每 task 三个 agent） |

**典型场景：** 核心业务模块、不允许返工的功能

## 组合 5：`/opsx:propose` + `writing-plans` + `subagent-driven-dev`（全链路）

**适合：** 从零开始的大模块，完整走一遍

```text
Phase 1: OpenSpec 生成需求制品
> /opsx:propose supplier-review + 截图/字段文档

Phase 2: Superpowers 生成精细计划
请根据 openspec/changes/supplier-review/ 的制品，
用 writing-plans 生成实现计划

Phase 3: Subagent 执行
用 subagent-driven-development 执行计划

Phase 4: 验证 + 收尾
> /opsx:verify supplier-review
> finishing-a-development-branch
> /opsx:archive supplier-review
```

## 选择决策树

```text
你要做多大的功能？
│
├─ 很小（改个按钮/加个字段）
│   └─ 不用 OpenSpec 也不用 Superpowers，直接写
│
├─ 小（1-3 个组件）
│   └─ /opsx:apply 单独用                          ← 组合 1
│
├─ 中（一个完整页面模块）
│   │
│   ├─ 赶时间？
│   │   └─ /opsx:apply + subagent                  ← 组合 2
│   │
│   └─ 要求高？
│       └─ writing-plans + subagent                ← 组合 4
│
├─ 大（多个页面/跨模块）
│   └─ /opsx:propose + writing-plans + subagent    ← 组合 5
│
└─ 需要交接给别人执行？
    └─ writing-plans + executing-plans             ← 组合 3
```

## 中断恢复对照

| 组合   | 进度保存位置        | 恢复方式                                 |
| ------ | ------------------- | ---------------------------------------- |
| 组合 1 | `tasks.md` checkbox | `/opsx:apply`                            |
| 组合 2 | `tasks.md` checkbox | `/opsx:apply`                            |
| 组合 3 | plan 文件 checkbox  | `继续执行 docs/superpowers/plans/xxx.md` |
| 组合 4 | plan 文件 checkbox  | `继续执行 docs/superpowers/plans/xxx.md` |
| 组合 5 | 两份 checkbox       | `/opsx:apply` 或 `继续执行 plan`         |

所有组合的进度都通过**磁盘上的 checkbox**持久化，新对话一句话恢复。

## FAQ

### Q: OpenSpec 和 Superpowers 的 brainstorming/writing-plans 功能重叠了吗？

有部分重叠，但侧重不同：

- **OpenSpec propose** 生成的 `tasks.md` 是按功能域拆分的粗粒度任务（每个 task ≈ 5-15 分钟）
- **Superpowers writing-plans** 生成的 plan 是每步 2-5 分钟的精细粒度（含完整代码块和命令）

推荐：用 OpenSpec 管需求到任务的拆解，用 Superpowers 管每个任务内部的 TDD 执行。两层粒度互补而非冲突。

### Q: 一定要用 Subagent 吗？

不一定。Subagent 的价值在于：

1. **隔离上下文** — 每个 task 用全新上下文，不被前面的对话污染
2. **双重审查** — spec reviewer + code reviewer 保证质量
3. **对抗遗忘** — 主 Agent 上下文消耗最小

如果功能很小（3 个以下 task），直接在当前对话执行即可（组合 1）。

### Q: writing-plans 生成的计划和 OpenSpec 的 tasks.md 有什么区别？

````text
tasks.md（OpenSpec）              plan.md（Superpowers）
┌──────────────────┐            ┌─────────────────────────────┐
│ - [ ] 注册路由    │            │ Step 1: 创建路由文件          │
│ - [ ] API hooks  │──细化──▶  │   创建 src/app/router.tsx     │
│ - [ ] 列表页面    │            │   添加以下代码：              │
│                  │            │   ```tsx                     │
│                  │            │   export const routes = ...  │
│                  │            │   ```                        │
│                  │            │   运行: pnpm exec tsc        │
│                  │            │   预期: 无错误                │
└──────────────────┘            └─────────────────────────────┘
粗粒度，描述"做什么"            精细粒度，描述"怎么做每一步"
````

**选择建议：**

- 只有 `tasks.md` 就够 → 组合 1 或 2
- 需要精确控制每一步 → 先 `writing-plans` 再执行 → 组合 3、4、5

### Q: `executing-plans` 和 `subagent-driven-dev` 怎么选？

| 特性       | executing-plans       | subagent-driven-dev     |
| ---------- | --------------------- | ----------------------- |
| 执行方式   | 批量执行 + 检查点暂停 | 每 task 单独 subagent   |
| 上下文管理 | 同一上下文累积        | 每 task 全新上下文      |
| 审查机制   | 检查点由人工审核      | 自动 spec + code review |
| token 消耗 | 中                    | 高                      |
| 适合场景   | 需要人工审批、交接    | 全自动、高质量要求      |

### Q: 中断后有些代码写了一半怎么办？

git 状态就是证据：

- 有 commit → task 已完成，tasks.md 应该已打勾
- 有未 commit 的改动 → task 做了一半，新对话中让 AI 检查 `git diff` 后继续

### Q: tasks.md 里的任务太粗/太细怎么办？

直接编辑文件。粒度标准：**每个 task 能在一次 AI 对话中完成**（约 5-15 分钟）。OpenSpec 不锁定制品格式，随时可修改。

### Q: 能不能混用组合？

可以。例如前 3 个简单 task 用组合 1 直接做，后面复杂的 task 切到组合 2 用 subagent。OpenSpec 的 `tasks.md` 是唯一进度源，无论哪种组合都通过 checkbox 同步进度。

## 相关资源

- [OpenSpec + Superpowers 双层规划](/guide/advanced/sdd/openspec-superpowers) — 桥接配置详解
- [任务中断与恢复](/guide/advanced/task-interruption-recovery) — 三层持久化和恢复策略
- [双框架踩坑指南](/guide/advanced/sdd/openspec-superpowers-pitfalls) — 7 个典型踩坑及规避方案
- [工作流故障排除](/guide/advanced/workflow-troubleshooting) — 通用故障诊断与修复
