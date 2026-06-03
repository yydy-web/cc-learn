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

### TDD 模式

```
> 用 TDD 方式实现一个邮箱验证函数：
> 1. 先写测试
> 2. 运行测试确认失败
> 3. 写最小实现让测试通过
> 4. 重构优化
```

### 审查模式

```
> /plan
> 帮我规划一下如何重构 src/auth/ 模块，分析现有的问题和改进方案
```

### 探索模式

```
> 我刚接手这个项目，帮我：
> 1. 梳理整体架构
> 2. 找到核心业务逻辑
> 3. 识别潜在的技术债务
```

### 结构化开发模式（Superpowers）

安装 [Superpowers](/guide/advanced/superpowers) 插件后，Claude Code 会自动按照结构化工作流执行：

```
> 使用 Superpowers 工作流，给用户系统添加 OAuth 登录
```

这会触发完整的七步流程：头脑风暴 → 设计 → 计划 → TDD → 审查 → 完成。适合复杂功能开发。

### 虚拟工程团队模式（Gstack）

安装 [Gstack](/guide/advanced/gstack) 后，你可以用 Slash 命令调用不同工程角色：

```
> /office-hours
> 我想做一个实时协作编辑器

> /plan-eng-review
> 帮我审查架构方案

> /review
> 审查当前分支的代码改动

> /qa https://staging.example.com
> 在浏览器中测试这个页面
```

Gstack 覆盖从产品思考到发布监控的全流程，适合需要完整工程保障的项目。

### 规格驱动开发模式（OpenSpec）

安装 [OpenSpec](/guide/advanced/openspec) 后，用规格文档引导 AI 编码：

```
> /opsx:propose add-user-profile
先定义需求规格，再写代码

> /opsx:apply
按照任务清单逐步实现

> /opsx:archive
归档变更，更新活文档
```

规格驱动开发适合需求复杂、需要文档化的功能——所有规格都提交到 Git，成为团队共享的持久化上下文。

### 自主循环开发模式（Ralph）

安装 [Ralph](/guide/advanced/ralph) 后，可以让 Claude Code 自主循环完成功能开发：

```
> /prd
我想给项目添加搜索功能

> /ralph
将 PRD 转换为 prd.json
```

然后在终端运行：

```bash
./scripts/ralph/ralph.sh --tool claude
```

Ralph 会自主循环，逐个实现用户故事直到全部完成。适合需要长时间自主运行的场景——离开电脑，回来时功能已经开发完毕。

### 代码智能加速（CodeGraph）

安装 [CodeGraph](/guide/advanced/codegraph) 后，Claude Code 通过 MCP 查询本地代码知识图谱，替代逐文件扫描：

```bash
# 安装并初始化
codegraph install
cd your-project && codegraph init -i
```

之后 Claude Code 会自动使用 CodeGraph 理解代码——工具调用减少 71%，Token 消耗降低 57%。特别适合大型代码库。

### 代码审查图谱（Code Review Graph）

安装 [Code Review Graph](/guide/advanced/code-review-graph) 后，Claude Code 的代码审查会自动使用 Blast-Radius 分析：

```bash
pip install code-review-graph
code-review-graph install
code-review-graph build
```

CRG 提供 30 个 MCP 工具，覆盖代码审查、影响分析、架构理解和 Wiki 生成。Token 节省高达 38x-528x。

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
