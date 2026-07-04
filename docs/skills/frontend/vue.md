---
title: Vue 生态 Skills
description: Vue 3 开发推荐 Skills——Composition API、Pinia 状态管理、Vite 构建和 VueUse 组合式函数
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★★★☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★★    |

**🎯 学习产出：** 掌握 Vue 开发技能，能独立搭建完整的 Vue 3 开发 Skills 栈

**🚀 AI 能力提升：** 代码生成、设计→代码
:::

# Vue 生态 Skills

Vue 3 的 Composition API 和 `<script setup>` 语法简洁且类型友好，Claude Code 对 Vue 生态有良好的支持。以下 Skills 覆盖 Vue 3 开发的完整工具链。

:::tip
本页属于[技能系统](/skills/)的一部分。更多 Skills 资源：[技能市场](/skills/overview/skills-marketplace) | [Superpowers](/skills/workflow/superpowers)
:::

## 推荐 Skills

### Vue Best Practices

[vue-best-practices](https://github.com/antfu/skills/tree/main/skills/vue-best-practices) 来自 vuejs-ai，是一套完整的 Vue 开发工作流指南，涵盖架构确认、组件设计、响应式系统、性能优化和自检清单。推荐在所有 Vue 项目中使用。

```bash
npx skills add https://github.com/antfu/skills --skill vue-best-practices
```

**核心工作流（按顺序执行）：**

| 阶段                | 说明                                                                        |
| ------------------- | --------------------------------------------------------------------------- |
| 1. 确认架构         | 默认 Vue 3 + Composition API + `<script setup lang="ts">`，阅读核心参考文档 |
| 2. 规划组件边界     | 定义组件职责、Props/Emits 契约、特性文件夹布局                              |
| 3. 应用 Vue 基础    | 响应式系统、SFC 结构、组件拆分、数据流、Composables                         |
| 4. 按需使用高级特性 | Slots、Teleport、Suspense、Transition、异步组件                             |
| 5. 性能优化         | 虚拟列表、v-once/v-memo、避免过度抽象                                       |
| 6. 自检清单         | 确认行为正确、响应式最小化、组件聚焦、数据流明确                            |

:::tip
安装后，Claude Code 在处理 Vue 任务时会自动遵循这个工作流——从架构确认到最终自检，确保生成的代码符合最佳实践。
:::

### Vue（Vue 官方文档）

[vue](https://github.com/antfu/skills/tree/main/skills/vue) 基于 Vue 3.5 官方文档生成，覆盖 Composition API、`<script setup>` 宏、响应式系统和内置组件。

```bash
npx skills add https://github.com/antfu/skills --skill vue
```

**覆盖范围：**

| 主题              | 说明                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------- |
| Script Setup & 宏 | defineProps、defineEmits、defineModel、defineExpose、defineOptions、defineSlots、泛型 |
| 响应式 & 生命周期 | ref、shallowRef、computed、watch、watchEffect、effectScope、生命周期钩子、Composables |
| 内置组件 & 指令   | Transition、Teleport、Suspense、KeepAlive、v-memo、自定义指令                         |

**核心偏好：**

- 优先使用 TypeScript
- 优先使用 `<script setup lang="ts">` 而非 `<script>`
- 性能优先使用 `shallowRef` 而非 `ref`（不需要深层响应时）
- 始终使用 Composition API 而非 Options API

### Pinia

[pinia](https://github.com/antfu/skills/tree/main/skills/pinia) 基于 Pinia v3.0.4 官方文档，覆盖 Store 定义、插件、Composables 集成、测试和 SSR。

```bash
npx skills add https://github.com/antfu/skills --skill pinia
```

**覆盖范围：**

| 主题        | 说明                                                   |
| ----------- | ------------------------------------------------------ |
| Store 核心  | 定义 Store、state、getters、actions、storeToRefs、订阅 |
| 插件        | 自定义属性、state 扩展、行为扩展                       |
| Composables | 在 Store 中使用 VueUse 等组合式函数                    |
| Store 组合  | Store 间通信、避免循环依赖                             |
| 测试        | @pinia/testing、mock、stub                             |
| 组件外使用  | 导航守卫、插件、中间件中使用 Store                     |
| SSR         | 服务端渲染、state 水合                                 |

**关键建议：**

- 优先使用 Setup Store（复杂逻辑、Composables、watchers）
- 使用 `storeToRefs()` 解构 state/getters 保持响应性
- Actions 可直接解构（已绑定到 Store）
- 在函数内调用 Store（非模块顶层），特别是 SSR 场景
- 为每个 Store 添加 HMR 支持

### Vite

[vite](https://github.com/antfu/skills/tree/main/skills/vite) 基于 Vite 8 beta（Rolldown 驱动），覆盖配置、插件 API、SSR 和 Rolldown 迁移。

```bash
npx skills add https://github.com/antfu/skills --skill vite
```

**覆盖范围：**

| 主题          | 说明                                                               |
| ------------- | ------------------------------------------------------------------ |
| 配置          | vite.config.ts、defineConfig、条件配置、loadEnv                    |
| 特性          | import.meta.glob、资源查询（?raw、?url）、import.meta.env、HMR API |
| 插件 API      | Vite 专属 Hooks、虚拟模块、插件顺序                                |
| 构建 & SSR    | Library 模式、SSR 中间件模式、ssrLoadModule、JavaScript API        |
| 环境 API      | Vite 6+ 多环境支持、自定义运行时                                   |
| Rolldown 迁移 | Vite 8 变更：Rolldown bundler、Oxc transformer                     |

### VueUse Functions

[vueuse-functions](https://github.com/antfu/skills/tree/main/skills/vueuse-functions) 是一个决策和实现指南，将需求映射到最合适的 VueUse 组合式函数，覆盖 200+ 个函数。

```bash
npx skills add https://github.com/antfu/skills --skill vueuse-functions
```

**常用函数分类：**

| 分类       | 数量 | 代表函数                                                             |
| ---------- | ---- | -------------------------------------------------------------------- |
| State      | 16   | useStorage, useLocalStorage, createGlobalState                       |
| Elements   | 15   | useElementSize, useElementVisibility, useIntersectionObserver        |
| Browser    | 44   | useDark, useColorMode, useClipboard, useFullscreen, useTitle         |
| Sensors    | 35   | onClickOutside, useMouse, useScroll, useInfiniteScroll, useMagicKeys |
| Network    | 3    | useFetch, useWebSocket, useEventSource                               |
| Animation  | 9    | useTransition, useInterval, useRafFn                                 |
| Component  | 16   | useVModel, useVirtualList, createReusableTemplate                    |
| Watch      | 13   | watchDebounced, watchThrottled, whenever, until                      |
| Reactivity | 21   | computedAsync, refDebounced, syncRef, reactivePick                   |
| Utilities  | 29   | useDebounceFn, useThrottleFn, useToggle, useEventBus, useMemoize     |

**使用策略：**

| Invocation    | 含义                   |
| ------------- | ---------------------- |
| AUTO          | 适用时自动使用         |
| EXTERNAL      | 需要用户已安装外部依赖 |
| EXPLICIT_ONLY | 仅在用户明确请求时使用 |

:::tip
安装后，让 Claude Code "实现一个无限滚动列表" 或 "添加深色模式切换"，它会自动选择最合适的 VueUse 函数，避免手动编写重复的浏览器 API 逻辑。
:::

### Vue Router Best Practices

[vue-router-best-practices](https://github.com/antfu/skills/tree/main/skills/vue-router-best-practices) 来自 vuejs-ai，覆盖 Vue Router 4 的导航守卫、路由参数和路由-组件生命周期交互。

```bash
npx skills add https://github.com/antfu/skills --skill vue-router-best-practices
```

**覆盖场景：**

| 分类         | 场景                            | 说明                              |
| ------------ | ------------------------------- | --------------------------------- |
| 导航守卫     | 同路由不同参数                  | beforeEnter 不会触发参数变化      |
| 导航守卫     | beforeRouteEnter 中访问组件实例 | 此时 this 不可用，需用回调        |
| 导航守卫     | 守卫中异步 API 调用             | 必须 await，否则导航不等待        |
| 导航守卫     | 无限重定向循环                  | 检查条件避免死循环                |
| 导航守卫     | 废弃的 next() 函数              | Vue Router 4 不再需要 next()      |
| 路由生命周期 | 同路由参数变化数据不更新        | 使用 onBeforeRouteUpdate 或 watch |
| 路由生命周期 | 组件卸载后事件监听残留          | 在 onUnmounted 中清理             |
| 配置         | 生产环境单页应用                | 正确配置 history 和 base          |

## Skills 组合建议

| 场景                        | 推荐 Skills                                                                          |
| --------------------------- | ------------------------------------------------------------------------------------ |
| Vue 3 + Vite SPA 项目       | vue-best-practices + vue + vite + vueuse-functions                                   |
| Nuxt 3 全栈项目             | vue-best-practices + vue + pinia + vue-router-best-practices                         |
| 组件库开发                  | vue-best-practices + vue + vite                                                      |
| Vue 项目性能优化            | vue-best-practices + vueuse-functions + vite                                         |
| Vue + Element Plus 企业项目 | vue-best-practices + vue + pinia + vue-router-best-practices                         |
| Vue 项目 UI 设计品质提升    | `design-taste-frontend` + vue-best-practices + vue                                   |
| 改造现有 Vue 项目           | `redesign-existing-projects` + web-design-guidelines + vue-best-practices            |
| 全面的 Vue 开发体验         | `design-taste-frontend` + vue-best-practices + vue + pinia + vite + vueuse-functions |

:::warning
安装过多 Skills 可能增加 Claude Code 的上下文负担。建议根据实际需求选择 2-4 个最相关的 Skill，而不是全部安装。
:::

## 下一步

- [Taste Skill](/skills/frontend/taste) — 反 AI 平庸设计框架，兼容 Vue 生态
- [React 生态 Skills](/skills/frontend/react) — React 推荐 Skills
- [前端通用 Skills](/skills/frontend/frontend) — 跨框架的前端 Skills
- [Vue 开发最佳实践](/tips/vue-best-practices) — 完整的 Vue 开发指南
- [技能市场](/skills/overview/skills-marketplace) — 浏览和安装社区 Skills
