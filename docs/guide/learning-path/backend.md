---
title: 后端开发 · 学习路线
description: 后端专属 Claude Code 学习路径——API 开发、数据库设计、架构重构、CI/CD 自动化，覆盖 Java/Python/Go 等主流技术栈
---

# 后端开发 · 学习路线

后端开发的 Claude Code 用法和前端的差异在于：更重架构设计、数据库操作、API 规范、CI/CD 集成。这条路线按后端场景组织。

**预计时间**：~5 小时
**前置条件**：熟悉至少一门后端语言，会用 Git

## 🛠️ 推荐安装的 Skills（8 分钟）

### 必装（开发工作流基础）

```bash
# 1. Superpowers — 14 个结构化开发 Skills：头脑风暴→方案设计→TDD→调试→审查
/plugin marketplace add superpowers
/plugin install superpowers@claude-plugins-official

# 2. OpenSpec — 规格驱动开发，API 先写 OpenAPI Spec 再写代码
npm install -g @fission-ai/openspec@latest

# 3. Context7 — 自动注入最新框架/库文档，避免 API 幻觉和过时代码
npx skills add https://github.com/anthropics/skills --skill context7
```

### 代码质量与理解

```bash
# 4. Serena — IDE 级语义理解：符号查找、精确重命名、调用链追踪
npx skills add https://github.com/anthropics/skills --skill serena

# 5. CodeGraph — 代码知识图谱：一秒回答"改这个 model 会影响哪些 API"
npx skills add https://github.com/anthropics/skills --skill codegraph
```

### 框架专项（按技术栈选装）

```bash
# Java / Spring Boot
npx skills add https://github.com/spring-projects/spring-boot --skill spring-boot
npx skills add https://github.com/mybatis/spring-boot-starter --skill mybatis

# Python / FastAPI
npx skills add https://github.com/tiangolo/fastapi --skill fastapi
npx skills add https://github.com/sqlalchemy/sqlalchemy --skill sqlalchemy

# 通用 API 开发
npx skills add https://github.com/anthropics/skills --skill api-design
```

### 自动化（按需）

```bash
# 6. Ralph — 自主循环执行 PRD 任务，直到所有用户故事完成
/plugin marketplace add snarktank/ralph
/plugin install ralph-skills@ralph-marketplace

# 7. Gstack — 23+ 个按工程角色组织的虚拟团队 Skills
/plugin marketplace add gstack
/plugin install gstack@claude-plugins-official
```

:::tip
**先装必装的 3 个，再按语言选 1-2 个框架专项。** Ralph 和 Gstack 适合复杂项目或多人协作场景，小项目不需要。Skills 总数建议控制在 5-7 个以内。
:::

---

## 阶段一：安装与基础（~30 分钟）

| 顺序 | 内容 | 要点 |
|------|------|------|
| 1 | [什么是 Claude Code](/guide/beginner/what-is-claude-code) | 理解终端 AI 助手的能力边界 |
| 2 | [安装配置](/guide/beginner/installation) | `npm install -g @anthropic-ai/claude-code` |
| 3 | [快速开始](/guide/quick-start) | 在现有后端项目里跑通第一次对话 |
| 4 | [第一次对话](/guide/beginner/first-conversation) | 学会描述 API 需求、给出数据模型上下文 |
| 5 | [文件操作](/guide/beginner/file-operations) | 多文件修改——改 schema 同时改 model 和 route |
| 6 | [权限管理](/guide/beginner/permissions) | 数据库操作需要确认，别让 AI 直接跑 DROP |

**验收**：在项目里让 Claude Code 加一个新 API 端点，从 route → service → repository 全链路。

---

## 阶段二：日常提效（~60 分钟）

| 顺序 | 内容 | 要点 |
|------|------|------|
| 1 | [CLAUDE.md](/guide/intermediate/claude-md) | 写清楚框架、ORM、数据库、分层架构 |
| 2 | [社区模板精选](/guide/intermediate/claude-md-collection) | 用 FastAPI 或 Spring Boot 模板改 |
| 3 | [代码库导航](/guide/intermediate/codebase-navigation) | 追踪调用链——从 Controller 到 SQL |
| 4 | [提高 AI 准确率](/guide/intermediate/improve-ai-accuracy) | 后端提示词技巧：给 Schema 让它生成 CRUD |
| 5 | [上下文管理](/guide/intermediate/context-management) | `/compact` + 分模块对话 |
| 6 | [Git 工作流](/guide/intermediate/git-workflow) | commit、PR、code review 全流程 |

**验收**：CLAUDE.md 写了分层架构约定，AI 不会把 SQL 写在 Controller 里。

---

## 阶段三：核心扩展（~60 分钟）

| 顺序 | 内容 | 为什么后端必装 |
|------|------|---------------|
| 1 | [MCP 服务器](/guide/advanced/mcp-servers) | 连接数据库、Redis、消息队列——AI 直接查表结构 |
| 2 | [Hooks](/guide/advanced/hooks) | 提交前跑类型检查 + lint + 单元测试 |
| 3 | [自动化 CI/CD](/guide/advanced/automation) | Claude Code 接入 CI 流水线——自动修 lint 错误、生成 migration |
| 4 | [cc-switch](/guide/advanced/cc-switch) | 简单 CRUD 用便宜模型，复杂架构用强模型 |

**验收**：MCP 连上开发数据库，Hook 在 commit 前自动跑 `mypy` / `cargo clippy`。

---

## 阶段四：技术栈专项（~90 分钟）

### Java / Spring Boot

| 顺序 | 内容 | 要点 |
|------|------|------|
| 1 | [Java 最佳实践](/tips/java-best-practices) | 项目配置、提示词策略、构建工具 |
| 2 | [Java LSP 配置](/tips/java-practices/lsp-setup) | jdtls 语义级代码理解，不再纯靠 grep |
| 3 | [Java 集成工作流](/tips/java-practices/integrated-workflow) | ECC + Gstack + Superpowers + CodeGraph 五阶段 |
| 4 | [Java 场景实战](/tips/java-practices/scenarios) | 新功能、大型重构、遗留项目接管 |
| 5 | [Java 代码分析](/tips/java-practices/code-reading) | 理解业务逻辑、追踪调用链、分析架构 |
| 6 | [Java 自定义 Skills](/tips/java-custom-skills) | API 端点生成、Service 审查、DB 迁移审查 |

### Python / FastAPI

| 顺序 | 内容 | 要点 |
|------|------|------|
| 1 | [Python 最佳实践](/tips/python-best-practices) | 项目配置、pytest、httpx |
| 2 | [Python LSP 配置](/tips/python-practices/lsp-setup) | basedpyright 语义诊断 |
| 3 | [API 测试架构](/tips/python-practices/api-testing-patterns) | 分层策略、响应验证、幂等性保障 |

### 通用工作流

| 内容 | 要点 |
|------|------|
| [SDD 规格驱动](/guide/advanced/sdd/sdd-guide) | API 先写 OpenAPI Spec 再写代码——接口契约先行 |
| [多 Agent](/guide/advanced/multi-agent) | 并行开发多个微服务 |
| [代码图谱](/guide/advanced/code-graph/codegraph) | 追踪改动影响面——"改了 User 表会影响哪些 API？" |

**验收**：用 SDD 方式写一个新微服务——先写 OpenAPI Spec，再生成代码，最后验证。

---

## 阶段五：架构与运维（~60 分钟）

| 顺序 | 内容 | 要点 |
|------|------|------|
| 1 | [代码图谱工具](/guide/advanced/code-graph/code-graph-tools) | CodeGraph / GitNexus / Graphify 选型 |
| 2 | [Serena 语义工具](/guide/advanced/serena) | IDE 级代码理解——精确重命名、符号级重构 |
| 3 | [Context7](/guide/advanced/context7) | 自动注入最新框架文档——避免 API 幻觉 |
| 4 | [Headroom](/guide/advanced/headroom) | 大项目 token 消耗优化——60-95% 节省 |
| 5 | [Claude-Mem](/guide/advanced/claude-mem) | 跨对话记住架构决策 |
| 6 | [Obsidian 集成](/guide/advanced/claude-code-obsidian) | 架构笔记和代码联动 |

**验收**：能用 `codegraph_impact` 回答"改了这个 model 会影响哪些 service"。

---

## 后端 CLAUDE.md 模板

```markdown
# CLAUDE.md — 后端项目

## 技术栈
- Java 17 + Spring Boot 3
- MyBatis-Plus + PostgreSQL
- Redis 做缓存
- RabbitMQ 做消息队列

## 分层架构（严格遵守）
Controller → Service → Repository → DB
- Controller：参数校验 + 路由，不写业务逻辑
- Service：业务逻辑 + 事务管理
- Repository：数据库操作，不写业务判断

## API 规范
- RESTful 命名，kebab-case 路径
- 统一返回格式：{ code, data, message }
- 异常统一用 GlobalExceptionHandler 处理
- 所有 API 写 Swagger 注解

## 不要做的事
- 不要绕过 Service 层直接在 Controller 写逻辑
- 不要用 SELECT * —— 显式列出字段
- 不要把 secret/密码硬编码
- 改 DB schema 必须先生成 migration
```

---

## 你不需要学的东西

- Figma MCP、Chrome DevTools MCP — 前端专用
- UI/UX 设计工具 — 除非你做全栈
- Axure 原型验证 — 产品/前端场景

---

## 下一步

- [前端开发路线](/guide/learning-path/frontend) — 如果你是全栈
- [测试路线](/guide/learning-path/qa) — API 自动化测试深度指南
- [产品路线](/guide/learning-path/product) — 理解需求侧的 AI 用法
