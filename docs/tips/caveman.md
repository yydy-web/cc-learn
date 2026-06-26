---
title: Caveman — 极致 Token 省流模式
description: Caveman 让 Claude Code 用原始人说话方式输出，砍掉 65% token 消耗，保持 100% 技术准确度
---

# Caveman — 极致 Token 省流模式

> Why use many token when few token do trick. 🪨

## 概述

**Caveman**（`JuliusBrussee/caveman`）是一个 token 省流技能——让 Claude Code 像原始人一样说话。砍掉所有礼貌用语、解释铺垫、废话连篇，只留技术核心。

Claude Code 默认输出里有一半是"废话"："你的 React 组件之所以在重新渲染，很可能是因为你在每次渲染周期中创建了新的对象引用，这会导致..."——这些字不解决你的问题，只是让你感觉 AI 在"认真回答"。Caveman 的回答是：

```text
新对象引用导致重渲染。内联 object prop = 新 ref = rerender。用 useMemo 包裹。
```

**核心数据**：平均省 65% token、10 个基准任务 72-87% 节省、支持 30+ AI 编码平台。

## 核心理念：不是变笨，是变短

```
普通 Claude 输出（1180 tokens）：
  "你的 React 组件之所以在重新渲染，很可能是因为..."（69 tokens 解释问题）

Caveman 输出（159 tokens）：
  "New object ref each render. Inline object prop = new ref = re-render.
   Wrap in useMemo."（19 tokens 给答案）
```

区别：**答案完全一样，只是去掉了包装**。Caveman 不降智——它只是把"我觉得你可以考虑尝试用 useMemo 来包裹一下这个对象"变成"用 useMemo"。

## 安装

```bash
/plugin marketplace add JuliusBrussee/caveman
/plugin install caveman@caveman
```

也可以用一键脚本：

```bash
# macOS / Linux
curl -fsSL https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.sh | bash

# Windows PowerShell
irm https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.ps1 | iex
```

### 验证

启动 Claude Code 后你会看到：

```text
CAVEMAN MODE ACTIVE — level: full
```

或者直接说 `talk like caveman`，观察 Claude 的回答风格变化。

### 跨平台安装

Caveman 支持 30+ AI 编码平台：

```bash
npx skills add JuliusBrussee/caveman -a cursor       # Cursor
npx skills add JuliusBrussee/caveman -a windsurf     # Windsurf
npx skills add JuliusBrussee/caveman -a github-copilot  # Copilot
npx skills add JuliusBrussee/caveman -a codex        # Codex CLI
```

## 使用方式

### 强度等级

| 等级 | 效果 | 示例 |
|------|------|------|
| `lite` | 去废话，保留语法完整 | "新对象引用导致重渲染。用 useMemo 包裹。" |
| `full` | 默认——冠词去掉，片段化 | "New obj ref each render. Wrap in useMemo." |
| `ultra` | 电报级压缩，只留关键词 | "obj ref → rerender. Fix: useMemo." |
| `wenyan` | 文言文——更短更雅 | "每绘新引，故组重渲。useMemo 之。" |

### 切换命令

```text
/caveman lite     # 轻度省流
/caveman full     # 默认强度
/caveman ultra    # 极致压缩
/caveman wenyan   # 文言文模式
stop caveman      # 关闭
```

### 附属命令

| 命令 | 用途 |
|------|------|
| `/caveman-commit` | 生成 caveman 风格 commit message |
| `/caveman-review` | 省流版代码审查 |
| `/caveman-stats` | 查看当前会话省了多少 token |
| `/caveman-compress` | 把 CLAUDE.md / memory 文件压缩成 caveman 风格 |

### 基准数据

来自 10 个标准任务的实测 token 对比：

| 任务 | 原始输出 | Caveman 输出 | 节省 |
|------|---------|-------------|------|
| 解释 React 重渲染 bug | 1180 | 159 | 87% |
| 修复 auth 中间件 | 704 | 121 | 83% |
| PostgreSQL 连接池 | 2347 | 380 | 84% |
| Docker 多阶段构建 | 1042 | 290 | 72% |
| **平均** | **1214** | **294** | **65%** |

## 日常使用

### Java 示例

**场景**：排查一个 Spring Boot 循环依赖问题。

❌ 不用 Caveman：

```text
Claude: 根据我的分析，你遇到的这个问题很可能是由于 Spring Boot 的依赖注入机制导致的。
在 Spring 容器初始化过程中，当 BeanA 依赖 BeanB，而 BeanB 又反过来依赖 BeanA 时，
就会产生循环依赖。Spring 默认使用三级缓存来解决这个问题，但是在某些情况下——
比如当你的 Bean 使用了 @Async 或 @Transactional 注解时——代理机制可能会
干扰这个缓存的工作方式。我建议你可以尝试以下几种解决方案...（300+ tokens，才开始说方案）
```

✅ Caveman 输出：

```text
循环依赖。BeanA → BeanB → BeanA。
Spring 三级缓存失效——@Async 代理打破缓存链。

Fix（按顺序试）：
1. @Lazy on BeanA's BeanB field — 最简单
2. 拆出 BeanC，两边注入 BeanC — 根本解决
3. @DependsOn 改初始化顺序 — 治标不治本
```

同一个答案，1/3 的 token。你不需要知道 Spring 三级缓存的原理——你要的是怎么修。

### Vue 示例

**场景**：Pinia store 的响应式数据在组件里不更新。

❌ 不用 Caveman：

```text
Claude: 这是一个很常见的 Vue 3 响应式系统相关的问题。当你从 Pinia store 中
解构数据时，实际上你拿到的是解构那一瞬间的快照值，而不是一个响应式引用。
这是因为 JavaScript 的解构语法本质上是按值复制，而不是按引用绑定。
Vue 3 提供了 storeToRefs 这个工具函数来专门解决这个问题...（继续 200 tokens）
```

✅ Caveman 输出：

```text
解构丢失响应式。`const { count } = store` → 拿到的是值，不是 ref。

Fix:
import { storeToRefs } from 'pinia'
const { count } = storeToRefs(store)
// count 现在是 Ref<number>，模板里自动解包
```

## 实战场景一：日常开发——命令式输出

### 场景

你正在做一个 API 重构，要让 Claude Code 帮你改 15 个 Controller 的参数校验方式。你不需要它解释"为什么要做参数校验"——你已经知道——你只要它改。

### 你怎么操作（对话流程）

**激活 Caveman：**

```text
> talk like caveman
```

**然后提需求：**

```text
> 把 src/controllers/ 下所有 @Valid 改成自定义校验注解 @ValidRequest。
> 保留原有的校验规则，不要改字段名，不要动 import order。
```

### 不用 Caveman 的 AI 会怎么做

```text
好的，我理解了你的需求。这是一个比较常见的重构任务。
首先让我解释一下为什么要做这个改动...

（150 tokens 解释 @Valid vs 自定义注解）
（100 tokens 确认方案）
（50 tokens "正在处理中..."）
（最后才动手改代码）
```

**结果**：每个文件附带 300 tokens 的解释，15 个文件 = 4500 tokens 浪费。

### Caveman 方式

```text
Caveman: 扫 15 文件。改 @Valid → @ValidRequest。
        已完成 15/15。无 import 变更。无字段名变更。
```

**结果**：15 文件的改动，3 行输出。你确认一下改了什么就行。

## 实战场景二：日志分析——只要结论

### 场景

你有一段 200 行的错误日志，需要快速定位根因。

### 你怎么操作（对话流程）

```text
> caveman full
> 看这段日志，找根因：
> [贴 200 行堆栈]
```

### Caveman 输出

```text
根因：N+1 query。OrderService.getOrders() 循环调 OrderItemRepo.findById()。
     100 订单 = 101 条 SQL。

位置：OrderService.java:47 `orderItems.stream().map(itemRepo::findById)`

Fix：@Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.id IN :ids")
```

不用读 150 tokens 的分析过程——直接告诉你：哪行、什么 bug、怎么修。

## 实战场景三：Caveman + Ponytail 组合

### 场景

你两个都装。Ponytail 确保"写最简代码"，Caveman 确保"说最少的话"。

```text
Ponytail: navigator.clipboard 一行够用，不装 vue-clipboard3
    +
Caveman: Clipboard API. 1 line. Done.
    =
你看到的：`Clipboard API. 1 line. Done.`
```

输入 token 省了（Caveman 压缩了 CLAUDE.md），输出 token 省了（Caveman 砍了废话），代码也简了（Ponytail 砍了过度设计）。

## 最佳实践

### 什么时候用

| 场景 | 适合 | 不适合 |
|------|------|--------|
| 批量重构、改配置 | ✅ 你要的是结果 | — |
| 日志分析、错误排查 | ✅ "根因在哪"就够了 | — |
| 你已经知道背景 | ✅ 不需要 AI 解释原理 | — |
| 学新技术 | — | ❌ 需要详细解释 |
| 设计方案讨论 | — | ❌ 需要探讨和权衡 |
| 给新人做 Code Review | — | ❌ 需要上下文 |

### 强度选择指南

- `lite`：日常开发默认——去废话，保留完整句子
- `full`：熟悉项目后的快速迭代——碎片化输出
- `ultra`：只出 diff 不解释——适合你只想看代码改动
- `wenyan`：文言文——比 `ultra` 更短，且有趣

### Caveman vs Ponytail

| | Ponytail | Caveman |
|------|---------|---------|
| 管什么 | 代码够不够简 | 话说得够不够少 |
| 怎么工作 | 强制走效率阶梯 | 改变输出风格 |
| 效果 | 少写 80% 代码 | 少说 65% token |
| 组合 | 一个砍代码，一个砍字数 | |

两者叠加：写最少代码 + 说最少的话 = 极致效率。

## 常见问题

### Caveman 会让 Claude 变笨吗？

不会。Caveman 只改变**输出的形式**，不改变**推理的质量**。Claude 仍然完整思考你的问题，只是把 300 字的分析压成 50 字给你。

### lite 和 full 该怎么选？

新项目用 `lite`，你还需要一些上下文确认。熟悉项目后切 `full`。改配置文件、批量重命名这种机械任务用 `ultra`。

### wenyan 文言文模式真的能用吗？

能用，而且是所有模式里最短的。古文天然简洁。适合你已经完全理解问题域、不需要任何解释的场景。

### 会影响代码质量吗？

不影响。Caveman 只改对话文字，不改代码。你拿到的代码和普通模式一样——只是 AI 不会在旁边写一篇小作文解释它写了什么。
