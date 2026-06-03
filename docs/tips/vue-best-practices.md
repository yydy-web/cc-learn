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
