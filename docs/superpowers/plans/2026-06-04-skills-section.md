# Skills 独立分区实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将分散在 `guide/advanced/` 和 `tips/` 中的所有 Skills 内容统一整理到顶部导航栏的独立"技能"分区下，按类型分类组织，并在所有涉及 Skills 的页面中添加交叉引用链接。

**Architecture:** 创建新的 `docs/skills/` 目录，包含总览页面、技能创建页面、技能市场页面，以及各技能生态系统（Superpowers、Gstack、Ralph、OpenSpec、Context7）的专属页面。现有 `guide/advanced/` 中的工具页面保留原位，通过交叉链接与新的 Skills 分区互联。仅 `custom-skills.md` 从 `guide/advanced/` 移动到 `skills/`。

**Tech Stack:** Rspress v2, MDX, _meta.json (dir-section-header), _nav.json

---

## File Structure

### New Files

| Path | Responsibility |
|------|---------------|
| `docs/skills/_meta.json` | 侧边栏排序和分组（两个 dir-section-header） |
| `docs/skills/index.md` | Skills 总览页面，按类型分类展示所有 Skills 内容 |
| `docs/skills/overview/custom-skills.md` | 从 `guide/advanced/` 移入，技能创建基础 |
| `docs/skills/overview/skills-marketplace.md` | 技能市场（skills.sh + CC-Switch + ctx7） |
| `docs/skills/workflow/superpowers.md` | Superpowers 技能生态（14 Skills 概览） |
| `docs/skills/workflow/gstack.md` | Gstack 技能生态（23+ Skills 概览） |
| `docs/skills/workflow/ralph.md` | Ralph 自主开发循环 |
| `docs/skills/workflow/openspec.md` | OpenSpec 规格驱动开发 |
| `docs/skills/docs-context/context7.md` | Context7 文档驱动 Skills |

### Modified Files

| Path | Change |
|------|--------|
| `docs/_nav.json` | 添加"技能"导航项 |
| `docs/guide/advanced/_meta.json` | 移除 `custom-skills` |
| `docs/index.md` | 更新高级篇描述，添加技能卡片 |
| `docs/guide/advanced/hooks.md` | 更新"下一步"链接 |
| `docs/guide/advanced/mcp-servers.md` | 更新"下一步"链接 |
| `docs/guide/advanced/superpowers.md` | 添加 Skills 分区交叉引用 |
| `docs/guide/advanced/gstack.md` | 添加 Skills 分区交叉引用 |
| `docs/guide/advanced/cc-switch.md` | 添加 Skills 分区交叉引用 |
| `docs/guide/advanced/ralph.md` | 添加 Skills 分区交叉引用 |
| `docs/guide/advanced/openspec.md` | 添加 Skills 分区交叉引用 |
| `docs/guide/advanced/context7.md` | 添加 Skills 分区交叉引用 |
| `docs/tips/frontend-best-practices.md` | 更新 Skills 链接 |
| `docs/tips/react-best-practices.md` | 添加 Skills 总览链接 |
| `docs/tips/vue-best-practices.md` | 添加 Skills 总览链接 |
| `docs/tips/java-best-practices.md` | 添加 Skills 创建链接 |

### Deleted Files

| Path | Reason |
|------|--------|
| `docs/guide/advanced/custom-skills.md` | 移动到 `docs/skills/overview/custom-skills.md` |

---

## Task 1: 创建 Skills 目录结构和 _meta.json

**Files:**
- Create: `docs/skills/_meta.json`

- [ ] **Step 1: 创建 skills 目录和 _meta.json**

创建文件 `docs/skills/_meta.json`：

```json
[
  { "type": "dir-section-header", "name": "index", "label": "技能概述" },
  "custom-skills",
  "skills-marketplace",
  { "type": "dir-section-header", "name": "superpowers", "label": "开发工作流" },
  "superpowers",
  "gstack",
  "ralph",
  "openspec",
  { "type": "dir-section-header", "name": "context7", "label": "文档与上下文" },
  "context7"
]
```

- [ ] **Step 2: 验证目录结构**

运行: `ls docs/skills/`
预期: 只看到 `_meta.json` 文件

- [ ] **Step 3: Commit**

```bash
git add docs/skills/_meta.json
git commit -m "feat: create skills directory with categorized _meta.json"
```

---

## Task 2: 创建 Skills 总览页面 (index.md)

**Files:**
- Create: `docs/skills/index.md`

- [ ] **Step 1: 创建 docs/skills/index.md**

```markdown
---
title: 技能系统
description: Claude Code 技能系统的完整指南——创建自定义 Skills、发现社区技能、使用专业开发工作流
---

# 技能系统

Skills（技能）是 Claude Code 的核心扩展机制，让你可以封装工作流程、注入领域知识、标准化团队最佳实践。本文按类型梳理了本站所有的 Skills 内容，帮助你快速找到需要的资源。

## 创建与管理

| 页面 | 说明 |
|------|------|
| [自定义技能](/skills/overview/custom-skills) | 创建、编写和使用自定义 Skills |
| [技能市场](/skills/overview/skills-marketplace) | 浏览和安装社区 Skills（skills.sh + CC-Switch） |

## 开发工作流

完整的开发方法论和工程团队模拟，将专业实践封装为可组合的 Skills：

| 页面 | Skills 数量 | 定位 |
|------|-------------|------|
| [Superpowers](/skills/workflow/superpowers) | 14 | 结构化开发方法论（TDD、头脑风暴、代码审查） |
| [Gstack](/skills/workflow/gstack) | 23+ | 虚拟工程团队（QA、安全、发布流程） |
| [Ralph](/skills/workflow/ralph) | 2 | 自主迭代循环（PRD 驱动、跨会话记忆） |
| [OpenSpec](/skills/workflow/openspec) | 6 | 规格驱动开发（先定义规格再写代码） |

## 文档与上下文

| 页面 | 说明 |
|------|------|
| [Context7](/skills/docs-context/context7) | 实时文档注入 + Skills 管理 CLI |

## 按场景选择

| 场景 | 推荐 |
|------|------|
| 想创建团队专属 Skills | [自定义技能](/skills/overview/custom-skills) |
| 想发现和安装社区 Skills | [技能市场](/skills/overview/skills-marketplace) |
| 想用 TDD 和结构化方法开发 | [Superpowers](/skills/workflow/superpowers) |
| 想模拟完整工程团队工作流 | [Gstack](/skills/workflow/gstack) |
| 想让 AI 自主完成大型功能 | [Ralph](/skills/workflow/ralph) |
| 想先定义规格再写代码 | [OpenSpec](/skills/workflow/openspec) |
| 想让 Claude Code 使用最新库文档 | [Context7](/skills/docs-context/context7) |

## 前端框架 Skills

针对 React、Vue 等前端框架的推荐 Skills，已整合在各框架的最佳实践页面中：

- [React 推荐 Skills](/tips/react-best-practices#推荐-react-skills) — `react-best-practices`、`composition-patterns`、`shadcn`
- [Vue 推荐 Skills](/tips/vue-best-practices#推荐-vue-skills) — `vue-best-practices`、`pinia`、`vueuse-functions` 等
- [前端通用推荐 Skills](/tips/frontend-best-practices#推荐-skills) — `frontend-design`、`web-design-guidelines`、`ui-ux-pro-max`

## 工具组合建议

以下 Skills 可以互补使用：

```
Superpowers（TDD + 头脑风暴）  →  Gstack（QA + 审查 + 发布）
OpenSpec（规格定义）  →  Ralph（自主实现）
自定义 Skills  →  CC-Switch（跨项目共享）
```
```

- [ ] **Step 2: Commit**

```bash
git add docs/skills/index.md
git commit -m "feat: add skills overview page with categorized index"
```

---

## Task 3: 移动 custom-skills.md 并更新内容

**Files:**
- Move: `docs/guide/advanced/custom-skills.md` → `docs/skills/overview/custom-skills.md`
- Modify: `docs/guide/advanced/_meta.json`

- [ ] **Step 1: 复制 custom-skills.md 到 skills 目录**

将 `docs/guide/advanced/custom-skills.md` 的内容复制到 `docs/skills/overview/custom-skills.md`。

- [ ] **Step 2: 更新 docs/skills/overview/custom-skills.md 内容**

在文件底部的"下一步"部分之前，添加 Skills 分区导航：

```markdown
:::tip
本页属于[技能系统](/skills/)的一部分。查看更多 Skills 资源：[技能市场](/skills/overview/skills-marketplace) | [Superpowers](/skills/workflow/superpowers) | [Gstack](/skills/workflow/gstack)
:::
```

将现有的"下一步"部分更新为：

```markdown
## 下一步

- [技能市场](/skills/overview/skills-marketplace) — 浏览和安装社区 Skills
- [Superpowers 插件](/skills/workflow/superpowers) — 14 个结构化开发 Skills
- [Gstack 工具包](/skills/workflow/gstack) — 23+ 个工程团队 Skills
- [多智能体工作流](/guide/advanced/multi-agent) — 编排多个 Agent 协作完成复杂任务
- [自动化与 CI/CD](/guide/advanced/automation) — 在自动化流程中使用 Claude Code
```

- [ ] **Step 3: 删除原文件**

删除 `docs/guide/advanced/custom-skills.md`。

- [ ] **Step 4: 更新 docs/guide/advanced/_meta.json**

从 `_meta.json` 中移除 `"custom-skills"`：

```json
["hooks", "mcp-servers", "cc-switch", "superpowers", "gstack", "openspec", "ralph", "codegraph", "code-review-graph", "context7", "multi-agent", "automation"]
```

- [ ] **Step 5: Commit**

```bash
git rm docs/guide/advanced/custom-skills.md
git add docs/skills/overview/custom-skills.md docs/guide/advanced/_meta.json
git commit -m "feat: move custom-skills to skills section"
```

---

## Task 4: 创建 Skills 市场页面

**Files:**
- Create: `docs/skills/overview/skills-marketplace.md`

- [ ] **Step 1: 创建 docs/skills/overview/skills-marketplace.md**

```markdown
---
title: 技能市场
description: 浏览和安装社区 Skills——skills.sh 注册中心、CC-Switch 市场和 ctx7 CLI
---

# 技能市场

Claude Code 的社区 Skills 生态通过多个平台提供发现和安装能力。本页介绍三个主要渠道：skills.sh 公共注册中心、CC-Switch 市场和 Context7 CLI。

:::tip
本页属于[技能系统](/skills/)的一部分。想从零开始创建自己的 Skills？请参考[自定义技能](/skills/overview/custom-skills)。
:::

## skills.sh 注册中心

[skills.sh](https://skills.sh) 是社区 Skills 的公共注册中心，托管来自 Anthropic、Vercel Labs 等组织和个人的 Skills。

```bash
# 安装 Skills CLI
npm install -g skills

# 从 skills.sh 安装社区 Skill
npx skills add <skill-url>

# 例如：安装 Anthropic 官方的前端设计 Skill
npx skills add https://github.com/anthropics/skills --skill frontend-design
```

### 热门 Skills 速查

| Skill | 来源 | 用途 |
|-------|------|------|
| `frontend-design` | Anthropic | 高品质前端界面设计 |
| `web-design-guidelines` | Vercel Labs | 100+ 条 Web UI 最佳实践 |
| `ui-ux-pro-max` | 社区 | 全栈 UI/UX 设计系统 |
| `react-best-practices` | 社区 | React 开发规范 |
| `vue-best-practices` | 社区 | Vue 3 开发规范 |
| `superpowers` | 社区 | 14 个结构化开发 Skills |

:::info
完整的前端框架推荐 Skills 列表，请参考[前端开发最佳实践 > 推荐 Skills](/tips/frontend-best-practices#推荐-skills)。
:::

## CC-Switch 市场

[CC-Switch](/guide/advanced/cc-switch) 提供可视化的 Skills 市场界面，支持一键安装和跨工具同步：

1. 打开 CC-Switch Desktop
2. 进入 Skills 市场
3. 按分类浏览或搜索 Skills
4. 点击安装到 Claude Code（也支持 Codex、Gemini CLI）

```bash
# 通过 CC-Switch CLI 安装 Skills
cc-switch skills install superpowers

# 同步到所有已配置的工具
cc-switch skills sync
```

CC-Switch 通过 skills.sh 注册中心发现社区 Skills，同时支持将本地 `.agents/skills/` 中的自定义 Skills 发布到注册中心。

:::tip
如果你需要在多个 AI 工具（Claude Code、Codex、Gemini CLI）之间同步 Skills 配置，CC-Switch 是最佳选择。
:::

## Context7 CLI

[Context7](/skills/docs-context/context7) 提供了 `ctx7` CLI 工具用于 Skills 管理：

```bash
# 搜索 Skills
ctx7 skills search react

# 安装 Skills
ctx7 skills install /owner/repo

# 根据项目依赖自动推荐
ctx7 skills suggest

# 列出已安装 Skills
ctx7 skills list

# 移除 Skills
ctx7 skills remove <name>

# AI 生成自定义 Skill（需登录）
ctx7 skills generate
```

## 安装方式对比

| 方式 | 适用场景 | 特点 |
|------|----------|------|
| `npx skills add` | 安装单个 Skill | 简单直接，支持 URL 和 GitHub 引用 |
| CC-Switch 市场 | 批量管理和跨工具同步 | GUI 界面，一键安装，跨工具同步 |
| `ctx7` CLI | 搜索和 AI 生成 | 自动推荐，AI 生成 Skill |
| `git clone` | 完整工具包安装 | 如 Gstack、Ralph 等需要 `setup` 脚本的工具 |

## 下一步

- [自定义技能](/skills/overview/custom-skills) — 创建自己的 Skills
- [Superpowers 插件](/skills/workflow/superpowers) — 结构化开发工作流
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 详细的 CC-Switch 使用指南
```

- [ ] **Step 2: Commit**

```bash
git add docs/skills/overview/skills-marketplace.md
git commit -m "feat: add skills marketplace page"
```

---

## Task 5: 创建 Superpowers 技能生态页面

**Files:**
- Create: `docs/skills/workflow/superpowers.md`

- [ ] **Step 1: 创建 docs/skills/workflow/superpowers.md**

```markdown
---
title: Superpowers 技能生态
description: Superpowers 的 14 个 Skills 概览——从头脑风暴到代码审查的完整开发方法论
---

# Superpowers 技能生态

[Superpowers](/guide/advanced/superpowers) 是一个开源的 Claude Code 插件，提供 14 个结构化开发 Skills，覆盖从设计探索到代码审查的完整开发流程。

:::tip
本页属于[技能系统](/skills/)的一部分。安装配置和七步工作流详解请参考 [Superpowers 插件](/guide/advanced/superpowers)。
:::

## 七步工作流

Superpowers 的核心是 7 步开发工作流，每一步对应一个或多个 Skill：

```
头脑风暴 → Git Worktree → 编写计划 → 子智能体驱动 → TDD → 代码审查 → 完成分支
```

## 14 个 Skills 一览

### 流程类 Skills（严格遵循）

| Skill | 斜杠命令 | 用途 |
|-------|----------|------|
| `brainstorming` | `/superpowers:brainstorming` | 编码前的设计探索 |
| `writing-plans` | `/superpowers:writing-plans` | 详细的任务拆分 |
| `test-driven-development` | `/superpowers:test-driven-development` | 严格的 TDD 循环 |
| `systematic-debugging` | `/superpowers:systematic-debugging` | 4 阶段根因分析 |
| `verification-before-completion` | — | "有证据才能说完成" |
| `finishing-a-development-branch` | — | 分支收尾流程 |

### 灵活类 Skills（可按需调整）

| Skill | 斜杠命令 | 用途 |
|-------|----------|------|
| `executing-plans` | `/superpowers:executing-plans` | 在当前会话中执行计划 |
| `subagent-driven-development` | `/superpowers:subagent-driven-development` | 子智能体驱动开发 |
| `dispatching-parallel-agents` | — | 并行任务协调 |
| `using-git-worktrees` | — | 隔离工作区管理 |
| `requesting-code-review` | — | 发起代码审查 |
| `receiving-code-review` | — | 处理审查反馈 |
| `writing-skills` | — | 基于 TDD 创建新 Skill |
| `using-superpowers` | — | 引导 Skill，自动加载 |

## 安装

```
> /plugin install superpowers@claude-plugins-official
```

也可通过 [CC-Switch](/skills/overview/skills-marketplace) 市场安装。

## 与其他 Skills 的关系

| 对比 | Superpowers | [Gstack](/skills/workflow/gstack) |
|------|-------------|--------------------------|
| **定位** | 结构化方法论 | 虚拟工程团队 |
| **特色** | TDD 强制执行 | 内置浏览器、QA |
| **推荐组合** | 前期设计 + TDD 实现 | 后期审查 + QA + 发布 |

## 下一步

- [Superpowers 插件（完整文档）](/guide/advanced/superpowers) — 安装、配置和七步工作流详解
- [Gstack 工具包](/skills/workflow/gstack) — 互补的工程团队 Skills
- [自定义技能](/skills/overview/custom-skills) — 创建自己的 Skills
- [技能市场](/skills/overview/skills-marketplace) — 浏览和安装社区 Skills
```

- [ ] **Step 2: Commit**

```bash
git add docs/skills/workflow/superpowers.md
git commit -m "feat: add Superpowers skills ecosystem page"
```

---

## Task 6: 创建 Gstack 技能生态页面

**Files:**
- Create: `docs/skills/workflow/gstack.md`

- [ ] **Step 1: 创建 docs/skills/workflow/gstack.md**

```markdown
---
title: Gstack 技能生态
description: Gstack 的 23+ 个 Skills 概览——按工程角色组织的虚拟团队工作流
---

# Gstack 技能生态

[Gstack](/guide/advanced/gstack)（Garry's Stack）将 Claude Code 扩展为一个虚拟工程团队，提供 23+ 个专业 Skills，每个 Skill 扮演一个工程角色。

:::tip
本页属于[技能系统](/skills/)的一部分。安装配置和内置浏览器详情请参考 [Gstack 工具包](/guide/advanced/gstack)。
:::

## Sprint 工作流

```
Think → Plan → Build → Review → Test → Ship → Reflect
思考   规划   构建   审查    测试   发布   回顾
```

## 23+ 个 Skills 按角色分类

### Think（思考）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/office-hours` | 产品经理 | YC 式产品拷问 |
| `/spec` | 规格工程师 | 将意图转化为规格文档 |

### Plan（规划）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/plan-ceo-review` | CEO | 四种审查模式 |
| `/plan-eng-review` | 工程经理 | 架构和测试策略锁定 |
| `/plan-design-review` | 高级设计师 | 设计质量评分 |
| `/plan-devex-review` | DX 负责人 | 开发者体验审查 |
| `/autoplan` | 自动调度 | 根据项目类型选择 |

### Review（审查）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/review` | Staff Engineer | 生产 Bug 聚焦审查 |
| `/investigate` | 调试专家 | 系统性根因分析 |
| `/design-review` | 设计师+开发者 | 设计问题审计 |
| `/devex-review` | DX 审计 | 开发者入职体验 |
| `/codex` | 独立审查员 | 跨模型独立审查 |

### Test（测试）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/qa` | QA Lead | 真实浏览器测试 |
| `/qa-only` | QA 报告 | 只报告不修改 |
| `/cso` | 安全负责人 | OWASP Top 10 + STRIDE |
| `/benchmark` | 性能工程师 | Core Web Vitals |

### Ship（发布）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/ship` | 发布工程师 | 同步、测试、推送、创建 PR |
| `/land-and-deploy` | 部署工程师 | 合并 PR、验证生产 |
| `/canary` | 监控 | 部署后监控 |

### Reflect（回顾）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/retro` | 回顾主持人 | 每周回顾 |
| `/learn` | 知识管理 | 跨会话学习 |
| `/document-release` | 文档工程师 | 更新文档 |
| `/document-generate` | 文档生成 | Diataxis 框架生成 |

## 安装

```
> git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/workflow/gstack && cd ~/.claude/skills/workflow/gstack && ./setup
```

也可通过 [CC-Switch](/skills/overview/skills-marketplace) 市场发现 Gstack 的独立 Skills。

## 与其他 Skills 的关系

| 对比 | [Superpowers](/skills/workflow/superpowers) | Gstack |
|------|-------------------------------------|--------|
| **定位** | 结构化方法论 | 虚拟工程团队 |
| **特色** | TDD 强制执行 | 内置浏览器、iOS 测试 |
| **推荐组合** | 前期设计 + TDD 实现 | 后期审查 + QA + 发布 |

## 下一步

- [Gstack 工具包（完整文档）](/guide/advanced/gstack) — 安装、配置和内置浏览器详解
- [Superpowers 技能生态](/skills/workflow/superpowers) — 互补的结构化开发方法论
- [技能市场](/skills/overview/skills-marketplace) — 浏览和安装社区 Skills
```

- [ ] **Step 2: Commit**

```bash
git add docs/skills/workflow/gstack.md
git commit -m "feat: add Gstack skills ecosystem page"
```

---

## Task 7: 创建 Ralph 自主循环页面

**Files:**
- Create: `docs/skills/workflow/ralph.md`

- [ ] **Step 1: 创建 docs/skills/workflow/ralph.md**

```markdown
---
title: Ralph 自主循环
description: Ralph 的自主迭代模式——PRD 驱动、新鲜上下文、跨会话记忆
---

# Ralph 自主循环

[Ralph](/guide/advanced/ralph) 是一个自主 AI Agent 循环工具，让 Claude Code 反复执行任务直到产品需求文档（PRD）中的所有用户故事完成。它解决了一个核心问题：**单次上下文窗口有限，无法一次性完成大型功能**。

:::tip
本页属于[技能系统](/skills/)的一部分。安装配置和调试技巧请参考 [Ralph 自主循环](/guide/advanced/ralph)。
:::

## 核心理念

```
新鲜上下文 + 持久化记忆 = 可靠的自主开发
```

每次迭代使用全新的 Claude Code 实例，记忆通过三个渠道传递：

| 渠道 | 作用 |
|------|------|
| **Git 历史** | 之前的代码变更和提交信息 |
| **progress.txt** | 学到的经验和常见问题 |
| **prd.json** | 哪些故事已完成，哪些待处理 |

## 两个 Skills

| Skill | 用途 |
|-------|------|
| `/prd` | 生成产品需求文档（PRD） |
| `/ralph` | 将 PRD 转换为 `prd.json` 结构化格式 |

## 工作流

```
/prd → /ralph → ralph.sh 循环 → 所有故事完成
```

1. 使用 `/prd` 生成 PRD
2. 使用 `/ralph` 转换为 `prd.json`
3. 运行 `./scripts/ralph/ralph.sh` 开始自主循环

## 安装

```
> /plugin marketplace add snarktank/ralph
> /plugin install ralph-skills@ralph-marketplace
```

也可通过 [CC-Switch](/skills/overview/skills-marketplace) 市场发现 Ralph 的 Skills。

## 与其他 Skills 的关系

| 工具 | 侧重点 | 适合场景 |
|------|--------|----------|
| [Superpowers](/skills/workflow/superpowers) | 单次会话内的结构化方法论 | TDD、头脑风暴、审查 |
| [Gstack](/skills/workflow/gstack) | 交互式工程团队模拟 | 精细控制每个阶段 |
| **Ralph** | **跨迭代的自主循环** | **"放手让它跑"的自主模式** |
| [OpenSpec](/skills/workflow/openspec) | 规格文档管理 | 先定义规格再实现 |

:::tip
可以组合使用：用 OpenSpec 的 `/opsx:propose` 创建需求规格，再用 Ralph 的循环机制自动实现。
:::

## 下一步

- [Ralph 自主循环（完整文档）](/guide/advanced/ralph) — 安装、配置和调试技巧
- [OpenSpec 规格驱动开发](/skills/workflow/openspec) — 互补的规格驱动方法
- [自定义技能](/skills/overview/custom-skills) — 创建自己的 Skills
```

- [ ] **Step 2: Commit**

```bash
git add docs/skills/workflow/ralph.md
git commit -m "feat: add Ralph autonomous loop page"
```

---

## Task 8: 创建 OpenSpec 规格驱动页面

**Files:**
- Create: `docs/skills/workflow/openspec.md`

- [ ] **Step 1: 创建 docs/skills/workflow/openspec.md**

```markdown
---
title: OpenSpec 规格驱动开发
description: OpenSpec 的规格驱动模式——Propose → Apply → Archive，先定义规格再写代码
---

# OpenSpec 规格驱动开发

[OpenSpec](/guide/advanced/openspec) 是一个规格驱动开发框架，解决了一个核心问题：**当需求只存在于聊天记录中时，AI 的输出是不可预测的**。它让人和 AI 在写代码之前先"对齐要构建什么"。

:::tip
本页属于[技能系统](/skills/)的一部分。安装配置和 CLI 命令详情请参考 [OpenSpec 规格驱动开发](/guide/advanced/openspec)。
:::

## 核心理念

```
Propose → Apply → Archive
  提案   →  实现  →  归档
```

每个变更都有独立的文件夹，包含四个核心制品：

| 制品 | 文件 | 用途 |
|------|------|------|
| 提案 | `proposal.md` | 做什么、为什么做 |
| 规格 | `specs/` | 新增/修改/删除的需求 |
| 设计 | `design.md` | 技术架构和决策 |
| 任务 | `tasks.md` | 实现清单（带复选框） |

## 核心命令

| 命令 | 用途 |
|------|------|
| `/opsx:propose` | 创建变更提案 |
| `/opsx:apply` | 按任务清单实现 |
| `/opsx:archive` | 归档变更到主规格 |
| `/opsx:explore` | 探索模式（不生成文件） |

## 与 Superpowers 的桥接

OpenSpec 社区提供了 `superpowers-bridge` Schema，将 [Superpowers](/skills/workflow/superpowers) 的 Skills 桥接到 OpenSpec 工作流中：

```
Superpowers 的头脑风暴、TDD、代码审查 → 桥接到 OpenSpec 的规格驱动流程
```

## 安装

```bash
npm install -g @fission-ai/openspec@latest
cd your-project && openspec init
```

也可通过 [CC-Switch](/skills/overview/skills-marketplace) 市场发现 OpenSpec 的独立 Skills。

## 与其他 Skills 的关系

| 工具 | 核心理念 | 适合场景 |
|------|----------|----------|
| **OpenSpec** | **规格驱动——先定义"做什么"** | **需求复杂、需要文档化** |
| [Superpowers](/skills/workflow/superpowers) | 方法论驱动——先设计"怎么做" | 开发过程需要纪律 |
| [Ralph](/skills/workflow/ralph) | 自主循环——自动执行 | 大型功能、放手让它跑 |
| [Gstack](/skills/workflow/gstack) | 工程团队模拟 | QA、安全、浏览器测试 |

## 下一步

- [OpenSpec 规格驱动开发（完整文档）](/guide/advanced/openspec) — 安装、配置和 CLI 命令
- [Ralph 自主循环](/skills/workflow/ralph) — 互补的自主实现方案
- [Superpowers 技能生态](/skills/workflow/superpowers) — 桥接到结构化方法论
```

- [ ] **Step 2: Commit**

```bash
git add docs/skills/workflow/openspec.md
git commit -m "feat: add OpenSpec spec-driven development page"
```

---

## Task 9: 创建 Context7 文档驱动页面

**Files:**
- Create: `docs/skills/docs-context/context7.md`

- [ ] **Step 1: 创建 docs/skills/docs-context/context7.md**

```markdown
---
title: Context7 文档驱动 Skills
description: Context7 的 Skills 管理 CLI 和实时文档注入——搜索、安装、推荐和生成 Skills
---

# Context7 文档驱动 Skills

[Context7](/guide/advanced/context7) 不仅提供实时文档注入（MCP 模式），还内置了完整的 Skills 管理 CLI（`ctx7`），支持搜索、安装、推荐和 AI 生成 Skills。

:::tip
本页属于[技能系统](/skills/)的一部分。MCP 配置和文档查询详情请参考 [Context7 实时文档](/guide/advanced/context7)。
:::

## Skills 管理 CLI

Context7 的 `ctx7` CLI 提供了 Skills 的完整生命周期管理：

```bash
# 搜索 Skills
ctx7 skills search react

# 安装 Skills
ctx7 skills install /owner/repo

# 根据项目依赖自动推荐
ctx7 skills suggest

# 列出已安装 Skills
ctx7 skills list

# 移除 Skills
ctx7 skills remove <name>

# AI 生成自定义 Skill（需登录）
ctx7 skills generate
```

## 安装

```bash
npx ctx7 setup --claude
```

一键完成 OAuth 认证、MCP 服务器配置和 Skill 安装。

## 与其他 Skills 渠道的对比

| 渠道 | 特色 | 适用场景 |
|------|------|----------|
| [skills.sh](/skills/overview/skills-marketplace) | 公共注册中心 | 发现社区 Skills |
| [CC-Switch](/skills/overview/skills-marketplace) | GUI + 跨工具同步 | 批量管理 |
| **ctx7 CLI** | **AI 生成 + 自动推荐** | **智能发现和创建** |

## 下一步

- [Context7 实时文档（完整文档）](/guide/advanced/context7) — MCP 配置和文档查询
- [技能市场](/skills/overview/skills-marketplace) — 更多 Skills 发现渠道
- [自定义技能](/skills/overview/custom-skills) — 手动创建 Skills
```

- [ ] **Step 2: Commit**

```bash
git add docs/skills/docs-context/context7.md
git commit -m "feat: add Context7 doc-driven skills page"
```

---

## Task 10: 更新顶部导航栏

**Files:**
- Modify: `docs/_nav.json`

- [ ] **Step 1: 更新 docs/_nav.json**

在"技巧"和"Claude Code 文档"之间插入"技能"导航项：

```json
[
  { "text": "教程",        "link": "/guide/quick-start", "activeMatch": "/guide/" },
  { "text": "命令参考",     "link": "/commands/",          "activeMatch": "/commands/" },
  { "text": "技能",        "link": "/skills/",            "activeMatch": "/skills/" },
  { "text": "技巧",        "link": "/tips/",              "activeMatch": "/tips/" },
  { "text": "Claude Code 文档", "link": "https://docs.anthropic.com/en/docs/claude-code" }
]
```

- [ ] **Step 2: Commit**

```bash
git add docs/_nav.json
git commit -m "feat: add Skills entry to top navbar"
```

---

## Task 11: 更新首页

**Files:**
- Modify: `docs/index.md`

- [ ] **Step 1: 添加技能特性卡片并更新高级篇描述**

将 `docs/index.md` 的 features 部分更新为：

```yaml
features:
  - title: 基础篇
    details: 从零开始学习 Claude Code，掌握安装、配置、基本对话和文件操作
    icon: 🚀
    link: /guide/beginner/what-is-claude-code
  - title: 进阶篇
    details: 深入代码库导航、Slash 命令、项目约定和 Git 工作流
    icon: 🔧
    link: /guide/intermediate/codebase-navigation
  - title: 高级篇
    details: 探索 Hooks、MCP 服务器、多智能体工作流和自动化 CI/CD
    icon: ⚡
    link: /guide/advanced/hooks
  - title: 技能
    details: 创建自定义 Skills、浏览技能市场、使用 Superpowers、Gstack 等专业开发工作流
    icon: 🧩
    link: /skills/
  - title: 命令参考
    details: 完整的 Claude Code 命令速查手册
    icon: 📖
    link: /commands/
```

- [ ] **Step 2: Commit**

```bash
git add docs/index.md
git commit -m "feat: add Skills feature card to homepage"
```

---

## Task 12: 更新高级篇工具页面的交叉引用（第一批）

**Files:**
- Modify: `docs/guide/advanced/hooks.md`
- Modify: `docs/guide/advanced/mcp-servers.md`
- Modify: `docs/guide/advanced/superpowers.md`
- Modify: `docs/guide/advanced/gstack.md`

- [ ] **Step 1: 更新 hooks.md 的"下一步"**

将 `docs/guide/advanced/hooks.md` 的"下一步"部分更新为：

```markdown
## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 用 MCP 扩展 Claude Code 的工具能力
- [自定义技能](/skills/overview/custom-skills) — 创建自定义的 Skills 和 Agents
```

（链接从 `/guide/advanced/custom-skills` 更新为 `/skills/overview/custom-skills`）

- [ ] **Step 2: 更新 mcp-servers.md 的"下一步"**

将 `docs/guide/advanced/mcp-servers.md` 的"下一步"部分更新为：

```markdown
## 下一步

- [自定义技能](/skills/overview/custom-skills) — 创建自定义的 Skills 和 Agents
- [多智能体工作流](/guide/advanced/multi-agent) — 编排多个 Agent 协作
```

（链接从 `/guide/advanced/custom-skills` 更新为 `/skills/overview/custom-skills`）

- [ ] **Step 3: 更新 superpowers.md 添加交叉引用**

在 `docs/guide/advanced/superpowers.md` 的"相关资源"部分之前，添加：

```markdown
:::tip
Superpowers 的 14 个 Skills 概览和与其他 Skills 工具的关系对比，请参考 [Superpowers 技能生态](/skills/workflow/superpowers)。更多 Skills 资源请访问[技能系统](/skills/)。
:::
```

- [ ] **Step 4: 更新 gstack.md 添加交叉引用**

在 `docs/guide/advanced/gstack.md` 的"相关资源"部分之前，添加：

```markdown
:::tip
Gstack 的 23+ 个 Skills 按角色分类的概览，请参考 [Gstack 技能生态](/skills/workflow/gstack)。更多 Skills 资源请访问[技能系统](/skills/)。
:::
```

- [ ] **Step 5: Commit**

```bash
git add docs/guide/advanced/hooks.md docs/guide/advanced/mcp-servers.md docs/guide/advanced/superpowers.md docs/guide/advanced/gstack.md
git commit -m "docs: add cross-references to skills section (batch 1)"
```

---

## Task 13: 更新高级篇工具页面的交叉引用（第二批）

**Files:**
- Modify: `docs/guide/advanced/cc-switch.md`
- Modify: `docs/guide/advanced/ralph.md`
- Modify: `docs/guide/advanced/openspec.md`
- Modify: `docs/guide/advanced/context7.md`

- [ ] **Step 1: 更新 cc-switch.md 的"下一步"**

将 `docs/guide/advanced/cc-switch.md` 的"下一步"部分更新为：

```markdown
## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [自定义技能](/skills/overview/custom-skills) — 创建和管理自定义 Skills
- [技能市场](/skills/overview/skills-marketplace) — 浏览和安装社区 Skills
- [自动化与 CI/CD](/guide/advanced/automation) — 将 Claude Code 集成到自动化流程
```

（链接从 `/guide/advanced/custom-skills` 更新为 `/skills/overview/custom-skills`，并添加技能市场链接）

- [ ] **Step 2: 更新 ralph.md 的"下一步"和交叉引用**

在 `docs/guide/advanced/ralph.md` 的"与其他工具的关系"部分之前，添加一行：

```markdown
更多 Skills 工具的关系对比，请参考[技能系统](/skills/)。
```

将"下一步"部分更新为：

```markdown
## 下一步

- [自动化与 CI/CD](/guide/advanced/automation) — 将 Claude Code 集成到自动化流程
- [Superpowers 插件](/guide/advanced/superpowers) — 互补的结构化开发方法论
- [OpenSpec 规格驱动开发](/guide/advanced/openspec) — 互补的规格驱动方法
- [自定义技能](/skills/overview/custom-skills) — 创建和管理自定义 Skills
```

- [ ] **Step 3: 更新 openspec.md 的"下一步"**

将 `docs/guide/advanced/openspec.md` 的"下一步"部分更新为：

```markdown
## 下一步

- [Superpowers 插件](/guide/advanced/superpowers) — 互补的结构化开发方法论
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 API Provider 和 Skills
- [自定义技能](/skills/overview/custom-skills) — 创建和管理自定义 Skills
- [Ralph 自主循环](/skills/workflow/ralph) — 互补的自主实现方案
```

（链接从 `/guide/advanced/custom-skills` 更新为 `/skills/overview/custom-skills`）

- [ ] **Step 4: 更新 context7.md 的"下一步"**

将 `docs/guide/advanced/context7.md` 的"下一步"部分更新为：

```markdown
## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 深入了解 MCP 服务器配置
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 MCP 服务器和 API Provider
- [自定义技能](/skills/overview/custom-skills) — 创建和管理自定义 Skills
- [技巧与最佳实践](/tips/best-practices) — 更多高效使用技巧
```

（链接从 `/guide/advanced/custom-skills` 更新为 `/skills/overview/custom-skills`）

- [ ] **Step 5: Commit**

```bash
git add docs/guide/advanced/cc-switch.md docs/guide/advanced/ralph.md docs/guide/advanced/openspec.md docs/guide/advanced/context7.md
git commit -m "docs: add cross-references to skills section (batch 2)"
```

---

## Task 14: 更新技巧页面的交叉引用

**Files:**
- Modify: `docs/tips/frontend-best-practices.md`
- Modify: `docs/tips/react-best-practices.md`
- Modify: `docs/tips/vue-best-practices.md`
- Modify: `docs/tips/java-best-practices.md`

- [ ] **Step 1: 更新 frontend-best-practices.md 的"自定义 Skills"部分**

在 `docs/tips/frontend-best-practices.md` 的"自定义 Skills"小节开头添加引导链接：

在 `### 自定义 Skills` 标题后、代码示例之前，插入：

```markdown
:::tip
创建自定义 Skills 的基础知识请参考[自定义技能](/skills/overview/custom-skills)。以下是一个前端专用 Skill 的示例。
:::
```

在"推荐 Skills"小节开头（`## 推荐 Skills` 标题后），插入：

```markdown
:::tip
更多 Skills 发现渠道（skills.sh、CC-Switch、ctx7 CLI）请参考[技能市场](/skills/overview/skills-marketplace)。
:::
```

- [ ] **Step 2: 更新 react-best-practices.md 添加链接**

在 `docs/tips/react-best-practices.md` 的"推荐 React Skills"小节开头添加：

```markdown
:::tip
更多 Skills 资源请访问[技能系统](/skills/)。React Skills 可通过[技能市场](/skills/overview/skills-marketplace)一键安装。
:::
```

- [ ] **Step 3: 更新 vue-best-practices.md 添加链接**

在 `docs/tips/vue-best-practices.md` 的"推荐 Vue Skills"小节开头添加：

```markdown
:::tip
更多 Skills 资源请访问[技能系统](/skills/)。Vue Skills 可通过[技能市场](/skills/overview/skills-marketplace)一键安装。
:::
```

- [ ] **Step 4: 更新 java-best-practices.md 添加链接**

在 `docs/tips/java-best-practices.md` 的"自定义 Skills"小节开头添加：

```markdown
:::tip
创建自定义 Skills 的基础知识请参考[自定义技能](/skills/overview/custom-skills)。
:::
```

- [ ] **Step 5: Commit**

```bash
git add docs/tips/frontend-best-practices.md docs/tips/react-best-practices.md docs/tips/vue-best-practices.md docs/tips/java-best-practices.md
git commit -m "docs: add cross-references to skills section in tips pages"
```

---

## Task 15: 验证构建

**Files:** N/A (validation only)

- [ ] **Step 1: 运行生产构建**

```bash
npm run build
```

预期: 构建成功，无错误。特别关注：
- 新的 `/skills/` 页面正确生成
- 所有交叉链接不产生 404
- 侧边栏分组正确显示（"技能概述"、"开发工作流"、"文档与上下文"）
- 顶部导航栏显示"技能"入口

- [ ] **Step 2: 检查构建输出**

检查 `doc_build/` 目录中是否生成了以下文件：
- `doc_build/skills/index.html`
- `doc_build/skills/overview/custom-skills.html`
- `doc_build/skills/overview/skills-marketplace.html`
- `doc_build/skills/workflow/superpowers.html`
- `doc_build/skills/workflow/gstack.html`
- `doc_build/skills/workflow/ralph.html`
- `doc_build/skills/workflow/openspec.html`
- `doc_build/skills/docs-context/context7.html`

- [ ] **Step 3: 检查原 custom-skills 路径不再生成**

确认 `doc_build/guide/advanced/custom-skills.html` **不存在**（已移动到 skills 目录）。

- [ ] **Step 4: 本地预览验证（可选）**

```bash
npm run preview
```

在浏览器中检查：
- 顶部导航栏的"技能"链接正确指向 `/skills/`
- Skills 总览页面的分类表格和链接正确
- 侧边栏分组（"技能概述"、"开发工作流"、"文档与上下文"）正确显示
- 从 guide/advanced 页面的交叉链接可正确跳转
- 从 tips 页面的交叉链接可正确跳转

- [ ] **Step 5: 修复发现的问题（如有）**

如果构建失败或链接有误，修复后重新运行构建验证。

---

## 执行总结

| Task | 内容 | 涉及文件数 |
|------|------|-----------|
| 1 | 创建 _meta.json | 1 新建 |
| 2 | 创建 Skills 总览页面 | 1 新建 |
| 3 | 移动 custom-skills.md | 1 新建 + 1 删除 + 1 修改 |
| 4 | 创建技能市场页面 | 1 新建 |
| 5 | 创建 Superpowers 页面 | 1 新建 |
| 6 | 创建 Gstack 页面 | 1 新建 |
| 7 | 创建 Ralph 页面 | 1 新建 |
| 8 | 创建 OpenSpec 页面 | 1 新建 |
| 9 | 创建 Context7 页面 | 1 新建 |
| 10 | 更新顶部导航栏 | 1 修改 |
| 11 | 更新首页 | 1 修改 |
| 12 | 更新交叉引用（第一批） | 4 修改 |
| 13 | 更新交叉引用（第二批） | 4 修改 |
| 14 | 更新技巧页面交叉引用 | 4 修改 |
| 15 | 验证构建 | 验证 |

**总计:** 9 个新文件创建，1 个文件删除，15 个文件修改
