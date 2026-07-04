---
title: Ruflo — Agent 元执行层
description: Ruflo 为 Claude Code 叠加集群协作、向量记忆、后台工人和自动学习能力——从单 Agent 到 Agent 集群，一个插件搞定
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★★☆☆ |
| 🧪 测试 | ★★★☆☆ | ★★★★☆ |
| 📦 产品 | ★★☆☆☆ | ★★★★★ |

**🎯 学习产出：** 掌握 Ruflo 工作流，能独立通过集群协作、向量记忆和后台工人构建自动化开发管线

**🚀 AI 能力提升：** 多智能体、自动化工作流
:::

# Ruflo — Agent 元执行层

> Claude Code 是引擎。Ruflo 是涡轮增压——加上集群协作、向量记忆、12 个后台工人、100+ 预制 Agent，让你的 Agent 真正"能干活"。

## 这是什么

[Ruflo](https://github.com/ruvnet/ruflo) 是一个 Agent **元执行层**（meta-harness）。它不替代 Claude Code——它裹在 Claude Code 外面，给它加基础设施：

```text
Claude Code 裸机                    Claude Code + Ruflo
─────────────────                  ─────────────────────
一次一个 Agent                      Swarm 集群并行协作
会话结束记忆丢失                      HNSW 向量记忆，跨会话持久化
只能手动触发                        12 个后台工人自动触发（审计、优化、补测试……）
只用 Anthropic 模型                 5 家 LLM 提供商 + 智能路由 + 故障转移
手动协调任务                        MCP Server + 路由器自动分发
```

核心公式：**Agent = Model + Harness**。模型产生文本，Harness 提供工具、记忆、协调——让 Agent 真正能做事。

### 跟其他工具的关系

| 工具 | 做什么 | Ruflo 怎么配合 |
|------|--------|--------------|
| **Agency Agents** | 预制 Agent 角色库 | Ruflo 的 100+ Agent 可以直接用 Agency Agents 的角色定义 |
| **Superpowers** | 开发流程编排 | Ruflo 的 Swarm 模式可以并行跑 Superpowers 的 brain→plan→execute 流程 |
| **Multi-agent Workflow** | Claude Code 原生多 Agent | Ruflo 替代原生编排：自带路由器、共识机制、故障转移 |

## 安装和配置

### 前置条件

- Claude Code 已安装并认证
- Node.js ≥ 18

### 方式一：完整安装（推荐）

一条命令装全部——CLI、MCP Server、所有插件：

```bash
# macOS / Linux / WSL
curl -fsSL https://cdn.jsdelivr.net/gh/ruvnet/ruflo@main/scripts/install.sh | bash
```

跨平台（含 Windows）：

```bash
npx ruflo@latest init wizard
```

安装向导会引导你完成：选 LLM 提供商 → 配置 API Key → 选要装的插件 → 注册 MCP Server。

### 方式二：Claude Code 插件（轻量）

只装 slash commands + Agent 定义，不注册 MCP（功能受限，无 memory/swarm）：

```text
/plugin marketplace add ruvnet/ruflo
/plugin install ruflo-core@ruflo
/plugin install ruflo-swarm@ruflo
/plugin install ruflo-rag-memory@ruflo
```

:::warning
轻量安装**没有** MCP Server——`memory_store`、`swarm_init` 等核心功能不可用。推荐完整安装。
:::

### MCP Server 注册

完整安装后，注册 MCP Server 让 CC 能调用 ruflo 的工具：

```bash
claude mcp add ruflo -- npx ruflo@latest mcp start
```

注册成功后，CC 会话中可用 ~210 个 MCP 工具（跨 5 个服务器组）。

### 安装验证

```text
> 列出 ruflo 可用的后台工人
```

如果 CC 能列出 12 个 worker（audit、optimize、testgaps 等），安装成功。

## 核心概念

Ruflo 有四个核心概念。不需要全懂——按需了解。

### Agents

Ruflo 自带 100+ 预制 Agent（coder、tester、reviewer、architect、security 等）。跟 Agency Agents 的角色定义互补——Ruflo 管执行基础设施，角色库管领域知识。

```text
> 用 ruflo 的 security-audit Agent 扫描 src/ 目录
```

### Swarms（集群）

多个 Agent 组成集群——分级、网状、自适应三种拓扑：

| 拓扑 | 工作方式 | 适用场景 |
|------|---------|---------|
| **分级** | Queen Agent 分配任务给 Worker | 大型项目分解 |
| **网状** | Agent 对等通信，无中心节点 | 多维度代码审查 |
| **自适应** | 根据任务复杂度自动选拓扑 | 不确定用哪个时 |

```text
> 启动 swarm，用 3 个 Agent 从安全、性能、功能三个维度审查 src/
```

Swarms 带共识机制（Raft / Byzantine / Gossip），一个 Agent 挂了不影响整体。

### Memory（向量记忆）

HNSW 索引的向量数据库（AgentDB），跨会话持久化。裸 CC 会话结束记忆就没了——Ruflo 的 memory 能：

- 记住项目架构决策
- 记住之前的 bug 修复模式
- 跨 Agent 共享上下文

实测数据：N=20k 时检索比暴力搜索快 ~1.9 倍。

### Background Workers（后台工人）

12 个自动触发的后台进程，不用你手动调用：

| Worker | 做什么 | 触发条件 |
|--------|--------|---------|
| **audit** | 安全审计 | 代码变更 |
| **optimize** | 性能优化建议 | 复杂度 > 阈值 |
| **testgaps** | 检测未覆盖分支 | 覆盖率变化 |
| **docs** | 自动补文档 | 新增 public API |
| **deps** | 依赖更新检查 | 定时 |
| **lint** | 代码风格检查 | 代码变更 |
| **format** | 自动格式化 | 保存文件 |
| **migrate** | 数据库迁移检查 | Schema 变更 |
| **observe** | 可观测性报告 | 定时 |
| **cost** | Token 成本追踪 | 会话结束 |
| **backup** | 关键文件备份 | 定时 |
| **health** | 系统健康检查 | 定时 |

### 关键要点

1. **完整安装优于轻量安装** — 少了 MCP Server，swarm 和 memory 的核心功能都用不了
2. **不需要全懂四个概念** — 先用 Agents + Workers。Swarm 有需要再开，Memory 是自动的
3. **Workers 是 Ruflo 最被低估的功能** — 12 个自动触发的后台进程，等于 12 个不占会话上下文的微型 Agent

## 实战案例

### 案例 1：自动化代码质量 pipeline

**场景**：你改了一段代码，push 之前想确保没有安全漏洞、性能没问题、文档也补了。手动跑太慢。Ruflo 的后台工人能自动触发这个流程。

**核心机制**：Ruflo 的 12 个 Workers 是"触发式"的——不是定时跑，是特定事件触发。改代码触发 audit + optimize + testgaps，补 API 触发 docs。

#### Step 1：开启 Workers

```text
用户: 开启 ruflo 的质量相关 workers：audit、optimize、testgaps、docs、lint。
设置：代码变更时自动触发，结果输出到 .ruflo/reports/ 目录。
```

CC 确认：

```text
已启用 5 个 Workers：

| Worker | 触发条件 | 输出 |
|--------|---------|------|
| audit | src/** 文件变更 | .ruflo/reports/audit-{timestamp}.md |
| optimize | 函数复杂度 > 10 | .ruflo/reports/optimize-{timestamp}.md |
| testgaps | 测试覆盖率变化 | .ruflo/reports/testgaps-{timestamp}.md |
| docs | 新增 exported 函数 | .ruflo/reports/docs-{timestamp}.md |
| lint | src/** 文件变更 | .ruflo/reports/lint-{timestamp}.md |

所有 Worker 在后台运行，不占用当前会话上下文。
```

#### Step 2：正常写代码，Workers 自动工作

```text
用户: 帮我重构 src/services/order.ts 里的 calculateTotal 函数。
现在太长了（80 行），拆成更小的函数。
```

CC 帮你重构。重构完成后，Workers 自动触发：

```text
[ruflo worker: optimize]
✅ calculateTotal 重构后复杂度从 18 降到 4

[ruflo worker: lint]
✅ 无 lint 错误

[ruflo worker: testgaps]
⚠️ 新的拆分函数 createLineItem、applyDiscount 缺少单元测试
→ 建议补充测试用例，详见 .ruflo/reports/testgaps-20260702.md

[ruflo worker: audit]
✅ 无安全漏洞

[ruflo worker: docs]
✅ 已为 createLineItem、applyDiscount 生成 JSDoc
```

你不用手动跑任何检查——改完代码，报告已经在 `.ruflo/reports/` 里了。

#### Step 3：读报告 + 补漏

```text
用户: 读 .ruflo/reports/testgaps-20260702.md，给 createLineItem 和 applyDiscount 补测试。
```

CC 读报告，自动生成测试代码：

```typescript
// tests/services/order.test.ts
describe('createLineItem', () => {
  it('正常商品创建行项目', () => {
    const item = createLineItem({ productId: 'p1', quantity: 2, price: 99 })
    expect(item.subtotal).toBe(198)
  })

  it('数量为 0 时抛出异常', () => {
    expect(() => createLineItem({ productId: 'p1', quantity: 0, price: 99 }))
      .toThrow('quantity must be positive')
  })
})

describe('applyDiscount', () => {
  it('百分比折扣', () => {
    expect(applyDiscount(200, { type: 'percent', value: 20 })).toBe(160)
  })

  it('折扣后金额不为负', () => {
    expect(applyDiscount(10, { type: 'fixed', value: 100 })).toBe(0)
  })

  it('非法折扣类型抛异常', () => {
    expect(() => applyDiscount(100, { type: 'invalid', value: 10 }))
      .toThrow('unknown discount type')
  })
})
```

补完后再跑一次测试，testgaps Worker 确认覆盖率回升。

### 关键要点

1. **Workers 不是提醒你做事——是替你做了**。报告已经生成好了，你只需要读和确认
2. **Worker 不占上下文**——跟 Claude Code 会话并行运行，不用切换出去跑检查再切回来
3. **testgaps 最有价值**——重构后最怕没发现漏测试，这个 Worker 自动帮你盯
4. **报告路径固定** `.ruflo/reports/`——建议加到 `.gitignore`，但 CI 里可以选装

### 案例 2：Swarm 协同开发 — 一个功能，三个 Agent 并行

**场景**：要开发"用户权限管理"功能。需求已经明确了——你需要三个 Agent 同时开工：一个写后端、一个写前端、一个做安全审查。传统 CC 要串行，Ruflo 用 Swarm 并行。

**跟案例 1 的区别**：案例 1 用 Workers 做自动化检查和报告，是"后台触发"模式。案例 2 用 Swarm 做并行开发和审查，是"主动协作"模式。

#### Step 1：启动 Swarm

```text
用户: 启动 ruflo swarm，用分级拓扑，1 个 Queen + 2 个 Worker Agent。

任务：实现"用户权限管理"功能。

需求摘要：
- RBAC 模型（管理员 / 编辑者 / 查看者 三个角色）
- 权限检查中间件（Express）
- 前端权限组件（按钮显隐、路由守卫）
- 权限配置管理页面

Queen Agent：分解任务、协调进度、合并输出
Worker-A（backend-agent）：Express 中间件 + API + 数据库迁移
Worker-B（frontend-agent）：权限组件 + 管理页面 + 路由守卫

每个 Agent 完成后自动触发 audit worker 审查。
```

CC 输出：

```text
Swarm 已启动。拓扑：分级（Queen + 2 Worker）。

Queen 正在分解任务：
1. Worker-A（backend）: 数据库 Schema → 中间件 → API 端点 → 集成测试
2. Worker-B（frontend）: 权限 HOC → 路由守卫 → 管理页面 → 组件测试

依赖：前端依赖后端 API 格式。Worker-A 先输出 API 契约 → Worker-B 基于契约开发。

工作时，3 个 Agent 的输出流入共享 memory，互相可见。
```

#### Step 2：Worker-A 完成后端

```text
[Worker-A] 开始实现后端...
```

输出摘要：

```typescript
// src/middleware/rbac.ts
type Role = 'admin' | 'editor' | 'viewer'

interface Permission {
  resource: string    // 'users', 'projects', 'settings'
  action: 'create' | 'read' | 'update' | 'delete'
}

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [
    { resource: '*', action: 'create' },
    { resource: '*', action: 'read' },
    { resource: '*', action: 'update' },
    { resource: '*', action: 'delete' },
  ],
  editor: [
    { resource: 'projects', action: 'create' },
    { resource: 'projects', action: 'read' },
    { resource: 'projects', action: 'update' },
    { resource: 'users', action: 'read' },
  ],
  viewer: [
    { resource: 'projects', action: 'read' },
    { resource: 'users', action: 'read' },
  ],
}

export function requirePermission(resource: string, action: Permission['action']) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole: Role = req.user?.role
    if (!userRole) return res.status(401).json({ error: '未认证' })

    const permissions = ROLE_PERMISSIONS[userRole]
    const hasPermission = permissions.some(
      p => (p.resource === '*' || p.resource === resource) && p.action === action
    )

    if (!hasPermission) return res.status(403).json({ error: '无权限' })
    next()
  }
}
```

```typescript
// src/routes/users.ts
router.get('/users', requirePermission('users', 'read'), async (req, res) => {
  const users = await User.findAll()
  res.json(users)
})

router.delete('/users/:id', requirePermission('users', 'delete'), async (req, res) => {
  await User.destroy({ where: { id: req.params.id } })
  res.status(204).send()
})
```

```text
[Worker-A] 后端完成。
- 数据迁移：roles 表 + user_roles 关联表
- 中间件：requirePermission（通用，支持通配符）
- API 端点：users CRUD（含权限保护）
- 测试：12 个用例，覆盖率 89%
- 输出 API 契约到共享 memory

[ruflo worker: audit]
✅ 无安全漏洞。权限中间件未发现绕过路径。
```

#### Step 3：Worker-B 并行开发前端

Worker-B 读取共享 memory 中的 API 契约，开始实现：

```tsx
// components/WithPermission.tsx
import { useAuth } from '@/hooks/useAuth'

interface WithPermissionProps {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function WithPermission({
  resource, action, children, fallback = null
}: WithPermissionProps) {
  const { hasPermission } = useAuth()
  const allowed = hasPermission(resource, action)
  return allowed ? <>{children}</> : <>{fallback}</>
}

// 使用示例
<WithPermission resource="users" action="delete">
  <Button variant="danger">删除用户</Button>
</WithPermission>
```

```tsx
// components/RouteGuard.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function RouteGuard({
  resource, action, children
}: { resource: string; action: string; children: React.ReactNode }) {
  const { hasPermission, isAuthenticated } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" />
  if (!hasPermission(resource, action)) return <Navigate to="/403" />
  return <>{children}</>
}
```

```text
[Worker-B] 前端完成。
- WithPermission 组件（声明式权限控制）
- RouteGuard（路由级权限）
- 权限管理页面（角色 → 权限矩阵的 CRUD）
- 测试：8 个用例
```

#### Step 4：Queen 合并 + 审查

```text
[Queen] Worker-A 和 Worker-B 均已完成。正在合并...

合并结果：
- 前端权限组件调用后端 API 端点 ✅（契约匹配）
- 前端 admin 角色的全权限映射正确 ✅
- 后端 middleware 的 resource 通配符 `*` 前端已对应 ✅

[Queen] 触发 audit + testgaps workers 审查...

[ruflo worker: audit]
⚠️ Medium: 前端 WithPermission 的 fallback 渲染 null 不够友好
→ 建议：未授权时显示"你没有此操作的权限"提示

[ruflo worker: testgaps]
⚠️ 缺少：前端权限配置页面的 E2E 测试
→ 建议：验证普通用户看不到"删除用户"按钮，管理员能看到
```

#### Step 5：根据审查补漏

```text
用户: 修 audit 和 testgaps 的两个问题。
1. WithPermission 的 fallback 默认值渲染 <PermissionDenied /> 组件
2. 补前端 E2E 测试
```

CC 修正后：

```tsx
// 修正 WithPermission 的 fallback
export function WithPermission({
  resource, action, children, fallback = <PermissionDenied resource={resource} action={action} />
}: WithPermissionProps) {
  // ...
}

// 新增 PermissionDenied 组件
function PermissionDenied({ resource, action }: { resource: string; action: string }) {
  return (
    <div className="permission-denied" role="alert">
      <Icon name="lock" />
      <p>你没有{action === 'read' ? '查看' : '操作'}{resource}的权限</p>
      <Button variant="link" onClick={() => window.history.back()}>返回</Button>
    </div>
  )
}
```

```typescript
// tests/e2e/permissions.spec.ts
test('viewer cannot see delete button', async ({ page }) => {
  await loginAs('viewer')
  await page.goto('/users')
  await expect(page.getByRole('button', { name: '删除用户' })).not.toBeVisible()
})

test('admin can delete user', async ({ page }) => {
  await loginAs('admin')
  await page.goto('/users')
  await page.getByRole('button', { name: '删除用户' }).first().click()
  await expect(page.getByText('用户已删除')).toBeVisible()
})
```

### 关键要点

1. **Swarm 不是银弹——独立任务才并行**。前后端共享 API 契约时天然并行，有强依赖的任务还是串行
2. **Queen Agent 的价值在合并**——两个 Worker 各自完成容易，但谁保证前后端接口一致？Queen 做这个
3. **Worker 输出流入共享 memory**——比存文件效率高，HNSW 向量检索可以按语义找（"那个关于权限的接口定义"）
4. **Swarm + Workers 组合是最强形态**——Swarm 做并行开发，Workers 做自动审查，全程自动化

---

## 常用命令速查

### 基础命令

| 想做什么 | 命令 |
|---------|------|
| 初始化 ruflo | `npx ruflo@latest init wizard` |
| 启动 MCP Server | `claude mcp add ruflo -- npx ruflo@latest mcp start` |
| 列出所有 Workers | `ruflo workers list` |
| 开启 Worker | `ruflo workers enable <name>` |
| 查看 Worker 状态 | `ruflo workers status` |
| 列出所有 Agent | `ruflo agents list` |
| 列出可用插件 | `ruflo plugins list` |
| 安装插件 | `ruflo plugins install <name>` |

### Swarm 命令

| 想做什么 | 命令 |
|---------|------|
| 启动分级 Swarm | `ruflo swarm init --topology hierarchical --workers 3` |
| 启动网状 Swarm | `ruflo swarm init --topology mesh --workers 4` |
| 查看 Swarm 状态 | `ruflo swarm status` |
| 停止 Swarm | `ruflo swarm stop` |

### 插件速查

| 分类 | 关键插件 | 干什么 |
|------|---------|--------|
| **编排** | ruflo-swarm, ruflo-autopilot, ruflo-workflows | Agent 集群和自动化 |
| **记忆** | ruflo-agentdb, ruflo-rag-memory | 向量记忆和 RAG |
| **质量** | ruflo-testgen, ruflo-security-audit, ruflo-aidefence | 测试生成、安全审计、注入防护 |
| **学习** | ruflo-intelligence, ruflo-goals | SONA 学习模式和目标规划 |
| **运维** | ruflo-observability, ruflo-cost-tracker | 可观测性和成本追踪 |

---

## 总结

Ruflo 是 Claude Code 的"超频模式"。它不改变 CC 的工作方式——它给 CC 加了四样裸机没有的东西：

| 裸 CC 缺的 | Ruflo 给的 | 一句话 |
|-----------|-----------|--------|
| 协同 | Swarms | 多个 Agent 同时干活，不是轮流干活 |
| 记忆 | AgentDB | 跨会话记住项目知识，不用每次重新描述 |
| 自动化 | 12 Workers | 审计、测试、文档不用手动触发 |
| 容错 | 多 LLM 路由 | Anthropic 挂了自动切 GPT |

三个原则：

1. **Workers 优先** — 最直接的价值。开 audit、testgaps、docs 三个就能覆盖 80% 的需求
2. **Swarm 按需用** — 只有任务天然可并行时才开。3 个文件的代码审查值得并行，一个文件的修改不需要
3. **Memory 是底层** — 不需要手动操作。AgentDB 自动索引项目知识，跨 Agent 自动共享

:::info 延伸阅读
- Ruflo 仓库：[github.com/ruvnet/ruflo](https://github.com/ruvnet/ruflo)
- Ruflo Web UI：[flo.ruv.io](https://flo.ruv.io)（多模型聊天 + MCP 工具调用）
- Goal Planner：[goal.ruv.io](https://goal.ruv.io)（目标规划前端）
- Agent 角色库配合使用：[Agency Agents 使用教程](./agency-agents.md)
- 多 Agent 编排模式：[多智能体工作流](./multi-agent.md)
:::
