---
name: mistake-log
description: 自动收集和复习过往错误——每次纠正后记录，下次类似任务前检查，避免重复踩坑
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
```

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
