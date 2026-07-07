---
title: 并行开发与集成 — 前后端+CLI 三模块同步推进
description: 基于接口契约将数据导出功能拆分为前端/后端/CLI 三个模块，3 个 Agent Worktree 隔离并行开发，最后集成合并跑通端到端
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★★☆    |
| 🧪 测试 | ★★★★☆  | ★★★★☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握接口契约驱动的并行开发模式，能独立拆分全栈任务并用 Worktree 隔离并行实现，完成集成合并

**🚀 AI 能力提升：** 并行开发、契约驱动
:::

## 场景概述

在上一篇文章中，我们完成了数据导出功能的需求拆分和方案设计，明确了系统由三个独立模块组成：**前端导出配置页**（React 组件，负责 UI 交互）、**后端导出 API + 任务队列**（Node.js + BullMQ，负责异步处理）、**CLI 批量导出工具**（命令行，负责自动化场景）。三个模块通过预先定义的接口契约解耦——REST API 格式、CLI 参数规范、组件 Props 类型均已敲定。本文聚焦"如何用 Claude Code 并行推进这三个模块，最终无缝集成"。

这种场景在日常开发中非常典型：前后端分离项目、微服务项目、甚至跨团队协作中都存在"多个模块独立开发、共同交付"的需求。传统方式下，开发者需要频繁沟通、协调进度、解决接口不匹配问题。Claude Code 的 Agent + Worktree 机制可以将这种并行开发模式自动化，大幅降低协调成本。

## 为什么契约驱动并行开发

接口契约是模块之间的"合同"，它规定了双方交互的格式、参数、返回值和行为约束。一旦契约定稿，每个模块的开发者（或 Agent）就只需要遵守这份合同，不需要知道对方如何实现。

| 对比维度 | 无契约直接开发 | 契约驱动并行开发 |
| -------- | -------------- | ---------------- |
| 开发效率 | 依赖顺序推进，前端等后端、CLI 等前端 | 三个模块完全并行，互不阻塞 |
| 集成成本 | 接口随时可能变，集成时大量返工 | 契约锁死接口，集成只需验证 |
| 沟通成本 | 每处细节都需协调确认 | 查看契约文档即可，几乎零沟通 |
| 错误发现时机 | 集成阶段才暴露，修复成本高 | 各自模块独立验证，问题早暴露 |
| 回归风险 | 改一处影响多处，测试范围大 | 契约不变量保证模块内变更不影响其他方 |

:::tip
契约的好坏直接决定并行开发的成败。契约至少要覆盖：请求/响应的完整 JSON Schema、错误码定义、CLI 参数与选项规范、组件 Props 的类型定义。模糊的契约是返工的根源。
:::

## 前置准备

在启动三个 Agent 之前，需要先完成以下准备工作：

**1. 接口契约文档**

将上一阶段产出的接口契约落成三份文档，放在项目根目录的 `docs/contracts/` 下：

```text
docs/contracts/
  export-api.md        # REST API 端点和数据格式
  export-cli.md        # CLI 命令参数和输出规范
  export-component.md  # React 组件 Props 和回调接口
```

**2. 分支策略**

```bash
# 主干分支：feature/data-export（从 main 拉出，最终集成目标）
git checkout main
git checkout -b feature/data-export

# 三个 worktree 会自动创建独立的工作副本，不需要手动维护子分支
```

**3. Worktree 准备**

Claude Code Agent 使用 `isolation: 'worktree'` 时，每个 Agent 会在临时的 git worktree 中独立工作，文件系统完全隔离，不会相互干扰。集成时通过 git merge 合并回来。

:::warning
确保主分支没有未提交的变更，否则 worktree 创建会失败。集成前先拉取最新代码，避免合并冲突。
:::

## 完整交互过程

### Step 1：拆分任务并定义接口契约

在与 CC 交互之前，先整理好三份契约文档的核心定义。下面展示各模块的接口契约摘要。

**模块 A -- 前端：ExportConfig React 组件**

```typescript
// Props 接口定义
interface ExportConfigProps {
  /** 可导出的字段列表 */
  fields: FieldOption[]
  /** 已选择的字段键集合 */
  selected: Set<string>
  /** 字段选择变更回调 */
  onSelectionChange: (selected: Set<string>) => void
  /** 导出格式 */
  format: 'csv' | 'excel' | 'json'
  /** 格式切换回调 */
  onFormatChange: (format: 'csv' | 'excel' | 'json') => void
  /** 日期范围 [start, end] */
  dateRange: [Date, Date]
  /** 日期范围变更回调 */
  onDateRangeChange: (range: [Date, Date]) => void
  /** 导出进度（0-100）*/
  progress?: number
  /** 提交导出请求 */
  onSubmit: () => void
  /** 是否正在导出中 */
  loading?: boolean
}

interface FieldOption {
  key: string
  label: string
  required?: boolean
}
```

**模块 B -- 后端：导出 API**

```text
POST /api/exports
  Body:   { format: "csv"|"excel"|"json", fields: string[], dateRange: { start: string, end: string } }
  Return: { id: string, status: "queued" }

GET /api/exports/:id
  Return: { id: string, status: "queued"|"processing"|"completed"|"failed", progress: number }

GET /api/exports/:id/download
  Return: binary (Content-Disposition: attachment)
```

**模块 C -- CLI：批量导出命令**

```text
cli-export --format <csv|excel|json> [--fields <field1,field2>] [--start <date>] [--end <date>] [--output <dir>]
```

现在将这三份契约交给 CC，让它为三个模块生成独立的实现方案。

```text
CC 输出: 三模块并行开发计划

我已分析三份契约文档，确认三个模块接口无交叉依赖，可以完全并行开发。
以下是任务分配：

| 模块 | 技术栈 | 关键任务 | 预计复杂度 |
|------|--------|----------|------------|
| 前端 | React + TypeScript | ExportConfig 组件、字段选择器、进度条 | 中等 |
| 后端 | Node.js + BullMQ | Express 路由、任务队列、文件生成 | 较高 |
| CLI | Node.js + Commander | 参数解析、API 调用、文件下载 | 较低 |

建议使用 3 个 Agent Worktree 同时启动，集成阶段留 2 小时处理接口对接。
```

### Step 2：编写 Workflow 脚本并行启动 3 个 Agent

接下来编写一个 Workflow 脚本，用 `parallel()` 编排 3 个 Agent 分别处理前端、后端和 CLI，全部在隔离 worktree 中运行。

```javascript
// parallel-export-dev.workflow.js
export const meta = {
  name: 'parallel-export-dev',
  description: '三模块并行开发：前端 + 后端 + CLI，全部 worktree 隔离',
  phases: [{ title: '并行开发', detail: '3 个 Agent 同时在不同 worktree 中开发' }],
}

const [frontend, backend, cli] = await parallel(
  // Agent A: 前端 —— React ExportConfig 组件
  () => agent(
    `根据 docs/contracts/export-component.md 中的 Props 接口定义，
实现 ExportConfig React 组件。要求：
- 导出格式选择器（CSV / Excel / JSON）
- 字段多选列表（支持全选/取消全选）
- 日期范围选择器
- 进度条显示
- 所有 Props 类型严格按契约定义
将组件放在 src/components/ExportConfig/ 目录下。`,
    { label: 'export-frontend', isolation: 'worktree' },
  ),

  // Agent B: 后端 —— Export API + BullMQ 任务队列
  () => agent(
    `根据 docs/contracts/export-api.md 中的 API 规范，
实现导出 API 服务端。要求：
- POST /api/exports 创建导出任务并入队
- GET /api/exports/:id 查询任务状态和进度
- GET /api/exports/:id/download 下载导出文件
- 使用 BullMQ 管理任务队列
- 使用 Redis 作为队列后端
代码放在 src/api/exports/ 目录下。`,
    { label: 'export-backend', isolation: 'worktree' },
  ),

  // Agent C: CLI —— 批量导出命令
  () => agent(
    `根据 docs/contracts/export-cli.md 中的 CLI 规范，
实现 cli-export 命令行工具。要求：
- 使用 commander 解析参数
- 调用后端 POST /api/exports 创建任务
- 轮询 GET /api/exports/:id 直到完成
- 下载文件到指定目录
代码放在 src/cli/ 目录下。`,
    { label: 'export-cli', isolation: 'worktree' },
  ),
)

log(`前端 Agent 完成：${frontend}`)
log(`后端 Agent 完成：${backend}`)
log(`CLI Agent 完成：${cli}`)
```

:::tip
3 个 Agent 各在独立 worktree 中工作，文件系统互不干扰。后端的 worktree 运行 Express 服务器在 `localhost:3001`，前端开发服务器在 `localhost:5173`，CLI 通过 `localhost:3001` 调用后端——这些端口不冲突。
:::

### Step 3：Agent A（前端）-- 实现 ExportConfig 组件

Agent A 在隔离 worktree 中实现前端导出配置页。它只依赖契约文档中的 TypeScript Props 类型，不需要知道后端如何实现。

核心组件代码摘录：

```typescript
// src/components/ExportConfig/ExportConfig.tsx
import { useState, useCallback, useMemo } from 'react'
import type { ExportConfigProps, FieldOption } from './types'

const FORMATS = ['csv', 'excel', 'json'] as const

export function ExportConfig({
  fields,
  selected,
  onSelectionChange,
  format,
  onFormatChange,
  dateRange,
  onDateRangeChange,
  progress = 0,
  onSubmit,
  loading = false,
}: ExportConfigProps) {
  const allSelected = selected.size === fields.length

  const toggleAll = useCallback(() => {
    if (allSelected) {
      onSelectionChange(new Set(fields.filter(f => f.required).map(f => f.key)))
    } else {
      onSelectionChange(new Set(fields.map(f => f.key)))
    }
  }, [allSelected, fields, onSelectionChange])

  const toggleField = useCallback((key: string) => {
    const next = new Set(selected)
    const field = fields.find(f => f.key === key)
    if (field?.required) return // 必选字段不可取消
    if (next.has(key)) next.delete(key)
    else next.add(key)
    onSelectionChange(next)
  }, [selected, fields, onSelectionChange])

  return (
    <div className="export-config">
      {/* 格式选择器 */}
      <section className="export-config__section">
        <h3>导出格式</h3>
        <div className="export-config__format-group">
          {FORMATS.map(f => (
            <label key={f} className={format === f ? 'active' : ''}>
              <input
                type="radio"
                name="format"
                value={f}
                checked={format === f}
                onChange={() => onFormatChange(f)}
              />
              {f.toUpperCase()}
            </label>
          ))}
        </div>
      </section>

      {/* 字段选择器 */}
      <section className="export-config__section">
        <h3>导出字段</h3>
        <label>
          <input type="checkbox" checked={allSelected} onChange={toggleAll} />
          全选
        </label>
        {fields.map(f => (
          <label key={f.key}>
            <input
              type="checkbox"
              checked={selected.has(f.key)}
              disabled={f.required}
              onChange={() => toggleField(f.key)}
            />
            {f.label}{f.required ? ' (必选)' : ''}
          </label>
        ))}
      </section>

      {/* 日期范围 */}
      <section className="export-config__section">
        <h3>日期范围</h3>
        <input
          type="date"
          value={dateRange[0].toISOString().slice(0, 10)}
          onChange={e => onDateRangeChange([new Date(e.target.value), dateRange[1]])}
        />
        <span>至</span>
        <input
          type="date"
          value={dateRange[1].toISOString().slice(0, 10)}
          onChange={e => onDateRangeChange([dateRange[0], new Date(e.target.value)])}
        />
      </section>

      {/* 进度条 */}
      {progress > 0 && (
        <section className="export-config__section">
          <div className="export-config__progress">
            <div className="export-config__progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <span>{progress}%</span>
        </section>
      )}

      {/* 提交按钮 */}
      <button
        className="export-config__submit"
        disabled={loading || selected.size === 0}
        onClick={onSubmit}
      >
        {loading ? '导出中...' : '开始导出'}
      </button>
    </div>
  )
}
```

:::info
Agent A 在 worktree 中完成了完整的组件（包含类型文件 `types.ts`、样式文件、单元测试）。因为 worktree 隔离，它的文件修改不会影响 Agent B 或 C 的工作目录。
:::

### Step 4：Agent B（后端）-- 实现导出 API + BullMQ 任务队列

Agent B 在另一个隔离 worktree 中实现后端服务。它只依赖契约文档中的 API 规范，不关心前端组件的 Props 细节。

核心路由代码摘录：

```typescript
// src/api/exports/router.ts
import { Router } from 'express'
import { v4 as uuid } from 'uuid'
import { exportQueue } from './queue'
import type { Request, Response } from 'express'

const router = Router()

// 创建导出任务
router.post('/api/exports', async (req: Request, res: Response) => {
  const { format, fields, dateRange } = req.body

  // 参数校验
  if (!['csv', 'excel', 'json'].includes(format)) {
    return res.status(400).json({ error: '不支持的导出格式' })
  }
  if (!fields || fields.length === 0) {
    return res.status(400).json({ error: '至少选择一个导出字段' })
  }

  const id = uuid()
  await exportQueue.add('export', { id, format, fields, dateRange })

  res.status(201).json({ id, status: 'queued' })
})

// 查询任务状态
router.get('/api/exports/:id', async (req: Request, res: Response) => {
  const job = await exportQueue.getJob(req.params.id)

  if (!job) {
    return res.status(404).json({ error: '任务不存在' })
  }

  const state = await job.getState()
  const progress = job.progress

  res.json({
    id: job.id,
    status: state, // 'queued' | 'processing' | 'completed' | 'failed'
    progress,
  })
})

// 下载导出文件
router.get('/api/exports/:id/download', async (req: Request, res: Response) => {
  const job = await exportQueue.getJob(req.params.id)
  const state = await job.getState()

  if (state !== 'completed') {
    return res.status(400).json({ error: '任务未完成，无法下载' })
  }

  const filePath = job.returnvalue?.filePath
  res.download(filePath)
})

export { router }
```

任务队列处理逻辑：

```typescript
// src/api/exports/queue.ts
import { Queue, Worker } from 'bullmq'
import type { Job } from 'bullmq'

const connection = { host: 'localhost', port: 6379 }

export const exportQueue = new Queue('exports', { connection })

const worker = new Worker('exports', async (job: Job) => {
  const { id, format, fields } = job.data

  // 模拟数据处理和文件生成
  await job.updateProgress(10)
  // ... 从数据库查询数据
  await job.updateProgress(50)
  // ... 生成对应格式文件
  await job.updateProgress(90)
  // ... 写入磁盘并返回路径
  await job.updateProgress(100)

  return { filePath: `/tmp/exports/${id}.${format === 'excel' ? 'xlsx' : format}` }
}, { connection })
```

### Step 5：Agent C（CLI）-- 实现 cli-export 命令

Agent C 在第三个隔离 worktree 中实现 CLI 工具。它通过 HTTP 调用 Agent B 开发的 API，不关心 API 内部实现。

CLI 用法展示：

```bash
# 导出全部字段为 CSV，时间范围最近 30 天
cli-export --format csv --output ./exports

# 只导出指定字段为 Excel，指定日期
cli-export --format excel --fields name,email,created_at --start 2026-06-01 --end 2026-07-01

# 导出为 JSON，存到指定目录
cli-export --format json --fields id,name,status --output /data/backups

# 查看帮助
cli-export --help
```

核心 CLI 代码摘录：

```typescript
// src/cli/index.ts
import { Command } from 'commander'
import { createExport, pollUntilDone, downloadFile } from './api'

const program = new Command()

program
  .name('cli-export')
  .description('批量数据导出工具')
  .requiredOption('--format <type>', '导出格式: csv | excel | json')
  .option('--fields <list>', '导出字段，逗号分隔（默认全部）', val => val.split(','))
  .option('--start <date>', '起始日期 YYYY-MM-DD')
  .option('--end <date>', '结束日期 YYYY-MM-DD')
  .option('--output <dir>', '输出目录', './exports')
  .action(async (opts) => {
    console.log('创建导出任务...')
    const { id } = await createExport({
      format: opts.format,
      fields: opts.fields,
      dateRange: {
        start: opts.start,
        end: opts.end,
      },
    })

    console.log(`任务已创建: ${id}，等待完成...`)
    const result = await pollUntilDone(id)

    console.log('下载文件...')
    await downloadFile(id, opts.output)

    console.log(`导出完成！文件已保存到 ${opts.output}`)
  })

program.parse()
```

### Step 6：集成三个模块

三个 Agent 各自完成开发后，进入集成阶段。这是契约驱动模式的价值集中体现环节。

:::tip
Agent 配置了 `isolation: 'worktree'` 后，worktree 的创建、提交和清理全部自动管理——Agent 完成工作后会将代码提交到指定的 `branch`，无需手动执行 `git merge`。三个模块的代码都已提交到 `feature/data-export` 分支，直接在该分支上做集成验证即可。
:::

```bash
# 1. 确认三个模块的代码都已就位
git log --oneline -3

# 2. 启动后端服务
npm run dev:server

# 3. 启动前端开发服务器
npm run dev:client

# 4. 运行 CLI 端到端测试
cli-export --format csv --fields name,email,created_at --start 2026-06-01 --end 2026-07-01 --output ./test-exports
```

因为每个模块都严格遵循了接口契约，集成过程中通常只有少量细节需要处理：

- **端口偏差**：CLI 默认调 `localhost:3001`，如果后端实际监听不同端口，改一处环境变量即可
- **日期格式**：后端期望 ISO 8601 字符串、前端 DatePicker 输出 Date 对象、CLI 接收入参字符串——统一在一层转换函数中处理
- **跨 worktree 文件引用**：三个模块的目录结构互相独立，不会产生路径冲突

集成验证通过后，最终的文件结构如下：

```text
src/
  components/ExportConfig/   # Agent A 产出——前端组件
    ExportConfig.tsx
    types.ts
    index.ts
  api/exports/               # Agent B 产出——后端 API
    router.ts
    queue.ts
    processor.ts
  cli/                       # Agent C 产出——CLI 工具
    index.ts
    api.ts
docs/contracts/               # 契约文档（集成时的唯一参照）
  export-api.md
  export-cli.md
  export-component.md
```

:::tip
集成阶段是契约质量的"试金石"。如果集成过程出现大量接口不匹配，说明契约定义不够细致。建议在契约阶段用 AI 做一次"接口一致性校验"——将三份文档交给 CC，请它检查是否有字段名不一致、类型不兼容的地方。
:::

## 要点总结

1. **接口契约是并行开发的前提条件**——没有契约就并行，等于没有蓝图就施工。契约锁定了模块间交互，是三个 Agent 能独立工作的基础。
2. **Worktree 隔离避免 Agent 间文件冲突**——三个 Agent 各在自己的 git worktree 中开发，文件系统完全隔离，合并时像三个独立分支一样整合。
3. **契约定义得越具体，集成越顺利**——类型定义、JSON Schema、错误码、状态机，这些"细节"在集成阶段会直接转化为效率和信心。
4. **集成阶段至少留 20% 时间处理意外**——即使契约完备，环境配置、端口差异、运行时行为差异仍需要时间排查。
5. **把契约文档纳入版本管理**——`docs/contracts/` 目录和代码一起提交。之后任何模块改动都先看契约是否受影响，防止"偷偷改了接口对方不知道"。

## 变体与延伸

| 场景 | 适用性 | 注意点 |
|------|--------|--------|
| 微服务并行开发 | 直接适用。每个微服务 = 一个 Agent，接口契约 = API Gateway 定义 | 服务间认证、服务发现需额外在契约中定义 |
| 前后端分离并行开发 | 经典场景。2 个 Agent 分别做前端和后端，通过 API 文档对齐 | 前端可先用 Mock Server 开发，后端可用 Postman 自测，互不等待 |
| 跨团队并行开发模拟 | 用 3-4 个 Agent 模拟不同团队角色（Android/iOS/Web/后端）并行推进 | 契约粒度建议上升到 OpenAPI/Swagger 规范，便于跨工具验证 |
| 多 SDK 并行开发 | 如同时开发 JS SDK、Python SDK、Java SDK，契约 = 统一的 API Spec | 各 SDK 的 Agent 可共用同一套集成测试用例 |
| 全栈单体应用模块化重构 | 先定义新模块接口契约，再并行重写各模块 | 新老接口兼容期需额外处理 |

下一篇文章将进入"测试与部署"环节，介绍如何用 Claude Code 自动化端到端测试、配置 CI/CD 流水线，以及生产环境部署。

### 相关场景

- [流水线开发流程](./pipeline-workflow) — pipeline() 接力开发
- [Worktree 隔离](./worktree-isolation) — 独立分支并行开发
