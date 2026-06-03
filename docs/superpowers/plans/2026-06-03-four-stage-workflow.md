# 完善最佳实践：四阶段工作流 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将最佳实践页面中的工具介绍重新组织为四阶段工作流（Gstack 治理 → OpenSpec 规格 → Superpowers 纪律 → Ralph 自动化），并添加组合使用指南。

**Architecture:** 重写 `docs/tips/best-practices.md` 中的"工作流模式"部分，将分散的工具介绍整合为一个连贯的四阶段流水线，每个阶段明确职责和推荐工具，最后添加组合使用场景。

**Tech Stack:** Rspress v2, Markdown/MDX

---

## File Structure

| 操作 | 文件 | 职责 |
|------|------|------|
| 修改 | `docs/tips/best-practices.md` | 重写"工作流模式"部分为四阶段流水线 |

---

### Task 1: 重写工作流模式为四阶段流水线

**Files:**
- Modify: `docs/tips/best-practices.md:36-153`

- [ ] **Step 1: 替换"工作流模式"部分**

将现有的 `## 工作流模式` 到 `## 省钱技巧` 之间的全部内容替换为：

```markdown
## 工作流模式

### 基础模式

#### TDD 模式

```
> 用 TDD 方式实现一个邮箱验证函数：
> 1. 先写测试
> 2. 运行测试确认失败
> 3. 写最小实现让测试通过
> 4. 重构优化
```

#### 审查模式

```
> /plan
> 帮我规划一下如何重构 src/auth/ 模块，分析现有的问题和改进方案
```

#### 探索模式

```
> 我刚接手这个项目，帮我：
> 1. 梳理整体架构
> 2. 找到核心业务逻辑
> 3. 识别潜在的技术债务
```

### 四阶段工作流：从想法到发布

当你的项目足够复杂，需要一套完整的开发流程时，可以组合使用四个工具，形成从想法到发布的闭环：

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Gstack  │───▶│ OpenSpec │───▶│Superpowers│───▶│  Ralph   │
│  治理    │    │  规格    │    │  纪律    │    │  自动化  │
│          │    │          │    │          │    │          │
│ 定义做什么│    │ 怎么做   │    │ 按规范做 │    │ 持续做   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
```

#### 阶段一：Gstack 治理——定义做什么

[Gstack](/guide/advanced/gstack) 提供工程团队视角的治理能力，帮你用 YC 式的提问和多角色审查来**定义正确的问题**。

```
> /office-hours
> 我想给 SaaS 产品添加多租户支持

> /plan-ceo-review
> 审查这个功能的商业价值和优先级

> /plan-eng-review
> 审查技术架构方案
```

Gstack 的 `/office-hours` 会用 6 个核心问题帮你挖掘真实需求，`/plan-ceo-review` 和 `/plan-eng-review` 从不同角度审查方案。**确保你在解决正确的问题。**

:::tip
不确定该做什么功能？先用 `/office-hours` 做产品拷问，再用 `/plan-ceo-review` 确定优先级。
:::

#### 阶段二：OpenSpec 规格——定义怎么做

[OpenSpec](/guide/advanced/openspec) 将治理阶段的决策转化为**结构化的规格文档**，让 AI 和人对齐"要构建什么"。

```
> /opsx:propose add-multi-tenancy
> 基于 Gstack 的审查结果，创建多租户功能的规格文档

> /opsx:apply
> 按照规格文档的任务清单实现
```

OpenSpec 的规格文档（proposal → specs → design → tasks）提交到 Git，成为**持久化的项目文档**。下次修改时，新的提案基于已有规格生成增量变更。

:::info
规格文档是活文档——它描述系统当前的行为。归档后，新提案会基于这些规格生成增量变更。
:::

#### 阶段三：Superpowers 纪律——按规范执行

[Superpowers](/guide/advanced/superpowers) 在实现阶段提供**开发纪律**——强制执行 TDD、头脑风暴、代码审查。

```
> 使用 Superpowers 工作流，按照 OpenSpec 的任务清单实现多租户功能
```

Superpowers 会：
1. **头脑风暴**：在写代码前充分理解需求
2. **TDD**：每个任务先写测试再实现
3. **代码审查**：对照规格文档审查实现质量
4. **完成验证**：有证据才能说完成

:::warning
Superpowers 严格执行"先测试后代码"规则。如果代码在测试之前写好，会被要求删除重来。
:::

#### 阶段四：Ralph 自动化——持续执行

[Ralph](/guide/advanced/ralph) 将规格文档转化为**自主循环执行**，适合大型功能的批量实现。

```
> /prd
> 将 OpenSpec 的规格转换为 PRD

> /ralph
> 将 PRD 转换为 prd.json
```

然后在终端运行：

```bash
./scripts/ralph/ralph.sh --tool claude
```

Ralph 每次迭代使用**全新上下文**，通过 Git 历史和 `progress.txt` 跨迭代积累知识。所有故事完成后自动退出。

:::tip
Ralph 特别适合"离开电脑，回来时功能已经开发完毕"的场景。确保 PRD 中的用户故事足够小，每个故事能在一次上下文窗口内完成。
:::

### 四阶段组合场景

#### 场景一：新功能开发（完整流程）

```
1. Gstack: /office-hours 探索需求 → /plan-eng-review 审查架构
2. OpenSpec: /opsx:propose 创建规格 → 审阅规格文档
3. Superpowers: TDD 驱动实现 → 代码审查
4. Gstack: /review 审查代码 → /qa 测试 → /ship 发布
```

#### 场景二：快速迭代（跳过规格）

```
1. Gstack: /plan-ceo-review 确认优先级
2. Superpowers: 头脑风暴 → TDD → 审查
3. Gstack: /ship 发布
```

#### 场景三：大型功能自主开发

```
1. Gstack: /office-hours + /plan-eng-review 定义方向
2. OpenSpec: /opsx:propose 创建详细规格
3. Ralph: 将规格转为 PRD → 自主循环执行
4. Gstack: /review + /qa 做最终审查
```

#### 场景四：代码审查和质量保障

```
1. CodeGraph: 快速探索代码结构
2. Code Review Graph: Blast-Radius 影响分析
3. Gstack: /review Staff Engineer 级审查 + /cso 安全审计
```
```

- [ ] **Step 2: Commit**

```bash
git add docs/tips/best-practices.md
git commit -m "docs: reorganize best practices into four-stage workflow pipeline"
```

---

### Task 2: 构建验证

**Files:**
- None (verification only)

- [ ] **Step 1: 运行生产构建**

Run: `npm run build`
Expected: 所有页面构建成功，无报错。`doc_build/tips/best-practices.html` 应包含新的四阶段工作流。

- [ ] **Step 2: 检查生成的页面**

确认 `doc_build/tips/best-practices.html` 正确生成。
