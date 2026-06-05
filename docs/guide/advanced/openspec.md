---
title: OpenSpec 规格驱动开发
description: 使用 OpenSpec 为 Claude Code 添加规格驱动开发工作流，先定义规格再写代码
---

# OpenSpec 规格驱动开发

OpenSpec 是一个规格驱动开发（Spec-Driven Development）框架，为 AI 编程助手提供结构化的规格层。它解决了一个核心问题：当需求只存在于聊天记录中时，AI 的输出是不可预测的。OpenSpec 让人和 AI 在写代码之前先"对齐要构建什么"。

## 为什么需要 OpenSpec

直接告诉 Claude Code "帮我做一个功能"，可能会遇到：

- AI 理解的需求和你的意图有偏差
- 缺少明确的验收标准，改完不知道对不对
- 需求变更时，之前的上下文已经丢失
- 多人协作时，没有共享的需求文档

OpenSpec 通过**规格文档**解决这些问题——每个变更都有独立的文件夹，包含提案、规格、设计和任务清单，所有内容都提交到 Git，成为持久化的上下文。

## 安装

### 系统要求

- **Node.js** 20.19.0 或更高版本
- **Claude Code** — 必须已安装

### 安装 OpenSpec

```bash
npm install -g @fission-ai/openspec@latest
```

也支持其他包管理器：

```bash
pnpm add -g @fission-ai/openspec@latest
yarn global add @fission-ai/openspec@latest
bun add -g @fission-ai/openspec@latest
```

### 初始化项目

在项目目录中运行：

```bash
cd your-project
openspec init
```

初始化会创建以下结构：

```
openspec/
  specs/           # 规格源（按领域组织）
  changes/         # 提议的变更
  config.yaml      # 项目配置（可选）
.claude/
  skills/          # OpenSpec Skills
  commands/opsx/   # OpenSpec 斜杠命令
```

:::tip
`openspec init` 会自动检测已安装的 AI 工具并生成对应的命令文件。对于 Claude Code，会创建 `.claude/commands/opsx/` 目录。
:::

### 通过 CC-Switch 安装

如果你已安装 [CC-Switch](/guide/advanced/cc-switch)，可以通过 Skills 市场发现 OpenSpec 相关的社区 Skills：

1. 打开 CC-Switch Desktop
2. 进入 Skills 市场
3. 搜索 "openspec"
4. 选择需要的 Skills 安装到 Claude Code

:::info
OpenSpec 的核心安装需要运行 `openspec init` 来初始化项目结构和命令文件。CC-Switch 主要用于发现和管理 OpenSpec 发布到 skills.sh 的独立 Skills。
:::

## 核心工作流

OpenSpec 的核心是三步工作流：

```
Propose → Apply → Archive
  提案   →  实现  →  归档
```

### 第一步：Propose（提案）

在 Claude Code 中运行：

```
> /opsx:propose add-password-reset
```

OpenSpec 会创建一个变更文件夹，包含：

```
openspec/changes/add-password-reset/
  proposal.md     # 提案：做什么、为什么做
  specs/          # 规格：新增/修改/删除的需求
  design.md       # 设计：技术架构和决策
  tasks.md        # 任务：实现清单（带复选框）
```

每个文件都是结构化的 Markdown，AI 会根据你的描述自动生成初稿，你可以逐个审阅和修改。

:::info
`proposal.md` 是变更的入口——它定义了意图、范围和方法。所有后续文件都基于提案生成。
:::

### 第二步：Apply（实现）

审阅完规格后，让 Claude Code 按照任务清单实现：

```
> /opsx:apply
```

Claude Code 会：

1. 读取 `tasks.md` 中的任务清单
2. 逐个实现每个任务
3. 完成后自动勾选复选框

```
- [x] 创建密码重置 API 端点
- [x] 添加邮件发送逻辑
- [x] 编写测试用例
- [x] 更新 API 文档
```

### 第三步：Archive（归档）

实现完成后，归档变更：

```
> /opsx:archive
```

归档操作会：

1. 将增量规格合并到主规格目录（`openspec/specs/`）
2. 将变更文件夹移动到带日期的归档目录
3. 更新规格源，反映系统的新状态

:::tip
归档后的规格成为"活文档"——它描述了系统当前的行为。下次修改时，新的提案会基于这些规格生成增量变更。
:::

## 探索模式

当你还不确定要做什么时，用探索模式：

```
> /opsx:explore
```

探索模式会开启一个开放式对话，不会生成任何文件。适合：

- 调研可行性
- 讨论技术方案
- 澄清需求

确认方向后，再用 `/opsx:propose` 创建正式的变更提案。

## 扩展工作流

通过配置 Profile 启用更多命令：

```bash
openspec config profile
openspec update
```

### 扩展命令

| 命令                 | 用途                         |
| -------------------- | ---------------------------- |
| `/opsx:new`          | 仅创建变更文件夹，等待下一步 |
| `/opsx:continue`     | 按依赖关系逐个生成制品       |
| `/opsx:ff`           | 快进：一次性生成所有制品     |
| `/opsx:verify`       | 验证实现是否完整、正确、一致 |
| `/opsx:bulk-archive` | 批量归档多个变更             |
| `/opsx:onboard`      | 交互式教程，走完完整工作流   |

### 工作流模式

**快速功能（需求明确）：**

```
new → ff → apply → verify → archive
```

**探索式（需求不明确）：**

```
explore → new → continue → continue → apply → archive
```

**并行变更：**

同时维护多个变更文件夹，各自独立推进。

## 配置

### 项目配置

配置文件位于 `openspec/config.yaml`：

```yaml
schema: spec-driven
context:
  stack: "Next.js + TypeScript + Prisma"
  api_style: "REST"
  testing: "Vitest"
  语言：中文（简体）
rules:
  proposal: "简洁描述做什么和为什么"
  specs: "每个需求包含 Given/When/Then 场景"
  design: "记录权衡和考虑过的替代方案"
```

:::tip
OpenSpec 支持多语言输出——在 `context` 中设置 `语言：中文（简体）`，AI 会用中文生成所有规格文档。
:::

### 自定义 Schema

Schema 定义了制品类型和依赖关系。默认使用 `spec-driven`：

```
proposal → specs → design → tasks → implement
```

创建自定义 Schema：

```bash
openspec schema fork spec-driven my-workflow
```

### CLI 命令

```bash
# 查看活跃的变更
openspec list

# 查看变更详情
openspec show <name>

# 验证结构问题
openspec validate

# 交互式仪表盘
openspec view

# 查看制品完成状态
openspec status

# 更新 AI 命令文件
openspec update
```

## 规格文档结构

每个变更文件夹包含四个核心制品：

### proposal.md（提案）

```markdown
# 提案：添加密码重置功能

## 意图

用户忘记密码时，可以通过邮箱重置密码。

## 范围

- 新增密码重置 API 端点
- 添加邮件发送服务
- 前端重置密码页面

## 方法

使用 JWT 令牌实现，令牌有效期 15 分钟。
```

### specs/（规格）

```markdown
# 密码重置规格

## ADDED

### 需求 1：请求重置

- GIVEN 用户在登录页面点击"忘记密码"
- WHEN 输入注册邮箱并提交
- THEN 系统发送包含重置链接的邮件

## MODIFIED

### 需求 2：用户表

- 新增 `reset_token` 字段
- 新增 `reset_token_expires` 字段
```

### design.md（设计）

```markdown
# 技术设计

## 架构决策

- 使用 JWT 而非数据库存储令牌
- 令牌有效期 15 分钟
- 每次请求生成新令牌（旧令牌失效）

## API 设计

POST /api/auth/request-reset
POST /api/auth/reset-password
```

### tasks.md（任务）

```markdown
# 实现任务

- [ ] 创建密码重置 API 端点
- [ ] 添加 JWT 令牌生成逻辑
- [ ] 实现邮件发送服务
- [ ] 创建前端重置密码页面
- [ ] 编写 API 测试
- [ ] 更新 API 文档
```

## 与其他工具的关系

### OpenSpec vs Superpowers

[Superpowers](/guide/advanced/superpowers) 和 OpenSpec 解决不同层面的问题：

| 方面         | OpenSpec                                   | Superpowers                        |
| ------------ | ------------------------------------------ | ---------------------------------- |
| **核心理念** | 规格驱动——先定义"做什么"                   | 方法论驱动——先设计"怎么做"         |
| **制品**     | 规格文档（proposal、specs、design、tasks） | 过程 Skills（头脑风暴、TDD、审查） |
| **持久化**   | 规格提交到 Git，成为活文档                 | 过程是临时的，完成后不保留         |
| **适用场景** | 需求复杂、需要文档化                       | 开发过程需要纪律                   |

:::tip
两者可以结合使用：OpenSpec 社区提供了 `superpowers-bridge` Schema，将 Superpowers 的头脑风暴、TDD、代码审查等 Skills 桥接到 OpenSpec 的工作流中。
:::

### OpenSpec vs Gstack

[Gstack](/guide/advanced/gstack) 聚焦工程团队模拟（QA、安全、浏览器测试），OpenSpec 聚焦需求规格化。两者互补：用 OpenSpec 定义需求，用 Gstack 的 `/review` 和 `/qa` 做质量保障。

## 相关资源

- [OpenSpec GitHub](https://github.com/Fission-AI/OpenSpec) — 项目仓库（52k+ Stars）
- [OpenSpec 文档](https://openspec.dev) — 官方文档网站
- [OpenSpec npm](https://www.npmjs.com/package/@fission-ai/openspec) — npm 包页面

## 下一步

- [OpenSpec + Superpowers 双层规划](/guide/advanced/openspec-superpowers) — 企业级双层规划工作流
- [Superpowers 插件](/guide/advanced/superpowers) — 互补的结构化开发方法论
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 API Provider 和 Skills
- [自定义技能](/skills/overview/custom-skills) — 创建和管理自定义 Skills
- [Ralph 自主循环](/skills/workflow/ralph) — 互补的自主实现方案
