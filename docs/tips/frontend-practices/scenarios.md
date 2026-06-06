---
title: 前端场景实战指南
description: 前端开发实战案例，展示新页面开发、组件库重构、性能优化、Bug 修复、遗留项目接管、大型功能自主开发和 AI UI 设计改造等场景中工具链的深度集成
---

# 前端场景实战指南

本文提供 7 个完整的前端开发实战案例，每个案例包含从需求到上线的完整步骤、具体命令、代码示例和预期输出。案例覆盖前端开发中最常见的场景：新页面开发、组件库重构、性能优化、Bug 修复、遗留项目接管、大型功能自主开发和 AI 生成 UI 的设计改造。

:::info
本文是[前端工具链集成全景](./index)的实战补充。工作流阶段详解请参考[集成工作流详解](./integrated-workflow)。
:::

## 场景一：新页面全流程开发（电商商品详情页）

本场景演示从零开发一个电商商品详情页的完整流程。页面包含商品图片轮播、规格选择器、加购按钮、用户评价列表等核心功能。通过这个场景，你将看到 8 个工具如何在不同阶段协同工作，将一个模糊的"做一个商品详情页"需求转化为高质量的生产代码。

### 预计用时与工具分布

| 阶段     | 预计用时   | 主要工具                              | 产出物                      |
| -------- | ---------- | ------------------------------------- | --------------------------- |
| 分支创建 | 1 分钟     | Git                                   | feature/product-detail 分支 |
| 代码探索 | 10-15 分钟 | CodeGraph、Context7                   | 项目结构理解、框架文档      |
| 需求分析 | 15-20 分钟 | GStack                                | 需求清单、设计审查报告      |
| 规格定义 | 10-15 分钟 | OpenSpec                              | 结构化规格文档              |
| TDD 实现 | 2-3 小时   | Superpowers、CodeGraph、Context7、Git | 通过测试的组件代码          |
| 审查测试 | 15-20 分钟 | GStack、Serena                        | QA 报告、代码审查意见       |
| 发布     | 5 分钟     | GStack                                | PR + 合并                   |

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
>
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
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: ReviewSummary;
  stock: number;
  category: string;
  attributes: Record<string, string[]>;
}

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  image?: ProductImage;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
  helpful: number;
}

interface ReviewSummary {
  averageRating: number;
  totalCount: number;
  distribution: Record<number, number>;
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
  );
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
>
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

| 阶段 | 工具        | 作用                               |
| ---- | ----------- | ---------------------------------- |
| 探索 | CodeGraph   | 快速理解项目结构，避免重复造轮子   |
| 探索 | Context7    | 获取最新框架文档，避免使用过时 API |
| 规划 | GStack      | 需求探索和设计审查，确保做正确的事 |
| 规划 | OpenSpec    | 结构化规格文档，为实现提供明确目标 |
| 实现 | Superpowers | TDD 纪律，确保代码质量             |
| 实现 | CodeGraph   | 实时代码探索，理解现有组件结构     |
| 实现 | Context7    | 实时文档查询，确保 API 使用正确    |
| 实现 | Git         | 频繁提交，小粒度版本控制           |
| 审查 | GStack      | 浏览器 QA + 代码审查 + 安全审计    |
| 修复 | Serena      | 精确重构，修复审查发现的问题       |
| 发布 | GStack      | 自动化发布流程，创建 PR            |

## 场景二：组件库重构（语义驱动）

本场景演示如何将散落在各页面中的重复 UI 元素提取为统一的组件库。在长期迭代的项目中，不同开发者往往会在不同页面中实现外观和功能相似的卡片、弹窗、数据表格等组件。这些"拷贝-粘贴"出来的组件导致样式不一致、Bug 修复需要重复多次、新页面开发效率低下。通过这个场景，你将看到如何利用工具链完成一次系统性的组件统一。

### 预计用时与工具分布

| 阶段     | 预计用时   | 主要工具            | 产出物                         |
| -------- | ---------- | ------------------- | ------------------------------ |
| 分支创建 | 1 分钟     | Git                 | feature/component-library 分支 |
| 重复分析 | 15-20 分钟 | CodeGraph           | 重复 UI 模式清单               |
| 符号审计 | 10-15 分钟 | Serena              | 现有组件符号大纲               |
| 架构审查 | 10-15 分钟 | GStack              | 重构方案审查报告               |
| 规格定义 | 10-15 分钟 | OpenSpec            | 组件库规格文档                 |
| 精确重构 | 2-3 小时   | Serena、CodeGraph   | 统一后的组件代码               |
| 测试验证 | 1 小时     | Superpowers、GStack | 通过测试 + 回归验证            |
| 发布     | 5 分钟     | Git                 | PR + 合并                      |

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
>
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

| 阶段 | 工具        | 作用                                  |
| ---- | ----------- | ------------------------------------- |
| 分析 | CodeGraph   | 发现重复 UI 模式，按语义聚类          |
| 审计 | Serena      | 符号级组件清单，精确的引用关系        |
| 规划 | GStack      | 架构审查，评估抽象层级和迁移策略      |
| 规格 | OpenSpec    | 结构化组件规格，定义 Props 和验收标准 |
| 重构 | Serena      | 符号级重命名、移动、引用更新          |
| 验证 | CodeGraph   | 变更影响分析，确保不遗漏              |
| 测试 | Superpowers | TDD 保障组件质量                      |
| 回归 | GStack      | 浏览器级回归测试                      |

## 场景三：前端性能优化

本场景演示如何系统性地诊断和优化前端性能问题。当首页加载缓慢（LCP > 4s）时，盲目优化往往事倍功半。通过这个场景，你将看到如何利用工具链先定位瓶颈、再制定策略、最后逐项验证，将 LCP 从 4s+ 降到 2.5s 以下。

### 预计用时与工具分布

| 阶段     | 预计用时   | 主要工具                 | 产出物                       |
| -------- | ---------- | ------------------------ | ---------------------------- |
| 分支创建 | 1 分钟     | Git                      | feature/performance-opt 分支 |
| 性能基线 | 5-10 分钟  | GStack                   | Core Web Vitals 基线数据     |
| 瓶颈定位 | 15-20 分钟 | CodeGraph、Context7      | 渲染链分析 + 最佳实践        |
| 排查诊断 | 15-20 分钟 | Superpowers              | 性能瓶颈诊断报告             |
| 优化实现 | 2-3 小时   | Git、CodeGraph、Context7 | 优化后的代码                 |
| 验证     | 10-15 分钟 | GStack                   | 优化后性能数据               |
| 发布     | 5 分钟     | Git                      | PR + 性能对比报告            |

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
  const sorted = items.sort((a, b) => a.priority - b.priority); // 每次渲染都重新排序
  return sorted.map((item) => <Card key={item.id} {...item} />);
}

// 优化后
const FeatureCards = memo(function FeatureCards({ items }) {
  const sorted = useMemo(() => items.sort((a, b) => a.priority - b.priority), [items]);
  return sorted.map((item) => <Card key={item.id} {...item} />);
});
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

| Metric | Before | After | Target  | Status |
| ------ | ------ | ----- | ------- | ------ |
| LCP    | 4.2s   | 2.1s  | < 2.5s  | PASS   |
| FID    | 120ms  | 85ms  | < 100ms | PASS   |
| CLS    | 0.08   | 0.06  | < 0.1   | PASS   |
| Bundle | 1.2MB  | 420KB | < 500KB | PASS   |

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

| 阶段 | 工具        | 作用                             |
| ---- | ----------- | -------------------------------- |
| 基线 | GStack      | 量化的性能数据，明确优化目标     |
| 诊断 | CodeGraph   | 渲染链追踪，定位最大的依赖瓶颈   |
| 调研 | Context7    | 最新框架 API，确保优化方案正确   |
| 排查 | Superpowers | 系统化排除法，不遗漏任何瓶颈     |
| 实现 | Git         | 逐项优化、逐项提交，可追溯可回滚 |
| 验证 | GStack      | 量化对比，确保优化效果达标       |

## 场景四：系统化 Bug 修复（跨浏览器兼容性）

本场景演示如何系统性地修复一个跨浏览器兼容性 Bug。当用户报告"页面在 Safari 上样式错乱，Chrome 正常"时，盲目猜测原因往往浪费大量时间。通过这个场景，你将看到如何利用工具链先复现问题、再定位根因、最后用 TDD 确保修复可靠且不会回归。

### 预计用时与工具分布

| 阶段       | 预计用时   | 主要工具         | 产出物                     |
| ---------- | ---------- | ---------------- | -------------------------- |
| 分支创建   | 1 分钟     | Git              | fix/safari-layout-bug 分支 |
| 系统化调试 | 10-15 分钟 | Superpowers      | 排查诊断报告               |
| 复现验证   | 10-15 分钟 | GStack           | 多浏览器复现截图           |
| 根因定位   | 15-20 分钟 | CodeGraph        | 样式应用链分析             |
| TDD 修复   | 30-45 分钟 | Superpowers、Git | 通过测试的修复代码         |
| 预防措施   | 20-30 分钟 | GStack、Git      | 跨浏览器 E2E 测试          |
| 发布       | 5 分钟     | Git              | PR + 合并                  |

### Step 1：创建修复分支

```bash
git checkout main
git pull origin main
git checkout -b fix/safari-layout-bug
```

**为什么单独建分支：** 即使是一个"小 Bug"，也应该在独立分支上修复。这确保了修复过程中的实验性代码不会污染 main，也让后续的 PR 可以清晰地展示修复内容。

### Step 2：Superpowers 系统化调试

> /superpowers:systematic-debugging
> 页面在 Safari 上样式错乱，Chrome 正常

Superpowers 的系统化调试流程不会让你盲目猜测。它会按照"排除法"建立一个调试清单，逐项排查：

1. **确认问题范围**：是所有页面还是特定页面？是所有 Safari 版本还是特定版本？是桌面端还是移动端？
2. **检查已知兼容性问题**：Safari 对 CSS Flexbox gap、CSS Grid、`-webkit-` 前缀、`position: sticky` 等特性的支持差异
3. **检查 CSS 解析差异**：Safari 的 WebKit 引擎在某些 CSS 属性的解析上与 Chrome 的 Blink 引擎有差异
4. **检查 JavaScript API 差异**：某些 Web API 在 Safari 中可能不存在或行为不同

**预期输出：** 一份结构化的排查清单，按可能性从高到低排序，每个条目附带验证方法。

:::details Superpowers 系统化调试的底层原理

Superpowers 的调试流程基于"假设-验证"循环：

1. **建立假设列表**：根据症状描述，列出所有可能的原因
2. **优先级排序**：按照统计概率和验证成本排序
3. **逐一验证**：每个假设用最小成本的方式验证（读代码 > 加日志 > 设断点）
4. **收敛到根因**：排除所有不可能后，剩下的就是根因

这种方法避免了"我觉得可能是 XX"的猜测式调试，确保不遗漏任何可能性。
:::

### Step 3：GStack 多浏览器复现

> /qa https://localhost:5173/product/123
> 在 Safari 和 Chrome 中分别测试以下内容：
>
> - 页面整体布局是否正确
> - 导航栏、侧边栏、内容区的对齐方式
> - 卡片组件的间距和排列
> - 响应式断点切换时的布局变化

GStack 的 `/qa` 会在真实的 Playwright 浏览器中执行测试。虽然 Playwright 默认使用 Chromium，但你可以要求它在 WebKit 引擎模式下运行（Playwright 支持 Chromium、Firefox 和 WebKit 三种引擎）。

**预期输出：**

```text
浏览器兼容性测试报告 — /product/123
├── Chromium (Chrome 模拟)
│   ├── 布局: ✅ 正常
│   ├── 卡片间距: ✅ gap: 16px
│   └── 响应式: ✅ 断点切换正常
├── WebKit (Safari 模拟)
│   ├── 布局: ❌ 卡片堆叠，未按网格排列
│   ├── 卡片间距: ❌ gap 属性未生效
│   └── 响应式: ⚠️ 768px 断点时侧边栏未隐藏
└── 差异截图: [Safari vs Chrome 对比]
```

**关键发现：** WebKit 模式下 `gap` 属性在 Flexbox 容器中未生效，导致卡片之间没有间距并堆叠在一起。这是一个已知的 Safari 兼容性问题——Safari 14.1 之前不支持 Flexbox 的 `gap` 属性。

### Step 4：CodeGraph 样式链追踪

> 追踪卡片组件的样式应用链，找出 gap 属性的使用位置

Claude Code 会调用 CodeGraph 的 `codegraph_trace` 工具，从卡片容器组件出发，追踪所有相关的 CSS/样式定义。

**预期输出：**

```text
样式应用链分析:
├── ProductGrid.tsx
│   └── className="grid grid-cols-3 gap-4"  ← 使用 Tailwind gap-4
│       └── 编译为: display: grid; gap: 1rem;
│           └── ⚠️ Safari 14.1 以下不支持 gap 在 Flexbox 中
├── ProductCard.tsx
│   └── className="flex flex-col gap-2"  ← 内部也使用 gap
│       └── 编译为: display: flex; flex-direction: column; gap: 0.5rem;
└── 问题定位: ProductGrid 和 ProductCard 都依赖 CSS gap 属性
```

:::details Safari Flexbox gap 兼容性问题

Safari 14.1（2021 年 4 月发布）才开始支持 Flexbox 的 `gap` 属性。在此之前的 Safari 版本中：

- `grid` 布局的 `gap` 属性支持良好（Safari 12.1+）
- `flex` 布局的 `gap` 属性不支持（Safari < 14.1）

如果项目需要支持 Safari 14 或更早版本，需要使用 `margin` 作为 fallback。Tailwind CSS 提供了 `gap-x` 和 `gap-y` 工具类，但底层仍然使用 `gap` 属性。

兼容性写法：

```css
/* Fallback for Safari < 14.1 */
.product-grid > * + * {
  margin-left: 1rem;
}
/* Modern browsers */
.product-grid {
  display: grid;
  gap: 1rem;
}
```

:::

### Step 5：TDD 驱动修复

Superpowers 严格执行"先测试后代码"的 TDD 流程。在修复 Bug 之前，先编写一个能暴露问题的测试。

#### 5.1 编写失败的测试（RED）

```typescript title="src/components/ProductGrid.test.tsx"
import { render, screen } from '@testing-library/react'
import { ProductGrid } from './ProductGrid'

describe('ProductGrid — 跨浏览器兼容性', () => {
  const mockProducts = [
    { id: '1', name: '商品 A', price: 99 },
    { id: '2', name: '商品 B', price: 199 },
    { id: '3', name: '商品 C', price: 299 },
  ]

  it('卡片之间应有可见间距（兼容 Safari < 14.1）', () => {
    render(<ProductGrid products={mockProducts} />)
    const cards = screen.getAllByRole('article')
    const grid = cards[0].parentElement!

    // 即使 CSS gap 不生效，卡片之间也应有间距
    const styles = window.getComputedStyle(grid)
    const firstCardRect = cards[0].getBoundingClientRect()
    const secondCardRect = cards[1].getBoundingClientRect()

    // 验证两卡片之间有水平间距
    expect(secondCardRect.left - firstCardRect.right).toBeGreaterThan(0)
  })

  it('在窄屏下卡片应垂直堆叠', () => {
    // 模拟窄屏
    window.innerWidth = 375
    window.dispatchEvent(new Event('resize'))

    render(<ProductGrid products={mockProducts} />)
    const cards = screen.getAllByRole('article')

    // 窄屏下卡片应垂直排列
    const firstCardRect = cards[0].getBoundingClientRect()
    const secondCardRect = cards[1].getBoundingClientRect()

    expect(secondCardRect.top).toBeGreaterThan(firstCardRect.bottom)
  })
})
```

运行测试，预期第一个测试失败——因为当前实现完全依赖 `gap` 属性，在不支持的浏览器中间距为 0。

#### 5.2 实现修复（GREEN）

```tsx title="src/components/ProductGrid.tsx — 修复后"
import { type Product } from '@/types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div
      className="product-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      }}
    >
      {products.map((product, index) => (
        <div
          key={product.id}
          className="product-grid-item"
          style={{
            // Fallback: 使用 margin 保证 Safari < 14.1 的间距
            marginLeft: index % 3 !== 0 ? '1rem' : undefined,
            marginTop: index >= 3 ? '1rem' : undefined,
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
```

```css title="src/styles/product-grid.css — 现代浏览器增强"
/* 现代浏览器使用 gap，覆盖 margin fallback */
@supports (gap: 1rem) {
  .product-grid {
    gap: 1rem;
  }
  .product-grid-item {
    margin-left: 0 !important;
    margin-top: 0 !important;
  }
}
```

运行测试，预期全部通过。

#### 5.3 重构（REFACTOR）

在测试保护下重构：将兼容性逻辑提取为可复用的 Hook 或工具类。

```typescript title="src/hooks/use-flex-gap-fallback.ts"
import { useEffect, useState } from 'react';

/**
 * 检测浏览器是否支持 Flexbox/Grid 的 gap 属性
 * Safari < 14.1 不支持 Flexbox gap
 */
export function useGapSupported(): boolean {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const el = document.createElement('div');
    el.style.display = 'flex';
    el.style.gap = '1px';
    document.body.appendChild(el);
    const isSupported = el.offsetHeight === 1; // gap 生效时高度为 1px
    document.body.removeChild(el);
    setSupported(isSupported);
  }, []);

  return supported;
}
```

### Step 6：添加跨浏览器 E2E 测试

预防胜于治疗。为避免类似问题再次出现，添加跨浏览器 E2E 测试。

```typescript title="e2e/cross-browser-layout.spec.ts"
import { test, expect } from '@playwright/test';

// 在三种浏览器引擎中运行此测试
test.describe('跨浏览器布局兼容性', () => {
  test('商品卡片网格布局在所有浏览器中一致', async ({ page }) => {
    await page.goto('/product-list');

    const cards = page.getByRole('article');
    await expect(cards.first()).toBeVisible();

    // 验证卡片之间有间距
    const firstCard = await cards.first().boundingBox();
    const secondCard = await cards.nth(1).boundingBox();

    expect(secondCard!.x - (firstCard!.x + firstCard!.width)).toBeGreaterThan(0);
  });

  test('响应式断点切换在所有浏览器中一致', async ({ page }) => {
    await page.goto('/product-list');

    // 桌面端：卡片应水平排列
    await page.setViewportSize({ width: 1280, height: 720 });
    const desktopCards = page.getByRole('article');
    const firstDesktop = await desktopCards.first().boundingBox();
    const secondDesktop = await desktopCards.nth(1).boundingBox();
    expect(secondDesktop!.x).toBeGreaterThan(firstDesktop!.x + firstDesktop!.width);

    // 移动端：卡片应垂直堆叠
    await page.setViewportSize({ width: 375, height: 667 });
    const firstMobile = await desktopCards.first().boundingBox();
    const secondMobile = await desktopCards.nth(1).boundingBox();
    expect(secondMobile!.y).toBeGreaterThan(firstMobile!.y + firstMobile!.height);
  });
});
```

在 `playwright.config.ts` 中配置多浏览器引擎：

```typescript title="playwright.config.ts"
export default defineConfig({
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
  ],
});
```

### Step 7：Git 提交与 PR

```bash
# 失败的测试（RED）
git add src/components/ProductGrid.test.tsx
git commit -m "test(product): add cross-browser layout test that exposes Safari gap bug"

# 修复实现（GREEN）
git add src/components/ProductGrid.tsx src/styles/product-grid.css
git commit -m "fix(product): use margin fallback for Safari < 14.1 Flexbox gap"

# 重构（REFACTOR）
git add src/hooks/use-flex-gap-fallback.ts
git commit -m "refactor: extract useGapSupported hook for cross-browser detection"

# E2E 测试
git add e2e/cross-browser-layout.spec.ts playwright.config.ts
git commit -m "test: add cross-browser E2E tests for layout compatibility"

# 推送并创建 PR
git push origin fix/safari-layout-bug
gh pr create --title "fix: Safari Flexbox gap fallback for layout compatibility" --body "..."
```

### 场景四总结

通过这个场景，你可以看到系统化 Bug 修复的完整链路：

| 阶段 | 工具         | 作用                         |
| ---- | ------------ | ---------------------------- |
| 诊断 | Superpowers  | 系统化排查，避免盲目猜测     |
| 复现 | GStack       | 多浏览器复现，量化问题差异   |
| 定位 | CodeGraph    | 样式链追踪，精确定位问题属性 |
| 修复 | Superpowers  | TDD 流程，先写失败测试再修复 |
| 预防 | GStack + Git | 跨浏览器 E2E 测试，防止回归  |

## 场景五：遗留前端项目接管

本场景演示如何接管一个没有文档、没有测试的遗留 React 项目。面对一个陌生的代码库，最常见的错误是直接开始改代码——这往往会导致"改了 A 坏了 B"的连锁问题。通过这个场景，你将看到如何利用工具链先建立全局认知、再识别风险、最后渐进式重构，将一个"无人敢碰"的遗留项目转化为可维护的现代代码库。

### 预计用时与工具分布

| 阶段       | 预计用时   | 主要工具          | 产出物                  |
| ---------- | ---------- | ----------------- | ----------------------- |
| 代码探索   | 15-20 分钟 | CodeGraph、Serena | 项目架构全景图          |
| 业务梳理   | 20-30 分钟 | GStack            | 核心业务逻辑文档        |
| 代码审查   | 15-20 分钟 | ECC               | 代码质量 + 安全审计报告 |
| 规格定义   | 15-20 分钟 | OpenSpec          | 渐进式重构规格文档      |
| 渐进式重构 | 持续进行   | Superpowers、Git  | TDD 驱动的重构代码      |

### Step 1：CodeGraph 快速探索

> 这个项目的整体架构是什么？有哪些路由和核心模块？

接手遗留项目的第一步不是读代码，而是建立全局认知。Claude Code 会调用 CodeGraph 的 `codegraph_explore` 工具，从入口文件出发，自动遍历整个项目的依赖关系图。

**预期输出：**

```text
项目架构全景:
├── 入口: src/main.tsx → App.tsx
├── 路由层: react-router-dom v5 (⚠️ 旧版本)
│   ├── / → DashboardPage (核心页面)
│   ├── /users → UserManagement (用户管理)
│   ├── /products → ProductManagement (商品管理)
│   ├── /orders → OrderManagement (订单管理)
│   └── /settings → SettingsPage (系统设置)
├── 状态管理: Redux (⚠️ 非 Redux Toolkit)
│   ├── store/userSlice.ts
│   ├── store/productSlice.ts
│   └── store/orderSlice.ts
├── API 层: axios + 手写拦截器
│   ├── api/user.ts
│   ├── api/product.ts
│   └── api/order.ts
├── 组件: 无统一组件库，各页面自行实现
│   ├── pages/ (页面组件，平均 500+ 行)
│   └── components/ (零散组件，无目录规范)
└── 测试: ❌ 无任何测试文件
```

:::details CodeGraph 探索的价值

手动探索一个陌生项目通常需要 2-4 小时：翻目录、读 import、追踪调用链。CodeGraph 的 `codegraph_explore` 在 1-2 分钟内完成同样的工作，且不遗漏任何依赖关系。这对于遗留项目尤其重要——因为遗留代码往往有大量隐式依赖和"幽灵代码"（import 了但没使用的模块）。
:::

### Step 2：Serena 符号大纲

> 查看 src/ 下所有顶层模块的符号大纲

CodeGraph 给出了项目结构的"骨架"，Serena 的 `get_symbols_overview` 则给出每个文件的"器官清单"——所有导出的函数、类、接口和类型。

**预期输出：**

```text
src/ 符号大纲:
├── App.tsx
│   └── export function App()
├── pages/
│   ├── DashboardPage.tsx
│   │   ├── export function DashboardPage()
│   │   └── export default DashboardPage  (⚠️ 默认导出，无类型)
│   ├── UserManagement.tsx
│   │   ├── export function UserManagement()
│   │   ├── function UserTable()  (⚠️ 内联组件，未提取)
│   │   ├── function UserForm()  (⚠️ 内联组件，未提取)
│   │   └── function UserDetail()  (⚠️ 内联组件，未提取)
│   └── ...
├── store/
│   ├── userSlice.ts
│   │   ├── export const userSlice
│   │   ├── export const { addUser, deleteUser } = userSlice.actions
│   │   └── export default userSlice.reducer
│   └── ...
└── api/
    ├── user.ts
    │   ├── export function fetchUsers()
    │   ├── export function createUser()
    │   └── export function deleteUser()
    └── ...
```

**关键发现：**

- 多个页面组件内部定义了多个子组件（500+ 行的巨型文件），违反单一职责原则
- 全部使用默认导出（`export default`），不利于 Tree Shaking 和自动导入
- 没有自定义 Hooks，业务逻辑直接写在组件中
- Store 使用旧版 Redux（手写 action types、reducers、action creators），而非 Redux Toolkit

### Step 3：CodeGraph 依赖分析

> 这个项目的核心依赖关系是什么？哪些模块耦合最严重？

Claude Code 会调用 CodeGraph 的 `codegraph_impact` 工具，分析模块间的依赖关系和耦合程度。

**预期输出：**

```text
依赖关系分析:
├── 耦合度最高的模块 (fan-in > 10):
│   ├── api/request.ts → 被 23 个文件依赖（所有 API 调用的公共层）
│   ├── store/index.ts → 被 18 个文件依赖（全局 Store 配置）
│   └── utils/common.ts → 被 15 个文件依赖（混合了各种工具函数）
├── 循环依赖:
│   ├── UserManagement ↔ UserDetail (互相 import)
│   └── ProductManagement ↔ ProductForm (互相 import)
├── 孤立模块 (fan-in = 0):
│   ├── utils/legacy-helper.ts (⚠️ 可能是死代码)
│   └── components/OldModal.tsx (⚠️ 可能是死代码)
└── 风险评估:
    ├── 高风险: api/request.ts — 修改可能影响所有 API 调用
    ├── 中风险: store/index.ts — 修改可能影响所有页面状态
    └── 低风险: 各页面组件 — 相对独立，可逐个重构
```

:::details 循环依赖的危害

循环依赖（A import B，B 也 import A）是遗留项目的常见问题。它会导致：

1. **打包问题**：Webpack/Rollup 可能产生未定义的模块引用
2. **测试困难**：无法单独测试任何一个模块（mock 一个就需要 mock 另一个）
3. **重构阻塞**：修改一个模块必然影响另一个模块，无法独立演进

解决循环依赖的常见策略：

- 提取公共依赖到第三个模块
- 使用依赖注入打破直接引用
- 重新划分模块边界
  :::

### Step 4：GStack 产品发现

> /office-hours
> 帮我梳理这个遗留项目的核心业务逻辑和用户流程

GStack 的 `/office-hours` 会以产品经理的视角，通过 6 个核心问题帮你理解项目的业务价值：

1. **目标用户是谁？** — 系统管理员？普通用户？运营人员？
2. **核心任务是什么？** — 用户管理、商品上架、订单处理
3. **成功指标是什么？** — 订单处理效率、用户留存率
4. **有什么约束？** — 不能停服迁移、需要向后兼容
5. **有什么风险？** — 核心业务逻辑可能隐藏在代码中而不在文档中
6. **优先级是什么？** — 哪些模块最常修改？哪些最影响用户体验？

**预期输出：** 一份核心业务逻辑文档，包含：

- 用户流程图（从登录到完成核心操作的完整路径）
- 核心业务规则（如订单状态流转、库存扣减逻辑）
- 数据模型关系（用户-商品-订单的关联关系）
- 高频修改区域（需要优先重构的部分）

### Step 5：ECC 代码审查

> 使用 typescript-reviewer 审查核心模块，识别代码问题

ECC（Engineering Code Companion）的 `typescript-reviewer` 会以 Staff Engineer 的视角审查代码质量。

**预期输出：**

```text
代码审查报告 — 核心模块
├── DashboardPage.tsx (523 行)
│   ├── ⚠️ 巨型组件: 应拆分为 3-4 个子组件
│   ├── ⚠️ 无类型: Props 使用 any，缺少类型约束
│   ├── ❌ 内存泄漏: useEffect 中未清理 WebSocket 监听器
│   └── ❌ 性能: 列表渲染无 key，每次渲染重建 DOM
├── UserManagement.tsx (687 行)
│   ├── ⚠️ 巨型组件: 内联了 Table、Form、Detail 三个子组件
│   ├── ❌ 副作用: 业务逻辑直接写在事件处理器中
│   ├── ❌ 错误处理: API 调用无 try-catch，失败时无用户反馈
│   └── ⚠️ 硬编码: API URL 硬编码在组件中
├── store/userSlice.ts
│   ├── ⚠️ 旧版 Redux: 应迁移到 Redux Toolkit
│   ├── ⚠️ 无 Immer: 手动展开运算符更新状态，易出错
│   └── ❌ 副作用: 异步操作在 reducer 中执行（应使用 thunk/saga）
└── api/request.ts
    ├── ⚠️ 无重试: 网络失败无自动重试机制
    ├── ⚠️ 无超时: 请求无超时配置
    └── ❌ Token 管理: Token 存储在 localStorage（XSS 风险）
```

### Step 6：ECC 安全扫描

> 使用 security-reviewer 检查 XSS、CSRF 等安全风险

ECC 的 `security-reviewer` 会进行 OWASP Top 10 安全审计。

**预期输出：**

```text
安全审计报告
├── XSS 风险 (高)
│   ├── UserManagement.tsx:45 — dangerouslySetInnerHTML 渲染用户输入
│   ├── DashboardPage.tsx:120 — eval() 解析 API 返回的配置
│   └── ProductManagement.tsx:78 — 未转义的 URL 拼接
├── CSRF 风险 (中)
│   ├── 所有 POST/PUT/DELETE 请求无 CSRF Token
│   └── Cookie 未设置 SameSite 属性
├── 数据暴露 (中)
│   ├── API 响应包含密码哈希字段
│   └── 错误信息暴露服务器路径
├── 认证缺陷 (高)
│   ├── Token 存储在 localStorage（可被 XSS 读取）
│   ├── Token 无过期机制
│   └── 无刷新 Token 流程
└── 依赖漏洞 (低)
    ├── react-router-dom@5.2.0 — 已知路由注入漏洞
    └── axios@0.21.1 — 已知 SSRF 漏洞
```

:::details 遗留项目安全问题的优先级处理

遗留项目的安全问题往往很多，不可能一次性全部修复。推荐的优先级：

1. **立即修复**：XSS（`dangerouslySetInnerHTML`、`eval`）、认证缺陷（Token 管理）
2. **尽快修复**：CSRF 防护、敏感数据暴露
3. **计划修复**：依赖漏洞升级、安全头部配置
4. **持续改进**：安全测试自动化、安全代码审查流程

不要试图在重构的同时修复所有安全问题。先修复高危漏洞，再在重构过程中逐步改善。
:::

### Step 7：OpenSpec 创建重构规格

> /opsx:propose legacy-refactor
> 基于代码现状创建渐进式重构规格

OpenSpec 会根据前面的探索和审查结果，生成一份渐进式的重构规格文档。

:::details 渐进式重构规格示例

```yaml
spec:
  name: legacy-refactor
  description: 遗留 React 项目渐进式重构
  phases:
    - id: PHASE-01
      name: 安全加固
      priority: P0
      requirements:
        - id: SEC-001
          title: 消除 XSS 风险
          description: 移除 dangerouslySetInnerHTML 和 eval
          acceptance:
            - 所有用户输入使用 React 的自动转义或 DOMPurify
            - 移除所有 eval() 调用
        - id: SEC-002
          title: 改善 Token 管理
          description: 将 Token 从 localStorage 迁移到 HttpOnly Cookie
          acceptance:
            - Token 不可通过 JavaScript 读取
            - 实现自动刷新 Token 机制

    - id: PHASE-02
      name: 基础设施升级
      priority: P1
      requirements:
        - id: INFRA-001
          title: 升级 react-router 到 v6
          description: 从 react-router-dom v5 迁移到 v6
          migration:
            - Switch → Routes
            - useHistory → useNavigate
            - component → element
        - id: INFRA-002
          title: 迁移到 Redux Toolkit
          description: 将手写 Redux 迁移到 Redux Toolkit
          migration:
            - createSlice 替代手写 reducer + actions
            - createAsyncThunk 替代手写 thunk

    - id: PHASE-03
      name: 组件重构
      priority: P2
      requirements:
        - id: COMP-001
          title: 拆分巨型组件
          description: 将 500+ 行的页面组件拆分为多个子组件
          acceptance:
            - 单个组件不超过 200 行
            - 业务逻辑提取到自定义 Hooks
        - id: COMP-002
          title: 建立组件库
          description: 提取通用 UI 组件

    - id: PHASE-04
      name: 测试覆盖
      priority: P2
      requirements:
        - id: TEST-001
          title: 核心业务逻辑测试
          description: 为订单状态流转、库存扣减等核心逻辑添加单元测试
          acceptance:
            - 核心业务逻辑测试覆盖率 > 80%
            - 关键用户流程有 E2E 测试
```

每个 Phase 独立可交付，上一个 Phase 的完成不影响下一个 Phase 的启动。
:::

### Step 8：Superpowers 渐进式重构

按照 TDD 流程逐模块重构。每个重构步骤都遵循 RED-GREEN-REFACTOR 循环。

#### 8.1 安全加固（Phase 1）

```text
> 使用 Superpowers TDD 修复 XSS 风险

🔴 RED — 编写测试:
  - 输入 <script>alert('xss')</script> 应被转义而非执行
  - 输入包含 HTML 标签的用户名称应正确显示为文本

🟢 GREEN — 实现修复:
  - 移除 dangerouslySetInnerHTML，使用 React 自动转义
  - 引入 DOMPurify 处理必须渲染 HTML 的场景
  - 移除 eval()，改用 JSON.parse()

🔵 REFACTOR — 提取安全工具:
  - 创建 sanitizeHtml() 工具函数
  - 创建 safeRender() 高阶组件
```

#### 8.2 基础设施升级（Phase 2）

```text
> 使用 Superpowers TDD 升级 react-router

🔴 RED — 编写路由测试:
  - 所有现有路由应正确匹配
  - 页面导航应正常工作
  - 404 页面应正确显示

🟢 GREEN — 逐步迁移:
  - v5 的 <Switch> → v6 的 <Routes>
  - v5 的 <Route component={X}> → v6 的 <Route element={<X/>}>
  - v5 的 useHistory → v6 的 useNavigate
  - v5 的 useParams 保持不变（API 兼容）

🔵 REFACTOR — 清理:
  - 移除 v5 的兼容层代码
  - 使用 v6 的新特性（嵌套路由、相对路径）
```

#### 8.3 组件重构（Phase 3）

```text
> 使用 Superpowers TDD 拆分 UserManagement

🔴 RED — 为子组件编写测试:
  - UserTable: 渲染用户列表、排序、分页
  - UserForm: 表单验证、提交、错误处理
  - UserDetail: 展示用户详情、编辑、删除

🟢 GREEN — 提取子组件:
  - 从 UserManagement.tsx 中提取 UserTable、UserForm、UserDetail
  - 提取 useUsers() 自定义 Hook 管理用户状态
  - 提取 useUserForm() 自定义 Hook 管理表单逻辑

🔵 REFACTOR — 优化:
  - 统一组件命名和导出方式
  - 添加 Props 类型定义
  - 优化 re-render（React.memo、useCallback）
```

### Step 9：Git 分支策略

遗留项目的重构不应该在一个巨大的分支上完成。推荐的分支策略是每个 Phase 一个分支，逐步合并。

```bash
# Phase 1: 安全加固
git checkout main
git checkout -b refactor/phase-1-security
# ... 完成安全修复 ...
git push origin refactor/phase-1-security
gh pr create --title "refactor(phase-1): security hardening — XSS and auth fixes"

# Phase 2: 基础设施升级（等 Phase 1 合并后）
git checkout main
git pull origin main
git checkout -b refactor/phase-2-infrastructure
# ... 完成 router 和 Redux 升级 ...
git push origin refactor/phase-2-infrastructure
gh pr create --title "refactor(phase-2): upgrade react-router v6 and Redux Toolkit"

# Phase 3: 组件重构（等 Phase 2 合并后）
git checkout main
git pull origin main
git checkout -b refactor/phase-3-components
# ... 完成组件拆分和测试 ...
git push origin refactor/phase-3-components
gh pr create --title "refactor(phase-3): split mega-components and add test coverage"
```

:::details 为什么不能在一个分支上完成所有重构

遗留项目重构的最大风险是"分支存活时间过长"：

1. **合并冲突**：如果重构分支存活数周，main 上的新提交会产生大量合并冲突
2. **审查困难**：一个包含 50 个文件变更的 PR 很难被有效审查
3. **回滚代价高**：如果某个重构引入了问题，需要回滚整个分支
4. **团队信心**：小步快跑的渐进式合并让团队对重构有信心

每个 Phase 独立分支、独立 PR、独立合并，确保重构过程中项目始终处于可部署状态。
:::

### 场景五总结

通过这个场景，你可以看到遗留项目接管的系统化方法：

| 阶段 | 工具        | 作用                         |
| ---- | ----------- | ---------------------------- |
| 探索 | CodeGraph   | 快速建立全局架构认知         |
| 探索 | Serena      | 符号级模块清单，发现代码问题 |
| 分析 | CodeGraph   | 依赖关系和耦合度分析         |
| 理解 | GStack      | 业务逻辑梳理，理解项目价值   |
| 审查 | ECC         | 代码质量和安全审计           |
| 规划 | OpenSpec    | 渐进式重构规格，分阶段交付   |
| 实施 | Superpowers | TDD 驱动重构，每步有测试保护 |
| 管理 | Git         | 分支策略，小步快跑逐步合并   |

## 场景六：大型功能自主开发（Ralph 自动化）

本场景演示如何利用 Ralph 实现大型功能的自主开发。当面对一个包含 15 个用户故事的订单管理后台时，手动逐个实现不仅耗时，还容易在上下文切换中丢失一致性。通过这个场景，你将看到如何将需求从模糊描述转化为结构化 PRD，再由 Ralph 自主循环完成全部实现——开发者只需在关键节点审查和调整。

### 预计用时与工具分布

| 阶段         | 预计用时   | 主要工具       | 产出物                 |
| ------------ | ---------- | -------------- | ---------------------- |
| 需求探索     | 15-20 分钟 | GStack         | 需求清单与用户故事     |
| 规格定义     | 10-15 分钟 | OpenSpec       | 结构化规格文档         |
| PRD 生成     | 10-15 分钟 | Ralph          | 产品需求文档           |
| PRD 转换     | 5 分钟     | Ralph          | prd.json 结构化数据    |
| 自主开发循环 | 3-8 小时   | Ralph + Claude | 通过测试的完整功能代码 |
| 审查与发布   | 20-30 分钟 | GStack         | QA 报告 + PR           |

### Step 1：GStack 需求探索

> /office-hours
> 设计一个订单管理后台，包含列表、详情、筛选、导出、批量操作

GStack 的 `/office-hours` 会以产品经理的视角，帮你从一个粗略的功能描述中挖掘出完整的用户故事。对于"订单管理后台"这样的大型功能，这一步尤其关键——它决定了后续 15 个用户故事的粒度和覆盖范围。

**预期输出：** 一份包含 15 个用户故事的需求清单，例如：

- US-001：查看订单列表（支持分页、排序）
- US-002：按状态筛选订单（待付款、已付款、已发货、已完成、已取消）
- US-003：按时间范围筛选订单
- US-004：查看订单详情（商品信息、物流信息、支付信息）
- US-005：导出订单为 CSV/Excel
- US-006：批量修改订单状态
- US-007：批量删除订单（软删除）
- ... 等等

### Step 2：OpenSpec 规格定义

> /opsx:propose order-management
> 创建订单管理模块的完整规格文档

OpenSpec 会将 GStack 的需求探索结果转化为结构化的规格文档。每个用户故事对应一个 REQ 条目，包含功能描述、接口定义和验收标准。

**产出物：** 一份 YAML 格式的规格文档，提交到 Git 仓库的 `specs/order-management/` 目录下，作为后续 PRD 生成的输入。

### Step 3：Ralph PRD 生成

> /prd
> 将 OpenSpec 的规格转换为 PRD

Ralph 的 `/prd` 命令会读取 OpenSpec 的规格文档，将其转化为一份完整的产品需求文档（PRD）。PRD 包含业务背景、用户故事、验收标准、技术约束和优先级排序——它是 Ralph 自主循环的直接输入。

**预期输出：** 一份结构化的 PRD 文档，按功能模块组织，每个用户故事都有明确的"完成"定义。

### Step 4：Ralph 转换为结构化数据

> /ralph
> 将 PRD 转换为 prd.json

Ralph 的 `/ralph` 命令将 PRD 文档解析为 `prd.json`——一个机器可读的 JSON 文件，包含所有用户故事、验收标准和依赖关系。这是 Ralph 自主循环的"任务清单"。

**预期输出：**

```json
{
  "project": "order-management",
  "stories": [
    {
      "id": "US-001",
      "title": "查看订单列表",
      "description": "支持分页、排序的订单列表页面",
      "acceptance": [
        "订单列表默认按创建时间倒序排列",
        "支持每页 10/20/50 条切换",
        "列表展示订单号、客户名、金额、状态、创建时间"
      ],
      "dependencies": [],
      "status": "pending"
    },
    "... 更多用户故事"
  ]
}
```

### Step 5：Ralph 自主循环

```bash
./scripts/ralph/ralph.sh --tool claude
```

启动 Ralph 自主循环。Ralph 会从 `prd.json` 中读取所有待完成的用户故事，按依赖顺序逐个实现。每个用户故事的实现遵循以下流程：

1. **读取任务**：从 `prd.json` 中取出下一个 `pending` 状态的用户故事
2. **实现代码**：在一个全新的上下文窗口中编写实现代码和测试
3. **运行测试**：验证测试通过
4. **提交代码**：使用 Conventional Commits 格式提交
5. **更新进度**：将用户故事标记为 `done`，写入 `progress.txt`
6. **循环**：回到步骤 1，直到所有用户故事完成

### Step 6：循环过程详解

Ralph 自主循环的核心设计理念是**每个用户故事使用全新的上下文窗口**。这意味着：

- **不会累积上下文噪声**：每个用户故事的实现都在干净的环境中开始，不受前一个故事的代码记忆干扰
- **通过 Git 历史积累知识**：前一个故事的代码变更已经提交到 Git，新的上下文窗口可以通过 `git log` 和文件读取获取历史信息
- **通过 `progress.txt` 追踪进度**：Ralph 维护一个 `progress.txt` 文件，记录每个用户故事的完成状态、关键决策和遇到的问题。新的上下文窗口读取这个文件就能了解项目进度
- **失败可恢复**：如果某个用户故事实现失败（测试不通过、超时等），Ralph 会将其标记为 `failed` 并跳过，继续处理下一个故事。开发者可以后续手动修复失败的故事

**预期 `progress.txt` 示例：**

```text
# Order Management — Progress
## Completed
- [x] US-001: 订单列表页面 — 已完成，3 个测试通过
- [x] US-002: 状态筛选 — 已完成，使用 URL query params 同步筛选状态
- [x] US-003: 时间范围筛选 — 已完成，使用 dayjs 处理日期
- [x] US-004: 订单详情页 — 已完成，包含商品、物流、支付三个 Tab

## In Progress
- [ ] US-005: 导出功能 — 进行中...

## Pending
- [ ] US-006 ~ US-0015: 待处理

## Decisions
- 选择 Zustand 而非 Redux Toolkit 作为状态管理方案（更轻量）
- 导出功能使用 SheetJS (xlsx) 库
- 批量操作通过 checkbox 多选 + 操作栏实现
```

### Step 7：完成后审查

Ralph 完成所有用户故事后，开发者回到手动流程进行最终审查：

> /review

GStack 的 `/review` 审查整个分支的代码变更，检查代码质量、类型安全和架构一致性。由于 Ralph 的每个用户故事都是在独立上下文中实现的，审查重点应放在跨故事的一致性上——例如 API 调用方式是否统一、组件命名是否一致、错误处理模式是否相同。

> /qa https://localhost:5173/admin/orders

GStack 的 `/qa` 在真实浏览器中测试完整的订单管理后台，覆盖所有 15 个用户故事的验收标准。

> /ship

GStack 的 `/ship` 创建 PR，附带完整的变更摘要和测试结果。

:::tip Ralph 最佳实践：用户故事粒度
每个用户故事应该足够小，能在**一个上下文窗口**内完成。如果一个用户故事的实现需要超过 15 分钟的 AI 交互时间，说明它应该被拆分为更小的故事。过大的用户故事会导致：

- 上下文窗口溢出，AI 丢失早期的代码决策
- 测试失败时难以定位是哪个子功能出了问题
- `progress.txt` 的粒度太粗，无法有效追踪进度

一个好的经验法则：如果用户故事的验收标准超过 5 条，就应该考虑拆分。
:::

### 场景六总结

通过这个场景，你可以看到 Ralph 自动化开发的完整链路：

| 阶段 | 工具           | 作用                            |
| ---- | -------------- | ------------------------------- |
| 探索 | GStack         | 从模糊需求中挖掘完整的用户故事  |
| 规格 | OpenSpec       | 结构化规格文档，为 PRD 提供输入 |
| 转换 | Ralph          | PRD 生成和 prd.json 转换        |
| 实现 | Ralph + Claude | 自主循环，逐个用户故事实现      |
| 审查 | GStack         | 最终 QA 和代码审查              |
| 发布 | GStack         | 自动化发布流程                  |

## 七大场景对比总结

| 场景             | 核心工具组合                                      | 适用情况          | 预计时间  |
| ---------------- | ------------------------------------------------- | ----------------- | --------- |
| 新页面开发       | GStack + OpenSpec + Superpowers + CodeGraph       | 从零构建新功能    | 2-4 小时  |
| 组件库重构       | CodeGraph + Serena + GStack + Superpowers         | 提取/重组现有组件 | 1-3 天    |
| 性能优化         | GStack + CodeGraph + Superpowers                  | 页面加载慢        | 2-4 小时  |
| Bug 修复         | Superpowers + CodeGraph + GStack                  | 跨浏览器/交互问题 | 1-2 小时  |
| 遗留项目接管     | CodeGraph + Serena + ECC + OpenSpec + Superpowers | 接手无文档项目    | 1-2 天    |
| 大型功能自主开发 | GStack + OpenSpec + Ralph                         | 批量任务自动化    | 半天-2 天 |
| UI 设计改造      | Taste Skill + GStack + CodeGraph                  | AI 生成 UI 改造   | 1-2 小时  |

## 场景七：用 Taste Skill 改造 AI 生成的平庸 UI

本场景演示如何使用 Taste Skill 的 `redesign-existing-projects` 技能，将一个典型的"AI 味"页面改造为具有专业设计品质的界面。页面是一个 AI 生成的 SaaS 落地页，具有典型的平庸设计特征：居中 Hero + 渐变背景、Inter 默认字体、饱和度爆表的紫色强调色、em-dash 泛滥、区块布局高度重复。

### 预计用时与工具分布

| 阶段       | 预计用时   | 主要工具                     | 产出物                     |
| ---------- | ---------- | ---------------------------- | -------------------------- |
| 设计审计   | 10-15 分钟 | Taste Skill                  | UI 审计报告、改造优先级    |
| 排版刷新   | 10-15 分钟 | Taste Skill                  | 字体系统、排版层级更新     |
| 色彩校准   | 10-15 分钟 | Taste Skill                  | 配色方案、强调色调整       |
| 布局重构   | 20-30 分钟 | Taste Skill、CodeGraph       | Hero 重构、区块多样性      |
| 动效层     | 15-20 分钟 | Taste Skill                  | Motion/GSAP 动画集成       |
| Pre-Flight | 5-10 分钟  | Taste Skill                  | 检查清单全绿               |
| 审查发布   | 15-20 分钟 | GStack、CodeGraph            | QA 报告 + PR               |

### Step 1：安装改造技能并执行设计审计

> 安装 redesign-existing-projects 技能，然后审计当前首页的设计问题

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "redesign-existing-projects"
```

```
> 审查 src/pages/LandingPage.tsx 的设计质量：
> 1. 识别所有 AI 平庸设计特征（Forbidden Patterns）
> 2. 记录品牌 Token（色彩、字体、圆角、间距）
> 3. 评估信息架构和内容块布局
> 4. 建立 SEO 基线
> 5. 按优先级排列改造杠杆
```

**预期审计输出：**

| 问题类别     | 具体问题                                  | 严重程度 | 改造杠杆     |
| ------------ | ----------------------------------------- | -------- | ------------ |
| 排版         | 全局使用 Inter，无字重层级                | 高       | 排版刷新     |
| 色彩         | 强调色饱和度 95%，紫色渐变背景            | 高       | 色彩校准     |
| 布局         | 8 个区块中 6 个使用居中对称布局           | 高       | 布局重构     |
| Hero         | 标题 3 行 + 5 个文本元素 + 向下滚动箭头   | 高       | Hero 重构    |
| 内容         | em-dash 泛滥（12 处）、完美数字           | 中       | 内容清洗     |
| 动效         | 无动画或仅 CSS hover                      | 中       | 动效层       |
| 圆角         | 混用 3 套圆角值（4px、8px、12px）         | 低       | Token 统一   |

### Step 2：排版刷新（第一优先级）

> 根据审计结果，首先刷新排版系统

```
> 根据审计结果，更新排版系统：
> - 替换 Inter 为更合适的字体组合
> - 建立清晰的字重层级（标题/正文/辅助文本）
> - 确保行高和字间距符合可读性标准
```

**改造前后对比：**

| 属性     | 改造前（AI 默认）               | 改造后（Taste Skill）              |
| -------- | ------------------------------- | ---------------------------------- |
| 标题字体 | Inter Bold                      | 协调的 serif + sans 组合           |
| 正文字体 | Inter Regular                   | 匹配标题体系的正文字体             |
| 字重层级 | 3 级（Regular/Semibold/Bold）   | 5 级明确层级                       |
| 行高     | 统一 1.5                        | 标题 1.1-1.3 / 正文 1.5-1.7       |

### Step 3：色彩校准

> 调整配色方案，消除 AI 味

```
> 根据 Taste Skill 规则重新校准配色：
> - 强调色饱和度从 95% 降至 65% 以下
> - 消除紫色渐变背景，替换为克制的中性背景
> - 确保 CTA 按钮通过 WCAG AA 对比度（4.5:1）
> - 暗色模式不使用纯黑 #000000
```

### Step 4：布局重构与 Hero 改造

> 重构 Hero 区块和整体页面布局

```
> 重构页面布局：
> - Hero：标题压缩至 2 行以内，副标题 20 词以内，文本元素不超过 4 个
> - 移除向下滚动提示箭头
> - 8 个区块使用至少 4 种不同的布局族（不再全是居中对称）
> - 统一圆角系统为一套值
```

:::details 布局族参考

以下是可以混用的布局族，每个区块应选择不同的族：

| 布局族           | 特征                               |
| ---------------- | ---------------------------------- |
| 居中对称         | 文本和元素水平居中                 |
| 左对齐 + 右图    | 文本左对齐，右侧配图               |
| 交错网格         | 奇偶行左右交替                     |
| 多列卡片         | 2-4 列等宽卡片网格                 |
| 全宽 Feature     | 单个功能横跨全宽，图文并排         |
| 数据/指标展示    | 大数字 + 简短说明的统计条          |
| 引用/证言        | 大号引号 + 客户头衔                |
:::

### Step 5：添加动效层

> 为关键交互添加动画

```
> 使用 Motion library 为页面添加动效：
> - Hero 区域：标题和副标题渐入 + 轻微上移（0.6s ease-out）
> - 功能卡片：滚动进入视口时交错淡入（stagger 100ms）
> - CTA 按钮：hover 时微妙的 scale + 阴影变化
> - 不要使用 window.addEventListener("scroll")，使用 Motion 的 useInView
```

### Step 6：Pre-Flight Check

> 运行 Taste Skill 的 Pre-Flight Check 确认所有规则通过

```
> 执行 Pre-Flight Check，逐项确认：
> - [x] Hero 首屏完整显示
> - [x] Hero 标题 ≤ 2 行，副标题 ≤ 20 词
> - [x] Hero 文本元素 ≤ 4 个
> - [x] 8 个区块 ≥ 4 种布局族
> - [x] 单一强调色，饱和度 < 80%
> - [x] 单一圆角系统
> - [x] CTA 按钮 WCAG AA 对比度通过
> - [x] 零 em-dash
> - [x] 无纯黑/纯白背景
> - [x] 无霓虹发光
> - [x] 无通用占位名称
> - [x] 无"向下滚动"提示
```

:::tip
如果任何一项无法通过，回到对应步骤修复后再继续。Pre-Flight Check 是强制性的——不存在"差不多就行"的选项。
:::

### Step 7：提交和审查

> 使用 GStack 审查改造结果，提交 PR

```
> /review
> 审查 LandingPage.tsx 的改造结果，重点关注：
> 1. 设计规则合规性（Pre-Flight Check 结果）
> 2. 响应式适配是否完整
> 3. 动画性能是否可接受（无 layout thrashing）
> 4. 无障碍合规性
```

**改造效果总结：**

| 维度       | 改造前 | 改造后                            |
| ---------- | ------ | --------------------------------- |
| AI 味指数  | 高     | 低                                |
| 排版层级   | 模糊   | 清晰 5 级                        |
| 布局多样性 | 1 种   | 5 种                             |
| 色彩克制度 | 低     | 高（饱和度 < 70%）               |
| 动效       | 无     | 滚动渐入 + hover 微交互          |
| 无障碍     | 部分   | WCAG AA 全通过                   |
