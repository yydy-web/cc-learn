---
title: 文件操作
description: 深入了解 Claude Code 如何读取、创建、编辑和批量修改项目文件。涵盖文件搜索、批量替换、删除操作和安全机制等核心能力。
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★☆☆☆    |
| 🧪 测试 | ★★★★☆  | ★★☆☆☆    |
| 📦 产品 | ★★★☆☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握 Claude Code 的文件读写和编辑操作，能高效管理项目文件

**🚀 AI 能力提升：** 代码生成、跨文件重构
:::

# 文件操作

Claude Code 的核心能力之一是直接操作你的项目文件。

## 读取文件

Claude Code 会根据需要自动读取文件。你也可以主动要求：

```text
> 读一下 src/config.ts 的内容，帮我解释每个配置项的作用
```

它使用的工具包括：

- **Read** — 读取单个文件内容
- **Glob** — 按模式匹配查找文件（如 `**/*.ts`）
- **Grep** — 搜索文件内容（支持正则表达式）
- **LS** — 列出目录内容

## 创建文件

描述你想要的文件内容，Claude Code 会创建它：

```text
> 创建 src/hooks/useDebounce.ts，实现一个防抖 hook，延迟默认 300ms
```

Claude Code 会：

1. 检查目录结构，确认路径合理
2. 编写代码，遵循项目已有的风格
3. 显示文件内容供你确认

## 编辑文件

指定文件和修改内容：

```text
> 在 src/routes.ts 中添加一个 /users/:id 的路由，指向 UserController.getById
```

Claude Code 使用精确的字符串匹配进行编辑，确保只修改需要改的部分。

### 批量修改

```text
> 把 src/components/ 下所有 .tsx 文件中的 `className="old-style"` 替换为 `className="new-style"`
```

## 删除操作

出于安全考虑，Claude Code 默认不会删除文件。如果需要删除：

```text
> 请删除 src/deprecated/ 目录下的所有文件
```

它会先列出要删除的文件，等你确认后再执行。

## 安全机制

- **只读默认**：Claude Code 先理解再修改，不会盲目改文件
- **变更预览**：修改前会显示具体要改什么
- **权限控制**：某些操作需要你明确授权（见 [权限管理](/guide/beginner/permissions)）

:::warning
Claude Code 不会自动备份文件。建议在进行大规模修改前先提交当前代码到 Git。
:::

## 下一步

- [权限管理](/guide/beginner/permissions) — 了解权限模式和安全机制
- [代码库导航](/guide/intermediate/codebase-navigation) — 学习如何高效搜索和理解代码

:::tip 进阶阅读
文件操作是 Claude Code 最常用的能力之一，推荐继续了解：

- [Git 工作流](/guide/intermediate/git-workflow) — 学习文件修改后的版本管理流程
- [代码生成实战](/guide/intermediate/claude-md) — 通过 CLAUDE.md 配置项目约定，让生成代码更符合团队风格
  :::
