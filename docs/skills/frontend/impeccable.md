---
title: Impeccable — AI 设计技能护栏
description: 通过 23 个命令阻断 AI 平庸设计模式的技能系统，为 Cursor、Claude Code、Gemini CLI 注入专业级前端设计品质
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★☆  | ★★★☆☆    |
| 📦 产品 | ★★★☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握 Impeccable 代码质量技能，能独立使用 23 个命令对前端设计进行全生命周期审查和精炼

**🚀 AI 能力提升：** 代码审查
:::

# Impeccable — AI 设计技能护栏

[Impeccable](https://github.com/nicholasgriffintn/impeccable) 是一个开源的 AI 设计技能系统，适用于 Cursor、Claude Code、Gemini CLI 等主流 AI 编码代理。与传统设计技能"列出好设计的规则"不同，Impeccable 的核心理念是**阻断坏设计**——通过系统化的模式检测和拦截，在 AI 输出到达用户之前就过滤掉平庸的、模板化的、AI 味明显的设计。

:::tip
本页属于[技能系统](/skills/)的一部分。更多前端 Skills：[React 生态](/skills/frontend/react) | [Vue 生态](/skills/frontend/vue) | [前端通用](/skills/frontend/frontend) | [Taste Skill](/skills/frontend/taste)
:::

## 核心理念：阻断坏设计

大多数设计技能的工作方式是"告诉 AI 什么是好的"——列举排版规则、配色原则、布局模式。问题是 AI 模型的上下文窗口有限，规则越多越容易被忽略。

Impeccable 反其道而行之：**不教 AI 怎么做好，而是阻止它做坏**。它维护一份"坏设计模式库"（Bad Design Patterns），每个模式都有明确的检测规则和拦截策略。AI 生成的每一行设计代码都必须通过这层过滤。

:::info
类比：传统设计技能像烹饪食谱，Impeccable 像食品安全检查。食谱告诉你怎么做菜好吃，检查员确保端上来的菜不会让人食物中毒。
:::

## 安装

### 方式一：CLI 安装器（推荐）

```bash
# 一键安装到当前项目的 .claude/skills/ 目录
npx impeccable install
```

### 方式二：网站下载

访问 [impeccable.dev](https://impeccable.dev)，下载 SKILL.md 文件，手动放入项目的 `.claude/skills/` 目录。

### 方式三：手动克隆

```bash
git clone https://github.com/nicholasgriffintn/impeccable.git
cp -r impeccable/skills/impeccable .claude/skills/impeccable
```

:::warning
安装后确保 `.claude/skills/impeccable/SKILL.md` 文件存在。如果目录结构不对，AI 代理将无法识别该技能。
:::

## 初始化

安装后运行初始化命令，让 Impeccable 分析你的项目并生成适配配置：

```text
/impeccable init
```

初始化会：

1. 检测项目技术栈（React、Vue、Next.js 等）
2. 分析现有设计系统的约束条件
3. 生成项目特定的拦截规则
4. 输出一份设计质量基线报告

## 命令分类（23 个）

Impeccable 的 23 个命令分为六大类，覆盖从创建到加固的完整设计生命周期。

### Create（创建）— 3 个命令

从零生成设计时，强制 AI 避开已知的平庸模式。

| 命令                    | 说明                                    |
| :---------------------- | :-------------------------------------- |
| `/impeccable create`    | 从描述创建新页面/组件，自动应用设计护栏 |
| `/impeccable page`      | 创建完整页面，强制多样化的布局组合      |
| `/impeccable component` | 创建独立组件，确保语义化和无障碍        |

### Evaluate（评估）— 4 个命令

对已有设计进行多维度审查，发现 AI 平庸模式。

| 命令                   | 说明                                             |
| :--------------------- | :----------------------------------------------- |
| `/impeccable evaluate` | 全面设计审查，输出评分和改进建议                 |
| `/impeccable audit`    | 深度审计——排版、配色、间距、动效逐项检查         |
| `/impeccable document` | 为项目生成设计文档，记录当前设计系统的规则和约束 |
| `/impeccable check`    | 快速检查——只报告严重问题                         |

### Refine（精炼）— 5 个命令

在不改变功能的前提下提升设计品质。

| 命令                     | 说明                                   |
| :----------------------- | :------------------------------------- |
| `/impeccable refine`     | 通用精炼——自动修复最常见的设计问题     |
| `/impeccable polish`     | 视觉打磨——微调间距、对齐、层级         |
| `/impeccable typography` | 专注排版优化——字号、行高、字重、对比度 |
| `/impeccable color`      | 配色校准——确保对比度合规、强调色统一   |
| `/impeccable spacing`    | 间距系统优化——建立一致的间距节奏       |

### Simplify（简化）— 4 个命令

减少视觉噪音，让设计更干净。

| 命令                    | 说明                                         |
| :---------------------- | :------------------------------------------- |
| `/impeccable simplify`  | 通用简化——移除不必要的装饰元素               |
| `/impeccable reduce`    | 减少视觉密度，增加留白                       |
| `/impeccable declutter` | 消除 clutter——移除假数据、装饰线、无意义图标 |
| `/impeccable flatten`   | 简化层级——减少嵌套、扁平化视觉结构           |

### Harden（加固）— 4 个命令

确保设计在边界情况下仍然可靠。

| 命令                     | 说明                                 |
| :----------------------- | :----------------------------------- |
| `/impeccable harden`     | 通用加固——检查边界情况和异常状态     |
| `/impeccable responsive` | 响应式加固——确保所有断点下布局正常   |
| `/impeccable a11y`       | 无障碍加固——WCAG AA 合规检查和修复   |
| `/impeccable edge`       | 边界情况——空状态、超长文本、加载状态 |

### System（系统级）— 3 个命令

项目级的设计系统管理。

| 命令                 | 说明                                      |
| :------------------- | :---------------------------------------- |
| `/impeccable init`   | 初始化项目配置，检测技术栈                |
| `/impeccable theme`  | 管理主题系统——暗色/亮色模式、CSS 变量     |
| `/impeccable tokens` | 设计 Token 管理——颜色、字号、间距等原子值 |

## 完整工作流示例

以下是一个登录页面从"能用"到"精致"的完整优化流程：

### 第一步：创建

```text
/impeccable page
> 创建一个 SaaS 产品的登录页面，包含邮箱/密码表单和社交登录按钮
```

Impeccable 会在生成时就避免居中卡片、默认 Inter 字体、纯白背景等 AI 平庸模式。

### 第二步：评估

```text
/impeccable evaluate
```

输出示例：

```text
设计评分：7.2/10

严重问题：
- 表单输入框缺少 focus 状态的可见指示器（a11y 违规）
- 社交登录按钮图标与文字间距不一致

改进建议：
- 密码输入框建议增加"显示密码"切换
- 错误状态缺少 aria-live 声明
```

### 第三步：精炼

```text
/impeccable typography
> 优化登录页面的排版层级

/impeccable spacing
> 统一登录页面的间距系统
```

### 第四步：加固

```text
/impeccable a11y
> 确保登录页面通过 WCAG AA

/impeccable edge
> 添加空状态、加载状态、错误状态处理
```

### 第五步：检查

```text
/impeccable report
> 生成登录页面的最终审查报告
```

## 常用命令组合

| 场景           | 推荐命令流                                  |
| :------------- | :------------------------------------------ |
| 新建页面       | `create` → `evaluate` → `refine` → `harden` |
| 改造旧页面     | `audit` → `simplify` → `polish` → `report`  |
| PR 设计审查    | `check` → `report`                          |
| 排版专项优化   | `typography` → `spacing` → `evaluate`       |
| 无障碍合规     | `a11y` → `responsive` → `edge` → `check`    |
| 设计系统初始化 | `init` → `tokens` → `theme` → `document`    |
| 视觉打磨       | `color` → `motion` → `polish` → `evaluate`  |

:::tip
养成习惯：每次创建或修改设计后，先跑 `/impeccable check` 做快速扫描，再决定是否需要更深入的 `/impeccable audit`。
:::

## 与其他设计技能的对比

| 维度         | Impeccable                      | Taste Skill                      | ui-ux-pro-max               |
| :----------- | :------------------------------ | :------------------------------- | :-------------------------- |
| 核心策略     | **阻断坏设计**（模式拦截）      | 强制设计纪律（Pre-Flight Check） | 全栈设计系统（规则 + 模板） |
| 命令数量     | 23 个（分类明确）               | 13 个技能（组合使用）            | 1 个技能（内置 99 条规则）  |
| 配置机制     | 项目初始化 + 拦截规则           | 三旋钮数值（1-10）               | 自然语言描述风格            |
| 改造能力     | `audit` + `refine` 流程         | 内置改造审计协议                 | 无                          |
| 平庸模式检测 | 内置 Bad Design Patterns        | 内置 Forbidden Patterns          | 无                          |
| 适用代理     | Cursor、Claude Code、Gemini CLI | Claude Code 为主                 | 多代理兼容                  |
| 安装复杂度   | 低（CLI 一键安装）              | 中（需选择子技能）               | 低（单个技能）              |

:::info
Impeccable 与 Taste Skill 可以互补使用。Taste Skill 的三旋钮提供高层设计方向控制，Impeccable 的 23 个命令提供细粒度的逐行代码审查。对于需要极致设计品质的项目，可以同时启用。
:::

## 常见陷阱

### 1. 只用 `evaluate` 不用 `refine`

评估发现问题后，必须用精炼命令实际修复。`evaluate` 只诊断，不治疗。

### 2. 跳过 `init` 直接使用命令

`/impeccable init` 会检测你的技术栈并生成适配配置。跳过它可能导致拦截规则与项目不匹配。

### 3. 过度依赖单一命令

`/impeccable refine` 是通用精炼，但排版问题用 `typography`、配色问题用 `color` 效果更好。根据问题类型选择专项命令。

### 4. 忽视 `harden` 类命令

创建和精炼让设计"好看"，加固让设计"可靠"。响应式、无障碍、边界情况是生产环境的必修课。

### 5. 在非设计代码上运行

Impeccable 针对 UI/设计代码。在纯逻辑代码、API 路由、数据库模型上运行不会产生有价值的结果。

## 下一步

- [Taste Skill](/skills/frontend/taste) — 反 AI 平庸设计框架，三旋钮配置 + Pre-Flight Check
- [前端通用 Skills](/skills/frontend/frontend) — 跨框架的 UI 设计、Web 规范和工具链
- [React 生态 Skills](/skills/frontend/react) — React 专属 Skills
- [Vue 生态 Skills](/skills/frontend/vue) — Vue 专属 Skills
- [前端开发最佳实践](/tips/frontend-best-practices) — 完整的前端开发指南
- [前端场景实战指南](/tips/frontend-practices/scenarios) — 实战案例
