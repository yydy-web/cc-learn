---
title: 前端通用 Skills
description: 跨框架的前端开发 Skills——UI 设计、Web 设计规范和 UnJS 生态
---

# 前端通用 Skills

以下 Skills 不依赖特定前端框架，适用于任何前端项目的 UI 设计、Web 规范审查和 JavaScript 工具链。

:::tip
本页属于[技能系统](/skills/)的一部分。更多 Skills 资源：[技能市场](/skills/overview/skills-marketplace) | [Superpowers](/skills/workflow/superpowers)
:::

## 推荐 Skills

### Frontend Design（Anthropic 官方）

[frontend-design](https://www.skills.sh/anthropics/skills/frontend-design) 是 Anthropic 官方出品的设计技能，帮助 Claude Code 创建独特、高品质的前端界面，避免千篇一律的 "AI 风格" 设计。

```bash
npx skills add https://github.com/anthropics/skills --skill frontend-design
```

**核心能力：**

| 特性         | 说明                                                     |
| ------------ | -------------------------------------------------------- |
| 美学方向规划 | 在编码前引导选择视觉方向（极简、复古未来、奢华、有机等） |
| 设计基础要素 | 强调排版、CSS 变量主题、动效、空间构图和纹理细节         |
| 多框架支持   | 生成 HTML/CSS/JS、React 或 Vue 代码                      |
| 反平庸设计   | 避免过度使用的字体、陈旧配色和可预测布局                 |

:::tip
使用 `frontend-design` 前，先用自然语言描述你想要的视觉风格和目标受众，Claude Code 会根据这些信息生成更有针对性的设计方案。
:::

### Web Design Guidelines（Vercel）

[web-design-guidelines](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines) 来自 Vercel Labs，提供 100+ 条 Web 界面最佳实践规则，用于审查 UI 代码的合规性。

```bash
npx skills add vercel-labs/agent-skills
```

**审查维度：**

| 维度     | 规则示例                               |
| -------- | -------------------------------------- |
| 无障碍   | ARIA 标签、语义化 HTML、键盘导航       |
| 表单     | autocomplete、校验和错误处理           |
| 动画     | prefers-reduced-motion、合成器友好变换 |
| 图片     | 尺寸声明、懒加载、alt 文本             |
| 性能     | 虚拟化、布局抖动避免、preconnect       |
| 深色模式 | color-scheme、theme-color meta 标签    |
| 国际化   | Intl.DateTimeFormat、Intl.NumberFormat |
| 触控交互 | touch-action 属性、tap-highlight 处理  |

:::info
安装后，直接让 Claude Code "审查我的 UI" 或 "检查无障碍合规性"，它会自动应用这 100+ 条规则进行审查。
:::

### UI/UX Pro Max

[ui-ux-pro-max](https://www.skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max) 是一个全面的设计智能系统，覆盖 10 个技术栈，内置设计系统生成和产品级 UI/UX 建议。

```bash
npx skills add https://github.com/nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max
```

**内置资源：**

| 资源     | 数量                                          |
| -------- | --------------------------------------------- |
| 设计风格 | 50+ 种                                        |
| 配色方案 | 161 个                                        |
| 字体搭配 | 57 组                                         |
| UX 规则  | 99 条（无障碍、触控、性能、响应式）           |
| 图表类型 | 25 种                                         |
| 产品模式 | 161 种（含推理规则）                          |
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

**核心库分类：**

| 分类          | 代表库                         | 说明                                    |
| ------------- | ------------------------------ | --------------------------------------- |
| HTTP & 服务端 | H3, Nitro, Listhen             | 轻量级 HTTP 框架和通用 Web 服务器       |
| HTTP 客户端   | Ofetch, Httpxy, Crossws        | fetch 替代、HTTP/WebSocket 代理         |
| 路由 & 请求   | Radix3, Hookable, Unctx        | Radix Tree 路由、Hooks 系统、组合式模式 |
| 工具库        | Defu, Destr, Ohash, Pathe, UFO | 合并、JSON 解析、哈希、路径、URL        |
| 存储 & 数据   | Unstorage, Db0                 | 异步键值存储、轻量 SQL 连接器           |
| 配置管理      | C12, Confbox, Rc9              | 智能配置加载、YAML/TOML/JSON 解析       |
| 构建工具      | Unbuild, Unplugin              | 统一构建系统、跨 bundler 插件           |
| 模块系统      | Jiti, Mlly, Unimport           | 运行时 TS/ESM、模块工具、自动导入       |
| CLI & 脚手架  | Citty, Giget, Nypm             | CLI 构建器、模板下载、包管理器统一      |

:::info
UnJS 的包大多被 Nuxt 3 和 Nitro 内部使用。即使你的项目不是 Nuxt，这些独立包也可以在任何 JavaScript 项目中使用——例如 `ofetch` 替代 `axios`，`c12` 加载配置文件，`consola` 替代 `console.log`。
:::

## 下一步

- [React 生态 Skills](/skills/frontend/react) — React 专属 Skills
- [Vue 生态 Skills](/skills/frontend/vue) — Vue 专属 Skills
- [前端开发最佳实践](/tips/frontend-best-practices) — 完整的前端开发指南
- [技能市场](/skills/overview/skills-marketplace) — 浏览和安装社区 Skills
