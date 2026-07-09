---
title: Agent Skills — 开放式 Agent 技能标准
description: Agent Skills 是 Anthropic 发起、社区维护的开放标准，用 SKILL.md 文件为 AI Agent 定义可复用的能力模块。覆盖规范、渐进式披露机制、验证工具和 Claude Code 集成
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★☆☆  | ★★★★☆    |
| 📦 产品 | ★★★☆☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握 Agent Skills 开放标准，能独立创建、验证、发布符合规范的 Agent 技能，并在 Claude Code 中使用社区技能

**🚀 AI 能力提升：** 技能扩展、自动化工作流
:::

# Agent Skills — 开放式 Agent 技能标准

> Agent Skills 是一种轻量级、开放格式，用于为 AI Agent 定义可复用的能力模块。最初由 Anthropic 开发，现已作为开放标准发布，被众多 AI 产品和客户端采用。

## 概念：为什么需要 Agent Skills

AI Agent 的能力不是天生的——它是通过**指令、脚本、参考资料**逐步构建起来的。传统做法每次都要用自然语言重新描述这些指令，既低效又不一致。

Agent Skills 解决的就是这个问题：**把专业知识、工作流、工具用法打包成一个标准化的模块，一次编写，处处可用**。

打个比方：

| 类比     | 传统方式                 | Agent Skills                     |
| -------- | ------------------------ | -------------------------------- |
| 菜谱     | 每次做饭前口头描述怎么做 | 把菜谱写下来，需要时翻开         |
| 程序库   | 每次手写排序算法         | `import sort`                    |
| 设计系统 | 每次描述按钮应该长什么样 | 引用 Button 组件的设计规范和代码 |

`SKILL.md` 就是这份"菜谱"——包含这个技能叫什么、什么时候用、以及具体怎么做。

## 核心设计理念

### 领域专业知识

将专业知识——从法律审核流程到数据分析管线再到演示文稿格式化——打包为可复用的指令和资源：

- 📋 **法律审核技能**：包含审核清单、条款模板、风险分类标准
- 📊 **数据分析技能**：包含数据处理管线、可视化规范、报告模板
- 🎨 **PPT 生成技能**：包含品牌色板、布局模板、字体规范

### 可重复工作流

将多步骤任务转化为一致、可审计的操作流程。同一个技能每次激活都按照相同的流程执行，保证输出质量的一致性。

### 跨产品复用

一次构建技能，可在任何兼容 Agent Skills 的 Agent 中跨产品使用。Claude Code、Codex、Cursor、Gemini CLI 等工具都支持或正在适配该标准。

## 目录结构

一个 Agent Skill 就是一个目录，最少只需要一个 `SKILL.md` 文件：

```text
my-skill/
├── SKILL.md          # 必需：元数据 + 指令
├── scripts/          # 可选：可执行代码（Python/Bash/JS）
├── references/       # 可选：文档资料（按需加载）
├── assets/           # 可选：模板、图片、数据文件
└── ...               # 任何其他文件或目录
```

### 各目录的职责

| 目录          | 用途                         | 加载时机           | 建议                              |
| ------------- | ---------------------------- | ------------------ | --------------------------------- |
| `SKILL.md`    | 技能元数据 + 核心指令        | 技能激活时         | 控制在 500 行以内，是技能的"入口" |
| `scripts/`    | 可执行代码，Agent 可直接运行 | 需要时             | 自包含、有错误处理、注明依赖      |
| `references/` | 补充文档，Agent 按需阅读     | 从 SKILL.md 引用时 | 按主题拆分，保持单个文件聚焦      |
| `assets/`     | 静态资源（模板、图片等）     | 需要时             | 模板文件、schema 定义、查表数据   |

## SKILL.md 格式规范

`SKILL.md` 文件包含 **YAML 前置元数据（frontmatter）** + **Markdown 正文**两部分。

### 完整字段一览

| 字段            | 必需 | 长度限制    | 说明                                                 |
| --------------- | ---- | ----------- | ---------------------------------------------------- |
| `name`          | ✅   | 1-64 字符   | 小写字母、数字、连字符。必须与父目录名一致           |
| `description`   | ✅   | 1-1024 字符 | 描述技能做什么 + 什么时候用，含关键词帮助 Agent 匹配 |
| `license`       | ❌   | —           | 许可证名称或指向 bundled 许可证文件的引用            |
| `compatibility` | ❌   | 1-500 字符  | 环境要求：目标产品、系统依赖、网络权限等             |
| `metadata`      | ❌   | —           | 自定义键值对，用于存储额外属性（author、version 等） |
| `allowed-tools` | ❌   | —           | 空格分隔的预批准工具列表（实验性）                   |

### name 字段规则

`name` 的命名约束：

- ✅ 允许：`pdf-processing`、`data-analysis`、`code-review`
- ❌ 不允许：`PDF-Processing`（大写）、`-pdf`（以连字符开头）、`pdf--processing`（连续连字符）

### 最小示例

```yaml
---
name: pdf-processing
description: Extract PDF text, fill forms, merge files. Use when handling PDFs or when the user mentions PDFs, forms, or document extraction.
---
```

### 完整示例

```yaml
---
name: pdf-processing
description: Extract text and tables from PDF files, fill PDF forms, and merge multiple PDFs. Use when working with PDF documents or when the user mentions PDFs, forms, or document extraction.
license: Apache-2.0
compatibility: Requires Python 3.14+ and uv
metadata:
  author: example-org
  version: '1.0'
allowed-tools: Bash(git:*) Bash(python:*) Read
---
# PDF Processing

## Step-by-step instructions

...(技能的具体指令写在这里)...
```

### description 怎么写

:::tip 好的 description
包含 **做什么** + **什么时候用** + **触发关键词**：

```yaml
description: Extracts text and tables from PDF files, fills PDF forms,
and merges multiple PDFs. Use when working with PDF documents or when
the user mentions PDFs, forms, or document extraction.
```

:::

:::danger 差的 description
太模糊，Agent 无法判断何时该激活：

```yaml
description: Helps with PDFs.
```

:::

## 渐进式披露机制

Agent 通过**三个阶段**渐进加载技能，避免一次性占满上下文：

```text
┌──────────────────────────────────────────────────────────┐
│  阶段 ① 发现（Discovery）                                │
│  启动时加载所有技能 name + description                    │
│  每个技能仅 ~100 tokens，可携带数十个技能而不占空间        │
├──────────────────────────────────────────────────────────┤
│  阶段 ② 激活（Activation）                               │
│  任务匹配 description 时，加载完整 SKILL.md                │
│  建议控制在 500 行 / 5000 tokens 以内                     │
├──────────────────────────────────────────────────────────┤
│  阶段 ③ 执行（Execution）                                │
│  Agent 按指令执行，必要时运行 scripts/、读取 references/   │
│  资源文件按需加载，不进入上下文                            │
└──────────────────────────────────────────────────────────┘
```

**这个设计的巧妙之处在于**：你可以安装几十个技能，但 Agent 的上下文窗口几乎不增加。只在真正需要时才把"菜谱"翻开。

## 创建你的第一个 Skill

### Step 1：创建目录和 SKILL.md

```bash
mkdir -p my-first-skill
```

```markdown
# my-first-skill/SKILL.md

---

name: my-first-skill
description: Formats Markdown documents according to project style guide.
Use when the user asks to format, prettify, or clean up Markdown files.

---

# Markdown Formatter

## Instructions

1. Read the target Markdown file
2. Apply these formatting rules:
   - Single blank line between sections
   - No trailing whitespace
   - Code blocks use language tags
   - Headers use sentence case
3. Write the formatted result back

## Edge cases

- If the file already matches the style, say so and skip
- If the file doesn't exist, report the error
```

### Step 2：添加参考资料（可选）

```bash
mkdir -p my-first-skill/references
```

```markdown
# my-first-skill/references/style-guide.md

## Project Style Guide

- Indentation: 2 spaces
- Quotes: single
- Semicolons: no
- Line width: 100 characters
```

在 `SKILL.md` 中引用它：

```markdown
Refer to [the complete style guide](references/style-guide.md) for detailed formatting rules.
```

### Step 3：添加可执行脚本（可选）

```bash
mkdir -p my-first-skill/scripts
```

```python
# my-first-skill/scripts/check_trailing_ws.py
"""Check for trailing whitespace in Markdown files."""
import sys

def check(filepath: str) -> list[int]:
    lines_with_trailing = []
    with open(filepath, encoding='utf-8') as f:
        for i, line in enumerate(f, 1):
            if line.rstrip('\n').endswith(' '):
                lines_with_trailing.append(i)
    return lines_with_trailing

if __name__ == '__main__':
    for path in sys.argv[1:]:
        bad = check(path)
        if bad:
            print(f'{path}: trailing whitespace on lines {bad}')
```

在 `SKILL.md` 中引用：

```markdown
Before writing, run the trailing whitespace check:
scripts/check_trailing_ws.py <file>
```

## 验证技能

使用 `skills-ref` 参考库验证你的技能是否符合规范：

```bash
# 安装
pip install skills-ref

# 验证
skills-ref validate ./my-first-skill
```

这会检查：

- ✅ frontmatter 格式是否正确
- ✅ `name` 是否符合命名规则
- ✅ `name` 是否与目录名一致
- ✅ `description` 是否非空且不超长
- ✅ 可选字段格式是否正确

## 在 Claude Code 中使用

### 安装社区技能

Claude Code 原生支持 Agent Skills。最常用的技能来源是 [Anthropic 官方技能仓库](https://github.com/anthropics/skills)：

```bash
# 克隆社区技能仓库到 ~/.claude/skills/
git clone https://github.com/anthropics/skills.git ~/.claude/skills/
```

也支持安装单独的技能：

```bash
# 放在 ~/.claude/skills/ 下的任意子目录
mkdir -p ~/.claude/skills/pdf-processing
cp /path/to/pdf-processing/SKILL.md ~/.claude/skills/pdf-processing/
```

Claude Code 启动时会扫描 `~/.claude/skills/` 目录，自动加载所有技能到发现层（阶段①）。

### 技能加载验证

启动 Claude Code 后，可以看到技能加载日志：

```text
[Skills] Loaded 12 skills from ~/.claude/skills/
  - pdf-processing (PDF extraction and manipulation)
  - data-analysis (Statistical analysis and chart generation)
  - code-review (Code review with project conventions)
  ...
```

### 注意：Skills 和 Agents 的区别

| 维度         | Skills（技能）                | Agents（自定义 Agent）                       |
| ------------ | ----------------------------- | -------------------------------------------- |
| **文件**     | 一个 `SKILL.md` 目录          | 一个 `.md` 文件                              |
| **目的**     | 赋予 Agent 专业知识和工作流   | 定义 Agent 的角色和人格                      |
| **触发**     | Agent 按 description 自动匹配 | 用户显式指定或在配置中路由                   |
| **范围**     | 跨产品通用（开放标准）        | 特定产品（Claude Code 等）                   |
| **存放位置** | `~/.claude/skills/`           | `~/.claude/agents/` 或项目 `.claude/agents/` |

简单理解：**Skills 教 Agent 怎么做，Agents 定义谁来做什么**。

## 最佳实践

### 1. 保持 SKILL.md 精简

- 控制在 500 行以内
- 详细的参考资料放到 `references/` 目录
- Agent 按需加载引用文件，不占用基础上下文

### 2. 写好 description

- description 是技能**唯一在发现阶段可见的内容**
- Agent 靠它判断是否激活技能，写模糊了技能永远不会被触发
- 包含具体触发场景和关键词（如 "Use when the user mentions PDFs, forms, or document extraction"）

### 3. 文件引用保持一层深

```text
✅ SKILL.md → references/style-guide.md
✅ SKILL.md → scripts/extract.py
❌ SKILL.md → references/guide.md → references/deep-dive.md → ...（太深，Agent 可能跟丢）
```

### 4. 为脚本做好错误处理

Agent 运行脚本时没有交互式终端——脚本失败了，Agent 只能看输出：

```python
# ✅ 好的：有明确的错误信息和退出码
if not filepath.exists():
    print(f"Error: {filepath} not found", file=sys.stderr)
    sys.exit(1)

# ❌ 差的：静默失败或输出模糊
if not filepath.exists():
    pass  # 啥也不说，Agent 一头雾水
```

### 5. 利用渐进式披露设计大型技能

如果一个技能涉及很多细分场景，不要把所有内容塞进 `SKILL.md`。按场景拆分到 `references/`：

```text
financial-analysis/
├── SKILL.md                # 发现 + 入口 + 路由逻辑
├── references/
│   ├── stock-valuation.md  # 股价估值方法
│   ├── risk-analysis.md    # 风险评估框架
│   └── portfolio.md        # 投资组合优化
└── scripts/
    ├── fetch_data.py       # 获取市场数据
    └── monte_carlo.py      # 蒙特卡洛模拟
```

`SKILL.md` 中只写路由逻辑：

```markdown
## Task routing

- For stock valuation: read references/stock-valuation.md
- For risk analysis: read references/risk-analysis.md
- For portfolio optimization: read references/portfolio.md
```

这样每次只加载需要的 1/3 内容，大幅节省上下文。

## 社区与生态

### 官方技能仓库

| 资源                  | 链接                                                                          | 说明                        |
| --------------------- | ----------------------------------------------------------------------------- | --------------------------- |
| **Anthropic Skills**  | [github.com/anthropics/skills](https://github.com/anthropics/skills)          | 官方示例技能集，~159K stars |
| **Agent Skills 规范** | [agentskills.io](https://agentskills.io)                                      | 格式规范、教程、客户端列表  |
| **技能验证工具**      | [skills-ref](https://github.com/agentskills/agentskills/tree/main/skills-ref) | 参考实现 + 校验命令行工具   |

### 精选社区技能

| 仓库                                 | Stars | 说明                                |
| ------------------------------------ | ----- | ----------------------------------- |
| **alirezarezvani/claude-skills**     | ~21K  | 345 个 Claude Code 技能，覆盖各行业 |
| **ComposioHQ/awesome-claude-skills** | ~67K  | Claude Skills 精选目录              |
| **hesreallyhim/awesome-claude-code** | ~49K  | Claude Code 全生态资源合集          |
| **mvanhorn/last30days-skill**        | ~50K  | 聚合 Reddit/X/YouTube 生成研究摘要  |

### 社区讨论

- [Discord](https://discord.gg/MKPE9g8aUy) — 官方社区讨论区
- [GitHub Issues](https://github.com/agentskills/agentskills/issues) — 规范讨论与建议

## 常见问题

### Agent Skills 和 MCP 服务器有什么区别？

| 维度     | Agent Skills                    | MCP 服务器                       |
| -------- | ------------------------------- | -------------------------------- |
| **本质** | 给 Agent 的 **指令 + 知识**     | 给 Agent 的 **工具 + API**       |
| **形式** | `SKILL.md` 文件 + 可选脚本/资料 | 运行的进程，暴露 tools/resources |
| **加载** | 启动时扫描，按需激活            | 按配置连接，持续可用             |
| **例子** | "如何做代码审查"                | "执行 git blame、读写 Jira"      |

两者互补：Skill 里的脚本可以调用 MCP 工具，MCP 工具也可以由 Skill 激活后驱动。

### Agent Skills 和 AGENTS.md 路由协议怎么配合？

- `AGENTS.md` 定义**哪个 Skill 框架优先**（Superpowers vs Gstack 等）
- 每个 Skill 框架内部的技能按 **Agent Skills 标准** 组织
- 两者不冲突：AGENTS.md 是调度层，Agent Skills 是能力层

详见 [AGENTS 全局路由协议](./agents-routing.md)。

### 必须发布到 GitHub 才能用吗？

不用。Skills 是纯本地的目录结构。你可以：

- 📁 自己的私有 Skill 直接放在 `~/.claude/skills/` 下就能用
- 🔗 克隆社区仓库到本地使用
- 🌐 发布到 GitHub 方便分享和协作（推荐加上 `agent-skills` topic）

### 所有 Agent 产品都支持 Agent Skills 吗？

Agent Skills 是开放标准，主流 Agent 产品都在适配中：

- ✅ **Claude Code** — 原生支持
- ✅ **Codex**（OpenAI）— 通过 `codex-plugin-cc` 兼容
- 🔄 **Cursor、Gemini CLI** 等 — 适配中

完整客户端列表见 [agentskills.io/clients](https://agentskills.io/clients)。

## 相关资源

- [agentskills.io](https://agentskills.io) — 官方网站：规范、教程、客户端列表
- [agentskills.io/specification](https://agentskills.io/specification) — 完整格式规范
- [github.com/agentskills/agentskills](https://github.com/agentskills/agentskills) — 仓库（规范 + 验证工具）
- [github.com/anthropics/skills](https://github.com/anthropics/skills) — Anthropic 官方技能集
- [Superpowers](./superpowers) — Claude Code 结构化工作流框架（基于 Agent Skills）
- [AGENTS 全局路由协议](./agents-routing) — 多技能框架的调度与优先级

## 下一步

- [多智能体工作流](./multi-agent) — 了解 Claude Code 的多 Agent 架构
- [MCP 服务器](./mcp-servers) — 给 Agent 添加工具能力
- [AGENTS 全局路由协议](./agents-routing) — 多框架共存时的路由策略
- [Comet](./comet) — 提交前的自动化验证 Skill
