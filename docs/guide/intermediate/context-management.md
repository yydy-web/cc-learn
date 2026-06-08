---
title: 上下文管理
description: 管理 Claude Code 的对话上下文、记忆和 token 消耗
---

# 上下文管理

理解 Claude Code 的上下文机制，可以让你的对话更高效、更省钱。

## 上下文窗口

Claude Code 的上下文窗口有限。当对话变长时，早期的内容会被压缩或丢弃。

### 影响上下文的因素

- 对话轮次越多，上下文占用越大
- 读取的文件内容会占用上下文
- 工具调用的输出也会占用上下文

## 压缩上下文

当对话变长时，使用 `/compact` 命令：

```
> /compact
```

这会压缩对话历史，保留关键信息，释放上下文空间。

:::tip
每 10-15 轮对话后执行一次 `/compact`，可以保持 Claude Code 的响应质量。
:::

## 记忆系统

Claude Code 有持久化的记忆系统，存储在 `~/.claude/projects/<project>/memory/` 目录下。

### 保存记忆

```
> 记住：这个项目的数据库迁移命令是 pnpm db:migrate，不是 prisma migrate
```

Claude Code 会将这条信息保存为记忆文件，下次对话时自动加载。

### 记忆类型

| 类型        | 说明                      |
| ----------- | ------------------------- |
| `user`      | 用户偏好和个人信息        |
| `feedback`  | 对 Claude Code 行为的反馈 |
| `project`   | 项目特定的信息和约束      |
| `reference` | 外部资源链接              |

### 管理记忆

```
> 列出你目前记住的所有信息
```

```
> 删除关于 xxx 的记忆
```

## 跨会话持久记忆

Claude Code 的内置 Memory 需要用户主动触发（"记住这个"），且以文本片段存储。对于长期项目，可以使用 [Claude-Mem](/guide/advanced/claude-mem) 实现**全自动的跨会话记忆**：

- **自动捕获**：通过 Hooks 自动记录每次会话中的工具调用和关键发现
- **语义检索**：使用向量数据库进行智能搜索，而非简单的文本匹配
- **渐进披露**：三层检索模式（索引→时间线→详情），节省 10 倍 Token
- **零配置**：安装后自动工作，无需手动维护

```bash
npx claude-mem install
```

:::info
Claude-Mem 的记忆是**自动积累**的——它在后台记录你的工作过程，新会话启动时自动注入相关上下文。详见 [Claude-Mem 持久记忆](/guide/advanced/claude-mem)。
:::

## 省钱技巧

### 1. 及时压缩

```
> /compact
```

### 2. 用 /clear 重新开始

当切换到不相关的任务时：

```
> /clear
```

### 3. 精确指定范围

❌ 消耗大量上下文：

```
> 读一下整个项目，然后帮我优化性能
```

✅ 精确高效：

```
> 读一下 src/api/users.ts，帮我优化这个文件中的数据库查询
```

### 4. 使用 /cost 监控

```
> /cost
```

定期检查 token 用量，避免意外消耗。

## 下一步

- [Claude-Mem 持久记忆](/guide/advanced/claude-mem) — 自动化的跨会话记忆系统
- [Hooks](/guide/advanced/hooks) — 用生命周期钩子自动化操作
- [MCP 服务器](/guide/advanced/mcp-servers) — 扩展 Claude Code 的能力
