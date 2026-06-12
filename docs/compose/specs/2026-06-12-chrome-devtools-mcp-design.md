# [S1] Problem

当前项目缺少关于 chrome-devtools-mcp 的文档内容。用户需要了解如何使用这个 Anthropic 官方提供的 MCP 服务器进行前端开发调试，包括安装配置、基本使用、常见场景和工具对比。

# [S2] Solution overview

在文档站点中添加关于 chrome-devtools-mcp 的完整教程，包括：

1. 创建独立文档页面 `docs/guide/advanced/chrome-devtools-mcp.md`
2. 在前端最佳实践文档中添加引用链接
3. 提供中文技术文档，英文技术术语保留

# [S3] Documentation structure

## 独立页面结构

1. **概述** - chrome-devtools-mcp 是什么，解决什么问题
2. **安装配置** - 如何安装和配置 MCP 服务器
3. **基本使用** - 核心功能和常用命令
4. **使用场景** - 前端调试、性能分析、网络调试、自动化测试
5. **与其他工具对比** - 与 Puppeteer MCP、Playwright 等的比较
6. **最佳实践** - 推荐的工作流程和技巧
7. **参考链接** - 官方文档和其他资源

## 内容详情

### 概述

- chrome-devtools-mcp 是 Anthropic 官方提供的 MCP 服务器
- 通过 Chrome DevTools Protocol 连接浏览器
- 提供实时调试、性能分析、网络监控等功能

### 安装配置

- 通过 npm 安装：`npm install -g @anthropic-ai/chrome-devtools-mcp`
- Claude Code 配置：`claude mcp add chrome-devtools`
- 项目级配置：在 `.claude/settings.json` 中添加 `mcpServers`
- 权限配置：在 `settings.local.json` 中添加 `mcp__chrome-devtools__*` 权限

### 基本使用

- 启动浏览器连接
- 页面导航和截图
- 元素检查和修改
- JavaScript 执行

### 使用场景

- **前端调试**：实时修改 CSS/HTML，查看效果
- **性能分析**：加载时间、渲染性能、内存使用
- **网络调试**：请求拦截、响应分析、API 调试
- **自动化测试**：页面交互、表单提交、状态验证

### 与其他工具对比

- **vs Puppeteer MCP**：chrome-devtools-mcp 更轻量，直接连接浏览器
- **vs Playwright**：chrome-devtools-mcp 更适合调试，Playwright 更适合测试
- **vs Gstack**：chrome-devtools-mcp 是官方工具，Gstack 功能更丰富

### 最佳实践

- 开发时保持浏览器连接
- 使用截图记录问题
- 结合其他 MCP 工具使用

### 参考链接

- GitHub 仓库：https://github.com/ChromeDevTools/chrome-devtools-mcp
- Chrome DevTools Protocol 文档：https://chromedevtools.github.io/devtools-protocol/
- MCP 协议规范：https://modelcontextprotocol.io/

# [S4] Integration points

## 文件变更

1. **新建文件**：`docs/guide/advanced/chrome-devtools-mcp.md`
2. **修改文件**：`docs/tips/frontend-best-practices.md`（添加引用链接）

## 导航更新

需要在 `docs/guide/advanced/_meta.json` 中添加新页面的导航项。

# [S5] Success criteria

1. 文档页面成功创建并可在站点中访问
2. 内容完整覆盖安装配置、基本使用、使用场景、工具对比
3. 与现有文档风格一致
4. 前端最佳实践文档中包含正确的引用链接
5. 构建成功：`pnpm run build` 无错误

# [S6] Out of scope

- 不修改项目依赖或配置
- 不添加新的 MCP 服务器配置到项目中
- 不创建示例代码或演示项目
- 不修改现有文档的结构
