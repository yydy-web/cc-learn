---
title: 前端场景实战指南
description: 6 个完整的前端开发实战案例，展示 Git 工作流、Superpowers、GStack、OpenSpec、Ralph、CodeGraph、Context7、Serena 的深度集成
---

# 前端场景实战指南

本文提供 6 个完整的前端开发实战案例，每个案例包含从需求到上线的完整步骤、具体命令、代码示例和预期输出。案例覆盖前端开发中最常见的场景：新页面开发、组件库重构、性能优化、Bug 修复、遗留项目接管和大型功能自主开发。

:::info
本文是[前端工具链集成全景](./index)的实战补充。工作流阶段详解请参考[集成工作流详解](./integrated-workflow)。
:::

## 场景一：新页面全流程开发（电商商品详情页）

本场景演示从零开发一个电商商品详情页的完整流程。页面包含商品图片轮播、规格选择器、加购按钮、用户评价列表等核心功能。通过这个场景，你将看到 8 个工具如何在不同阶段协同工作，将一个模糊的"做一个商品详情页"需求转化为高质量的生产代码。

### 预计用时与工具分布

| 阶段 | 预计用时 | 主要工具 | 产出物 |
|------|---------|---------|--------|
| 分支创建 | 1 分钟 | Git | feature/product-detail 分支 |
| 代码探索 | 10-15 分钟 | CodeGraph、Context7 | 项目结构理解、框架文档 |
| 需求分析 | 15-20 分钟 | GStack | 需求清单、设计审查报告 |
| 规格定义 | 10-15 分钟 | OpenSpec | 结构化规格文档 |
| TDD 实现 | 2-3 小时 | Superpowers、CodeGraph、Context7、Git | 通过测试的组件代码 |
| 审查测试 | 15-20 分钟 | GStack、Serena | QA 报告、代码审查意见 |
| 发布 | 5 分钟 | GStack | PR + 合并 |

### Step 1：创建功能分支

> 从 main 创建 feature/product-detail 分支

```bash
git checkout main
git pull origin main
git checkout -b feature/product-detail
```

**为什么在这里用 Git：** 在写任何代码之前创建独立分支，是整个工作流的基础。feature 分支隔离了开发过程中的不稳定代码，确保 main 分支始终可部署。后续所有提交都在这个分支上进行，最终通过 PR 合并回 main。

### Step 2：探索现有代码结构

> 这个项目的商品模块有哪些组件和 API？

Claude Code 会调用 CodeGraph 的 `codegraph_explore` 工具，一次性获取项目中与"商品"相关的所有组件、API 接口、Store 和路由定义。这比手动 `Grep` + `Read` 高效得多——一次调用替代十几次文件读取，Token 节省可达 57%。

**预期输出：**

- 现有的商品相关组件（如 ProductCard、ProductList）
- 商品 API 接口定义（如 getProduct、getProductList）
- 商品 Store 或状态管理（如 useProductStore）
- 路由配置中已有的商品页面

:::details CodeGraph 探索的底层原理

CodeGraph 在本地构建代码知识图谱，追踪 import/export 关系、函数调用链和组件嵌套关系。当 Claude Code 提出"商品模块有哪些组件"时，CodeGraph 会从入口文件出发，沿着依赖关系图自动遍历所有相关文件，返回结构化的代码上下文。所有处理都在本地完成，源代码不会发送到外部服务。
:::

### Step 3：查询最新框架文档

> 查询 React 19 的 Server Components 最佳实践

Claude Code 会调用 Context7 MCP 服务器，获取 React 19 的最新文档。这一步很关键——Claude Code 的训练数据可能不包含 React 19 的最新 API（如 `useActionState`、`useOptimistic`），Context7 确保后续生成的代码使用正确的语法。

**预期输出：**

- Server Components 与 Client Components 的划分原则
- `use` Hook 在数据获取中的用法
- Server Actions 的表单处理模式
- Suspense 边界的最佳放置位置

### Step 4：需求探索

> /office-hours
> 商品详情页需要哪些核心功能？

GStack 的 `/office-hours` 会以产品经理的视角，通过 6 个核心问题帮你挖掘真实需求，而不是直接跳到技术方案：

1. **目标用户是谁？** — 首次购买用户 vs 回头客，移动端 vs 桌面端
2. **核心任务是什么？** — 浏览商品、对比规格、下单购买
3. **成功指标是什么？** — 加购率、页面停留时间、跳出率
4. **有什么约束？** — 性能要求（首屏 < 2s）、无障碍标准、浏览器兼容
5. **有什么风险？** — 图片加载慢、规格组合爆炸、评价数据量大
6. **优先级是什么？** — MVP 需要哪些功能，哪些可以后续迭代

**预期输出：** 一份结构化的需求清单，包含核心功能列表、用户故事、验收标准和优先级排序。

### Step 5：设计审查

> /plan-design-review
> 审查商品详情页的 UI 设计

GStack 的 `/plan-design-review` 以高级设计师的视角审查 UI 设计方案。如果你有设计稿（Figma 链接或截图），GStack 会检查：

- 布局是否符合 F 型/Z 型阅读模式
- 信息层级是否清晰（价格 > 标题 > 描述 > 评价）
- 移动端适配策略（底部固定操作栏？图片全屏预览？）
- 是否存在 AI 风格的设计模式（千篇一律的渐变、无意义的装饰元素）

**预期输出：** 设计审查报告，包含改进建议和潜在的 UX 问题。

### Step 6：编写规格文档

> /opsx:propose product-detail-page
> 基于需求分析和设计审查结果，创建商品详情页的规格文档：
> - 图片轮播：支持多图切换、手势滑动、全屏预览
> - 规格选择：SKU 选择器、库存状态显示、价格联动
> - 加购操作：数量选择、加入购物车、立即购买
> - 商品信息：标题、价格、描述、配送信息
> - 用户评价：评分统计、评价列表、图片评价筛选
> - 响应式：桌面端双栏布局，移动端单栏 + 底部固定操作栏

OpenSpec 会生成一份结构化的规格文档，包含功能描述、接口定义、验收标准和实现约束。规格文档提交到 Git 后成为持久化的项目文档，后续迭代可以直接在此基础上增量修改。

:::details OpenSpec 规格文档结构

OpenSpec 生成的规格文档通常包含以下结构：

```yaml
spec:
  name: product-detail-page
  description: 电商商品详情页完整功能
  requirements:
    - id: REQ-001
      title: 商品图片轮播
      description: 支持多张商品图片的轮播展示
      acceptance:
        - 支持左右滑动切换图片
        - 点击图片进入全屏预览模式
        - 支持 pinch-to-zoom 手势缩放
        - 图片懒加载，首屏外图片不预加载
    - id: REQ-002
      title: SKU 规格选择
      description: 多规格商品的选择和价格联动
      acceptance:
        - 展示所有可选规格（颜色、尺寸等）
        - 选择规格后价格实时更新
        - 无库存规格置灰不可选
        - 已选规格组合高亮显示
  # ... 更多需求
```

规格文档的每个需求都有唯一 ID，后续的测试用例、代码提交和 PR 描述都可以引用这些 ID，形成可追溯的开发链路。
:::

### Step 7：TDD 驱动实现

这是整个场景中最核心的阶段。Superpowers 的 TDD 工作流确保每个组件从测试开始构建，渐进式地从静态 UI 演进到完整功能。

#### 7.1 头脑风暴

> /superpowers:brainstorming
> 设计商品详情页的组件结构

Superpowers 的头脑风暴阶段会帮你理清组件拆分策略：

- **页面级组件**：ProductDetailPage（布局容器、数据获取）
- **功能组件**：ProductImageCarousel、SkuSelector、AddToCartButton、ReviewList、ReviewStats
- **共享组件**：PriceDisplay、RatingStars、QuantitySelector
- **自定义 Hooks**：useProduct、useSkuSelection、useCart

**预期输出：** 组件树状图、数据流向图、组件间通信方式（Props drilling vs Context vs Store）。

#### 7.2 定义类型

> 定义 Product、ProductVariant、Review 类型

在写任何组件代码之前，先定义 TypeScript 类型。这一步确保后续所有组件的 Props、API 响应和状态都有明确的类型约束。

```typescript title="src/types/product.ts"
interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  images: ProductImage[]
  variants: ProductVariant[]
  reviews: ReviewSummary
  stock: number
  category: string
  attributes: Record<string, string[]>
}

interface ProductImage {
  id: string
  url: string
  alt: string
  width: number
  height: number
}

interface ProductVariant {
  id: string
  sku: string
  attributes: Record<string, string>
  price: number
  stock: number
  image?: ProductImage
}

interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  content: string
  images?: string[]
  createdAt: string
  helpful: number
}

interface ReviewSummary {
  averageRating: number
  totalCount: number
  distribution: Record<number, number>
}
```

**为什么类型先行：** 类型定义是组件之间的"契约"。先定义类型可以让后续的组件实现、API 层和测试都有一致的数据结构，减少运行时类型错误。

#### 7.3 测试先行 — ProductImageCarousel

> 使用 Superpowers TDD 实现 ProductImageCarousel 组件

Superpowers 会强制执行 RED-GREEN-REFACTOR 循环。以下是以 ProductImageCarousel 为例的完整 TDD 流程：

**🔴 RED — 编写测试：**

```typescript title="src/components/ProductImageCarousel.test.tsx"
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductImageCarousel } from './ProductImageCarousel'

const mockImages = [
  { id: '1', url: '/img/1.jpg', alt: '商品图 1', width: 800, height: 800 },
  { id: '2', url: '/img/2.jpg', alt: '商品图 2', width: 800, height: 800 },
  { id: '3', url: '/img/3.jpg', alt: '商品图 3', width: 800, height: 800 },
]

describe('ProductImageCarousel', () => {
  it('renders the first image by default', () => {
    render(<ProductImageCarousel images={mockImages} />)
    const img = screen.getByRole('img', { name: '商品图 1' })
    expect(img).toBeInTheDocument()
  })

  it('navigates to next image on button click', () => {
    render(<ProductImageCarousel images={mockImages} />)
    fireEvent.click(screen.getByRole('button', { name: '下一张' }))
    expect(screen.getByRole('img', { name: '商品图 2' })).toBeInTheDocument()
  })

  it('wraps to first image after last image', () => {
    render(<ProductImageCarousel images={mockImages} />)
    fireEvent.click(screen.getByRole('button', { name: '下一张' }))
    fireEvent.click(screen.getByRole('button', { name: '下一张' }))
    fireEvent.click(screen.getByRole('button', { name: '下一张' }))
    expect(screen.getByRole('img', { name: '商品图 1' })).toBeInTheDocument()
  })

  it('opens fullscreen preview on image click', () => {
    render(<ProductImageCarousel images={mockImages} />)
    fireEvent.click(screen.getByRole('img', { name: '商品图 1' }))
    expect(screen.getByRole('dialog', { name: '图片预览' })).toBeInTheDocument()
  })

  it('shows thumbnail navigation', () => {
    render(<ProductImageCarousel images={mockImages} />)
    const thumbnails = screen.getAllByRole('tab')
    expect(thumbnails).toHaveLength(3)
  })
})
```

运行 `pnpx vitest run`，预期 5 个测试全部失败（组件尚未实现）。

**🟢 GREEN — 最小实现：**

实现静态 UI（JSX + Tailwind CSS），刚好让测试通过，不做多余的事情。

**🔵 REFACTOR — 重构优化：**

在测试保护下重构：提取子组件、优化动画、改善无障碍支持。

#### 7.4 渐进式实现

按照 Superpowers 的渐进式策略，每个功能层独立实现和测试：

**第一层：静态 UI**

```tsx
// 仅 JSX + 样式，不含任何交互逻辑
export function ProductImageCarousel({ images }: ProductImageCarouselProps) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg">
      <img src={images[0].url} alt={images[0].alt} className="h-full w-full object-cover" />
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
        {images.map((img) => (
          <button key={img.id} role="tab" className="h-16 w-16 overflow-hidden rounded border">
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
```

**第二层：交互逻辑**

添加图片切换、手势滑动、键盘导航。

**第三层：API 集成**

图片懒加载（Intersection Observer）、全屏预览的 Portal 渲染。

**第四层：状态处理**

加载状态（Skeleton）、错误状态（图片加载失败的 fallback）、空状态（无图片时的占位图）。

:::warning
Superpowers 严格执行"先测试后代码"规则。如果代码在测试之前写好，会被要求删除重来。这对习惯了"先写 UI 后补测试"的开发者可能需要适应，但这是保证代码质量的关键纪律。
:::

### Step 8：Git 频繁提交

每完成一个组件就提交一次，使用 Conventional Commits 格式：

```bash
# 类型定义
git add src/types/product.ts
git commit -m "feat(product): add Product, ProductVariant, and Review type definitions"

# 图片轮播组件
git add src/components/ProductImageCarousel.tsx src/components/ProductImageCarousel.test.tsx
git commit -m "feat(product): add ProductImageCarousel with TDD"

# SKU 选择器
git add src/components/SkuSelector.tsx src/components/SkuSelector.test.tsx
git commit -m "feat(product): add SkuSelector with stock state and price sync"

# 加购按钮
git add src/components/AddToCartButton.tsx src/components/AddToCartButton.test.tsx
git commit -m "feat(product): add AddToCartButton with quantity selector"

# 评价组件
git add src/components/ReviewList.tsx src/components/ReviewStats.tsx
git commit -m "feat(product): add ReviewList and ReviewStats components"

# 页面组装
git add src/features/product/ProductDetailPage.tsx
git commit -m "feat(product): compose ProductDetailPage with all sub-components"
```

**为什么频繁提交：** 小粒度的提交让代码审查更容易，也让 `git bisect` 定位问题更精确。如果某个组件引入了 Bug，可以快速回滚到上一个正常状态。

### Step 9：浏览器 QA 测试

> /qa https://localhost:5173/product/123
> 测试商品详情页的完整交互流程：
> - 图片轮播：左右切换、全屏预览、缩略图导航
> - 规格选择：切换不同颜色和尺寸、观察价格变化
> - 加购操作：选择数量、加入购物车、购物车数量更新
> - 用户评价：滚动加载、图片评价筛选
> - 响应式：移动端底部操作栏、图片手势滑动

GStack 的 `/qa` 会在真实的 Playwright Chromium 浏览器中执行这些测试。它会自动遍历页面、点击按钮、填写表单、验证状态变化，并生成详细的 QA 报告。

**预期输出：**

- 通过的测试项列表
- 发现的 Bug（如规格切换后价格未更新、移动端底部栏遮挡内容）
- 截图和录屏证据

### Step 10：代码审查与安全审计

> /review

GStack 的 `/review` 以 Staff Engineer 的视角审查 `feature/product-detail` 分支的所有变更。审查重点包括：

- 组件是否遵循项目的目录结构约定
- TypeScript 类型是否完整（无 any、无类型断言滥用）
- 是否有不必要的 re-render（缺少 memo、依赖数组问题）
- 无障碍问题（缺少 aria-label、键盘导航不完整）
- 测试覆盖是否充分

> /cso

GStack 的 `/cso` 进行 OWASP Top 10 安全审计。对商品详情页，重点检查：

- **XSS 风险**：商品描述是否使用了 `dangerouslySetInnerHTML`？评价内容是否经过消毒处理？
- **数据暴露**：API 响应是否包含了不必要的敏感字段（如成本价、供应商信息）？
- **CSRF 防护**：加购和购买操作是否有 CSRF Token？

如果审查发现问题，可以用 Serena 进行精确修复：

```text
> 审查发现 ReviewList 组件中评价内容直接使用了 dangerouslySetInnerHTML：
> 1. 用 find_referencing_symbols 找出所有使用 ReviewContent 的地方
> 2. 引入 DOMPurify 对 HTML 内容进行消毒
> 3. 用 replace_symbol_body 更新组件实现
> 4. 添加 XSS 防护的测试用例
```

### Step 11：发布

> /ship

GStack 的 `/ship` 会自动执行以下步骤：

1. 运行完整测试套件（`pnpm test`）
2. 运行 TypeScript 类型检查（`pnpx tsc --noEmit`）
3. 运行 ESLint 检查（`pnpm lint`）
4. 审计测试覆盖率
5. 推送分支到远程（`git push origin feature/product-detail`）
6. 创建 PR 并生成描述（使用 `gh pr create`）
7. PR 描述中包含变更摘要、测试结果和截图

**预期输出：** 一个包含完整描述、测试通过状态和截图的 PR，可以直接请求团队成员 review。

:::details PR 描述模板

GStack 自动生成的 PR 描述通常包含：

```markdown
## Summary

Add product detail page with image carousel, SKU selector, add-to-cart,
and review list.

## Changes

- Add Product, ProductVariant, Review type definitions
- Add ProductImageCarousel component with TDD
- Add SkuSelector with stock state and price sync
- Add AddToCartButton with quantity selector
- Add ReviewList and ReviewStats components
- Compose ProductDetailPage with responsive layout

## Testing

- ✅ 42 unit tests passing (Vitest + RTL)
- ✅ TypeScript strict mode passing
- ✅ ESLint zero warnings
- ✅ Browser QA: all interactions verified

## Screenshots

[Desktop view] [Mobile view] [Fullscreen preview]

Closes #123
```

:::

### 场景一总结

通过这个场景，你可以看到 8 个工具在不同阶段的协同模式：

| 阶段 | 工具 | 作用 |
|------|------|------|
| 探索 | CodeGraph | 快速理解项目结构，避免重复造轮子 |
| 探索 | Context7 | 获取最新框架文档，避免使用过时 API |
| 规划 | GStack | 需求探索和设计审查，确保做正确的事 |
| 规划 | OpenSpec | 结构化规格文档，为实现提供明确目标 |
| 实现 | Superpowers | TDD 纪律，确保代码质量 |
| 实现 | CodeGraph | 实时代码探索，理解现有组件结构 |
| 实现 | Context7 | 实时文档查询，确保 API 使用正确 |
| 实现 | Git | 频繁提交，小粒度版本控制 |
| 审查 | GStack | 浏览器 QA + 代码审查 + 安全审计 |
| 修复 | Serena | 精确重构，修复审查发现的问题 |
| 发布 | GStack | 自动化发布流程，创建 PR |
