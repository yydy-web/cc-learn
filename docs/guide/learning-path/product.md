---
title: 产品经理 · 学习路线
description: 产品经理专属 Claude Code 学习路径——用 AI 写 PRD、做原型验证、出数据分析报告、生成汇报 PPT
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★☆☆  | ★★☆☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★☆☆☆    |
| 📦 产品 | ★★★★★  | ★★☆☆☆    |

**🎯 学习产出：** 掌握产品经理的 Claude Code 使用技巧，能独立完成 PRD 撰写、竞品分析和工作流自动化

**🚀 AI 能力提升：** 自动化工作流、代码生成
:::

# 产品经理 · 学习路线

产品经理的日常不全是写代码——但 Claude Code 能在需求文档、原型验证、数据分析、汇报输出这些环节让你效率翻倍。

**预计时间**：~3 小时
**前置条件**：完成 [快速开始](/guide/quick-start)，会用终端基本操作

## 🛠️ 推荐安装的 Skills（5 分钟）

```bash
# 1. 持久记忆——跨对话记住产品背景、用户画像、项目上下文
npx skills add https://github.com/anthropics/skills --skill claude-mem

# 2. Feature Dev——7 阶段引导式功能开发，模糊需求→可交付 PRD
/plugin marketplace add anthropics/skills
/plugin install feature-dev@claude-plugins-official

# 3. PPT Master——一句话生成可编辑 .pptx 汇报文件，不是截图不是模板填空
npx skills add https://github.com/anthropics/skills --skill ppt-master

# 4. 技能构造器——把"写周报""出竞品分析"封装成 Skill，下次一句话触发
/plugin install skill-creator@claude-plugins-official
```

:::tip
这 4 个 Skills 覆盖产品经理 80% 的高频场景：写 PRD → 出 PPT → 持久记忆 → 自定义流程。装完就用。
:::

---

## 阶段一：基础操作（~30 分钟）

产品经理不需要深入代码，但需要熟练掌握文件操作和对话技巧。

| 顺序 | 内容                                                      | 要点                          |
| ---- | --------------------------------------------------------- | ----------------------------- |
| 1    | [什么是 Claude Code](/guide/beginner/what-is-claude-code) | 理解它和 ChatGPT 网页版的区别 |
| 2    | [安装配置](/guide/beginner/installation)                  | 装好就能用                    |
| 3    | [第一次对话](/guide/beginner/first-conversation)          | 学会提问、拖文件、给上下文    |
| 4    | [文件操作](/guide/beginner/file-operations)               | 重点是读取、搜索、总结文件    |
| 5    | [权限管理](/guide/beginner/permissions)                   | 别让 AI 乱改你的 PRD          |

**验收**：能拖一个 PRD 文档进去，让 Claude Code 总结出要点。

---

## 阶段二：日常提效（~60 分钟）

### 1. [CLAUDE.md](/guide/intermediate/claude-md)

给 Claude Code 写一份你的工作说明书：

```markdown
# CLAUDE.md

我是一个产品经理，主要用 Claude Code：

- 写和改 PRD（Markdown 格式）
- 分析用户反馈和竞品信息
- 整理会议纪要和需求评审记录
- 生成汇报 PPT 和数据分析

我的文件结构：

- docs/prd/ — PRD 文档
- docs/meetings/ — 会议记录
- docs/analysis/ — 分析报告
- data/ — 原始数据（Excel、CSV）

## 不要做的事

- 不修改 data/ 下的原始数据
- PRD 修改前先问我的意见
- 用中文写所有面向业务的文档
```

### 2. [提高 AI 准确率](/guide/intermediate/improve-ai-accuracy)

**产品经理必读章节**：

- 提示词：说清楚你要什么 — PRD 写得好不好，70% 看提示词
- 主动喂上下文 — 把竞品文档、用户反馈一起拖进去
- 任务拆解 — 别让 AI 一次性写 20 页 PRD，分模块写

### 3. [上下文管理](/guide/intermediate/context-management)

讨论一个需求可能要来回几十轮——学会 `/compact` 保持 AI 不"忘事"。

**验收**：有 CLAUDE.md，能用 Claude Code 把一个需求描述扩展成结构化 PRD。

---

## 阶段三：核心技能（~60 分钟）

### [Feature Dev — 7 阶段引导式功能开发](/tips/feature-dev)

Anthropic 官方插件，用 7 个阶段把模糊需求变成可交付成果：需求澄清 → 方案设计 → 任务拆解 → 执行 → 审查 → 测试 → 交付。

### [产品工具链技巧](/tips/product-toolchain)

以 Claude Code 为编排中心的全流程工具链——从需求到上线每个阶段用什么工具、怎么组合。

### [Skill Creator — 构建自定义技能](/tips/skill-creator)

把"写周报"、"出竞品分析"这些重复流程封装成 Skill，下次一句话触发。

### [Claude-Mem 持久记忆](/tips/claude-mem)

跨对话记住你的产品背景——下次开新对话不用重新解释项目是干什么的。

**验收**：能用 Feature Dev 插件把一个需求从描述推到可评审的 PRD。

---

## 阶段四：专项工具（~30 分钟）

### 设计相关

| 工具                                            | 用途                                        |
| ----------------------------------------------- | ------------------------------------------- |
| [Figma MCP](/guide/advanced/figma-mcp)          | 设计稿直接导出为描述文档，省去手动标注      |
| [Axure + Playwright 实战](/tips/design-to-code) | 用 Axure 原型做设计源，验证前端实现是否一致 |
| [PPT Master](/tips/ppt-master)                  | 一句话生成可编辑的 .pptx 汇报文件           |

### 技能参考

| 技能                                                    | 用途                       |
| ------------------------------------------------------- | -------------------------- |
| [自定义技能](/skills/overview/custom-skills)            | 封装你的产品工作流         |
| [技能市场](/skills/overview/skills-marketplace)         | 找现成的产品相关 Skills    |
| [技能使用指南](/skills/overview/skill-usage-guidelines) | 正确使用 Skills 的注意事项 |

**验收**：能用 PPT Master 生成一份周报 PPT，用 Figma MCP 导出设计稿描述。

---

## 你不需要学的东西

以下内容面向开发人员，**跳过即可**：

- Git 工作流、代码库导航
- Hooks、MCP 服务器搭建
- SDD 规格驱动开发、多 Agent 协作
- 代码图谱、Serena 语义工具
- Chrome DevTools MCP

---

## 实战：产品经理的一天

**上午 — 写 PRD**：

```text
我有一个新需求：用户想要批量导出订单数据。
背景：现在只能单条导出，大客户每次要操作几百次。
目标：支持按时间范围、订单状态筛选后批量导出 CSV。
请帮我写一份 PRD，包含：背景、用户故事、功能范围、验收标准、非功能需求。
```

**下午 — 分析竞品**：

```text
读 competitor/ 目录下三个竞品的功能清单文档，
按功能模块做对比表，标出我们有他们没有的、他们有我们没有的。
```

**下班前 — 出周报**：

```text
这周完成了用户批量导出 PRD 评审，竞品分析报告已同步给团队。
下周计划启动导出功能开发评审。
帮我整理成正式周报 PPT。
```

---

## 下一步

- [CLAUDE.md 社区模板](/guide/intermediate/claude-md-collection) — 找现成的产品经理配置模板
- [前端开发路线](/guide/learning-path/frontend) — 如果你的工作涉及前端交付验收
- [不懂编程路线](/guide/learning-path/non-programmer) — 如果基础操作还不熟悉
