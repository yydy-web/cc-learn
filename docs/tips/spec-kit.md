---
title: Spec Kit + Claude Code — 规格驱动开发实战
description: GitHub 官方 Spec Kit（120K+ Stars）完整教程，从安装到上线用 6 步命令把自然语言需求变成可审查、可追溯的生产代码，适合个人项目和团队协作
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★☆☆☆    |
| 🧪 测试 | ★★★★★  | ★★☆☆☆    |
| 📦 产品 | ★★★★★  | ★☆☆☆☆    |

**🎯 学习产出：** 掌握 Spec Kit 完整 6 步工作流，能用自然语言写出可审查的规格文档，按阶段生成计划→任务→代码，独立完成从需求到上线的规格驱动开发闭环

**🚀 AI 能力提升：** 结构化思维、需求到代码可追溯
:::

# Spec Kit + Claude Code — 规格驱动开发实战

> 告别 Vibe Coding：先想清楚再写代码，每一步都可审查、可追溯。

## 概述

**Spec Kit**（`github/spec-kit`，120K+ GitHub Stars）是 GitHub 官方的规格驱动开发（Spec-Driven Development）工具包。核心理念：**不是对着 AI 描述需求让它一把梭——而是把需求先变成规格文档，再拆成计划、任务，最后才写代码**。

问题不在于 AI 不够聪明，而在于"你觉得说清楚了，AI 理解的是另一个东西"。Spec Kit 用一套强制性的 6 步流程，在写代码之前让你和 AI 对需求、架构、任务达成一致——每一步产生的文档存进 Git，随时回溯。

和 Superpowers 互补：Spec Kit 管"规格阶段"（文档、审查、Git 跟踪），Superpowers 管"实施阶段"（头脑风暴、TDD、审查）。个人项目用 Superpowers 就够了；需要跨团队审查、长期维护的规格，用 Spec Kit。

**核心数据**：120K+ Stars、6 个核心命令、25+ AI 代理支持、Git 跟踪全部产物。

## 核心理念：规格是活文档，不是一次性产物

```
Vibe Coding：
  你说需求 → AI 写代码 → 跑起来看 → 不对再改 → 反复循环

Spec Kit：
  /speckit.constitution  → 定原则（代码规范、测试要求）
       ↓
  /speckit.specify       → 写规格（改什么、为什么、怎么验收）
       ↓
  /speckit.clarify       → 澄清歧义（AI 追问你确认）
       ↓
  /speckit.plan          → 定方案（技术栈、架构、数据模型）
       ↓
  /speckit.tasks         → 拆任务（编号列表，带依赖和并行标记）
       ↓
  /speckit.implement     → 写代码（按任务逐个执行，完成打钩）
```

区别：**每一步产物都在 Git 里**。3 个月后回来看，你知道当时为什么做了这个决定。

## 安装

依赖 Python 3.11+、Git、uv：

```bash
# 安装 specify CLI
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# 验证安装
specify check
```

初始化项目：

```bash
# 全新项目 → 指定 Claude Code
specify init my-project --ai claude

# 在现有项目根目录初始化
specify init --here --ai claude

# 大型项目 → 在子目录初始化（上下文更精简）
cd services/user-service && specify init --here --ai claude
```

初始化后在 Claude Code 里就能看到 `/speckit.*` 开头的 9 个斜杠命令了。

## 命令速览

| 命令 | 类型 | 干什么 |
|------|------|--------|
| `/speckit.constitution` | 核心 | 定项目原则，所有后续步骤强制检查 |
| `/speckit.specify` | 核心 | 把需求写成结构化规格文档 |
| `/speckit.clarify` | 可选 | 规格有歧义时 AI 追问你澄清 |
| `/speckit.plan` | 核心 | 技术实现方案，含架构和数据模型 |
| `/speckit.tasks` | 核心 | 拆成编号任务清单 |
| `/speckit.analyze` | 可选 | 检查规格/计划/任务之间的一致性 |
| `/speckit.checklist` | 可选 | 实施前质量门禁 |
| `/speckit.taskstoissues` | 可选 | 任务转 GitHub Issues |
| `/speckit.implement` | 核心 | 按任务清单逐个写代码 |

**推荐顺序**：constitution → specify → clarify（有歧义时）→ plan → tasks → analyze（现有项目必跑）→ implement

---

## 完整案例：开发一个"团队代办事项看板"

下面用一个真实项目完整走一遍 6 步流程。

### 前置：初始化项目

```bash
mkdir team-kanban && cd team-kanban
specify init --here --ai claude
code .
```

### 第 1 步：定原则 — `/speckit.constitution`

在 Claude Code 里执行：

```
/speckit.constitution This is a full-stack web application.
Principles:
1. Test-first: every feature must have passing tests before implementation
2. Type safety: TypeScript strict mode, no `any` unless documented
3. Simple over clever: prefer plain functions over abstractions, plain CSS over CSS-in-JS
4. Accessible: all UI must pass WCAG 2.1 AA
5. Security: OWASP Top 10 compliance for all API endpoints
```

AI 会读取项目上下文，在 `.specify/memory/constitution.md` 生成结构化宪法文档，每条原则带说明和合规检查条件。

生成产物 → `.specify/memory/constitution.md`（约 2-3 KB）

> 保持 4-6 条真正不可妥协的原则。每条原则都会被 `/speckit.plan` 的合规门检查。

---

### 第 2 步：写规格 — `/speckit.specify`

用自然语言描述功能，**只说改什么和为什么，不讲技术实现**：

```
/speckit.specify Build a team task board where users can create tasks,
assign them to team members, and move them between columns (To Do, In Progress,
Done). Each task has a title, description, assignee, and due date. Users can
filter tasks by assignee and sort by due date. Changes are visible to all
team members in real time. The board remembers column order between sessions.
```

AI 会创建 Git 分支，在 `specs/<branch-name>/` 下生成 `spec.md`，包含：

**1. 用户场景与测试**（Given/When/Then 格式）：

```markdown
### User Story 1 - Create Task (Priority: P1)
As a team member, I want to create a new task so that work items are tracked.

**Acceptance Criteria:**
- Given the board is open, when I click "New Task", then a task form appears
- Given the form is filled, when I submit, then the task appears in the "To Do" column
- Given required fields are empty, when I submit, then validation errors are shown
```

**2. 功能需求**（编号的可测试陈述）：

```markdown
### Functional Requirements
- FR-001: System must allow creating tasks with title, description, assignee, due date
- FR-002: System must display tasks in three columns: To Do, In Progress, Done
- FR-003: System must allow dragging tasks between columns
- FR-004: System must persist column order across sessions
- FR-005: System must show real-time updates to all connected users
```

**3. 成功标准**（可衡量、技术无关）：

```markdown
### Success Criteria
- SC-001: Users can create a task and see it appear in under 1 second
- SC-002: Column reordering persists after page refresh
- SC-003: Real-time updates appear within 500ms on the same network
- SC-004: Board supports 500+ tasks without noticeable lag
```

如果描述有歧义，AI 会插入 `[NEEDS CLARIFICATION]` 标记：

```markdown
[NEEDS CLARIFICATION: Real-time sync mechanism]
- Option A: Optimistic updates (instant UI, background sync)
- Option B: Server-driven updates (slightly delayed, always consistent)
→ Impact: Affects perceived speed vs data consistency
```

生成产物 → `specs/<branch-name>/spec.md`（约 5-8 KB）

> 不要写框架名、数据库名、API 细节。一份好规格能在计划阶段用不同技术栈生成两套方案做对比。

---

### 第 3 步：澄清（可选）— `/speckit.clarify`

如果上一步有 `[NEEDS CLARIFICATION]` 标记，运行：

```
/speckit.clarify Focus on the real-time sync and data persistence questions
```

AI 会把每个歧义点转为结构化问题，你选选项或自己写回答。回答后 `spec.md` 原地更新：标记替换为已解决需求，版本号递增。

如果规格没有歧义标记，直接跳过这步。

---

### 第 4 步：定方案 — `/speckit.plan`

终于可以聊技术了。告诉 AI 你用什么技术栈：

```
/speckit.plan The project uses Next.js 14 with App Router, TypeScript strict mode,
Prisma ORM with SQLite (dev) / PostgreSQL (prod). Real-time sync via Server-Sent
Events (SSE). UI components from shadcn/ui. Drag and drop via @dnd-kit.
Authentication via NextAuth.js with GitHub OAuth. Testing with Vitest and
Playwright. Deploy on Vercel.
```

AI 读取 `spec.md`、检查是否合规，生成最多 5 个产物：

| 产物 | 内容 |
|------|------|
| `plan.md` | 主计划，含合规门控检查结果和分阶段概览 |
| `research.md` | 技术选型对比（SSE vs WebSocket、dnd-kit vs react-beautiful-dnd） |
| `data-model.md` | 实体定义：Task(id, title, description, status, assigneeId, dueDate, columnOrder, createdAt, updatedAt) |
| `contracts/` | API 路由规范：`POST /api/tasks`、`PATCH /api/tasks/:id/move`、`GET /api/tasks?assignee=&sort=` |
| `quickstart.md` | 关键验证场景清单 |

上一步的歧义在计划中得到解决：

```markdown
## Clarification Resolution
- Real-time sync: Chose Option A (Optimistic updates) — 
  UI updates instantly, SSE reconciles in background. 
  Rollback on conflict.
```

**审查要点**：执行下一章前检查两样东西：
- 合规门控全部打勾 `[x]`
- 各阶段依赖关系完整

生成产物 → `specs/<branch-name>/plan.md` + 4 个辅助文件（约 12-18 KB）

---

### 第 5 步：拆任务 — `/speckit.tasks`

无需参数：

```
/speckit.tasks
```

AI 读取 `plan.md` 和 `spec.md`，生成 `tasks.md`。任务按固定阶段排列：

```markdown
## Phase 1: Setup
- [x] T001 Create Next.js project with `create-next-app`, install dependencies
- [x] T002 [P] Configure TypeScript strict mode in tsconfig.json
- [x] T003 [P] Set up Prisma schema and initial migration
- [x] T004 [P] Configure NextAuth.js with GitHub provider

## Phase 2: Foundation
- [ ] T005 Define Task data model in prisma/schema.prisma
- [ ] T006 [P] Create shared UI components (Button, Input, Card) 
        → src/components/ui/
- [ ] T007 [P] Set up SSE endpoint at src/app/api/events/route.ts
- [ ] T008 Create board layout component → src/components/Board.tsx

## Phase 3: User Story 1 - Create Task (P1)
- [ ] T009 [P] [US1] Create task form component → src/components/TaskForm.tsx
- [ ] T010 [P] [US1] Implement POST /api/tasks route → src/app/api/tasks/route.ts
- [ ] T011 [US1] Write Vitest tests for task creation → src/__tests__/tasks.test.ts

## Phase 4: User Story 2 - Move Tasks (P1)
- [ ] T012 [P] [US2] Implement drag-and-drop columns → src/components/Board.tsx
- [ ] T013 [P] [US2] Implement PATCH /api/tasks/:id/move → src/app/api/tasks/[id]/move/route.ts
- [ ] T014 [US2] Write Playwright tests for drag-and-drop → e2e/task-move.spec.ts

## Phase 5: Real-time Sync (P1)
- [ ] T015 [P] [US3] Add SSE client hook → src/hooks/useRealtime.ts
- [ ] T016 [P] [US3] Broadcast task changes via SSE → src/app/api/events/route.ts
- [ ] T017 [US3] Write SSE integration tests → src/__tests__/realtime.test.ts

## Phase 6: Polish (P2)
- [ ] T018 [P] Add filter by assignee → src/components/TaskFilter.tsx
- [ ] T019 [P] Add sort by due date → src/components/TaskSort.tsx
- [ ] T020 [P] Accessibility audit and fixes across all components
- [ ] T021 [P] Loading and error states for all async operations
- [ ] T022 Run Lighthouse audit, ensure score ≥ 90
```

格式约定：
- `[P]` = 可并行（不碰同一个文件、无依赖）
- `[US1]` = 属于哪个 User Story
- 描述末尾写文件路径，告诉 AI 准确写在哪

**审查要点**：
- 每个功能需求都有对应任务？
- 任务归属阶段正确吗？
- 单个任务只改一个文件、一个关注点？

生成产物 → `specs/<branch-name>/tasks.md`（约 4-6 KB）

---

### 第 5.5 步：一致性检查（可选但推荐）— `/speckit.analyze`

```
/speckit.analyze
```

AI 交叉检查产物之间以及和仓库已有文件的一致性。对于**现有项目这步不是可选的**——它能捕获：
- 任务创建了已有文件
- 数据模型和已有类名冲突
- API 路由和已有路由重复

新项目一般不会出问题，但也建议跑一下。

---

### 第 6 步：写代码 — `/speckit.implement`

```
/speckit.implement
```

AI 按阶段顺序逐个执行任务：

1. 检查 `checklists/` 目录（如果有）
2. 加载全部上下文：`tasks.md`、`plan.md` 及辅助文件
3. 按阶段顺序执行，每完成一个任务 → `tasks.md` 中 `- [ ]` 变 `- [x]`

**错误处理**：
- 串行任务失败 → 停止，打印错误上下文，你修好再跑
- 并行任务 `[P]` 一个失败 → 不影响同组其他任务，阶段结束统一报告

**重新运行是安全的**：AI 会读取已有 `[x]` 标记，自动跳过已完成任务。你修好错误后直接 `/speckit.implement` 继续。

完成后输出汇总报告：实现的任务数、测试通过情况、是否匹配原始规格。

---

## 产物总览

整个工作流产生的全部文件：

```text
.specify/
├── memory/
│   └── constitution.md          ← 项目原则（2-3 KB）
├── templates/                   ← 模板文件
├── scripts/                     ← 辅助脚本（可选使用）
└── workflows/                   ← 工作流配置

specs/team-task-board/           ← 按功能分支命名
├── spec.md                      ← 需求规格（5-8 KB）
├── plan.md                      ← 技术方案（5-8 KB）
├── research.md                  ← 技术选型对比
├── data-model.md                ← 数据模型定义
├── quickstart.md                ← 验收场景清单
├── contracts/                   ← API/组件接口规范
├── tasks.md                     ← 任务清单（4-6 KB）
└── checklists/
    └── requirements.md          ← 质量检查清单
```

**全部是 Markdown，全部进 Git**。3 个月后回来能看懂当时每个决定为什么做。

---

## 和 Superpowers 怎么选、怎么组合

| 场景 | 用什么 |
|------|--------|
| 个人项目、快速迭代 | Superpowers 就够了 |
| 多团队成员审查规格 | Spec Kit |
| 需要规格文档长期存 Git | Spec Kit |
| 需要需求→代码完整可追溯 | Spec Kit |
| 想一步到位 | 不存在的 |

**组合方案**：用 Spec Kit 管规格阶段（`.specify/memory/` + `specs/` 进 Git 供跨团队审查），然后配置 Superpowers 的 `subagent-driven-development` 技能指向 Spec Kit 的计划文件——规格有审查记录，实施有自动化闭环。

```text
Spec Kit（规格阶段）             Superpowers（实施阶段）
constitution → specify           （GPT 审查计划）
     ↓                               ↓
   plan    →   task  ←  execute-plan（分批执行+TDD）
     ↓                               ↓
   tasks  →   审查   ←  /code-review（5维审查）
```

---

## 已知限制

- **现有项目可能被误建**：AI 可能在实现阶段把研究笔记当新需求，重复生成已有类。`/speckit.analyze` 能缓解但非绝对保证
- **中途改规格麻烦**：实现已跑了一半才发现规格要改，需要手动协调已生成代码和更新后的计划
- **小改动收益低**：中型功能的所有产物审查时间可能接近直接实现时间。改个按钮颜色就跑 6 步流程不值当
- **弱规格会传递**：模糊的规格产出模糊的计划，实现步骤无法恢复。规格越精确，实现越可靠

---

## 快速参考卡片

```text
安装：
  uv tool install specify-cli --from git+https://github.com/github/spec-kit.git
  specify init --here --ai claude

工作流（按顺序）：
  1. /speckit.constitution   "定原则：测试优先、类型安全、简洁至上…"
  2. /speckit.specify        "一个团队看板，支持创建/分配/拖拽任务…"
  3. /speckit.clarify        （规格有歧义时跑）
  4. /speckit.plan           "Next.js 14 + Prisma + shadcn/ui + SSE…"
  5. /speckit.tasks          （无参数，拆任务列表）
  6. /speckit.implement      （无参数，按任务逐个写代码）

新项目推荐全跑。小改动用 Superpowers。大功能、多协作者 → 全跑。
```
