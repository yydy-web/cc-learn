---
title: Bug 调试技巧 — 技能组合拳
description: Claude Code 系统化调试实战——从复现到根因修复的 4 阶段流程，配合 systematic-debugging、root-cause-tracing、LSP 诊断等技能组合使用
---

# Bug 调试技巧 — 技能组合拳

> 不是"试试改这里看看行不行"——是复现 → 隔离 → 假设 → 验证 → 修复，每一步有证据。

## 调试铁律

```text
❌ 看到报错 → 猜原因 → 改代码 → 不行 → 再猜 → 再改
✅ 看到报错 → 复现 → 收集证据 → 列假设（按概率排序）→ 逐条排除 → 修复根因
```

**第一条铁律**：没有找到根因之前，不动代码。猜测不是调试。

## 四大核心技能

Superpowers 插件内置了完整的调试技能链，每个覆盖不同阶段：

| 技能 | 触发方式 | 做什么 | 适用场景 |
|------|---------|--------|---------|
| `systematic-debugging` | 自动激活（遇到 bug） | 4 阶段根因追溯 | 任何 bug |
| `root-cause-tracing` | 自动激活（深层 bug） | 沿调用栈逆向追踪，生成 DOT 图 | 报错位置离根因很远 |
| `verification-before-completion` | 自动激活（声称修好前） | 强制验证后才让停 | 防止假修复 |
| `reproducible-test-case` | 分析阶段触发 | 把 bug 转成可复现测试 | 间歇性 bug / 复杂场景 |

## 系统化调试 4 阶段

来自 Superpowers `systematic-debugging` 技能，每次遇到 bug 自动激活：

```text
阶段 1：根因调查
  ├─ 读懂错误信息（不是扫一眼，是逐行理解）
  ├─ 稳定复现（写最小复现步骤）
  ├─ 检查 git diff（这个 bug 是不是我刚刚引入的？）
  └─ 追踪数据流（数据从哪来、经过谁、到哪去）

阶段 2：模式分析
  ├─ 找项目中类似功能的正确实现作为参考
  ├─ 对比"能跑的部分"和"报错的部分"的差异
  └─ 缩小范围到具体的函数/模块

阶段 3：假设与验证
  ├─ 列假设表（按概率排序，至少 3 条）
  ├─ 逐条设计最小验证方案
  ├─ 验证一条 → 确认或排除 → 下一条
  └─ 3 条都排除 → 重新回到阶段 1

阶段 4：实现修复
  ├─ 先写一个会失败的测试（复现 bug）
  ├─ 写最小修复让测试通过
  ├─ 跑全量回归
  └─ 记录根因和预防措施
```

### 3 击规则

**同一个 bug 尝试修复 3 次还没好 → 停下来，质疑架构。**

```
第 1 次失败 → 回到假设表，检查是否排除了正确的假设
第 2 次失败 → 换个分析角度（从调用方看 vs 从被调用方看）
第 3 次失败 → 停下来，这可能是设计问题而非实现问题，需要人工判断
```

## 技能组合拳

真实调试中，单个技能不够——需要多个技能按阶段配合：

### 组合 1：快速修 bug（5 分钟内）

```text
报错 → systematic-debugging 自动激活 → 4 阶段追溯 → 修复
     → verification-before-completion 拦停（跑测试确认）
     → /code-review 扫一眼有没有引入新问题
```

**适用**：报错信息清晰、stack trace 直接指向出问题的那行。

**你做什么**：把报错信息贴给 Claude Code，其他的自动走完。

```text
> 这个接口报 500 了，日志：NullPointerException at UserService.java:42
> 帮我 debug
```

Claude Code 自动走 4 阶段 → 找到 NPE 根因 → 写测试 → 修复 → 验证 → 审查。

### 组合 2：深层 bug（根因离报错很远）

```text
报错（深层）→ systematic-debugging 定位到症状
            → root-cause-tracing 沿调用栈逆向追踪
            → 生成 DOT 调用图，标注数据流向
            → 在源头修复（不是报错点）
            → reproducible-test-case 写成可复现测试
            → verification-before-completion 验证
```

**适用**：报错在 Controller 层，但根因在 Service → Repository → 数据库 schema 三层之下的某个隐式约定被破坏了。

```text
> 订单接口偶尔返回 400，但不是每次。日志看不出原因。
> 帮我用 root-cause-tracing 追踪完整调用链。
```

### 组合 3：间歇性 bug（偶发、难复现）

```text
偶发 bug → reproducible-test-case 设计复现条件
         → 找到稳定触发方式
         → systematic-debugging 正常追溯
         → 如果还是间歇的 → 加日志、加 trace、跑 N 次
         → /loop 跑 50 次测试直到复现
```

```text
> 这个测试有时候绿有时候红，帮我找规律。
> 先跑 /loop run this test 50 times and collect every failure
```

### 组合 4：性能 bug

```text
"这个接口慢" → 先测量（不是猜）
             → 加计时代码或用 APM 数据定位慢的环节
             → LSP: incomingCalls 找到谁在频繁调
             → codegraph: trace 数据流看有没有 N+1
             → 精确修复，再测量
             → verification: 确认修复后的耗时
```

```text
> 订单列表接口 /api/orders 返回 2.3s，帮我定位瓶颈。
> 先用 codegraph trace 分析调用链，找到耗时最长的环节。
```

### 组合 5：前端渲染 bug

```text
"页面白屏/渲染不对" → agent-browser: snapshot 确认当前 DOM 状态
                   → agent-browser: screenshot 截图存证
                   → LSP: diagnostics 检查类型错误
                   → LSP: goToDefinition 追踪数据来源
                   → Chrome DevTools: console 日志
                   → 修复 → agent-browser: 重新截图验证
```

```text
> 用户管理页面在筛选条件为空时白屏了。
> 帮我用 agent-browser 打开页面，截图确认当前状态。
> 然后用 LSP diagnostics 检查有没有类型错误。
```

## 假设表模板

每次调试都先列假设表——这是从"猜"到"科学排除"的关键一步：

```text
> 对这个 bug 列出至少 3 条假设，按概率排序：

| # | 假设 | 概率 | 验证方法 | 验证结果 |
|----|------|------|---------|---------|
| 1 | 数据库连接池耗尽导致查询超时 | 40% | 查连接池监控 / 增加超时日志 | |
| 2 | 某个请求参数为 null 时 NPE | 30% | 加 null guard + 日志打印所有参数 | |
| 3 | 第三方 API 偶发超时未处理 | 20% | 加 try-catch + 超时配置 | |
| 4 | 缓存过期后雪崩 | 10% | 检查缓存 TTL 和预热逻辑 | |
```

**每条假设验证完才到下一条。3 条全排除 → 回到阶段 1 重新收集证据。**

## 实战案例

### 案例 1：NPE 但 stack trace 指向 JDK 内部

**现象**：接口报 `NullPointerException`，stack trace 最后一行在 `HashMap.java:1234`。

```text
> 这个 NPE 的 stack trace 在 JDK 内部，看不出来业务代码哪里出问题。
> 用 root-cause-tracing 从 Controller 入口追踪完整数据流。
```

**Claude Code 流程**：

```text
root-cause-tracing:
  Controller.getUser(123)
    → UserService.findById(123)
      → UserRepository.findById(123)  ← 返回 Optional.empty()
        → UserService 没检查 Optional，直接 .get()
          → NullPointerException
```

根因：`findById` 返回 `Optional.empty()`，调用方没处理。修复：加 `orElseThrow()`。

### 案例 2：API 偶尔 400，日志看不出

**现象**：`/api/orders` 偶尔返回 400，每次持续几秒后自动恢复，并发高时更频繁。

```text
> 这个 400 是偶发的，帮我 debug：
> 1. 先用 reproducible-test-case 写一个高并发测试，模拟 50 并发请求
> 2. 用 /loop 跑 20 次，收集所有失败
> 3. 分析失败请求的 pattern
```

**发现**：高并发下数据库连接池耗尽（默认 10 连接，50 并发来了不够用）。根因是连接池配置太小，不是业务代码 bug。

### 案例 3：前端列表筛选后数据不更新

**现象**：用户选择筛选条件后，列表没有刷新。

```text
> 用户管理页面：选择状态下拉 → 列表不刷新。
> 1. agent-browser: 打开页面，选择"激活"状态，截图
> 2. LSP: findReferences 找到 status filter 的所有引用
> 3. 检查 watch/watchEffect 的依赖是否正确
```

**发现**：`watchEffect` 里用了 `filters.value.status`，但筛选组件 emit 的是 `filters.status`（少了一层 `.value`）——两边的数据形状不一致导致静默失败。

## 配套工具速查

| 工具 | 调试中怎么用 |
|------|------------|
| **LSP: diagnostics** | 改完代码立即看有没有类型错误——不等跑起来 |
| **LSP: goToDefinition** | 看到一个函数调用 → 跳过去看实际签名，防止假设错误 |
| **LSP: incomingCalls** | "谁在调这个？"——改之前确认影响范围 |
| **codegraph: trace** | 追踪完整调用链——数据从入口到报错点经过了谁 |
| **codegraph: callers** | 找一个函数的上游——改它会影响谁 |
| **Git: diff** | "这个 bug 是我刚引入的吗？"——看最近的改动 |
| **agent-browser** | 前端 bug：截图确认当前状态、填表触发 bug |
| **Chrome DevTools** | 前端 bug：console 日志、network 请求、performance 分析 |
| **/ponytail-review** | 修完 bug 后扫一遍——是不是修 bug 时引入了过度设计 |
| **/code-review** | 修复代码有没有引入新问题（5 维度审查） |
| **/loop + /goal** | 间歇性 bug：跑 N 次直到复现 |

## CLAUDE 调试法

一个记忆口诀——每一步的首字母拼成 CLAUDE：

| 字母 | 步骤 | 做什么 |
|------|------|--------|
| **C** | Collect Evidence | 收集证据：报错信息、日志、复现步骤、git diff |
| **L** | List Hypotheses | 列出 3-5 条假设，按概率排序 |
| **A** | Analyze Each | 逐条设计验证方案，确认或排除 |
| **U** | Understand Root Cause | 找到真正的根因，不是表象 |
| **D** | Determine Solution | 最小修复，先写测试再改代码 |
| **E** | Evaluate & Learn | 验证修复、跑回归、记录教训 |

## 不该做的事

| 反模式 | 为什么不对 | 该怎么做 |
|--------|-----------|---------|
| "先改改看" | 猜测不是调试 | 回到阶段 1 收集证据 |
| "我看到问题了" | 看到的是症状，不是根因 | root-cause-tracing 找到源头 |
| 一次改好几处 | 无法确认哪处生效 | 一次只改一处，验证通过再改下一处 |
| "先修上线，后面再查" | 没有"后面" | 修根因，不修症状 |
| 修完不跑回归 | 治好了腿断了手 | `verification-before-completion` 自动跑 |
| 3 次失败后继续试第 4 种 | 方向错了 | 停下来质疑架构 |

---

## 相关页面

- [Superpowers](/tips/superpowers) — systematic-debugging、root-cause-tracing 的来源
- [TypeScript LSP 使用技巧](/tips/typescript-lsp) — LSP 诊断和导航
- [Agent Browser](/tips/agent-browser) — 前端 bug 的截图和 DOM 验证
- [Loop 工程](/tips/loop-engineering) — `/loop` 跑 N 次直到复现间歇性 bug
- [代码图谱](/guide/advanced/code-graph/code-graph-tools) — codegraph 调用链追踪
- [AI 生成代码自检](/tips/self-check) — 五步自检法
