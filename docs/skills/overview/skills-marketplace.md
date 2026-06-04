---
title: 技能市场
description: 浏览和安装社区 Skills——skills.sh 注册中心、CC-Switch 市场和 ctx7 CLI
---

# 技能市场

Claude Code 的社区 Skills 生态通过多个平台提供发现和安装能力。本页介绍三个主要渠道：skills.sh 公共注册中心、CC-Switch 市场和 Context7 CLI。

:::tip
本页属于[技能系统](/skills/)的一部分。想从零开始创建自己的 Skills？请参考[自定义技能](/skills/overview/custom-skills)。
:::

## skills.sh 注册中心

[skills.sh](https://skills.sh) 是社区 Skills 的公共注册中心，托管来自 Anthropic、Vercel Labs 等组织和个人的 Skills。

```bash
# 安装 Skills CLI
npm install -g skills

# 从 skills.sh 安装社区 Skill
npx skills add <skill-url>

# 例如：安装 Anthropic 官方的前端设计 Skill
npx skills add https://github.com/anthropics/skills --skill frontend-design
```

### 热门 Skills 速查

| Skill | 来源 | 用途 |
|-------|------|------|
| `frontend-design` | Anthropic | 高品质前端界面设计 |
| `web-design-guidelines` | Vercel Labs | 100+ 条 Web UI 最佳实践 |
| `ui-ux-pro-max` | 社区 | 全栈 UI/UX 设计系统 |
| `react-best-practices` | 社区 | React 开发规范 |
| `vue-best-practices` | 社区 | Vue 3 开发规范 |
| `superpowers` | 社区 | 14 个结构化开发 Skills |

:::info
完整的前端框架推荐 Skills 列表，请参考[前端开发最佳实践 > 推荐 Skills](/tips/frontend-best-practices#推荐-skills)。
:::

## CC-Switch 市场

[CC-Switch](/guide/advanced/cc-switch) 提供可视化的 Skills 市场界面，支持一键安装和跨工具同步：

1. 打开 CC-Switch Desktop
2. 进入 Skills 市场
3. 按分类浏览或搜索 Skills
4. 点击安装到 Claude Code（也支持 Codex、Gemini CLI）

```bash
# 通过 CC-Switch CLI 安装 Skills
cc-switch skills install superpowers

# 同步到所有已配置的工具
cc-switch skills sync
```

CC-Switch 通过 skills.sh 注册中心发现社区 Skills，同时支持将本地 `.agents/skills/` 中的自定义 Skills 发布到注册中心。

:::tip
如果你需要在多个 AI 工具（Claude Code、Codex、Gemini CLI）之间同步 Skills 配置，CC-Switch 是最佳选择。
:::

## Context7 CLI

[Context7](/skills/docs-context/context7) 提供了 `ctx7` CLI 工具用于 Skills 管理：

```bash
# 搜索 Skills
ctx7 skills search react

# 安装 Skills
ctx7 skills install /owner/repo

# 根据项目依赖自动推荐
ctx7 skills suggest

# 列出已安装 Skills
ctx7 skills list

# 移除 Skills
ctx7 skills remove <name>

# AI 生成自定义 Skill（需登录）
ctx7 skills generate
```

## 安装方式对比

| 方式 | 适用场景 | 特点 |
|------|----------|------|
| `npx skills add` | 安装单个 Skill | 简单直接，支持 URL 和 GitHub 引用 |
| CC-Switch 市场 | 批量管理和跨工具同步 | GUI 界面，一键安装，跨工具同步 |
| `ctx7` CLI | 搜索和 AI 生成 | 自动推荐，AI 生成 Skill |
| `git clone` | 完整工具包安装 | 如 Gstack、Ralph 等需要 `setup` 脚本的工具 |

## 下一步

- [自定义技能](/skills/overview/custom-skills) — 创建自己的 Skills
- [Superpowers 插件](/skills/workflow/superpowers) — 结构化开发工作流
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 详细的 CC-Switch 使用指南
