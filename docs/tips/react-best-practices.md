---
title: React 开发最佳实践
description: 使用 Claude Code 进行 React + TypeScript 开发的完整指南，涵盖提示词策略、组件测试、状态管理和代码审查
---

# React 开发最佳实践

React 是 Claude Code 训练数据最丰富的前端框架之一，生成质量高、模式识别准确。本文专注于 React + TypeScript 项目的最佳实践，包括组件开发、测试、状态管理、代码审查和推荐的社区 Skills。

:::tip
本文是 [前端开发最佳实践](/tips/frontend-best-practices) 的 React 专题补充。通用的提示词策略、构建工具配置和 CI/CD 集成请参考主文档。
:::

## React 提示词策略

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
:::

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
:::

## 常见场景

### 页面全栈生成（Next.js App Router）

```
> 基于现有的数据库表结构，生成 Next.js App Router 的用户管理页面：
> 1. /app/users/page.tsx — 用户列表（Server Component，fetch 初始数据）
> 2. /app/users/[id]/page.tsx — 用户详情
> 3. /app/users/new/page.tsx — 创建用户表单
> 4. /app/users/_components/UserTable.tsx — 可排序、可筛选的表格（Client Component）
> 5. /app/users/_components/UserForm.tsx — 表单组件（React Hook Form + Zod）
> 6. /lib/api/users.ts — 服务端 API 客户端
>
> 使用 shadcn/ui 的 Table, Form, Input, Button 组件
> 参考项目中 /app/products/ 的代码风格
```

### 表单处理

```
> 创建用户注册表单：
> - 使用 React Hook Form + Zod 校验
> - 字段：用户名、邮箱、密码、确认密码、手机号
> - 实时校验：密码强度指示器，邮箱格式提示
> - 密码确认字段自动与密码字段交叉校验
> - 提交时显示加载状态，禁用按钮防止重复提交
> - 错误信息显示在对应字段下方
> - 提交成功后显示 Toast 提示并跳转到登录页
```

### 状态管理

```
> 使用 Zustand 创建应用全局状态：
> 1. authStore：登录状态、用户信息、token 管理
> 2. themeStore：深色/浅色模式切换，持久化到 localStorage
> 3. uiStore：侧边栏展开/折叠、全局 Loading、通知队列
> 每个 Store 使用 TypeScript 严格类型
> 支持 devtools 和 immer 中间件
```

### API 集成

```
> 配置 axios 实例和 React Query：
> 1. 创建 axios 实例，配置 baseURL、超时、请求/响应拦截器
> 2. 请求拦截器：自动附加 Authorization header
> 3. 响应拦截器：统一处理 401 跳转登录、403 提示无权限、500 显示错误页
> 4. 配置 QueryClient：staleTime 5 分钟，retry 1 次
> 5. 封装 useApi() Hook 统一错误处理
```

### 组件库集成（shadcn/ui）

```
> 安装并配置 shadcn/ui：
> 1. 初始化 shadcn/ui（npx shadcn-ui@latest init）
> 2. 安装以下组件：Button, Input, Card, Dialog, Table, Form, Select, Toast
> 3. 配置主题色（primary, secondary, accent 等 CSS 变量）
> 4. 创建一个示例页面展示所有组件的用法
```

:::info
在 CLAUDE.md 中明确指定 UI 组件库（shadcn/ui、Ant Design、MUI、Element Plus 等），这会显著影响 Claude Code 生成的组件代码和样式写法。
:::

## 代码审查与重构

### 代码审查

```
> 审查 src/features/dashboard/components/ChartPanel.tsx：
> 1. 检查是否有不必要的 re-render（缺少 memo、依赖数组问题）
> 2. 检查 useEffect 的清理函数是否正确
> 3. 检查是否有内存泄漏（未取消的订阅、定时器）
> 4. 检查事件处理函数是否正确使用 useCallback
> 5. 检查是否有 XSS 风险（dangerouslySetInnerHTML）
```

```
> 扫描整个 src/components/ 目录，找出：
> - 缺少 key 或使用 index 作为 key 的列表渲染
> - 过大的组件（超过 200 行）应该拆分
> - 缺少 TypeScript 类型定义的 Props
> - 可以提取为自定义 Hook 的重复逻辑
> - 未使用的 state 和 props
```

### 组件拆分与重构

```
> 重构 src/features/order/OrderPage.tsx（目前 500 行）：
> 1. 提取订单列表为 OrderTable 组件
> 2. 提取筛选器为 OrderFilter 组件
> 3. 提取订单详情弹窗为 OrderDetailDialog 组件
> 4. 将数据获取逻辑提取到 useOrders() 自定义 Hook
> 5. 将表单逻辑提取到 useOrderForm() 自定义 Hook
> 6. 保持所有现有功能和样式不变
```

:::tip
重构前端组件时，让 Claude Code 先运行现有测试确认基线，重构后再运行确认没有回归。对于没有测试的组件，先补测试再重构。
:::

### 性能优化

```
> 优化 src/features/product/ProductList.tsx 的性能：
> 1. 分析是否有不必要的 re-render（使用 React DevTools Profiler 的建议）
> 2. 对列表项使用 React.memo
> 3. 对事件处理函数使用 useCallback
> 4. 对计算密集的派生数据使用 useMemo
> 5. 图片使用 Next.js Image 组件或 lazy loading
> 6. 大列表考虑使用虚拟滚动（@tanstack/react-virtual）
> 给出优化前后的对比说明
```

### TypeScript 类型安全

```
> 审查 src/ 目录的 TypeScript 类型安全：
> 1. 找出所有的 any 类型，建议替换为具体类型
> 2. 检查 API 响应是否有完整的类型定义
> 3. 检查组件 Props 是否都有 interface 定义
> 4. 找出可以使用泛型提高复用性的地方
> 5. 检查是否有类型断言（as）可以避免的地方
```

## 推荐 React Skills

以下 Skills 专注于 React + TypeScript 项目的性能优化、组件设计和 UI 库集成：

| Skill | 来源 | 用途 |
|-------|------|------|
| `react-best-practices` | Vercel Labs | 70 条 React/Next.js 性能优化规则 |
| `composition-patterns` | Vercel Labs | React 组件组合模式最佳实践 |
| `shadcn` | shadcn/ui 官方 | 组件生命周期管理（搜索、安装、更新） |

完整的 Skills 介绍、安装方式和组合建议，请参考 [React 生态 Skills](/skills/frontend/react)。

### Skills 组合建议

| 场景 | 推荐 Skills |
|------|-------------|
| React 项目性能优化 | react-best-practices + composition-patterns |
| React + shadcn/ui 全栈开发 | react-best-practices + shadcn + composition-patterns |
| 全面的前端开发体验 | frontend-design + web-design-guidelines + ui-ux-pro-max + react-best-practices |

## 常见陷阱

| 陷阱 | 说明 | 解决方案 |
|------|------|----------|
| forwardRef 已废弃 | React 19 中 ref 直接作为 prop 传递 | 在 CLAUDE.md 中注明 React 版本 |
| Pages Router vs App Router | Next.js 两种路由模式代码差异大 | 明确指定使用 App Router |
| CSS 方案不一致 | Claude 可能混用 Tailwind 和 CSS Modules | 在 CLAUDE.md 中指定 CSS 方案 |
| key prop 缺失 | 列表渲染缺少唯一 key | 让 Claude 检查所有 .map() 调用 |
| 服务端/客户端组件混淆 | Next.js App Router 需要区分 'use client' | 在 CLAUDE.md 中说明规则 |

## 提示词模板库

以下是 React 开发常用场景的提示词模板，可直接复制使用：

:::details React 组件开发

```
> 创建 [ComponentName] 组件：
> - Props: [字段列表和类型]
> - 使用 [shadcn/ui / Ant Design / MUI] 组件库
> - 支持 [功能描述]
> - 加载状态使用 Skeleton
> - 空状态显示友好提示
> - 错误状态显示重试按钮
> - 无障碍：所有交互元素有 aria-label
> 参考项目中 [现有组件] 的代码风格
```

:::

:::details 自定义 Hook

```
> 创建 use[HookName] 自定义 Hook：
> - 参数：[参数列表和类型]
> - 返回值：[返回值类型]
> - 功能：[具体功能描述]
> - 包含 loading 和 error 状态
> - 支持取消/清理（useEffect cleanup）
> - 编写完整的单元测试
```

:::

:::details API 集成

```
> 使用 React Query 创建 [资源] 的 API 层：
> - use[Resources]()：列表查询，支持分页、搜索、排序
> - use[Resource](id)：详情查询，缓存 [N] 分钟
> - useCreate[Resource]()：创建后自动失效列表缓存
> - useUpdate[Resource]()：乐观更新
> - useDelete[Resource]()：删除后自动刷新
> - 统一错误处理和 Toast 提示
```

:::

:::details 表单页面

```
> 创建 [表单名称] 表单页面：
> - 使用 React Hook Form + Zod 校验
> - 字段：[字段列表]
> - 实时校验 + 提交校验
> - 提交时显示加载状态，防止重复提交
> - 错误信息显示在字段下方
> - 提交成功后 [跳转/关闭弹窗/刷新列表]
> - 响应式布局：桌面端两列，移动端单列
```

:::

:::details 页面布局

```
> 创建 [页面名称] 的完整布局：
> - 顶部：面包屑导航 + 页面标题 + 操作按钮
> - 左侧：筛选面板（可折叠）
> - 主区域：数据表格 + 分页
> - 右侧/弹窗：详情面板
> - 移动端：筛选变为抽屉式弹出
> - 使用 Tailwind CSS 响应式设计
```

:::
```

## IMPORTANT

- Write the file EXACTLY as shown above — do not modify, rephrase, or "improve" any content
- After writing, run `npm run build` from `C:\Users\Mayn\work\github\cc-learn` to verify
- Report status: DONE, DONE_WITH_CONCERNS, NEEDS_CONTEXT, or BLOCKED
