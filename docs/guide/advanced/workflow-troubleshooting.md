---
title: 工作流故障排除
description: Claude Code 开发工作流中的常见卡点诊断与修复方案，覆盖 Skills 触发、规则冲突、Worktree 管理等场景
---

# 工作流故障排除

使用 Claude Code 配合各类插件和 Skills 时，难免遇到卡点。本文整理最常见的故障场景，提供诊断思路和修复方案。

:::tip
如果问题涉及 OpenSpec + Superpowers 双框架的特定踩坑，请参考[双框架踩坑指南](/guide/advanced/openspec-superpowers-pitfalls)。
:::

## Skills 未自动触发

**症状：** 安装了 Superpowers / Gstack 等插件，但对话时 Skills 没有自动触发。

**诊断步骤：**

1. 检查 Skills 路径是否正确：

```bash
ls -la ~/.claude/skills/
ls -la .claude/skills/
```

2. 检查 `settings.json` 中是否正确注册了 Skills
3. 确认对话内容是否匹配 Skills 的触发条件

**修复方案：**

```bash
# 重新安装 Superpowers
npx skills remove superpowers
npx skills add obra/superpowers

# 手动触发技能验证
/skill:using-superpowers
```

**预防：** 使用 [CC-Switch](/guide/advanced/cc-switch) 管理插件安装，避免路径配置错误。

## OpenSpec 与 Superpowers 规则冲突

**场景：** OpenSpec tasks.md 说「跳过测试」，Superpowers TDD Skill 说「必须写测试」。

**优先级规则：**

```text
用户指令 > 技能规则 > 项目默认行为
```

**修复方案：**

- 明确指定优先级：「这次变更不需要 TDD，直接实现」→ 遵循用户指令
- 在 CLAUDE.md 中记录项目级例外规则
- 参考 [AGENTS 全局路由协议](/guide/advanced/agents-routing) 配置多框架优先级

## Worktree 管理混乱

**症状：** 多个功能分支同时开发，worktree 占用磁盘空间，目录/分支混乱。

**修复方案：**

```bash
# 列出所有 worktree
git worktree list

# 清理已完成的 worktree
git worktree remove ../project-feature-a
git worktree prune
```

**最佳实践：**

- 命名规则：`../<repo>-<change>-<yyyyMMdd>` 或 `../<repo>-feature-xxx`
- 保持 ≤ 3 个活跃 worktree
- 完成一个就删一个

## Verify 失败

**症状：** 验证报告提示某些任务未覆盖，或测试/构建失败。

**修复步骤：**

1. 把失败项映射回 `tasks.md`——哪个任务的 DoD 没满足
2. 先修「便宜失败」（lint/类型/单测），再修系统性失败（集成/架构）
3. 修复后补 1 条「回归测试点」

**预防：** 每完成 2–3 个小任务就做一次快速验证，不要堆到最后。

## 上下文窗口溢出

**症状：** AI 开始「失忆」，忘记之前的对话内容或项目规范。

**修复方案：**

```bash
# 压缩上下文
/compact

# 或者完全重启
/clear
```

**预防策略：**

| 策略 | 说明 |
|------|------|
| 分层加载 | 规格阶段只加载 OpenSpec，实现阶段再加 Superpowers Skills |
| 及时压缩 | 每 10-15 轮对话执行一次 `/compact` |
| 精确指定文件 | 不要让 Claude 读整个项目，指定具体文件 |
| 按需 Skills | 不要全量加载 14 个 Skills，选择 5 个核心即可 |

## MCP 服务器无响应

**症状：** 工具调用超时，MCP 服务器相关功能不可用。

**诊断步骤：**

1. 检查 MCP 服务器进程是否存活
2. 查看日志是否有连接错误
3. 确认网络代理/防火墙设置

**修复方案：**

```bash
# 重启 MCP 服务器
claude mcp remove <server-name>
claude mcp add <server-name> <command>

# 检查 MCP 配置
claude mcp list
```

## 效果衡量

使用双框架协同开发时，可通过以下指标衡量效果：

| 指标 | 测量方式 | 目标值 |
|------|---------|--------|
| 需求覆盖率 | specs 条目 vs 实现功能 | ≥ 95% |
| 测试覆盖率 | 单元测试覆盖率报告 | ≥ 80% |
| 返工率 | 返工任务数 / 总任务数 | < 20% |
| 代码审查通过率 | 一次通过审查的任务比例 | ≥ 70% |
| 变更归档率 | 已归档变更 / 总变更 | 100% |

## 相关资源

- [双框架踩坑指南](/guide/advanced/openspec-superpowers-pitfalls) — OpenSpec + Superpowers 特定问题
- [AGENTS 全局路由协议](/guide/advanced/agents-routing) — 多框架优先级配置
- [最佳实践](/tips/best-practices) — 日常使用技巧
- [上下文管理](/guide/intermediate/context-management) — Token 管理基础
