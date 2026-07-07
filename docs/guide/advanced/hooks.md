---
title: Hooks
description: 掌握 Claude Code 的 Hooks 钩子系统，在工具调用、通知、会话等事件前后自动执行自定义脚本，实现代码规范检查、自动格式化和通知发送等自动化行为
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★★☆    |
| 🧪 测试 | ★★★☆☆  | ★★★★★    |
| 📦 产品 | ★★☆☆☆  | ★★★★★    |

**🎯 学习产出：** 掌握 Claude Code 的 Hooks 系统，能自定义事件触发的自动化行为

**🚀 AI 能力提升：** 自动化工作流、技能扩展
:::

# Hooks

Hooks 允许你在 Claude Code 执行特定操作的前后自动运行脚本。这可以用来强制执行代码规范、自动格式化、发送通知等。

## 工作原理

Claude Code 有以下 Hook 事件：

| 事件               | 触发时机               |
| ------------------ | ---------------------- |
| `SessionStart`     | 会话开始时             |
| `UserPromptSubmit` | 用户提交提示词时       |
| `PreToolUse`       | 工具调用之前           |
| `PostToolUse`      | 工具调用之后           |
| `Notification`     | Claude Code 发送通知时 |
| `Stop`             | 对话结束时             |
| `SessionEnd`       | 会话结束时             |

### Hooks 的实际应用：Claude-Mem

[Claude-Mem](/guide/advanced/claude-mem) 是一个利用 Hooks 实现全自动记忆的典型案例。它注册了 5 个生命周期 Hook：

| Hook 事件          | Claude-Mem 的用途                  |
| ------------------ | ---------------------------------- |
| `SessionStart`     | 从数据库检索相关上下文，注入新会话 |
| `UserPromptSubmit` | 记录用户意图                       |
| `PostToolUse`      | 将工具调用结果压缩为观察记录并存储 |
| `Stop`             | 记录会话结束状态                   |
| `SessionEnd`       | 生成会话级摘要                     |

Claude-Mem 通过这些 Hooks 实现了**零干预的跨会话记忆**——用户无需手动"记住"任何东西，系统在后台自动工作。

:::info
Claude-Mem 是理解 Hooks 实战用法的好案例。完整介绍请参考 [Claude-Mem 持久记忆](/guide/advanced/claude-mem)。
:::

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

- [Claude-Mem 持久记忆](/guide/advanced/claude-mem) — 使用 Hooks 实现自动记忆的实战案例
- [MCP 服务器](/guide/advanced/mcp-servers) — 用 MCP 扩展 Claude Code 的工具能力
- [自定义技能](/skills/overview/custom-skills) — 创建自定义的 Skills 和 Agents
