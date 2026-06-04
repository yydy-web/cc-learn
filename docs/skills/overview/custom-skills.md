---
title: 自定义技能
description: 创建和使用自定义 Skills 扩展 Claude Code 的能力
---

# 自定义技能

Skills 是 Claude Code 的扩展机制，让你可以封装常用的工作流程。

## 什么是 Skill

Skill 是一个 Markdown 文件，定义了 Claude Code 在特定场景下应该遵循的指令。它可以：

- 封装复杂的工作流程
- 提供领域特定的知识
- 标准化团队的最佳实践

## 使用内置 Skills

Claude Code 有一些内置的 Skills，通过斜杠命令调用：

```
> /superpowers:brainstorming
> /superpowers:writing-plans
> /superpowers:test-driven-development
```

## 创建自定义 Skill

### 文件结构

在 `.agents/skills/` 目录下创建 Skill 文件：

```
.agents/
└── skills/
    └── my-skill/
        └── SKILL.md
```

### Skill 文件格式

```markdown
---
name: my-skill
description: 一行描述这个 Skill 的用途
---

# Skill 标题

详细的指令内容...

## 步骤

1. 第一步做什么
2. 第二步做什么
3. ...
```

### 示例：代码审查 Skill

```markdown
---
name: code-review
description: 按照团队规范审查代码改动
---

# 代码审查

按照以下维度审查代码改动：

## 审查清单

### 1. 代码质量
- [ ] 命名是否清晰
- [ ] 是否有重复代码
- [ ] 函数是否过长（超过 50 行考虑拆分）

### 2. 安全性
- [ ] 是否有硬编码的密钥或密码
- [ ] SQL 查询是否使用参数化
- [ ] 用户输入是否做了验证

### 3. 性能
- [ ] 是否有不必要的循环
- [ ] 数据库查询是否合理（避免 N+1）
- [ ] 大数据量场景是否考虑分页

### 4. 测试
- [ ] 新功能是否有测试
- [ ] 边界条件是否覆盖
- [ ] 错误场景是否测试

## 输出格式

按严重程度分类列出问题：
- 🔴 严重：必须修复
- 🟡 建议：建议改进
- 🟢 优秀：值得表扬的做法
```

## Skill 最佳实践

1. **单一职责**：一个 Skill 做一件事
2. **明确指令**：步骤要具体，避免模糊描述
3. **提供示例**：给出输入输出的例子
4. **保持更新**：随着项目演进更新 Skill 内容

:::info
想发现更多社区 Skills？[CC-Switch](/guide/advanced/cc-switch) 内置 Skills 市场，可以浏览和一键安装来自 GitHub 的社区技能。
:::

:::info
想要一套完整的结构化开发工作流？[Superpowers](/guide/advanced/superpowers) 插件为 Claude Code 提供了从头脑风暴到代码审查的 14 个专业 Skills。
:::

## 使用 Skill

在对话中通过斜杠命令调用：

```
> /code-review
> 帮我审查一下最近的改动
```

或者让 Claude Code 自动选择：

```
> 帮我按照团队规范审查这段代码
```

Claude Code 会根据描述自动匹配合适的 Skill。

:::tip
本页属于[技能系统](/skills/)的一部分。查看更多 Skills 资源：[技能市场](/skills/overview/skills-marketplace) | [Superpowers](/skills/workflow/superpowers) | [Gstack](/skills/workflow/gstack)
:::

## 下一步

- [技能市场](/skills/overview/skills-marketplace) — 浏览和安装社区 Skills
- [Superpowers 插件](/skills/workflow/superpowers) — 14 个结构化开发 Skills
- [Gstack 工具包](/skills/workflow/gstack) — 23+ 个工程团队 Skills
- [多智能体工作流](/guide/advanced/multi-agent) — 编排多个 Agent 协作完成复杂任务
- [自动化与 CI/CD](/guide/advanced/automation) — 在自动化流程中使用 Claude Code
