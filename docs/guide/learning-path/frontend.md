---
title: 前端开发 · 学习路线
description: 前端专属 Claude Code 学习路径——从组件开发到设计还原，覆盖 React/Vue、Figma MCP、Chrome DevTools、UI 设计技能
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★☆  | ★★★☆☆    |
| 📦 产品 | ★★★☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握前端开发场景下的 Claude Code 最佳实践，能高效完成 UI 开发和组件设计

**🚀 AI 能力提升：** 设计→代码、代码生成、跨文件重构
:::

# 前端开发 · 学习路线

前端开发在 Claude Code 里收益最大——组件生成、样式调整、设计还原、浏览器调试，每个环节都有专属工具。

**预计时间**：~5 小时
**前置条件**：熟悉 HTML/CSS/JS，装好 Node.js

## 🛠️ 推荐安装的 Skills（10 分钟）

### 必装（开发工作流基础）

```bash
# 1. Superpowers — 14 个结构化开发 Skills（头脑风暴→TDD→调试→审查）
/plugin marketplace add superpowers
/plugin install superpowers@claude-plugins-official

# 2. 前端设计 — Anthropic 官方 UI 设计 Skill，品质远超默认输出
npx skills add https://github.com/anthropics/skills --skill frontend-design

# 3. Web 设计规范 — Vercel Labs 100+ 条 UI 最佳实践
npx skills add vercel-labs/agent-skills --skill web-design-guidelines

# 4. UI/UX Pro Max — 161 套配色 + 57 组字体 + 50+ 设计风格，告别千篇一律 AI 风
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
```

### 按框架选装

```bash
# React 项目
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-composition-patterns
npx skills add https://github.com/shadcn-ui/ui --skill shadcn          # 如果用了 shadcn/ui

# Vue 项目
npx skills add https://github.com/antfu/skills --skill vue-best-practices
npx skills add https://github.com/antfu/skills --skill vue
npx skills add https://github.com/antfu/skills --skill pinia            # 如果用了 Pinia
npx skills add https://github.com/antfu/skills --skill vueuse-functions # 如果用了 VueUse
```

### 设计品质增强（按需）

```bash
# Taste — 反 AI 平庸设计，给 AI 注入设计品味
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"

# Impeccable — 23 个命令的质量护栏（动画、色彩、排版、微交互）
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill impeccable
```

:::tip
**不要一次全装。** 建议先装必装的 4 个 + 你框架对应的 2 个。用完感受到差距了再按需加。Skills 过多会增加上下文负担，反而降低质量。
:::

---

## 阶段一：安装与基础（~30 分钟）

| 顺序 | 内容                                                      | 要点                                       |
| ---- | --------------------------------------------------------- | ------------------------------------------ |
| 1    | [什么是 Claude Code](/guide/beginner/what-is-claude-code) | 了解它和 VSCode Copilot 的区别             |
| 2    | [安装配置](/guide/beginner/installation)                  | `npm install -g @anthropic-ai/claude-code` |
| 3    | [快速开始](/guide/quick-start)                            | 5 分钟跑通                                 |
| 4    | [第一次对话](/guide/beginner/first-conversation)          | 学会给上下文、拖文件                       |
| 5    | [文件操作](/guide/beginner/file-operations)               | 读/写/改/搜索                              |
| 6    | [权限管理](/guide/beginner/permissions)                   | 信任级别设置                               |

**验收**：在现有前端项目里让 Claude Code 改一个按钮颜色。

---

## 阶段二：日常提效（~60 分钟）

| 顺序 | 内容                                                      | 要点                                  |
| ---- | --------------------------------------------------------- | ------------------------------------- |
| 1    | [CLAUDE.md](/guide/intermediate/claude-md)                | 写清楚框架、UI 库、CSS 方案、组件约定 |
| 2    | [社区模板精选](/guide/intermediate/claude-md-collection)  | 直接用 Next.js 全栈模板改             |
| 3    | [代码库导航](/guide/intermediate/codebase-navigation)     | 理解项目结构、追踪组件依赖            |
| 4    | [提高 AI 准确率](/guide/intermediate/improve-ai-accuracy) | 前端场景专用提示词技巧                |
| 5    | [上下文管理](/guide/intermediate/context-management)      | `/compact` 保持响应质量               |
| 6    | [Git 工作流](/guide/intermediate/git-workflow)            | 用 AI 写 commit、管理分支             |

**验收**：项目有 CLAUDE.md，AI 生成的组件风格和你项目一致。

---

## 阶段三：核心扩展（~90 分钟）

### 必装工具链

| 顺序 | 内容                                                       | 为什么前端必装                                          |
| ---- | ---------------------------------------------------------- | ------------------------------------------------------- |
| 1    | [Chrome DevTools MCP](/guide/advanced/chrome-devtools-mcp) | 浏览器内调试、截图对比、性能分析——不用手动打开 DevTools |
| 2    | [Figma MCP](/guide/advanced/figma-mcp)                     | 设计稿直接转代码、组件映射、设计 Token 同步             |
| 3    | [MCP 服务器](/guide/advanced/mcp-servers)                  | 连接 Storybook、图标库等前端常用服务                    |
| 4    | [Hooks](/guide/advanced/hooks)                             | 提交前自动跑 lint、格式化、组件测试                     |
| 5    | [Artifacts](/guide/advanced/artifacts)                     | 预览组件效果、分享给设计师确认                          |

### 设计工具

| 工具                                      | 解决什么问题                                                 |
| ----------------------------------------- | ------------------------------------------------------------ |
| [UI/UX Pro Max](/tips/ui-ux-pro-max)      | 161 套配色 + 57 组字体 + 50+ 设计风格，AI 做 UI 不再千篇一律 |
| [Frontend Design](/tips/frontend-design)  | 让 AI 有审美的设计主理人——做有观点的配色和排版               |
| [Emil Design Skills](/tips/emil-skills)   | Emil Kowalski 的设计工程方法论——让 UI "感觉对"               |
| [Taste Skill](/skills/frontend/taste)     | 反 AI 平庸设计框架——Brief 推断 + 三旋钮 + Pre-Flight Check   |
| [Impeccable](/skills/frontend/impeccable) | 23 个命令的质量护栏——动画、色彩、排版、微交互专项优化        |

**验收**：Chrome DevTools MCP 能自动截图验证 UI，Figma MCP 能拉取设计稿生成组件代码。

---

## 阶段四：前端专项实战（~90 分钟）

### 框架 Skill 体系

| 框架  | Skills                                   | 最佳实践                                      |
| ----- | ---------------------------------------- | --------------------------------------------- |
| React | [React Skills](/skills/frontend/react)   | [React 最佳实践](/tips/react-best-practices)  |
| Vue   | [Vue Skills](/skills/frontend/vue)       | [Vue 最佳实践](/tips/vue-best-practices)      |
| 通用  | [前端 Skills](/skills/frontend/frontend) | [前端最佳实践](/tips/frontend-best-practices) |

### 完整工具链集成

| 内容                                                           | 要点                                                                    |
| -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [前端工具链全景](/tips/frontend-practices/)                    | Git 工作流、Superpowers、GStack、CodeGraph、Context7、Serena 的完整集成 |
| [集成工作流详解](/tips/frontend-practices/integrated-workflow) | 从代码探索到发布的五阶段工作流                                          |
| [场景实战](/tips/frontend-practices/scenarios)                 | 新页面、组件库重构、性能优化、Bug 修复、遗留项目接管                    |

### 设计到代码闭环

| 内容                                              | 要点                                                       |
| ------------------------------------------------- | ---------------------------------------------------------- |
| [Axure + Playwright 实战](/tips/design-to-code)   | 原型做设计源 → Playwright 验证 → 前端实现 → 回测，完整闭环 |
| [Figma → 代码双向同步](/guide/advanced/figma-mcp) | 设计 Token 同步、组件映射、Code Connect                    |

**验收**：独立完成一个完整页面——从设计稿到可运行的前端代码，含交互和适配。

---

## 阶段五：进阶工作流（~60 分钟）

### 选学（按需）

| 主题                                             | 要点                           | 什么时候学                 |
| ------------------------------------------------ | ------------------------------ | -------------------------- |
| [SDD 规格驱动](/guide/advanced/sdd/sdd-guide)    | 先写规格再写组件，适合复杂页面 | 页面超过 10 个交互状态时   |
| [多 Agent 开发](/guide/advanced/multi-agent)     | 并行开发多个组件               | 需要同时推进页面和组件库时 |
| [自动化 CI/CD](/guide/advanced/automation)       | 提交自动跑视觉回归             | 团队有 CI 流水线时         |
| [代码图谱](/guide/advanced/code-graph/codegraph) | 追踪组件依赖、找改动影响面     | 接手大型前端项目时         |
| [Claude-Mem](/guide/advanced/claude-mem)         | 跨对话记住设计决策             | 多轮迭代同一个需求时       |

---

## 前端 CLAUDE.md 模板

```markdown
# CLAUDE.md — 前端项目

## 技术栈

- React 18 + TypeScript (strict)
- Tailwind CSS + CVA 做组件变体
- shadcn/ui 组件库
- React Hook Form + Zod 做表单

## 组件约定

- 一个组件一个文件，同目录放测试和 stories
- Server Component 优先，需要交互才加 'use client'
- Props 必须定义 interface，禁止 inline type
- 样式用 Tailwind，不写 .css 文件

## 不要做的事

- 不要引入新依赖，优先用已有工具
- 不要改 tailwind.config.ts 除非我明确说
- 不要用 any 类型
- 组件不要超过 200 行——拆分子组件
```

---

## 你不需要学的东西

- Java、Python 工具链集成 — 前端不需要
- 后端架构和数据库 — 除非你做全栈

---

## 下一步

- [后端开发路线](/guide/learning-path/backend) — 如果你是全栈，后端也要学
- [测试路线](/guide/learning-path/qa) — 前端测试自动化深度指南
- [产品经理路线](/guide/learning-path/product) — 理解需求侧的 AI 用法
