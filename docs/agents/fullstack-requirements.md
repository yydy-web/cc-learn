---
title: 需求调研与方案设计 — 从模糊想法到可执行 PRD
description: Product Manager + Growth Hacker + Backend Architect 三个 Agent 协作，完成数据导出功能的需求分析、竞品调研和技术方案设计，输出完整 PRD
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 📦 产品 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握多 Agent 需求分析流程，能独立用不同 Agent 角色覆盖产品/市场/技术三个视角完成需求调研和方案设计

**🚀 AI 能力提升：** 需求分析、方案设计
:::

## 场景概述

一家 SaaS 管理后台的运营团队反馈："客户要数据导出功能。"就这么一句话，没有更多细节——导出什么数据？什么格式？数据量多大？权限怎么控制？直接动手写代码，大概率写着写着发现方向错了，然后推倒重来。

本案例展示如何用 Claude Code 的三个 Agent 角色——Product Manager、Growth Hacker、Backend Architect——把一句模糊需求变成一份可执行的产品方案文档。整个流程耗时约 30 分钟，产出物包含用户故事、验收标准、竞品分析、技术架构设计，以及明确的"不做清单"。需求阶段多花半小时，能避免开发阶段两天的无效返工。

## 为什么需求阶段用多 Agent

一个人的视角有盲区。开发者天然会从技术可行性出发想问题，容易忽略"用户真正想要什么"和"竞品已经做了什么"。而如果只让产品经理写需求，又容易产出技术上无法落地的空中楼阁。

多 Agent 协作的核心价值在于**视角互补**：

| Agent 角色 | 关注点 | 典型产出 |
| --- | --- | --- |
| Product Manager | 用户故事、验收标准、优先级 | PRD 摘要、不做清单 |
| Growth Hacker | 竞品功能对比、差异化机会 | 竞品分析矩阵、差异化建议 |
| Backend Architect | 技术方案、性能边界、安全策略 | 架构设计、技术选型理由 |

三个 Agent 并行工作，最后由 Synthesize Agent 整合输出。这比一个人切换三种思维模式效率高得多——不用"先说服自己再反驳自己"，而是让三个角色独立发言，然后交叉验证。

## 前置准备

项目背景：

- **技术栈**：React 前端 + Node.js/Express 后端，PostgreSQL 数据库
- **业务场景**：B2B SaaS 管理后台，DAU 约 500 企业用户
- **数据规模**：核心业务表约 200 万行，单用户平均数据量 4000-8000 行
- **现有基础设施**：已部署 Redis，有 JWT 权限体系

在 Claude Code 中创建三个 Agent 会话，分别配置对应的 `system prompt` 角色定义。

## 完整交互过程

### Step 1：Product Manager Agent 分析需求

用 `brainstorming` 模式启动 PM Agent，输入原始需求，让 Agent 从用户故事角度拆解。

**输入提示核心要点**：

```text
你是 SaaS 后台的产品经理。用户说"我要导出数据"，请帮我：
1. 列出可能的用户场景（谁、什么情况下、要导出什么）
2. 写用户故事（Who/What/Why 格式）
3. 定义验收标准（Gherkin Given/When/Then）
4. 按 P0/P1/P2 排优先级
5. 明确列出"不做"哪些（防止范围蔓延）
项目背景：B2B SaaS，500 企业用户，React + Node.js + PostgreSQL。
```

**Agent 输出的 PRD 摘要（精简）**：

**用户故事表**

| 优先级 | 用户故事 | 验收标准概要 |
| --- | --- | --- |
| P0 | 运营人员导出会员列表为 CSV，用于周报 | 选择筛选条件后点击导出，5 秒内下载 5000 行以内 |
| P0 | 财务人员导出交易流水为 Excel，用于对账 | 支持日期范围筛选，含汇总行 |
| P1 | 技术经理通过 API 拉取数据接入 BI 工具 | 提供 REST API，支持分页 + 时间范围参数 |
| P1 | 管理员导出全部用户数据做备份 | 异步任务，支持进度提示，上限 100 万行 |
| P2 | 导出模板自定义（选列、排序） | 拖拽式列选择器，保存为模板 |

**验收标准示例（P0：导出会员列表）**：

```text
Scenario: 运营人员导出筛选后的会员列表
  Given 用户在会员管理页已设置筛选条件"注册时间 > 2024-01-01"
  When 用户点击"导出 CSV"按钮
  Then 系统生成包含姓名、邮箱、注册时间、会员等级的 CSV 文件
  And 文件名格式为 members_export_2024-07-06.csv
  And 文件在 5 秒内完成下载
  And 若结果超过 5000 行，显示提示"数据量较大，建议使用 API 导出"
```

**不做清单**：

- 不做 PDF 格式导出（排版复杂度远大于价值）
- 不做实时流式导出（V1 用批量异步方案覆盖）
- 不做跨数据源 JOIN 导出（单表优先）
- 不做导出数据加密（安全策略留给现有基础设施）

:::tip 提示
"不做清单"是 PM Agent 输出中最容易被忽略但最有价值的部分。它能有效防止需求讨论阶段的范围蔓延，避免开发过程中突然冒出"顺便也支持一下 PDF 吧"这类需求。
:::

### Step 2：Growth Hacker Agent 调研竞品

PM 给出了用户视角，但还需要知道市面上类似功能的实现水平和差异化机会。用 Growth Hacker Agent 做竞品调研。

```text
你是 SaaS 产品的 Growth Hacker。我们的后台需要加数据导出功能，
请调研以下产品/平台的导出功能设计，输出竞品分析矩阵和差异化建议：
- Notion（非结构化数据导出）
- Google Sheets（表格类导出标杆）
- Airtable（结构化数据导出的新范式）
- Apache Superset（数据量大场景的参考）
```

**竞品分析矩阵**：

| 功能维度 | Notion | Google Sheets | Airtable | Superset | 我们的机会 |
| --- | --- | --- | --- | --- | --- |
| 导出格式 | CSV, Markdown, HTML, PDF | CSV, TSV, PDF, XLSX, ODS | CSV | CSV, JSON, XLSX, 图片 | CSV + Excel（覆盖率 95%） |
| 大文件策略 | 无（全量同步） | 无（单次上限） | 同步导出 | 异步 + 邮件通知 | **异步队列 + 进度条** |
| 筛选后导出 | 部分支持 | 原生表格筛选 | 视图级筛选 | SQL 查询 | **前端筛选条件直传** |
| API 导出 | 官方 API | Sheets API | REST API | REST API + SQL | **API + Webhook 完成通知** |
| 权限控制 | 文档级 | 文件级 | 基级别 | 数据源级 | **字段级权限（差异化）** |

**差异化切入点**：

1. **字段级权限控制**：管理员可配置"谁可以导出哪些字段"，财务字段不让运营看到——这是企业级 SaaS 的刚需，竞品普遍是表级权限
2. **导出任务队列 + 进度条**：大文件用异步任务，用户提交后可以关掉页面去干别的事，完成后通过站内通知 + Webhook 回调
3. **导出模板系统**：允许运营人员保存"我经常用的那套导出配置"，对标 Airtable 的 Views 概念但更轻量

### Step 3：Backend Architect Agent 出技术方案

有了产品需求和竞品定位，现在需要落到技术层面。注意这一步的输入要包含前两步的产出摘要，让 Architect Agent 基于完整上下文做设计。

```text
你是 Node.js 后端架构师。我们需要实现数据导出功能，以下为已确认的需求和竞品分析：
[粘贴 PM Agent 的用户故事 + 不做清单]
[粘贴 Growth Hacker 的差异化建议：字段级权限、异步队列、导出模板]

请设计技术方案，包括：
1. 导出架构（队列、Worker、存储）
2. 文件格式选型（CSV vs Excel vs Parquet 比较）
3. 临时文件生命周期（生成、下载、清理）
4. 限流和权限策略
5. API 端点草案
```

**架构概览**（文字描述）：

```text
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  React 前端   │────▶│  Express API │────▶│   Redis      │
│              │     │  POST /exports│     │  (队列+缓存)  │
│  轮询进度     │◀────│  GET /exports │     │              │
│              │     │     /:id     │     └──────┬───────┘
└──────────────┘     └──────────────┘            │
                                           ┌────▼───────┐
                                           │  BullMQ    │
                                           │  Worker    │
                                           │            │
                                           │ ┌────────┐ │
                                           │ │PgSQL查询│ │
                                           │ │→ 格式化  │ │
                                           │ │→ 写文件  │ │
                                           │ └────────┘ │
                                           └────┬───────┘
                                                │
                                           ┌────▼───────┐
                                           │  对象存储   │
                                           │  (S3/MinIO)│
                                           │ TTL: 24h   │
                                           └────────────┘
```

**文件格式选型对比**：

| 维度 | CSV | Excel (xlsx) | Parquet |
| --- | --- | --- | --- |
| 生成速度 | 极快 | 较慢（需 zip） | 中等 |
| 文件体积 | 大（无压缩） | 中（自动压缩） | 小（列式压缩） |
| 用户门槛 | 通用 | 通用 | 需专业工具 |
| 适用行数 | < 5 万 | < 10 万 | > 10 万 |
| V1 推荐 | **是（小文件）** | **是（需格式化）** | 否（V2 考虑） |

**选型结论**：V1 用 CSV（< 1 万行同步）和 Excel（< 10 万行同步），超过 10 万行走异步任务队列。Parquet 留到 V2 当需要大规模分析导出时再引入。

**限流与安全策略**：

- **用户级限流**：每用户每小时最多 20 次导出请求（Redis 计数器 + TTL）
- **字段级权限**：导出接口校验 JWT scope，敏感字段（如手机号、身份证号）需额外 `sensitive_data:read` 权限
- **文件安全**：生成的文件 URL 带上一次性签名 token，有效期 15 分钟，下载后文件 24 小时自动清理
- **并发控制**：BullMQ 的 Worker 进程限制为 CPU 核数 - 1，防止导出任务打满数据库连接池

**API 端点草案**：

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| `POST` | `/api/exports` | 提交导出任务，body 含 resource_type、filters、format |
| `GET` | `/api/exports/:id` | 查询任务状态（pending/processing/completed/failed）+ 进度百分比 |
| `GET` | `/api/exports/:id/download` | 下载文件（一次性签名 URL，15 分钟有效） |
| `DELETE` | `/api/exports/:id` | 取消进行中的任务 |
| `GET` | `/api/export-templates` | 获取用户保存的导出模板 |

### Step 4：Synthesize Agent 整合三份输出

三个 Agent 的输出各自独立，需要一个整合步骤把它们拼成一份完整、可执行的文档。

```text
请整合以下三份输出，生成一份完整的产品需求文档（PRD）+ 技术方案：
1. PM Agent 的用户故事和验收标准
2. Growth Hacker 的竞品分析和差异化建议
3. Backend Architect 的架构设计和技术选型

输出结构：
- 需求概述
- 用户故事与验收标准（表格）
- 不做清单
- 竞品分析与差异化策略
- 技术架构（含 API 端点、数据模型、限流策略）
- 开发时间估算（按优先级拆分）
```

Synthesize Agent 整合后的文档核心补充——**时间估算**：

| 阶段 | 内容 | 预估工时 |
| --- | --- | --- |
| P0 | CSV + Excel 同步导出、字段级权限 | 3 人天 |
| P1 | 异步导出队列（BullMQ）、进度轮询、API 导出 | 4 人天 |
| P1 | Webhook 完成通知 | 0.5 人天 |
| P2 | 导出模板系统 | 2 人天 |
| P2 | Parquet 格式支持 | 1.5 人天 |

:::warning 提示
时间估算要注明"不含联调和 CR 时间"，避免给团队不合理的心理预期。这里的估算是基于已有基础设施（Redis、JWT）的前提。
:::

**数据模型草图**：

```typescript
// 导出任务表（PostgreSQL）
interface ExportTask {
  id: string               // UUID
  userId: string           // 提交者
  resourceType: string     // 'members' | 'transactions' | 'orders'
  filters: object          // 筛选条件 JSON
  format: 'csv' | 'xlsx'   // 导出格式
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number         // 0-100
  filePath?: string        // 对象存储路径
  fileSize?: number        // 字节
  errorMessage?: string
  createdAt: Date
  completedAt?: Date
  expiresAt: Date          // createdAt + 24h
}

// 导出模板表
interface ExportTemplate {
  id: string
  userId: string
  name: string
  resourceType: string
  selectedColumns: string[] // 选中的字段列表
  defaultFilters: object
  defaultFormat: 'csv' | 'xlsx'
}
```

### Step 5：团队 Review → 确认进入开发

文档产出后，在进入开发前需要一个团队 Review 环节。Review 不是为了推翻重来，而是让不同角色的人确认"我没理解错你的需求"。

**Review Checklist**：

- [ ] **产品确认**：用户故事覆盖了所有已知场景吗？不做清单有没有遗漏？
- [ ] **运营确认**：导出格式（CSV / Excel）符合实际使用场景吗？是否需要自定义模板？
- [ ] **后端确认**：异步队列方案能承受峰值并发吗？BullMQ 运维复杂度可接受吗？
- [ ] **安全确认**：字段级权限策略覆盖了所有敏感字段吗？导出频率限流合理吗？
- [ ] **前端确认**：异步任务轮询对用户体验友好吗？需要 WebSocket 实时推送替代轮询吗？
- [ ] **时间确认**：3 人天 P0 是否含单元测试？是否需要预留联调缓冲期？

Review 通过后，PRD 锁定版本（可标记为 `v1.0`），后续需求变更走独立的迭代流程。

## 要点总结

1. **需求阶段不要跳过 PM Agent 直接写代码**。一句"用户要导出数据"能衍生出 CSV、Excel、API、异步队列四种实现路径，没有用户故事和验收标准做锚点，开发很容易过度工程或实现偏了。

2. **竞品调研让 Growth Hacker 做，不要凭感觉**。开发者的竞品认知通常来自个人使用体验（"Notion 导出挺好的"），但 Growth Hacker Agent 能从市场定位角度找出差异化切入点——比如本案例中的"字段级权限"，这是开发者自己不容易想到但企业客户真正在乎的点。

3. **技术方案要包含"不做清单"和限流策略**。没有不做清单，需求就会不断膨胀；没有限流策略，一个用户的导出请求就可能拖垮整个数据库。这两项是技术方案从"能用"变成"可靠"的分水岭。

4. **PRD 输出要可执行**。含验收标准（Given/When/Then 可测试）、优先级（P0/P1/P2 可排期）、时间估算（不含联调的裸开发时间）。模糊的 PRD 等于没有 PRD。

5. **多 Agent 的价值不在"并行"，在"交叉验证"**。PM 说要做 Excel 导出，Growth Hacker 指出 Airtable 做的是"视图级导出"更灵活，Architect 评估后发现视图级导出 SQL 复杂度可控——三个视角交叉后才得到一个既满足用户、又有差异化、还能落地的方案。

## 变体与延伸

本案例的核心模式——"PM 分析用户需求 + Growth Hacker 调研竞品 + Architect 设计技术方案 + Synthesize 整合"——可以复用很多场景：

**新功能需求分析**：任何面向用户的新功能（dashboard、消息中心、权限系统）都可以用同一套流程。PM 先定义用户故事，Growth Hacker 看看竞品怎么做的，Architect 评估技术可行性，Synthesize 整合出可执行方案。

**重构方案设计**：老系统重构最怕"换一个框架重写一遍，bug 一个不少"。用 PM Agent 重新梳理用户场景（哪些是真正在用的、哪些已经没人用了），用 Architect Agent 设计新架构时自动标注"旧系统的坑"，输出的重构方案会务实得多。

**技术迁移方案**：例如从 REST 迁移到 GraphQL，从 Express 迁移到 Fastify。PM Agent 评估迁移对用户的影响面（哪些 API 会 breaking），Growth Hacker 调研社区迁移案例（踩了哪些坑），Architect 设计渐进式迁移路径（共存期、灰度策略、回滚方案）。

**产品路线图规划**：把 PM 的用户故事按 P0/P1/P2 排好，Growth Hacker 标注每项的市场窗口期（竞品什么时候可能跟进），Architect 标注每项的技术依赖（P2 的功能可能需要 P1 的基础设施先到位），Synthesize 输出带时间轴的路线图。

### 相关场景

- [Agent 调研](./agent-research) — Agent 驱动的技术调研
- [Judge Panel 决策](./judge-panel) — 多 Agent 辩论式技术选型