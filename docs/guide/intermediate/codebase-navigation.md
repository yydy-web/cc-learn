---
title: 代码库导航
description: 学习使用 Claude Code 的代码库导航能力，掌握通过文件名搜索、内容搜索、代码流追踪和 LSP 增强等方式高效理解和探索大型项目的技巧
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★☆☆ |
| 🧪 测试 | ★★★★☆ | ★★★☆☆ |
| 📦 产品 | ★★☆☆☆ | ★★★★☆ |

**🎯 学习产出：** 掌握 Claude Code 的代码库导航能力，能独立理解和探索大型项目

**🚀 AI 能力提升：** 上下文管理、跨文件重构
:::

# 代码库导航

面对陌生的代码库，Claude Code 可以帮你快速建立全局理解。

## 理解项目结构

```text
> 帮我梳理一下这个项目的目录结构，每个主要目录的作用是什么？
```

Claude Code 会扫描目录树，读取关键文件（`package.json`、`tsconfig.json` 等），给出结构化的总结。

## 搜索代码

### 按文件名搜索

```text
> 找到所有和用户认证相关的文件
```

Claude Code 使用 Glob 工具按模式匹配文件。

### 按内容搜索

```text
> 搜索项目中所有使用了 `useEffect` 的地方
```

Claude Code 使用 Grep 工具进行内容搜索，支持正则表达式。

### 组合搜索

```text
> 在 src/ 目录下找到所有导入了 lodash 但只用了一两个方法的文件，考虑换成原生实现
```

## 追踪代码流

### 理解调用链

```text
> 用户点击登录按钮后，代码的执行流程是怎样的？从前端组件到后端 API 完整追踪一下
```

### 查找定义和引用

```text
> `UserService.createUser` 这个方法在哪里定义的？哪些地方调用了它？
```

## 分析代码质量

```text
> 检查 src/api/ 目录下的错误处理，看看有没有遗漏的 try-catch 或未处理的 Promise rejection
```

```text
> 这个项目有哪些 TODO 和 FIXME 注释？帮我整理一下
```

## 实用技巧

### 用 LSP 增强理解

Claude Code 内置 LSP 支持，可以：

- 跳转到定义
- 查找所有引用
- 查看类型信息
- 查看调用层级

:::info
以上是 Claude Code 底层工具（`goToDefinition`、`findReferences`、`hover`、`prepareCallHierarchy`）的能力描述。对用户而言，直接用自然语言描述需求即可，Claude Code 会自动选择合适的工具。例如："查一下 handleLogin 函数的所有调用者"。
:::

```text
> 用 LSP 查一下 `handleLogin` 函数的所有调用者
```

### 渐进式探索

面对大型代码库，建议从宏观到微观：

1. **先看结构** — 项目有哪些模块？
2. **再看入口** — 程序从哪里开始执行？
3. **后看核心** — 关键业务逻辑在哪里？
4. **最后看细节** — 具体实现是怎样的？

```text
> 先帮我看看这个项目的整体架构，然后重点分析一下核心的业务逻辑模块
```

## 下一步

- [Slash 命令](/guide/intermediate/slash-commands) — 使用内置命令提升效率
- [Git 工作流](/guide/intermediate/git-workflow) — 用 Claude Code 管理 Git 操作
- [上下文管理](/guide/intermediate/context-management) — 管理对话上下文和 token 消耗
- [CLAUDE.md 与项目约定](/guide/intermediate/claude-md) — 用项目配置增强代码库理解
