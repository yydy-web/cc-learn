---
title: Agency Agents — 232 个预制 AI Agent 角色库
description: 将 Agency Agents 安装到 Claude Code，一句话切换到专业角色——前端开发、后端架构、安全审查等 232 个领域专家随叫随到
---

# Agency Agents — 预制 AI Agent 角色库

> 232 个专业 Agent 角色，16 个行业领域，一个命令装到 Claude Code 里。不是让你写提示词——是让你指挥团队。

## 这是什么

[Agency Agents](https://github.com/msitarzewski/agency-agents) 是一个开源（MIT）的预制 AI Agent 角色库。每个 Agent 都是一个 Markdown 文件，定义了：

- **身份和性格** — 不是冷冰冰的"你是一个前端开发"，而是有明确工作风格的专家
- **核心使命** — 每个 Agent 有自己的专业领域和红线
- **工作流程** — 经过实战验证的 step-by-step 流程
- **交付标准** — 具体的输出格式和质量要求
- **成功指标** — 可衡量的完成标准

跟 Claude Code 自带能力的区别：

| 功能 | Claude Code 原生 | + Agency Agents |
|------|-----------------|-----------------|
| 角色切换 | 每次手动描述"你是一个 XX 专家" | 一句话激活 "activate Frontend Developer" |
| 多 Agent 协作 | 需手写 Workflow 脚本编排 | 预制角色直接组队，配合 Workflow 使用 |
| 角色一致性 | 每次对话可能漂移 | 角色定义固化在 Markdown 文件中，输出稳定 |
| 知识深度 | 依赖模型通用知识 | 每个 Agent 有领域特定的 checklist 和交付物模板 |

### 跟其他多 Agent 工具的关系

| 工具 | 定位 | Agency Agents 怎么配合 |
|------|------|----------------------|
| **Superpowers** | 开发流程编排（brainstorm → plan → execute） | 在 plan 阶段指定用哪些 Agent 角色 |
| **Multi-agent Workflow** | 并行/串行编排 Agent 实例 | 每个实例加载不同 Agent 角色 |
| **Orca** | 自主任务分解和执行 | 用 Agency Agents 角色池填充 Orca 的 Agent 阵容 |
| **Ralph** | PRD 驱动的自主循环 | 每个循环用不同 Agent 角色处理不同类型任务 |

## 安装和配置

### 前置条件

- Claude Code 已安装并认证
- Git（用于克隆仓库）
- 如果要多工具安装：需要对应的工具已安装

### 方式一：命令行安装（推荐）

```bash
# 1. 克隆仓库
git clone https://github.com/msitarzewski/agency-agents.git
cd agency-agents

# 2. 安装到 Claude Code
./scripts/install.sh --tool claude-code
```

安装后，Agent 文件会被复制到 Claude Code 的配置目录。

### 选择性安装

只装你需要的团队：

```bash
# 只装工程和安全团队
./scripts/install.sh --tool claude-code --division engineering,security

# 只装特定的 Agent
./scripts/install.sh --tool claude-code --agent frontend-developer,backend-architect
```

### 查看可用团队和 Agent

```bash
# 列出所有团队
./scripts/install.sh --list divisions

# 列出工程团队下所有 Agent
./scripts/install.sh --list agents --division engineering
```

### 方式二：桌面 App

从 [releases 页面](https://github.com/msitarzewski/agency-agents-app/releases) 下载，Mac 用户：

```bash
brew install --cask msitarzewski/agency-agents/agency-agents
```

桌面 App 提供可视化浏览和点击安装，适合不熟悉命令行的用户。

### 安装验证

在 Claude Code 中测试：

```text
> activate Frontend Developer mode
```

如果 CC 响应角色切换提示，说明安装成功。

:::tip
建议按需安装（`--division` 或 `--agent`），全量 232 个 Agent 装在项目里会让目录很重。用到什么装什么。
:::

### 关键要点

1. **命令行优于桌面 App** — 选择性安装、脚本自动化，更灵活
2. **按需安装** — 232 个全装是无意义的噪声，只装你要用的 3-5 个团队
3. **Agent 文件是可读的 Markdown** — 装完去目录里翻翻，理解每个 Agent 的工作方式
