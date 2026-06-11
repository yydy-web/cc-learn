---
title: 技能使用指南
description: 如何正确使用 Skills——基本规则、优先级、常见误区和最佳实践
---

# 技能使用指南

本指南介绍如何正确使用 Claude Code 的 Skills 系统，包括基本规则、优先级、常见误区和最佳实践。

## 基本规则

**黄金法则：如果你认为有 1% 的可能性某个 skill 适用，你必须使用它。**

```text
用户消息 → 检查是否有适用的 skill → 调用 skill → 遵循 skill 的指导
```

### Skill 使用流程

1. **识别任务类型** — 分析用户请求，判断需要什么 skill
2. **调用 Skill 工具** — 使用 Skill 工具加载 skill 内容
3. **创建待办事项** — 如果 skill 有检查清单，创建对应的待办
4. **严格遵循** — 按照 skill 的指导执行，不要跳过步骤

## Skill 优先级

当多个 skills 可能适用时，按以下顺序：

1. **流程类 skills** (brainstorming, debugging) — 决定如何接近任务
2. **实施类 skills** (frontend-design, mcp-builder) — 指导执行

**示例：**

- "让我们构建 X" → 先 brainstorming，然后实施类 skills
- "修复这个 bug" → 先 debugging，然后领域特定 skills

## 常见误区（Red Flags）

| 错误想法              | 实际情况                        |
| --------------------- | ------------------------------- |
| "这只是个简单问题"    | 问题也是任务，需要检查 skills   |
| "我需要更多上下文"    | Skill 检查在澄清问题之前        |
| "让我先探索代码库"    | Skills 告诉你如何探索           |
| "我记得这个 skill"    | Skills 会演进，需要读取最新版本 |
| "这个 skill 太复杂了" | 简单的事情会变复杂，使用它      |

## 核心 Skills 详解

### 1. brainstorming（设计头脑风暴）

**何时使用：** 在任何创造性工作之前 - 创建功能、构建组件、添加功能或修改行为

**目的：** 通过自然对话将想法转化为完整的设计和规格说明

#### 使用流程

1. **理解想法**
   - 检查当前项目状态（文件、文档、最近的提交）
   - 一次问一个问题来细化想法
   - 优先使用多选题，但开放式问题也可以
   - 专注于理解：目的、约束、成功标准

2. **探索方法**
   - 提出 2-3 种不同的方法及其权衡
   - 以对话方式呈现选项，给出推荐和理由
   - 先给出推荐选项并解释原因

3. **呈现设计**
   - 将设计分成 200-300 字的章节
   - 每章后询问是否正确
   - 涵盖：架构、组件、数据流、错误处理、测试

#### 示例对话

```text
用户: "我想创建一个用户登录功能"

AI: [使用 brainstorming skill]
    让我先了解一下你的项目背景...

    问题 1: 你希望使用什么认证方式？
    A) 用户名/密码
    B) 邮箱/密码
    C) OAuth (Google/GitHub)
    D) 多种方式支持

用户: "B) 邮箱/密码"

AI: 问题 2: 是否需要记住登录状态？
    A) 是，使用 session
    B) 是，使用 JWT token
    C) 否，每次都需要登录

用户: "A) 使用 session"

AI: 好的，基于你的选择，我推荐以下设计：

    [设计章节 1: 架构概述]
    ...

    这个设计看起来对吗？
```

#### 输出

设计文档会保存到：`docs/plans/YYYY-MM-DD-<topic>-design.md`

### 2. writing-plans（编写计划）

**何时使用：** 当你有规格说明或需求的多步骤任务时，在接触代码之前

**目的：** 创建详细的实施计划，假设工程师对代码库零上下文

#### 计划结构

每个计划必须包含：

```markdown
# [功能名称] 实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** [一句话描述构建什么]

**Architecture:** [2-3句话关于方法]

**Tech Stack:** [关键技术/库]

---

### Task N: [组件名称]

**Files:**

- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

**Step 1: Write the failing test**
[完整测试代码]

**Step 2: Run test to verify it fails**
[命令和预期输出]

**Step 3: Write minimal implementation**
[最小实现代码]

**Step 4: Run test to verify it passes**
[命令和预期输出]

**Step 5: Commit**
[提交信息]
```

#### 任务粒度

每个步骤应该是**一个动作（2-5分钟）**：

- ✅ "写失败的测试" - 一个步骤
- ✅ "运行它确保失败" - 一个步骤
- ✅ "实现最小代码使测试通过" - 一个步骤
- ❌ "实现登录功能" - 太宽泛，需要分解

### 3. test-driven-development（测试驱动开发）

**何时使用：** 在实现任何功能或 bug 修复时，在编写实现代码之前

**核心原则：** 如果你没有看到测试失败，你不知道它是否测试了正确的东西

#### 铁律

```text
没有失败的测试，就没有生产代码
```

**如果先写了代码？删除它。重新开始。**

#### Red-Green-Refactor 循环

```text
RED (写失败测试) ↓ 验证失败正确 ↓ GREEN (最小实现) ↓ 验证通过 ↓ REFACTOR (清理代码) ↓ 保持绿色 ↓ 下一个功能
```

#### 示例：实现计算器加法功能

**Step 1: RED - 写失败测试**

```python
def test_add_two_numbers():
    calculator = Calculator()
    result = calculator.add(2, 3)
    assert result == 5
```

**Step 2: 验证测试失败**

```bash
pytest tests/test_calculator.py::test_add_two_numbers -v
# Expected: FAIL - Calculator not defined
```

**Step 3: GREEN - 最小实现**

```python
class Calculator:
    def add(self, a, b):
        return 5  # 硬编码，最小实现
```

**Step 4: 验证测试通过**

```bash
pytest tests/test_calculator.py::test_add_two_numbers -v
# Expected: PASS
```

**Step 5: 添加更多测试，然后重构**

```python
def test_add_negative_numbers():
    calculator = Calculator()
    result = calculator.add(-1, -2)
    assert result == -3

# 现在实现真正的逻辑
class Calculator:
    def add(self, a, b):
        return a + b
```

#### 常见错误

❌ **错误：先写实现，后写测试**

```python
# 错误做法
class Calculator:
    def add(self, a, b):
        return a + b

# 然后写测试...
```

✅ **正确：先写测试，后写实现**

```python
# 正确做法
# 1. 先写测试
def test_add():
    assert Calculator().add(2, 3) == 5

# 2. 看到测试失败
# 3. 写最小实现
```

### 4. executing-plans（执行计划）

**何时使用：** 当你有实施计划时，按任务逐个执行

**目的：** 系统化地执行计划，每个任务后进行审查

#### 执行流程

1. **读取计划** — 加载计划文档
2. **逐个任务执行** — 一次一个任务
3. **验证步骤** — 确保每个步骤都完成
4. **检查点** — 在关键点暂停，等待确认
5. **更新计划** — 标记完成的任务

#### 示例执行

```text
计划: docs/plans/2025-01-27-login-feature.md

执行 Task 1: User Model
  ✓ Step 1: 写失败测试
  ✓ Step 2: 验证失败
  ✓ Step 3: 最小实现
  ✓ Step 4: 验证通过
  ✓ Step 5: 提交

[检查点] Task 1 完成，继续 Task 2？

执行 Task 2: Login Route
  ...
```

### 5. systematic-debugging（系统化调试）

**何时使用：** 当遇到 bug 或问题时

**目的：** 通过 4 阶段流程找到根本原因

#### 4 阶段调试流程

1. **重现问题** — 确保可以稳定重现
2. **缩小范围** — 找到最小复现案例
3. **假设和测试** — 提出假设，测试验证
4. **修复和验证** — 修复后确保问题解决

#### 示例：调试登录失败问题

**阶段 1: 重现问题**

```text
问题: 用户无法登录
重现步骤:
1. 访问 /login
2. 输入邮箱和密码
3. 点击登录
4. 看到错误 "Invalid credentials"
```

**阶段 2: 缩小范围**

```text
测试 1: 检查数据库连接
  → 正常

测试 2: 检查用户是否存在
  → 用户存在

测试 3: 检查密码验证
  → 发现问题：密码哈希比较失败
```

**阶段 3: 假设和测试**

```text
假设: 密码哈希算法不匹配
测试: 比较新旧哈希算法
结果: 确认 - 使用了不同的哈希算法
```

**阶段 4: 修复和验证**

```text
修复: 统一使用 bcrypt 哈希算法
验证:
  - 旧密码仍然可以登录（迁移）
  - 新密码使用新算法
  - 测试通过
```

### 6. requesting-code-review（请求代码审查）

**何时使用：** 在任务之间，提交代码之前

**目的：** 确保代码质量，发现潜在问题

#### 审查清单

- 代码符合计划
- 所有测试通过
- 没有明显的 bug
- 代码风格一致
- 没有安全漏洞
- 性能可接受

#### 审查报告格式

```markdown
## Code Review: [功能名称]

### ✅ 通过项

- 所有测试通过
- 代码符合计划
- 没有语法错误

### ⚠️ 建议改进

- 函数过长，建议拆分
- 缺少错误处理

### 🚨 阻塞问题

- 安全漏洞：SQL 注入风险
- 必须修复后才能合并
```

### 7. using-git-worktrees（使用 Git 工作树）

**何时使用：** 设计批准后，开始实施之前

**目的：** 创建隔离的工作空间，不影响主分支

#### 工作流程

1. **创建 worktree** — 在新分支上创建独立目录
2. **运行项目设置** — 安装依赖，构建项目
3. **验证基线** — 运行测试确保干净基线
4. **报告位置** — 告知 worktree 位置

#### 示例

```bash
# AI 自动执行
git worktree add .worktrees/feature-login -b feature/login
cd .worktrees/feature-login
npm install
npm test  # 验证基线测试通过

# 报告
Worktree ready at .worktrees/feature-login
Tests passing (42 tests, 0 failures)
Ready to implement login feature
```

## 实际场景示例

### 场景 1: 创建新功能

**用户请求：** "我想添加一个评论功能到博客系统"

#### Step 1: Brainstorming

```text
AI: [使用 brainstorming skill]
    让我先了解一下你的需求...

    问题 1: 评论是否需要审核？
    A) 是，需要管理员审核
    B) 否，直接显示
    C) 仅首次评论需要审核

    问题 2: 评论支持什么功能？
    A) 纯文本
    B) Markdown 格式
    C) 回复其他评论（嵌套）

    ...
```

#### Step 2: Writing Plans

```text
AI: [使用 writing-plans skill]

    基于设计，创建实施计划：

    # 评论功能实施计划

    **Goal:** 为博客系统添加评论功能，支持嵌套回复和审核

    **Architecture:**
    - 使用数据库存储评论
    - RESTful API 处理评论 CRUD
    - 前端组件显示评论树

    **Tech Stack:**
    - Backend: Node.js + Express
    - Database: PostgreSQL
    - Frontend: React

    ### Task 1: Comment Model
    ...
```

#### Step 3: Executing Plans

```text
AI: [使用 executing-plans skill]

    开始执行计划...

    Task 1: Comment Model
      Step 1: 写失败测试 ✓
      Step 2: 验证失败 ✓
      Step 3: 最小实现 ✓
      Step 4: 验证通过 ✓
      Step 5: 提交 ✓

    [检查点] Task 1 完成，继续？
```

#### Step 4: Code Review

```text
AI: [使用 requesting-code-review skill]

    ## Code Review: 评论功能

    ### ✅ 通过项
    - 所有测试通过
    - 代码符合计划

    ### ⚠️ 建议改进
    - 添加输入验证
    - 优化数据库查询
```

### 场景 2: 修复 Bug

**用户报告：** "用户登录后，会话立即过期"

#### Step 1: Systematic Debugging

```text
AI: [使用 systematic-debugging skill]

    阶段 1: 重现问题
    - 登录系统
    - 检查会话状态
    - 确认问题：会话在 1 秒后过期

    阶段 2: 缩小范围
    - 检查会话配置
    - 检查服务器时间
    - 发现问题：会话过期时间设置为 1 秒（应该是 3600 秒）

    阶段 3: 假设和测试
    假设: 配置错误
    测试: 检查配置文件
    结果: 确认 - session.maxAge 设置为 1

    阶段 4: 修复和验证
    修复: 将 maxAge 改为 3600000
    验证: 登录后会话持续 1 小时
```

#### Step 2: Test-Driven Development

```text
AI: [使用 test-driven-development skill]

    Step 1: RED - 写失败测试
    def test_session_expires_after_one_hour():
        user = login_user()
        assert session_valid(user)
        # 等待 1 小时...
        # 实际上测试配置
        assert session.maxAge == 3600000

    Step 2: 验证失败
    Step 3: GREEN - 修复配置
    Step 4: 验证通过
```

### 场景 3: 重构代码

**用户请求：** "重构这个巨大的函数，它太长了"

#### Step 1: Brainstorming

```text
AI: [使用 brainstorming skill]

    让我先分析这个函数...

    问题: 你希望如何拆分？
    A) 按功能拆分（验证、处理、响应）
    B) 按数据流拆分（输入、转换、输出）
    C) 提取为类方法

    ...
```

#### Step 2: Writing Plans

```text
AI: [使用 writing-plans skill]

    # 重构大型函数实施计划

    ### Task 1: 提取验证逻辑
    ### Task 2: 提取处理逻辑
    ### Task 3: 提取响应逻辑
    ### Task 4: 重构主函数
    ### Task 5: 更新测试
```

#### Step 3: Test-Driven Refactoring

```text
AI: [使用 test-driven-development skill]

    重要：重构前确保有完整测试覆盖！

    Step 1: 确保现有测试通过
    Step 2: 提取函数（不改变行为）
    Step 3: 运行测试确保仍然通过
    Step 4: 继续提取下一个函数
    ...
```

## 最佳实践

### 1. 始终遵循技能流程

❌ **错误：** "这个任务太简单，跳过 brainstorming"  
✅ **正确：** 即使简单任务也使用相应的 skill

### 2. 不要跳过测试

❌ **错误：** "先写代码，测试后面补"  
✅ **正确：** 先写测试，看到失败，再写代码

### 3. 任务粒度要小

❌ **错误：** "实现整个登录功能"  
✅ **正确：** "写用户模型的失败测试" → "实现用户模型" → "写登录路由的失败测试" → ...

### 4. 频繁提交

✅ 每个小任务完成后立即提交  
✅ 提交信息清晰描述做了什么  
✅ 保持提交历史干净

### 5. 使用检查点

✅ 在关键里程碑暂停  
✅ 等待用户确认再继续  
✅ 及时发现问题

### 6. 文档化设计

✅ 设计文档保存到 `docs/plans/`  
✅ 计划文档保存到 `docs/plans/`  
✅ 提交到版本控制

## 技能组合使用示例

### 完整开发流程

```text
1. brainstorming
   ↓
2. using-git-worktrees
   ↓
3. writing-plans
   ↓
4. executing-plans
   ├─ test-driven-development (每个任务)
   ├─ requesting-code-review (任务之间)
   └─ systematic-debugging (如遇问题)
   ↓
5. finishing-a-development-branch
```

### 调试流程

```text
1. systematic-debugging
   ↓
2. test-driven-development (写回归测试)
   ↓
3. verification-before-completion
```

## 快速参考表

### 技能选择指南

| 任务类型   | 使用的 Skills                                                             | 顺序     |
| ---------- | ------------------------------------------------------------------------- | -------- |
| 创建新功能 | brainstorming → writing-plans → executing-plans → test-driven-development | 1-4      |
| 修复 Bug   | systematic-debugging → test-driven-development                            | 1-2      |
| 重构代码   | brainstorming → writing-plans → test-driven-development                   | 1-3      |
| 代码审查   | requesting-code-review                                                    | 1        |
| 并行开发   | using-git-worktrees → (其他 skills) → finishing-a-development-branch      | 1-N-最后 |

### 技能触发条件

| Skill                          | 何时自动触发                           |
| ------------------------------ | -------------------------------------- |
| brainstorming                  | 创建功能、构建组件、添加功能、修改行为 |
| writing-plans                  | 有规格说明的多步骤任务                 |
| executing-plans                | 有实施计划时                           |
| test-driven-development        | 实现功能、修复 bug、重构               |
| systematic-debugging           | 遇到 bug 或问题时                      |
| requesting-code-review         | 任务之间、提交之前                     |
| using-git-worktrees            | 设计批准后，开始实施前                 |
| finishing-a-development-branch | 所有任务完成后                         |

## 常见问题 (FAQ)

### Q: 如果我不确定使用哪个 skill 怎么办？

A: 使用 `using-superpowers` skill，它会帮助你识别合适的 skill。或者，如果你认为有 1% 的可能性某个 skill 适用，就直接使用它。

### Q: 可以跳过某个 skill 的步骤吗？

A: 对于**严格类** skills (TDD, debugging)，不能跳过。对于**灵活类** skills (patterns)，可以适应上下文，但 skill 本身会告诉你。

### Q: 如果 skill 的指导不适合我的情况怎么办？

A: 先尝试遵循 skill 的指导。如果确实不适合，skill 会告诉你如何处理。不要在没有尝试之前就跳过。

### Q: 如何知道 skill 是否更新了？

A: Skills 会持续演进。即使你"记得"某个 skill，也应该在使用时重新读取最新版本。

### Q: 多个 skills 可以同时使用吗？

A: 可以组合使用，但要注意优先级：流程类 skills 优先于实施类 skills。

## 参考资源

- [Superpowers 插件](/guide/advanced/superpowers) — 七步工作流详解
- [OpenSpec 规格驱动开发](/guide/advanced/sdd/openspec) — 规格驱动开发
- [Superpowers 技能生态](/skills/workflow/superpowers) — 14 个 Skills 概览
- [OpenSpec 技能生态](/skills/workflow/openspec) — 规格驱动开发技能
