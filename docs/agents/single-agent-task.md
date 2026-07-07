---
title: 单 Agent 任务委派 — 把重复劳动交给 AI
description: 学习用 agent() 将 Express API 项目的日志中间件、错误处理重构、单元测试编写等重复任务委派给子 Agent，实现上下文隔离和并行委派
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★☆☆☆    |
| 🧪 测试 | ★★★★☆  | ★★★☆☆    |
| 📦 产品 | ★★☆☆☆  | ★★☆☆☆    |

**🎯 学习产出：** 掌握 `agent()` 基础调用，能独立将重复任务拆分成子 Agent 委派

**🚀 AI 能力提升：** 单 Agent、任务委派
:::

## 场景概述

假设你在维护一个中型 Express API 项目（TypeScript），产品迭代到 2.0，技术债清单上有三件事一直没空做：

1. **给所有路由加请求日志中间件** — 现在出问题时只能靠直觉排查，缺乏可追溯的请求日志
2. **重构错误处理** — 每个路由各自 `try-catch`，错误信息格式不统一，HTTP 状态码满天飞
3. **给 User 模块写单元测试** — 覆盖率不到 30%，每次改 User 逻辑都提心吊胆

三个任务彼此独立，按传统方式，你会排个优先级——今天写日志中间件、明天重构错误处理、后天补测试——至少花掉三个半天。

但如果把每个任务**委派给一个 Claude Code Agent**，让它们在各自的上下文中独立工作呢？你只需要写好委派指令，然后去喝杯咖啡，回来逐个 review 产出即可。这篇文章就带你走一遍这个流程——三个任务，三个 Agent，一个下午搞定。

## 为什么用 Agent 委派

在聊具体操作之前，先厘清 Agent 委派相比"在同一个对话里挨个让 CC 做"的核心区别：

| 对比维度 | 同一对话串行做 | Agent 委派并行做 |
| -------- | -------------- | ---------------- |
| 上下文污染 | 做任务 B 时，对话历史里还有任务 A 的代码引用，容易误判 | 每个 Agent 只看自己任务的上下文，互不干扰 |
| 推进方式 | 必须等 A 完成才能开始 B | 三个任务可以同时启动，独立推进 |
| 输出边界 | 输出混在对话流里，需要手动提取 | 每个 Agent 有明确的交付物，边界清晰 |
| 审查体验 | 翻半天聊天记录找产出 | 回到主对话逐一 review，像 code review 一样 |

核心价值就三点：**上下文隔离**（每个 Agent 只看自己那摊事）、**并行推进**（省掉串行等待时间）、**输出边界清晰**（Agent 的交付物不会和其他对话混淆）。

:::tip
Agent 不是比你聪明的搭档，它只是比你快 10 倍的工具。关键在于你把任务拆得多清楚——输入是什么、期望产出是什么、不要做什么，越具体效果越好。
:::

## 前置准备

```bash
# 项目结构 — 一个典型的 Express + TypeScript 项目
.
├── src
│   ├── index.ts          # 入口，app.listen
│   ├── routes
│   │   ├── user.ts       # User 模块路由（需要加日志 + 写测试）
│   │   ├── product.ts    # Product 模块路由
│   │   └── order.ts      # Order 模块路由
│   ├── controllers
│   │   ├── userController.ts
│   │   ├── productController.ts
│   │   └── orderController.ts
│   ├── middleware
│   │   └── auth.ts       # 已有的认证中间件（没有日志中间件）
│   └── types
│       └── index.ts
├── __tests__              # 测试目录（只有零散几个文件）
├── jest.config.ts
├── tsconfig.json
└── package.json
```

项目已经运行起来，`npm run dev` 能正常启动。接下来就是分三步委派。

## 完整交互过程

### Step 1：委派"给所有路由添加请求日志中间件"

先让 Agent 分析当前项目结构，再输出完整的 logger middleware。

**用户输入：**

在对话中直接描述任务，CC 会自动使用 Agent 工具来执行：

```text
任务：给当前 Express 项目的所有路由添加请求日志中间件。

请先读 src/index.ts 和 src/routes/ 下的全部路由文件，了解现有路由注册方式，
然后在 src/middleware/logger.ts 中创建一个请求日志中间件，要求：

1. 记录每个请求的 method、url、status code、响应时间（ms）
2. 使用 console.log 即可，格式为 [timestamp] METHOD /path - STATUS - XXms
3. 不要修改任何路由的业务逻辑，只注册中间件
4. 在 src/index.ts 中 app.use() 全局注册，不要在每个路由文件里单独引入

完成后列出：修改了哪些文件、为什么这样设计、如果有多种方案说明你的选择理由。
```

**CC 输出（Agent 完成后的交付内容）：**

```text
## 交付摘要

### 新建文件：src/middleware/logger.ts

```typescript
import type { Request, Response, NextFunction } from 'express'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()
  const { method, url } = req

  // 监听 response finish 事件，拿到实际 status code
  res.on('finish', () => {
    const duration = Date.now() - start
    const timestamp = new Date().toISOString()
    console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`)
  })

  next()
}
```

### 修改文件：src/index.ts

在 `const app = express()` 之后、所有路由之前插入：

```typescript
import { requestLogger } from './middleware/logger'
app.use(requestLogger)
```

### 设计决策

- **挂载时机**：放在所有路由之前、body parser 之后，确保请求进来第一时间记录，又不影响 body 解析
- **为什么用 `res.on('finish')` 而非覆写 `res.end`**：`finish` 事件是 Node.js http 模块的标准事件，
  兼容性好，不侵入底层实现。覆写 `res.end` 可能和 compression 等其他中间件冲突
- **为什么用 `console.log` 而非 winston/pino**：按你的要求保持简单，后续如果接入日志系统，
  只需替换 `console.log` 一行即可，中间件结构不变
```

### Step 2：委派"重构错误处理"

现在来处理第二个任务——把散落在各个路由里的 `try-catch` 收拢为统一的 error handler。

**用户输入：**

在对话中直接描述任务，CC 会自动使用 Agent 工具来执行：

```text
任务：重构当前 Express 项目的错误处理为统一的 error middleware。

先读 src/controllers/ 下所有文件，列出当前有哪些分散的错误处理方式。
然后在 src/middleware/errorHandler.ts 中创建一个 Express error-handling middleware。

要求：
1. 错误格式统一为 { error: { message: string, code?: string } }
2. 根据错误类型自动设置 HTTP 状态码（ValidationError → 400, NotFound → 404, 其余 → 500）
3. 创建一个 AppError 类（放在 src/utils/AppError.ts），供 controller 使用
4. 展示旧写法 vs 新写法的对比（选一个 controller 做示例）

只输出设计方案和代码，不要实际修改文件。
```

**CC 输出：**

```text
## 现状分析

扫描 src/controllers/ 后，发现三种分散的错误处理模式：

| 文件 | 当前写法 | 问题 |
| ---- | -------- | ---- |
| userController.ts | `try-catch` + `res.status(500).json({ error: e.message })` | 状态码写死 500 |
| productController.ts | `try-catch` + 混用 `res.send` / `res.json` | 格式不统一 |
| orderController.ts | 无错误处理，let it crash | 缺失 |

## 设计方案

### 新建 src/utils/AppError.ts

```typescript
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

### 新建 src/middleware/errorHandler.ts

```typescript
import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { message: err.message, code: err.code }
    })
  }

  // 未预期的错误
  console.error('[Unhandled Error]', err)
  return res.status(500).json({
    error: { message: 'Internal server error' }
  })
}
```

### 在 src/index.ts 中注册（放在所有路由之后）

```typescript
import { errorHandler } from './middleware/errorHandler'
app.use(errorHandler)
```

### 旧写法 vs 新写法（以 userController.ts 为例）

**旧写法：**
```typescript
export async function getUser(req: Request, res: Response) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'not found' })
    res.json(user)
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
```

**新写法：**
```typescript
export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) throw new AppError('User not found', 404, 'USER_NOT_FOUND')
    res.json(user)
  } catch (e) {
    next(e)  // 抛给 error handler
  }
}
```

:::info
新写法中 controller 不再直接 `res.status().json()` 错误响应，而是 `next(e)` 交给全局 error handler。
这使得错误格式 100% 一致，且 controller 代码更简洁。
:::
```

### Step 3：委派"给 User 模块写单元测试"

第三个任务交给 CC 去写测试——它需要先读懂 User 模块的源码，然后输出符合项目 jest 配置的测试文件。

**用户输入：**

在对话中直接描述任务，CC 会自动使用 Agent 工具来执行：

```text
任务：给 src/routes/user.ts 和 src/controllers/userController.ts 写单元测试。

先读 src/routes/user.ts、src/controllers/userController.ts、jest.config.ts，
理解 User 模块的接口行为和测试配置。

然后在 __tests__/user.test.ts 中创建测试文件，要求：

1. 使用 jest + supertest 测试所有 HTTP 端点
2. Mock 数据库层（User model），不连真实数据库
3. 覆盖正常路径和异常路径（用户不存在、参数校验失败等）
4. 测试文件结构：describe 按端点分组，每个端点至少 2 个 test case

只输出 __tests__/user.test.ts 的内容，不要修改源码。
```

**CC 输出：**

```text
## 源码分析

User 模块有 2 个端点：
- `GET /api/users/:id` — 查询单个用户
- `POST /api/users` — 创建用户（body: { name, email }）

jest.config.ts 配置：preset: 'ts-jest', testEnvironment: 'node'，支持 supertest。

## __tests__/user.test.ts

```typescript
import request from 'supertest'
import express, { type Express } from 'express'
import userRouter from '../src/routes/user'

// Mock User model — 隔离数据库依赖
jest.mock('../src/models/User', () => ({
  User: {
    findById: jest.fn(),
    create: jest.fn()
  }
}))

import { User } from '../src/models/User'

describe('User API', () => {
  let app: Express

  beforeEach(() => {
    app = express()
    app.use(express.json())
    app.use('/api/users', userRouter)
    jest.clearAllMocks()
  })

  describe('GET /api/users/:id', () => {
    it('should return user when found', async () => {
      const mockUser = { id: '1', name: 'Alice', email: 'alice@example.com' }
      ;(User.findById as jest.Mock).mockResolvedValue(mockUser)

      const res = await request(app).get('/api/users/1')

      expect(res.status).toBe(200)
      expect(res.body).toEqual(mockUser)
    })

    it('should return 404 when user not found', async () => {
      ;(User.findById as jest.Mock).mockResolvedValue(null)

      const res = await request(app).get('/api/users/999')

      expect(res.status).toBe(404)
      expect(res.body.error).toBeDefined()
    })

    it('should return 400 when id format is invalid', async () => {
      const res = await request(app).get('/api/users/invalid-id')

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/users', () => {
    it('should create a user and return 201', async () => {
      const newUser = { name: 'Bob', email: 'bob@example.com' }
      ;(User.create as jest.Mock).mockResolvedValue({ id: '2', ...newUser })

      const res = await request(app)
        .post('/api/users')
        .send(newUser)

      expect(res.status).toBe(201)
      expect(res.body.name).toBe('Bob')
    })

    it('should return 400 when email is missing', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({ name: 'Bob' })

      expect(res.status).toBe(400)
    })
  })
})
```

### Mock 策略说明

- `jest.mock('../src/models/User')` 在 import 之前执行，jest 会自动提升，确保所有测试用 mock 版本
- 每个 test case 前 `jest.clearAllMocks()` 重置 mock 状态，避免用例间互相污染
- supertest 直接对 Express app 实例发请求，不需要启动真正的 HTTP server
```

### Step 4：审查产出、合并、验证

三个 Agent 都完成了，现在回到主对话——你有三份交付文档可以逐一审查。

```text
## Agent 1 产出 — logger middleware
- src/middleware/logger.ts ✓ 设计合理，res.on('finish') 方案干净
- src/index.ts ✓ 插入位置正确，在路由之前、body parser 之后
→ 可以合并

## Agent 2 产出 — 错误处理重构
- src/utils/AppError.ts ✓ 简单实用
- src/middleware/errorHandler.ts ✓ 逻辑清晰，未预期错误有 console.error 兜底
- controller 改法 ✓ 用 next(e) 替代 res.status().json()，统一度高
→ 但需要手动迁移所有 controller，这个 Agent 只给了方案
```

:::warning
Agent 2 按要求"只输出设计方案和代码，不要实际修改文件"，所以它只给了设计。实际迁移所有 controller 时，你还需要自己改一遍——或者再起一个 Agent 专门做迁移。
:::

接下来把三个 Agent 的产出手动应用到代码库（或用 CC 在当前对话里帮你写入），然后验证：

```bash
# 跑一下测试，确认没有回归
npm test
```

```text
PASS  __tests__/user.test.ts
  User API
    GET /api/users/:id
      ✓ should return user when found (12 ms)
      ✓ should return 404 when user not found (5 ms)
      ✓ should return 400 when id format is invalid (3 ms)
    POST /api/users
      ✓ should create a user and return 201 (8 ms)
      ✓ should return 400 when email is missing (4 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Time:        2.1 s
```

全部通过。三个任务，三个 Agent 并行推进，你只需要 review 和合并——这就是 Agent 委派的节奏。

## 要点总结

1. **Agent 任务要明确输入/输出边界**。每个委派指令都包含"先读什么、做什么文件、产出什么、不要做什么"，边界越清晰，Agent 交付质量越高。
2. **一个 Agent 只做一个关注点**。别把 logger + errorHandler + tests 打包成一个任务扔给 Agent——拆开之后每个 Agent 的上下文更干净，产出也更聚焦。
3. **Agent 不比你聪明，但比你快 10 倍**。它不会替你把所有 controller 改好（除非你明确要求），但它能在几分钟内产出你手写要一小时的东西——剩余工作量是你的 review 和微调。
4. **委派完去喝杯咖啡，回来 review**。三个 Agent 并行跑的时间大概是你串行做的 1/3，多出来的时间不用盯着屏幕——等通知即可。
5. **Agent 交付的是"初稿"，不是"终稿"**。你仍然需要审查、合并、验证（`npm test`），但这个流程比从零手写快得多。

## 变体与延伸

### 变体：同一个任务，三种思路并行探索

有时候你不确定"哪种方案最好"。与其自己纠结，不如让三个 Agent 各自用一种策略实现同一个需求，然后对比选出最优。

以"错误处理重构"为例：

```text
# Agent A — 类风格
"用 AppError 类 + 全局 error handler middleware，参考 express 官方文档"

# Agent B — 函数式风格
"用 Result<T, E> 模式，每个 controller 返回 Result 类型，
 由 wrapAsync 高阶函数统一处理，不要用 class"

# Agent C — express-async-errors 方案
"用 express-async-errors 库消除 try-catch 样板代码，
 结合 zod 做输入校验，错误统一由 error handler 处理"
```

三个 Agent 同时跑，产出三套方案后放在一张表里对比：

| 维度 | Agent A（AppError 类） | Agent B（Result 模式） | Agent C（express-async-errors） |
| ---- | ---------------------- | ---------------------- | ------------------------------- |
| 学习成本 | 低，标准 Express 写法 | 中，需理解 Result 类型 | 低，一个 require 就搞定 |
| 样板代码 | 仍需 try-catch | 几乎无样板 | 几乎无样板 |
| TypeScript 类型安全 | 一般 | 强，编译期可检查 | 一般 |
| 社区生态 | Express 官方推荐 | 偏函数式，小众 | 流行库，维护活跃 |
| 适合场景 | 中小项目，团队熟悉 OOP | 类型安全要求高的大项目 | 快速迭代，不想改现有代码结构 |

:::tip
这种"并行探索、对比优选"的模式特别适合**架构决策**或**技术选型**类任务——AI 替你写 POA（Proof of Architecture），你只做决策。
:::

### 延伸：Agent 链 — 当 Agent 的产出是下一个 Agent 的输入

在某些场景下，Agent 之间可以串联。比如：

1. **Agent 1**：分析现有错误处理模式，输出一份"问题清单 + 重构方案"
2. **Agent 2**（拿到 Agent 1 的方案后）：按方案执行代码迁移，实际修改所有 controller
3. **Agent 3**（拿到 Agent 2 的改动后）：写回归测试，确保重构没有引入 bug

每一步的输出成为下一步的输入，形成一条 Agent 流水线——不过要注意，链越长，出错概率越高，建议每步审查后再启动下一环。

### 相关场景

- [Agent 代码审查](./agent-code-review) — Schema 驱动的结构化审查
- [流水线开发流程](./pipeline-workflow) — pipeline() 接力开发
