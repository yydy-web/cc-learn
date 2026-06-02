---
title: 多智能体工作流
description: 编排多个 Claude Code Agent 协作完成复杂任务
---

# 多智能体工作流

对于复杂的任务，Claude Code 可以启动多个 Agent 并行或串行工作。

## 什么是多智能体

多智能体是指 Claude Code 启动多个独立的 Agent 实例，每个 Agent 负责不同的子任务。它们可以：

- **并行执行**：同时处理多个独立的任务
- **流水线执行**：前一个 Agent 的输出作为下一个的输入
- **分工协作**：不同 Agent 专注于不同的维度

## 使用场景

### 并行代码审查

多个 Agent 从不同维度同时审查代码：

```
> 用 3 个 Agent 分别从性能、安全性和可维护性三个维度审查 src/api/ 目录的代码
```

### 流水线处理

```
> 第一个 Agent 分析项目结构，第二个 Agent 根据分析结果生成文档，第三个 Agent 审查文档质量
```

### 大规模重构

```
> 把这个单体应用拆分成微服务，每个服务由一个独立的 Agent 负责重构
```

## 工作流脚本

对于复杂的多步骤工作流，可以编写 Workflow 脚本：

```javascript
export const meta = {
  name: 'review-and-fix',
  description: '审查代码并自动修复问题',
  phases: [
    { title: '审查', detail: '多维度代码审查' },
    { title: '修复', detail: '自动修复发现的问题' },
    { title: '验证', detail: '运行测试验证修复' },
  ],
};

const issues = await agent('审查 src/ 目录下的代码，找出所有问题');
await pipeline(
  issues,
  issue => agent(`修复这个问题: ${issue.description}`),
  fix => agent(`运行测试验证修复: ${fix.file}`)
);
```

## Agent 工具

在工作流中，Agent 可以使用以下工具：

- `agent()` — 启动一个新的子 Agent
- `parallel()` — 并行执行多个任务
- `pipeline()` — 流水线执行多个阶段
- `phase()` — 定义工作流阶段
- `log()` — 输出进度信息

## 注意事项

- 每个 Agent 都会消耗 token，注意控制成本
- Agent 之间是独立的，不能直接共享状态
- 对于简单任务，单个 Agent 就够了，不需要多智能体
- 建议先用 `/plan` 模式规划，再决定是否需要多智能体

## 下一步

- [自动化与 CI/CD](/guide/advanced/automation) — 在自动化流程中使用 Claude Code
- [命令参考](/commands/) — 查看所有可用命令
