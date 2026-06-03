---
title: 前端开发最佳实践
description: 使用 Claude Code 进行前端开发的完整指南，涵盖项目配置、提示词策略、测试、组件开发和自动化工作流
---

# 前端开发最佳实践

Claude Code 对前端生态（React、Vue、Next.js、TypeScript、Vite 等）有天然的优势——训练数据中前端代码占比高，生成质量好。本文介绍如何在前端项目中高效使用 Claude Code，从项目配置到自动化工作流的最佳实践。

## 项目结构配置

### React + Vite 项目结构

Claude Code 通过文件系统理解项目。清晰的目录结构能帮助 Claude 更准确地定位代码：

```
my-react-app/
├── CLAUDE.md                         ← 项目约定和上下文
├── package.json                      ← 依赖和脚本
├── vite.config.ts                    ← Vite 构建配置
├── tsconfig.json                     ← TypeScript 配置
├── src/
│   ├── main.tsx                      ← 入口文件
│   ├── App.tsx                       ← 根组件
│   ├── components/                   ← 通用组件
│   │   ├── ui/                       ← 基础 UI 组件（Button, Input 等）
│   │   └── layout/                   ← 布局组件（Header, Sidebar 等）
│   ├── features/                     ← 功能模块（按业务划分）
│   │   └── auth/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types.ts
│   ├── hooks/                        ← 全局自定义 Hooks
│   ├── services/                     ← API 请求层
│   ├── stores/                       ← 状态管理
│   ├── types/                        ← 全局类型定义
│   ├── utils/                        ← 工具函数
│   └── styles/                       ← 全局样式
├── public/
└── tests/
```

:::tip
在 CLAUDE.md 中说明目录约定（如 `features/` 按业务划分，`components/` 存放通用组件），Claude Code 会自动遵循这个结构生成新文件。
::::

### Next.js App Router 项目结构

```
my-next-app/
├── CLAUDE.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── src/
│   ├── app/
│   │   ├── layout.tsx                ← 根布局
│   │   ├── page.tsx                  ← 首页
│   │   ├── globals.css
│   │   ├── (auth)/                   ← 路由组（不影响 URL）
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx            ← 嵌套布局
│   │       ├── page.tsx
│   │       └── loading.tsx           ← Loading UI
│   ├── components/                   ← 共享组件
│   ├── lib/                          ← 工具库（db, auth, utils）
│   └── middleware.ts                 ← 中间件
├── public/
└── tests/
```

:::tip
Next.js App Router 使用文件系统路由，`page.tsx`、`layout.tsx`、`loading.tsx` 等文件名有特殊含义。在 CLAUDE.md 中注明你的路由约定，避免 Claude 生成错误的文件结构。
::::

### Vue 3 + Vite 项目结构

```
my-vue-app/
├── CLAUDE.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── components/                   ← 通用组件
│   │   ├── ui/                       ← 基础 UI 组件
│   │   └── layout/                   ← 布局组件
│   ├── composables/                  ← 组合式函数（类似 React Hooks）
│   ├── views/                        ← 页面级组件
│   ├── router/                       ← Vue Router 配置
│   │   └── index.ts
│   ├── stores/                       ← Pinia 状态管理
│   │   └── counter.ts
│   ├── types/                        ← 类型定义
│   ├── utils/                        ← 工具函数
│   └── styles/                       ← 全局样式
├── public/
└── tests/
```

:::tip
Vue 项目的 `composables/` 目录对应 React 的 `hooks/`，`views/` 对应页面级组件。在 CLAUDE.md 中说明使用 Composition API（`<script setup>`）还是 Options API，避免 Claude 生成风格不一致的代码。
::::

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
::::

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
::::

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

````markdown title="常用提示词模板"
# 组件生成
> 创建 DataTable 组件，使用 @tanstack/react-table：
> - 支持列排序、筛选、分页
> - 支持行选择（checkbox）
> - TypeScript 泛型：DataTable<T>
> - 使用 shadcn/ui 的 Table 组件渲染
> - 列定义使用 ColumnDef<T>[]

# 自定义 Hook
> 创建 useDebounce<T> Hook：
> - 泛型支持任意值类型
> - 参数：value: T, delay: number
> - 返回防抖后的值
> - 包含 TypeScript 类型定义
> - 编写 Vitest 测试覆盖：值变化延迟、组件卸载清理

# 状态管理
> 创建购物车 Zustand store：
> - items: CartItem[]（含 product, quantity）
> - actions: addItem, removeItem, updateQuantity, clearCart
> - computed: totalPrice, totalItems
> - 使用 immer 中间件处理嵌套更新
> - 持久化到 localStorage

# API 层
> 创建用户 API 服务层：
> - 使用 React Query（@tanstack/react-query）管理缓存
> - axios 实例配置 baseURL 和拦截器
> - 包含：getUserList, getUserById, createUser, updateUser, deleteUser
> - 每个方法包含 TypeScript 类型
> - 错误处理：统一错误响应类型 ApiError
````

## 测试最佳实践

### TDD 工作流

Claude Code 完美支持前端的 TDD 工作流。以下是一个典型的对话：

```
> 用 TDD 方式实现搜索框组件：
> 1. 先写 SearchBox 的组件测试，覆盖以下场景：
>    - 渲染输入框和搜索按钮
>    - 输入文字后显示清除按钮
>    - 点击搜索按钮触发 onSearch 回调
>    - 按 Enter 键触发搜索
>    - 输入为空时搜索按钮禁用
> 2. 运行测试确认失败
> 3. 写最小实现让测试通过
> 4. 重构优化
```

### 组件测试生成

让 Claude Code 为现有组件生成测试：

```
> 为 src/components/ui/UserCard.tsx 编写组件测试：
> - 使用 Vitest + React Testing Library
> - 测试渲染用户名称和邮箱
> - 测试点击编辑按钮触发回调
> - 测试无头像时显示默认占位图
> - 使用 userEvent 模拟用户交互
```

Claude Code 会生成类似如下的测试：

```tsx title="UserCard.test.tsx"
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UserCard } from './UserCard';

const mockUser = {
  id: '1',
  name: '张三',
  email: 'zhangsan@example.com',
  avatar: 'https://example.com/avatar.jpg',
};

describe('UserCard', () => {
  it('渲染用户名称和邮箱', () => {
    render(<UserCard user={mockUser} onEdit={vi.fn()} />);
    expect(screen.getByText('张三')).toBeInTheDocument();
    expect(screen.getByText('zhangsan@example.com')).toBeInTheDocument();
  });

  it('点击编辑按钮触发 onEdit 回调', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<UserCard user={mockUser} onEdit={onEdit} />);
    await user.click(screen.getByRole('button', { name: /编辑/i }));
    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });

  it('无头像时显示默认占位图', () => {
    const userWithoutAvatar = { ...mockUser, avatar: null };
    render(<UserCard user={userWithoutAvatar} onEdit={vi.fn()} />);
    expect(screen.getByAltText('张三')).toHaveAttribute(
      'src',
      expect.stringContaining('default-avatar'),
    );
  });
});
```

### E2E 测试生成

```
> 为登录流程编写 Playwright E2E 测试：
> - 访问 /login 页面
> - 填写邮箱和密码
> - 点击登录按钮
> - 验证跳转到 /dashboard
> - 验证页面显示用户名
> - 测试错误密码显示错误提示
> - 测试表单验证（空邮箱、无效邮箱格式）
```

### 测试策略建议

| 测试类型 | 工具 | 覆盖内容 | 运行时机 |
|----------|------|----------|----------|
| 单元测试 | Vitest | 工具函数、纯逻辑 Hook | 每次提交 |
| 组件测试 | Vitest + React Testing Library | 组件渲染、交互、状态变化 | 每次提交 |
| E2E 测试 | Playwright | 完整用户流程、页面导航 | PR 合并前 |
| 视觉回归 | Chromatic / Percy | UI 截图对比 | PR 合并前 |

:::info
**测试文件命名约定：**
- 组件测试：`ComponentName.test.tsx`（与组件同目录）
- E2E 测试：`feature-name.spec.ts`（放在 `tests/e2e/` 目录）
- 工具函数测试：`functionName.test.ts`

在 CLAUDE.md 中约定命名规则，Claude Code 会自动遵循。
::::

### Mock 策略

```
> 配置 MSW（Mock Service Worker）用于测试：
> - 创建 src/mocks/handlers.ts，定义 API Mock
> - 创建 src/mocks/server.ts（Node 环境，测试用）
> - 创建 src/mocks/browser.ts（浏览器环境，开发用）
> - Mock /api/users 接口：GET 返回用户列表，POST 创建用户
> - 在 Vitest setup 文件中启动 MSW server
```

:::tip
MSW 比手动 mock fetch/axios 更好：它在网络层拦截请求，不侵入业务代码，测试更接近真实行为。在 CLAUDE.md 中约定使用 MSW，Claude Code 会自动生成对应的 handler。
::::

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
::::

### Next.js 项目

```
> 在 next.config.ts 中配置图片域名白名单，允许 images.example.com
```

```
> 配置 Next.js 环境变量：创建 .env.local，定义 NEXT_PUBLIC_API_URL
```

:::info
Next.js App Router 和 Pages Router 的配置方式差异较大。在 CLAUDE.md 中明确标注使用的 Router 类型，避免 Claude 生成错误的路由结构或 API 路由写法。
::::

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
::::
