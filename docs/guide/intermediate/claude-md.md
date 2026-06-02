---
title: CLAUDE.md 与项目约定
description: 使用 CLAUDE.md 文件为 Claude Code 提供项目上下文和行为约束
---

# CLAUDE.md 与项目约定

`CLAUDE.md` 是 Claude Code 的项目说明书。它在每次对话开始时自动加载，让 Claude Code 了解你的项目约定、常用命令和开发规范。

## 基本结构

在项目根目录创建 `CLAUDE.md`：

```markdown
# CLAUDE.md

## 项目概述
这是一个基于 Next.js 的电商平台，使用 PostgreSQL 数据库。

## 常用命令
- `npm run dev` — 启动开发服务器
- `npm run build` — 构建生产版本
- `npm test` — 运行所有测试
- `npm run test:watch` — 监听模式运行测试
- `npm run lint` — 检查代码规范

## 代码规范
- 使用 TypeScript strict 模式
- 组件使用函数式写法，不用 class
- 样式使用 Tailwind CSS，不写自定义 CSS
- API 路由放在 app/api/ 目录下

## 项目结构
- `src/app/` — Next.js App Router 页面
- `src/components/` — 可复用组件
- `src/lib/` — 工具函数和配置
- `src/hooks/` — 自定义 React hooks
- `prisma/` — 数据库 schema 和迁移
```

## 写好 CLAUDE.md 的原则

### 1. 写非显而易见的事

❌ 不需要写：
```
## 代码规范
- 写清晰的代码
- 添加适当的注释
- 处理错误情况
```

✅ 应该写：
```
## 代码规范
- 错误统一用 AppError 类抛出，不用原生 Error
- API 响应格式统一为 { code, data, message }
- 数据库查询必须用 Prisma，不用原生 SQL
```

### 2. 写常用命令

把团队日常使用的命令都列出来，Claude Code 会直接执行：

```markdown
## 常用命令
- `pnpm dev` — 启动开发（注意用 pnpm 不是 npm）
- `pnpm test -- --watch` — 监听测试
- `pnpm db:migrate` — 运行数据库迁移
- `pnpm db:seed` — 填充测试数据
```

### 3. 写项目特定的约定

```markdown
## 约定
- 路由文件命名用 kebab-case（如 user-profile.ts）
- 组件文件命名用 PascalCase（如 UserProfile.tsx）
- 数据库表名用 snake_case（如 user_profiles）
- API 路径用 kebab-case（如 /api/user-profiles）
```

## 多级 CLAUDE.md

Claude Code 支持多级配置，按优先级加载：

1. `~/.claude/CLAUDE.md` — 全局配置，适用于所有项目
2. `项目根目录/CLAUDE.md` — 项目级配置
3. `子目录/CLAUDE.md` — 目录级配置，只在该目录下的文件生效

:::tip
全局配置放通用偏好（如代码风格偏好），项目配置放项目特定信息（如技术栈、命令）。
:::

## 示例：完整的 CLAUDE.md

```markdown
# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供项目上下文。

## 项目概述
基于 Next.js 14 的 SaaS 应用，多租户架构。

## 技术栈
- Next.js 14 (App Router)
- TypeScript (strict)
- Prisma + PostgreSQL
- Tailwind CSS
- NextAuth.js

## 常用命令
- `pnpm dev` — 开发服务器
- `pnpm build` — 生产构建（会运行类型检查）
- `pnpm test` — 运行测试
- `pnpm test src/path/to/file.test.ts` — 运行单个测试文件
- `pnpm lint` — ESLint 检查
- `pnpm db:push` — 同步 schema 到数据库
- `pnpm db:studio` — 打开 Prisma Studio

## 架构说明
- 所有页面组件在 app/ 目录下，使用 Server Components 优先
- 客户端组件用 'use client' 标记
- API 路由在 app/api/ 下，统一用 Route Handlers
- 数据库操作通过 Prisma Client，放在 lib/db.ts

## 代码规范
- 禁止使用 any 类型
- 组件 props 必须定义 interface
- 错误处理用 try-catch，不用 .catch()
- 样式用 Tailwind，不写自定义 CSS
- 提交信息用英文，格式：type(scope): description
```

## 下一步

- [Git 工作流](/guide/intermediate/git-workflow) — 用 Claude Code 管理 Git 操作
- [上下文管理](/guide/intermediate/context-management) — 管理对话上下文和记忆
