---
title: 第一次对话
description: 学习与 Claude Code 交互的基本方式和高效对话技巧
---

# 第一次对话

启动 Claude Code 后，你会看到一个交互式终端界面。输入自然语言即可开始对话。

## 基本交互

### 提问

最简单的方式是直接提问：

```
> 这个项目用了什么框架？主要的依赖有哪些？
```

Claude Code 会自动读取 `package.json`、配置文件等来回答。

### 发出指令

告诉 Claude Code 你想做什么：

```
> 在 src/utils/ 目录下创建一个 validators.ts 文件，包含邮箱和手机号的验证函数
```

Claude Code 会创建文件、编写代码，然后等待你的确认。

### 多轮对话

你可以基于上一次的结果继续追问：

```
> 帮我给这两个验证函数加上单元测试
```

## 高效对话技巧

### 1. 提供足够上下文

❌ 模糊的指令：
```
> 修复这个 bug
```

✅ 清晰的指令：
```
> 用户登录后 token 没有保存到 localStorage，导致刷新页面后需要重新登录。
> 帮我检查 src/auth/login.ts 中的登录逻辑并修复。
```

### 2. 指定文件或目录

```
> 打开 src/components/Header.tsx，把导航栏的颜色改成深蓝色
```

```
> 检查 src/api/ 目录下所有文件的错误处理，确保都有 try-catch
```

### 3. 分步完成复杂任务

```
> 第一步：帮我分析一下 src/database/ 下的表结构
> 第二步：给 users 表添加一个 last_login_at 字段
> 第三步：更新相关的查询代码
```

### 4. 利用 @ 引用文件

```
> @src/config.ts 中的 API_BASE_URL 在生产环境应该用什么值？
```

## 对话管理

| 命令 | 作用 |
|------|------|
| `/clear` | 清空当前对话历史 |
| `/compact` | 压缩对话上下文，节省 token |
| `/help` | 查看所有可用命令 |

:::tip
当对话变长时，使用 `/compact` 可以压缩上下文，让 Claude Code 保持高效响应。
:::

## 下一步

- [文件操作](/guide/beginner/file-operations) — 深入了解文件读写能力
- [权限管理](/guide/beginner/permissions) — 了解 Claude Code 的权限机制
