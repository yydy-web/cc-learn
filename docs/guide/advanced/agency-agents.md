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

## 实战案例

### 案例 1：功能开发 — 从前端到后端到测试的 Agent 接力

**场景**：要给 SaaS 产品加一个"用户反馈收集"功能。用户可以在应用内提交反馈（文字 + 截图），管理员在后台查看和回复。

**为什么用这三个 Agent：**

| Agent | 负责 | 为什么选它 |
|-------|------|-----------|
| Backend Architect | API 设计 + 数据库 Schema | 不是简单 CRUD——反馈需要分类、状态流转、管理员回复，直接开工容易漏 |
| Frontend Developer | React 组件实现 | 反馈表单有文件上传、状态展示、管理界面三个独立组件 |
| Reality Checker | 测试用例 + 质量审查 | 三个组件 + API 交互的边界容易出错，需要系统审查 |

#### Step 1：Backend Architect 设计 API

```text
用户: activate Backend Architect mode.

我要设计一个用户反馈收集功能的 API。需求：
1. 用户可以在应用内提交反馈（文字内容 + 可选截图）
2. 反馈有状态：待处理 → 处理中 → 已回复 → 已关闭
3. 管理员可以查看反馈列表（支持筛选）、回复反馈、关闭反馈
4. 需要记录操作日志（谁在什么时候做了什么）

请输出：
- 数据模型（表结构）
- RESTful API 端点列表（含请求/响应格式）
- 状态流转规则
```

CC 输出（Backend Architect 角色）：

```text
## 用户反馈系统 — API 设计

### 数据模型

**feedbacks 表**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 提交用户 |
| content | TEXT | 反馈内容 |
| category | ENUM | bug/feature/experience/other |
| status | ENUM | pending/in_progress/replied/closed |
| attachments | JSONB | 截图 URL 列表 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

**feedback_replies 表**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| feedback_id | UUID | 关联反馈 |
| admin_id | UUID | 回复管理员 |
| content | TEXT | 回复内容 |
| created_at | TIMESTAMP | 回复时间 |

**feedback_logs 表**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| feedback_id | UUID | 关联反馈 |
| operator_id | UUID | 操作人 |
| action | VARCHAR | 操作类型 |
| changes | JSONB | 变更内容 |
| created_at | TIMESTAMP | 操作时间 |

### API 端点

**用户端：**
- `POST /api/feedbacks` — 提交反馈
  - Body: `{ content: string, category: enum, attachments?: string[] }`
  - Response: `201 { id, status: "pending", ... }`

- `GET /api/feedbacks/mine` — 我的反馈列表
  - Query: `?status=pending&page=1&size=20`
  - Response: `200 { items: Feedback[], total: number }`

**管理端：**
- `GET /api/admin/feedbacks` — 反馈列表（支持筛选）
  - Query: `?status=pending&category=bug&page=1&size=20`
  - Response: `200 { items: Feedback[], total: number }`

- `POST /api/admin/feedbacks/:id/reply` — 回复反馈
  - Body: `{ content: string }`
  - Response: `200 { reply: Reply }`

- `PATCH /api/admin/feedbacks/:id/status` — 更新状态
  - Body: `{ status: "in_progress" | "replied" | "closed" }`
  - Response: `200 { feedback: Feedback }`

### 状态流转

```
pending → in_progress → replied → closed
  ↓                       ↓
closed                  closed
```
- pending 可以直接关闭（垃圾反馈）
- 只有 replied 后才能关闭（正常关闭）
- 不能从 closed 跳回其他状态
```

#### Step 2：Frontend Developer 实现 UI

```text
用户: activate Frontend Developer mode.

基于上面的 API 设计，实现前端组件：
1. FeedbackForm — 用户提交反馈的表单（文字输入 + 分类选择 + 截图上传）
2. FeedbackList — 用户的反馈列表页（分页、状态标签、回复内容展示）
3. AdminFeedbackPanel — 管理员面板（筛选、列表、回复表单、状态变更）

要求：
- React + TypeScript
- 移动端适配
- 错误状态和加载状态覆盖
```

CC 输出（Frontend Developer 角色，摘录核心组件）：

```tsx
// components/FeedbackForm.tsx
import { useState } from 'react'

type Category = 'bug' | 'feature' | 'experience' | 'other'

export function FeedbackForm() {
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<Category>('bug')
  const [attachments, setAttachments] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError('请输入反馈内容')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // 1. 上传附件获取 URL
      const attachmentUrls = await Promise.all(
        attachments.map(f => uploadFile(f))
      )

      // 2. 提交反馈
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          category,
          attachments: attachmentUrls,
        }),
      })

      if (!res.ok) throw new Error('提交失败')

      // 3. 清空表单 + 跳转
      setContent('')
      setCategory('bug')
      setAttachments([])
      // router.push('/feedbacks')
    } catch (e) {
      setError(e instanceof Error ? e.message : '提交失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={e => { e.preventDefault(); handleSubmit() }}>
      {error && <div role="alert" className="error-banner">{error}</div>}

      <label>
        反馈类型
        <select value={category} onChange={e => setCategory(e.target.value as Category)}>
          <option value="bug">Bug 报告</option>
          <option value="feature">功能建议</option>
          <option value="experience">使用体验</option>
          <option value="other">其他</option>
        </select>
      </label>

      <label>
        反馈内容
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="请详细描述你遇到的问题或建议..."
          rows={5}
          required
        />
      </label>

      <label>
        截图（可选）
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={e => setAttachments(Array.from(e.target.files || []))}
        />
      </label>

      <button type="submit" disabled={submitting}>
        {submitting ? '提交中...' : '提交反馈'}
      </button>
    </form>
  )
}
```

```tsx
// components/AdminFeedbackPanel.tsx
import { useState, useEffect } from 'react'

type Status = 'pending' | 'in_progress' | 'replied' | 'closed'
type Category = 'bug' | 'feature' | 'experience' | 'other'

interface Feedback {
  id: string
  user_id: string
  content: string
  category: Category
  status: Status
  attachments: string[]
  created_at: string
}

export function AdminFeedbackPanel() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('pending')
  const [replyContent, setReplyContent] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchFeedbacks()
  }, [statusFilter])

  const fetchFeedbacks = async () => {
    setLoading(true)
    const params = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
    const res = await fetch(`/api/admin/feedbacks${params}`)
    const data = await res.json()
    setFeedbacks(data.items)
    setLoading(false)
  }

  const handleReply = async (feedbackId: string) => {
    const content = replyContent[feedbackId]?.trim()
    if (!content) return

    await fetch(`/api/admin/feedbacks/${feedbackId}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    setReplyContent(prev => ({ ...prev, [feedbackId]: '' }))
    fetchFeedbacks()
  }

  const handleStatusChange = async (feedbackId: string, status: Status) => {
    await fetch(`/api/admin/feedbacks/${feedbackId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchFeedbacks()
  }

  return (
    <div className="admin-panel">
      <div className="filters">
        {(['all', 'pending', 'in_progress', 'replied', 'closed'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={statusFilter === s ? 'active' : ''}
          >
            {s === 'all' ? '全部' : s}
          </button>
        ))}
      </div>

      {loading ? (
        <div>加载中...</div>
      ) : feedbacks.length === 0 ? (
        <div className="empty-state">暂无反馈</div>
      ) : (
        <ul className="feedback-list">
          {feedbacks.map(f => (
            <li key={f.id} className="feedback-card">
              <div className="feedback-header">
                <span className={`status-badge status-${f.status}`}>{f.status}</span>
                <span className="category-badge">{f.category}</span>
                <time>{new Date(f.created_at).toLocaleDateString()}</time>
              </div>
              <p className="feedback-content">{f.content}</p>

              {f.attachments.length > 0 && (
                <div className="attachments">
                  {f.attachments.map((url, i) => (
                    <img key={i} src={url} alt={`截图 ${i + 1}`} />
                  ))}
                </div>
              )}

              <div className="reply-section">
                <textarea
                  value={replyContent[f.id] || ''}
                  onChange={e => setReplyContent(prev => ({ ...prev, [f.id]: e.target.value }))}
                  placeholder="输入回复..."
                  rows={3}
                />
                <button onClick={() => handleReply(f.id)}>回复</button>
              </div>

              <div className="status-actions">
                <button onClick={() => handleStatusChange(f.id, 'in_progress')}>标记处理中</button>
                <button onClick={() => handleStatusChange(f.id, 'closed')}>关闭</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

#### Step 3：Reality Checker 审查

```text
用户: activate Reality Checker mode.

审查上面的反馈系统设计（API + 前端组件）。我不需要你夸它——我付钱给你就是让你找问题。

需要审查的维度：
1. 安全隐患（所有输入点、权限边界、文件上传）
2. 边界和异常（空内容、超长文本、并发提交）
3. 用户体验（无障碍、错误提示、移动端）
4. 数据一致性（状态流转的漏洞）

每条问题标注严重度（Critical / High / Medium / Low）和改进建议。
```

CC 输出（Reality Checker 角色）：

```text
## 反馈系统审查报告

### Critical（必须修，可能导致数据问题或安全漏洞）

**1. 用户只能看自己的反馈，但 API 没有强制（权限绕过）**
- 问题：`GET /api/feedbacks/mine` 没有说明怎么确定"mine"——是 JWT 里的 user_id 还是前端传
- 如果后端信任前端传的 user_id，用户 A 传 user_id=B 就能看别人的反馈
- 建议：端点改为 `GET /api/feedbacks`，user_id 从 JWT 提取，不在请求中传递

**2. 附件上传没有类型和大小限制**
- 问题：前端 `accept="image/*"` 只是 HTML 校验，后端需要再次验证
- 攻击者可以上传 .exe 改名为 .jpg，或者上传 1GB 的文件 DoS
- 建议：后端校验 MIME 类型白名单（image/png, image/jpeg, image/webp），单文件限制 10MB

### High（重要，影响用户体验或数据质量）

**3. 反馈内容没有长度限制**
- 问题：textarea 没有 maxLength，用户可以提交 100KB 的文本
- 建议：前端和后端都限制 5000 字符

**4. 状态流转从 pending 直接到 closed 的逻辑不完整**
- 问题：什么情况下可以跳过 in_progress 和 replied？文档说了"垃圾反馈"，但没定义"垃圾"的标准
- 如果管理员滥用此路径，用户的反馈会被静默关闭
- 建议：直接关闭需要填写关闭理由，并通知提交用户

**5. 管理员面板没有反馈排序**
- 问题：反馈列表只支持筛选，不支持排序。优先处理功能应有"最旧优先"/"最新优先"
- 建议：添加 sort=created_at:asc/desc 参数

### Medium（影响体验，不阻塞功能）

**6. 反馈提交成功没有 toast/提示**
- 问题：表单清空后用户不知道提交是否成功
- 建议：添加成功 toast "反馈已提交，我们会尽快处理"

**7. 管理面板的"加载中"太简陋**
- 问题：一个 "加载中..." 文字在空白页面上，让管理员以为页面卡死了
- 建议：加 skeleton screen 或至少一个 spinner

**8. 附件预览不处理加载失败**
- 问题：`<img>` 没有 onError 处理，图片加载失败是裂图
- 建议：加 fallback 占位图

### Low（锦上添花）

**9. 没有键盘快捷键**
- 问题：管理员处理大量反馈时，每一条都要鼠标点回复 → 输入 → 点按钮
- 建议：Ctrl+Enter 提交回复，方向键切换反馈条目
```

#### 根据审查修改

```text
用户: 修 Critical 和 High 的问题。先修后端 API 的安全问题，再修前端组件的体验问题。
```

CC 会依次修正每个问题，输出更新后的代码。此处省略完整修正过程——实际使用时 CC 会逐个点修改。

:::info
这个案例体现了 Agency Agents 的核心价值：**同一段对话中，三个专业角色接力完成，每个角色都在自己的领域做到位**。Backend Architect 不会写出漏边界的 API，Reality Checker 不会因为跟开发者是"同一个人"就手下留情。
:::

### 关键要点

1. **先 API 后 UI** — Backend Architect 先定接口，Frontend Developer 对着接口实现，避免写完发现数据对不上
2. **Reality Checker 放最后** — 不是因为它不重要，而是它需要审查完整实现才能发现跨层问题
3. **审查要明确维度** — 说"帮我审查"不如说"从安全、边界、体验、一致性四个维度审查"，输出质量差 3 倍
4. **同一个 Agent 不需要一次用完** — 开发时用 Frontend Developer，审查时切 Reality Checker，反馈回来再切回 Frontend Developer 修——Agent 切换没有成本

### 案例 2：产品+开发协作 — 从 PRD 到交付的跨职能团队

**场景**：SaaS 管理后台要新增一个"团队协作看板"功能。需要先理清需求（PM）、再定交互（设计）、再开发（前端）、最后验证效果（实验）。一个人扮演四个角色，用四个 Agent 保证每个环节的专业度。

**跟案例 1 的区别**：案例 1 是纯开发流水线，案例 2 覆盖了**产品决策和设计评审**——这些环节开发通常不擅长，但 Agency Agents 有专门的 Agent。

| Agent | 负责 | 关键产出 |
|-------|------|---------|
| Senior Product Manager | 需求分析 + PRD | 用户故事、验收标准、优先级排序 |
| UI Designer | 交互设计 | 组件布局、交互方案、设计规范 |
| Frontend Developer | 实现 | React 组件 |
| Experiment Tracker | A/B 实验 | 实验假设、指标定义、样本量计算 |

#### Step 1：Senior PM 出 PRD

```text
用户: activate Senior Product Manager mode.

我们的 SaaS 管理后台需要加一个"团队协作看板"功能。

业务背景：
- 当前用户通过"任务列表"管理项目，但团队反馈看不到整体进度
- 竞品（Linear、Monday）都有看板视图，客户流失与此相关
- 目标用户：10-50 人团队的项目管理者

请输出：
1. 用户故事（As a... I want... So that...）
2. 功能验收标准（Acceptance Criteria）
3. 优先级排序（P0 必须做，P1 应该做，P2 锦上添花）
4. 不做清单（明确排除的功能）
```

CC 输出（Senior PM 角色）：

```text
## 团队协作看板 — 产品需求文档

### 用户故事

**US-1 (P0) — 看板基础视图**
As a 项目经理
I want 在拖拽式看板上看到所有任务的状态分布
So that 我能一眼了解项目整体进度

**US-2 (P0) — 拖拽改变状态**
As a 团队成员
I want 拖拽卡片到不同列来更新任务状态
So that 状态更新更方便，不用点进详情页再修改

**US-3 (P1) — 按负责人筛选**
As a 项目经理
I want 筛选只显示某个成员的任务
So that 能在站会上聚焦讨论每个人的进度

**US-4 (P1) — 列自定义**
As a 项目经理
I want 自定义看板有哪些列（状态）
So that 适配不同团队的工作流（有的团队有"代码审查"列，有的没有）

**US-5 (P2) — 泳道分组**
As a 项目经理
I want 按 Sprint/迭代分组显示任务（泳道视图）
So that 能同时看到多个 Sprint 的进度对比

### 验收标准（US-1 + US-2，P0）

**US-1 看板视图：**
- 页面加载后 2 秒内显示看板
- 默认 4 列：待处理 → 进行中 → 审查中 → 已完成
- 每列显示该状态的任务卡数量
- 任务卡显示：标题、负责人头像、截止日期（如有）、标签颜色
- 空状态：没有任务时显示引导"暂无任务，创建第一个任务吧"
- 移动端：列变为水平滚动

**US-2 拖拽交互：**
- 拖拽卡片到新列 → API 更新状态 → 乐观更新 UI（不等 API 返回就移动卡片）
- 拖拽到非法区域（如两列之间）→ 卡片弹回原位
- 拖拽中显示插入指示线
- API 失败 → 卡片弹回 + toast 提示"更新失败，状态已恢复"

### 优先级排序

| 优先级 | 功能 | 理由 |
|--------|------|------|
| P0 | US-1 看板视图 + US-2 拖拽 | 核心体验，没有这两项算不上看板 |
| P1 | US-3 人员筛选 + US-4 列自定义 | 解决两个最高频诉求 |
| P2 | US-5 泳道分组 | 数据量大时才需要，前期 YAGNI |

### 不做清单

- 不建 WIP 限制（在制品数量限制）— 需求不明确
- 不接甘特图视图 — 已有任务列表，再做甘特图属于功能膨胀
- 不做实时协作（多人在线编辑同一看板）— 技术复杂度太高，SaaS MVP 不值得
```

#### Step 2：UI Designer 出交互方案

```text
用户: activate UI Designer mode.

上面 PM 出了看板功能的 PRD。请出交互方案，覆盖：

1. 看板页面布局（桌面端 1440px / 移动端 375px）
2. 卡片设计（不同状态的视觉差异）
3. 拖拽交互反馈（拖拽中、拖拽成功、拖拽失败）
4. 筛选和自定义列的入口设计

输出格式：文字描述组件树 + 交互状态表。不需要 Figma 设计稿。
```

CC 输出（UI Designer 角色，摘要）：

```text
## 看板交互方案

### 组件树

BoardPage
├── BoardToolbar
│   ├── MemberFilter（下拉多选，带搜索）
│   ├── ColumnCustomizer（按钮 → 弹出配置面板）
│   └── ViewSwitcher（看板 / 列表切换）
├── BoardColumns（横向滚动容器）
│   └── BoardColumn × N
│       ├── ColumnHeader（名称 + 卡片数量 pill）
│       └── CardList
│           └── TaskCard × N
│               ├── CardTitle
│               ├── AssigneeAvatar
│               ├── DueDate（如有，过期变红）
│               └── LabelBadge（颜色点）
└── DragOverlay（拖拽中的卡片镜像，不占文档流）

### 拖拽交互状态

| 状态 | 视觉反馈 | 持续时间 |
|------|---------|---------|
| 抓取 | 卡片轻微放大（scale 1.05）+ 阴影 | 即时 |
| 拖拽中 | 原位置变半透明（opacity 0.3），光标跟随半透明卡片 | 持续 |
| 进入目标列 | 目标列高亮（蓝色边框），显示插入指示线 | 持续 |
| 放置成功 | 卡片滑入新位置（transition 0.2s） | 200ms |
| 放置失败 | 卡片弹回原位（spring animation） | 400ms |
| API 失败 | 卡片弹回 + 顶部红色 toast | toast 5s 后消失 |
```

#### Step 3：Frontend Developer 实现

```text
用户: activate Frontend Developer mode.

基于上面的 PRD 和交互方案，实现看板组件。

要求：
- React + TypeScript
- 拖拽用 @dnd-kit/core（不用 react-beautiful-dnd，它已停止维护）
- 乐观更新（先移动卡片再调 API）
- 移动端水平滚动
```

CC 输出（Frontend Developer 角色，核心代码）：

```tsx
// components/board/BoardPage.tsx
import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { BoardColumn } from './BoardColumn'
import { TaskCard } from './TaskCard'
import type { Task, Column, BoardData } from './types'

const DEFAULT_COLUMNS: Column[] = [
  { id: 'todo', title: '待处理' },
  { id: 'in_progress', title: '进行中' },
  { id: 'review', title: '审查中' },
  { id: 'done', title: '已完成' },
]

export function BoardPage() {
  const [board, setBoard] = useState<BoardData>({ columns: DEFAULT_COLUMNS, tasks: [] })
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  useEffect(() => {
    fetchBoard()
  }, [])

  const fetchBoard = async () => {
    const res = await fetch('/api/board')
    const data = await res.json()
    setBoard(data)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const task = board.tasks.find(t => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as Task['status']

    const task = board.tasks.find(t => t.id === taskId)
    if (!task || task.status === newStatus) return

    // 乐观更新：先移动再调 API
    const previousBoard = board
    setBoard(prev => ({
      ...prev,
      tasks: prev.tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ),
    }))

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('更新失败')
    } catch {
      // 失败回滚
      setBoard(previousBoard)
      setError('状态更新失败，请重试')
      setTimeout(() => setError(null), 5000)
    }
  }

  return (
    <div className="board-page">
      {error && (
        <div className="toast toast-error" role="alert">
          {error}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="board-columns">
          {board.columns.map(col => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={board.tasks.filter(t => t.status === col.id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
```

:::tip
完整实现（含 Column 组件、Card 组件、移动端水平滚动、筛选和列自定义）约 400 行，CC 会一次性输出。这里只摘录核心的拖拽逻辑展示模式。
:::

#### Step 4：Experiment Tracker 出 A/B 测试计划

```text
用户: activate Experiment Tracker mode.

看板功能上线前要做 A/B 测试。请出实验计划，验证看板是否真的提升了团队效率。

背景：
- 当前用户用"任务列表"管理项目（对照组 A）
- 我们要验证"看板视图"（实验组 B）是否提升以下指标
- 产品 DAU ~3000 人，其中创建过任务列表的约 40%（~1200 人）
```

CC 输出（Experiment Tracker 角色）：

```text
## 看板功能 A/B 测试计划

### 实验假设

**主假设**：看板视图比列表视图能提升任务状态更新频率 15% 以上
**次假设**：看板视图能降低"任务逾期率"（未按时完成的任务占比）

### 指标定义

| 指标 | 定义 | 目标 |
|------|------|------|
| **Primary Metric** — 任务状态更新率 | 每个用户每天更新的任务数 / 该用户的总任务数 | +15% vs 对照组 |
| **Secondary Metric** — 任务逾期率 | 超过截止日期仍未完成的任务数 / 总任务数 | -10% vs 对照组 |
| **Guardrail Metric** — 页面加载时间 | 看板页面 p95 加载时间 | 不超过列表页的 1.5 倍 |
| **Guardrail Metric** — 任务误操作率 | 用户撤销拖拽 / 拖拽后 10 秒内手动改回的比例 | < 5% |

### 实验设计

- **随机单元**：Team（团队级随机，避免同一团队内部分用户有看板部分没有的混乱）
- **分配比例**：50/50
- **预计样本量**：~600 个团队（1200 人 / 平均 2-3 人/团队）
- **实验时长**：14 天（覆盖两个 Sprint 周期）
- **最小检测效应**：任务状态更新率提升 15%
- **统计显著性**：α=0.05, β=0.2 (power=0.8)

### 实验分组

| 组别 | 团队数 | 体验 |
|------|--------|------|
| Control (A) | ~300 团队 | 现有任务列表视图，无变化 |
| Treatment (B) | ~300 团队 | 顶部新增"看板视图"Tab，默认仍为列表 |

:::info
为什么默认仍是列表？因为不能强制改变用户的已有习惯。真正的衡量标准是用户**主动切换**到看板后是否更高效。
:::

### 数据埋点（需要开发埋的点，赶在看板上线前做）

| 事件 | 触发时机 | 属性 |
|------|---------|------|
| `board_view_opened` | 用户切换到看板视图 | team_id, has_existing_tasks |
| `board_task_dragged` | 拖拽完成（非 API 层，UI 层） | task_id, from_status, to_status |
| `board_task_drag_reverted` | 拖拽后 10s 内手动改回 | task_id |
| `board_view_closed` | 用户切换回列表 | board_view_duration_seconds |

### 决策标准

| 结果 | 决策 |
|------|------|
| Primary Metric 显著 + 所有 Guardrail 通过 | **全量上线** |
| Primary Metric 显著但 Guardrail 失败 | **先修性能/误操作，再上线** |
| Primary Metric 不显著 | **否定假设。分析原因（可能看板对开发团队价值不大）** |
| Secondary Metric 反而恶化 | **紧急复查——可能拖拽太容易导致随意变更状态** |
```

### 关键要点

1. **跨职能协作的陷阱是 PM 和设计被跳过** — 开发直接写代码是本能。但 Senior PM 理清需求的 15 分钟，能省开发 2 小时返工
2. **Experiment Tracker 的价值不在方案本身** — 在于逼你想清楚"上线后怎么验证成功"。没有 Guardrail Metric 的计划是废纸
3. **四个 Agent 的产出是活的文档** — PRD、交互方案、组件、实验计划可以存到项目 docs/ 目录，新成员入职读一遍就通

### 案例 3：全栈创业 -- idea 到 MVP 的一人军团

**场景**：你有个创业想法——"SaaS 竞品监控"平台，自动追踪竞品的网站变更、定价调整、新功能上线。但你没团队。用 Agency Agents 模拟一个完整的创业团队，从市场验证到 MVP 实现，一个人全搞定。

**为什么选这五个 Agent：**

| Agent | 角色 | 阶段 |
|-------|------|------|
| Growth Hacker | 验证 idea 有没有市场 | 市场调研 |
| Rapid Prototyper | 出 MVP 功能清单和原型 | 产品定义 |
| Backend Architect | 后端架构（爬虫 + 数据 + API） | 技术实现 |
| Frontend Developer | 前端界面（仪表盘 + 报告页） | 技术实现 |
| Reality Checker | 最终审查 | 质量把关 |

#### Step 1：Growth Hacker 验证市场

```text
用户: activate Growth Hacker mode.

我要做一个"SaaS 竞品监控"平台。核心功能：
- 自动追踪竞品官网变更（爬虫检测页面变化）
- 监控竞品定价页的价格调整
- 追踪竞品社交媒体动态和新功能发布

请从增长和市场的角度分析：
1. 这个赛道的市场机会和风险
2. 目标用户画像（谁会为这个买单）
3. 竞品分析（已有类似产品吗）
4. MVP 的差异化切入点
5. 获客策略建议
```

CC 输出（Growth Hacker 角色，摘要）：

```text
## SaaS 竞品监控 — 市场分析

### 赛道判断：有机会，但需要差异化

**市场机会：**
- 全球 SaaS 市场 2026 年预计超 $300B，增长放缓意味着竞争加剧
- 头部企业（Salesforce、HubSpot）有专职竞品分析团队，中小 SaaS 全靠手动
- Google Alerts 和 Mention 只覆盖关键字，不做结构化竞品追踪

**目标用户：**
- 主要：SaaS 产品经理（需要向上汇报竞品动向）
- 次要：SaaS 市场负责人（需要调整定价和定位策略）
- 付费意愿：如果替代 2-3 小时/周的手动竞品调研，$29-49/月是合理的

**竞品分析：**
| 竞品 | 做什么 | 弱点 |
|------|--------|------|
| Crayon | 企业级竞品情报（起步 $10K/年） | 太贵，不对中小 SaaS |
| Kompyte | 竞品追踪和销售情报 | 侧重销售团队，PM 觉得太重 |
| Visualping | 网页变更监控 | 只管检测，不做竞品分析和报告 |
| 手动 Google Alerts | 免费 | 噪音太多，无结构化分析 |

**差异化切入点：**
不做"竞品情报平台"——做**"PM 的竞品雷达"**。定位：自动追踪 → 结构化分析 → 周报推送，$29/月，10 分钟配置。

**获客策略：**
1. Product Hunt 首发（目标人群集中）
2. "监控你的前 3 个竞品，免费" — SEO 内容营销 + 个人品牌
3. SaaS 社区（Indie Hackers, Hacker News）发布免费竞品分析报告引流
```

#### Step 2：Rapid Prototyper 出 MVP 功能清单

```text
用户: activate Rapid Prototyper mode.

基于上面的市场分析，出"SaaS 竞品监控"的 MVP 功能清单和用户流程。

约束：
- 只有一个开发者（我），MVP 必须在 2 周内完成
- 后端用 Node.js + PostgreSQL，前端用 React + Tailwind
```

CC 输出（Rapid Prototyper 角色）：

```text
## 竞品监控 MVP — 功能清单

### 原则：两周能交付，但能用

砍掉所有"nice to have"，只留"用户愿意付费的核心"。

### MVP 功能（V1）

**1. 竞品管理（2 天）**
- 添加竞品（名称 + 官网 URL + 分类标签）
- 竞品列表 + 搜索
- 每个竞品一个详情页

**2. 页面监控（4 天）**
- 自动抓取竞品定价页、功能页、Blog 首页（可配置 URL）
- 页面变更检测（文本 diff + 截图 diff）
- 变更记录时间线

**3. 周报生成（2 天）**
- 每周自动生成"竞品动态周报"
- 内容：本周变更摘要 + 变更详情 + 趋势标注
- 支持邮件推送和在线查看

**4. 用户系统（1 天，用 Clerk/Auth0 不自己写）**
- 注册/登录
- 套餐管理（免费版：追踪 3 个竞品）

**5. 支付集成（1 天，用 Stripe Checkout）**
- 月付 $29

### 不做清单（V2 再说）

| 功能 | 为什么不做 |
|------|-----------|
| 社交媒体监控 | 开发量大（需要各平台 API），MVP 先聚焦网站 |
| AI 分析摘要 | 不确定用户是否真的需要 AI 写摘要，先用规则生成 |
| 团队协作 | 一个人买就够了，团队版是 V4 的事 |
| 自定义仪表盘 | 先给固定模板，有了 20 个付费用户再谈自定义 |

### 用户流程

```
注册（Clerk → 3 秒）
  ↓
引导：添加第一个竞品
  ↓
配置监控页面（预填常见页面：pricing, features, blog）
  ↓
等待首次变更（通常 24-48 小时）
  ↓
收到第一封周报邮件 → 回来查看变更详情
  ↓
付费（免费额度用完 → Stripe 支付）
```

### 数据模型草图

```
Competition
  id, user_id, name, website, tags, created_at

MonitoredPage
  id, competition_id, url, page_type, last_content_hash, last_screenshot_url

PageChange
  id, page_id, detected_at, diff_summary, screenshot_url, is_reviewed

WeeklyReport
  id, user_id, week_start, summary, sent_at
```
```

#### Step 3：Backend Architect + Frontend Developer 并行实现

```text
用户: 现在同时启动 Backend Architect 和 Frontend Developer，分别实现后端和前端。

先让 Backend Architect 设计：
- 爬虫调度机制（定时抓取 + 变更检测）
- API 端点和数据库表结构

再让 Frontend Developer 设计：
- 竞品管理页（添加、列表、详情）
- 变更时间线页
- 周报查看页
```

（两个 Agent 的详细输出此处省略——模式跟案例 1 相同，只是领域不同。）

#### Step 4：Reality Checker 终审

```text
用户: activate Reality Checker mode.

审查整个"SaaS 竞品监控" MVP 方案：
- 市场分析是否经得起推敲
- MVP 范围是否合理（有没有两周做不完的）
- 前后端实现是否有遗漏
- 支付和用户系统是否完整
```

CC 输出（Reality Checker 角色，摘要）：

```text
## MVP 审查报告

### 市场分析 — 2 个问题

1. **$29/月定价的依据不够实** — 说"中小 SaaS 愿意付 $29-49/月"，但没有用户访谈数据。建议：先找 5 个目标用户做 15 分钟通话验证。
2. **"PM 的竞品雷达"定位偏窄** — 如果市场负责人也需要，产品名和页面文案要留弹性。

### MVP 范围 — 1 个风险

**"自动抓取"被严重低估了**。不是调个 axios.get 就完事：
- 很多网站有 Cloudflare/反爬保护
- 定价页可能是 JavaScript 渲染的
- 需要 Playwright/Puppeteer 渲染 + 截图
- 4 天不够，建议 6 天（砍用户系统的时间来补——用 Clerk 确实 1 天够了）

### 实现遗漏

**爬虫需要队列管理**。不是定时跑一次就行：
- 竞品越多抓取时间越长 → 需要任务队列（Bull/BullMQ）
- 抓取失败重试策略（3 次，指数退避）
- 爬虫 IP 被禁的降级方案（代理池或降频）

### 支付系统遗漏

- Stripe Checkout 只处理付款，不处理订阅管理（续费/取消/发票）
- 需要 webhook 处理 Stripe 事件（subscription.updated, subscription.deleted）
- 免费额度用完的拦截点在哪儿？前端和后端都要检查
```

#### 修正后启动

```text
用户: 基于上面的审查意见：
1. 把"自动抓取"的时间估计改为 6 天
2. 加任务队列（BullMQ）
3. 补 Stripe webhook 处理
4. 先做用户访谈再写代码

其他按原计划执行。
```

### 关键要点

1. **Growth Hacker 在开发前先验证，省的是整个 MVP 的返工** — 需求错了，代码写得再好也是白写
2. **Rapid Prototyper 的"不做清单"比功能清单更重要** — MVP 的敌人不是能力不足，是想做太多
3. **Reality Checker 在创业场景尤其关键** — 一个人做所有事，盲区是系统性的。必须有另一个"人"逼你面对被忽视的问题
4. **这 5 个 Agent 组成的是一个迷你创业公司** — CEO（Growth Hacker）、CPO（Prototyper）、CTO（Backend Architect）、工程师（Frontend Developer）、QA（Reality Checker），一个人操作

## 进阶技巧

### 自定义 Agent

所有的 Agent 都是 Markdown 文件。Fork 仓库，新建 `.md` 文件就能创建自己的 Agent：

```markdown
# engineering/engineering-golang-developer.md

## 身份
你是一个 Go 后端开发专家，擅长高并发系统和微服务架构。

## 核心原则
- 错误永远显式处理，不用 panic
- 优先用标准库，不轻易引入第三方依赖
- 每个 handler 必须有 context 超时

## 工作流程
1. 理解需求 → 画数据流图
2. 定义 interface
3. 实现 + 测试（table-driven tests）
4. Benchmark（如果涉及热路径）

## 交付标准
- 每个 package 有 README
- 每个 exported function 有 doc comment
- 测试覆盖率 ≥ 80%
- 有性能测试结果
```

然后运行安装脚本即可使用。

### Agent 组合模式速查

| 模式 | 适用场景 | 示例 |
|------|---------|------|
| **串联（接力）** | 线性流程，上一阶段输出是下一阶段输入 | API 设计 → UI 实现 → 测试审查 |
| **并联（并行）** | 多维度独立分析 | 三 Agent 同时审查：安全 + 性能 + 功能 |
| **网状（审查）** | 需要跨领域共识 | 前端和设计互相审查 |
| **星型轮询** | 以核心文档为轴，多 Agent 轮流审 | PRD 写好 → PM 审 → 技术审 → 安全审 → 回到 PM |
| **双轨** | 两条独立路径同时推进 | 前后端同时开发，API 文档做契约 |

### 常见坑

**1. Agent 切换太频繁**

❌ 每句话换一个 Agent：
```text
activate PM → 分析需求
activate Designer → 设计布局
activate Developer → 写一行代码
activate PM → 回去确认需求
```

✅ 一个阶段用一个 Agent，阶段完成后再切：
```text
activate PM，完成整个需求分析（包括追问和修正）
→ activate Developer，基于完整的需求文档实现
```

**2. 同时激活太多 Agent**

❌ 一次性激活 5 个 Agent："你同时是 PM、设计师、前端、后端和 QA"
→ 角色混乱，输出介于几个角色之间，哪个都不专业

✅ 顺序激活，或最多 2 个互补角色并行（如前后端并行开发需要两个 Agent）

**3. 角色提示词太长**

Agency Agents 的 Agent 定义文件每个都有 100-200 行。如果在一个会话中频繁切换，上下文会快速占满。

✅ 在长会话中，只在使用某个 Agent 时才激活。用完可以"解除激活"（虽然 CC 不会真的卸载，但后续对话不再受角色约束）

**4. 不读 Agent 文件就用**

每个 Agent 的 Markdown 文件里有很多有用的信息——工作流程、checklist、常见陷阱。激活 Agent 后花 1 分钟让它列出自己的核心原则，比直接用效果更好：

```text
> activate Frontend Developer mode.
> 先告诉我你的核心工作原则和交付标准。
```

---

## 常用 Agent 速查表

### 按场景选 Agent

| 我要做什么 | 推荐 Agent | 属于哪个团队 |
|-----------|-----------|------------|
| 写 React/Vue 组件 | Frontend Developer | engineering |
| 设计 REST API | Backend Architect | engineering |
| 优化数据库查询 | Database Optimizer | engineering |
| CI/CD 部署 | DevOps Engineer | engineering |
| 安全审计 | Security Architect / Pentest Specialist | security |
| 性能优化 | Performance Benchmarker | testing |
| 功能测试 | Reality Checker / Evidence Collector | testing |
| API 测试 | API Tester | testing |
| 写 PRD | Senior Product Manager | product |
| UI/UX 设计 | UI Designer / UX Researcher | design |
| SEO/SEM | SEO Specialist / PPC Strategist | marketing |
| 数据分析 | Analytics Reporter | marketing |
| 项目排期 | Sprint Prioritizer / Jira Steward | project-management |
| 财务模型 | Financial Analyst / FP&A Specialist | finance |
| 游戏开发 | Unity Developer / Unreal Developer / Godot Developer | game-development |
| GIS/地图 | GIS Analyst / Web GIS Developer | gis |
| MCP Server 开发 | MCP Builder | specialized |

### 推荐默认团队组合

| 项目类型 | 最少配置（2-3 个 Agent） | 完整配置（5+ 个 Agent） |
|---------|------------------------|----------------------|
| 前端项目 | Frontend Developer + UI Designer + Reality Checker | + Performance Benchmarker + Accessibility Tester |
| 后端项目 | Backend Architect + Reality Checker | + Security Architect + Database Optimizer + DevOps Engineer |
| 全栈项目 | Frontend Developer + Backend Architect + Reality Checker | + UI Designer + Security Architect + DevOps Engineer |
| 创业 MVP | Growth Hacker + Rapid Prototyper + Frontend Developer + Backend Architect + Reality Checker | + UI Designer + Experiment Tracker + Financial Analyst |
| 内容/SEO | Content Creator + SEO Specialist + Analytics Reporter | + Social Media Manager + Email Marketing Specialist |

---

## 总结

Agency Agents 的核心价值不是"有 232 个 Agent"——而是**把专业知识固化了**。不再依赖每次手动写"你是一个 XX 专家"的提示词，不再担心每次输出的角色漂移。

三个原则：

1. **按需装载** — 项目只用 3-5 个 Agent，不要因为 232 个都可用就全装
2. **阶段切换** — 一个阶段一个 Agent，阶段完成再切下一个。写代码时就别让 PM Agent 插嘴
3. **审查必不可少** — 不管哪个场景，永远留一个 Reality Checker 在最后。一个人的盲区需要另一个"人"来找

:::info 延伸阅读
- Agency Agents 仓库：[github.com/msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents)
- 多 Agent 编排模式：[多智能体工作流](./multi-agent.md)
- Workflow 脚本编写：[Superpowers 使用教程](./superpowers.md)
:::
