---
title: 自循环自修复 — Agent 持续找 Bug 修到干净
description: 用 loop-until-dry 模式对遗留代码 2000 行 legacy-order-service.ts 持续审查修复，每轮发现新问题直到连续 2 轮无新发现，像剥洋葱一样层层深入
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★★☆    |
| 🧪 测试 | ★★★★★  | ★★★★☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握 loop-until-dry 自修复模式，能独立编排持续审查修复循环，对遗留代码进行系统性质量提升

**🚀 AI 能力提升：** 循环审查、自修复
:::

## 场景概述

你接手了一个遗留订单服务 `legacy-order-service.ts`，2000 行 TypeScript，三年间经手过五个开发者，注释稀少、类型标注不全、测试覆盖率 23%。上线以来积压了 40+ 个偶发 bug 工单——偶尔丢单、超时重试后库存被扣两次、特定边界条件下金额计算差 1 分。团队不敢大改：上次"小重构"直接导致线上 P1 事故，回滚花了 4 小时。

这种情况用一次性审查根本不可能找全所有问题——改完一个 bug 往往会暴露出之前被它掩盖的另一个。自循环模式（loop-until-dry）的思路是：让 Agent 反复对代码做"审查 → 修复 → 验证"，每一轮都基于上一轮修复后的干净代码再审，直到连续 N 轮不再发现新问题。像剥洋葱一样，外层修好了才能看到里层。

## 为什么用自循环

遗留代码最危险的不是已知 bug，而是未知 bug 之间的**相互掩盖关系**：

- **空指针 NPE** 导致某段业务逻辑从未执行，该逻辑内的**边界条件**（如除零、负数金额）被永久隐藏
- **内存泄漏**让缓存越来越大，掩盖了**缓存失效策略**的缺陷——缓存从不失效也"刚好能用"
- **硬编码的降级逻辑**覆盖了正常流程的错误分支，没人发现那里的事务边界从未正确回滚

一次性审查的困境在于：Agent 同时面对所有问题，但代码的"现状"本身就包含多层 bug 的叠加态。修复表层 bug 后，代码状态变了，深层问题才会显现。

自循环模式解决了这个经典难题：

1. **逐层暴露**：每轮只审查当前状态的代码，修复后进入下一轮
2. **质量收敛**：连续 N 轮（dry threshold）无新发现即停止，防止无限循环
3. **渐进安全**：每轮修复范围小、可验证，降低一次改太多引入回归的风险

:::tip 类比：洗脏窗户
自循环就像反复擦窗户。第一遍去掉大块污渍，发现底下还有指纹；第二遍擦掉指纹，发现玻璃有划痕——每多擦一遍，看到的问题就更细微。擦到某遍觉得"已经透亮了"，就可以停手。
:::

## 前置准备

开始之前需要准备三样东西：

**1. 遗留服务源码**

目标文件 `src/services/legacy-order-service.ts`，约 2000 行。核心模块包括订单校验、库存扣减、支付回调、金额计算、重试队列。

**2. 现有测试覆盖情况**

```text
Tests:       47 passed (47)
Coverage:    23.4% (lines), 18.1% (branches)
```

测试集中在金额计算和入口校验，库存扣减和支付回调路径几乎无覆盖。好消息是现有测试全部通过——这意味着测试本身就代表了当前"正确的行为基准"。

**3. Dry threshold 设为 2**

`dry threshold = 2` 表示连续 2 轮审查没有发现新问题时停止。这是一个平衡选择：

| threshold | 适用场景                                 |
| --------- | ---------------------------------------- |
| 1         | 已知问题明确、代码规模小（< 500 行）     |
| **2**     | **遗留代码中等规模、未知风险多（推荐）** |
| 3         | 核心资金链路、安全敏感代码               |

设 2 是成本和安全的平衡——多一轮验证避免"修完又冒出新的"，但不会陷入无限循环。

## 完整交互过程

### Step 1：Round 1 —— Agent 审查

将源码和现有测试一起交给 Agent，要求它进行一次完整的代码审查，输出结构化发现列表。

```text
🤖 Round 1 审查开始 — 扫描 legacy-order-service.ts（2000 行）

发现 5 个问题：

🔴 Critical #1 — 空指针风险 (Line 847)
  calcShippingFee() 未校验 address 是否为 null/undefined。
  当订单为虚拟商品时 address 为空，导致 `Cannot read property 'zip' of null`。
  这是线上偶发丢单的根因之一。

🟠 High #2 — 竞态条件 (Line 612)
  deductInventory() 先读后写，无锁机制。
  库存扣减过程中可被并发请求插入，导致超卖。
  线上时有"扣了两次库存"的投诉与此一致。

🟠 High #3 — 内存泄漏 (Line 1123)
  paymentCallbackHandler 中每次回调存入 `pendingCallbacks` Map，
  但成功的回调只标记 status 不删除 entry。服务运行 48h 后 Map 可达 50K+ 条目。

🟡 Medium #4 — 硬编码配置 (Line 178)
  超时重试次数 `maxRetries = 3` 直接写在代码中，
  生产环境因下游慢需要 5 次重试，目前靠运维手动改代码部署。

🟢 Low #5 — 注释过时 (Line 423)
  `// TODO: migrate to v2 API (2023-Q2)` — v2 API 已废弃，注释误导新人。
```

:::info 审查策略
Agent 的审查覆盖了四个维度：运行时安全（#1, #3）、并发正确性（#2）、可运维性（#4）、可维护性（#5）。这是遗留给力的审查思路——不仅找 bug，还要找"将来会成为 bug 的东西"。
:::

### Step 2：Round 1 修复与验证

Agent 逐条修复每个问题，修复后立即运行测试确保不引入回归。

```typescript
// #1 空指针修复 — add null guard
function calcShippingFee(order: Order): number {
  if (!order.address) {
    return 0; // 虚拟商品免运费
  }
  const base = getBaseRate(order.address.zip);
  return applyDiscounts(base, order);
}
```

```text
Tests: 47 passed (no regression)
```

```typescript
// #2 竞态条件修复 — 悲观锁
async function deductInventory(sku: string, qty: number): Promise<void> {
  const affected = await db.query('UPDATE inventory SET stock = stock - $1 WHERE sku = $2 AND stock >= $1', [qty, sku]);
  if (affected === 0) throw new InsufficientStockError(sku);
}
```

```text
Tests: 47 passed (no regression)
```

```typescript
// #3 内存泄漏修复 — 清理已完成回调
class PaymentCallbackRegistry {
  handleCallback(id: string, result: CallbackResult): void {
    // ...process callback...
    this.pendingCallbacks.delete(id); // 成功后清理
  }
}
```

```text
Tests: 47 passed (no regression)
```

```typescript
// #4 硬编码修复 — 提取为环境变量
const maxRetries = parseInt(process.env.ORDER_MAX_RETRIES || '3', 10);
```

```typescript
// #5 注释修复 — 更新为当前准确信息
// API v3 — migrated 2024-Q1. See docs/order-api-v3.md
```

```text
🧪 Round 1 修复验证：47 tests passed, 0 failed, 0 new flaky
✅ Round 1 完成 — 5 issues fixed
```

### Step 3：Round 2 —— 基于修复后代码再审

Agent 以 Round 1 修复后的代码为新基线，再次审查。那些被空指针和内存泄漏掩盖的深层问题开始浮现。

```text
🤖 Round 2 审查开始 — 扫描修复后的 legacy-order-service.ts

发现 3 个新问题：

🟠 High #6 — 缓存击穿风险 (Line 894)
  空指针修复后 calcShippingFee() 正常执行 → 触发内部缓存查询。
  缓存使用惰性加载，key 过期后无回源锁。并发请求同时回源，
  导致下游运费服务被打崩。

🟡 Medium #7 — 事务边界缺失 (Line 659)
  竞态条件修复引入的 SQL 原子操作正常工作，
  但它周围还有一个包裹层 createOrder() 在调用 deductInventory 早于 insertOrder：
  库存扣了但订单记录未插入时，数据库崩溃会造成"库存少了但查不到订单"的幽灵扣减。
  这个问题一直存在，但之前被 #2 的竞态掩盖（库存经常超卖，反而"补"上了幽灵扣减）。

🟡 Medium #8 — 重试风暴 (Line 195)
  maxRetries 解开硬编码后暴露了重试策略缺陷：
  每次重试间隔固定 1s，无退避。5 次重试 = 5s 阻塞，前端超时断开。
```

:::warning 剥洋葱效应的典型体现
注意 #7 —— 事务边界问题一直存在于代码中，但之前被竞态条件"对冲"了：库存多扣和幽灵扣减在统计上互相抵消。这恰恰说明为什么必须逐轮审查：一次性审查时 Agent 看到的是"有竞态的版本"，无法预判修复竞态后会暴露什么。
:::

### Step 4：Round 2 修复与验证

```typescript
// #6 缓存回源锁
async function getCachedRate(zip: string): Promise<Rate> {
  const cached = await cache.get(zip);
  if (cached) return cached;

  // 获取回源锁，避免缓存击穿
  const lockKey = `lock:rate:${zip}`;
  const locked = await cache.setNX(lockKey, '1', { ttl: 5 });
  if (!locked) {
    await sleep(100); // 等待第一个请求完成
    return getCachedRate(zip);
  }

  try {
    const rate = await fetchRateFromProvider(zip);
    await cache.set(zip, rate, { ttl: 3600 });
    return rate;
  } finally {
    await cache.del(lockKey);
  }
}
```

```typescript
// #7 事务边界修复 — 库存扣减移到订单插入之后，并用同一事务包裹
async function createOrder(order: Order): Promise<void> {
  const tx = await db.beginTransaction();
  try {
    await tx.insertOrder(order); // 先创建订单记录
    await tx.deductInventory(order.sku, order.qty); // 再扣库存
    await tx.commit();
  } catch (e) {
    await tx.rollback();
    throw e;
  }
}
```

```typescript
// #8 指数退避
async function retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number, baseDelay = 200): Promise<T> {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === maxRetries) throw e;
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 100;
      await sleep(delay);
    }
  }
}
```

```text
🧪 Round 2 修复验证：47 tests passed, 8 new tests added (缓存、事务、重试相关), 55 passed total
✅ Round 2 完成 — 3 issues fixed
```

### Step 5：Round 3 —— Dry Run

Agent 进行第三轮审查。经过两轮修复，代码质量已经大幅提升。

```text
🤖 Round 3 审查开始 — 扫描修复后的 legacy-order-service.ts

Review complete.

Severity breakdown:
  Critical: 0
  High:     0
  Medium:   0
  Low:      0

No new findings. Code looks solid. All previously identified issues have been resolved
and verified. The test coverage has increased significantly, providing a good safety net
for future changes.

✅ 连续 2 轮无新发现（Round 2 之后又验证了 Round 3），dry threshold = 2 已满足，循环终止。
```

### Step 6：完整修复报告

**各轮次汇总**

| 轮次     | 发现  | 修复  | Critical | High  | Medium | Low   |
| -------- | ----- | ----- | -------- | ----- | ------ | ----- |
| Round 1  | 5     | 5     | 1        | 2     | 1      | 1     |
| Round 2  | 3     | 3     | 0        | 1     | 2      | 0     |
| Round 3  | 0     | 0     | 0        | 0     | 0      | 0     |
| **合计** | **8** | **8** | **1**    | **3** | **3**  | **1** |

**测试覆盖变化**

```text
修复前：  Lines 23.4%  |  Branches 18.1%  |  Tests 47
修复后：  Lines 78.2%  |  Branches 65.7%  |  Tests 86
```

测试增加了 39 个用例，覆盖了新增的错误处理路径（空指针守卫）、并发场景（锁竞争测试）、重试退避（时序验证）和事务回滚（故障注入）。

**Commit History**

```text
a1b2c3d fix(order): add null guard for shipping address              ← Round 1 #1
d4e5f6g fix(order): use atomic SQL for inventory deduction           ← Round 1 #2
h7i8j9k fix(order): cleanup completed payment callbacks              ← Round 1 #3
l0m1n2o refactor(order): extract maxRetries to env config            ← Round 1 #4
p3q4r5s docs(order): update stale API migration comment              ← Round 1 #5
t6u7v8w fix(order): add cache backfill lock to prevent thundering    ← Round 2 #6
x9y0z1a fix(order): wrap createOrder in transaction boundary         ← Round 2 #7
b2c3d4e fix(order): implement exponential backoff for retries        ← Round 2 #8
```

每个 commit 单独可 revert，遵循"修复一个就提交一个"的原则——这也符合自循环的逐轮提交节奏。

## 要点总结

1. **Dry threshold 设 2 是平衡点**：设 1 可能漏掉修复暴露的新问题；设 3 在非核心模块上成本过高。2 是经过实践验证的"再确认一轮就够了"的值。

2. **每轮改完必须跑测试**：修复可能引入回归，尤其遗留代码的测试覆盖率低。每轮 Fix → Test → Pass 的循环比 Fix All → Test All 安全得多——出问题立刻知道是哪个修复导致的。

3. **用 `budget.remaining()` 控制循环**：在实现中，每轮审查前检查 token 预算。如果预算不足下一轮，应终止循环并提示人工审查。防止 3000 行代码自循环耗尽配额。

4. **遗留代码质量提升是渐进的**：不要期望一轮自循环把覆盖从 23% 提到 80%。这个例子中，测试是伴随修复逐步写的——修空指针时加 null 测试，修竞态时加并发测试。自然而然地覆盖就上去了。

5. **修复顺序有讲究**：先修 Critical（阻断性），再修 High（有隐患但目前运行），最后修 Medium/Low。这个顺序确保每轮发现的问题中，最严重的先被修复，下一轮审查基于更干净的代码。

## 变体与延伸

**新功能开发中的自循环**

自循环不仅适用于遗留代码修复。在新功能开发中，可以让 Agent 先写完初版代码，然后自循环审查："审查这段新写的代码 → 发现问题 → 修复 → 再审"。相当于在提交前做一次自动化的 code review，尤其适合单人开发没有 reviewer 的场景。

**CI 中的 Nightly Self-Healing**

可以在 CI pipeline 中配置一个 nightly job：每天凌晨对核心模块自动执行一轮 loop-until-dry，发现新问题自动创建 issue 并打标签 `auto-detected`。这相当于一个永不疲倦的代码审查机器人，持续守护代码质量。

```yaml
# .github/workflows/nightly-self-healing.yml
name: Nightly Self-Healing
on:
  schedule:
    - cron: '0 2 * * *' # 每天凌晨 2 点

jobs:
  self-heal:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          claude -p "对 src/core/ 执行 /loop 自审查，dry threshold = 2。发现问题后逐个修复并验证测试，
            全部修复完成后创建 issue 汇总发现，打标签 auto-detected。" \
            --allowedTools "Read,Write,Edit,Bash,Grep,Glob" \
            --permission-mode plan
```

**结合 code-reviewer Subagent**

可以将审查者角色抽象为一个 subagent type，让主循环只负责编排，具体审查工作交给专门的 code-reviewer agent。

```text
主循环伪代码：
  while (round < maxRounds && budget.remaining() > safeThreshold) {
    findings = spawn code-reviewer(target: file, severity: 'critical|high|medium')
    if (findings.length === 0) {
      dryCount++
      if (dryCount >= dryThreshold) break
      continue
    }
    dryCount = 0
    for (finding of findings) {
      fixAndTest(finding)
    }
    round++
  }
```

这种模式让审查逻辑和修复逻辑解耦，code-reviewer 可以有自己的 system prompt（更保守的修复建议、必须引用代码行号等），而主循环专注于流程控制。

:::tip 实践中注意
自循环不是银弹。对于架构层面的问题（如"整个服务应该拆成三个微服务"），Agent 的逐行审查通常不会发现——它需要人工识别。自循环擅长的是**在当前架构范围内**让代码更安全、更正确。
:::

### 相关场景

- [并行审查](./parallel-review) — 多维度并行审查工作流
- [大规模迁移](./large-scale-migration) — Discover + Fan-out 批量迁移
- [全栈验证交付](./fullstack-verify-deliver) — 审查 + 验证 + 交付流水线
