---
title: Subagent Types 组合 — 用预定义类型搭审查流水线
description: 组合 explore、code-reviewer、general-purpose 三种预定义 subagent 类型完成 review-fix-verify 闭环，比每次手写 prompt 更标准一致
pageType: doc
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★★  | ★★★☆☆    |
| 📦 产品 | ★★☆☆☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握预定义 subagent 类型的使用和组合，能独立用 explore/code-reviewer/general-purpose 搭建标准化审查修复流程

**🚀 AI 能力提升：** Agent 类型、工具链组合
:::

## 场景概述

当你需要对一个代码仓库做系统性审查时，手写 prompt 让 CC 从头到尾完成 review + fix 会面临几个问题：每次都要重新描述"你应该用什么工具"、"只看不改"还是"可以改代码"；输出格式完全依赖 prompt 质量；多轮对话容易偏离方向。

Claude Code 的 **预定义 subagent 类型** 就是为解决这个问题设计的。每种类型绑定了固定的工具集和系统 prompt，你只需要指定类型名，不用反复描述行为约束。

本案例组合三种预定义类型完成一个 **review-fix-verify** 闭环：

- **explore** 类型：只读分析项目结构，生成模块依赖图
- **code-reviewer** 类型：按严重度分类审查关键模块，输出结构化 findings
- **general-purpose** 类型：根据审查报告逐个修复问题

对比"每次手写 prompt"的方式，预定义类型在输出一致性和可复用性上有明显优势。审查结果可以直接存下来当基线，下一次跑同样的类型就能得到可对比的新报告。

## 为什么用预定义 Subagent Types

预定义类型和手动写 prompt 的本质区别在于**工具集边界是固定的**，而不是靠 prompt 去约束。explore 类型天生没有 Edit/Write 权限，code-reviewer 类型自带审查框架（严重度分类、文件行号定位、修复建议），你不用每次都教它怎么做。

:::tip
预定义类型不是让你省掉 prompt，而是让你把 prompt 的精力花在**业务逻辑描述**上，而不是花在**行为约束**上。
:::

### 常用预定义类型一览

| 类型名称 | 工具集 | 典型用途 | 能否写文件 |
| -------- | ------ | -------- | ---------- |
| `explore` | Read, Grep, Glob, Bash（无 Edit/Write） | 只读搜索、结构分析、依赖梳理 | 否 |
| `code-reviewer` | 全部工具 | 代码审查，输出结构化 findings | 可以但通常只读 |
| `general-purpose` | 全部工具 | 多步骤任务、根据指令修改代码 | 是 |
| `caveman:cavecrew-investigator` | Read, Grep, Glob, Bash | 定位代码定义、调用关系、目录映射 | 否 |

选择逻辑很简单：**只读分析用 explore/investigator，审查用 code-reviewer，修改代码用 general-purpose**。不要用一个 general-purpose 包办所有事——一来没有工具隔离的安全感，二来输出没有类型自带的结构化格式。

## 前置准备

开始前确保以下条件满足：

1. **项目有至少一个需要审查的模块**——本案例以 `docs/agents/` 目录为目标，包含多个 `.md` 文件
2. **CC 版本支持 Agent 工具**——运行 `claude --version` 确认版本在支持 subagent 的范围内
3. **理解 Agent 工具的基本用法**——知道如何用 `subagent_type` 参数指定类型

:::info
如果你还不熟悉 Agent 工具的基础用法，建议先阅读 Agent 入门相关内容（请查阅 CC 官方文档中的 Agent 章节）。
:::

## 完整交互过程

### Step 1：explore agent 分析项目结构

用 `explore` 类型扫描目标目录，让它只读分析模块之间的依赖关系，输出一张依赖图。explore 类型没有写权限，可以放心让它探查整个目录。

**发送给 CC 的指令：**

```text
用 explore agent 分析 docs/agents/ 目录下所有 .md 文件之间的引用关系，
列出每个文件引用了哪些文件、被哪些文件引用，检测是否存在循环引用。
```

**Agent 输出（示例）：**

```text
## 模块依赖分析 — docs/agents/

### 依赖关系表

| 文件 | 引用的文件 | 被引用于 |
|------|-----------|----------|
| subagent-types.md | agent-basics.md, task-brief.md | (无) |
| task-brief.md | agent-basics.md | subagent-types.md |
| agent-basics.md | (无) | subagent-types.md, task-brief.md, workflow.md |
| workflow.md | agent-basics.md, task-brief.md | (无) |

### 依赖图（文本版）

agent-basics.md  ←── subagent-types.md
    ↑              ↖
    ├── task-brief.md
    └── workflow.md ──→ task-brief.md

### 循环依赖检测

未检测到循环依赖。
```

拿到依赖图后，你就知道哪些文件是"核心被依赖节点"（如 `agent-basics.md`），这些应该是审查的重点目标。

### Step 2：code-reviewer agent 审查关键模块

基于第一步的依赖图，用 `code-reviewer` 类型审查核心文件。code-reviewer 类型会按严重度（critical / high / medium / low）分类输出 findings。

**发送给 CC 的指令：**

```text
用 code-reviewer agent 审查 docs/agents/agent-basics.md，
重点关注：
1. 内容是否自洽（前后矛盾）
2. 与外链的一致性（引用的命令/配置是否在对应页面中存在）
3. 格式规范（代码块是否标注语言、Rspress 容器是否正确闭合）
```

**Agent 输出（示例）：**

```text
## Code Review — agent-basics.md

| # | 严重度 | 位置 | 问题描述 | 建议 |
|---|--------|------|----------|------|
| 1 | critical | L45 | 代码块未标注语言：``` claude --help | 添加 ```bash |
| 2 | high | L78 | :::warning 容器未闭合，影响后续内容渲染 | 在 L82 添加 ::: |
| 3 | high | L112 | 引用了 ../commands/system.md 但该文件不存在 | 检查路径，改为正确的文件路径或移除引用 |
| 4 | medium | L23 | 描述中说"三种方式"，实际只列出了两种 | 补充第三种方式或修改措辞为"两种" |
| 5 | low | L156 | 中英文混排缺少空格："使用Claude" | 改为 "使用 Claude" |
```

这就是预定义类型的价值——输出格式是固定的，你可以直接把 findings 列表交给下一步的修复 agent，不需要做格式转换。

### Step 3：general-purpose agent 逐个修复

现在用一个 `general-purpose` agent，把上一步的 findings 列表给它，让它逐个修复。general-purpose 有完整工具权限，可以读取和编辑文件。

**发送给 CC 的指令：**

```text
用 general-purpose agent 根据以下 review findings 修复 docs/agents/agent-basics.md：

findings 列表：
1. [critical] L45: 代码块未标注语言 → 添加 ```bash
2. [high] L78: :::warning 容器未闭合 → 在 L82 添加 :::
3. [high] L112: 引用 ../commands/system.md 不存在 → 修正路径或移除
4. [medium] L23: "三种方式"实际只有两种 → 修正措辞
5. [low] L156: "使用Claude"中英文缺空格 → 改为 "使用 Claude"

要求：每个修复做一次独立编辑，不要批量处理，方便我逐个 review 改动。
```

**修复过程（展示关键 diff）：**

**修复 1 — 代码块语言标注：**

```diff
-```
+```bash
 claude --help
 ```

**修复 2 — 容器闭合：**

```diff
 如果不满足条件，构建会失败。
+:::

 ## 下一节
```

**修复 3 — 失效链接：**

```diff
-更多细节见 [系统命令](../commands/system.md)。
+更多细节见 [命令参考](../commands/overview.md#系统命令)。
```

**修复 4 — 措辞修正：**

```diff
-安装 Claude Code 有三种方式：
+安装 Claude Code 有两种方式：
```

**修复 5 — 中英文空格：**

```diff
-使用Claude
+使用 Claude
```

:::tip
让 general-purpose agent 逐个修复而不是批量处理的好处：每个改动都是独立的，你可以用 `git diff` 逐项确认，发现某一步修错了可以单独回退，不会污染其他修复。
:::

### Step 4：code-reviewer agent 再次审查

修复完成后，用 `code-reviewer` 类型再次审查同一个文件，验证所有 findings 已被正确处理。

**发送给 CC 的指令：**

```text
用 code-reviewer agent 再次审查 docs/agents/agent-basics.md，
重点验证上一轮 review 的 5 个 findings 是否全部修复，
同时检查是否引入了新的问题。
```

**Agent 输出（示例）：**

```text
## Re-review — agent-basics.md

### 上一轮 findings 验证

| # | 原严重度 | 状态 | 备注 |
|---|----------|------|------|
| 1 | critical | ✅ 已修复 | L45: 代码块已添加 ```bash |
| 2 | high | ✅ 已修复 | L82: :::warning 容器已正确闭合 |
| 3 | high | ✅ 已修复 | L112: 链接已修正为 ../commands/overview.md |
| 4 | medium | ✅ 已修复 | L23: 已改为"两种方式" |
| 5 | low | ✅ 已修复 | L156: 已添加空格 |

### 本轮新增 findings

| # | 严重度 | 位置 | 问题描述 |
|---|--------|------|----------|
| — | — | — | 本轮未发现新问题 |

### 总结

- Critical: 0
- High: 0
- Medium: 0
- Low: 0
```

全部清零，修复验证通过。

### Step 5：对比审查报告，量化改进

把两轮审查报告放在一起对比，改进一目了然。

| 严重度 | 修复前 | 修复后 | 变化 |
| ------ | ------ | ------ | ---- |
| Critical | 1 | 0 | -1 (100%) |
| High | 2 | 0 | -2 (100%) |
| Medium | 1 | 0 | -1 (100%) |
| Low | 1 | 0 | -1 (100%) |
| **合计** | **5** | **0** | **全部清零** |

:::info
如果你把两轮报告都保存为文件（如 `review-round-1.md`、`review-round-2.md`），下次迭代时只需要跑新一轮 code-reviewer 然后 diff 两个文件，就能快速定位"哪些问题修好了、哪些还没修、有没有新引入的问题"。
:::

## 要点总结

1. **不同 agent 类型有不同工具集**——这不是推荐，是硬约束。explore 类型没有 Edit/Write，不用担心它改你的文件。code-reviewer 类型虽有权写但设计上偏向只读输出。选错类型可能误改文件或遗漏审查项。

2. **explore 只读不写，适合前置分析**——在动手改代码之前，先用 explore 搞清楚"改哪里会影响什么"。它在多模块项目中尤其有价值，能帮你画出修改的影响范围。

3. **预定义类型输出更一致、可预测**——code-reviewer 每次输出的 findings 表结构相同，你可以写脚本解析它、diff 它、存成基线。手动 prompt 做不到这一点——每次的格式都可能不一样。

4. **结合 task-brief 使用效果更好**——把审查需求写成 task-brief 文件（包含审查范围、严重度标准、输出格式要求），然后让 agent 读取 task-brief 再执行审查。这样即使换了不同的 agent 实例，审查标准也是一致的。

5. **review-fix-verify 循环可以自动化**——如果你经常做代码审查，这套流程完全可以用脚本串联：explore 分析 → code-reviewer 审查 → general-purpose 修复 → code-reviewer 再审查。每次迭代得到一个可对比的审查报告。

## 变体与延伸

### 自定义 Agent 类型

预定义类型覆盖了常见场景，但你可以通过 `.claude/agents/*.md` 文件定义自己的 agent 类型。比如为团队定制一个"审查规范检查"类型，内置团队编码规范，每次审查自动对照规范输出 findings。

```markdown
---
name: spec-reviewer
description: 按团队编码规范审查代码
model: sonnet
tools: Read, Grep, Glob
---

你是一个代码规范审查员。审查时对照以下规范：
1. 组件文件不超过 300 行
2. 禁止使用 any 类型
3. 导入顺序：第三方 → 内部模块 → 相对路径
```

### 结合 Workflow 脚本批量审查

如果你的仓库有多个模块，可以写一个 shell 脚本，对每个模块依次执行 explore → code-reviewer，输出合并报告。

```bash
#!/bin/bash
# batch-review.sh — 批量审查多个目录
DIRS=("docs/agents" "docs/commands" "docs/guide")

for dir in "${DIRS[@]}"; do
  echo "=== Reviewing $dir ==="
  claude --subagent code-reviewer --prompt "审查 $dir 目录下所有文件" > "reviews/${dir//\//-}.md"
done

echo "All reviews saved to reviews/"
```

### 在 CI 中集成 Pre-commit 审查

将 code-reviewer agent 集成到 Git pre-commit hook 或 CI pipeline 中，每次提交前自动审查变更的文件，拦截 critical 和 high 级别的 findings。

```bash
#!/bin/bash
# .git/hooks/pre-commit
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

if [ -n "$CHANGED_FILES" ]; then
  echo "$CHANGED_FILES" > /tmp/review-files.txt
  RESULT=$(claude --subagent code-reviewer --prompt "审查 /tmp/review-files.txt 中列出的文件，只输出 critical 和 high 级别的 findings")

  if echo "$RESULT" | grep -q "critical\|high"; then
    echo "❌ Pre-commit review found critical/high issues:"
    echo "$RESULT"
    exit 1
  fi
fi

echo "✅ Pre-commit review passed"
```

:::warning
CI 中的 agent 审查需要消耗 API tokens，建议只在关键分支（main/release）上启用，或者限制审查范围到变更行数超过阈值的 PR。对于小改动，靠 lint + typecheck 就够了。
:::
