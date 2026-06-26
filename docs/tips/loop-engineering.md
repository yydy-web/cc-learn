---
title: Loop 工程 — 自主循环工作流
description: Claude Code 的 /loop、/goal、/schedule 命令让 Agent 自主循环执行任务，从定时触发到条件达成，含 20+ 实战命令示例和 7 大设计原则
---

# Loop 工程 — 自主循环工作流

> "我不再手动提示 Claude 了。我写循环，让循环去提示 Claude。" —— Boris Cherny, Claude Code 创始人

## 概述

**Loop Engineering（循环工程）** 是 Claude Code 的一项核心能力——让 Agent 不是"你说一句它做一下"，而是**自主循环执行任务**，直到条件满足、超时、或预算耗尽才停下。

```
传统用法：你说需求 → AI 执行 → 停下等你 → 你再说下一步
Loop 工程：你设定目标和边界 → AI 循环执行 → 自动收尾
```

你的角色从"步步指挥"变成"设计循环规则"。Claude Code 提供了三个原生原语：

| 命令 | 行为 | 停在哪 |
|------|------|--------|
| `/loop <间隔> <提示词>` | 按时间间隔重复执行 | 你按 `Esc` 或退出终端 |
| `/goal <条件>` | 持续执行直到条件达成 | 条件满足 / 达到最大轮次 / 预算耗尽 |
| `/schedule <cron>` | 在 Anthropic 云端按 cron 定时触发 | 你手动 `schedule delete` |

---

## 快速上手

### `/loop` — 定时重复

```bash
# 每 15 分钟跑一次测试，失败了显示错误
/loop 15m run the test suite, and if anything fails, show me the failing tests and the error output
```

```bash
# 每 20 分钟审查一次 PR #1234
/loop 20m /review-pr 1234
```

```bash
# 每 10 分钟检查 CI 状态
/loop 10m run `gh pr checks 1234`; if all pass, tell me it's ready to merge; if any fail, summarize which and why
```

**特点**：
- 终端绑定——关终端就停
- 适合**监控型**任务：盯着 CI、盯着 PR、盯着测试
- 可以嵌套其他斜杠命令（`/loop 20m /review-pr 1234`）

### `/goal` — 条件驱动

```bash
# 最经典的 /goal：跑测试 + lint 直到全绿
/goal all tests pass and lint is clean
```

```bash
# 带停止条件：最多 20 轮
/goal the /users endpoint returns 200 with a paginated JSON body, all tests pass, and lint is clean — stop after 20 turns
```

```bash
# 迁移 API：改了导入路径后跑 typecheck 直到通过
/goal every file importing from `./legacy-api` now imports from `./v2-api`, all tests pass, and `npm run typecheck` is clean — stop after 30 turns
```

**特点**：
- 不依赖终端——可以后台运行
- 适合**目标型**任务：修测试、完成重构、达到覆盖率
- 条件必须是**机器可验证**的——"代码改好了"不行，"tests pass"可以

### `/schedule` — 云端定时

```bash
# 每个工作日早上 9 点给新 issue 打标签
/schedule every weekday at 9am, label new issues from the last 24h
```

```bash
# 每天凌晨 2 点跑性能回归
/schedule every day at 2am, run the benchmark suite and open an issue if any metric regressed by more than 5%
```

**特点**：
- 云端执行——关电脑也能跑
- 最小间隔 1 小时
- 适合**周期性**任务：日报、定时检查、定期维护

---

## 实战案例

### 案例 1：杀灭 Flaky 测试

**问题**：测试套件有间歇性失败，手动重试太烦。

```bash
/loop run my test suite 20 times, collect every intermittent failure, fix or quarantine the flaky ones, and don't stop until you get 5 consecutive fully-green runs
```

**循环逻辑**：跑 20 次 → 收集失败 → 修或隔离 → 重复到连续 5 次全绿。

### 案例 2：PR 从实现到合入全自动

**问题**：写完代码还要手动开 PR、修 CI、等审查。

```bash
/goal a PR is open for this change and every CI check passes — implement it, test locally, push, open the PR with `gh pr create`, then keep fixing failures (re-check with `gh pr checks`) until green; stop after 10 turns
```

**循环逻辑**：实现 → 本地测试 → push → 开 PR → 检查 CI → 失败就修 → 重复到全绿。

### 案例 3：PR 保姆（多 PR 并行监控）

**问题**：团队有 5 个 PR 挂着，各自有 CI 失败、冲突、审查搁置。

```bash
/loop 15m check every open PR labeled `codex-watch` and keep each healthy: fix CI failures, rebase when behind main, and nudge if a review is pending
```

**循环逻辑**：每 15 分钟扫全部 `codex-watch` 标签的 PR → 修 CI / rebase / 催审查 → 循环。

### 案例 4：测试覆盖率爬升

**问题**：覆盖率 62%，需要到 80%，但不知道哪些文件最优先。

```bash
/goal test coverage is at least 80% with all tests passing — add focused tests for the least-covered files, re-run coverage each turn, stop at the threshold or after 12 turns
```

**循环逻辑**：找覆盖率最低的文件 → 写测试 → 跑覆盖率 → 还不到 80% 就重复 → 最多 12 轮。

### 案例 5：构建修复流水线

**问题**：升级依赖后构建挂了，错误一个接一个。

```bash
/goal `npm run build` exits 0 — run the build, fix the first error, repeat until it succeeds; stop after 10 turns
```

**循环逻辑**：跑构建 → 修第一个错误 → 再跑 → 直到 exit 0 或 10 轮。

### 案例 6：代码去脏（De-Sloppify）

**问题**：Agent 写了一大堆代码，里面夹着 debug 日志、注释掉的代码、不规范的命名。

```bash
/goal the recent diff is clean and convention-aligned — review it for debug code, dead branches, and bad names, fix with minimal edits until `npm run lint && npm test` passes; stop after 4 turns
```

**循环逻辑**：扫 diff → 删 debug 代码/死分支/坏命名 → lint + test → 重复到干净。

### 案例 7：数据库迁移修复

**问题**：Prisma 迁移脚本有错误，改一处炸一处。

```bash
/goal all database migrations apply cleanly — run them, fix schema or SQL errors, repeat until `npx prisma migrate status` is clean; stop after 6 turns
```

**循环逻辑**：跑迁移 → 报错 → 修 SQL/schema → 再跑 → 直到 `migrate status` clean。

### 案例 8：代码格式化

**问题**：Prettier 自动格式化不了的部分（模板缩进、复杂表达式换行）。

```bash
/goal `npm run format` leaves no diff — run the formatter, hand-fix anything it can't auto-fix, repeat until `git diff` is empty
```

**循环逻辑**：跑格式化 → 手工修余下部分 → 再跑 → 直到 `git diff` 为空。

### 案例 9：多 Agent 协同重构

**问题**：对话系统要加分支对话和情绪标签，涉及解析器、UI、测试三个模块。

```bash
/goal refactor the dialogue system to support branching + emotion tags
```

**循环逻辑**：Claude 自主 spawn 3 个子 Agent（一个解析器、一个 UI、一个测试），并行实现，汇总验证。

### 案例 10：嵌入式固件刷写

**问题**：嵌入式开发——改代码、编译、刷到开发板、看 LED 对不对。

```bash
/goal the onboard LED blinks in the specified pattern
```

**循环逻辑**：写代码 → 编译 → 通过 J-Link 刷到板子 → 检查 LED 闪烁模式 → 不对就重来。

---

## 7 大设计原则

源自 [loop-engineering](https://github.com/maxmilian/loop-engineering) 技能：

### 1. 杠杆从提示词转移到循环

不要写一个超长提示词让 AI 一次做所有事——设计控制流，让循环本身承担复杂度。

```text
❌ "帮我全面检查代码，包括性能、安全、可维护性、测试覆盖率、命名规范、文档..."
✅ /goal 逐维度检查代码（每次一个维度），每轮修一个问题，直到 10 轮检查无新发现
```

### 2. "完成"必须可机器验证

条件是给命令跑的，不是给人类读的。

```text
✅ `all tests pass`
✅ `npm run build exits 0`
✅ `coverage >= 80%`
❌ `improve the code`
❌ `make it better`
❌ `refactor for clarity`
```

### 3. 用确定性工具验证，不信 Agent 自述

Agent 说"测试通过了"——别信。让它真的跑 `npm test`，你只看退出码。

```text
# /goal 中的条件必须绑定到实际命令
/goal `npm test` exits 0 and `npm run lint` exits 0
# 不是
/goal Claude confirms all tests pass
```

### 4. 上线前定义所有退出路径

```text
□ 成功条件：什么算"做完"？
□ 失败条件：什么算"做不完了"？
□ 预算上限：最多几轮？最多多少 token？
□ 无进展检测：连续 N 轮没新发现就停？
□ 升级路径：卡住时通知谁？
```

**每个 `/goal` 必须带 `stop after N turns`。**

### 5. 上下文是有限资源

每轮循环上下文会膨胀。技术手段：

- **压缩**：`/compact` 在上下文 50% 时主动触发
- **笔记**：每轮关键发现写到文件，下轮新上下文只读文件
- **子 Agent**：重活交给独立 Agent，主循环只做调度
- **JIT 检索**：不预加载全部文档，用到时才查

### 6. 文件系统 = 记忆

Agent 在循环间会失忆——文件不会。

```text
/loop 15m
  1. 读 .loop-state.md 了解上次进度
  2. 执行任务
  3. 写 .loop-state.md 记录本轮结果
```

每轮从**新上下文**开始，通过文件恢复状态。这是最长效的"记忆"方案。

### 7. 最难的不是自主——是停止和升级

```text
越自主 → 越需要明确的停止规则

无风险操作（读文件、格式化）       → 可全自动
低风险操作（修测试、改注释）        → 半自动，带预算上限
高风险操作（push、merge、deploy）   → 必须人工确认
不可逆操作（删数据、改权限）        → 绝对不允许自动化
```

---

## 组合模式

### 三层嵌套：定时器 + 目标 + 技能

```bash
/loop 30m /goal all PR review comments resolved via /review, stop after 10 turns
```

```
外层 /loop（每 30 分钟触发）
  └─ /goal（循环直到 review 意见清零）
       └─ /review（具体审查技能）
```

### PR 全生命周期

```bash
# 1. 实现 + 开 PR
/goal a PR is open and all CI checks pass — stop after 10 turns

# 2. 等待合并期间持续监控
/loop 20m check if PR #1234 is mergeable; if CI fails, fix it; if approved, merge

# 3. 合并后清理
/goal the feature branch is deleted and the release notes are updated — stop after 3 turns
```

### CI 值班机器人

```bash
# 持续监控 CI，自动修复常见失败
/loop 10m
  1. run `gh run list --branch main --status failure --limit 5`
  2. for each failed run, analyze the logs
  3. if the failure matches a known pattern (flake, lint, type error), fix and push
  4. if it's a new failure, open an issue and @ the team
  5. write summary to .ci-watchdog.md
```

---

## 安全护栏

| 风险等级 | 操作示例 | 策略 |
|---------|---------|------|
| 🟢 只读 | 读文件、查 git log、跑 lint | 全自动，无需确认 |
| 🟡 本地写 | 改代码、写测试、改配置 | 自动但有 `stop after N turns`，每轮 commit |
| 🟠 远程读 | `gh pr list`、`gh pr checks`、API GET | 自动但限频（如 `gh` 有 rate limit） |
| 🔴 远程写 | push、merge、deploy | 必须人工确认 |
| ⛔ 不可逆 | 删数据库、改权限、删仓库 | 绝对不允许自动化 |

**通用规则**：
- **每个 `/goal` 必须带 `stop after N turns`**——防止无限烧 token
- **写操作前加 `--dry-run` 预览**——看到要改什么再确认
- **每个循环周期 git commit**——炸了能回滚
- **无进展自动停**——连续 3 轮没有新产出 → 停下来问你

---

## 与 Workflow 脚本的区别

| | Workflow 脚本 | Loop 工程 |
|---|---|---|
| 触发 | 手动 `Workflow()` | 时间（`/loop`）、条件（`/goal`）、cron（`/schedule`） |
| 执行次数 | 一次 | 循环直到条件满足 |
| 适用场景 | 已知步骤的批量任务 | 需要反复迭代直到达标的开放任务 |
| 停止条件 | 脚本跑完就停 | 条件满足 / 预算耗尽 / 人工中断 |
| 典型用途 | 并行审查、流水线构建 | 修 flaky 测试、PR 保姆、覆盖率爬升 |

**选哪个**：任务步骤明确、不需要反复试 → Workflow 脚本。任务结果不确定、需要循环到达标 → Loop 工程。

---

## 快速决策：Loop vs Goal vs Schedule

| 场景 | 用什么 | 示例 |
|------|--------|------|
| 定时检查某状态 | `/loop` | 每 15 分钟检查 CI |
| 重复执行到条件达成 | `/goal` | 修到所有测试通过 |
| 每天/每周自动执行 | `/schedule` | 每天 9 点给 issue 打标签 |
| 修 bug 修到好 | `/goal` | 修到 `npm test` exit 0 |
| 盯着多个 PR 状态 | `/loop` | 每 20 分钟扫一遍 PR |
| 从实现到合入全自动 | `/goal` | 写代码 → push → 开 PR → 修 CI → 绿了停 |
| 格式化代码修到干净 | `/goal` | 跑格式化 → 手工修 → 重复到 `git diff` 为空 |

---

## 相关页面

- [多 Agent 协同工作技巧](/tips/multi-agent-tips) — Workflow 脚本模式和 SDD 并行实现
- [AI 生成代码自检](/tips/self-check) — 五步自检法 + 提示词模板
- [自动化与 CI/CD](/guide/advanced/automation) — 在 CI 中使用 Claude Code
- [hooks](/guide/advanced/hooks) — Stop hook 实现自动验证
- [loop-engineering (GitHub)](https://github.com/maxmilian/loop-engineering) — 7 大设计原则来源
- [awesome-agent-loops (GitHub)](https://github.com/serenakeyitan/awesome-agent-loops) — 社区实战命令合集
