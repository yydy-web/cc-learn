---
title: 错误自愈 Skill — 让 AI 不犯同样的错
description: 创建一个自动收集错误、避免重复踩坑的 Skill——每次人工纠正后生成备忘录，下次对话自动读取，持续提升 AI 输出质量
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★☆☆☆    |
| 🧪 测试 | ★★★★☆  | ★★☆☆☆    |
| 📦 产品 | ★★★☆☆  | ★★★☆☆    |

**🎯 学习产出：** 掌握错误日志记录技巧，能独立搭建 AI 错误自愈闭环系统，让 Claude Code 持续进化

**🚀 AI 能力提升：** 调试诊断、技能扩展
:::

# 错误自愈 Skill

AI 会犯错误，但同一个错误犯两次就是浪费。这个 Skill 实现了一个**错误学习闭环**：纠正 → 记录 → 复习 → 避免。

## 效果演示

```
你：这个 API 返回格式不对，应该是 { code, data, message } 不是 { success, result }
AI：已修正。记录到备忘录：API 响应格式用 { code, data, message }。

---三天后，新对话---

你：加一个获取用户列表的端点
AI：<读取备忘录> 上次你纠正过：API 响应格式用 { code, data, message }
    已按此格式生成。✓
```

## 如何工作

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ 犯错     │────▶│ 你纠正   │────▶│ 自动记录 │
└──────────┘     └──────────┘     └──────────┘
                                       │
┌──────────┐     ┌──────────┐          │
│ 下次避免 │◀────│ 查备忘录 │◀─────────┘
└──────────┘     └──────────┘
```

## 安装

### 方式一：直接创建 Skill 文件（推荐）

在项目根目录创建 `.agents/skills/mistake-log/SKILL.md`：

```bash
mkdir -p .agents/skills/mistake-log
```

然后把下面的 Skill 内容复制进去。

### 方式二：一行命令

````bash
mkdir -p .agents/skills/mistake-log && cat > .agents/skills/mistake-log/SKILL.md << 'SKILL_EOF'
---
name: mistake-log
description: 自动收集和复习过往错误——每次纠正后记录，下次类似任务前检查，避免重复踩坑
trigger: after manual correction, before starting new work
---

# 错误自愈备忘录

## 核心理念

你是一个会自我进化的 AI 助手。每次用户纠正你的错误时，把这个教训记下来。下次做类似的事情时，先查备忘录——别再犯同样的错。

## 什么时候记录

以下情况**必须**追加一条备忘录：

1. **用户纠正了你的输出格式**（API 格式、命名风格、文件路径等）
2. **用户说"不对，应该是..."或"不是这样"**
3. **用户手动改了你生成的代码**，说明你生成的版本有问题
4. **你引入了一个 Bug**，用户指出后你才修复
5. **用户说"我之前告诉过你..."** —— 说明你忘了之前的约定

## 备忘录格式

每条记录放在 `.claude/mistakes/` 目录下，一个错误一个文件：

```markdown
---
category: api-format | naming | architecture | dependency | style | bug
severity: high | medium | low
date: YYYY-MM-DD
context: 当时在做什么任务
---

# 错误标题（一句话）

## 错误
我做了什么/输出了什么。

## 纠正
用户告诉我应该怎么做。

## 规则
下次遇到类似场景时，应该遵守的规则。

## 适用场景
什么时候需要检查这条规则。
````

## 什么时候检查

**每次开始新任务前**，快速扫描 `.claude/mistakes/` 目录：

1. 读目录列表，找 `category` 和当前任务相关的备忘录
2. 读 `severity: high` 的全部备忘录（这些是反复犯的错）
3. 在回复的开头列出本次要注意的规则

示例：

```
本次任务涉及 API 开发。从备忘录中检出 3 条相关规则：
1. API 响应格式：{ code, data, message }
2. 数据库字段用 snake_case
3. 异常统一用 AppError 抛出
我将严格遵守。
```

## 什么时候升级到 CLAUDE.md

当一条规则被触发达 **3 次以上**，说明它应该进 CLAUDE.md 成为永久约定。此时：

1. 告诉用户："这条规则已触发 3 次，建议加入 CLAUDE.md"
2. 把规则写入 CLAUDE.md 的对应章节
3. 在备忘录文件里标记 `migrated: true`

## 示例对话

用户：这个接口返回的不是 { code, data, message } 格式，改成统一的

AI：已修正。同时追加备忘录：
`.claude/mistakes/api-response-format.md`
下次 API 开发会自动检查此规则。

---下次对话---

用户：加一个删除用户的接口

AI：<扫描备忘录 → 检出 api-response-format.md>
将使用统一格式 { code, data, message }。
代码如下...
SKILL_EOF

```

把以上内容保存为文件即可。

## 手动测试

装好后，跟 Claude Code 说：

```

请检查你的 .claude/mistakes/ 目录。如果为空，说明还没有备忘录。
我们来创建第一条：记住，我的项目 API 响应格式统一用 { code, data, message }。

```

然后开一个新对话，问它：

```

帮我生成一个获取用户列表的 API 端点。

````

如果它自动用了 `{ code, data, message }` 格式——Skill 生效了。

---

## Skill 内容（完整复制版）

如果你不想手动创建目录，直接复制下面内容保存到 `.agents/skills/mistake-log/SKILL.md`：

<details>
<summary>点击展开完整 SKILL.md 内容</summary>

```markdown
---
name: mistake-log
description: 自动收集和复习过往错误——每次纠正后记录，下次类似任务前检查，避免重复踩坑
trigger: after manual correction, before starting new work
---

# 错误自愈备忘录

## 核心理念

你是一个会自我进化的 AI 助手。每次用户纠正你的错误时，把这个教训记下来。下次做类似的事情时，先查备忘录——别再犯同样的错。

## 什么时候记录

以下情况**必须**追加一条备忘录：

1. **用户纠正了你的输出格式**（API 格式、命名风格、文件路径等）
2. **用户说"不对，应该是..."或"不是这样"**
3. **用户手动改了你生成的代码**，说明你生成的版本有问题
4. **你引入了一个 Bug**，用户指出后你才修复
5. **用户说"我之前告诉过你..."** —— 说明你忘了之前的约定

## 备忘录格式

每条记录放在 `.claude/mistakes/` 目录下，一个错误一个文件：

```markdown
---
category: api-format | naming | architecture | dependency | style | bug
severity: high | medium | low
date: YYYY-MM-DD
context: 当时在做什么任务
---

# 错误标题（一句话）

## 错误
我做了什么/输出了什么。

## 纠正
用户告诉我应该怎么做。

## 规则
下次遇到类似场景时，应该遵守的规则。

## 适用场景
什么时候需要检查这条规则。
````

## 什么时候检查

**每次开始新任务前**，快速扫描 `.claude/mistakes/` 目录：

1. 读目录列表，找 `category` 和当前任务相关的备忘录
2. 读 `severity: high` 的全部备忘录（这些是反复犯的错）
3. 在回复的开头列出本次要注意的规则

示例：

```
本次任务涉及 API 开发。从备忘录中检出 3 条相关规则：
1. API 响应格式：{ code, data, message }
2. 数据库字段用 snake_case
3. 异常统一用 AppError 抛出
我将严格遵守。
```

## 什么时候升级到 CLAUDE.md

当一条规则被触发达 **3 次以上**，说明它应该进 CLAUDE.md 成为永久约定。此时：

1. 告诉用户："这条规则已触发 3 次，建议加入 CLAUDE.md"
2. 把规则写入 CLAUDE.md 的对应章节
3. 在备忘录文件里标记 `migrated: true`

## 示例对话

用户：这个接口返回的不是 { code, data, message } 格式，改成统一的

AI：已修正。同时追加备忘录：
`.claude/mistakes/api-response-format.md`
下次 API 开发会自动检查此规则。

---下次对话---

用户：加一个删除用户的接口

AI：<扫描备忘录 → 检出 api-response-format.md>
将使用统一格式 { code, data, message }。
代码如下...

````
</details>

---

## 和 Claude-Mem 的区别

| 维度 | 错误自愈 Skill | Claude-Mem |
|------|---------------|------------|
| 关注点 | **错误和纠正** | 所有上下文 |
| 触发方式 | 每次纠正后自动记录 | 自动 / 手动触发 |
| 存储位置 | `.claude/mistakes/` | `~/.claude/projects/*/memory/` |
| 复习时机 | 每次新任务前主动扫 | 对话开始时注入 |
| 升级机制 | 3 次触发 → CLAUDE.md | 无 |

**两者不冲突，可以同时用**。错误自愈关注"不该做什么"，Claude-Mem 关注"应该知道什么"。

---

## 进阶：结合 CLAUDE.md

当错误自愈运行一段时间后，你会积累一批备忘录。把 `severity: high` 且触发 3 次以上的规则整理进 CLAUDE.md：

```markdown
# CLAUDE.md

## 从错误中总结的规则（由 mistake-log Skill 自动维护）

- API 响应格式：`{ code, data, message }`（已触发 4 次）
- 数据库字段用 snake_case，接口字段用 camelCase（已触发 3 次）
- 不要引入新依赖，优先用已有工具（已触发 5 次）
````

这样即使不开 mistake-log Skill，CLAUDE.md 本身也会兜底。

---

## 实战：第一周使用流程

**Day 1** — 安装 Skill，跟 Claude Code 说：

```
从现在开始，每次我纠正你的错误时，自动记录到 .claude/mistakes/ 目录。
每个错误一个文件，格式按照 mistake-log Skill 的规定。
```

**Day 2-5** — 正常使用，你会看到：

- 每次纠正后 AI 追加一个 `.md` 文件
- 新任务开始时 AI 列出相关备忘录
- 重复的错误越来越少

**Day 6** — 检查收益：

```bash
ls .claude/mistakes/ | wc -l   # 看看积累了多少条
```

挑出 3 次以上的规则，让 AI 把它们写入 CLAUDE.md。

**Week 2+** — CLAUDE.md 兜底，新对话自动遵守；备忘录继续积累边缘 case。

---

## 相关资源

- [自定义技能](/skills/overview/custom-skills) — 从零写 Skill 的完整指南
- [Claude-Mem](/guide/advanced/claude-mem) — 自动持久记忆系统
- [CLAUDE.md 与项目约定](/guide/intermediate/claude-md) — 把高频错误升级为永久规则
- [提高 AI 准确率](/guide/intermediate/improve-ai-accuracy) — 从源头减少错误

:::tip 功能串联
错误自愈 Skill 的关注点是**错误预防**——让 AI 从历史错误中学习。和 [Claude-Mem](/guide/advanced/claude-mem)（泛化记忆）互补：错误自愈记录"不该做什么"，Claude-Mem 记录"应该知道什么"。高频错误（触发 3 次以上）应升级到 [CLAUDE.md](/guide/intermediate/claude-md) 成为项目永久约定。
:::
