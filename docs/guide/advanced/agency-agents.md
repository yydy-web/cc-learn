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
