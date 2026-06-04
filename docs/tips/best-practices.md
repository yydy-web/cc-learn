---
title: 最佳实践
description: Claude Code 日常使用中的高效技巧和常见模式
---

# 最佳实践

## 对话技巧

### 1. 提供具体上下文

```
❌ "帮我修个 bug"
✅ "用户登录后 token 没有保存到 localStorage，检查 src/auth/login.ts 的登录逻辑"
```

### 2. 指定范围

```
❌ "优化这个项目"
✅ "优化 src/api/users.ts 中的数据库查询，目前列表接口没有分页"
```

### 3. 分步完成

```
> 第一步：分析 src/database/ 的表结构
> 第二步：添加索引优化查询
> 第三步：运行测试确认没有回归
```

### 4. 利用 CLAUDE.md

在 `CLAUDE.md` 中记录项目约定，这样每次对话都不用重复说明。

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

#### 场景五：大型重构（语义驱动）

```
1. Serena: find_referencing_symbols 分析影响范围
2. Gstack: /plan-eng-review 审查重构方案
3. Serena: rename_symbol 精确重命名 → move_symbol 重组模块
4. CodeGraph: codegraph_impact 验证变更完整性
5. Gstack: /review 审查 → /qa 测试
```

#### 场景六：遗留代码接管

```
1. Serena + CodeGraph: get_symbols_overview + codegraph_explore 快速理解代码结构
2. Gstack: /office-hours 梳理业务需求
3. Serena: find_referencing_symbols 追踪核心业务流
4. OpenSpec: /opsx:propose 基于代码现状创建重构规格
5. Superpowers: TDD 驱动渐进式重构
```

### 实时文档注入（Context7）

安装 [Context7](/guide/advanced/context7) 后，Claude Code 会自动查询最新的库文档：

```bash
npx ctx7 setup --claude
```

之后 Claude Code 在使用库/框架时会自动获取最新文档，避免 API 幻觉和过时代码。特别适合使用快速迭代的库（如 Next.js、React Router）。

### 代码语义辅助（Serena）

安装 [Serena](/guide/advanced/serena) 后，Claude Code 获得 IDE 级的符号级代码操作能力：

```bash
uv tool install -p 3.13 serena-agent
serena init
claude mcp add --scope user serena -- serena
```

Serena 在四阶段工作流中的价值：

- **Gstack 阶段**：用 `find_referencing_symbols` 分析变更影响范围，辅助架构审查
- **OpenSpec 阶段**：用 `get_symbols_overview` 快速理解现有代码结构，为规格文档提供准确的现状描述
- **Superpowers 阶段**：用 `rename_symbol`、`replace_symbol_body` 进行精确的符号级重构，比文本替换更安全
- **Ralph 阶段**：在自主迭代中，语义操作减少误改风险，提高大型重构的可靠性

:::tip
Serena 特别适合重构密集型任务——重命名跨文件的符号、移动函数到新模块、安全删除废弃代码。这些操作用文本搜索容易出错，Serena 通过 LSP 保证原子化和精确性。
:::

## 省钱技巧

1. **及时 /compact**：每 10-15 轮对话压缩一次
2. **精确指定文件**：不要让 Claude 读整个项目
3. **用 /clear 重启**：切换任务时清空上下文
4. **监控 /cost**：定期检查 token 用量
5. **日常用 Sonnet**：复杂问题才切 Opus

### Provider 管理

使用 [CC-Switch](/guide/advanced/cc-switch) 管理多个 API Provider，快速在不同服务间切换：

- 一键切换 Provider，无需手动编辑配置文件
- 支持 AWS Bedrock、NVIDIA NIM 等 50+ 预设
- 用量追踪帮助你监控花费

## 团队协作

### 共享 CLAUDE.md

把 `CLAUDE.md` 提交到 Git，让整个团队共享项目约定。

### 共享 Skills

把 `.agents/skills/` 提交到 Git，让团队复用工作流。

### Code Review

```
> 帮我审查 main..feature 分支的改动，重点关注安全性和性能
```

## 常见问题

### Claude Code 似乎"忘记"了之前的内容

对话太长了，执行 `/compact` 或 `/clear` 后重新开始。

### Claude Code 的修改不符合预期

- 检查 `CLAUDE.md` 中是否有明确的约定
- 用 `/plan` 模式先确认方案再执行
- 对于关键修改，要求 Claude 先解释再动手

### 响应速度变慢

- 对话上下文可能过大，执行 `/compact`
- 检查是否加载了过多的 MCP 服务器
- 考虑切换到更快的模型（如 Haiku）
