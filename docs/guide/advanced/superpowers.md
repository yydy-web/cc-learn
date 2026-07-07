---
title: Superpowers 插件
description: 使用 Superpowers 插件为 Claude Code 添加结构化开发工作流，包括头脑风暴、TDD 和代码审查
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★★☆    |
| 🧪 测试 | ★★★☆☆  | ★★★★★    |
| 📦 产品 | ★★★☆☆  | ★★★★★    |

**🎯 学习产出：** 掌握 Superpowers 的 14 个 Skills 管道模型和三大铁律，能独立使用 7 步工作流（头脑风暴 → 计划 → 隔离 → 子智能体 → TDD → 审查 → 完成）进行结构化 AI 辅助开发

**🚀 AI 能力提升：** 技能扩展、自动化工作流
:::

# Superpowers 插件

Superpowers 是一个开源的 Claude Code 插件，为 AI 编程助手提供结构化的软件开发工作流。它将专业的开发方法论（头脑风暴、计划、TDD、代码审查）封装为可组合的 Skills，让 Claude Code 按照最佳实践执行开发任务。

## 为什么需要 Superpowers

默认情况下，Claude Code 收到任务后会直接开始写代码。这在简单场景下没问题，但面对复杂功能时容易出现：

- 没有充分理解需求就开始编码
- 缺少设计思考，代码结构不合理
- 没有测试覆盖，后续修改容易出错
- 跳过代码审查，质量问题被忽略

Superpowers 通过 **7 步工作流** 强制执行纪律：先设计、再计划、用 TDD 实现、最后审查。

## 核心理念：管道而非工具箱

大多数人把 Superpowers 当成工具箱——需要时取出一个工具用一下。这是对 Superpowers 最大的误解。

Superpowers 的 14 个 Skills 不是并列的工具，而是一条**接力管道（Pipeline）**。它们之间是严格的接力关系：

```text
入口 → 设计 → 规划 → 隔离 → 执行 → 实现与测试 → 调试 → 审查 → 并行 → 验证 → 收尾
 ↑                                                                              ↓
 └──────────────────────── 元技能：writing-skills ────────────────────────────────┘
```

| 阶段       | Skill                                              | 上游依赖          |
| ---------- | -------------------------------------------------- | ----------------- |
| 入口       | `using-superpowers`                                | —                 |
| 设计       | `brainstorming`                                    | 入口              |
| 规划       | `writing-plans`                                    | 设计              |
| 隔离       | `using-git-worktrees`                              | 规划              |
| 执行       | `executing-plans` / `subagent-driven-development`  | 规划 + 隔离       |
| 实现与测试 | `test-driven-development`                          | 执行              |
| 调试       | `systematic-debugging`                             | 实现与测试        |
| 审查       | `requesting-code-review` / `receiving-code-review` | 实现与测试 + 调试 |
| 并行       | `dispatching-parallel-agents`                      | 规划              |
| 验证       | `verification-before-completion`                   | 审查              |
| 收尾       | `finishing-a-development-branch`                   | 验证              |
| 元技能     | `writing-skills`                                   | —                 |

每一环的输出是下一环的输入。跳过任何一步，后续步骤的质量都会打折扣。

:::tip
理解 Pipeline 心智模型是高效使用 Superpowers 的关键。不要试图"挑选"某个 Skill 单独使用——它们设计为协作的整体。元技能 `writing-skills` 用于创建新的自定义 Skills，独立于主 Pipeline。
:::

## 三大铁律

Superpowers 的 7 步工作流背后有三条不可违反的铁律：

### 铁律一：没有设计，不写代码

`brainstorming` 是硬门控——设计未获批准前，Superpowers 会阻止任何代码实现。

这不是"建议"，而是"规则"。如果你跳过头脑风暴直接要求写代码，Superpowers 会：

1. 提醒你需要先完成设计
2. 问你一系列澄清问题
3. 直到设计确认后才允许继续

**为什么重要：** 大部分返工都源于"需求没搞清楚就开始写"。10 分钟的头脑风暴可以节省 2 小时的重构。

### 铁律二：没有测试，不写代码

`test-driven-development` 严格执行 RED-GREEN-REFACTOR 循环：

```text
1. 🔴 RED    — 先写失败的测试（证明需求存在且未被满足）
2. 🟢 GREEN  — 写最少的代码让测试通过（不做多余的事）
3. 🔵 REFACTOR — 在测试保护下重构（改善结构而不改变行为）
```

如果代码在测试之前写好，Superpowers 会**要求你删除重来**。

**为什么重要：** 没有测试的代码是"一次性代码"——你不知道它是否正确，也无法安全地修改它。

### 铁律三：没有验证，不说完成

`verification-before-completion` 要求你提供**新鲜的证据**（刚运行的命令输出）才能声称任务完成。

"我觉得代码没问题了" 不算完成。
"测试全部通过了" 不算完成（除非你刚运行过）。
"这是刚运行的 mvn test 输出，全部绿色" 算完成。

**为什么重要：** AI 的"自信"不可靠——它可能在没有实际运行的情况下声称测试通过。只有真实运行的输出才能证明。

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
2. 编写计划 (Writing Plans)
   ↓
3. Git Worktree 隔离工作区
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

### 第二步：编写计划

将设计拆分为 2-5 分钟的小任务，每个任务包含：

- 精确的文件路径和行号
- 完整的代码块（没有占位符）
- 运行命令和预期输出
- Git 提交指令

计划保存到 `docs/superpowers/plans/` 目录。

### 第三步：Git Worktree 隔离

创建隔离的 Git 工作区，避免直接在主分支上开发：

- 自动创建新分支和 worktree 目录
- 检测项目类型并安装依赖
- 确认测试基线是干净的

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

## 系统化调试

`systematic-debugging` 是 Superpowers 中最容易被忽视的 Skill。大多数人遇到 Bug 就直接让 Claude Code "帮我看看哪里出错了"——这等于让医生不问诊就开药。

### 四阶段调试流程

```text
阶段 1：复现与证据收集
  ├─ 稳定复现步骤
  ├─ 错误日志 / 堆栈信息
  └─ 最近的代码变更（git log）

       ↓

阶段 2：根因分析
  ├─ 排除法：哪些地方不可能出问题？
  ├─ 假设法：最可能的原因是什么？
  └─ 验证法：如何证明假设正确？

       ↓

阶段 3：修复实现
  ├─ 最小修复：只改必须改的
  ├─ TDD：先写能暴露 Bug 的测试
  └─ 回归测试：确认修复不引入新问题

       ↓

阶段 4：防护加固
  ├─ 添加边界条件测试
  ├─ 添加防御性代码（如果适用）
  └─ 更新文档记录根因和修复方案
```

### 三振出局规则

如果同一个问题尝试了 3 次仍未解决，Superpowers 会触发升级：

| 尝试次数 | 动作                                           |
| -------- | ---------------------------------------------- |
| 第 1 次  | 按最可能的假设尝试修复                         |
| 第 2 次  | 换一个假设，扩大排查范围                       |
| 第 3 次  | 停下来，整理所有已知信息，请求人工介入或换策略 |

:::warning
不要在同一个假设上反复尝试。如果第一次修复不起作用，说明假设可能错误——换方向比重复更有效。
:::

### 使用示例

```text
> /superpowers:systematic-debugging
> 生产环境 API 响应时间从 200ms 突然增长到 5s，没有代码变更
```

Superpowers 的排查路径：

1. **复现**：确认是所有接口还是特定接口？是否与流量相关？
2. **证据**：查看 APM 监控、数据库慢查询日志、连接池状态
3. **假设**：数据库连接池耗尽？第三方服务超时？GC 停顿？
4. **验证**：逐个排查假设，找到根因
5. **修复**：最小化修复 + 防护测试

## 并行智能体：何时用，何时不用

`dispatching-parallel-agents` 可以让多个子智能体同时工作，但它不是万能的。

### 适合并行的场景

| 场景                | 原因                           |
| ------------------- | ------------------------------ |
| 多个独立模块开发    | 模块间无依赖，可同时进行       |
| 大规模代码搜索/分析 | 多角度搜索，汇总结果           |
| 多维度代码审查      | 不同视角（安全/性能/质量）并行 |
| 批量文件修改        | 相同模式的修改，互不冲突       |

### 不适合并行的场景

| 场景                 | 原因                       |
| -------------------- | -------------------------- |
| 有依赖关系的任务链   | 任务 B 依赖任务 A 的输出   |
| 共享状态的修改       | 并行修改同一文件会导致冲突 |
| 需要全局上下文的决策 | 子智能体的上下文是隔离的   |
| 小任务（< 2 分钟）   | 调度开销大于并行收益       |

:::tip
判断标准：如果两个任务可以各自在独立的 Git 分支上完成且不冲突，就可以并行。如果它们需要修改同一个文件或共享状态，就不要并行。
:::

## 何时不用 Superpowers

Superpowers 不是银弹。以下场景不需要使用 Superpowers：

| 场景           | 为什么不用                       | 替代方案              |
| -------------- | -------------------------------- | --------------------- |
| 一次性脚本     | 没有后续维护，不需要 TDD 和审查  | 直接让 Claude Code 写 |
| 探索性原型     | 需求不明确，设计会频繁变化       | 用 `/plan` 模式探索   |
| 紧急热修复     | 时间紧迫，无法走完整 Pipeline    | 直接修复 + 快速测试   |
| 简单的配置修改 | 改一行配置不需要头脑风暴和 TDD   | 直接修改              |
| 纯文档编写     | 不涉及代码，TDD 和代码审查不适用 | 直接编写              |

:::info
经验法则：如果一个任务能在 5 分钟内完成且不需要测试覆盖，就不需要 Superpowers。Superpowers 的价值在于**复杂度**和**长期维护性**——它通过前期投入（设计、计划、测试）减少后期的返工和 Bug。
:::

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

### 实战案例：电商库存同步服务

以下是一个完整的端到端案例，展示如何使用 Superpowers 的 7 步工作流开发一个真实的后端功能——**库存同步服务**。

> 需求：电商平台需要将多个仓库的库存数据同步到中央数据库，支持增量同步、冲突检测和告警。

#### 第一步：头脑风暴（brainstorming）

```text
> /superpowers:brainstorming
> 我需要一个库存同步服务，把多个仓库的库存数据同步到中央数据库
```

Superpowers 不会直接写代码，而是先提问：

```text
→ 数据源是什么格式？（REST API / 消息队列 / 数据库直连？）
→ 同步频率？（实时 / 准实时 / 定时批量？）
→ 冲突怎么处理？（以哪个仓库为准？时间戳？版本号？）
→ 失败策略？（重试？告警？降级？）
→ 数据量级？（每天多少条记录？峰值 QPS？）
```

你回答后，Superpowers 提出 2-3 个方案并分析利弊：

```text
方案 A：基于消息队列的事件驱动同步
  ✅ 实时性好，解耦
  ❌ 复杂度高，需要维护 MQ

方案 B：定时轮询 + 增量标记
  ✅ 简单可靠，易调试
  ❌ 有延迟（取决于轮询间隔）

方案 C：CDC（Change Data Capture）实时同步
  ✅ 几乎零延迟，不侵入业务
  ❌ 需要数据库支持 binlog
```

你选择方案 B，Superpowers 将设计写入 `docs/superpowers/specs/` 目录，你确认后继续。

:::info
这个步骤是硬门控。如果 Superpowers 觉得你的需求不够清晰，它会继续提问，直到双方对齐。
:::

#### 第二步：编写计划（writing-plans）

```text
> /superpowers:writing-plans
> 基于头脑风暴的设计，为库存同步服务编写详细计划
```

Superpowers 将设计拆分为 2-5 分钟的小任务，每个任务包含：

```markdown
### Task 1: 创建库存数据模型

**Files:**

- Create: `src/models/inventory.ts`
- Create: `src/models/__tests__/inventory.test.ts`

- [ ] **Step 1: 写测试** — 定义 Inventory 类型和验证函数
- [ ] **Step 2: 运行测试确认失败**
- [ ] **Step 3: 实现** — 创建 Inventory 接口和 zod schema
- [ ] **Step 4: 运行测试确认通过**
- [ ] **Step 5: 提交** — `git commit -m "feat(inventory): add data model and validation"`
```

计划保存到 `docs/superpowers/plans/` 目录。

:::warning
计划必须详细到"陌生人也能执行"——精确的文件路径、完整的代码块、运行命令和预期输出、Git 提交指令。没有占位符，没有"类似 Task N"。
:::

#### 第三步：Git Worktree 隔离（using-git-worktrees）

```text
> /superpowers:using-git-worktrees
```

Superpowers 自动：

1. 创建新分支 `feature/inventory-sync`
2. 创建 worktree 目录
3. 安装依赖
4. 确认测试基线干净

#### 第四步：子智能体驱动开发（subagent-driven-development）

每个任务由独立的子智能体执行，实现上下文隔离：

- 子智能体 A 只看 Task 1 的上下文，完成数据模型
- 子智能体 B 只看 Task 2 的上下文，完成同步引擎
- 每个子智能体完成后经过两阶段审查

子智能体报告状态：

| 状态                 | 含义           | 后续动作       |
| -------------------- | -------------- | -------------- |
| `DONE`               | 任务完成       | 进入下一个任务 |
| `DONE_WITH_CONCERNS` | 完成但有顾虑   | 人工审查后继续 |
| `NEEDS_CONTEXT`      | 需要更多上下文 | 补充信息后重试 |
| `BLOCKED`            | 被阻塞         | 解决阻塞后继续 |

#### 第五步：测试驱动开发（TDD）

每个任务严格遵循 RED-GREEN-REFACTOR：

```typescript title="inventory-sync.test.ts"
// 🔴 RED — 先写失败的测试
describe('InventorySyncService', () => {
  it('应将仓库库存同步到中央数据库', async () => {
    const warehouseData = [{ sku: 'SKU001', quantity: 100, warehouseId: 'WH-A' }];
    await syncService.sync(warehouseData);
    const central = await inventoryRepo.findBySku('SKU001');
    expect(central.quantity).toBe(100);
  });
});
```

运行测试：`pnpm test` → ❌ FAIL（syncService 不存在）

```typescript title="inventory-sync.ts"
// 🟢 GREEN — 写最少的代码让测试通过
export class InventorySyncService {
  async sync(data: WarehouseInventory[]): Promise<void> {
    for (const item of data) {
      await this.repo.upsert(item);
    }
  }
}
```

运行测试：`pnpm test` → ✅ PASS

```text
// 🔵 REFACTOR — 重构优化
// 添加批量操作、错误处理、日志记录，保持测试通过
```

#### 第六步：代码审查（requesting-code-review + receiving-code-review）

```text
> /superpowers:requesting-code-review
```

Superpowers 使用独立的审查子智能体，对照原始计划审查代码：

- **关键问题**：安全漏洞、数据丢失风险 → 阻止合并
- **重要问题**：性能问题、错误处理不完善 → 需要修复
- **建议**：代码风格、命名改进 → 可选修复

:::tip
`receiving-code-review` 鼓励你**挑战审查者**。如果审查建议不合理（比如引入不必要的复杂度），可以反驳并说明理由。好的代码审查是对话，不是命令。
:::

#### 第七步：验证与完成（verification-before-completion）

```text
> /superpowers:verification-before-completion
```

Superpowers 要求你提供新鲜的证据：

```text
请运行以下命令并将输出粘贴：
1. pnpm test — 全部测试通过
2. pnpm type-check — 无类型错误
3. pnpm lint — 无 lint 错误
```

只有提供了实际运行的命令输出，任务才算完成。然后进入分支收尾：

```text
> /superpowers:finishing-a-development-branch
```

选择：本地合并 / 创建 PR / 保留现状 / 丢弃。

:::info
这个案例展示了 Superpowers 的完整 Pipeline：从需求探索到代码交付，每一步都有对应的 Skill 驱动。实际使用中，你可以根据项目复杂度跳过某些步骤（如简单的 CRUD 可以跳过头脑风暴），但三大铁律不可违反。
:::

## 与 Gstack 的对比

Superpowers 和 [Gstack](/guide/advanced/gstack) 都是 Claude Code 的 Skill 插件，可以互补使用：

- **Superpowers** 聚焦**结构化方法论**——TDD、头脑风暴、计划驱动开发
- **Gstack** 聚焦**工程团队模拟**——QA、安全审计、浏览器测试、发布流程

推荐的组合方式：用 Superpowers 做前期设计和 TDD 实现，用 Gstack 的 `/review`、`/qa`、`/cso` 做后期保障。

OpenSpec 社区还提供了 `superpowers-bridge` Schema，可以将 Superpowers 的 Skills（头脑风暴、TDD、代码审查）直接桥接到 [OpenSpec](/guide/advanced/sdd/openspec) 的规格驱动工作流中。

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

- [OpenSpec + Superpowers 双层规划](/guide/advanced/sdd/openspec-superpowers) — 企业级双层规划工作流
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 API Provider 和 Skills
- [多智能体工作流](/guide/advanced/multi-agent) — 编排多个 Agent 协作
- [自动化与 CI/CD](/guide/advanced/automation) — 在 CI/CD 中使用 Claude Code
