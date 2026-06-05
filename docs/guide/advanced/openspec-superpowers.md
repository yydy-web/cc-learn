---
title: OpenSpec + Superpowers 双层规划
description: 使用 OpenSpec 锁定架构契约、Superpowers 驱动执行落地的企业级双层规划工作流
---

# OpenSpec + Superpowers 双层规划

对于中大型项目，单一工具往往不够。OpenSpec 负责**顶层架构规划**（做什么），Superpowers 负责**执行细节落地**（怎么做），两者形成双层规划模式。

## 为什么需要双层规划

| 问题                         | 只用 OpenSpec            | 只用 Superpowers         | 双层规划                    |
| ---------------------------- | ------------------------ | ------------------------ | --------------------------- |
| 架构一致性                   | ✅ 规格文档锁定契约      | ❌ 头脑风暴可能偏离方向  | ✅ OpenSpec 锁定架构        |
| 执行纪律                     | ❌ `/opsx:apply` 无 TDD  | ✅ 强制 TDD + 代码审查   | ✅ Superpowers 驱动执行     |
| 需求变更                     | ✅ 增量提案              | ❌ 需要重新设计          | ✅ OpenSpec 增量 + Superpowers 重新执行 |
| 长期维护                     | ✅ 规格是活文档          | ❌ 过程是临时的          | ✅ 规格持久化 + 执行纪律    |

:::tip
双层规划的核心思想：**OpenSpec 定"契约"，Superpowers 管"执行"**。架构一旦锁定，Superpowers 的所有实现都必须匹配 OpenSpec 的规格，不许擅自修改结构。
:::

## 适用场景

- 多模块、接口复杂的中大型工程
- 需要长期迭代维护的项目
- 多人协作、需要统一架构规范的团队
- 对接口契约和数据结构有严格要求的企业级项目

## 七步工作流

以"企业级 Express 接口限流中间件"为例：

### 第一步：OpenSpec 锁定架构契约

```text
> /opsx:propose 设计企业级限流中间件，定义配置结构、接口类型、错误规范、模块拆分
```

产出：
- 完整模块架构划分（配置模块、限流计算模块、异常模块）
- 固定数据结构、入参出参、错误码、字段约束
- 顶层宏观实现方案，形成不可随意变更的技术契约

### 第二步：Superpowers 细化执行计划

基于已固化的架构契约，Superpowers 将宏观设计拆解为可逐条执行的开发任务：

```text
> /superpowers:writing-plans
> 基于 OpenSpec 的架构规范，拆分最小执行开发步骤
```

产出：
- 目录结构创建顺序
- 模块编码优先级
- 依赖注入与集成顺序
- 单元测试编写节点
- 集成调试里程碑

### 第三步：TDD 驱动编码

```text
> /superpowers:subagent-driven-development
```

严格依照细化步骤，逐模块创建文件、编写代码，所有实现严格匹配 OpenSpec 架构规范。

### 第四步：系统化调试

```text
> /superpowers:systematic-debugging
> 高并发下限流统计异常
```

定位代码问题，修改后校验是否符合原始架构契约。

### 第五步：TDD 加固

```text
> /superpowers:test-driven-development
> 限流核心计算逻辑的边界测试
```

为核心模块编写边界测试，保证架构设计的功能稳定性。

### 第六步：代码审查

```text
> /superpowers:requesting-code-review
```

校验代码与 OpenSpec 架构规范一致性，统一代码规范。

### 第七步：归档

```text
> /opsx:archive
```

将最终架构规范、接口文档、代码实现永久归档，作为后续迭代的唯一依据。

## 双层规划的关系

```text
OpenSpec（顶层）                    Superpowers（执行层）
  ┌─────────────────┐                ┌─────────────────┐
  │  /opsx:propose  │  锁定架构契约  │  /writing-plans │  拆解执行步骤
  │  specs/         │ ─────────────→ │  plans/         │
  │  design.md      │                │  TDD + 审查     │
  │  tasks.md       │                │  验证 + 收尾    │
  └─────────────────┘                └─────────────────┘
        ↓ 归档                              ↓ 代码
  openspec/specs/                     src/ + tests/
  （活文档，描述系统现状）            （可运行的代码）
```

1. **OpenSpec** 负责定大方向，解决项目"做成什么样"
2. **Superpowers** 负责拆小动作，解决代码"按什么顺序写"
3. 两层规划互不冲突，架构稳定且落地可控

## 相关资源

- [OpenSpec 规格驱动开发](/guide/advanced/openspec) — OpenSpec 完整文档
- [Superpowers 插件](/guide/advanced/superpowers) — Superpowers 完整文档
- [最佳实践：四阶段工作流](/tips/best-practices) — 更多工具组合场景
