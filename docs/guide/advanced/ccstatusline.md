---
title: CCStatusline 状态栏
description: 使用 CCStatusline 自定义 Claude Code 终端状态栏，实时显示模型、Git 分支、Token 用量等信息
---

# CCStatusline 状态栏

[CCStatusline](https://github.com/sirmalloc/ccstatusline) 是一个高度可定制的 Claude Code CLI 状态栏工具，在终端底部实时显示当前模型、Git 分支、Token 用量、会话费用等关键信息。

## 为什么需要 CCStatusline

默认的 Claude Code CLI 界面不显示模型名称、Token 用量等信息。你需要切换到其他窗口或手动查询才能了解当前状态。CCStatusline 解决了这个问题：

- 实时查看当前使用的模型（如 `claude-opus-4-6`）
- 跟踪 Token 消耗和会话费用，避免超出预算
- 显示 Git 分支和工作区状态，减少上下文切换
- 监控 5 小时 Block 计时器，合理安排使用节奏

## 安装

运行以下命令会启动一个交互式 TUI，引导你完成配置和安装：

:::code-tabs

@tab npm

```bash
npx -y ccstatusline@latest
```

@tab Bun

```bash
bunx -y ccstatusline@latest
```

:::

TUI 会自动将配置写入 Claude Code 的 `settings.json`，无需手动编辑。

:::tip
推荐使用 Bun（`bunx`），启动速度更快。
:::

### 固定版本安装

如果不想每次运行都拉取最新版本，可以在 TUI 中选择「固定版本全局安装」，或手动全局安装：

```bash
npm install -g ccstatusline
```

此时 `settings.json` 中的命令为 `ccstatusline`（不带 npx）。

## 配置

### settings.json

CCStatusline 通过 Claude Code 的 `statusLine` 配置项工作。安装后，`~/.claude/settings.json` 会包含：

```json
{
  "statusLine": {
    "type": "command",
    "command": "npx -y ccstatusline@latest",
    "padding": 0,
    "refreshInterval": 10
  }
}
```

| 字段                | 说明                                          |
| ------------------- | --------------------------------------------- |
| `type`              | 固定为 `"command"`                            |
| `command`           | 运行命令，支持 `npx`、`bunx` 或全局安装的 `ccstatusline` |
| `padding`           | 状态栏边距，默认 `0`                          |
| `refreshInterval`   | 刷新间隔（秒），范围 1–60，需要 Claude Code 2.1.97+ |

### 环境变量

| 变量                     | 用途                                   |
| ------------------------ | -------------------------------------- |
| `CLAUDE_CONFIG_DIR`      | 自定义 Claude Code 配置目录            |
| `HTTPS_PROXY`            | 代理地址（用于用量 API 请求）          |
| `CCSTATUSLINE_WIDTH`     | 手动指定终端宽度                       |

### 自定义配置路径

```bash
ccstatusline --config /path/to/settings.json
```

配置文件自动保存到 `~/.config/ccstatusline/settings.json`。

## 使用 TUI 配置

CCStatusline 的 TUI 界面基于 React/Ink 构建，提供可视化配置体验：

- **添加 / 删除 Widget**：从分类列表中选择要显示的组件
- **拖拽排序**：调整各组件在状态栏中的位置
- **颜色定制**：为每个元素单独设置前景色和背景色
- **克隆组件**：按 `k` 键复制当前选中的 Widget
- **实时预览**：修改后立即在终端中看到效果
- **一键安装**：直接将配置写入 Claude Code settings

TUI 内置快速 Widget 选择器，支持分类浏览、子串匹配和模糊搜索，可以快速找到需要的组件。

## 常用 Widget

CCStatusline 提供了丰富的 Widget，按类别分组：

### 模型与会话

| Widget             | 显示内容                               |
| ------------------ | -------------------------------------- |
| **Model**          | 当前模型名称，自动去除 `(1M context)` 等后缀 |
| **Session Name**   | 当前会话名称                           |
| **Session Cost**   | 当前会话费用（USD），需要 Claude Code 1.0.85+ |
| **Compaction**     | 压缩次数，支持隐藏为零时               |

### Token 用量

| Widget                 | 显示内容                                    |
| ---------------------- | ------------------------------------------- |
| **Session Usage**      | 当前会话的 Token 用量                       |
| **Weekly Usage**       | 每周用量，支持按 Sonnet / Opus 分别显示     |
| **Extra Usage**        | 额度使用率和剩余量                          |
| **Token Speed**        | Token 输入/输出速率，支持 0–120 秒滑动窗口  |

### Git 信息

| Widget              | 显示内容                                    |
| ------------------- | ------------------------------------------- |
| **Git Branch**      | 当前分支名，支持点击跳转 GitHub / GitLab    |
| **Git Status**      | 工作区整体状态                              |
| **Staged / Unstaged / Untracked** | 文件变更数量              |
| **Ahead / Behind**  | 与远程分支的提交差异                        |
| **Conflicts**       | 合并冲突数量                                |
| **Worktree**        | Git Worktree 模式、名称和分支               |

### 上下文窗口

| Widget               | 显示内容                                  |
| -------------------- | ----------------------------------------- |
| **Context Percentage** | 上下文窗口使用百分比                    |
| **Context Bar**      | 可视化进度条，支持紧凑模式               |
| **Context Window**   | 模型上下文窗口总大小                     |
| **Context Length**   | 当前已使用的上下文长度                   |

### 计时器

| Widget               | 显示内容                                  |
| -------------------- | ----------------------------------------- |
| **Block Timer**      | 5 小时 Block 的进度，支持两种进度条样式  |
| **Block Reset**      | 下次 Block 重置的时间                    |
| **Weekly Reset**     | 每周额度重置时间，支持 IANA 时区         |

### 其他

| Widget               | 显示内容                                  |
| -------------------- | ----------------------------------------- |
| **CWD**              | 当前工作目录，支持 fish 风格缩写          |
| **Thinking Effort**  | 思考强度（包括 `xhigh`）                  |
| **Vim Mode**         | Vim 模式指示器                            |
| **Voice Status**     | 语音输入状态                              |
| **Custom Text**      | 自定义文本，支持 Emoji                    |

## Powerline 风格

CCStatusline 支持 Powerline 风格的箭头分隔符和主题系统：

```bash
# 在 TUI 中选择 Powerline 主题
# 自动安装所需字体并配置分隔符
```

特性包括：

- 可自定义箭头分隔符（支持 4–6 位 Unicode 十六进制码）
- 多行状态栏自动对齐
- 内置主题支持跨行颜色延续
- 三种颜色模式：16 色、256 色（ANSI）、TrueColor（HEX）

:::info
Powerline 主题需要特殊的字体支持。TUI 提供自动安装字体的选项，也可以手动安装 [Nerd Fonts](https://www.nerdfonts.com/)。
:::

## Windows 用户

在 Windows 上使用 CCStatusline 需要注意：

- 推荐使用 **Windows Terminal**，对 Unicode 和颜色支持更好
- PowerShell 示例：`npx -y ccstatusline@latest`
- 如果使用 WSL，配置方式与 Linux 相同
- 字体安装：从 [Nerd Fonts](https://www.nerdfonts.com/) 下载并安装

详见 [Windows 指南](https://github.com/sirmalloc/ccstatusline/blob/main/docs/WINDOWS.md)。

## 相关资源

- [CCStatusline GitHub](https://github.com/sirmalloc/ccstatusline) — 源码和完整文档
- [npm: ccstatusline](https://www.npmjs.com/package/ccstatusline) — npm 包页面
- [CCStatusline 中文版](https://github.com/huangguang1999/ccstatusline-zh) — 中文社区本地化版本

## 下一步

- [Hooks](/guide/advanced/hooks) — 使用 Hooks 自动化 Claude Code 行为
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理多 Provider 和 MCP 服务器配置
- [最佳实践](/tips/best-practices) — 更多使用技巧
