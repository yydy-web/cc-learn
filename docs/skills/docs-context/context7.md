---
title: Context7 文档驱动 Skills
description: Context7 的 Skills 管理 CLI 和实时文档注入——搜索、安装、推荐和 AI 生成 Skills 的完整指南
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★★☆☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握 Context7 实时文档注入和 Skills 管理，能独立配置 MCP 并搜索安装社区 Skills

**🚀 AI 能力提升：** 上下文管理、技能扩展
:::

# Context7 文档驱动 Skills

[Context7](/guide/advanced/context7) 不仅提供实时文档注入（MCP 模式），还内置了完整的 Skills 管理 CLI（`ctx7`），支持搜索、安装、推荐和 AI 生成 Skills。

:::tip
本页属于[技能系统](/skills/)的一部分。MCP 配置和文档查询详情请参考 [Context7 实时文档](/guide/advanced/context7)。
:::

## Skills 管理 CLI

Context7 的 `ctx7` CLI 提供了 Skills 的完整生命周期管理：

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

## 安装

```bash
npx ctx7 setup --claude
```

一键完成 OAuth 认证、MCP 服务器配置和 Skill 安装。

## 与其他 Skills 渠道的对比

| 渠道                                             | 特色                   | 适用场景           |
| ------------------------------------------------ | ---------------------- | ------------------ |
| [skills.sh](/skills/overview/skills-marketplace) | 公共注册中心           | 发现社区 Skills    |
| [CC-Switch](/skills/overview/skills-marketplace) | GUI + 跨工具同步       | 批量管理           |
| **ctx7 CLI**                                     | **AI 生成 + 自动推荐** | **智能发现和创建** |

## 下一步

- [Context7 实时文档（完整文档）](/guide/advanced/context7) — MCP 配置和文档查询
- [技能市场](/skills/overview/skills-marketplace) — 更多 Skills 发现渠道
- [自定义技能](/skills/overview/custom-skills) — 手动创建 Skills
