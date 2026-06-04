---
title: Gstack 技能生态
description: Gstack 的 23+ 个 Skills 概览——按工程角色组织的虚拟团队工作流
---

# Gstack 技能生态

[Gstack](/guide/advanced/gstack)（Garry's Stack）将 Claude Code 扩展为一个虚拟工程团队，提供 23+ 个专业 Skills，每个 Skill 扮演一个工程角色。

:::tip
本页属于[技能系统](/skills/)的一部分。安装配置和内置浏览器详情请参考 [Gstack 工具包](/guide/advanced/gstack)。
:::

## Sprint 工作流

```
Think → Plan → Build → Review → Test → Ship → Reflect
思考   规划   构建   审查    测试   发布   回顾
```

## 23+ 个 Skills 按角色分类

### Think（思考）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/office-hours` | 产品经理 | YC 式产品拷问 |
| `/spec` | 规格工程师 | 将意图转化为规格文档 |

### Plan（规划）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/plan-ceo-review` | CEO | 四种审查模式 |
| `/plan-eng-review` | 工程经理 | 架构和测试策略锁定 |
| `/plan-design-review` | 高级设计师 | 设计质量评分 |
| `/plan-devex-review` | DX 负责人 | 开发者体验审查 |
| `/autoplan` | 自动调度 | 根据项目类型选择 |

### Review（审查）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/review` | Staff Engineer | 生产 Bug 聚焦审查 |
| `/investigate` | 调试专家 | 系统性根因分析 |
| `/design-review` | 设计师+开发者 | 设计问题审计 |
| `/devex-review` | DX 审计 | 开发者入职体验 |
| `/codex` | 独立审查员 | 跨模型独立审查 |

### Test（测试）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/qa` | QA Lead | 真实浏览器测试 |
| `/qa-only` | QA 报告 | 只报告不修改 |
| `/cso` | 安全负责人 | OWASP Top 10 + STRIDE |
| `/benchmark` | 性能工程师 | Core Web Vitals |

### Ship（发布）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/ship` | 发布工程师 | 同步、测试、推送、创建 PR |
| `/land-and-deploy` | 部署工程师 | 合并 PR、验证生产 |
| `/canary` | 监控 | 部署后监控 |

### Reflect（回顾）

| Skill | 角色 | 用途 |
|-------|------|------|
| `/retro` | 回顾主持人 | 每周回顾 |
| `/learn` | 知识管理 | 跨会话学习 |
| `/document-release` | 文档工程师 | 更新文档 |
| `/document-generate` | 文档生成 | Diataxis 框架生成 |

## 安装

```
> git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack && cd ~/.claude/skills/gstack && ./setup
```

也可通过 [CC-Switch](/skills/skills-marketplace) 市场发现 Gstack 的独立 Skills。

## 与其他 Skills 的关系

| 对比 | [Superpowers](/skills/superpowers) | Gstack |
|------|-------------------------------------|--------|
| **定位** | 结构化方法论 | 虚拟工程团队 |
| **特色** | TDD 强制执行 | 内置浏览器、iOS 测试 |
| **推荐组合** | 前期设计 + TDD 实现 | 后期审查 + QA + 发布 |

## 下一步

- [Gstack 工具包（完整文档）](/guide/advanced/gstack) — 安装、配置和内置浏览器详解
- [Superpowers 技能生态](/skills/superpowers) — 互补的结构化开发方法论
- [技能市场](/skills/skills-marketplace) — 浏览和安装社区 Skills
