---
title: 安装与配置
description: Claude Code 的安装步骤、系统要求和初始配置
---

# 安装与配置

## 系统要求

- **Node.js** 18 或更高版本
- **操作系统**：macOS、Linux 或 Windows (WSL)
- **终端**：任意终端模拟器（推荐 iTerm2、Windows Terminal）

## 安装

```bash
npm install -g @anthropic-ai/claude-code
```

验证安装：

```bash
claude --version
```

## 认证

首次运行时，Claude Code 会引导你完成认证。支持两种方式：

### 方式一：Anthropic API Key

从 [Anthropic Console](https://console.anthropic.com/) 获取 API Key，然后设置环境变量：

```bash
export ANTHROPIC_API_KEY=your-api-key
```

:::tip
将环境变量添加到 `~/.bashrc` 或 `~/.zshrc` 中，避免每次启动都要设置。
:::

:::tip
如果你需要在多个 API Provider 之间切换（如 Anthropic API、AWS Bedrock 等），可以使用 [CC-Switch](/guide/advanced/cc-switch) 一键切换，无需手动修改配置文件。
:::

### 方式二：Claude Pro/Max 订阅

如果你有 Claude Pro 或 Max 订阅，可以直接登录使用，无需 API Key：

```bash
claude
# 首次运行时会提示登录
```

## 基本配置

Claude Code 的配置文件位于 `~/.claude/settings.json`：

```json
{
  "model": "claude-sonnet-4-20250514",
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git *)"
    ]
  }
}
```

### 常用配置项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `model` | 使用的模型 | `claude-sonnet-4-20250514` |
| `permissions.allow` | 自动允许的工具列表 | `[]` |

## 项目级配置

在项目根目录创建 `CLAUDE.md` 文件，为 Claude Code 提供项目上下文：

```markdown
# CLAUDE.md

本项目使用 TypeScript + React 构建。

## 常用命令
- `npm run dev` — 启动开发服务器
- `npm run build` — 构建生产版本
- `npm test` — 运行测试
```

:::info
`CLAUDE.md` 的内容会在每次对话开始时自动加载，相当于给 Claude Code 一份项目说明书。
:::

## 下一步

- [第一次对话](/guide/beginner/first-conversation) — 学习与 Claude Code 对话的基本技巧
- [CLAUDE.md 与项目约定](/guide/intermediate/claude-md) — 深入了解项目配置
