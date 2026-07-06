---
title: 并行多维度审查 — 安全+性能+正确性同时审
description: 用 parallel() 启动 3 个 Agent 从安全、性能、正确性三个维度同时审查支付模块，结合 adversarial verify 排除误报，聚合高质量审查结果
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★★  | ★★★★☆    |
| 📦 产品 | ★★☆☆☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握 `parallel()` 多维度并行审查和 adversarial verify 模式，能独立编排多 Agent 审查流程

**🚀 AI 能力提升：** 并行 Agent、对抗验证
:::

## 场景概述

支付模块 `payment-service.ts` 即将上线，需要从**安全性**、**性能**、**正确性**三个维度做全面审查。传统做法是一个维度一个维度地审，或者让一个 Agent 同时审三个维度但容易顾此失彼。

更好的方式：用 `parallel()` 启动三个独立的审查 Agent，每个 Agent 专注一个维度，各自给出结构化的审查报告。审完之后再用 **adversarial verify**（对抗验证）对每个发现做反向确认，排除误报。最终得到一份经过校验的高质量问题清单。

三个审查维度的关系：

| 维度 | 关心什么 | 与其他维度依赖 |
| ---- | -------- | -------------- |
| 安全性 | SQL 注入、XSS、权限绕过、密钥泄露 | 独立，不依赖其他审查结果 |
| 性能 | N+1 查询、内存泄漏、阻塞 IO、缓存策略 | 独立，不依赖其他审查结果 |
| 正确性 | 并发安全、边界条件、状态机完整性、幂等性 | 独立，不依赖其他审查结果 |

## 为什么用 parallel 并行审查

**串行的代价**：顺序执行三次审查，总耗时 = 安全审查时间 + 性能审查时间 + 正确性审查时间。如果每个审查耗时 30 秒，总耗时 90 秒。

**parallel 的优势**：三个 Agent 同时启动，总耗时取三个中**最慢的那个**（约 30 秒），比串行快 3 倍。

**适用条件**：审查维度之间**彼此独立**，不需要 A 的结果作为 B 的输入。安全、性能、正确性三个维度天然满足这个条件——SQL 注入不影响 N+1 查询的判断，N+1 查询也不影响并发安全的分析。

:::tip
parallel 不等所有 Agent 完成才出结果——先完成的先返回，你可以边看安全报告边等性能和正确性的结果，体感比"等三个都完"更快。
:::

## 前置准备

### 项目结构

```text
src/
  services/
    payment-service.ts   # 待审查的支付模块（约 500 行）
  db/
    payment-repository.ts # 数据库访问层
  workers/
    inventory-worker.ts   # 库存扣减异步任务
```

### Schema 定义

为了让三个 Agent 输出统一格式的结构化报告，先定义审查结果 Schema：

```typescript
// review-schemas.ts
export const FINDING_SCHEMA = {
  type: 'object',
  properties: {
    severity: {
      type: 'string',
      enum: ['critical', 'high', 'medium', 'low'],
      description: '严重程度',
    },
    category: {
      type: 'string',
      enum: ['security', 'performance', 'correctness'],
    },
    file: { type: 'string', description: '文件路径' },
    line: { type: 'number', description: '行号' },
    title: { type: 'string', description: '问题标题' },
    description: { type: 'string', description: '详细描述' },
    suggestion: { type: 'string', description: '修复建议' },
  },
  required: ['severity', 'category', 'file', 'line', 'title', 'description', 'suggestion'],
}

export const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    isReal: { type: 'boolean', description: '问题是否真实存在' },
    reason: { type: 'string', description: '判定理由' },
    evidence: { type: 'string', description: '代码证据（文件+行号）' },
  },
  required: ['isReal', 'reason', 'evidence'],
}
```

## 完整交互过程

### Step 1：编写并行审查 Workflow 脚本

三个 Agent 各有各的审查视角，需要在 prompt 中明确各自的审查重点和输出格式：

```javascript
// parallel-review.workflow.js
export const meta = {
  name: 'parallel-payment-review',
  description: '支付模块三维度并行审查 + 对抗验证',
  phases: [
    { title: 'Parallel Review', detail: '安全/性能/正确性 三个 Agent 并行审查' },
    { title: 'Adversarial Verify', detail: '对每个发现启动 3 个验证 Agent 反向确认' },
    { title: 'Aggregate', detail: '聚合确认后的问题 → 生成修复任务清单' },
  ],
}

phase('Parallel Review')

const [securityFindings, performanceFindings, correctnessFindings] = await parallel(
  // Agent 1：安全审查
  () => agent(
    `审查 src/services/payment-service.ts 的**安全性**：
    1. 检查是否存在 SQL 注入风险（拼接查询、未参数化）
    2. 检查敏感信息是否经日志或错误消息泄露（密钥、token、用户 PII）
    3. 检查支付金额/参数是否在前端可篡改
    4. 检查鉴权/授权逻辑是否有绕过路径

    只关注安全问题，忽略性能和代码风格。`,
    { label: 'security-review', schema: { type: 'array', items: FINDING_SCHEMA } },
  ),

  // Agent 2：性能审查
  () => agent(
    `审查 src/services/payment-service.ts 的**性能**：
    1. 检查是否存在 N+1 查询（循环内执行 DB 操作）
    2. 检查是否存在同步阻塞 IO（fs.readFileSync、大 JSON 解析阻塞事件循环）
    3. 检查是否有无界循环或递归调用
    4. 检查缓存策略——高频查询是否复用结果

    只关注性能问题，忽略安全和代码风格。`,
    { label: 'performance-review', schema: { type: 'array', items: FINDING_SCHEMA } },
  ),

  // Agent 3：正确性审查
  () => agent(
    `审查 src/services/payment-service.ts 的**正确性**：
    1. 检查库存扣减是否有并发超卖风险（read-check-write 非原子）
    2. 检查支付回调是否做了幂等处理（重复回调不重复扣款/发货）
    3. 检查金额计算是否使用浮点数（应用整数/Decimal）
    4. 检查边界条件：0 元订单、超大金额、负库存、重复请求

    只关注正确性问题，忽略安全和性能。`,
    { label: 'correctness-review', schema: { type: 'array', items: FINDING_SCHEMA } },
  ),
)

log(`安全 Agent 发现 ${securityFindings.length} 个问题`)
log(`性能 Agent 发现 ${performanceFindings.length} 个问题`)
log(`正确性 Agent 发现 ${correctnessFindings.length} 个问题`)
```

**为什么要限定"只关注 X"**：Agent 的审查范围很容易漂移。一个审查安全的 Agent 可能顺手指出性能问题，但这不是它的职责，反而可能导致遗漏本应关注的安全问题。明确限定范围能让每个 Agent 更聚焦。

### Step 2：三个 Agent 并行返回的审查报告

执行后，三个 Agent 几乎同时开始工作，先完成的先吐结果。

**安全 Agent 的输出**（发现 3 个问题，其中 1 个 critical）：

```text title="Agent: security-review"
[
  {
    "severity": "critical",
    "category": "security",
    "file": "src/services/payment-service.ts",
    "line": 142,
    "title": "SQL 注入风险——拼接用户输入构造查询",
    "description": "processRefund() 方法中直接拼接 refundId 到 SQL 查询字符串：`SELECT * FROM payments WHERE id = '${refundId}'`。攻击者可通过构造 refundId 值执行任意 SQL。",
    "suggestion": "改用参数化查询：`db.query('SELECT * FROM payments WHERE id = ?', [refundId])`"
  },
  {
    "severity": "high",
    "category": "security",
    "file": "src/services/payment-service.ts",
    "line": 89,
    "title": "日志泄露支付回调原始 body（含 card token）",
    "description": "handleCallback() 中 logger.info('callback received', req.body) 将第三方回调的完整请求体输出到日志，其中可能包含 card_token、customer_id 等敏感字段。",
    "suggestion": "对敏感字段做脱敏后再记录：logger.info('callback received', { orderId: body.order_id, status: body.status })"
  },
  {
    "severity": "medium",
    "category": "security",
    "file": "src/services/payment-service.ts",
    "line": 210,
    "title": "createOrder() 中金额参数未做服务端校验",
    "description": "客户端传入的 amount 字段直接用于创建支付单，未验证是否为正数、是否在合理范围内。攻击者可将 amount 改为 0 或负数绕过支付。",
    "suggestion": "添加服务端金额校验：amount > 0 && amount <= MAX_ORDER_AMOUNT"
  }
]
```

**性能 Agent 的输出**（发现 2 个问题）：

```text title="Agent: performance-review"
[
  {
    "severity": "high",
    "category": "performance",
    "file": "src/services/payment-service.ts",
    "line": 78,
    "title": "N+1 查询——循环内逐条查询支付记录",
    "description": "getUserPaymentHistory() 中对每个订单 ID 循环调用 db.getPayment()，当用户有 N 笔订单时执行 N+1 次数据库查询。在用户有 200 笔订单时，会产生 201 次 DB 往返。",
    "suggestion": "使用批量查询：`db.getPaymentsByOrderIds(orderIds)`，一次查询返回所有结果。或使用 JOIN 在一趟 SQL 中完成。"
  },
  {
    "severity": "medium",
    "category": "performance",
    "file": "src/services/payment-service.ts",
    "line": 165,
    "title": "退款通知同步等待第三方 API 响应导致请求阻塞",
    "description": "notifyRefundResult() 中 await thirdPartyApi.notify() 未设置超时，第三方响应慢时会长时间占用请求线程。在退款高峰期可能导致请求堆积。",
    "suggestion": "添加超时控制 `Promise.race([notify(), timeout(5000)])` 或将通知改为异步队列处理。"
  }
]
```

**正确性 Agent 的输出**（发现 2 个问题）：

```text title="Agent: correctness-review"
[
  {
    "severity": "critical",
    "category": "correctness",
    "file": "src/workers/inventory-worker.ts",
    "line": 34,
    "title": "并发库存超卖——read-check-write 非原子操作",
    "description": "deductInventory() 先 SELECT 查库存，再判断库存是否充足，最后 UPDATE 扣减。三步不是原子的，并发场景下多个请求同时通过库存检查，导致超卖。当前实现无悲观锁、无乐观锁、无 Redis 原子操作。",
    "suggestion": "使用乐观锁：`UPDATE inventory SET stock = stock - ? WHERE sku = ? AND stock >= ?`（WHERE 条件保证原子性）。或使用 Redis DECR + 判断返回值。"
  },
  {
    "severity": "high",
    "category": "correctness",
    "file": "src/services/payment-service.ts",
    "line": 120,
    "title": "支付回调未做幂等处理",
    "description": "handleCallback() 直接处理回调结果并更新支付状态，未检查该支付单是否已处理。第三方可能因网络重试发送重复回调，导致同一笔支付被处理多次（重复扣库存/发货）。",
    "suggestion": "基于 payment_id + status 做幂等判断：已终态的支付单直接返回成功，不再处理。可使用数据库唯一约束 + INSERT IGNORE 或 Redis SETNX。"
  }
]
```

### Step 3：Adversarial Verify —— 对每个发现反向确认

AI 审查可能误报——把不是问题的地方当问题，或者过度解读一段正常的代码。adversarial verify 的做法是：对每个发现启动 3 个独立 Agent，要求它们**默认判定为"不真实"，除非代码中确实存在该问题**。只有至少 2 票确认真实才保留。

```javascript
// verify-findings.workflow.js
export const meta = {
  name: 'verify-findings',
  description: '对抗验证：3 个 Agent 独立尝试证伪每个发现',
  phases: [{ title: 'Verify' }],
}

phase('Adversarial Verify')

const allFindings = [
  ...securityFindings.map((f) => ({ ...f, source: 'security' })),
  ...performanceFindings.map((f) => ({ ...f, source: 'performance' })),
  ...correctnessFindings.map((f) => ({ ...f, source: 'correctness' })),
]

const confirmed = []

for (const finding of allFindings) {
  const votes = await parallel(
    Array.from({ length: 3 }, () => () =>
      agent(
        `你的任务是**证伪**以下审查发现。默认判定为"不真实"，除非你从源代码中找到确凿证据：

        问题：${finding.title}
        描述：${finding.description}
        位置：${finding.file}:${finding.line}
        建议：${finding.suggestion}

        请阅读源码，验证：
        1. 问题描述是否准确反映了代码的实际行为？
        2. 行号是否正确？
        3. 是否是误报（代码上下文中有防御措施，或根本不存在该问题）？

        给出明确结论：isReal（boolean）、reason（理由）、evidence（引用具体代码行）。`,
        { label: `verify:${finding.file}:${finding.line}`, schema: VERDICT_SCHEMA },
      ),
    ),
  )

  const realVotes = votes.filter(Boolean).filter((v) => v.isReal).length
  if (realVotes >= 2) {
    confirmed.push(finding)
    log(`✅ 确认：${finding.title}（${realVotes}/3 确认真实）`)
  } else {
    log(`❌ 证伪：${finding.title}（${realVotes}/3 确认真实，判定为误报）`)
  }
}

log(`\n共 ${allFindings.length} 个审查发现，${confirmed.length} 个确认真实，${allFindings.length - confirmed.length} 个被证伪`)
```

**验证结果示例**：

```text title="Verify 输出"
[verify:payment-service.ts:78]   ✅ 确认：N+1 查询（3/3 确认真实）
[verify:payment-service.ts:142] ✅ 确认：SQL 注入风险（3/3 确认真实）
[verify:payment-service.ts:210] ❌ 证伪：金额参数未校验（0/3 —— 代码第 205 行已有 validateAmount() 调用，Agent 漏看了）
[verify:inventory-worker.ts:34] ✅ 确认：并发库存超卖（3/3 确认真实）
[verify:payment-service.ts:120] ✅ 确认：支付回调未做幂等（2/3 确认真实，1 票认为第三方 SDK 内部有重试去重）
[verify:payment-service.ts:89]  ✅ 确认：日志泄露敏感信息（3/3 确认真实）
[verify:payment-service.ts:165] ✅ 确认：退款通知无超时（2/3 确认真实）

共 7 个审查发现，6 个确认真实，1 个被证伪
```

:::info
被证伪的那个"金额参数未校验"是个典型场景：Agent 看到了 `createOrder()` 内部拼接金额但没注意到前面第 205 行已经调了 `validateAmount()`。如果没有 adversarial verify，这个误报就可能进入修复清单，浪费开发时间。
:::

### Step 4：聚合确认后的 Findings → 生成修复任务清单

确认后的 6 个问题按严重程度和类别整理成可执行的修复任务：

```javascript
// aggregate-tasks.workflow.js
phase('Aggregate')

const sorted = confirmed.sort((a, b) => {
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
  return severityOrder[a.severity] - severityOrder[b.severity]
})

log('## 修复任务清单\n')
log('| Severity | Category | Issue | Verified | Assignee |')
log('| -------- | -------- | ----- | -------- | -------- |')
for (const f of sorted) {
  log(`| ${f.severity} | ${f.category} | ${f.title} | ${f.votes || '3/3'} | TBD |`)
}
```

最终输出的修复任务清单：

| Severity | Category | Issue | Verified | Assignee |
| -------- | -------- | ----- | -------- | -------- |
| critical | security | SQL 注入风险——拼接用户输入构造查询 | 3/3 | @backend-lead |
| critical | correctness | 并发库存超卖——read-check-write 非原子操作 | 3/3 | @inventory-team |
| high | performance | N+1 查询——循环内逐条查询支付记录 | 3/3 | @backend-lead |
| high | correctness | 支付回调未做幂等处理 | 2/3 | @backend-lead |
| high | security | 日志泄露支付回调原始 body | 3/3 | @backend-lead |
| medium | performance | 退款通知同步等待第三方 API 无超时 | 2/3 | @backend-lead |

:::warning
severity 为 critical 的两个问题（SQL 注入和并发超卖）应该在 CI 中设为 **blocking**——未修复阻止合并。high 和 medium 级别的可以允许在后续迭代中修复，但需要建 ticket 跟踪。
:::

## 要点总结

1. **维度独立才 parallel**：安全、性能、正确性三者彼此不依赖，天然适合并行。如果维度之间有依赖（比如需要先定位安全问题再分析其性能影响），就该用 `pipeline()` 串行。

2. **adversarial verify 比单次审查可靠**：单次审查的误报率不可忽视，用 3 个独立 Agent 反向确认、多数投票机制，能将误报控制在很低的水平。被证伪的不等于 Agent 能力差——可能就是代码上下文复杂导致漏看。

3. **用 Schema 统一输出格式**：`FINDING_SCHEMA` 让三个不同维度的 Agent 输出同一种结构，后续的 verify 和 aggregate 阶段才能统一处理。没有 Schema 的话，Agent A 输出 Markdown 列表、Agent B 输出 JSON、Agent C 输出自然语言，后续处理会非常痛苦。

4. **parallel 不等所有完成才出结果**：先完成的 Agent 先返回，你可以先消费安全报告，与此同时性能和正确性 Agent 还在跑。这种"边看边等"的体验比阻塞等待所有完成好得多。

5. **让 Agent 聚焦而非全能**：每个 Agent 的 prompt 中明确写了"只关注 X，忽略 Y"。一个试图同时审安全性+性能+正确性的 Agent 往往三个维度都没审透——术业有专攻，分工才有深度。

## 变体与延伸

### CI 中集成自动审查

将上述 Workflow 脚本集成到 CI 流程中，每次 PR 自动触发：

```bash
claude run parallel-review.workflow.js --output review-report.json
```

配合 severity 等级设置 CI 门禁：`critical` 和 `high` 级别的问题阻止合并，`medium` 和 `low` 只做告警。

### 多项目批量审查

对于微服务架构中的多个支付相关服务（payment-service、billing-service、invoice-service），可以外层再套一层 parallel：

```javascript
const results = await parallel(
  () => agent('审查 billing-service 的支付相关模块', { label: 'review:billing' }),
  () => agent('审查 invoice-service 的支付相关模块', { label: 'review:invoice' }),
  // payment-service 自己就是一个 3-Agent 的 parallel
)
```

每个服务内部的审查也是 parallel 的——形成"外层 parallel 串项目，内层 parallel 串维度"的两层并行结构。

### 结合预定义 subagent type

如果你的团队在 `.claude/agents/` 下定义了专门的审查 Agent 类型（如 `security-auditor`、`perf-analyzer`），可以直接指定 subagent_type 而非手写 prompt：

```javascript
const [securityFindings, performanceFindings, correctnessFindings] = await parallel(
  () => agent(
    '审查 src/services/payment-service.ts',
    { subagent_type: 'security-auditor', schema: { type: 'array', items: FINDING_SCHEMA } },
  ),
  () => agent(
    '审查 src/services/payment-service.ts',
    { subagent_type: 'perf-analyzer', schema: { type: 'array', items: FINDING_SCHEMA } },
  ),
  () => agent(
    '审查 src/services/payment-service.ts',
    { subagent_type: 'code-reviewer', schema: { type: 'array', items: FINDING_SCHEMA } },
  ),
)
```

预定义 Agent 封装了团队积累的审查经验（checklist、常见误报过滤、项目特定的安全策略），比每次手写 prompt 更稳定。

---

**下一篇**：[流水线开发流程](/agents/pipeline-workflow) —— 看 `pipeline()` 如何把设计、实现、测试、审查串成一条自动化流水线。

### 相关场景

- [Agent 代码审查](./agent-code-review) — Schema 驱动的结构化审查
- [Subagent 类型](./subagent-types) — 预定义 Agent 类型
- [自愈循环](./self-healing-loop) — 自动修复 + 审查的闭环
