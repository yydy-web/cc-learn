---
title: 前端开发最佳实践
description: 使用 Claude Code 进行前端开发的完整指南，涵盖提示词策略、测试、组件开发和自动化工作流
---

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

````markdown
# 路径别名
> 在 vite.config.ts 中配置路径别名：
> - @ → src/
> - @components → src/components
> - @hooks → src/hooks
> - @utils → src/utils
> 同步更新 tsconfig.json 的 paths 配置

# 开发代理
> 配置 Vite 开发服务器代理：
> - /api → http://localhost:8080（后端 API）
> - /ws → ws://localhost:8080（WebSocket）
> - 路径重写：去掉 /api 前缀
> - 配置 changeOrigin: true

# 构建优化
> 优化 Vite 生产构建配置：
> - 代码分割：将 node_modules 拆分为 vendor chunk
> - 路由级别懒加载（React.lazy + Suspense）
> - 配置 build.rollupOptions.output.manualChunks
> - 开启 CSS 代码分割
> - 压缩配置：terser，移除 console.log
````
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

````json title=".claude/settings.json"
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
````

这个 Hook 在 Claude Code 修改 `.tsx`、`.ts` 或 `.css` 文件后自动运行 Prettier 格式化。

:::details 更多前端 Hooks 示例

````json title=".claude/settings.json"
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
````

- `PostToolUse` Hook：修改 TypeScript 文件后运行 ESLint 自动修复
- `Stop` Hook：Claude Code 完成任务后运行 TypeScript 类型检查

:::

### 集成到 CI/CD

在 CI 流水线中使用 Claude Code 进行代码审查：

````yaml title=".github/workflows/ai-review.yml"
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
````

### 自定义 Skills

:::tip
创建自定义 Skills 的基础知识请参考[自定义技能](/skills/overview/custom-skills)。以下是一个前端专用 Skill 的示例。
:::

为前端项目创建专用 Skill，标准化常见操作：

````markdown title=".claude/skills/create-page/SKILL.md"
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
````

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

### Frontend Design（Anthropic 官方）

[frontend-design](https://www.skills.sh/anthropics/skills/frontend-design) 是 Anthropic 官方出品的设计技能，帮助 Claude Code 创建独特、高品质的前端界面，避免千篇一律的 "AI 风格" 设计。

```bash
npx skills add https://github.com/anthropics/skills --skill frontend-design
```

**核心能力：**

| 特性 | 说明 |
|------|------|
| 美学方向规划 | 在编码前引导选择视觉方向（极简、复古未来、奢华、有机等） |
| 设计基础要素 | 强调排版、CSS 变量主题、动效、空间构图和纹理细节 |
| 多框架支持 | 生成 HTML/CSS/JS、React 或 Vue 代码 |
| 反平庸设计 | 避免过度使用的字体、陈旧配色和可预测布局 |

:::tip
使用 `frontend-design` 前，先用自然语言描述你想要的视觉风格和目标受众，Claude Code 会根据这些信息生成更有针对性的设计方案。
:::

### Web Design Guidelines（Vercel）

[web-design-guidelines](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines) 来自 Vercel Labs，提供 100+ 条 Web 界面最佳实践规则，用于审查 UI 代码的合规性。

```bash
npx skills add vercel-labs/agent-skills
```

**审查维度：**

| 维度 | 规则示例 |
|------|----------|
| 无障碍 | ARIA 标签、语义化 HTML、键盘导航 |
| 表单 | autocomplete、校验和错误处理 |
| 动画 | prefers-reduced-motion、合成器友好变换 |
| 图片 | 尺寸声明、懒加载、alt 文本 |
| 性能 | 虚拟化、布局抖动避免、preconnect |
| 深色模式 | color-scheme、theme-color meta 标签 |
| 国际化 | Intl.DateTimeFormat、Intl.NumberFormat |
| 触控交互 | touch-action 属性、tap-highlight 处理 |

:::info
安装后，直接让 Claude Code "审查我的 UI" 或 "检查无障碍合规性"，它会自动应用这 100+ 条规则进行审查。
:::

### UI/UX Pro Max

[ui-ux-pro-max](https://www.skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max) 是一个全面的设计智能系统，覆盖 10 个技术栈，内置设计系统生成和产品级 UI/UX 建议。

```bash
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
```

**内置资源：**

| 资源 | 数量 |
|------|------|
| 设计风格 | 50+ 种 |
| 配色方案 | 161 个 |
| 字体搭配 | 57 组 |
| UX 规则 | 99 条（无障碍、触控、性能、响应式） |
| 图表类型 | 25 种 |
| 产品模式 | 161 种（含推理规则） |
| 预建模板 | 网站、落地页、仪表盘、管理后台、电商、SaaS 等 |

**支持的技术栈：** React、Next.js、Vue、Svelte、SwiftUI、React Native、Flutter、Tailwind、shadcn/ui、HTML/CSS

:::tip
这个 Skill 特别适合从零开始设计页面——告诉 Claude Code 你的产品类型（如"SaaS 仪表盘"或"电商落地页"），它会自动推荐配色、排版、布局和组件组合。
:::

### UnJS

[unjs](https://www.skills.sh/hairyf/skills/unjs) 提供 UnJS（Unified JavaScript）生态系统的完整知识，涵盖 60+ 个高质量、单一用途的 JavaScript 库和工具。这些库设计为可独立使用，也可协同工作，适用于任何 JavaScript 运行环境。

```bash
npx skills add https://github.com/hairyf/skills --skill unjs
```

#### HTTP & 服务端

| 包 | 说明 |
|-----|------|
| **H3** | 轻量级 HTTP 框架，高性能且可移植 |
| **Nitro** | 通用 Web 服务器框架，可在任何环境运行（Node.js、Deno、Bun、Workers） |
| **Listhen** | 优雅的 HTTP 监听器，适用于 Node.js 和边缘环境 |

#### HTTP 客户端 & WebSocket

| 包 | 说明 |
|-----|------|
| **Ofetch** | 更好的 fetch API，适用于 Node.js、浏览器和 Workers |
| **Httpxy** | 全功能 HTTP 和 WebSocket 代理 |
| **Crossws** | 跨平台 WebSocket 服务器（Node.js、Deno、Bun、Cloudflare Workers） |
| **Cookie-es** | ESM cookie 序列化和反序列化 |
| **Node-fetch-native** | node-fetch 的优化重分发版本 |

#### 路由 & 请求处理

| 包 | 说明 |
|-----|------|
| **Radix3** | 基于 Radix Tree 的轻量快速路由器 |
| **Hookable** | 可等待的 Hooks 系统，用于插件和扩展 |
| **Unctx** | 在原生 JavaScript 中使用组合式模式（composables） |

#### 工具库

| 包 | 说明 |
|-----|------|
| **Defu** | 递归默认属性合并 |
| **Destr** | 快速安全的 JSON.parse 替代方案 |
| **Ohash** | 基于 murmurhash3 的快速哈希 |
| **Pathe** | 跨平台路径工具，替代 Node.js path |
| **UFO** | URL 解析、格式化和操作工具 |
| **Scule** | 字符串大小写转换（camelCase、kebab-case 等） |
| **Perfect-debounce** | 支持 Promise 和 async 函数的防抖 |
| **Get-port-please** | 获取可用端口 |

#### 存储 & 数据

| 包 | 说明 |
|-----|------|
| **Unstorage** | 异步键值存储 API，支持多种驱动（文件系统、Redis、localStorage 等） |
| **Db0** | 轻量级 SQL 连接器 |
| **Mongoz** | 零配置 MongoDB 服务器 |

#### 环境 & 运行时

| 包 | 说明 |
|-----|------|
| **Unenv** | 将 JavaScript 代码转换为运行时无关 |
| **Std-env** | 标准环境变量工具 |

#### 配置管理

| 包 | 说明 |
|-----|------|
| **C12** | 智能配置加载器 |
| **Confbox** | 紧凑的 YAML、TOML、JSONC、JSON5 解析器 |
| **Rc9** | 简化的配置读写 |

#### 构建工具

| 包 | 说明 |
|-----|------|
| **Unbuild** | 统一 JavaScript 构建系统 |
| **Mkdist** | 从源码生成分发文件 |
| **Unplugin** | 统一插件系统，支持 Vite、Rollup、webpack、esbuild |
| **Webpackbar** | webpack 3/4/5 进度条和性能分析器 |
| **Nanotar** | 适用于任何 JS 运行时的轻量 Tar 工具 |

#### 模块系统 & 代码生成

| 包 | 说明 |
|-----|------|
| **Jiti** | 运行时 TypeScript 和 ESM 支持 |
| **Mlly** | ECMAScript 模块工具 |
| **Unimport** | 模块自动导入 API |
| **Magicast** | 编程方式修改 JS/TS 源码 |
| **Magic-regexp** | 编译时移除的类型安全可读正则表达式 |
| **Knitwork-X** | 安全 JavaScript 代码生成工具 |

#### 类型系统 & 日志

| 包 | 说明 |
|-----|------|
| **Untyped** | 从配置对象生成类型和 Markdown |
| **Consola** | 优雅的控制台包装器，支持多种报告器 |

#### CLI & 脚手架

| 包 | 说明 |
|-----|------|
| **Citty** | 优雅的 CLI 构建器，类型安全命令 |
| **Giget** | 下载模板和 Git 仓库 |
| **Nypm** | 统一 Node.js 包管理器 |
| **Pkg-types** | package.json 和 tsconfig.json 的工具和类型定义 |

#### 图片处理

| 包 | 说明 |
|-----|------|
| **IPX** | 基于 Sharp/libvips 的高性能图片代理 |
| **Image-meta** | 纯 JavaScript 检测图片类型和尺寸 |
| **Fontaine** | 基于字体度量的自动字体回退 |

#### 文档 & Markdown

| 包 | 说明 |
|-----|------|
| **Automd** | 自动化 Markdown 维护 |
| **Changelogen** | 使用 Conventional Commits 生成变更日志 |
| **Mdbox** | 简单 Markdown 工具 |
| **Undocs** | 最小化文档主题和 CLI |

#### Web API & 加密

| 包 | 说明 |
|-----|------|
| **Unhead** | 通用文档 head 标签管理器 |
| **Uncrypto** | 通用加密 API（Node.js、浏览器、Edge） |
| **Ungh** | GitHub API 无限制访问 |
| **Unpdf** | PDF 工具（Node.js、浏览器、Workers） |
| **Unwasm** | WebAssembly 工具 |
| **Uqr** | 通用 QR 码生成（ANSI、Unicode、SVG） |
| **Untun** | 通过 Cloudflare Quick Tunnels 暴露本地 HTTP 服务 |

:::info
UnJS 的包大多被 Nuxt 3 和 Nitro 内部使用。即使你的项目不是 Nuxt，这些独立包也可以在任何 JavaScript 项目中使用——例如 `ofetch` 替代 `axios`，`c12` 加载配置文件，`consola` 替代 `console.log`。
:::

### React 生态 Skills

React Best Practices、Composition Patterns、shadcn/ui 等 React 专属 Skills 的详细介绍和安装方式，请参考 [React 开发最佳实践 > 推荐 React Skills](/tips/react-best-practices#推荐-react-skills)。

### Vue 生态 Skills

Vue Best Practices、Pinia、VueUse Functions、Vite、Vue Router Best Practices 等 Vue 专属 Skills 的详细介绍和安装方式，请参考 [Vue 开发最佳实践 > 推荐 Vue Skills](/tips/vue-best-practices#推荐-vue-skills)。

## 注意事项

### 框架版本兼容性

Claude Code 可能使用你项目中未使用或已过时的 API。在 CLAUDE.md 中明确标注框架版本：

````markdown title="CLAUDE.md（片段）"
## 框架版本

本项目使用以下版本，请使用对应的 API：
- React 19：使用 useActionState、useOptimistic，不用已废弃的 forwardRef
- Next.js 15：App Router，不用 Pages Router（getServerSideProps 等）
- Tailwind CSS 4：使用 @theme 指令，不用旧版 tailwind.config.ts
````

:::warning
如果你不指定框架版本，Claude 可能生成过时的代码——如 React 17 的 class 组件、Next.js 的 Pages Router、或已废弃的 API。这对前端项目尤其常见，因为框架迭代快。
:::

### 常见陷阱

| 陷阱 | 说明 | 解决方案 |
|------|------|----------|
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
> 分析 src/components/ 中组件的依赖关系图
```

## 提示词模板库

React 组件开发、自定义 Hook、API 集成、表单页面、页面布局等场景的提示词模板，请参考 [React 开发最佳实践 > 提示词模板库](/tips/react-best-practices#提示词模板库)。
