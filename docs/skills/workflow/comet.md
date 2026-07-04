---
title: Comet 技能生态
description: Comet 五阶段自动化流水线的 Skills 体系详解——一键串联 OpenSpec 与 Superpowers，用守卫脚本确保严格流程
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★★★☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★★    |

**🎯 学习产出：** 掌握 Comet 工作流，能独立串联 OpenSpec 和 Superpowers 构建自动化开发流水线

**🚀 AI 能力提升：** 自动化工作流
:::

# Comet 技能生态

Comet 提供 7 个 Skills，将 OpenSpec 和 Superpowers 串联为一条自动化流水线。

## 核心理念

OpenSpec 管规格、Superpowers 管执行，但两者原生无自动联动。Comet 作为桥接层，用守卫脚本和状态文件确保每个阶段严格执行、不跳步。

## 7 个 Skills 一览

| Skill            | 阶段    | 触发命令          | 职责                                  |
| ---------------- | ------- | ----------------- | ------------------------------------- |
| `comet`          | 入口    | `/comet`          | 总入口，初始化流水线                  |
| `comet-open`     | 1. 开启 | `/comet-open`     | 创建 proposal.md, design.md, tasks.md |
| `comet-design`   | 2. 设计 | `/comet-design`   | 深度设计，生成 delta spec             |
| `comet-build`    | 3. 构建 | `/comet-build`    | TDD 驱动实现，子智能体并行开发        |
| `comet-verify`   | 4. 验证 | `/comet-verify`   | 代码测试 + 规范合规双重校验           |
| `comet-archive`  | 5. 归档 | `/comet-archive`  | delta 合并进主 spec                   |
| `comet-continue` | 续接    | `/comet continue` | 从断点恢复流水线                      |

## 安装

```bash
# 一键安装（含 OpenSpec + Superpowers）
npm install -g @rpamis/comet
cd your-project
comet init
```

## 快速上手

```text
# 1. 开启变更
> /comet-open 添加用户认证功能

# 2. 深度设计
> /comet-design

# 3. 构建实现（自动 TDD）
> /comet-build

# 4. 验证收尾
> /comet-verify

# 5. 归档
> /comet-archive
```

中途断开？执行 `/comet continue` 从断点继续。

## 快捷路径

| 命令            | 场景                                  |
| --------------- | ------------------------------------- |
| `/comet-hotfix` | 快速修 Bug，跳过 brainstorming        |
| `/comet-tweak`  | 小改动，跳过 brainstorming 和完整计划 |

## 与其他 Skills 的关系

| 维度     | Comet         | OpenSpec   | Superpowers |
| -------- | ------------- | ---------- | ----------- |
| 定位     | 自动化桥接    | 规格管理   | 执行纪律    |
| 独立使用 | ❌ 依赖前两者 | ✅         | ✅          |
| 核心价值 | 消除手动衔接  | 需求可追溯 | TDD + 审查  |

## 下一步

- [Comet 插件完整文档](/guide/advanced/comet) — 安装、配置、完整工作流
- [OpenSpec 技能生态](/skills/workflow/openspec) — 规格驱动开发
- [Superpowers 技能生态](/skills/workflow/superpowers) — 14 个 Skills 一览
