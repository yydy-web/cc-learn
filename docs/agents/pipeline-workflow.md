---
title: 流水线开发流程 — 设计→实现→测试接力
description: 用 pipeline() 实现 REST API 端点的完整开发流水线，Backend Agent 设计 API → Frontend Agent 实现组件 → Test Agent 写测试 → Review Agent 审查
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★☆  | ★★★★☆    |
| 📦 产品 | ★★☆☆☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握 `pipeline()` 流水线编排，能独立设计多阶段接力开发流程，理解 pipeline vs parallel 的选择逻辑

**🚀 AI 能力提升：** 流水线编排、阶段式开发
:::

## 场景概述

某 SaaS 团队需要快速交付一个"用户反馈提交"功能：用户在前端填写反馈表单并提交，管理员可以查看和变更反馈状态。这个需求横跨 API 设计、前端组件、自动化测试和代码审查四个阶段，每个阶段都依赖上一阶段的产物——API 接口没定，前端组件无法对接；实现没完成，测试用例无从写起。

如果用 `parallel()` 一把梭全部阶段并行执行，后端 Agent 和前端 Agent 会各自凭空捏造接口协议，结果两边对不上——两个 Agent 分别定义了不同的字段名和数据类型，还得人工缝合。这正是 `pipeline()` 流水线所解决的问题：串行递进，前一个 Stage 的产出物就是后一个 Stage 的输入契约，四个阶段像接力赛一样按序推进，每棒交接都有明确的产物作为凭据。

## 为什么用 pipeline 流水线

`pipeline()` 和 `parallel()` 是 Claude Code 中最常用的两种多 Agent 编排模式。选型取决于任务阶段之间是否存在**产出依赖**。

| 维度              | `pipeline()`                                             | `parallel()`                           |
| ----------------- | -------------------------------------------------------- | -------------------------------------- |
| **适用场景**      | 阶段间有产出依赖，前一阶段输出是后一阶段输入             | 各任务独立，互不依赖                   |
| **执行方式**      | 按 Stage 顺序串行，前一 Stage 全部完成后才进入下一 Stage | 所有 Agent 同时启动，并发执行          |
| **同一 Stage 内** | 可包含多个 Agent 并行执行                                | 所有 Agent 在同一层并行                |
| **典型例子**      | 设计→实现→测试→审查                                      | 同时审查代码规范 + 安全漏洞 + 性能瓶颈 |
| **失败处理**      | 某一 Stage 失败则后续 Stage 不执行                       | 单个 Agent 失败不影响其他 Agent        |

**核心区别**：pipeline 不需要等所有 Agent 都完成某个阶段——Stage 1 的 Backend Agent 跑完后立刻进入 Stage 2，此时 Stage 1 没有其他 Agent 需要等待。而 parallel 是所有 Agent 同属一层，必须全部完成才算结束。

举个直观的类比：pipeline 像工厂流水线——焊接工位完成一个零件，下一工位就能立刻开始装配，不需要等第 100 个零件也焊完。parallel 像同一条街上的三家独立商店——各自开门营业，互不干涉。

## 前置准备

开始之前，确保项目环境就绪：

- **项目结构**：一个 Express + TypeScript 项目，已安装 `express`、`typescript`、`ts-node`、`@types/express`
- **前置文档**：项目根目录下有 `specs/feedback-api.md`，描述业务需求（用户提交反馈→管理员审核→标记已处理/已关闭），但不包含具体 API 设计
- **目录结构**：

```text
project/
├── src/
│   ├── routes/       # API 路由（待生成）
│   ├── models/       # 数据模型（待生成）
│   └── middleware/    # 中间件
├── components/        # React 前端组件（待生成）
├── tests/             # 测试用例（待生成）
└── specs/
    └── feedback-api.md
```

- **Workflow 脚本**：确保项目已启用 Workflow 功能。`pipeline()`、`parallel()`、`agent()` 是 Workflow 脚本中的全局函数，无需额外安装

## 完整交互过程

### Step 1：编写 pipeline 脚本

首先编写 `feedback-pipeline.ts`，定义流水线的三个阶段和四个 Agent：

```typescript
// feedback-pipeline.ts
export const meta = {
  name: 'feedback-pipeline',
  description: '用户反馈功能完整开发流水线：API 设计 → 前端组件 → 测试 + 审查',
};

export const phase = {
  stage1: {
    name: 'API 设计与实现',
    agents: {
      backend: {
        prompt: `阅读 specs/feedback-api.md，设计并实现反馈 API：
1. 设计 RESTful 端点（POST /api/feedbacks, GET /api/feedbacks, PATCH /api/feedbacks/:id/status）
2. 定义数据模型 Feedback { id, content, email, status, createdAt }
3. 实现 Express 路由和控制器，TypeScript 类型完整
4. 中间件：POST 校验 content 和 email 字段、PATCH 校验 status 枚举值
5. 输出 API 文档到 api-docs/feedback-api.md，包含请求/响应示例

产物清单：
- src/routes/feedback.ts
- src/models/feedback.ts
- api-docs/feedback-api.md`,
      },
    },
  },

  stage2: {
    name: '前端组件实现',
    dependsOn: ['stage1'],
    agents: {
      frontend: {
        prompt: `基于 api-docs/feedback-api.md 中定义的接口，实现 React 组件：
1. FeedbackForm：表单组件，包含 content（textarea）、email（input），提交到 POST /api/feedbacks
2. FeedbackList：列表组件，调用 GET /api/feedbacks 展示所有反馈
3. 状态管理：loading、error、success 三种状态
4. 错误处理：网络错误提示、字段校验错误展示
5. 使用 TypeScript，接口类型从 api-docs/feedback-api.md 推断

产物清单：
- components/FeedbackForm.tsx
- components/FeedbackList.tsx`,
      },
    },
  },

  stage3: {
    name: '测试与审查',
    dependsOn: ['stage2'],
    agents: {
      test: {
        prompt: `基于 src/routes/feedback.ts 和 components/ 下的实现，编写 Jest 测试：
1. API 测试：POST /api/feedbacks 正常提交、缺少字段返回 400、PATCH 无效 status 返回 400
2. 组件测试：FeedbackForm 表单提交、FeedbackList 列表渲染和空状态
3. 覆盖正常路径 + 边界情况

产物清单：
- tests/feedback.api.test.ts
- tests/feedback.components.test.ts`,
      },
      review: {
        prompt: `审查完整实现（src/ 和 components/ 下所有文件）：
1. API 设计是否 RESTful、状态码是否正确
2. 前端组件是否覆盖 loading/error/empty 状态
3. TypeScript 类型是否完整、是否存在 any
4. 错误处理是否完备
5. 输出审查报告到 review-report.md，按严重程度分级`,
      },
    },
  },
};
```

:::tip
Stage 3 中包含两个 Agent（test 和 review），它们没有互相依赖，CC 会在进入 Stage 3 时**自动并行执行**。pipeline 的"串行"是指 Stage 之间，同一 Stage 内部是并行的。
:::

将脚本通过 Workflow 工具执行，或直接在对话中让 CC 按阶段推进：

CC 的输出大致如下：

```text
Pipeline 'feedback-pipeline' started (3 stages, 4 agents)

▶ Stage 1: API 设计与实现
  [backend] ~/project > 阅读 specs/feedback-api.md...
  [backend] ~/project > 设计 API 端点...
  [backend] ~/project > 实现 Express 路由...
  [backend] Created: src/routes/feedback.ts
  [backend] Created: src/models/feedback.ts
  [backend] Created: api-docs/feedback-api.md
✓ Stage 1 completed (45s)

▶ Stage 2: 前端组件实现
  [frontend] ~/project > 阅读 api-docs/feedback-api.md...
  [frontend] ~/project > 基于接口实现 FeedbackForm...
  [frontend] ~/project > 基于接口实现 FeedbackList...
  [frontend] Created: components/FeedbackForm.tsx
  [frontend] Created: components/FeedbackList.tsx
✓ Stage 2 completed (38s)

▶ Stage 3: 测试与审查
  [test]     ~/project > 编写 Jest API 测试...
  [review]   ~/project > 审查 API 设计...
  [test]     ~/project > 编写 Jest 组件测试...
  [review]   ~/project > 审查前端组件...
  [test]     Created: tests/feedback.api.test.ts
  [test]     Created: tests/feedback.components.test.ts
  [review]   Created: review-report.md
✓ Stage 3 completed (52s)

✓ Pipeline completed successfully (2m15s)
```

### Step 2：Stage 1 产物——API 端点与数据模型

Stage 1 的 Backend Agent 输出三份核心文件。

**数据模型** `src/models/feedback.ts`：

```typescript
export interface Feedback {
  id: string;
  content: string;
  email: string;
  status: 'pending' | 'reviewed' | 'closed';
  createdAt: string;
}

export type CreateFeedbackInput = Pick<Feedback, 'content' | 'email'>;
export type UpdateStatusInput = Pick<Feedback, 'status'>;
```

**API 路由** `src/routes/feedback.ts`：

```typescript
import { Router } from 'express';
import type { Feedback, CreateFeedbackInput, UpdateStatusInput } from '../models/feedback';

const router = Router();
const feedbacks: Feedback[] = [];

// POST /api/feedbacks — 提交反馈
router.post('/', (req, res) => {
  const { content, email } = req.body as CreateFeedbackInput;
  if (!content || !email) {
    return res.status(400).json({ error: 'content 和 email 为必填字段' });
  }
  const feedback: Feedback = {
    id: crypto.randomUUID(),
    content,
    email,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  feedbacks.push(feedback);
  res.status(201).json(feedback);
});

// GET /api/feedbacks — 获取反馈列表
router.get('/', (_req, res) => {
  res.json(feedbacks);
});

// PATCH /api/feedbacks/:id/status — 更新反馈状态
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body as UpdateStatusInput;
  const validStatuses = ['pending', 'reviewed', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: '无效的 status 值' });
  }
  const feedback = feedbacks.find((f) => f.id === id);
  if (!feedback) {
    return res.status(404).json({ error: '反馈不存在' });
  }
  feedback.status = status;
  res.json(feedback);
});

export default router;
```

**API 文档** `api-docs/feedback-api.md` 包含三个端点的完整说明：

| 方法    | 路径                        | 描述     | 请求体               | 响应                      |
| ------- | --------------------------- | -------- | -------------------- | ------------------------- |
| `POST`  | `/api/feedbacks`            | 提交反馈 | `{ content, email }` | `201` + Feedback 对象     |
| `GET`   | `/api/feedbacks`            | 获取列表 | 无                   | `200` + Feedback[]        |
| `PATCH` | `/api/feedbacks/:id/status` | 更新状态 | `{ status }`         | `200` + 更新后的 Feedback |

这份 API 文档就是 Stage 1 和 Stage 2 之间的**契约**——前端 Agent 不再需要猜测接口形状，直接按文档对接即可。

### Step 3：Stage 2 基于契约实现前端组件

Stage 2 的 Frontend Agent 拿到 `api-docs/feedback-api.md` 后，直接从文档中推断 TypeScript 类型并实现两个组件。

**FeedbackForm 组件** `components/FeedbackForm.tsx` 核心逻辑：

```typescript
import { useState, type FormEvent } from 'react';

interface FeedbackInput {
  content: string;
  email: string;
}

export function FeedbackForm() {
  const [form, setForm] = useState<FeedbackInput>({ content: '', email: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error);
      }
      setStatus('success');
      setForm({ content: '', email: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : '提交失败');
    }
  };

  // render: textarea + email input + submit button, 三种状态视图
}
```

**FeedbackList 组件** `components/FeedbackList.tsx` 核心逻辑：

```typescript
import { useEffect, useState } from 'react'
import type { Feedback } from '../src/models/feedback'

export function FeedbackList() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/feedbacks')
      .then((res) => {
        if (!res.ok) throw new Error('加载失败')
        return res.json()
      })
      .then(setFeedbacks)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>加载中...</p>
  if (error) return <p className="error">{error}</p>
  if (feedbacks.length === 0) return <p>暂无反馈</p>

  // render: feedback list with status badges
}
```

注意 Frontend Agent 直接 `import type { Feedback } from '../src/models/feedback'`——类型来源就是 Stage 1 输出的数据模型。如果前端 Agent 自己凭空定义类型，字段名很可能不同（比如把 `createdAt` 写成 `created_at`），两端对接时就会出错。

### Step 4：Stage 3 测试与审查并行

Stage 3 的两个 Agent 同时启动：Test Agent 写测试用例，Review Agent 做代码审查。二者互不依赖，pipeline 在这个 Stage 内部自动转为并行模式。

**Test Agent 产物**——Jest 测试用例 `tests/feedback.api.test.ts`：

```typescript
import request from 'supertest';
import app from '../src/app';

describe('POST /api/feedbacks', () => {
  it('正常提交应返回 201 和反馈对象', async () => {
    const res = await request(app).post('/api/feedbacks').send({ content: '界面很好用', email: 'user@test.com' });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('pending');
  });

  it('缺少 content 应返回 400', async () => {
    const res = await request(app).post('/api/feedbacks').send({ email: 'user@test.com' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('content');
  });

  it('缺少 email 应返回 400', async () => {
    const res = await request(app).post('/api/feedbacks').send({ content: '界面很好用' });
    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/feedbacks/:id/status', () => {
  it('无效 status 值应返回 400', async () => {
    const res = await request(app).patch('/api/feedbacks/nonexistent/status').send({ status: 'deleted' });
    expect(res.status).toBe(400);
  });
});
```

组件测试 `tests/feedback.components.test.ts` 覆盖了表单提交、列表渲染、空状态三个场景。

**Review Agent 产物**——审查报告 `review-report.md`：

```text
审查报告 — 用户反馈功能
==========================

🔴 严重
  - (无)

🟡 建议
  - src/routes/feedback.ts: 反馈数据存储在内存数组中，服务重启后丢失。
    建议：生产环境替换为数据库持久化。
  - components/FeedbackForm.tsx: 提交成功后建议添加 3 秒自动关闭提示。
  - components/FeedbackList.tsx: 建议添加分页，列表数据量大时影响性能。

🟢 优点
  - TypeScript 类型覆盖完整，无 any 类型
  - API 遵循 RESTful 规范，状态码使用准确
  - 前端组件覆盖了 loading/error/empty 三种边界状态
  - 错误信息对用户友好，非技术堆栈
```

:::info
Review Agent 运行在 Stage 3，它可以同时审查 Stage 1（API）和 Stage 2（组件）的产物——流水线在执行时，所有前序 Stage 的输出对后续 Stage 的 Agent 都是可见的。
:::

### Step 5：交付物清单

流水线跑完后，`git status` 看到的变更：

```text
新增文件：
  src/routes/feedback.ts          — API 路由 + 控制器
  src/models/feedback.ts          — 数据模型类型定义
  api-docs/feedback-api.md        — API 接口文档（契约）
  components/FeedbackForm.tsx     — 反馈提交表单组件
  components/FeedbackList.tsx     — 反馈列表展示组件
  tests/feedback.api.test.ts      — API 端点 Jest 测试
  tests/feedback.components.test.ts — 组件 Jest 测试
  review-report.md                — 代码审查报告
```

四份产物类型对应四个角色：**接口文档**给前后端对齐、**路由和模型**是后端实现、**React 组件**是前端实现、**测试用例**给 QA 验收、**审查报告**给 Tech Lead 做质量把关。一份 pipeline 脚本驱动了整个功能从 0 到交付的全过程。

## 要点总结

- **pipeline vs parallel 取决于依赖关系**：有产出依赖选 pipeline，独立任务选 parallel。不要在 pipeline 里塞互不依赖的阶段——那会浪费等待时间。
- **接口文档是阶段间的契约**：Backend Agent 输出的 API 文档是后续 Stage 的唯一真相来源。如果跳过文档直接让前端 Agent 对接代码，耦合会很高，后端改一个字段名前端就崩。
- **中间阶段失败要回滚**：如果 Stage 2 的 Frontend Agent 报错，后续 Stage 3 不会执行。此时需要修好问题后重新运行 pipeline，而非手动补跑测试——保持交付物来源可追溯。
- **测试和审查可以在同一个 Stage 用 parallel 并行**：pipeline 的每个 Stage 内部天然支持多 Agent 并行，不需要额外嵌套 `parallel()`。把互不依赖的任务放进同一个 Stage 即可自动并行。
- **产物清单作为交付凭证**：流水线跑完后对照产物清单逐项验收，确保每个 Agent 都产出了声明中的文件，避免"Agent 说做完了但实际什么都没写"的幻觉问题。

## 变体与延伸

pipeline 模式的应用远不止 API 开发这一个场景：

| 场景                 | Stage 1                             | Stage 2                         | Stage 3                               | 说明                                   |
| -------------------- | ----------------------------------- | ------------------------------- | ------------------------------------- | -------------------------------------- | --------------------------------------------- |
| **CI/CD 流水线**     | 代码检查 Agent（lint + typecheck）  | 构建 Agent（build + bundle）    | 部署 Agent（deploy + health check）   | 前序失败则不部署，避免坏代码上线       |
| **文档生成流水线**   | 代码分析 Agent（遍历源码）          | 文档撰写 Agent（生成 API 文档） | 翻译 Agent（i18n 多语言）             | 先分析再写，避免凭空捏造 API 签名      |
| **数据库迁移流水线** | Schema 设计 Agent（生成 migration） | 数据迁移 Agent（执行 + 校验）   | 回滚预案 Agent（生成 down migration） | 每阶段不可逆，出问题靠 Stage 3 回滚    |
| **全栈功能流水线**   | 数据库 Schema Agent                 | API Agent                       | 前端 Agent                            | 测试 Agent + E2E Agent（Stage 4 并行） | 这是本文示例的扩展版，适合完整的 feature 交付 |

:::warning
pipeline 的每个 Stage 会**阻塞等待**前一 Stage 完成。如果 Stage 之间没有真正的产出依赖而强行用 pipeline，会让原本可以并行的任务白白排队。举个例子：同时改三个独立功能模块——应该用 `parallel()` 起三个 Agent，而不是用 pipeline 排成三个 Stage。
:::

掌握了 pipeline 之后，下一个自然的问题就是"如何让 pipeline 和 parallel 组合使用"。在 Workflow 脚本中，你可以在一个 Stage 内嵌套 `parallel()` 子调用，也可以在 `parallel()` 的某个分支内部启动 pipeline——这取决于你的工作流拓扑。如需更复杂的编排（条件分支、重试、人工确认），`parallel()` 本身就是 Workflow 脚本中的全局函数，配合 `agent()` 可以实现 DAG（有向无环图）级别的任务编排。此外，在对话中直接描述并行任务需求，CC 也可以自行调度多个 Agent 并发执行。

### 相关场景

- [单 Agent 任务](./single-agent-task) — 单 Agent 专注式开发
- [全栈并行开发](./fullstack-development) — 多 Agent 并行全栈开发
