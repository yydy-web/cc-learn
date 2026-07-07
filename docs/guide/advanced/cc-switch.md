---
title: CC-Switch 配置管理
description: 掌握 CC-Switch 配置管理工具，可视化管理多个 API Provider 切换、MCP 服务器配置和 Skills 安装，告别手动编辑 JSON 配置文件
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★☆☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★☆☆☆    |
| 📦 产品 | ★★★☆☆  | ★★☆☆☆    |

**🎯 学习产出：** 掌握 CC Switch 的配置和使用，能灵活切换 AI 模型和行为模式

**🚀 AI 能力提升：** 上下文管理、技能扩展
:::

# CC-Switch 配置管理

CC-Switch 是一个跨平台的 AI 编程助手配置管理工具，让你无需手动编辑配置文件就能在多个 API Provider 之间切换，统一管理 MCP 服务器、Skills 和 Prompt。

## 为什么需要 CC-Switch

使用 Claude Code 时，你可能会遇到这些场景：

- 在 Anthropic API、AWS Bedrock、第三方 Relay 之间切换 Provider
- 管理多个项目的 MCP 服务器配置
- 在社区中发现和安装 Skills
- 同步不同工具（Claude Code、Codex、Gemini CLI）的配置

手动编辑 `~/.claude/settings.json` 或 `~/.claude.json` 容易出错，CC-Switch 将这些操作可视化，一键完成。

## 版本选择

CC-Switch 提供三个版本，适合不同的使用场景：

| 版本        | 技术栈                 | 适用场景                |
| ----------- | ---------------------- | ----------------------- |
| **Desktop** | Tauri 2 (Rust + React) | 日常开发，需要 GUI 界面 |
| **CLI**     | Rust CLI               | 终端用户、服务器环境    |
| **Web**     | Web 服务器             | 无头环境、远程管理      |

:::tip
大多数用户推荐使用 **Desktop 版本**，提供最完整的功能和最直观的操作体验。
:::

## 安装

### Desktop 版本

**macOS（推荐）：**

```bash
brew install --cask cc-switch
```

**Windows：**

从 [GitHub Releases](https://github.com/farion1231/cc-switch/releases) 下载 `.msi` 安装包或便携版 `.zip`。

**Linux：**

从 Releases 下载 `.deb`、`.rpm` 或 `.AppImage`。

### CLI 版本

**Homebrew（macOS/Linux）：**

```bash
brew install cc-switch-cli
```

**快速安装（macOS/Linux）：**

```bash
curl -fsSL https://github.com/SaladDay/cc-switch-cli/releases/latest/download/install.sh | bash
```

**Windows：** 从 [GitHub Releases](https://github.com/SaladDay/cc-switch-cli/releases) 下载对应平台的二进制文件。

### Web 版本

使用 Docker 部署：

```bash
docker run -p 3000:3000 ghcr.io/laliet/cc-switch-web:latest
```

或一键部署脚本：

```bash
curl -fsSL https://raw.githubusercontent.com/Laliet/cc-switch-web/main/scripts/deploy-web.sh | bash -s -- --prebuilt
```

## 核心功能

### Provider 管理

CC-Switch 内置 50+ API Provider 预设，包括：

- **官方**：Anthropic API
- **云厂商**：AWS Bedrock、Google Cloud
- **硬件厂商**：NVIDIA NIM
- **社区 Relay**：各种第三方转发服务

切换 Provider 时，CC-Switch 会自动更新 Claude Code 的配置文件（`~/.claude.json`），无需手动编辑。

:::info
Claude Code 支持热切换 Provider——切换后无需重启终端，下一次对话自动生效。
:::

### MCP 服务器管理

统一管理所有 AI 工具的 MCP 服务器配置：

- 支持 stdio、http、sse 三种传输类型
- 双向同步到各工具的配置文件
- 通过 Deep Link 快速导入 MCP 服务器

```bash
# CLI 版本同步 MCP 配置
cc-switch mcp sync
```

### Skills 市场

浏览和安装社区贡献的 Skills：

- 按分类浏览 Skills
- 一键安装到 `.agents/skills/` 目录
- 支持通过符号链接或复制方式安装
- 跨项目共享 Skills

例如，你可以通过 CC-Switch 一键安装 [Superpowers](/guide/advanced/superpowers) 的全部 14 个 Skills——包括头脑风暴、TDD、代码审查等专业开发工作流。

### Prompt 管理

集中管理各工具的系统 Prompt：

- `CLAUDE.md`（Claude Code）
- `AGENTS.md`（Codex）
- `GEMINI.md`（Gemini CLI）

支持跨应用同步，保持 Prompt 一致性。

### 用量追踪

CC-Switch 提供用量仪表盘，帮助你监控 API 花费：

- 请求次数和 Token 用量统计
- 趋势图表展示
- 自定义模型定价
- 可搜索的请求日志

## CLI 常用命令

如果使用 CLI 版本，以下是常用命令：

```bash
# 启动交互式 TUI 菜单
cc-switch

# 查看所有 Provider
cc-switch provider list

# 切换 Provider
cc-switch provider switch <id>

# 同步 MCP 服务器配置
cc-switch mcp sync

# 激活 Prompt 预设
cc-switch prompts activate <id>

# 检查环境冲突
cc-switch env check
```

:::tip
直接运行 `cc-switch` 不带参数会启动交互式 TUI 菜单，通过方向键选择操作，适合不熟悉子命令的用户。
:::

## 工作原理

CC-Switch 通过管理以下配置文件来控制 Claude Code 的行为：

| 配置文件                  | 作用                         |
| ------------------------- | ---------------------------- |
| `~/.claude.json`          | Provider、API Key 等全局配置 |
| `~/.claude/settings.json` | 权限、MCP 服务器等设置       |
| `~/.claude/CLAUDE.md`     | 全局系统 Prompt              |

关键特性：

- **原子写入**：使用临时文件 + 重命名模式，防止配置文件损坏
- **安全同步**：对于未初始化的应用，跳过写入配置目录，避免意外创建
- **云同步**：支持 Dropbox、OneDrive、iCloud、WebDAV 备份同步
- **自动备份**：保留最近 10 份备份，存储在 `~/.cc-switch/cc-switch.db`

## 典型工作流

### 场景一：切换 API Provider

```
1. 打开 CC-Switch Desktop
2. 在 Provider 列表中选择目标 Provider
3. 点击切换 — Claude Code 的配置自动更新
4. 回到终端，继续使用 Claude Code（无需重启）
```

### 场景二：管理 MCP 服务器

```
1. 在 CC-Switch 中添加新的 MCP 服务器配置
2. 选择同步到哪些工具（Claude Code、Codex 等）
3. CC-Switch 自动更新各工具的 settings.json
```

### 场景三：安装 Superpowers Skills

```
1. 在 Skills 市场中搜索 "superpowers"
2. 选择需要的 Skills（如 TDD、头脑风暴）
3. 点击安装到 Claude Code
4. 在 Claude Code 中通过斜杠命令调用
```

## 相关资源

- [CC-Switch Desktop](https://github.com/farion1231/cc-switch) — 桌面版 GitHub 仓库
- [CC-Switch CLI](https://github.com/SaladDay/cc-switch-cli) — CLI 版本 GitHub 仓库
- [CC-Switch Web](https://github.com/Laliet/cc-switch-web) — Web 版本 GitHub 仓库
- [CC-Switch 官网](https://ccswitch.io) — 官方网站

## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [自定义技能](/skills/overview/custom-skills) — 创建和管理自定义 Skills
- [技能市场](/skills/overview/skills-marketplace) — 浏览和安装社区 Skills
- [自动化与 CI/CD](/guide/advanced/automation) — 将 Claude Code 集成到自动化流程
