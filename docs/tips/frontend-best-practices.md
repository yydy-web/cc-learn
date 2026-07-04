---
title: 前端开发最佳实践
description: 使用 Claude Code 进行前端开发的完整指南，涵盖提示词策略、测试、组件开发、工具链集成（ECC、GStack、Superpowers、CodeGraph、Serena、Chrome DevTools MCP）和自动化工作流
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★☆  | ★★★☆☆    |
| 📦 产品 | ★★★☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握前端 Claude Code 最佳实践，能独立配置项目级 CLAUDE.md 并集成七大工具链完成完整开发流程

**🚀 AI 能力提升：** 代码生成、设计→代码
:::

# 前端开发最佳实践

Claude Code 对前端生态（React、Vue、Next.js、TypeScript、Vite 等）有天然的优势——训练数据中前端代码占比高，生成质量好。本文介绍如何在前端项目中高效使用 Claude Code，从项目配置到自动化工作流的最佳实践。

:::info
React 专属内容（组件测试、状态管理、代码审查、React Skills 等）已独立为 [React 开发最佳实践](/tips/react-best-practices)。
:::

:::info
Vue 专属内容（Composition API、Pinia 状态管理、Vue Router、VueUse 组合式函数、Vite 配置等）已独立为 [Vue 开发最佳实践](/tips/vue-best-practices)。
:::

## 配置 CLAUDE.md

`CLAUDE.md` 是 Claude Code 理解项目的关键。以下是 React + TypeScript 项目的推荐配置：

````markdown title="CLAUDE.md"
# 项目概述

基于 React 18 + TypeScript + Vite 的 SPA 应用，使用 pnpm 作为包管理器。

## 构建与测试

```bash
pnpm dev              # 启动开发服务器
pnpm build            # 生产构建
pnpm test             # 运行单元测试（Vitest）
pnpm test:e2e         # 运行 E2E 测试（Playwright）
pnpm lint             # ESLint 检查
pnpm type-check       # TypeScript 类型检查（tsc --noEmit）
```

## 架构约定

- 使用函数式组件 + Hooks，不使用 class 组件
- 组件放在 `components/`，页面级组件放在 `features/`
- 自定义 Hooks 放在 `hooks/`，以 `use` 开头命名
- API 请求统一封装在 `services/` 层，组件不直接调用 fetch
- 状态管理使用 Zustand，全局状态放 `stores/`
- 路由使用 React Router v6+

## 代码规范

- ESLint + Prettier，配置文件在项目根目录
- 使用 TypeScript strict mode
- Props 使用 `interface` 定义，不使用 `type`
- 导出方式：组件用命名导出（`export function`），工具函数用命名导出

## 样式约定

- 使用 Tailwind CSS，不写自定义 CSS（除非必须）
- 组件库使用 shadcn/ui，自定义组件参考其风格
- 响应式设计优先：mobile-first

## 测试约定

- 单元测试：Vitest + React Testing Library
- E2E 测试：Playwright
- 测试文件与组件同目录，命名为 `ComponentName.test.tsx`
- API Mock 使用 MSW（Mock Service Worker）
````

:::warning
不同前端项目的技术栈差异很大。上面的模板基于 React + Vite + Tailwind CSS，如果你使用 Vue + Pinia、Next.js + CSS Modules 或其他组合，需要相应调整 CLAUDE.md 内容。
:::

## 提示词策略

### 通用原则

前端代码是 Claude Code 训练数据最丰富的领域之一。与 Java/Go 等后端语言相比，Claude 对 React、Vue、TypeScript 等框架的理解更深入，生成质量更高。但"好的训练数据"不等于"不需要上下文"——明确指定技术栈和代码规范仍然重要。

```
❌ "帮我写一个登录页面"
✅ "使用 React + TypeScript + Tailwind CSS 实现登录页面：
   - 使用 shadcn/ui 的 Card、Input、Button 组件
   - 表单验证使用 react-hook-form + zod
   - 支持邮箱/密码登录，包含记住密码复选框
   - 参考 src/components/ui/UserCard.tsx 的组件风格
   - 错误提示显示在对应输入框下方"
```

### 组件化生成策略

对前端组件，建议按渐进式方式生成，从静态 UI 到完整功能：

```
> 第一步：定义 TypeScript 类型（Props、State、API 响应）
> 第二步：生成静态 UI（纯 JSX + 样式，不含交互逻辑）
> 第三步：添加表单逻辑和事件处理
> 第四步：接入 API 请求层
> 第五步：添加 loading、error、empty 状态
> 第六步：编写测试
```

:::tip
渐进式生成的好处：每一步都可以在浏览器中预览效果，及时发现 UI 问题。特别是样式和布局，逐步调整比一次性生成更容易控制质量。
:::

### 引用现有组件风格

Claude Code 会自动参考项目中的已有代码。但主动指出参考对象效果更好：

```
> 参考 src/components/ui/UserCard.tsx 的代码风格，
> 创建 ProductCard 组件，包含：
> - 商品图片（懒加载）
> - 商品名称、价格、评分
> - 加入购物车按钮
> - 使用 Tailwind CSS，遵循 UserCard 的布局模式
```

### React 特定提示词

React 项目的组件生成、Hook 开发、状态管理和 API 层的提示词模板，请参考 [React 开发最佳实践 > React 提示词策略](/tips/react-best-practices#react-提示词策略)。

### Vue 特定提示词

Vue 项目的组件生成、Composables 开发、Pinia 状态管理和 Vue Router 的提示词模板，请参考 [Vue 开发最佳实践 > Vue 提示词策略](/tips/vue-best-practices#vue-提示词策略)。

## 测试最佳实践

前端测试的完整指南（TDD 工作流、组件测试、E2E 测试、Mock 策略），请参考 [React 开发最佳实践 > 测试最佳实践](/tips/react-best-practices#测试最佳实践)。

## 构建工具集成

### Vite 项目

Claude Code 可以直接读取和修改 `vite.config.ts`。常用操作：

```
> 在 vite.config.ts 中配置路径别名：@ 指向 src/
```

```
> 配置 rollup-plugin-visualizer 分析打包体积，找出最大的依赖
```

```
> 配置开发服务器代理：/api 代理到 http://localhost:8080
```

:::details Vite 常用提示词模板

```markdown
# 路径别名

> 在 vite.config.ts 中配置路径别名：
>
> - @ → src/
> - @components → src/components
> - @hooks → src/hooks
> - @utils → src/utils
>   同步更新 tsconfig.json 的 paths 配置

# 开发代理

> 配置 Vite 开发服务器代理：
>
> - /api → http://localhost:8080（后端 API）
> - /ws → ws://localhost:8080（WebSocket）
> - 路径重写：去掉 /api 前缀
> - 配置 changeOrigin: true

# 构建优化

> 优化 Vite 生产构建配置：
>
> - 代码分割：将 node_modules 拆分为 vendor chunk
> - 路由级别懒加载（React.lazy + Suspense）
> - 配置 build.rollupOptions.output.manualChunks
> - 开启 CSS 代码分割
> - 压缩配置：terser，移除 console.log
```

:::

### Next.js 项目

```
> 在 next.config.ts 中配置图片域名白名单，允许 images.example.com
```

```
> 配置 Next.js 环境变量：创建 .env.local，定义 NEXT_PUBLIC_API_URL
```

:::info
Next.js App Router 和 Pages Router 的配置方式差异较大。在 CLAUDE.md 中明确标注使用的 Router 类型，避免 Claude 生成错误的路由结构或 API 路由写法。
:::

### 使用 Context7 获取最新文档

前端框架更新频繁，Claude Code 的训练数据可能滞后。通过 [Context7](/guide/advanced/context7) 可以注入最新文档：

```bash
# 安装 Context7 MCP 服务器
claude mcp add context7 -- npx -y @upstash/context7-mcp@latest
```

安装后，Claude Code 可以实时查询：

- React 19 的新特性（Server Components、`use` Hook 等）
- Next.js 15 的 App Router 变更
- Tailwind CSS v4 的配置方式
- Vite 6 的新功能

:::warning
前端框架迭代速度极快——React 19、Next.js 15、Tailwind v4、Vite 6 等大版本在 2024-2025 年密集发布。Claude Code 的训练数据可能不包含最新 API 变更。建议安装 Context7 MCP 服务器，确保生成的代码使用最新语法。
:::

:::tip
本文介绍各工具的独立集成方式。如果你需要了解**工具之间的协作流程**和**完整的实战案例**，请参考 [前端工具链集成全景](/tips/frontend-practices/) — 包含五阶段集成工作流和 6 个详细实战场景。
:::

## 工具链集成

除了上述构建工具外，Claude Code 生态还提供了多个辅助工具，可以在前端开发的不同阶段发挥作用。以下介绍六个核心工具在前端项目中的集成方式和典型用法。

| 工具                                                       | 定位             | 前端核心价值                               | 安装依赖    |
| ---------------------------------------------------------- | ---------------- | ------------------------------------------ | ----------- |
| [ECC](/tips/ecc)                                           | 全能增强系统     | 前端专属 Agent 和 Next.js / React Skills   | Node.js     |
| [Gstack](/guide/advanced/gstack)                           | 虚拟工程团队     | 内置浏览器 QA + 设计审查 + 安全审计        | Bun         |
| [Superpowers](/guide/advanced/superpowers)                 | 结构化开发方法论 | 强制 TDD + 头脑风暴 + 计划驱动开发         | 无（插件）  |
| [CodeGraph](/guide/advanced/code-graph/codegraph)          | 代码知识图谱     | 快速探索组件依赖关系 + 影响分析            | Node.js     |
| [Graphify](/guide/advanced/code-graph/graphify)            | 多模态知识图谱   | 前端代码 + 设计稿 + 文档的统一图谱         | Python      |
| [Serena](/guide/advanced/serena)                           | 代码语义工具     | 符号级精确重构（VS Code / JetBrains 增强） | Python (uv) |
| [Chrome DevTools MCP](/guide/advanced/chrome-devtools-mcp) | 浏览器调试       | 实时调试、性能分析、网络监控               | Node.js     |

:::tip
这七个工具可以组合使用——ECC 提供流程编排，Superpowers 保证开发纪律，CodeGraph 和 Serena 提供代码智能，Graphify 适合设计稿与代码的关联分析，Gstack 负责审查和发布（内置浏览器可直接测试前端应用），Chrome DevTools MCP 提供实时浏览器调试能力。详见[最佳实践](/tips/best-practices)中的四阶段工作流。
:::

### ECC：前端专属增强

[ECC](/tips/ecc)（Enhanced Claude Code）内置了前端语言专属的 Agent 和框架专项 Skill，覆盖 React、Next.js、Vue 等主流前端生态。

#### 前端专属 Agent

| Agent                 | 用途                                        | 典型场景         |
| --------------------- | ------------------------------------------- | ---------------- |
| `typescript-reviewer` | TypeScript 代码审查，检查类型安全、any 滥用 | 审查组件和 Hooks |
| `frontend-patterns`   | 前端编码规范和组件设计模式                  | 组件拆分和复用   |
| `security-reviewer`   | 安全漏洞审查（XSS、CSRF、敏感数据暴露）     | 安全配置审查     |
| `code-reviewer`       | 通用代码质量审查                            | PR 审查          |

#### 前端专项 Skill

| Skill               | 用途                                |
| ------------------- | ----------------------------------- |
| `frontend-patterns` | 前端项目结构和组件设计规范          |
| `nextjs-turbopack`  | Next.js + Turbopack 开发最佳实践    |
| `tdd-workflow`      | 通用 TDD 工作流，适用于前端组件测试 |
| `security-review`   | 安全审查工作流                      |
| `e2e-testing`       | E2E 测试最佳实践（Playwright）      |

#### 使用示例

```
> 使用 ECC 的 typescript-reviewer 审查 UserDashboard.tsx：
> 检查 TypeScript 类型安全、不必要的 re-render、useEffect 清理
```

```
> 使用 frontend-patterns skill 实现用户设置页面：
> 先写组件测试，再实现组件 → Hook → API 层
```

```
> 使用 e2e-testing skill 为登录流程编写 Playwright 测试
```

#### 安装 ECC（前端项目）

```bash
# Plugin 安装
/plugin marketplace add https://github.com/affaan-m/ECC
/plugin install ecc@ecc
```

安装后复制前端 Rules：

```bash
git clone https://github.com/affaan-m/ECC.git && cd ECC
mkdir -p ~/.claude/rules/ecc
cp -R rules/common ~/.claude/rules/ecc/
cp -R rules/typescript ~/.claude/rules/ecc/
```

:::tip
ECC 的 `typescript-reviewer` 会自动检查常见的前端陷阱（如缺少 key、any 类型滥用、useEffect 依赖数组问题、dangerouslySetInnerHTML XSS 风险）。配合 `frontend-patterns` Skill 使用效果最佳。
:::

### Superpowers：结构化前端开发

[Superpowers](/guide/advanced/superpowers) 为前端开发提供严格的 TDD 纪律和计划驱动的开发流程。对 React/Vue 组件开发尤其有价值——它确保每个组件从测试开始构建。

#### 前端 TDD 工作流

Superpowers 的 TDD Skill 会强制执行 RED-GREEN-REFACTOR 循环。对前端项目，这意味着：

```
1. 🔴 RED    — 先写组件测试（Vitest + React Testing Library），运行确认失败
2. 🟢 GREEN  — 写最小实现让测试通过
3. 🔵 REFACTOR — 重构优化，保持测试通过
```

#### 使用示例

```
> 使用 Superpowers 工作流，实现用户设置页面：
> 1. 头脑风暴确认需求（哪些设置项？表单布局？实时保存还是手动保存？）
> 2. 创建 Git Worktree 隔离开发
> 3. 编写计划：拆分为类型定义 → 静态 UI → 表单逻辑 → API 对接 → 测试
> 4. TDD 驱动：每个组件先写测试再实现
> 5. 代码审查：检查 re-render、类型安全、无障碍
```

```
> /superpowers:brainstorming
> 设计一个数据看板页面，需要支持自定义拖拽布局、实时数据刷新、图表联动
```

```
> /superpowers:systematic-debugging
> 页面在 Safari 上样式错乱，Chrome 正常，帮我排查
```

#### 前端调试实战

````text
```text
> /superpowers:systematic-debugging
> 用户反馈页面在某些设备上白屏，控制台报 "Cannot read properties of undefined"
```
````

Superpowers 四阶段排查：

1. **复现**：确认是哪些设备/浏览器？是否与屏幕尺寸相关？
2. **根因**：组件在 SSR 时访问了 `window` 对象，导致 hydration 不匹配
3. **修复**：使用 `useEffect` 延迟访问浏览器 API，添加 SSR 兼容检查
4. **防护**：添加 SSR 渲染测试，防止回归

:::warning
Superpowers 严格执行"先测试后代码"规则。如果代码在测试之前写好，会被要求删除重来。这对习惯了"先写 UI 后补测试"的前端开发者可能需要适应。
:::

:::tip
Superpowers 的头脑风暴阶段对前端开发特别有价值——它会帮你理清 UI/UX 需求中的歧义。比如"用户设置页面"是否需要实时预览、是否支持深色模式切换、表单验证规则是什么。这些前期决策直接影响组件设计和状态管理方案。
:::

### Gstack：前端项目的工程团队

[Gstack](/guide/advanced/gstack) 将 Claude Code 变成虚拟工程团队。对前端项目，Gstack 最大的亮点是**内置浏览器**——基于 Playwright 的 Chromium 可以像真人一样操作前端应用，自动发现交互 Bug。

#### 前端项目常用命令

| 命令                  | 角色           | 前端场景                                     |
| --------------------- | -------------- | -------------------------------------------- |
| `/plan-design-review` | 高级设计师     | 审查 UI 设计质量，检测 AI 风格设计           |
| `/plan-eng-review`    | 工程经理       | 审查前端架构方案（状态管理、路由、组件设计） |
| `/review`             | Staff Engineer | 审查前端代码变更，聚焦生产 Bug               |
| `/qa`                 | QA Lead        | 在真实浏览器中测试前端应用，自动发现 Bug     |
| `/cso`                | 安全负责人     | OWASP Top 10 安全审计，检查 XSS、CSRF        |
| `/ship`               | 发布工程师     | 运行测试，审计覆盖率，推送并创建 PR          |
| `/benchmark`          | 性能工程师     | 测量页面加载时间、Core Web Vitals、资源大小  |

#### 使用示例

```
> /plan-design-review
> 审查用户管理页面的 UI 设计质量
```

```
> /qa https://localhost:5173
> 在真实浏览器中测试前端应用，自动发现交互 Bug
```

```
> /review
> 在 feature/user-settings 分支上审查前端代码变更
```

```
> /benchmark
> 测量首页的 Core Web Vitals 和加载性能
```

:::info
Gstack 的 `/qa` 使用内置的 Playwright 浏览器，会自动遍历页面、填写表单、点击按钮，像真实用户一样操作前端应用。它能发现 Claude Code 仅通过代码审查无法发现的交互 Bug——比如按钮点击无响应、表单提交后状态未更新、移动端布局错乱等。
:::

:::tip
Gstack 的 `/benchmark` 命令可以测量 LCP（Largest Contentful Paint）、FID（First Input Delay）、CLS（Cumulative Layout Shift）等 Core Web Vitals 指标，帮你定位前端性能瓶颈。
:::

### CodeGraph：前端代码探索

[CodeGraph](/guide/advanced/code-graph/codegraph) 为前端项目构建本地代码知识图谱，一次 MCP 调用即可获取完整的组件依赖关系和调用链，避免 Claude Code 反复读取大量 `.tsx` 文件浪费 Token。

#### 前端项目核心能力

| 能力       | 说明                                  | 前端场景                             |
| ---------- | ------------------------------------- | ------------------------------------ |
| 代码探索   | `codegraph_explore` 一次调用回答问题  | "这个项目怎么处理用户认证？"         |
| 影响分析   | `codegraph_impact` 分析修改影响范围   | "改了 useAuth Hook 会影响哪些页面？" |
| 调用链追踪 | `codegraph_trace` 追踪完整调用路径    | "从页面到 API 层的数据流"            |
| 调用者查找 | `codegraph_callers` 查找所有调用者    | "哪些组件使用了 UserCard？"          |
| 受影响测试 | `codegraph affected` 找出受影响的测试 | CI 中只运行受影响的测试              |

#### 框架路由识别

CodeGraph 支持 14 个框架的路由识别，对前端项目特别有用：

| 框架         | 路由识别                            |
| ------------ | ----------------------------------- |
| React Router | 自动识别路由定义和嵌套路由          |
| Next.js      | 识别 App Router / Pages Router 页面 |
| Vue Router   | 识别路由配置和导航守卫              |
| SvelteKit    | 识别文件系统路由                    |

#### 使用示例

```
> 这个前端项目的路由结构是什么？有哪些页面和嵌套路由？
```

CodeGraph 会通过 `codegraph_explore` 一次调用获取所有路由定义、页面组件和布局组件的完整上下文。

```
> 如果我修改 src/stores/authStore.ts，会影响哪些页面和组件？
```

```
> 追踪从登录页面到 API 层的完整数据流
```

#### 安装 CodeGraph

```bash
# npm 安装
npm i -g @colbymchenry/codegraph

# 配置 AI 工具集成
codegraph install

# 初始化项目
cd your-frontend-project
codegraph init -i
```

:::tip
CodeGraph 对前端项目特别有价值——React/Vue 组件的 import 关系复杂，一个组件可能被几十个页面引用。CodeGraph 的 `codegraph_impact` 可以在修改组件前快速了解影响范围，避免改了一个组件导致多个页面出问题。
:::

:::info
CodeGraph 的所有处理都在本地完成——源代码不会发送到外部服务。对企业前端项目，这是一个重要优势。
:::

### Serena：前端符号级重构

[Serena](/guide/advanced/serena) 通过 LSP 为前端项目提供 IDE 级的符号操作能力。对前端项目而言，Serena 最大的价值在于**精确重构**——重命名跨文件的组件和 Hook、移动符号到新模块、安全删除废弃代码。

#### 前端重构场景

| 场景         | Serena 工具                | 说明                                    |
| ------------ | -------------------------- | --------------------------------------- |
| 重命名组件   | `rename_symbol`            | 重命名组件及其所有 import 引用          |
| 重命名 Hook  | `rename_symbol`            | 重命名自定义 Hook 及所有调用处          |
| 提取组件     | `move_symbol`（JetBrains） | 将 JSX 片段提取为独立组件               |
| 移动文件     | `move_file`（JetBrains）   | 移动组件文件并自动更新所有 import       |
| 安全删除     | `safe_delete`（JetBrains） | 删除前检查所有引用，避免破坏其他组件    |
| 查看符号大纲 | `get_symbols_overview`     | 快速了解组件的 Props、State、Hooks 使用 |

#### 使用示例

```
> 把 src/components/UserProfile.tsx 重命名为 AccountProfile.tsx，包括所有页面中的 import
```

Serena 通过 `rename_symbol` 一次调用完成——LSP 精确找到所有引用，原子化替换。

```
> 哪些组件使用了 useAuth Hook？如果修改它的返回值类型会影响什么？
```

```
> 把 useCart Hook 中的 calculateTotal 逻辑提取到 utils/pricing.ts
```

JetBrains 后端的 `move_symbol` 会自动处理 import 更新。

```
> 查看 src/features/dashboard/DashboardPage.tsx 的符号大纲，有哪些组件和 Hook？
```

#### 安装 Serena

```bash
# 安装
uv tool install -p 3.13 serena-agent

# 初始化项目
serena init

# 注册到 Claude Code
claude mcp add --scope user serena -- serena
```

#### 前端推荐配置

```yaml title=".serena/config.yaml"
backend: lsp # 或 "JetBrains"（如果使用 WebStorm/IntelliJ）

tools:
  find_symbol: true
  get_symbols_overview: true
  find_referencing_symbols: true
  rename_symbol: true
  replace_symbol_body: true
  # JetBrains 后端额外可用
  # move_symbol: true
  # move_file: true
  # safe_delete: true
  # 禁用基础工具（Claude Code 已提供）
  read_file: false
  list_dir: false
  execute_shell: false
```

:::tip
Serena + CodeGraph 是前端大型项目的黄金组合：用 CodeGraph 快速探索组件依赖关系和路由结构，用 Serena 进行精确的符号级重构（重命名组件、移动 Hook、提取公共逻辑）。两者通过 MCP 并行运行，互不冲突。
:::

### Chrome DevTools MCP：浏览器实时调试

[Chrome DevTools MCP](/guide/advanced/chrome-devtools-mcp) 是 Chrome 团队提供的 MCP 服务器，通过 Chrome DevTools Protocol 连接浏览器，为 Claude Code 提供实时调试能力。

#### 前端调试场景

| 场景       | Chrome DevTools MCP 能力 | 说明                              |
| ---------- | ------------------------ | --------------------------------- |
| 实时调试   | 直接修改 CSS/HTML        | 在浏览器中实时查看样式修改效果    |
| 性能分析   | 测量 Core Web Vitals     | LCP、FID、CLS 等关键性能指标      |
| 网络调试   | 捕获和分析网络请求       | 查看 API 调用、请求响应、错误状态 |
| 自动化测试 | 验证页面交互             | 表单提交、按钮点击、页面导航      |

#### 使用示例

```
> 使用 Chrome DevTools MCP 检查页面上的登录按钮样式
```

```
> 测量首页的加载时间，找出最慢的资源
```

```
> 监听页面的网络请求，找出失败的 API 调用
```

#### 安装 Chrome DevTools MCP

```bash
# 全局安装
npm install -g chrome-devtools-mcp

# 添加到 Claude Code
claude mcp add chrome-devtools -- npx chrome-devtools-mcp
```

:::tip
Chrome DevTools MCP 特别适合前端开发调试阶段——它可以直接连接到正在运行的开发服务器，实时查看和修改页面样式，无需重启浏览器或等待构建。配合 Gstack 的 `/qa` 命令使用效果最佳：先用 Chrome DevTools MCP 调试样式问题，再用 Gstack 进行完整的 QA 测试。
:::

### Spec-Kit：前端规格驱动开发

[Spec-Kit](/guide/advanced/sdd/spec-kit) 是 GitHub 官方的规格驱动开发工具，对前端项目特别有价值——它让你在写 UI 代码之前，先用结构化规格定义页面行为、交互流程和验收标准，避免"边写边改"的低效模式。

#### 前端项目核心价值

| 阶段     | Spec-Kit 能力                         | 前端场景                                   |
| -------- | ------------------------------------- | ------------------------------------------ |
| 规格编写 | `/speckit.specify` 关注用户故事和行为 | 定义页面的交互流程、表单行为、状态转换规则 |
| 需求澄清 | `/speckit.clarify` 结构化 Q&A         | 澄清响应式断点、加载状态、错误处理、空状态 |
| 技术方案 | `/speckit.plan` 含技术选型理由        | 选择 React vs Vue、状态管理方案、CSS 方案  |
| 任务拆分 | `/speckit.tasks` 带依赖关系           | 将页面拆分为组件、Hook、API 层、测试       |
| 质量分析 | `/speckit.analyze` 跨工件审计         | 检查规格、组件设计、API 契约是否一致       |

#### 使用示例

```
> /speckit.specify
> 为订单管理页面编写规格：
> - 用户可以查看订单列表（支持分页、搜索、筛选）
> - 点击订单行展开详情面板（侧边滑出）
> - 支持批量操作（选择多个订单进行发货、取消）
> - 列表支持拖拽排序
> - 移动端：筛选变为抽屉式弹出，详情变为全屏页
```

```
> /speckit.clarify
> 澄清订单管理页面的交互规格
```

Spec-Kit 会提问：分页是无限滚动还是传统分页？拖拽排序是否持久化？批量操作有确认弹窗吗？

#### 安装 Spec-Kit

```bash
# 安装
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@latest

# 在前端项目中初始化
cd your-frontend-project
specify init . --integration claude
```

:::tip
前端开发中，Spec-Kit 的 `/speckit.specify` 可以替代"手写 PRD + 口头对齐"的模式。把页面的交互规格写成结构化文档后，Claude Code 生成的组件代码更准确，减少反复修改。特别适合多人协作的大型前端项目。
:::

### Git 工作流集成

前端项目的 Git 工作流直接影响多人协作效率和代码质量。Claude Code 可以自动化大部分 Git 操作，结合工具链实现从开发到发布的无缝衔接。

#### 前端项目分支策略

推荐使用 **feature branch → PR → review → merge** 的标准流程：

```
main (生产)
  └── develop (开发主线)
       ├── feature/user-settings  (功能分支)
       ├── feature/order-list     (功能分支)
       └── fix/mobile-layout      (修复分支)
```

:::tip
对前端项目，建议按功能模块（而非页面）创建分支。一个功能分支可能涉及多个页面和组件，但它们在业务逻辑上是内聚的。这样 PR 审查时更容易理解变更的完整上下文。
:::

#### Conventional Commits 规范

前端项目推荐使用 Conventional Commits，便于自动生成 changelog 和语义化版本管理：

| 类型       | 说明               | 前端示例                                        |
| ---------- | ------------------ | ----------------------------------------------- |
| `feat`     | 新功能             | `feat(dashboard): add real-time chart widget`   |
| `fix`      | Bug 修复           | `fix(auth): prevent token expiry redirect loop` |
| `refactor` | 重构（不改变功能） | `refactor(hooks): extract usePagination logic`  |
| `perf`     | 性能优化           | `perf(list): virtualize long product list`      |
| `style`    | 样式调整           | `style(header): adjust mobile nav spacing`      |
| `test`     | 测试相关           | `test(login): add E2E test for SSO flow`        |
| `docs`     | 文档更新           | `docs(readme): update setup instructions`       |

Claude Code 默认会使用 Conventional Commits 格式，你可以在提示词中指定 scope：

```
> 提交当前更改，scope 使用 dashboard，类型使用 feat
```

#### Git Worktree 隔离开发

Superpowers 推荐使用 Git Worktree 隔离开发环境，避免分支切换时的依赖冲突：

```bash
# 创建 worktree（Superpowers 会自动执行）
git worktree add ../project-feature-user-settings -b feature/user-settings

# 在 worktree 中独立开发
cd ../project-feature-user-settings
# 安装依赖、启动开发服务器、运行测试 — 互不影响

# 开发完成后清理
git worktree remove ../project-feature-user-settings
```

:::info
Git Worktree 对前端项目特别有价值——不同分支可能有不同的 `node_modules` 依赖版本，频繁 `git checkout` 会导致 `node_modules` 不一致。Worktree 让每个分支拥有独立的工作目录，彻底避免这个问题。
:::

#### Claude Code Git 操作示例

```
# 提交更改
> 提交当前更改，使用 feat 类型，scope 为 dashboard

# 创建分支
> 从 develop 创建新分支 feature/product-filter

# 推送并创建 PR
> 推送当前分支到远程，并创建 PR，标题为 "feat(dashboard): add product filter"

# 解决冲突
> 当前分支与 develop 有冲突，帮我解决冲突并提交
```

#### 工具链协作

Superpowers + GStack 的 Git 集成工作流：

1. **Superpowers** 在 `feature/*` 分支上进行 TDD 开发，每个组件完成后自动提交
2. **GStack `/ship`** 运行全量测试、审计覆盖率、推送代码并自动创建 PR
3. **GStack `/review`** 在 PR 上进行代码审查，聚焦生产 Bug 和性能问题

```
> /superpowers:test-driven-development
> 实现用户设置页面的头像上传功能
> 开发完成后 /ship 推送并创建 PR
```

这个工作流确保了：功能分支隔离 → TDD 保证质量 → 自动化 PR 创建 → 代码审查闭环。

### 工具链组合实战

以下是前端项目中常见的工具组合场景：

#### 场景一：新页面开发（完整流程）

**适用条件：** 从零构建新功能页面，涉及多个组件和 API 对接 | **预计用时：** 2-4 小时

```
1. Superpowers: /superpowers:brainstorming 探索 UI/UX 需求（布局？交互？响应式？）
2. Gstack: /plan-design-review 审查设计方案
3. CodeGraph: codegraph_explore 理解现有路由和组件结构
4. Superpowers: TDD 驱动实现 → 每个组件先写测试
5. ECC: typescript-reviewer 审查代码 → security-reviewer 安全审查
6. Chrome DevTools MCP: 实时调试页面样式和交互
7. Gstack: /qa 在浏览器中测试 → /ship 推送并创建 PR
```

#### 场景二：组件库重构（语义驱动）

**适用条件：** 已有组件库需要重命名、移动或提取公共逻辑 | **预计用时：** 3-6 小时

```
1. CodeGraph: codegraph_impact 分析组件修改影响范围
2. Serena: find_referencing_symbols 追踪所有 import 引用
3. Gstack: /plan-eng-review 审查重构方案
4. Serena: rename_symbol / move_symbol 精确重构
5. CodeGraph: codegraph_impact 验证变更完整性
6. Gstack: /review 审查 → /qa 浏览器回归测试
```

#### 场景三：前端性能优化

**适用条件：** 页面加载慢、Lighthouse 评分低、用户反馈卡顿 | **预计用时：** 1-3 小时

```
1. Gstack: /benchmark 测量 Core Web Vitals 和加载性能
2. CodeGraph: codegraph_trace 追踪关键渲染路径的组件链
3. ECC: frontend-patterns skill 分析性能瓶颈
4. Superpowers: TDD 驱动优化（先写性能基准测试）
5. Gstack: /benchmark 验证优化效果
```

#### 场景四：遗留前端项目接管

**适用条件：** 接手他人维护的前端项目，需要快速理解代码结构 | **预计用时：** 1-2 小时（探索阶段）

```
1. CodeGraph: codegraph_explore 快速理解路由结构和组件关系
2. Serena: get_symbols_overview 梳理核心组件的 Props 和 Hooks
3. Gstack: /office-hours 梳理产品需求
4. ECC: typescript-reviewer 识别代码问题 → security-reviewer 安全扫描
5. Superpowers: TDD 驱动渐进式重构，每步都有测试覆盖
```

#### 场景五：大型前端功能开发（规格驱动）

**适用条件：** 跨多个模块的复杂功能，需要结构化需求分析 | **预计用时：** 4-8 小时

```
1. Gstack: /office-hours 探索产品需求 → /plan-design-review 审查设计方案
2. Spec-Kit: /speckit.specify 编写页面交互规格 → /speckit.clarify 澄清边界情况
3. Spec-Kit: /speckit.plan 生成前端技术方案（组件拆分、状态设计、API 契约）
4. Spec-Kit: /speckit.analyze 验证规格与技术方案的一致性
5. Superpowers: TDD 驱动实现 → 每个组件先写测试
6. Gstack: /qa 在浏览器中测试 → /ship 推送并创建 PR
```

:::info
工具组合的核心原则：**CodeGraph / Serena 提供代码智能 → Superpowers / ECC 保证开发纪律 → Gstack 负责审查和发布（内置浏览器测试）**。根据项目规模灵活组合，小型页面可以跳过 Gstack 的规划阶段直接 TDD，大型重构则需要完整的 CodeGraph 影响分析 + Gstack 设计审查。
:::

## 常见场景

### 页面全栈生成、表单处理、状态管理、API 集成、组件库集成

React 生态中常见的页面生成、表单（React Hook Form）、状态管理（Zustand）、API 集成（React Query）、组件库集成（shadcn/ui）等场景的提示词模板，请参考 [React 开发最佳实践 > 常见场景](/tips/react-best-practices#常见场景)。

### 响应式布局

```
> 创建 Dashboard 布局组件：
> - 顶部导航栏：Logo、搜索框、用户头像下拉菜单
> - 左侧边栏：可折叠菜单，支持多级嵌套
> - 主内容区域：自适应宽度
> - 移动端：侧边栏变为抽屉式弹出
> - 使用 Tailwind CSS 响应式断点
> - 侧边栏展开/折叠状态持久化到 localStorage
```

### 动画与交互

```
> 使用 Framer Motion 为列表页面添加动画：
> - 列表项进入时：从下方淡入 + 滑入（stagger 100ms）
> - 列表项删除时：向右滑出 + 淡出
> - 卡片 hover 时：轻微上浮 + 阴影加深
> - 页面切换时：淡入淡出过渡
> - 加载更多时：底部 Skeleton 渐入
```

## 代码审查与重构

React 组件的代码审查、拆分重构、性能优化和 TypeScript 类型安全的提示词模板，请参考 [React 开发最佳实践 > 代码审查与重构](/tips/react-best-practices#代码审查与重构)。

## 自动化与 CI/CD

### Hooks 集成

使用 [Hooks](/guide/advanced/hooks) 在 Claude Code 操作前后自动执行前端项目任务：

```json title=".claude/settings.json"
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_FILE_PATHS\" | grep -qE '\\.(tsx?|css)$'; then npx prettier --write $CLAUDE_FILE_PATHS 2>/dev/null || true; fi"
          }
        ]
      }
    ]
  }
}
```

这个 Hook 在 Claude Code 修改 `.tsx`、`.ts` 或 `.css` 文件后自动运行 Prettier 格式化。

:::details 更多前端 Hooks 示例

```json title=".claude/settings.json"
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "if echo \"$CLAUDE_FILE_PATHS\" | grep -qE '\\.tsx?$'; then npx eslint --fix $CLAUDE_FILE_PATHS 2>/dev/null || true; fi"
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "npx tsc --noEmit 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

- `PostToolUse` Hook：修改 TypeScript 文件后运行 ESLint 自动修复
- `Stop` Hook：Claude Code 完成任务后运行 TypeScript 类型检查

:::

### 集成到 CI/CD

在 CI 流水线中使用 Claude Code 进行代码审查：

```yaml title=".github/workflows/ai-review.yml"
name: AI Code Review
on:
  pull_request:
    paths:
      - 'src/**'
      - '*.tsx'
      - '*.ts'

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          review_path: src/
          prompt: |
            审查这个 PR 中的前端代码变更：
            1. 检查组件是否遵循项目的目录结构约定
            2. 检查 TypeScript 类型是否完整（无 any）
            3. 检查是否有不必要的 re-render
            4. 检查是否有 XSS 风险
            5. 检查测试覆盖是否充分
            6. 检查无障碍（a11y）问题
```

### 自定义 Skills

:::tip
创建自定义 Skills 的基础知识请参考[自定义技能](/skills/overview/custom-skills)。以下是一个前端专用 Skill 的示例。
:::

为前端项目创建专用 Skill，标准化常见操作：

```markdown title=".claude/skills/create-page/SKILL.md"
# 创建页面

根据需求创建完整的前端页面，包含路由、组件、API 对接和测试。

## 步骤

1. 创建页面路由和布局组件
2. 创建页面的主要 UI 组件
3. 添加 TypeScript 类型定义
4. 接入 API 数据层（React Query）
5. 添加表单处理（如需要，使用 React Hook Form + Zod）
6. 添加加载状态、错误状态和空状态
7. 编写组件测试
8. 运行测试和类型检查确认通过

## 约定

- 使用项目的组件库（shadcn/ui / Ant Design / MUI）
- 遵循现有的目录结构和命名规范
- 所有交互元素需要无障碍标签（aria-label）
- 使用 Tailwind CSS 编写样式
```

使用时只需：

```
> /create-page
> 创建商品管理页面，包含列表、搜索、创建表单和详情弹窗
```

## 推荐 Skills

:::tip
更多 Skills 发现渠道（skills.sh、CC-Switch、ctx7 CLI）请参考[技能市场](/skills/overview/skills-marketplace)。全部 Skills 内容请访问[技能系统](/skills/)。
:::

除了自建 Skills，社区也提供了许多高质量的前端 Skills。通过 `skills.sh` 可以一键安装和管理：

```bash
# 安装 Skills CLI
npm install -g skills

# 从 skills.sh 安装社区 Skill
npx skills add <skill-url>
```

以下是推荐的前端开发 Skills：

| Skill                   | 来源           | 用途                                                     |
| ----------------------- | -------------- | -------------------------------------------------------- |
| `design-taste-frontend` | 社区           | 反 AI 平庸设计框架——三旋钮 + Pre-Flight Check + 改造审计 |
| `frontend-design`       | Anthropic 官方 | 创建独特、高品质的前端界面，避免 AI 风格设计             |
| `web-design-guidelines` | Vercel Labs    | 100+ 条 Web 界面最佳实践规则                             |
| `ui-ux-pro-max`         | 社区           | 全栈 UI/UX 设计系统，覆盖 10 个技术栈                    |
| `unjs`                  | 社区           | UnJS 生态 60+ 个高质量 JavaScript 库                     |

完整的 Skills 介绍、安装方式和使用示例，请参考 [前端通用 Skills](/skills/frontend/frontend)。

### React 生态 Skills

React Best Practices、Composition Patterns、shadcn/ui 等 React 专属 Skills 的详细介绍和安装方式，请参考 [React 生态 Skills](/skills/frontend/react)。

### Vue 生态 Skills

Vue Best Practices、Pinia、VueUse Functions、Vite、Vue Router Best Practices 等 Vue 专属 Skills 的详细介绍和安装方式，请参考 [Vue 生态 Skills](/skills/frontend/vue)。

## 注意事项

### 框架版本兼容性

Claude Code 可能使用你项目中未使用或已过时的 API。在 CLAUDE.md 中明确标注框架版本：

```markdown title="CLAUDE.md（片段）"
## 框架版本

本项目使用以下版本，请使用对应的 API：

- React 19：使用 useActionState、useOptimistic，不用已废弃的 forwardRef
- Next.js 15：App Router，不用 Pages Router（getServerSideProps 等）
- Tailwind CSS 4：使用 @theme 指令，不用旧版 tailwind.config.ts
```

:::warning
如果你不指定框架版本，Claude 可能生成过时的代码——如 React 17 的 class 组件、Next.js 的 Pages Router、或已废弃的 API。这对前端项目尤其常见，因为框架迭代快。
:::

### 常见陷阱

| 陷阱           | 说明                                    | 解决方案                     |
| -------------- | --------------------------------------- | ---------------------------- |
| CSS 方案不一致 | Claude 可能混用 Tailwind 和 CSS Modules | 在 CLAUDE.md 中指定 CSS 方案 |

React 专属的常见陷阱（forwardRef 废弃、Pages/App Router 混淆、key prop 缺失、服务端/客户端组件混淆等），请参考 [React 开发最佳实践 > 常见陷阱](/tips/react-best-practices#常见陷阱)。

Vue 专属的常见陷阱（Options API vs Composition API 混用、reactive 解构丢失响应性、v-for key 使用 index 等），请参考 [Vue 开发最佳实践 > 常见陷阱](/tips/vue-best-practices#常见陷阱)。

### 效率提示

```
# 使用 /compact 压缩上下文
> /compact 保留 React 和 TypeScript 相关的上下文

# 使用 /clear 重新开始
> 当切换到不相关的功能模块时，用 /clear 清除上下文避免干扰

# 使用 Context7 获取最新文档
> 查询 Next.js 15 的 Server Actions 用法

# 使用 CodeGraph 分析代码关系
> codegraph_explore 这个项目的认证流程是什么？

# 使用 Serena 精确重构
> 把 UserProfile 组件重命名为 AccountProfile，包括所有 import
```

:::tip
在大型前端项目中，CodeGraph 可以显著减少 Claude Code 的 Token 消耗——一次 `codegraph_explore` 调用替代多次 `Grep` + `Read`，Token 节省可达 57%。详见 [CodeGraph 代码智能](/guide/advanced/code-graph/codegraph)。
:::

## 提示词模板库

React 组件开发、自定义 Hook、API 集成、表单页面、页面布局等场景的提示词模板，请参考 [React 开发最佳实践 > 提示词模板库](/tips/react-best-practices#提示词模板库)。

以下是工具链相关的前端提示词模板：

:::details ECC 组件审查

```
> 使用 ECC 的 typescript-reviewer 审查 [ComponentName].tsx：
> 1. 检查 TypeScript 类型安全（是否有 any、类型断言过多）
> 2. 检查是否有不必要的 re-render（缺少 memo、依赖数组问题）
> 3. 检查 useEffect 的清理函数是否正确
> 4. 检查是否有 XSS 风险（dangerouslySetInnerHTML）
> 5. 检查无障碍问题（缺少 aria-label、键盘导航）
```

:::

:::details CodeGraph 组件影响分析

```
> 我要修改 [HookName] Hook 的返回值类型：
> 1. 用 codegraph_impact 分析影响范围
> 2. 列出所有使用该 Hook 的页面和组件
> 3. 列出所有受影响的测试
> 4. 给出安全修改的步骤建议
```

:::

:::details Serena 精确重构

```
> 重构 [FeatureName] 模块：
> 1. 用 find_referencing_symbols 找出 [OldComponentName] 的所有引用
> 2. 将 [OldComponentName] 重命名为 [NewComponentName]
> 3. 将 [HookName] 中的 [extractedLogic] 提取到 [TargetHook]
> 4. 验证所有测试仍然通过
```

:::

:::details Superpowers TDD 组件

```
> /superpowers:test-driven-development
> 实现 [ComponentName] 组件：
> 1. 先写组件测试（Vitest + React Testing Library）
> 2. 运行 pnpm test 确认失败
> 3. 实现静态 UI（JSX + Tailwind CSS）
> 4. 添加交互逻辑和状态管理
> 5. 接入 API 层（React Query）
> 6. 添加 loading、error、empty 状态
> 7. 运行 pnpm test 确认全部通过
```

:::

:::details Gstack 浏览器 QA

```
> /qa https://localhost:5173
> 测试 [PageName] 页面：
> - 表单提交流程是否正常
> - 响应式布局在移动端是否正确
> - 错误状态是否有友好提示
> - 加载状态是否有 Skeleton
> - 页面导航是否流畅
```

:::
