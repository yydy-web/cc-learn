---
title: 从设计到代码
description: 用 Playwright 搭建设计验收桥梁，Claude Code 做前端实现——从设计稿到高质量代码的完整闭环，确保设计还原度 100%
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 前端 | ★★★★★  | ★★★☆☆    |
| 🎨 设计 | ★★★★☆  | ★★★☆☆    |
| 🧪 测试 | ★★★★☆  | ★★★☆☆    |
| 📦 产品 | ★★★☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握用 Playwright 做设计验收、用 Claude Code 做 TDD 实现的前端工程化流程，能保证设计还原度

**🚀 AI 能力提升：** TDD 开发、设计还原、测试驱动
:::

# 从设计到代码

> 原型是半成品，代码才是产品。从原型到代码的过程如果做不好，前面的设计工作全白费。这章教你一个零失真的还原方法。

## 核心问题

设计稿和前端代码之间的鸿沟是怎么产生的？

1. 设计师和开发看的是同一个图，但理解不一样
2. 开发过程中需求变了，但设计稿没跟着更新
3. 没有量化的验收标准——"感觉长得不一样"没法测

解决方案：**用 Playwright 测试做设计验收的"标准答案"**。

## 核心思路

```
原型/设计稿  →  Playwright 测试（标准答案）
                        │
                        ├─ 原型上跑 → 验证设计本身正确
                        └─ 前端上跑 → 验证实现和设计一致
```

同一套测试用例，两个环境各跑一遍。这就是设计还原的量化标准。

## 本章流程

```
从原型提取测试 → 验证原型本身 → 生成前端代码 → 同一套测试验证前端 → 截图对比
     8min            2min          20min             3min             5min
```

## Step 1：从原型提取 Playwright 测试

原型已经做好了（Chapter 1 产出的 `prototype.html`）。现在从它身上提取测试用例——这些测试就是设计验收的"合约"。

```text
> 分析 docs/taskboard/prototype.html，帮我写一套 Playwright 测试，覆盖：
>
> 结构层面：
> - 四列看板是否都存在
> - 各自有正确的标题
>
> 交互层面：
> - 点击新建卡片弹出表单
> - 填写表单可以创建新卡片
> - 拖拽卡片从一列到另一列
> - 编辑按钮打开编辑表单
> - 删除按钮触发确认
>
> 视觉层面：
> - 优先级标签颜色正确
> - 列标题背景色正确
>
> 测试文件放到 tests/design/taskboard.spec.ts
```

Claude Code 生成的测试示例：

```typescript
// tests/design/taskboard.spec.ts
import { test, expect } from '@playwright/test'

test.describe('TaskBoard 原型验收', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${process.cwd()}/docs/taskboard/prototype.html`)
  })

  test('四列看板结构完整', async ({ page }) => {
    const columns = ['待办', '进行中', '待审核', '已完成']
    for (const col of columns) {
      await expect(page.getByText(col, { exact: true })).toBeVisible()
    }
  })

  test('新建卡片流程', async ({ page }) => {
    await page.getByRole('button', { name: '新建卡片' }).click()
    await page.getByLabel('标题').fill('测试任务')
    await page.getByLabel('优先级').selectOption('high')
    await page.getByRole('button', { name: '创建' }).click()
    await expect(page.getByText('测试任务')).toBeVisible()
  })

  test('拖拽移动卡片', async ({ page }) => {
    const card = page.getByText('测试任务')
    const targetColumn = page.getByText('进行中', { exact: true })
    await card.dragTo(targetColumn)
    // 验证卡片出现在目标列
    await expect(
      page.locator('.column').filter({ hasText: '进行中' }).getByText('测试任务')
    ).toBeVisible()
  })

  test('优先级标签颜色', async ({ page }) => {
    const highTag = page.locator('[data-priority="high"]')
    await expect(highTag).toHaveCSS('background-color', 'rgb(239, 68, 68)')
  })
})
```

## Step 2：先在原型上跑通

```bash
npx playwright test tests/design/taskboard.spec.ts
```

这一步确认**设计本身没有问题**。如果原型的交互逻辑有 bug，测试会直接挂——这就是在设计阶段发现的 bug，修复成本最低。

## Step 3：用 Claude Code 生成前端代码

测试通过后，告诉 Claude Code 生成真正的前端代码：

```text
> 根据 docs/taskboard/prototype.html 的原型，生成正式的前端代码。
>
> 技术栈：React 18 + TypeScript + Tailwind CSS
> 拖拽库：@dnd-kit/core
>
> 要求：
> 1. 组件化拆分：Board（容器）、Column（列）、Card（卡片）、CardForm（创建/编辑表单）
> 2. 数据管理：用 useState + localStorage 持久化（和原型一致）
> 3. 验收标准：必须通过 tests/design/taskboard.spec.ts 的全部测试
>
> 先写计划，确认后再生成代码。
```

:::warning
**不要让 Claude Code 直接生成代码**——先让它出计划，你确认组件拆分和数据流设计后再执行。这样避免"写完了发现架构不对，全删了重来"。
:::

Claude Code 会先出计划，确认后生成组件代码。生成的 `Board.tsx` 示例结构：

```tsx
// src/components/Board.tsx
import { useState, useCallback, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'
import { Column } from './Column'
import { Card as CardComponent } from './Card'
import { CardForm } from './CardForm'
import type { Card, ColumnId } from '../types'

const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: 'todo', title: '待办' },
  { id: 'in-progress', title: '进行中' },
  { id: 'review', title: '待审核' },
  { id: 'done', title: '已完成' },
]

export function Board() {
  const [cards, setCards] = useState<Card[]>(() => {
    const saved = localStorage.getItem('taskboard-cards')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('taskboard-cards', JSON.stringify(cards))
  }, [cards])

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    setCards(prev =>
      prev.map(card =>
        card.id === active.id
          ? { ...card, column: over.id as ColumnId, updatedAt: new Date().toISOString() }
          : card
      )
    )
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4 h-screen">
        {COLUMNS.map(col => (
          <Column
            key={col.id}
            id={col.id}
            title={col.title}
            cards={cards.filter(c => c.column === col.id)}
          />
        ))}
      </div>
    </DndContext>
  )
}
```

## Step 4：同套测试验证前端

前端写完后，把 Playwright 测试的 URL 从原型换成前端 dev server：

```typescript
// 改这一行
test.beforeEach(async ({ page }) => {
  // 原型阶段：file:///.../docs/taskboard/prototype.html
  // 前端实现：换成 dev server
  await page.goto('http://localhost:5173')
})
```

```bash
npx playwright test tests/design/taskboard.spec.ts
```

全部通过 → 前端实现和设计原型**精确一致**。有失败的 → 根据错误信息改代码，直到全绿。

## Step 5：截图对比（可选但推荐）

断言通过不等于视觉 100% 一致。加上截图对比做视觉回归：

```bash
npx playwright test tests/design/taskboard.spec.ts --update-snapshots
```

首次运行生成基准截图，之后每次跑都会自动对比。差异超阈值时生成 diff 图直接贴到 PR 里。

## 完整流程总结

| 阶段 | 做什么 | 产出 |
|------|--------|------|
| 提取测试 | Claude Code 从原型分析出 Playwright 测试 | `tests/design/*.spec.ts` |
| 验证原型 | 在原型上跑测试 | 确认设计本身没问题 |
| 出计划 | Claude Code 出组件拆分方案 | 你确认架构 |
| 写代码 | Claude Code 生成前端组件 | React/Vue 组件代码 |
| 验证前端 | 同样测试在 dev server 上跑 | 全绿 = 设计还原通过 |
| 视觉回归 | 截图对比 | 像素级一致性保障 |

## 扩展到 Figma/Axure

如果你的设计源不是 HTML 原型而是 Figma 或 Axure，流程一样：

- **Figma**：用 Figma MCP 直接读设计稿 → 提取测试 → 同上流程。参见 [Figma MCP 教程](/guide/advanced/figma-mcp)
- **Axure**：导出静态 HTML → 同上流程。参见 [Axure + Playwright 实战](/tips/design-to-code)

## 常见问题

### 原型和前端有"合理差异"怎么办？

原型没做的 loading/empty/error 状态——前端应该加。不要把这些差异当 bug。

测试中区分两类断言：

```typescript
// 必须完全一致（结构、字段、文案）
await expect(page.getByLabel('标题')).toBeVisible()

// 原型没有但前端应该有
await expect(page.getByText('提交中...')).toBeVisible()
```

### 拖拽测试不稳定？

Playwright 的 `dragTo` 对复杂拖拽场景可能不够稳定。用 `page.evaluate` 直接触发事件更可靠：

```typescript
await page.evaluate((cardId) => {
  const event = new CustomEvent('dnd-move', {
    detail: { cardId, targetColumn: 'in-progress' }
  })
  document.dispatchEvent(event)
}, 'card-1')
```

### Playwright 测试跑太慢？

```bash
# 并行跑
npx playwright test --workers=4

# 只跑设计验收测试（低频）
npx playwright test tests/design/

# 功能测试独立跑（高频）
npx playwright test tests/e2e/
```

---

**下一章：** [设计系统维护](./design-system) —— 代码写完了，怎么保证后续迭代不会让设计越来越乱？
