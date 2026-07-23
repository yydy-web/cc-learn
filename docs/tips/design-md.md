---
title: DESIGN.md — AI 原生设计系统文件格式
description: Google 开源的设计系统可移植格式，170K+ Stars，用一份 Markdown 文件让 Claude Code/Cursor/Copilot 生成统一品牌 UI，附带 CLI 校验和 Tailwind 导出
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★☆☆☆☆    |
| 🎨 设计 | ★★★★★  | ★★☆☆☆    |
| 📦 产品 | ★★★★☆  | ★☆☆☆☆    |

**🎯 学习产出：** 掌握 DESIGN.md 格式规范、CLI 四大命令、Claude Code 集成方式，能用一份文件跨 7+ Agent 平台统一品牌 UI，消除 AI 生成界面的视觉漂移

**🚀 AI 能力提升：** 设计系统工程化、跨 Agent 品牌一致性
:::

# DESIGN.md — AI 原生设计系统文件格式

> AI 不是不会做设计——它每次都重新发明你的品牌色，因为没有一份它能读懂的说明书。

## 概述

**DESIGN.md**（`google-labs-code/design.md`，17K+ GitHub Stars）是 Google Labs 于 2026 年 4 月开源的设计系统可移植格式。核心理念：**给 AI Agent 一份它能读的设计文档**——不是 Figma 文件（Agent 看不懂），不是口头描述（每次说法不一样），而是一份结构化的 Markdown 文件，放在项目根目录，所有 Agent 都按同一套规则生成 UI。

问题不是 AI 做不出好看的设计——是**每次生成的界面都不一样**。上一屏用了 `#3B82F6` 做主色，下一屏变 `#2563EB`；上一屏按钮圆角 8px，这一屏 6px。DESIGN.md 解决的是**视觉漂移**：把设计系统锁定在一个文件里，任何 Agent 读取后产出一致的外观。

不画画、不替换 Figma、不写 CSS。这是一份**给 Agent 看的设计说明书**——颜色叫什么名字、用在哪、为什么这么用。

加上社区模板库 `awesome-design-md`（100K+ Stars，73+ 品牌模板），累计生态 Stars 超过 170K。

**核心数据**：17K+ Stars（官方）、100K+ Stars（社区模板）、73+ 品牌模板、Apache 2.0、v0.3.0（alpha 但稳定）。

## 为什么需要 DESIGN.md？

### 问题：AI 生成 UI 的视觉漂移

```
第一屏：Agent 猜了一个蓝色 #3B82F6，按钮圆角 8px
第二屏：Agent 又猜了一个蓝色 #2563EB，按钮圆角 6px
第三屏：Agent 觉得换个风格更好，用了绿色
```

三个屏幕、三种蓝色、两套圆角——因为它们之间没有共享的设计约束。

### 答案：一份文件，所有 Agent 遵守

```
所有屏幕 ← DESIGN.md ← {
  主色: #1A1C1E,
  强调色: #B8422E,
  背景: #F7F5F2,
  圆角: { sm: 4px, md: 8px },
  字体: Public Sans
}
```

每屏都查同一份文件，每屏都用同一个颜色。

## 格式：两层结构，一个文件

DESIGN.md 是带 YAML 前置数据的 Markdown 文件。

### 第一层：YAML 前置数据（机器读的——精确值）

```yaml
---
name: Heritage
description: 温暖、稳重、手工感的品牌设计系统
colors:
  primary: "#1A1C1E"
  secondary: "#6C7278"
  accent: "#B8422E"
  neutral: "#F7F5F2"
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 3rem
    fontWeight: 700
  body:
    fontFamily: Public Sans
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: 4px
  md: 8px
  lg: 16px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "{spacing.md} {spacing.lg}"
  card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
---
```

Token 引用用 `{colors.accent}` 语法——改一个值，所有组件自动跟上。

### 第二层：Markdown 正文（人读的——设计理由）

正文用 `##` 标题组织，**8 个标准章节，顺序固定**：

| ## | 章节 | 内容 |
|----|------|------|
| 1 | **Visual Theme & Atmosphere** | 整体视觉感受和氛围 |
| 2 | **Color Palette & Roles** | 每个颜色的语义角色和使用场景 |
| 3 | **Typography Rules** | 字体层级、行高、字间距 |
| 4 | **Layout Principles** | 间距系统、网格、响应式规则 |
| 5 | **Component Stylings** | 按钮、卡片、输入框等组件规范 |
| 6 | **Depth & Elevation** | 阴影层级、z-index 规则 |
| 7 | **Do's and Don'ts** | 正反例——什么该做、什么不该 |
| 8 | **Agent Prompt Guide** | 专门写给 AI 的行为指令 |

Agent Prompt Guide 是 **DESIGN.md 的杀手特性**——它不是一个通用的"设计规范"，而是直接对 Agent 说："用 `accent` 做交互，别用 `primary`；按钮 hover 加 `primary` 背景；别用透明度表示禁用状态。"

### 一个完整的最小示例

```markdown
---
name: SaaS Dashboard
colors:
  primary: "#1E293B"
  accent: "#3B82F6"
  neutral: "#F8FAFC"
typography:
  h1: { fontFamily: Inter, fontSize: 2rem, fontWeight: 700 }
  body: { fontFamily: Inter, fontSize: 1rem, fontWeight: 400 }
rounded: { sm: 4px, md: 8px }
spacing: { sm: 8px, md: 16px, lg: 24px }
components:
  stat-card:
    backgroundColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
---

## Visual Theme & Atmosphere
Clean, data-focused, minimal. Blue as the sole interaction color.

## Color Palette & Roles
- `primary` (#1E293B) — Text, headings, structural elements
- `accent` (#3B82F6) — Buttons, links, selected states. The ONLY interaction color.
- `neutral` (#F8FAFC) — Page background

## Do's and Don'ts
- ✅ Use `{colors.accent}` for all interactive elements
- ✅ Use `{components.stat-card}` for metric cards
- ❌ Never use `{colors.accent}` as a background fill
- ❌ Never introduce new colors not in the tokens
```

约 30 行。Agent 读完后，所有 UI 输出共享同一套约束。

## 安装与 CLI

### 安装

```bash
npm install @google/design.md
```

Windows 上 `@` 可能需要引号——`npm install "@google/design.md"`。或者用别名：

```bash
npx designmd lint DESIGN.md
```

### 四大命令

#### `lint` — 校验文件是否正确

```bash
npx @google/design.md lint DESIGN.md
```

校验 9 条规则：

| 规则 | 级别 | 检查内容 |
|------|------|----------|
| `broken-ref` | error | `{colors.xxx}` 引用是否存在 |
| `contrast-ratio` | warning | 背景/文字对比度是否达到 WCAG AA（4.5:1） |
| `missing-primary` | warning | 是否定义了 `primary` 色 |
| `orphaned-tokens` | warning | 颜色 token 是否被组件引用 |
| `missing-typography` | warning | 有颜色但缺字体定义 |
| `section-order` | warning | 章节顺序是否正确 |
| `unknown-key` | warning | 是否拼错字段名（如 `colours:`） |
| `token-summary` | info | 各分类 token 统计 |
| `missing-sections` | info | 建议补全的可选章节 |

有 error 时退出码为 1。

#### `diff` — 比较两个版本

```bash
npx @google/design.md diff DESIGN.md DESIGN-v2.md
```

检测 token 级别的回归——改了哪个颜色、删了哪个字体。CI 里挂上，PR 改了设计 token 自动报警。

#### `export` — 导出为 Tailwind / DTCG

```bash
# Tailwind v3 config
npx @google/design.md export DESIGN.md --format tailwind > tailwind.theme.json

# Tailwind v4 CSS
npx @google/design.md export DESIGN.md --format css-tailwind > theme.css

# W3C Design Token Format
npx @google/design.md export DESIGN.md --format dtcg > tokens.json
```

不用手写 Tailwind 主题——DESIGN.md 就是真相源，导出就行。

#### `spec` — 输出格式规范

```bash
npx @google/design.md spec
```

把 DESIGN.md 格式规范输出为 Markdown 或 JSON。适合注入到 Agent 系统提示词里，教它怎么读 DESIGN.md。

## 在 Claude Code 中使用

### 5 分钟快速接入

**第一步：获取 DESIGN.md 文件**

三个来源：

1. **自己写**（30 行起步）
2. **从 Stitch 生成**（`stitch::extract-design-md` / `design-md` skill）
3. **社区模板**（[awesome-design-md](https://github.com/VoltAgent/awesome-design-md)，73+ 品牌：Stripe、Vercel、Linear、Apple、Spotify 等）

**第二步：放到项目根目录**

```
my-project/
├── DESIGN.md        ← 放这里
├── src/
└── CLAUDE.md
```

**第三步：在 CLAUDE.md 中引用**

```markdown
## Design System
Always read DESIGN.md at project root before generating any UI.
- Reference colors by semantic role (accent, primary), never by raw hex
- Use spacing scale tokens only (sm, md, lg, xl)
- Never introduce new colors or button styles not in the file
- Run `npx @google/design.md lint DESIGN.md` after UI changes
```

**第四步：校验**

```bash
npx @google/design.md lint DESIGN.md
```

**第五步：测试**

开新 Claude Code 会话，随便让 AI 生成一个界面——第一次就应该用你的品牌色。

### 社区插件：claude-plugin-design-md

一行安装：

```
/plugin marketplace add eveiljuice/claude-plugin-design-md
/plugin install design-md@claude-plugin-design-md
```

或用命令行直接下载模板：

```bash
npx -y claude-plugin-design-md atmospheric-glass --out design/DESIGN.md
```

内置三个官方示例模板：`atmospheric-glass`、`paws-and-paths`、`totality-festival`。

## 真实案例

### 案例一：从零搭建品牌页面 —— 完整对话流程

以下是用 DESIGN.md + Claude Code 从无到有搭建一个 SaaS 仪表盘品牌页面的完整对话记录。项目名 `MetricFlow`，定位数据分析平台。

**第一步：让 Claude Code 帮忙写 DESIGN.md**

```
👤 用户：
我想做一个叫 MetricFlow 的 SaaS 仪表盘产品。定位是"给非技术团队的数据分析工具"。
先别写代码。先帮我生成一份 DESIGN.md。

产品气质：专业但不冷冰冰，可信赖但不高高在上。
参考品牌：Notion 的克制、Linear 的精准、Vercel 的现代感。
主色大概是深蓝灰方向，但不要太像 GitHub。

🤖 Claude：
好的，我先不写代码，专注设计系统。

---

name: MetricFlow
description: 面向非技术团队的数据分析平台——专业、可信赖、亲和

colors:
  primary: "#1E293B"
  secondary: "#475569"
  accent: "#3B82F6"
  accentHover: "#2563EB"
  success: "#10B981"
  warning: "#F59E0B"
  neutral: "#F8FAFC"
  surface: "#FFFFFF"
  border: "#E2E8F0"
  textPrimary: "#0F172A"
  textSecondary: "#64748B"

typography:
  h1:
    fontFamily: Inter
    fontSize: 2.5rem
    fontWeight: 700
    lineHeight: 1.2
  h2:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5

rounded:
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px

spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px

components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.lg}"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.border}"
    padding: "{spacing.lg}"

---

## Visual Theme & Atmosphere

安静、克制、数据优先。蓝色是唯一的交互色。大量留白让数据呼吸。
不抢眼——让图表和数据自己说话。

## Color Palette & Roles

- `primary` (#1E293B) — 标题、正文、结构性元素
- `accent` (#3B82F6) — 按钮、链接、选中态。唯一交互色。不用在其他地方。
- `neutral` (#F8FAFC) — 页面背景。不纯白，带极轻微暖色防止刺眼。
- `success` (#10B981) — 仅用于正向数据指标

## Typography Rules

全站 Inter。不用第二套字体。层级靠字号和字重区分，不靠换字体。
标题用 700/600，正文 400，数字指标用 600。

## Do's and Don'ts

- ✅ 用 `{colors.accent}` 做所有交互元素
- ✅ 用 `{components.card}` 做数据卡片容器
- ✅ 数据指标数字用 600 字重
- ❌ 永远不用 `{colors.accent}` 做背景填充
- ❌ 不引入 token 之外的颜色
- ❌ 渐变、阴影只用 `{spacing}` 里的间距值
- ❌ 不用 emoji 做图标——用 Heroicons 或 Lucide

## Agent Prompt Guide

你是 MetricFlow 的前端开发 Agent。
生成任何 UI 前先读完这份文件。
颜色只能从 `colors` token 中选，字只能从 `typography` token 中选。
如果有组件 token（如 {components.button-primary}），直接用它的值，不要自己组合。
如果不确定某个交互行为，参考 Linear 的设计模式——一切从简。
```

**第二步：用户审查并修改**

```
👤 用户：
整体很好。三个调整：
1. accent 太亮了，换成 #2563EB，accentHover 换成 #1D4ED8
2. 加一个数据指标专用的字体 token：
   metric: { fontFamily: Inter, fontSize: 2rem, fontWeight: 600, fontFeature: "tnum" }
   ← "tnum" 是等宽数字，很重要，列对齐用
3. 加组件：stat-card
   backgroundColor: "{colors.surface}"
   rounded: "{rounded.lg}"
   border: "1px solid {colors.border}"
   padding: "{spacing.lg}"

🤖 Claude：
已更新 DESIGN.md。改动：
- accent: #3B82F6 → #2563EB
- accentHover: #2563EB → #1D4ED8
- 新增 typography.metric（等宽数字，用于表格/KPI 列对齐）
- 新增 components.stat-card

要 lint 一下吗？
```

**第三步：第一次 UI 生成**

```
👤 用户：
好。现在读 DESIGN.md，然后帮我生成 MetricFlow 的首页。
页面结构：
- 顶部导航：Logo 左、3 个链接（产品/定价/文档）中、登录+免费试用按钮右
- Hero 区：一行大字标题 + 副标题 + CTA 按钮 + 一个示意仪表盘截图占位区
- 三列数据卡片区：用 stat-card 组件，分别展示"实时数据""团队协作""一键分享"
- 底部：简单版权信息

先展示 theme.ts token 提取结果，我确认后再写组件代码。

🤖 Claude：
已读 DESIGN.md。提取的 theme.ts：

import { StyleSheet } from 'react-native'

export const colors = {
  primary: '#1E293B',
  secondary: '#475569',
  accent: '#2563EB',
  accentHover: '#1D4ED8',
  success: '#10B981',
  warning: '#F59E0B',
  neutral: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
} as const

export const typography = {
  h1: { fontFamily: 'Inter', fontSize: 40, fontWeight: '700', lineHeight: 48 },
  h2: { fontFamily: 'Inter', fontSize: 28, fontWeight: '600', lineHeight: 36 },
  body: { fontFamily: 'Inter', fontSize: 16, fontWeight: '400', lineHeight: 26 },
  caption: { fontFamily: 'Inter', fontSize: 14, fontWeight: '400', lineHeight: 21 },
  metric: { fontFamily: 'Inter', fontSize: 32, fontWeight: '600', fontFeature: '"tnum"' },
} as const

export const rounded = { sm: 4, md: 8, lg: 12, xl: 16 } as const
export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const

确认后我生成页面组件。

👤 用户：
确认。继续。

🤖 Claude 生成组件代码，输出 HeroSection、StatCard、Navbar、Footer 四个组件。
所有颜色/间距/圆角/字体均引用 theme.ts 中的 token。
```

**第四步：细节迭代**

```
👤 用户：
整体方向对。具体问题：
1. Hero 区标题太大，手机上折行了。降到 32px。
2. 三列卡片在小屏幕上应该堆叠成一列，现在是强制三列。
3. CTA 按钮 hover 时颜色没变——用 accentHover。
4. 免费试用按钮给了实色背景，应该用 outline 样式（边框 accent，白底）。

🤖 Claude：
修了四个问题：
1. h1 fontSize 40 → 32，lineHeight 同步调整为 40
2. 三列卡片加 media query：< 768px 时 flex-direction: column
3. 按钮 hover 背景从 accent 切到 accentHover
4. CTA 旁边"免费试用"改成 outline 变体：backgroundColor: transparent, borderColor: accent, textColor: accent

👤 用户：
再加一个页面的空状态——"你还没有任何数据面板"。
用 caption 字体，accent 做空状态插图的主色，不要用灰色（灰色空状态像出错页面）。

🤖 Claude：
在 dashboard 页面加 EmptyState 组件：
- 插图用 accent (#2563EB) 作为主色
- 标题用 body 字体，"欢迎来到 MetricFlow"
- 副标题用 caption 字体，"创建你的第一个数据面板，开始可视化团队数据"
- 底部放一个 button-primary，"创建面板"
- 所有值来自 DESIGN.md token，没有硬编码颜色

👤 用户：
lint 跑一下 DESIGN.md。

🤖 Claude：
npx @google/design.md lint DESIGN.md

结果：
✓ 所有 token 引用可解析
⚠  缺少 elevation 章节（建议补充 z-index 层级）
✓ 对比度检查通过
⚠  orphaned tokens: 'warning' 定义了但没被任何组件引用

要不要补 elevation？
```

**效果对比**：

| | 无 DESIGN.md | 有 DESIGN.md |
|---|---|---|
| 首轮可用率 | ~50%（颜色乱，间距不一致） | ~90%（token 驱动，微调即可） |
| 后续迭代 | 每轮手动找颜色 hex | 改 token 自动全站同步 |
| 跨页面一致性 | 导航和内容区颜色不同 | 全部引用同一份 token |
| 重复劳动 | 每次描述"那种蓝" | Agent 自己查文件 |

### 案例二：品牌切换 —— 完整对话流程

同一个 MetricFlow 项目，市场部要求做一套合作伙伴落地页，用另一个品牌色（绿色系）。

```
👤 用户：
市场部要一个合作伙伴落地页，品牌色换成绿色系。
但我不要重新写整个页面——你帮我在现有 DESIGN.md 基础上创建一个变体文件 DESIGN.partners.md，
只覆盖颜色部分。组件、字体、间距沿用主 DESIGN.md。

🤖 Claude：
创建 DESIGN.partners.md：

---
name: MetricFlow Partners
extends: DESIGN.md
colors:
  accent: "#059669"
  accentHover: "#047857"
---

只有 accent 色从蓝变绿，其余 token 全部继承自 DESIGN.md。

👤 用户：
用这个变体文件生成合作伙伴落地页。页面结构：
- Hero：和首页一样结构，但标题改成"与 MetricFlow 一起成长"
- 三列改成：佣金计划/技术资源/专属支持
- 多一个"已合作的伙伴"Logo 墙

🤖 Claude：
基于 DESIGN.partners.md 生成 PartnersPage 组件。
- 所有 accent 自动变成 #059669
- 按钮、链接、数据指标高亮全部变绿
- Hero、StatCard、Navbar、Footer 复用首页组件，只改文案和颜色引用
- Logo 墙用灰度处理（filter: grayscale(1)），hover 还原

👤 用户：
diff 一下两个 DESIGN.md，确认只改了颜色。

🤖 Claude：
npx @google/design.md diff DESIGN.md DESIGN.partners.md

Changes detected:
  colors.accent:    #2563EB → #059669
  colors.accentHover: #1D4ED8 → #047857

No other tokens changed. No regressions.

👤 用户：
完美。两个问题：
1. 如果市场部以后改绿色的具体色值，只改 DESIGN.partners.md 就行？
2. 主品牌的改动会自动同步到合作伙伴页面吗？

🤖 Claude：
1. 对，改 DESIGN.partners.md 里的 hex → re-lint → 重新生成页面。所有绿色元素自动更新。
2. 不会自动同步。主 DESIGN.md 改了字体/间距后，需要手动跑一次 diff 确认
   哪些要同步到 DESIGN.partners.md。建议在 CI 里加一步：
   `npx @google/design.md diff DESIGN.md DESIGN.partners.md || echo "需要手动同步"`
```

**效果**：品牌变体切换从"改所有 CSS"变成"改两个 hex + 重新生成"。一份主文件管理设计资产，变体文件只覆盖差异部分。

### 案例三：设计审查 —— Claude Code 反向审查 DESIGN.md

写完 DESIGN.md 之后，让 Claude Code 用"设计师视角"反过来审查这份文件的质量。

```
👤 用户：
假装你是一个有 10 年经验的品牌设计师。
审查 DESIGN.md，找问题——可访问性、一致性、缺失的边界情况、Token 命名。
不要客气，直接说。

🤖 Claude（设计师视角审查）：
作为品牌设计师，我有以下顾虑：

1. 🔴 可访问性 — caption (#64748B) 在 neutral 背景 (#F8FAFC) 上对比度约 3.2:1，
   WCAG AA 要求 4.5:1。这个灰色对小字不够用。建议 caption 换成 #475569（对比度 4.8:1）。

2. 🟡 Token 命名 — 'accent' 不语义化。如果以后加第二个强调色怎么办？
   叫 'interactive' 或 'brandBlue' 更明确。类似地 'success' 没问题，
   但 'warning' 定义了却没用，要么删掉，要么给它一个使用场景。

3. 🟡 缺失状态 — 没有 disabled 状态的定义。按钮 disabled 什么颜色？输入框 disabled 什么颜色？
   建议加 components.button-disabled 和 components.input-disabled。

4. 🟡 动效缺失 — 没有任何 transition/animation token。
   建议至少加：transition: { duration: 150ms, easing: 'ease-in-out' }，
   组件规范里明确哪些交互需要动效（按钮 hover、卡片 hover、页面切换）。

5. 🟢 做得好的 —— 'tnum' 给数字指标用特别好，做了 5 年设计师我很少在 AI 生成的规范里看到。
   "不用 emoji 做图标"也很关键，避免 AI 偷懒。
   整体方向清晰，没有过度设计——这份文件接近生产可用。

👤 用户：
全改。按你的建议更新 DESIGN.md，然后跑 lint。

🤖 Claude：
更新中：
- caption: #64748B → #475569（对比度 4.8:1，通过 WCAG AA）
- accent → interactive（更语义化，便于未来扩展）
- 新增 disabled token：{ backgroundColor: "#94A3B8", textColor: "#FFFFFF" }
- 新增 buttons-disabled / inputs-disabled 组件 token
- 新增 transition token：{ duration: "150ms", easing: "ease-in-out" }
- 删除了 orphaned 'warning' token

lint 结果：
✓ 所有 token 引用可解析
✓ 对比度全部通过 WCAG AA
✓ 章节顺序正确
0 errors, 0 warnings
```

**这个对话的关键**：DESIGN.md 不只是单向的"人写，AI 读"——AI 也可以反过来审查和修正 DESIGN.md。你写初稿，AI 做可访问性审查和边界情况补充。

### 案例四：从截图反向提取 —— 不写任何 token

没有 DESIGN.md，只有一个竞品页面的截图。

```
👤 用户：
[上传了一张 SaaS 仪表盘截图]
这是 Notion 风格的数据仪表盘。帮我反向提取一份 DESIGN.md，
然后生成一个类似风格但内容不同的页面。

🤖 Claude：
分析截图中…

提取的 DESIGN.md：
- 主色：深灰黑 #191919（Notion 特征——几乎是纯黑）
- 次要色：暖灰 #37352F
- 强调色：不存在的蓝色——Notion 用深灰代替蓝色做交互
- 背景：极浅灰 #FBFAF9
- 字体：Inter（UI 部分）+ 等宽（代码/数据部分）
- 圆角：统一 6px，克制得很
- 间距：宽松，最小 8px，常用 16-24px
- 没有阴影，用 1px 边框区分层级

生成 DESIGN.notion-inspired.md 完整文件…

👤 用户：
好，用这份 DESIGN.md 生成一个 CRM 客户管理页面的仪表盘。
不要照搬截图的内容——换一套完全不同的数据和功能。

🤖 Claude：
基于 DESIGN.notion-inspired.md 生成 CRMDashboard：
- 页面标题："客户概览"（Inter, 2rem, 700）
- 三列数据卡片：总客户数/本月新增/活跃客户（tnum 对齐）
- 右侧搜索框（border-only, 1px #E0E0E0）
- 客户列表表格（极简——去掉斑马纹、去掉竖分割线）
- 全部交互只有深灰/黑色，完全没有蓝色

👤 用户：
和原截图对比一下风格一致性。

🤖 Claude：
对比结果：
✓ 颜色：深灰主色 + 无蓝色 + 1px 边框 = 100% 匹配 Notion 风格
✓ 字体：Inter + tnum 数据对齐 = 匹配
✓ 间距：16-24px 宽松间距 = 匹配
✓ 圆角：统一 6px = 匹配
△ 原截图的表格行之间有轻微的 hover 背景变灰（#F7F6F3），补上了

整体风格还原度约 90%。缺少的 10% 是 Notion 特有的 svg 图标风格——这个没法从 token 捕捉。
```

### 案例五：团队协作 —— PM 写 DESIGN.md，开发用 Claude Code 实现

PM 不会写代码，但能描述品牌感觉。DESIGN.md 作为 PM 和开发之间的交接物。

```
👤 PM：
我们用 Claude Code 做内部工具开发。我想把设计定下来，但我不写代码。
帮我用"对话问答"的方式生成一份 DESIGN.md。
你问我问题，我回答，最终输出文件。

🤖 Claude：
好，我一题一题问你。

Q1: 这个产品的核心情绪是什么？三个词。
A1: 高效、可靠、不啰嗦。像瑞士军刀——没有多余的东西。

Q2: 如果产品是一个人，ta 的性格是什么？
A2: 话少的工程师。不说废话，但每件事都做对。

Q3: 你喜欢哪些 App 的视觉风格？
A3: Linear 的干净、Slack 的亲和、Apple Notes 的极简。

Q4: 你的用户是谁？
A4: 内部运营团队。他们不关心技术，关心"能不能三分钟搞定"。

Q5: 有没有绝对不能用的颜色？
A5: 不要粉色。不要渐变。不要花花绿绿——这是一个严肃工具。

Q6: 数据展示多吗？
A6: 超多。表格、KPI 卡片、图表——占 70% 的界面。

🤖 Claude：
好了，根据你的回答生成 DESIGN.md。

关键设计决策：
- 主色深蓝灰（像工程师，不像营销）
- 强调色用青蓝 #0EA5E9（比纯蓝多一分现代感）
- 字体 JetBrains Mono 做数据（等宽天生适合表格对齐）
- body 用 Inter（全局正文）
- 禁用阴影——用 1px 边框做层级（扁平、工整）
- spacing 比常见设计紧一些（md: 12px 而不是 16px）——运营人员需要信息密度

完整文件：[DESIGN.md 输出]

👤 PM：
给我用非设计语言解释一下"spacing 紧"是什么意思。

🤖 Claude：
我们常见网页的行间距大概是一个手指宽（16px）。你的运营同事要看很多数据，
16px 会让表格一屏只能显示 12 行。我用 12px（紧一点），同样大小的屏幕可以显示 18 行。
少滚动，多干活。

👤 PM：
懂了。就这么定。文件我 commit 到仓库，开发那边 Claude Code 会自动读吗？

🤖 Claude：
对。只要开发同事的 CLAUDE.md 里有这句话：
"Always read DESIGN.md at project root before generating any UI."
每次生成界面，它都会自动读你的颜色/字体/间距，不需要你再跟开发说"那个蓝色是什么蓝"。

👤 PM：
开发说卡片圆角 8px 太小了，想改 12px。我应该怎么改？

🤖 Claude：
改 DESIGN.md 里的 `rounded.md: 8px` → `rounded.md: 12px`。
然后跑 `npx @google/design.md lint DESIGN.md`。
告诉开发："token 改了，重新生成一下。"
你说的是 12px，他生成的是 12px。中间不会变形。
```

**这个案例的核心**：PM 负责 DESIGN.md（设计意图），开发负责 CLAUDE.md（实现约束），Claude Code 读两份文件，产出一致代码。DESIGN.md 是 PM 和开发之间的"设计合约"。出问题了？查 DESIGN.md diff，谁的修改一目了然。

## 和其他工具的关系

| | DESIGN.md | Stitch Skills | Spec Kit |
|---|---|---|---|
| **是什么** | 设计系统的文件格式 | 设计↔代码转换的技能库 | 规格驱动的开发流程 |
| **管什么** | 设计 token 和规则 | 设计稿和代码的转换 | 需求和计划的文档化 |
| **如何使用** | 放在项目根目录，Agent 自动读取 | `/stitch::code-to-design` 等命令 | `/spec-kit` 6 步命令 |
| **互补关系** | 产物 | 工具 | 流程 |

三者组合：Spec Kit 定需求 → Stitch Skills 做设计稿 → **DESIGN.md 做交接文件**，交给 Claude Code 生成 UI。

## 对比：口头描述 vs 组件库文档 vs DESIGN.md

| | 口头描述 | 组件库文档 | DESIGN.md |
|---|---|---|---|
| **Agent 能否读取** | 每次得重新说 | 读不懂 Storybook | 原生理解 |
| **一致性** | 每次不同 | 取决于文档质量 | YAML 强制一致 |
| **跨 Agent** | 换个 Agent 重新说 | Storybook 绑定特定框架 | Claude Code/Cursor/Copilot 通用 |
| **版本控制** | 不可追踪 | Storybook 版本不随代码 | Git diff 清晰 |
| **CLI 校验** | 无 | 无 | `lint` / `diff` / `export` |
| **门槛** | 零门槛 | 需要组件库 | 需要把设计系统写成 token |

DESIGN.md 不替代组件库——它替代的是"设计师和开发者之间靠嘴说的那部分"。

## 常见问题

**Q: 必须配合 Google Stitch 使用吗？**

不。DESIGN.md 是完全独立的文件格式。Stitch 可以生成 DESIGN.md（通过 `stitch::design-md` skill），但你完全可以手写或用社区模板。CLI（`@google/design.md`）也不依赖 Stitch。

**Q: 和 Figma 是什么关系？**

互补，不竞争。Figma 是设计师的画板；DESIGN.md 是 Agent 的说明书。设计师在 Figma 里创作，产出的设计系统写进 DESIGN.md，Agent 读 DESIGN.md 生成代码。两者间的桥梁是 Stitch Skills（自动提取和转换）。

**Q: 每个项目都要自己写吗？**

不用。社区模板库 [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) 有 73+ 品牌模板，挑一个风格接近的改改就能用。或者用 `claude-plugin-design-md` 一行命令生成。

**Q: 只适用于新项目吗？老项目能用吗？**

老项目更该用。把现有代码里的颜色、字体、间距提取到 DESIGN.md，之后所有改动都先在文件里改 token，再让 Agent 同步到代码。反向工程用 Stitch Skills 的 `extract-design-md`。

**Q: Agent 真的会严格遵守吗？**

是概率性遵守，不是编译器级别的强制。LLM 把 DESIGN.md 当"强烈指导"，输出大概率遵循——比没有文件时好得多。需要强制执行时，配 CLAUDE.md 指令（"Never introduce new colors"）+ CI 里挂 `lint` 检查 + Code Review 把关。

**Q: 多久更新一次？**

每次改设计系统时。改了主色 → 更新 `colors.primary` → 跑 `lint` → commit。建议在 PR 里跑 `diff` 看改了哪些 token，防止意外修改。

**Q: 和 Tailwind 主题文件有什么区别？**

DESIGN.md 是源头，Tailwind 配置是产物。DESIGN.md 多了一层语义——"这是强调色，只用于交互元素"——Agent 能理解这个意图，Tailwind 配置不能。用 `export --format tailwind` 同步到 Tailwind，保持单源真实。
