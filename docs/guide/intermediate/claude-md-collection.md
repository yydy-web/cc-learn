---
title: CLAUDE.md 社区模板精选
description: 收集 GitHub 上高质量、可复制的 CLAUDE.md 模板和最佳实践，覆盖多种技术栈和使用场景
---

# CLAUDE.md 社区模板精选

写好 CLAUDE.md 不需要从零开始。社区已经沉淀了大量经过验证的模板和最佳实践。这篇文章整理了目前最值得参考的资源。

## 快速分类

| 类型 | 推荐 | 适合 |
|------|------|------|
| 行为规范型 | [Golden CLAUDE.md](#golden-claudemd) | 所有项目，管控 AI 行为边界 |
| 极简入门型 | [Minimal 模板](#minimal-模板) | 小项目、快速上手 |
| Karpathy 原则型 | [andrej-karpathy-skills](#andrej-karpathy-skills) | 追求代码质量、减少无效改动 |
| 全栈项目型 | [Next.js / FastAPI](#全栈模板) | 复杂项目、团队协作 |
| 模板仓库 | [claude-code-best-practices](#模板仓库) | 按技术栈找现成模板 |

---

## Golden CLAUDE.md

**来源**：[github.com/Z-M-Huang/golden-CLAUDE.md](https://github.com/Z-M-Huang/golden-CLAUDE.md)

从 30+ 个顶级 CLAUDE.md 提炼出的行为规范模板，不到 100 行，专注管控 AI 的行为边界而非代码风格。

### 核心亮点

- **禁止谄媚语言**：`NEVER use sycophantic language: "Great question!", "Absolutely!", "You're absolutely right!"`
- **改代码前先读、先声明意图**：不凭猜测动手，先找到现有的模式和约定
- **必须带 Risk 评估**：非平凡改动必须列出失败场景和缓解措施
- **安全边界清晰**：不 commit/push/deploy/force-push/rm -rf 除非用户明确说
- **"我不知道"是可接受的答案**：禁止编造，遇到不确定的事直接说

### 使用方法

```bash
# 安装为全局 CLAUDE.md（推荐）
curl -o ~/.claude/CLAUDE.md https://raw.githubusercontent.com/Z-M-Huang/golden-CLAUDE.md/main/CLAUDE.md

# 或者追加到项目 CLAUDE.md（保留项目自身配置）
curl https://raw.githubusercontent.com/Z-M-Huang/golden-CLAUDE.md/main/CLAUDE.md >> CLAUDE.md
```

:::warning
如果安装到 `~/.claude/CLAUDE.md`（全局），会覆盖所有项目的默认行为。建议先阅读一遍内容，确认规则适合你的工作方式。
:::

---

## Minimal 模板

**来源**：[claude-code-best-practices](https://github.com/MuhammadUsmanGM/claude-code-best-practices/blob/main/examples/claude-md-minimal.md)

只写 Claude 无法从代码推断的东西。20 行覆盖 80% 的需求。

```markdown
# MyApp

Node.js/Express backend with PostgreSQL.

## Commands

- `npm test` — run tests (Jest)
- `npm test -- --testPathPattern=users` — run tests matching "users"
- `npm run lint` — ESLint check
- `npm run dev` — start dev server

Run `npm run lint && npm test` before committing.

## Structure

- `src/routes/` — API route handlers
- `src/models/` — database models (Sequelize)
- `src/middleware/` — Express middleware
- `tests/` — test files mirroring src/ structure

## Rules

- TypeScript strict mode — no `any`
- All API responses use the format: `{ data, error, status }`
- Use the existing logger (`src/utils/logger.ts`), not console.log
```

### 设计哲学

- 不写代码风格（交给 Linter）
- 不写显而易见的事（交给 Claude 自己读代码）
- 从真实踩坑中长出来：AI 犯一次错 → 加一条规则
- **不要让 CLAUDE.md 超过 200 行**——超过后模型遵循度明显下降

---

## andrej-karpathy-skills

**来源**：[github.com/forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills)

基于 **Andrej Karpathy**（前 OpenAI 联合创始人、前 Tesla AI 总监）对 LLM 编程痛点的观察总结。四条原则，目标是让 AI 少做无用功、少引入 bug、少过度设计。

### 四条原则

**1. Think Before Coding（先想再写）**

遇到模糊需求时：
- 明确列出你的假设
- 如果有多种理解方式，都提出来
- 如果有更简单的方案，主动提出
- 遇到困惑时停下来问，不要猜

**2. Simplicity First（极简优先）**

- 只写解决问题的最少代码
- 不为「以后可能用到」写代码
- 不把一次性的逻辑抽象成通用工具
- 一个判断标准：**资深工程师看了会不会觉得过度设计？**
- 如果 200 行能砍成 50 行——重写

**3. Surgical Changes（手术式修改）**

- 只改任务涉及的东西
- 不顺手「优化」相邻代码、不改格式、不重构没坏的东西
- 匹配现有风格，不引入新风格
- 只清理本次改动造成的孤儿代码（未使用的 import、变量、函数）
- **不改已有的死代码**——除非你专门被要求做清理

**4. Goal-Driven Execution（目标驱动执行）**

- 把"加表单验证"变成"先写无效输入测试 → 让测试通过"
- 把"修 bug"变成"先写能复现 bug 的测试 → 修 → 验证测试通过"
- 多步骤任务给出简短计划，每步有验证检查点

### 安装方式

**方式一：Claude Code Plugin（推荐）**

```bash
# 从 marketplace 安装
/plugin marketplace add forrestchang/andrej-karpathy-skills

# 启用插件
/plugin install andrej-karpathy-skills@karpathy-skills
```

安装后，四条原则自动注入到每次对话中，无需手动配置。

**方式二：手动写入 CLAUDE.md**

```bash
# 新项目——直接下载
curl -o CLAUDE.md https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md

# 已有 CLAUDE.md——追加到末尾
echo "" >> CLAUDE.md
curl https://raw.githubusercontent.com/forrestchang/andrej-karpathy-skills/main/CLAUDE.md >> CLAUDE.md
```

:::tip
如果你已有项目自身的 CLAUDE.md（含技术栈、命令等），建议用追加方式。把 Karpathy 原则放在文件后半部分，项目特定信息放前面。
:::

**方式三：Cursor 用户**

仓库包含 `.cursor/rules/karpathy-guidelines.mdc` 项目规则文件。参考仓库中的 `CURSOR.md` 了解设置方法。

### 效果验证

怎么知道这些原则生效了？

- Diff 里不再有与需求无关的改动
- 不会因为过度设计而被迫要求重写
- AI 在犯错之前主动提问澄清

---

## 全栈模板

### Next.js 15 + Prisma + NextAuth

**来源**：[claude-code-best-practices](https://github.com/MuhammadUsmanGM/claude-code-best-practices/blob/main/examples/claude-md-nextjs.md)

覆盖 App Router 全栈项目需要的一切：

- **命令**：dev/build/test/lint/Prisma 迁移流程
- **路由约定**：Route Groups、Server Component 优先、文件命名
- **数据库规则**：Prisma 单例、软删除、显式 @relation
- **认证安全**：NextAuth v5，**核心规则 "Never trust client-provided user IDs — always derive from session"**
- **样式**：Tailwind + `cn()` + CVA
- **禁止项**：不用 Pages Router 模式、不在 Server Component 调 API、不滥用 `'use client'`、不用 `any`

### FastAPI + SQLAlchemy

**来源**：[claude-code-best-practices](https://github.com/MuhammadUsmanGM/claude-code-best-practices/blob/main/examples/claude-md-python.md)

三层架构项目模板：

- **命令**：pytest/mypy/ruff/uvicorn，附虚拟环境激活说明
- **分层约束**：routers → services → repositories，防止 AI 把业务逻辑塞进路由
- **类型规范**：强制 type hints + `from __future__ import annotations` + Google 风格 docstring
- **迁移纪律**：所有 schema 变更走 Alembic，禁止手动改表
- **禁止项**：`import *`、`print()`（用 logging）、绕过 repository 层写裸 SQL

---

## 模板仓库

需要更多技术栈的模板？这些仓库维护了大量现成配置：

### claude-code-best-practices

[github.com/MuhammadUsmanGM/claude-code-best-practices](https://github.com/MuhammadUsmanGM/claude-code-best-practices)

社区最全面的 CLAUDE.md 资源库，包含：

- **11 个技术栈模板**：React、Python、Go、Rust、Rails、Django、Next.js、Spring Boot、Flutter、Monorepo、Minimal
- **4 个 Starter Kit**：React、Next.js、Python、Go 的完整项目模板
- **30+ 篇指南**：覆盖工作流、权限、成本优化、安全、多 Agent 协作
- **错误清单**：CLAUDE.md 常见反模式

### claude-md-templates

[github.com/abhishekray07/claude-md-templates](https://github.com/abhishekray07/claude-md-templates)

三级分层体系的设计参考：

- `~/.claude/CLAUDE.md`（全局）—— 个人偏好，跨项目生效
- `./CLAUDE.md`（项目）—— 团队共享，提交到 Git
- `CLAUDE.local.md`（本地）—— 个人覆盖，`.gitignore`

含 Next.js/TypeScript 和 Python/FastAPI 的完整示例。

### claude-code-patterns

[github.com/AaronRoeF/claude-code-patterns](https://github.com/AaronRoeF/claude-code-patterns/blob/main/PART2-TECHNIQUES.md)

134 个实战技巧，其中 CLAUDE.md 相关精华：

- 控制在 300 行以内，用渐进式披露（告诉 Claude 去哪找信息，不要内联所有内容）
- 上下文占用达 78% 时执行 `/compact`
- 每次对话目标锁定 3-5 个文件
- 使用 `<!-- HTML 注释 -->` 写备注，运行时零 token 消耗

---

## 写好 CLAUDE.md 的核心原则

综合上述所有资源，五条跨越所有来源的共识：

1. **短**：40-80 行最佳，超过 200 行模型遵循度下降。删掉 Claude 能从代码读出来的东西
2. **渐进式生长**：别一次性写完。AI 犯一次错 → 加一条规则。从真实问题中迭代出来
3. **代码风格交给 Linter**：ESLint/Prettier/Ruff 管格式化，CLAUDE.md 管架构和约定
4. **用指针不用拷贝**：写 `src/auth.ts:15-45` 而不是粘贴代码片段（代码片段会过时）
5. **加禁止项**：`不要引入新依赖`、`别改 _meta.json`、`不要使用 any`——否定约束往往比正面指导更有效

---

## 下一步

- [CLAUDE.md 与项目约定](/guide/intermediate/claude-md) — 从头写 CLAUDE.md 的方法论
- [上下文管理](/guide/intermediate/context-management) — 控制对话上下文，保持 AI 响应质量
- [提高 AI 生成准确率](/guide/intermediate/improve-ai-accuracy) — CLAUDE.md 之外的提效技巧
