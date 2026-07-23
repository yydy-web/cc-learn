---
title: Stitch Skills — Google 跨平台 Agent 设计技能库
description: Google Stitch 官方 15 个 Agent Skill，覆盖设计→代码双向转换、设计系统管理、组件生成，兼容 Claude Code/Cursor/Gemini CLI 等 7+ 平台
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★☆☆☆    |
| 🎨 设计 | ★★★★★  | ★★☆☆☆    |
| 📦 产品 | ★★★★☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握 Stitch Skills 三个插件 15 个技能的使用方式，能独立完成设计→代码、代码→设计双向转换，管理设计系统，生成生产级 React/React Native 组件

**🚀 AI 能力提升：** 设计工程化、跨平台技能复用
:::

# Stitch Skills — Google 跨平台 Agent 设计技能库

> 设计不只是画图——Agent 也能读懂设计语言，把代码和设计变成同一件事的两面。

## 概述

**Stitch Skills**（`google-labs-code/stitch-skills`，7.4K+ GitHub Stars）是 Google 推出的跨平台 Agent 技能库，专为 **Google Stitch** 设计平台打造。核心理念：**设计即代码，代码即设计**——让 AI Agent 能读懂前端代码里的设计语言，也能把设计稿变成生产级组件。

15 个技能覆盖三个领域：**设计提取**（代码→设计）、**组件生成**（设计→代码）、**设计工程化**（设计系统管理、质量校验）。兼容 Claude Code、Cursor、Gemini CLI、Codex、Windsurf、Aider、Antigravity 共 7 个平台。

不只是"截图转代码"——Stitch Skills 提取的是**设计系统**：颜色、字体、间距、组件变体。产出的是带设计 token 的生产代码，不是一次性原型。

**核心数据**：7.4K+ Stars、15 个 Skill、3 个插件、7+ 平台兼容、Apache 2.0 开源。

## 前置条件：Stitch MCP 服务器

所有技能依赖 **Stitch MCP 服务器**。先按[官方文档](https://stitch.withgoogle.com/docs/mcp/setup/)完成注册和凭证配置，才能在 Claude Code 中使用。

## 安装

### 方式一：安装全部插件（推荐）

```bash
npx plugins add google-labs-code/stitch-skills --scope project --target claude-code
```

三个插件（`stitch-design`、`stitch-build`、`stitch-utilities`）一次性安装到当前项目。

### 方式二：按需选择单个 Skill

```bash
npx skills add google-labs-code/stitch-skills
```

交互式选择需要的 skill。注意：部分 skill 之间有依赖关系，选择性安装时确保把依赖也装上。

## 技能全景：15 个 Skill 分三类

### stitch-design — 核心设计工作流（6 个）

| Skill | 做什么 | 典型用法 |
|-------|--------|----------|
| `stitch::code-to-design` | 前端代码转 Stitch 设计 | 把 React/Vue 页面反向提取为设计稿 |
| `stitch::generate-design` | 文本/图片生成新设计 | "做一个约会 App 的浏览页" |
| `stitch::manage-design-system` | 管理设计系统 | 上传 DESIGN.md 并应用到全部页面 |
| `stitch::extract-design-md` | 从源码提取设计系统 | 扫描 `/src` 生成 `.stitch/DESIGN.md` |
| `stitch::extract-static-html` | 抓取运行中页面的静态 HTML | 把 `localhost:3000/profile` 导出为静态快照 |
| `stitch::upload-to-stitch` | 上传本地素材到 Stitch | 把 HTML/图片/稿图推到 Stitch 项目 |

### stitch-build — 代码生成与框架集成（5 个）

| Skill | 做什么 | 典型用法 |
|-------|--------|----------|
| `stitch::react-components` | Stitch 设计转 React 组件 | 自动校验设计 token 一致性 |
| `stitch::react-native` | 设计转 React Native | 带 StyleSheet 和平台适配 |
| `react-vite-dashboard` | 设计转 React + Vite 仪表盘 | TanStack Query + Web3 数据读取 |
| `remotion` | 生成产品走查视频 | Remotion 动画 + 镜头推拉 |
| `shadcn-ui` | shadcn/ui 集成指导 | 搭建数据表格、排序筛选等 |

### stitch-utilities — 设计辅助工具（4 个）

| Skill | 做什么 | 典型用法 |
|-------|--------|----------|
| `design-md` | 从 Stitch 项目生成 DESIGN.md | 分析设计项目，输出语义化设计文档 |
| `enhance-prompt` | 模糊想法精炼为专业设计提示 | "做个设置页" → 带 UI/UX 关键词的精炼 prompt |
| `stitch-loop` | 单 prompt 生成多页网站 | "做一个 5 页作品集网站" |
| `taste-design` | 生成反"AI 味"的 DESIGN.md | 强制高级排版、校准配色，避免千篇一律 |

## 典型工作流

### 场景一：已有前端项目，想建立设计系统

```
1. stitch::extract-design-md  扫描 /src → 生成 .stitch/DESIGN.md
2. stitch::manage-design-system  上传 DESIGN.md，应用到全部页面
3. stitch::code-to-design  把核心页面转成 Stitch 设计稿
```

三步把散落在代码里的设计语言收拢成一个可管理的设计系统。之后设计师在 Stitch 里改设计，开发用 `stitch::react-components` 生成代码——双向同步。

### 场景二：从零设计新功能

```
1. stitch::enhance-prompt  "做个数据分析仪表盘" → 精炼为专业设计提示
2. stitch::generate-design  根据提示生成设计稿
3. 在 Stitch 中反复调整，直到满意
4. stitch::react-components  一键生成 React 组件代码
```

先设计再写代码。改了设计稿再跑一次生成，不用手动同步。

### 场景三：把运行中的网站变成设计资产

```
1. stitch::extract-static-html  把 localhost:3000 的页面抓成静态 HTML
2. stitch::upload-to-stitch  推到 Stitch 项目
3. stitch::generate-design  基于抓取结果迭代新版本
```

竞品分析或旧项目翻新时特别有用——不需要源码，有页面就行。

## 真实案例

### 案例一：从 React 项目反向提取设计系统 —— 完整对话流程

一个做了 8 个月的 Dashboard 项目，没有设计文档，所有颜色/字体散落在 40+ 个组件里。目标：用 stitch-skills 把设计语言提取出来，变成可管理的 DESIGN.md。

```
👤 用户：
我们的项目在 /src，做了 8 个月，没有设计系统文档。
帮我用 stitch-skills 把现有代码里的设计语言提取出来。

🤖 Claude：
我用 stitch::extract-design-md 扫描 /src 目录。

正在扫描 /src 下所有组件文件…
发现：
- 颜色：7 种 hex 值重复出现
  · #1E293B（出现 143 次——标题、正文）
  · #3B82F6（出现 89 次——按钮、链接）
  · #F8FAFC（出现 56 次——页面背景）
  · #FFFFFF（出现 201 次——卡片、输入框背景）
  · #E2E8F0（出现 47 次——边框、分割线）
  · #10B981（出现 23 次——成功状态、正向数据）
  · #EF4444（出现 18 次——错误状态、删除按钮）

- 字体：Inter 占 90%，等宽字体混用了 3 种（Fira Code / JetBrains Mono / SF Mono）

- 间距：4px 基础单位，实际用到的有 4/8/12/16/20/24/32
  但有些组件用了 14px、18px——不在任何体系里

- 圆角：4px/6px/8px/12px/16px/999px，其中 6px 只在一个地方出现（ProfileAvatar）

生成 .stitch/DESIGN.md…
```

```
👤 用户：
好。两个问题：
1. 等宽字体混用 3 种——这是个 bug 还是要统一？
2. 圆角 6px 只在一个地方出现——帮我看看是哪个组件。

🤖 Claude：
等宽字体混用分析：
- Fira Code：12 个代码块组件（CodeBlock.tsx）
- JetBrains Mono：2 个文件（MetricCard.tsx 的数字显示）
- SF Mono：1 个文件（Timeline.tsx 的时间戳）
→ 是 bug，不是刻意设计。MetricCard 和 Timeline 应该用 Fira Code 统一。

圆角 6px 定位：
- src/components/ProfileAvatar.tsx:47 — `borderRadius: 6`
- 注释写着"临时，跟设计师确认"
→ 建议改成 token 里已有的 rounded.md（8px），差距 2px 视觉可忽略。

👤 用户：
改。把等宽字体统一成 Fira Code，ProfileAvatar 圆角改成 8px。
然后重新跑 extract-design-md。

🤖 Claude：
已修改：
- MetricCard.tsx: fontFamily 改为 'Fira Code'
- Timeline.tsx: fontFamily 改为 'Fira Code'
- ProfileAvatar.tsx: borderRadius 改为 8

重新扫描：
DESIGN.md 已更新——现在是 6 种颜色、1 种等宽字体、6 档间距（去掉了 14/18px 异常值）、5 档圆角（去掉 6px）。

建议：14px 和 18px 间距如果是有意使用的，应该加到 spacing 体系里。
如果只是历史遗留，改为最近的 token 值（14→12 或 16，18→16 或 20）。
要我逐个定位吗？

👤 用户：
逐个定位，每个告诉我哪个组件、什么用途、建议怎么改。

🤖 Claude：
14px 间距（3 处）：
1. TagBadge.tsx:12 — 标签内边距 padding: 14px → 建议改 12px（sm=8 太小，md=16 太大，取中不合理）
   但这正好说明了你的 spacing 体系缺一档。要不要加 spacing.sm-plus: 12px？
2. NotificationItem.tsx:8 — 通知项之间的 gap → 同上
3. CompactTable.tsx:22 — 紧凑表格行 gap → 同上

18px 间距（2 处）：
4. ModalHeader.tsx:6 — modal 标题下边距 → 建议改 20px（spacing.md）
5. EmptyState.tsx:14 — 插图与文字间距 → 同上

建议：加 spacing.sm-plus: 12px（标签/通知/紧凑表格用），然后改 18→20。
总共改 5 处，新增 1 个 token。同意的话我一次性改完。

👤 用户：
同意，改。

🤖 Claude：
批量修改完成。重新 extract-design-md，最终 DESIGN.md：

colors: 6 个
typography: sans (Inter) + mono (Fira Code，统一)
spacing: 4/8/12/16/20/24/32（7 档，覆盖所有实际使用）
rounded: 4/8/12/16/999（5 档，freelist 圆角保留）
0 个异常值，0 个未归类 token。

下一步：用 stitch::manage-design-system 把这个 DESIGN.md 上传到 Stitch。
以后设计师在 Stitch 里改 token，开发改 DESIGN.md 就能同步，双向互通。
```

**这个案例的关键**：extract-design-md 不只是"扫描一遍输出文件"——它会发现设计债。3 种等宽字体混用、不走体系的间距值、遗留的 TODO 注释——AI 帮你逐个定位、解释、建议、批量修改。

### 案例二：20 分钟落地页 —— 完整对话流程

市场部要一个产品落地页，从想法到生产级 Next.js + shadcn/ui 组件。

```
👤 用户：
帮我做一个落地页。产品叫 FlowPixel，做无代码数据可视化。
先不要自己想设计——用 stitch::enhance-prompt 把我的想法精炼成设计提示。

🤖 Claude：
运行 stitch::enhance-prompt…

输入："做一个数据可视化 SaaS 落地页"

精炼后的设计提示：
---
Product: FlowPixel — 无代码数据可视化平台
Target audience: 非技术团队的产品经理和运营
Key emotion: 数据的力量感 + 工具的易用性

Design direction:
- 深色 Hero（深蓝灰 #0F172A），制造数据的沉浸感
- 主色亮青 #06B6D4（数据流动的视觉隐喻）
- 正文浅灰 #CBD5E1（深色背景上的可读性）
- CTA 橙色 #F97316（和青蓝形成强烈反差，驱动点击）
- 字体 Inter（正文）+ Space Grotesk（标题，几何感匹配数据主题）
- 元素：流动线条、数据节点、粒子动画

页面结构建议：
- Hero：大字标题 + 副标题 + CTA + 动态数据流动画背景
- 三列功能卡片：拖拽式图表 / 实时协作 / 一键分享
- 数据对比区：无代码 vs 传统开发（四列指标）
- Logo 墙：受信任的 5000+ 团队
- 底部 CTA + Footer
---

👤 用户：
不错。改两个东西：
1. 不需要 Logo 墙，换成"怎么用"的 3 步流程
2. 数据对比区不要贬低传统开发——改成"你用 FlowPixel 可以做到"

🤖 Claude：
更新结构：
- Logo 墙 → 3 步流程（连接数据源 → 拖拽图表 → 分享面板）
- 对比区 → 能力展示（实时数据、自定义主题、嵌入式面板、团队权限）
现在用 stitch::generate-design 生成 Stitch 设计稿。

🤖 Claude：
Stitch 设计稿已生成：projects/flowpixel-landing-page

我可以看到 5 个 section 的布局：
1. Hero — 深色背景，流动线条装饰，大标题居中
2. Features — 三列卡片，青蓝图标
3. How it works — 三步水平流程，step 编号 01/02/03
4. Capabilities — 四列指标卡片
5. CTA — 全宽青蓝 Banner，白色文字

链接：https://stitch.withgoogle.com/projects/flowpixel-landing-page

👤 用户：
在 Stitch 里看了看，Hero 标题 3rem 太大了，手机上会炸。
帮我在 Stitch 里调整，Hero 标题降到 2rem，副标题降到 1.125rem。

🤖 Claude：
用 stitch::generate-design 编辑 Hero section：
- h1: 3rem → 2rem
- subtitle: 1.25rem → 1.125rem
- 移动端预览：单行容纳"FlowPixel"，正常

👤 用户：
好，现在用 stitch::react-components 把这个设计稿转成 Next.js + shadcn/ui 代码。

🤖 Claude：
生成中…

文件结构：
src/
  components/
    landing/
      HeroSection.tsx
      FeatureCards.tsx
      HowItWorks.tsx
      CapabilitiesGrid.tsx
      CTABanner.tsx
  app/
    page.tsx
  theme.ts  ← 从 Stitch 设计 token 自动提取

组件全部使用 shadcn/ui 原语 + DESIGN.md 的 token：
- 青蓝 accent 来自 theme.colors.accent
- 深色 Hero 背景来自 theme.colors.dark
- 所有间距/字体/圆角引用 token，没有硬编码值

👤 用户：
跑起来看看。

[用户在 localhost:3000 打开页面]

问题：
1. Hero 背景的流动线条动画太抢了——慢一点，透明度降到 0.4
2. FeatureCards 之间的 gap 是 32px，太大了，改成 24px
3. HowItWorks 的 step 编号 01/02/03 用了 accent 色——改成 white，accent 做背景圆圈

🤖 Claude：
三个修改：
1. Hero 背景动画：duration 20s → 40s，opacity 0.8 → 0.4
2. FeatureCards gap：32px → 24px（token spacing.lg）
3. Step 编号：accent 圆圈 + 白色数字（白色在青蓝圆形上更可读）

👤 用户：
这次对了。上生产之前还有什么要做的？

🤖 Claude：
建议：
1. lighthouse 跑一次性能审计——流动动画可能影响 LCP
2. 移动端实测——Hero 的动画在低端 Android 上可能掉帧
3. shadcn/ui 的 Button 组件确认 hover/focus 状态用的都是 token 颜色
4. 如果是正式产品，跑 npx @google/design.md lint .stitch/DESIGN.md

👤 用户：
跑 lint。

🤖 Claude：
lint 结果：
✓ Schema 有效
✓ 所有 token 引用可解析
✓ 对比度检查通过
⚠  missing-sections: 建议补充 "Depth & Elevation" 章节（深色背景需要 z-index 层级）

补上：
## Depth & Elevation
- z-0: 页面背景（深色 #0F172A）
- z-10: 卡片表面（浅色 #1E293B）
- z-20: 导航栏（深色 + 模糊背景）
- z-50: Modal/Dropdown
```

**时间线**：
- 00:00 enhance-prompt → 精炼设计方向
- 05:00 generate-design → Stitch 设计稿出图
- 08:00 在 Stitch 里调 Hero 字体
- 12:00 react-components → Next.js + shadcn/ui 代码生成
- 18:00 细节调整（动画/间距/配色）
- 20:00 lint 通过，准备上生产

### 案例三：竞品分析 —— 从运行中的网站抓设计资产

竞争对手上线了新功能页面，想快速分析其设计语言。没有源码，只有 URL。

```
👤 用户：
竞品 app.datu.io 上线了新仪表盘。帮我抓他们的设计语言。
我没有他们的源码，只有 URL。

🤖 Claude：
用 stitch::extract-static-html 抓取页面快照…

$ stitch::extract-static-html https://app.datu.io/dashboard

提取完成：
- HTML 快照已保存到 .stitch/datu-dashboard.html
- 内联 CSS 27KB
- 内联图片 14 张（Base64）
- 提取到的设计信号：

颜色分析（来自 computed styles）：
- 主背景：#FAFBFC（极浅灰蓝）
- 卡片表面：#FFFFFF + box-shadow 0 1px 3px rgba(0,0,0,0.06)
- 主文字：#1A1D23
- 次要文字：#6B7280
- 强调色：#7C3AED（紫色——和一般 SaaS 的蓝色不同）
- 数据绿色：#059669
- 数据红色：#DC2626

字体：
- 标题：Plus Jakarta Sans（从 Google Fonts 加载）
- 正文：Inter

间距：
- 页面 padding：24px
- 卡片 gap：16px
- 卡片内 padding：20px

组件模式：
- 表格：无竖分割线、斑马纹间隔行、行 hover 背景 #F9FAFB
- 按钮：全部 solid，无 outline 样式
- 标签：圆角 999px（完全圆角），文字 12px

👤 用户：
跟他们比，我们的设计有什么差异？

🤖 Claude：
对比我们（MetricFlow）和 datu.io：

| 维度 | MetricFlow（我们） | datu.io（竞品） | 差异 |
|------|-------------------|----------------|------|
| 强调色 | #3B82F6（蓝） | #7C3AED（紫） | 我们是标准蓝，他们用紫色做差异化 |
| 背景 | #F8FAFC | #FAFBFC | 几乎一样，微小差异 |
| 标题字体 | Inter | Plus Jakarta Sans | 他们有专门的标题字体，更精致 |
| 卡片阴影 | 1px border | 0 1px 3px shadow | 我们用边框分界，他们用阴影——更有层次 |
| 标签圆角 | 8px | 999px | 他们用完全圆角，更友好 |
| 表格 | 有竖分割线 | 无竖分割线 | 他们更简洁 |
| 紫色使用 | 无 | 紫色做全部交互 | 一家用紫色就把自己和几十家蓝 SaaS 区分开了 |

👤 用户：
有意思。把 datu.io 的 HTML 上传到 Stitch，用 generate-design 生成等价的设计稿。

🤖 Claude：
stitch::upload-to-stitch → 推送到 Stitch 项目 projects/datu-analysis
stitch::generate-design → 基于快照生成设计稿

生成了 4 屏：
1. 仪表盘总览（KPI 卡片 + 趋势图）
2. 数据表格（带排序/筛选/搜索）
3. 用户详情（侧边栏 + 主面板布局）
4. 设置页面（表单 + 开关 + 保存按钮）

👤 用户：
如果我们把主色从蓝换成紫，我们的仪表盘看起来会和 datu 一样吗？

🤖 Claude：
不会。即使都用紫色：
- 我们的卡片是 border 风格，他们是 shadow 风格——视觉层次不同
- 我们的标签是 8px 圆角，他们是 999px——UI 感受完全不同（专业 vs 友好）
- 我们的表格有竖线分隔，他们纯横行——信息密度感知不同
- 我们有 Fira Code 做数据数字，他们是普通字体——数据可读性的差异

所以只改颜色不会变成他们的样子。设计语言是颜色+字体+间距+组件模式的组合，
不是单一维度。好消息是我们已经有了独立的视觉性格。
```

**这个案例的关键**：stitch::extract-static-html 让竞品分析从"肉眼看看"变成"数据化对比"。颜色 hex、字体名、间距 px——全部量化，不再是主观感受。

### 案例四：设计系统验收 —— stitch-loop 生成多页一致性检查

设计系统建好了，需要验证一致性：5 个页面用同一套 token，能不能看起来像同一个产品。

```
👤 用户：
我们的 DESIGN.md 写好了，Stitch 里也有设计稿了。
但我还没用这套 token 生成过完整的页面集。
帮我用 stitch-loop 一次性生成 5 个页面，验证一致性。

🤖 Claude：
运行 stitch-loop，prompt：
"基于 .stitch/DESIGN.md 和 Stitch 项目 projects/metricflow-ds，生成 5 个页面：
1. 仪表盘首页（KPI 卡片 + 图表）
2. 用户列表页（表格 + 搜索 + 筛选）
3. 数据详情页（图表 + 元数据面板）
4. 设置页（表单 + 开关 + 保存）
5. 空状态页（无数据时的引导页）
所有页面严格使用 DESIGN.md token，禁止引入新颜色/字体/间距。"

循环中…每个页面生成后自动校验 token 引用…

页面 1/5 仪表盘：✓ 23 个 token 引用，0 个裸 hex
页面 2/5 用户列表：✓ 18 个 token 引用，0 个裸 hex
页面 3/5 数据详情：△ 19 个 token 引用，1 个裸 hex（#000000 用于阴影）
页面 4/5 设置页：✓ 15 个 token 引用，0 个裸 hex
页面 5/5 空状态：✓ 12 个 token 引用，0 个裸 hex

👤 用户：
页面 3 的裸 hex 是怎么回事？

🤖 Claude：
第 3 页 DataDetailPage.tsx 第 142 行：
box-shadow: 0 2px 8px #000000;
→ 黑色阴影。DESIGN.md 没有定义 shadow 颜色 token。
修复方案：
1. 在 DESIGN.md 加 shadows.sm: "0 1px 3px rgba(0,0,0,0.06)"
2. shadows.md: "0 2px 8px rgba(0,0,0,0.08)"
然后把 #000000 改成 theme.shadows.md

👤 用户：
方案 1 好。加 token，更新页面 3。

🤖 Claude：
DESIGN.md 新增：
shadows:
  sm: "0 1px 3px rgba(0,0,0,0.06)"
  md: "0 2px 8px rgba(0,0,0,0.08)"
  lg: "0 4px 16px rgba(0,0,0,0.12)"

DataDetailPage.tsx:142 改为 shadows.md。
重新 lint：✓ 0 个裸 hex，0 个未引用 token。

👤 用户：
5 个页面都看了。页面 2（用户列表）的行间距比其他页面紧，看起来不像一个产品。

🤖 Claude：
对比分析：
- 页面 2 表格行高 40px（紧凑模式）
- 页面 1 卡片内 padding 24px
- 页面 4 表单行高 48px

页面 2 确实偏紧。DESIGN.md 的 spacing token 里最小是 12px，表格行用了 12px × 3 = 36+4 border。
改为 spacing.md（16px）作为行 padding → 行高变成 48px，和其他页面一致。

👤 用户：
好多了。现在 5 个页面统一吗？

🤖 Claude：
5 页一致性检查：
✓ 颜色：0 个裸 hex，100% token 引用
✓ 字体：0 个裸 font-family
✓ 间距：全部在 spacing token 范围内
✓ 圆角：全部在 rounded token 范围内
✓ 组件：button-primary 在 5 页中样式完全一致
✓ 表格：3 页有表格，行高统一 48px

5/5 页面看起来是同一个产品。验收通过。
```

**这个案例的关键**：stitch-loop 不只是"批量生成"——它在生成每个页面后自动校验 token 引用，把裸 hex 和新颜色挡在门外。不是生成了再检查，是生成即检查。

### 五个案例的共同模式

| 模式 | 关键 Skill | 对话轮数 | 产出 |
|------|-----------|---------|------|
| 反向提取设计系统 | extract-design-md | 5 轮 | DESIGN.md + 设计债修复 |
| 落地页从零到上线 | enhance-prompt → generate-design → react-components | 7 轮 | Next.js + shadcn/ui 页面 |
| 无源码竞品分析 | extract-static-html → generate-design | 4 轮 | 竞品设计数据化对比 |
| 设计系统验收 | stitch-loop | 4 轮 | 5 页一致性报告 |

核心信号：**对话不是为了生成代码——对话是为了让 AI 在设计系统里做决策。** 每轮对话要么对齐设计意图，要么修正 token，要么验证一致性。代码只是最后一轮的产物。

## 和 Spec Kit、Superpowers 的关系

| | Stitch Skills | Spec Kit | Superpowers |
|---|---|---|---|
| **定位** | 设计↔代码双向转换 | 规格驱动开发流程 | 工程化开发闭环 |
| **范围** | 设计工程化 | 需求→规格→计划→任务→代码 | 头脑风暴→方案→TDD→调试→审查 |
| **互补** | 管"视觉层" | 管"规格层" | 管"实施层" |

三者组合：Superpowers 做需求分析和方案设计，Spec Kit 产出规格文档，Stitch Skills 把设计稿变成组件代码。各管一段，不重叠。

## 文件结构：每个 Skill 的标准布局

```
skills/<skill-name>/
├── SKILL.md       ← Agent 读取的核心指令
├── scripts/       ← 可执行脚本（校验 + 网络）
├── resources/     ← 知识库（检查清单 + 风格指南）
└── examples/      ← "黄金标准"参考实现
```

Skill 本质是**纯文本指令文件**，不是可执行代码。Agent 读取 SKILL.md 获取专家知识，零运行时开销。

## 对比：Stitch Skills vs 传统截图转代码

| | 传统截图转代码 | Stitch Skills |
|---|---|---|
| **产出** | 一次性 HTML/CSS | 带设计 token 的生产组件 |
| **设计系统** | 丢失（颜色/字体硬编码） | 提取为 DESIGN.md，可复用 |
| **迭代** | 每次重新来 | 设计稿改了重新生成，token 不变 |
| **跨平台** | 单一工具 | 7+ Agent 平台兼容 |
| **质量** | 视觉近似 | 设计 token 校验 + 组件级一致性 |

## 常见问题

**Q: 必须用 Google Stitch 吗？**

是的。Stitch Skills 是 Stitch 生态的工具，所有技能依赖 Stitch MCP 服务器。如果你不用 Stitch 做设计，这套技能不适用。

**Q: 免费吗？**

技能库本身 Apache 2.0 开源免费。Stitch 平台有自己的计费规则，参考[官方定价](https://stitch.withgoogle.com/)。

**Q: Claude Code 和 Cursor 上装的技能能互通吗？**

能。Agent Skills 开放标准保证同一个 SKILL.md 在不同平台上行为一致。你在 Claude Code 配好的 skill，换到 Cursor 效果一样。这正是 `stitch-skills` 的核心卖点——**写一次，到处跑**。

**Q: 先装哪个？**

从 `stitch::extract-design-md` 开始。把现有项目的设计语言提取出来，再决定要不要继续用 Stitch 做设计管理。不要一上来就装全部 15 个——先用 2-3 个核心 skill 跑通一个场景，再按需扩展。
