---
title: 什么是 Claude Code
description: 了解 Claude Code 是什么、它的核心能力和设计理念，以及与其他 AI 编程工具的区别。帮助你判断 Claude Code 是否适合自己或团队的开发场景。
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★☆  | ★☆☆☆☆    |
| 🧪 测试 | ★★★☆☆  | ★☆☆☆☆    |
| 📦 产品 | ★★★★★  | ★☆☆☆☆    |

**🎯 学习产出：** 了解 Claude Code 的核心能力和使用场景，能判断是否适合自己或团队

**🚀 AI 能力提升：** 上下文管理
:::

# 什么是 Claude Code

Claude Code 是 Anthropic 推出的命令行 AI 编程助手。它直接运行在你的终端中，能够理解你的整个代码库，并通过自然语言对话帮你完成编程任务。

## 核心能力

### 代码理解

Claude Code 不是简单的代码补全工具。它会主动阅读你的项目文件、理解代码结构和依赖关系，然后基于完整的上下文给出回答。

```text
> 帮我解释一下 src/core/engine.ts 中的执行流程
```

### 代码编辑

你可以用自然语言描述想要的修改，Claude Code 会直接编辑文件。它遵循你项目中已有的代码风格和约定。

```text
> 在 UserService 中添加一个 resetPassword 方法，发送重置邮件并更新数据库
```

### 命令执行

Claude Code 可以运行终端命令，包括测试、构建、Git 操作等。它会根据命令输出做出判断和后续操作。

```text
> 跑一下测试，如果有失败的就修复它们
```

### Git 集成

从创建分支、提交代码到创建 PR，Claude Code 可以帮你完成整个 Git 工作流。

```text
> 从 main 创建一个 feature/user-auth 分支，实现 JWT 认证，然后提交 PR
```

## 与其他工具的区别

| 特性       | Claude Code       | IDE 插件          | ChatGPT/Claude 网页版 |
| ---------- | ----------------- | ----------------- | --------------------- |
| 代码库感知 | ✅ 完整项目上下文 | ✅ 当前文件上下文 | ❌ 需手动粘贴         |
| 文件编辑   | ✅ 直接修改       | ✅ 内联编辑       | ❌ 需手动复制         |
| 命令执行   | ✅ 终端命令       | ❌ 有限           | ❌ 不支持             |
| Git 集成   | ✅ 完整工作流     | ❌ 有限           | ❌ 不支持             |
| 自动化     | ✅ Hooks + CI     | ❌ 不支持         | ❌ 不支持             |

## 适用场景

- **日常开发**：写代码、改 bug、重构、添加测试
- **代码审查**：理解陌生代码、发现潜在问题
- **项目维护**：更新依赖、修复安全漏洞、优化性能
- **学习探索**：理解新框架、阅读开源项目
- **自动化**：CI/CD 集成、批量处理、定期任务

## 下一步

- [安装与配置](/guide/beginner/installation) — 安装 Claude Code 并配置环境
- [第一次对话](/guide/beginner/first-conversation) — 学习基本的对话技巧

:::tip 进阶阅读
了解基本概念后，推荐继续阅读：

- [代码库导航](/guide/intermediate/codebase-navigation) — 学习如何高效搜索和理解项目
- [Git 工作流](/guide/intermediate/git-workflow) — 掌握 Claude Code 的 Git 自动化能力
- [CLAUDE.md 配置](/guide/intermediate/claude-md) — 为项目定制 Claude Code 的行为
  :::
