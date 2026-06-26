---
title: Feature Dev — 7 阶段引导式功能开发
description: Feature Dev 是 Anthropic 官方插件，用 7 阶段工作流 + 3 种并行 Agent 确保每个功能从需求到交付都经过结构化流程
---

# Feature Dev — 7 阶段引导式功能开发

> 不直接从第 1 行代码开始。先搞清楚要做什么、怎么做、做完有没有 bug。

## 概述

**Feature Dev** 是 Anthropic 官方出品的功能开发插件（89,000+ 安装），把一个功能开发拆成 7 个阶段。不是让你多填表——是让 3 种并行 Agent（探索者、架构师、审查者）在各自阶段替你干活。

AI 写代码最大的问题不是"写不对"，是**方向跑偏**。你说"加个用户认证"，AI 直接开始写 `AuthController.java`——没看过现有代码、没想过跟你已有的中间件怎么配合、没确认你要 OAuth 还是 JWT。写到一半发现跟你已有的权限系统冲突，推倒重来。

Feature Dev 在 AI 动手之前，先用 2-3 个 code-explorer 把现有代码摸一遍，用 2-3 个 code-architect 出三套方案让你选，最后用 3 个 code-reviewer 交叉审查。

**核心数据**：7 阶段工作流、3 种专用 Agent、89K+ 安装、并行探索+并行审查。

## 核心理念：先想清楚，再动手

```
普通 Claude Code 流程：
  你说 → AI 写 → 你发现不对 → AI 改 → 你发现又不对 → 推倒重来

Feature Dev 流程：
  你说 → 需求澄清（Phase 1）→ 
    代码探索（Phase 2，2-3 Agent 并行）→ 
      追问确认（Phase 3）→ 
        方案对比（Phase 4，3 套方案选一）→ 
          你批准 → 实现（Phase 5）→ 
            交叉审查（Phase 6，3 Agent 并行）→ 
              总结交付（Phase 7）
```

区别：前 4 个阶段都在**想**。只有你批准了方案，第 5 阶段才**写**。

## 安装

```bash
/plugin marketplace add anthropics/claude-code
/plugin install feature-dev@claude-plugins-official
```

重启 Claude Code，验证：

```bash
/feature-dev --help
```

或直接启动：

```bash
/feature-dev
```

## 使用方式

### 7 个阶段

| 阶段 | 做什么 | 谁干活 |
|------|--------|--------|
| **1. Discovery** | 搞清楚你到底要什么 | Claude + 你 |
| **2. Codebase Exploration** | 摸清现有代码和模式 | 2-3 `code-explorer` Agent 并行 |
| **3. Clarifying Questions** | 边缘情况、错误处理、兼容性 | Claude 追问，你回答 |
| **4. Architecture Design** | 三套方案对比 | 2-3 `code-architect` Agent 并行 |
| **5. Implementation** | **你批准后**才写代码 | Claude |
| **6. Quality Review** | 交叉审查 | 3 `code-reviewer` Agent 并行 |
| **7. Summary** | 总结改了什么、为什么 | Claude |

### 三种专用 Agent

| Agent | 职责 | 并行数 |
|-------|------|--------|
| `code-explorer` | 追踪执行路径、映射架构层、找关键文件 | 2-3 |
| `code-architect` | 各出一套方案：最简改动 / 整洁架构 / 务实折中 | 2-3 |
| `code-reviewer` | 三个维度：简洁度 / bug / 规范 | 3 |

审查结果带**置信度评分**（≥80 分才标记为问题），避免误报。

### 适用场景

| 场景 | 适合 | 跳过的理由 |
|------|------|-----------|
| 多文件改动 | ✅ 能自动探索依赖 | — |
| 架构决策 | ✅ 3 套方案对比 | — |
| 复杂需求 | ✅ 需求澄清避免跑偏 | — |
| 单行 bug 修 | ❌ | 插件自动跳过 |
| 改配置 | ❌ | 不需要工作流 |

## 日常使用

### Java 示例

**场景**：给一个 Spring Boot 电商项目加"优惠券"功能。

```bash
/feature-dev 添加优惠券功能：用户下单时可以使用优惠券抵扣金额
```

**Phase 1-2：需求澄清 + 代码探索**

Feature Dev 派出 3 个 code-explorer 并行扫描：

```text
explorer-1: 订单模块
  OrderService.submit() → 创建订单 → 计算总价
  Order entity: id, userId, items, totalAmount, status

explorer-2: 用户模块
  User entity: id, name, memberLevel
  已有 UserCoupon 实体（空表，未使用！）

explorer-3: 支付模块
  PaymentService.pay() → 接收 finalAmount
  关键：支付前 finalAmount 已经锁定，优惠券需要在计算 finalAmount 之前生效
```

**Phase 3：追问确认**

```text
Claude: 发现 UserCoupon 实体已经存在但未使用。确认几个问题：

1. 优惠券类型有哪些？（满减 / 折扣 / 免邮）
2. 一个订单能用多张券吗？
3. 优惠券互斥规则？（比如满减和折扣不能叠加）
```

你回答后进入 Phase 4。

**Phase 4：三套方案**

```text
方案 A（Minimal Changes）:
  直接在 OrderService.submit() 里加 couponId 参数，
  计算 totalAmount 之前 apply 优惠券。
  改动：2 文件，~40 行。

方案 B（Clean Architecture）:
  新建 CouponService + CouponStrategy 策略模式。
  满减策略、折扣策略、免邮策略各一个实现类。
  改动：6 文件，~200 行。

方案 C（Pragmatic Balance）【推荐】:
  CouponService 处理券校验和计算，但不拆策略模式。
  优惠券逻辑集中在一个类，用 switch/case 区分类型。
  改动：3 文件，~120 行。
  理由：当前只有 3 种券，策略模式过度设计。类型超 5 种再拆。

选哪个？
```

你选了 C，Phase 5 开始写代码：

```java
// CouponService.java
@Service
public class CouponService {

    public BigDecimal applyCoupon(Long couponId, BigDecimal originalAmount) {
        UserCoupon coupon = userCouponRepo.findById(couponId)
            .orElseThrow(() -> new CouponNotFoundException(couponId));

        if (!coupon.isValid()) {
            throw new CouponExpiredException(couponId);
        }

        return switch (coupon.getType()) {
            case FULL_REDUCTION -> applyFullReduction(coupon, originalAmount);
            case DISCOUNT -> applyDiscount(coupon, originalAmount);
            case FREE_SHIPPING -> applyFreeShipping(coupon, originalAmount);
        };
    }

    private BigDecimal applyFullReduction(UserCoupon c, BigDecimal amount) {
        return amount.compareTo(c.getThreshold()) >= 0
            ? amount.subtract(c.getDiscountAmount())
            : amount;  // 未达门槛
    }

    private BigDecimal applyDiscount(UserCoupon c, BigDecimal amount) {
        return amount.multiply(c.getDiscountRate());  // 0.85 = 85折
    }

    private BigDecimal applyFreeShipping(UserCoupon c, BigDecimal amount) {
        // 标记免邮，金额不变
        return amount;
    }
}
```

**Phase 6：交叉审查**

3 个 code-reviewer 并行审：

```text
reviewer-1 (simplicity): ✅ 代码简洁，switch/case 够用
reviewer-2 (bugs): ⚠️ 满减未处理负数（券面额 > 订单金额时 amount 为负）
reviewer-3 (conventions): ✅ 异常类型、日志、命名一致
```

发现一个 bug：满减后金额可能为负。Phase 5 追加修复：

```java
private BigDecimal applyFullReduction(UserCoupon c, BigDecimal amount) {
    if (amount.compareTo(c.getThreshold()) < 0) return amount;
    BigDecimal after = amount.subtract(c.getDiscountAmount());
    return after.max(BigDecimal.ZERO);  // 修正：不小于 0
}
```

**Phase 7：总结**

```text
Feature: 优惠券功能
改动: CouponService.java (+95行), OrderService.java (+12行)
风险: 支付前 finalAmount 计算链需要回归测试
建议: 类型超过 5 种后拆策略模式
```

### Vue 示例

**场景**：给一个 Vue 3 后台加"批量操作"功能。

```bash
/feature-dev 添加表格批量操作：选中多行后可以批量删除、批量导出、批量改状态
```

**Phase 2：代码探索**

```text
explorer-1: 表格组件 → 已有 BaseTable.vue，支持 selection type
explorer-2: API 层 → 列表接口 /api/users?page=&size=，删除 /api/users/:id
explorer-3: Store → useTableStore 管理选中行，已有 selectedRows
```

**Phase 4：方案对比**

```text
方案 A: 在每页的 Table 组件内部加操作栏 → 改动最小，但 15 个页面都要各改一次
方案 B: 抽 BatchActionBar 组件 → 改一次 BaseTable，所有页面自动继承  
方案 C: [推荐] 方案 B + 批量 API 统一封装 → 加 BatchApiService，避免重复写批量请求
```

**Phase 5：实现**

```vue
<!-- BatchActionBar.vue -->
<template>
  <div v-if="selectedCount > 0" class="batch-bar">
    <span class="batch-count">已选 {{ selectedCount }} 项</span>
    <div class="batch-actions">
      <button
        v-for="action in availableActions"
        :key="action.key"
        class="batch-btn"
        :class="action.variant"
        @click="$emit('action', action.key)"
      >
        <component :is="action.icon" class="btn-icon" />
        {{ action.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedCount: { type: Number, required: true },
  availableActions: { type: Array, required: true }
})
defineEmits(['action'])
</script>

<style scoped>
.batch-bar {
  position: fixed;
  bottom: 0;
  left: var(--sidebar-width);
  right: 0;
  height: 56px;                    /* 不小于 44px */
  background: var(--surface);
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  z-index: 50;                     /* z-index 管理层级 */
  animation: slideUp 200ms ease-out;
}
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .batch-bar { animation: none; }
}
</style>
```

**Phase 6：审查发现**

```text
reviewer-2 (bugs): ⚠️ 批量删除前缺确认弹窗——破坏性操作需要 confirm
```

补上确认逻辑。

## 实战场景：大功能改造——重构支付模块

### 场景

你的电商系统要把支付从"单一微信支付"改成"微信+支付宝+银行卡"多渠道。

### 你怎么操作（对话流程）

```bash
/feature-dev 支付模块支持多渠道：微信、支付宝、银行卡。需要策略模式路由，保留现有微信支付的逻辑。
```

### 工作流过程

**Phase 2（代码探索）**：3 个 explorer 并行扫描现有的 PaymentService、订单回调、退款流程。发现了一个你没提到的依赖——退款也耦合了微信支付的 `refund()` 调用。

**Phase 3（追问）**：Claude 主动问——"退款是否也需要支持多渠道？当前退款硬编码了微信 API。"

**Phase 4（方案）**：

```text
方案 A: 只改支付，退款不动 → 改动小，但半年后还得改退款
方案 B: 支付+退款一起改 → 一次到位，但改动范围大
方案 C [推荐]: 支付先改（急），退款建抽象接口留好扩展点 → 改动适中，退款后续改
```

你选 C。

**Phase 5（实现）**：自动发现 PaymentService 里所有耦合微信的地方，逐一解耦成 `PaymentChannel` 接口。你的微信逻辑一行没丢——只是变成了接口的一个实现。

**Phase 6（审查）**：3 个 reviewer 交叉审——发现退款回调的 URL 硬编码还在用微信的参数名。修了。

**结果**：一个碰了 12 个文件的重构，没有遗漏依赖，没有破坏现有逻辑，没有劣化退款。

## 最佳实践

### 什么时候用

| 场景 | 适合 | 不适合 |
|------|------|--------|
| 新功能（多文件） | ✅ | — |
| 重构/架构调整 | ✅ | — |
| 需求不明确 | ✅ Phase 3 追问帮你理清 | — |
| 单行修 bug | — | ❌ 插件自动跳过 |
| 紧急热修复 | — | ❌ 别走流程，直接改 |

### 与 Superpowers 的区别

Feature Dev 是**功能开发**流程，Superpowers 是**工程纪律**流程。两者互补：

```text
Superpowers /brainstorm → 理清需求方向
      ↓
Feature Dev → 7 阶段结构化实现
      ↓
Superpowers /code-review → 最终审查
```

## 常见问题

### 7 个阶段会不会太慢？

对简单任务会自动跳过——你改一行配置，Feature Dev 不会拉你走 7 个阶段。对复杂任务，前 4 个阶段省的返工时间远大于花的时间。

### 三套方案我必须选一套吗？

你可以选一套、让 Claude 合并两套的优点、或者自己提第四套方向。

### 和直接用 Claude Code 有什么区别？

直接用的风险是方向跑偏——AI 写完你才发现不对。Feature Dev 在动手前把方向确认了两遍（探索现有代码 + 方案对比）。
