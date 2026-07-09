---
title: 产品经理实战：从需求到原型全流程
description: 产品经理用 Claude Code 完成一个完整需求的端到端案例——从想法到 PRD、Figma 原型、评审交付。含必装插件清单和每步可复现的提示词
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 📦 产品 | ★★★★★  | ★★☆☆☆    |
| 🛠️ 开发 | ★★★★☆  | ★★☆☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★☆☆☆    |

**🎯 学习产出：** 掌握产品经理用 Claude Code 完成 PRD + 原型 + 评审的完整链路，能独立复现每一步

**🚀 AI 能力提升：** 自动化工作流、技能扩展、设计协作
:::

# 产品经理实战：从需求到原型全流程

> 以一个真实场景——「用户反馈收集系统」——走完从想法到可评审 PRD + Figma 原型 + 前后端代码的全过程。每步可复现。

**预计时间**：~90 分钟（插件安装 10 分钟，案例实操 80 分钟）

---

## 必装插件清单（10 分钟）

以产品经理的身份用 Claude Code，以下 6 个插件覆盖从需求到交付的全链路：

### 安装

```bash
# 1. claude-mem — 跨对话记住产品背景、用户画像
npx skills add https://github.com/anthropics/skills --skill claude-mem

# 2. feature-dev — 7 阶段引导式功能开发
/plugin marketplace add anthropics/skills
/plugin install feature-dev@claude-plugins-official

# 3. ppt-master — 一句话生成 .pptx 汇报文件
npx skills add https://github.com/anthropics/skills --skill ppt-master

# 4. ui-ux-pro-max — UI/UX 设计智能，50+ 风格、161 色板
npx skills add https://github.com/anthropics/skills --skill ui-ux-pro-max

# 5. frontend-design — 前端视觉设计指导
npx skills add https://github.com/anthropics/skills --skill frontend-design

# 6. Figma MCP — 设计稿导入导出（需 Figma 账号）
# 配置见：/guide/advanced/figma-mcp
```

### 各插件的职责

| 插件                | 在哪个阶段用 | 解决什么问题                              |
| ------------------- | ------------ | ----------------------------------------- |
| **claude-mem**      | 全程         | 记住项目背景、用户画像、本次需求上下文    |
| **feature-dev**     | 需求阶段     | 模糊想法 → 结构化 PRD，7 阶段引导不跑偏   |
| **ui-ux-pro-max**   | 设计阶段     | 选风格、配色、字体，出设计规范            |
| **frontend-design** | 设计阶段     | 生成原型页面代码，视觉不走样              |
| **Figma MCP**       | 设计阶段     | 代码直接生成 Figma 设计稿，设计评审有载体 |
| **ppt-master**      | 交付阶段     | PRD + 原型一键转汇报 PPT                  |

:::tip 装完验证
打开 Claude Code，输入 `/plugin list` 看到 4 个插件已激活。输入 `npx skills list` 看到 claude-mem、ppt-master、ui-ux-pro-max、frontend-design 四项。
:::

---

## 完整案例：用户反馈收集系统

### 需求背景

> 当前用户反馈通过微信群和邮件零散提交，技术支持的同事手动记录到 Excel。产品团队看不到整体反馈趋势，重复问题反复出现，优先级全凭拍脑袋。

**核心诉求**：

1. 用户能自助提交反馈（附带分类和截图）
2. 管理员能回复、标记状态、批量导出
3. 产品团队能看到反馈趋势仪表盘

---

## Step 1：初始化项目记忆（claude-mem）

先让 Claude Code 记住项目上下文：

```text
记住以下项目背景：

产品：SaaS 在线协作工具，面向中小团队，核心功能是文档协作和项目管理。
用户画像：20-35 岁的互联网从业者，技术公司为主，日均使用 3-5 小时。
当前痛点：用户反馈零散，缺乏结构化收集和优先级评估机制。
目标：构建用户反馈收集系统，替代微信群+Excel 的原始流程。

这个项目叫做 "feedback-system"。
```

Claude Code 会自动存储到持久记忆中，后续对话不需要重新解释。

---

## Step 2：需求澄清 → 结构化 PRD（feature-dev）

启动 feature-dev 插件，用 7 个阶段把模糊需求变成可评审 PRD：

```text
/feature-dev

我有一个新需求，请按 7 阶段流程引导我完成：

需求：为 SaaS 协作工具构建用户反馈收集系统

核心功能：
1. 用户端：提交反馈表单（分类、描述、截图、紧急程度）
2. 管理员端：反馈列表、状态流转、回复、批量导出
3. 仪表盘：按分类/状态/时间的反馈趋势图

用户：
- 提交者：所有注册用户
- 处理者：技术支持团队（3 人）和管理员（1 人）

约束：
- 第一版不做 AI 自动分类和情感分析
- 截图上传限 5MB，格式 PNG/JPG
- 状态流转：pending → in_progress → replied → closed
```

### feature-dev 的 7 个阶段会引导你完成

| 阶段       | 产出                  | 你需要确认的                                 |
| ---------- | --------------------- | -------------------------------------------- |
| ① 需求澄清 | 补充边缘场景          | "非登录用户能不能提交？""批量导出什么格式？" |
| ② 方案设计 | 技术架构和数据模型    | 前后端技术栈、数据库表结构                   |
| ③ 任务拆解 | 开发任务清单          | 优先级和依赖关系                             |
| ④ 执行     | 代码实现              | 不需要确认，AI 自动写                        |
| ⑤ 审查     | 代码问题清单          | 安全问题和性能瓶颈                           |
| ⑥ 测试     | 测试用例和报告        | 边界情况覆盖是否充分                         |
| ⑦ 交付     | PRD + 代码 + 部署说明 | 整体交付物是否完整                           |

每个阶段 Claude Code 会产出文档，你只需要在关键节点确认方向。产出物会自动保存到 `docs/feedback-system/` 目录。

### 阶段 ① 实际对话示例

```text
[Claude Code] 需求澄清中，请确认以下边缘场景：

1. 非登录用户能否查看公开的 Feature Request 列表？
2. 反馈提交后能否编辑？能的话多久内？
3. 管理员"关闭"反馈时需要填写关闭原因吗？
4. 批量导出是导出当前筛选结果还是全部数据？
5. 是否需要邮件通知用户反馈状态变更？

请逐条确认。
```

你只需要回答每条——不需要自己列。

---

## Step 3：生成设计规范（ui-ux-pro-max）

PRD 确认后，用 ui-ux-pro-max 出设计规范：

```text
用 ui-ux-pro-max 为反馈收集系统生成设计规范：

产品类型：SaaS 工具管理后台
风格：minimalism，专业但不冷淡
主色调：蓝色系，传达信任和效率
需要：色彩系统（主色/辅色/中性色）、字体搭配、间距系统、按钮/卡片/表单组件规范
```

输出示例：

```text
设计规范 — Feedback System
==========================
风格：Minimalism + Subtle Depth
主色：#2563EB（Blue-600）
辅色：#10B981（Green-500，成功状态）
强调色：#F59E0B（Amber-500，紧急标记）
中性色：#F8FAFC / #E2E8F0 / #64748B / #1E293B
字体：Inter（UI）+ JetBrains Mono（代码/ID 字段）
圆角：8px（卡片）、6px（按钮）、4px（输入框）
阴影：0 1px 3px rgba(0,0,0,0.08)（卡片）
间距：4px 基准，组件间距 16px，区块间距 32px
```

---

## Step 4：生成原型页面（frontend-design）

用 frontend-design 生成可交互的 HTML 原型：

```text
基于以下设计规范，生成反馈收集系统的 3 个核心页面原型：

1. 用户提交反馈页 — 表单 + 分类选择 + 截图上传
2. 管理员反馈列表页 — 表格 + 筛选 + 批量操作
3. 仪表盘页 — 趋势图 + 分类占比 + 处理效率指标

技术：纯 HTML + Tailwind CSS（CDN）+ Chart.js（CDN）
要求：
- 桌面端优先，响应式布局
- 所有交互状态覆盖（hover、focus、loading、empty、error）
- 使用 Inter 字体
- 用真实数据填充列表和图表，不写 "Lorem ipsum"
```

Claude Code 生成 3 个可双击打开的 `.html` 文件：

```text
feedback-system/
├── prototype/
│   ├── submit-feedback.html    # 用户提交页
│   ├── admin-feedback-list.html # 管理员列表页
│   └── dashboard.html          # 仪表盘页
```

这 3 个文件可以直接用浏览器打开演示，也可以截图放进 PRD 评审。

---

## Step 5：原型导入 Figma（Figma MCP）

如果有 Figma 账号，把原型代码直接生成 Figma 设计稿方便设计评审：

```text
把这个原型页面生成 Figma 设计稿：

用 Figma MCP 读取 prototype/admin-feedback-list.html，
按以下结构生成 Figma 页面：
- Frame 1：反馈列表（默认状态）
- Frame 2：反馈列表（筛选后）
- Frame 3：反馈详情弹窗
- Frame 4：批量导出确认对话框

命名：Feedback System - Admin Panel
```

没有 Figma 账号时，原型 HTML 文件本身也能拿去评审，在浏览器里就能演示交互流程。

---

## Step 6：PRD 评审 + 生成汇报 PPT（ppt-master）

PRD + 原型确认后，生成评审用的 PPT：

```text
基于 docs/feedback-system/prd.md 和原型截图，生成评审 PPT：

结构：
1. 封面 — 项目名 + 日期
2. 背景与问题 — 现状痛点（微信群+Excel 流程）
3. 用户故事 — 3 个核心用户角色
4. 功能范围 — 本期 / 下期
5. 原型演示 — 每页一个核心页面截图
6. 状态流转 — 反馈生命周期图
7. 技术方案 — 前后端技术栈 + 数据模型
8. 发布计划 — 3 轮迭代时间线
9. 风险与依赖 — 需要哪些团队配合
10. 下一步 — 评审后待确认事项

风格：简洁商务，用品牌蓝色主调。
```

PPT 输出到 `docs/feedback-system/review.pptx`，可直接打开编辑。

---

## 必装插件速查

| 优先级  | 插件                | 安装命令                                                                      | 一句话                                |
| :-----: | ------------------- | ----------------------------------------------------------------------------- | ------------------------------------- |
| 🔴 必装 | **claude-mem**      | `npx skills add https://github.com/anthropics/skills --skill claude-mem`      | 不装每次要重新解释项目背景            |
| 🔴 必装 | **feature-dev**     | `/plugin install feature-dev@claude-plugins-official`                         | 模糊需求 → 结构化 PRD 的 7 阶段流水线 |
| 🟡 设计 | **ui-ux-pro-max**   | `npx skills add https://github.com/anthropics/skills --skill ui-ux-pro-max`   | 出设计规范，选风格配色字体            |
| 🟡 设计 | **frontend-design** | `npx skills add https://github.com/anthropics/skills --skill frontend-design` | 生成可交互原型 HTML                   |
| 🟡 设计 | **Figma MCP**       | 配置见 `/guide/advanced/figma-mcp`                                            | 原型代码 → Figma 设计稿               |
| 🟢 交付 | **ppt-master**      | `npx skills add https://github.com/anthropics/skills --skill ppt-master`      | PRD + 原型 → 评审 PPT                 |

---

## 全流程时间线

```text
09:00  初始化 claude-mem 项目记忆          ← 5 分钟
09:05  启动 feature-dev 需求澄清           ← 20 分钟
09:25  feature-dev 方案设计 + 任务拆解     ← 15 分钟
09:40  ui-ux-pro-max 出设计规范            ← 10 分钟
09:50  frontend-design 生成 3 页原型       ← 15 分钟
10:05  Figma MCP 导出设计稿（可选）         ← 10 分钟
10:15  ppt-master 生成评审 PPT             ← 5 分钟
10:20  完成 — 拿着 PRD + 原型 + PPT 去评审
```

**核心效率提升**：传统方式需要 PM + 设计师 + 前端协作 2-3 天，Claude Code 全流程 **90 分钟**一个人完成到可评审状态。

---

## 非必装但推荐的插件

| 插件              | 用途                                    | 什么时候装                     |
| ----------------- | --------------------------------------- | ------------------------------ |
| **ralph**         | PRD 转结构化 JSON，支持自动派发开发任务 | 团队用 Ralph 做需求管理时      |
| **skill-creator** | 把你自己的工作流封装成 Skill            | 有重复流程（周报、竞品分析）时 |
| **agent-browser** | 自动打开浏览器验证原型                  | 原型复杂、想自动截图对比时     |
| **caveman**       | 让 AI 输出更精简                        | 嫌 AI 话太多时                 |

---

## 常见问题

### 不会写代码能走完这个流程吗？

能。整个流程中你只需要：

- 用自然语言描述需求（中文即可）
- 在关键节点确认 AI 的输出
- 浏览器打开 HTML 原型看一眼效果

`feature-dev` 的第 ④ 阶段（代码实现）对产品经理来说可以跳过——你只需要前 3 个阶段的产出（PRD + 设计规范 + 原型），代码实现交给开发团队。

### 没有 Figma 账号怎么办？

原型 HTML 文件本身就可以用——双击在浏览器打开，截图放进 PRD 评审文档。Figma MCP 只是额外加分项，不是必需。

### claude-mem 存了会不会泄露信息？

`claude-mem` 存储在本地 `~/.claude/memory/` 目录，不上传云端。团队共享的话，可以把记忆文件提交到项目仓库。

---

## 下一步

- [产品经理学习路线](/guide/learning-path/product) — 完整学习路径，含竞品分析和数据分析
- [产品工具链技巧](/tips/product-toolchain) — 全流程工具编排 5 层模型
- [Feature Dev 详解](/tips/feature-dev) — 7 阶段功能开发完整指南
- [PPT Master](/tips/ppt-master) — 汇报 PPT 生成进阶技巧
- [Figma MCP](/guide/advanced/figma-mcp) — 设计稿导入导出配置
