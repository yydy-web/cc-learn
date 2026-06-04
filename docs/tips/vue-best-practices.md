---
title: Vue 开发最佳实践
description: 使用 Claude Code 进行 Vue 3 + TypeScript 开发的完整指南，涵盖提示词策略、组件测试、Pinia 状态管理、VueUse 组合式函数和代码审查
---

# Vue 开发最佳实践

Vue 3 的 Composition API 和 `<script setup>` 语法简洁且类型友好，Claude Code 对 Vue 生态有良好的支持。本文专注于 Vue 3 + TypeScript 项目的最佳实践，包括组件开发、测试、状态管理、路由、组合式函数、代码审查和推荐的社区 Skills。

:::tip
本文是 [前端开发最佳实践](/tips/frontend-best-practices) 的 Vue 专题补充。通用的提示词策略、构建工具配置和 CI/CD 集成请参考主文档。
:::

:::info
本文默认使用 Vue 3 + Composition API + `<script setup lang="ts">`。始终优先使用 Composition API，除非项目明确要求 Options API。
:::

## Vue 提示词策略

### Vue 特定提示词

````markdown title="常用提示词模板"
# 组件生成
> 创建 DataTable 组件，使用 `<script setup lang="ts">`：
> - 支持列排序、筛选、分页
> - 支持行选择（checkbox）
> - TypeScript 泛型：DataTable<T>
> - 列定义使用 defineProps 配合泛型
> - 使用 Element Plus / Naive UI / Ant Design Vue 组件库渲染
> - emit 定义排序和筛选事件

# 组合式函数（Composable）
> 创建 useDebounce<T> 组合式函数：
> - 泛型支持任意值类型
> - 参数：value: Ref<T>, delay: number
> - 返回防抖后的 Ref<T>
> - 包含 TypeScript 类型定义
> - 编写 Vitest 测试覆盖：值变化延迟、effectScope 清理

# 状态管理（Pinia）
> 创建购物车 Pinia store（Setup Store 模式）：
> - state：items（CartItem[]，含 product、quantity）
> - getters：totalPrice、totalItems
> - actions：addItem、removeItem、updateQuantity、clearCart
> - 使用 $patch 批量更新
> - 持久化到 localStorage（pinia-plugin-persistedstate）
> - 支持 HMR

# API 层
> 创建用户 API 服务层：
> - 使用 useFetch（VueUse）或自定义 useApi 组合式函数
> - axios 实例配置 baseURL 和拦截器
> - 包含：getUserList、getUserById、createUser、updateUser、deleteUser
> - 每个方法包含 TypeScript 类型
> - 统一错误响应类型 ApiError
> - 封装 loading、error、data 响应式状态
````

## 测试最佳实践

### TDD 工作流

Claude Code 完美支持 Vue 的 TDD 工作流。以下是一个典型的对话：

```
> 用 TDD 方式实现搜索框组件：
> 1. 先写 SearchBox 的组件测试，覆盖以下场景：
>    - 渲染输入框和搜索按钮
>    - 输入文字后显示清除按钮
>    - 点击搜索按钮触发 emit('search') 事件
>    - 按 Enter 键触发搜索
>    - 输入为空时搜索按钮禁用
> 2. 运行测试确认失败
> 3. 写最小实现让测试通过
> 4. 重构优化
```

### 组件测试生成

让 Claude Code 为现有组件生成测试：

```
> 为 src/components/UserCard.vue 编写组件测试：
> - 使用 Vitest + @vue/test-utils
> - 测试渲染用户名称和邮箱
> - 测试点击编辑按钮触发 emit
> - 测试无头像时显示默认占位图
> - 使用 mount 和 shallowMount
```

Claude Code 会生成类似如下的测试：

```ts title="UserCard.spec.ts"
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import UserCard from './UserCard.vue';

const mockUser = {
  id: '1',
  name: '张三',
  email: 'zhangsan@example.com',
  avatar: 'https://example.com/avatar.jpg',
};

describe('UserCard', () => {
  it('渲染用户名称和邮箱', () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    });
    expect(wrapper.text()).toContain('张三');
    expect(wrapper.text()).toContain('zhangsan@example.com');
  });

  it('点击编辑按钮触发 edit 事件', async () => {
    const wrapper = mount(UserCard, {
      props: { user: mockUser },
    });
    await wrapper.find('button[aria-label="编辑"]').trigger('click');
    expect(wrapper.emitted('edit')).toHaveLength(1);
    expect(wrapper.emitted('edit')![0]).toEqual([mockUser]);
  });

  it('无头像时显示默认占位图', () => {
    const userWithoutAvatar = { ...mockUser, avatar: null };
    const wrapper = mount(UserCard, {
      props: { user: userWithoutAvatar },
    });
    const img = wrapper.find('img');
    expect(img.attributes('src')).toContain('default-avatar');
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
| 单元测试 | Vitest | 工具函数、纯逻辑 Composable | 每次提交 |
| 组件测试 | Vitest + @vue/test-utils | 组件渲染、交互、emit、插槽 | 每次提交 |
| E2E 测试 | Playwright | 完整用户流程、页面导航 | PR 合并前 |
| 视觉回归 | Chromatic / Percy | UI 截图对比 | PR 合并前 |

:::info
**测试文件命名约定：**
- 组件测试：`ComponentName.spec.ts`（与组件同目录）
- E2E 测试：`feature-name.spec.ts`（放在 `tests/e2e/` 目录）
- Composable 测试：`useComposableName.spec.ts`（与 composable 同目录）
- 工具函数测试：`functionName.test.ts`

在 CLAUDE.md 中约定命名规则，Claude Code 会自动遵循。
:::

### Mock 策略

```
> 配置 MSW（Mock Service Worker）用于 Vue 项目测试：
> - 创建 src/mocks/handlers.ts，定义 API Mock
> - 创建 src/mocks/server.ts（Node 环境，测试用）
> - 创建 src/mocks/browser.ts（浏览器环境，开发用）
> - Mock /api/users 接口：GET 返回用户列表，POST 创建用户
> - 在 Vitest setup 文件中启动 MSW server
```

:::tip
MSW 比手动 mock axios 更好：它在网络层拦截请求，不侵入业务代码，测试更接近真实行为。在 CLAUDE.md 中约定使用 MSW，Claude Code 会自动生成对应的 handler。
:::

## 常见场景

### 页面全栈生成（Nuxt 3）

```
> 基于现有的数据库表结构，生成 Nuxt 3 的用户管理页面：
> 1. pages/users/index.vue — 用户列表（useAsyncData 获取初始数据）
> 2. pages/users/[id].vue — 用户详情
> 3. pages/users/new.vue — 创建用户表单
> 4. components/users/UserTable.vue — 可排序、可筛选的表格
> 5. components/users/UserForm.vue — 表单组件（VeeValidate + Zod）
> 6. server/api/users.ts — 服务端 API 路由（Nitro）
>
> 使用 Element Plus / Naive UI 组件库
> 参考项目中 pages/products/ 的代码风格
```

:::tip
如果使用纯 Vite SPA 项目（非 Nuxt），页面路由使用 Vue Router，API 层使用 axios 或 useFetch（VueUse），组件参考 Vite 项目的目录结构。
:::

### 表单处理

```
> 创建用户注册表单：
> - 使用 VeeValidate + Zod 校验
> - 字段：用户名、邮箱、密码、确认密码、手机号
> - 实时校验：密码强度指示器，邮箱格式提示
> - 密码确认字段自动与密码字段交叉校验
> - 提交时显示加载状态，禁用按钮防止重复提交
> - 错误信息显示在对应字段下方
> - 提交成功后显示 ElMessage / NMessage 提示并跳转到登录页
```

### 状态管理（Pinia）

```
> 使用 Pinia（Setup Store 模式）创建应用全局状态：
> 1. useAuthStore：登录状态、用户信息、token 管理
> 2. useThemeStore：深色/浅色模式切换，持久化到 localStorage
> 3. useUiStore：侧边栏展开/折叠、全局 Loading、通知队列
> 每个 Store 使用 TypeScript 严格类型
> 支持 HMR 和 devtools
```

:::info
**Setup Store vs Options Store：** 优先使用 Setup Store 模式（函数式写法），它更灵活，支持 VueUse 等组合式函数，且与 Composition API 风格一致。Options Store（类似 Vuex 的对象写法）适合简单场景。
:::

### API 集成

```
> 配置 axios 实例和 API 层：
> 1. 创建 axios 实例，配置 baseURL、超时、请求/响应拦截器
> 2. 请求拦截器：自动附加 Authorization header
> 3. 响应拦截器：统一处理 401 跳转登录、403 提示无权限、500 显示错误页
> 4. 封装 useApi() 组合式函数，返回 { data, error, loading, execute }
> 5. 统一错误处理和消息提示
```

### VueUse 组合式函数集成

```
> 在项目中集成 VueUse：
> 1. 安装 @vueuse/core
> 2. 封装常用组合式函数：
>    - useStorage 替代手动操作 localStorage
>    - useDark + useToggle 管理深色模式
>    - useEventListener 替代手动 addEventListener/removeEventListener
>    - useDebounceFn 处理搜索防抖
>    - useIntersectionObserver 实现图片懒加载
> 3. 统一在 composables/ 目录下按功能分组
```

:::tip
VueUse 提供了 200+ 个组合式函数，覆盖浏览器 API、状态、传感器、动画、网络等场景。在开发前先检查 VueUse 是否已有现成方案，避免重复造轮子。详见下方 [推荐 Vue Skills > VueUse Functions](#推荐-vue-skills)。
:::

### 组件库集成（Element Plus / Naive UI）

```
> 安装并配置 Element Plus：
> 1. 按需导入（unplugin-vue-components + unplugin-auto-import）
> 2. 配置主题色（CSS 变量覆盖）
> 3. 安装常用组件：ElTable, ElForm, ElInput, ElButton, ElDialog, ElSelect, ElMessage
> 4. 创建一个示例页面展示所有组件的用法
```

:::info
在 CLAUDE.md 中明确指定 UI 组件库（Element Plus、Naive UI、Ant Design Vue、Vuetify 等），这会显著影响 Claude Code 生成的组件代码和样式写法。
:::
````

## 代码审查与重构

### 代码审查

```
> 审查 src/features/dashboard/components/ChartPanel.vue：
> 1. 检查是否有不必要的响应式开销（ref vs shallowRef）
> 2. 检查 watch/onUnmounted 的清理函数是否正确（定时器、事件监听）
> 3. 检查是否有内存泄漏（未取消的订阅、定时器）
> 4. 检查是否正确使用 computed 而非在模板中做复杂计算
> 5. 检查 v-for 是否使用唯一 key（非 index）
> 6. 检查是否误用 reactive 导致解构丢失响应性
```

```
> 扫描整个 src/components/ 目录，找出：
> - 使用 v-for 时缺少 key 或使用 index 作为 key
> - 过大的组件（超过 200 行）应该拆分
> - 缺少 TypeScript 类型定义的 Props（defineProps 未使用泛型）
> - 可以提取为 Composable 的重复逻辑
> - 误用 ref 包裹不需要响应式的值（应使用 shallowRef）
> - 模板中直接操作 DOM（应使用 ref 引用）
```

### 组件拆分与重构

```
> 重构 src/features/order/OrderPage.vue（目前 500 行）：
> 1. 提取订单列表为 OrderTable 组件
> 2. 提取筛选器为 OrderFilter 组件
> 3. 提取订单详情弹窗为 OrderDetailDialog 组件
> 4. 将数据获取逻辑提取到 useOrders() Composable
> 5. 将表单逻辑提取到 useOrderForm() Composable
> 6. 保持所有现有功能和样式不变
```

:::tip
重构 Vue 组件时，让 Claude Code 先运行现有测试确认基线，重构后再运行确认没有回归。对于没有测试的组件，先补测试再重构。
:::

### 性能优化

```
> 优化 src/features/product/ProductList.vue 的性能：
> 1. 分析是否有不必要的响应式开销
> 2. 对不需要深层响应的数据使用 shallowRef
> 3. 对计算密集的派生数据使用 computed
> 4. 使用 v-once 渲染静态内容
> 5. 使用 v-memo 优化大列表的条件渲染
> 6. 图片使用 loading="lazy" 或 VueUse 的 useIntersectionObserver
> 7. 大列表使用虚拟滚动（@tanstack/vue-virtual 或 VueUse 的 useVirtualList）
> 给出优化前后的对比说明
```

### TypeScript 类型安全

```
> 审查 src/ 目录的 TypeScript 类型安全：
> 1. 找出所有的 any 类型，建议替换为具体类型
> 2. 检查 defineProps 是否都使用泛型形式（而非运行时声明）
> 3. 检查 defineEmits 是否都有类型声明
> 4. 检查 API 响应是否有完整的类型定义
> 5. 找出可以使用泛型提高复用性的地方
> 6. 检查 Pinia store 的 state 和 getters 是否都有类型标注
```

## 推荐 Vue Skills

以下 Skills 覆盖 Vue 3 开发的完整工具链：

| Skill | 来源 | 用途 |
|-------|------|------|
| `vue-best-practices` | vuejs-ai | 完整的 Vue 开发工作流指南 |
| `vue` | Vue 官方文档 | Composition API、`<script setup>` 宏、响应式系统 |
| `pinia` | Pinia 官方文档 | Store 定义、插件、SSR、测试 |
| `vite` | Vite 官方文档 | 配置、插件 API、SSR、Rolldown 迁移 |
| `vueuse-functions` | VueUse | 200+ 组合式函数决策和实现指南 |
| `vue-router-best-practices` | vuejs-ai | Vue Router 4 导航守卫和生命周期 |

完整的 Skills 介绍、安装方式和组合建议，请参考 [Vue 生态 Skills](/skills/frontend/vue)。

### Skills 组合建议

| 场景 | 推荐 Skills |
|------|-------------|
| Vue 3 + Vite SPA 项目 | vue-best-practices + vue + vite + vueuse-functions |
| Nuxt 3 全栈项目 | vue-best-practices + vue + pinia + vue-router-best-practices |
| 全面的 Vue 开发体验 | vue-best-practices + vue + pinia + vite + vueuse-functions + vue-router-best-practices |

## 常见陷阱

| 陷阱 | 说明 | 解决方案 |
|------|------|----------|
| reactive 解构丢失响应性 | `const { name } = reactive({name: ''})` 解构后 name 不再响应 | 使用 `toRefs()` 解构，或直接用 `ref` |
| v-for 使用 index 作为 key | 列表重排时导致渲染异常 | 使用唯一标识（如 id）作为 key |
| Options API vs Composition API 混用 | Claude 可能在同一项目中混用两种风格 | 在 CLAUDE.md 中明确指定使用 Composition API |
| watch 依赖遗漏 | watch 未正确声明依赖导致不触发 | 使用 watchEffect 自动收集依赖，或检查 watch 的第一个参数 |
| 组件 props 命名风格 | Vue 模板中使用 camelCase 可能不生效 | Props 定义用 camelCase，模板中用 kebab-case |
| CSS scoped 泄漏 | 深度选择器写法不一致 | Vue 3.3+ 使用 `:deep(.class)` 语法 |
| SSR 中的响应式陷阱 | 在 setup 顶层调用 useRoute 等导致 SSR 共享状态 | 在函数或 composable 内部调用 |
| defineProps 未使用泛型 | 使用运行时声明导致 TypeScript 推断不完整 | 优先使用 `defineProps<{...}>()` 泛型形式 |
| 忘记清理副作用 | 定时器、事件监听器在组件卸载后未清理 | 在 onUnmounted 中清理，或使用 VueUse 的自动清理函数 |
| Pinia store 在模块顶层调用 | SSR 场景下导致跨请求状态污染 | 在函数内部调用 `useXxxStore()` |

## 提示词模板库

以下是 Vue 开发常用场景的提示词模板，可直接复制使用：

:::details Vue 组件开发

```
> 创建 [ComponentName] 组件：
> - 使用 `<script setup lang="ts">`
> - Props: [字段列表和类型]（使用 defineProps 泛型）
> - Emits: [事件列表]
> - 使用 [Element Plus / Naive UI / Ant Design Vue] 组件库
> - 支持 [功能描述]
> - 加载状态使用 Skeleton
> - 空状态显示友好提示
> - 错误状态显示重试按钮
> - 无障碍：所有交互元素有 aria-label
> 参考项目中 [现有组件] 的代码风格
```

:::

:::details 组合式函数（Composable）

```
> 创建 use[Name] 组合式函数：
> - 参数：[参数列表和类型]
> - 返回值：[返回值类型]
> - 功能：[具体功能描述]
> - 包含 loading 和 error 状态（Ref<boolean>、Ref<string | null>）
> - 支持取消/清理（onUnmounted / effectScope）
> - 编写完整的单元测试（Vitest）
```

:::

:::details API 集成

```
> 使用组合式函数创建 [资源] 的 API 层：
> - use[Resources]()：列表查询，支持分页、搜索、排序，返回 { data, loading, error, execute }
> - use[Resource](id)：详情查询
> - useCreate[Resource]()：创建后手动刷新列表
> - useUpdate[Resource]()：乐观更新
> - useDelete[Resource]()：删除后手动刷新
> - 统一错误处理和消息提示
```

:::

:::details 表单页面

```
> 创建 [表单名称] 表单页面：
> - 使用 VeeValidate + Zod 校验
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
> - 使用 Tailwind CSS / UnoCSS 响应式设计
```

:::
