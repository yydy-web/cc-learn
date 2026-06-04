---
title: 命令速查
description: Claude Code 所有斜杠命令和 CLI 参数的完整参考
---

# 命令速查

## 斜杠命令

### 对话管理

| 命令       | 说明                              |
| ---------- | --------------------------------- |
| `/clear`   | 清空当前对话历史                  |
| `/compact` | 压缩对话上下文，保留关键信息      |
| `/cost`    | 查看当前会话的 token 使用量和费用 |
| `/help`    | 查看所有可用命令                  |

### 模型与配置

| 命令            | 说明             |
| --------------- | ---------------- |
| `/model`        | 查看当前模型     |
| `/model <name>` | 切换模型         |
| `/config`       | 查看和修改配置   |
| `/permissions`  | 查看当前权限设置 |

### 工作模式

| 命令    | 说明                       |
| ------- | -------------------------- |
| `/plan` | 进入计划模式，只分析不修改 |
| `/fast` | 切换快速模式               |

## CLI 参数

### 基本用法

```bash
claude                    # 启动交互式会话
claude --print "问题"     # 非交互模式，直接输出回答
claude --resume           # 恢复上一次会话
claude --continue         # 继续上一次会话
```

### 输出格式

```bash
claude --print --output-format json "问题"     # JSON 格式输出
claude --print --output-format stream-json "问题"  # 流式 JSON 输出
```

### 模型选择

```bash
claude --model claude-opus-4-8 "问题"     # 指定模型
```

### 权限控制

```bash
claude --allowedTools "Bash(npm *)" "Edit"  # 限制可用工具
claude --disallowedTools "Bash(rm *)"       # 禁止特定工具
```

### MCP 配置

```bash
claude --mcp-config path/to/config.json    # 指定 MCP 配置文件
```

## 环境变量

| 变量                            | 说明               |
| ------------------------------- | ------------------ |
| `ANTHROPIC_API_KEY`             | Anthropic API 密钥 |
| `CLAUDE_MODEL`                  | 默认使用的模型     |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | 最大输出 token 数  |
