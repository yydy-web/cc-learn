---
title: Agency Agents — Agent 场景实战
description: 13 个真实场景案例，从单 Agent 任务委派到全流程自动化交付，掌握 Claude Code 多 Agent 协作能力
pageType: doc
---

# Agency Agents — Agent 场景实战

> 13 个真实场景，从零掌握 Claude Code 多 Agent 能力。

## 分组导航

### 🧩 单 Agent 能力

把复杂任务拆给 Agent，让 AI 替你跑腿。

- [单 Agent 任务委派](./single-agent-task) — `agent()` 基础调用、上下文隔离、子任务拆分
- [Agent 自主调研](./agent-research) — Agent + WebFetch/WebSearch，自主搜索汇总
- [Agent 代码审查](./agent-code-review) — Schema 结构化输出、多维度审查报告

### 🤝 多 Agent 协作

多个 Agent 并行或流水线协作，成倍提速。

- [并行多维度审查](./parallel-review) — `parallel()`、adversarial verify，安全+性能+可维护性同时审
- [流水线开发流程](./pipeline-workflow) — `pipeline()`，设计→实现→测试→审查接力
- [Worktree 隔离并行开发](./worktree-isolation) — Agent isolation、多 feature 并行无冲突
- [Subagent Types 组合](./subagent-types) — 预定义 agent 类型、审查+重构+测试组合

### ⚙️ 工程化编排

大规模项目中的 Agent 编排模式。

- [大规模代码迁移](./large-scale-migration) — discover → fan-out → verify → synthesize
- [Judge Panel 技术决策](./judge-panel) — 多方案独立生成→评分→合成最优
- [自循环自修复](./self-healing-loop) — loop-until-dry，Agent 持续找 bug→修→再审查

### 🚀 全流程实战

从需求到交付，端到端串联所有 Agent 能力。

- [需求调研与方案设计](./fullstack-requirements) — brainstorm → 需求拆解 → 方案对比 → 技术选型
- [并行开发与集成](./fullstack-development) — 方案拆分 → 多 Agent 并行编码 → 集成合并
- [审查验证与交付](./fullstack-verify-deliver) — 多维度审查 → 端到端验证 → deliver checklist

## 学习建议

| 你的水平 | 推荐路径 |
|---------|---------|
| 🟢 刚接触 Agent，没用过 `agent()` | 按顺序读「单 Agent 能力」3 篇，理解 Agent 基本概念 |
| 🟡 用过 `agent()`，想学编排 | 直接跳「多 Agent 协作」，重点读 parallel 和 pipeline 两篇 |
| 🔴 已经在写 Workflow 脚本 | 看「工程化编排」的 judge panel 和自循环，学高级模式 |
| 🟣 要做完整项目 | 「全流程实战」3 篇是完整端到端示范，先通读再动手 |

:::tip
这 13 篇场景案例**独立成篇**，不需要按顺序读。遇到哪个场景的需求就看哪篇。
:::
