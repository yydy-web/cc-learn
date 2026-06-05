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

## Phase 2: 规划规格（GStack + OpenSpec）

:::info 内容编写中...
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
