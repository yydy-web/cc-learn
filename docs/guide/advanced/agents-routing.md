---
title: AGENTS 全局路由协议
description: 当 Superpowers 和 Gstack 同时安装时，通过全局路由协议避免工具冲突，定义明确的分工与优先级
---

# AGENTS 全局路由协议

当你的 Claude Code 同时安装了多个 Skill 框架（如 [Superpowers](/guide/advanced/superpowers) 和 [Gstack](/guide/advanced/gstack)），它们可能会"打架"——都想接管任务，都自动触发，互相覆盖默认行为。全局路由协议通过在 `AGENTS.md` 中定义**优先级层级**和**职责边界**来解决这个问题。

## 核心原则

### 优先级层级（从高到低）

| 优先级    | 来源                   | 说明                     |
| --------- | ---------------------- | ------------------------ |
| 1（最高） | 用户当前轮次的明确指令 | 用户直接指定使用哪个工具 |
| 2         | 项目级 `AGENTS.md`     | 项目仓库中的路由规则     |
| 3         | 全局 `AGENTS.md`       | 用户目录下的默认规则     |
| 4（最低） | 插件/Skill 默认行为    | 安装时的初始配置         |

当两个框架对同一个任务都声称"我来处理"时，按优先级裁决。**用户指令永远优先。**

### 单主导原则

每一轮对话中，**只能有一个主流程框架**接管控制。另一个框架只能作为补充能力出现。

```text
✅ 正确：Superpowers 负责规划和实现 → 调用 Gstack 的 /qa 做浏览器测试
❌ 错误：Gstack 接管了实现计划，又调用 Superpowers 重新规划
```

:::warning
这条规则是硬性的。如果 Gstack 正在执行浏览器测试，Superpowers 不能"抢回"控制权去重新头脑风暴。反之亦然。
:::

## 职责分工

### Superpowers：通用研发工作流框架（默认主导）

Superpowers 是**默认的主流程框架**，负责：

| 场景                       | 对应 Skill                       |
| -------------------------- | -------------------------------- |
| 需求不明确，需要探索       | `brainstorming`                  |
| 方向已定，需要拆分实现计划 | `writing-plans`                  |
| 新功能开发或逻辑重写       | `test-driven-development`        |
| 遇到 Bug、异常、状态漂移   | `systematic-debugging`           |
| 完成前的证据验证           | `verification-before-completion` |
| 大任务拆分给多个子智能体   | `subagent-driven-development`    |

### Gstack：专项能力框架（补充角色）

Gstack 提供 Superpowers 没有的**专项工程能力**：

| 场景            | 对应 Skill                                |
| --------------- | ----------------------------------------- |
| 浏览器测试与 QA | `/qa`、`/qa-only`                         |
| 端到端测试      | `/qa`（内置 Playwright）                  |
| 上线前/后验证   | `/land-and-deploy`、`/canary`             |
| 性能基准测试    | `/benchmark`                              |
| 安全审计        | `/cso`                                    |
| 设计审查        | `/design-review`、`/plan-design-review`   |
| 发布与 PR 流程  | `/ship`                                   |
| 文档生成        | `/document-generate`、`/document-release` |

### 路由决策树

遇到任务时，按以下逻辑选择框架：

```text
这个任务需要什么？
  ├─ 需求探索、设计讨论、写规格   → Superpowers: brainstorming
  ├─ 拆分实现计划                 → Superpowers: writing-plans
  ├─ TDD 编码、功能实现           → Superpowers: test-driven-development
  ├─ Bug 排查、系统化调试         → Superpowers: systematic-debugging
  ├─ 浏览器 QA、E2E 测试         → Gstack: /qa
  ├─ 安全审计                    → Gstack: /cso
  ├─ 设计审查                    → Gstack: /design-review
  ├─ 性能基准                    → Gstack: /benchmark
  ├─ 发布上线                    → Gstack: /ship
  └─ 不确定                      → 默认 Superpowers（它是通用框架）
```

:::tip
经验法则：**编码阶段用 Superpowers，交付阶段用 Gstack**。Superpowers 管"怎么写代码"，Gstack 管"代码怎么上线"。
:::

## 七大审查视角

Gstack 的路由协议定义了 7 个**命名审查视角**（Named Review Perspectives）。这些不是"角色扮演"，而是**分析镜片**——每个视角关注代码的不同维度。

| 视角        | 名称      | 关注维度                       | 典型问题                                 |
| ----------- | --------- | ------------------------------ | ---------------------------------------- |
| 🔧 实现质量 | Benjamin  | 代码是否正确实现了规格         | "这个错误处理路径覆盖了吗？"             |
| 🏗️ 架构边界 | Noah      | 模块间耦合和职责分离           | "这个函数是否越权访问了其他模块的数据？" |
| 💥 失败场景 | Lucas     | 竞态条件、异常路径、降级策略   | "并发写入时会丢失数据吗？"               |
| 📚 外部事实 | Harper    | 引用的外部 API/文档是否准确    | "这个第三方 API 的版本对吗？"            |
| ⚡ 性能并发 | Henry     | 性能瓶颈、并发安全、资源管理   | "N+1 查询在这里会发生吗？"               |
| 📊 交易结构 | William   | 信号定义、交易逻辑、策略边界   | "这个入场条件是否精确量化了？"           |
| 📈 统计验证 | Charlotte | 过拟合风险、样本量、统计显著性 | "这个回测结果的夏普比率在样本外稳定吗？" |

### 如何使用审查视角

在代码审查时，可以指定一个或多个视角：

```text
> 从 Lucas（失败场景）和 Henry（性能并发）视角审查 src/sync/service.ts
```

Claude Code 会分别从这两个维度分析代码，各自独立提出问题，最后汇总。

:::info
前 4 个视角（Benjamin、Noah、Lucas、Harper）适用于**任何项目**。后 3 个（Henry、William、Charlotte）更偏向性能敏感和量化交易领域，普通项目可以忽略。
:::

## 配置 AGENTS.md

在项目根目录创建 `AGENTS.md`，定义路由规则：

```markdown
# AGENTS.md — 全局路由协议

## 主流程框架

- 默认主框架：Superpowers
- 补充框架：Gstack

## 路由规则

1. 需求探索、设计、计划、编码、调试 → Superpowers 主导
2. 浏览器 QA、安全审计、性能基准、发布 → Gstack 主导
3. 每轮只允许一个主框架接管
4. 用户明确指定时，以用户指令为准

## 审查视角

- 常规项目：Benjamin（实现质量）、Noah（架构边界）、Lucas（失败场景）、Harper（外部事实）
- 性能敏感项目：增加 Henry（性能并发）
- 量化交易项目：增加 William（交易结构）、Charlotte（统计验证）

## 响应要求

- 语言：中文（简体）
- 风格：直接、简洁，不废话
- 代码注释：英文
```

### 全局 vs 项目级

| 级别 | 文件位置                   | 作用范围             |
| ---- | -------------------------- | -------------------- |
| 全局 | `~/.AGENTS.md`             | 所有项目的默认规则   |
| 项目 | `<project-root>/AGENTS.md` | 仅当前项目，覆盖全局 |

:::tip
建议先在全局 `~/.AGENTS.md` 中设置通用规则（默认用 Superpowers、中文回复），然后在每个项目的 `AGENTS.md` 中按需覆盖（如量化项目增加 William 和 Charlotte 视角）。
:::

## 冲突解决

### 常见冲突场景

| 冲突                      | 原因                 | 解决方案                                       |
| ------------------------- | -------------------- | ---------------------------------------------- |
| 两个框架都自动触发        | 都匹配了当前任务     | 按单主导原则，选择主框架；另一个作为补充调用   |
| 审查结果不一致            | 不同视角看到不同问题 | 不冲突——每个视角的问题都有效，分别处理         |
| 用户指令与 AGENTS.md 冲突 | 用户优先级更高       | 以用户指令为准，不修改 AGENTS.md               |
| 两个框架都想写文件        | 文件修改权限冲突     | 只有主框架可以修改源码；补充框架只能读取和建议 |

### 禁止行为

- 不要在同一轮中让两个框架交替接管
- 不要让补充框架覆盖主框架的设计决策
- 不要在没有用户明确要求时自动切换主框架

## 相关资源

- [Superpowers 插件](/guide/advanced/superpowers) — 通用研发工作流框架
- [Gstack 工具包](/guide/advanced/gstack) — 专项工程能力框架
- [OpenSpec + Superpowers 双层规划](/guide/advanced/openspec-superpowers) — 双层规划工作流
- [SDD 方法论与工具辨析](/guide/advanced/sdd-guide) — SDD 三层模型和工具选择
- [最佳实践](/tips/best-practices) — 四阶段工作流和业务场景

## 下一步

- [SDD 方法论与工具辨析](/guide/advanced/sdd-guide) — 理解 SDD、OpenSpec、Spec-Kit、Superpowers 的关系
- [OpenSpec + Superpowers 双层规划](/guide/advanced/openspec-superpowers) — 企业级双层规划工作流
- [最佳实践：四阶段工作流](/tips/best-practices) — 将路由协议融入完整开发流程
