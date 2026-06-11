---
title: 任务中断与恢复
description: AI 编程中的任务中断恢复策略——三层持久化、上下文优化和中断恢复操作手册
---

# 任务中断与恢复

AI 编程中最大的挑战之一是任务中断和上下文丢失。本文档介绍如何通过三层持久化、上下文优化和中断恢复策略来应对这一问题。

## 问题本质

```text
┌──────────────────────────────────────────────┐
│           AI 的上下文窗口 (有限)              │
│                                                │
│  对话开始 ───────────────────── 对话结束/中断  │
│  记住一切           逐渐遗忘        全部丢失   │
└──────────────────────────────────────────────┘
```

AI 有两个致命限制：

1. **上下文窗口有限** — 长对话后期忘记前面内容
2. **会话不持久** — 关窗口 / 新对话 = 一切归零

## 解决方案：三层持久化

```text
┌─────────────────────────────────────────────┐
│ 第 1 层：项目级永久记忆                       │
│                                               │
│ openspec/config.yaml                          │
│ ├── 技术栈、代码约定                          │
│ ├── 每次新对话 AI 自动读取                    │
│ └── 相当于"置顶备忘录"                        │
│                                               │
│ CLAUDE.md / .cursor/rules/                    │
│ └── IDE 自动注入的项目规则                    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 第 2 层：功能级需求记忆                       │
│                                               │
│ openspec/changes/<name>/                      │
│ ├── proposal.md  → "这个功能是干嘛的"         │
│ ├── design.md    → "代码怎么组织"             │
│ └── tasks.md     → "做到哪了" (checkbox)      │
│                                               │
│ docs/superpowers/specs/<design>.md            │
│ └── Brainstorming 产出的设计文档              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ 第 3 层：代码级状态记忆                       │
│                                               │
│ git worktree + branch                         │
│ ├── 分支名就是功能名                          │
│ ├── commit 历史就是实现进度                   │
│ └── worktree 路径就是工作区位置               │
└─────────────────────────────────────────────┘
```

## 中断恢复操作手册

### 场景 1：对话中途中断（关闭窗口 / 网络断开）

**恢复方式：** 新开对话，一句话搞定

```text
> /opsx:apply
```

AI 自动执行的恢复链：

1. `openspec list` → 找到活跃变更
2. 读 `proposal.md` → 恢复"做什么"
3. 读 `design.md` → 恢复"怎么做"
4. 读 `tasks.md` → 扫描 checkbox，定位到第一个 `- [ ]`
5. 从断点继续实现

### 场景 2：跨天开发（每天做一点）

完全相同，每天开工直接：

```text
> /opsx:apply supplier-review
```

### 场景 3：长对话上下文不够了（AI 开始"犯糊涂"）

**症状：** AI 忘记了之前的约定，代码风格不一致，重复问已回答过的问题

**解决方式：** 不要在旧对话中挣扎，直接新开对话

```text
> /opsx:apply supplier-review
```

新对话有全新的上下文窗口，从磁盘读取制品文件，比继续在被污染的旧对话中好。

### 场景 4：Subagent 执行到一半中断

Subagent 每完成一个 task 就在 `tasks.md` 中打勾并 commit。中断后：

```text
> /opsx:apply
```

主 Agent 读 `tasks.md`，跳过已完成的 `[x]`，从下一个 `[ ]` 继续派发 Subagent。

### 场景 5：需求变更（产品改了文档）

```text
> /opsx:explore supplier-review

产品说审核从一级改成两级，新流程截图如下：
[拖入新截图]

评估对 design.md 和 tasks.md 的影响。
```

确认后手动或让 AI 更新制品文件，再 `/opsx:apply` 继续。

## 上下文优化策略

### 策略 1：Subagent 隔离（Superpowers 核心能力）

```text
主 Agent                    Subagent 1           Subagent 2
  │                             │                     │
  │ 只保留协调信息              │ 全新上下文           │ 全新上下文
  │ (tasks列表+当前进度)        │ (Task 1完整描述      │ (Task 2完整描述
  │                             │  + design.md片段)    │  + design.md片段)
  │                             │                     │
  │ 上下文消耗：极小            │ 上下文消耗：中等     │ 上下文消耗：中等
```

**核心原理：** 主 Agent 把任务的完整描述"打包"给 Subagent，Subagent 用全新上下文执行。执行完毕后 Subagent 的上下文被释放，不会污染主 Agent。

### 策略 2：制品文件 ＞ 对话记忆

| 方式                | 上下文消耗           | 可靠性           | 可恢复 |
| ------------------- | -------------------- | ---------------- | ------ |
| "之前我们讨论过..." | 高（需回溯对话历史） | 低（可能遗忘）   | 否     |
| 读 design.md        | 低（只读一个文件）   | 高（磁盘持久化） | 是     |

**实践建议：** 当你在对话中做了重要决策，但还没到 propose 阶段时，让 AI 立刻写入文件：

```text
把刚才讨论的结论写入 openspec/changes/supplier-review/notes.md
```

### 策略 3：config.yaml 是跨会话记忆

```yaml
# openspec/config.yaml
context: |
  这里的内容，每次新对话 AI 都会读到。
  等于给 AI 的"永久记忆"。
```

适合写入：

- 技术栈版本号
- 代码约定（命名、目录结构、import 顺序）
- 团队特有术语
- 常见的坑（"Ant Design 的 Table 组件在 xx 情况下需要 yy"）

## 实战走查：一条完整链路

以下以"供应商审核"为例，演示从零到上线的每一步。每步标注：你输入什么 → AI 内部做了什么 → 磁盘上产生/变化了哪些文件。

### Step 0: 前置状态

```text
d:\work\srm-frontend\
├── openspec/
│   └── config.yaml               ← 已存在，项目级上下文
├── apps/admin-portal/src/
│   ├── app/router.tsx             ← 已有路由定义
│   └── features/                  ← 功能域目录
└── ...
```

### Step 1: 需求梳理（可选）

**你输入：**

```text
> /opsx:explore

产品给了「供应商审核」的原型截图和字段文档：
[拖入截图]
[粘贴字段表]
```

**AI 内部动作：**

1. 读取 `openspec/config.yaml` 获取项目上下文
2. 分析截图，提取页面结构、字段、按钮、状态流转
3. 以对话形式输出理解，提问澄清

**磁盘变化：** 无（explore 是只读模式）

**产出：** 对话中形成的共识（页面结构、数据模型、业务规则）

### Step 2: 生成结构化制品

**你输入：**

```text
> /opsx:propose supplier-review

开发 admin-portal 的「供应商审核」模块。
包含：审核列表页（分页、筛选、批量操作）+ 审核详情页（审核表单、审批流）。
[截图 + 字段说明 + 业务规则]
```

**AI 内部动作：**

1. 读取 SKILL 文件 `.codex/skills/openspec-propose/SKILL.md`
2. 读取 `openspec/config.yaml` 中的 rules（proposal / design / tasks 的约定）
3. 扫描现有代码结构，了解项目约定
4. 一次性生成三个制品文件

**磁盘变化（新增 3 个文件）：**

```diff
+ openspec/changes/supplier-review/
+   ├── proposal.md       ← 功能概述、范围、能力列表
+   ├── design.md         ← 文件结构、组件拆分、接口设计、状态管理
+   └── tasks.md          ← 实现任务清单（checkbox 格式）
```

**生成的 `tasks.md` 示例：**

```markdown
# Tasks: supplier-review

## Implementation Tasks

- [ ] Task 1: 注册路由和菜单项
      在 router.tsx 的 portalMenuTree 中添加「供应商审核」菜单...
- [ ] Task 2: 封装 API hooks
      创建 hooks/useSupplierReviews.ts，包含列表查询和审核操作...
- [ ] Task 3: 实现审核列表页
      创建 SupplierReviewListPage.tsx，包含 Table + 筛选条件...
- [ ] Task 4: 实现审核详情页
      创建 SupplierReviewDetailPage.tsx，包含审核表单...
- [ ] Task 5: 单元测试
      为列表页和详情页编写 React Testing Library 测试...
- [ ] Task 6: TypeScript 类型检查
      运行 pnpm exec tsc --noEmit 确保无类型错误...
```

### Step 3: 生成精细实现计划（Superpowers writing-plans）

**你输入：**

```text
请根据 openspec/changes/supplier-review/ 的制品，
用 writing-plans 生成实现计划。
```

**AI 内部动作：**

1. 读取 SKILL 文件 `skills/superpowers/writing-plans/SKILL.md`
2. 读取 `proposal.md` + `design.md` + `tasks.md`
3. 将每个 task 拆成 2-5 分钟粒度的步骤，包含具体代码块

**磁盘变化（新增 1 个文件）：**

```diff
+ docs/superpowers/plans/2026-04-16-supplier-review.md
```

**生成的 plan 文件结构：**

```markdown
# Implementation Plan: supplier-review

## Task 1: 注册路由和菜单项

### Step 1.1: 添加菜单项到 portalMenuTree (2 min)

**File:** `apps/admin-portal/src/app/router.tsx`
**Action:** 在 portalMenuTree 的「供应商」children 中添加：
​`tsx
{
  path: 'supplier-review',
  title: '供应商审核',
  icon: <AuditOutlined />,
  children: [
    { path: 'supplier-review/list', title: '审核列表', icon: <UnorderedListOutlined /> },
    { path: 'supplier-review/detail/:id', title: '审核详情', icon: <FileSearchOutlined /> },
  ],
}
​`
**Verify:** `pnpm exec tsc --noEmit -p apps/admin-portal/tsconfig.app.json`
**Commit:** `feat(supplier-review): register routes and menu items`

### Step 1.2: 创建功能域目录 (1 min)

**Action:** 创建目录结构
​`
src/features/supplier-review/
├── index.ts
├── components/
└── hooks/
​`
...

## Task 2: 封装 API hooks

### Step 2.1: ...
```

### Step 4: 创建隔离工作区（Superpowers git-worktree）

**你输入：**

```text
用 subagent-driven-development 执行计划
```

**AI 内部动作（自动触发 using-git-worktrees）：**

1. `git worktree add .worktrees/supplier-review -b feature/supplier-review`
2. `cd .worktrees/supplier-review && pnpm install`
3. 运行测试基线验证

**磁盘变化：**

```diff
+ .worktrees/supplier-review/          ← 完整项目副本，独立工作区
  （git branch: feature/supplier-review）
```

### Step 5: Subagent 逐任务执行

**AI 内部动作（subagent-driven-dev 自动循环）：**

```text
主 Agent（协调者）
  │
  │ 读 plan 文件，提取 Task 1 的所有 Steps
  │
  ├─── 派发 Subagent 1 ─────────────────────────────────────────┐
  │    提示词包含:                                                │
  │    - Task 1 的完整描述 + 所有 Steps                          │
  │    - design.md 中相关片段                                    │
  │    - 项目约定 (从 config.yaml)                               │
  │                                                              │
  │    Subagent 执行:                                            │
  │    1. 创建 src/features/supplier-review/ 目录                │
  │    2. 写 router.tsx 菜单项                                   │
  │    3. 运行 tsc --noEmit 验证                                 │
  │    4. git commit                                             │
  │    └─ 返回: "Task 1 完成，创建了 3 个文件，tsc 通过"         │
  │                                                              │
  ├─── 派发 Spec Reviewer ──────────────────────────────────────┐
  │    提示词: 检查 Task 1 实现是否符合 design.md                │
  │    └─ 返回: "✓ 路由结构符合设计，菜单层级正确"               │
  │                                                              │
  ├─── 派发 Code Reviewer ──────────────────────────────────────┐
  │    提示词: 检查代码质量和项目约定                             │
  │    └─ 返回: "✓ 通过，建议：icon import 可以统一到一个文件"   │
  │                                                              │
  ├─── tasks.md / plan.md 中 Task 1 打勾 [x]                    │
  │                                                              │
  ├─── 派发 Subagent 2 → Task 2: API hooks ...                  │
  │    ...同样的 实现 → spec review → code review 循环           │
  │                                                              │
  ├─── 派发 Subagent 3 → Task 3: 列表页面 ...                   │
  ├─── 派发 Subagent 4 → Task 4: 详情页面 ...                   │
  ├─── 派发 Subagent 5 → Task 5: 单元测试 ...                   │
  ├─── 派发 Subagent 6 → Task 6: tsc --noEmit ...               │
  │                                                              │
  └─── 全部 [x] → 报告完成                                      │
```

**每个 Subagent 完成后的磁盘变化：**

```diff
# Task 1 完成后
+ apps/admin-portal/src/features/supplier-review/index.ts
~ apps/admin-portal/src/app/router.tsx                  ← 修改（加菜单项）
~ openspec/changes/supplier-review/tasks.md             ← Task 1 打勾 [x]

# Task 2 完成后
+ apps/admin-portal/src/features/supplier-review/hooks/useSupplierReviews.ts
+ apps/admin-portal/src/features/supplier-review/hooks/useSupplierReviewDetail.ts
~ openspec/changes/supplier-review/tasks.md             ← Task 2 打勾 [x]

# Task 3 完成后
+ apps/admin-portal/src/features/supplier-review/SupplierReviewListPage.tsx
+ apps/admin-portal/src/features/supplier-review/components/ReviewFilters.tsx
+ apps/admin-portal/src/features/supplier-review/components/ReviewTable.tsx
~ openspec/changes/supplier-review/tasks.md             ← Task 3 打勾 [x]

# Task 4 完成后
+ apps/admin-portal/src/features/supplier-review/SupplierReviewDetailPage.tsx
+ apps/admin-portal/src/features/supplier-review/components/ReviewForm.tsx
+ apps/admin-portal/src/features/supplier-review/components/ApprovalFlow.tsx
~ openspec/changes/supplier-review/tasks.md             ← Task 4 打勾 [x]

# Task 5 完成后
+ apps/admin-portal/src/features/supplier-review/SupplierReviewListPage.test.tsx
+ apps/admin-portal/src/features/supplier-review/SupplierReviewDetailPage.test.tsx
~ openspec/changes/supplier-review/tasks.md             ← Task 5 打勾 [x]

# Task 6 完成后（无新文件，只跑检查）
~ openspec/changes/supplier-review/tasks.md             ← Task 6 打勾 [x]
```

**git 历史（在 feature/supplier-review 分支上）：**

```text
* feat(supplier-review): pass tsc --noEmit type check
* test(supplier-review): add unit tests for list and detail pages
* feat(supplier-review): implement review detail page with approval flow
* feat(supplier-review): implement review list page with filters
* feat(supplier-review): add API hooks with TanStack Query
* feat(supplier-review): register routes and menu items
```

### Step 6: 验证

**你输入：**

```text
> /opsx:verify supplier-review
```

**AI 内部动作：**

1. 读取 SKILL 文件 `.codex/skills/openspec-verify-change/SKILL.md`
2. 对比三个维度：
   - **完整性**：tasks.md 全部 `[x]` ✓
   - **正确性**：代码能编译、测试通过 ✓
   - **一致性**：实现与 design.md 一致 ✓
3. 输出验证报告

**磁盘变化：** 无（只读检查）

### Step 7: 收尾

**你输入：**

```text
实现完成，准备收尾
```

**AI 内部动作（finishing-a-development-branch）：**

1. 运行 `pnpm test` 全量测试
2. 运行 `pnpm lint` 代码检查
3. 展示四个选项让你选择：
   - `[1] 合并到 main`
   - `[2] 创建 PR`
   - `[3] 保留分支`
   - `[4] 丢弃`

**假设选择 `[2] 创建 PR`：**

```bash
git push -u origin feature/supplier-review
gh pr create --title "feat: 供应商审核模块" --body "..."
```

**磁盘变化：**

```diff
- .worktrees/supplier-review/       ← worktree 清理
```

### Step 8: 归档

**你输入：**

```text
> /opsx:archive supplier-review
```

**AI 内部动作：**

1. 读取 SKILL 文件 `.codex/skills/openspec-archive-change/SKILL.md`
2. 将 `openspec/changes/supplier-review/` 下的制品归档
3. 如有 delta spec，合并到主 spec

**磁盘变化：**

```diff
- openspec/changes/supplier-review/     ← 整个目录归档/移除
+ openspec/specs/supplier-review/       ← 主 spec 更新（如有）
```

## 完整链路文件时间线总览

| 操作                  | 新增文件                                                                                                                               | 修改文件                       |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| Step 1: explore       | (无)                                                                                                                                   | (无)                           |
| Step 2: propose       | openspec/changes/supplier-review/ proposal.md, design.md, tasks.md                                                                     | (无)                           |
| Step 3: writing-plans | docs/superpowers/plans/ 2026-04-16-supplier-review.md                                                                                  | (无)                           |
| Step 4: git-worktree  | .worktrees/supplier-review/ (完整副本)                                                                                                 | (无)                           |
| Step 5: subagent 执行 | src/features/supplier-review/ index.ts SupplierReviewListPage.tsx SupplierReviewDetailPage.tsx _.test.tsx components/_.tsx hooks/\*.ts | router.tsx tasks.md (逐个打勾) |
| Step 6: verify        | (无)                                                                                                                                   | (无)                           |
| Step 7: finishing     | (无)                                                                                                                                   | worktree 清理                  |
| Step 8: archive       | openspec/specs/ (如有)                                                                                                                 | openspec/changes/ 移除         |

## 相关资源

- [OpenSpec + Superpowers 双层规划](/guide/advanced/sdd/openspec-superpowers) — 桥接配置详解
- [Superpowers 插件](/guide/advanced/superpowers) — 七步工作流详解
- [双框架踩坑指南](/guide/advanced/sdd/openspec-superpowers-pitfalls) — 7 个典型踩坑及规避方案
- [工作流故障排除](/guide/advanced/workflow-troubleshooting) — 通用故障诊断与修复
