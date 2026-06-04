---
title: Superpowers 插件
description: 使用 Superpowers 插件为 Claude Code 添加结构化开发工作流，包括头脑风暴、TDD 和代码审查
---

# Superpowers 插件

Superpowers 是一个开源的 Claude Code 插件，为 AI 编程助手提供结构化的软件开发工作流。它将专业的开发方法论（头脑风暴、计划、TDD、代码审查）封装为可组合的 Skills，让 Claude Code 按照最佳实践执行开发任务。

## 为什么需要 Superpowers

默认情况下，Claude Code 收到任务后会直接开始写代码。这在简单场景下没问题，但面对复杂功能时容易出现：

- 没有充分理解需求就开始编码
- 缺少设计思考，代码结构不合理
- 没有测试覆盖，后续修改容易出错
- 跳过代码审查，质量问题被忽略

Superpowers 通过 **7 步工作流** 强制执行纪律：先设计、再计划、用 TDD 实现、最后审查。

## 安装

### 方式一：直接安装（推荐）

在 Claude Code 中运行：

```
> /plugin install superpowers@claude-plugins-official
```

安装完成后，Superpowers 会在每次会话启动时自动加载。

### 方式二：通过 CC-Switch 安装

如果你已经安装了 [CC-Switch](/guide/advanced/cc-switch)，可以通过 Skills 市场安装：

1. 打开 CC-Switch Desktop
2. 进入 Skills 市场
3. 搜索 "superpowers"
4. 点击安装到 Claude Code

:::tip
CC-Switch 通过 skills.sh 公共注册中心发现社区 Skills，Superpowers 的所有 Skills 都已发布到 skills.sh。如果你需要在多个工具（Claude Code、Codex、Gemini CLI）之间同步 Skills，使用 CC-Switch 安装更方便。
:::

## 七步工作流

Superpowers 的核心是一个 7 步开发工作流，每一步对应一个或多个 Skill：

```
1. 头脑风暴 (Brainstorming)
   ↓
2. Git Worktree 隔离工作区
   ↓
3. 编写计划 (Writing Plans)
   ↓
4. 子智能体驱动开发 (Subagent-Driven Development)
   ↓
5. 测试驱动开发 (TDD)
   ↓
6. 代码审查 (Code Review)
   ↓
7. 完成分支 (Finishing a Branch)
```

### 第一步：头脑风暴

在写任何代码之前，Claude Code 会：

1. 通过提问探索你的需求意图
2. 提出 2-3 个方案并分析利弊
3. 逐节展示设计方案
4. 将设计写入 `docs/superpowers/specs/` 目录
5. 等你确认后才继续

```
> 我想给用户系统添加密码重置功能
```

Claude Code 会先问你一系列问题（邮件验证？手机验证？令牌过期时间？），而不是直接开始写代码。

:::info
这是一个"硬门控"——设计未获批准前，Superpowers 会阻止任何代码实现。
:::

### 第二步：Git Worktree 隔离

创建隔离的 Git 工作区，避免直接在主分支上开发：

- 自动创建新分支和 worktree 目录
- 检测项目类型并安装依赖
- 确认测试基线是干净的

### 第三步：编写计划

将设计拆分为 2-5 分钟的小任务，每个任务包含：

- 精确的文件路径和行号
- 完整的代码块（没有占位符）
- 运行命令和预期输出
- Git 提交指令

计划保存到 `docs/superpowers/plans/` 目录。

### 第四步：子智能体驱动开发

每个任务由独立的子智能体执行，实现上下文隔离：

- 每个任务有独立的上下文窗口
- 两阶段审查：先检查是否符合规格，再检查代码质量
- 子智能体报告状态：`DONE`、`DONE_WITH_CONCERNS`、`NEEDS_CONTEXT`、`BLOCKED`

### 第五步：测试驱动开发（TDD）

严格遵循 RED-GREEN-REFACTOR 循环：

```
1. 🔴 RED    — 先写失败的测试
2. 🟢 GREEN  — 写最少的代码让测试通过
3. 🔵 REFACTOR — 重构优化，保持测试通过
```

:::warning
Superpowers 严格执行"先测试后代码"规则。如果代码在测试之前写好，会被要求删除重来。
:::

### 第六步：代码审查

对照原始计划审查代码：

- 关键问题会阻止合并
- 使用独立的审查子智能体，避免上下文偏见
- 审查范围：安全性、性能、代码质量、测试覆盖

### 第七步：完成分支

开发完成后，提供 4 个选项：

| 选项     | 说明                    |
| -------- | ----------------------- |
| 本地合并 | 直接合并到当前分支      |
| 创建 PR  | 推送并创建 Pull Request |
| 保留现状 | 保持分支不动            |
| 丢弃     | 删除分支和工作区        |

## 核心 Skills 一览

Superpowers 包含 14 个 Skills，分为两类：

### 流程类 Skills（严格遵循）

| Skill                            | 用途               |
| -------------------------------- | ------------------ |
| `brainstorming`                  | 编码前的设计探索   |
| `writing-plans`                  | 详细的任务拆分     |
| `test-driven-development`        | 严格的 TDD 循环    |
| `systematic-debugging`           | 4 阶段根因分析     |
| `verification-before-completion` | "有证据才能说完成" |
| `finishing-a-development-branch` | 分支收尾流程       |

### 灵活类 Skills（可按需调整）

| Skill                         | 用途                  |
| ----------------------------- | --------------------- |
| `executing-plans`             | 在当前会话中执行计划  |
| `subagent-driven-development` | 子智能体驱动开发      |
| `dispatching-parallel-agents` | 并行任务协调          |
| `using-git-worktrees`         | 隔离工作区管理        |
| `requesting-code-review`      | 发起代码审查          |
| `receiving-code-review`       | 处理审查反馈          |
| `writing-skills`              | 基于 TDD 创建新 Skill |
| `using-superpowers`           | 引导 Skill，自动加载  |

## 手动调用 Skills

虽然 Superpowers 会根据场景自动触发合适的 Skill，你也可以手动调用：

```
> /superpowers:brainstorming
> 帮我设计一个缓存策略

> /superpowers:systematic-debugging
> 用户反馈登录偶尔会超时，帮我排查

> /superpowers:test-driven-development
> 用 TDD 方式实现文件上传功能
```

## 工作流示例

### 示例一：开发新功能

```
> 使用 Superpowers 工作流，给 API 添加分页支持
```

Claude Code 会自动执行完整流程：

1. 头脑风暴：问你分页参数、排序、总数返回等需求
2. 设计：提出 cursor-based vs offset-based 方案
3. 计划：拆分为模型、路由、测试等小任务
4. TDD：每个任务先写测试再实现
5. 审查：检查代码质量和性能
6. 完成：选择合并或创建 PR

### 示例二：调试复杂问题

```
> /superpowers:systematic-debugging
> 生产环境内存持续增长，怀疑有内存泄漏
```

Superpowers 会按照 4 阶段系统性排查：

1. 复现问题
2. 收集证据（heap snapshot、日志分析）
3. 形成假设并验证
4. 修复并添加防护测试

## 与 Gstack 的对比

Superpowers 和 [Gstack](/guide/advanced/gstack) 都是 Claude Code 的 Skill 插件，可以互补使用：

- **Superpowers** 聚焦**结构化方法论**——TDD、头脑风暴、计划驱动开发
- **Gstack** 聚焦**工程团队模拟**——QA、安全审计、浏览器测试、发布流程

推荐的组合方式：用 Superpowers 做前期设计和 TDD 实现，用 Gstack 的 `/review`、`/qa`、`/cso` 做后期保障。

OpenSpec 社区还提供了 `superpowers-bridge` Schema，可以将 Superpowers 的 Skills（头脑风暴、TDD、代码审查）直接桥接到 [OpenSpec](/guide/advanced/openspec) 的规格驱动工作流中。

## 与 CC-Switch 配合使用

Superpowers 和 [CC-Switch](/guide/advanced/cc-switch) 是互补的工具：

- **Superpowers** 管理开发**方法论**——怎么写代码
- **CC-Switch** 管理开发**配置**——用什么 Provider、MCP 服务器

通过 CC-Switch 的 Skills 市场，你可以：

1. 浏览 Superpowers 的所有 14 个 Skills
2. 一键安装到 Claude Code、Codex 或 Gemini CLI
3. 在多个工具之间同步 Skills 配置

```bash
# 通过 CC-Switch CLI 安装 Superpowers Skills
cc-switch skills install superpowers

# 同步到所有已配置的工具
cc-switch skills sync
```

:::tip
Superpowers 的 14 个 Skills 概览和与其他 Skills 工具的关系对比，请参考 [Superpowers 技能生态](/skills/workflow/superpowers)。更多 Skills 资源请访问[技能系统](/skills/)。
:::

## 相关资源

- [Superpowers GitHub](https://github.com/obra/superpowers) — 项目仓库（216k+ Stars）
- [Skills.sh](https://skills.sh) — 社区 Skills 注册中心
- [Superpowers 文档](https://github.com/obra/superpowers#readme) — 完整使用文档

## 下一步

- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 API Provider 和 Skills
- [多智能体工作流](/guide/advanced/multi-agent) — 编排多个 Agent 协作
- [自动化与 CI/CD](/guide/advanced/automation) — 在 CI/CD 中使用 Claude Code
