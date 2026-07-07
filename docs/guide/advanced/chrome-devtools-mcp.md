---
title: Chrome DevTools MCP
description: 使用 ChromeDevTools 团队（Google）提供的 MCP 服务器连接 Chrome DevTools Protocol，进行前端开发调试
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★★  | ★★★☆☆    |
| 📦 产品 | ★★★☆☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握 Chrome DevTools MCP 的配置和使用，能用 Claude Code 进行浏览器调试和自动化测试

**🚀 AI 能力提升：** 调试诊断、测试生成、自动化工作流
:::

# Chrome DevTools MCP

Chrome DevTools MCP 是 ChromeDevTools 团队（Google）提供的 MCP 服务器，通过 Chrome DevTools Protocol 连接浏览器，为 Claude Code 提供实时调试、性能分析和网络监控能力。

## 概述

Chrome DevTools MCP 解决了前端开发中的几个核心问题：

- **实时调试**：直接在浏览器中修改 CSS/HTML，查看效果
- **性能分析**：测量页面加载时间、渲染性能、内存使用
- **网络调试**：捕获和分析网络请求、API 调用
- **自动化测试**：验证页面交互和状态

与 Puppeteer MCP 相比，Chrome DevTools MCP 更轻量，直接连接已打开的浏览器，无需启动新的浏览器实例。

## 安装配置

### 全局安装

```bash
npm install -g chrome-devtools-mcp
```

### Claude Code 配置

使用 `claude mcp add` 命令添加到 Claude Code：

```bash
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```

### 项目级配置

在 `.claude/settings.json` 中添加 `mcpServers` 配置：

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

### 权限配置

在 `.claude/settings.local.json` 中添加工具权限：

```json
{
  "permissions": {
    "allow": ["mcp__chrome-devtools__*"]
  }
}
```

## 基本使用

### 启动浏览器连接

首先，确保 Chrome 浏览器已启动并开启了远程调试端口：

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile

# Windows
chrome.exe --remote-debugging-port=9222 --user-data-dir=%TEMP%\chrome-profile

# Linux
google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile
```

> **提示**：如果你使用 Chrome 144 或更高版本，可以使用 `--autoConnect` 标志自动连接到 Chrome DevTools Protocol，无需手动指定端口。例如：`google-chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-profile --autoConnect`

然后在 Claude Code 中使用 MCP 工具连接浏览器。

### 页面导航和截图

```
> 打开 http://localhost:3000 并截图
```

```
> 导航到 https://example.com 并检查页面标题
```

### 元素检查和修改

```
> 检查页面上的登录按钮，查看其 CSS 样式
```

```
> 修改导航栏的背景颜色为蓝色
```

### JavaScript 执行

```
> 在控制台执行 document.title 获取页面标题
```

```
> 执行 localStorage.getItem('user') 检查本地存储
```

## 使用场景

### 前端调试

实时调试网页元素、样式和布局问题：

```
> 页面上的卡片在移动端显示错乱，帮我检查并修复布局
```

```
> 按钮的 hover 效果没有生效，检查 CSS 是否正确加载
```

### 性能分析

分析页面性能、加载时间和资源优化：

```
> 测量首页的加载时间，找出最慢的资源
```

```
> 检查页面的 Core Web Vitals 指标
```

### 网络调试

捕获和分析网络请求、API 调用：

```
> 监听页面的网络请求，找出失败的 API 调用
```

```
> 拦截 /api/users 请求，查看响应数据
```

### 自动化测试

验证页面交互和状态：

```
> 测试登录流程：输入用户名密码，点击登录，验证跳转
```

```
> 测试表单提交：填写表单，提交，检查成功提示
```

## 与其他工具对比

### vs Puppeteer MCP

| 特性     | Chrome DevTools MCP | Puppeteer MCP      |
| -------- | ------------------- | ------------------ |
| 连接方式 | 连接已打开的浏览器  | 启动新的浏览器实例 |
| 资源占用 | 轻量                | 较重               |
| 适用场景 | 实时调试            | 自动化测试         |
| 官方支持 | ChromeDevTools 团队 | 社区维护           |

### vs Playwright

| 特性       | Chrome DevTools MCP | Playwright |
| ---------- | ------------------- | ---------- |
| 主要用途   | 调试和监控          | 自动化测试 |
| 浏览器支持 | Chrome/Chromium     | 多浏览器   |
| 集成方式   | MCP 协议            | 独立库     |
| 学习曲线   | 低                  | 中等       |

### vs Gstack

| 特性       | Chrome DevTools MCP      | Gstack                 |
| ---------- | ------------------------ | ---------------------- |
| 功能范围   | 专注浏览器调试           | 全面工程团队           |
| 浏览器集成 | Chrome DevTools Protocol | 内置 Playwright        |
| 附加功能   | 无                       | QA、设计审查、安全审计 |
| 复杂度     | 简单                     | 复杂                   |

## 最佳实践

### 开发时保持浏览器连接

在开发过程中保持 Chrome 浏览器开启，这样 Claude Code 可以随时连接进行调试：

```bash
# 启动开发服务器
pnpm dev

# 在另一个终端启动 Chrome 调试模式
chrome --remote-debugging-port=9222
```

### 使用截图记录问题

当发现 UI 问题时，使用截图功能记录当前状态：

```
> 截图当前页面，保存为 debug-screenshot.png
```

### 结合其他 MCP 工具使用

Chrome DevTools MCP 可以与其他 MCP 工具组合使用：

- **Context7**：获取最新文档，避免 API 幻觉
- **CodeGraph**：分析代码依赖关系
- **Gstack**：进行全面的 QA 测试

```
> 使用 Context7 查询 React 19 的新特性，然后用 Chrome DevTools MCP 在浏览器中测试
```

### 调试工作流

推荐的前端调试工作流：

1. **发现问题**：用户报告或测试发现 UI 问题
2. **连接浏览器**：使用 Chrome DevTools MCP 连接到开发环境
3. **检查元素**：查看元素的 HTML 结构和 CSS 样式
4. **实时修改**：在浏览器中直接修改样式，验证修复效果
5. **应用修复**：将验证过的修改应用到代码中
6. **验证结果**：重新截图确认问题已解决

## 参考链接

- [GitHub 仓库](https://github.com/ChromeDevTools/chrome-devtools-mcp) — 官方源码和文档
- [Chrome DevTools Protocol 文档](https://chromedevtools.github.io/devtools-protocol/) — 协议规范
- [MCP 协议规范](https://modelcontextprotocol.io/) — Model Context Protocol 官方文档

## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 了解其他 MCP 服务器配置
- [前端开发最佳实践](/tips/frontend-best-practices) — 前端开发完整指南
- [Gstack](/guide/advanced/gstack) — 虚拟工程团队工具
