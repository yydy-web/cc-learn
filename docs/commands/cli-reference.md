---
title: CLI 参考
description: Claude Code CLI 子命令、启动参数和用法的完整参考
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★☆☆☆    |
| 🧪 测试 | ★★★★☆  | ★★☆☆☆    |
| 📦 产品 | ★★★☆☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握 CLI 命令行参考，能独立使用 Claude Code 的所有子命令、启动参数和管道操作

**🚀 AI 能力提升：** 自动化工作流
:::

# CLI 参考

Claude Code 的命令行界面，用于启动会话、管道内容、恢复对话和管理更新。

## CLI 子命令

| 命令                            | 说明                                                                                     | 示例                                                        |
| :------------------------------ | :--------------------------------------------------------------------------------------- | :---------------------------------------------------------- |
| `claude`                        | 启动交互式会话                                                                           | `claude`                                                    |
| `claude "query"`                | 带初始提示启动交互式会话                                                                 | `claude "explain this project"`                             |
| `claude -p "query"`             | 非交互模式，直接输出回答后退出                                                           | `claude -p "explain this function"`                         |
| `cat file \| claude -p "query"` | 处理管道输入内容                                                                         | `cat logs.txt \| claude -p "explain"`                       |
| `claude -c`                     | 继续当前目录下最近的对话                                                                 | `claude -c`                                                 |
| `claude -c -p "query"`          | 通过 SDK 继续对话                                                                        | `claude -c -p "Check for type errors"`                      |
| `claude -r "<session>" "query"` | 按 ID 或名称恢复会话                                                                     | `claude -r "auth-refactor" "Finish this PR"`                |
| `claude update`                 | 更新到最新版本                                                                           | `claude update`                                             |
| `claude install [version]`      | 安装或重新安装原生二进制文件。接受版本号如 `2.1.118`，或 `stable`/`latest`               | `claude install stable`                                     |
| `claude auth login`             | 登录 Anthropic 账户。`--email` 预填邮箱，`--sso` 强制 SSO，`--console` 使用 Console 计费 | `claude auth login --console`                               |
| `claude auth logout`            | 退出 Anthropic 账户                                                                      | `claude auth logout`                                        |
| `claude auth status`            | 显示认证状态（JSON 格式）。`--text` 输出人类可读格式                                     | `claude auth status`                                        |
| `claude agents`                 | 打开代理视图监控和调度并行后台会话                                                       | `claude agents --json`                                      |
| `claude attach <id>`            | 在当前终端附加到后台会话                                                                 | `claude attach 7c5dcf5d`                                    |
| `claude stop <id>`              | 停止后台会话。也接受 `claude kill`                                                       | `claude stop 7c5dcf5d`                                      |
| `claude respawn <id>`           | 重启后台会话（保持对话）。`--all` 重启所有运行中的会话                                   | `claude respawn 7c5dcf5d`                                   |
| `claude rm <id>`                | 从列表中移除后台会话（对话记录保留在本地）                                               | `claude rm 7c5dcf5d`                                        |
| `claude logs <id>`              | 打印后台会话的最近输出                                                                   | `claude logs 7c5dcf5d`                                      |
| `claude mcp`                    | 配置 MCP 服务器                                                                          | 参见 MCP 文档                                               |
| `claude plugin`                 | 管理 Claude Code 插件                                                                    | `claude plugin install code-review@claude-plugins-official` |
| `claude project purge [path]`   | 删除项目的所有本地状态：记录、任务列表、调试日志等                                       | `claude project purge ~/work/repo --dry-run`                |
| `claude remote-control`         | 启动 Remote Control 服务器，可从 claude.ai 或 Claude 应用控制                            | `claude remote-control --name "My Project"`                 |
| `claude setup-token`            | 为 CI 和脚本生成长期 OAuth token                                                         | `claude setup-token`                                        |
| `claude ultrareview [target]`   | 非交互式运行 ultrareview，输出结果到 stdout                                              | `claude ultrareview 1234 --json`                            |
| `claude daemon status`          | 打印后台会话管理器的状态和诊断信息                                                       | `claude daemon status`                                      |
| `claude daemon stop --any`      | 停止后台会话管理器及其托管的会话                                                         | `claude daemon stop --any --keep-workers`                   |

:::tip
输入错误的子命令时，Claude Code 会建议最接近的匹配并退出。例如 `claude udpate` 会提示 `Did you mean claude update?`。
:::

## 常用 CLI 参数

### 会话控制

| 参数               | 说明                                                   | 示例                                    |
| :----------------- | :----------------------------------------------------- | :-------------------------------------- |
| `--continue`, `-c` | 加载当前目录下最近的对话                               | `claude --continue`                     |
| `--resume`, `-r`   | 按 ID 或名称恢复指定会话，或打开选择器                 | `claude --resume auth-refactor`         |
| `--fork-session`   | 恢复时创建新会话 ID 而非复用原会话                     | `claude --resume abc123 --fork-session` |
| `--name`, `-n`     | 设置会话显示名称，可通过 `claude --resume <name>` 恢复 | `claude -n "my-feature-work"`           |
| `--session-id`     | 使用指定的会话 ID（必须是有效的 UUID）                 | `claude --session-id "550e8400-..."`    |
| `--from-pr`        | 恢复与特定 PR 关联的会话。接受 PR 编号或 URL           | `claude --from-pr 123`                  |

### 模型与推理

| 参数               | 说明                                                       | 示例                                        |
| :----------------- | :--------------------------------------------------------- | :------------------------------------------ |
| `--model`          | 设置当前会话的模型。支持别名 `sonnet`、`opus` 或完整模型名 | `claude --model claude-sonnet-4-6`          |
| `--effort`         | 设置推理强度：`low`、`medium`、`high`、`xhigh`、`max`      | `claude --effort high`                      |
| `--fallback-model` | 主模型过载时自动切换到备用模型（仅 `-p` 模式和后台会话）   | `claude -p --fallback-model sonnet "query"` |

### 权限控制

| 参数                                   | 说明                                                                                         | 示例                                                                 |
| :------------------------------------- | :------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| `--permission-mode`                    | 以指定权限模式启动：`default`、`acceptEdits`、`plan`、`auto`、`dontAsk`、`bypassPermissions` | `claude --permission-mode plan`                                      |
| `--allowedTools`                       | 设置无需提示即可执行的工具规则                                                               | `"Bash(git log *)" "Read"`                                           |
| `--disallowedTools`                    | 设置拒绝规则。裸工具名移除该工具，带范围的规则仅拒绝匹配调用                                 | `"Bash(rm *)"`                                                       |
| `--tools`                              | 限制可用的内置工具。`""` 禁用全部，`"default"` 全部，或指定工具名                            | `claude --tools "Bash,Edit,Read"`                                    |
| `--allow-dangerously-skip-permissions` | 将 `bypassPermissions` 添加到 Shift+Tab 模式循环中                                           | `claude --permission-mode plan --allow-dangerously-skip-permissions` |
| `--dangerously-skip-permissions`       | 跳过权限提示，等同于 `--permission-mode bypassPermissions`                                   | `claude --dangerously-skip-permissions`                              |

### 输出控制

| 参数              | 说明                                                               | 示例                                                      |
| :---------------- | :----------------------------------------------------------------- | :-------------------------------------------------------- |
| `--print`, `-p`   | 非交互模式，直接输出回答                                           | `claude -p "query"`                                       |
| `--output-format` | 指定输出格式：`text`、`json`、`stream-json`                        | `claude -p "query" --output-format json`                  |
| `--input-format`  | 指定输入格式：`text`、`stream-json`                                | `claude -p --input-format stream-json`                    |
| `--verbose`       | 启用详细日志，显示完整的逐轮输出                                   | `claude --verbose`                                        |
| `--json-schema`   | 获取符合 JSON Schema 的验证输出（仅 `-p` 模式）                    | `claude -p --json-schema '{"type":"object",...}' "query"` |
| `--bare`          | 最小模式：跳过自动发现的钩子、技能、插件、MCP 等，加快脚本调用速度 | `claude --bare -p "query"`                                |

### 系统提示定制

| 参数                          | 说明                               | 示例                                                    |
| :---------------------------- | :--------------------------------- | :------------------------------------------------------ |
| `--system-prompt`             | 用自定义文本替换整个系统提示       | `claude --system-prompt "You are a Python expert"`      |
| `--system-prompt-file`        | 从文件加载系统提示，替换默认提示   | `claude --system-prompt-file ./custom-prompt.txt`       |
| `--append-system-prompt`      | 将自定义文本追加到默认系统提示末尾 | `claude --append-system-prompt "Always use TypeScript"` |
| `--append-system-prompt-file` | 从文件加载内容追加到默认系统提示   | `claude --append-system-prompt-file ./extra-rules.txt`  |

:::info
`--system-prompt` 和 `--system-prompt-file` 互斥。追加参数可与任一替换参数组合使用。替换模式会丢失所有默认提示（包括工具指导和安全说明），需自行负责。
:::

### MCP 与插件

| 参数                       | 说明                                                    | 示例                                                 |
| :------------------------- | :------------------------------------------------------ | :--------------------------------------------------- |
| `--mcp-config`             | 从 JSON 文件或字符串加载 MCP 服务器                     | `claude --mcp-config ./mcp.json`                     |
| `--strict-mcp-config`      | 仅使用 `--mcp-config` 中的 MCP 服务器，忽略其他所有配置 | `claude --strict-mcp-config --mcp-config ./mcp.json` |
| `--plugin-dir`             | 从目录或 `.zip` 加载插件（仅当前会话）                  | `claude --plugin-dir ./my-plugin`                    |
| `--plugin-url`             | 从 URL 获取插件 `.zip`（仅当前会话）                    | `claude --plugin-url https://example.com/plugin.zip` |
| `--disable-slash-commands` | 禁用当前会话的所有技能和命令                            | `claude --disable-slash-commands`                    |

### 目录与工作区

| 参数               | 说明                                                                    | 示例                              |
| :----------------- | :---------------------------------------------------------------------- | :-------------------------------- |
| `--add-dir`        | 添加额外工作目录以获取文件访问权限                                      | `claude --add-dir ../apps ../lib` |
| `--worktree`, `-w` | 在隔离的 git worktree 中启动。传入 `#number` 或 PR URL 可基于该 PR 创建 | `claude -w feature-auth`          |
| `--tmux`           | 为 worktree 创建 tmux 会话（需 `--worktree`）                           | `claude -w feature-auth --tmux`   |

### 执行控制

| 参数                       | 说明                                                   | 示例                                       |
| :------------------------- | :----------------------------------------------------- | :----------------------------------------- |
| `--max-turns`              | 限制代理轮次数量（仅 `-p` 模式）。达到限制时退出       | `claude -p --max-turns 3 "query"`          |
| `--max-budget-usd`         | API 调用的最大花费金额（仅 `-p` 模式）                 | `claude -p --max-budget-usd 5.00 "query"`  |
| `--bg`                     | 作为后台代理启动并立即返回，打印会话 ID                | `claude --bg "investigate the flaky test"` |
| `--exec`                   | 运行 shell 命令作为后台 PTY 作业（与 `--bg` 配合使用） | `claude --bg --exec 'pytest -x'`           |
| `--remote`                 | 在 claude.ai 上创建新的网页会话                        | `claude --remote "Fix the login bug"`      |
| `--remote-control`, `--rc` | 启用 Remote Control 的交互式会话                       | `claude --remote-control "My Project"`     |
| `--ide`                    | 启动时自动连接到可用的 IDE                             | `claude --ide`                             |
| `--chrome`                 | 启用 Chrome 浏览器集成                                 | `claude --chrome`                          |
| `--version`, `-v`          | 输出版本号                                             | `claude -v`                                |

### 高级选项

| 参数                                       | 说明                                                       | 示例                                                         |
| :----------------------------------------- | :--------------------------------------------------------- | :----------------------------------------------------------- |
| `--agent`                                  | 指定当前会话的代理（覆盖 `agent` 设置）                    | `claude --agent my-custom-agent`                             |
| `--agents`                                 | 通过 JSON 动态定义自定义子代理                             | `claude --agents '{"reviewer":{...}}'`                       |
| `--settings`                               | 指定设置 JSON 文件路径或内联 JSON 字符串                   | `claude --settings ./settings.json`                          |
| `--setting-sources`                        | 指定加载设置的来源：`user`、`project`、`local`             | `claude --setting-sources user,project`                      |
| `--debug`                                  | 启用调试模式，可选类别过滤                                 | `claude --debug "api,mcp"`                                   |
| `--debug-file <path>`                      | 将调试日志写入指定文件路径                                 | `claude --debug-file /tmp/claude-debug.log`                  |
| `--no-session-persistence`                 | 禁用会话持久化（仅 `-p` 模式）                             | `claude -p --no-session-persistence "query"`                 |
| `--exclude-dynamic-system-prompt-sections` | 将动态系统提示部分移至首条用户消息，改善跨机器的缓存命中率 | `claude -p --exclude-dynamic-system-prompt-sections "query"` |
| `--init`                                   | 运行 Setup 钩子的 `init` 匹配器（仅 `-p` 模式）            | `claude -p --init "query"`                                   |
| `--init-only`                              | 运行 Setup 和 SessionStart 钩子后退出                      | `claude --init-only`                                         |

## 下一步

- [斜杠命令](/commands/slash-commands) — 所有内置斜杠命令和捆绑技能
- [环境变量](/commands/env-vars) — 所有可配置的环境变量
- [自动化与 CI/CD](/guide/advanced/automation) — 在 CI/CD 管道中使用 Claude Code
