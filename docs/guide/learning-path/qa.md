---
title: 测试 · 学习路线
description: 测试工程师专属 Claude Code 学习路径——自动化测试生成、Bug 分析、测试报告、CI/CD 集成，覆盖 UI 和 API 测试
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★☆☆ | ★★☆☆☆ |
| 🧪 测试 | ★★★★★ | ★★☆☆☆ |
| 📦 产品 | ★★★☆☆ | ★★★☆☆ |

**🎯 学习产出：** 掌握测试场景下的 Claude Code 使用技巧，能高效生成测试用例和自动化测试脚本

**🚀 AI 能力提升：** 测试生成、自动化工作流、调试诊断
:::

# 测试 · 学习路线

测试工程师用 Claude Code 最大的价值在于：自动生成测试用例、分析 Bug 根因、维护测试脚本、出测试报告。这条路线专注于测试场景。

**预计时间**：~4 小时
**前置条件**：了解测试基本概念（用例、断言、fixture），会至少一种测试框架

## 🛠️ 推荐安装的 Skills（5 分钟）

```bash
# 1. Superpowers — 14 个结构化开发 Skills，TDD 工作流直接内置
/plugin marketplace add superpowers
/plugin install superpowers@claude-plugins-official

# 2. 系统化调试 — 4 阶段调试流程：复现→定位→修复→验证
npx skills add https://github.com/anthropics/skills --skill systematic-debugging

# 3. Claude Mem — 记住常见 Bug 模式和修复方案，跨对话复用
npx skills add https://github.com/anthropics/skills --skill claude-mem

# 4. Skill Creator — 把"冒烟测试""回归测试"封装成 Skill，一句话跑全流程
/plugin install skill-creator@claude-plugins-official
```

### Python 测试专项

```bash
# 如果用 Python + pytest + Playwright
npx skills add https://github.com/microsoft/playwright --skill playwright
npx skills add https://github.com/pytest-dev/pytest --skill pytest
```

### 浏览器自动化（UI 测试）

```bash
# Agent Browser — AI 原生浏览器控制，refs 元素定位，无需手写 XPath
npm install -g agent-browser
```

:::tip
**先装前 3 个。** 测试工程师的核心能力是 TDD + 调试 + 记忆复用。Python 专项和浏览器自动化按实际项目需求加。Skills 总数建议控制在 4-5 个以内。
:::

---

## 阶段一：安装与基础（~30 分钟）

| 顺序 | 内容 | 要点 |
|------|------|------|
| 1 | [什么是 Claude Code](/guide/beginner/what-is-claude-code) | 理解它能帮你写测试，不能帮你"想测试什么" |
| 2 | [安装配置](/guide/beginner/installation) | `npm install -g @anthropic-ai/claude-code` |
| 3 | [快速开始](/guide/quick-start) | 在测试项目里跑通 |
| 4 | [第一次对话](/guide/beginner/first-conversation) | 学会把源码和现有测试一起拖进去 |
| 5 | [文件操作](/guide/beginner/file-operations) | 批量读源代码，生成对应测试文件 |
| 6 | [权限管理](/guide/beginner/permissions) | 测试可以自动跑——权限放宽松但要设边界 |

**验收**：给一个工具函数，让 Claude Code 写成 3 个测试用例（正常/边界/异常）。

---

## 阶段二：日常提效（~60 分钟）

| 顺序 | 内容 | 要点 |
|------|------|------|
| 1 | [CLAUDE.md](/guide/intermediate/claude-md) | 写清楚测试框架、断言库、fixture 管理方式 |
| 2 | [提高 AI 准确率](/guide/intermediate/improve-ai-accuracy) | **测试场景专用**：给被测代码 + 覆盖场景，AI 生成测试 |
| 3 | [上下文管理](/guide/intermediate/context-management) | 跑完一轮测试把失败信息喂回去，AI 自动修 |

### 测试专用 CLAUDE.md

```markdown
# CLAUDE.md — 测试项目

## 测试框架
- pytest + pytest-asyncio
- Playwright (UI 端到端)
- httpx (API 集成测试)
- factory_boy (测试数据工厂)

## 测试规范
- 测试文件命名：test_<模块名>.py
- 测试函数命名：test_<方法>_<场景>_<预期>
- 每个测试三行注释：Given / When / Then
- 用 fixture 管理测试数据，不硬编码
- 测试之间互相独立，不依赖执行顺序

## 覆盖要求
- 每个 API 端点至少：正常返回、参数校验、未授权 三个场景
- 每个页面至少：正常渲染、关键交互、错误状态

## 不要做的事
- 不要在生产环境跑测试
- 不要 skip 测试而不写原因注释
- 测试失败不要改断言——先分析是不是代码有问题
```

**验收**：有测试专用 CLAUDE.md，能把一份 API 文档变成 5 个测试场景。

---

## 阶段三：测试专项技能（~90 分钟）

### AI 生成代码质量

| 顺序 | 内容 | 要点 |
|------|------|------|
| 1 | [AI 代码自检](/tips/self-check) | 五步自检法——把 AI 生成的测试准确率从 70% 推到 90% |
| 2 | [Bug 调试技巧](/tips/debugging) | 系统化调试——复现 → 定位 → 修复 → 验证 |
| 3 | [多 Agent 协同](/tips/multi-agent-tips) | 一个 Agent 写测试，一个 Agent 审查，一个 Agent 跑 |

### 端到端测试工具链

| 顺序 | 内容 | 要点 |
|------|------|------|
| 1 | [Chrome DevTools MCP](/guide/advanced/chrome-devtools-mcp) | 浏览器自动化——截图对比、性能追踪、网络请求断言 |
| 2 | [用 Claude Code 做测试](/tips/claude-code-testing) | 从 PRD/API 文档/设计稿生成测试用例——黑白盒双轨 |
| 3 | [Agent Browser](/tips/agent-browser) | AI 原生浏览器自动化——refs 元素定位、语义查找 |

### Python 测试深度实践

| 顺序 | 内容 | 要点 |
|------|------|------|
| 1 | [Python 测试工具链](/tips/python-practices/) | pytest、Playwright、httpx、basedpyright 全景 |
| 2 | [LSP 配置](/tips/python-practices/lsp-setup) | basedpyright 语义级诊断——改完立即看到影响 |
| 3 | [Page Object Model](/tips/python-practices/playwright-pom) | BasePage + 组件嵌套 + 多环境——可维护的 UI 测试 |
| 4 | [API 测试架构](/tips/python-practices/api-testing-patterns) | 分层策略、响应验证层级、幂等性、资源清理 |
| 5 | [测试实战案例](/tips/python-practices/scenarios) | 电商 UI + REST API CRUD + 混合测试 |

**验收**：能用 POM 模式写一套可维护的 UI 测试，用 httpx 写一套完整的 API 测试。

---

## 阶段四：自动化流水线（~30 分钟）

| 顺序 | 内容 | 要点 |
|------|------|------|
| 1 | [自动化 CI/CD](/guide/advanced/automation) | 测试接入 CI——每次提交自动跑全量测试 |
| 2 | [Hooks](/guide/advanced/hooks) | 提交前自动跑相关测试——改哪个模块跑哪个 |
| 3 | [任务中断恢复](/guide/advanced/task-interruption-recovery) | 长时间测试跑一半断了怎么恢复 |

**验收**：pre-commit hook 自动跑改动文件的测试，失败不提交。

---

## 阶段五：进阶技能（~30 分钟）

### 选学

| 主题 | 要点 | 什么时候学 |
|------|------|-----------|
| [自定义 Skills](/skills/overview/custom-skills) | 封装"冒烟测试"、"回归测试"等流程 | 测试流程固定化后 |
| [Claude-Mem](/guide/advanced/claude-mem) | 记住常见 Bug 模式和修复方案 | Bug 模式反复出现时 |
| [Loop 工程](/tips/loop-engineering) | 定时跑回归测试，失败自动通知 | 有持续集成需求时 |
| [代码图谱](/guide/advanced/code-graph/codegraph) | 改了代码后自动找出该跑哪些测试 | 大型项目需要精准测试选择时 |

---

## 实战：测试工程师的一天

**上午 — 新功能测试**：
```text
根据这份 PRD [拖入文件]，列出所有需要测试的场景。
然后读取 src/api/orders.ts 的 createOrder 函数，
写 pytest 测试，覆盖：正常下单、库存不足、未登录、参数缺失。
```

**下午 — Bug 复现和修复验证**：
```text
用户反馈：订单列表页翻到第 3 页后数据重复。
这是相关代码：[拖入组件和 API 文件]。
先写一个能复现这个 Bug 的测试，然后分析根因。
```

**回归测试维护**：
```text
这个 PR 改了用户认证模块 [指向 diff]。
找出所有受影响的测试，跑一遍，把失败的分析出来，
是测试需要更新还是代码有问题。
```

---

## 你不需要学的东西

- Figma MCP、设计工具 — 非测试场景
- SDD 规格驱动开发 — 测试不需要写规格
- 前端/后端框架深度 Skills — 除非你做白盒测试

---

## 下一步

- [后端开发路线](/guide/learning-path/backend) — API 测试和接口开发联动
- [前端开发路线](/guide/learning-path/frontend) — UI 测试和组件开发联动
- [产品经理路线](/guide/learning-path/product) — 理解需求侧，写出更好的验收标准
