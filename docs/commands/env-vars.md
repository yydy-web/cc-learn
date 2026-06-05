---
title: 环境变量
description: Claude Code 所有可配置环境变量的完整参考，涵盖认证、模型、行为控制等
---

# 环境变量

Claude Code 支持通过环境变量控制行为、配置认证和调整性能。在 shell 配置文件中设置，或在启动时内联传递。

## 认证与 API

| 变量 | 说明 |
| :--- | :--- |
| `ANTHROPIC_API_KEY` | Anthropic API 密钥。设置后覆盖 Pro/Max/Team/Enterprise 订阅认证 |
| `ANTHROPIC_AUTH_TOKEN` | 自定义 `Authorization` 头的值（自动添加 `Bearer ` 前缀） |
| `ANTHROPIC_BASE_URL` | 覆盖 API 端点 URL（用于代理/网关路由） |
| `CLAUDE_CODE_OAUTH_TOKEN` | OAuth 访问令牌，用于 Claude.ai 认证（替代 `/login`） |
| `CLAUDE_CODE_OAUTH_REFRESH_TOKEN` | OAuth 刷新令牌（用于自动化环境） |
| `CLAUDE_CODE_OAUTH_SCOPES` | 刷新令牌的 OAuth 作用域（与 `CLAUDE_CODE_OAUTH_REFRESH_TOKEN` 配合使用） |

## 模型配置

| 变量 | 说明 |
| :--- | :--- |
| `ANTHROPIC_MODEL` | 默认使用的模型名称，覆盖 `model` 设置 |
| `CLAUDE_MODEL` | 等同于 `ANTHROPIC_MODEL` |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | 覆盖默认 Sonnet 模型 |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | 覆盖默认 Opus 模型 |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | 覆盖默认 Haiku 模型 |
| `CLAUDE_CODE_EFFORT_LEVEL` | 设置推理强度：`low`、`medium`、`high`、`xhigh`、`max`、`auto` |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | 最大输出 token 数。增大时会减少自动压缩前的可用上下文窗口 |

## 行为控制

| 变量 | 说明 |
| :--- | :--- |
| `CLAUDE_CODE_MAX_TURNS` | 无显式限制时的代理轮次上限，等同于 `--max-turns` |
| `CLAUDE_CODE_MAX_RETRIES` | API 请求失败的重试次数（默认：10） |
| `CLAUDE_CODE_MAX_CONTEXT_TOKENS` | 覆盖假定的上下文窗口大小（需同时设置 `DISABLE_COMPACT`） |
| `CLAUDE_CODE_MAX_TOOL_USE_CONCURRENCY` | 最大并行只读工具和子代理数（默认：10） |
| `CLAUDE_CODE_DISABLE_THINKING` | 设为 `1` 强制禁用扩展思考 |
| `CLAUDE_CODE_DISABLE_FAST_MODE` | 设为 `1` 禁用快速模式 |
| `CLAUDE_CODE_DISABLE_CRON` | 设为 `1` 禁用定时任务 |
| `CLAUDE_CODE_DISABLE_WORKFLOWS` | 设为 `1` 禁用工作流 |

## 上下文与记忆

| 变量 | 说明 |
| :--- | :--- |
| `CLAUDE_CODE_DISABLE_CLAUDE_MDS` | 设为 `1` 禁止加载任何 CLAUDE.md 记忆文件 |
| `CLAUDE_CODE_DISABLE_AUTO_MEMORY` | 设为 `1` 禁用自动记忆。设为 `0` 强制启用 |
| `CLAUDE_CODE_ADDITIONAL_DIRECTORIES_CLAUDE_MD` | 设为 `1` 从 `--add-dir` 目录加载记忆文件 |
| `CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS` | 设为 `1` 从系统提示中移除内置 git 工作流指令 |
| `CLAUDE_AUTOCOMPACT_PCT_OVERRIDE` | 自动压缩触发的上下文容量百分比（默认约 95%） |

## 工具与功能

| 变量 | 说明 |
| :--- | :--- |
| `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS` | 设为 `1` 禁用所有后台任务功能 |
| `CLAUDE_CODE_DISABLE_AGENT_VIEW` | 设为 `1` 关闭后台代理和代理视图 |
| `CLAUDE_CODE_DISABLE_FILE_CHECKPOINTING` | 设为 `1` 禁用文件检查点，`/rewind` 将无法恢复代码变更 |
| `CLAUDE_CODE_DISABLE_ATTACHMENTS` | 设为 `1` 禁用附件处理，`@` 文件提及作为纯文本发送 |
| `CLAUDE_CODE_NEW_INIT` | 设为 `1` 使 `/init` 运行交互式设置流程 |
| `BASH_DEFAULT_TIMEOUT_MS` | Bash 命令的默认超时时间（默认：120000 / 2 分钟） |
| `BASH_MAX_TIMEOUT_MS` | 模型可设置的最大 Bash 超时时间（默认：600000 / 10 分钟） |
| `BASH_MAX_OUTPUT_LENGTH` | Bash 输出的最大字符数，超出部分保存到文件 |

## 界面与渲染

| 变量 | 说明 |
| :--- | :--- |
| `CLAUDE_CODE_NO_FLICKER` | 设为 `1` 启用全屏渲染 |
| `CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN` | 设为 `1` 禁用全屏渲染，使用经典渲染器 |
| `CLAUDE_CODE_HIDE_CWD` | 设为 `1` 在启动 logo 中隐藏工作目录 |
| `CLAUDE_CODE_ACCESSIBILITY` | 设为 `1` 保持终端原生光标可见 |

## 云平台

| 变量 | 说明 |
| :--- | :--- |
| `CLAUDE_CODE_USE_BEDROCK` | 设为 `1` 启用 Amazon Bedrock 支持 |
| `CLAUDE_CODE_USE_VERTEX` | 设为 `1` 启用 Google Vertex AI 支持 |
| `ANTHROPIC_BEDROCK_BASE_URL` | 覆盖 Bedrock 端点 URL |
| `ANTHROPIC_VERTEX_BASE_URL` | 覆盖 Vertex AI 端点 URL |
| `ANTHROPIC_VERTEX_PROJECT_ID` | GCP 项目 ID（用于 Vertex AI 请求） |

## 诊断

| 变量 | 说明 |
| :--- | :--- |
| `CLAUDE_CODE_DEBUG_LOGS_DIR` | 调试日志文件路径（需单独启用调试模式） |
| `CLAUDE_CODE_DEBUG_LOG_LEVEL` | 最低日志级别：`verbose`、`debug`（默认）、`info`、`warn`、`error` |
| `DISABLE_TELEMETRY` | 禁用遥测数据收集 |
| `DISABLE_AUTOUPDATER` | 禁用自动更新 |
| `DISABLE_ERROR_REPORTING` | 禁用错误报告 |
| `DO_NOT_TRACK` | 禁用跟踪（遵循标准隐私约定） |
| `CLAUDECODE` | Claude Code 生成的子进程中自动设为 `1`，用于检测是否在 Claude Code 子进程中运行 |

## 下一步

- [斜杠命令](/commands/slash-commands) — 所有内置斜杠命令和捆绑技能
- [CLI 参考](/commands/cli-reference) — CLI 子命令和启动参数
- [设置与配置](https://code.claude.com/docs/en/settings) — settings.json 配置文件
