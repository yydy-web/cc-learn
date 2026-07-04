---
title: Hermes + Claude Code — 多智能体协作开发
description: 使用 Hermes 作为编排层驱动 Claude Code 并行开发——从环境搭建到完整案例，覆盖 ACP 协议、任务委派、Zenith 集成和最佳实践
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★☆☆ |
| 🧪 测试 | ★★★☆☆ | ★★★★☆ |
| 📦 产品 | ★★★☆☆ | ★★★★☆ |

**🎯 学习产出：** 掌握 Hermes 智能体通信，能独立通过 ACP 协议编排 Claude Code 与多 Agent 协作开发

**🚀 AI 能力提升：** 多智能体
:::

# Hermes + Claude Code — 多智能体协作开发

> Hermes 是"大脑"，负责思考"谁做什么、怎么做"；Claude Code 是"手"，负责写代码、改代码、跑测试。两者通过 ACP 协议协作，把大型开发任务拆成并行子任务，效率翻倍。

## 概念：Hermes 是什么

**Hermes** 是一个独立的 AI 编码 CLI 工具，与 Claude Code、Codex 并列。它支持 **ACP（Agent Client Protocol）**，可以与其他 Agent 协同工作。

| 工具            | 角色               | 核心能力                              |
| --------------- | ------------------ | ------------------------------------- |
| **Claude Code** | Anthropic 官方 CLI | 代码编写、调试、重构、文件操作        |
| **Hermes**      | 多 Agent 编排器    | 任务分解、子 Agent 调度、ACP 协议通信 |
| **Codex**       | OpenAI 的 CLI      | 代码生成、补全、审查                  |

**它们的关系**：不是"插件"关系，而是**对等协作**。通过 ACP 协议，Hermes 可以把任务委派给 Claude Code，反之亦然。

```text
┌─────────────────────────────────────────────┐
│              Orchestrator (Hermes)           │
│         负责：任务分解、调度、汇总            │
└──────────────┬──────────────┬───────────────┘
               │              │
       ┌───────▼──────┐ ┌────▼────────┐
       │  Claude Code  │ │    Codex    │
       │  (Worker)     │ │  (Worker)   │
       │  代码实现/测试 │ │  代码审查   │
       └──────────────┘ └─────────────┘
```

## 环境准备

### 1. 安装 Claude Code

```bash
npm install -g @anthropic-ai/claude-code

# 验证
claude --version
```

### 2. 安装 ACP 协议适配器

Claude Code 的 ACP 适配器让外部编排器（如 Hermes）能调用它：

```bash
npm install -g @agentclientprotocol/claude-agent-acp
```

### 3. 安装 Hermes

Hermes 作为 ACP 兼容的 Agent，有多种安装方式：

```bash
# 方式一：通过 Zenith 框架（推荐，包含 Hermes 支持）
pip install zenith-harness

# 方式二：通过 AionUi 桌面端（自动检测已安装的 Agent）
# 下载地址：https://github.com/iOfficeAI/AionUi
```

### 4. 配置 Hermes 的 Agent 路由

创建 `.hermes/config.yaml`：

```yaml
delegation:
  external_timeout_seconds: 900 # 外部 Agent 超时时间
  external_max_output_chars: 24000 # 单次最大输出字符数

agents:
  claude-code:
    command: 'claude-agent-acp'
    max_iterations: 50
    toolsets: ['terminal', 'file', 'web']
  codex:
    command: 'codex-acp'
    max_iterations: 30
    toolsets: ['terminal', 'file']
  hermes:
    max_iterations: 50
    toolsets: ['terminal', 'file', 'web']

# 任务路由规则：按关键词自动分配 Agent
routing:
  - match: 'implement|code|build'
    agent: 'claude-code'
  - match: 'test|review|audit'
    agent: 'codex'
  - match: 'plan|decompose|summarize'
    agent: 'hermes'
```

## 完整案例：构建 Todo API 服务

### 场景

构建一个 **Express.js + TypeScript 的 Todo API**，包含 CRUD 接口、数据验证、单元测试和 API 文档。

### Step 1：用 Hermes 做任务分解

在 Hermes 终端中初始化项目：

```bash
hermes init --workspace ./todo-api
```

然后给出需求：

```text
> 我需要构建一个 Express + TypeScript 的 Todo API：
> 1. GET /todos - 获取所有待办事项
> 2. POST /todos - 创建待办事项
> 3. PUT /todos/:id - 更新
> 4. DELETE /todos/:id - 删除
> 5. 使用内存存储（数组）
> 6. 添加 Jest 单元测试
> 7. 生成 OpenAPI 文档
>
> 请分解任务并分配给 Claude Code 和 Codex 并行执行。
```

Hermes 输出任务分解：

```text
[Hermes] 任务分解完成：
├── Task A: 项目初始化 + 类型定义     → claude-code
├── Task B: CRUD 路由实现             → claude-code
├── Task C: 单元测试编写              → codex
└── Task D: OpenAPI 文档生成          → hermes (self)
```

### Step 2：Hermes 委派任务给 Claude Code

Hermes 内部通过 `delegate_task` 函数派发任务到不同 Agent：

```python
delegate_task(tasks=[
  {
    "goal": "初始化 Express + TypeScript 项目，定义 Todo 接口",
    "context": "使用 express@4, typescript@5, 输出到 ./src/types.ts",
    "agent": "claude-code",
    "toolsets": ["terminal", "file"]
  },
  {
    "goal": "实现 CRUD 路由 /todos",
    "context": "基于 ./src/types.ts 中的 Todo 接口，实现内存存储的 CRUD",
    "agent": "claude-code",
    "toolsets": ["terminal", "file"]
  },
  {
    "goal": "编写 Jest 单元测试，覆盖率 > 80%",
    "context": "测试所有 CRUD 端点，包括边界情况",
    "agent": "codex",
    "toolsets": ["terminal", "file"]
  }
])
```

### Step 3：Claude Code 执行实现

Claude Code 在独立上下文中执行任务，生成以下文件：

**`src/types.ts`** — 类型定义

```typescript
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface CreateTodoDTO {
  title: string;
  completed?: boolean;
}

export interface UpdateTodoDTO {
  title?: string;
  completed?: boolean;
}
```

**`src/app.ts`** — CRUD 路由

```typescript
import express, { Request, Response } from 'express';
import { Todo, CreateTodoDTO, UpdateTodoDTO } from './types';

const app = express();
app.use(express.json());

const todos: Todo[] = [];
let nextId = 1;

// GET /todos
app.get('/todos', (_req: Request, res: Response) => {
  res.json(todos);
});

// POST /todos
app.post('/todos', (req: Request, res: Response) => {
  const dto: CreateTodoDTO = req.body;
  if (!dto.title || dto.title.trim() === '') {
    return res.status(400).json({ error: 'title is required' });
  }
  const todo: Todo = {
    id: String(nextId++),
    title: dto.title,
    completed: dto.completed ?? false,
    createdAt: new Date(),
  };
  todos.push(todo);
  res.status(201).json(todo);
});

// PUT /todos/:id
app.put('/todos/:id', (req: Request, res: Response) => {
  const todo = todos.find((t) => t.id === req.params.id);
  if (!todo) return res.status(404).json({ error: 'not found' });

  const dto: UpdateTodoDTO = req.body;
  if (dto.title !== undefined) todo.title = dto.title;
  if (dto.completed !== undefined) todo.completed = dto.completed;
  res.json(todo);
});

// DELETE /todos/:id
app.delete('/todos/:id', (req: Request, res: Response) => {
  const index = todos.findIndex((t) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'not found' });
  todos.splice(index, 1);
  res.status(204).send();
});

export default app;
```

**`src/server.ts`** — 入口文件

```typescript
import app from './app';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Step 4：Hermes 汇总并验证

Hermes 收到 Claude Code 和 Codex 的输出后，自动运行集成验证：

```text
[Hermes] 收到 Claude Code 输出：4 个文件已创建
[Hermes] 收到 Codex 输出：测试文件已创建，覆盖率 87%
[Hermes] 正在验证集成...
```

```bash
cd ./todo-api
npm install
npm test
```

### Step 5：Hermes 生成最终报告

```text
✅ 项目构建完成！

文件清单：
├── src/types.ts               (Todo 接口定义)
├── src/app.ts                 (CRUD 路由)
├── src/server.ts              (入口文件)
├── src/__tests__/app.test.ts  (12 个测试用例)
├── package.json
└── tsconfig.json

测试结果：12 passed, 0 failed
覆盖率：Statements 87%, Branches 80%, Lines 89%

下一步建议：
1. 添加持久化存储（SQLite/PostgreSQL）
2. 添加身份验证中间件
3. 部署到 Docker
```

## 使用 Zenith 作为替代编排层

[Zenith](https://github.com/Intelligent-Internet/zenith) 是另一个多 Agent 编排框架，支持 Claude Code、Codex 和 Hermes 作为底层执行器。它专注于**长运行任务**（持续数天或数周的开发任务）。

### 安装 Zenith

```bash
pip install zenith-harness
```

### 初始化项目

```bash
# 使用 Claude Code 作为编排器
uv run zenith init --workspace-dir ./my-app --agent claude

# 使用 Hermes 作为编排器
uv run zenith init --workspace-dir ./my-app --agent hermes
```

### Zenith 的多 Agent 工作流

Zenith 的工作流是**动态编排**的——编排器每轮决定下一步动作：

```text
编排器（Claude Code / Hermes）
    │
    ├── 读取任务状态
    ├── 决定：spawn worker / spawn tester / replan / stop
    │
    ├── Worker Agent（独立上下文）→ 执行编码任务 → 报告结果
    ├── Tester Agent（独立上下文）→ 运行测试 → 报告结果
    │
    └── 整合结果 → 下一轮决策
```

### Zenith 的 Provider 配置

Zenith 原生支持三种 Provider：

```python
# zenith 内部 providers.py 中的配置
PROVIDERS = {
    "claude": ProviderDefinition(
        name="claude",
        config_format="mcp_json",
        default_worker_acp_command="claude-agent-acp",
        acp_runtime_mode="bypassPermissions",
    ),
    "codex": ProviderDefinition(
        name="codex",
        config_format="codex_config",
        default_worker_acp_command="codex-acp",
    ),
    "hermes": ProviderDefinition(
        name="hermes",
        config_format="mcp_json",
        default_worker_acp_command="hermes acp",
        agent_output_dir=".hermes/agents",
    ),
}
```

:::tip 选择哪个编排器？

| 编排器     | 适合场景                     | 特点                   |
| ---------- | ---------------------------- | ---------------------- |
| **Hermes** | 中型项目，需要明确的任务路由 | 配置简单，路由规则清晰 |
| **Zenith** | 长运行任务，需要持续改进     | 动态编排，自我修复     |
| **Ruflo**  | 企业级，需要 100+ 预制 Agent | 集群协作，向量记忆     |

:::

## ACP 协议配置详解

ACP（Agent Client Protocol）是 Agent 之间的通信标准。以下是完整的配置参考：

### 快速配置（最小步骤）

只想让 Hermes 能调 Claude Code？三步：

**Step 1** — 安装 ACP 适配器：

```bash
npm install -g @agentclientprotocol/claude-agent-acp
```

**Step 2** — 创建最小配置 `~/.hermes/config.yaml`：

```yaml
agents:
  claude-code:
    command: 'claude-agent-acp'
```

**Step 3** — 验证：在 Hermes 里直接委派一个简单任务试试：

```text
> 用 claude-code 创建一个 hello.txt，内容写 "hello from acp"
```

能成功创建文件就说明 ACP 通了。

这三行配置就能让 Hermes 把任务委派给 Claude Code 了。路由规则、超时、工具集限制都是可选的，需要时再加。

### 全局 ACP 配置

```json
{
  "acp": {
    "version": "1.0",
    "providers": [
      {
        "name": "claude-code",
        "command": "claude-agent-acp",
        "supportsSystemPrompt": true,
        "runtimeMode": "bypassPermissions"
      },
      {
        "name": "hermes",
        "command": "hermes acp",
        "supportsSystemPrompt": true
      },
      {
        "name": "codex",
        "command": "codex-acp",
        "supportsSystemPrompt": false
      }
    ]
  }
}
```

### 关键配置项说明

| 配置项                      | 说明                  | 推荐值                          |
| --------------------------- | --------------------- | ------------------------------- |
| `external_timeout_seconds`  | 外部 Agent 超时时间   | 900（15 分钟）                  |
| `external_max_output_chars` | 单次最大输出字符数    | 24000                           |
| `max_iterations`            | 单 Agent 最大迭代次数 | 30-50                           |
| `toolsets`                  | 允许使用的工具集      | `["terminal", "file", "web"]`   |
| `acp_runtime_mode`          | 运行时权限模式        | `bypassPermissions`（开发环境） |

## 最佳实践

### 1. 任务拆分原则

:::tip 好的任务拆分

- 每个子任务目标单一、边界清晰
- 明确指定输入文件和输出文件
- 给出约束条件（框架版本、代码风格等）

:::

```text
✅ 好的拆分：
├── "实现用户注册 API（Express + TypeScript）" → claude-code
├── "编写注册接口测试（Jest，覆盖率>80%）"    → codex
└── "生成 OpenAPI 文档"                       → hermes

❌ 差的拆分：
└── "做一个完整的项目" → claude-code  （太模糊，没有约束）
```

### 2. 上下文隔离

每个 Agent 有独立上下文，**不会互相污染**：

```text
Claude Code 的上下文：仅包含实现相关的文件
Codex 的上下文：      仅包含测试相关的文件
Hermes 的上下文：     全局视图 + 所有 Agent 的摘要
```

### 3. 失败处理与重试

```yaml
# Hermes 配置重试策略
retry:
  max_attempts: 3
  backoff: exponential
  on_failure: 'escalate_to_orchestrator' # 失败时上报给编排器
```

### 4. 成本控制

多 Agent 会消耗更多 token，建议：

- 小项目（< 10 文件）：单独用 Claude Code，不需要编排
- 中型项目（10-50 文件）：Hermes + 1-2 个 Worker
- 大型项目（> 50 文件）：Zenith/Ruflo + 多个并行 Worker

## 配合 Agency Agents 使用

[Agency Agents](https://github.com/msitarzewski/agency-agents) 是一个开源的预制 AI Agent 角色库（266 个角色，20 个部门）。它跟 Hermes 的关系是：**Hermes 是编排器，Agency Agents 是角色定义，Claude Code 是执行者**。

```text
┌─────────────────────────────────────────────────────┐
│                  Hermes (编排器)                     │
│           分解任务 → 选角色 → 派发执行               │
└──────────┬─────────────────────┬────────────────────┘
           │                     │
    ┌──────▼──────┐       ┌──────▼──────┐
    │ Agency      │       │ Agency      │
    │ Agents      │       │ Agents      │
    │ (角色定义)  │       │ (角色定义)  │
    └──────┬──────┘       └──────┬──────┘
           │                     │
    ┌──────▼──────┐       ┌──────▼──────┐
    │ Claude Code │       │ Claude Code │
    │ (执行者)    │       │ (执行者)    │
    │ 前端开发    │       │ 安全审查    │
    └─────────────┘       └─────────────┘
```

### 为什么组合使用

| 单独用 Hermes                  | + Agency Agents                                    |
| ------------------------------ | -------------------------------------------------- |
| 委派任务时只说"实现 CRUD"      | 委派时指定角色："作为 Backend Architect 实现 CRUD" |
| Worker 用通用知识写代码        | Worker 加载专业角色的 checklist 和交付标准         |
| 输出质量靠模型能力             | 输出质量由角色定义固化，一致性更好                 |
| 每次需要描述"你是一个 XX 专家" | 一句话激活角色，无需重复描述                       |

### 安装 Agency Agents 到 Hermes

#### 方式一：按部门安装（推荐）

Hermes 的 Discord 集成有 8000 字符的命令 JSON 上限，所以**不要一次性装全部 266 个 Agent**，按部门分批装：

```bash
# 克隆 Agency Agents 仓库
git clone https://github.com/jnMetaCode/agency-agents-zh.git
cd agency-agents-zh

# 安装工程团队到 Hermes
./scripts/install.sh --tool hermes --category engineering

# 安装安全和测试团队
./scripts/install.sh --tool hermes --category security --category testing

# 安装产品和设计团队
./scripts/install.sh --tool hermes --category product --category design
```

安装后，Agent 文件会被复制到 `~/.hermes/skills/` 目录。

#### 方式二：全局安装到 Claude Code

如果你主要用 Claude Code 作为 Worker，也可以直接把 Agent 装到 Claude Code：

```bash
# 安装到 Claude Code（直接复制，无需转换）
./scripts/install.sh --tool claude-code --category engineering,security
```

安装后 Agent 文件在 `~/.claude/agents/` 目录。

:::tip 安装建议

- **按需安装**：只装你实际用到的 3-5 个部门，全量 266 个会让匹配变慢
- **Hermes 用 `--category` 分批**：避免 Discord 命令 JSON 超限
- **Claude Code 直接复制**：不需要 `convert.sh` 转换步骤

:::

### 在 Hermes 中激活 Agency Agent

安装完 Agency Agents 之后，**直接在对话里说角色名就行**——不需要改配置、不需要写代码。

Hermes 内置的角色识别会自动匹配到对应的 Agency Agent，然后把任务交给加载了该角色的 Claude Code Worker 去执行。

#### 直接用自然语言

在 Hermes 会话里，像跟人说话一样指派角色：

```text
> 让 Backend Architect 设计一个订单系统的 API，
> 然后让 Frontend Developer 基于 API 实现 React 组件，
> 最后让 Reality Checker 审查完整实现。
```

Hermes 识别出三个角色名，自动拆成三个子任务并行执行。

#### 常用句式

| 你说的话                                                    | Hermes 做了什么                                  |
| ----------------------------------------------------------- | ------------------------------------------------ |
| "让 Backend Architect 设计 API"                             | 派 Claude Code 加载 Backend Architect 角色去设计 |
| "用 Reality Checker 审一下这段代码"                         | 派 Claude Code 加载 Reality Checker 角色去审查   |
| "先让 Senior PM 出 PRD，再让 Frontend Developer 开发"       | 串行执行：先 PM 出需求，再交给前端实现           |
| "同时让 Security Architect 和 Performance Benchmarker 审查" | 并行执行：安全和性能两个维度同时审查             |

:::tip 角色名就是文件名

Agency Agents 安装后，每个角色对应一个 Markdown 文件。文件名就是角色名：

- `backend-architect.md` → 说"Backend Architect"就能激活
- `frontend-developer.md` → 说"Frontend Developer"就能激活
- `reality-checker.md` → 说"Reality Checker"就能激活

不确定有哪些角色？去 `~/.hermes/skills/` 目录看一眼文件名就知道。

:::

### 实战案例：三角色协作开发反馈系统

**场景**：开发一个用户反馈收集功能（提交反馈 + 管理员回复 + 状态流转）。

#### 完整流程

```text
[Hermes] 收到任务：开发用户反馈系统
[Hermes] 分解为 3 个子任务，分配角色：
├── Task 1: Backend Architect → 设计 API + 数据模型
├── Task 2: Frontend Developer → 实现 React 组件
└── Task 3: Reality Checker → 审查完整实现
```

**Step 1**：Hermes 委派 Backend Architect 角色给 Claude Code：

```text
[Hermes → Claude Code] 角色：Backend Architect
任务：设计用户反馈系统的 API 和数据库 Schema
```

Claude Code 加载 Backend Architect 角色定义后，输出：

- 完整的数据模型（feedbacks、feedback_replies、feedback_logs 三张表）
- RESTful API 端点（含请求/响应格式）
- 状态流转规则（pending → in_progress → replied → closed）

**Step 2**：Hermes 委派 Frontend Developer 角色：

```text
[Hermes → Claude Code] 角色：Frontend Developer
任务：基于上面的 API 设计，实现 FeedbackForm 和 AdminFeedbackPanel 组件
要求：React + TypeScript，移动端适配，错误状态覆盖
```

**Step 3**：Hermes 委派 Reality Checker 角色：

```text
[Hermes → Claude Code] 角色：Reality Checker
任务：审查 API + 前端实现
维度：安全（权限绕过、文件上传）、边界（空内容、超长文本）、
      体验（无障碍、错误提示）、数据一致性（状态流转漏洞）
输出格式：每条问题标注严重度（Critical / High / Medium / Low）+ 改进建议
```

**Step 4**：Hermes 汇总审查结果，生成修正任务：

```text
[Hermes] Reality Checker 发现 2 个 Critical、3 个 High、4 个 Medium 问题
[Hermes] 生成修正任务，委派 Frontend Developer 修复 Critical 和 High 问题
[Hermes] 修正完成，再次运行 Reality Checker 验证
[Hermes] 所有 Critical / High 问题已修复，Medium 记录为 TODO
```

### 推荐的角色组合

| 项目类型     | 推荐角色组合                                                                                | 安装命令                                           |
| ------------ | ------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **前端项目** | Frontend Developer + UI Designer + Reality Checker                                          | `--category engineering,design,testing`            |
| **后端项目** | Backend Architect + Security Architect + Database Optimizer                                 | `--category engineering,security`                  |
| **全栈项目** | Frontend Developer + Backend Architect + Reality Checker + DevOps Engineer                  | `--category engineering,testing`                   |
| **创业 MVP** | Growth Hacker + Rapid Prototyper + Frontend Developer + Backend Architect + Reality Checker | `--category marketing,product,engineering,testing` |
| **安全审计** | Security Architect + Pentest Specialist + Reality Checker                                   | `--category security,testing`                      |

### 自定义 Agency Agent

如果预制角色不满足需求，可以创建自定义 Agent。在 `~/.hermes/skills/` 目录下新建 Markdown 文件：

```markdown
# ~/.hermes/skills/my-backend-expert.md

## 身份

你是一个 Node.js 后端开发专家，擅长 NestJS 和 TypeORM。

## 核心原则

- 所有 API 必须有 OpenAPI 注解
- 使用 CQRS 模式分离读写
- 数据库迁移用 TypeORM migration，不用 sync
- 错误用自定义 ExceptionFilter 统一处理

## 工作流程

1. 理解需求 → 画数据流图
2. 定义 Entity + DTO
3. 实现 Service + Controller
4. 编写 e2e 测试

## 交付标准

- 每个 endpoint 有 Swagger 文档
- 测试覆盖率 ≥ 80%
- 有 docker-compose.yml 本地开发环境
```

Hermes 会自动检测新角色，无需重启。

:::info Agency Agents 的完整用法见 [Agency Agents 教程](./agency-agents.md)。
那里有 3 个完整案例（功能开发、产品+开发协作、全栈创业）和 266 个角色的速查表。
:::

## 常见问题

### Hermes 和 Claude Code 有什么区别？

Claude Code 是"执行者"（写代码、改代码），Hermes 是"编排者"（分解任务、分配给其他 Agent）。两者互补，不替代。

### 必须同时用两个吗？

不是。小项目单独用 Claude Code 就够了。只有当任务可以**并行拆分**时，才需要 Hermes 编排。

### Hermes 和 Zenith/Ruflo 选哪个？

- **Hermes**：轻量，适合单个开发者，配置简单
- **Zenith**：适合长运行任务（持续改进、自我修复）
- **Ruflo**：企业级，100+ 预制 Agent，集群协作

### ACP 协议安全吗？

ACP 的 `bypassPermissions` 模式会跳过权限确认。建议：

- 开发环境：使用 `bypassPermissions` 提高效率
- 生产环境：使用默认权限模式，每个操作需确认

## 相关资源

- [Zenith GitHub](https://github.com/Intelligent-Internet/zenith) — 长运行任务编排框架
- [hermes-agent-acp-skill](https://github.com/Rainhoole/hermes-agent-acp-skill) — Hermes ACP 委派技能
- [Agency Agents](https://github.com/msitarzewski/agency-agents) — 266 个预制 AI Agent 角色库
- [Agency Agents 中文版](https://github.com/jnMetaCode/agency-agents-zh) — 含 50 个中国市场原创角色
- [Ruflo](https://github.com/ruvnet/ruflo) — 企业级 Agent 元执行层
- [AionUi](https://github.com/iOfficeAI/AionUi) — 多 Agent 桌面管理界面
- [CC Switch](https://github.com/farion1231/cc-switch) — 跨平台 Agent 管理工具

## 下一步

- [Agency Agents](./agency-agents) — 266 个预制角色库，配合 Hermes 使用
- [多智能体工作流](./multi-agent) — Claude Code 原生多 Agent 用法
- [Ruflo](./ruflo) — 企业级 Agent 集群方案
- [自动化与 CI/CD](./automation) — 在自动化流程中集成多 Agent
