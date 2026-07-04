# 全局菜单审计与文档全量更新 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 对 CC Learn 文档站 128 页进行菜单一致性审计和内容全量更新，分 4 阶段执行，每阶段产出 1 个 PR。

**Architecture:** 每个阶段独立执行：菜单审计（交叉对比 `_meta.json` 与实际文件）→ 逐页审查（11 项标准 + 插入导航卡片）→ `npm run build` 验证 → commit。阶段之间无依赖，可独立进行。

**Tech Stack:** Rspress v2, Markdown/MDX, JSON 配置文件

## 全局约束

- 不修改 `docs/superpowers/specs/`、`docs/compose/`、`rspress.config.ts`、主题文件、CSS
- 不新增或删除页面，除非审计发现确需调整
- 外部链接页面不在审查范围
- 每页 body 开头（description frontmatter 之后、第一个标题之前）插入 `:::info` 导航卡片
- AI 能力提升标签必须从固定标签集选择：`上下文管理` `代码生成` `自动化工作流` `代码审查` `测试生成` `项目协作` `技能扩展` `调试诊断` `性能优化` `跨文件重构` `设计→代码` `多智能体` `规格驱动`
- 每阶段完成后必须运行 `npm run build` 零错误、`npm run check` 通过

---

## 审查模式（每页重复，在此定义一次，后续任务引用）

每页审查时执行以下检查并累积修改，最后统一写入：

1. 检查 `description` frontmatter — 缺失则根据页面内容生成 50-160 字描述
2. 检查内容时效 — 功能/命令在当前版本是否仍有效，过期内容标注 `:::warning` 或修正
3. 检查归属 — 页面是否在正确的章节下
4. 检查导航 — 所在 `_meta.json` 是否包含该页
5. 检查写作质量 — 错别字、语法、逻辑断裂，当场修复
6. 检查交叉引用 — 相关内容是否链接，缺失则添加
7. 检查代码块 — ` ``` ` 语言标识是否正确（bash/shell/powershell/json/markdown 等），可执行片段是否有语法错误
8. 检查功能串联 — 上下游功能/工具之间是否有关联指引，缺失则在文末添加 `:::tip` 关联链接
9. 编写导航卡片 — 根据页面内容确定三角色的推荐度和上手难度
10. 编写学习产出 — 一句话，用"掌握 xxx，能独立 xxx"句式
11. 编写 AI 能力提升 — 从固定标签集中选 1-3 个

## 导航卡片模板

```markdown
:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色 | 推荐度 | 上手难度 |
|------|--------|----------|
| 🛠️ 开发 | ★★★★★ | ★★☆☆☆ |
| 🧪 测试 | ★★★☆☆ | ★★★☆☆ |
| 📦 产品 | ★★☆☆☆ | ★★★★☆ |

**🎯 学习产出：** 掌握 xxx，能独立 xxx

**🚀 AI 能力提升：** xxx
:::
```

---

## 阶段 1：教程区（guide/）— ~50 页

### Task 1.1：教程区菜单审计

**Files:**
- Read: `docs/guide/_meta.json`
- Read: `docs/guide/beginner/_meta.json`
- Read: `docs/guide/intermediate/_meta.json`
- Read: `docs/guide/advanced/_meta.json`
- Read: `docs/guide/learning-path/_meta.json`
- Read: `docs/guide/advanced/sdd/_meta.json`
- Read: `docs/guide/advanced/code-graph/_meta.json`
- Read: `docs/_nav.json`

- [ ] **Step 1：列出所有 guide/ 下的 .md 文件**

命令：列出 `docs/guide/` 下所有 `.md` 文件（排除 `node_modules`），得到文件清单。

- [ ] **Step 2：列出所有 `_meta.json` 中引用的 key**

逐个读取每个 `_meta.json`，提取所有字符串 key（非 `type`/`label` 对象），得到引用清单。

- [ ] **Step 3：交叉对比，生成审计报告**

对比两清单：
- 孤儿文件：文件存在但不在任何 `_meta.json` 中
- 死链：`_meta.json` 中引用的 key 对应文件不存在
- 归属问题：页面所在章节不合理（如本该在 beginner 的内容放到了 advanced）
- 排序问题：页面顺序不符合学习路径
- 标签问题：section-header 标签与实际内容不匹配

- [ ] **Step 4：记录审计发现**

在 `docs/guide/` 下创建临时审计文件（后续任务修复后删除），列出所有发现：

```markdown
# 教程区菜单审计报告

## 孤儿文件
- `path/to/file.md` — 建议：添加到 xxx/_meta.json

## 死链
- `key-name` in `path/to/_meta.json` — 建议：创建文件或删除引用

## 归属问题
- `path/to/file.md` — 当前在 xxx，建议移到 yyy

## 排序问题
- `path/to/_meta.json` — xxx 应在 yyy 之前/之后

## 标签问题
- `path/to/_meta.json` — section-header "xxx" 与实际内容 yyy 不匹配
```

### Task 1.2：审查并修复基础篇（beginner/）— 5 页

**Files:**
- `docs/guide/beginner/what-is-claude-code.md`
- `docs/guide/beginner/installation.md`
- `docs/guide/beginner/first-conversation.md`
- `docs/guide/beginner/file-operations.md`
- `docs/guide/beginner/permissions.md`

- [ ] **Step 1：审查 `what-is-claude-code.md`**

阅读文件，按审查模式 11 项逐项检查并修复，插入导航卡片。

预期导航卡片（参考值，根据实际内容调整）：
```
开发 ★★★★☆ / ★☆☆☆☆
测试 ★★★☆☆ / ★☆☆☆☆
产品 ★★★★★ / ★☆☆☆☆
学习产出：了解 Claude Code 的核心能力和使用场景，能判断是否适合自己
AI 能力提升：上下文管理
```

- [ ] **Step 2：审查 `installation.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 3：审查 `first-conversation.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 4：审查 `file-operations.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 5：审查 `permissions.md`**

阅读文件，11 项检查并修复，插入导航卡片。

### Task 1.3：审查并修复进阶篇（intermediate/）— 7 页

**Files:**
- `docs/guide/intermediate/codebase-navigation.md`
- `docs/guide/intermediate/slash-commands.md`
- `docs/guide/intermediate/claude-md.md`
- `docs/guide/intermediate/claude-md-collection.md`
- `docs/guide/intermediate/git-workflow.md`
- `docs/guide/intermediate/context-management.md`
- `docs/guide/intermediate/improve-ai-accuracy.md`

- [ ] **Step 1：审查 `codebase-navigation.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 2：审查 `slash-commands.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 3：审查 `claude-md.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 4：审查 `claude-md-collection.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 5：审查 `git-workflow.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 6：审查 `context-management.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 7：审查 `improve-ai-accuracy.md`**

阅读文件，11 项检查并修复，插入导航卡片。

### Task 1.4：审查并修复学习路线（learning-path/）— 6 页

**Files:**
- `docs/guide/learning-path/index.md`
- `docs/guide/learning-path/non-programmer.md`
- `docs/guide/learning-path/product.md`
- `docs/guide/learning-path/frontend.md`
- `docs/guide/learning-path/backend.md`
- `docs/guide/learning-path/qa.md`

- [ ] **Step 1：审查 `learning-path/index.md`**

阅读文件，11 项检查并修复。此页作为学习路线入口，需额外确保各角色路径页的链接正确。

- [ ] **Step 2：审查 `non-programmer.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 3：审查 `product.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 4：审查 `frontend.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 5：审查 `backend.md`**

阅读文件，11 项检查并修复，插入导航卡片。

- [ ] **Step 6：审查 `qa.md`**

阅读文件，11 项检查并修复，插入导航卡片。

### Task 1.5：审查并修复高级篇 核心扩展配置（advanced/ 第 1 组）— 8 页

**Files:**
- `docs/guide/advanced/hooks.md`
- `docs/guide/advanced/mcp-servers.md`
- `docs/guide/advanced/artifacts.md`
- `docs/guide/advanced/chrome-devtools-mcp.md`
- `docs/guide/advanced/figma-mcp.md`
- `docs/guide/advanced/cc-switch.md`
- `docs/guide/advanced/ccstatusline.md`
- `docs/guide/quick-start.md`

- [ ] **Step 1-8：逐页审查**

对以上 8 个文件，每个执行：阅读 → 11 项检查并修复 → 插入导航卡片。

`quick-start.md` 特别注意：该页在 `docs/guide/` 根目录，不在任何 `_meta.json` 中。检查是否需要在 `guide/_meta.json` 中添加引用以在侧边栏高亮。

### Task 1.6：审查并修复高级篇 SDD + 结构化工作流 + 代码图谱（advanced/ 第 2 组）— 15 页

**Files:**
- `docs/guide/advanced/sdd/sdd-guide.md`
- `docs/guide/advanced/sdd/openspec.md`
- `docs/guide/advanced/sdd/spec-kit.md`
- `docs/guide/advanced/sdd/openspec-superpowers.md`
- `docs/guide/advanced/sdd/openspec-superpowers-pitfalls.md`
- `docs/guide/advanced/sdd/execution-combinations.md`
- `docs/guide/advanced/superpowers.md`
- `docs/guide/advanced/gstack.md`
- `docs/guide/advanced/comet.md`
- `docs/guide/advanced/code-graph/codegraph.md`
- `docs/guide/advanced/code-graph/code-review-graph.md`
- `docs/guide/advanced/code-graph/graphify.md`
- `docs/guide/advanced/code-graph/gitnexus.md`
- `docs/guide/advanced/code-graph/code-graph-tools.md`

- [ ] **Step 1-14：逐页审查**

对以上 14 个文件，每个执行：阅读 → 11 项检查并修复 → 插入导航卡片。

### Task 1.7：审查并修复高级篇 记忆与上下文 + 多智能体 + 故障排除（advanced/ 第 3 组）— 12 页

**Files:**
- `docs/guide/advanced/claude-mem.md`
- `docs/guide/advanced/context7.md`
- `docs/guide/advanced/serena.md`
- `docs/guide/advanced/headroom.md`
- `docs/guide/advanced/claude-code-obsidian.md`
- `docs/guide/advanced/orca.md`
- `docs/guide/advanced/orca-quickstart.md`
- `docs/guide/advanced/multi-agent.md`
- `docs/guide/advanced/hermes.md`
- `docs/guide/advanced/automation.md`
- `docs/guide/advanced/ralph.md`
- `docs/guide/advanced/agency-agents.md`
- `docs/guide/advanced/ruflo.md`
- `docs/guide/advanced/agents-routing.md`
- `docs/guide/advanced/task-interruption-recovery.md`
- `docs/guide/advanced/workflow-troubleshooting.md`

- [ ] **Step 1-16：逐页审查**

对以上 16 个文件，每个执行：阅读 → 11 项检查并修复 → 插入导航卡片。

### Task 1.8：阶段 1 审计修复 + 构建验证 + 提交

- [ ] **Step 1：按 Task 1.1 审计报告修复菜单问题**

- 孤儿文件：添加到对应的 `_meta.json`
- 死链：修复或删除引用
- 归属问题：移动 `_meta.json` 引用到正确章节
- 排序调整：重排 `_meta.json` 中的顺序
- 标签修正：更新 section-header 标签

- [ ] **Step 2：删除临时审计报告文件**

- [ ] **Step 3：运行 `npm run build`**

预期：零错误、零警告。所有页面可访问。

- [ ] **Step 4：运行 `npm run check`**

预期：lint 和 format check 通过。

- [ ] **Step 5：commit**

```bash
git add docs/guide/
git commit -m "docs(guide): audit menus and full content update for guide section

- Add navigation cards to all ~50 guide pages
- Fix menu consistency (orphan files, dead links, ordering)
- Update content for accuracy and cross-references
- Verify with npm run build"
```

---

## 阶段 2：技巧区（tips/）— ~38 页

### Task 2.1：技巧区菜单审计

**Files:**
- Read: `docs/tips/_meta.json`
- Read: `docs/tips/frontend-practices/_meta.json`
- Read: `docs/tips/java-practices/_meta.json`
- Read: `docs/tips/python-practices/_meta.json`

- [ ] **Step 1：列出 tips/ 下所有 .md 文件 vs `_meta.json` 引用**

交叉对比，生成审计报告（同 Task 1.1 格式），写入临时文件。

### Task 2.2：审查并修复 tips/ 行为模式 + 通用技巧 — 12 页

**Files:**
- `docs/tips/caveman.md`
- `docs/tips/ponytail.md`
- `docs/tips/ecc.md`
- `docs/tips/best-practices.md`
- `docs/tips/mistake-log-skill.md`
- `docs/tips/debugging.md`
- `docs/tips/self-check.md`
- `docs/tips/multi-agent-tips.md`
- `docs/tips/loop-engineering.md`
- `docs/tips/feature-dev.md`
- `docs/tips/claude-code-testing.md`
- `docs/tips/superpowers.md`

- [ ] **Step 1-12：逐页审查**

每个文件：阅读 → 11 项检查并修复 → 插入导航卡片。

### Task 2.3：审查并修复 tips/ 工具集成 + 设计工具 + 前端 + Java + Python（独立页面）— 18 页

**Files:**
- `docs/tips/claude-mem.md`
- `docs/tips/skill-creator.md`
- `docs/tips/codex.md`
- `docs/tips/agent-browser.md`
- `docs/tips/typescript-lsp.md`
- `docs/tips/design-to-code.md`
- `docs/tips/product-toolchain.md`
- `docs/tips/ui-ux-pro-max.md`
- `docs/tips/frontend-design.md`
- `docs/tips/emil-skills.md`
- `docs/tips/ppt-master.md`
- `docs/tips/frontend-best-practices.md`
- `docs/tips/react-best-practices.md`
- `docs/tips/vue-best-practices.md`
- `docs/tips/java-best-practices.md`
- `docs/tips/java-custom-skills.md`
- `docs/tips/python-best-practices.md`
- `docs/tips/index.md`

- [ ] **Step 1-18：逐页审查**

每个文件：阅读 → 11 项检查并修复 → 插入导航卡片。

`index.md` 作为入口页，额外确保各分区链接正确。

### Task 2.4：审查并修复 tips/ 子目录 — 13 页

**Files:**
- `docs/tips/frontend-practices/index.md`
- `docs/tips/frontend-practices/integrated-workflow.md`
- `docs/tips/frontend-practices/scenarios.md`
- `docs/tips/java-practices/index.md`
- `docs/tips/java-practices/lsp-setup.md`
- `docs/tips/java-practices/integrated-workflow.md`
- `docs/tips/java-practices/scenarios.md`
- `docs/tips/java-practices/code-reading.md`
- `docs/tips/python-practices/index.md`
- `docs/tips/python-practices/lsp-setup.md`
- `docs/tips/python-practices/playwright-pom.md`
- `docs/tips/python-practices/api-testing-patterns.md`
- `docs/tips/python-practices/scenarios.md`

- [ ] **Step 1-13：逐页审查**

每个文件：阅读 → 11 项检查并修复 → 插入导航卡片。

### Task 2.5：阶段 2 审计修复 + 构建验证 + 提交

- [ ] **Step 1：按 Task 2.1 审计报告修复菜单问题**

- [ ] **Step 2：删除临时审计报告文件**

- [ ] **Step 3：运行 `npm run build`**

- [ ] **Step 4：运行 `npm run check`**

- [ ] **Step 5：commit**

```bash
git add docs/tips/
git commit -m "docs(tips): audit menus and full content update for tips section

- Add navigation cards to all ~38 tips pages
- Fix menu consistency (orphan files, dead links, ordering)
- Update content for accuracy and cross-references
- Verify with npm run build"
```

---

## 阶段 3：技能区（skills/）— ~16 页

### Task 3.1：技能区菜单审计

**Files:**
- Read: `docs/skills/_meta.json`
- Read: `docs/skills/overview/_meta.json`
- Read: `docs/skills/workflow/_meta.json`
- Read: `docs/skills/docs-context/_meta.json`
- Read: `docs/skills/code-intelligence/_meta.json`
- Read: `docs/skills/frontend/_meta.json`

- [ ] **Step 1：列出 skills/ 下所有 .md 文件 vs `_meta.json` 引用**

交叉对比，生成审计报告。

### Task 3.2：审查并修复 skills/ 全部页面 — 16 页

**Files:**
- `docs/skills/index.md`
- `docs/skills/overview/custom-skills.md`
- `docs/skills/overview/skills-marketplace.md`
- `docs/skills/overview/skill-usage-guidelines.md`
- `docs/skills/workflow/superpowers.md`
- `docs/skills/workflow/gstack.md`
- `docs/skills/workflow/ralph.md`
- `docs/skills/workflow/openspec.md`
- `docs/skills/workflow/comet.md`
- `docs/skills/docs-context/context7.md`
- `docs/skills/docs-context/claude-mem.md`
- `docs/skills/code-intelligence/serena.md`
- `docs/skills/frontend/react.md`
- `docs/skills/frontend/vue.md`
- `docs/skills/frontend/frontend.md`
- `docs/skills/frontend/taste.md`
- `docs/skills/frontend/impeccable.md`

- [ ] **Step 1-17：逐页审查**

每个文件：阅读 → 11 项检查并修复 → 插入导航卡片。

### Task 3.3：阶段 3 审计修复 + 构建验证 + 提交

- [ ] **Step 1：按 Task 3.1 审计报告修复菜单问题**

- [ ] **Step 2：删除临时审计报告文件**

- [ ] **Step 3：运行 `npm run build`**

- [ ] **Step 4：运行 `npm run check`**

- [ ] **Step 5：commit**

```bash
git add docs/skills/
git commit -m "docs(skills): audit menus and full content update for skills section

- Add navigation cards to all ~16 skills pages
- Fix menu consistency (orphan files, dead links, ordering)
- Update content for accuracy and cross-references
- Verify with npm run build"
```

---

## 阶段 4：命令区（commands/）— ~12 页

### Task 4.1：命令区菜单审计

**Files:**
- Read: `docs/commands/_meta.json`
- Read: `docs/commands/impeccable/_meta.json`

- [ ] **Step 1：列出 commands/ 下所有 .md 文件 vs `_meta.json` 引用**

交叉对比，生成审计报告。

### Task 4.2：审查并修复 commands/ 全部页面 — 12 页

**Files:**
- `docs/commands/index.md`
- `docs/commands/slash-commands.md`
- `docs/commands/skill-commands.md`
- `docs/commands/cli-reference.md`
- `docs/commands/env-vars.md`
- `docs/commands/impeccable/index.md`
- `docs/commands/impeccable/create.md`
- `docs/commands/impeccable/evaluate.md`
- `docs/commands/impeccable/refine.md`
- `docs/commands/impeccable/simplify.md`
- `docs/commands/impeccable/harden.md`
- `docs/commands/impeccable/system.md`

- [ ] **Step 1-12：逐页审查**

每个文件：阅读 → 11 项检查并修复 → 插入导航卡片。

### Task 4.3：阶段 4 审计修复 + 构建验证 + 提交

- [ ] **Step 1：按 Task 4.1 审计报告修复菜单问题**

- [ ] **Step 2：删除临时审计报告文件**

- [ ] **Step 3：运行 `npm run build`**

- [ ] **Step 4：运行 `npm run check`**

- [ ] **Step 5：commit**

```bash
git add docs/commands/
git commit -m "docs(commands): audit menus and full content update for commands section

- Add navigation cards to all ~12 commands pages
- Fix menu consistency (orphan files, dead links, ordering)
- Update content for accuracy and cross-references
- Verify with npm run build"
```

---

## 验证清单

所有阶段完成后，做一次全局验证：

- [ ] `npm run build` 零错误
- [ ] `npm run check` 通过
- [ ] `npm run dev` 本地预览，点击所有导航项确认可访问
- [ ] 抽查 10 个页面确认导航卡片正确渲染
- [ ] 确认无遗漏的 .md 文件（再次 run `find docs/ -name "*.md"` 交叉对比全部 `_meta.json`）
