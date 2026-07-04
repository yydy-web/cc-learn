---
title: Serena 代码语义 Skills
description: Serena 的 MCP 语义工具集详解——符号查找、精确重命名、符号级编辑和重构，为 Claude Code 提供 IDE 级的代码操作能力
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★★☆☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握 Serena 代码智能，能独立进行符号级精确重构和语义编辑

**🚀 AI 能力提升：** 跨文件重构、上下文管理
:::

# Serena 代码语义 Skills

[Serena](/guide/advanced/serena) 是一个 MCP 工具包，通过 LSP 或 JetBrains 分析引擎为 Claude Code 提供 IDE 级的符号级代码操作能力。

:::tip
本页属于[技能系统](/skills/)的一部分。安装配置和完整使用指南请参考 [Serena 代码语义工具](/guide/advanced/serena)。
:::

## 核心 MCP 工具

### 检索工具

| 工具                       | 用途               |
| -------------------------- | ------------------ |
| `find_symbol`              | 按名称查找符号     |
| `get_symbols_overview`     | 文件符号大纲       |
| `find_referencing_symbols` | 查找符号的所有引用 |

### 编辑工具

| 工具                   | 用途                     |
| ---------------------- | ------------------------ |
| `rename_symbol`        | 精确重命名符号及所有引用 |
| `replace_symbol_body`  | 替换符号实现             |
| `insert_before_symbol` | 在符号前插入代码         |
| `insert_after_symbol`  | 在符号后插入代码         |

### 重构工具（JetBrains 专属）

| 工具                 | 用途                 |
| -------------------- | -------------------- |
| `move_symbol`        | 移动符号到其他文件   |
| `move_file`          | 移动文件并更新导入   |
| `safe_delete`        | 安全删除（检查引用） |
| `inline_refactoring` | 内联重构             |

## 安装

```bash
# 安装
uv tool install -p 3.13 serena-agent

# 初始化
serena init

# 注册 MCP
claude mcp add --scope user serena -- serena
```

完整安装指南和配置选项请参考 [Serena 安装文档](/guide/advanced/serena#安装)。

## 与同类工具的对比

| 方面         | Serena                  | CodeGraph           | Code Review Graph   |
| ------------ | ----------------------- | ------------------- | ------------------- |
| **核心能力** | 语义重构 + 符号编辑     | 代码探索 + 知识图谱 | 代码审查 + 架构分析 |
| **重构**     | ✅ 精确重命名/移动/删除 | ❌                  | ❌                  |
| **符号编辑** | ✅ 替换/插入符号体      | ❌                  | ❌                  |
| **调试**     | ✅ JetBrains 专属       | ❌                  | ❌                  |
| **影响分析** | 引用查找                | ✅ 专用工具         | ✅ Blast-Radius     |
| **最佳场景** | 精确重构                | 日常探索            | PR 审查             |

三者可组合使用，通过 MCP 并行运行，互不冲突。

## 下一步

- [Serena 代码语义工具（完整文档）](/guide/advanced/serena) — 安装、配置和使用指南
- [CodeGraph 代码智能](/guide/advanced/code-graph/codegraph) — 代码探索和知识图谱
- [技能系统](/skills/) — 所有 Skills 概览
