---
title: Context7 实时文档
description: 使用 Context7 为 Claude Code 注入最新的库文档，避免 API 幻觉和过时代码
---

# Context7 实时文档

Context7 是 Upstash 推出的实时文档平台，为 LLM 和 AI 编程助手提供最新的、版本特定的库文档和代码示例。它解决了 LLM 依赖过时训练数据导致的 API 幻觉、过时代码示例和错误配置问题。

## 为什么需要 Context7

Claude Code 的训练数据有截止日期，当你使用较新的库或 API 时，可能会遇到：

- 使用已废弃的 API（如 Next.js 14 的旧路由模式）
- 生成不存在的函数或参数
- 给出错误的配置步骤
- 引用不存在的 npm 包版本

Context7 从源仓库实时拉取文档，注入到 Claude Code 的上下文中，确保生成的代码基于**最新文档**。

:::info
使用 Context7 前后对比：
- **没有 Context7**：Claude 可能使用 Next.js 13 的 `pages/` 目录结构
- **有了 Context7**：Claude 使用 Next.js 15 的 `app/` 目录结构和最新 API
:::

## 两种使用模式

Context7 提供两种集成方式：

| 模式 | 原理 | 适用场景 |
|------|------|----------|
| **MCP 模式** | 注册 MCP 服务器，Claude Code 原生调用工具 | 推荐，最流畅的体验 |
| **CLI + Skills 模式** | 通过 Skill 指导 Claude Code 使用 `ctx7` CLI | 不支持 MCP 的环境 |

:::tip
推荐使用 **MCP 模式**——Claude Code 直接调用 `resolve-library-id` 和 `query-docs` 工具，无需额外步骤。
:::

## 安装

### 方式一：一键安装（推荐）

```bash
npx ctx7 setup --claude
```

这会自动：
1. 通过 OAuth 认证获取 API Key
2. 配置 MCP 服务器到 `~/.claude.json`
3. 安装 Skill 和规则文件

### 方式二：手动配置 MCP

```bash
# 本地服务器（stdio）
claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp --api-key YOUR_API_KEY

# 远程服务器（HTTP）
claude mcp add --scope user --header "CONTEXT7_API_KEY: YOUR_API_KEY" --transport http context7 https://mcp.context7.com/mcp
```

或手动编辑 `.mcp.json`：

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

### 方式三：通过 Claude Code Plugin 安装

```
> /plugin marketplace add upstash/context7
> /plugin install context7-plugin@context7-marketplace
```

Plugin 模式会同时安装 MCP 服务器、Skill、Agent 和 Slash 命令。

### 方式四：通过 CC-Switch 管理

如果你已安装 [CC-Switch](/guide/advanced/cc-switch)，可以通过它管理 Context7 的 MCP 服务器配置：

1. 打开 CC-Switch Desktop
2. 进入 MCP 服务器管理
3. 添加 Context7 MCP 服务器配置
4. CC-Switch 会自动同步到 Claude Code

:::tip
CC-Switch 特别适合在多个 AI 工具之间同步 Context7 的 MCP 配置——一次配置，所有工具生效。
:::

### 获取 API Key

免费获取 API Key（提高速率限制）：

1. 访问 [context7.com/dashboard](https://context7.com/dashboard)
2. 注册并获取 API Key
3. 设置环境变量：`export CONTEXT7_API_KEY=your-key`

:::info
不设置 API Key 也可以使用（匿名访问），但速率限制较低。
:::

## MCP 工具

MCP 模式下，Context7 为 Claude Code 提供 2 个工具：

| 工具 | 用途 |
|------|------|
| `resolve-library-id` | 搜索库，返回 Context7 兼容的 ID（格式：`/org/project`） |
| `query-docs` | 根据库 ID 和查询获取最新文档 |

### 工作流程

```
1. 用户: "用 Next.js 15 的 Server Actions 实现表单"
2. Claude Code 调用 resolve-library-id → 找到 /vercel/next.js
3. Claude Code 调用 query-docs → 获取 Next.js 15 Server Actions 文档
4. Claude Code 基于最新文档生成代码
```

## CLI 命令

CLI 模式下，使用 `ctx7` 命令行工具：

```bash
# 搜索库
ctx7 library next.js "server actions"

# 获取文档
ctx7 docs /vercel/next.js "how to use server actions"

# 认证
ctx7 login
ctx7 logout
ctx7 whoami

# Skills 管理
ctx7 skills search react
ctx7 skills install /owner/repo
ctx7 skills suggest          # 根据项目依赖自动推荐
ctx7 skills list
ctx7 skills remove <name>
ctx7 skills generate         # AI 生成自定义 Skill（需登录）

# 设置和移除
ctx7 setup --claude
ctx7 remove
```

## 使用示例

### 示例一：使用最新 API

```
> 用 Next.js 15 的 Server Actions 实现一个联系表单
```

Claude Code 会自动查询 Context7 获取 Next.js 15 的最新 Server Actions 文档，生成基于最新 API 的代码。

### 示例二：避免废弃 API

```
> 帮我用 React Router v7 配置路由
```

Claude Code 会获取 React Router v7 的文档，避免使用 v6 的旧 API。

### 示例三：版本特定文档

```
> 用 Tailwind CSS v4 的新语法配置主题
```

Context7 支持指定版本（`/tailwindlabs/tailwindcss/v4`），确保获取正确版本的文档。

### 手动查询

安装 Plugin 后，可以使用 Slash 命令手动查询：

```
> /context7:docs
> 查询 Prisma 的关系查询文档
```

## CLAUDE.md 集成

在项目的 `CLAUDE.md` 中添加以下规则，让 Claude Code 自动使用 Context7：

```markdown
## Context7

Always use Context7 when I need library/API documentation, code generation,
setup or configuration steps without me having to explicitly ask.
```

:::tip
将这段规则添加到全局 `~/.claude/rules/context7.md`，所有项目都会自动生效。
:::

## 配置

### 环境变量

| 变量 | 说明 |
|------|------|
| `CONTEXT7_API_KEY` | API Key（提高速率限制） |
| `CONTEXT7_API_URL` | API 地址（默认：`https://context7.com/api`） |
| `CTX7_TELEMETRY_DISABLED` | 禁用遥测 |

### Library ID 格式

Context7 使用 `/org/project` 格式的库 ID：

| 示例 | 说明 |
|------|------|
| `/vercel/next.js` | Next.js 最新版 |
| `/vercel/next.js/v14.3.0` | Next.js 指定版本 |
| `/reactjs/react-router` | React Router |
| `/prisma/prisma` | Prisma ORM |
| `/tailwindlabs/tailwindcss` | Tailwind CSS |

## 卸载

```bash
npx ctx7 remove
```

## 相关资源

- [Context7 GitHub](https://github.com/upstash/context7) — 项目仓库（56k+ Stars）
- [Context7 官网](https://context7.com) — 文档和 API Key 获取
- [Context7 Dashboard](https://context7.com/dashboard) — API Key 管理
- [Context7 npm](https://www.npmjs.com/package/ctx7) — CLI 包

## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 MCP 服务器和 API Provider
- [自定义技能](/skills/overview/custom-skills) — 创建和管理自定义 Skills
- [技巧与最佳实践](/tips/best-practices) — 更多高效使用技巧