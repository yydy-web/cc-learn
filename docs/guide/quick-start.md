---
title: 快速开始
description: 5 分钟内完成 Claude Code 的安装和首次使用，从安装 Node.js 依赖、启动 CLI 到运行第一次编程对话，快速体验 AI 编程助手的核心能力
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★☆☆☆☆    |
| 🧪 测试 | ★★★★☆  | ★☆☆☆☆    |
| 📦 产品 | ★★★★☆  | ★☆☆☆☆    |

**🎯 学习产出：** 掌握 Claude Code 的基本使用流程，能快速开始第一次编程对话

**🚀 AI 能力提升：** 代码生成、上下文管理
:::

# 快速开始

5 分钟内完成 Claude Code 的安装和首次使用。

## 安装

确保已安装 Node.js 18+，然后全局安装：

```bash
npm install -g @anthropic-ai/claude-code
```

## 首次运行

在任意项目目录下启动：

```bash
cd your-project
claude
```

Claude Code 会自动读取项目结构，你可以在终端中直接与其对话。

## 试试这些操作

### 1. 了解项目

```
> 这个项目是做什么的？帮我总结一下代码结构
```

### 2. 修改代码

```
> 在 src/utils.ts 中添加一个 formatDate 函数，将 Date 对象格式化为 YYYY-MM-DD 字符串
```

### 3. 运行命令

```
> 运行项目的测试，如果有失败的帮我修复
```

### 4. Git 操作

```
> 把今天的改动提交一下，用英文写 commit message
```

## 下一步

:::tip 不同角色的学习路径
如果你是测试、产品经理或非技术背景用户，建议先查看对应的[学习路径](/guide/learning-path/)，按角色规划学习路线，事半功倍。
:::

- [什么是 Claude Code](/guide/beginner/what-is-claude-code) — 了解 Claude Code 的能力和设计理念
- [安装与配置](/guide/beginner/installation) — 详细的安装步骤和环境配置
- [第一次对话](/guide/beginner/first-conversation) — 学习如何高效地与 Claude Code 交互
