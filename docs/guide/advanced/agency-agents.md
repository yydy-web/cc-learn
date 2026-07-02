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

## 基本用法

### 三种激活方式

#### 1. 点名激活（推荐）

最直接的方式——在会话中说"激活 XX 模式"：

```text
> activate Frontend Developer mode. 帮我用 React + TypeScript 重构这个表单组件。
```

CC 会加载 Frontend Developer 的完整角色定义，包括：
- 技术栈偏好（React、TypeScript、CSS Modules）
- 代码风格要求（可访问性优先、移动端响应式）
- 交付格式（组件 + 单元测试 + Storybook story）

#### 2. 临时调用

不需要切换当前角色，只是临时请一个专家给意见：

```text
> 我写完了 API 设计，让 Security Architect 审一下有哪些安全隐患。
```

当前正在做的事不受影响，Security Architect 以"顾问"身份介入输出审查意见后退出。

#### 3. 项目级常驻

在项目 CLAUDE.md 中声明默认 Agent 团队：

```markdown
# CLAUDE.md

## 默认 Agent 团队
- Frontend Developer（React/TypeScript）
- Reality Checker（测试和质量把关）
```

之后每次开启会话，CC 自动加载这些角色。适合长期项目，省去每次都手动激活。

### Agent 协作模式

多个 Agent 可以组合使用，三种常见模式：

#### 串联（接力）

一个 Agent 的输出作为下一个的输入：

```text
> 第一步：activate Backend Architect 设计 API
> 第二步：activate Frontend Developer，基于上面的 API 实现 UI
> 第三步：activate Reality Checker，审查完整实现
```

适合：前后端分离开发、设计→开发→审查的线性流程。

#### 并联（并行）

多个 Agent 同时工作在不同维度：

```text
> 启动 3 个 Agent 分别审查这段代码：
> 1. Security Architect — 安全审计
> 2. Performance Benchmarker — 性能分析
> 3. Reality Checker — 功能完整性
```

适合：代码审查、多维度分析。

#### 网状（相互审查）

两个 Agent 互相审查彼此的输出：

```text
> Frontend Developer 和 UI Designer 互相审查：
> Designer 审查 Developer 的组件是否符合设计规范
> Developer 审查 Designer 的交互方案是否可实现
```

适合：需要跨领域共识的场景。

### 配合 Workflow 脚本

Agency Agents 的角色定义和 Claude Code 的 Workflow 脚本不是替代关系——是组合关系：

```javascript
// 在 Workflow 脚本中引用 Agent 角色
export const meta = {
  name: 'feature-dev-with-roles',
  description: '带角色分工的功能开发流程',
}

const backend = await agent(
  '作为 Backend Architect，设计用户反馈功能的 API 和数据模型',
  { label: 'backend-design' }
)

const frontend = await agent(
  '作为 Frontend Developer，基于以下 API 设计实现 React 组件',
  { label: 'frontend-implement' }
)

const review = await agent(
  '作为 Reality Checker，审查以上前后端实现，列出至少 3 个改进点',
  { label: 'quality-review' }
)
```

:::info
Workflow 脚本的完整用法见[多智能体工作流](./multi-agent.md)和 [Superpowers 使用教程](./superpowers.md)。
:::

### 关键要点

1. **点名激活是最常用的方式** — 不需要提前配置，随时切换
2. **项目级常驻适合长期项目** — 省去重复激活，角色一致性更好
3. **Agent 协作模式不要过度设计** — 大部分场景串联就够了，并联只在审查阶段用
