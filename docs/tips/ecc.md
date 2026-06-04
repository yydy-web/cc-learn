---
title: ECC — Claude Code 增强系统
description: ECC 提供 63 个专业 Agent、249 个 Skill、Hooks 自动化和安全扫描，全面提升 Claude Code 开发效率
---

# ECC — Claude Code 增强系统

[ECC](https://github.com/affaan-m/ECC)（Enhanced Claude Code）是一个生产级的 Claude Code 增强系统，经过 10+ 个月的日常高强度使用打磨而成。它提供了 63 个专业 Agent、249 个 Skill、事件驱动的 Hooks 自动化、多语言 Rules 以及安全扫描能力，覆盖从功能开发到安全审计的完整开发生命周期。

:::tip 适用场景
ECC 特别适合以下场景：需要结构化开发流程的团队、多语言/多框架项目、安全敏感型应用、以及希望最大化 Claude Code 产出质量的高级用户。
:::

## 核心组件

### Agent（63 个专业子代理）

Agent 是可委托的子代理，每个都有明确的职责边界和工具权限：

| 类别 | Agent 示例 | 用途 |
|------|-----------|------|
| 规划架构 | `planner`, `architect` | 功能规划、系统设计 |
| 开发流程 | `tdd-guide`, `code-reviewer`, `build-error-resolver` | TDD 指导、代码审查、构建修复 |
| 安全 | `security-reviewer` | 漏洞分析、安全审查 |
| 语言专家 | `typescript-reviewer`, `python-reviewer`, `go-reviewer`, `java-reviewer`, `rust-reviewer` | 语言特定的代码审查和构建修复 |
| 领域专家 | `database-reviewer`, `mle-reviewer` | 数据库审查、ML 流水线审查 |
| 运营 | `chief-of-staff`, `loop-operator`, `harness-optimizer` | 沟通分流、自主循环、配置优化 |

### Skill（249 个工作流定义）

Skill 是 ECC 的主要工作流接口，覆盖 12+ 语言生态：

- **后端**：`backend-patterns`, `api-design`, `database-migrations`, `docker-patterns`
- **前端**：`frontend-patterns`, `nextjs-turbopack`
- **语言专项**：Spring Boot (`springboot-patterns`, `springboot-tdd`), Django (`django-patterns`, `django-tdd`), Laravel (`laravel-patterns`, `laravel-tdd`), Go (`golang-patterns`), Rust, C++, Swift, Perl
- **工作流**：`tdd-workflow`, `security-review`, `deep-research`, `autonomous-loops`
- **业务运营**：`market-research`, `investor-materials`, `content-engine`, `brand-voice`
- **ML/MLOps**：`mle-workflow`, `pytorch-patterns`

### Hooks（事件驱动自动化）

Hooks 在工具事件触发时自动执行，实现跨会话的持续行为引导：

| Hook | 触发时机 | 功能 |
|------|---------|------|
| `session-start.js` | 会话开始 | 加载上次会话上下文 |
| `session-end.js` | 会话结束 | 保存当前状态和学习成果 |
| `pre-compact.js` | 压缩前 | 保存压缩前的状态快照 |
| `suggest-compact.js` | 上下文过大时 | 建议何时执行 compact |
| `evaluate-session.js` | 会话评估 | 从会话中提取可复用模式（instincts） |

### Rules（编码规范）

Rules 是始终生效的编码准则，按语言组织：

- `rules/common/` — 编码风格、Git 工作流、测试、性能、安全等通用规则
- `rules/typescript/` — TypeScript/JavaScript 规范
- `rules/python/` — Python 规范
- `rules/golang/` — Go 规范
- `rules/swift/` — Swift 规范
- `rules/php/` — PHP 规范

## 安装方式

### 方式一：Plugin 安装（推荐）

```bash
# 在 Claude Code 中执行
/plugin marketplace add https://github.com/affaan-m/ECC
/plugin install ecc@ecc
```

或手动添加到 `~/.claude/settings.json`：

```json title="~/.claude/settings.json"
{
  "extraKnownMarketplaces": {
    "ecc": {
      "source": { "source": "github", "repo": "affaan-m/ECC" }
    }
  },
  "enabledPlugins": { "ecc@ecc": true }
}
```

:::warning
Plugin 安装后仍需手动复制 Rules，因为 Claude Code Plugin 无法自动分发它们：

```bash
git clone https://github.com/affaan-m/ECC.git && cd ECC
mkdir -p ~/.claude/rules/ecc
cp -R rules/common ~/.claude/rules/ecc/
cp -R rules/typescript ~/.claude/rules/ecc/  # 按你的技术栈选择
```
:::

### 方式二：手动安装

```bash
git clone https://github.com/affaan-m/ECC.git && cd ECC
npm install
./install.sh --profile full
```

### 方式三：最小安装（无 Hooks）

```bash
./install.sh --profile minimal --target claude
```

需要后续添加 Hooks 时：

```bash
./install.sh --target claude --modules hooks-runtime
```

### 组件顾问

不确定该装什么？用 `consult` 命令按需查找：

```bash
npx ecc consult "security reviews" --target claude
npx ecc consult "tdd workflow" --target claude
```

## 业务场景

### 场景一：全功能开发流程

ECC 的 Plan → TDD → Review → Ship 流程，适用于新功能的完整开发：

```
1. /ecc:plan "添加用户认证模块"
   → planner agent 创建实现蓝图

2. tdd-workflow skill
   → 先写测试，再实现代码

3. /ecc:code-review
   → code-reviewer agent 进行质量审查

4. security-review skill
   → 安全审查，确保无漏洞
```

### 场景二：安全审计

对已有项目进行全面安全扫描：

```bash
# 快速扫描
npx ecc-agentshield scan

# 自动修复安全问题
npx ecc-agentshield scan --fix

# 深度分析（3 个 Opus Agent 并行审查）
npx ecc-agentshield scan --opus --stream
```

AgentShield 覆盖 5 大安全类别：密钥泄露检测（14 种模式）、权限审计、Hook 注入分析、MCP 服务器风险评估、Agent 配置审查。

### 场景三：多服务编排

对于复杂的多服务项目，使用多 Agent 编排命令：

```
/multi-plan      → 多 Agent 任务分解
/multi-backend   → 后端服务编排
/multi-frontend  → 前端服务编排
/multi-execute   → 协调执行
```

### 场景四：自主循环执行

将大型功能拆分为用户故事，让 Agent 自主循环实现：

```
/loop-start      → 启动受控的自主循环
/loop-status     → 检查循环状态和检查点
```

配合 `autonomous-loops` skill，支持顺序流水线、PR 循环、DAG 编排等模式。

### 场景五：跨语言项目

同一个 ECC 安装支持多语言项目，自动加载对应的语言规则和审查 Agent：

| 语言 | 对应 Agent | 对应 Skill |
|------|-----------|-----------|
| TypeScript | `typescript-reviewer` | `coding-standards`, `mcp-server-patterns` |
| Python | `python-reviewer` | `python-patterns`, `python-testing` |
| Java | `java-reviewer`, `java-build-resolver` | `springboot-patterns`, `springboot-tdd` |
| Go | `go-reviewer`, `go-build-resolver` | `golang-patterns`, `golang-testing` |
| Rust | `rust-reviewer`, `rust-build-resolver` | — |
| C++ | `cpp-reviewer`, `cpp-build-resolver` | `cpp-coding-standards`, `cpp-testing` |

### 场景六：持续学习

ECC 的 `continuous-learning-v2` 机制会从开发会话中提取可复用模式（instincts），跨会话积累经验：

- `evaluate-session.js` 在会话结束时自动分析工作模式
- 提取的 instincts 在后续会话中自动注入上下文
- 配合 `session-start.js` / `session-end.js` 实现跨会话知识持久化

## Hook 配置

### 运行时控制

通过环境变量精细控制 Hook 行为：

```bash
# Hook 配置级别：minimal | standard | strict
export ECC_HOOK_PROFILE=standard

# 禁用特定 Hook
export ECC_DISABLED_HOOKS="pre:bash:tmux-reminder,post:edit:typecheck"

# 会话启动上下文长度限制
export ECC_SESSION_START_MAX_CHARS=4000

# 关闭会话启动上下文注入
export ECC_SESSION_START_CONTEXT=off

# 关闭费用警告
export ECC_CONTEXT_MONITOR_COST_WARNINGS=off
```

### 自定义 Hook 示例

在编辑 `.ts`/`.tsx`/`.js`/`.jsx` 文件时，自动警告 `console.log`：

```json title="hooks.json"
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "grep -n 'console\\.log' \"$file_path\" && echo '[Hook] Remove console.log' >&2"
  }]
}
```

## 配置管理

### 自定义 API 端点

```bash
export ANTHROPIC_BASE_URL=https://your-gateway.example.com
export ANTHROPIC_AUTH_TOKEN=your-token
```

### 包管理器偏好

```bash
export CLAUDE_PACKAGE_MANAGER=pnpm
```

### 诊断与修复

```bash
node scripts/ecc.js list-installed   # 查看已安装组件
node scripts/ecc.js doctor           # 诊断配置问题
node scripts/ecc.js repair           # 自动修复
```

### 卸载

```bash
node scripts/uninstall.js --dry-run  # 预览卸载
node scripts/uninstall.js            # 执行卸载
```

## 与其他工具的关系

ECC 可以与 cc-learn 文档中介绍的其他工具协同使用：

| 工具 | 与 ECC 的关系 |
|------|-------------|
| [Context7](/guide/advanced/context7) | ECC 的 `docs-lookup` agent 可调用 Context7 获取最新库文档 |
| [Superpowers](/guide/advanced/superpowers) | ECC 的 `tdd-workflow` skill 与 Superpowers 的 TDD 纪律互补 |
| [Serena](/guide/advanced/serena) | Serena 提供符号级操作，ECC 提供流程级编排 |

:::info
ECC 是 Claude Code 生态中的"全家桶"方案。如果你只需要某个特定能力（如安全扫描或 TDD 工作流），可以使用 `npx ecc consult` 按需安装单个组件。
:::

## 下一步

- [最佳实践](/tips/best-practices) — 日常使用中的高效技巧和常见模式
- [Java 开发最佳实践](/tips/java-best-practices) — Java/Spring Boot 开发指南
- [Superpowers](/guide/advanced/superpowers) — 开发纪律工具
- [ECC GitHub 仓库](https://github.com/affaan-m/ECC) — 完整源码和文档