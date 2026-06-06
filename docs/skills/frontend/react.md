---
title: React 生态 Skills
description: React 开发推荐 Skills——性能优化、组件组合模式和 shadcn/ui 集成
---

# React 生态 Skills

React 是 Claude Code 训练数据最丰富的前端框架之一。以下 Skills 专注于 React + TypeScript 项目的性能优化、组件设计和 UI 库集成。

:::tip
本页属于[技能系统](/skills/)的一部分。更多 Skills 资源：[技能市场](/skills/overview/skills-marketplace) | [Superpowers](/skills/workflow/superpowers)
:::

## 推荐 Skills

### React Best Practices（Vercel）

[react-best-practices](https://www.skills.sh/vercel-labs/agent-skills/vercel-react-best-practices) 来自 Vercel Labs，包含 70 条 React 和 Next.js 性能优化规则，按影响程度分为 8 个类别。每条规则都附带错误和正确的代码示例，适合代码审查和日常开发参考。

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
```

**规则分类（按优先级排序）：**

| 优先级  | 类别           | 说明                                       |
| ------- | -------------- | ------------------------------------------ |
| 🔴 关键 | 消除请求瀑布流 | 串行数据获取 → 并行化，减少页面加载时间    |
| 🔴 关键 | Bundle 优化    | 避免 barrel imports、按需导入大型库        |
| 🟠 高   | 服务端性能     | React.cache() 去重、并行获取、序列化最小化 |
| 🟠 高   | 客户端渲染     | 通过 memoization 和依赖管理减少 re-render  |
| 🟡 中   | 渲染性能       | CSS 策略和 hydration 模式                  |
| 🟡 中   | JS 级优化      | DOM 批处理、缓存、Set/Map O(1) 查找        |
| 🟢 低   | 高级模式       | 复杂场景的进阶优化技巧                     |

:::tip
安装后，让 Claude Code "审查这个组件的性能" 或 "检查是否有不必要的 re-render"，它会自动应用这 70 条规则进行检查和优化建议。
:::

### Composition Patterns（Vercel）

[composition-patterns](https://www.skills.sh/vercel-labs/agent-skills/vercel-composition-patterns) 来自 Vercel Labs，提供 React 组件组合模式的最佳实践，解决布尔 Props 泛滥和组件僵化问题。

```bash
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-composition-patterns
```

**核心模式：**

| 类别     | 模式                  | 说明                                           |
| -------- | --------------------- | ---------------------------------------------- |
| 组件架构 | 避免布尔 Props        | 用组合替代 `isLoading`、`isCompact` 等布尔开关 |
| 组件架构 | 复合组件              | 通过共享 Context 构建灵活的组件族              |
| 状态管理 | 解耦实现              | Provider 是唯一知道状态管理方式的地方          |
| 状态管理 | Context 接口          | 定义 state + actions + meta 的泛型接口         |
| 实现模式 | 显式变体              | 创建独立变体组件替代条件分支                   |
| 实现模式 | children 优先         | 用 children 组合替代 renderX props             |
| React 19 | 移除 forwardRef       | ref 直接作为 prop 传递                         |
| React 19 | use() 替代 useContext | 使用新的 `use()` Hook 读取 Context             |

```markdown title="反面示例 — 布尔 Props 泛滥"
// ❌ 布尔 Props 导致组件僵化
<Button isLoading isCompact isDisabled isFullWidth variant="primary" />

// ✅ 组合模式更灵活
<Button variant="primary" size="sm" className="w-full" disabled>
<Spinner data-icon="inline-start" />
提交
</Button>
```

:::info
这个 Skill 特别适合重构大型组件库——当一个组件有超过 5 个布尔 Props 时，就是该用组合模式重构的信号。
:::

### shadcn/ui

[shadcn](https://www.skills.sh/shadcn/ui/shadcn) 是 shadcn/ui 官方提供的 Skill，覆盖组件的完整生命周期管理——从搜索、安装、预览到更新和样式定制。

```bash
npx skills add https://github.com/shadcn-ui/ui --skill shadcn
```

**核心能力：**

| 能力           | 说明                                                        |
| -------------- | ----------------------------------------------------------- |
| 组件搜索与安装 | 从多个注册表（@shadcn、@magicui、@tailark）搜索并添加组件   |
| 文档查询       | `npx shadcn@latest docs <component>` 获取组件文档和示例 URL |
| 变更预览       | `--dry-run` 和 `--diff` 在安装前预览变更内容                |
| 上游合并       | 智能合并上游更新，保留本地修改                              |
| 主题预设       | 内置 nova、vega、maia、lyra、mira、luma 等预设主题          |
| 项目模板       | 支持 Next.js、Vite、Start、React Router、Astro 等脚手架     |

**关键规则：**

- 优先使用现有组件，不要重复造轮子——搜索注册表后再决定是否自建
- 用组合方式构建复杂 UI（如 Settings = Tabs + Card + 表单控件）
- 使用语义化颜色 Token（`bg-primary`、`text-muted-foreground`）而非原始色值
- 表单布局使用 `FieldGroup` + `Field`，不要用 raw div + spacing
- 图标使用 `data-icon` 属性，不要手动添加尺寸类名

:::tip
安装后，让 Claude Code "添加一个 DataTable 组件" 或 "把我的表单改成 shadcn/ui 风格"，它会自动查询组件文档、处理导入路径、遵循项目的别名配置。
:::

## Skills 组合建议

| 场景                       | 推荐 Skills                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| React 项目性能优化         | react-best-practices + composition-patterns                                              |
| React + shadcn/ui 全栈开发 | react-best-practices + shadcn + composition-patterns                                     |
| 从零设计高品质 UI          | `design-taste-frontend` + frontend-design + ui-ux-pro-max                                |
| 反 AI 平庸设计（推荐）     | `design-taste-frontend` + react-best-practices + shadcn                                  |
| 改造现有项目 UI            | `redesign-existing-projects` + web-design-guidelines + react-best-practices              |
| 审查现有页面质量           | web-design-guidelines + react-best-practices                                             |
| 全面的前端开发体验         | `design-taste-frontend` + frontend-design + web-design-guidelines + react-best-practices |

:::warning
安装过多 Skills 可能增加 Claude Code 的上下文负担。建议根据实际需求选择 2-3 个最相关的 Skill，而不是全部安装。
:::

## 下一步

- [Taste Skill](/skills/frontend/taste) — 反 AI 平庸设计框架，React 默认栈支持
- [Vue 生态 Skills](/skills/frontend/vue) — Vue 3 推荐 Skills
- [前端通用 Skills](/skills/frontend/frontend) — 跨框架的前端 Skills
- [React 开发最佳实践](/tips/react-best-practices) — 完整的 React 开发指南
- [技能市场](/skills/overview/skills-marketplace) — 浏览和安装社区 Skills
