---
title: 权限管理
description: 了解 Claude Code 的权限模型、安全机制和配置方法。掌握允许列表、项目级权限配置以及日常使用中的安全最佳实践。
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★☆☆☆ |
| 🧪 测试 | ★★★☆☆ | ★★☆☆☆ |
| 📦 产品 | ★★★☆☆ | ★★★☆☆ |

**🎯 学习产出：** 掌握 Claude Code 的权限模型和安全边界，能安全地使用自动化操作

**🚀 AI 能力提升：** 自动化工作流、上下文管理
:::

# 权限管理

Claude Code 使用权限系统来控制它能做什么。这确保了安全性，同时不会影响工作效率。

## 权限模式

### 默认模式

默认情况下，Claude Code 在执行以下操作前会请求你的许可：

- 运行终端命令（如 `npm install`、`git push`）
- 修改项目文件
- 访问网络

你会看到类似这样的提示：

```text
Claude wants to run: npm install lodash
Allow? (y/n)
```

### 允许列表

在 `~/.claude/settings.json` 中预配置自动允许的操作（详见[安装与配置](/guide/beginner/installation#基本配置)）：

```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Bash(npm test *)", "Bash(git status *)", "Bash(git diff *)", "Bash(git log *)"]
  }
}
```

:::tip
建议把日常高频使用的安全命令加入允许列表，比如运行测试、查看 Git 状态等。
:::

### 项目级配置

在项目根目录的 `.claude/settings.json` 中配置项目特定的权限：

```json
{
  "permissions": {
    "allow": ["Bash(npm run dev)", "Bash(npm run build)", "Bash(npm test *)"],
    "deny": ["Bash(rm -rf *)", "Bash(git push --force *)"]
  }
}
```

## 权限工具类型

| 工具       | 说明          | 风险等级      |
| ---------- | ------------- | ------------- |
| `Read`     | 读取文件      | 低 — 默认允许 |
| `Glob`     | 文件搜索      | 低 — 默认允许 |
| `Grep`     | 内容搜索      | 低 — 默认允许 |
| `Edit`     | 编辑文件      | 中 — 需要确认 |
| `Write`    | 创建/覆盖文件 | 中 — 需要确认 |
| `Bash`     | 执行命令      | 高 — 需要确认 |
| `WebFetch` | 访问网络      | 中 — 需要确认 |

## 安全建议

1. **不要允许危险命令**：`rm -rf`、`git push --force`、`sudo` 等应始终需要手动确认
2. **使用 Git 作为安全网**：频繁提交，这样即使出错也可以回滚
3. **审查重要操作**：对于数据库迁移、部署等不可逆操作，仔细检查后再确认

## 下一步

- [Slash 命令](/guide/intermediate/slash-commands) — 学习内置命令提升效率
- [CLAUDE.md 与项目约定](/guide/intermediate/claude-md) — 配置项目级的 Claude Code 行为

:::tip 进阶阅读
权限配置与其他功能深度关联，推荐继续了解：
- [Git 工作流](/guide/intermediate/git-workflow) — 配合权限管理，安全地使用 Git 自动化
- [Hooks 扩展](/guide/advanced/hooks) — 通过 Hook 在权限检查前后执行自定义逻辑
:::
