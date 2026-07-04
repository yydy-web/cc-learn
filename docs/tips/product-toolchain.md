---
title: 产品工具链技巧 — 全流程工具编排
description: 以 Claude Code 为编排中心的产品开发全流程工具链——从需求到上线，每个阶段该用什么工具、怎么组合，含 6 阶段决策树和 5 大组合模式
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★☆ | ★★★☆☆ |
| 🧪 测试 | ★★★★☆ | ★★★☆☆ |
| 📦 产品 | ★★★★★ | ★★★☆☆ |

**🎯 学习产出：** 掌握产品经理全流程工具链编排，能独立设计从需求到上线的自动化工具组合方案

**🚀 AI 能力提升：** 自动化工作流、项目协作
:::

# 产品工具链技巧 — 全流程工具编排

> Claude Code 不是代码生成器——它是工具链编排中心。你的角色从"写代码"变成"设计工具组合规则"。

## 工具全景图

把 Claude Code 生态的工具按职责分成 5 层，每一层解决一个问题：

```text
🖥️ 交互与验证层     agent-browser · Chrome DevTools MCP · 截图验证
    ↕ 操作页面、验证渲染、抓取数据
🔍 代码理解层       LSP · codegraph · Grep/Glob · Serena
    ↕ 语义跳转、调用链追踪、文本搜索
🤖 自动化层         /loop · /goal · /schedule · Workflow 脚本
    ↕ 定时触发、条件循环、云端调度
✅ 质量保障层       self-check · code-review · ponytail-review · verification
    ↕ 自检、审查、简化、确认
👥 协作与流程层     multi-agent (SDD) · git hooks · gh CLI · CI/CD
    ↕ 并行实现、自动格式化、PR 管理、持续集成
```

| 层 | 做什么 | 主工具 | 一句话规则 |
|---|--------|--------|-----------|
| 交互与验证 | 操作浏览器、截图、抓数据 | agent-browser | 能截图验证的不用人眼 |
| 代码理解 | 理解代码语义和结构 | LSP + codegraph | 语义理解优先于文本搜索 |
| 自动化 | 循环执行到条件达成 | /goal + Workflow | 机器可验证的条件才自动化 |
| 质量保障 | 发现代码中的问题 | self-check + code-review | 自检 → 机器查 → 人查，从快到深 |
| 协作与流程 | 管理多人协作和交付 | SDD + hooks + gh | 重复的事自动化，不可逆的事人确认 |

## 按阶段选工具

### 决策树

```text
你现在要做什么？
├─ 理解代码
│   ├─ "这个函数是干什么的？"              → LSP: hover
│   ├─ "这个类在哪定义的？"                → LSP: goToDefinition
│   ├─ "谁在调这个？改了会影响谁？"         → LSP: findReferences / codegraph: callers
│   ├─ "从入口到这里的完整调用链？"          → codegraph: trace
│   └─ "项目里有没有类似实现参考？"          → LSP: workspaceSymbol + codegraph: search
│
├─ 写代码
│   ├─ 简单功能（一个函数/组件）            → 直接写 + ponytail 控制过度设计
│   ├─ 复杂功能（多模块、多步骤）            → feature-dev 7 阶段引导
│   ├─ 不确定方案好坏                        → /superpowers:brainstorming
│   └─ 需要并行实现多个模块                  → Workflow 脚本（SDD 模式）
│
├─ 审查代码
│   ├─ 写完立即自检                         → self-check 五步法
│   ├─ 深度审查（安全/性能/可维护）          → /code-review（5 维度）
│   ├─ 检查是否过度设计                      → /ponytail-review
│   └─ 确认修复真的有效                      → verification-before-completion
│
├─ 测试验证
│   ├─ 前端页面渲染对不对                    → agent-browser: snapshot + screenshot
│   ├─ 间歇性失败                            → /loop 跑 N 次 + reproducible-test-case
│   ├─ API 返回对不对                        → curl / agent-browser route mock
│   └─ 性能有没有退化                         → Chrome DevTools: performance trace
│
├─ 调试修 bug
│   ├─ 报错清晰、stack trace 到位            → systematic-debugging 自动激活
│   ├─ 报错位置离根因很远                    → root-cause-tracing 逆向追踪
│   ├─ 偶发、难复现                           → reproducible-test-case + /loop
│   └─ 修了 3 次还没好                        → 停下，质疑架构
│
└─ 交付上线
    ├─ 开 PR                                  → gh pr create
    ├─ 等 CI 绿灯                             → /loop 监控 + /goal 修到绿
    ├─ 自动格式化 + 类型检查                  → hooks (PostToolUse + Stop)
    └─ 合并后清理                             → gh pr merge + 删分支
```

### 阶段速查矩阵

| 阶段 | 首选工具 | 为什么 | 关键命令/操作 |
|------|---------|--------|-------------|
| 理解代码 | LSP: hover + goToDefinition | 语义精准，不靠猜 | 鼠标悬停即得签名 |
| 理解架构 | codegraph: trace | 一条命令拿到完整调用链 | `codegraph_trace(from, to)` |
| 写代码 | ponytail 模式 | 防止过度设计 | 自动激活，效率阶梯 |
| 自检 | self-check 五步法 | 端到端→边界→边界→盲点→抽样 | 5 步提示词模板 |
| 深度审查 | code-review | 安全+性能+可维护+正确+风格 | `/code-review` |
| 前端验证 | agent-browser | 截图 = 视觉证据 | `snapshot -i --json` + `screenshot` |
| 后端验证 | /goal | 循环到测试通过 | `/goal all tests pass, stop after 10 turns` |
| 调试 | systematic-debugging | 4 阶段根因追溯 | 自动激活 |
| PR 管理 | gh CLI | 命令行全流程 | `gh pr create` / `gh pr checks` |
| 自动化交付 | hooks + /schedule | 格式化+类型检查自动跑 | PostToolUse + Stop hook |

## 五大组合模式

### 模式 1：新功能全流程

> 从需求到合入，每个阶段用对工具。

```text
需求
 │
 ├─ 理解现有代码 ─────────── LSP: findReferences + codegraph: trace
 │   搞清楚这个功能涉及哪些文件、哪些调用链
 │
 ├─ 设计方案 ────────────── /superpowers:brainstorming（复杂时）
 │   简单的直接用 ponytail 思维：最小改动在哪？
 │
 ├─ 实现 ────────────────── ponytail 模式 + LSP: hover（查 API 签名）
 │   写代码时 hover 看类型、goToDefinition 确认实现
 │
 ├─ 自检 ────────────────── self-check 五步法
 │   端到端跑通 → 边界检查 → 边缘用例 → AI 盲点 → 手动抽样
 │
 ├─ 审查 ────────────────── /code-review + /ponytail-review
 │   五维度深度审查 → 简化过度设计
 │
 ├─ 测试验证 ────────────── agent-browser（前端）/ 跑测试（后端）
 │   截图对比 + 回归测试全绿
 │
 └─ 交付 ────────────────── gh pr create → /loop 监控 CI → merge
    PR 创建后 /loop 每 10 分钟查 CI，失败自动修
```

**Java 案例：订单导出接口**

```text
> 需求：订单列表支持导出 CSV，包含订单号、金额、时间、状态

## 第一步：理解现有代码
> codegraph: trace 找到 OrderController → OrderService → OrderRepository 的调用链
> LSP: documentSymbol OrderService.java 看现有方法列表

## 第二步：实现
> ponytail 模式下写导出逻辑（用已有的 OrderRepository.findAll()，不建新接口）

## 第三步：自检
> self-check 五步法：
> 1. 端到端：curl /api/orders/export?startDate=2026-01-01 → CSV 文件正确
> 2. 边界：无数据时返回空 CSV（只有表头）、单条数据、10000 条数据
> 3. 边缘用例：日期格式错误 → 400、非法状态值 → 400
> 4. AI 盲点：CSV 注入风险（字段含 =、+、-、@ 开头）
> 5. 手动抽样：打开 CSV 确认编码（UTF-8 BOM）、金额小数位数

## 第四步：审查
> /code-review — 发现 exportCsv() 方法 80 行太长，建议拆成 buildHeader() + buildRow()
> /ponytail-review — 确认没有过度设计

## 第五步：交付
> gh pr create --title "feat: order CSV export" --body "..." 
> /loop 10m gh pr checks 1234; if fail, fix; if all green, notify me
```

**Vue 案例：用户筛选组件**

```text
> 需求：用户管理页增加按状态和角色的复合筛选

## 第一步：理解现有代码
> LSP: documentSymbol UserList.vue 看现有结构
> LSP: findReferences filters 看筛选状态的所有引用

## 第二步：实现
> ponytail：直接用 v-model 绑定 select，不引入筛选器库
> LSP: hover User 类型 确认 status 和 role 字段

## 第三步：自检
> 1. 端到端：选"激活"→列表只显示激活用户、选"管理员"→叠加筛选生效
> 2. 边界：清空筛选→恢复全部、同时选两个→AND 逻辑生效
> 3. 边缘用例：筛选结果为空→显示空状态、快速切换筛选→防抖/无闪烁

## 第四步：测试验证
> agent-browser: open 用户管理页 → fill 筛选条件 → screenshot 确认列表正确
> agent-browser: snapshot -i --json 确认筛选后的 DOM 结构

## 第五步：交付
> gh pr create → /goal CI green, stop after 10 turns
```

### 模式 2：Bug 修复快通道

> 从报错到修复，最短路径。

```text
报错
 │
 ├─ 复现 ────────────────── 最小复现步骤 + reproducible-test-case
 │   写一个会失败的测试
 │
 ├─ 隔离 ────────────────── LSP: goToDefinition + codegraph: trace
 │   追踪数据流，缩小范围到具体函数
 │
 ├─ 假设 ────────────────── 假设表（至少 3 条，按概率排序）
 │   systematic-debugging 自动生成
 │
 ├─ 验证 ────────────────── 逐条排除（不是猜，是验证）
 │   每条假设设计最小验证方案
 │
 └─ 修复 ────────────────── 最小改动 + verification-before-completion
    先让复现测试通过 → 跑全量回归 → 确认不会再犯
```

**Java 案例：NPE stack trace 在 JDK 内部**

```text
> 报错：NullPointerException at HashMap.java:1234

## 第一步：复现
> 用 reproducible-test-case 写一个会失败的测试：
>   @Test void shouldHandleMissingUser() {
>     assertThrows(UserNotFoundException.class, () -> controller.getUser(999));
>   }

## 第二步：隔离
> root-cause-tracing：从 Controller.getUser(999) 沿调用栈逆向
> Controller.getUser(999)
>   → UserService.findById(999)
>     → UserRepository.findById(999)  ← 返回 Optional.empty()
>       → UserService 没检查 Optional，直接 .get()  ← 根因！
>         → NPE 在 HashMap 内部（因为 Optional.get() 内部用到了 HashMap）

## 第三步：修复
> 把 .get() 改成 .orElseThrow(() -> new UserNotFoundException(999))

## 第四步：验证
> 跑复现测试 → 通过
> 跑全量回归 → 全绿
> verification-before-completion：确认没有其他 Optional.get() 裸调用
```

**Vue 案例：筛选后列表不刷新**

```text
> 现象：选择"激活"状态后，列表没有过滤

## 第一步：复现
> agent-browser: open 用户管理页 → select 激活 → screenshot  → 列表没变

## 第二步：隔离
> LSP: findReferences statusFilter → 找到 3 处引用
> LSP: hover statusFilter → 发现是 ref<UserStatus | null>
> 筛选组件 emit('update:filters', { status: 'ACTIVE' })  ← emit 没有 .value
> watchEffect 里用 filters.value.status  ← 监听的是 .value
> 两边数据形状不一致 → 静默失败

## 第三步：修复
> 统一为 filters.status（去掉 .value 嵌套层）

## 第四步：验证
> agent-browser: reload → select 激活 → screenshot → 列表已过滤
```

### 模式 3：代码质量爬升

> 从"能用"到"可靠"。逐条修，逐条验。

```text
起点（质量基线）
 │
 ├─ 扫 ────────────────── code-review 全局扫 / ESLint / coverage report
 │   一次性暴露所有问题
 │
 ├─ 优先级排序 ──────────── 按严重度排：安全 > 正确性 > 性能 > 可维护
 │
 └─ 循环修 ─────────────── /goal 逐条修到指标达标
    每轮修 1-3 个问题 → 验证 → 下轮
```

**Java 案例：覆盖率 62% → 80%**

```text
> /goal test coverage is at least 80% with all tests passing —
>   each turn: find the least-covered file, add focused tests,
>   re-run coverage, commit if improved; stop after 12 turns
```

循环过程：

```text
第 1 轮：OrderExportService.java  覆盖率 12% → 补 5 个测试 → 升到 68%
第 2 轮：UserValidator.java       覆盖率 34% → 补 4 个测试 → 升到 89%
第 3 轮：DateRangeParser.java     覆盖率 0%  → 补 3 个测试 → 升到 75%
...
第 8 轮：整体覆盖率 81%，stop after 12 turns 触发但已经达标 → 停止
```

**Vue 案例：ESLint 30 errors → 0**

```text
> /goal `npm run lint` exits 0 —
>   each turn: fix 1-3 ESLint errors, run lint, commit if fewer errors;
>   stop after 10 turns
```

循环过程：

```text
第 1 轮：3 个 'v-html' 安全警告 → 改用文本插值 → 27 errors
第 2 轮：5 个 'no-unused-vars' → 删未使用变量 → 22 errors
第 3 轮：4 个 'vue/multi-word-component-names' → 重命名组件 → 18 errors
...
第 7 轮：npm run lint exits 0  → 停止
```

### 模式 4：CI 守护

> 开 PR 后不用盯着——让 /loop 守着，失败自动修。

```text
PR 已开
 │
 ├─ 监控循环 ────────────── /loop 10m gh pr checks <PR>
 │   │
 │   ├─ 全绿？  → 通知你"可以 merge 了"
 │   ├─ 有红？  → 分析失败日志
 │   │   ├─ 已知模式（lint/flake/type error）→ 自动修 + push
 │   │   └─ 新失败 → 开 issue @你
 │   └─ 超时？  → 通知你"N 轮未绿，需要人工看"
 │
 └─ 合并后清理 ──────────── /goal 删分支、更新 release notes
```

**Java 案例：Maven build 偶然挂**

```text
> /loop 10m
>   1. gh pr checks 1234 --json
>   2. if any check failed:
>      a. read the failure log
>      b. if it's a flaky test → add @Flaky annotation or increase timeout
>      c. if it's a type error → LSP: diagnostics → fix → push
>      d. if unknown → open issue with log and @ me
>   3. if all green for 3 consecutive checks → tell me "PR #1234 ready to merge"
>   4. write status to .ci-watchdog-1234.md
```

**Vue 案例：npm build 类型错误**

```text
> /goal `npm run build` exits 0 —
>   run build, fix the first type error shown,
>   repeat; stop after 8 turns
```

循环过程：

```text
第 1 轮：Type error: props.user is possibly null → 加 null guard → build
第 2 轮：Type error: missing import Ref from vue → 补 import → build
第 3 轮：npm run build exits 0 → stop
```

### 模式 5：技术债清理

> 不是重构——是砍掉过度设计。ponytail 效率阶梯做判断。

```text
代码库
 │
 ├─ 扫 ────────────────── /ponytail-review（效率阶梯逐条检查）
 │   ├─ L1: 这个文件/函数/依赖需要存在吗？
 │   ├─ L2: stdlib/native 能做吗？
 │   ├─ L3: 已安装的依赖有能覆盖的吗？
 │   ├─ L4: 能一行搞定吗？
 │   └─ L5: 至少是简洁的实现吗？
 │   输出：问题清单（文件+行号+描述+阶梯层级）
 │
 ├─ 分类 ──────────────── 安全删除 / 简化 / 保留（标注 ponytail: 注释）
 │
 └─ 逐条修 ────────────── /goal 逐条修到清单清空
    每轮修 1-2 条 → 验证不破坏功能 → commit
```

**Java 案例：过度设计的 Service 层**

```text
> /ponytail-review OrderService 相关代码

扫描结果：
  L1: OrderService interface — 只有一个实现类 OrderServiceImpl → 删除接口
  L1: OrderFactory — 只有一个产品 Order → 删除工厂，直接 new
  L4: OrderServiceImpl.findById() 20 行 → 可以缩减到 3 行（直接用 repository）
  L2: DateFormatter 自定义实现 → 用 java.time.format.DateTimeFormatter

> /goal all /ponytail-review issues are resolved, tests pass, stop after 6 turns
```

修复后对比：

```text
修复前：
  OrderService.java (interface, 15 行)
  OrderServiceImpl.java (120 行)
  OrderFactory.java (25 行)
  DateFormatter.java (40 行)
  → 4 个文件，200 行

修复后：
  OrderService.java (45 行，直接实现类)
  → 1 个文件，45 行  ← ponytail: 删了接口、工厂、自定义格式化器
```

**Vue 案例：巨型组件拆分**

```text
> /ponytail-review UserManagement.vue

扫描结果：
  L1: useUserTable() composable — 只有一个使用者 → 移回组件内
  L4: handleDelete() 30 行确认对话框逻辑 → 可提取但也可以保留（只有一个调用点）
  L1: UserAvatar.vue — 6 个地方用 → 保留（多个调用点，值得抽组件）
  L2: 手动 filter 实现 → computed + filter() 一行搞定

> /goal all /ponytail-review issues are resolved, `npm run build` passes, stop after 4 turns
```

## 高级场景

### 场景 1：每日自动日报

> 每天早上 9 点，自动拉取团队 git 记录，生成日报文件，可选推送到 IM。

**完整流程**：

```text
/schedule 触发（每天早上 9 点）
  │
  ├─ 1. 拉取代码 ───────────────── git pull（所有仓库）
  │   确保日报基于最新代码
  │
  ├─ 2. 收集 git log ──────────── git log --since="yesterday" --all
  │   提取过去 24 小时的所有 commit、分支、作者
  │
  ├─ 3. 分类整理 ──────────────── 按仓库→分支→作者分组
  │   合并同类 commit（同一个功能的多条 commit 合并为一条）
  │
  ├─ 4. 生成日报 ──────────────── 写到 docs/reports/YYYY-MM-DD.md
  │   格式：概要 + 各仓库改动 + 关键指标 + 待关注事项
  │
  └─ 5. 推送通知 ──────────────── 可选：发到 Slack/钉钉/飞书
     摘要版（3-5 行）推送到 IM，完整版留在文件
```

**第一步：配置 `/schedule`**

```bash
/schedule every weekday at 9am,
  1. `git -C /path/to/project-a pull` and `git -C /path/to/project-b pull`
  2. for each repo, run:
     `git log --since="yesterday 00:00" --until="today 00:00" --all --oneline --format="%h %an: %s" --no-merges`
  3. classify commits:
     - feat: 新功能
     - fix: Bug 修复
     - refactor: 重构
     - chore: 杂项
  4. group by repo → branch → author
  5. write report to `docs/reports/$(date +%Y-%m-%d).md` with format below
  6. if any commit has "HOTFIX" or "emergency" in message, highlight in report
```

**第二步：日报模板**

Claude Code 按以下模板生成日报文件：

```markdown
# 日报 — 2026-06-26（周四）

## 概要
- 总 commit 数：23 个
- 参与人数：5 人
- 合并 PR：4 个
- ⚠️ 关注事项：订单模块有紧急修复，需确认今日回测

## 各仓库改动

### project-api（后端）
| 分支 | 作者 | 类别 | 说明 |
|------|------|------|------|
| feature/order-export | 张三 | feat | 订单 CSV 导出接口（3 commits） |
| main | 李四 | fix | 修复 NPE：用户查询 Optional 未处理 |
| feature/payment-v2 | 王五 | feat | 支付模块重构——接入微信支付（5 commits） |

### project-web（前端）
| 分支 | 作者 | 类别 | 说明 |
|------|------|------|------|
| fix/user-filter | 张三 | fix | 用户筛选列表不刷新 |
| feature/dashboard | 赵六 | feat | 首页仪表盘图表改 ECharts |

## 关键指标
- 新增代码行：~450 行
- 删除代码行：~120 行
- 测试覆盖变化：62% → 64%

## 待关注
- ⚠️ `main` 分支有直接 hotfix commit，建议确认是否需开 PR 补流程
- ⚠️ `feature/payment-v2` 涉及资金链路，建议安排额外 code review
```

**第三步：可选 — 推送到 Slack**

```bash
# 如果团队用 Slack，加一条推送
# Slack Webhook 需提前配好环境变量
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d "$(cat docs/reports/$(date +%Y-%m-%d).md | head -20 | jq -Rs '{text: .}')"
```

```bash
# 或者用 /schedule 的完整版：生成日报后发通知
/schedule every weekday at 9:05am,
  after writing the report, summarize the top 3 changes and any ⚠️ items,
  then post to Slack via webhook
```

**第四步：验证日报是否正常**

```bash
# 手动触发一次验证
/goal generate today's report to docs/reports/$(date +%Y-%m-%d).md,
  verify the file exists and has all repo sections filled, stop after 2 turns
```

**日报系统维护**：

```bash
# 每周五归档上周日报
/schedule every friday at 6pm,
  collect all report files from this week in docs/reports/,
  merge them into docs/reports/weekly/YYYY-WW.md,
  then delete the daily files to keep the directory clean
```

### 场景 2：Bug 自动修复工单

> 定时扫 GitHub Issues 上带 `bug` 标签的未分配 issue，自动分析、修复、开 PR。

**完整流程**：

```text
/schedule 触发（每 2 小时）或 /loop 持续监控
  │
  ├─ 1. 拉取 issue 列表 ───────── gh issue list --label "bug" --state open
  │   只看没 assignee 的、有 "auto-fix" 标签的
  │
  ├─ 2. 筛选可自动修的 ────────── 按规则过滤
  │   ✅ 有 stack trace / 明确报错信息
  │   ✅ 有复现步骤
  │   ✅ 范围在单个仓库内
  │   ❌ 需要改数据库 schema
  │   ❌ 涉及第三方 API 行为变更
  │   ❌ 安全漏洞（必须人审）
  │
  ├─ 3. 逐条修复 ──────────────── systematic-debugging → root-cause-tracing
  │   │
  │   ├─ 读懂 issue 描述和 stack trace
  │   ├─ codegraph: trace 追踪调用链，找到根因
  │   ├─ 写最小修复（ponytail 模式控制范围）
  │   ├─ 写复现测试（先红后绿）
  │   └─ self-check 五步自检
  │
  ├─ 4. 开 PR ──────────────────── gh pr create --assignee @me
  │   PR 描述自动关联 issue（Fixes #123）
  │
  ├─ 5. CI 守护 ────────────────── /loop 10m gh pr checks
  │   修到 CI 全绿
  │
  └─ 6. 回写 issue ────────────── gh issue comment "PR #xxx 已提交，等待 review"
     attach PR 链接，assign 给 reviewer
```

**第一步：配置 Issue 标签体系**

先在 GitHub 仓库里建好标签，让 Claude Code 知道哪些 issue 可以自动处理：

```text
标签设计：
  bug              — 所有 bug（手动打）
  auto-fix         — 标记为"可自动修复"（人判断后打，作为安全闸门）
  auto-fix:attempted — Claude Code 已尝试修复（自动打，防止重复处理）
  auto-fix:blocked  — 尝试过但修不了（自动打，标记需人工介入）
```

**第二步：配置 `/schedule`**

```bash
/schedule every 2 hours on weekdays,
  1. `gh issue list --label "bug,auto-fix" --state open --limit 10 --json number,title,body,labels`
  2. skip issues with label "auto-fix:attempted" or "auto-fix:blocked"
  3. for each remaining issue:
     a. read the full issue body (gh issue view <number>)
     b. check if it's auto-fixable:
        ✅ has stack trace or clear error message
        ✅ has reproduction steps
        ❌ skip if: requires DB migration, involves auth/permission changes, is a security vulnerability
     c. if auto-fixable:
        - create a fix branch: `git checkout -b auto-fix/issue-<number>`
        - use systematic-debugging to find root cause
        - apply minimal fix
        - write a regression test
        - self-check with 5-step method
        - commit: `fix: <issue title> (auto-fix #<number>)`
        - push branch
        - `gh pr create --title "fix: <issue title>" --body "Auto-fix for #<number>.\n\n🤖 Generated with [Claude Code](https://claude.com/claude-code)"`
        - `gh issue edit <number> --add-label "auto-fix:attempted" --assignee @me`
        - comment on issue: "🤖 Auto-fix PR submitted: <PR link>. Please review."
     d. if NOT auto-fixable:
        - `gh issue edit <number> --add-label "auto-fix:blocked"`
        - comment on issue why: "🤖 Cannot auto-fix: <reason>. Needs manual investigation."
  4. write summary to docs/reports/auto-fix-$(date +%Y-%m-%d-%H).md
```

**第三步：Java Bug 自动修复实战**

```text
Issue #234: "导出 CSV 时，订单金额为 null 导致 NPE"

Issue 内容：
  复现步骤：
    1. 创建一个金额字段为空的订单
    2. GET /api/orders/export?startDate=2026-01-01
    3. 返回 500，日志：NullPointerException at OrderExportService.java:47

Claude Code 自动执行：
  1. 读 issue → 有 stack trace ✅ → 有复现步骤 ✅ → 范围在单个 Service ✅ → 可自动修
  2. git checkout -b auto-fix/issue-234
  3. codegraph: trace OrderController.exportOrders → OrderExportService.buildRow
  4. LSP: goToDefinition OrderExportService.buildRow → 第 47 行：order.getAmount().toPlainString()
  5. 根因：order.getAmount() 可能返回 null
  6. 修复：Optional.ofNullable(order.getAmount()).map(BigDecimal::toPlainString).orElse("0.00")
  7. 写测试：@Test void shouldHandleNullAmount() → 红 → 修 → 绿
  8. self-check 五步自检通过
  9. git commit + push + gh pr create
  10. gh issue comment → 完成

  耗时：3 分钟（从读到 issue 到 PR 开出）
```

**第四步：Vue Bug 自动修复实战**

```text
Issue #567: "日期选择器清空后，表单提交仍带旧值"

Issue 内容：
  复现步骤：
    1. 选择日期 2026-06-26
    2. 点清空按钮
    3. 提交表单 → payload 中 date 仍是 2026-06-26

Claude Code 自动执行：
  1. 可自动修？✅（有复现步骤 + 明确范围）
  2. git checkout -b auto-fix/issue-567
  3. LSP: findReferences datePicker → 找到 DatePicker.vue 和 FormPage.vue
  4. LSP: hover clearDate → 发现 clearDate() 只清了 visibleValue，没清 modelValue
  5. 根因：el-date-picker 的 @clear 事件只改显示值，没 emit update:modelValue
  6. 修复：@clear="handleClear" → handleClear() { emit('update:modelValue', null) }
  7. 写测试：模拟 clear 事件 → 断言 modelValue === null → 红 → 修 → 绿
  8. agent-browser: open 页面 → 选日期 → 清空 → 提交 → snapshot 确认 payload 无 date
  9. git commit + push + gh pr create
  10. gh issue comment → 完成
```

**第五步：故障处理与升级**

```text
自动修复失败时怎么办？

┌─ 修复失败
│   ├─ 3 次尝试后 CI 仍不绿
│   │   → gh issue edit --add-label "auto-fix:blocked"
│   │   → gh issue comment "🤖 尝试修复 3 次后 CI 仍未通过，需人工介入。PR 草稿：#xxx"
│   │   → 不再重复尝试（label 过滤掉）
│   │
│   ├─ 根因在第三方依赖（等上游修）
│   │   → gh issue comment "🤖 根因在 <dependency> vX.Y.Z，需等上游修复或换替代方案"
│   │   → gh issue edit --add-label "auto-fix:blocked" --add-label "external-dependency"
│   │
│   └─ 需要改 DB schema / 涉及权限
│       → gh issue comment "🤖 涉及 <schema/permission> 变更，超出自动修复范围"
│       → gh issue edit --add-label "auto-fix:blocked"
│       → assign 给 TL
```

**第六步：监控和日报**

```bash
# 每天早上 9 点，生成自动修复汇总
/schedule every weekday at 9am,
  1. gh issue list --label "auto-fix:attempted" --state closed --since yesterday
  2. gh issue list --label "auto-fix:blocked" --state open
  3. write summary to docs/reports/auto-fix-summary-$(date +%Y-%m-%d).md:
     - 昨日自动修复：X 个成功 / Y 个失败
     - 待人工处理：Z 个 blocked issue
     - 平均修复耗时：N 分钟
  4. if blocked count > 5, notify team lead
```

**安全闸门总结**：

| 层级 | 闸门 | 位置 |
|------|------|------|
| 1 | 只有带 `auto-fix` 标签的 issue 才会被处理 | 人手动打标签 |
| 2 | 自动判断可修复性（有 stack trace + 复现步骤 + 非敏感变更） | Claude Code 判断 |
| 3 | 修复后必须 CI 全绿才开 PR | `/loop` 守护 |
| 4 | blocked issue 不会重复尝试 | `auto-fix:blocked` 标签过滤 |
| 5 | PR 需要人 review 后才合入 | GitHub branch protection |

### 场景 3：依赖升级自动化

> 定时扫依赖过期情况，自动升级、跑测试、开 PR——替代 Renovate/Dependabot 的更智能方案。

**完整流程**：

```text
/schedule 触发（每天凌晨 3 点，或每周一早上 9 点）
  │
  ├─ 1. 扫描过期依赖 ─────────── npm outdated / mvn versions:display-dependency-updates
  │   收集所有可升级的包和版本
  │
  ├─ 2. 分类优先级 ────────────── patch > minor > major
  │   patch（安全修复）：自动升
  │   minor（新功能）：自动升，测试通过即合
  │   major（破坏性变更）：只开 issue 提醒，不自动升
  │
  ├─ 3. 逐个升级 ─────────────── 一次只升一个包
  │   │
  │   ├─ npm install pkg@latest 或 mvn versions:set-property
  │   ├─ 跑全量测试
  │   ├─ 跑 LSP: diagnostics 检查类型错误
  │   ├─ 跑 build 确认不挂
  │   └─ 检查 CHANGELOG.md 是否有 breaking changes
  │
  ├─ 4. 开 PR ─────────────────── 一个包一个 PR
  │   PR 描述自动提取 CHANGELOG 变更
  │
  └─ 5. 汇总报告 ──────────────── 写到 docs/reports/deps-YYYY-MM-DD.md
    升级了几个 / 跳过了几个 / 几个需人工
```

**第一步：配置 `/schedule`**

```bash
# 每周一早上 9 点：扫描并升级 patch/minor 依赖
/schedule every monday at 9am,
  1. for each project in /path/to/projects/*:
     a. cd into project
     b. if package.json exists (Node.js):
        - `npm outdated --json` → parse outdated packages
        - classify each: patch / minor / major
        - for patch upgrades (security fixes):
          * create branch: `git checkout -b deps/auto-$(date +%Y%m%d)-<pkg>`
          * `npm install <pkg>@<version>`
          * `npm test`
          * if tests pass and `npm run build` exits 0:
            - commit and push
            - `gh pr create --title "chore(deps): bump <pkg> to <version>" --body "..."`
            - add label "dependencies"
          * if tests fail:
            - log failure to deps-report
            - `git checkout main && git branch -D deps/auto-*`
        - for minor upgrades: same flow, but add `/code-review` check
        - for major upgrades: `gh issue create --title "deps: <pkg> has major update to v<N>" --label "dependencies,major"`
     c. if pom.xml exists (Maven):
        - `mvn versions:display-dependency-updates -DprocessDependencyManagement=false`
        - same classification logic
  2. write summary report to docs/reports/deps-$(date +%Y-%m-%d).md
```

**第二步：依赖升级实战 — Java**

```text
Maven 扫描结果：
  com.google.guava:guava      30.1-jre → 33.3.1-jre  (major ⚠️)
  org.junit.jupiter:junit      5.10.0  → 5.11.0       (minor)
  ch.qos.logback:logback-core  1.4.12  → 1.4.14       (patch 🔒)

Claude Code 自动执行：
  🔒 logback 1.4.12 → 1.4.14（patch）
    1. mvn versions:set-property -Dproperty=logback.version -DnewVersion=1.4.14
    2. mvn test → 234 tests pass
    3. mvn compile → 0 errors
    4. git commit + push + gh pr create → PR #789
    5. ✅ 自动合并（patch 安全修复，免 review）

  🟡 junit 5.10.0 → 5.11.0（minor）
    1. mvn versions:set-property -Dproperty=junit.version -DnewVersion=5.11.0
    2. mvn test → 230 pass, 4 fail — @Disabled 注解行为变化
    3. LSP: findReferences @Disabled → 4 个测试受影响
    4. 修：@Disabled("reason") → @Disabled(value = "reason")
    5. mvn test → 234 pass
    6. /code-review 通过 → PR #790
    7. ⏳ 等待人 review（minor 需确认）

  ⚠️ guava 30.1 → 33.3.1（major）
    1. gh issue create "deps: guava 30.1→33.3.1 破坏性变更需人工评估"
    2. 不自动升级
```

**第三步：依赖升级实战 — Vue/Node.js**

```text
npm outdated 扫描结果：
  vue              3.4.21 → 3.5.0   (minor)
  @vueuse/core     10.9.0 → 11.0.0  (major ⚠️)
  vite             5.2.0  → 5.2.13  (patch 🔒)

Claude Code 自动执行：
  🔒 vite 5.2.0 → 5.2.13（patch）
    npm i vite@5.2.13 → npm test → npm run build → ✅ PR #234

  🟡 vue 3.4.21 → 3.5.0（minor）
    npm i vue@3.5.0
    LSP: diagnostics → 0 类型错误
    agent-browser: 关键页面截图对比（升级前 vs 升级后）→ 无视觉差异
    npm test → 45 pass → PR #235

  ⚠️ @vueuse/core 10.9.0 → 11.0.0（major）
    自动读 CHANGELOG.md → 发现 useStorage API 有 breaking change
    gh issue create → 不自动升级
```

**第四步：升级失败回滚**

```bash
# 自动升级后 CI 挂了 → /goal 修 3 次修不好 → 自动回滚
/goal fix the build after dependency upgrade, stop after 3 turns;
  if still failing, revert to the previous version and comment on the PR why

# 回滚逻辑：
git checkout main
git branch -D deps/auto-*
gh issue comment <PR> "🤖 CI 连续失败，已回滚。根因：<原因>。需人工处理。"
```

**安全策略**：

| 版本类型 | 自动升级 | 自动合并 | 条件 |
|---------|---------|---------|------|
| patch（安全修复） | ✅ | ✅（免 review） | 测试全绿 + build 通过 |
| minor（新功能） | ✅ | ❌（需 review） | 测试全绿 + /code-review 通过 |
| major（破坏性变更） | ❌ | ❌ | 只开 issue 提醒 |

### 场景 4：代码审查轮值机器人

> 每天自动审查团队新 PR，跑 /code-review 5 维度 + 安全扫描 + ponytail-review，生成审查报告。

**完整流程**：

```text
/schedule 触发（每天上午 10 点 + 下午 3 点）
  │
  ├─ 1. 拉取待审 PR ──────────── gh pr list --state open --json number,title,author,createdAt
  │   过滤：当天新建的 + 前一天创建但无 review 的
  │
  ├─ 2. 逐 PR 审查 ──────────────
  │   │
  │   ├─ 拉 PR diff ───────────── gh pr diff <number>
  │   │
  │   ├─ /code-review ──────────── 5 维度：安全/正确性/性能/可维护/风格
  │   │   输出：按严重度排序的问题清单
  │   │
  │   ├─ /ponytail-review ──────── 效率阶梯检查
  │   │   有没有过度设计？能简化吗？
  │   │
  │   └─ LSP: diagnostics ──────── 类型安全检查
  │       有没有类型错误？
  │
  ├─ 3. 生成审查报告 ──────────── 写到 docs/reviews/PR-<number>.md
  │   ├─ 严重问题（必须修）→ 贴到 PR review comment
  │   ├─ 建议改进 → 贴到 PR review comment（非阻塞）
  │   └─ 值得学习的地方 → 写到报告（正向反馈）
  │
  └─ 4. 汇总 ──────────────────── 写到 docs/reviews/daily-YYYY-MM-DD.md
     今日审查 N 个 PR / 发现 X 个严重问题 / Y 个建议
```

**第一步：配置 `/schedule`**

```bash
/schedule every weekday at 10am and 3pm,
  1. `gh pr list --state open --json number,title,author,createdAt,headRefName --limit 20`
  2. for each PR without an existing review report:
     a. `gh pr view <number> --json number,title,body,comments,reviews`
     b. skip if already reviewed by this bot today
     c. `gh pr diff <number>` → analyze the diff
     d. run /code-review on the changed files:
        - Security: input validation, SQL injection, XSS, auth bypass
        - Correctness: null handling, edge cases, error states
        - Performance: N+1 queries, unnecessary re-renders, missing memo
        - Maintainability: naming, coupling, function length
        - Style: consistency with project conventions
     e. run /ponytail-review: can anything be simplified or deleted?
     f. generate review report → docs/reviews/PR-<number>-<date>.md
     g. if critical issues found:
        `gh pr review <number> --request-changes --body "<critical issues summary>"`
     h. if only suggestions:
        `gh pr review <number> --comment --body "<suggestions summary>"`
     i. if all clean:
        `gh pr review <number> --approve --body "🤖 Automated review: looks good!"`
  3. write daily summary to docs/reviews/daily-$(date +%Y-%m-%d).md
```

**第二步：审查报告模板**

```markdown
# PR 审查报告 — PR #456

**作者**：张三 | **审查时间**：2026-06-26 10:05 | **审查者**：🤖 Claude Code

## 🔴 严重问题（必须修）

### 1. SQL 注入风险 — `OrderMapper.java:34`
```java
// ❌ 当前
String sql = "SELECT * FROM orders WHERE status = '" + status + "'";
// ✅ 应改为
@Select("SELECT * FROM orders WHERE status = #{status}")
List<Order> findByStatus(@Param("status") String status);
```
**严重度**：🔴 Critical | **类型**：Security

### 2. NPE 风险 — `UserService.java:67`
user.getAddress() 可能为 null，但直接调了 user.getAddress().getCity()。
建议：Optional.ofNullable(user.getAddress()).map(Address::getCity).orElse("未知")

## 🟡 建议改进

### 3. N+1 查询 — `OrderController.java:89`
循环内调 repository → 20 条数据产生 21 次 DB 查询。
建议：用 `findByIdIn(ids)` 批量查询。

### 4. 函数过长 — `ExportService.java:42-118`
buildRow() 77 行，可拆为 buildHeader() + formatAmount() + formatDate()。

## 🟢 值得学习
- `DateRange.java` 使用 Java 不可变类封装日期范围，设计优雅
- 新增测试覆盖了 3 个边界用例

## 审查结论
🔴 2 个严重问题 → **Request Changes**
```

**第三步：Java PR 审查实战**

```text
PR #456: "feat: 订单导出 + 用户批量导入"

Claude Code 审查流程：

  1. gh pr diff 456 → 改动 6 个文件：3 Java + 2 XML + 1 SQL

  2. /code-review 按 5 维度扫描：
     安全：
       ✅ 导出：CSV 内容无直接拼 SQL
       ❌ 导入：MultipartFile 直接存磁盘，未校验文件类型 — 🔴 Critical
     正确性：
       ❌ ExcelParser.java: parseRow() 空行未处理 — 🔴
       ✅ 导出空列表返回只有表头的 CSV — OK
     性能：
       ✅ 流式导出避免 OOM — OK
     可维护：
       ❌ ExportService 120 行 — 🟡 建议拆分

  3. /ponytail-review：
     L3: poi-ooxml 做 CSV 导出 → 用 java.io.PrintWriter 更轻 — 🟡 建议

  4. LSP: diagnostics → 0 errors ✅

  5. 生成报告 → gh pr review 456 --request-changes
```

**第四步：Vue PR 审查实战**

```text
PR #789: "fix: 用户列表筛选 + 分页优化"

Claude Code 审查流程：

  1. gh pr diff 789 → 改动 4 个 .vue 文件

  2. /code-review：
     安全：
       ✅ 无 v-html — OK
     正确性：
       ❌ watchEffect 依赖 filters 但 filters 是 reactive 对象
           → 深层属性变化可能不触发 — 🟡 建议改用 watch(filters, ..., { deep: true })
     性能：
       ❌ filterOptions computed 每次返回新数组
           → 子组件不必要的重渲染 — 🟡 建议加 memo
     可维护：
       ✅ 筛选逻辑抽到 useUserFilter composable — 好的实践

  3. agent-browser: snapshot 验证 UI：
     打开用户管理页 → 选"激活"状态 → screenshot → 列表已过滤 ✅
     快速切换状态 3 次 → screenshot → 无闪烁，无重复请求 ✅

  4. LSP: diagnostics → 0 errors ✅

  5. 生成报告 → gh pr review 789 --comment（全是建议，非阻塞）
```

**第五步：审查统计与趋势**

```bash
# 每周五：生成审查趋势报告
/schedule every friday at 5pm,
  1. collect all review reports from this week
  2. generate trend analysis:
     - 本周审查 N 个 PR，平均每个 PR X 个问题
     - 常见问题 Top 5：NPE、N+1、函数过长、缺失测试、类型不安全
     - 对比上周：问题总数 ↓15% / 严重问题 ↓40%
     - 建议：N+1 问题持续高频，建议团队做一次集中排查
  3. write to docs/reviews/weekly-trend-YYYY-WW.md
  4. if any metric worsened by >20%, notify team lead
```

### 场景 5：性能回归监控

> 定时跑 benchmark，发现性能退化自动 git bisect 定位罪魁 commit，开 issue 指认。

**完整流程**：

```text
/schedule 触发（每天凌晨 2 点，业务低峰）
  │
  ├─ 1. 跑 benchmark ──────────── npm run bench / mvn verify -Pbenchmark
  │   记录关键指标：响应时间、吞吐量、内存、包体积
  │
  ├─ 2. 对比基线 ──────────────── 和上次 benchmark 结果对比
  │   任何指标退化 >5% → 触发告警
  │
  ├─ 3. 定位罪魁 commit ───────── git bisect
  │   │
  │   ├─ 找到上次正常 benchmark 对应的 commit（good）
  │   ├─ 当前 HEAD 为 bad
  │   ├─ git bisect start HEAD <good_commit>
  │   ├─ 每个 midpoint：跑 benchmark → 判断 good/bad
  │   └─ 找到第一个引入性能退化的 commit
  │
  ├─ 4. 分析根因 ──────────────── codegraph: trace + LSP: incomingCalls
  │   为什么这个 commit 导致了性能退化？
  │
  └─ 5. 开 issue ──────────────── 附 benchmark 对比 + bisect 结果 + 原因分析
     记录到 docs/reports/perf-regression-YYYY-MM-DD.md
```

**第一步：配置 Benchmarks 和基线**

```bash
# 先建好 benchmark 命令和基线文件
# 项目里需要有：
#   - package.json 中的 "bench" script 或 JMH benchmark
#   - docs/benchmarks/baseline.json 存上次基准数据
```

```json
// docs/benchmarks/baseline.json — 存储上次 benchmark 结果
{
  "date": "2026-06-25",
  "commit": "abc1234",
  "results": {
    "api:order-list":   { "p50": 45, "p99": 120, "throughput": 850 },
    "api:user-search":  { "p50": 32, "p99": 89,  "throughput": 1200 },
    "db:order-query":   { "p50": 12, "p99": 35,  "throughput": 3200 },
    "frontend:bundle":  { "size": 245600, "gzip": 78200 },
    "frontend:lcp":     { "p50": 1200, "p75": 1800 }
  }
}
```

**第二步：配置 `/schedule`**

```bash
/schedule every day at 2am,
  1. `git pull origin main` → ensure latest code
  2. run benchmarks:
     - Backend: `mvn verify -Pbenchmark -Dbenchmark.output=docs/benchmarks/current.json`
       or for Node: `npm run bench -- --json > docs/benchmarks/current.json`
     - Frontend (if applicable): `npm run build && npx vite-bundle-visualizer --json`
  3. load baseline from docs/benchmarks/baseline.json
  4. compare each metric:
     - p50/p99 latency: regression if >5% increase
     - throughput: regression if >5% decrease
     - bundle size: regression if >10KB increase
     - LCP: regression if >200ms increase
  5. if any regression found:
     a. identify the last known good commit from baseline.commit
     b. `git bisect start HEAD <baseline.commit>`
     c. for each bisect step:
        - run the specific benchmark that regressed
        - mark as good or bad
     d. once the offending commit is found:
        - `git bisect reset`
        - analyze the commit diff with codegraph: trace + LSP: incomingCalls
        - open issue: "perf: <metric> regressed X% from commit <hash>"
        - write detailed report to docs/reports/perf-regression-$(date +%Y-%m-%d).md
  6. update baseline: copy current.json → baseline.json
  7. if no regression: write "✅ All metrics stable" to perf log
```

**第三步：回归定位实战 — Java**

```text
凌晨 2 点 benchmark 结果：
  api:order-list p99 从 120ms → 210ms（+75%）🔴 严重退化！

  git bisect：
    good = abc1234（昨天基线）
    bad  = HEAD（当前）

    Step 1: midpoint def5678 → 跑 benchmark → p99: 215ms → bad
    Step 2: midpoint ghi9012 → 跑 benchmark → p99: 118ms → good
    Step 3: midpoint jkl3456 → 跑 benchmark → p99: 208ms → bad
    → 罪魁 commit：jkl3456

  jkl3456 的 diff：
    OrderService.java:
      - List<Order> orders = orderRepository.findByDateRange(start, end);
      + List<Order> orders = orderRepository.findByDateRangeWithDetails(start, end);
        // 多了一个 JOIN，导致 N+1 → 1 查询变 1+20 查询

  分析：
    codegraph: trace findByDateRangeWithDetails → JOIN order_items + JOIN products
    LSP: incomingCalls findByDateRangeWithDetails → 只有 order-list 在用

  修复建议：
    方案 A：改 LEFT JOIN FETCH 避免 N+1
    方案 B：保持 findByDateRange，details 按需懒加载

  自动开 issue：gh issue create --title "perf: order-list p99 +75% from commit jkl3456" --body "..."
```

**第四步：前端性能回归 — Vue**

```text
Bundle analyzer 扫描结果：
  vendor.js 从 245KB → 312KB（+27%）🔴

  git bisect 定位到罪魁 commit：
    import { debounce } from 'lodash'  // 引入整个 lodash
    应改为 import debounce from 'lodash/debounce'  // 只引入用到的函数

  自动 fix + PR：
    1. 改 import
    2. npm run build → vendor.js 回到 244KB ✅
    3. gh pr create "fix: tree-shake lodash import (saves 68KB)"
    4. agent-browser: 截关键页面 → 无渲染差异 ✅
    5. 合入
```

**第五步：性能看板**

```bash
# 每周一生成性能趋势报告
/schedule every monday at 8am,
  collect all daily benchmark baselines from this week,
  generate trend chart data:
    - api:order-list p99 trend: 120→125→118→122→210(JKL3456)→118(fixed)
    - frontend:bundle size trend: 245→248→244→312(lodash)→244(fixed)
  write to docs/reports/perf-weekly-YYYY-WW.md
  highlight: "本周发现 1 个回归（jkl3456: +75% p99），已修复。总体：回归发现时间 < 12h，修复时间 < 2h。"
```

### 场景 6：文档同步检查

> 代码改了但文档没更新——自动检测 API 变更 vs 文档差异，生成文档补丁 PR。

**完整流程**：

```text
/schedule 触发（每天凌晨 4 点，或每次 PR 合并后）
  │
  ├─ 1. 提取 API 签名 ─────────── LSP: documentSymbol 扫描所有 Controller
  │   收集所有公开接口的签名：路径、方法、参数、返回值
  │
  ├─ 2. 提取文档描述 ──────────── 解析 docs/api/ 下的 Markdown
  │   收集文档中描述的接口：路径、方法、参数
  │
  ├─ 3. 对比差异 ──────────────── 代码 vs 文档
  │   ├─ 代码有、文档无 → 新增接口未记录
  │   ├─ 代码无、文档有 → 已删除接口未更新文档
  │   ├─ 签名对不上 → 接口变更未同步
  │   └─ 参数/返回值类型变了 → 文档过期
  │
  ├─ 4. 生成文档补丁 ──────────── 自动写文档
  │   ↓
  └─ 5. 开 PR ─────────────────── docs: sync API docs with <commit>
```

**第一步：配置 `/schedule`**

```bash
/schedule every day at 4am,
  1. for each service in the monorepo:
     a. scan API surface:
        - Java: use LSP workspaceSymbol to find all @RestController classes
          then LSP documentSymbol on each → extract @GetMapping/@PostMapping methods
        - Extract: { method, path, params, returnType, description }
        - write to docs/api/.scan/current.json
     b. parse existing docs:
        - read docs/api/*.md
        - extract documented endpoints
        - write to docs/api/.scan/documented.json
     c. diff current vs documented:
        - new endpoints (in code, not in docs)
        - removed endpoints (in docs, not in code)
        - changed endpoints (signature mismatch)
        - stale examples (request/response body changed)
     d. for each discrepancy:
        - if new endpoint: generate doc section from LSP hover info + Javadoc/JSDoc
        - if removed: add deprecation notice to doc
        - if changed: update doc with new signature
        - if stale examples: re-generate example from test fixtures
     e. write updated docs to a branch
     f. if any changes made:
        `gh pr create --title "docs: sync API docs $(date +%Y-%m-%d)" --body "..."`
  2. write sync report to docs/reports/doc-sync-$(date +%Y-%m-%d).md
```

**第二步：差异检测实战 — Java**

```text
扫描结果：
  docs/api/orders.md 记录的接口：
    GET /api/orders          — 文档有 ✅
    GET /api/orders/:id      — 文档有 ✅
    POST /api/orders         — 文档有 ✅

  Controller 实际暴露的接口：
    GET /api/orders          — 匹配 ✅
    GET /api/orders/:id      — 签名变了 ❌ 返回值多了 discount 字段
    POST /api/orders         — 匹配 ✅
    GET /api/orders/export   — 代码有、文档无 ❌ 新增接口！
    DELETE /api/orders/:id   — 代码有、文档无 ❌ 新增接口！

Claude Code 自动处理：

  差异 1：GET /api/orders/:id 返回值多了 discount 字段
    → LSP: hover OrderResponse → 提取字段列表
    → 更新文档中的响应示例，加 discount 字段说明

  差异 2+3：新增 export 和 delete 接口
    → LSP: hover → 提取 Javadoc
    → 生成文档章节：
      ## GET /api/orders/export
      导出订单为 CSV 格式。

      | 参数 | 类型 | 必填 | 说明 |
      |------|------|------|------|
      | startDate | string | 是 | 开始日期 yyyy-MM-dd |
      | endDate | string | 是 | 结束日期 yyyy-MM-dd |

      响应：Content-Type: text/csv

  → 更新 docs/api/orders.md → gh pr create "docs: sync orders API docs"
```

**第三步：差异检测实战 — Vue**

```text
扫描结果：
  docs/components/user-table.md 记录的 Props：
    users: User[]      — 文档有
    loading: boolean   — 文档有
    pageSize: number   — 文档有

  组件实际 Props（LSP: hover defineProps）：
    users: User[]
    loading: boolean
    pageSize: number
    sortable: boolean            ← 新增！文档无
    onRowClick: (user: User) => void  ← 新增！文档无
    pageSize: number → pageSize?: number  ← 变成可选了

Claude Code 自动处理：
  → 更新 Props 表格：
    | sortable | boolean | 否 | 是否启用列排序 | false |
    | onRowClick | (user: User) => void | 否 | 行点击回调 | - |
  → 更新 pageSize 为可选参数
  → 新增"排序"使用示例代码
  → PR: "docs: sync user-table component docs"
```

**第四步：变更日志文档自动生成**

```bash
# 每次 PR 合并后：自动更新 CHANGELOG
/schedule every day at 4:30am,
  1. gh pr list --state merged --since yesterday --json number,title,labels,author
  2. for each merged PR:
     - if label "feat": add to "## 新功能" section
     - if label "fix": add to "## Bug 修复" section
     - if label "breaking": add to "## ⚠️ 破坏性变更" section
     - if label "docs": add to "## 文档" section
  3. update CHANGELOG.md:
     - insert new entries under today's date
     - link each entry to PR number
  4. if CHANGELOG changed:
     - `gh pr create --title "docs: update CHANGELOG $(date +%Y-%m-%d)" --base main`
```

**第五步：文档健康度评分**

```bash
# 每月 1 号：生成文档健康度报告
/schedule every month on the 1st at 6am,
  1. count all API endpoints in code
  2. count all documented endpoints in docs/api/
  3. calculate coverage: documented / total * 100%
  4. scan for stale docs:
     - docs referencing deleted files/endpoints
     - docs mentioning removed parameters
     - examples that no longer work (test endpoints against current API)
  5. generate health report:
     ## 文档健康度 — 2026 年 6 月
     - API 文档覆盖率：92%（↑3% from last month）
     - 过期文档：3 个（↓2 from last month）
     - 失效示例：1 个（需修复）
     - 建议：order export 接口示例仍用 v1 格式，需更新到 v2
  6. open issues for stale docs found
```

## 工具链反模式

| # | 反模式 | 为什么错 | 正确做法 |
|---|--------|---------|---------|
| 1 | **所有阶段都用同一个工具** | 拿 LSP 做文本搜索、拿 Grep 做代码审查 | 语义用 LSP/codegraph，文本用 Grep，审查用 code-review |
| 2 | **"全自动"不设停止条件** | `/goal` 不加 `stop after N turns` → 无限烧 token | 每个自动化必须带 `stop after N turns` |
| 3 | **跳过理解直接写** | 没看定义就改调用方 → 猜错签名 → 连锁报错 | 动代码前先 LSP: goToDefinition + hover |
| 4 | **质量检查只做一次** | 修完就合，不管后续 CI 或回归 | `/loop` 持续监控 CI + `/goal` 修到绿 |
| 5 | **工具太多，配置过重** | 装了 10 个 MCP 但只用 2 个，启动慢、上下文挤 | 从最小集开始（LSP + ponytail），缺什么加什么 |
| 6 | **人完全退出的幻觉** | 以为 `/goal` 能处理一切 | 定义升级路径：连续 3 轮无进展 → 通知人；不可逆操作 → 必须人确认 |
| 7 | **工具链没有记录** | 下个人不知道你用了哪些工具、为什么 | 写 `.claude/toolchain.md` 记录团队的工具选型和组合规则 |

## 自定义工具链模板

### 模板 1：个人开发者（最小集）

适合独立开发、边学边用。投入 5 分钟配置，覆盖日常 90% 场景。

**推荐 skill**：

```text
/plugin install superpowers@claude-plugins-official     # 核心：brainstorming + debugging + review
/plugin install typescript-lsp@claude-plugins-official   # LSP 代码理解
```

**关键配置**（`claude.json`）：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [{ "type": "command", "command": "npx prettier --write ${CLAUDE_FILE_PATHS}" }]
      }
    ],
    "Stop": [
      {
        "hooks": [{ "type": "command", "command": "npx tsc --noEmit 2>&1 | tail -5" }]
      }
    ]
  }
}
```

**一条命令验证工具链**：

```bash
/goal all tests pass and lint is clean, stop after 10 turns
```

**日常流程**：

```text
写代码（ponytail 自动激活）→ 自检（self-check 五步法）→ 格式化+类型检查（hooks 自动）
→ 开 PR（gh pr create）→ /loop 10m gh pr checks <PR> 盯 CI
```

### 模板 2：小团队（标准集）

适合 3-10 人团队，有 code review 流程。投入 15 分钟配置。

**推荐 skill**（在模板 1 基础上加）：

```text
/plugin marketplace add OWENLEEzy/agent-browser-skill        # 前端自动化验证
```

**关键配置**（在模板 1 基础上加）：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          { "type": "command", "command": "npx prettier --write ${CLAUDE_FILE_PATHS}" },
          { "type": "command", "command": "npx eslint --fix ${CLAUDE_FILE_PATHS}" }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          { "type": "command", "command": "npx tsc --noEmit 2>&1 | tail -5" },
          { "type": "command", "command": "npm test 2>&1 | tail -10" }
        ]
      }
    ]
  }
}
```

**日常流程**：

```text
需求分析（brainstorming）→ 实现（ponytail + LSP）
→ 自检（self-check）→ 审查（/code-review + /ponytail-review）
→ 前端验证（agent-browser 截图对比）
→ 开 PR（gh pr create --fill）
→ CI 守护（/loop 10m gh pr checks <PR>）
→ 合并后清理（gh pr merge --squash && git branch -d feature/xxx）
```

**关键命令**：

```bash
# 新功能一条龙
/goal a PR is open and all CI checks pass — implement, test, open PR, fix CI until green; stop after 12 turns

# Review 一条龙
> /code-review 审查当前改动 → /ponytail-review 检查过度设计 → 修完再 /code-review 确认
```

### 模板 3：全栈团队（完整集）

适合 10+ 人团队，有 CI/CD 流水线。投入 30 分钟配置。

**推荐 skill**（在模板 2 基础上加）：

```text
/plugin install code-review@claude-plugins-official           # 代码审查
# MCP 接入
claude mcp add codegraph -- npx -y @codegraph/mcp             # 代码图谱
claude mcp add chrome -- npx -y @anthropic/mcp-server-chrome  # Chrome DevTools
```

**关键配置**（在模板 2 基础上加 `/schedule`）：

```bash
# 每个工作日早上 9 点：检查依赖更新和安全公告
/schedule every weekday at 9am, check npm outdated and npm audit, open an issue for critical vulnerabilities

# 每周五下午 5 点：技术债扫描
/schedule every friday at 5pm, run /ponytail-review on the most-changed files this week, collect findings to .tech-debt.md

# 每天凌晨 2 点：性能回归
/schedule every day at 2am, run the benchmark suite and open an issue if any metric regressed by more than 5%
```

**日常流程**（在模板 2 基础上加 SDD 多 Agent）：

```text
需求分析（brainstorming）→ 大功能拆 task-brief（SDD 模式）
→ 并行实现（Workflow 脚本 spawn 3-5 个子 Agent）
→ 自检（self-check）→ 审查（/code-review + adversarial verify）
→ 前端验证（agent-browser 多 session 并行）
→ 开 PR（gh pr create）→ CI 守护（/loop）
→ /schedule 定期任务（日报、技术债扫描、性能回归）
```

---

## 相关页面

- [Superpowers](/tips/superpowers) — brainstorming、systematic-debugging、verification-before-completion 的来源
- [Ponytail](/tips/ponytail) — 懒惰高级工程师模式和效率阶梯
- [TypeScript LSP 使用技巧](/tips/typescript-lsp) — LSP 9 种操作详解
- [Agent Browser](/tips/agent-browser) — AI 原生浏览器自动化
- [Loop 工程](/tips/loop-engineering) — /loop、/goal、/schedule 详解
- [多 Agent 协同工作技巧](/tips/multi-agent-tips) — SDD 模式和 Workflow 脚本
- [AI 生成代码自检](/tips/self-check) — 五步自检法和提示词模板
- [Bug 调试技巧](/tips/debugging) — 系统化调试 4 阶段和技能组合拳
- [代码图谱](/guide/advanced/code-graph/code-graph-tools) — codegraph 调用链追踪
- [Chrome DevTools MCP](/guide/advanced/chrome-devtools-mcp) — Google 官方调试工具
- [hooks](/guide/advanced/hooks) — PostToolUse + Stop hook 自动格式化/类型检查
- [Feature Dev](/tips/feature-dev) — 7 阶段引导式功能开发
