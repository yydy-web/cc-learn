---
title: 前端集成工作流详解
description: 从代码探索到发布的五阶段前端开发工作流，深度集成 CodeGraph、Serena、GStack、Superpowers、OpenSpec、Ralph、Context7 和 Git
---

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

| 框架 | 路由定义位置 | 嵌套路由识别 |
|------|-------------|-------------|
| React Router | `src/routes.tsx` 或 `createBrowserRouter` 配置 | `children` 数组内的嵌套路径 |
| Next.js (App Router) | `app/` 目录结构 | `page.tsx` + `layout.tsx` 的目录层级 |
| Vue Router | `src/router/index.ts` | `children` 字段或文件系统路由 |
| SvelteKit | `src/routes/` 目录 | `+page.svelte` / `+layout.svelte` 的目录层级 |

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
  - read_file      # Claude Code 自带文件读取
  - list_dir       # Claude Code 自带目录浏览
  - execute_shell  # Claude Code 自带命令执行
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

| 步骤 | 命令 | 作用 |
|------|------|------|
| 1. Propose | `openspec propose` | 基于需求分析生成规格草案 |
| 2. Apply | `openspec apply` | 将规格应用到项目中（生成目录结构、组件骨架等） |
| 3. Archive | `openspec archive` | 归档当前规格，为下一轮迭代腾出空间 |

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

## Phase 3: TDD 实现（Superpowers + CodeGraph + Context7）

:::info 内容编写中...
:::

## Phase 4: 审查测试（GStack + Serena）

:::info 内容编写中...
:::

## Phase 5: 发布自动化（Ralph + Git + CI/CD）

:::info 内容编写中...
:::
