# Claude Code Tutorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Rspress template content with a comprehensive, progressive Claude Code tutorial site covering beginner to advanced usage.

**Architecture:** Restructure `docs/` into three tutorial sections (基础篇/进阶篇/高级篇), a standalone quick-start page, and an API/command reference. Each page is a self-contained lesson with frontmatter, practical examples, and clear next-step links. The homepage becomes a Claude Code branded landing page.

**Tech Stack:** Rspress v2, MDX, React 19, TypeScript

---

## File Structure

### New files to create

```
docs/
├── guide/
│   ├── _meta.json                          (replace — new sidebar structure)
│   ├── quick-start.md                      (new — 5-minute quick start)
│   ├── beginner/
│   │   ├── _meta.json                      (new — sidebar ordering)
│   │   ├── what-is-claude-code.md          (new — introduction)
│   │   ├── installation.md                 (new — setup & install)
│   │   ├── first-conversation.md           (new — basic usage)
│   │   ├── file-operations.md              (new — read/edit/create)
│   │   └── permissions.md                  (new — permission modes)
│   ├── intermediate/
│   │   ├── _meta.json                      (new — sidebar ordering)
│   │   ├── codebase-navigation.md          (new — search, grep, glob)
│   │   ├── slash-commands.md               (new — built-in commands)
│   │   ├── claude-md.md                    (new — project conventions)
│   │   ├── git-workflow.md                 (new — commits, PRs, branches)
│   │   └── context-management.md           (new — memory, compact, context)
│   └── advanced/
│       ├── _meta.json                      (new — sidebar ordering)
│       ├── hooks.md                        (new — lifecycle hooks)
│       ├── mcp-servers.md                  (new — MCP integration)
│       ├── custom-skills.md                (new — skills & agents)
│       ├── multi-agent.md                  (new — workflows & orchestration)
│       └── automation.md                   (new — CI/CD, headless mode)
├── commands/
│   ├── _meta.json                          (new — sidebar ordering)
│   ├── index.md                            (new — commands overview)
│   └── reference.md                        (new — all slash commands ref)
├── tips/
│   ├── _meta.json                          (new — sidebar ordering)
│   ├── index.md                            (new — tips overview)
│   └── best-practices.md                   (new — practical tips & patterns)
```

### Files to modify

```
docs/index.md                               (replace — Claude Code landing page)
docs/_nav.json                              (replace — new navigation)
docs/guide/start/_meta.json                 (delete — replaced by new structure)
docs/guide/start/introduction.md            (delete — replaced)
docs/guide/start/getting-started.md         (delete — replaced)
docs/guide/use-mdx/_meta.json               (delete — replaced)
docs/guide/use-mdx/components.mdx           (delete — replaced)
docs/guide/use-mdx/container.md             (delete — replaced)
docs/guide/use-mdx/code-blocks/             (delete — replaced)
docs/api/_meta.json                         (delete — replaced by commands/)
docs/api/index.mdx                          (delete — replaced)
docs/api/commands.mdx                       (delete — replaced)
```

---

## Task 1: Clean up template content and restructure navigation

**Files:**
- Modify: `docs/index.md`
- Modify: `docs/_nav.json`
- Modify: `docs/guide/_meta.json`
- Delete: `docs/guide/start/`, `docs/guide/use-mdx/`, `docs/api/`

- [ ] **Step 1: Update the homepage to Claude Code branding**

Replace `docs/index.md` with:

```markdown
---
pageType: home

hero:
  name: Claude Code 教程
  text: 从入门到精通
  tagline: 一份由浅入深的 Claude Code 使用指南，帮助你掌握 AI 编程助手的全部潜力
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/quick-start
    - theme: alt
      text: GitHub
      link: https://github.com/anthropics/claude-code
  image:
    src: /rspress-icon.png
    alt: Claude Code
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
    details: 探索 Hooks、MCP 服务器、自定义技能和多智能体工作流
    icon: ⚡
    link: /guide/advanced/hooks
  - title: 命令参考
    details: 完整的 Claude Code 命令速查手册
    icon: 📖
    link: /commands/
---
```

- [ ] **Step 2: Update navigation bar**

Replace `docs/_nav.json` with:

```json
[
  {
    "text": "教程",
    "link": "/guide/quick-start",
    "activeMatch": "/guide/"
  },
  {
    "text": "命令参考",
    "link": "/commands/",
    "activeMatch": "/commands/"
  },
  {
    "text": "技巧",
    "link": "/tips/",
    "activeMatch": "/tips/"
  },
  {
    "text": "Claude Code 文档",
    "link": "https://docs.anthropic.com/en/docs/claude-code"
  }
]
```

- [ ] **Step 3: Update guide sidebar**

Replace `docs/guide/_meta.json` with:

```json
[
  {
    "type": "dir-section-header",
    "name": "beginner",
    "label": "基础篇"
  },
  {
    "type": "dir-section-header",
    "name": "intermediate",
    "label": "进阶篇"
  },
  {
    "type": "dir-section-header",
    "name": "advanced",
    "label": "高级篇"
  }
]
```

- [ ] **Step 4: Delete old template directories**

```bash
rm -rf docs/guide/start docs/guide/use-mdx docs/api
```

- [ ] **Step 5: Create new directory structure**

```bash
mkdir -p docs/guide/beginner docs/guide/intermediate docs/guide/advanced docs/commands docs/tips
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: restructure docs for Claude Code tutorial

- Replace Rspress template content with Claude Code tutorial layout
- Update homepage with tutorial section links
- Reorganize navigation and sidebar structure
- Create beginner/intermediate/advanced tutorial directories"
```

---

## Task 2: Create quick-start page and beginner section meta files

**Files:**
- Create: `docs/guide/quick-start.md`
- Create: `docs/guide/beginner/_meta.json`

- [ ] **Step 1: Create the quick-start page**

Create `docs/guide/quick-start.md`:

```markdown
---
title: 快速开始
description: 5 分钟内安装并运行 Claude Code，体验 AI 编程助手的核心功能
---

# 快速开始

5 分钟内完成 Claude Code 的安装和首次使用。

## 安装

确保已安装 Node.js 18+，然后全局安装：

```bash
npm install -g @anthropic-ai/claude-code
```

## 首次运行

在任意项目目录下启动：

```bash
cd your-project
claude
```

Claude Code 会自动读取项目结构，你可以在终端中直接与其对话。

## 试试这些操作

### 1. 了解项目

```
> 这个项目是做什么的？帮我总结一下代码结构
```

### 2. 修改代码

```
> 在 src/utils.ts 中添加一个 formatDate 函数，将 Date 对象格式化为 YYYY-MM-DD 字符串
```

### 3. 运行命令

```
> 运行项目的测试，如果有失败的帮我修复
```

### 4. Git 操作

```
> 把今天的改动提交一下，用英文写 commit message
```

## 下一步

- [什么是 Claude Code](/guide/beginner/what-is-claude-code) — 了解 Claude Code 的能力和设计理念
- [安装与配置](/guide/beginner/installation) — 详细的安装步骤和环境配置
- [第一次对话](/guide/beginner/first-conversation) — 学习如何高效地与 Claude Code 交互
```

- [ ] **Step 2: Create beginner section meta**

Create `docs/guide/beginner/_meta.json`:

```json
["what-is-claude-code", "installation", "first-conversation", "file-operations", "permissions"]
```

- [ ] **Step 3: Commit**

```bash
git add docs/guide/quick-start.md docs/guide/beginner/_meta.json
git commit -m "docs: add quick-start page and beginner section structure"
```

---

## Task 3: Write beginner tutorial — What is Claude Code

**Files:**
- Create: `docs/guide/beginner/what-is-claude-code.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/beginner/what-is-claude-code.md`:

```markdown
---
title: 什么是 Claude Code
description: 了解 Claude Code 的核心概念、设计理念和适用场景
---

# 什么是 Claude Code

Claude Code 是 Anthropic 推出的命令行 AI 编程助手。它直接运行在你的终端中，能够理解你的整个代码库，并通过自然语言对话帮你完成编程任务。

## 核心能力

### 代码理解

Claude Code 不是简单的代码补全工具。它会主动阅读你的项目文件、理解代码结构和依赖关系，然后基于完整的上下文给出回答。

```
> 帮我解释一下 src/core/engine.ts 中的执行流程
```

### 代码编辑

你可以用自然语言描述想要的修改，Claude Code 会直接编辑文件。它遵循你项目中已有的代码风格和约定。

```
> 在 UserService 中添加一个 resetPassword 方法，发送重置邮件并更新数据库
```

### 命令执行

Claude Code 可以运行终端命令，包括测试、构建、Git 操作等。它会根据命令输出做出判断和后续操作。

```
> 跑一下测试，如果有失败的就修复它们
```

### Git 集成

从创建分支、提交代码到创建 PR，Claude Code 可以帮你完成整个 Git 工作流。

```
> 从 main 创建一个 feature/user-auth 分支，实现 JWT 认证，然后提交 PR
```

## 与其他工具的区别

| 特性 | Claude Code | IDE 插件 | ChatGPT/Claude 网页版 |
|------|-------------|----------|----------------------|
| 代码库感知 | ✅ 完整项目上下文 | ✅ 当前文件上下文 | ❌ 需手动粘贴 |
| 文件编辑 | ✅ 直接修改 | ✅ 内联编辑 | ❌ 需手动复制 |
| 命令执行 | ✅ 终端命令 | ❌ 有限 | ❌ 不支持 |
| Git 集成 | ✅ 完整工作流 | ❌ 有限 | ❌ 不支持 |
| 自动化 | ✅ Hooks + CI | ❌ 不支持 | ❌ 不支持 |

## 适用场景

- **日常开发**：写代码、改 bug、重构、添加测试
- **代码审查**：理解陌生代码、发现潜在问题
- **项目维护**：更新依赖、修复安全漏洞、优化性能
- **学习探索**：理解新框架、阅读开源项目
- **自动化**：CI/CD 集成、批量处理、定期任务

## 下一步

- [安装与配置](/guide/beginner/installation) — 安装 Claude Code 并配置环境
- [第一次对话](/guide/beginner/first-conversation) — 学习基本的对话技巧
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/beginner/what-is-claude-code.md
git commit -m "docs: add 'What is Claude Code' beginner tutorial"
```

---

## Task 4: Write beginner tutorial — Installation

**Files:**
- Create: `docs/guide/beginner/installation.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/beginner/installation.md`:

```markdown
---
title: 安装与配置
description: Claude Code 的安装步骤、系统要求和初始配置
---

# 安装与配置

## 系统要求

- **Node.js** 18 或更高版本
- **操作系统**：macOS、Linux 或 Windows (WSL)
- **终端**：任意终端模拟器（推荐 iTerm2、Windows Terminal）

## 安装

```bash
npm install -g @anthropic-ai/claude-code
```

验证安装：

```bash
claude --version
```

## 认证

首次运行时，Claude Code 会引导你完成认证。支持两种方式：

### 方式一：Anthropic API Key

从 [Anthropic Console](https://console.anthropic.com/) 获取 API Key，然后设置环境变量：

```bash
export ANTHROPIC_API_KEY=your-api-key
```

:::tip
将环境变量添加到 `~/.bashrc` 或 `~/.zshrc` 中，避免每次启动都要设置。
:::

### 方式二：Claude Pro/Max 订阅

如果你有 Claude Pro 或 Max 订阅，可以直接登录使用，无需 API Key：

```bash
claude
# 首次运行时会提示登录
```

## 基本配置

Claude Code 的配置文件位于 `~/.claude/settings.json`：

```json
{
  "model": "claude-sonnet-4-20250514",
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git *)"
    ]
  }
}
```

### 常用配置项

| 配置项 | 说明 | 默认值 |
|--------|------|--------|
| `model` | 使用的模型 | `claude-sonnet-4-20250514` |
| `permissions.allow` | 自动允许的工具列表 | `[]` |

## 项目级配置

在项目根目录创建 `CLAUDE.md` 文件，为 Claude Code 提供项目上下文：

```markdown
# CLAUDE.md

本项目使用 TypeScript + React 构建。

## 常用命令
- `npm run dev` — 启动开发服务器
- `npm run build` — 构建生产版本
- `npm test` — 运行测试
```

:::info
`CLAUDE.md` 的内容会在每次对话开始时自动加载，相当于给 Claude Code 一份项目说明书。
:::

## 下一步

- [第一次对话](/guide/beginner/first-conversation) — 学习与 Claude Code 对话的基本技巧
- [CLAUDE.md 与项目约定](/guide/intermediate/claude-md) — 深入了解项目配置
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/beginner/installation.md
git commit -m "docs: add installation and setup beginner tutorial"
```

---

## Task 5: Write beginner tutorial — First Conversation

**Files:**
- Create: `docs/guide/beginner/first-conversation.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/beginner/first-conversation.md`:

```markdown
---
title: 第一次对话
description: 学习与 Claude Code 交互的基本方式和高效对话技巧
---

# 第一次对话

启动 Claude Code 后，你会看到一个交互式终端界面。输入自然语言即可开始对话。

## 基本交互

### 提问

最简单的方式是直接提问：

```
> 这个项目用了什么框架？主要的依赖有哪些？
```

Claude Code 会自动读取 `package.json`、配置文件等来回答。

### 发出指令

告诉 Claude Code 你想做什么：

```
> 在 src/utils/ 目录下创建一个 validators.ts 文件，包含邮箱和手机号的验证函数
```

Claude Code 会创建文件、编写代码，然后等待你的确认。

### 多轮对话

你可以基于上一次的结果继续追问：

```
> 帮我给这两个验证函数加上单元测试
```

## 高效对话技巧

### 1. 提供足够上下文

❌ 模糊的指令：
```
> 修复这个 bug
```

✅ 清晰的指令：
```
> 用户登录后 token 没有保存到 localStorage，导致刷新页面后需要重新登录。
> 帮我检查 src/auth/login.ts 中的登录逻辑并修复。
```

### 2. 指定文件或目录

```
> 打开 src/components/Header.tsx，把导航栏的颜色改成深蓝色
```

```
> 检查 src/api/ 目录下所有文件的错误处理，确保都有 try-catch
```

### 3. 分步完成复杂任务

```
> 第一步：帮我分析一下 src/database/ 下的表结构
> 第二步：给 users 表添加一个 last_login_at 字段
> 第三步：更新相关的查询代码
```

### 4. 利用 @ 引用文件

```
> @src/config.ts 中的 API_BASE_URL 在生产环境应该用什么值？
```

## 对话管理

| 命令 | 作用 |
|------|------|
| `/clear` | 清空当前对话历史 |
| `/compact` | 压缩对话上下文，节省 token |
| `/help` | 查看所有可用命令 |

:::tip
当对话变长时，使用 `/compact` 可以压缩上下文，让 Claude Code 保持高效响应。
:::

## 下一步

- [文件操作](/guide/beginner/file-operations) — 深入了解文件读写能力
- [权限管理](/guide/beginner/permissions) — 了解 Claude Code 的权限机制
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/beginner/first-conversation.md
git commit -m "docs: add first conversation beginner tutorial"
```

---

## Task 6: Write beginner tutorial — File Operations

**Files:**
- Create: `docs/guide/beginner/file-operations.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/beginner/file-operations.md`:

```markdown
---
title: 文件操作
description: Claude Code 如何读取、创建、编辑和删除文件
---

# 文件操作

Claude Code 的核心能力之一是直接操作你的项目文件。

## 读取文件

Claude Code 会根据需要自动读取文件。你也可以主动要求：

```
> 读一下 src/config.ts 的内容，帮我解释每个配置项的作用
```

它使用的工具包括：
- **Read** — 读取单个文件内容
- **Glob** — 按模式匹配查找文件（如 `**/*.ts`）
- **Grep** — 搜索文件内容（支持正则表达式）
- **LS** — 列出目录内容

## 创建文件

描述你想要的文件内容，Claude Code 会创建它：

```
> 创建 src/hooks/useDebounce.ts，实现一个防抖 hook，延迟默认 300ms
```

Claude Code 会：
1. 检查目录结构，确认路径合理
2. 编写代码，遵循项目已有的风格
3. 显示文件内容供你确认

## 编辑文件

指定文件和修改内容：

```
> 在 src/routes.ts 中添加一个 /users/:id 的路由，指向 UserController.getById
```

Claude Code 使用精确的字符串匹配进行编辑，确保只修改需要改的部分。

### 批量修改

```
> 把 src/components/ 下所有 .tsx 文件中的 `className="old-style"` 替换为 `className="new-style"`
```

## 删除操作

出于安全考虑，Claude Code 默认不会删除文件。如果需要删除：

```
> 请删除 src/deprecated/ 目录下的所有文件
```

它会先列出要删除的文件，等你确认后再执行。

## 安全机制

- **只读默认**：Claude Code 先理解再修改，不会盲目改文件
- **变更预览**：修改前会显示具体要改什么
- **权限控制**：某些操作需要你明确授权（见 [权限管理](/guide/beginner/permissions)）

:::warning
Claude Code 不会自动备份文件。建议在进行大规模修改前先提交当前代码到 Git。
:::

## 下一步

- [权限管理](/guide/beginner/permissions) — 了解权限模式和安全机制
- [代码库导航](/guide/intermediate/codebase-navigation) — 学习如何高效搜索和理解代码
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/beginner/file-operations.md
git commit -m "docs: add file operations beginner tutorial"
```

---

## Task 7: Write beginner tutorial — Permissions

**Files:**
- Create: `docs/guide/beginner/permissions.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/beginner/permissions.md`:

```markdown
---
title: 权限管理
description: 了解 Claude Code 的权限模式和安全机制
---

# 权限管理

Claude Code 使用权限系统来控制它能做什么。这确保了安全性，同时不会影响工作效率。

## 权限模式

### 默认模式

默认情况下，Claude Code 在执行以下操作前会请求你的许可：

- 运行终端命令（如 `npm install`、`git push`）
- 修改项目文件
- 访问网络

你会看到类似这样的提示：

```
Claude wants to run: npm install lodash
Allow? (y/n)
```

### 允许列表

在 `~/.claude/settings.json` 中预配置自动允许的操作：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(npm test *)",
      "Bash(git status *)",
      "Bash(git diff *)",
      "Bash(git log *)"
    ]
  }
}
```

:::tip
建议把日常高频使用的安全命令加入允许列表，比如运行测试、查看 Git 状态等。
:::

### 项目级配置

在项目根目录的 `.claude/settings.json` 中配置项目特定的权限：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run dev)",
      "Bash(npm run build)",
      "Bash(npm test *)"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(git push --force *)"
    ]
  }
}
```

## 权限工具类型

| 工具 | 说明 | 风险等级 |
|------|------|----------|
| `Read` | 读取文件 | 低 — 默认允许 |
| `Glob` | 文件搜索 | 低 — 默认允许 |
| `Grep` | 内容搜索 | 低 — 默认允许 |
| `Edit` | 编辑文件 | 中 — 需要确认 |
| `Write` | 创建/覆盖文件 | 中 — 需要确认 |
| `Bash` | 执行命令 | 高 — 需要确认 |
| `WebFetch` | 访问网络 | 中 — 需要确认 |

## 安全建议

1. **不要允许危险命令**：`rm -rf`、`git push --force`、`sudo` 等应始终需要手动确认
2. **使用 Git 作为安全网**：频繁提交，这样即使出错也可以回滚
3. **审查重要操作**：对于数据库迁移、部署等不可逆操作，仔细检查后再确认

## 下一步

- [Slash 命令](/guide/intermediate/slash-commands) — 学习内置命令提升效率
- [CLAUDE.md 与项目约定](/guide/intermediate/claude-md) — 配置项目级的 Claude Code 行为
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/beginner/permissions.md
git commit -m "docs: add permissions beginner tutorial"
```

---

## Task 8: Create intermediate section meta and write Codebase Navigation

**Files:**
- Create: `docs/guide/intermediate/_meta.json`
- Create: `docs/guide/intermediate/codebase-navigation.md`

- [ ] **Step 1: Create intermediate meta**

Create `docs/guide/intermediate/_meta.json`:

```json
["codebase-navigation", "slash-commands", "claude-md", "git-workflow", "context-management"]
```

- [ ] **Step 2: Create codebase navigation page**

Create `docs/guide/intermediate/codebase-navigation.md`:

```markdown
---
title: 代码库导航
description: 使用 Claude Code 高效搜索、理解和探索大型代码库
---

# 代码库导航

面对陌生的代码库，Claude Code 可以帮你快速建立全局理解。

## 理解项目结构

```
> 帮我梳理一下这个项目的目录结构，每个主要目录的作用是什么？
```

Claude Code 会扫描目录树，读取关键文件（`package.json`、`tsconfig.json` 等），给出结构化的总结。

## 搜索代码

### 按文件名搜索

```
> 找到所有和用户认证相关的文件
```

Claude Code 使用 Glob 工具按模式匹配文件。

### 按内容搜索

```
> 搜索项目中所有使用了 `useEffect` 的地方
```

Claude Code 使用 Grep 工具进行内容搜索，支持正则表达式。

### 组合搜索

```
> 在 src/ 目录下找到所有导入了 lodash 但只用了一两个方法的文件，考虑换成原生实现
```

## 追踪代码流

### 理解调用链

```
> 用户点击登录按钮后，代码的执行流程是怎样的？从前端组件到后端 API 完整追踪一下
```

### 查找定义和引用

```
> `UserService.createUser` 这个方法在哪里定义的？哪些地方调用了它？
```

## 分析代码质量

```
> 检查 src/api/ 目录下的错误处理，看看有没有遗漏的 try-catch 或未处理的 Promise rejection
```

``>
> 这个项目有哪些 TODO 和 FIXME 注释？帮我整理一下
```

## 实用技巧

### 用 LSP 增强理解

Claude Code 内置 LSP 支持，可以：
- 跳转到定义（goToDefinition）
- 查找所有引用（findReferences）
- 查看类型信息（hover）
- 查看调用层级（prepareCallHierarchy）

```
> 用 LSP 查一下 `handleLogin` 函数的所有调用者
```

### 渐进式探索

面对大型代码库，建议从宏观到微观：

1. **先看结构** — 项目有哪些模块？
2. **再看入口** — 程序从哪里开始执行？
3. **后看核心** — 关键业务逻辑在哪里？
4. **最后看细节** — 具体实现是怎样的？

```
> 先帮我看看这个项目的整体架构，然后重点分析一下核心的业务逻辑模块
```

## 下一步

- [Slash 命令](/guide/intermediate/slash-commands) — 使用内置命令提升效率
- [Git 工作流](/guide/intermediate/git-workflow) — 用 Claude Code 管理 Git 操作
```

- [ ] **Step 3: Commit**

```bash
git add docs/guide/intermediate/_meta.json docs/guide/intermediate/codebase-navigation.md
git commit -m "docs: add intermediate section and codebase navigation tutorial"
```

---

## Task 9: Write intermediate tutorial — Slash Commands

**Files:**
- Create: `docs/guide/intermediate/slash-commands.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/intermediate/slash-commands.md`:

```markdown
---
title: Slash 命令
description: Claude Code 内置的 Slash 命令速查和使用技巧
---

# Slash 命令

在对话中输入 `/` 开头的命令可以快速执行操作。

## 对话管理

| 命令 | 说明 |
|------|------|
| `/clear` | 清空当前对话历史，重新开始 |
| `/compact` | 压缩对话上下文，保留关键信息，减少 token 消耗 |
| `/cost` | 查看当前会话的 token 使用量和费用 |
| `/help` | 查看所有可用命令 |

## 模型切换

| 命令 | 说明 |
|------|------|
| `/model` | 查看当前使用的模型 |
| `/model <name>` | 切换模型，如 `/model claude-opus-4-8` |

:::tip
日常开发用 Sonnet 即可，遇到复杂问题或需要更强推理能力时切换到 Opus。
:::

## 配置管理

| 命令 | 说明 |
|------|------|
| `/config` | 查看和修改配置 |
| `/permissions` | 查看当前权限设置 |

## 工作模式

| 命令 | 说明 |
|------|------|
| `/plan` | 进入计划模式，Claude 只分析不修改，适合规划复杂任务 |
| `/fast` | 切换快速模式，使用更快的模型输出 |

## 实用场景

### 对话过长时

```
> /compact
```

压缩上下文后继续对话，Claude Code 会保留关键信息。

### 切换到规划模式

```
> /plan
> 帮我规划一下如何把这个单体应用拆分成微服务架构
```

规划模式下 Claude 只会分析和建议，不会修改任何文件。

### 查看费用

```
> /cost
```

显示当前会话的 token 用量，帮助你控制成本。

## 下一步

- [CLAUDE.md 与项目约定](/guide/intermediate/claude-md) — 用项目配置提升 Claude Code 效果
- [上下文管理](/guide/intermediate/context-management) — 管理对话上下文和记忆
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/intermediate/slash-commands.md
git commit -m "docs: add slash commands intermediate tutorial"
```

---

## Task 10: Write intermediate tutorial — CLAUDE.md

**Files:**
- Create: `docs/guide/intermediate/claude-md.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/intermediate/claude-md.md`:

```markdown
---
title: CLAUDE.md 与项目约定
description: 使用 CLAUDE.md 文件为 Claude Code 提供项目上下文和行为约束
---

# CLAUDE.md 与项目约定

`CLAUDE.md` 是 Claude Code 的项目说明书。它在每次对话开始时自动加载，让 Claude Code 了解你的项目约定、常用命令和开发规范。

## 基本结构

在项目根目录创建 `CLAUDE.md`：

```markdown
# CLAUDE.md

## 项目概述
这是一个基于 Next.js 的电商平台，使用 PostgreSQL 数据库。

## 常用命令
- `npm run dev` — 启动开发服务器
- `npm run build` — 构建生产版本
- `npm test` — 运行所有测试
- `npm run test:watch` — 监听模式运行测试
- `npm run lint` — 检查代码规范

## 代码规范
- 使用 TypeScript strict 模式
- 组件使用函数式写法，不用 class
- 样式使用 Tailwind CSS，不写自定义 CSS
- API 路由放在 app/api/ 目录下

## 项目结构
- `src/app/` — Next.js App Router 页面
- `src/components/` — 可复用组件
- `src/lib/` — 工具函数和配置
- `src/hooks/` — 自定义 React hooks
- `prisma/` — 数据库 schema 和迁移
```

## 写好 CLAUDE.md 的原则

### 1. 写非显而易见的事

❌ 不需要写：
```
## 代码规范
- 写清晰的代码
- 添加适当的注释
- 处理错误情况
```

✅ 应该写：
```
## 代码规范
- 错误统一用 AppError 类抛出，不用原生 Error
- API 响应格式统一为 { code, data, message }
- 数据库查询必须用 Prisma，不用原生 SQL
```

### 2. 写常用命令

把团队日常使用的命令都列出来，Claude Code 会直接执行：

```markdown
## 常用命令
- `pnpm dev` — 启动开发（注意用 pnpm 不是 npm）
- `pnpm test -- --watch` — 监听测试
- `pnpm db:migrate` — 运行数据库迁移
- `pnpm db:seed` — 填充测试数据
```

### 3. 写项目特定的约定

```markdown
## 约定
- 路由文件命名用 kebab-case（如 user-profile.ts）
- 组件文件命名用 PascalCase（如 UserProfile.tsx）
- 数据库表名用 snake_case（如 user_profiles）
- API 路径用 kebab-case（如 /api/user-profiles）
```

## 多级 CLAUDE.md

Claude Code 支持多级配置，按优先级加载：

1. `~/.claude/CLAUDE.md` — 全局配置，适用于所有项目
2. `项目根目录/CLAUDE.md` — 项目级配置
3. `子目录/CLAUDE.md` — 目录级配置，只在该目录下的文件生效

:::tip
全局配置放通用偏好（如代码风格偏好），项目配置放项目特定信息（如技术栈、命令）。
:::

## 示例：完整的 CLAUDE.md

```markdown
# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供项目上下文。

## 项目概述
基于 Next.js 14 的 SaaS 应用，多租户架构。

## 技术栈
- Next.js 14 (App Router)
- TypeScript (strict)
- Prisma + PostgreSQL
- Tailwind CSS
- NextAuth.js

## 常用命令
- `pnpm dev` — 开发服务器
- `pnpm build` — 生产构建（会运行类型检查）
- `pnpm test` — 运行测试
- `pnpm test src/path/to/file.test.ts` — 运行单个测试文件
- `pnpm lint` — ESLint 检查
- `pnpm db:push` — 同步 schema 到数据库
- `pnpm db:studio` — 打开 Prisma Studio

## 架构说明
- 所有页面组件在 app/ 目录下，使用 Server Components 优先
- 客户端组件用 'use client' 标记
- API 路由在 app/api/ 下，统一用 Route Handlers
- 数据库操作通过 Prisma Client，放在 lib/db.ts

## 代码规范
- 禁止使用 any 类型
- 组件 props 必须定义 interface
- 错误处理用 try-catch，不用 .catch()
- 样式用 Tailwind，不写自定义 CSS
- 提交信息用英文，格式：type(scope): description
```

## 下一步

- [Git 工作流](/guide/intermediate/git-workflow) — 用 Claude Code 管理 Git 操作
- [上下文管理](/guide/intermediate/context-management) — 管理对话上下文和记忆
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/intermediate/claude-md.md
git commit -m "docs: add CLAUDE.md project conventions tutorial"
```

---

## Task 11: Write intermediate tutorial — Git Workflow

**Files:**
- Create: `docs/guide/intermediate/git-workflow.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/intermediate/git-workflow.md`:

```markdown
---
title: Git 工作流
description: 使用 Claude Code 高效管理 Git 操作，从提交到 PR 全流程
---

# Git 工作流

Claude Code 可以帮你完成日常的 Git 操作，从查看状态到创建 PR。

## 查看状态

```
> 帮我看看当前有哪些改动？用 git diff 展示一下具体改了什么
```

Claude Code 会运行 `git status` 和 `git diff`，然后用人类可读的方式总结改动。

## 提交代码

### 普通提交

```
> 把今天的改动提交一下
```

Claude Code 会：
1. 查看所有改动
2. 分析改动内容
3. 生成合适的 commit message
4. 执行 `git add` 和 `git commit`

### 指定提交信息

```
> 提交这些改动，commit message 用英文，格式遵循 Conventional Commits
```

### 部分提交

```
> 只提交 src/auth/ 目录下的改动，其他先不提交
```

## 分支操作

### 创建分支

```
> 从 main 创建一个 feature/user-profile 分支
```

### 切换分支

```
> 切换到 develop 分支
```

### 合并分支

```
> 把 feature/user-profile 合并到 main
```

## 创建 Pull Request

```
> 帮我创建一个 PR，目标分支是 main，标题和描述用英文
```

Claude Code 会：
1. 推送当前分支到远程
2. 用 `gh` CLI 创建 PR
3. 自动生成 PR 描述，包括改动摘要

### 审查 PR

```
> 帮我审查一下这个 PR 的代码改动，看看有没有问题
```

## 解决冲突

```
> 合并 main 分支时有冲突，帮我解决一下
```

Claude Code 会：
1. 识别冲突文件
2. 分析两边的改动
3. 给出合理的合并方案
4. 解决冲突后继续合并

:::warning
对于复杂的冲突，建议仔细检查 Claude Code 的解决方案再确认。
:::

## 实用技巧

### 写好的 Commit Message

```
> 提交改动，commit message 遵循以下规范：
> - 用英文
> - 格式：type(scope): description
> - type 用 feat/fix/refactor/docs/chore
```

### 查看历史

```
> 最近一周有哪些提交？帮我总结一下团队的开发进展
```

### 撤销操作

```
> 撤销上一次提交，但保留改动在工作区
```

## 下一步

- [上下文管理](/guide/intermediate/context-management) — 管理对话上下文和记忆
- [Hooks](/guide/advanced/hooks) — 用 Git Hooks 自动化工作流
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/intermediate/git-workflow.md
git commit -m "docs: add Git workflow intermediate tutorial"
```

---

## Task 12: Write intermediate tutorial — Context Management

**Files:**
- Create: `docs/guide/intermediate/context-management.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/intermediate/context-management.md`:

```markdown
---
title: 上下文管理
description: 管理 Claude Code 的对话上下文、记忆和 token 消耗
---

# 上下文管理

理解 Claude Code 的上下文机制，可以让你的对话更高效、更省钱。

## 上下文窗口

Claude Code 的上下文窗口有限。当对话变长时，早期的内容会被压缩或丢弃。

### 影响上下文的因素

- 对话轮次越多，上下文占用越大
- 读取的文件内容会占用上下文
- 工具调用的输出也会占用上下文

## 压缩上下文

当对话变长时，使用 `/compact` 命令：

```
> /compact
```

这会压缩对话历史，保留关键信息，释放上下文空间。

:::tip
每 10-15 轮对话后执行一次 `/compact`，可以保持 Claude Code 的响应质量。
:::

## 记忆系统

Claude Code 有持久化的记忆系统，存储在 `~/.claude/projects/<project>/memory/` 目录下。

### 保存记忆

```
> 记住：这个项目的数据库迁移命令是 pnpm db:migrate，不是 prisma migrate
```

Claude Code 会将这条信息保存为记忆文件，下次对话时自动加载。

### 记忆类型

| 类型 | 说明 |
|------|------|
| `user` | 用户偏好和个人信息 |
| `feedback` | 对 Claude Code 行为的反馈 |
| `project` | 项目特定的信息和约束 |
| `reference` | 外部资源链接 |

### 管理记忆

```
> 列出你目前记住的所有信息
```

```
> 删除关于 xxx 的记忆
```

## 省钱技巧

### 1. 及时压缩

```
> /compact
```

### 2. 用 /clear 重新开始

当切换到不相关的任务时：

```
> /clear
```

### 3. 精确指定范围

❌ 消耗大量上下文：
```
> 读一下整个项目，然后帮我优化性能
```

✅ 精确高效：
```
> 读一下 src/api/users.ts，帮我优化这个文件中的数据库查询
```

### 4. 使用 /cost 监控

```
> /cost
```

定期检查 token 用量，避免意外消耗。

## 下一步

- [Hooks](/guide/advanced/hooks) — 用生命周期钩子自动化操作
- [MCP 服务器](/guide/advanced/mcp-servers) — 扩展 Claude Code 的能力
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/intermediate/context-management.md
git commit -m "docs: add context management intermediate tutorial"
```

---

## Task 13: Create advanced section meta and write Hooks tutorial

**Files:**
- Create: `docs/guide/advanced/_meta.json`
- Create: `docs/guide/advanced/hooks.md`

- [ ] **Step 1: Create advanced meta**

Create `docs/guide/advanced/_meta.json`:

```json
["hooks", "mcp-servers", "custom-skills", "multi-agent", "automation"]
```

- [ ] **Step 2: Create hooks page**

Create `docs/guide/advanced/hooks.md`:

```markdown
---
title: Hooks
description: 使用生命周期 Hooks 在 Claude Code 操作前后自动执行脚本
---

# Hooks

Hooks 允许你在 Claude Code 执行特定操作的前后自动运行脚本。这可以用来强制执行代码规范、自动格式化、发送通知等。

## 工作原理

Claude Code 有以下 Hook 事件：

| 事件 | 触发时机 |
|------|----------|
| `PreToolUse` | 工具调用之前 |
| `PostToolUse` | 工具调用之后 |
| `Notification` | Claude Code 发送通知时 |
| `Stop` | 对话结束时 |

## 配置 Hooks

在 `.claude/settings.json` 中配置：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'About to run a bash command'"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATH"
          }
        ]
      }
    ]
  }
}
```

## 实用示例

### 自动格式化代码

每次 Claude Code 编辑文件后自动运行 Prettier：

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $CLAUDE_FILE_PATH"
          }
        ]
      }
    ]
  }
}
```

### 运行测试前检查

在运行测试命令前自动检查语法：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo '$CLAUDE_COMMAND' | grep -q 'npm test'; then npx tsc --noEmit; fi"
          }
        ]
      }
    ]
  }
}
```

### Git 提交前 lint

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "if echo '$CLAUDE_COMMAND' | grep -q 'git commit'; then npm run lint; fi"
          }
        ]
      }
    ]
  }
}
```

## Hook 环境变量

Hook 脚本可以访问以下环境变量：

| 变量 | 说明 |
|------|------|
| `CLAUDE_FILE_PATH` | 当前操作的文件路径 |
| `CLAUDE_COMMAND` | 当前执行的命令 |

## 注意事项

- Hook 脚本应该是快速的，避免阻塞 Claude Code
- Hook 失败不会阻止 Claude Code 继续执行（除非配置了阻止）
- 建议只在必要时使用 Hook，过多的 Hook 会降低响应速度

## 下一步

- [MCP 服务器](/guide/advanced/mcp-servers) — 用 MCP 扩展 Claude Code 的工具能力
- [自定义技能](/guide/advanced/custom-skills) — 创建自定义的 Skills 和 Agents
```

- [ ] **Step 3: Commit**

```bash
git add docs/guide/advanced/_meta.json docs/guide/advanced/hooks.md
git commit -m "docs: add advanced section and hooks tutorial"
```

---

## Task 14: Write advanced tutorial — MCP Servers

**Files:**
- Create: `docs/guide/advanced/mcp-servers.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/advanced/mcp-servers.md`:

```markdown
---
title: MCP 服务器
description: 使用 Model Context Protocol 扩展 Claude Code 的工具能力
---

# MCP 服务器

MCP (Model Context Protocol) 是一个开放协议，让 Claude Code 可以连接外部工具和数据源。

## 什么是 MCP

MCP 服务器为 Claude Code 提供额外的工具能力。通过 MCP，你可以：

- 连接数据库，直接查询数据
- 调用第三方 API（GitHub、Jira、Slack 等）
- 访问特定的开发工具（浏览器自动化、文件系统等）

## 配置 MCP 服务器

在 `.claude/settings.json` 的 `mcpServers` 字段中配置：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    }
  }
}
```

## 常用 MCP 服务器

### GitHub

提供 GitHub API 访问能力：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_ACCESS_TOKEN": "ghp_xxxx"
      }
    }
  }
}
```

使用示例：
```
> 帮我看看 repo 有哪些 open 的 issue
```

### 文件系统

提供增强的文件系统访问：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed/dir"]
    }
  }
}
```

### 浏览器自动化

使用 Puppeteer 进行浏览器操作：

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

使用示例：
```
> 打开 localhost:3000，截个图给我看看当前页面的样子
```

## 自建 MCP 服务器

你可以用 TypeScript 或 Python 编写自己的 MCP 服务器：

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new McpServer({ name: "my-server", version: "1.0.0" });

server.tool("get_weather", { city: z.string() }, async ({ city }) => ({
  content: [{ type: "text", text: `${city}今天晴天，25°C` }],
}));

const transport = new StdioServerTransport();
await server.connect(transport);
```

## 注意事项

- MCP 服务器需要单独的进程，会消耗额外的系统资源
- 敏感信息（如 API Token）应通过环境变量传入，不要硬编码
- 建议只启用需要的 MCP 服务器，过多会降低响应速度

## 下一步

- [自定义技能](/guide/advanced/custom-skills) — 创建自定义的 Skills 和 Agents
- [多智能体工作流](/guide/advanced/multi-agent) — 编排多个 Agent 协作
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/mcp-servers.md
git commit -m "docs: add MCP servers advanced tutorial"
```

---

## Task 15: Write advanced tutorial — Custom Skills

**Files:**
- Create: `docs/guide/advanced/custom-skills.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/advanced/custom-skills.md`:

```markdown
---
title: 自定义技能
description: 创建和使用自定义 Skills 扩展 Claude Code 的能力
---

# 自定义技能

Skills 是 Claude Code 的扩展机制，让你可以封装常用的工作流程。

## 什么是 Skill

Skill 是一个 Markdown 文件，定义了 Claude Code 在特定场景下应该遵循的指令。它可以：

- 封装复杂的工作流程
- 提供领域特定的知识
- 标准化团队的最佳实践

## 使用内置 Skills

Claude Code 有一些内置的 Skills，通过斜杠命令调用：

```
> /superpowers:brainstorming
> /superpowers:writing-plans
> /superpowers:test-driven-development
```

## 创建自定义 Skill

### 文件结构

在 `.agents/skills/` 目录下创建 Skill 文件：

```
.agents/
└── skills/
    └── my-skill/
        └── SKILL.md
```

### Skill 文件格式

```markdown
---
name: my-skill
description: 一行描述这个 Skill 的用途
---

# Skill 标题

详细的指令内容...

## 步骤

1. 第一步做什么
2. 第二步做什么
3. ...
```

### 示例：代码审查 Skill

```markdown
---
name: code-review
description: 按照团队规范审查代码改动
---

# 代码审查

按照以下维度审查代码改动：

## 审查清单

### 1. 代码质量
- [ ] 命名是否清晰
- [ ] 是否有重复代码
- [ ] 函数是否过长（超过 50 行考虑拆分）

### 2. 安全性
- [ ] 是否有硬编码的密钥或密码
- [ ] SQL 查询是否使用参数化
- [ ] 用户输入是否做了验证

### 3. 性能
- [ ] 是否有不必要的循环
- [ ] 数据库查询是否合理（避免 N+1）
- [ ] 大数据量场景是否考虑分页

### 4. 测试
- [ ] 新功能是否有测试
- [ ] 边界条件是否覆盖
- [ ] 错误场景是否测试

## 输出格式

按严重程度分类列出问题：
- 🔴 严重：必须修复
- 🟡 建议：建议改进
- 🟢 优秀：值得表扬的做法
```

## Skill 最佳实践

1. **单一职责**：一个 Skill 做一件事
2. **明确指令**：步骤要具体，避免模糊描述
3. **提供示例**：给出输入输出的例子
4. **保持更新**：随着项目演进更新 Skill 内容

## 使用 Skill

在对话中通过斜杠命令调用：

```
> /code-review
> 帮我审查一下最近的改动
```

或者让 Claude Code 自动选择：

```
> 帮我按照团队规范审查这段代码
```

Claude Code 会根据描述自动匹配合适的 Skill。

## 下一步

- [多智能体工作流](/guide/advanced/multi-agent) — 编排多个 Agent 协作完成复杂任务
- [自动化与 CI/CD](/guide/advanced/automation) — 在自动化流程中使用 Claude Code
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/custom-skills.md
git commit -m "docs: add custom skills advanced tutorial"
```

---

## Task 16: Write advanced tutorial — Multi-Agent

**Files:**
- Create: `docs/guide/advanced/multi-agent.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/advanced/multi-agent.md`:

```markdown
---
title: 多智能体工作流
description: 编排多个 Claude Code Agent 协作完成复杂任务
---

# 多智能体工作流

对于复杂的任务，Claude Code 可以启动多个 Agent 并行或串行工作。

## 什么是多智能体

多智能体是指 Claude Code 启动多个独立的 Agent 实例，每个 Agent 负责不同的子任务。它们可以：

- **并行执行**：同时处理多个独立的任务
- **流水线执行**：前一个 Agent 的输出作为下一个的输入
- **分工协作**：不同 Agent 专注于不同的维度

## 使用场景

### 并行代码审查

多个 Agent 从不同维度同时审查代码：

```
> 用 3 个 Agent 分别从性能、安全性和可维护性三个维度审查 src/api/ 目录的代码
```

### 流水线处理

```
> 第一个 Agent 分析项目结构，第二个 Agent 根据分析结果生成文档，第三个 Agent 审查文档质量
```

### 大规模重构

```
> 把这个单体应用拆分成微服务，每个服务由一个独立的 Agent 负责重构
```

## 工作流脚本

对于复杂的多步骤工作流，可以编写 Workflow 脚本：

```javascript
export const meta = {
  name: 'review-and-fix',
  description: '审查代码并自动修复问题',
  phases: [
    { title: '审查', detail: '多维度代码审查' },
    { title: '修复', detail: '自动修复发现的问题' },
    { title: '验证', detail: '运行测试验证修复' },
  ],
};

const issues = await agent('审查 src/ 目录下的代码，找出所有问题');
await pipeline(
  issues,
  issue => agent(`修复这个问题: ${issue.description}`),
  fix => agent(`运行测试验证修复: ${fix.file}`)
);
```

## Agent 工具

在工作流中，Agent 可以使用以下工具：

- `agent()` — 启动一个新的子 Agent
- `parallel()` — 并行执行多个任务
- `pipeline()` — 流水线执行多个阶段
- `phase()` — 定义工作流阶段
- `log()` — 输出进度信息

## 注意事项

- 每个 Agent 都会消耗 token，注意控制成本
- Agent 之间是独立的，不能直接共享状态
- 对于简单任务，单个 Agent 就够了，不需要多智能体
- 建议先用 `/plan` 模式规划，再决定是否需要多智能体

## 下一步

- [自动化与 CI/CD](/guide/advanced/automation) — 在自动化流程中使用 Claude Code
- [命令参考](/commands/) — 查看所有可用命令
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/multi-agent.md
git commit -m "docs: add multi-agent workflow advanced tutorial"
```

---

## Task 17: Write advanced tutorial — Automation

**Files:**
- Create: `docs/guide/advanced/automation.md`

- [ ] **Step 1: Create the page**

Create `docs/guide/advanced/automation.md`:

```markdown
---
title: 自动化与 CI/CD
description: 在自动化流程和 CI/CD 中使用 Claude Code
---

# 自动化与 CI/CD

Claude Code 不仅可以在交互式终端中使用，还可以集成到自动化流程中。

## 非交互模式

使用 `--print` 参数进入非交互模式，适合脚本调用：

```bash
claude --print "解释一下 src/index.ts 的作用"
```

### 管道输入

```bash
cat src/broken-file.ts | claude --print "这段代码有什么 bug？如何修复？"
```

### JSON 输出

```bash
claude --print --output-format json "分析这个项目的依赖关系"
```

## CI/CD 集成

### GitHub Actions

在 GitHub Actions 中使用 Claude Code：

```yaml
name: Claude Code Review
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: anthropics/claude-code-action@v1
        with:
          anthropic-api-key: ${{ secrets.ANTHROPIC_API_KEY }}
```

### GitLab CI

```yaml
claude-review:
  stage: review
  script:
    - npm install -g @anthropic-ai/claude-code
    - claude --print "审查这个 MR 的代码改动" > review.md
  artifacts:
    paths:
      - review.md
```

## 自动化任务

### 定期代码审查

```bash
# 每周运行，检查代码质量
claude --print "检查项目中是否有 TODO 和 FIXME 注释，整理成列表"
```

### 自动生成文档

```bash
# 为新代码生成文档
claude --print "为 src/utils/ 目录下的所有函数生成 JSDoc 注释"
```

### 依赖更新检查

```bash
claude --print "检查 package.json 中的依赖，哪些有大版本更新？更新时需要注意什么？"
```

## 环境变量

在自动化场景中，通过环境变量配置：

```bash
export ANTHROPIC_API_KEY=your-key
export CLAUDE_MODEL=claude-sonnet-4-20250514
claude --print "你的任务描述"
```

## 安全注意事项

- 不要在 CI 日志中暴露 API Key
- 使用 GitHub Secrets 或类似的密钥管理服务
- 限制自动化任务的权限范围
- 对于敏感操作，保留人工审核环节

## 下一步

- [命令参考](/commands/) — 查看所有可用的 Claude Code 命令
- [技巧与最佳实践](/tips/best-practices) — 更多实用技巧
```

- [ ] **Step 2: Commit**

```bash
git add docs/guide/advanced/automation.md
git commit -m "docs: add automation and CI/CD advanced tutorial"
```

---

## Task 18: Create Commands reference section

**Files:**
- Create: `docs/commands/_meta.json`
- Create: `docs/commands/index.md`
- Create: `docs/commands/reference.md`

- [ ] **Step 1: Create commands meta**

Create `docs/commands/_meta.json`:

```json
["index", "reference"]
```

- [ ] **Step 2: Create commands overview**

Create `docs/commands/index.md`:

```markdown
---
title: 命令参考
description: Claude Code 所有内置命令的速查手册
---

# 命令参考

本节提供 Claude Code 所有命令的完整参考。

- [命令速查](/commands/reference) — 所有斜杠命令和 CLI 参数的完整列表
```

- [ ] **Step 3: Create commands reference**

Create `docs/commands/reference.md`:

```markdown
---
title: 命令速查
description: Claude Code 所有斜杠命令和 CLI 参数的完整参考
---

# 命令速查

## 斜杠命令

### 对话管理

| 命令 | 说明 |
|------|------|
| `/clear` | 清空当前对话历史 |
| `/compact` | 压缩对话上下文，保留关键信息 |
| `/cost` | 查看当前会话的 token 使用量和费用 |
| `/help` | 查看所有可用命令 |

### 模型与配置

| 命令 | 说明 |
|------|------|
| `/model` | 查看当前模型 |
| `/model <name>` | 切换模型 |
| `/config` | 查看和修改配置 |
| `/permissions` | 查看当前权限设置 |

### 工作模式

| 命令 | 说明 |
|------|------|
| `/plan` | 进入计划模式，只分析不修改 |
| `/fast` | 切换快速模式 |

## CLI 参数

### 基本用法

```bash
claude                    # 启动交互式会话
claude --print "问题"     # 非交互模式，直接输出回答
claude --resume           # 恢复上一次会话
claude --continue         # 继续上一次会话
```

### 输出格式

```bash
claude --print --output-format json "问题"     # JSON 格式输出
claude --print --output-format stream-json "问题"  # 流式 JSON 输出
```

### 模型选择

```bash
claude --model claude-opus-4-8 "问题"     # 指定模型
```

### 权限控制

```bash
claude --allowedTools "Bash(npm *)" "Edit"  # 限制可用工具
claude --disallowedTools "Bash(rm *)"       # 禁止特定工具
```

### MCP 配置

```bash
claude --mcp-config path/to/config.json    # 指定 MCP 配置文件
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `ANTHROPIC_API_KEY` | Anthropic API 密钥 |
| `CLAUDE_MODEL` | 默认使用的模型 |
| `CLAUDE_CODE_MAX_OUTPUT_TOKENS` | 最大输出 token 数 |
```

- [ ] **Step 4: Commit**

```bash
git add docs/commands/
git commit -m "docs: add commands reference section"
```

---

## Task 19: Create Tips section

**Files:**
- Create: `docs/tips/_meta.json`
- Create: `docs/tips/index.md`
- Create: `docs/tips/best-practices.md`

- [ ] **Step 1: Create tips meta**

Create `docs/tips/_meta.json`:

```json
["index", "best-practices"]
```

- [ ] **Step 2: Create tips overview**

Create `docs/tips/index.md`:

```markdown
---
title: 技巧与最佳实践
description: 提升 Claude Code 使用效率的实用技巧
---

# 技巧与最佳实践

本节收集了使用 Claude Code 的实用技巧和最佳实践。

- [最佳实践](/tips/best-practices) — 日常使用中的高效技巧和常见模式
```

- [ ] **Step 3: Create best practices page**

Create `docs/tips/best-practices.md`:

```markdown
---
title: 最佳实践
description: Claude Code 日常使用中的高效技巧和常见模式
---

# 最佳实践

## 对话技巧

### 1. 提供具体上下文

```
❌ "帮我修个 bug"
✅ "用户登录后 token 没有保存到 localStorage，检查 src/auth/login.ts 的登录逻辑"
```

### 2. 指定范围

```
❌ "优化这个项目"
✅ "优化 src/api/users.ts 中的数据库查询，目前列表接口没有分页"
```

### 3. 分步完成

```
> 第一步：分析 src/database/ 的表结构
> 第二步：添加索引优化查询
> 第三步：运行测试确认没有回归
```

### 4. 利用 CLAUDE.md

在 `CLAUDE.md` 中记录项目约定，这样每次对话都不用重复说明。

## 工作流模式

### TDD 模式

```
> 用 TDD 方式实现一个邮箱验证函数：
> 1. 先写测试
> 2. 运行测试确认失败
> 3. 写最小实现让测试通过
> 4. 重构优化
```

### 审查模式

```
> /plan
> 帮我规划一下如何重构 src/auth/ 模块，分析现有的问题和改进方案
```

### 探索模式

```
> 我刚接手这个项目，帮我：
> 1. 梳理整体架构
> 2. 找到核心业务逻辑
> 3. 识别潜在的技术债务
```

## 省钱技巧

1. **及时 /compact**：每 10-15 轮对话压缩一次
2. **精确指定文件**：不要让 Claude 读整个项目
3. **用 /clear 重启**：切换任务时清空上下文
4. **监控 /cost**：定期检查 token 用量
5. **日常用 Sonnet**：复杂问题才切 Opus

## 团队协作

### 共享 CLAUDE.md

把 `CLAUDE.md` 提交到 Git，让整个团队共享项目约定。

### 共享 Skills

把 `.agents/skills/` 提交到 Git，让团队复用工作流。

### Code Review

```
> 帮我审查 main..feature 分支的改动，重点关注安全性和性能
```

## 常见问题

### Claude Code 似乎"忘记"了之前的内容

对话太长了，执行 `/compact` 或 `/clear` 后重新开始。

### Claude Code 的修改不符合预期

- 检查 `CLAUDE.md` 中是否有明确的约定
- 用 `/plan` 模式先确认方案再执行
- 对于关键修改，要求 Claude 先解释再动手

### 响应速度变慢

- 对话上下文可能过大，执行 `/compact`
- 检查是否加载了过多的 MCP 服务器
- 考虑切换到更快的模型（如 Haiku）
```

- [ ] **Step 4: Commit**

```bash
git add docs/tips/
git commit -m "docs: add tips and best practices section"
```

---

## Task 20: Update rspress.config.ts and final build verification

**Files:**
- Modify: `rspress.config.ts`

- [ ] **Step 1: Update site title and branding**

Edit `rspress.config.ts`:

```typescript
import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  title: 'Claude Code 教程',
  description: '一份由浅入深的 Claude Code 使用指南',
  icon: '/rspress-icon.png',
  logo: {
    light: '/rspress-light-logo.png',
    dark: '/rspress-dark-logo.png',
  },
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/anthropics/claude-code',
      },
    ],
  },
});
```

- [ ] **Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build completes without errors.

- [ ] **Step 3: Commit**

```bash
git add rspress.config.ts
git commit -m "chore: update site config for Claude Code tutorial"
```

---

## Task 21: Final review and push

**Files:**
- All docs files

- [ ] **Step 1: Run dev server and verify navigation**

Run: `npm run dev`
Verify:
- Homepage displays correctly with tutorial section links
- Navigation bar shows 教程/命令参考/技巧
- Sidebar shows 基础篇/进阶篇/高级篇 sections
- All tutorial pages render correctly

- [ ] **Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds with no broken links or missing pages.

- [ ] **Step 3: Push all changes**

```bash
git add -A
git commit -m "docs: complete Claude Code tutorial site

- 5 beginner tutorials (what-is, installation, first-conversation, file-ops, permissions)
- 5 intermediate tutorials (navigation, slash-commands, claude-md, git-workflow, context)
- 5 advanced tutorials (hooks, mcp-servers, custom-skills, multi-agent, automation)
- Commands reference section
- Tips and best practices section"
```
