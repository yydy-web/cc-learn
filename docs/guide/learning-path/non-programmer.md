---
title: 不懂编程 · 学习路线
description: 零基础入门 Claude Code——不需要编程经验，从安装到能独立用 AI 处理文档、整理信息、生成报告
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★☆☆☆  | ★★☆☆☆    |
| 🧪 测试 | ★★☆☆☆  | ★★☆☆☆    |
| 📦 产品 | ★★★★★  | ★★☆☆☆    |

**🎯 学习产出：** 掌握零基础使用 Claude Code 的方法，能独立完成日常文档和简单自动化任务

**🚀 AI 能力提升：** 自动化工作流、上下文管理
:::

# 不懂编程 · 学习路线

没用过命令行？没写过代码？没关系。这条路线只教你用 Claude Code 做**非编程类工作**——写文档、整理信息、分析数据、生成报告。

**预计时间**：~2 小时
**前置条件**：会用电脑、能打字

## 🛠️ 推荐安装的 Skills（5 分钟）

先装这几个，后续学习事半功倍：

```bash
# 1. 持久记忆——跨对话记住你的工作背景，下次开对话不用重新解释
npx skills add https://github.com/anthropics/skills --skill claude-mem

# 2. 技能构造器——用对话方式创建你自己的 Skill，封装常用流程
/plugin marketplace add anthropics/skills
/plugin install skill-creator@claude-plugins-official
```

:::tip
Skills 是 Claude Code 的"扩展插件"。装完后 AI 自动获得对应能力，不需要手动调用。
建议控制在 2-3 个以内，装太多反而增加上下文负担。
:::

---

## 阶段一：安装与配置（~20 分钟）

### 1. [什么是 Claude Code](/guide/beginner/what-is-claude-code)

先搞清楚这个东西到底是什么——它是在终端里运行的 AI 助手，不是网页、不是 App、不是 IDE 插件。

### 2. [安装配置](/guide/beginner/installation)

跟着做：

```bash
npm install -g @anthropic-ai/claude-code
```

装完在终端输入 `claude` 就能启动。第一次可能需要配 API Key——把服务商给你的 Key 贴进去就行。

### 3. [快速开始](/guide/quick-start)

5 分钟跑通第一条对话。随便问一句"这个文件夹里有什么"试试。

**验收**：终端里 `claude` 能启动，能正常对话。

---

## 阶段二：基础操作（~30 分钟）

### 1. [第一次对话](/guide/beginner/first-conversation)

学会怎么跟 Claude Code 聊天：

- 打字提问
- 拖文件进来让它读
- 让它帮你搜索文件夹里的内容

### 2. [文件操作](/guide/beginner/file-operations)

**重点看"读取"部分**。作为非编程人员，你主要用它：

- 读文档、总结内容
- 搜索文件夹里的信息
- 整理和重命名文件

修改和删除文件的部分看一下就好，了解有这个能力。

### 3. [权限管理](/guide/beginner/permissions)

**必读**。理解什么操作需要你确认——防止 AI 乱改文件。

**验收**：能让 Claude Code 读完一个文件夹，总结里面讲了什么。

---

## 阶段三：日常提效（~40 分钟）

### 1. [CLAUDE.md 基础](/guide/intermediate/claude-md)

你不需要写复杂的 CLAUDE.md。但可以写一个极简版：

```markdown
# CLAUDE.md

我主要用 Claude Code 做：

- 整理和总结文档
- 写周报和汇报材料
- 分析 Excel 数据

我的文件结构：

- Documents/工作/ — 日常文档
- Documents/项目/ — 各项目资料
- Desktop/临时/ — 临时文件

注意：不要改我的原始文件，修改前先问我。
```

### 2. [提高 AI 准确率](/guide/intermediate/improve-ai-accuracy)

重点看这几节：

- **提示词：说清楚你要什么** — 把需求写明白 AI 才不乱猜
- **主动喂上下文** — 把相关文件拖进去，AI 才知道背景
- **验证：别信，去跑** — AI 生成的文档要自己看一眼

### 3. [上下文管理](/guide/intermediate/context-management)

对话太长 AI 会"忘事"。学会 `/compact` 命令。

**验收**：有自己的一份 CLAUDE.md，能用 Claude Code 完成"读一堆文档 → 总结成一份报告"。

---

## 阶段四：实用场景（~30 分钟）

### 日常高频用法

**读文档并总结**

```text
读 docs/项目方案/ 下所有 .docx 文件，用一段话总结每个方案的要点，做成对照表。
```

**写周报**

```text
这周我做了这些事：[粘贴工作记录]。帮我整理成三段式周报：本周完成、下周计划、风险与阻塞。
```

**整理信息**

```text
把 Download/ 下最近一周下载的文件，按类型（PDF、图片、文档、安装包）分到不同文件夹。
```

**分析数据**

```text
读 data/销售数据.xlsx，按月份统计销售额，找出增长最快的三个产品线。
```

### 不会写命令？这样问

```text
我有一个 Excel 表格在 data/销售.xlsx，我想知道每个季度的销售总额。
请告诉我怎么做，用最简单的步骤。
```

Claude Code 会给你步骤——你照着做就行。

---

## 你不需要学的东西

以下内容面向编程人员，**不属于你的学习范围**：

- Git 工作流 — 你不会用到版本控制
- 代码库导航 — 不写代码不需要
- Hooks / MCP 服务器 — 扩展配置，太底层
- SDD 规格驱动开发 — 写代码才需要
- 多 Agent 协作 — 编程场景专用
- 代码图谱 — 分析代码用的

---

## 下一步

完成这条路线后，如果你发现某些工作反复做，可以：

- 看 [自定义技能](/skills/overview/custom-skills) — 把常用流程封装成一句话触发的 Skill
- 看 [产品经理路线](/guide/learning-path/product) — 如果你的工作偏 PRD 和需求管理
- 看 [CLAUDE.md 社区模板](/guide/intermediate/claude-md-collection) — 找更适合你的配置模板
