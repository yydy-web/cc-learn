---
title: Agent 代码审查 — 用 Schema 让审查结果结构化
description: 定义 JSON Schema 约束 Agent 审查输出，对支付接口、订单状态机、库存扣减三个模块做安全/性能/正确性/可维护性四维审查，输出结构化报告
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★★  | ★★★★☆    |
| 📦 产品 | ★★☆☆☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握 Schema 驱动的结构化审查，能独立定义审查维度、让 Agent 输出可审计的结构化报告

**🚀 AI 能力提升：** 结构化输出、代码审查
:::

## 场景概述

你刚完成一个电商支付链路 PR，涉及三个核心文件：`payment.ts`（支付接口，对接第三方网关）、`order-state.ts`（订单状态机，管理 pending/paid/cancelled/refunded 转换）、`inventory.ts`（库存扣减，确保超卖不会发生）。三个模块逻辑紧密耦合——支付成功要触发状态变更、状态变更要驱动库存扣减——任何一个环节的疏忽都可能导致资金损失或数据不一致。

传统人工审查依赖审查者的经验和注意力：有经验的同事可能一眼看出支付回调的幂等性问题，但对状态机中某个冷门转换路径的遗漏却容易忽视。更麻烦的是，审查结论没有统一格式——这次用文字描述、下次用 checklist、再下次可能只是一句 LGTM——事后根本没法追溯"这个 PR 到底审查了什么"。

Schema 驱动审查的核心思路是：**你把审查维度写成一份 JSON Schema，Agent 按 Schema 逐项输出，每一条发现都有统一的 severity、category、文件位置、问题描述和修复建议**。审查结果变成一份可审计的结构化报告，而不是一段随意的主观评价。

## 为什么用 Schema 驱动审查

| 对比维度 | 人工审查 | Schema 驱动审查 |
| -------- | -------- | ---------------- |
| 一致性 | 依赖个人风格，同组两人结论可能完全不同 | Schema 强制统一输出格式，每次审查覆盖相同维度 |
| 完整性 | 容易遗漏非功能需求（安全、性能） | Schema 枚举 category 保证安全/性能/正确性/可维护性全覆盖 |
| 可审计 | 评论散落在 PR 各处，事后难以追溯 | 一份 JSON 报告存 repo，随时回溯审查决策 |
| 可复用 | 每个 PR 重新开始 | Schema 一次定义，所有同类 PR 复用 |
| 反馈速度 | 等同事有空 | Agent 秒级完成初筛，人只做确认 |

用 JSON Schema 约束 Agent 输出，本质上是在和 Agent 签一份"输出合同"：你规定了输出的结构和枚举值，Agent 就不能自由发挥——不会把 severity 写成 `'严重'` 而不是 `'Critical'`，不会漏掉 performance 维度的检查。这也让后续的自动处理成为可能（比如只提取 severity=Critical 的条目自动加入 CI 阻断规则）。

:::tip
Schema 的枚举约束是"防 Agent 自由发挥"的关键。如果你只用自然语言说"审查代码并报告问题"，Agent 可能输出一堆有价值的分析——但格式千奇百怪，下游工具无法消费。Schema 把这个过程变成了**结构化 API 调用**。
:::

## 前置准备

项目结构如下：

```text
src/
├── payment/
│   └── payment.ts        # 支付接口：createOrder, verifyCallback, processRefund
├── order/
│   └── order-state.ts    # 订单状态机：StateMachine 类，含 4 状态 + 6 转移规则
├── inventory/
│   └── inventory.ts      # 库存扣减：deduct, rollback, reserve
└── review/
    ├── review-schema.json # 审查 Schema（你定义）
    └── review-report.json # Agent 输出（每次审查生成）
```

审查维度覆盖四个领域：

- **security**：注入攻击、敏感数据泄露、权限校验缺失、回调签名验证
- **performance**：重复查询、N+1 问题、缺少缓存、事务粒度过大
- **correctness**：边界条件、异常处理、幂等性、状态机死锁
- **maintainability**：硬编码魔法数字、函数过长、命名不清晰、缺少类型约束

## 完整交互过程

### Step 1：定义审查 Schema

首先需要把审查维度转化为 JSON Schema。以下是审查报告的核心结构：

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "required": ["findings", "summary", "reviewedAt"],
  "properties": {
    "findings": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["severity", "category", "file", "line", "summary", "suggestion"],
        "properties": {
          "severity": {
            "type": "string",
            "enum": ["Critical", "High", "Medium", "Low"]
          },
          "category": {
            "type": "string",
            "enum": ["security", "performance", "correctness", "maintainability"]
          },
          "file": {
            "type": "string",
            "description": "文件路径，相对于项目根目录"
          },
          "line": {
            "type": "number",
            "description": "问题所在行号"
          },
          "summary": {
            "type": "string",
            "maxLength": 200,
            "description": "问题简要描述"
          },
          "suggestion": {
            "type": "string",
            "description": "修复建议，含代码示例"
          }
        }
      }
    },
    "summary": {
      "type": "object",
      "required": ["total", "bySeverity", "byCategory"],
      "properties": {
        "total": { "type": "number" },
        "bySeverity": {
          "type": "object",
          "properties": {
            "Critical": { "type": "number" },
            "High": { "type": "number" },
            "Medium": { "type": "number" },
            "Low": { "type": "number" }
          }
        },
        "byCategory": {
          "type": "object",
          "properties": {
            "security": { "type": "number" },
            "performance": { "type": "number" },
            "correctness": { "type": "number" },
            "maintainability": { "type": "number" }
          }
        }
      }
    },
    "reviewedAt": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

在 CC 中，把 Schema 和审查指令一起给 Agent：

```bash
# 使用 --review-schema 指定审查规则（假设已配置自定义 slash command）
/review --schema src/review/review-schema.json src/payment src/order src/inventory
```

或者直接在对话中附上 Schema 文件和审查范围：

```text
请按照 src/review/review-schema.json 定义的 Schema，审查以下文件的变更：
- src/payment/payment.ts
- src/order/order-state.ts
- src/inventory/inventory.ts

对每个文件，按 security/performance/correctness/maintainability 四个维度逐行检查，
输出严格的 JSON 格式，schema 中的 required 字段必须全部填写。
```

### Step 2：Agent 按 Schema 审查

Agent 读取三个文件后，按 Schema 输出结构化报告。以下是简化版报告示例（实际报告包含 12 条发现，这里摘录 4 条代表性条目）：

```text title="Agent 审查输出（部分）"
{
  "findings": [
    {
      "severity": "Critical",
      "category": "security",
      "file": "src/payment/payment.ts",
      "line": 47,
      "summary": "verifyCallback 未验证支付平台签名，攻击者可伪造回调请求直接修改订单状态",
      "suggestion": "在 verifyCallback 函数开头添加签名验证逻辑。示例：\nconst isValid = crypto.createHmac('sha256', SECRET_KEY)\n  .update(JSON.stringify(body))\n  .digest('hex') === headers['x-signature']\nif (!isValid) throw new PaymentVerificationError('Invalid signature')"
    },
    {
      "severity": "High",
      "category": "performance",
      "file": "src/inventory/inventory.ts",
      "line": 32,
      "summary": "deduct 函数在 forEach 循环中逐条执行数据库查询，100 个商品会产生 100 次 SQL",
      "suggestion": "将多次单条 UPDATE 合并为一条批量操作：\nawait db.query(\n  'UPDATE inventory SET stock = stock - ? WHERE product_id IN (?)',\n  [quantities, productIds]\n)"
    },
    {
      "severity": "High",
      "category": "correctness",
      "file": "src/order/order-state.ts",
      "line": 89,
      "summary": "paid -> refunded 转移未判断 refund 是否已全额完成，部分退款场景下会错误进入 refunded 状态",
      "suggestion": "在 transfer 方法中添加金额校验：\ncase 'refunded':\n  if (!order.refundAmount || order.refundAmount < order.totalAmount) {\n    throw new StateTransferError('Refund not fully completed')\n  }\n  break"
    },
    {
      "severity": "Medium",
      "category": "maintainability",
      "file": "src/payment/payment.ts",
      "line": 15,
      "summary": "支付渠道类型用字符串字面量 'alipay'/'wechat'/'unionpay'，新增渠道需侵入所有 switch 分支",
      "suggestion": "使用策略模式 + 枚举重构：\nenum PaymentChannel { Alipay = 'alipay', Wechat = 'wechat', Unionpay = 'unionpay' }\nconst processors: Record<PaymentChannel, PaymentProcessor> = { ... }"
    }
  ],
  "summary": {
    "total": 12,
    "bySeverity": { "Critical": 2, "High": 4, "Medium": 4, "Low": 2 },
    "byCategory": { "security": 3, "performance": 2, "correctness": 5, "maintainability": 2 }
  },
  "reviewedAt": "2026-07-06T10:30:00Z"
}
```

:::info
Agent 输出的 severity 和 category 都严格匹配 Schema 中的 enum 约束。如果 Agent 试图输出 `"category": "bug"`，JSON Schema 校验阶段就会失败——这就是用 Schema 做"输出合同"的价值。
:::

### Step 3：人工逐条确认

拿到结构化报告后，逐条 review 每个 finding，按以下四类打标：

| 标记 | 含义 | 后续动作 |
| ---- | ---- | -------- |
| `confirmed` | 确认为有效问题 | 进入修复队列 |
| `false-positive` | Agent 误报 | 记录原因，加入排除规则 |
| `fixed` | 已在当前 PR 中修复 | 仅留存审计记录 |
| `deferred` | 问题存在但优先级低 | 创建 backlog task，后续处理 |

审核确认过程同样可以交给 Agent 加速——把报告中的每条 finding 和对应的代码上下文一起给 Agent，让 Agent 逐条给出"是否误报"的判断：

```text
对 review-report.json 中的每一条 finding，检查对应文件的对应行，
判断该发现是否属实。对误报请说明原因。
```

Agent 会在每个 finding 上追加 `status` 和 `reviewComment` 字段，人工只需复核 Agent 的判断——尤其对 Critical/High 级别的条目做二次确认。

### Step 4：生成修复 PR

确认后的 findings 可以直接驱动 Agent 生成修复代码：

```text
根据 review-report.json 中 status=confirmed 的 findings，
逐条修复对应文件的问题。每修复一条，先展示 diff 供我确认。
```

Agent 会逐条处理，以下是 Step 2 中 Critical 问题的修复 diff 示例：

```typescript title="src/payment/payment.ts (diff)"
// 修复前：verifyCallback 直接信任回调内容
function verifyCallback(body: CallbackBody): void {
  const order = await Order.findById(body.orderId)
  await order.updateStatus(body.status)  // 危险：未验证签名
}

// 修复后：先验证签名再处理
function verifyCallback(body: CallbackBody, headers: Record<string, string>): void {
+ const secret = getConfig('PAYMENT_SECRET_KEY')
+ const expected = crypto.createHmac('sha256', secret)
+   .update(JSON.stringify(body))
+   .digest('hex')
+
+ if (!crypto.timingSafeEqual(
+   Buffer.from(headers['x-signature'] || ''),
+   Buffer.from(expected)
+ )) {
+   throw new PaymentVerificationError('Signature verification failed')
+ }
+
  const order = await Order.findById(body.orderId)
  await order.updateStatus(body.status)
}
```

:::tip
建议让 Agent 先输出全部 diff、人工过一遍，再一次性 apply——逐条 apply 容易在修改相邻行时产生冲突。也可以用 `git stash` 暂存每次修复，最后 `git stash pop` 统一确认。
:::

## 要点总结

1. **Schema 是输出合同**：定义 fields、required、enum 约束后，Agent 的输出格式被严格锁定，下游工具（CI、报表、审计系统）可以放心消费
2. **枚举约束避免自由发挥**：`severity` 只有 Critical/High/Medium/Low 四档，`category` 只有四类——如果 Agent 写了 `"category": "bug"`，JSON 校验直接失败
3. **审查报告存 repo 做审计**：`review-report.json` 随 PR 一起合入，半年后回顾"这个 payment 模块当时为什么会这样写"时，有完整的审查决策链
4. **Critical 必须修，Low 可推迟**：用 severity 做优先级分流，Critical 直接阻断合并、Low 转 backlog——避免"修完所有 minor 问题 PR 改动了 2000 行"的困境
5. **Schema 可迭代演进**：初次使用时维度可能不全，运行几次后发现常见的漏审模式后，把新维度加进 Schema——这是审查能力的持续积累

## 变体与延伸

**API 文档审查**：换一套 Schema，把 category 改为 `completeness`（字段是否完整）/`accuracy`（类型是否准确）/`consistency`（与实现是否一致），让 Agent 逐条比对接口文档和实际代码。

**配置文件审查**：针对 Dockerfile、k8s YAML、CI 配置定义 Schema——检查端口暴露、资源限制、镜像版本锁定、密钥硬编码等问题。这类审查规则相对固定，适合写成 Schema 后跑在 CI 中做 pre-merge 检查。

**多个 PR 批量审查**：同一个 Schema 对多个 PR 输出多份报告后，可以聚合分析——哪些文件被频繁标记 Critical、哪个维度的 Low 问题堆积最多——从中发现团队的技术债务热点区域，指导下一步重构优先级。
