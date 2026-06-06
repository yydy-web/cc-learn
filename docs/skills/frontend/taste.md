---
title: Taste Skill — 反 AI 平庸设计框架
description: 为 AI 代理注入设计品味的技能集合——Brief 推断、三旋钮配置、硬性设计规则和 Pre-Flight Check，告别千篇一律的 AI 风格界面
---

# Taste Skill — 反 AI 平庸设计框架

[Taste Skill](https://github.com/Leonxlnx/taste-skill) 是一个**反 AI 平庸设计（anti-slop）的前端框架**，通过可移植的 SKILL.md 指令文件注入到 AI 编码代理中，从根本上提升 AI 生成 UI 的设计质量。它解决了 LLM 生成前端代码的典型问题：霓虹发光、紫色渐变、暗色网格上的居中 Hero、到处都是 em-dash、数学上完美但没有灵魂的布局。

:::tip
本页属于[技能系统](/skills/)的一部分。更多前端 Skills：[React 生态](/skills/frontend/react) | [Vue 生态](/skills/frontend/vue) | [前端通用](/skills/frontend/frontend)
:::

## 核心理念

Taste Skill 的核心不是告诉 AI "写好看的代码"，而是强制它**在写代码之前先像设计师一样思考**：

1. **推断 Brief（Brief Inference）** — 评估页面类型、氛围关键词、参考信号、受众、品牌资产、隐性约束六个信号
2. **选择设计系统** — 根据 Brief 自动映射到官方设计系统（Material、Fluent、Carbon、Polaris、shadcn/ui 等）
3. **设置三旋钮** — 用三个 1-10 的数值旋钮控制设计方向
4. **遵循硬性规则** — 排版、色彩、布局、动画、内容的不可协商规则
5. **通过 Pre-Flight Check** — 发布前的强制检查清单，任何一项无法勾选则页面未完成

## 三个配置旋钮

Taste Skill 的核心机制是三个数值旋钮（1-10），在每次生成前设定，控制整体设计方向：

| 旋钮               | 控制维度             | 低值示例（2-3）          | 高值示例（8-9）             |
| ------------------ | -------------------- | ------------------------ | --------------------------- |
| `DESIGN_VARIANCE`  | 布局对称性/实验性    | 居中、对称、可预测       | 非对称、破格、意外组合      |
| `MOTION_INTENSITY` | 动画深度             | 仅 hover 效果            | 电影级滚动动画、视差        |
| `VISUAL_DENSITY`   | 每视口信息密度       | 大量留白、稀疏           | 信息密集、紧凑排列          |

**场景预设：**

| 使用场景             | DESIGN_VARIANCE | MOTION_INTENSITY | VISUAL_DENSITY |
| -------------------- | --------------- | ---------------- | -------------- |
| SaaS 落地页          | 6-7             | 5-6              | 5-6            |
| 创意机构作品集       | 8-9             | 7-8              | 3-4            |
| 政府/企业官网        | 3-4             | 2-3              | 5-6            |
| 电商商品页           | 5-6             | 4-5              | 6-7            |

## 可用技能（13 个）

### 设计与 UI 技能

| 技能名                          | 说明                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| `design-taste-frontend`         | **默认推荐** — v2 实验版，三旋钮 + GSAP 骨架 + 改造审计 + Pre-Flight    |
| `design-taste-frontend-v1`      | v1 原版，保留向后兼容                                                    |
| `gpt-taste`                     | GPT/Codex 严格版，更高布局方差和更强 GSAP 强制                          |
| `high-end-visual-design`        | 高端精致 UI，柔和对比、高级字体、克制配色                                |
| `minimalist-ui`                 | 编辑式产品 UI，灵感来自 Notion/Linear                                    |
| `industrial-brutalist-ui`       | 硬朗机械美学，瑞士排版、锐利对比                                        |
| `stitch-design-taste`           | Google Stitch 兼容规则，可导出 DESIGN.md                                 |
| `full-output-enforcement`       | 强制完整输出，防止模型截断时留下占位注释                                 |

### 工作流技能

| 技能名                          | 说明                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| `redesign-existing-projects`    | 审计现有项目 UI → 按优先级修复排版、间距、层级、样式                     |
| `image-to-code`                 | 图片优先流程：生成参考图 → 分析 → 实现代码                              |

### 图像生成技能

| 技能名                          | 说明                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| `imagegen-frontend-web`         | 网站设计稿生成，强排版和间距                                             |
| `imagegen-frontend-mobile`      | 移动端界面和流程图（iOS/Android/跨平台）                                 |
| `brandkit`                      | 品牌套件看板——Logo、配色、字体、视觉识别                                |

## 安装

```bash
# 安装默认技能（design-taste-frontend v2）
npx skills add https://github.com/Leonxlnx/taste-skill

# 安装单个技能
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"

# 安装改造专用技能
npx skills add https://github.com/Leonxlnx/taste-skill --skill "redesign-existing-projects"
```

:::info
Taste Skill 的 SKILL.md 是纯文本指令文件，兼容任何 AI 代理——Claude Code、ChatGPT、Codex 等。也可以手动复制到项目的 `.claude/skills/` 目录下。
:::

## 硬性规则（节选）

以下规则是 Taste Skill 的不可协商底线：

| 规则             | 要求                                                         |
| ---------------- | ------------------------------------------------------------ |
| Hero 视口适配    | Hero 必须在首屏完整显示，标题最多 2 行，副标题最多 20 词     |
| Hero 文本限制    | Hero 区域最多 4 个文本元素                                   |
| 布局多样性       | 8 个区块至少使用 4 种不同的布局族                            |
| 单一强调色       | 整页只用一个强调色，饱和度默认 <80%                          |
| 圆角一致性       | 每页只用一套圆角系统                                         |
| CTA 无障碍       | 每个 CTA 按钮必须通过 WCAG AA 对比度（4.5:1）               |
| Em-dash 全面禁止 | em-dash（—）被完全禁止，零例外                               |

## AI 平庸设计特征（Forbidden Patterns）

Taste Skill 内置了一份"AI 味"检测清单——这些模式在 LLM 生成的 UI 中极为常见，但一眼就能看出是 AI 做的：

- 霓虹发光和过度饱和的强调色
- 纯黑（`#000000`）或纯白（`#ffffff`）背景
- 默认使用 Inter 字体
- 泛滥的紫色渐变和暗色网格背景
- 通用占位名称（"John Doe"、"Acme Corp"）
- 完美无缺的数字（"10,000+ 用户"、"99.9% 可用"）
- 区块编号 eyebrow（"01 — 功能"、"02 — 优势"）
- 装饰性状态圆点和 div 假产品预览
- "向下滚动"提示箭头

:::tip
这些规则不是"建议"而是**硬性检查项**。Pre-Flight Check 会逐一验证，任何一项无法通过，页面就不算完成。
:::

## 设计系统自动映射

Taste Skill 会根据 Brief 自动选择合适的设计系统，每个项目只用一个，不混用：

| Brief 信号               | 映射设计系统                    |
| ------------------------ | ------------------------------- |
| Microsoft / 企业         | Fluent UI                       |
| Google / Material        | @material/web                   |
| Shopify                  | Polaris                         |
| UK 政府                  | govuk-frontend                  |
| IBM                      | Carbon                          |
| GitHub                   | Primer                          |
| US 政府                  | USWDS                           |
| 通用 React + Tailwind    | shadcn/ui                       |

:::warning
安装后不会自动替换你现有的组件库。Taste Skill 控制的是设计**意图和规则**，而非具体的 CSS 实现。它与 shadcn/ui、Ant Design、Element Plus 等组件库兼容。
:::

## 使用场景

### 场景一：SaaS 落地页

```
> 安装 design-taste-frontend，设置旋钮为 6/5/5
> 创建一个项目管理 SaaS 的落地页，目标受众是中小型团队
```

Agent 会先推断 Brief、选择 shadcn/ui，避免居中 Hero 默认布局，强制使用真实图片，通过 Pre-Flight Check 后输出代码。

### 场景二：改造现有项目

```
> 安装 redesign-existing-projects
> 审查并改进当前项目的首页设计
```

Agent 会先审计现有 UI（品牌 Token、信息架构、内容块、SEO 基线），然后按优先级应用改造杠杆：排版刷新 → 间距调整 → 色彩校准 → 动效层 → Hero 重构 → 完整区块替换。

### 场景三：图片优先开发

```
> 安装 image-to-code + imagegen-frontend-web
> 为健身 App 生成一套落地页设计稿，然后实现代码
```

Agent 会先生成参考图片，分析设计方向，最后实现匹配的前端代码。

### 场景四：高端客户项目

```
> 安装 high-end-visual-design
> 为奢侈品牌创建一个产品展示页面
```

柔和对比、高级字体、克制配色——适合需要"昂贵感"的客户项目。

## 框架兼容性

Taste Skill 默认栈为 React/Next.js + Tailwind v4 + Motion library，但其规则针对**设计意图**而非特定框架 API，因此兼容：

| 框架    | 兼容性                                          |
| ------- | ----------------------------------------------- |
| React   | 完全支持，默认栈                                |
| Vue     | 支持，动效部分需替换为 Vue Motion 或 CSS 动画   |
| Svelte  | 支持，动效部分需适配 Svelte transitions         |
| 纯 HTML | 支持，设计规则和配色方案直接适用                |

## 与其他设计类 Skills 的区别

| 维度           | Taste Skill                 | frontend-design（Anthropic） | ui-ux-pro-max          |
| -------------- | --------------------------- | ---------------------------- | ---------------------- |
| 核心定位       | 反 AI 平庸设计，强制纪律    | 引导美学方向探索             | 全栈 UI/UX 设计系统    |
| 配置机制       | 三旋钮数值（1-10）          | 自然语言描述风格             | 50+ 种设计风格预设     |
| 质量保障       | Pre-Flight Check 强制检查   | 无强制检查                   | 99 条 UX 规则          |
| 改造支持       | 内置改造审计协议            | 无                           | 无                     |
| 平庸模式检测   | 内置 Forbidden Patterns     | 无                           | 无                     |
| 设计系统映射   | 自动映射到官方设计系统      | 无                           | 10 个技术栈支持        |
| 图像生成       | 内置 Web/Mobile/Brandkit    | 无                           | 无                     |

:::tip
Taste Skill 与 `frontend-design` 和 `ui-ux-pro-max` 不冲突——可以组合使用。Taste Skill 提供**纪律和底线**（什么不能做），其他 Skills 提供**灵感和方向**（可以怎么做）。
:::

## Skills 组合建议

| 场景                     | 推荐组合                                                                        |
| ------------------------ | ------------------------------------------------------------------------------- |
| 从零设计高品质 React UI  | `design-taste-frontend` + `react-best-practices` + `shadcn`                     |
| 改造现有前端项目         | `redesign-existing-projects` + `web-design-guidelines`                          |
| 高端客户交付             | `high-end-visual-design` + `design-taste-frontend` + `ui-ux-pro-max`           |
| 图片优先工作流           | `image-to-code` + `imagegen-frontend-web` + `design-taste-frontend`             |
| Vue 项目设计品质提升     | `design-taste-frontend` + `vue-best-practices` + `vue`                          |
| 极简产品风格             | `minimalist-ui` + `design-taste-frontend`                                       |

:::warning
Taste Skill 的 SKILL.md 文件较长（数千行规则），安装后会占用一定的上下文窗口。建议根据实际需要选择 1-2 个子技能安装，而非全部安装。
:::

## 下一步

- [前端通用 Skills](/skills/frontend/frontend) — 跨框架的 UI 设计、Web 规范、UnJS 工具链
- [React 生态 Skills](/skills/frontend/react) — React 专属 Skills
- [Vue 生态 Skills](/skills/frontend/vue) — Vue 专属 Skills
- [前端开发最佳实践](/tips/frontend-best-practices) — 完整的前端开发指南
- [前端场景实战指南](/tips/frontend-practices/scenarios) — 实战案例（含 Taste Skill 改造案例）
