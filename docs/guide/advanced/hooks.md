---
title: Hooks
description: 使用生命周期 Hooks 在 Claude Code 操作前后自动执行脚本
---

# Hooks

Hooks 允许你在 Claude Code 执行特定操作的前后自动运行脚本。这可以用来强制执行代码规范、自动格式化、发送通知等。

## 工作原理

Claude Code 有以下 Hook 事件：

| 事件           | 触发时机               |
| -------------- | ---------------------- |
| `PreToolUse`   | 工具调用之前           |
| `PostToolUse`  | 工具调用之后           |
| `Notification` | Claude Code 发送通知时 |
| `Stop`         | 对话结束时             |

## 配置 Hooks

在 `.claude/settings.json` 中配置：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'About to run a bash command'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATH"
          }
        ]
      }
    ]
  }
}
```

## 实用示例

### 自动格式化代码

每次 Claude Code 编辑文件后自动运行 Prettier：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATH"
          }
        ]
      }
    ]
  }
}
```

### 运行测试前检查

在运行测试命令前自动检查语法：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo '$CLAUDE_COMMAND' | grep -q 'npm test'; then npx tsc --noEmit; fi"
          }
        ]
      }
    ]
  }
}
```

### Git 提交前 lint

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo '$CLAUDE_COMMAND' | grep -q 'git commit'; then npm run lint; fi"
          }
        ]
      }
    ]
  }
}
```

## Hook 环境变量

Hook 脚本可以访问以下环境变量：

| 变量               | 说明               |
| ------------------ | ------------------ |
| `CLAUDE_FILE_PATH` | 当前操作的文件路径 |
| `CLAUDE_COMMAND`   | 当前执行的命令     |

## 注意事项

- Hook 脚本应该是快速的，避免阻塞 Claude Code
- Hook 失败不会阻止 Claude Code 继续执行（除非配置了阻止）
- 建议只在必要时使用 Hook，过多的 Hook 会降低响应速度

## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 用 MCP 扩展 Claude Code 的工具能力
- [自定义技能](/skills/overview/custom-skills) — 创建自定义的 Skills 和 Agents
