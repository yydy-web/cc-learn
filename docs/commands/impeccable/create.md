---
title: Create 命令
description: Impeccable 的 Create 类命令参考，涵盖 craft、impeccable 和 shape 三个命令的完整用法
---

:::info {title="📊 页面导航"}
**适用角色与上手难度**

| 角色    | 推荐度 | 上手难度 |
| ------- | ------ | -------- |
| 🛠️ 开发 | ★★★★★  | ★★★☆☆    |
| 🧪 测试 | ★★★★☆  | ★★★☆☆    |
| 📦 产品 | ★★☆☆☆  | ★★★★☆    |

**🎯 学习产出：** 掌握 Impeccable 创建阶段，能独立使用 craft、impeccable、shape 从零构建设计组件和页面

**🚀 AI 能力提升：** 代码审查
:::

# Create 命令

Create 类命令用于从零开始构建新功能。它们覆盖了从发现、设计到构建和迭代的完整流程。

## craft

完整的创建流程 — 从发现到构建再到视觉迭代。

### 用法

```bash
/impeccable craft <feature description>
```

### 适用场景

当你需要构建一个新功能并走完完整流程时使用。

### 工作原理

`craft` 执行四个阶段：

1. **Shape（塑形）** — 结构化发现，理解需求和约束
2. **Load references（加载参考）** — 收集相关代码和设计参考
3. **Build（构建）** — 实现功能
4. **Visual iteration（视觉迭代）** — 通过截图对比进行视觉调整

### 示例

```bash
/impeccable craft a pricing page for a developer tool
/impeccable craft a dark mode toggle for the settings page
/impeccable craft an onboarding flow for new users
```

### 注意事项

- 不要用于小改动 — 直接用普通编辑即可
- 不要跳过发现阶段 — 这是后续步骤的基础
- 不要跳过视觉迭代 — 确保最终效果符合预期

---

## impeccable

主命令 — 推荐下一步操作，或用自然语言描述需求。

### 用法

```bash
/impeccable
/impeccable <plain English request>
```

### 适用场景

- 不确定从哪里开始
- 工作跨越多个学科（设计、工程、内容）
- 需要 Claude 推荐最佳下一步

### 工作原理

`impeccable` 读取 `PRODUCT.md` 和 `DESIGN.md` 来理解项目上下文，然后根据当前状态推荐最合适的操作。

### Pin 快捷方式

使用 `pin` 可以将特定功能绑定到快捷命令：

```bash
/impeccable pin critique
```

这样以后输入 `/impeccable` 时会直接执行 critique 功能。

### 示例

```bash
/impeccable                        # 推荐下一步
/impeccable redo this hero section # 用自然语言描述需求
/impeccable pin critique           # 绑定快捷方式
```

### 注意事项

- 不要期望它修复现有代码 — 它专注于发现和规划
- 先运行 `init` 初始化项目 — 需要 `PRODUCT.md` 和 `DESIGN.md`

---

## shape

先思考再构建 — 通过发现过程生成设计简报。

### 用法

```bash
/impeccable shape <feature description>
```

### 适用场景

- 功能即将开始开发
- 需求描述模糊，需要先澄清
- 想在动手前想清楚

### 工作原理

`shape` 执行一个结构化发现访谈，通过一系列问题理解：

- 功能的目标和用户
- 边界和约束
- 设计方向

最终输出一份设计简报（design brief），作为后续构建的指南。

### 示例

```bash
/impeccable shape a daily digest email preferences page
/impeccable shape a file upload component with drag-and-drop
/impeccable shape a team invitation flow
```

### 注意事项

- 不要因为感觉慢而跳过 — 前期思考节省后期返工
- 设计简报是指南而非规格 — 保持灵活性

## 下一步

- [Evaluate 命令](/commands/impeccable/evaluate) — 评估设计质量和一致性
- [Refine 命令](/commands/impeccable/refine) — 优化视觉和交互细节
- [Simplify 命令](/commands/impeccable/simplify) — 简化和澄清设计
- [Harden 命令](/commands/impeccable/harden) — 将功能推向生产就绪状态
- [System 命令](/commands/impeccable/system) — 设计系统级别的自动化支持
