---
title: Claude-Mem 持久记忆 Skills
description: Claude-Mem 的 MCP 搜索工具集——三层渐进式检索、语义搜索、时间线回溯
---

# Claude-Mem 持久记忆 Skills

[Claude-Mem](/guide/advanced/claude-mem) 是一个开源的持久记忆压缩系统，通过 Hooks 自动捕获会话观察，生成语义摘要，并在新会话中注入相关上下文。

:::tip
本页属于[技能系统](/skills/)的一部分。安装配置和完整使用指南请参考 [Claude-Mem 持久记忆](/guide/advanced/claude-mem)。
:::

## 核心 MCP 工具

Claude-Mem 提供 4 个 MCP 搜索工具，遵循**三层渐进式检索**模式——先浏览索引，再确认上下文，最后获取详情，实现约 10 倍 Token 节省。

### 搜索工具

| 工具 | 用途 | Token 成本 |
| ---- | ---- | ---------- |
| `search` | 自然语言搜索记忆索引，支持按类型、日期、项目过滤 | ~50-100 tokens/条 |
| `timeline` | 获取特定观察周围的时间线上下文 | 中等 |
| `get_observations` | 按 ID 批量获取完整观察详情 | ~500-1,000 tokens/条 |

### 三层检索流程

```typescript
// 第 1 步：搜索索引（低成本）
search(query="认证模块 bug", type="bugfix", limit=10)

// 第 2 步：确认上下文（中等成本）
timeline(observation_id=123)

// 第 3 步：获取详情（仅对相关 ID）
get_observations(ids=[123, 456])
```

## 自动捕获的内容

Claude-Mem 通过 5 个生命周期 Hooks 自动捕获：

| Hook 事件 | 捕获内容 |
| --------- | -------- |
| `SessionStart` | 注入历史上下文到新会话 |
| `UserPromptSubmit` | 记录用户意图 |
| `PostToolUse` | 压缩工具调用为观察记录 |
| `Stop` | 记录会话结束状态 |
| `SessionEnd` | 生成会话摘要 |

## 安装

```bash
# npx 安装（推荐）
npx claude-mem install

# 或通过插件市场
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
```

安装后重启 Claude Code 即可。完整安装指南和配置选项请参考 [Claude-Mem 安装文档](/guide/advanced/claude-mem#安装)。

## 隐私控制

使用 `<private>` 标签排除敏感内容：

```
> 数据库密码是 <private>secret123</private>，帮我配置连接
```

## 与其他工具的关系

| 方面 | Claude-Mem | [Context7](/skills/docs-context/context7) |
| ---- | ---------- | ---------------------------------------- |
| **定位** | 跨会话持久记忆 | 实时库文档注入 |
| **数据来源** | 会话观察和工具调用 | 第三方库官方文档 |
| **工作方式** | 自动捕获 + 语义检索 | 按需查询最新文档 |
| **解决的问题** | "上次会话做了什么" | "这个库的最新 API 是什么" |

两者互补：Context7 提供**外部知识**（库文档），Claude-Mem 提供**内部知识**（项目经验）。

## 下一步

- [Claude-Mem 持久记忆（完整文档）](/guide/advanced/claude-mem) — 安装、架构和使用指南
- [Context7 实时文档](/skills/docs-context/context7) — 库文档注入 Skills
- [技能系统](/skills/) — 所有 Skills 概览
