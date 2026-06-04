---
title: Git 工作流
description: 使用 Claude Code 高效管理 Git 操作，从提交到 PR 全流程
---

# Git 工作流

Claude Code 可以帮你完成日常的 Git 操作，从查看状态到创建 PR。

## 查看状态

```
> 帮我看看当前有哪些改动？用 git diff 展示一下具体改了什么
```

Claude Code 会运行 `git status` 和 `git diff`，然后用人类可读的方式总结改动。

## 提交代码

### 普通提交

```
> 把今天的改动提交一下
```

Claude Code 会：

1. 查看所有改动
2. 分析改动内容
3. 生成合适的 commit message
4. 执行 `git add` 和 `git commit`

### 指定提交信息

```
> 提交这些改动，commit message 用英文，格式遵循 Conventional Commits
```

### 部分提交

```
> 只提交 src/auth/ 目录下的改动，其他先不提交
```

## 分支操作

### 创建分支

```
> 从 main 创建一个 feature/user-profile 分支
```

### 切换分支

```
> 切换到 develop 分支
```

### 合并分支

```
> 把 feature/user-profile 合并到 main
```

## 创建 Pull Request

```
> 帮我创建一个 PR，目标分支是 main，标题和描述用英文
```

Claude Code 会：

1. 推送当前分支到远程
2. 用 `gh` CLI 创建 PR
3. 自动生成 PR 描述，包括改动摘要

### 审查 PR

```
> 帮我审查一下这个 PR 的代码改动，看看有没有问题
```

## 解决冲突

```
> 合并 main 分支时有冲突，帮我解决一下
```

Claude Code 会：

1. 识别冲突文件
2. 分析两边的改动
3. 给出合理的合并方案
4. 解决冲突后继续合并

:::warning
对于复杂的冲突，建议仔细检查 Claude Code 的解决方案再确认。
:::

## 实用技巧

### 写好的 Commit Message

```
> 提交改动，commit message 遵循以下规范：
> - 用英文
> - 格式：type(scope): description
> - type 用 feat/fix/refactor/docs/chore
```

### 查看历史

```
> 最近一周有哪些提交？帮我总结一下团队的开发进展
```

### 撤销操作

```
> 撤销上一次提交，但保留改动在工作区
```

## 下一步

- [上下文管理](/guide/intermediate/context-management) — 管理对话上下文和记忆
- [Hooks](/guide/advanced/hooks) — 用 Git Hooks 自动化工作流
