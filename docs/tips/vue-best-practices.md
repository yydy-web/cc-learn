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
````
