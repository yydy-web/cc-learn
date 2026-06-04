---
title: MCP 服务器
description: 使用 Model Context Protocol 扩展 Claude Code 的工具能力
---

# MCP 服务器

MCP (Model Context Protocol) 是一个开放协议，让 Claude Code 可以连接外部工具和数据源。

## 什么是 MCP

MCP 服务器为 Claude Code 提供额外的工具能力。通过 MCP，你可以：

- 连接数据库，直接查询数据
- 调用第三方 API（GitHub、Jira、Slack 等）
- 访问特定的开发工具（浏览器自动化、文件系统等）

## 配置 MCP 服务器

在 `.claude/settings.json` 的 `mcpServers` 字段中配置：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

## 常用 MCP 服务器

### GitHub

提供 GitHub API 访问能力：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxx"
      }
    }
  }
}
```

使用示例：
```
> 帮我看看 repo 有哪些 open 的 issue
```

### 文件系统

提供增强的文件系统访问：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
    }
  }
}
```

### 浏览器自动化

使用 Puppeteer 进行浏览器操作：

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

使用示例：
```
> 打开 localhost:3000，截个图给我看看当前页面的样子
```

### CodeGraph 代码智能

为 Claude Code 提供本地代码知识图谱，减少工具调用和 Token 消耗：

```json
{
  "mcpServers": {
    "codegraph": {
      "type": "stdio",
      "command": "codegraph",
      "args": ["serve", "--mcp"]
    }
  }
}
```

使用示例：
```
> 这个项目是怎么处理用户认证的？
> 如果修改 User 接口，会影响哪些代码？
```

详见 [CodeGraph 代码智能](/guide/advanced/codegraph) 教程。

### Context7 实时文档

为 Claude Code 提供最新的库文档，避免 API 幻觉和过时代码：

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

使用示例：
```
> 用 Next.js 15 的 Server Actions 实现表单
> 用 React Router v7 配置路由
```

详见 [Context7 实时文档](/guide/advanced/context7) 教程。

## 自建 MCP 服务器

你可以用 TypeScript 或 Python 编写自己的 MCP 服务器：

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({ name: "my-server", version: "1.0.0" });

server.tool("get_weather", { city: z.string() }, async ({ city }) => ({
  content: [{ type: "text", text: `${city}今天晴天，25°C` }],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
```

## 注意事项

- MCP 服务器需要单独的进程，会消耗额外的系统资源
- 敏感信息（如 API Token）应通过环境变量传入，不要硬编码
- 建议只启用需要的 MCP 服务器，过多会降低响应速度

:::info
管理多个 MCP 服务器配置比较繁琐？[CC-Switch](/guide/advanced/cc-switch) 提供了可视化的 MCP 管理界面，支持跨应用双向同步。
:::

## 下一步

- [自定义技能](/skills/overview/custom-skills) — 创建自定义的 Skills 和 Agents
- [多智能体工作流](/guide/advanced/multi-agent) — 编排多个 Agent 协作
