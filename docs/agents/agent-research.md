---
title: Agent 自主调研 — 让 AI 帮你做技术选型
description: 用 Agent + WebSearch/WebFetch 自主完成 Next.js vs Remix vs Astro 框架对比调研，输出结构化推荐报告，替代 2 小时人工搜索
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★☆☆☆    |
| 📦 产品 | ★★★★☆  | ★★☆☆☆    |
| 🧪 测试 | ★★☆☆☆  | ★★☆☆☆    |

**🎯 学习产出：** 掌握 Agent + WebSearch/WebFetch 调研模式，能独立让 Agent 自主搜索、对比、汇总并输出结构化报告

**🚀 AI 能力提升：** Agent 自主调研、信息汇总
:::

# Agent 自主调研 — 让 AI 帮你做技术选型

> 人工搜 2 小时翻 30+ 篇文章，拼出一份结论含糊的对比表。Agent 5 分钟搜多个来源、按维度对比、引用原链接——结论可溯、报告可存档。

## 场景概述

你接到一个新项目：做一个内容驱动的官网（博客 + 文档 + 营销页）。技术负责人让你调研 **Next.js / Remix / Astro** 三个框架，两周内出结论。

你可以花两天手动翻官网、看 Reddit 讨论、刷社区评测、对照 GitHub star 和下载量。但问题是——搜索引擎搜出来的"2026 年最佳框架"文章大概率是去年的旧内容，而你需要**当前最新版本的实际表现**：最新版 Next.js 的 Turbopack 稳了吗？Remix 被 Shopify 收购后的路线图变了没？Astro v5 的 Server Islands 实际体验如何？

这就是 Agent 调研的典型场景——让 Claude Code 的 Agent 联网搜索、对比分析、引用来源、输出结构化报告。

## 为什么用 Agent 调研

| 维度       | 人工调研                     | Agent 调研                         |
| ---------- | ---------------------------- | ---------------------------------- |
| 耗时       | 2-4 小时（搜 + 读 + 汇总）   | 3-5 分钟（提问 + 审阅 + 追问）     |
| 来源覆盖   | 3-5 篇，受搜索能力限制       | 同时搜多个源，自动去重             |
| 信息时效   | 可能翻到旧文章               | WebSearch 拉取当前最新结果         |
| 对比结构   | 手工拼表格，维度容易漏        | 你定义维度，Agent 逐一填充          |
| 可追溯性   | 要手动记链接                 | Agent 附引用来源，结论可复核        |
| 主观偏见   | 容易被"写得好的文章"带偏      | 多源交叉验证，结论相对客观          |

Agent 不是替你"拍板"——它替你**收集信息并按你定义的框架整理**。你省下 2 小时，把精力放在审阅结论、追问关键细节、做最终决策上。

## 前置准备

Agent 调研依赖 Claude Code 获取网络信息的能力：

- **WebSearch**：执行在线搜索，返回结果摘要和链接。Agent 会自动用它进行多轮搜索。
- **WebFetch**：访问具体 URL 获取页面全文。Agent 找到关键文章后用它获取完整内容。

:::tip 确认工具可用
在 Claude Code 中执行 `/status`，确认 MCP 工具列表中有 `WebSearch` 和 `WebFetch`。如果没有，参考 [MCP 服务器配置](/guide/advanced/mcp-servers) 添加联网工具。
:::

如果你的 Claude Code 已配置网络访问，无需额外安装。Agent 在对话中会自动调用这些工具。

## 完整交互过程

### Step 1：给 Agent 调研任务

先把需求说清楚——这不是模糊地说"帮我调研框架"，而是给出**明确对比维度和决策标准**。

```text
我需要为以下项目做前端框架选型：

**项目背景**
- 内容驱动网站：博客、文档、营销页
- 团队 3 人，React 经验丰富
- 需要 SEO，部分页面需要交互（搜索、评论区）
- 部署偏好：Vercel 或 Cloudflare Pages

**候选框架**
1. Next.js（App Router）
2. Remix（v2+）
3. Astro（v5+）

**对比维度**
1. 性能（构建速度、LCP、TTFB）
2. 生态与社区（npm 下载量、GitHub star、插件/中间件数量）
3. 学习曲线（从 React 经验出发，上手成本）
4. SSR/SSG/ISR 支持（各自支持哪些渲染模式）
5. 部署与运维（Vercel/Cloudflare 兼容性、环境变量、边缘函数）
6. TypeScript 支持（类型推导质量、文档类型覆盖）

**输出要求**
- 每个维度给出三个框架的对比表格
- 表格后附上你的分析（2-3 句即可）
- 引用信息来源（文章标题 + URL）
- 最后给出推荐结论和理由
```

:::tip 提示词技巧
对比维度是你控制 Agent 输出质量的"方向盘"。维度越具体，Agent 越不会自由发挥。比如把"性能"拆成"构建速度""LCP""TTFB"三个指标，比笼统说"性能好不好"有效得多。
:::

### Step 2：Agent 搜索并返回初版对比报告

Agent 收到任务后，会启动 **Agent + WebSearch + WebFetch** 的组合模式：先搜索每个维度的资料，再访问具体文章获取详细数据，最后汇总输出。

以下是 Agent 返回的典型输出格式：

```text
## 技术选型对比报告：Next.js vs Remix vs Astro

### 1. 性能

| 指标           | Next.js (App Router) | Remix (v2) | Astro (v5) |
| -------------- | -------------------- | ---------- | ---------- |
| 冷启动构建     | 8-15s（Turbopack）   | 3-6s       | 2-5s       |
| LCP（SSR 页面）| 1.2-1.8s             | 1.0-1.5s   | 0.6-1.0s   |
| TTFB（边缘）   | 80-150ms             | 60-120ms   | 40-80ms    |
| 默认 JS 体积   | 90-120KB             | 70-90KB    | 0KB        |

**分析**：Astro 在纯内容页面上有明显性能优势，因为默认零 JS 输出。Remix 的 HTTP 原生缓存策略带来更低的 TTFB。Next.js 通过 Turbopack 大幅改进了构建速度，但 SSR 页面 LCP 仍相对较高。

**来源**：
- "Real-world Framework Benchmarks 2026" — example.com/benchmarks-2026
- Next.js 官方文档 — nextjs.org/docs

### 2. 生态与社区

...
```

Agent 会按此格式遍历全部 6 个维度。每个维度都有表格 + 分析 + 来源。

:::info 如果工具调用失败
偶尔 WebFetch 抓取某个页面会超时。Agent 通常会标注 `[来源暂缺]` 并继续下一个维度。你可以根据情况手动补上那个 URL 让 Agent 重试。
:::

### Step 3：追问具体数据

初版报告出来后，不要全盘接受——重点追问**关键决策因子的具体数据**。

```text
关于性能部分，我有两个追问：

1. Next.js App Router vs Pages Router 性能差多少？有 benchmark 数据吗？
   —— App Router 的 React Server Components 在 SEO 场景下到底提升多大？

2. 你提到 Astro 的 TTFB 是 40-80ms，这个数据的前提是什么？
   —— 是纯静态页还是 SSR 模式？边缘函数冷启动算进去了吗？
```

```text
用户追问后 Agent 的典型回应：

## 追问补充

### 1. Next.js App Router vs Pages Router 性能

| 指标               | Pages Router | App Router (RSC) |
| ------------------ | ------------ | ---------------- |
| 页面 JS bundle     | 120-150KB    | 40-60KB          |
| SSR 页面 LCP       | 1.8-2.5s     | 1.2-1.8s         |
| 首字节时间（冷）   | 200-400ms    | 100-200ms        |
| 水合时间           | 80-120ms     | 20-40ms          |

来源：
- Vercel 官方 "How RSC Improves Performance" — vercel.com/blog/rsc-performance
- "Next.js Pages vs App Router: Real Data" — ahooks.js.org/blog/nextjs-comparison

关键发现：App Router 通过 React Server Components 将客户端 JS 减少 50-70%，SEO 场景下意义重大——内容页面不需要整棵组件树水合。

### 2. Astro TTFB 数据前提

- 测试条件：Cloudflare Workers（边缘函数），预热后
- 40-80ms 是纯静态 / Server Islands 混合模式
- SSR 全动态模式下约 80-150ms（包含边缘函数冷启动 30-60ms）

来源：Astro v5 Server Islands Benchmark — astro.build/blog/server-islands-perf
```

### Step 4：Agent 补充调研并输出最终推荐

根据追问结果，让 Agent 输出最终推荐报告。

```text
综合前面的对比和追问补充，给出最终推荐报告。要求：

1. 按项目需求（内容驱动、React 团队、SEO 优先、Vercel/Cloudflare 部署）给出推荐排序
2. 说明首选推荐的理由
3. 列出首选方案的 2-3 个风险点
4. 如果有"等两个月再看"的理由，也一并写上

输出前再确认所有来源链接仍可访问。
```

```text
## 最终推荐报告

### 推荐排序

1. **Astro（首选）** — 最匹配项目需求
2. Next.js — 生态最强但偏重
3. Remix — 数据密集型应用场景更合适

### 首选理由

项目是内容驱动网站（博客 + 文档 + 营销页），Astro 的核心优势完全吻合：
- **默认零 JS**：纯内容页面输出零 JavaScript，LCP < 1s，SEO 友好
- **岛架构**：搜索、评论区等交互部分用 React/Preact 岛按需加载
- **Server Islands（v5）**：高频更新的内容区块（如最新文章列表）可单独 SSR，静态页面其余部分 CDN 缓存
- **Cloudflare/Vercel 适配器**：部署零配置，边缘函数直接支持

### 风险点

1. **交互密集页面受限**：如果有大量客户端状态管理（如富文本编辑器），Astro 的岛架构不如 Next.js 自然
2. **社区中间件少**：相比 Next.js 的 next-auth、next-intl 等开箱即用中间件，Astro 生态更依赖手动集成
3. **团队学习成本**：.astro 文件语法和岛架构概念需要 1-2 天熟悉

### 备选判断

- 如果 3 个月内交互需求明显增多 → 切到 Next.js App Router
- 如果团队更偏好纯 React 心智模型 → Remix 最接近原生 Web 标准

### 验证状态
所有引用链接已验证（2026-07-06 可访问）：
- astro.build/blog/server-islands-perf ✓
- vercel.com/blog/rsc-performance ✓
- nextjs.org/docs ✓
- remix.run/docs ✓
```

## 要点总结

1. **给 Agent 定义对比维度，而不是说"帮我查一下"**。维度是你控制输出质量的工具——性能/生态/学习曲线/部署，越具体越好。
2. **要求 Agent 引用来源**。没有来源的数据不可复核——要求每条数据附原文链接（标题 + URL），你可以在 30 秒内点开验证。
3. **不要一次性接受结论，要追问**。初版报告找出 2-3 个你最关心的点深挖——"这个数据的测试条件是什么？""A 和 B 在这个子维度上具体差多少？"
4. **调研结果存档为项目文档**。Agent 的输出是一份完整技术选型报告，直接存到项目 `docs/decisions/` 目录作为 ADR（架构决策记录），团队新人也能理解当初为什么选这个技术栈。
5. **区分"Agent 调研"和"人工决策"的边界**。Agent 负责信息收集、结构化对比、引用来源。你负责定义维度、审阅结论、拍板决策——AI 不替你承担技术决策的责任。

## 变体与延伸

Agent 调研模式复用性很高。换一套对比维度和候选对象，就是不同的场景：

| 场景               | 候选对象示例                          | 对比维度调整                               |
| ------------------ | ------------------------------------- | ------------------------------------------ |
| 竞品分析调研       | Linear vs Jira vs ClickUp             | 功能矩阵、定价、集成生态、用户口碑          |
| API 服务选型       | Stripe vs Paddle vs Lemon Squeezy     | 费率、接入复杂度、地区覆盖、发票合规        |
| 技术债务评估       | 当前方案 vs 重构方案 A/B              | 改造成本、兼容性风险、性能提升、迁移周期    |
| 工具链选型         | vitest vs jest、Prisma vs Drizzle     | 性能、生态、团队熟悉度、类型安全            |
| 云服务对比         | Vercel vs Cloudflare vs Railway       | 定价、冷启动、日志监控、数据库集成          |

每种场景的提示词模式相同：**定义候选对象 + 列出对比维度 + 要求引用来源 + 追问关键数据 + 输出决策报告**。掌握一次，任何调研任务都能复用。

:::tip 和 Deep Research 的关系
Claude Code 内置的 `/deep-research` 命令也是调研工具，但它倾向于**深度报告**（多轮搜索 + 章节组织 + 长篇输出），适合需要了解一个领域的完整图景。Agent 调研更偏**对比决策**——给定候选对象和维度，快速产出可直接用于技术讨论的结论。日常选型建议用 Agent 调研，需要写万字综述报告时用 Deep Research。
:::

