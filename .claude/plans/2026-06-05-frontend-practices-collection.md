# 前端最佳实践集合 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 创建一个前端开发工具链集成的文档集合，将 Git 工作流、Superpowers、GStack、OpenSpec、Ralph、CodeGraph、Context7、Serena 完整融入前端开发实践，并提供详细的实战场景。

**Architecture:** 在 `docs/tips/frontend-practices/` 下创建 3 个新页面：集成工作流概述、实战工作流详解、场景实战指南。同时增强现有 `docs/tips/frontend-best-practices.md` 的工具链部分，添加对新集合的引用。更新 `docs/tips/_meta.json` 添加新页面导航。

**Tech Stack:** Rspress v2, MDX, Markdown, TypeScript config

---

## File Structure

```
docs/tips/
  _meta.json                              # Modify: 添加 frontend-practices/ 集合页面
  frontend-best-practices.md              # Modify: 增强工具链集成部分，添加集合引用
  frontend-practices/
    _meta.json                            # Create: 集合页面排序
    index.md                              # Create: 集合首页 — 工具全景图 + 工作流概述
    integrated-workflow.md                # Create: 集成工作流详解（5 阶段）
    scenarios.md                          # Create: 详细实战场景（6 个完整案例）
```

---

### Task 1: 创建集合目录和元数据文件

**Files:**
- Create: `docs/tips/frontend-practices/_meta.json`

- [ ] **Step 1: 创建集合目录和 _meta.json**

```json
["index", "integrated-workflow", "scenarios"]
```

- [ ] **Step 2: 验证目录创建**

Run: `ls docs/tips/frontend-practices/`
Expected: `_meta.json` 文件存在

- [ ] **Step 3: 提交**

```bash
git add docs/tips/frontend-practices/_meta.json
git commit -m "feat: create frontend-practices collection directory"
```

---

### Task 2: 创建集合首页 — 工具全景图

**Files:**
- Create: `docs/tips/frontend-practices/index.md`

- [ ] **Step 1: 编写集合首页 index.md**

文件内容要求：
- frontmatter: title="前端工具链集成全景", description="前端开发中 Git 工作流、Superpowers、GStack、OpenSpec、Ralph、CodeGraph、Context7、Serena 的完整集成指南"
- 开头说明本文档集合的定位——不是工具的独立介绍（那在 guide/advanced/），而是**工具在前端开发中的集成实践**
- 用一张表格列出 8 个工具在前端开发中的角色定位：

| 工具 | 角色 | 前端核心价值 | 对应开发阶段 |
|------|------|-------------|-------------|
| Git 工作流 | 版本控制 | 分支策略、PR 管理、提交规范 | 全流程 |
| Superpowers | 开发纪律 | TDD 驱动、头脑风暴、代码审查 | 实现阶段 |
| GStack | 虚拟团队 | 内置浏览器 QA、设计审查、安全审计 | 审查/发布阶段 |
| OpenSpec | 规格驱动 | 结构化需求文档、增量变更管理 | 规划阶段 |
| Ralph | 自主循环 | PRD 驱动自动开发、批量任务执行 | 自动化阶段 |
| CodeGraph | 代码图谱 | 组件依赖分析、影响范围评估 | 探索/分析阶段 |
| Context7 | 文档注入 | 最新框架文档、API 参考 | 编码阶段 |
| Serena | 代码语义 | 符号级重构、精确重命名 | 重构阶段 |

- 用 ASCII 图展示五阶段工作流全景：

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   探索分析   │──▶│   规划规格   │──▶│  TDD 实现   │──▶│  审查测试   │──▶│  发布自动化  │
│             │   │             │   │             │   │             │   │             │
│ CodeGraph   │   │ GStack      │   │ Superpowers │   │ GStack      │   │ Ralph       │
│ Serena      │   │ OpenSpec    │   │ CodeGraph   │   │ Serena      │   │ CI/CD       │
│ Context7    │   │ Spec-Kit    │   │ Context7    │   │ ECC         │   │ Hooks       │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

- 列出集合的三个子页面及其定位：
  - [集成工作流详解](./integrated-workflow) — 五阶段工作流的逐步指南
  - [场景实战指南](./scenarios) — 6 个完整实战案例
- 添加 `:::tip` 指向现有 `frontend-best-practices.md` 作为通用前端最佳实践参考

- [ ] **Step 2: 运行构建验证**

Run: `npm run build`
Expected: 构建成功，新页面出现在侧边栏

- [ ] **Step 3: 提交**

```bash
git add docs/tips/frontend-practices/index.md
git commit -m "feat: add frontend practices collection index with tool matrix"
```

---

### Task 3: 创建集成工作流详解 — 阶段一：探索分析

**Files:**
- Create: `docs/tips/frontend-practices/integrated-workflow.md`

- [ ] **Step 1: 编写 integrated-workflow.md 的 frontmatter 和概述**

```markdown
---
title: 前端集成工作流详解
description: 从代码探索到发布的五阶段前端开发工作流，深度集成 CodeGraph、Serena、GStack、Superpowers、OpenSpec、Ralph、Context7 和 Git
---

# 前端集成工作流详解

本文详细介绍前端开发中八个核心工具的五阶段集成工作流。每个阶段包含：工具角色、具体操作命令、前端专属配置和实际代码示例。

:::info
本文是[前端工具链集成全景](./index)的实践展开。各工具的独立安装和配置指南请参考对应的教程页面。
:::
```

- [ ] **Step 2: 编写阶段一 — 探索分析（CodeGraph + Serena + Context7）**

内容要求：
- 阶段定位：接手新项目或开始新功能前，快速理解代码结构
- **CodeGraph 前端探索**：
  - 安装命令：`npm i -g @colbymchenry/codegraph && codegraph install && codegraph init -i`
  - 3 个前端核心操作的完整代码块：
    - 路由结构探索：`> 这个前端项目的路由结构是什么？有哪些页面和嵌套路由？`（CodeGraph 通过 `codegraph_explore` 获取）
    - 组件依赖分析：`> 如果我修改 src/stores/authStore.ts，会影响哪些页面和组件？`（`codegraph_impact`）
    - 调用链追踪：`> 追踪从登录页面到 API 层的完整数据流`（`codegraph_trace`）
  - 框架路由识别表格（React Router / Next.js / Vue Router / SvelteKit）
- **Serena 符号分析**：
  - 安装命令：`uv tool install -p 3.13 serena-agent && serena init && claude mcp add --scope user serena -- serena`
  - 前端推荐配置 yaml 块（`.serena/config.yaml`，backend: lsp，禁用 read_file/list_dir/execute_shell）
  - 3 个操作示例：
    - 组件大纲：`> 查看 src/features/dashboard/DashboardPage.tsx 的符号大纲`
    - Hook 引用追踪：`> 哪些组件使用了 useAuth Hook？`
    - 影响分析：`> 如果修改 useCart 的返回值类型会影响什么？`
- **Context7 文档注入**：
  - 安装命令：`claude mcp add context7 -- npx -y @upstash/context7-mcp@latest`
  - 说明前端框架迭代快，训练数据可能滞后
  - 3 个查询示例：React 19 新特性、Next.js 15 App Router 变更、Tailwind CSS v4 配置
- 阶段总结的 `:::tip`：探索阶段的输出是后续规划的输入——CodeGraph 的依赖图喂给 OpenSpec 写规格，Serena 的符号信息喂给 GStack 做架构审查

- [ ] **Step 3: 提交阶段性内容**

```bash
git add docs/tips/frontend-practices/integrated-workflow.md
git commit -m "feat: add phase 1 (exploration) to integrated workflow"
```

---

### Task 4: 编写集成工作流 — 阶段二：规划规格

**Files:**
- Modify: `docs/tips/frontend-practices/integrated-workflow.md`

- [ ] **Step 1: 编写阶段二 — 规划规格（GStack + OpenSpec + Spec-Kit + Git 分支）**

内容要求：
- 阶段定位：将探索阶段的发现转化为结构化的开发计划
- **Git 分支策略**：
  - Claude Code 创建分支：`> 从 main 创建 feature/user-settings 分支`
  - Git Worktree 隔离开发：Superpowers 的 `using-git-worktrees` 会自动创建
  - Conventional Commits 规范：`> 提交改动，commit message 用英文，格式遵循 Conventional Commits`
- **GStack 需求探索**：
  - `/office-hours` 用 6 个核心问题挖掘真实需求
  - `/plan-ceo-review` 审查商业价值
  - `/plan-eng-review` 审查技术架构
  - 完整示例：`> /office-hours\n> 我想给电商前端添加商品对比功能`
  - `/plan-design-review` 审查 UI 设计质量
- **OpenSpec 规格文档**：
  - 安装：`npm install -g @fission-ai/openspec@latest && openspec init`
  - 三步工作流：propose → apply → archive
  - 完整示例：
    ```
    > /opsx:propose add-product-comparison
    > 基于 GStack 的审查结果，创建商品对比功能的规格文档
    > - 对比面板：固定在页面底部，最多对比 4 个商品
    > - 属性对比：价格、评分、规格参数
    > - 响应式：桌面端横向表格，移动端纵向卡片
    ```
  - 说明规格文档提交到 Git 成为持久化文档
- **Spec-Kit 替代方案**（`:::tip`）：
  - 复杂项目可用 Spec-Kit 替代 OpenSpec
  - `/speckit.specify` → `/speckit.clarify` → `/speckit.plan` → `/speckit.tasks` 完整流程
  - `/speckit.clarify` 会自动提问：对比属性是否可配置？是否支持导出对比结果？
- 阶段总结：规划阶段的输出是结构化的规格文档 + Git 分支，进入实现阶段

- [ ] **Step 2: 提交**

```bash
git add docs/tips/frontend-practices/integrated-workflow.md
git commit -m "feat: add phase 2 (planning) to integrated workflow"
```

---

### Task 5: 编写集成工作流 — 阶段三：TDD 实现

**Files:**
- Modify: `docs/tips/frontend-practices/integrated-workflow.md`

- [ ] **Step 1: 编写阶段三 — TDD 实现（Superpowers + CodeGraph + Context7 + Git 提交）**

内容要求：
- 阶段定位：按照规格文档，用 TDD 驱动前端组件实现
- **Superpowers TDD 铁律**：
  - 三条铁律：没有设计不写代码、没有测试不写代码、没有验证不说完成
  - 前端 TDD 循环：🔴 RED（写 Vitest + RTL 测试）→ 🟢 GREEN（最小实现）→ 🔵 REFACTOR
  - 完整示例（ProductComparison 组件）：
    ```
    > 使用 Superpowers 工作流，实现商品对比面板：
    > 1. 头脑风暴确认需求（对比属性列表？最多几个？响应式？）
    > 2. 编写组件测试（Vitest + React Testing Library）
    > 3. 运行 pnpm test 确认失败
    > 4. 实现静态 UI（JSX + Tailwind CSS）
    > 5. 添加交互逻辑（添加/移除商品、属性切换）
    > 6. 接入 API 层（React Query）
    > 7. 运行 pnpm test 确认全部通过
    ```
  - `:::warning` Superpowers 先测试后代码规则——代码在测试之前写好会被要求删除
- **CodeGraph 实时辅助**：
  - 实现阶段用 `codegraph_explore` 理解现有组件结构
  - `codegraph_callers` 查找哪些组件使用了特定 UI 组件
  - Token 节省：一次 explore 替代多次 Grep + Read，节省 57% Token
- **Context7 文档注入**：
  - 实现过程中自动获取最新框架文档
  - 示例：`> 查询 React 19 的 useActionState 用法`、`> 查询 Tailwind CSS v4 的 @theme 指令`
- **Git 频繁提交**：
  - 每完成一个组件/功能就提交
  - 示例：`> 提交商品对比面板的类型定义和静态 UI`
  - 示例：`> 提交交互逻辑和状态管理代码`
  - Conventional Commits 格式：`feat(comparison): add product comparison panel static UI`

- [ ] **Step 2: 提交**

```bash
git add docs/tips/frontend-practices/integrated-workflow.md
git commit -m "feat: add phase 3 (TDD implementation) to integrated workflow"
```

---

### Task 6: 编写集成工作流 — 阶段四：审查测试

**Files:**
- Modify: `docs/tips/frontend-practices/integrated-workflow.md`

- [ ] **Step 1: 编写阶段四 — 审查测试（GStack + Serena + ECC）**

内容要求：
- 阶段定位：实现完成后的代码审查、浏览器测试和安全审计
- **GStack 内置浏览器 QA**：
  - `/qa https://localhost:5173` 在真实 Chromium 中测试
  - 自动遍历页面、填写表单、点击按钮
  - 完整示例：
    ```
    > /qa https://localhost:5173
    > 测试商品对比功能：
    > - 添加商品到对比面板是否正常
    > - 对比表格在移动端是否变为纵向卡片
    > - 移除商品后面板状态是否正确
    > - 空对比面板是否有友好提示
    ```
- **GStack 代码审查**：
  - `/review` Staff Engineer 级审查
  - `/cso` OWASP Top 10 安全审计（XSS、CSRF）
  - `/benchmark` Core Web Vitals 测量
  - 完整示例：`> /review\n> 审查 feature/product-comparison 分支的前端代码变更`
- **Serena 精确重构**：
  - 审查后发现需要重构时，用 Serena 精确操作
  - `rename_symbol` 重命名组件及所有 import
  - `move_symbol` 移动 Hook 到正确目录
  - 完整示例：
    ```
    > 审查发现 ComparisonTable 命名不够语义化：
    > 1. 用 find_referencing_symbols 找出所有引用
    > 2. 用 rename_symbol 重命名为 ProductComparisonTable
    > 3. 验证所有测试仍然通过
    ```
- **ECC 安全审查**：
  - `typescript-reviewer` 检查类型安全
  - `security-reviewer` 检查 XSS 风险（dangerouslySetInnerHTML）
  - `frontend-patterns` 检查组件设计规范
- **Git PR 创建**：
  - `> 帮我创建一个 PR，目标分支是 main，标题和描述用英文`
  - Claude Code 自动推送分支、用 gh CLI 创建 PR、生成描述

- [ ] **Step 2: 提交**

```bash
git add docs/tips/frontend-practices/integrated-workflow.md
git commit -m "feat: add phase 4 (review & test) to integrated workflow"
```

---

### Task 7: 编写集成工作流 — 阶段五：发布自动化

**Files:**
- Modify: `docs/tips/frontend-practices/integrated-workflow.md`

- [ ] **Step 1: 编写阶段五 — 发布自动化（Ralph + Hooks + CI/CD）**

内容要求：
- 阶段定位：批量任务自动化、CI/CD 集成、持续交付
- **Ralph 自主循环**：
  - 安装：`/plugin marketplace add snarktank/ralph && /plugin install ralph-skills@ralph-marketplace`
  - 工作流：`/prd` 生成 PRD → `/ralph` 转 prd.json → `./scripts/ralph/ralph.sh --tool claude` 自主执行
  - 前端适用场景：批量实现多个页面、组件库迁移、API 层重构
  - 完整示例：
    ```
    > /prd
    > 将商品对比功能的剩余子任务转为 PRD：
    > - 对比历史记录（localStorage 持久化）
    > - 对比结果分享（URL 参数编码）
    > - 对比数据导出（CSV/PDF）
    ```
  - 说明每次迭代全新上下文，通过 Git 历史和 progress.txt 跨迭代积累知识
- **Hooks 自动化**：
  - PostToolUse Hook：修改 .tsx/.ts/.css 文件后自动 Prettier 格式化
  - Stop Hook：Claude Code 完成任务后自动 TypeScript 类型检查
  - 完整 JSON 配置示例（`.claude/settings.json`）
- **CI/CD 集成**：
  - GitHub Actions AI Code Review 配置
  - `anthropics/claude-code-action@v1` 集成
  - 完整 YAML 示例（`.github/workflows/ai-review.yml`）
  - 审查 prompt 模板：检查组件结构、TypeScript 类型、re-render、XSS、测试覆盖、无障碍
- **GStack 发布**：
  - `/ship` 运行测试、审计覆盖率、推送并创建 PR
  - 完整示例：`> /ship\n> 运行完整测试套件，审计覆盖率，创建 PR`

- [ ] **Step 2: 提交**

```bash
git add docs/tips/frontend-practices/integrated-workflow.md
git commit -m "feat: add phase 5 (release automation) to integrated workflow"
```

---

### Task 8: 创建场景实战指南 — 场景一：新页面全流程开发

**Files:**
- Create: `docs/tips/frontend-practices/scenarios.md`

- [ ] **Step 1: 编写 scenarios.md 的 frontmatter 和概述**

```markdown
---
title: 前端场景实战指南
description: 6 个完整的前端开发实战案例，展示 Git 工作流、Superpowers、GStack、OpenSpec、Ralph、CodeGraph、Context7、Serena 的深度集成
---

# 前端场景实战指南

本文提供 6 个完整的前端开发实战案例，每个案例包含从需求到上线的完整步骤、具体命令、代码示例和预期输出。案例覆盖前端开发中最常见的场景。

:::info
本文是[前端工具链集成全景](./index)的实战补充。工作流阶段详解请参考[集成工作流详解](./integrated-workflow)。
:::
```

- [ ] **Step 2: 编写场景一 — 新页面全流程开发（电商商品详情页）**

内容要求：
- 场景描述：从零开发一个电商商品详情页，包含图片轮播、规格选择、加购、评价
- **预计用时和工具使用**表格
- 完整的逐步操作（每一步都是可执行的命令）：
  1. Git 分支：`> 从 main 创建 feature/product-detail 分支`
  2. CodeGraph 探索：`> 这个项目的商品模块有哪些组件和 API？`（`codegraph_explore`）
  3. Context7 查询：`> 查询 React 19 的 Server Components 最佳实践`
  4. GStack 需求：`> /office-hours\n> 商品详情页需要哪些核心功能？`
  5. GStack 设计审查：`> /plan-design-review\n> 审查商品详情页的 UI 设计`
  6. OpenSpec 规格：`> /opsx:propose product-detail-page\n> ...`（完整规格内容）
  7. Superpowers TDD：
     - 头脑风暴：`> /superpowers:brainstorming\n> 设计商品详情页的组件结构`
     - 类型定义：`> 定义 Product、ProductVariant、Review 类型`
     - 测试先行：`> 使用 Superpowers TDD 实现 ProductImageCarousel 组件`
     - 渐进实现：静态 UI → 交互逻辑 → API 对接 → 状态处理
  8. Git 提交：每完成一个组件就提交，Conventional Commits 格式
  9. GStack QA：`> /qa https://localhost:5173/product/123\n> 测试商品详情页的完整交互流程`
  10. GStack 审查：`> /review` + `/cso` 安全审计
  11. GStack 发布：`> /ship`

- [ ] **Step 3: 提交**

```bash
git add docs/tips/frontend-practices/scenarios.md
git commit -m "feat: add scenarios page with full-stack page development scenario"
```

---

### Task 9: 编写场景二和三 — 组件库重构 + 性能优化

**Files:**
- Modify: `docs/tips/frontend-practices/scenarios.md`

- [ ] **Step 1: 编写场景二 — 组件库重构（语义驱动）**

内容要求：
- 场景描述：将散落在各页面的重复 UI 元素提取为统一组件库
- 完整步骤：
  1. CodeGraph 分析：`> 哪些页面使用了类似的卡片组件？列出所有重复的 UI 模式`（`codegraph_explore`）
  2. Serena 符号分析：`> 查看 src/components/ 下所有组件的符号大纲`（`get_symbols_overview`）
  3. GStack 架构审查：`> /plan-eng-review\n> 审查组件库重构方案`
  4. OpenSpec 规格：`> /opsx:propose component-library-refactor\n> 提取统一的 Card、Modal、DataTable 组件`
  5. Serena 精确重构：
     - `> 用 find_referencing_symbols 找出 UserCard 的所有引用`
     - `> 用 rename_symbol 将 UserCard 重命名为 BaseCard`
     - `> 用 move_symbol 将 BaseCard 移动到 src/components/ui/`
  6. CodeGraph 验证：`> 修改 BaseCard 后，哪些页面受到影响？`（`codegraph_impact`）
  7. Superpowers TDD：为每个提取的组件编写测试
  8. GStack 浏览器回归：`> /qa https://localhost:5173\n> 测试所有使用重构组件的页面`
  9. Git 提交和 PR

- [ ] **Step 2: 编写场景三 — 前端性能优化**

内容要求：
- 场景描述：首页加载速度慢（LCP > 4s），需要系统化优化
- 完整步骤：
  1. GStack 性能基准：`> /benchmark\n> 测量首页的 Core Web Vitals`
  2. CodeGraph 渲染链追踪：`> 追踪首页的组件渲染链，找出最大的依赖`（`codegraph_trace`）
  3. Context7 查询：`> 查询 React 19 的 useDeferredValue 和 Suspense 最佳实践`
  4. Superpowers 调试：`> /superpowers:systematic-debugging\n> 首页 LCP > 4s，排查性能瓶颈`
  5. 优化实施（TDD 驱动）：
     - 路由级懒加载（React.lazy + Suspense）
     - 图片懒加载和 WebP 格式
     - 组件级 memo 化
     - Bundle 分析和代码分割
  6. Git 提交每项优化
  7. GStack 验证：`> /benchmark\n> 验证优化后 LCP 是否降到 2.5s 以下`
  8. 创建 PR 并附带性能对比数据

- [ ] **Step 3: 提交**

```bash
git add docs/tips/frontend-practices/scenarios.md
git commit -m "feat: add component refactor and performance optimization scenarios"
```

---

### Task 10: 编写场景四和五 — Bug 修复 + 遗留项目接管

**Files:**
- Modify: `docs/tips/frontend-practices/scenarios.md`

- [ ] **Step 1: 编写场景四 — 系统化 Bug 修复（跨浏览器兼容性）**

内容要求：
- 场景描述：用户反馈页面在 Safari 上样式错乱，Chrome 正常
- 完整步骤：
  1. Superpowers 系统化调试：`> /superpowers:systematic-debugging\n> 页面在 Safari 上样式错乱，Chrome 正常`
  2. 复现阶段：GStack `/qa` 在不同浏览器中测试
  3. 根因分析：CodeGraph `codegraph_trace` 追踪样式应用链
  4. 修复实现（TDD）：先写能暴露问题的测试，再修复
  5. 防护措施：添加跨浏览器 E2E 测试
  6. Git 提交和 PR

- [ ] **Step 2: 编写场景五 — 遗留前端项目接管**

内容要求：
- 场景描述：接手一个没有文档、没有测试的 React 遗留项目
- 完整步骤：
  1. CodeGraph 快速探索：`> 这个项目的整体架构是什么？有哪些路由和核心模块？`（`codegraph_explore`）
  2. Serena 符号梳理：`> 查看 src/ 下所有顶层模块的符号大纲`（`get_symbols_overview`）
  3. CodeGraph 依赖分析：`> 这个项目的核心依赖关系是什么？哪些模块耦合最严重？`
  4. GStack 产品梳理：`> /office-hours\n> 帮我梳理这个遗留项目的核心业务逻辑和用户流程`
  5. ECC 代码审查：`> 使用 typescript-reviewer 审查核心模块，识别代码问题`
  6. ECC 安全扫描：`> 使用 security-reviewer 检查 XSS、CSRF 等安全风险`
  7. OpenSpec 重构规格：`> /opsx:propose legacy-refactor\n> 基于代码现状创建渐进式重构规格`
  8. Superpowers 渐进重构：TDD 驱动，每步都有测试覆盖
  9. Git 分支策略：每个重构阶段一个分支，逐步合并

- [ ] **Step 3: 提交**

```bash
git add docs/tips/frontend-practices/scenarios.md
git commit -m "feat: add bug fix and legacy project takeover scenarios"
```

---

### Task 11: 编写场景六 — 大型功能自主开发

**Files:**
- Modify: `docs/tips/frontend-practices/scenarios.md`

- [ ] **Step 1: 编写场景六 — 大型功能自主开发（Ralph 自动化）**

内容要求：
- 场景描述：需要实现一个包含 15 个用户故事的管理后台模块，希望尽可能自动化
- 完整步骤：
  1. GStack 需求探索：`> /office-hours\n> 设计一个订单管理后台，包含列表、详情、筛选、导出、批量操作`
  2. OpenSpec 规格：`> /opsx:propose order-management\n> 创建订单管理模块的完整规格文档`
  3. Ralph PRD 生成：`> /prd\n> 将 OpenSpec 的规格转换为 PRD`
  4. Ralph 转换：`> /ralph\n> 将 PRD 转换为 prd.json`
  5. Ralph 自主循环：`./scripts/ralph/ralph.sh --tool claude`
  6. 循环过程说明：每次迭代全新上下文，通过 Git 历史和 progress.txt 跨迭代积累
  7. 完成后 GStack 审查：`> /review` + `/qa` + `/ship`
  8. `:::tip` Ralph 的最佳实践：每个用户故事要足够小，能在一次上下文窗口内完成

- [ ] **Step 2: 添加场景总结表格**

在所有场景之后添加一个总结表格：

| 场景 | 核心工具组合 | 适用情况 | 预计时间 |
|------|-------------|---------|---------|
| 新页面开发 | GStack + OpenSpec + Superpowers + CodeGraph | 从零构建新功能 | 2-4 小时 |
| 组件库重构 | CodeGraph + Serena + GStack + Superpowers | 提取/重组现有组件 | 1-3 天 |
| 性能优化 | GStack + CodeGraph + Superpowers | 页面加载慢 | 2-4 小时 |
| Bug 修复 | Superpowers + CodeGraph + GStack | 跨浏览器/交互问题 | 1-2 小时 |
| 遗留项目接管 | CodeGraph + Serena + ECC + OpenSpec + Superpowers | 接手无文档项目 | 1-2 天 |
| 大型功能自主开发 | GStack + OpenSpec + Ralph | 批量任务自动化 | 半天-2 天 |

- [ ] **Step 3: 提交**

```bash
git add docs/tips/frontend-practices/scenarios.md
git commit -m "feat: add autonomous development scenario and summary table"
```

---

### Task 12: 更新 tips/_meta.json 添加集合页面

**Files:**
- Modify: `docs/tips/_meta.json`

- [ ] **Step 1: 更新 _meta.json**

当前内容：
```json
[
  "index",
  "best-practices",
  "ecc",
  "java-best-practices",
  "frontend-best-practices",
  "react-best-practices",
  "vue-best-practices"
]
```

更新为（在 `frontend-best-practices` 之后添加集合目录）：
```json
[
  "index",
  "best-practices",
  "ecc",
  "java-best-practices",
  "frontend-best-practices",
  {
    "type": "dir",
    "name": "frontend-practices",
    "label": "前端工具链集成"
  },
  "react-best-practices",
  "vue-best-practices"
]
```

- [ ] **Step 2: 运行构建验证**

Run: `npm run build`
Expected: 构建成功，侧边栏出现"前端工具链集成"分组

- [ ] **Step 3: 提交**

```bash
git add docs/tips/_meta.json
git commit -m "feat: add frontend-practices collection to tips sidebar"
```

---

### Task 13: 增强 frontend-best-practices.md 工具链部分

**Files:**
- Modify: `docs/tips/frontend-best-practices.md`

- [ ] **Step 1: 在工具链集成部分开头添加集合引用**

在 `## 工具链集成` 部分（第 218 行附近）之前添加一个 `:::tip` 块：

```markdown
:::tip
本文介绍各工具的独立集成方式。如果你需要了解**工具之间的协作流程**和**完整的实战案例**，请参考 [前端工具链集成全景](/tips/frontend-practices/) — 包含五阶段集成工作流和 6 个详细实战场景。
:::
```

- [ ] **Step 2: 在工具链组合实战部分增强场景描述**

将现有的 5 个简略场景（第 586-643 行）替换为更详细的版本，每个场景增加：
- 预计用时
- 适用条件说明
- 关键步骤的预期输出描述
- 添加 `:::details` 展开每个步骤的具体命令

- [ ] **Step 3: 添加 Git 工作流集成段落**

在 `### 工具链组合实战` 之前，添加一个新的 `### Git 工作流集成` 段落：

内容要求：
- 前端项目的 Git 分支策略（feature branch → PR → review → merge）
- Conventional Commits 在前端项目中的规范（feat/fix/refactor/perf）
- Git Worktree 与 Superpowers 的集成（隔离开发）
- Claude Code 的 Git 操作示例：提交、分支、PR、冲突解决
- 与工具链的关联：Superpowers 在 worktree 中开发、GStack /ship 自动创建 PR

- [ ] **Step 4: 运行构建验证**

Run: `npm run build`
Expected: 构建成功

- [ ] **Step 5: 提交**

```bash
git add docs/tips/frontend-best-practices.md
git commit -m "feat: enhance frontend-best-practices with collection links and git workflow"
```

---

### Task 14: 最终验证和清理

**Files:**
- Modify: (any files with build errors)

- [ ] **Step 1: 运行完整构建**

Run: `npm run build`
Expected: 构建成功，无错误

- [ ] **Step 2: 检查侧边栏导航**

验证：
- tips 侧边栏出现"前端工具链集成"分组
- 分组下有 3 个页面：集成全景、集成工作流详解、场景实战指南
- 所有交叉引用链接正确

- [ ] **Step 3: 检查所有交叉引用**

验证以下链接不返回 404：
- `frontend-practices/index.md` → `frontend-best-practices`
- `frontend-practices/index.md` → `integrated-workflow`、`scenarios`
- `frontend-practices/integrated-workflow.md` → `index`、各工具 guide 页面
- `frontend-practices/scenarios.md` → `index`、`integrated-workflow`
- `frontend-best-practices.md` → `frontend-practices/`

- [ ] **Step 4: 运行 lint 和格式检查**

Run: `npm run check`
Expected: 无 lint 错误

- [ ] **Step 5: 最终提交（如有修复）**

```bash
git add -A
git commit -m "fix: resolve build issues and fix cross-references in frontend practices collection"
```
