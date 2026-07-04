---
title: Codex — 第二双眼睛和救援队
description: Codex 插件将 OpenAI Codex CLI 嵌入 Claude Code，提供代码审查、对抗质疑和独立任务委托能力
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★☆☆ |
| 🧪 测试 | ★★★☆☆ | ★★★★☆ |
| 📦 产品 | ★★☆☆☆ | ★★★★★ |

**🎯 学习产出：** 掌握 Codex 三大协作模式（审查/对抗审查/救援），能独立用 Codex 作为第二双眼睛审查代码质量和修复疑难 bug

**🚀 AI 能力提升：** 代码生成、技能扩展
:::

# Codex — 第二双眼睛和救援队

> 你写的代码，让另一个人看一眼。

## 概述

**Codex 插件**把 OpenAI Codex CLI 嵌入 Claude Code 工作流，解决两个问题：

1. **审查盲区** — 你写的代码，自己审容易有惯性思维。Codex 作为"外人"扫一遍，揪出你漏掉的边界条件。
2. **卡住时没人救** — 一个诡异 bug 查了半小时没头绪，继续盯只会加深思维定式。把问题扔给 Codex，它从零读代码，不被你的思路带偏。

Codex 不是替代 Claude Code，是**补充**。你负责写，Codex 负责审；你卡住了，Codex 来救。

## 核心理念：三种协作模式

```
模式一：你写 → Codex 审
  写完代码 → /codex:review → Codex 扫 diff → 输出审查结果
  Codex 只读不改，采不采纳你决定。

模式二：Codex 质疑你的设计
  /codex:adversarial-review → 不只是找 bug，还挑战设计假设
  "你选了 ConcurrentHashMap 做缓存——分布式场景下这个选择对吗？"

模式三：你卡住 → Codex 救
  /codex:rescue "诡异 bug…" → Codex 独立读代码、跑诊断、改文件
  不需要你盯着，回来收结果。支持后台异步跑。
```

三个模式的核心区别：

| | `/codex:review` | `/codex:adversarial-review` | `/codex:rescue` |
|---|---|---|---|
| 做什么 | 查 bug、边界条件、性能隐患 | 质疑设计假设、方案选择 | 独立诊断 + 修复 |
| 改代码吗 | 不改 | 不改 | 默认改 |
| 适合阶段 | 每次 commit 前 | 加新抽象/新模块时 | 卡住时、重活不想盯时 |

此外还有**审查门控（review gate）**——每次会话结束时自动触发一次审查，确保你离开前 Codex 看过改动。结果下次会话通过 `/codex:status` 查看。

## 安装

### 安装插件

```bash
/plugin marketplace add https://github.com/anthropics/claude-code-codex-plugin
/plugin install openai-codex@codex
```

### 安装 Codex CLI

插件需要本机装有 Codex CLI。推荐让 Claude Code 帮你搞定：

```bash
/codex:setup
```

如果检测到未安装，会提示你确认。选择 `Install Codex (Recommended)` 即可。

手动安装：

```bash
npm install -g @openai/codex
codex login
```

### 验证

```bash
/codex:setup
# 输出 Codex CLI 版本 + 认证状态 + 审查门控开关状态
```

看到版本号和 `authenticated: true` 就说明装好了。

:::warning
如果 Codex CLI 已安装但未认证，`/codex:setup` 会提示运行 `!codex login`。Codex 需要 OpenAI 账号认证才能工作。
:::

## 配置

### 审查门控

插件默认在每次 **SessionEnd** 时自动触发审查——会话结束前 Codex 扫一遍你的改动。这是异步的，不会卡住你。

```bash
/codex:setup --disable-review-gate   # 关闭自动审查
/codex:setup --enable-review-gate    # 重新开启
```

:::tip
不确定开还是关？日常开发建议**开**。快速原型阶段或频繁小改动时可以关掉，commit 前手动跑一次 `/codex:review` 就行。
:::

### 模型和推理强度

`/codex:rescue` 支持指定模型和推理强度：

```bash
/codex:rescue --model spark          # 用 GPT-5.3-codex-spark（更快）
/codex:rescue --effort high          # 提升推理深度
/codex:rescue --effort xhigh         # 最大推理深度（复杂任务）
```

模型默认用 Codex 内置默认值，一般不需要手动指定。`--effort` 在调试复杂 bug 或做重要设计决策时值得提升。

## 日常使用

### 快速上手：第一次使用

装完插件后，用三步验证一切正常：

**验证 1：确认环境就绪**

```bash
/codex:setup
```

看到 `Codex CLI 可用 + 已认证` 即可。

**验证 2：体验审查**

随便改一个文件，然后：

```bash
/codex:review
```

Codex 会扫描你的改动，按严重程度输出发现列表。如果改动很简单、没有发现问题，你也看到了一次完整的审查流程长什么样。

**验证 3：体验对抗审查**

在刚才的改动上：

```bash
/codex:adversarial-review "这个改法有没有更好的方案？"
```

观察输出差异——`review` 关注"对不对"，`adversarial-review` 关注"是不是最佳方案"。

:::tip
**关键心智转变**：Codex 的审查结果不是命令，是**建议**。`HIGH` 不意味着你必须改——业务上可能有理由这么做。Codex 的责任是告诉你"这里可能有问题"，你负责判断。
:::

### 日常操作速查

| 你要做什么 | 你输入什么 | Codex 做什么 |
|-----------|-----------|-------------|
| 改完代码审一下 | `/codex:review` | 扫描 diff，按严重程度输出发现列表 |
| 质疑新设计 | `/codex:adversarial-review "这个 useDebounce 会不会有边界问题？"` | 挑战设计假设，给替代方案 |
| 让 Codex 修 bug | `/codex:rescue "登录接口偶尔返回 500，可能是 token 刷新逻辑的问题"` | 独立诊断根因 + 改代码 |
| 后台跑重活 | `/codex:rescue --background "把 20 个 Controller 的返回格式统一成 Result<T>"` | 异步执行，不占着你 |
| 查看后台任务进度 | `/codex:status` | 状态表格 |
| 查看某个 job 详情 | `/codex:status <job-id>` | 单个 job 的详细信息 |
| 拿已完成任务结果 | `/codex:result <job-id>` | 完整输出（诊断、修改文件、风险） |
| 取消跑太久的任务 | `/codex:cancel <job-id>` | 终止运行中的 job |
| 检查环境/开关门控 | `/codex:setup` | 环境状态 + 门控开关 |

### 命令参考

| 命令 | 做什么 | 常用参数 |
|------|--------|----------|
| `/codex:review` | 审查当前改动（diff） | `--background` 后台跑，`--base main` 对比分支 |
| `/codex:adversarial-review` | 对抗审查——质疑设计决策和实现方案 | 同上，支持追加 focus 描述 |
| `/codex:rescue` | 委托任务给 Codex 独立完成 | `--background` 后台，`--model spark` 选模型，`--effort high` 提升推理 |
| `/codex:setup` | 检查环境、开关审查门控 | `--enable-review-gate` / `--disable-review-gate` |
| `/codex:status` | 查看活跃和历史 job 状态 | `--all` 全量历史，`<job-id>` 查单个 |
| `/codex:result` | 查看已完成 job 的完整输出 | `<job-id>` |
| `/codex:cancel` | 取消运行中的 job | `<job-id>` |

---

## 实战场景一：PR 审查 — Java Spring Boot

### 场景

你改了一个订单 Service，加了批量取消功能。改了 `OrderService.java` 和 `OrderMapper.java`，涉及 4 个方法。提交 PR 前想确认有没有隐藏问题。

### 对话流程

**第一步：跑审查**

```bash
/codex:review
```

**第二步：看 Codex 输出**

Codex 扫描 diff 后：

```
Findings (ordered by severity):

🔴 HIGH | OrderService.java:47
  批量取消在循环内逐条 update，缺 @Transactional。
  第三条取消失败时前两条已提交，数据不一致。

🟡 MEDIUM | OrderService.java:52
  cancelOrder 方法的 status 校验只检查了 PENDING，
  PROCESSING 状态的订单没有处理路径。退款回调改了状态后
  这个分支会跳过。

🟢 LOW | OrderMapper.java:12
  cancelBatch 的 SQL 用 IN 拼接，参数超 1000 会爆 Oracle 限制。
  当前业务量安全，但建议加注释标记升级条件。

Summary: 1 high, 1 medium, 1 low.
```

**第三步：根据发现决定行动**

```text
> 修复 HIGH 的事务问题，给 cancelBatch 加 @Transactional。MEDIUM 和 LOW 记技术债。
```

你告诉 Claude Code 改哪个、不改哪个——Codex 只负责发现问题，决策权在你。

---

## 实战场景二：对抗审查 — Vue 3

### 场景

你写了一个 `useUserPermissions` composable，从 Pinia store 取权限数据做前端权限判断。功能正常，但你想让 Codex 挑战一下设计假设——权限数据始终在 store 里这个前提是否可靠。

### 对话流程

**第一步：跑对抗审查**

```bash
/codex:adversarial-review "这个 useUserPermissions 假设权限数据始终在 store 里，实际场景下可能出现哪些问题？"
```

**第二步：看 Codex 输出**

```
设计挑战：

1. 假设：store 中的 permissions 总是已加载
   — 页面直链访问时 store 可能为空，composable 不处理 loading 状态
   — 返回空数组和"暂无权限"无法区分
   → 实际风险：用户看到空白页面而不是"加载中"

2. 假设：permissions 数组是稳定引用
   — 你用了 computed(() => store.permissions.includes('admin'))
   — 如果 store 重置（logout）再 login，引用变化后 watcher 可能不触发
   → 实际风险：切换账号后权限判断残留

3. 假设：权限检查是同步操作
   — 后端可能改为按接口校验而非全量下发
   — composable 没有 async 版本的扩展点
   → 实际风险：之后需要异步校验时整个接口要翻新

建议：至少加 loading/error/ready 三态，
权限数据为空时明确区分"未加载"和"无权限"。
```

**第三步：按优先级处理**

设计层面不一定要全改。高中低风险自己评估：

- 第 1 点确实可能出问题 → 加 `loading` 状态
- 第 2 点切换账号场景暂时不存在 → 记技术债
- 第 3 点目前无异步需求 → 先不管，真发生了再说

### 什么时候用对抗审查

| 场景 | 为什么用 |
|------|---------|
| 新写了一个通用工具/组件 | 通用意味着不知道会被怎么用，需要质疑边界 |
| 引入新依赖 | "装这个库值得吗？有没有更轻的方案？" |
| 设计了一个抽象层 | 抽象一多就过度，"这个抽象在只有一个实现的时候有必要吗？" |
| 接手别人代码想评估质量 | 先让 Codex 从设计层面扫一遍 |

---

## 实战场景三：疑难调试 — React

### 场景

一个多步表单页面：Step1 填姓名 → Step2 填地址 → Step3 确认 → 点"上一步"回 Step2 → 地址字段清空了。你已经查了半小时，加了 `console.log`，看了 devtools，没找到原因。

### 对话流程

**第一步：扔给 Codex**

```text
> /codex:rescue "多步表单回退时前一步的输入数据丢失。
复现步骤：
1. Step1 填姓名
2. Step2 填地址
3. Step3 点'上一步'回 Step2
4. 地址字段清空

表单用 useState 管理，步骤切换用 useReducer。
怀疑跟组件 unmount/remount 有关，但没找到确切原因。"
```

关键：描述清楚 **复现步骤** + **你的怀疑方向**。Codex 不需要你猜对原因，但你的怀疑能帮它更快定位。

**第二步：Codex 独立诊断**

Codex 读代码、跑诊断，回来后：

```
Root cause:
StepNavigator 在步骤切换时 unmount 了 StepContent，
StepContent 内部的 useState 状态随之销毁。
父组件 FormContainer 的 useReducer 只管理 currentStep 和
全局 formData，StepContent 的地址字段是 local state，
不在 reducer 管理范围内。

Evidence:
- FormContainer.tsx:34 — reducer 只管理 currentStep 和 formData
- StepContent.tsx:22 — 地址用独立的 useState，不是从 props 读入
- 步骤从 3 回退到 2 时，新的 StepContent 实例初始化了空 state

Fix applied:
将 StepContent 的地址字段从 local useState
改为从 props.formData 读写。
Touched: StepContent.tsx, FormContainer.tsx
```

**第三步：验证修复**

你一看代码——`useState` 挂在子组件上，一切换步骤就销毁了。Codex 改了两行，问题解决。

### 什么时候用 rescue

| 场景 | 为什么 |
|------|--------|
| debug 超过 10 分钟没头绪 | 继续自己查只会加深思维定式 |
| CI 炸了不知道哪个 commit 引的 | Codex 能批量对比，比你手动 git bisect 快 |
| 错误涉及多个模块 | 自己追踪调用链效率低，Codex 并行读 |
| 明确知道问题但修复涉及很多文件 | 扔后台跑，干别的事去 |

---

## 实战场景四：大规模重构 — Java MyBatis → JPA

### 场景

User 模块从 MyBatis 迁移到 JPA：3 个 Mapper 接口 + 3 个 XML + 4 个 Service + 若干 DTO。不是复杂逻辑，就是量大——十几二十个文件要改。你不想花一下午盯屏幕。

### 对话流程

**第一步：后台启动**

```text
> /codex:rescue --background "把 user 模块从 MyBatis 迁移到 JPA：
将 UserMapper、RoleMapper、PermissionMapper 的 XML 和接口
替换为 JPA Entity + Repository。
同步更新 UserService、RoleService、PermissionService 的调用。
保持原有 API 不变，保留现有测试，跑通后报告。"
```

返回：

```
Job a3f7b2 started in background.
Check progress: /codex:status a3f7b2
```

**第二步：中途查看进度**

```bash
/codex:status
```

```
Job      Kind   Status       Phase
a3f7b2   task   in_progress  8/14 files migrated

Recent: UserMapper.xml → User entity done.
        On RoleMapper now.
```

**第三步：拿结果**

```bash
/codex:result a3f7b2
```

```
Status: complete ✓
Summary: 20 files touched, 14 migrated, 6 deleted (old XML mappers).
Tests: 22/22 passing.
Residual: 2 deprecated method signatures kept for backward compat.
```

**第四步：自己验证**

跑一遍测试，确认全绿。看一眼改动的关键文件，特别关注事务配置和查询方法签名。Codex 的改动你最终负责——review 一遍再合并。

### 后台模式的场景选择

| 适合后台 | 不适合后台 |
|---------|-----------|
| 涉及 5+ 个文件 | 单个文件的 bug 修复 |
| 机械重复操作（格式统一、重命名） | 需要实时交互确认的决策 |
| 明确知道要什么结果 | 目标模糊、可能需要中途调整方向 |
| 你不急着要结果 | 你等着用它改完的东西继续写 |

---

## Prompt 工程

`/codex:rescue` 的效果很大程度上取决于你怎么描述任务。Codex 用 **XML 标签结构**定义任务边界——写好 prompt 的核心不是"描述得详细"，而是**给 Codex 明确的输入合约和输出合约**。

### 核心标签

| 标签 | 用途 | 什么时候加 |
|------|------|-----------|
| `<task>` | 定义任务范围和上下文 | 必加 |
| `<structured_output_contract>` | 输出格式和字段要求 | 需要结构化结果 |
| `<compact_output_contract>` | 输出从简，只给结论 | 快速诊断 |
| `<default_follow_through_policy>` | 持续分析还是停下来问 | 诊断、修复 |
| `<verification_loop>` | 最终化前自检一遍 | 修复、分析 |
| `<grounding_rules>` | 每条结论附证据 | 审查、研究 |
| `<action_safety>` | 改动范围约束 | 修复 |
| `<missing_context_gating>` | 缺信息时标注，不要猜 | 诊断、研究 |

### 四种场景模板

**诊断类** — 遇到 bug，不知道原因：

```xml
<task>诊断 UserList 页面首次加载时白屏的原因</task>

<compact_output_contract>
返回：1. 最可能的根因 2. 证据 3. 最小安全下一步
</compact_output_contract>

<default_follow_through_policy>
持续分析直到有足够证据确定根因，只在缺关键信息时停下来问
</default_follow_through_policy>

<missing_context_gating>
不确定的事实明确标注"推断"，不要猜测
</missing_context_gating>
```

**修复类** — 原因已知，让 Codex 改：

```xml
<task>
修复 OOM：OrderExportService 一次性加载全表到内存，改为分页查询
</task>

<structured_output_contract>
返回：1. 修改摘要 2. 涉及文件 3. 验证方式 4. 残留风险
</structured_output_contract>

<action_safety>只改导出逻辑，不动其他代码</action_safety>

<verification_loop>
最终化前确认改后代码逻辑连贯、边界条件覆盖
</verification_loop>
```

**审查类** — 改了代码，想确认没问题：

```xml
<task>审查这个 PR 的改动是否存在正确性或回归风险</task>

<structured_output_contract>
返回：1. 按严重程度排序的发现列表 2. 每条发现的证据 3. 简短建议
</structured_output_contract>

<grounding_rules>
每条发现必须引用具体代码位置或工具输出作为依据
</grounding_rules>
```

**研究类** — 想了解方案优劣：

```xml
<task>比较 MyBatis 和 JPA 在当前项目场景下的适用性</task>

<structured_output_contract>
返回：1. 观察到的事实 2. 推理推荐 3. 权衡 4. 待确认问题
</structured_output_contract>

<citation_rules>关键结论标注来源</citation_rules>
```

### 常见反模式

| ❌ 不要这样写 | ✅ 应该这样写 | 原因 |
|--------------|-------------|------|
| "帮我看一下这段代码" | `<task>审查 diff 中的并发安全问题</task>` | 模糊任务让 Codex 自己猜重点，结果不可控 |
| "查一下然后告诉我" | 加 `<structured_output_contract>` 定义输出字段 | 没有输出合约，结果结构不可控 |
| "再想想、更聪明一点" | 加 `<verification_loop>` 让 Codex 自检 | 提升推理不如收紧验证规则 |
| 一个 rescue 塞审查 + 修复 + 重构 | 拆成 3 个独立 rescue | 混在一起 Codex 容易偏离主任务 |
| "生产环境为什么崩了" | 加 `<grounding_rules>`，缺信息标"推断" | 没上下文却要求确定答案，Codex 会编 |

---

## 如何选用

代码改完了、遇到问题了、要做大活了——用哪个命令？看你的**状态**和**目标**。

### 决策流程

```
你现在的状态是什么？

改了代码，想确认没问题
  ├─ 修 bug / 改逻辑 → /codex:review
  └─ 加新功能 / 新抽象 → /codex:adversarial-review

遇到问题，自己查不出来
  ├─ 问题明确、范围小（单文件/单模块）→ /codex:rescue
  └─ 问题模糊、可能涉及多个模块 → /codex:rescue --background

有重活不想自己盯
  └─ /codex:rescue --background
```

### 场景速查表

| 你的状态 | 典型案例 | 用哪个 | 为什么 |
|---------|---------|--------|--------|
| 改了 Service 层逻辑 | Java 批量取消订单，改了三四个方法 | `/codex:review` | 查事务边界、空指针、并发——这些自己审容易漏 |
| 加了新组件/新抽象 | Vue 3 composable 封装了权限逻辑 | `/codex:adversarial-review` | 新设计需要"外人"质疑假设，不是查语法错误 |
| 写了一个算法 | 排序/分页/缓存策略的实现 | `/codex:adversarial-review` | 实现对了≠方案最优，让 Codex 挑战你的选择 |
| 遇到诡异 bug，半小时没头绪 | React 表单回退数据丢失 | `/codex:rescue` | 需要第二个人从零读代码，不被你的思路带偏 |
| 测试炸了一片，不知道哪引的 | CI 红了一大半 | `/codex:rescue` | 独立诊断比你自己 git bisect 快 |
| 需求：迁移一个模块 | MyBatis → JPA，几十个文件 | `/codex:rescue --background` | 你不想盯屏幕等它改完，后台跑 |
| 需求：给全项目加统一错误码 | 涉及所有 Controller | `/codex:rescue --background` | 机械重复劳动，Codex 比你更有耐心 |
| 重构前想确认现有设计问题 | 接手遗留代码，感觉设计很怪 | `/codex:adversarial-review --base main` | 先让 Codex 扫一遍整体设计，再决定重构范围 |

### 三个命令的边界

| | `/codex:review` | `/codex:adversarial-review` | `/codex:rescue` |
|---|---|---|---|
| 审什么 | 代码正确性 | 设计合理性 | 不审，直接干 |
| 输出 | bug、边界条件、性能隐患 | 设计假设漏洞、替代方案 | 诊断结论 + 代码改动 |
| 改代码吗 | 不改 | 不改 | 默认改 |
| 适合阶段 | 每次 commit 前 | 加新抽象/新模块时 | 卡住时、重活不想盯时 |
| 典型时长 | 10–30 秒 | 30–60 秒 | 1 分钟到几十分钟 |
| 后台模式 | 支持 | 支持 | 支持 |

---

## 最佳实践

### 什么时候用 Codex

| 场景 | 理由 |
|------|------|
| 每次 commit 前 | 审查是最后一道防线，成本极低（10–30 秒） |
| 加新抽象/新组件 | 新设计最容易被质疑出问题——只有一个实现时，抽象可能是多余的 |
| debug 卡住超过 10 分钟 | 思维定式一旦形成，继续自己查效率直线下降 |
| 机械重复的批量改动 | 统一返回格式、加字段、迁移命名——Codex 比你更有耐心 |
| 接手别人代码想快速评估质量 | 先跑一次 `adversarial-review`，了解主要问题在哪 |

### 什么时候不该用

| 场景 | 理由 |
|------|------|
| 简单单行改动 | 改个配置、加个字段——审查成本大于收益 |
| 安全/加密逻辑 | 安全代码不应让外部模型审查 |
| 金融计算/计费 | 精度敏感逻辑，审查结果不能替代人工验证 |
| 快速原型阶段 | 代码频繁推翻，审查输出很快过时 |
| Claude Code 自己能快速解决的 | 问一句就能修的小 bug，不需要 rescue |

### 审查门控策略

| 开发阶段 | 建议 | 原因 |
|---------|------|------|
| 日常功能开发 | **开** | 每回合结束自动扫一遍，不会漏 |
| 快速原型 / spike | **关** | 代码还在探索，频繁审查没意义 |
| bug 修复 | **开** | 修 bug 最容易引入新 bug |
| 重构 | **开** | 大量改动，人工逐行审成本高 |
| 配合 CI | 看情况 | CI 已经有审查步骤的话，本地可以关 |

### review 和 adversarial-review 的选择口诀

> 改已有逻辑 → review。加新东西 → adversarial。
> 不确定 → 先 review，发现问题再 adversarial。

---

## 常见问题

### Codex 和 Claude Code 有什么区别？

Claude Code 是你的主助手——写代码、改代码、回答问题。Codex 是**角色分工**下的第二个模型：审查 Claude Code 写的代码，或者在 Claude Code 卡住时独立接手。Codex 不是替代品，是补充。

### rescue 改了代码但我不满意怎么办？

`git diff` 看改动，不满意的部分用 Claude Code 再调整，或者告诉 Codex 哪改得不对，让它重新来。改错了也是正常的——它的价值在于**省了你从头排查的时间**，不是每次一次到位。

### 后台任务找不到了怎么办？

```bash
/codex:status --all
```

这会列出当前仓库的所有历史 job。如果换了仓库，job 跟着仓库走——切回去就能看到。

### review 和 adversarial-review 到底选哪个？

| 你的改动 | 用哪个 |
|---------|--------|
| 修 bug、改逻辑、小重构 | `/codex:review` |
| 加新组件、新抽象、新架构 | `/codex:adversarial-review` |
| 不确定 | 先 `/codex:review`，如果输出只关注实现细节没提到设计问题，再补一个 `/codex:adversarial-review` |

### 审查门控影响性能吗？

不影响。门控在 SessionEnd 触发，异步执行——会话已经结束了，不会让你等。下次会话 `/codex:status` 查看结果。

### Codex 的审查结果和 Claude Code 内建的 code review 有什么区别？

Claude Code 的 code review 用的是 Claude 自己——写代码和审代码是同一个模型，容易有思维盲区。Codex 用不同的模型独立审查，更容易发现 Claude 没注意到的问题。两个都跑一遍是互补的，不是重复的。

### rescue 适合多复杂的任务？

任务越机械、目标越明确，rescue 越合适。"把 20 个 Controller 返回格式统一"很好。"重新设计用户权限系统"不好——后者有太多需要你做决策的地方，rescue 替你做的决策不一定对。
