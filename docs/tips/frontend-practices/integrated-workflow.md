---
title: 前端集成工作流详解
description: 从代码探索到发布的五阶段前端开发工作流，深度集成 CodeGraph、Serena、GStack、Superpowers、OpenSpec、Ralph、Context7 和 Git
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★☆  | ★★★☆☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握前端集成工作流，能独立完成从探索到发布的五阶段全流程开发

**🚀 AI 能力提升：** 自动化工作流
:::

# 前端集成工作流详解

本文档将前端开发拆解为**探索分析、规划规格、TDD 实现、审查测试、发布自动化**五个阶段，完整展示如何将 CodeGraph、Serena、GStack、Superpowers、OpenSpec、Ralph、Context7 和 Git 这 8 个核心工具串联成一条端到端的开发工作流。每个阶段都有明确的输入产出和对应的主力工具，前后阶段通过结构化产物（依赖图、符号信息、规格文档、测试报告）无缝衔接。

:::info
本文是 [前端工具链集成全景](/tips/frontend-practices/) 的子页面。建议先阅读全景概览了解工具矩阵和五阶段划分，再按需深入各阶段的具体操作。
:::

## Phase 1: 探索分析（CodeGraph + Serena + Context7）

在动手写代码之前，花 10–15 分钟理解现有代码结构，可以避免后期大量的返工。这个阶段的目标是回答三个关键问题：

1. **代码是怎么组织的？** —— 路由结构、目录分层、模块边界
2. **改一个地方会影响什么？** —— 依赖关系、引用链、影响范围
3. **最新的框架 API 怎么用？** —— 避免使用已废弃的写法，采纳最新最佳实践

下面分别用 CodeGraph、Serena、Context7 来回答这三个问题。

### CodeGraph 前端探索

CodeGraph 会自动扫描项目，构建路由、组件、状态管理之间的依赖图谱。安装和初始化：

```bash
npm i -g @colbymchenry/codegraph
codegraph install
codegraph init -i
```

初始化完成后，CodeGraph 会索引项目中的路由定义、组件引用、Store 依赖等关系。以下是三个核心操作。

#### 操作 1: 路由结构探索

了解项目的页面组织和嵌套路由关系，是接手任何前端项目的第一步。

```
> 这个前端项目的路由结构是什么？有哪些页面和嵌套路由？
```

CodeGraph 会解析路由配置文件，输出完整的路由树。不同框架的路由识别方式如下：

| 框架                 | 路由定义位置                                   | 嵌套路由识别                                 |
| -------------------- | ---------------------------------------------- | -------------------------------------------- |
| React Router         | `src/routes.tsx` 或 `createBrowserRouter` 配置 | `children` 数组内的嵌套路径                  |
| Next.js (App Router) | `app/` 目录结构                                | `page.tsx` + `layout.tsx` 的目录层级         |
| Vue Router           | `src/router/index.ts`                          | `children` 字段或文件系统路由                |
| SvelteKit            | `src/routes/` 目录                             | `+page.svelte` / `+layout.svelte` 的目录层级 |

输出示例（以 React Router 为例）：

```
路由结构:
├── /                    → HomePage
├── /login               → LoginPage
├── /dashboard           → DashboardLayout (嵌套)
│   ├── /dashboard       → DashboardPage (index)
│   ├── /dashboard/orders → OrdersPage
│   └── /dashboard/settings → SettingsPage
├── /products            → ProductListPage
└── /products/:id        → ProductDetailPage
```

#### 操作 2: 组件依赖分析

在修改任何模块之前，先了解它的影响范围。这对于修改全局状态 Store 尤为重要。

```
> 如果我修改 src/stores/authStore.ts，会影响哪些页面和组件？
```

CodeGraph 会从 `authStore.ts` 出发，沿引用链向上追踪，列出所有直接和间接依赖该 Store 的文件。输出通常包含：

- 直接使用 `useAuth` 的组件列表
- 通过这些组件间接依赖的页面
- 受影响的路由路径

这个信息直接决定了你需要在哪些页面上手动验证修改，也为后续 GStack 的回归测试范围提供了依据。

#### 操作 3: 调用链追踪

当你需要理解一个完整业务流程（如登录、下单）的数据流时，调用链追踪可以帮你梳理从 UI 到 API 的完整路径。

```
> 追踪从登录页面到 API 层的完整数据流
```

CodeGraph 会输出类似以下的调用链：

```
LoginPage
  └─ handleSubmit()
       └─ authStore.login(credentials)
            └─ authService.login()
                 └─ apiClient.post('/auth/login')
                      └─ axios/fetch → 后端 API
                 └─ token 存储 → localStorage
            └─ authStore.setUser(user)
       └─ router.navigate('/dashboard')
```

这条链路清晰展示了数据从表单提交到 API 调用再到状态更新的完整流程，帮你快速定位需要修改的节点。

### Serena 符号分析

CodeGraph 做的是宏观的依赖图谱分析，Serena 则深入到语言层面，提供符号级的精确分析——函数定义、类型引用、Hook 使用链等。安装：

```bash
uv tool install -p 3.13 serena-agent
serena init
claude mcp add --scope user serena -- serena
```

推荐在 `.serena/config.yaml` 中做如下配置，将 Serena 定位为纯符号分析工具，避免与 Claude Code 的文件读写和命令执行功能重叠：

```yaml
# .serena/config.yaml
backend: lsp
disabled_tools:
  - read_file # Claude Code 自带文件读取
  - list_dir # Claude Code 自带目录浏览
  - execute_shell # Claude Code 自带命令执行
```

这样 Serena 只专注于它擅长的符号分析，不干扰 Claude Code 的常规工作流。

#### 操作 1: 组件符号大纲

查看一个复杂组件的完整符号结构，快速了解它导出了什么、内部有哪些函数和子组件。

```
> 查看 src/features/dashboard/DashboardPage.tsx 的符号大纲
```

Serena 会输出该文件的所有符号定义：

```
DashboardPage.tsx 符号大纲:
├── DashboardPage (default export, React.FC)
├── useDashboardData (Hook)
│   └── 返回: { stats, recentOrders, isLoading }
├── StatCard (内部组件)
├── RecentOrdersTable (内部组件)
└── formatCurrency (工具函数)
```

这比直接打开文件翻阅要高效得多，尤其是面对几百行的页面组件时。

#### 操作 2: Hook 引用追踪

React 项目中，自定义 Hook 的使用链是理解业务逻辑的关键。Serena 可以精确追踪一个 Hook 被哪些组件调用。

```
> 哪些组件使用了 useAuth Hook？
```

Serena 通过 LSP 的 `find references` 能力返回所有引用位置，包括文件路径和行号。这在重构 Hook 时非常有用——你可以准确知道改动会影响哪些组件。

#### 操作 3: 影响分析

当你计划修改一个 Hook 的返回值类型时，Serena 可以帮你评估影响面。

```
> 如果修改 useCart 的返回值类型会影响什么？
```

Serena 会追踪 `useCart` 的所有调用点，分析每个调用点对返回值的解构方式和使用方式，列出可能需要同步修改的位置。这个信息与 CodeGraph 的依赖图互为补充——CodeGraph 告诉你"哪些文件引用了这个模块"，Serena 告诉你"每个引用点具体怎么用的"。

### Context7 文档注入

前端框架迭代极快——React 19 引入了新的编译器，Next.js 15 重构了缓存策略，Tailwind CSS v4 改变了配置方式。Claude 的训练数据可能滞后于最新的 API 变更，Context7 可以将最新文档实时注入对话。安装：

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

#### 查询 1: React 19 新特性

```
> 使用 context7 查询 React 19 的新特性和 breaking changes
```

Context7 会拉取 React 官方文档的最新版本，确保你了解 Server Components、`use()` Hook、新的 Actions 等特性，而不是基于 React 18 的旧知识在写代码。

#### 查询 2: Next.js 15 App Router 变更

```
> 使用 context7 查询 Next.js 15 App Router 的最新用法，特别是缓存和数据获取的变化
```

Next.js 15 对 `fetch` 的缓存默认行为做了重大调整（从默认缓存改为默认不缓存），这类变更如果依赖训练数据很容易踩坑。

#### 查询 3: Tailwind CSS v4 配置

```
> 使用 context7 查询 Tailwind CSS v4 的配置方式，与 v3 有什么区别？
```

Tailwind CSS v4 用 CSS-native 的 `@theme` 指令替代了 `tailwind.config.js`，配置方式完全不同。Context7 可以确保你按照最新方式配置，避免参考过时的 v3 教程。

:::tip 阶段衔接
探索分析阶段的产出直接喂入下一阶段的规划工作：CodeGraph 生成的依赖图谱帮助 OpenSpec 划定变更范围和编写精确的规格文档；Serena 的符号信息帮助 GStack 架构审查时快速定位关键模块；Context7 查询到的最新 API 确保规格文档中的技术方案基于当前版本而非过时用法。
:::

## Phase 2: 规划规格（GStack + OpenSpec + Spec-Kit + Git 分支）

Phase 1 产出了代码结构理解、符号信息和最新 API 知识。Phase 2 的任务是将这些探索发现转化为**结构化的开发计划**——明确要做什么、怎么做、分几步做。这个阶段同时建立 Git 分支隔离，确保开发过程不影响主干代码。

整个规划阶段的产出物有两样：一份可追溯的规格文档（由 OpenSpec 或 Spec-Kit 生成）和一个独立的 Git 分支。两者一起构成进入 Phase 3 实现阶段的输入。

### Git 分支策略

Claude Code 可以直接操作 Git，无需手动切换终端。规划阶段的第一步就是创建特性分支。

#### 创建特性分支

```
> 从 main 创建 feature/user-settings 分支
```

Claude Code 会执行 `git checkout -b feature/user-settings`，后续所有改动都提交到这个分支上。分支命名建议遵循 `feature/`、`fix/`、`refactor/` 等前缀，保持语义清晰。

#### Git Worktree 隔离开发

当你需要同时处理多个特性分支时，Git Worktree 可以避免反复 `stash` 和 `checkout`。Superpowers 提供了 `using-git-worktrees` 技能，会自动创建工作树并切换到隔离的工作目录：

```
> 使用 worktree 开发 feature/payment-flow 分支
```

Superpowers 会在 `.claude/worktrees/` 下创建独立的工作目录，当前会话自动切换进去。你可以在一个终端继续处理 `feature/user-settings`，在另一个终端处理 `feature/payment-flow`，互不干扰。

#### Conventional Commits

提交代码时，Claude Code 会按照 Conventional Commits 格式自动生成 commit message：

```
> 提交改动，commit message 用英文，格式遵循 Conventional Commits
```

生成的 commit message 示例：

```
feat(product): add product comparison table component

- Implement ComparisonTable with drag-and-drop column reorder
- Add comparison attribute selector dropdown
- Support up to 4 products side by side
```

规范的 commit history 让后续的变更追溯、自动生成 CHANGELOG 和语义化版本管理成为可能。

### GStack 需求探索

在写规格文档之前，先用 GStack 的需求探索命令挖掘真实需求。很多团队直接跳过这一步就开始写代码，结果做到一半发现需求理解有偏差，不得不推翻重来。GStack 的 `/office-hours` 通过 6 个核心问题帮你避免这种情况。

#### /office-hours：6 个核心问题挖掘需求

```
> /office-hours
> 我想给电商前端添加商品对比功能
```

GStack 会依次引导你回答以下问题：

1. **用户是谁？** —— 目标用户群体、使用场景
2. **用户要解决什么问题？** —— 当前没有对比功能时，用户怎么做？痛点在哪？
3. **成功的样子是什么？** —— 可量化的指标（对比完成率、转化率提升）
4. **有什么约束？** —— 技术限制、时间限制、设计规范
5. **哪些是必须做的？哪些是可选的？** —— MVP 范围划定
6. **有哪些已知风险？** —— 第三方依赖、性能瓶颈、数据一致性

每个问题 GStack 会追问细节，帮你把模糊的想法变成清晰的需求定义。整个过程通常需要 10-15 分钟，比事后返工划算得多。

#### /plan-ceo-review：商业价值审查

需求明确后，从商业视角审视方案的合理性：

```
> /plan-ceo-review
```

GStack 会评估：这个功能对业务指标（转化率、客单价、留存）的预期影响是什么？是否有投入产出比更高的替代方案？是否符合产品路线图的整体方向？

#### /plan-eng-review：技术架构审查

确认商业价值可行后，从技术视角审查架构方案：

```
> /plan-eng-review
```

GStack 会审查：技术选型是否合理？与现有架构是否兼容？性能影响如何？是否有更简洁的实现方式？这个审查的结论直接指导规格文档中的技术方案章节。

#### /plan-design-review：UI 设计质量审查

如果涉及 UI 变更，还需要审查设计方案的用户体验：

```
> /plan-design-review
```

GStack 会评估：交互流程是否符合用户习惯？响应式适配方案是否完整？无障碍访问（a11y）是否达标？视觉层次是否清晰？

### OpenSpec 规格文档

需求探索完成后，用 OpenSpec 将分析结果沉淀为结构化的规格文档。规格文档不是一次性产物——它会被提交到 Git，成为项目的持久化文档，后续维护和迭代时都可以回溯。

#### 安装与初始化

```bash
npm install -g @fission-ai/openspec@latest
openspec init
```

`openspec init` 会在项目根目录创建 `.openspec/` 目录，包含配置文件和规格模板。

#### 三步工作流

OpenSpec 的核心工作流只有三步：

| 步骤       | 命令               | 作用                                           |
| ---------- | ------------------ | ---------------------------------------------- |
| 1. Propose | `openspec propose` | 基于需求分析生成规格草案                       |
| 2. Apply   | `openspec apply`   | 将规格应用到项目中（生成目录结构、组件骨架等） |
| 3. Archive | `openspec archive` | 归档当前规格，为下一轮迭代腾出空间             |

#### 完整示例：商品对比功能规格

以 Phase 1 探索分析 + GStack 需求探索的结果为输入，生成规格文档：

```
> /openspec-propose
> 基于 office-hours 的讨论结果，为商品对比功能生成规格文档
```

OpenSpec 会生成类似以下结构的规格文档（保存在 `.openspec/specs/product-comparison.md`）：

```markdown
# 商品对比功能规格

## 概述

允许用户选择最多 4 件商品进行属性对比，帮助购买决策。

## 用户故事

- 作为消费者，我想要对比多件商品的关键属性，以便做出更好的购买决策
- 作为消费者，我想要保存对比列表，以便稍后继续查看

## 功能需求

### 对比栏（Comparison Bar）

- 页面底部悬浮栏，显示已选商品缩略图
- 支持拖拽排序、单个移除、全部清空
- 最多 4 件商品，达到上限时提示用户

### 对比页面（/compare）

- 表格布局，左侧为属性名称，右侧为各商品值
- 属性分组：基本信息、规格参数、价格信息、用户评分
- 高亮差异行（可切换仅显示差异）
- 支持导出为图片（html2canvas）

## 技术方案

- 状态管理：Zustand store（compareStore），持久化到 localStorage
- 路由：/compare 作为独立页面，对比栏组件全局挂载
- 组件：ComparisonBar、ComparisonTable、AttributeGroup、DiffHighlight
- API：复用现有商品详情接口，批量查询（POST /products/batch）

## 验收标准

- [ ] 对比栏支持拖拽排序
- [ ] 对比表格在移动端水平滚动
- [ ] 差异高亮默认开启
- [ ] 导出图片包含品牌 Logo 和时间戳
```

规格文档生成后，执行 `openspec apply` 将其应用到项目中——OpenSpec 会根据规格中的组件列表创建骨架文件。最后将规格文档提交到 Git：

```
> 将 .openspec/ 目录下的规格文档提交到 Git
```

规格文档作为项目文档的一部分被版本控制，任何人都可以通过 `git log` 追踪需求的演变过程。

### Spec-Kit 替代方案

:::tip 复杂项目推荐 Spec-Kit
对于涉及多个服务、需要大量需求澄清的复杂项目，可以使用 Spec-Kit 替代 OpenSpec。Spec-Kit 提供了更细粒度的需求分析流程：
:::

Spec-Kit 的工作流分为四步：

1. **`/speckit.specify`** —— 编写初始规格，描述功能意图
2. **`/speckit.clarify`** —— 自动追问需求细节，填补规格空白
3. **`/speckit.plan`** —— 基于完整规格生成技术方案
4. **`/speckit.tasks`** —— 将方案拆解为可执行的开发任务

其中 `/speckit.clarify` 是关键步骤。它会自动识别规格中的模糊点并追问：

```
> /speckit.clarify

自动生成的澄清问题：
- 对比属性是否支持用户自定义？还是固定为系统预设？
- 是否支持导出对比结果？导出格式是什么（图片/PDF/CSV）？
- 对比数据是否需要登录后才能保存？
- 对比栏在商品下架后如何处理？移除还是显示下架标记？
```

这些追问帮你提前发现遗漏需求，避免开发到一半才发现规格不完整。

### 阶段总结

Phase 2 的产出包括：

- **Git 特性分支** —— 独立的开发环境，不影响主干
- **规格文档** —— 结构化的需求定义和技术方案，已提交到 Git
- **GStack 审查结论** —— 商业价值、技术架构、UI 设计三个维度的审查结果

这些产出物一起构成 Phase 3 TDD 实现阶段的完整输入：规格文档定义了"做什么"，技术方案定义了"怎么做"，Git 分支提供了"在哪里做"。

:::tip 阶段衔接
规格文档中的验收标准会直接转化为 Phase 3 的测试用例。GStack 的技术方案审查结论指导 Superpowers 选择正确的 TDD 策略。Git 分支确保整个实现过程在隔离环境中进行，随时可以安全地回退。
:::

## Phase 3: TDD 实现（Superpowers + CodeGraph + Context7 + Git 提交）

Phase 2 产出了规格文档和特性分支，现在进入实际编码阶段。这个阶段的核心原则是**测试驱动开发（TDD）**——先写测试，再写实现，最后重构。Superpowers 强制执行 TDD 纪律，CodeGraph 在实现过程中提供实时的代码结构导航，Context7 确保你使用的 API 是最新版本，Git 频繁提交则保证每一步都可追溯、可回退。

### Superpowers TDD 铁律

Superpowers 的 TDD 工作流有三条铁律，违反任何一条都会被强制回退：

| 铁律                 | 含义                             | 后果                                       |
| -------------------- | -------------------------------- | ------------------------------------------ |
| **没有设计不写代码** | 必须先有规格文档或明确的设计方案 | Superpowers 会拒绝执行，要求先完成 Phase 2 |
| **没有测试不写代码** | 必须先编写失败的测试用例         | 先写的实现代码会被删除，强制回到测试步骤   |
| **没有验证不算完成** | 所有测试必须通过才能进入下一步   | 无法进入 Code Review 或下一阶段            |

#### 前端 TDD 循环

前端 TDD 遵循经典的三色循环，但工具链换成了 Vitest + React Testing Library：

```
🔴 RED    → 编写失败的测试（Vitest + React Testing Library）
🟢 GREEN  → 编写最少量的代码让测试通过
🔵 REFACTOR → 重构代码，保持测试绿色
```

每个循环聚焦一个小功能点，通常 15–30 分钟完成一轮。整个组件的实现由多个这样的小循环串联而成。

#### 完整示例：商品对比面板

以 Phase 2 规格文档中的商品对比功能为例，展示 Superpowers 的完整 TDD 流程：

```
> 使用 Superpowers 工作流，实现商品对比面板：
> 1. 头脑风暴确认需求（对比属性列表？最多几个？响应式？）
> 2. 编写组件测试（Vitest + React Testing Library）
> 3. 运行 pnpm test 确认失败
> 4. 实现静态 UI（JSX + Tailwind CSS）
> 5. 添加交互逻辑（添加/移除商品、属性切换）
> 6. 接入 API 层（React Query）
> 7. 运行 pnpm test 确认全部通过
```

Superpowers 会严格按照这个顺序执行。第一步的头脑风暴会回顾 Phase 2 的规格文档，确认验收标准。第二步先写测试，典型测试用例如下：

```tsx
// ComparisonPanel.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComparisonPanel } from './ComparisonPanel';

describe('ComparisonPanel', () => {
  it('渲染对比表格，左侧为属性名称', () => {
    render(<ComparisonPanel products={mockProducts} />);
    expect(screen.getByText('价格')).toBeInTheDocument();
    expect(screen.getByText('重量')).toBeInTheDocument();
  });

  it('支持添加商品到对比列表（最多 4 件）', () => {
    render(<ComparisonPanel />);
    fireEvent.click(screen.getByText('添加对比'));
    expect(screen.getAllByTestId('comparison-item')).toHaveLength(1);
  });

  it('超过 4 件时显示提示', () => {
    render(<ComparisonPanel products={fiveProducts} />);
    expect(screen.getByText('最多支持 4 件商品对比')).toBeInTheDocument();
  });
});
```

写完测试后执行 `pnpm test`，三个测试全部失败（RED）。然后 Superpowers 依次编写静态 UI、交互逻辑和 API 接入，每一步完成后都运行测试验证（GREEN）。最后进行代码重构——提取子组件、优化渲染性能——同时确保测试依然通过（REFACTOR）。

:::warning Superpowers 强制"测试先行"
Superpowers 会在每次代码提交前检查是否有对应的测试文件。如果发现先写了实现代码而没有测试，Superpowers 会删除已写的代码并要求你先补写测试。这不是建议，而是强制规则——它的设计理念是"测试是代码的规格说明"，没有规格的代码等同于没有设计。
:::

### CodeGraph 实时辅助

在 TDD 的实现阶段，CodeGraph 从 Phase 1 的"前期探索"转变为"实时辅助"角色。你不再需要手动搜索文件和翻阅代码——CodeGraph 在实现过程中持续提供结构化的代码导航。

#### 组件结构探索

在编写新组件之前，用 `codegraph_explore` 快速了解现有组件的组织方式：

```
> 用 codegraph_explore 查看 src/features/product/ 目录下的组件结构
```

CodeGraph 会输出该目录下所有组件的层级关系、导出接口和依赖关系，帮助你决定新组件应该放在哪里、如何与现有结构保持一致。

#### 调用方追踪

当你需要复用某个 UI 组件但不确定它的使用方式时，`codegraph_callers` 可以快速找到所有使用该组件的地方：

```
> 用 codegraph_callers 找出哪些页面使用了 ProductCard 组件
```

CodeGraph 会列出所有引用 `ProductCard` 的文件和具体的使用方式（传了哪些 props、在什么上下文中使用）。这比手动 Grep + Read 效率高得多——一次 `codegraph_explore` 调用通常可以替代 3-4 次 Grep 和 Read 的组合操作，节省约 57% 的 token 消耗。

#### Token 效率对比

| 方式      | 操作次数           | Token 消耗 | 准确度             |
| --------- | ------------------ | ---------- | ------------------ |
| 手动搜索  | Grep + Read × 多次 | 基准值     | 依赖搜索关键词     |
| CodeGraph | 1 次 explore       | 节省 57%   | 结构化输出，无遗漏 |

在长对话中，token 效率的累积优势非常明显。一个组件的实现过程可能需要 5-8 次代码结构查询，使用 CodeGraph 可以将这部分的 token 消耗从约 8000 降到约 3500。

### Context7 文档注入

实现阶段经常需要查阅框架 API 文档——一个新的 Hook 怎么用、某个 CSS 特性的浏览器兼容性、第三方库的最新配置方式。Context7 在 TDD 循环中持续提供最新的文档支持。

#### React 19 新 API 查询

```
> 查询 React 19 的 useActionState 用法
```

Context7 会拉取 React 官方文档中 `useActionState` 的完整说明，包括函数签名、参数解释、使用示例和注意事项。这比让 Claude 基于训练数据回答更可靠，因为 React 19 的 API 在正式发布前后经历了多次调整。

#### Tailwind CSS v4 新语法查询

```
> 查询 Tailwind CSS v4 的 @theme 指令
```

Tailwind CSS v4 用 CSS-native 的 `@theme` 指令替代了 JavaScript 配置文件，配置方式完全不同。在实现 UI 组件时，Context7 确保你使用正确的 v4 语法，而不是沿用 v3 的 `tailwind.config.js` 写法。

#### 在 TDD 循环中的使用时机

Context7 的查询通常发生在 TDD 循环的 GREEN 阶段——你已经写好了失败的测试（RED），现在需要用正确的 API 实现功能。在写实现代码之前，花 30 秒查询一次 Context7，可以避免写错 API 然后花 10 分钟调试的尴尬。

### Git 频繁提交

TDD 的每个小循环完成后都应该提交一次 Git。频繁提交的好处是：每一步都有可回退的检查点，出了问题可以精确定位是哪一步引入的。

#### 提交时机

| 时机            | 提交内容           | 示例                                                           |
| --------------- | ------------------ | -------------------------------------------------------------- |
| RED 完成后      | 失败的测试用例     | `test(comparison): add initial test cases for ComparisonPanel` |
| GREEN 完成后    | 通过测试的实现代码 | `feat(comparison): implement ComparisonPanel static UI`        |
| REFACTOR 完成后 | 重构后的代码       | `refactor(comparison): extract AttributeGroup subcomponent`    |
| 功能完整后      | 完整的功能模块     | `feat(comparison): add comparison bar with drag-and-drop`      |

#### 提交示例

```
> 提交商品对比面板的类型定义和静态 UI
```

Claude Code 会自动生成 Conventional Commits 格式的 commit message：

```
feat(comparison): add product comparison panel static UI

- Define ComparisonProduct and ComparisonAttribute types
- Implement ComparisonPanel with table layout
- Add responsive grid for mobile scrolling
```

```
> 提交交互逻辑和状态管理代码
```

```
feat(comparison): add interaction logic and state management

- Implement add/remove product actions in compareStore
- Add attribute group toggle (expand/collapse)
- Wire React Query for batch product data fetching
```

#### 与 Superpowers 的协作

Superpowers 会监控 Git 提交频率。如果检测到大量代码改动但没有对应的提交，它会提醒你先提交当前进度。这避免了"一口气写完再提交"导致的巨型 commit——巨型 commit 一旦需要回退，代价极高。

:::tip 阶段衔接
Phase 3 的产出是一组通过测试的组件代码和详细的 Git 提交历史。这些提交记录了从失败测试到完整实现的每一步演进，为 Phase 4 的 Code Review 提供了清晰的变更脉络。Code Review 工具（GStack + Serena）会基于这些提交逐一审查实现质量，确保代码既符合规格文档的要求，又满足团队的编码规范。
:::

## Phase 4: 审查测试（GStack + Serena + ECC）

Phase 3 产出了通过测试的组件代码和完整的 Git 提交历史。进入 Phase 4 后，重心从"写代码"转向"验证代码"——通过 Code Review 发现潜在问题，通过浏览器测试验证真实交互，通过安全审计排除风险。这个阶段涉及三类工具的协同：GStack 负责自动化 QA 和代码审查，Serena 负责基于审查结论的精确重构，ECC（Extra Claude Code）负责安全层面的专项检查。

### GStack 内置浏览器 QA

GStack 内置了完整的 Chromium 浏览器环境，可以通过 `/qa` 命令直接在真实浏览器中测试前端应用。这比手动打开浏览器逐页点击高效得多——GStack 会自动遍历页面、填写表单、点击按钮，并报告发现的问题。

#### /qa 命令

`/qa` 启动一个 Chromium 实例，加载指定的 URL，然后按照你描述的测试步骤自动执行交互。它会截图记录每一步的结果，如果遇到报错、白屏、布局异常等问题会立即标记。

```
> /qa https://localhost:5173
```

GStack 会打开本地开发服务器，从首页开始自动遍历所有可达页面，检查是否有 JavaScript 报错、网络请求失败、布局错位等基础问题。

#### 完整示例：商品对比功能 QA

在实际项目中，通常会针对特定功能编写更精确的测试指令：

```
> /qa https://localhost:5173
> 测试商品对比功能：
> - 添加商品到对比面板是否正常
> - 对比表格在移动端是否变为纵向卡片
> - 移除商品后面板状态是否正确
> - 空对比面板是否有友好提示
```

GStack 会依次执行每个测试步骤：先导航到商品列表页，点击"加入对比"按钮，验证对比面板是否出现；然后模拟移动端视口（375px 宽度），检查对比表格是否切换为纵向卡片布局；接着移除一件商品，验证面板状态是否正确更新；最后清空所有商品，验证空状态是否有友好的提示文案。每一步都会截图，你可以直接在终端中看到浏览器的实际渲染结果。

:::tip 测试环境要求
使用 `/qa` 前确保开发服务器已启动（`npm run dev` 或 `pnpm dev`）。GStack 的 Chromium 实例会连接到你指定的 URL，如果服务器未启动会直接报连接失败。
:::

### GStack 代码审查

浏览器 QA 验证的是"功能是否正常工作"，代码审查则关注"代码是否写得足够好"。GStack 提供了三个层次的审查命令，从代码质量到安全漏洞逐层深入。

#### /review：Staff Engineer 级别审查

`/review` 模拟一位高级工程师的 Code Review 视角，审查代码的可读性、可维护性、性能和架构设计。

```
> /review
> 审查 feature/product-comparison 分支的前端代码变更
```

GStack 会分析该分支相对于 main 的所有变更，输出类似以下结构的审查意见：

```
审查报告 — feature/product-comparison

🟡 建议改进:
  - src/features/comparison/ComparisonTable.tsx:142
    useComparisonData Hook 内部有 3 层嵌套的 .map()，建议提取为独立的转换函数
  - src/features/comparison/ComparisonBar.tsx:67
    拖拽排序使用了 index 作为 key，在动态列表中可能导致渲染异常

🟢 亮点:
  - 类型定义完整，ComparisonProduct 接口覆盖了所有使用场景
  - 对比差异高亮的实现简洁高效，使用 CSS 变量而非内联样式
```

#### /cso：OWASP Top 10 安全审计

`/cso`（Chief Security Officer）专注于安全层面的审查，对标 OWASP Top 10 风险清单。对于前端项目，重点关注 XSS、CSRF、不安全的第三方依赖等风险。

```
> /cso
> 审查 feature/product-comparison 分支的安全风险
```

GStack 会扫描代码中的安全敏感点：是否有未转义的用户输入直接渲染到 DOM？是否有 `dangerouslySetInnerHTML` 的使用？API 请求是否携带了 CSRF Token？依赖版本是否存在已知漏洞？

#### /benchmark：Core Web Vitals 测量

`/benchmark` 在真实浏览器环境中测量页面的核心性能指标（LCP、FID、CLS），帮你发现性能回退。

```
> /benchmark https://localhost:5173/compare
```

GStack 会加载对比页面，记录 Largest Contentful Paint、First Input Delay 和 Cumulative Layout Shift 的实际数值，并与行业基准（Good / Needs Improvement / Poor）做对比。如果某个指标超标，会指出具体是哪个元素导致的。

### Serena 精确重构

GStack 的 `/review` 会产出具体的改进意见，但修改代码时需要精确操作——不能只是模糊地说"重命名这个组件"，而要确保所有引用点都同步更新。这正是 Serena 的强项。

当审查发现问题时，用 Serena 的符号级操作进行精确重构：

```
> 审查发现 ComparisonTable 命名不够语义化：
> 1. 用 find_referencing_symbols 找出所有引用
> 2. 用 rename_symbol 重命名为 ProductComparisonTable
> 3. 验证所有测试仍然通过
```

这个流程确保了重命名的安全性：第一步列出所有引用位置（import 语句、JSX 使用、类型引用、测试文件），第二步一次性替换所有引用，第三步运行测试确认没有遗漏。整个过程由 Serena 的 LSP 能力保证精确——不会出现手动替换遗漏某个引用导致的运行时错误。

#### move_symbol：移动文件位置

审查意见中另一类常见问题是文件组织不合理——比如一个通用 Hook 被放在了某个业务组件目录下。Serena 的 `move_symbol` 可以安全地将符号移动到新位置，同时更新所有导入路径：

```
> 审查发现 useComparisonData 放在了 features/comparison/ 目录下，
> 但它是一个通用 Hook，应该移到 hooks/ 目录：
> 1. 用 move_symbol 将 useComparisonData 移到 src/hooks/useComparisonData.ts
> 2. 确认所有导入路径已自动更新
> 3. 运行测试验证
```

### ECC 安全审查

ECC（Extra Claude Code）是一组专门的审查 Agent，每个 Agent 聚焦一个特定维度。相比 GStack 的 `/review` 做全面审查，ECC 的 Agent 更适合做深度专项检查。

#### typescript-reviewer：类型安全检查

检查 TypeScript 类型定义是否完整、是否有滥用 `any` 的地方、泛型约束是否合理、类型守卫是否正确。

```
> 使用 typescript-reviewer 检查商品对比功能的类型安全性
```

typical findings: 某个 API 响应的类型定义缺少可选字段标记、某个事件处理函数的参数类型过于宽泛（`e: any` 而非 `e: React.ChangeEvent`）。

#### security-reviewer：XSS 风险检查

专门扫描 XSS 攻击面。重点检查：`dangerouslySetInnerHTML` 的使用是否安全、URL 参数是否经过转义、用户输入是否直接拼接到 HTML 中、第三方组件库是否已知存在 XSS 漏洞。

```
> 使用 security-reviewer 检查 XSS 风险
```

前端项目中最常见的 XSS 风险来自两个地方：一是富文本渲染（使用了 `dangerouslySetInnerHTML` 但未做 sanitize），二是 URL 参数直接渲染到页面（`location.search` 未经转义就显示在页面上）。security-reviewer 会精确定位这些位置并给出修复建议。

#### frontend-patterns：组件设计模式检查

审查组件设计是否符合 React 最佳实践：组件是否过大需要拆分、状态是否放在了正确的层级、是否有不必要的 re-render、自定义 Hook 的职责是否单一。

```
> 使用 frontend-patterns 检查组件设计模式
```

frontend-patterns 会检查：组件行数是否超过 300 行（建议拆分）、`useEffect` 的依赖数组是否完整、是否在渲染过程中创建了新的对象引用（导致不必要的 re-render）、Context 的 value 是否做了 memoization。

### Git PR 创建

审查和重构全部完成后，最后一步是将代码合并到主干。Claude Code 可以直接通过 `gh` CLI 创建 Pull Request：

```
> 帮我创建一个 PR，目标分支是 main，标题和描述用英文
```

Claude Code 会自动执行以下步骤：

1. 推送当前分支到远程仓库（`git push -u origin feature/product-comparison`）
2. 分析该分支相对于 main 的所有提交，生成 PR 描述
3. 调用 `gh pr create` 创建 PR，自动填充标题、描述和变更摘要
4. 返回 PR 链接供你审查

生成的 PR 描述会包含：功能概述、技术方案摘要、变更文件列表、测试覆盖情况。你可以在 GitHub 上补充截图、关联 Issue、指派 Reviewer。

:::warning 合并前的最终检查
在点击 Merge 按钮之前，建议在 PR 页面确认三件事：CI 流水线是否全部通过、GStack 的 `/review` 意见是否都已处理、是否有未解决的 TODO 注释。这三道关卡确保合并到 main 的代码是经过充分验证的。
:::

:::tip 阶段衔接
Phase 4 的产出是一个已审查、已测试、已创建 PR 的功能分支。这个分支包含了通过浏览器 QA 验证的功能实现、通过代码审查和安全审计的高质量代码、以及完整的 PR 描述和讨论记录。这些一起构成 Phase 5 发布自动化的输入——PR 合并后触发 CI/CD 流水线，自动完成构建、部署和发布后的监控。
:::

## Phase 5: 发布自动化（Ralph + Hooks + CI/CD）

Phase 4 产出了已审查、已测试、已创建 PR 的功能分支。Phase 5 的任务是将发布流程自动化——从批量任务执行、代码格式化、类型检查到 CI/CD 流水线和 PR 创建，尽可能减少人工操作环节。这个阶段的核心工具是 Ralph（自主循环执行批量任务）、Claude Code Hooks（自动化代码质量检查）和 GitHub Actions（CI/CD 集成）。

### Ralph 自主循环

Ralph 是一个让 Claude Code 自主迭代执行任务的插件。它的工作方式是：将大任务拆分为 PRD（产品需求文档），然后通过脚本驱动 Claude Code 逐个完成子任务，每轮迭代使用全新的上下文窗口，通过 Git 历史和 `progress.txt` 积累知识。这解决了长对话中上下文衰减的问题。

#### 安装

```bash
/plugin marketplace add snarktank/ralph
/plugin install ralph-skills@ralph-marketplace
```

安装完成后会获得 `/prd` 和 `/ralph` 两个命令，以及 `ralph.sh` 执行脚本。

#### 工作流

Ralph 的工作流分为三步：

1. **`/prd`** —— 将任务列表转化为结构化的 PRD 文档
2. **`/ralph`** —— 将 PRD 转化为机器可读的 `prd.json`
3. **`ralph.sh`** —— 自主循环执行，逐个完成子任务

```
/prd 生成 PRD → /ralph 转化为 prd.json → ./scripts/ralph/ralph.sh --tool claude 自主执行
```

每轮迭代中，Ralph 会启动一个全新的 Claude Code 实例，读取 `prd.json` 和 `progress.txt`，执行当前子任务，提交 Git，然后更新进度文件。下一轮迭代通过 Git 历史和进度文件了解已完成的工作，继续处理下一个子任务。这种"无状态迭代 + 有状态持久化"的设计避免了长对话中的上下文溢出问题。

#### 前端使用场景

Ralph 特别适合以下类型的前端批量任务：

| 场景             | 示例                                             |
| ---------------- | ------------------------------------------------ |
| 批量实现多个页面 | 电商后台的订单管理、退款管理、物流管理等多个页面 |
| 组件库迁移       | 将项目中的 Ant Design 组件逐一替换为 Radix UI    |
| API 层重构       | 将所有直接的 `fetch` 调用迁移到 React Query 封装 |
| 测试补全         | 为现有组件批量补充单元测试                       |

#### 完整示例：商品对比子任务批量实现

假设 Phase 3 的 TDD 实现只完成了商品对比功能的核心部分（对比表格、对比栏），还有几个子任务待完成。用 Ralph 批量处理：

```
> /prd
> 将商品对比功能的剩余子任务转为 PRD：
> - 对比历史记录（localStorage 持久化）
> - 对比结果分享（URL 参数编码）
> - 对比数据导出（CSV/PDF）
```

`/prd` 会生成一份结构化的 PRD，包含每个子任务的描述、验收标准和技术方案。然后执行 `/ralph` 将其转化为 `prd.json`：

```json
{
  "tasks": [
    {
      "id": 1,
      "title": "对比历史记录",
      "description": "将用户的对比记录持久化到 localStorage，支持查看历史对比",
      "acceptance": ["对比数据持久化到 localStorage", "刷新页面后对比记录保留", "支持清除历史记录"]
    },
    {
      "id": 2,
      "title": "对比结果分享",
      "description": "通过 URL 参数编码当前对比商品 ID，生成可分享的链接",
      "acceptance": ["URL 包含对比商品 ID 参数", "打开链接自动加载对比数据", "支持 2-4 件商品的编码"]
    },
    {
      "id": 3,
      "title": "对比数据导出",
      "description": "支持将对比表格导出为 CSV 和 PDF 格式",
      "acceptance": ["CSV 导出包含所有对比属性", "PDF 导出包含表格样式和品牌 Logo", "导出时显示进度提示"]
    }
  ]
}
```

最后启动 Ralph 自主执行：

```bash
./scripts/ralph/ralph.sh --tool claude
```

Ralph 会依次处理三个子任务。每轮迭代的 Claude Code 实例只关注当前子任务，完成后提交 Git 并更新 `progress.txt`。整个过程无需人工干预，你可以去做其他事情。完成后查看 `progress.txt` 和 Git 日志了解执行结果。

:::warning Ralph 迭代中的测试策略
Ralph 的每轮迭代默认会运行项目已有的测试来验证改动。建议在启动 Ralph 之前确保测试套件是绿色的（全部通过），否则迭代可能因为已有的失败测试而误判新代码有问题。
:::

### Hooks 自动化

Claude Code Hooks 是在特定事件触发时自动执行的脚本。对于前端项目，最有价值的两个 Hook 是：文件修改后自动格式化（PostToolUse）和 Claude Code 结束后自动类型检查（Stop）。

#### PostToolUse Hook：自动格式化

当 Claude Code 修改了 `.tsx`、`.ts`、`.css` 文件后，自动运行 Prettier 格式化代码。这确保了 AI 生成的代码始终符合项目的格式规范，无需手动执行 `npm run fmt`。

#### Stop Hook：自动类型检查

当 Claude Code 完成所有操作后（Stop 事件），自动运行 TypeScript 类型检查。这是一道安全网——即使 Claude Code 的实现逻辑正确，也可能因为类型不匹配导致构建失败。Stop Hook 可以在你提交代码之前捕获这些问题。

#### 完整配置

在 `.claude/settings.json` 中配置这两个 Hook：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$CLAUDE_FILE_PATHS\" 2>/dev/null || true"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npx tsc --noEmit --pretty"
          }
        ]
      }
    ]
  }
}
```

配置说明：

- `matcher: "Write|Edit"` —— 只在 Claude Code 使用 Write 或 Edit 工具修改文件时触发，避免读取文件时也触发格式化
- `$CLAUDE_FILE_PATHS` —— Claude Code 注入的环境变量，包含本次操作涉及的文件路径
- `2>/dev/null || true` —— 如果文件不是 Prettier 支持的格式，静默忽略错误
- `npx tsc --noEmit` —— 只做类型检查，不生成编译产物

:::tip Hook 的执行时机
PostToolUse 在每次工具调用后立即执行，Stop 在 Claude Code 整个会话结束时执行一次。这意味着如果一次会话中修改了 10 个文件，PostToolUse 会触发 10 次（每次针对对应的文件），而 Stop 只会在最后执行一次全量类型检查。
:::

### CI/CD 集成

本地的 Hooks 处理了开发阶段的自动化，CI/CD 则覆盖了代码推送后的自动化流程。通过 GitHub Actions 集成 Claude Code Action，可以在 PR 阶段自动进行 AI 驱动的代码审查。

#### GitHub Actions AI Code Review

使用 `anthropics/claude-code-action@v1` 可以在每个 PR 上自动触发 AI 审查。Claude 会分析 PR 的变更内容，检查代码质量、潜在 bug、安全风险和最佳实践。

创建 `.github/workflows/ai-review.yml`：

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: AI Code Review
        uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          review_prompt: |
            请审查这个前端 PR 的代码变更，重点关注以下方面：

            1. **组件结构**: 组件是否过大需要拆分？职责是否单一？
            2. **TypeScript 类型**: 类型定义是否完整？是否有滥用 any 的地方？
            3. **不必要的 re-render**: 是否在渲染过程中创建了新的对象引用？useEffect 依赖数组是否完整？
            4. **XSS 风险**: 是否有未转义的用户输入直接渲染到 DOM？dangerouslySetInnerHTML 使用是否安全？
            5. **测试覆盖**: 新增代码是否有对应的测试？边界条件是否覆盖？
            6. **无障碍访问**: 交互元素是否有 aria 属性？表单控件是否有 label？

            请用中文输出审查意见，格式分为"必须修改"和"建议改进"两个层级。
```

这个工作流的触发条件是 PR 创建或更新时（`opened, synchronize`），每次推送新代码到 PR 分支都会自动重新审查。审查结果会作为 PR 评论发布，团队成员可以直接在评论中讨论和修改。

#### Review Prompt 模板说明

审查提示词（`review_prompt`）的设计覆盖了前端项目最常见的六类问题：

| 维度               | 检查内容                                 | 对应的 ECC Agent    |
| ------------------ | ---------------------------------------- | ------------------- |
| 组件结构           | 单一职责、合理拆分                       | frontend-patterns   |
| TypeScript 类型    | 类型完整性、避免 any                     | typescript-reviewer |
| 不必要的 re-render | useMemo/useCallback 使用、对象引用稳定性 | frontend-patterns   |
| XSS 风险           | 输入转义、dangerouslySetInnerHTML        | security-reviewer   |
| 测试覆盖           | 新代码的测试覆盖、边界条件               | —                   |
| 无障碍访问         | aria 属性、键盘导航、表单标签            | —                   |

你可以根据团队的实际情况调整这个提示词，增加或删除检查维度。

### GStack 发布

所有审查和测试完成后，GStack 的 `/ship` 命令可以一键完成发布前的收尾工作：运行完整测试套件、审计测试覆盖率、推送代码并创建 PR。

```
> /ship
> 运行完整测试套件，审计覆盖率，创建 PR
```

`/ship` 会依次执行：

1. **运行测试** —— 执行 `pnpm test`（或项目配置的测试命令），确认所有测试通过
2. **审计覆盖率** —— 检查新增代码的测试覆盖率，如果低于阈值会发出警告
3. **推送代码** —— 将当前分支推送到远程仓库
4. **创建 PR** —— 分析 Git 提交历史，生成 PR 标题和描述，调用 `gh pr create` 创建 PR
5. **返回 PR 链接** —— 输出 PR 的 URL，方便你跳转到 GitHub 补充信息

与手动执行 `git push` + `gh pr create` 相比，`/ship` 的优势在于它会在推送之前运行测试和覆盖率审计，避免推送有问题的代码到远程。如果测试失败或覆盖率不达标，`/ship` 会中断流程并报告问题，而不是等到 CI 流水线失败才发现。

:::tip 发布后的监控
PR 合并到 main 后，CI/CD 流水线会自动触发构建和部署。建议在部署完成后执行 GStack 的 `/benchmark` 命令测量 Core Web Vitals，确认新功能没有引入性能回退。这形成了一个完整的闭环：实现 → 审查 → 发布 → 验证。
:::

### 阶段总结

Phase 5 的产出包括：

- **Ralph 批量任务执行** —— 通过自主循环完成多个子任务，每轮迭代使用全新上下文，通过 Git 和进度文件保持状态
- **Hooks 自动化** —— PostToolUse 自动格式化、Stop 自动类型检查，确保代码质量的一致性
- **CI/CD 集成** —— GitHub Actions AI Code Review 在 PR 阶段自动审查代码，覆盖组件结构、类型安全、XSS 风险、测试覆盖和无障碍访问
- **GStack `/ship` 一键发布** —— 测试、覆盖率审计、推送、PR 创建一站式完成

至此，五阶段工作流形成完整闭环。从 Phase 1 的代码探索，到 Phase 2 的规划规格，到 Phase 3 的 TDD 实现，到 Phase 4 的审查测试，再到 Phase 5 的发布自动化——每个阶段都有明确的输入产出和对应的工具支撑，前后阶段通过结构化产物无缝衔接。

:::tip 阶段衔接
Phase 5 的产出（已合并的 PR、已部署的功能、CI/CD 流水线）直接触发下一轮迭代的起点。GStack 的 `/benchmark` 测量结果可以作为 Phase 1 探索分析的输入——如果发现性能指标不佳，下一轮迭代可以从分析性能瓶颈开始。CI/CD 流水线中的 AI Review 积累的审查意见也可以反馈到团队的编码规范中，持续提升代码质量。
:::
