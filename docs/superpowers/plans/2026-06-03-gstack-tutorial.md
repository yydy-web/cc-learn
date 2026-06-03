# Gstack 教程 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 Claude Code 教程站点中添加 Gstack 工具包的介绍和使用教程，展示其虚拟工程团队工作流和内置浏览器能力。

**Architecture:** 新建一个高级篇页面 `docs/guide/advanced/gstack.md`，介绍 Gstack 的核心理念（虚拟工程团队）、Sprint 工作流、23+ Skills 分类速查、内置浏览器、配置方式，并展示通过 CC-Switch Skills 市场安装的方式。同时更新 4 个现有页面添加交叉引用。

**Tech Stack:** Rspress v2, Markdown/MDX, YAML frontmatter

---

## File Structure

| 操作 | 文件 | 职责 |
|------|------|------|
| 创建 | `docs/guide/advanced/gstack.md` | Gstack 完整教程页面 |
| 修改 | `docs/guide/advanced/_meta.json` | 侧边栏添加 gstack 条目 |
| 修改 | `docs/guide/advanced/superpowers.md` | 添加与 Gstack 的对比说明 |
| 修改 | `docs/index.md` | 首页高级篇描述中加入 Gstack |
| 修改 | `docs/tips/best-practices.md` | 添加 Gstack 工作流最佳实践 |

---

### Task 1: 创建 Gstack 教程页面

**Files:**
- Create: `docs/guide/advanced/gstack.md`

- [ ] **Step 1: 创建完整的 Gstack 教程页面**

Write the following file to `docs/guide/advanced/gstack.md`:

```markdown
---
title: Gstack 工具包
description: 使用 Gstack 将 Claude Code 变成虚拟工程团队，覆盖规划、审查、QA、安全和部署全流程
---

# Gstack 工具包

Gstack（Garry's Stack）是由 Y Combinator CEO Garry Tan 开发的开源工具包，将 Claude Code 扩展为一个虚拟工程团队。它提供 23+ 个专业 Slash 命令，每个命令扮演一个工程角色——从产品经理、CEO 到 Staff Engineer、QA Lead 和安全负责人。

## 核心理念

Gstack 的设计哲学是 **Sprint 工作流**：

```
Think → Plan → Build → Review → Test → Ship → Reflect
思考   规划   构建   审查    测试   发布   回顾
```

每一步都有对应的 Skill，上一步的输出自动流入下一步。整个流程模拟了真实工程团队的协作方式。

:::info
Garry Tan 使用这套工作流在 60 天内（兼职）发布了 3 个生产服务和 40+ 个功能，同时还在全职管理 YC。
:::

## 安装

### 系统要求

- **Claude Code** — 必须已安装
- **Git**
- **Bun** v1.0+（不是 Node.js）
- **Node.js** — 仅 Windows 需要

### 方式一：直接安装

在 Claude Code 中粘贴以下命令：

```
> git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

安装脚本会自动：
1. 检查 Bun 是否已安装
2. 编译 `browse` 浏览器二进制文件（~58MB）
3. 生成所有 Skill 文件
4. 安装 Playwright Chromium（如果未安装）
5. 在 `~/.claude/skills/` 中创建符号链接
6. 提示选择命令前缀（短格式 `/qa` 或命名空间 `/gstack-qa`）

### 方式二：通过 CC-Switch 安装

如果你已安装 [CC-Switch](/guide/advanced/cc-switch)，可以通过 Skills 市场浏览 Gstack 相关的社区 Skills：

1. 打开 CC-Switch Desktop
2. 进入 Skills 市场
3. 搜索 "gstack"
4. 选择需要的 Skills 安装到 Claude Code

:::tip
Gstack 的核心安装需要运行 `./setup` 脚本来编译浏览器组件。CC-Switch 主要用于发现和管理 Gstack 发布到 skills.sh 的独立 Skills。
:::

### 团队模式（推荐）

在项目仓库中启用团队模式，让队友自动获得 Gstack：

```
> (cd ~/.claude/skills/gstack && ./setup --team) && ~/.claude/skills/gstack/bin/gstack-team-init required && git add .claude/ CLAUDE.md && git commit -m "require gstack for AI-assisted work"
```

团队模式通过 `SessionStart` Hook 自动更新，无需手动同步。

## 快速开始

安装完成后，按顺序体验 Gstack 的核心流程：

```
> /office-hours
描述你的项目，Gstack 会用 YC 式的 6 个关键问题来挖掘需求
```

```
> /plan-ceo-review
对任何功能想法进行 CEO 视角的审查
```

```
> /review
在有改动的分支上运行 Staff Engineer 级别的代码审查
```

```
> /qa https://your-staging-url.com
在真实浏览器中测试应用，自动发现和修复 Bug
```

## Sprint 工作流详解

### 阶段一：Think（思考）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/office-hours` | 产品经理 | YC 式产品拷问，6 个核心问题挖掘真实需求 |
| `/spec` | 规格工程师 | 将模糊意图转化为精确可执行的规格文档，质量评分低于 7 分会被阻断 |

### 阶段二：Plan（规划）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/plan-ceo-review` | CEO | 四种审查模式：扩张、选择性扩张、维持、缩减 |
| `/plan-eng-review` | 工程经理 | 锁定架构、数据流、边界情况和测试策略 |
| `/plan-design-review` | 高级设计师 | 每个维度 0-10 评分，检测 AI 味的设计 |
| `/plan-devex-review` | DX 负责人 | 面向开发者的 API/CLI/SDK 体验审查 |
| `/autoplan` | 自动调度 | 根据项目类型自动选择合适的规划 Skills |

:::tip
不确定用哪个规划 Skill？直接用 `/autoplan`，Gstack 会根据你的项目类型自动选择。
:::

### 阶段三：Build（构建）

构建阶段由 Claude Code 的原生文件编辑和命令执行能力驱动，Gstack 在构建过程中提供持续检查点：

- **连续检查点模式**：自动以 `WIP:` 前缀提交，防止工作丢失
- **上下文保存/恢复**：`/context-save` 和 `/context-restore` 跨会话保持状态

### 阶段四：Review（审查）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/review` | Staff Engineer | 聚焦能通过 CI 的生产 Bug，自动修复明显问题 |
| `/investigate` | 调试专家 | 系统性根因分析，"铁律：没有调查就没有修复" |
| `/design-review` | 设计师+开发者 | 审计设计问题，原子提交修复，自动截图 |
| `/devex-review` | DX 审计 | 实时测试开发者入职体验，测量 TTHW |
| `/codex` | 独立审查员 | 调用 OpenAI Codex CLI 进行跨模型独立审查 |

### 阶段五：Test（测试）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/qa` | QA Lead | 在真实浏览器中测试，发现 Bug 并生成回归测试 |
| `/qa-only` | QA 报告 | 同 `/qa` 但只报告不修改代码 |
| `/cso` | 安全负责人 | OWASP Top 10 + STRIDE 威胁建模，17 项误报排除 |
| `/benchmark` | 性能工程师 | 基线页面加载时间、Core Web Vitals、资源大小 |

### 阶段六：Ship（发布）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/ship` | 发布工程师 | 同步 main、运行测试、审计覆盖率、推送并创建 PR |
| `/land-and-deploy` | 部署工程师 | 合并 PR、等待 CI、验证生产环境健康 |
| `/canary` | 监控 | 部署后监控控制台错误、性能回归、页面故障 |

### 阶段七：Reflect（回顾）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/retro` | 回顾主持人 | 每周回顾，按人员分解；`/retro global` 跨项目 |
| `/learn` | 知识管理 | 跨会话学习管理，项目特定的模式和偏好 |
| `/document-release` | 文档工程师 | 更新所有项目文档以匹配已发布内容 |
| `/document-generate` | 文档生成 | 使用 Diataxis 框架从零生成缺失文档 |

## 审查路由指南

根据你构建的目标选择合适的 Skill：

| 构建目标 | 规划阶段 | 实时审计 |
|----------|----------|----------|
| 终端用户（UI/Web/移动端） | `/plan-design-review` | `/design-review` |
| 开发者（API/CLI/SDK） | `/plan-devex-review` | `/devex-review` |
| 架构（数据流/性能） | `/plan-eng-review` | `/review` |
| 以上全部 | `/autoplan` | — |

## 内置浏览器

Gstack 内置了一个基于 Playwright 的 Chromium 浏览器，让 Claude Code 可以像真人一样操作网页。

### 核心特性

- **真实浏览器操作**：点击、填写表单、截图，不是模拟
- **Ref 元素选择**：使用 `@e1`、`@e2` 引用页面元素，无需 CSS 选择器
- **70+ 命令**：覆盖读取、检查、导航、交互、截图、提取等操作
- **~100ms 响应**：首次启动 ~3s，后续命令 100-200ms

### 浏览器命令分类

| 类别 | 命令示例 | 说明 |
|------|----------|------|
| 读取 | `text`, `html`, `links`, `forms` | 获取页面内容 |
| 检查 | `js`, `eval`, `css`, `attrs` | 执行 JS、检查样式 |
| 导航 | `goto`, `back`, `forward`, `reload` | 页面导航 |
| 交互 | `click`, `fill`, `select`, `hover` | 模拟用户操作 |
| 视觉 | `screenshot`, `pdf`, `responsive` | 截图和视觉检查 |
| 提取 | `download`, `scrape`, `archive` | 数据提取 |

### 使用示例

```
> /qa https://localhost:3000
```

Gstack 会启动浏览器，自动遍历页面，发现交互 Bug 并生成修复。

## 实用工具

| 工具 | 说明 |
|------|------|
| `/careful` | 在执行破坏性命令前发出警告 |
| `/freeze` | 限制文件编辑到单个目录（调试时使用） |
| `/guard` | `/careful` + `/freeze` 组合 |
| `/design-shotgun` | 生成 4-6 个 AI 设计变体，打开对比面板 |
| `/design-html` | 将设计稿转为生产级 HTML/CSS |
| `/gstack-upgrade` | 自我更新到最新版本 |

## 配置

### 全局配置

配置文件位于 `~/.gstack/config.yaml`：

```yaml
# 命令前缀：short (/qa) 或 namespaced (/gstack-qa)
skill_prefix: short

# 遥测（默认关闭）
telemetry: "off"

# 检查点模式：continuous 自动 WIP 提交
checkpoint_mode: continuous

# 详细程度：verbose 或 terse
explain_level: verbose

# 自动更新
auto_upgrade: true
```

使用 CLI 管理配置：

```bash
gstack-config set skill_prefix short
gstack-config get telemetry
```

### 项目配置

在项目的 `CLAUDE.md` 中添加 Gstack 相关的 Skill 列表，让 Claude Code 知道可用的命令。

## 与 Superpowers 的对比

Gstack 和 [Superpowers](/guide/advanced/superpowers) 都是 Claude Code 的 Skill 插件，但侧重点不同：

| 方面 | Gstack | Superpowers |
|------|--------|-------------|
| **定位** | 虚拟工程团队 | 结构化开发方法论 |
| **Skills 数量** | 23+ | 14 |
| **特色能力** | 内置浏览器、iOS 测试 | TDD 强制执行 |
| **安装方式** | `git clone` + `./setup` | `/plugin install` |
| **工作流** | Think → Plan → Build → Review → Test → Ship → Reflect | 头脑风暴 → 计划 → TDD → 审查 → 完成 |
| **浏览器** | 内置 Playwright Chromium（70+ 命令） | 无 |
| **团队模式** | 内置，SessionStart Hook 自动更新 | 通过 Git 共享 |

:::tip
两者可以互补使用：用 Superpowers 的 TDD 和头脑风暴做前期设计，用 Gstack 的 QA、审查和发布做后期保障。
:::

## 卸载

```
> ~/.claude/skills/gstack/bin/gstack-uninstall
```

选项：
- `--keep-state`：保留配置和分析数据
- `--force`：跳过确认提示

## 相关资源

- [Gstack GitHub](https://github.com/garrytan/gstack) — 项目仓库（106k+ Stars）
- [Gstack 文档](https://github.com/garrytan/gstack/tree/main/docs) — 详细的设计文档和使用指南
- [Gstack Changelog](https://github.com/garrytan/gstack/blob/main/CHANGELOG.md) — 版本更新日志

## 下一步

- [Superpowers 插件](/guide/advanced/superpowers) — 互补的结构化开发方法论
- [CC-Switch 配置管理](/guide/advanced/cc-switch) — 管理 API Provider 和 Skills
- [多智能体工作流](/guide/advanced/multi-agent) — 编排多个 Agent 协作
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/gstack.md
git commit -m "docs: add Gstack toolkit tutorial page"
```

---

### Task 2: 更新侧边栏导航

**Files:**
- Modify: `docs/guide/advanced/_meta.json`

- [ ] **Step 1: 添加 gstack 到侧边栏**

将 `_meta.json` 从：
```json
["hooks", "mcp-servers", "custom-skills", "cc-switch", "superpowers", "multi-agent", "automation"]
```
改为：
```json
["hooks", "mcp-servers", "custom-skills", "cc-switch", "superpowers", "gstack", "multi-agent", "automation"]
```

gstack 放在 superpowers 之后，因为它是更重的工具包，适合在了解 superpowers 之后再学习。

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/_meta.json
git commit -m "docs: add Gstack to advanced sidebar navigation"
```

---

### Task 3: 更新 superpowers.md 添加 Gstack 对比

**Files:**
- Modify: `docs/guide/advanced/superpowers.md`

- [ ] **Step 1: 在"与 CC-Switch 配合使用"部分之前添加 Gstack 对比**

在 `## 与 CC-Switch 配合使用` 之前插入：

```markdown
## 与 Gstack 的对比

Superpowers 和 [Gstack](/guide/advanced/gstack) 都是 Claude Code 的 Skill 插件，可以互补使用：

- **Superpowers** 聚焦**结构化方法论**——TDD、头脑风暴、计划驱动开发
- **Gstack** 聚焦**工程团队模拟**——QA、安全审计、浏览器测试、发布流程

推荐的组合方式：用 Superpowers 做前期设计和 TDD 实现，用 Gstack 的 `/review`、`/qa`、`/cso` 做后期保障。
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/superpowers.md
git commit -m "docs: add Gstack comparison to Superpowers page"
```

---

### Task 4: 更新首页描述

**Files:**
- Modify: `docs/index.md`

- [ ] **Step 1: 更新高级篇 features 描述**

将：
```yaml
    details: 探索 Hooks、MCP 服务器、自定义技能、CC-Switch 配置管理、Superpowers 工作流和多智能体协作
```

改为：
```yaml
    details: 探索 Hooks、MCP 服务器、自定义技能、CC-Switch 配置管理、Superpowers 和 Gstack 工作流
```

- [ ] **Step 2: Commit**

```bash
git add docs/index.md
git commit -m "docs: add Gstack to homepage features description"
```

---

### Task 5: 更新最佳实践添加 Gstack 工作流

**Files:**
- Modify: `docs/tips/best-practices.md`

- [ ] **Step 1: 在 Superpowers 小节之后添加 Gstack 小节**

在"结构化开发模式（Superpowers）"小节之后、"## 省钱技巧"之前添加：

```markdown
### 虚拟工程团队模式（Gstack）

安装 [Gstack](/guide/advanced/gstack) 后，你可以用 Slash 命令调用不同工程角色：

```
> /office-hours
> 我想做一个实时协作编辑器

> /plan-eng-review
> 帮我审查架构方案

> /review
> 审查当前分支的代码改动

> /qa https://staging.example.com
> 在浏览器中测试这个页面
```

Gstack 覆盖从产品思考到发布监控的全流程，适合需要完整工程保障的项目。
```

- [ ] **Step 2: Commit**

```bash
git add docs/tips/best-practices.md
git commit -m "docs: add Gstack workflow to best practices"
```

---

### Task 6: 构建验证

**Files:**
- None (verification only)

- [ ] **Step 1: 运行生产构建**

Run: `npm run build`
Expected: 所有页面构建成功，无报错。`doc_build/guide/advanced/gstack.html` 应出现在输出中。

- [ ] **Step 2: 检查生成的页面**

确认以下页面都正确生成：
- `doc_build/guide/advanced/gstack.html`
- `doc_build/guide/advanced/superpowers.html`（含新对比）
- `doc_build/index.html`（含更新描述）
- `doc_build/tips/best-practices.html`（含新小节）
