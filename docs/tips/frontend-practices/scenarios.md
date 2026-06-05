---
title: 前端场景实战指南
description: 前端开发实战案例，展示新页面开发、组件库重构、性能优化等场景中 Git、Superpowers、GStack、OpenSpec、CodeGraph、Context7、Serena 的深度集成
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

## 场景二：组件库重构（语义驱动）

本场景演示如何将散落在各页面中的重复 UI 元素提取为统一的组件库。在长期迭代的项目中，不同开发者往往会在不同页面中实现外观和功能相似的卡片、弹窗、数据表格等组件。这些"拷贝-粘贴"出来的组件导致样式不一致、Bug 修复需要重复多次、新页面开发效率低下。通过这个场景，你将看到如何利用工具链完成一次系统性的组件统一。

### 预计用时与工具分布

| 阶段 | 预计用时 | 主要工具 | 产出物 |
|------|---------|---------|--------|
| 分支创建 | 1 分钟 | Git | feature/component-library 分支 |
| 重复分析 | 15-20 分钟 | CodeGraph | 重复 UI 模式清单 |
| 符号审计 | 10-15 分钟 | Serena | 现有组件符号大纲 |
| 架构审查 | 10-15 分钟 | GStack | 重构方案审查报告 |
| 规格定义 | 10-15 分钟 | OpenSpec | 组件库规格文档 |
| 精确重构 | 2-3 小时 | Serena、CodeGraph | 统一后的组件代码 |
| 测试验证 | 1 小时 | Superpowers、GStack | 通过测试 + 回归验证 |
| 发布 | 5 分钟 | Git | PR + 合并 |

### Step 1：创建功能分支

```bash
git checkout main
git pull origin main
git checkout -b feature/component-library
```

### Step 2：CodeGraph 分析重复 UI 模式

> 哪些页面使用了类似的卡片组件？列出所有重复的 UI 模式

Claude Code 会调用 CodeGraph 的 `codegraph_explore` 工具，扫描整个项目中的 UI 组件，按视觉模式和功能语义进行聚类分析。这次探索不是简单的文件名匹配，而是基于组件的 JSX 结构、Props 接口和样式模式进行深度比对。

**预期输出：**

- **卡片类组件**：UserCard（用户中心）、ProductCard（商品列表）、OrderCard（订单历史）、ReviewCard（评价列表）— 结构高度相似，都包含封面图 + 标题 + 描述 + 操作区
- **弹窗类组件**：ConfirmModal（删除确认）、AlertModal（操作提示）、FormModal（表单弹窗）— 都基于相同的遮罩层 + 内容居中布局
- **数据表格类组件**：UserTable（用户管理）、ProductTable（商品管理）、OrderTable（订单管理）— 都包含排序、分页、行选择功能

:::details CodeGraph 聚类分析的底层原理

CodeGraph 不仅追踪 import/export 依赖关系，还会对组件的 JSX 结构进行抽象语法树（AST）级别的比对。当两个组件的 JSX 树结构相似度超过阈值（通常 70% 以上），且 Props 接口有重叠字段时，CodeGraph 会将它们归入同一个"UI 模式簇"。这让重复检测从"猜文件名"升级为"理解组件语义"。
:::

### Step 3：Serena 符号审计

> 查看 src/components/ 下所有组件的符号大纲

Serena 的 `get_symbols_overview` 会列出指定目录下所有文件的顶层符号（函数、类、接口、类型别名），帮助你快速建立对现有组件库的全局认知。

**预期输出：**

```text
src/components/
├── UserCard.tsx          → export function UserCard(props: UserCardProps)
├── user-card.module.css  → (styles)
├── ProductCard.tsx       → export function ProductCard(props: ProductCardProps)
├── product-card.module.css → (styles)
├── ConfirmModal.tsx      → export function ConfirmModal(props: ConfirmModalProps)
├── AlertModal.tsx        → export function AlertModal(props: AlertModalProps)
├── UserTable.tsx         → export function UserTable(props: UserTableProps)
├── ProductTable.tsx      → export function ProductTable(props: ProductTableProps)
└── ... (更多组件)
```

这一步的价值在于：在动手重构之前，先建立完整的组件清单，避免遗漏。Serena 的符号分析是精确的——它基于 LSP（Language Server Protocol），不会遗漏任何导出的符号。

### Step 4：GStack 架构审查

> /plan-eng-review
> 审查组件库重构方案

GStack 的 `/plan-eng-review` 以 Staff Engineer 的视角审查你的重构计划。它会评估：

- **提取策略**：BaseCard、BaseModal、BaseDataTable 的抽象层级是否合适？是否过度抽象？
- **迁移路径**：能否渐进式迁移，还是需要一次性替换所有引用？
- **向后兼容**：新组件的 API 是否兼容现有使用方式？能否通过适配器模式平滑过渡？
- **性能影响**：统一组件后是否引入了不必要的 re-render？

**预期输出：** 架构审查报告，包含推荐的组件抽象层级、迁移顺序和潜在风险点。

### Step 5：OpenSpec 定义组件库规格

> /opsx:propose component-library-refactor
> 提取统一的 Card、Modal、DataTable 组件

OpenSpec 会生成结构化的组件库规格文档，定义每个组件的 Props 接口、插槽机制、样式变体和无障碍要求。

:::details 组件库规格示例

```yaml
spec:
  name: component-library-refactor
  description: 统一前端 UI 组件库
  requirements:
    - id: REQ-CARD-001
      title: BaseCard 通用卡片组件
      description: 替代 UserCard、ProductCard、OrderCard、ReviewCard
      acceptance:
        - 支持 cover（封面图）、title（标题）、description（描述）、actions（操作区）插槽
        - 支持 size 变体：sm / md / lg
        - 支持 hover 交互效果
        - 无障碍：role="article"，可聚焦，支持键盘操作
      migration:
        - UserCard → BaseCard + UserCard 适配器
        - ProductCard → BaseCard + ProductCard 适配器
    - id: REQ-MODAL-001
      title: BaseModal 通用弹窗组件
      description: 替代 ConfirmModal、AlertModal、FormModal
      acceptance:
        - 支持 title、content、footer 插槽
        - 支持 ESC 关闭、点击遮罩关闭（可配置）
        - 焦点陷阱（Focus Trap）和屏幕阅读器公告
    - id: REQ-TABLE-001
      title: BaseDataTable 通用数据表格
      description: 替代 UserTable、ProductTable、OrderTable
      acceptance:
        - 支持列定义、排序、分页、行选择
        - 支持虚拟滚动（大数据量）
        - 无障碍：role="grid"，支持键盘导航
```

:::

### Step 6：Serena 精确重构

这是整个场景中最核心的阶段。Serena 提供了符号级别的精确操作能力，让重构不再是"全局搜索替换"的赌博。

#### 6.1 追踪引用关系

> 用 find_referencing_symbols 找出 UserCard 的所有引用

Serena 的 `find_referencing_symbols` 会从 `UserCard` 的定义出发，沿着 LSP 的引用索引找到项目中每一个使用了 `UserCard` 的位置——包括 import 语句、JSX 使用、类型引用甚至测试文件中的 mock。

**预期输出：**

```text
UserCard 定义: src/components/UserCard.tsx:15
引用位置:
  src/pages/user/Profile.tsx:8       → import { UserCard } from '@/components/UserCard'
  src/pages/user/Profile.tsx:23      → <UserCard user={user} />
  src/pages/admin/UserList.tsx:12    → import { UserCard } from '@/components/UserCard'
  src/pages/admin/UserList.tsx:45    → <UserCard user={u} size="sm" />
  src/components/__tests__/UserCard.test.tsx:3 → import { UserCard } from './UserCard'
```

**为什么这比 Grep 好：** Grep 只做文本匹配，可能匹配到注释、字符串或同名但不同模块的符号。Serena 基于 LSP 的引用分析是语义级别的，只返回真正的代码引用。

#### 6.2 语义重命名

> 用 rename_symbol 将 UserCard 重命名为 BaseCard

Serena 的 `rename_symbol` 会一次性更新符号定义和所有引用位置。这不是文本替换——它理解 TypeScript 的作用域和模块系统，不会误改同名的局部变量或注释中的文字。

```text
操作: rename_symbol
目标: UserCard → BaseCard
文件: src/components/UserCard.tsx
结果: 6 个引用位置已更新，0 个冲突
```

#### 6.3 符号迁移

> 用 move_symbol 将 BaseCard 移动到 src/components/ui/

Serena 的 `move_symbol` 会将组件定义移动到新目录，同时自动更新所有 import 路径。这是跨文件的符号级操作，比手动剪切粘贴 + 修改 import 安全得多。

```text
操作: move_symbol
目标: src/components/UserCard.tsx → src/components/ui/BaseCard.tsx
结果:
  - 符定义已移动
  - 12 个 import 路径已更新
  - 已创建旧路径的 re-export（向后兼容）
```

:::details 渐进式迁移策略

不要一次性替换所有引用。推荐的迁移顺序：

1. **创建新组件**：在 `src/components/ui/` 下创建 BaseCard，实现通用 Props 接口
2. **创建适配器**：在原位置创建 UserCard，内部使用 BaseCard 并传入默认值
3. **逐页迁移**：每次只迁移一个页面的引用，提交一次，验证一次
4. **删除旧组件**：所有页面迁移完成后，删除适配器和旧组件

Serena 的 `move_symbol` + re-export 机制天然支持这种渐进式迁移。
:::

### Step 7：CodeGraph 影响验证

> 修改 BaseCard 后，哪些页面受到影响？

每次重构一个组件后，用 CodeGraph 的 `codegraph_impact` 工具检查变更影响范围。这一步确保你的修改不会意外破坏其他页面。

**预期输出：**

```text
BaseCard (src/components/ui/BaseCard.tsx) 变更影响:
├── 直接依赖: UserCard, ProductCard, OrderCard, ReviewCard
├── 间接依赖: Profile.tsx, ProductList.tsx, OrderHistory.tsx, ReviewList.tsx
├── 测试文件: BaseCard.test.tsx, UserCard.test.tsx, ProductCard.test.tsx
└── 风险评估: 低风险（Props 接口未变更，仅文件路径变更）
```

### Step 8：Superpowers TDD 测试

为每个提取出来的统一组件编写完整的测试套件。Superpowers 的 TDD 流程确保组件在各种场景下都能正确工作。

```text
> 使用 Superpowers TDD 为 BaseCard 编写测试

🔴 RED — 测试用例：
  - 渲染基本卡片（title + description）
  - 渲染带封面图的卡片
  - 渲染带操作按钮的卡片
  - 响应 size 属性（sm / md / lg）
  - hover 状态下的交互效果
  - 无障碍属性（role="article"，可聚焦）

🟢 GREEN — 最小实现让测试通过

🔵 REFACTOR — 提取子组件，优化样式
```

### Step 9：GStack 浏览器回归测试

> /qa https://localhost:5173
> 测试所有使用重构组件的页面：
> - 用户中心页面（UserCard → BaseCard）
> - 商品列表页面（ProductCard → BaseCard）
> - 订单历史页面（OrderCard → BaseCard）
> - 评价列表页面（ReviewCard → BaseCard）
> - 管理后台的数据表格（UserTable → BaseDataTable）
> - 所有弹窗交互（ConfirmModal → BaseModal）

GStack 的 `/qa` 会在真实浏览器中逐一验证每个受影响的页面，确保重构没有引入视觉回归或功能退化。

**预期输出：**

- 所有页面渲染正常，无样式错乱
- 所有交互功能正常（点击、排序、分页、弹窗开关）
- 无控制台错误或警告
- 截图对比：重构前后视觉一致

### Step 10：Git 提交与 PR

```bash
# 基础组件
git add src/components/ui/BaseCard.tsx src/components/ui/BaseCard.test.tsx
git commit -m "feat(ui): extract BaseCard from scattered card components"

# 弹窗组件
git add src/components/ui/BaseModal.tsx src/components/ui/BaseModal.test.tsx
git commit -m "feat(ui): extract BaseModal from Confirm/Alert/Form modals"

# 数据表格
git add src/components/ui/BaseDataTable.tsx src/components/ui/BaseDataTable.test.tsx
git commit -m "feat(ui): extract BaseDataTable with sort, pagination, and virtual scroll"

# 迁移各页面
git add src/pages/ src/components/UserCard.tsx src/components/ProductCard.tsx
git commit -m "refactor: migrate all card usages to BaseCard"

# 清理旧组件
git rm src/components/ConfirmModal.tsx src/components/AlertModal.tsx
git commit -m "refactor: remove deprecated modal components"

# 推送并创建 PR
git push origin feature/component-library
gh pr create --title "feat: unified UI component library" --body "..."
```

### 场景二总结

通过这个场景，你可以看到符号级重构工具链的价值：

| 阶段 | 工具 | 作用 |
|------|------|------|
| 分析 | CodeGraph | 发现重复 UI 模式，按语义聚类 |
| 审计 | Serena | 符号级组件清单，精确的引用关系 |
| 规划 | GStack | 架构审查，评估抽象层级和迁移策略 |
| 规格 | OpenSpec | 结构化组件规格，定义 Props 和验收标准 |
| 重构 | Serena | 符号级重命名、移动、引用更新 |
| 验证 | CodeGraph | 变更影响分析，确保不遗漏 |
| 测试 | Superpowers | TDD 保障组件质量 |
| 回归 | GStack | 浏览器级回归测试 |

## 场景三：前端性能优化

本场景演示如何系统性地诊断和优化前端性能问题。当首页加载缓慢（LCP > 4s）时，盲目优化往往事倍功半。通过这个场景，你将看到如何利用工具链先定位瓶颈、再制定策略、最后逐项验证，将 LCP 从 4s+ 降到 2.5s 以下。

### 预计用时与工具分布

| 阶段 | 预计用时 | 主要工具 | 产出物 |
|------|---------|---------|--------|
| 分支创建 | 1 分钟 | Git | feature/performance-opt 分支 |
| 性能基线 | 5-10 分钟 | GStack | Core Web Vitals 基线数据 |
| 瓶颈定位 | 15-20 分钟 | CodeGraph、Context7 | 渲染链分析 + 最佳实践 |
| 排查诊断 | 15-20 分钟 | Superpowers | 性能瓶颈诊断报告 |
| 优化实现 | 2-3 小时 | Git、CodeGraph、Context7 | 优化后的代码 |
| 验证 | 10-15 分钟 | GStack | 优化后性能数据 |
| 发布 | 5 分钟 | Git | PR + 性能对比报告 |

### Step 1：创建功能分支

```bash
git checkout main
git pull origin main
git checkout -b feature/performance-opt
```

### Step 2：GStack 性能基线测量

> /benchmark
> 测量首页的 Core Web Vitals

GStack 的 `/benchmark` 会在真实的 Chromium 浏览器中运行 Lighthouse 审计，采集 Core Web Vitals 指标。这是优化的起点——没有基线数据，就无法量化优化效果。

**预期输出：**

```text
Core Web Vitals — 首页 (https://localhost:5173)
├── LCP (Largest Contentful Paint): 4.2s  ❌ 目标 < 2.5s
├── FID (First Input Delay): 120ms        ⚠️  目标 < 100ms
├── CLS (Cumulative Layout Shift): 0.08   ✅ 目标 < 0.1
├── FCP (First Contentful Paint): 1.8s    ⚠️  目标 < 1.8s
├── TTFB (Time to First Byte): 320ms      ✅ 目标 < 800ms
└── Total Bundle Size: 1.2MB              ❌ 目标 < 500KB
```

**关键发现：** LCP 4.2s 远超 2.5s 的良好阈值，Bundle Size 1.2MB 也明显偏大。这两个指标高度相关——过大的 Bundle 会延迟 JavaScript 解析和执行，进而推迟 LCP 元素的渲染。

### Step 3：CodeGraph 渲染链追踪

> 追踪首页的组件渲染链，找出最大的依赖

Claude Code 会调用 CodeGraph 的 `codegraph_trace` 工具，从首页入口组件出发，沿着组件嵌套和 import 关系追踪整条渲染链。这次追踪会揭示：

**预期输出：**

```text
首页渲染链分析:
├── App.tsx
│   ├── import 全量 lodash (420KB) ← 问题！应按需引入
│   ├── import 全量 moment.js (290KB) ← 问题！应替换为 dayjs
│   └── import DashboardPage.tsx
│       ├── HeroSection.tsx
│       │   ├── import 高清未压缩图片 (hero-banner.png, 2.1MB) ← 问题！
│       │   └── import 图表库 chart.js 全量 (180KB) ← 问题！仅用了饼图
│       ├── FeatureCards.tsx
│       │   └── import UserCard, ProductCard, OrderCard (各自含独立样式)
│       └── TestimonialSlider.tsx
│           └── import swiper 全量 (120KB) ← 问题！仅用了基础滑动
└── 总依赖: 47 个模块，1.2MB (gzipped: 380KB)
```

:::details CodeGraph 渲染链追踪的底层原理

CodeGraph 的 `codegraph_trace` 不是简单的 import 扫描。它会构建一棵组件渲染树，区分：
- **同步依赖**：首屏必须加载的组件和模块
- **异步依赖**：可以通过 `React.lazy` 延迟加载的路由级组件
- **可摇树依赖**：使用了 Tree Shaking 但因导入方式不当而未生效的库（如 `import _ from 'lodash'`）

这种分析让你能精确区分"哪些依赖阻塞了首屏"和"哪些可以延迟加载"。
:::

### Step 4：Context7 查询最佳实践

> 查询 React 19 的 useDeferredValue 和 Suspense 最佳实践

在动手优化之前，先通过 Context7 获取 React 19 的最新性能优化 API 文档。确保优化方案使用的是最新、最推荐的模式。

**预期输出：**

- `useDeferredValue` 的使用场景和注意事项（与 `useTransition` 的区别）
- `Suspense` 边界的最佳放置位置（路由级 vs 组件级）
- `React.lazy` 配合 Suspense 的代码分割模式
- Server Components 如何减少客户端 Bundle 大小

### Step 5：Superpowers 性能瓶颈诊断

> /superpowers:systematic-debugging
> 首页 LCP > 4s，排查性能瓶颈

Superpowers 的系统化调试流程会按照"排除法"逐一定位性能瓶颈：

**诊断清单：**

1. **网络层**：是否有未压缩的资源？是否有阻塞渲染的外部脚本？
2. **Bundle 层**：是否有不必要的全量引入？Tree Shaking 是否生效？
3. **渲染层**：是否有不必要的 re-render？是否有同步阻塞的计算？
4. **资源层**：图片是否过大？字体是否阻塞渲染？
5. **缓存层**：静态资源是否有长期缓存？API 响应是否有缓存策略？

**预期输出：** 按影响程度排序的性能瓶颈清单，每个瓶颈附带具体证据和优化建议。

### Step 6：逐项优化实现（TDD 驱动）

#### 6.1 路由级懒加载

将非首屏路由组件改为 `React.lazy` + `Suspense`，减少首屏 Bundle 大小。

```typescript title="优化前 — src/App.tsx"
import { DashboardPage } from './pages/DashboardPage'
import { SettingsPage } from './pages/SettingsPage'
import { UserManagement } from './pages/UserManagement'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/users" element={<UserManagement />} />
    </Routes>
  )
}
```

```typescript title="优化后 — src/App.tsx"
import { Suspense, lazy } from 'react'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const UserManagement = lazy(() => import('./pages/UserManagement'))

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/users" element={<UserManagement />} />
      </Routes>
    </Suspense>
  )
}
```

**每次优化后提交：**

```bash
git add src/App.tsx
git commit -m "perf: add route-level code splitting with React.lazy"
```

#### 6.2 图片懒加载与 WebP 格式

将首屏外的图片改为懒加载，将大图转换为 WebP 格式。

```tsx title="优化前"
<img src="/hero-banner.png" alt="Hero Banner" />

// 优化后
<img
  src="/hero-banner.webp"
  alt="Hero Banner"
  loading="lazy"
  decoding="async"
  width={1200}
  height={600}
/>
```

```bash
git add src/components/HeroSection.tsx
git commit -m "perf: lazy load images and convert to WebP format"
```

#### 6.3 组件级 Memoization

对频繁 re-render 的组件使用 `React.memo`，对昂贵的计算使用 `useMemo`。

```tsx title="优化前"
function FeatureCards({ items }) {
  const sorted = items.sort((a, b) => a.priority - b.priority) // 每次渲染都重新排序
  return sorted.map(item => <Card key={item.id} {...item} />)
}

// 优化后
const FeatureCards = memo(function FeatureCards({ items }) {
  const sorted = useMemo(
    () => items.sort((a, b) => a.priority - b.priority),
    [items]
  )
  return sorted.map(item => <Card key={item.id} {...item} />)
})
```

```bash
git add src/components/FeatureCards.tsx
git commit -m "perf: memoize FeatureCards to prevent unnecessary re-renders"
```

#### 6.4 Bundle 分析与代码分割

使用 `@rollup/plugin-analyzer` 或 `webpack-bundle-analyzer` 分析 Bundle 组成，替换过大的依赖。

```bash
# 替换 moment.js 为 dayjs（290KB → 2KB）
pnpm remove moment
pnpm add dayjs

# lodash 按需引入
# 优化前: import _ from 'lodash'
# 优化后: import debounce from 'lodash/debounce'
```

```bash
git add package.json pnpm-lock.yaml src/
git commit -m "perf: replace moment with dayjs and use lodash-es for tree shaking"
```

:::warning Bundle 优化注意事项

- 替换第三方库时，务必确认 API 兼容性。dayjs 的 API 与 moment.js 高度兼容，但仍有细微差异（如 `moment().format()` 和 `dayjs().format()` 的格式化 token 不同）。
- lodash 的按需引入需要配合 `babel-plugin-lodash` 或使用 `lodash-es` 才能保证 Tree Shaking 生效。
:::

### Step 7：GStack 性能验证

> /benchmark
> 验证优化后 LCP 是否降到 2.5s 以下

GStack 的 `/benchmark` 再次运行 Lighthouse 审计，对比优化前后的数据。

**预期输出：**

```text
Core Web Vitals 对比 — 首页
指标              优化前    优化后    变化
─────────────────────────────────────────
LCP              4.2s     2.1s     -50% ✅
FID              120ms    85ms     -29% ✅
CLS              0.08     0.06     -25% ✅
FCP              1.8s     1.2s     -33% ✅
TTFB             320ms    310ms     -3% ✅
Bundle Size      1.2MB    420KB    -65% ✅
```

### Step 8：创建 PR 附带性能对比报告

```bash
git push origin feature/performance-opt
gh pr create --title "perf: optimize homepage LCP from 4.2s to 2.1s" --body "..."
```

:::details PR 性能对比报告模板

```markdown
## Performance Summary

| Metric | Before | After | Target | Status |
|--------|--------|-------|--------|--------|
| LCP | 4.2s | 2.1s | < 2.5s | PASS |
| FID | 120ms | 85ms | < 100ms | PASS |
| CLS | 0.08 | 0.06 | < 0.1 | PASS |
| Bundle | 1.2MB | 420KB | < 500KB | PASS |

## Changes

- Route-level code splitting with React.lazy + Suspense
- Image lazy loading and WebP conversion
- Component memoization (React.memo + useMemo)
- Replace moment.js with dayjs (-288KB)
- lodash-es with tree shaking (-180KB)

## Bundle Breakdown

Before: moment.js (290KB), lodash (180KB), chart.js (180KB), swiper (120KB), app code (430KB)
After: dayjs (2KB), lodash-es (12KB), chart.js/tree-shakeable (45KB), swiper (12KB), app code (349KB)

Closes #456
```

:::

### 场景三总结

通过这个场景，你可以看到性能优化的系统化方法：

| 阶段 | 工具 | 作用 |
|------|------|------|
| 基线 | GStack | 量化的性能数据，明确优化目标 |
| 诊断 | CodeGraph | 渲染链追踪，定位最大的依赖瓶颈 |
| 调研 | Context7 | 最新框架 API，确保优化方案正确 |
| 排查 | Superpowers | 系统化排除法，不遗漏任何瓶颈 |
| 实现 | Git | 逐项优化、逐项提交，可追溯可回滚 |
| 验证 | GStack | 量化对比，确保优化效果达标 |
