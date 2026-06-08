---
title: Comet 自动化流水线
description: Comet 将 OpenSpec 与 Superpowers 串联为五阶段自动化流水线，一键安装三大工具并提供断点续接能力
---

# Comet 自动化流水线

OpenSpec 管 **WHAT**（做什么），Superpowers 管 **HOW**（怎么做），但两者不会自动衔接——在 `/opsx:apply` 执行时，Superpowers 的 TDD 等 Skills 不会自动触发，需要手动配置。Comet 解决的就是这个问题。

## Comet 是什么

Comet 是一个开源自动化桥接工具，将 OpenSpec 和 Superpowers 串联为一条五阶段流水线，消除手动衔接成本。

| 属性 | 说明 |
|------|------|
| 作者 | rpamis（中国开发者） |
| GitHub | [rpamis/comet](https://github.com/rpamis/comet) |
| 许可证 | MIT |
| 版本 | v0.2.7+ |
| 支持平台 | 28 个 AI 编程平台（Claude Code、Cursor、Windsurf、通义灵码、CodeBuddy 等） |

:::tip
如果你觉得手动串联 OpenSpec 和 Superpowers 太麻烦，Comet 是最佳选择——一键安装三个工具，五阶段流水线自动运行。
:::

## 安装

```bash
# 全局安装 Comet（自动安装 OpenSpec + Superpowers）
npm install -g @rpamis/comet

# 在项目目录初始化
cd your-project
comet init
```

`comet init` 会：

1. 自动检测已有的 AI 平台配置
2. 询问安装范围（项目级或全局）
3. 选择语言（支持中文）
4. 自动安装 OpenSpec Skills、Superpowers Skills 和 Comet 自身的 Skills
5. 创建工作目录

## 五阶段工作流

```mermaid
flowchart LR
    A["/comet-open\n开启变更"] --> B["/comet-design\n深度设计"]
    B --> C["/comet-build\n计划构建"]
    C --> D["/comet-verify\n验证收尾"]
    D --> E["/comet-archive\n归档"]
```

| 阶段 | 命令 | 底层工具 | 产出 |
|------|------|---------|------|
| 1. 开启变更 | `/comet-open` | OpenSpec | proposal.md, design.md, tasks.md |
| 2. 深度设计 | `/comet-design` | Superpowers | Design Doc, delta spec |
| 3. 计划构建 | `/comet-build` | Superpowers | 实施计划, 代码提交 |
| 4. 验证收尾 | `/comet-verify` | 两者 | 验证报告, 分支处理 |
| 5. 归档 | `/comet-archive` | OpenSpec | delta 合并进主 spec |

每个阶段退出前都有**守卫脚本**验证条件，不满足会输出 `[HARD STOP]` 并告诉你下一步怎么做，防止 AI 假装完成直接跳阶段。

## 状态管理

Comet 用两个解耦的 YAML 文件记录进度：

- `.openspec.yaml` — OpenSpec 管理
- `.comet.yaml` — Comet 管理

```yaml title=".comet.yaml"
workflow: full
phase: build
build_mode: subagent-driven-development
isolation: branch
verify_result: pending
archived: false
```

## 断点续接

中途断开（关闭终端、上下文窗口满等）后，直接执行：

```text
/comet continue
```

Comet 自动读取 `.comet.yaml`，识别当前阶段，从断点继续。

## 快捷路径

不需要走完整五阶段流程时，使用两个快捷命令：

| 命令 | 场景 | 跳过阶段 |
|------|------|---------|
| `/comet-hotfix` | 快速修 Bug | 跳过 brainstorming |
| `/comet-tweak` | 小改动 | 跳过 brainstorming 和完整计划 |

## 项目目录结构

安装完成后，项目目录如下：

```text
your-project/
├── .claude/skills/
│   ├── comet/SKILL.md
│   ├── comet-open/SKILL.md
│   ├── comet-design/SKILL.md
│   ├── comet-build/SKILL.md
│   ├── comet-verify/SKILL.md
│   ├── comet-archive/SKILL.md
│   ├── openspec-*/SKILL.md
│   └── brainstorming/SKILL.md
├── openspec/
│   └── changes/
│       └── your-feature/
│           ├── .openspec.yaml
│           ├── .comet.yaml
│           ├── proposal.md
│           ├── design.md
│           └── tasks.md
└── docs/superpowers/
    ├── specs/       # Design 文档
    └── plans/       # 实施计划
```

## 如何选择

三个工具不是必须一起用，按需叠加：

| 需求 | 推荐方案 |
|------|---------|
| 提升 AI 编码纪律 | 只装 Superpowers |
| 需求可追溯 + 长期迭代 | Superpowers + OpenSpec |
| 一键自动串联 | Comet（含前两者） |

**推荐安装顺序：**

1. **第一步**：先装 Superpowers——一行命令，装完立即有效果，零学习成本
2. **第二步**：项目复杂后加 OpenSpec——需要需求可追溯、多人协作时引入
3. **第三步**：觉得手动衔接麻烦，上 Comet——一键全装，五阶段自动跑

:::info
Comet 的优势在于自动化——它不仅安装工具，还提供守卫脚本和状态管理，确保每个阶段严格执行。如果你更喜欢手动控制，可以只用 OpenSpec + Superpowers 的手动桥接方案（参见 [双层规划](/guide/advanced/openspec-superpowers)）。
:::

## 相关资源

- [OpenSpec 规格驱动开发](/guide/advanced/openspec) — OpenSpec 完整文档
- [Superpowers 插件](/guide/advanced/superpowers) — Superpowers 完整文档
- [OpenSpec + Superpowers 双层规划](/guide/advanced/openspec-superpowers) — 手动桥接方案
