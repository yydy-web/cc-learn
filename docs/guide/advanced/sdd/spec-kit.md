---
title: Spec-Kit 规格驱动开发
description: 使用 GitHub Spec-Kit 实现规格驱动开发（SDD），从规格文档自动生成高质量实现
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★☆☆ |
| 🧪 测试 | ★★★☆☆ | ★★★★☆ |
| 📦 产品 | ★★★☆☆ | ★★★★☆ |

**🎯 学习产出：** 掌握 Spec-Kit 的 7 步完整工作流（Constitution → Specify → Clarify → Plan → Validate → Tasks → Implement），能独立使用 Spec-Kit 从零搭建规格驱动的开发项目

**🚀 AI 能力提升：** 规格驱动、代码生成
:::

# Spec-Kit 规格驱动开发

[Spec-Kit](https://github.com/github/spec-kit) 是 GitHub 官方开源的规格驱动开发（Spec-Driven Development, SDD）工具包。它的核心理念是：**规格（Spec）不是代码的附属品，代码才是规格的实现产物**。当需求变更时，你重新生成规格而非手动重写代码。

## 什么是规格驱动开发

传统开发中，代码是主角，规格文档往往写完就过时。SDD 反转了这个关系：

```
传统模式：需求 → 写代码 → 补文档（经常遗漏）
SDD 模式：需求 → 写规格 → 自动生成代码（规格永不过时）
```

Spec-Kit 将这个理念落地为一个完整的 7 步工作流，由 AI Agent（如 Claude Code）辅助执行：

1. **Constitution** — 建立项目治理原则（不可变的开发宪法）
2. **Specify** — 描述要构建什么（关注 WHAT 和 WHY，不涉及技术栈）
3. **Clarify** — 结构化 Q&A 澄清模糊需求
4. **Plan** — 生成技术实现方案（含技术选型理由）
5. **Validate** — 审计计划的完整性和一致性
6. **Tasks** — 拆分依赖有序的任务列表
7. **Implement** — 按任务列表 TDD 驱动实现

:::info
Spec-Kit 的"宪法"机制（Constitution）是其独特之处——它在 `memory/constitution.md` 中定义项目不可违背的原则（如 Library-First、Test-First、Anti-Abstraction），所有后续生成的规格和代码都受这些原则约束。
:::

## 安装

### 前置条件

- Python 3.11+
- Git
- [uv](https://docs.astral.sh/uv/)（推荐）或 pipx

### 安装命令

```bash
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@latest
```

### 版本管理

```bash
specify self check                    # 检查是否有新版本
specify self upgrade --dry-run        # 预览升级操作
specify self upgrade                  # 升级到最新稳定版
specify self upgrade --tag v0.9.4     # 固定到特定版本
```

## 初始化项目

### 新项目

```bash
specify init my-project --integration claude
cd my-project
```

### 现有项目

```bash
cd existing-project
specify init . --integration claude
```

`--integration claude` 会为 Claude Code 生成对应的 Skills 或斜杠命令文件。支持 33 种 AI 编码工具，包括 Copilot、Gemini CLI、Cursor、Codex 等。

### 初始化后的目录结构

```
.specify/
  memory/constitution.md          # 项目治理原则
  scripts/bash/                   # 辅助脚本
  templates/                      # 规格/计划/任务模板
specs/
  001-feature-name/
    spec.md                       # 需求规格（WHAT + WHY）
    plan.md                       # 技术实现方案（HOW）
    tasks.md                      # 依赖有序的任务列表
    data-model.md                 # 数据模型
    research.md                   # 技术调研笔记
    quickstart.md                 # 快速开始指南
    contracts/                    # API 契约规格
```

## 核心命令

### 基础流程命令

| 命令                    | 用途                               |
| ----------------------- | ---------------------------------- |
| `/speckit.constitution` | 创建/更新项目治理原则              |
| `/speckit.specify`      | 定义需求规格（用户故事、行为描述） |
| `/speckit.clarify`      | 结构化 Q&A 澄清模糊需求            |
| `/speckit.plan`         | 生成技术实现方案（含技术选型理由） |
| `/speckit.tasks`        | 生成依赖有序的任务列表             |
| `/speckit.implement`    | 按任务列表 TDD 驱动实现            |

### 辅助命令

| 命令                     | 用途                           |
| ------------------------ | ------------------------------ |
| `/speckit.analyze`       | 跨工件一致性和覆盖率分析       |
| `/speckit.checklist`     | 生成质量检查清单               |
| `/speckit.taskstoissues` | 将任务列表转换为 GitHub Issues |

## 完整工作流示例

以一个"任务管理应用"为例，演示从规格到实现的完整流程：

### 步骤一：建立治理原则

```
> /speckit.constitution
> 我的项目原则：
> - 每个功能必须是一个独立的库
> - 严格 TDD：测试写好、审批通过、确认失败后才能写实现代码
> - 初始不超过 3 个项目
> - 直接使用框架特性，不做二次封装
```

### 步骤二：编写规格

```
> /speckit.specify
> 构建一个任务管理应用：
> - 用户可以创建、编辑、删除任务
> - 任务有标题、描述、优先级、截止日期
> - 支持按状态筛选（待办、进行中、已完成）
> - 支持按优先级和截止日期排序
```

Spec-Kit 会创建 `specs/001-create-taskify/spec.md`，只关注 **WHAT 和 WHY**，不涉及技术栈选择。

### 步骤三：澄清需求

```
> /speckit.clarify
> 澄清规格中的模糊点
```

系统会通过结构化 Q&A 提问，例如：

- 任务的优先级有几级？
- 截止日期是必填还是选填？
- 删除是软删除还是硬删除？
- 是否需要用户认证？

### 步骤四：生成技术方案

```
> /speckit.plan
> 基于规格生成技术实现方案
```

生成 `plan.md`（技术选型及理由）、`data-model.md`（数据模型）、`research.md`（技术调研）。

### 步骤五：拆分任务

```
> /speckit.tasks
> 将技术方案拆分为可执行的任务列表
```

生成 `tasks.md`，包含依赖关系、并行标记 `[P]`、TDD 结构。

### 步骤六：实现

```
> /speckit.implement
> 按任务列表实现
```

Spec-Kit 验证前置条件后，按依赖顺序执行任务，严格遵循 TDD。

## 模板与扩展

### 模板覆盖优先级

Spec-Kit 支持多层模板覆盖，优先级从高到低：

1. `.specify/templates/overrides/` — 项目级覆盖
2. `.specify/presets/templates/` — 预设模板
3. `.specify/extensions/templates/` — 扩展模板
4. `.specify/templates/` — 核心模板

### Extensions（扩展）

扩展添加新的命令和工作流：

```bash
specify extension search          # 浏览可用扩展
specify extension add <name>      # 安装扩展
specify extension list            # 查看已安装扩展
```

### Presets（预设）

预设定制现有工作流的模板格式：

```bash
specify preset search             # 浏览可用预设
specify preset add <name>         # 安装预设
```

| 目标                    | 使用      |
| ----------------------- | --------- |
| 添加新命令或工作流      | Extension |
| 定制规格/计划/任务格式  | Preset    |
| 集成外部工具（Jira 等） | Extension |
| 强制组织/合规标准       | Preset    |

## 与其他工具的关系

Spec-Kit 与 CC Learn 文档中介绍的其他工具互补：

| 工具            | 与 Spec-Kit 的关系                                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **OpenSpec**    | 同属规格驱动，OpenSpec 轻量（proposal → specs → design → tasks），Spec-Kit 更完整（含 Constitution、Clarify、Analyze） |
| **Superpowers** | Superpowers 提供开发纪律（TDD、代码审查），Spec-Kit 的 `/speckit.implement` 可调用 Superpowers 执行                    |
| **Gstack**      | Gstack 的 `/office-hours` 可作为 Spec-Kit 的需求探索前置步骤                                                           |
| **ECC**         | ECC 的 Agent 和 Skill 可在 Spec-Kit 的实现阶段增强代码质量                                                             |

:::tip
如果项目较简单，用 OpenSpec 的 proposal → specs → tasks 流程就够了。如果项目复杂、团队多人协作、需要严格的规格治理和可追溯性，Spec-Kit 的 Constitution + 7 步工作流更合适。
:::

## 相关资源

- [Spec-Kit GitHub](https://github.com/github/spec-kit) — 源码和完整文档
- [Spec-Driven Development](https://github.com/github/spec-kit/blob/main/spec-driven.md) — SDD 方法论完整文档
- [Spec-Kit Extensions](https://speckit-community.github.io/extensions/) — 社区扩展市场

## 下一步

- [OpenSpec 规格驱动](/guide/advanced/sdd/openspec) — 了解轻量级的规格驱动方案
- [Superpowers 开发工作流](/guide/advanced/superpowers) — 了解 TDD 纪律和代码审查
- [最佳实践](/tips/best-practices) — 将 Spec-Kit 融入完整开发工作流
